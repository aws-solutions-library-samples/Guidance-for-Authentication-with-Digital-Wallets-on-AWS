// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import Image from 'next/image';
import { NFTList } from '../NFTList';

const NFTResults = ({ provider, type, nftCards, loading }) => {
  return (
    <div className="bg-[#181e27] rounded">
      <div className="p-4 flex flex-row">
        <div className="flex-none relative w-[22px] h-[20px] mr-1">
          <Image alt="Current Web3 provider logo" layout="fill" src={provider.src} />
        </div>
        <p className="text-base font-bold">
              Output from {provider.name} {type}
        </p>
      </div>
      <div className="p-4">
        <NFTList nftCards={nftCards} loading={loading}/>
      </div>
    </div> 
  );
};

export default NFTResults;
