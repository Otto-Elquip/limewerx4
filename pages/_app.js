
import 'tailwindcss/tailwind.css';
import '../configureAmplify';
import awsconfig from '../aws-exports';
import Amplify from 'aws-amplify';
Amplify.configure({...awsconfig, ssr: false});

function MyApp({ Component, pageProps }) {
  return (
      <Component {...pageProps} />
  ) 
}


export default MyApp