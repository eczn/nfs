<template>
    <div @click="$emit('click')" class="file" :class="{ selected: selected }">
        <div v-if="file.isDirectory" class="file-item folder-inner">
            <img class="file-icon" src="../assets/folder.svg" />
            <p>{{ file.filename }}</p>
        </div>
        <div v-else class="file-item file-inner">
            <img class="file-icon" :src="icon[file.ext] || icon.file" />
            <p class="file-name">{{ file.filename + '.' + file.ext }}</p>
        </div>
    </div>
</template>

<script>
import icon from '../assets/icon'

export default {
    name: 'file',
    props: {
        file: {
            type: Object,
            required: true
        },
        pathStr: {
            type: String, 
            required: true
        },
        selected: {
            type: Boolean,
            default: false
        }
    }, 
    data(){
        return {
            icon
        }
    }
}
</script>

<style lang="sass">
.file 
    display: inline-block
    width: 135px
    margin-bottom: 1em
    min-height: 100px
    vertical-align: top
    text-align: center
    user-select: none
    cursor: pointer

    .file-icon 
        width: 96px

    .selected 
        background-color: #DDD

    .file-name 
        word-wrap: break-word
        padding: 0 .5em
    
</style>
