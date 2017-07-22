var webpack = require('webpack')

module.exports = {
    entry: './application.js',
    output: {
        filename: '../jsx/main.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel",
                query: {
                    presets: ['react', 'es2015']
                }
            },
            { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf$/,  loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot$/,  loader: "file-loader" },
            { test: /\.svg$/,  loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },

        ]
    }
}
