import { IoMic, IoSend } from "react-icons/io5";
import styles from "./styles.module.scss";

const MessageInputBar = ({
  inputText,
  onChangeText,
  isRecording,
  onMicClick,
  onSendClick
}) => (
  <div className={styles.inputBar}>
    <input
      type="text"
      className={styles.inputTextField}
      placeholder="Escreva seu problema aqui"
      value={inputText}
      onChange={e => onChangeText(e.target.value)}
    />

    <button
      className={
        isRecording ? styles.inputAudioBtnRecording : styles.inputAudioBtn
      }
      onClick={onMicClick}
    >
      <IoMic
        className={
          isRecording ? styles.innerBtnsRecording : styles.innerBtns
        }
      />
    </button>

    <button className={styles.inputSendBtn} onClick={onSendClick}>
      <IoSend className={styles.innerBtns} />
    </button>
  </div>
);

export default MessageInputBar;