<template>
    <div class='log center'>
        <div class="log-box">
            <p v-for='line in log_list'>{{line}}</p>
        </div>
        <MyButton class='log-button' @click='get_all_log'>
            查看全部日志
        </MyButton>
    </div>
</template>

<script>
import config from '../../config'
import MyButton from './MyButton'
import WebSocket from '~/js/web-socket.js'
import $ from 'jquery'
import { mapMutations, mapActions } from 'vuex'

export default {
    components: {
        MyButton,
    },
    data: function() {
        if (!window._log) {
            window._log = this
        }
        return {
            state: this.$store.state.log,
        }
    },
    computed: {
        log_list: () => _log.state.log_list
    },
    methods: {
        ...mapMutations([
            'log_list_change',
            'append_log',
            'prepend_log'
        ]),
        ...mapActions([
            'get_log',
            'get_all_log'
        ]),

        ws_func: function() {
            if (!_log.sock) {
                var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws"
                _log.sock = new WebSocket(ws_scheme + '://' + config.remote_addr + '/log/')
                _log.sock.onmessage = function(message) {
                    var data = JSON.parse(message.data)
                    _log.prepend_log([data.msg], true)
                }
            }
        },
        init: function() {
            this.ws_func()
            this.get_log({ start: 0, count: 300 })
        }
    },
    mounted() {
        this.init()
    },
}
</script>

<style>
.log {
    width: 100%;
    height: 100%;
}

.log-box {
    height: 90%;
    width: 100%;
    margin: 1em 2em 0 2em;
    padding: 0.5em;

    text-align: left;
    color: #f6f9f6;
    font: 14px;
    word-wrap: break-word;
    word-break: break-all;
    overflow-y: visible;
    overflow-x: hidden;

    background-color: rgba(0, 0, 0, .65);
    border: 5px groove black;

    /*圆角*/
    -moz-border-radius: 10px;
    border-radius: 10px;
}

.log-button {
    width: 10em;
    text-align: center;
}
</style>
