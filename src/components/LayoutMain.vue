<template>
    <div class="layout-content center">
        <router-view></router-view>
    </div>
</template>

<script>
import Login from './Login'
import Setting from './Setting'
import Chat from './Chat'
import Log from './Log'

export default {
    components: {
        Login,
        Setting,
        Chat,
        Log
    },
}
</script>


<style>
.layout-content {
    width: 100%;
    height: 100%;
    /*margin: 15px;*/
    background: #f6f9f6;
    border-radius: 4px;
    font-size: 14px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
