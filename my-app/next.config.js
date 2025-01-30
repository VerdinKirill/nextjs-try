/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    transpilePackages: [
        '@gravity-ui/icons',
        'bem-cn-lite',
        '@gravity-ui/uikit',
        // Remove @gravity-ui/uikit from here
    ],
};

module.exports = nextConfig;
