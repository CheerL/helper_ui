import $ from 'jquery'

const state = {
    bool_list: {
        REMIND_ALIVE: {
            text: '提醒开关',
            value: false
        },
        ROBOT_REPLY: {
            text: '智能回复开关',
            value: false
        },
        VOICE_REPLY: {
            text: '语音回复开关',
            value: false
        },
        FLEXIBLE: {
            text: '灵活调整开关',
            value: false
        },
    },
    text_list: {
        REMIND_WAIT: {
            text: '提醒间隔',
            value: 2
        },
        REMIND_BEFORE: {
            text: '提前提醒时间',
            value: 30
        },
        UPDATE_WAIT: {
            text: '信息更新间隔',
            value: 60
        },
    },
    select_list: {
        FLEXIBLE_DAY: {
            text: '灵活调整日期',
            option_list: [{
                    value: '星期一',
                    label: '星期一'
                },
                {
                    value: '星期二',
                    label: '星期二'
                },
                {
                    value: '星期三',
                    label: '星期三'
                },
                {
                    value: '星期四',
                    label: '星期四'
                },
                {
                    value: '星期五',
                    label: '星期五'
                },
                {
                    value: '星期六',
                    label: '星期六'
                },
                {
                    value: '星期日',
                    label: '星期日'
                }
            ],
            value: '星期一'
        }
    },
    last: 0
}

const mutations = {
    setting_list_change(state, payload) {
        state[payload.list] = payload.val
    },
    setting_item_change(state, payload) {
        state[payload.list][payload.item].value = payload.val
    },
    setting_last(state, val) {
        state.last = new Date().getTime()
    }
}

const actions = {
    setting_update({ commit }) {
        let now = new Date().getTime()
        if (now - state.last > 5 * 60 * 1000) {
            $.get('/helper/setting/init/', function(data) {
                for (var each in data.bool_list) {
                    let setting = data.bool_list[each]
                    commit({
                        type: 'setting_item_change',
                        list: 'bool_list',
                        item: setting.name,
                        val: setting.val
                    })
                }
                for (var each in data.text_list) {
                    var setting = data.text_list[each]
                    commit({
                        type: 'setting_item_change',
                        list: 'text_list',
                        item: setting.name,
                        val: setting.val
                    })
                }
                for (var each in data.select_list) {
                    var setting = data.select_list[each]
                    commit({
                        type: 'setting_item_change',
                        list: 'select_list',
                        item: setting.name,
                        val: setting.val
                    })
                }
                commit('setting_last')
            })
        }
    }
}

export default {
    state,
    mutations,
    actions
}