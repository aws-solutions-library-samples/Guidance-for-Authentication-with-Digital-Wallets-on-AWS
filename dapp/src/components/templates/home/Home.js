import { Button, useToast, Box, Text, Input, Flex } from '@chakra-ui/react'
import { useAccount } from 'wagmi';
import { useState, useEffect, useContext } from 'react';
import { checkUser } from 'utils/user';
import { getHttp } from 'utils/api';
import Image from 'next/image';

import ContextProvider, { GlobalContext } from 'context/UserContext';

const Home = () => {
    const [user, setUser] = useContext(GlobalContext);
    const [nfts, setNFTs] = useState(null);
    const [provider, setProvider] = useState(null);
    const [type, setType] = useState(null);
    const { isConnected } = useAccount();
    const toast = useToast();
    let loggedIn = isConnected && user;

    useEffect(() => {
        checkUser(setUser);
        loggedIn = isConnected && user;
    }, [])

    // Test for getNFTs Alchemy HTTP passthrough
    const onGetFromAlchemyProxy = async () => {
        try {
            const nfts = await getHttp('/getNFTsAlchemy');
            console.log(nfts);
            setNFTs(nfts);
            setProvider({ name: 'Alchemy', src: '/alchemy.png' });
        }
        catch (e) {
            console.error(e);
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

    // Test for call to Lamnda
    const onGetFromLambda = async (provider, action) => {
        try {
            const myInit = {
                queryStringParameters: {
                    provider: provider.name,
                    action: action
                }
            };
            const nfts = await getHttp('/getFromLambda', myInit);
            console.log(nfts);
            setNFTs(nfts);
            setProvider(provider);
            setType("Lambda");
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

    // Test for getNFTs Moralis HTTP passthrough
    const onGetFromMoralisProxy = async () => {
        try {
            const nfts = await getHttp('/getNFTsMoralis');
            console.log(nfts);
            setNFTs(nfts);
            setProvider({ name: 'Moralis', src: '/moralis.png' });
            setType("Proxy");
        }
        catch (e) {
            console.error(e);
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

    // Test for getNFTs Infura HTTP passthrough
    const onGetFromInfuraProxy = async () => {
        try {
            const nfts = await getHttp('/getNFTsInfura');
            console.log(nfts);
            setNFTs(nfts);
            setProvider({ name: 'Infura', src: '/infura.png' });
            setType("Proxy");
        }
        catch (e) {
            console.error(e);
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

    // Test for getNFTsCollection Alchemy HTTP passthrough
    const onGetCollectionAlchemyProxy = async () => {
        try {
            // TODO
            const nfts = await getHttp('/getCollectionAlchemy');
            console.log(nfts);
            setNFTs(nfts);
            setType("Proxy");
        }
        catch (e) {
            console.error(e);
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

    return (
        <>
            <Box>
                <Text fontSize="md" fontWeight="bold">Get my NFTs</Text>
                <Text fontSize="xs" color="lightgray">These API calls will return a list of NFTs owned by the current connected wallet.</Text>

                <Box mt='2.5' display="flex" alignItems="left" flexDirection="row" gap='2'>
                    <Box bg='#0e1118' p='2'>
                        <Box display="flex" flexDirection="row">
                            <Box position='relative' w="22px" h="20px" mr="1">
                                <Image layout='fill' src="/alchemy.png" ></Image>
                            </Box>
                            <Text fontSize="md" fontWeight="bold" >Alchemy</Text>
                        </Box>
                        <Box mt='2' display="flex" alignItems="left" flexDirection="column" gap='2'>
                            <Box>
                                <Button w="100%" onClick={onGetFromAlchemyProxy}>
                                    /getFromProxy
                                </Button>
                            </Box>
                            <Box>
                                <Button w="100%" onClick={() => onGetFromLambda({ name: 'Alchemy', src: '/alchemy.png' }, "getNFTs")}>
                                    /getFromLambda
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    <Box bg='#0e1118' p='2'>
                        <Box display="flex" flexDirection="row">
                            <Box position='relative' w="25px" h="20px" mr="1">
                                <Image layout='fill' src="/moralis.png" ></Image>
                            </Box>
                            <Text fontSize="md" fontWeight="bold" >Moralis</Text>
                        </Box>
                        <Box mt='2' display="flex" alignItems="left" flexDirection="column" gap='2'>
                            <Box>
                                <Button w="100%" onClick={onGetFromMoralisProxy}>
                                    /getFromProxy
                                </Button>
                            </Box>
                            <Box>
                                <Button w="100%" onClick={() => onGetFromLambda({ name: 'Moralis', src: '/moralis.png' }, "getNFTs")}>
                                    /getFromLambda
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* <Box bg='#0e1118' p='2'>
                        <Box display="flex" flexDirection="row">
                            <Box position='relative' w="25px" h="20px" mr="1">
                                <Image layout='fill' src="/infura.png" ></Image>
                            </Box>
                            <Text fontSize="md" fontWeight="bold" >Infura</Text>
                        </Box>
                        <Box mt='2' display="flex" alignItems="left" flexDirection="column" gap='2'>
                            <Box>
                                <Button w="100%" onClick={onGetFromInfuraProxy}>
                                    /getFromProxy
                                </Button>
                            </Box>
                            <Box>
                                <Button w="100%" onClick={() => onGetFromLambda({ name: 'Infura', src: '/infura.png' }, "getNFTs")}>
                                    /getFromLambda
                                </Button>
                            </Box>
                        </Box>
                    </Box> */}

                </Box>
            </Box>

            <Box mt='5'>
                <Text fontSize="md" fontWeight="bold">NFT collection lookup</Text>
                <Text fontSize="xs" color="lightgray">Input the NFT contract address to get the NFTs in that collection. Any users can make those API calls even unauthenticated users. We use Alchemy as a provider.</Text>
                <Flex minWidth='max-content' gap='2' align='left' mt='2'>
                    <Box flex='2'>
                        <Input bg="#3c4d6f" placeholder='NFT contract address' />
                    </Box>
                    <Box>
                        <Button onClick={onGetCollectionAlchemyProxy}>
                            /getFromProxy
                        </Button>
                    </Box>
                    <Box >
                        <Button onClick={() => onGetFromLambda({ name: 'Alchemy', src: '/alchemy.png' }, "getCollection")}>
                            /getFromLambda
                        </Button>
                    </Box>
                </Flex>
            </Box>

            {
                loggedIn &&
                <Box mt='5'>
                    <Box display={provider ? 'flex' : 'none'} flexDirection="row">
                        <Box position='relative' w="22px" h="20px" mr="1">
                            <Image layout='fill' src={provider?.src} ></Image>
                        </Box>
                        <Text fontSize="md" fontWeight="bold" >Output from {provider?.name} {type}</Text>
                    </Box>
                    <Box p={4} bg='#0e1118' display={nfts ? 'block' : 'none'}>
                        <Box dangerouslySetInnerHTML={{ __html: JSON.stringify(nfts) }}>
                        </Box>
                    </Box>
                </Box>
            }

        </>
    );
};

export default Home;
