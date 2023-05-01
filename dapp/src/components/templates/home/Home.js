// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useState, useEffect, useContext } from 'react';
import { getHttp } from 'utils/api';
import { GlobalContext } from 'context/UserContext';
import * as nftParserFunctions from 'utils/nftParser';
import { respondToError } from 'utils/responses';
import { NFTLookup } from 'components/modules/NFTLookup';
import { NFTUserOwned } from 'components/modules/NFTUserOwned';
import { NFTResults } from 'components/modules/NFTResults';

function getProvider(providerName) {
  return { name: providerName, src: `/${providerName.toLowerCase()}.png`};
}

const Home = () => {
  const [user] = useContext(GlobalContext);
  const [nftCards, setNftCards] = useState(null);
  const [provider, setProvider] = useState(getProvider('Alchemy'));
  const [type, setType] = useState('Proxy');
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    console.log('User Has changed', user);
    if (!user)
      setNftCards(null);
  }, [user]);

  // Helper function to make HTTP requests for NFTs and process the results

  const fetchNfts = async ({providerName, requestOrigin, isCollection = false, amplifyRequestInit, useIAMRole = false}) => {
    // Update state

    const provider = getProvider(providerName);

    setLoading(true);
    setProvider(provider);
    setType(requestOrigin);
    setNftCards([]);

    // Build the HTTP request path

    let fetchPath = '/getNFTs';

    if (isCollection) {
      fetchPath += `Collection${providerName}`;
    } else {
      fetchPath += providerName;

      if (requestOrigin == 'Lambda') {
        fetchPath += requestOrigin;
      }
    }

    // Build the parser function name

    const parserFunctionName = `process${providerName}Nfts`;
    
    // Make request and process the results

    try {
      const result = await getHttp(fetchPath, amplifyRequestInit, useIAMRole);
      const processedResults = await nftParserFunctions[parserFunctionName](result);

      setNftCards(processedResults);
    } catch (error) {
      respondToError('Could not fetch NFTs', error);
    }

    setLoading(false);
  };

  /* Unathenticated request for NFT Collection */

  // API call getNFTsCollection from Alchemy using API Gateway HTTP proxy
  // Takes in a contract address and returns all the NFTs in that collection
  const onGetNFTsCollectionAlchemy = (event) => {
    event.preventDefault();

    fetchNfts({providerName: 'Alchemy', requestOrigin: 'Proxy', isCollection: true, useIAMRole: true, amplifyRequestInit: {
      queryStringParameters: {
        contractAddress: contract,
      }
    }});
  };

  /* Authenticated requests for user's owned NFTs */

  // getNFTs from Alchemy using API Gateway Lambda proxy
  const onGetNFTsAlchemyLambda = () => {
    fetchNfts({providerName: 'Alchemy', requestOrigin: 'Lambda'});
  };

  // getNFTs from Alchemy using API Gateway HTTP proxy
  const onGetNFTsAlchemy = () => {
    fetchNfts({providerName: 'Alchemy', requestOrigin: 'Proxy'});
  };

  // getNFTs from Moralis using API Gateway Lambda proxy
  const onGetNFTsMoralisLambda = () => {
    fetchNfts({providerName: 'Moralis', requestOrigin: 'Lambda'});
  };

  // getNFTs to Moralis using API Gateway HTTP proxy
  const onGetNFTsMoralis = () => {
    fetchNfts({providerName: 'Moralis', requestOrigin: 'Proxy', amplifyRequestInit: {
      queryStringParameters: {
        chain: 'eth',
      },
    }});
  };

  return (
    <div className="container mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 text-white flex flex-col gap-7">
      <NFTLookup loading={loading} onLookup={onGetNFTsCollectionAlchemy} onContractAddressChange={(event) => setContract(event.target.value)} />
      {user ? <NFTUserOwned loading={loading} providers={[
        {
          name: 'Alchemy',
          getProxy: onGetNFTsAlchemy,
          getLambda: onGetNFTsAlchemyLambda
        },
        {
          name: 'Moralis',
          getProxy: onGetNFTsMoralis,
          getLambda: onGetNFTsMoralisLambda
        }
      ]} />: null}
      {nftCards ? <NFTResults loading={loading} provider={provider} type={type} nftCards={nftCards} /> : null}
    </div>
  );
};

export default Home;
