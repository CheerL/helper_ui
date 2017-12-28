<template>
    <a 
        class="my-button"
        :class="classes"
        :id="id"
        :href="href"
        :style="style_object"
        @mouseover="mouseover"
        @mouseout="mouseout"
        @click="handleClick"
    >
        <slot></slot>
    </a>
</template>

<script>
export default {
    props: {
        id: String,
        classes: String,
        href: {
            type: String,
            default: 'javascript:;'
        },
        color: {
            type: String,
            default: 'rgb(105, 105, 105)'
        },
        font: {
            type: [String, Number],
            default: 16
        },
    },
    data: function () {
        return {
            white: 'rgb(255, 255, 255)',
            style_object: {
                color: this.color,
                borderColor: this.color,
                fontSize: this.font,
                backgroundColor: 'rgb(255, 255, 255)',
            }
        }
    },
    methods: {
        mouseover: function () {
            this.style_object.color = this.white
            this.style_object.backgroundColor = this.color
        },
        mouseout: function () {
            this.style_object.color = this.color
            this.style_object.backgroundColor = this.white
        },
        handleClick (event) {
            this.$emit('click', event);
        }
    },
    watch: {
        font: function (val, old_val) {
            this.style_object.fontSize = val
        },
        color: function (val, old_val) {
            this.style_object.borderColor = val
            this.style_object.color = val
            this.style_object.backgroundColor = this.white
        }
    }
}
</script>

<style>
.my-button {
    display: inline-block;
    position: relative;
    padding: 0 1em;
    line-height: 2em;
    border-radius: 1em;
    border: 1px solid;
    text-decoration: none;
}
</style>
