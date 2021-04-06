<template>
    <textarea ref="txt" class="txt" />
</template>

<script>
export default {
    name: 'editor-view',
    props: {
        dist: { type: Object, require: true },
    },
    data() {
        return {
            queryData: null,
            editor: null,
        }
    },
    watch: {
        queryData: function (v) {
            this.$emit('on-change', v)
        },
    },
    mounted() {},
}
</script>
