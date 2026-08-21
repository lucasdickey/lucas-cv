import { Config } from "@remotion/cli/config";

// Book covers live in the Next.js public directory; reuse them rather than
// keeping a second copy in sync.
Config.setPublicDir("../public");
Config.setEntryPoint("./src/index.ts");
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);
