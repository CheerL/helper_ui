<template>
    <Menu theme="mydark" width="auto" :open-names="['1']" ref='menu'>
        <div class="layout-logo center">
            <img class="layout-logo-icon" src='/static/images/wx_icon.png'>
        </div>
        <router-link
            exact-active-class=''
            active-class='ivu-menu-item-active ivu-menu-item-selected'
            class='ivu-menu-item layout-menu-item'
            v-for='(item, index) in menu_list'
            :to='item.link' tag='li'
            :name='item.link'
            :key='index'
            exact
        >
            <div class='layout-menu-item-content' align="center">{{item.text}}</div>
        </router-link>
    </Menu>
</template>

<script>
export default {
    data: function () {
        window.menu = this
        return {
            menu_list: [
                {
                    text: '登录',
                    link: 'login'
                },
                {
                    text: '聊天',
                    link: 'chat'
                },
                {
                    text: '日志',
                    link: 'log'
                },
                {
                    text: '设置',
                    link: 'setting'
                }
            ]
        }
    },
}
</script>


<style>
.layout-logo {
    border-bottom: 1px solid #535453;
}

.layout-logo-icon {
    width: 3em;
    height: 3em;
    margin: 0.5em;
}

.layout-menu-item {
    border-bottom: 1px solid #535453;
    /*padding: 0;*/
}

.layout-menu-item-content {
    padding: 0.5em 0;
}
</style>