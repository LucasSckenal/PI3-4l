import { useState } from 'react';
import { useScreenResize } from '../../contexts/ScreenResizeProvider/ScreenResizeProvider';
import styles from './styles.module.scss';

const DoctorHomePage = () => {
  // eslint-disable-next-line no-unused-vars
  const { isMobile } = useScreenResize();
  const [nomeMedico] = useState('Dr. Silva');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bem-vindo de volta, {nomeMedico}</h1>
      </header>
    </div>
  );
};

export default DoctorHomePage;