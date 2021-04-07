const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
    chainWebpack: (config) => {
        config
            .plugin('clean')
            .use(MonacoEditorPlugin, [{ languages: ['sql'], features: ['!gotoSymbol'] }])
    },
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? '/sql-monaco/' : '/',
}
