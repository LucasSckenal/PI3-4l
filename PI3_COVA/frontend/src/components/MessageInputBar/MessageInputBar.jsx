import { IoMic, IoSend } from "react-icons/io5";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

const MessageInputBar = ({
  inputText,
  onChangeText,
  isRecording,
  onMicClick,
  onSendClick,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.inputBar}>
      <input
        type="text"
        className={styles.inputTextField}
        placeholder={t("chat.inputPlaceholder")}
        value={inputText}
        onChange={(e) => onChangeText(e.target.value)}
      />

      <button
        className={
          isRecording ? styles.inputAudioBtnRecording : styles.inputAudioBtn
        }
        onClick={onMicClick}
      >
        <IoMic
          className={isRecording ? styles.innerBtnsRecording : styles.innerBtns}
        />
      </button>

      <button className={styles.inputSendBtn} onClick={onSendClick}>
        <IoSend className={styles.innerBtns} />
      </button>
    </div>
  );
};

export default MessageInputBar;
