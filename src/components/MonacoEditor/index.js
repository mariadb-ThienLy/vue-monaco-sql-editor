import { format } from 'sql-formatter'

export default {
    name: 'MonacoEditor',
    props: {
        value: { type: String, required: true },
        language: { type: String, required: true },
        options: { type: Object, default: () => {} },
        dist: { type: Array, default: () => [] },
    },

    model: {
        prop: 'value',
        event: 'change',
    },

    mounted() {
        this.monaco = require('monaco-editor')
        this.$nextTick(() => {
            this.initMonaco(this.monaco)
        })
    },

    beforeDestroy() {
        if (this.editor) this.editor.dispose()
    },

    methods: {
        mariadbFormatter(v) {
            return format(v, {
                language: 'mariadb',
                indent: '    ',
                uppercase: true,
                linesBetweenQueries: 1,
            })
        },
        initMonaco(monaco) {
            monaco.editor.defineTheme('myCustomTheme', {
                base: 'vs',
                inherit: false, // false to completely replace the builtin rules
                rules: [
                    { token: '', foreground: '000000', background: 'fffffe' },
                    { token: 'invalid', foreground: 'cd3131' },
                    { token: 'emphasis', fontStyle: 'italic' },
                    { token: 'strong', fontStyle: 'bold' },

                    { token: 'variable', foreground: '001188' },
                    { token: 'variable.predefined', foreground: '4864AA' },
                    { token: 'constant', foreground: 'dd0000' },
                    { token: 'comment', foreground: '008000' },
                    { token: 'number', foreground: '09885A' },
                    { token: 'number.hex', foreground: '3030c0' },
                    { token: 'regexp', foreground: '800000' },
                    { token: 'annotation', foreground: '808080' },
                    { token: 'type', foreground: '008080' },

                    { token: 'delimiter', foreground: '000000' },
                    { token: 'delimiter.html', foreground: '383838' },
                    { token: 'delimiter.xml', foreground: '0000FF' },

                    { token: 'tag', foreground: '800000' },
                    { token: 'tag.id.jade', foreground: '4F76AC' },
                    { token: 'tag.class.jade', foreground: '4F76AC' },
                    { token: 'meta.scss', foreground: '800000' },
                    { token: 'metatag', foreground: 'e00000' },
                    { token: 'metatag.content.html', foreground: 'FF0000' },
                    { token: 'metatag.html', foreground: '808080' },
                    { token: 'metatag.xml', foreground: '808080' },
                    { token: 'metatag.php', fontStyle: 'bold' },

                    { token: 'key', foreground: '863B00' },
                    { token: 'string.key.json', foreground: 'A31515' },
                    { token: 'string.value.json', foreground: '0451A5' },

                    { token: 'attribute.name', foreground: 'FF0000' },
                    { token: 'attribute.value', foreground: '0451A5' },
                    { token: 'attribute.value.number', foreground: '09885A' },
                    { token: 'attribute.value.unit', foreground: '09885A' },
                    { token: 'attribute.value.html', foreground: '0000FF' },
                    { token: 'attribute.value.xml', foreground: '0000FF' },

                    { token: 'string', foreground: 'A31515' },
                    { token: 'string.html', foreground: '0000FF' },
                    { token: 'string.sql', foreground: 'FF0000' },
                    { token: 'string.yaml', foreground: '0451A5' },

                    { token: 'keyword', foreground: '0000FF' },
                    { token: 'keyword.json', foreground: '0451A5' },
                    { token: 'keyword.flow', foreground: 'AF00DB' },
                    { token: 'keyword.flow.scss', foreground: '0000FF' },

                    { token: 'operator.scss', foreground: '666666' },
                    { token: 'operator.sql', foreground: '778899' },
                    { token: 'operator.swift', foreground: '666666' },
                    { token: 'predefined.sql', foreground: 'FF00FF' },
                ],
                colors: {
                    'editor.foreground': '#525a65', // code color
                    'editor.background': '#ffffff', // editor background color
                    'editorCursor.foreground': '#424f62', // cursor color
                    /*     'editor.lineHighlightBackground': '#0000FF20', */
                    'editorLineNumber.foreground': '#525a65',

                    'editor.inactiveSelectionBackground': '#88000015',
                    //https://microsoft.github.io/monaco-editor/playground.html#customizing-the-appearence-exposed-colors
                },
            })
            const options = {
                ...{
                    value: this.mariadbFormatter(this.value),
                    theme: 'myCustomTheme',
                    language: this.language,
                },
                ...this.options,
            }

            this.editor = monaco.editor.create(this.$el, options)

            const scope = this

            monaco.languages.registerCompletionItemProvider(this.language, {
                provideCompletionItems: function (model, position) {
                    const wordObj = model.getWordUntilPosition(position)
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: wordObj.startColumn,
                        endColumn: wordObj.endColumn,
                    }
                    const distLabels = scope.dist.map((item) => item.label)

                    const match = distLabels.find((label) => label.includes(wordObj.word))

                    const suggestions = match ? scope.createCompleters(range) : []
                    return {
                        suggestions,
                    }
                },
            })
            monaco.languages.registerDocumentFormattingEditProvider(this.language, {
                provideDocumentFormattingEdits: function (model) {
                    return [
                        {
                            range: model.getFullModelRange(),
                            text: scope.mariadbFormatter(model.getValue()),
                        },
                    ]
                },
            })
            this.editor.onDidChangeModelContent((event) => {
                const editorValue = this.getEditorValue()
                if (this.value !== editorValue) {
                    this.$emit('change', editorValue, event)
                }
            })
        },
        getEditorValue() {
            return this.editor.getValue()
        },
        createCompleters(range) {
            let dist = JSON.parse(JSON.stringify(this.dist))
            for (const item of dist) {
                switch (item.type) {
                    case 'table':
                    case 'column':
                        item.kind = this.monaco.languages.CompletionItemKind.Text
                }
                item.range = range
            }
            return dist
        },
    },

    render(createElement) {
        return createElement('div')
    },
}
