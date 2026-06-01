const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('ttf');
config.resolver.assetExts.push('otf');

module.exports = withNativeWind(config, { input: "./app/global.css" });
