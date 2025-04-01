
    import { IoHome } from "react-icons/io5";
    import { IoPerson } from "react-icons/io5";
    import { IoReceiptSharp } from "react-icons/io5";
    import { IoSettingsSharp } from "react-icons/io5";
    import { IoChatboxEllipses } from "react-icons/io5";
    import { IoChatbubbles } from "react-icons/io5";
    import styles from "./styles.module.scss";

    const FooterBar = () => {
    return (
        <footer className={styles.FooterBar}>
        <ul className={styles.bar}>
            <li> <IoReceiptSharp/> </li>
            <li> <IoChatbubbles/> </li>
            <li> <IoHome/> </li>
            <li> <IoPerson/> </li>
            <li> <IoSettingsSharp/> </li>
            </ul>
        </footer>
    );
    };

    export default FooterBar;
