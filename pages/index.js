import Head from 'next/head'
import Calculator from '../components/Calculator'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.main}>
      <Head>
        <title>Javascript Calculator</title>
        <meta name="Javascript Calculator" content="FreeCodeCamp Javascript Calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Calculator />
    </div>
  )
}
