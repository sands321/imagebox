/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerPKG } from "@electron-forge/maker-pkg";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    // x64/arm64
    //@ts-ignore
    // arch: "x64",
    asar: {
      //默认:'**/*.node'
      // unpack: "**",
    },
    icon: "./build/icon",
    appBundleId: "com.sands.imagebox",
    buildVersion: "2024053101",
    osxSign: {
      //1.无效id略过签名(空串不行),2.yarn package/make可签名
      identity: "U8M4Y9X4GN",
      //@ts-ignore
      // platform: "mas",
      provisioningProfile: "./key/imagebox.provisionprofile",
      optionsForFile: () => {
        return {
          entitlements: "./build/entitlements.mac.plist",
          "entitlements-inherit": "./build/entitlements.mac.plist",
          hardenedRuntime: false,
        };
      },
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    // new MakerZIP({}, ["darwin"]),
    new MakerPKG({}, ["darwin", "mas"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      devContentSecurityPolicy:
        // "script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
        "default-src * 'unsafe-inline' 'unsafe-eval'",
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/renderer/index.html",
            js: "./src/renderer/renderer.tsx",
            name: "main_window",
            preload: {
              js: "./src/renderer/preload.ts",
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
