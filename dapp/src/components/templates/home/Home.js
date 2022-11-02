import { Button, useToast, Box } from '@chakra-ui/react'
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { checkUser } from 'utils/user';
import { getHttp } from 'utils/api';

const Home = () => {
    const [user, setUser] = useState(null);
    const [nfts, setNFTs] = useState(null);
    const { isConnected } = useAccount();
    const toast = useToast();
    let loggedIn = isConnected && user;

    useEffect(() => {
        checkUser(setUser);
        loggedIn = isConnected && user;
    }, [])

    // Test for getNfts Alchemy HTTP passthrough
    const onGetNFTsAlchemy = async () => {
        try {
            const nfts = await getHttp('/getNFTsAlchemy');
            console.log(nfts);
            setNFTs(nfts);
        }
        catch (e) {
            console.error(e);
            toast({
                title: "Something went wrong...",
                description: (e)?.message,
                status: 'error',
                position: 'top-right',
                isClosable: true,
            });
        }
    }

    // Test for call to Lamnda
    const onGetFromLambda = async () => {
        try {
            const nfts = await getHttp('/getFromLambda');
            setNFTs(nfts);
        }
        catch (e) {
            console.log(e);
            const error = e?.message;
            if (!error)
                error = e;
            toast({
                title: "Something went wrong...",
                description: error,
                status: 'error',
                position: 'top-right',
                isClosable: true,
            });
        }
    }

    // if (loggedIn) {
    return (
        <>
            <Button onClick={onGetNFTsAlchemy}>
                /getNFTsAlchemy ({(loggedIn ? 'Authenticated' : 'Unauthenticated')})
            </Button>
            <br /><br />
            <Button onClick={onGetFromLambda}>
                /getFromLambda ({(loggedIn ? 'Authenticated' : 'Unauthenticated')})
            </Button>
            <br /><br />
            <Box textStyle='h1'>
                My NFTs
            </Box>
            <br />
            {
                loggedIn &&
                <Box dangerouslySetInnerHTML={{ __html: JSON.stringify(nfts) }}>
                </Box>
            }
        </>
    );
    // }
};

export default Home;
