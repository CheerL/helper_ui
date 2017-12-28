import Vuex from 'vuex'
import Vue from 'vue'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import main from './modules/main'
import log from './modules/log'
import login from './modules/login'
import chat from './modules/chat'
import setting from './modules/setting'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    getters,
    actions,
    mutations,
    modules: {
        login,
        main,
        log,
        chat,
        setting,
    },
    strict: debug
})