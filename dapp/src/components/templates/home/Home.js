import { useState, useEffect, useContext } from 'react';
import { checkUser } from 'utils/user';
import { getHttp } from 'utils/api';
import Image from 'next/Image';
import { GlobalContext } from 'context/UserContext';
import { NFTList } from 'components/modules/NFTList';
import { processMoralisNFTs, processAlchemyOwnedNfts, processAlchemyNFTsForCollection } from 'utils/nftParser';

const Home = () => {
    const [user, setUser] = useContext(GlobalContext);
    const [nftCards, setNftCards] = useState(null);
    const [provider, setProvider] = useState(null);
    const [type, setType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [contract, setContract] = useState('');

    useEffect(() => {
        checkUser(setUser);
    }, [])

    useEffect(() => {
        console.log('User Has changed', user)
        if (!user)
            setNftCards(null);
    },[user])

    // getNFTs to Alchemy through Lambda
    const onGetNFTsAlchemyLambda = async () => {
        try {
            const provider = { name: 'Alchemy', src: '/alchemy.png' };
            setLoading(true);
            setProvider(provider);
            setType("Lambda");
            setNftCards([]);
            const result = await getHttp('/getNFTsAlchemyLambda');
            console.log(result);
            setNftCards(await processAlchemyOwnedNfts(result));
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            console.log(e);
            const error = e?.message;
            if (!error)
                error = e;
            alert("Something went wrong...\n" + error);
        }
    }

    // getNFTs Alchemy using API Gateway HTTP passthrough
    const onGetNFTsAlchemy = async () => {
        try {
            setLoading(true);
            setProvider({ name: 'Alchemy', src: '/alchemy.png' });
            setType("Proxy");
            setNftCards([]);
            const result = await getHttp('/getNFTsAlchemy');
            console.log(result);
            setNftCards(await processAlchemyOwnedNfts(result));
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            console.error(e);
            const error = e?.message;
            if (!error)
                error = e;
            alert("Something went wrong...\n" + error);
        }
    }

    // getNFTs to Moralis through Lambda
    const onGetNFTsMoralisLambda = async (action) => {
        try {
            const provider = { name: 'Moralis', src: '/Moralis.png' };
            setLoading(true);
            setProvider(provider);
            setType("Lambda");
            setNftCards([]);
            const result = await getHttp('/getNFTsMoralisLambda');
            console.log(result);
            setNftCards(await processMoralisNFTs(result));
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            console.log(e);
            const error = e?.message;
            if (!error)
                error = e;
            alert("Something went wrong...\n" + error);
        }
    }

    // getNFTs to Moralis using API Gateway HTTP passthrough
    const onGetNFTsMoralis = async () => {
        try {
            setLoading(true);
            setProvider({ name: 'Moralis', src: '/moralis.png' });
            setType("Proxy");
            setNftCards([]);            
            const myInit = {
                queryStringParameters: {
                    chain: 'eth',
                }
            };
            const result = await getHttp('/getNFTsMoralis', myInit);
            console.log(result);
            setNftCards(await processMoralisNFTs(result));
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            console.error(e);
            const error = e?.message;
            if (!error)
                error = e;
            alert("Something went wrong...\n" + error);
        }
    }

    // API call getNFTsCollection to Alchemy using API Gateway HTTP passthrough
    // Takes in a contract address and returns all the NFTs
    const onGetNFTsCollectionAlchemy = async () => {
        try {
            if (!contract)
                throw("Please provide a contract address");

            setLoading(true);
            setProvider({ name: 'Alchemy', src: '/alchemy.png' });
            setType("Proxy");
            const myInit = {
                queryStringParameters: {
                    contractAddress: contract,
                }
            };
            setNftCards([]);
            // This API call can be made by anonymous users
            // The third parameter make sure we use the Unauthenticated IAM Role to connect to the API,
            // instead of the Token from the user pool
            const result = await getHttp('/getNFTsCollectionAlchemy', myInit, true);
            console.log(result);
            setNftCards(await processAlchemyNFTsForCollection(result));
            setLoading(false);
        }
        catch (e) {
            setLoading(false);
            console.error(e);
            const error = e?.message;
            if (!error)
                error = e;
            alert("Something went wrong...\n" + error);
        }
    }

    return (
        <div className="container mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 text-white">

            <div>
                <p className="text-lg font-bold">NFT collection lookup</p>
                <p className="text-sm">Input the NFT contract address to get the NFTs in that collection. Any users can make those API calls even unauthenticated users. We use <strong>Alchemy</strong> as a provider.</p>
                <div className="flex flex-row gap-2 content-start mt-5">
                    <div className="flex-1">
                        <input className="text-[#3c4d6f] w-full p-2 rounded" onChange={event => setContract(event.target.value)} placeholder='NFT contract address' />
                    </div>
                    <div className="flex-none">
                        <button className="text-left bg-blue-500 hover:bg-blue-700 disabled:bg-blue-900 font-bold py-2 px-4 rounded" disabled={loading} onClick={onGetNFTsCollectionAlchemy}>
                            From HTTP Proxy
                        </button>
                    </div>
                </div>
            </div>

            <div className={user ? 'mt-10' : 'hidden'}>
                <p className="text-lg font-bold">Get my NFTs</p>
                <p className="text-sm">These API calls will return a list of NFTs owned by the current connected wallet.</p>
                
                <div className="flex flex-row mt-5">
                    <div className='bg-[#181e27] p-2 flex-none rounded'>
                        <div className="flex flex-row">
                            <div className="flex-none relative w-[22px] h-[20px] mr-1">
                                <Image layout='fill' src="/alchemy.png" ></Image>
                            </div>
                            <p className=" flex-none text-base font-bold">Alchemy</p>
                        </div>
                        <div className="flex-auto mt-2 items-start flex-col gap-2">
                            <div>
                                <button className="w-full text-left bg-blue-500 hover:bg-blue-700 disabled:bg-blue-900 font-bold py-2 px-4 rounded" disabled={loading} onClick={onGetNFTsAlchemy}>
                                    From HTTP Proxy
                                </button>
                            </div>
                            <div className="mt-2">
                                <button className="w-full text-left bg-blue-500 hover:bg-blue-700 disabled:bg-blue-900 font-bold py-2 px-4 rounded" disabled={loading} onClick={onGetNFTsAlchemyLambda}>
                                    From Lambda Proxy
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='bg-[#181e27] p-2 ml-2 flex-none rounded'>
                        <div className="flex flex-row">
                            <div className="flex-none relative w-[22px] h-[20px] mr-1">
                                <Image layout='fill' src="/moralis.png" ></Image>
                            </div>
                            <p className="text-base font-bold">Moralis</p>
                        </div>
                        <div className="flex-auto mt-2 items-start flex-col gap-2">
                            <div>
                                <button className="w-full text-left bg-blue-500 hover:bg-blue-700 disabled:bg-blue-900 font-bold py-2 px-4 rounded" disabled={loading} onClick={onGetNFTsMoralis}>
                                    From HTTP Proxy
                                </button>
                            </div>
                            <div className="mt-2">
                                <button className="w-full text-left bg-blue-500 hover:bg-blue-700 disabled:bg-blue-900 font-bold py-2 px-4 rounded" disabled={loading} onClick={onGetNFTsMoralisLambda}>
                                    From Lambda Proxy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                nftCards &&
                <div className={nftCards ? 'mt-10 bg-[#181e27] rounded' : 'hidden'}>
                    <div className="p-4 flex flex-row ">
                        <div className="flex-none relative w-[22px] h-[20px] mr-1">
                            <Image layout='fill' src={provider?.src} ></Image>
                        </div>
                        <p className="text-base font-bold">Output from {provider?.name} {type}</p>
                    </div>
                    <div className="p-4 ">
                        <NFTList nftCards={nftCards} />
                    </div>
                </div>
            }

        </div>
    );
};

export default Home;
