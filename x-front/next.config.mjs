/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // output: "export", // for static "out" folder
  output: "standalone", // for dockerized app
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
    // trailingSlash: true,
  },
};

export default nextConfig;
