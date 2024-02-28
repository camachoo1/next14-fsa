/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aloclonebucket.s3.us-west-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
