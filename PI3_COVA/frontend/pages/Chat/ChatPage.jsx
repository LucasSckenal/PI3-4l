import { useState, useEffect } from "react";
import { IoMic, IoClose, IoSend } from "react-icons/io5";

import styles from "./styles.module.scss";

const ChatPage = () => {
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <main className={styles.ChatContainer}>
      <div className={styles.inputBar}>
        <input
          type="text"
          className={styles.inputTextField}
          placeholder="Escreva seu problema aqui"
        ></input>
        <button className={styles.inputAudioBtn}>
          <p className={styles.innerBtns}>
            <IoMic />
          </p>
        </button>
        <button className={styles.inputSendBtn}>
          <p className={styles.innerBtns}>
            <IoSend />
          </p>
        </button>
      </div>
    </main>
  );
};

export default ChatPage;
