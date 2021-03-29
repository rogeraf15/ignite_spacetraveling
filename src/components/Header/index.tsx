import styles from './header.module.scss';

export default function Header() {
  return(
    <header className={styles.container}>
      <img src="/logo.svg" alt="logo"/>
    </header>
  )
}
