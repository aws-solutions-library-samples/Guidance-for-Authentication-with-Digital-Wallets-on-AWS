import { NFTCard } from '../NFTCard';

const NFTList = ({ provider, nfts }) => {
  if (!provider || !nfts) {
    return (<></>);
  }

  const providerName = provider?.name.toLowerCase();
  let listItems = [];

  const processAlchemyNFTs = () => {
    if (!nfts?.ownedNfts.length) {
      return;
    }

    let collection = [];
    for (let i = 0; i < nfts.ownedNfts.length; i++) {
      let nft = {
        title: nfts.ownedNfts[i].title,
        description: nfts.ownedNfts[i].description,
        thumbnail: nfts.ownedNfts[i].media[0].thumbnail,
        image: nfts.ownedNfts[i].media[0].gateway,
      }
      collection.push(nft);
    }

    listItems = collection.map((nft) => <NFTCard nft={nft} />);
  }

  const processMoralisNFTs = () => {
    let collection = [];
  }

  switch (providerName) {
    case "alchemy":
      processAlchemyNFTs();
      break;
    case "moralis":
      processMoralisNFTs();
      break;
    default:
      return (<></>);
  }

  return (
    <>
      <div class="grid grid-rows-4 grid-flow-col gap-4">
        {listItems} 
      </div>
    </>
  );
};

export default NFTList;
