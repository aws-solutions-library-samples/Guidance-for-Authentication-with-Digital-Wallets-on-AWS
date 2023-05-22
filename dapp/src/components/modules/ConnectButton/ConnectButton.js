// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, useContext, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { getEllipsisTxt } from 'utils/format';
import { checkUser, handleAmplifySignIn } from 'utils/user';
import { respondToError } from 'utils/responses';
import { Auth } from 'aws-amplify';
import { GlobalContext } from 'context/UserContext';
import { Button } from 'components/elements/Button';

const ConnectButton = () => {
  const [user, setUser] = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // Prompts the user to connect their wallet and uses Amplify to log in with the connected wallet address
  const onSignIn = async () => {
    if (isConnected) {
      await onSignOut();
    }

    setLoading(true);

    try {
      // We connect to the blockchain and get wallet address and chain ID
      const { account } = await connectAsync({connector: connectors[0]});
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

  // Uses wagmi to disconnect the user's wallet
  const disconnectWallet = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      respondToError(error, 'Error disconnecting wallet');
    }
  };

  // Signs the user out using Amplify
  const signUserOut = async () => {
    console.log('Signing user out...');

    setLoading(true);

    try {
      await Auth.signOut();
      await checkUser(setUser);
    } catch (error) {
      respondToError(error, 'Error signing out');
    }

    setLoading(false);
  };

  // Log the user out each time their wallet account changes
  useEffect(() => {
    console.log('Wallet account changed to address:', address);

    const onAccountChanged = async () => {
      await signUserOut();

      setTimeout(() => {
        alert(`Wallet account changed to ${getEllipsisTxt(address)}. Please reauthenticate.`);
      });
    };

    const onWalletDisconnect = async () => {
      await signUserOut();

      setTimeout(() => {
        alert('Wallet disconnected.');
      });
    };

    // Only sign the user out if there is a user logged in
    if (user) {
      if (address) {
        // Sign the user out if they change the connected wallet account
        if (address.toLowerCase() !== user.username.toLowerCase()) {
          onAccountChanged();
        }
      } else {
        // Sign the user ouf if they disconnect their wallet
        onWalletDisconnect();
      }
    }
  }, [address]);

  // Disconnects the user's wallet and signs them out
  const onSignOut = async () => {
    setLoading(true);

    await disconnectWallet();
    await signUserOut();

    setLoading(false);
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
