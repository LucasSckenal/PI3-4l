import GoogleIcon from "../../public/Google icon.webp";
import LoginPageImg from '../../public/LoginPage.png';

import styles from './styles.module.scss';

const LoginPage = () => {
  return (
    <div className={styles.loginContainer}>
        <img src={LoginPageImg} alt="" className={styles.bgImg}/>
      <h1 className={styles.title}>Bem-vindo de volta!</h1>
      <input className={styles.inputLogin} placeholder="Email"type="email" />
      <input className={styles.inputLogin} placeholder="Senha" type="password" name="" id="" />
      <div className={styles.bottomLogin}>
        <input type="checkbox" name="RememberMe" id="RememberMe" />
        <label for="RememberMe">Manter conectado</label>
        <p className={styles.navigateBtn}>Esqueci a senha</p>
      </div>
      <button className={styles.loginBtn}>LOGAR</button>
      <div className={styles.redirect}>
      <p>Usuário novo?</p> <p className={styles.navigateBtn} onClick={()=>{}}>Registrar-se</p>
      </div>
      <div className={styles.bottomPage}>
        <span>──── ou ────</span>
        <button className={styles.google}><img src={GoogleIcon} alt="" /></button>
      </div>
    </div>
  )
}

export default LoginPage
