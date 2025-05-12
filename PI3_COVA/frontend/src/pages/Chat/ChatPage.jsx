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
import styles from "./styles.module.scss";
import Ia from "../../public/IaChat.gif";

const ChatPage = () => {
  const { chatId } = useParams();
  const isNewChat = !chatId;
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const userId = getAuth().currentUser?.uid;

  // Carrega as mensagens se o chat já existir
  useEffect(() => {
    if (!isNewChat && userId) {
      const chatRef = doc(db, "Users", userId, "chats", chatId);
      const msgsCol = collection(chatRef, "messages");

      const unsub = onSnapshot(msgsCol, (snap) => {
        setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        scrollToBottom();
      });

      return unsub;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMicClick = () => {
    setIsRecording((prev) => !prev);
    // TODO: implementar gravação de áudio
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

  return (
    <main className={styles.ChatContainer}>
      <div className={styles.IaContainer}>
        <img src={Ia} className={styles.ia} alt="Assistente IA" />
        <p className={styles.pIa}>
          Olá! Sou sua assistente médica.{" "}
          <span className={styles.spanIa}>Me conte seus sintomas</span> com uma
          mensagem de voz ou texto e vou gerar um relatório para agilizar seu
          atendimento.
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
    </main>
  );
};

export default ChatPage;
