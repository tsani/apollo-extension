const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        background: './src/app/background.ts',
        popup: './src/app/popup.tsx',
        download: './src/app/download.ts',
        settings: './src/app/settings.tsx'
    },
    optimization: {
        splitChunks: {
            // chunks: 'all'
            // cacheGroups: cacheGroupsFor("", "import", "readme")
        }
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    plugins: [
        // new CleanWebpackPlugin(),
        // new MiniCssExtractPlugin({ filename: "[name].css" }),
        // {
        //     apply: (compiler) => {
        //         compiler.plugin("compilation", function (compilation, params) {
        //             params.normalModuleFactory.plugin("parser", function (parser) {
        //                 parser.plugin("expression global", function expressionGlobalPlugin() {
        //                     this.state.module.addVariable("global", "(function() { return this; }())")
        //                     return false
        //                 })
        //             })
        //         })
        //     }
        // }
    ],
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            'webextension-polyfill-ts': path.resolve(path.join(__dirname, 'node_modules', 'webextension-polyfill-ts'))
        },
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            // {
            //     test: /\.s?css$/,
            //     use: [
            //         MiniCssExtractPlugin.loader,
            //         { loader: "css-loader", options: { url: false, sourceMap: true } },
            //         { loader: "sass-loader", options: { sourceMap: true } }
            //     ]
            // },
            // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

            // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
    }
};
