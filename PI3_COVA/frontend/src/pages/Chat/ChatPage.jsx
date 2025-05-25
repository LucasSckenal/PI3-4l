import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../api/firebase";
import MessageInputBar from "../../components/MessageInputBar/MessageInputBar";
import QuickMessagesCarousel from "../../components/QuickMsg/QuickMsg";
import styles from "./styles.module.scss";
import Ia from "../../public/IaChat.gif";
import { useScreenResize } from "../../contexts/ScreenResizeProvider/ScreenResizeProvider";
import { toast } from "react-toastify";

const ChatPage = () => {
  const { chatId } = useParams();
  const isNewChat = !chatId;
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const hasWarnedAboutSpeechRecognition = useRef(false);
  const { isMobile } = useScreenResize();

  const userId = getAuth().currentUser?.uid;

  const fullIntro =
    "Olá! Sou sua assistente médica. Me conte seus sintomas com uma mensagem de voz ou texto e vou gerar um relatório para agilizar seu atendimento.";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let isCancelled = false;
    let currentText = "";

    const typeText = (index) => {
      if (isCancelled || index >= fullIntro.length) return;

      currentText += fullIntro.charAt(index);
      setDisplayedText(currentText);

      setTimeout(() => typeText(index + 1), 35);
    };

    typeText(0);

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isNewChat && userId) {
      const chatRef = doc(db, "Users", userId, "chats", chatId);
      const msgsCol = collection(chatRef, "messages");

      const unsub = onSnapshot(msgsCol, (snap) => {
        setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });

      return unsub;
    }
  }, [chatId, userId, isNewChat]);

  useEffect(() => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
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

  const handleSend = async () => {
    if (!inputText.trim() || !userId) return;

    let id = chatId;
    if (isNewChat) {
      const newChatRef = doc(collection(db, "Users", userId, "chats"));
      id = newChatRef.id;
      await setDoc(newChatRef, { createdAt: serverTimestamp() });
      navigate(`/chat/${id}`);
    }

    const chatRef = doc(db, "Users", userId, "chats", id);

    await addDoc(collection(chatRef, "messages"), {
      type: "text",
      text: inputText,
      sender: "user",
      createdAt: serverTimestamp(),
    });

    setInputText("");
  };

  const handleQuickMessage = async (text) => {
    if (!userId || !text.trim()) return;

    let id = chatId;
    if (isNewChat) {
      const newChatRef = doc(collection(db, "Users", userId, "chats"));
      id = newChatRef.id;
      await setDoc(newChatRef, { createdAt: serverTimestamp() });
      navigate(`/chat/${id}`);
    }

    const chatRef = doc(db, "Users", userId, "chats", id);

    await addDoc(collection(chatRef, "messages"), {
      type: "text",
      text,
      sender: "user",
      createdAt: serverTimestamp(),
    });

    setMessages((prev) => [
      ...prev,
      { id: `quick-${Date.now()}`, text, sender: "user" },
    ]);
  };
  
  return (
    <main className={styles.ChatContainer}>
      <div className={styles.IaContainer}>
        <img src={Ia} className={styles.ia} alt="Assistente IA" />
        <p className={styles.pIa}>
          {displayedText}
          {displayedText.length < fullIntro.length && (
            <span className={styles.cursor}>|</span>
          )}
        </p>
      </div>

      {!isNewChat && (
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
          <div ref={messagesEndRef} />
        </div>
      )}

      <MessageInputBar
        inputText={inputText}
        onChangeText={setInputText}
        isRecording={isRecording}
        onMicClick={handleMicClick}
        onSendClick={handleSend}
      />

      <div className={styles.quickMessagesWrapper}>
              <span className={styles.quickLabel}>Mensagens rápidas</span>
              <QuickMessagesCarousel onSendMessage={handleQuickMessage} />
            </div>

    {isMobile ? (
      <div className={styles.quickMessagesWrapper}>
        <span className={styles.quickLabel}>Mensagens rápidas</span>
        <QuickMessagesCarousel onSendMessage={handleQuickMessage} />
      </div>
    ) : (
      <></>
    )}
    </main>
  );
};

export default ChatPage;
