<!-- MyBook.vue -->
<template>
    <div>
        {{readersNumber}} {{book.title}}
        <div>{{logo}}</div>
    </div>
</template>

<script>
/* eslint-disable import/no-unresolved */
import {ref, reactive, onMounted, onUpdated, onUnmounted} from  'vue';

export default {
    props: {
        logo: {
            type: String,
            required: true
        }
    },
    maxFunctionLines() {
        let line = 1;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        return line;
    },
    setup() {
        // console.log(props);
        const readersNumber = ref(0);
        const book = reactive({title: 'Vue 3 Guide'});

        onMounted(() => {
            // console.log('mounted!');
        });
        onUpdated(() => {
            // console.log('updated!');
        });
        onUnmounted(() => {
            // console.log('unmounted!');
        });
        // expose to template
        return {
            readersNumber,
            book
        };
    }
};
</script>
