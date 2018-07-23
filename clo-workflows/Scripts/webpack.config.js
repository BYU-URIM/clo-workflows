const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")

module.exports = function(env) {
    const devMode = env.NODE_ENV === "sharepointProxy"

    const prodConfig = {
        entry: {
            bundle: "./src/main.tsx",
        },
        output: {
            filename: "[name].js",
            path: path.join(__dirname, "dist")
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                }),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    include: path.resolve(__dirname, "./src"),
                    exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    use: ["style-loader", "css-loader"],
                }
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            symlinks: false,
        },
        plugins: [
            new CleanWebpackPlugin(["dist/"]),
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(env.NODE_ENV),
            }),
            new ForkTsCheckerWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "./res/index.html",
            }),
        ],
    }
    const devConfig = {
        entry: {
            bundle: "./src/main.tsx",
        },
        output: {
            filename: "[name].js",
            path: path.join(__dirname, "dist"),
        },
        devtool: "inline-source-map",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    include: path.resolve(__dirname, "./src"),
                    exclude: /node_modules/,
                    options: {
                        transpileOnly: true,
                    },
                },
                {
                    test: /\.scss$/,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            symlinks: false,
        },
        plugins: [
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(env.NODE_ENV),
            }),
            new ForkTsCheckerWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "./res/index.html",
            }),
            // new WorkboxPlugin.InjectManifest({
            //     swSrc: "./src/sw.js",
            //     swDest: "sw.js",
            // }),
        ],
    }
    return devMode ? devConfig : prodConfig
}
