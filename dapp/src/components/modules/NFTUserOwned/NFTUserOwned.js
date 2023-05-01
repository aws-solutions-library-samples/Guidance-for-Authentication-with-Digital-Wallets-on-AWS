// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import Image from 'next/image';
import { Button } from '../../elements/Button';

const NFTUserOwned = ({loading, providers}) => {
  return (
    <div>
      <p className="text-lg font-bold">Get my NFTs</p>
      <p className="text-sm">
        These API calls will return a list of NFTs owned by the current
        connected wallet.
      </p>

      <div className="flex flex-row mt-5 gap-2">
        {providers.map(({name, getProxy, getLambda}) => {
          return <div key={name} className="bg-[#181e27] p-2 rounded">
            <div className="flex flex-row items-center">
              <div className="flex-none relative w-[22px] h-[20px] mr-1">
                <Image alt={`${name} logo`} layout="fill" src={`/${name.toLowerCase()}.png`} />
              </div>
              <p className=" flex-none text-base font-bold">Alchemy</p>
            </div>
            <div className="flex-auto mt-2 items-start flex-col gap-2">
              <div>
                <Button disabled={loading} onClick={getProxy}>
                  From HTTP Proxy
                </Button>
              </div>
              <div className="mt-2">
                <Button disabled={loading} onClick={getLambda}>
                  From Lambda Proxy
                </Button>
              </div>
            </div>
          </div>;
        })}
      </div>
    </div>
  );
};

export default NFTUserOwned;
