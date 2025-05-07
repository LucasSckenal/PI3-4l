// src/pages/InnerChat/InnerChatPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../../api/Firebase";
import MessageInputBar from "../../components/MessageInputBar/MessageInputBar";
import styles from "./styles.module.scss";
import Header from "../../components/Header/Header";
const InnerChatPage = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      scrollToBottom();
    });
    return unsubscribe;
  }, [chatId]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMicClick = () => {
    setIsRecording(prev => !prev);
    // TODO: implementar gravação de áudio
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const chatRef = doc(db, "chats", chatId);
    await addDoc(collection(chatRef, "messages"), {
      type: "text",
      text: inputText,
      sender: "user",
      createdAt: serverTimestamp(),
    });
    setInputText("");
  };

  return (
    <main className={styles.InnerChatContainer}>
     <Header/>
      <div className={styles.messagesContainer}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.sender === "user" ? styles.user : styles.ai}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

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

export default InnerChatPage;