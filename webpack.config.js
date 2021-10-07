// webpack.config.js
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        //presets: ['@babel/preset-env']
						"presets": [
							[ "@babel/preset-env", {
							  "targets": {
								"browsers": [ "last 1 version", "ie >= 11" ]
							  }
							}]
						  ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'https://lk.veramed.ru/vmedG/',
                secure: false,
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
              },
          },
        },
      
    // resolve: {
    //     alias: {
    //         'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    //     }
    // },
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin()
    ]
}