import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../api/firebase";
import Divider from "../../components/Divider/Divider";
import styles from "./styles.module.scss";
import { IoSearchSharp } from "react-icons/io5";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;

    const userChatsRef = collection(db, "Users", userId, "chats");
    const q = query(userChatsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setChats(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  const groupedChats = useMemo(() => {
    const groups = {};
    chats.forEach((chat) => {
      const date = chat.createdAt?.toDate().toLocaleDateString("pt-BR");
      if (!groups[date]) groups[date] = [];
      groups[date].push(chat);
    });
    return groups;
  }, [chats]);

  const filteredGroupedChats = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    const result = {};
    for (const [date, group] of Object.entries(groupedChats)) {
      const filtered = group.filter((chat) => {
        const dataStr =
          chat.createdAt?.toDate().toLocaleDateString("pt-BR") || "";
        const sintoma = (chat.sintoma || "").toLowerCase();
        return dataStr.includes(lower) || sintoma.includes(lower);
      });
      if (filtered.length > 0) {
        result[date] = filtered;
      }
    }
    return result;
  }, [groupedChats, searchTerm]);

  return (
    <main className={styles.HistoryContainer}>
      <div className={styles.InputWrapper}>
        <input
          type="search"
          className={styles.SearchInput}
          placeholder="Buscar por data ou sintoma..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IoSearchSharp className={styles.SearchIcon} />
      </div>

      {Object.entries(filteredGroupedChats).map(([date, chats]) => (
        <div key={date} className={styles.DayGroup}>
          <h3 className={styles.DateTitle}>{date}</h3>
          <Divider width={"100%"} />
          <ul className={styles.chatListGrid}>
            {chats.map((chat) => (
              <li
                key={chat.id}
                className={styles.chatItem}
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <p>
                  Iniciado:{" "}
                  {chat.createdAt?.toDate().toLocaleTimeString("pt-BR")}
                </p>
                <p>
                  <strong>{chat.sintoma}</strong>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
};

export default HistoryPage;
