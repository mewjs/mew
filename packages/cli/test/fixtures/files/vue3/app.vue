<template>
    <div id="app">
        <Composition  />
    </div>
</template>

<script>
import '../app.less';
import '../app.styl';
import '../app.scss';
import Composition from './Composition.vue';

export default {
    name: 'App',
    components: {
        Composition
    }
};
</script>

<style lang="css">
#app {
    background-color: rgb(185, 65, 65);
}
</style>
