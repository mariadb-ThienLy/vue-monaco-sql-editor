<template>
    <div id="app">
        <h1 class="title">Editor view using codemirror</h1>
        <!--   <editor-view :dist="dist" @on-change="onEditorChange" /> -->
        <p>Query to sent via API</p>
        <code>{{ queryData }}</code>
    </div>
</template>

<script>
/* import EditorView from './components/EditorVIew/index.vue' */

export default {
    name: 'App',
    components: {
        EditorView,
    },
    data() {
        return {
            dist: {
                table1: ['col_A', 'col_B', 'col_C'],
                table2: ['other_columns1', 'other_columns2'],
            },
            queryData: null,
        }
    },

    methods: {
        onEditorChange(v) {
            this.queryData = v
        },
    },
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 60px;
}
.title {
    text-align: center;
}
</style>
