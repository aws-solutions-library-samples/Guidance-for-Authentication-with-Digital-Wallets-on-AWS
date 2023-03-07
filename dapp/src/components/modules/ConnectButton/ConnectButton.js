import { useState, useEffect, useContext } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { getEllipsisTxt } from 'utils/format';
import { checkUser, handleAmplifySignIn } from 'utils/user';
import { Auth } from 'aws-amplify';
import { GlobalContext } from 'context/UserContext';

const ConnectButton = () => {

  const [user, setUser] = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const { connectAsync } = useConnect({ connector: new InjectedConnector() });
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    checkUser(setUser);
  }, [setUser])

  const onSignIn = async () => {
    setLoading(true);

    if (isConnected) {
      await onSignOut();
    }

    try {
      // We connect to the blockchain and get wallet address and chain ID
      const { account, chain } = await connectAsync();
      const address = account.toLowerCase();

      // We signin or sigup the user. See utils/user.js
      const cognitoUser = await handleAmplifySignIn(address);
      // console.log("user: ", cognitoUser);

      // We get the message to sign
      const message = cognitoUser.challengeParam.message;
      // console.log("Message to sign: " + message);

      // Request user to Sign the message using his crypto wallet and private key
      const signature = await signMessageAsync({ message });

      // We send the signature back to Cognito to complete the authentication process.
      await Auth.sendCustomChallengeAnswer(cognitoUser, signature)
        .then(async (user) => {
          // console.log("user:", user);
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });

      if (!(await checkUser(setUser))) 
        throw "Authentication failed";
    } catch (e) {
      console.error(e);
      onSignOut();
      alert('Something went wrong...\n' + (e)?.message);
    }

    setLoading(false);
  }

  const onSignOut = async () => {
    try {
      await disconnectAsync();
      await Auth.signOut();
      await checkUser(setUser);
    } catch (err) {
      console.error('onSignOut error: ', err);
    }
  };

  if (user) {
    return (
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onSignOut} cursor={'pointer'}>
        {getEllipsisTxt(user.username)}
      </button>
    );
  } else {
    return (
      <button className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-900 text-white font-bold py-2 px-4 rounded" onClick={onSignIn} cursor={'pointer'} disabled={loading}>
        Connect Wallet
      </button>
    );
  }
}

export default ConnectButton;
