// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { NFTCard } from '../components/modules/NFTCard';
import { FetchWrapper } from "use-nft"

const sortNFTCards = (nfts) => {
  return [].concat(nfts)
    .sort((a, b) => a.title > b.title ? 1 : -1)
    .map((nft, i) => 
      <NFTCard key={nft.name + nft.id} nft={nft} />
    );
}

export const processMoralisNFTs = async (apiResult) => {
    if (!apiResult?.result?.length) {
      return;
    }

    const ethereum = window.ethereum;
    const fetcher = ["ethereum", { ethereum }];
    // The wrapper will be used to fetch our metadata files from http and ipfs hosts
    const fetchWrapper = new FetchWrapper(fetcher, {
      jsonProxy: (url) => {
        // Here we use our CORS proxy to avoid CORS issues
        return process.env.NEXT_PUBLIC_CORS_PROXY + url;
      },
      ipfsUrl: (cid, path = "") => {
        return `https://ipfs.io/ipfs/${cid}${path}`
      }
    })

    let nfts = [];

    // Iterate through the list of nfts coming from Moralis and
    // fetch the JSON metadata file for each NFT in parralel using Promises
    await Promise.all(apiResult.result.map(async nft => {
      console.log(nft);

      // We only get basic token metadata from Moralis
      let myNftObj = {
        id: nft.token_id,
        contract_type: nft.contract_type,
        symbol: nft.symbol,
        amount: nft.amount
      }

      try {
        // We fetch the .json file associated with the token to get the rest of the metadata
        const result = await fetchWrapper.fetchNft(
          nft.token_address,
          nft.token_id
        )

        if (!result) 
          throw ("Error getting NFT Metadata: " + result);
      
        // Enrishing our object with what we extracted from the .json file
        myNftObj.description = result.description;
        myNftObj.title = result.name;
        myNftObj.thumbnail = result.image;
      }
      catch (e) {
        console.log(e);
      }

      nfts.push(myNftObj);

    }));

    const nftCards = sortNFTCards(nfts);

    return(nftCards);
}

export const processAlchemyOwnedNfts = async (apiResult) => {
    if (!apiResult?.ownedNfts?.length) {
      return;
    }

    // Reset list Items
    let nfts = [];

    // Iterate through the list of nfts
    for (let i = 0; i < apiResult.ownedNfts.length; i++) {
      console.log(apiResult.ownedNfts[i]);

      // Alchemy provides NFT Metadata from JSON out of the box
      // They also provide IPFS Gateway resolution and thumbnail feature
      let myNftObj = {
        id: apiResult.ownedNfts[i]?.id?.tokenId,
        title: apiResult.ownedNfts[i]?.title,
        description: apiResult.ownedNfts[i]?.description,
        thumbnail: apiResult.ownedNfts[i]?.media[0]?.thumbnail,
        image: apiResult.ownedNfts[i]?.media[0]?.gateway,
        contract_type: (apiResult.ownedNfts[i]?.contractMetadata? apiResult.ownedNfts[i]?.contractMetadata.tokenType : apiResult.ownedNfts[i]?.contract.tokenType),
        symbol: (apiResult.ownedNfts[i]?.contractMetadata? apiResult.ownedNfts[i]?.contractMetadata.symbol : apiResult.ownedNfts[i]?.contract.symbol),
        amount: apiResult.ownedNfts[i]?.balance
      }
      nfts.push(myNftObj);
    }

    const nftCards = sortNFTCards(nfts);

    return(nftCards);
}

export const processAlchemyNFTsForCollection = async (apiResult) => {
  if (!apiResult?.nfts?.length) {
    return;
  }

  // Reset list Items
  let nfts = [];

  // Iterate through the list of nfts
  for (let i = 0; i < apiResult.nfts.length; i++) {
    console.log(apiResult.nfts[i]);

    // Alchemy provides NFT Metadata from JSON out of the box
    // They also provide IPFS Gateway resolution and thumbnail feature
    let myNftObj = {
      id: apiResult.nfts[i]?.id?.tokenId,
      title: apiResult.nfts[i]?.title,
      description: apiResult.nfts[i]?.description,
      thumbnail: (apiResult.nfts[i]?.media[0]?.thumbnail? apiResult.nfts[i]?.media[0]?.thumbnail : apiResult.nfts[i]?.media[0]?.gateway),
      image: apiResult.nfts[i]?.media[0]?.gateway,
      contract_type: (apiResult.nfts[i]?.contractMetadata? apiResult.nfts[i]?.contractMetadata.tokenType : apiResult.nfts[i]?.contract.tokenType),
      symbol: (apiResult.nfts[i]?.contractMetadata? apiResult.nfts[i]?.contractMetadata.symbol : apiResult.nfts[i]?.contract.symbol),
      amount: apiResult.nfts[i]?.balance
    }
    nfts.push(myNftObj);
  }

  const nftCards = sortNFTCards(nfts);

  return(nftCards);
}