// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import Head from 'next/head';
import { Footer, Header } from 'components/modules';

export default function Default({ children, pageName }) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Access your NFT collection easily"
        />
        <meta name="og:title" content={'NFT Gallery - ' + pageName} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />
      <div className="bg-[#374151] pt-10 pb-10">
        {children}
      </div>
      <Footer />
    </div>
  );
}