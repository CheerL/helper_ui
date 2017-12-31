<template>
    <div class='message-main-box' :style="{ float: float}">
        <div class='head-img' :style="{ float: float }">
            <Avatar :src='sender.path'/>
            </div>
        <div class='message-text' :style="{ float: float , backgroundColor: color , color: text_color , borderColor: border_color}">
            {{text}}
            </div>
    </div>
</template>

<script>
export default {
    props: ['text', 'in', 'sender'],
    computed: {
        float: function() {
            return (this.in) ? 'left' : 'right'
        },
        color: function() {
            return (this.in) ? '#FFFFFF' : 'limegreen'
        },
        text_color: function(){
            return (this.in) ? '#657180' : '#ffffff'
        },
        border_color: function(){
            return (this.in) ? '#d2d2d2' : ''
        }
    },
}
</script>


<style>
.message-main-box{
    width: 100%;
    margin: 10px;
}
.head-img{
    height: 2.3em;
    width: 2.3em;
    margin: 1px;
}
.message-text{
    max-width: 25em;
    border: 1px solid;
    border-radius: 5px;
    margin: 0px 5px;
    padding: 0.4em;
    word-break: break-all;
}
</style>