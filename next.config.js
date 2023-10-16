const withPWA = require("next-pwa");
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
  }),
  env: {
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    CMS_API_TOKEN: process.env.CMS_API_TOKEN,
  },
};

module.exports = nextConfig;
