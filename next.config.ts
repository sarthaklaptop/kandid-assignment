import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "randomuser.me",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "github.com",
      "cdn.jsdelivr.net",
    ],
  },
};

export default nextConfig;
