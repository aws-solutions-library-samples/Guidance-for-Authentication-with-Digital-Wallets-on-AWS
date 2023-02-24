import { Eth } from '@web3uikit/icons';
import Image from 'next/Image';

const NFTCard = ({ nft }) => {

  return (
    <>
      <div className="p-3 rounded bg-white text-black">
        <div className="max-h-[256px] overflow-hidden">
          <Image
            src={nft.thumbnail}
            alt={'nft'}
            height="260"
            width="260"
          />
        </div>
        <div className="mt-1 font-bold">
          {nft.title}
        </div>
        <div className="text-center flex flex-row gap-2">
          <div className="font-medium text-sm flex-none">
            {nft.contract_type}
          </div>
          <Eth fontSize="20px flex-none" />
        </div>
      </div>
    </>
  );
};

export default NFTCard;
