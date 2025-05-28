import { useScreenResize } from '../../contexts/ScreenResizeProvider/ScreenResizeProvider';
import styles from './styles.module.scss';
import { useAccount } from '../../contexts/Account/AccountProvider';
import { useTranslation } from 'react-i18next';

const DoctorHomePage = () => {
  // eslint-disable-next-line no-unused-vars
  const { isMobile } = useScreenResize();
  const { userData, loading } = useAccount();
  const { t } = useTranslation();

  if (loading) return <div>{t("common.loading")}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bem-vindo de volta, {userData?.name?.split(" ").slice(0, 4).join(" ") ?? t("home.user")}</h1>
      </header>
    </div>
  );
};

export default DoctorHomePage;