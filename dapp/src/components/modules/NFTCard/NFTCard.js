// import { Eth } from '@web3uikit/icons';
// import { resolveIPFS } from 'utils/resolveIPFS';
import Image from 'next/Image';

const NFTCard = ({ nft }) => {
  // const bgColor = useColorModeValue('none', 'gray.700');
  // const borderColor = useColorModeValue('gray.200', 'gray.700');
  // const descBgColor = useColorModeValue('gray.100', 'gray.600');

  return (
    <>
      {/* <div>
        {nft.title}
      </div> */}

      <div bgColor={bgColor} padding={3} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
        <div maxHeight="260px" overflow={'hidden'} borderRadius="xl">
          <Image
            src={resolveIPFS(metadata?.image)}
            alt={'nft'}
            minH="260px"
            minW="260px"
            divSize="100%"
            objectFit="fill"
          />
        </div>
        <div mt="1" fontWeight="semibold" as="h4" noOfLines={1} marginTop={2}>
          {nft.title}
        </div>
        <HStack alignItems={'center'}>
          <div as="h4" noOfLines={1} fontWeight="medium" fontSize="smaller">
            {contractType}
          </div>
          <Eth fontSize="20px" />
        </HStack>
        <SimpleGrid columns={2} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
          <div>
            <div as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
              Symbol
            </div>
            <div as="h4" noOfLines={1} fontSize="sm">
              {symbol}
            </div>
          </div>
          <div>
            <div as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
              Amount
            </div>
            <div as="h4" noOfLines={1} fontSize="sm">
              {amount}
            </div>
          </div>
        </SimpleGrid>
      </div>
    </>
  );
};

export default NFTCard;
