<template>
    <div id="app"></div>
</template>

<script lang="ts">
import '../app.less';
import '../app.styl';
import '../app.scss';

export default {
    name: 'App',
    components: {} as Record<string, any>,
    methods: {
        fix(a: string) {
            this.$data.a = a;
        }
    }
};
</script>

<style lang="css">
#app {
    background-color: #b94141;
}
</style>
