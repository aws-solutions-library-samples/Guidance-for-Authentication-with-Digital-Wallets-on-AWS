// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { NFTCard } from "../components/modules/NFTCard";
import { FetchWrapper } from "use-nft";
import { promiseAllSettled } from "./promises";

const getNftCards = (nfts) => {
  return []
    .concat(nfts)
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((nft) => <NFTCard key={nft.name + nft.id} nft={nft} />);
};

export const processMoralisNfts = async (apiResult) => {
  if (!apiResult?.result?.length) {
    return [];
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
      return `https://cloudflare-ipfs.com/ipfs/${cid}${path}`;
    },
  });

  const nfts = [];

  // Iterate through the list of nfts coming from Moralis and
  // fetch the JSON metadata file for each NFT in parallel using Promises
  const { failures } = await promiseAllSettled(
    apiResult.result.map(async (nft) => {
      // We only get basic token metadata from Moralis
      const myNftObj = {
        id: nft.token_id,
        contractType: nft.contract_type,
        symbol: nft.symbol,
        amount: nft.amount,
      };

      const result = await fetchWrapper.fetchNft(
        nft.token_address,
        nft.token_id
      );
      console.log(result);

      // Enriching our object with what we extracted from the .json file
      myNftObj.description = result.description;
      myNftObj.title = result.name;
      myNftObj.thumbnail = result.image;

      console.log(myNftObj);

      nfts.push(myNftObj);
    })
  );

  if (failures.length) {
    console.error("Failed to fetch some Moralis NFT metadata", failures);
  }

  return getNftCards(nfts);
};

export const processAlchemyNfts = (apiResult) => {
  const alchemyNfts = apiResult?.ownedNfts || apiResult?.nfts;

  if (!alchemyNfts) {
    return;
  }

  const nfts = alchemyNfts.map((alchemyNft) => {
    return {
      id: alchemyNft.id?.tokenId,
      title: alchemyNft.name,
      description: alchemyNft.description,
      thumbnail: alchemyNft.image?.thumbnailUrl,
      image: alchemyNft.image?.cachedUrl,
      contractType: alchemyNft.contractMetadata
        ? alchemyNft.contractMetadata.tokenType
        : alchemyNft.contract.tokenType,
      symbol: alchemyNft.contractMetadata
        ? alchemyNft.contractMetadata.symbol
        : alchemyNft.contract.symbol,
      amount: alchemyNft.balance,
    };
  });

  console.log(nfts);

  return getNftCards(nfts);
};
