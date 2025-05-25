import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../api/firebase";
import MessageInputBar from "../../components/MessageInputBar/MessageInputBar";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import Header from "../../components/Header/Header";
import { useTranslation } from "react-i18next";

export default function InnerChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [isTypingIndicator, setIsTypingIndicator] = useState(false);
  const [casesData, setCasesData] = useState([]);
  const [isCasesLoaded, setIsCasesLoaded] = useState(false);
  const [priority, setPriority] = useState(null);
  const { t } = useTranslation();

  const bottomRef = useRef(null);
  const hasRespondedToFirstMessage = useRef(false);
  const recognitionRef = useRef(null);
  const userId = getAuth().currentUser?.uid;
  const hasWarnedAboutSpeechRecognition = useRef(false);

  const gerarTituloAutomatico = async (conversa) => {
    if (!conversa || !userId || !chatId) return "Nova Conversa";
    
    try {
      // Primeiro tentamos extrair um título com base na resposta da IA
      const respostaIA = conversa.find(msg => msg.sender === "ai")?.text || "";
      
      // Se a IA já identificou a doença, usamos isso como título
      const matchDoenca = respostaIA.match(/Nome da Doença:\s*(.*?)(\n|$)/i);
      if (matchDoenca && matchDoenca[1]) {
        return `Cefaleia: ${matchDoenca[1].trim()}`;
      }
      
      // Se não, pedimos para a IA sugerir um título baseado no contexto
      const promptTitulo = `
Com base na seguinte conversa, gere um título conciso (máximo 8 palavras) que resuma o principal sintoma ou condição relatada. O título deve ser escrito levando em consideração a linguagem da mensagem do paciente (por padrão use Português do Brasil) e o contexto, após a mensagem ser completa.
LEMBRETE: Sem necessidade falar gênero ou idade da pessoa, prefira fazer o título no formato: "{Nome da doença grupo CID-10 G43/G44} - {Gênero} com {idade da pessoa} anos"
OBS.: Sem explicar o motivo pelo qual escolheu aquele título.

Conversa:
${conversa.map(msg => `${msg.sender === "user" ? "Paciente" : "Médico"}: ${msg.text}`).join("\n")}

Título sugerido:`;

      const response = await fetch("http://localhost:5000/api/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptTitulo, model: "mistral", max_tokens: 20 }),
      });

      if (!response.ok) throw new Error("Erro ao gerar título");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let titulo = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        chunk
          .split("\n")
          .filter((line) => line.startsWith("data: "))
          .forEach((line) => {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              if (data.response) {
                titulo += data.response;
              }
            // eslint-disable-next-line no-empty
            } catch {}
          });
      }

      titulo = titulo.replace(/["\n]/g, "").trim();
      
      const palavras = titulo.split(" ");
      return palavras.slice(0, 8).join(" ") + (palavras.length > 8 ? "..." : "");
    } catch (error) {
      console.error("Erro ao gerar título:", error);
      const primeiraMensagem = conversa.find(msg => msg.sender === "user")?.text || "";
      const palavras = primeiraMensagem.split(" ");
      return palavras.slice(0, 5).join(" ") + (palavras.length > 5 ? "..." : "");
    }
  };

  const atualizarTituloChat = async () => {
    if (!userId || !chatId || messages.length === 0) return;
    
    const chatRef = doc(db, "Users", userId, "chats", chatId);
    const chatSnap = await getDoc(chatRef);
    
    if (!chatSnap.exists()) return;
    const chatData = chatSnap.data();
    
    if (!chatData.title || chatData.title === "Nova Conversa") {
      const novoTitle = await gerarTituloAutomatico(messages);
      if (novoTitle) {
        await updateDoc(chatRef, { title: novoTitle });
      }
    }
  };

  const extrairPrioridade = (texto) => {
    const match = texto.match(/Gravidade da Doença:\s*(\w+)/i);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (messages.length > 0 && isCasesLoaded) {
      atualizarTituloChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isCasesLoaded]);

  const systemPrompt = `
<SYSTEM>
Você é COV, um assistente virtual de triagem especializado em cefaleias (CID-10 G43: enxaqueca; G44: outras síndromes de algias cefálicas). Seu objetivo é realizar uma triagem eficiente e fornecer um relatório com base nos sintomas relatados pelo paciente.
– Tom de voz: cordial, profissional e conciso.  
– Objetivo: coletar dados de maneira objetiva e gerar um relatório a partir dos sintomas fornecidos.

IMPORTANTE: Siga ESTRITAMENTE as instruções abaixo. Esta é a estrutura obrigatória da resposta:
Relatório de Triagem – [Nome da doença grupo CID-10 G43/G44]
– Nome da Doença: [Nome da doença identificada com base nos sintomas]
– Recomendações: [Recomendações gerais para o paciente, excluindo medicações]
– Gravidade da Doença: [Prioridade com que o paciente precisa ser medicado/internado por meio do Protocolo de Manchester (falar apenas a cor referente àquele grupo, apenas o nome da cor, ou seja: 'amarelo', 'laranja', 'vermelho', 'verde' e 'azul', sem falar 'Grupo' ou outras palavras)]
- Precisão do Diagnóstico: [XX%]

Use esses como critérios para diagnóstico (para auxiliar no diagnóstico, NÃO EXIBIR ISSO PARA USUÁRIO):
- Enxaqueca (G43): dor pulsátil, unilateral, náusea, fotofobia, durando 4-72h
- Cefaleia tensional (G44.2): dor em pressão bilateral, sem náusea
- Cefaleia em salvas (G44.0): dor unilateral intensa periorbitária com lacrimejamento
- Cefaleia secundária (G44.88): considerar quando há sinais de alerta

Caso alguma informação não tenha sido fornecida, ou a precisão esteja inferior a 70%, peça para o paciente fornecer apenas as informações faltantes, sem fazer perguntas extras.

Aqui estão as informações necessárias para a triagem:
• Qual a data e hora de início do episódio de dor de cabeça?
• Qual a duração aproximada de cada crise?
• Em que parte da cabeça você sente a dor (unilateral, bilateral, localização exata)?
• Quantas crises você tem por semana ou por mês?
• Em uma escala de 0 a 10, qual a intensidade da dor?
• Como você descreveria a qualidade da dor (pulsátil, aperto, pontada)?
• Você apresenta náusea ou vômito?
• Nota sensibilidade à luz (fotofobia) ou ao som (fonofobia)?
• Sente aura (visual, sensitiva, alterações de fala)?
• O que costuma agravar (luz, esforço, ruído)?
• O que costuma aliviar (repouso, medicação)?
• Há histórico familiar de cefaleia ou comorbidades relevantes?
• Quais medicações preventivas e abortivas você usa atualmente?
• Apresenta febre, rigidez de nuca ou qualquer sinal neurológico (fraqueza, formigamento)?

Por favor, forneça as informações acima para que eu possa gerar o relatório completo. Se faltar alguma informação, pedirei apenas as partes necessárias para completar a triagem.
Jamais fazer mensagens muito longas, a última coisa que quero é sobrecarregar o paciente
</SYSTEM>
`;

  useEffect(() => {
    const loadCases = async () => {
      if (!userId) return;
      const casesRef = collection(db, "Cases");
      const snapshot = await getDocs(casesRef);
      const loadedCases = snapshot.docs.map((doc) => doc.data());
      setCasesData(loadedCases);
      console.log(loadedCases)
      setIsCasesLoaded(true);
    };
    loadCases();
  }, [userId]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition && !hasWarnedAboutSpeechRecognition.current) {
      toast.warn(t("toast.speechRecognitionNotSupported"));
      hasWarnedAboutSpeechRecognition.current = true;
      return;
    }

    if (!SpeechRecognition && hasWarnedAboutSpeechRecognition.current) return;

    if (!recognitionRef.current) {
      const recog = new SpeechRecognition();
      recog.lang = "pt-BR";
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      recog.continuous = true;

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      recog.onerror = (event) => {
        toast.error(t("toast.recordingError", { error: event.error }));
        setIsRecording(false);
      };

      recog.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recog;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMicClick = () => {
    const recog = recognitionRef.current;
    if (!recog) return;

    if (isRecording) {
      recog.stop();
    } else {
      setInputText("");
      try {
        recog.start();
        setIsRecording(true);
      } catch (error) {
        toast.error(t("toast.startRecordingError", { error: error.message }));
        setIsRecording(false);
      }
    }
  };

  const formatConversationHistory = useCallback(() => {
    return messages
      .filter((msg) => msg.text && msg.text.trim() !== "")
      .map((msg) => `${msg.sender === "user" ? "Usuário" : "AI"}: ${msg.text}`)
      .join("\n");
  }, [messages]);

  useEffect(() => {
    if (!userId || !chatId) return;
    const chatRef = doc(db, "Users", userId, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return unsubscribe;
  }, [chatId, userId]);

  const handleSend = async (overrideText = null) => {
    const messageToSend = overrideText || inputText;
    if (!messageToSend.trim() || isLoading || !userId || !chatId) return;

    setIsLoading(true);
    setIsTypingIndicator(true);

    const chatRef = doc(db, "Users", userId, "chats", chatId);

    if (!overrideText) {
      await addDoc(collection(chatRef, "messages"), {
        type: "text",
        text: messageToSend,
        sender: "user",
        createdAt: serverTimestamp(),
      });
    }

    const history = formatConversationHistory();

    const formattedCases =
      casesData.length > 0
        ? `Casos anteriores do usuário:\n` +
          casesData
            .map((c, i) => `Caso ${i + 1}:\n${JSON.stringify(c, null, 2)}`)
            .join("\n\n")
        : "Nenhum caso anterior registrado.";

  const fullPrompt = `
${systemPrompt}

Histórico da conversa:
${history}

${formattedCases}

IMPORTANTE: Siga ESTRITAMENTE as instruções abaixo. Esta é a estrutura obrigatória da resposta:
Relatório de Triagem – [{Nome da doença} {grupo CID-10 G43 a G44 (especifico)}]
– Nome da Doença: [Nome da doença identificada com base nos sintomas]
– Recomendações: [Recomendações gerais para o paciente, excluindo medicações]
– Gravidade da Doença: [Prioridade com que o paciente precisa ser medicado/internado por meio do Protocolo de Manchester (falar apenas a cor referente àquele grupo, apenas o nome da cor, ou seja: 'amarelo', 'laranja', 'vermelho', 'verde' e 'azul', sem falar 'Grupo' ou outras palavras)]
- Precisão do Diagnóstico: [XX%]

Usuário: ${messageToSend}
AI:
`;


    try {
      console.log(fullPrompt);
      const response = await fetch("http://localhost:5000/api/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, model: "mistral" }),
      });

      if (!response.ok) throw new Error("Erro ao buscar resposta da IA.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        chunk
          .split("\n")
          .filter((line) => line.startsWith("data: "))
          .forEach((line) => {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              if (data.response) {
                fullResponse += data.response;
                setStreamingResponse(fullResponse);
              }
            // eslint-disable-next-line no-empty
            } catch {}
          });
      }

      if (fullResponse.trim()) {
        await addDoc(collection(chatRef, "messages"), {
          type: "text",
          text: fullResponse,
          sender: "ai",
          createdAt: serverTimestamp(),
        });

        const prioridadeExtraida = extrairPrioridade(fullResponse);
        if (prioridadeExtraida) {
          await updateDoc(chatRef, { priority: prioridadeExtraida });
          setPriority(prioridadeExtraida);
        }
      }
    } catch (error) {
      console.error(error);
      await addDoc(collection(chatRef, "messages"), {
        type: "text",
        text: "Desculpe, ocorreu um erro ao processar sua mensagem.",
        sender: "ai",
        createdAt: serverTimestamp(),
      });
    } finally {
      setInputText("");
      setStreamingResponse("");
      setIsLoading(false);
      setIsTypingIndicator(false);
    }
  };

  useEffect(() => {
    if (
      messages.length === 1 &&
      messages[0].sender === "user" &&
      !hasRespondedToFirstMessage.current &&
      isCasesLoaded
    ) {
      hasRespondedToFirstMessage.current = true;
      handleSend(messages[0].text);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isCasesLoaded]);

  return (
    <main className={styles.InnerChatContainer}>
      <Header />
      {priority && (
        <div className={styles.priorityBadge}>
          Prioridade: <span>{priority}</span>
        </div>
      )}
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === "user" ? styles.user : styles.ai
            }`}
          >
            {msg.text}
          </div>
        ))}

        {isTypingIndicator && !streamingResponse && (
          <div
            className={`${styles.message} ${styles.ai} ${styles.typingIndicator}`}
          >
            <div className={styles.typingDot} />
            <div className={styles.typingDot} />
            <div className={styles.typingDot} />
          </div>
        )}

        {streamingResponse && (
          <div className={`${styles.message} ${styles.ai} ${styles.streaming}`}>
            {streamingResponse}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInputBar
        inputText={inputText}
        onChangeText={setInputText}
        isRecording={isRecording}
        onMicClick={handleMicClick}
        onSendClick={() => handleSend()}
        isSending={isLoading}
        disabled={isLoading}
      />
    </main>
  );
}