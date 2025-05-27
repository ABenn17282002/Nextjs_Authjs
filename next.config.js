/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google OAuth の画像
      "avatars.githubusercontent.com", // GitHub のプロフィール画像
    ],
  },
};

module.exports = nextConfig;