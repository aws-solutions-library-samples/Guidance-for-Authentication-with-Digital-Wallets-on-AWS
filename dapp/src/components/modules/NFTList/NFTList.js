// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const NFTList = ({ nftCards }) => {
  if (!nftCards) {
    return (<></>);
  }

  return (
    <>
      <div className="grid grid-cols-4 grid-flow-row gap-4">
        {nftCards} 
      </div>
    </>
  );
};

export default NFTList;
