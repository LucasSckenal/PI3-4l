import { useState } from "react";
import { IoMic, IoSend } from "react-icons/io5";

import styles from "./styles.module.scss";
import Ia from "../../public/IaChat.gif";
const ChatPage = () => {
  const [isRecording, setIsRecording] = useState(false);

  const handleMicClick = () => {
    setIsRecording((prev) => !prev);
  };

  return (
    <main className={styles.ChatContainer}>
      <div className={styles.IaContainer}>
        <img src={Ia} className={styles.ia} />
        <p className={styles.pIa}>
          Olá! Sou sua assistente médica.{" "}
          <span className={styles.spanIa}>
            Me conte seus sintomas com uma mensagem de voz ou texto
          </span>{" "}
          e vou gerar um relatório para agilizar seu atendimento.
        </p>
      </div>
      <div className={styles.inputBar}>
        <input
          type="text"
          className={styles.inputTextField}
          placeholder="Escreva seu problema aqui"
        />

        <button
          className={
            isRecording ? styles.inputAudioBtnRecording : styles.inputAudioBtn
          }
          onClick={handleMicClick}
        >
          <IoMic
            className={
              isRecording ? styles.innerBtnsRecording : styles.innerBtns
            }
          />
        </button>

        <button className={styles.inputSendBtn}>
          <IoSend className={styles.innerBtns} />
        </button>
      </div>
    </main>
  );
};

export default ChatPage;
