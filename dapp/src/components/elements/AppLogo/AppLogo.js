import Image from 'next/image';

const AppLogo = () => {
  return (
    <Image
      src='/logo.png'
      height={50}
      width={309}
      alt="NFT Gallery logo"
    />
  );
};

export default AppLogo;
