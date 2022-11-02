export const resolveIPFS = (url) => {
  if (!url || !url.includes('ipfs://')) {
    return url;
  }
  return url.replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_RESOLVER);
};
