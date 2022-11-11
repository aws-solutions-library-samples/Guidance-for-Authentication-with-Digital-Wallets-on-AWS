import Head from 'next/head';
import { Container } from '@chakra-ui/react';
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
            <Container maxW="container.lg" p={3} marginTop={30} as="main" minH="70vh">
                {children}
            </Container>
            <Footer />
        </div>
    );
}