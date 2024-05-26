import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";

export const mainConfig: Configuration = {
  entry: "./src/main/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  externals: {
    "pg-hstore": "commonjs pg-hstore",
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    alias: {
      //sequelize-typescript注解需
      "@models": path.resolve(__dirname, "src/lib/models"),
    },
  },
};
