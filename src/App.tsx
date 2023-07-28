import { Footer } from './component/Footer';
import { Logo } from './component/Logo';
import styles from './App.module.css';
import { Main } from './component/Main';

 function App() {
  return (
    <div className={styles.app}>
      <Logo />
      <main className={styles.content}>
        <Main />
      </main>
      <Footer />
    </div>
  );
}

export default App;