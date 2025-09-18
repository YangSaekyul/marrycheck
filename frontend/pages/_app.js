import '../styles/globals.css';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  // 이 파일이 모든 페이지의 최상위 컴포넌트입니다.
  // 여기에 있던 기존 인증 로직은 나중에 다시 추가하겠습니다.

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;