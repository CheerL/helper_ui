<template>
    <div class='chat'>
        <Row style="height: 100%">
            <Col :lg='5' :md='7' :sm='7' :xs='24' :style="{height: menu_show? '100%' : '0'}">
            <Menu class='chat-menu' theme='mylight' active-name='' width='auto' v-show='menu_show' @on-select='select_func'>
                <div class="chat-search center">
                    <img class="chat-search-icon" src='/static/images/search_icon.png'>
                    <div style='width: 70%;'>
                        <Input size="small" v-model="filter_word"></Input>
                    </div>
                </div>
                <Menu-item class='chat-item' v-for='(friend, index) in friend_list' :name='friend.name' :key='index' v-show="friend.show">
                    <div class='chat-item-head'>
                        <Badge :count='friend.unread'>
                        <Avatar class='chat-item-head-img' :src='friend.path' />
                        </Badge>
                    </div>
                    <div class='chat-item-name center'>
                        {{friend.name.slice(0, 10)}}
                    </div>
                </Menu-item>
            </Menu>
            </Col>
            <Col :lg="19" :md='17' :sm='17' :xs='24' :style="{height: main_show? '100%' : '0'}">
            <div class='chat-main' v-show='main_show'>
                <div class='chat-main-title center'>
                    <div v-if="size=='xs'" class='chat-main-back center' @click='back'>
                        <Icon type="arrow-left-c"></Icon>
                    </div>
                    {{now_user.name}}
                </div>
                <div class='chat-main-box'>
                    <ChatMessage v-for='(record, index) in now_user.chat_record' :key='index' :in='record.in' :text='record.text' :sender='friend_list[record.sender]'>
                    </ChatMessage>
                </div>
                <div class='chat-main-input' @keyup.ctrl.enter='send_msg'>
                    <div class='chat-main-input-tool'></div>
                    <textarea class='chat-main-input-text' v-model="chat_input"></textarea>
                    <div class='chat-main-input-button'>
                        <MyButton color='limegreen' style='text-align: center; width: 10em' @click='send_msg'>发送(Ctrl+Enter)</MyButton>
                    </div>
                </div>
            </div>
            </Col>
        </Row>
    </div>
</template>

<script>
import config from '../../config'
import MyButton from './MyButton'
import ChatMessage from './ChatMessage'
import WebSocket from '~/js/web-socket.js'
import $ from 'jquery'
import { mapMutations, mapActions } from 'vuex'

export default {
    components: {
        MyButton,
        ChatMessage
    },
    data: function() {
        if (!window._chat) {
            window._chat = this
        }
        return {
            state: this.$store.state.chat,
            filter_word: '',
            select: '',
            main_show: false,
            menu_show: true,
            now_user: {
                name: '',
                chat_record: []
            },
            chat_input: '',
        }
    },
    computed: {
        size: function() {
            return this.$store.state.main.size
        },
        friend_list: () => _chat.state.friend_list
    },
    methods: {
        ...mapMutations([
            'friend_list_change',
            'friend_update_last',
            'add_chat_record',
            'unread_zero',
            'unread_add_one'
        ]),
        ...mapActions([
            'friend_list_update'
        ]),
        back: function() {
            this.main_show = false
            this.menu_show = true
        },
        select_func: function(name) {
            this.unread_zero(name)
            this.now_user = this.friend_list[name]
            if (this.size == 'xs') {
                if (!this.main_show) {
                    this.main_show = true
                }
                if (this.menu_show) {
                    this.menu_show = false
                }
            }
        },
        send_msg: function() {
            if (this.chat_input && this.now_user) {
                $.post('/helper/chat/send/', { msg: this.chat_input, user: this.now_user.user_name })
                this.chat_input = ''
            }
        },
        filter: function(filter_word) {
            for (var each in this.friend_list) {
                if (this.friend_list[each].name.search(filter_word) == -1) {
                    this.friend_list[each].show = false
                }
                else {
                    this.friend_list[each].show = true
                }
            }
        },
        ws_func: function() {
            if (!_chat.sock) {
                var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws"
                _chat.sock = new WebSocket(ws_scheme + '://' + config.remote_addr + '/chat-' + this.$store.state.main.robot + '/')
                _chat.sock.onmessage = function(message) {
                    var data = JSON.parse(message.data)
                    _chat.add_chat_record(data)
                    if (_chat.now_user.name != data.name && data.IN){
                        _chat.unread_add_one(data.name)
                    }
                }
            }
        },
    },
    watch: {
        size(val) {
            if (val == 'xs') {
                this.main_show = false
                this.menu_show = true
            }
            else if (!this.main_show) {
                this.main_show = true
            }
        },
        filter_word(val) {
            this.filter(val)
        }
    },
    mounted: function() {
        if (this.size != 'xs' && !this.main_show) {
            this.main_show = true
        }
        this.friend_list_update()
        this.ws_func()
    },
    beforeDestroy: function() {
        _chat.now_user = {
            name: '',
            chat_record: []
        }
    }
}
</script>

<style>
.chat {
    width: 100%;
    height: 100%;
}

.chat-menu {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}

.chat-search-icon {
    width: 1.5em;
    height: 1.5em;
    margin: 0.5em;
    float: left;
}

.chat-search {
    margin: 0.5em 0;
}

.chat-item-head {
    float: left;
    width: 2em;
    height: 2em;
    margin: 0 1em 0 0;
}

.chat-item-head-img {
    width: 100%;
    height: 100%;
}

.chat-item-name {
    width: auto;
    max-width: 13em;
    height: 2em;
    justify-content: left;
}

.chat-main {
    position: relative;
    width: 100%;
    height: 100%;
    border-left: 1px solid #dde0dd;
}

.chat-main-title {
    width: 100%;
    height: 10%;
    border-bottom: 1px solid #dde0dd;
    font-size: 20px;
}

.chat-main-back {
    width: 3em;
    height: 2.5em;
    position: absolute;
    top: 0;
    left: 0;
}

.chat-main-box {
    width: 100%;
    height: 70%;
    font-size: 14px;
    overflow-y: auto;
    overflow-x: hidden;
}

.chat-main-input {
    position: absolute;
    width: 100%;
    bottom: 0;
    border-top: 1px solid #dde0dd;
    height: 20%;
    font-size: 14px;
}

.chat-main-input-tool {
    width: 100%;
    height: 0em;
}

.chat-main-input-text {
    width: calc(100% - 1em);
    height: 6em;
    z-index: 0;
    outline: none;
    margin: 1em 1em 0 1em;
    resize: none;
    border: 0;
    background-color: #f6f9f6;
}

.chat-main-input-button {
    z-index: 100;
    bottom: 0.5em;
    right: 1em;
    position: absolute;
}
</style>

