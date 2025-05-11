import { useState, useEffect, useRef, useCallback } from "react";
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
import { getAuth } from "firebase/auth";
import { db } from "../../api/firebase";
import MessageInputBar from "../../components/MessageInputBar/MessageInputBar";
import styles from "./styles.module.scss";
import Header from "../../components/Header/Header";

const InnerChatPage = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [isTypingIndicator, setIsTypingIndicator] = useState(false);
  const bottomRef = useRef(null);
  const hasRespondedToFirstMessage = useRef(false);

  const userId = getAuth().currentUser?.uid;

  const formatConversationHistory = useCallback(() => {
    return messages
      .filter(msg => msg.text && msg.text.trim() !== '')
      .map(msg => `${msg.sender === 'user' ? 'Usuário' : 'AI'}: ${msg.text}`)
      .join('\n');
  }, [messages]);

  useEffect(() => {
    if (!userId) return;
    const chatRef = doc(db, "Users", userId, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      scrollToBottom();
    });

    return unsubscribe;
  }, [chatId, userId]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMicClick = () => {
    setIsRecording(prev => !prev);
  };

  const handleSend = async (overrideText = null) => {
    const messageToSend = overrideText ?? inputText;

    if (!messageToSend.trim() || isLoading || !userId) return;

    try {
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
      const fullPrompt = `${history}\nUsuário: ${messageToSend}\nAI:`;

      const response = await fetch('http://localhost:5000/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: fullPrompt,
          model: 'mistral'
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line.replace('data: ', ''));
            if (data.response) {
              fullResponse += data.response;
              setStreamingResponse(fullResponse);
            }
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }
        }
      }

      if (fullResponse.trim() !== '') {
        await addDoc(collection(chatRef, "messages"), {
          type: "text",
          text: fullResponse,
          sender: "ai",
          createdAt: serverTimestamp(),
        });
      }

    } catch (error) {
      console.error('Error:', error);
      const chatRef = doc(db, "Users", userId, "chats", chatId);
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
      !hasRespondedToFirstMessage.current
    ) {
      hasRespondedToFirstMessage.current = true;
      handleSend(messages[0].text);
    }
  }, [messages]);

  return (
    <main className={styles.InnerChatContainer}>
      <Header />
      <div className={styles.messagesContainer}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.sender === "user" ? styles.user : styles.ai}`}
          >
            {msg.text}
          </div>
        ))}
        
        {isTypingIndicator && !streamingResponse && (
          <div className={`${styles.message} ${styles.ai} ${styles.typingIndicator}`}>
            <div className={styles.typingDot}></div>
            <div className={styles.typingDot}></div>
            <div className={styles.typingDot}></div>
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
};

export default InnerChatPage;
