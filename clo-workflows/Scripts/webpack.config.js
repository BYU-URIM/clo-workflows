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
            app: "./src/main.tsx",
        },
        output: {
            filename: "[name].js",
            path: path.join(__dirname, "dist"),
            chunkFilename: "[name].js",
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                }),
                new OptimizeCSSAssetsPlugin({}),
            ],
            runtimeChunk: {
                name: "manifest",
            },
            splitChunks: {
                cacheGroups: {
                    react: {
                        test: /[\\/]node_modules[\\/]react[\\/]/,
                        name: "react",
                        priority: -20,
                        chunks: "all",
                    },
                    office: {
                        test: /[\\/]node_modules[\\/]office-ui-fabric-react[\\/]/,
                        name: "office",
                        priority: -20,
                        chunks: "all",
                    },
                },
            },
        },
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
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            symlinks: false,
        },
        plugins: [
            new CleanWebpackPlugin(["dist/"]),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css",
            }),
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
            app: "./src/main.tsx",
        },
        output: {
            filename: "[name].js",
            path: path.join(__dirname, "dist"),
        },
        devtool: "cheap-module-eval-source-map",
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
