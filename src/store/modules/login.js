import $ from 'jquery'

const state = {
    pic_src: '/static/images/begin.png',
    text: '请点击登录按钮',
    robot: '',
    status: 0,
    last: 0
}

const mutations = {
    login_change(state, payload) {
        state[payload.attr] = payload.val
    },
    login_last(state, val) {
        state.last = new Date().getTime()
    }
}

const actions = {
    login_update({ commit }) {
        let now = new Date().getTime()
        $.get('/helper/login/init/', function(data) {
            commit({ type: 'login_change', attr: 'pic_src', val: '/' + data.pic })
            commit({ type: 'login_change', attr: 'status', val: data.status })
            commit({ type: 'login_change', attr: 'text', val: data.msg })
            commit('login_last')
            if (data.status == 2) {
                commit('is_login', true)
                commit('robot', /^(.*)成功登录$/.exec(data.msg)[1])
            }
        })
    }
}

export default {
    state,
    mutations,
    actions
}