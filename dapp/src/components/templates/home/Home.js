import { useAccount } from 'wagmi';
import { useState, useEffect, useContext } from 'react';
import { checkUser } from 'utils/user';
import { getHttp } from 'utils/api';
import Image from 'next/Image';

import ContextProvider, { GlobalContext } from 'context/UserContext';
import { NFTList } from 'components/modules/NFTList';

const Home = () => {
    const [user, setUser] = useContext(GlobalContext);
    const [nfts, setNFTs] = useState(null);
    const [provider, setProvider] = useState(null);
    const [type, setType] = useState(null);
    const { isConnected } = useAccount();
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
            alert("Something went wrong...\n" + error);
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
            alert("Something went wrong...\n" + error);
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
            alert("Something went wrong...\n" + error);
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
            alert("Something went wrong...\n" + error);
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
            alert("Something went wrong...\n" + error);
        }
    }

    return (
        <>
        <div className="container mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 text-white mt-10">
            <div>
                <p className="text-lg font-bold">Get my NFTs</p>
                <p className="text-sm">These API calls will return a list of NFTs owned by the current connected wallet.</p>

                <div className="flex flex-row mt-5">
                    <div className='bg-[#181e27] p-2 flex-none'>
                        <div className="flex flex-row">
                            <div className="flex-none relative w-[22px] h-[20px] mr-1">
                                <Image layout='fill' src="/alchemy.png" ></Image>
                            </div>
                            <p className=" flex-none text-base font-bold">Alchemy</p>
                        </div>
                        <div className="flex-auto mt-2 items-start flex-col gap-2">
                            <div>
                                <button className="w-full text-left bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded" onClick={onGetFromAlchemyProxy}>
                                    /getFromProxy
                                </button>
                            </div>
                            <div className="mt-2">
                                <button className="w-full text-left bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded" onClick={() => onGetFromLambda({ name: 'Alchemy', src: '/alchemy.png' }, "getNFTs")}>
                                    /getFromLambda
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='bg-[#181e27] p-2 ml-2 flex-none'>
                        <div className="flex flex-row">
                            <div className="flex-none relative w-[22px] h-[20px] mr-1">
                                <Image layout='fill' src="/moralis.png" ></Image>
                            </div>
                            <p className="text-base font-bold">Moralis</p>
                        </div>
                        <div className="flex-auto mt-2 items-start flex-col gap-2">
                            <div>
                                <button className="w-full text-left bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded" onClick={onGetFromMoralisProxy}>
                                    /getFromProxy
                                </button>
                            </div>
                            <div className="mt-2">
                                <button className="w-full text-left bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded" onClick={() => onGetFromLambda({ name: 'Moralis', src: '/moralis.png' }, "getNFTs")}>
                                    /getFromLambda
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <p className="text-lg font-bold">NFT collection lookup</p>
                <p className="text-sm">Input the NFT contract address to get the NFTs in that collection. Any users can make those API calls even unauthenticated users. We use <strong>Alchemy</strong> as a provider.</p>
                <div className="flex flex-row gap-2 content-start mt-5">
                    <div className="flex-1">
                        <input className="text-[#3c4d6f] w-full p-2 rounded" placeholder='NFT contract address' />
                    </div>
                    <div className="flex-none">
                        <button className="text-left bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded" onClick={onGetCollectionAlchemyProxy}>
                            /getFromProxy
                        </button>
                    </div>
                    <div className="flex-none">
                        <button className="text-left bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded" onClick={() => onGetFromLambda({ name: 'Alchemy', src: '/alchemy.png' }, "getCollection")}>
                            /getFromLambda
                        </button>
                    </div>
                </div>
            </div>

            {
                loggedIn &&
                <div className={provider ? 'mt-10' : 'hidden'}>
                    <div className="p-4 flex flex-row bg-[#181e27]">
                        <div className="flex-none relative w-[22px] h-[20px] mr-1">
                            <Image layout='fill' src={provider?.src} ></Image>
                        </div>
                        <p className="text-base font-bold">Output from {provider?.name} {type}</p>
                    </div>
                    <div className="p-4 bg-[#181e27]">
                        <div>
                            {nfts ? JSON.stringify(nfts) : 'No result'}
                        </div>
                        <NFTList provider={provider} nfts={nfts} />
                    </div>
                </div>
            }

        </div>
        </>
    );
};

export default Home;
