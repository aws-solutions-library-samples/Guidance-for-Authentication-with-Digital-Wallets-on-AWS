// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Button } from '../../elements/Button';

const NFTLookup = ({ onLookup, onContractAddressChange, loading }) => {
  return (
    <div>
      <p className="text-lg font-bold">NFT collection lookup</p>
      <p className="text-sm">
          Input the NFT contract address to get the NFTs in that collection. Any
          users can make this API call, even unauthenticated users. We use <strong>Alchemy</strong> as provider.
      </p>
      <form className="flex flex-row gap-2 content-start mt-5" 
        onSubmit={onLookup}>
        <div className="flex-1">
          <input
            className="text-[#3c4d6f] w-full p-2 rounded"
            onChange={onContractAddressChange}
            placeholder="NFT contract address"
            required
            title='Please provide a contract address'
          />
        </div>
        <div className="flex-none">
          <Button
            disabled={loading}
            type='submit'
          >
              From HTTP Proxy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NFTLookup;
