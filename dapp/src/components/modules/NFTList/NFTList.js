// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0


const NFTList = ({ nftCards, loading}) => {

  if (!nftCards) {
    return null;
  }

  let listContent;

  if (nftCards.length) {
    listContent = (
      <div className="grid grid-cols-4 grid-flow-row gap-4">
        {nftCards}
      </div>
    );
  } else if (!loading) {
    listContent = (
      <p className="text-base">
        No NFTs found
      </p>
    );
  }

  return listContent;
};

export default NFTList;
