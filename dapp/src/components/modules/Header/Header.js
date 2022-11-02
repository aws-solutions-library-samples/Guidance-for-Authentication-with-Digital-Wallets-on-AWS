import { Box, Container, Flex, HStack } from '@chakra-ui/react';
import { AppLogo, NavBar } from 'components/elements';
import { ConnectButton } from 'components/modules';

const Header = () => {
    return (
        <Box borderBottom="1px" borderBottomColor="chakra-border-color">
            <Container maxW="container.xl" p={'10px'}>
                <Flex align="center" justify="space-between">
                    <AppLogo />
                    <NavBar />
                    <HStack gap={'10px'}>
                        <ConnectButton />
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default Header;
