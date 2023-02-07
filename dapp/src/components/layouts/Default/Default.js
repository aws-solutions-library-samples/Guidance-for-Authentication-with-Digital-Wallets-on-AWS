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
                <meta name="og:title" content={"NFT Gallery - " + pageName} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <Header />
            <div className="container mx-auto">
                {children}
            </div>
            <Footer />
        </div>
    );
}