import { Amplify, Auth } from 'aws-amplify';

import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { useEffect, useState } from 'react';

import ContextProvider from "context/UserContext";

import '../styles/globals.css'

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ]
});

function MyApp({ Component, pageProps }) {

  useEffect(() => {

  }, []);

  const [user, setUser] = useState(null);

  Amplify.configure({
    Auth: {
      region: process.env.NEXT_PUBLIC_REGION,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_WEB_CLIENT_ID,
      authenticationFlowType: 'CUSTOM_AUTH',
      mandatorySignIn: false
    },
    API: {
      endpoints: [
        {
          name: process.env.NEXT_PUBLIC_API_NAME,
          endpoint: process.env.NEXT_PUBLIC_API_BASE_URL
        }
      ]
    }
  });

  return (
    <WagmiConfig client={client}>
      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>
    </WagmiConfig>
  )
}

export default MyApp;
