import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../api/firebase";
import Divider from "../../components/Divider/Divider";
import styles from "./styles.module.scss";
import { IoSearchSharp, IoTrash } from "react-icons/io5";
import SimpleModal from "../../components/SimpleModal/SimpleModal";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); 
  const [selectedChatId, setSelectedChatId] = useState(null);

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

  // Agrupar chats por data
  const groupedChats = useMemo(() => {
    const groups = {};
    chats.forEach((chat) => {
      const date = chat.createdAt?.toDate().toLocaleDateString("pt-BR");
      if (!groups[date]) groups[date] = [];
      groups[date].push(chat);
    });
    return groups;
  }, [chats]);

  // Filtrar chats
  const filteredGroupedChats = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    const result = {};
    for (const [date, group] of Object.entries(groupedChats)) {
      const filtered = group.filter((chat) => {
        const dataStr =
          chat.createdAt?.toDate().toLocaleDateString("pt-BR") || "";
        const sintoma = (chat.sintoma || "").toLowerCase();
        const title = (chat.title || "").toLowerCase();
        const priority = (chat.priority || "").toLowerCase();

        return (
          dataStr.includes(lower) ||
          sintoma.includes(lower) ||
          title.includes(lower) ||
          priority.includes(lower)
        );
      });
      if (filtered.length > 0) {
        result[date] = filtered;
      }
    }
    return result;
  }, [groupedChats, searchTerm]);

  // Cores de prioridade
  const getPriorityColor = (prioridade) => {
    if (!prioridade) return "#bdc3c7";
    const cor = prioridade.trim().toLowerCase();
    switch (cor) {
      case "vermelho":
        return "#e74c3c";
      case "laranja":
        return "#e67e22";
      case "amarelo":
        return "#f1c40f";
      case "verde":
        return "#2ecc71";
      case "azul":
        return "#3498db";
      default:
        return "#bdc3c7";
    }
  };

  // Abrir modais
  const openDeleteSingleModal = (chatId) => {
    setSelectedChatId(chatId);
    setModalAction("single");
    setModalOpen(true);
  };

  const openDeleteAllModal = () => {
    setModalAction("all");
    setModalOpen(true);
  };

  // Função para deletar 1 chat
  const deleteSingleChat = async (chatId) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId || !chatId) return;

  try {
    const messagesRef = collection(db, "Users", userId, "chats", chatId, "messages");
    const messagesSnap = await getDocs(messagesRef);

    const deleteMessages = messagesSnap.docs.map((msgDoc) =>
      deleteDoc(doc(db, "Users", userId, "chats", chatId, "messages", msgDoc.id))
    );

    await Promise.all(deleteMessages);

    await deleteDoc(doc(db, "Users", userId, "chats", chatId));
    console.log(`Chat ${chatId} deletado com sucesso.`);
  } catch (error) {
    console.error("Erro ao deletar chat:", error);
  }
};


  // Função para deletar todos os chats
  const deleteAllChats = async () => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) return;

  try {
    const chatsRef = collection(db, "Users", userId, "chats");
    const chatsSnap = await getDocs(chatsRef);

    const deleteAll = chatsSnap.docs.map(async (chatDoc) => {
      const chatId = chatDoc.id;

      // Deleta todas as mensagens do chat
      const messagesRef = collection(db, "Users", userId, "chats", chatId, "messages");
      const messagesSnap = await getDocs(messagesRef);

      const deleteMessages = messagesSnap.docs.map((msgDoc) =>
        deleteDoc(doc(db, "Users", userId, "chats", chatId, "messages", msgDoc.id))
      );

      await Promise.all(deleteMessages);

      // Deleta o documento do chat
      await deleteDoc(doc(db, "Users", userId, "chats", chatId));
    });

    await Promise.all(deleteAll);
    console.log("Todos os chats e mensagens foram deletados com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar todos os chats:", error);
  }
};


  return (
    <main className={styles.HistoryContainer}>
      <div className={styles.InputWrapper}>
        <input
          type="search"
          className={styles.SearchInput}
          placeholder="Buscar por data, sintoma ou título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IoSearchSharp className={styles.SearchIcon} />
        <button
          className={styles.DeleteAllButton}
          onClick={openDeleteAllModal}
          aria-label="Excluir todos os históricos"
          type="button"
        >
          Excluir todos
        </button>
      </div>

      <div className={styles.ContentWrapper}>
        {Object.entries(filteredGroupedChats).map(([date, chats]) => (
          <div key={date}>
            <h3 className={styles.DateTitle}>{date}</h3>
            <Divider width={"100%"} />
            <ul className={styles.chatListGrid}>
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  className={styles.chatItem}
                  style={{
                    borderRight: `8px solid ${getPriorityColor(chat.priority)}`,
                    position: "relative",
                  }}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                >
                  <p>
                    <strong>
                      {chat.title || chat.sintoma || "Sem título"}
                    </strong>
                  </p>
                  <p>
                    Iniciado:{" "}
                    {chat.createdAt?.toDate().toLocaleTimeString("pt-BR")}
                  </p>
                  {chat.prioridade && (
                    <p>
                      Prioridade:{" "}
                      <strong
                        style={{ color: getPriorityColor(chat.prioridade) }}
                      >
                        {chat.prioridade}
                      </strong>
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteSingleModal(chat.id);
                    }}
                    className={styles.DeleteButton}
                    aria-label="Excluir chat"
                  >
                    <IoTrash size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal de confirmação */}
      <SimpleModal
        isOpen={modalOpen}
        isClose={() => setModalOpen(false)}
        title={
          modalAction === "all"
            ? "Deseja excluir todos os históricos?"
            : "Deseja excluir este histórico?"
        }
        Text="Confirmar"
        Text2="Cancelar"
        textColor="#fff"
        borderColor="1px solid red"
        textColor2="var(--TextGeneral)"
        borderColor2="1px solid #ccc"
        onConfirm={async () => {
          if (modalAction === "all") {
            await deleteAllChats();
          } else if (modalAction === "single" && selectedChatId) {
            await deleteSingleChat(selectedChatId);
          }
          setModalOpen(false);
        }}
      />
    </main>
  );
};

export default HistoryPage;
