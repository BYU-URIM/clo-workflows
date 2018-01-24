var path = require('path');
var webpack = require('webpack');


module.exports = function(env) {
    return {
        devtool: 'source-map',
        entry: './src/main.tsx',
        output: {
            filename: 'bundle.js',
            path: path.join(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        plugins: [
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(env.NODE_ENV)
            }),
            new webpack.HotModuleReplacementPlugin(),

        ]
    }
};