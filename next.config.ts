/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    // ✅ Next.jsで外部画像（例: Unsplash）を許可するドメイン
    domains: ['images.unsplash.com'],

    // ✅ ここが今回追加した重要な部分！
    // Azure Blob Storage上の店舗画像（image_url）の読み込みを許可
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blobstep32.blob.core.windows.net', // ← ここがblobのホスト名
        pathname: '/**', // ← すべてのパスを許可
      },
    ],
  },
};

module.exports = nextConfig;
