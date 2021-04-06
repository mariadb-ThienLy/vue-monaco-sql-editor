const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
    chainWebpack: (config) => {
        config.when(process.env.NODE_ENV === 'production', (config) => {
            config.optimization.splitChunks({
                chunks: 'all',
                maxSize: 250000,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                            )[1]
                            return `npm.${packageName.replace('@', '')}`
                        },
                    },
                },
            })
            config.performance.hints(false)
        })
        config
            .plugin('clean')
            .use(MonacoEditorPlugin, [{ languages: ['sql'], features: ['!gotoSymbol'] }])
    },
    productionSourceMap: false,
}
