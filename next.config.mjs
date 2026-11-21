/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // [CRITÉRIO 5.1] O <Image> do Next só otimiza imagens de domínios autorizados.
    // As capas/screenshots vêm de vários hosts (Steam, Wikipedia...), então liberamos https.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};
export default nextConfig;
