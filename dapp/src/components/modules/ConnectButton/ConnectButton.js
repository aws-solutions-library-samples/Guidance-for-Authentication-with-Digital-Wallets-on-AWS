import { useState, useEffect, useContext } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { getEllipsisTxt } from 'utils/format';
import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';

import { checkUser, handleAmplifySignIn } from 'utils/user';

import { Auth } from 'aws-amplify';

import ContextProvider, { GlobalContext } from 'context/UserContext';

const ConnectButton = () => {
  const [user, setUser] = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const { connectAsync } = useConnect({ connector: new InjectedConnector() });
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const toast = useToast();

  useEffect(() => {
    checkUser(setUser);
  }, [])

  // When user click the Connect button
  const onSignIn = async () => {
    setLoading(true);

    if (isConnected) {
      await onSignOut();
    }

    try {
      // We connect to the blockchain to get wallet address and chain ID
      const { account, chain } = await connectAsync();

      const address = account.toLowerCase();
      const cognitoUser = await handleAmplifySignIn(address);
      console.log("User: ");
      console.log(cognitoUser);
      const message = cognitoUser.challengeParam.message;
      console.log("Message to sign: " + message);

      // Request to user to Sign the message on the blockchain
      const signature = await signMessageAsync({ message });

      console.log("Send challenge answer: " + cognitoUser + ":" + signature);
      await Auth.sendCustomChallengeAnswer(cognitoUser, signature)
        .then(async (user) => {
          console.log('user after answer');
          console.log(user);
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });

      if (!await checkUser(setUser))
        throw "Authentication failed"

    } catch (e) {
      console.error(e);
      toast({
        title: 'Something went wrong...',
        description: (e)?.message,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
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
      <HStack onClick={onSignOut} cursor={'pointer'}>
        <Avatar size="xs" />
        <Text fontWeight="medium">{getEllipsisTxt(user.username)}</Text>
      </HStack>
    );
  } else {
    return (
      <Button size="sm" onClick={onSignIn} colorScheme="blue" disabled={loading}>
        Connect Wallet
      </Button>
    );
  }
}

export default ConnectButton;
