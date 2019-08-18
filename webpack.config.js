const path = require("path");
// import * as path from "path";

module.exports = {
    entry: [
        "./source/index.ts",
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: ".min.js",
        library: "",
        libraryTarget: "var",
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/u,
                loader: "ts-loader",
                exclude: /node_modules/u,
            },
        ],
    },
    optimization: {
        minimize: true,
    },
    target: "web",
};
