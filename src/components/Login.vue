<template>
    <div class="login">
        <img class="login_img" :src="pic_src">
        <div class="login_text">{{text}}</div>
        <template v-if='status==0'>
            <MyButton classes='login_button' :color="login.color" @click='login_func'>{{login.text}}</MyButton>
        </template>
        <template v-else-if='status==1'>
            <MyButton classes='login_button' :color="reload.color" @click='reload_func'>{{reload.text}}</MyButton>
        </template>
        <template v-else-if='status==2'>
            <MyButton classes='login_button' :color="exit.color" @click='exit_confirm=true'>{{exit.text}}</MyButton>
        </template>
        <Modal v-model="exit_confirm" title="退出确认" @on-ok='exit_func'>
            <p>你确定要退出么?</p>
        </Modal>
    </div>
</template>

<script>
import config from '../../config'
import MyButton from './MyButton'
import WebSocket from '~/js/web-socket.js'
import $ from 'jquery'
import { mapMutations, mapState, mapActions } from 'vuex'


export default {
    components: {
        MyButton
    },
    data: function() {
        window._login = this
        return {
            state: this.$store.state.login,
            exit_confirm: false,
            login: {
                text: '登录',
                color: 'limegreen'
            },
            exit: {
                text: '退出',
                color: 'crimson',
            },
            reload: {
                text: '重启',
                color: 'dimgray',
            },
        }
    },
    computed: {
        pic_src: {
            get: () => _login.state.pic_src,
            set: val => _login.login_change({
                attr: 'pic_src',
                val: val
            })
        },
        text: {
            get: () => _login.state.text,
            set: val => _login.login_change({
                attr: 'text',
                val: val
            })
        },
        status: {
            get: () => _login.state.status,
            set: val => _login.login_change({
                attr: 'status',
                val: val
            })
        }
    },
    methods: {
        ...mapMutations([
            'is_login',
            'login_change'
        ]),
        ...mapActions([
            'login_update'
        ]),
        exit_func() {
            $.post("/helper/login/logout/", data => {
                _login.$Modal.success({
                    title: '',
                    content: data
                });
                _login.reload_func()
                _login.text = '请点击登录按钮'
                _login.pic_src = '/static/images/begin.png'
                _login.status = 0
                _login.is_login(false)
            })
        },

        login_func() {
            if (!this.sock) {
                this.ws_func()
            }
            this.text = "正在获取二维码"
            this.status = 1
            $.post("/helper/login/login/");
        },

        reload_func() {
            $.get('/helper/login/stop/')
            _login.is_login(false)
        },
        ws_func() {
            if (this.status != 2) {
                var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws"
                this.sock = new WebSocket(ws_scheme + '://' + config.remote_addr + '/login/')
                this.sock.onmessage = message => {
                    var data = JSON.parse(message.data)
                    _login.text = data.msg
                    _login.status = data.status
                    _login.pic_src = '/' + data.pic;
                    if (data.status == 2) {
                        _login.is_login(true)
                        _login.sock.close()
                        _login.sock = null
                    }
                };
            }
            else {
                this.is_login(true)
            }
        },
    },
    mounted() {
        this.login_update()
    },
    beforeDestroy() {
        if (this.sock) {
            this.sock.close()
        }
    }
}
</script>


<style>
.login {
    width: 250px;
    height: 335px;
    background-color: #f6f9f6;
    text-align: center;
    border-radius: 10px;
    box-shadow: 3px 3px 7px 3px rgba(0, 0, 0, .1), inset 2px 2px 2px rgba(255, 255, 255, .2);
}

.login_img {
    height: 235px;
    width: 235px;
    margin-top: 8px;
}

.login_text {
    margin: 0.5em 0 0 0;
    text-align: center;
}

.login_button {
    width: 6em;
    margin-top: 0.65em;
}
</style>
