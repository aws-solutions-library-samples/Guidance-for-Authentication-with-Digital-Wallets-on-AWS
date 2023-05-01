// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import Image from 'next/image';

const AppLogo = () => {
  return (
    <Image
      src='/logo.png'
      height={35}
      width={309}
      alt="NFT Gallery logo"
    />
  );
};

export default AppLogo;
