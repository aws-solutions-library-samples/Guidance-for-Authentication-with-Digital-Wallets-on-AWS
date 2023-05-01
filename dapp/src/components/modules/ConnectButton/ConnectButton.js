// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, useContext } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { getEllipsisTxt } from 'utils/format';
import { checkUser, handleAmplifySignIn } from 'utils/user';
import { respondToError } from 'utils/responses';
import { Auth } from 'aws-amplify';
import { GlobalContext } from 'context/UserContext';
import { Button } from 'components/elements/Button';

const ConnectButton = () => {
  const [user, setUser] = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const { connectAsync } = useConnect({ connector: new InjectedConnector() });
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const onSignIn = async () => {
    setLoading(true);

    if (isConnected) {
      await onSignOut();
    }

    try {
      // We connect to the blockchain and get wallet address and chain ID
      const { account } = await connectAsync();
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
        .catch((err) => {
          console.log(err);
          throw err;
        });

      if (!(await checkUser(setUser))) 
        throw 'Authentication failed';
    } catch (error) {
      onSignOut();
      respondToError(error, 'Error signing in');
    }

    setLoading(false);
  };

  const onSignOut = async () => {
    try {
      await disconnectAsync();
      await Auth.signOut();
      await checkUser(setUser);
    } catch (error) {
      respondToError(error, 'Error signing out');
    }
  };

  if (user) {
    return (
      <Button onClick={onSignOut} disabled={loading}>
        {getEllipsisTxt(user.username)}
      </Button>
    );
  } else {
    return (
      <Button onClick={onSignIn} disabled={loading}>
        Connect Wallet
      </Button>
    );
  }
};

export default ConnectButton;
