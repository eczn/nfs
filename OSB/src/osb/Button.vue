<template>
    <div :style="css" @click="clicking" class="button-wrap">{{ text }}</div>
</template>

<script>
export default {
    name: 'osb-btn',
    props: {
        text: {
            type: String, 
            default: '标题'
        },
        css: {
            type: Object, 
            default(){
                return {
                    backgroundColor: '#FFF', 
                    color: '#555', 
                    border: '1px solid #DDD', 
                    padding: '.3em',
                    minWidth: '40%',
                    borderRadius: '4px'
                }
            }
        }
    }, 
    data(){
        return {}
    },
    created(){

    },
    methods: {
        clicking(e){
            this.$emit('click', e); 
        }
    }
}
</script>

<style lang="sass">
.button-wrap 
    display: inline-block
</style>

