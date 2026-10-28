/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow local LAN development when opening the app from another device.
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.56.1"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
