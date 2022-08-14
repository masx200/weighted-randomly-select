import { defineConfig } from "rollup";
import ts from "rollup-plugin-ts";
export default defineConfig({
    output: [
        { file: "./index.js", format: "cjs" },
        { file: "./index.mjs", format: "esm" },
    ],
    input: "./src/index.ts",
    plugins: [ts()],
});
