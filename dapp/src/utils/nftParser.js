import { NFTCard } from '../components/modules/NFTCard';
import {Agent} from '@zoralabs/nft-metadata';

const sortNFTCards = (nfts) => {
  return [].concat(nfts)
    .sort((a, b) => a.title > b.title ? 1 : -1)
    .map((nft, i) => 
      <NFTCard key={nft.name + nft.id} nft={nft} />
    );
}

export const processMoralisNFTs = async (apiResult) => {
    if (!apiResult?.result.length) {
      return;
    }

    let nfts = [];

    // To store the list of NFTs to display
    // Agent to resolve JSON metadata files
    const parser = new Agent({
        // Use ethers.js Networkish here: numbers (1/4) or strings (homestead/rinkeby) work here
        network: 'mainnet',
        // Timeout: defaults to 40 seconds, recommended timeout is 60 seconds (in milliseconds)
        timeout: 60 * 1000,
    })

    // Iterate through the list of nfts coming from Moralis and
    // fetch the JSON metadata file for each NFT in parralel using Promises
    await Promise.all(apiResult.result.map(async nft => {
      console.log(nft);

      let myNftObj = {
        id: nft.token_id,
        contract_type: nft.contract_type,
        symbol: nft.symbol,
        amount: nft.amount
      }

      await parser.fetchMetadata(nft.token_address, nft.token_id).then((data) => {
        console.log("After NFT lookup:", data);
        myNftObj.description = data?.description;
        myNftObj.title = data?.name;
        myNftObj.thumbnail = data?.imageURL;
      })

      console.log("Pushing");
      nfts.push(myNftObj);

    }));

    const nftCards = sortNFTCards(nfts);

    return(nftCards);
}

export const processAlchemyNFTs = async (apiResult) => {
    if (!apiResult?.ownedNfts.length) {
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