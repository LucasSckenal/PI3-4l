import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  onSnapshot, getDoc, updateDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../api/firebase";
import MessageInputBar from "../../components/MessageInputBar/MessageInputBar";
import QuickMessagesCarousel from "../../components/QuickMsg/QuickMsg";
import styles from "./styles.module.scss";
import Ia from "../../public/IaChat.gif";
import { useScreenResize } from "../../contexts/ScreenResizeProvider/ScreenResizeProvider";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import  TutorialModal  from "../../components/tutorialModal/tutorialModal";

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
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [canCloseModal, setCanCloseModal] = useState(false);
  const { isMobile } = useScreenResize();
  const { t } = useTranslation();
  const userId = getAuth().currentUser?.uid;

  const fullIntro = t("chat.intro");
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
  }, [fullIntro]);

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
  }, [t]);

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

  useEffect(() => {
  const checkTutorialStatus = async () => {
    if (!userId) return;

    const userRef = doc(db, "Users", userId);
    try {
      const snapshot = await getDoc(userRef);
      const data = snapshot.data();

      if (!data?.tutorialWatched) {
        setShowTutorialModal(true);
        setCanCloseModal(false);
      }
    } catch (error) {
      console.error("Erro ao buscar tutorialWatched:", error);
    }
  };

  checkTutorialStatus();
  }, [userId]);

  useEffect(() => {
    const handleTutorialEnd = async () => {
      setCanCloseModal(true);

      if (!userId) return;

      const userRef = doc(db, "Users", userId);
      try {
        await updateDoc(userRef, { tutorialWatched: true });
      } catch (error) {
        console.error("Erro ao salvar tutorialWatched:", error);
      }
    };

    window.addEventListener("tutorialEnded", handleTutorialEnd);
    return () => window.removeEventListener("tutorialEnded", handleTutorialEnd);
  }, [userId]);


  useEffect(() => {
  const handleTutorialEnd = () => {
    setCanCloseModal(true);
  };

  window.addEventListener("tutorialEnded", handleTutorialEnd);
  return () => window.removeEventListener("tutorialEnded", handleTutorialEnd);
  }, []);


  return (
    <main className={styles.ChatContainer}>
      <div className={styles.IaContainer}>
        <img src={Ia} className={styles.ia} alt={t("chat.assistantAlt")} />
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
       {isMobile && (
      <div className={styles.quickMessagesWrapper}>
        <span className={styles.quickLabel}>
          {t("chat.quickMessagesLabel")}
        </span>
        <QuickMessagesCarousel onSendMessage={handleQuickMessage} />
      </div>)}
      <TutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        canClose={canCloseModal}
      />
    </main>
  );
};

export default ChatPage;
