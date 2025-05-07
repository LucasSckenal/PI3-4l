import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../api/Firebase";
import styles from "./styles.module.scss";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setChats(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  return (
    <main className={styles.HistoryContainer}>
      <h1>Histórico de Conversas</h1>
      <ul className={styles.chatList}>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={styles.chatItem}
            onClick={() => navigate(`/chat/${chat.id}`)}
          >
            <p>Chat iniciado em {chat.createdAt?.toDate().toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default HistoryPage;