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

  const bottomRef = useRef(null);
  const hasRespondedToFirstMessage = useRef(false);
  const recognitionRef = useRef(null);
  const userId = getAuth().currentUser?.uid;
  const hasWarnedAboutSpeechRecognition = useRef(false);

  const gerarTituloChat = (texto) => {
    const textoLower = texto.toLowerCase();

    const padroes = [
      { palavra: "enxaqueca", titulo: "Enxaqueca" },
      { palavra: "dor de cabeça", titulo: "Dor de Cabeça Intensa" },
      { palavra: "um lado", titulo: "Dor Lateral" },
      { palavra: "náusea", titulo: "Com Náusea" },
      { palavra: "vômito", titulo: "Com Vômito" },
      { palavra: "intensa", titulo: "Dor Intensa" },
      { palavra: "homem", titulo: "Homem com Dor" },
      { palavra: "mulher", titulo: "Mulher com Dor" },
    ];

    for (const { palavra, titulo } of padroes) {
      if (textoLower.includes(palavra)) {
        return titulo;
      }
    }

    const palavras = texto.split(" ");
    return palavras.slice(0, 8).join(" ") + (palavras.length > 8 ? "..." : "");
  };

  const salvarTituloChat = async (mensagem) => {
    if (!userId || !chatId) return;
    const chatRef = doc(db, "Users", userId, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) return;
    const chatData = chatSnap.data();

    if (!chatData.title) {
      const tituloGerado = gerarTituloChat(mensagem);
      await updateDoc(chatRef, { title: tituloGerado });
    }
  };

  useEffect(() => {
    if (
      messages.length === 1 &&
      messages[0].sender === "user" &&
      isCasesLoaded
    ) {
      salvarTituloChat(messages[0].text);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isCasesLoaded]);

  const systemPrompt = `
<SYSTEM>
Você é COV, um assistente virtual de triagem especializado em cefaleias (CID-10 G43: enxaqueca; G44: outras síndromes de algias cefálicas). Seu objetivo é realizar uma triagem eficiente e fornecer um relatório com base nos sintomas relatados pelo paciente.

– Tom de voz: cordial, profissional e conciso.  
– Objetivo: coletar dados de maneira objetiva e gerar um relatório a partir dos sintomas fornecidos.

Se todas as informações forem fornecidas corretamente, forneça o relatório final, incluindo:

**Relatório de Triagem – Cefaleia**
– Nome da Doença: [Nome da doença identificada com base nos sintomas]
– Recomendações: [Recomendações gerais para o paciente, excluindo medicações]
- Gravidade da Doença: [Prioridade com que o paciente precisa ser medicado/internado por meio do Protocolo de Manchester (falar apenas a cor referente àquele grupo)]

Caso alguma informação não tenha sido fornecida, peça para o paciente fornecer apenas as informações faltantes, sem fazer perguntas extras.

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

  // --- Leitura da coleção Cases para uso no prompt ---
  useEffect(() => {
    const loadCases = async () => {
      if (!userId) return;
      const casesRef = collection(db, "Users", userId, "Cases");
      const snapshot = await getDocs(casesRef);
      const loadedCases = snapshot.docs.map((doc) => doc.data());
      setCasesData(loadedCases);
      setIsCasesLoaded(true);
    };
    loadCases();
  }, [userId]);

useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition && !hasWarnedAboutSpeechRecognition.current) {
    toast.warn("Reconhecimento de voz não suportado neste navegador.");
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
      toast.error("Erro na gravação:", event.error);
      setIsRecording(false);
    };

    recog.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recog;
  }
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
      toast.error("Erro ao iniciar gravação:", error);
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
${formattedCases}

Histórico da conversa:
${history}

Usuário: ${messageToSend}
AI:
`;

    try {
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

  // Garante enviar só a primeira mensagem após os cases estarem carregados
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
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === "user" ? styles.user : styles.ai}`}
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
