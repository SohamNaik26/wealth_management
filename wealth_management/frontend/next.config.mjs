/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  dest: "public",
};

export default withPWA(nextConfig);
