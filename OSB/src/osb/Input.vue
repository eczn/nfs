<template>
    <div class="osb-input">
        <svg @click="enter" class="icon" aria-hidden="true">
            <use :xlink:href="'#icon-' + rightIcon"></use>
        </svg>
        <input @keyup.enter="enter" v-bind="input" v-model="input.val" />
    </div>
</template>

<script>
export default {
    name: 'osb-input', 
    props: {
        input: {
            type: Object, 
            default: {
                val: ''
            }
        }, 
        rightIcon: { 
            default: null
        }
    },
    data(){
        return {}
    },
    methods: {
        enter(){
            this.$emit('enter', this.input.val); 
        }
    }
}
</script>

<style lang="sass">
.osb-input 
    position: relative
    input 
        font-family: Sans-serif
        appearance: none
        -webkit-appearance: none
        border: 1px solid #DDD
        background-color: rgba(255, 255, 255, .9)
        padding: .2em
    .icon 
        position: absolute
        right: 0
        top: 50%
        font-size: 150%
        transform: translateY(-50%)
</style>

