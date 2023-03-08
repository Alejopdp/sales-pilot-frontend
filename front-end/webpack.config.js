const path = require('path')

module.exports = {
    entry: {
        sidebar: './src/index.tsx',
    },
    output: {
        filename: 'main.js',
        publicPath: 'chrome-extension://enkbjolcglilknggjlngokegcfgpebnl/react/js/',
        path: path.resolve('../react/js'),
        library: {
            type: 'var',
            name: 'script',
        },
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.ts|tsx$/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: 'css-loader',
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
}
