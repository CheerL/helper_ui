import $ from 'jquery'

const state = {
    friend_list: {},
    last: 0
}

const mutations = {
    friend_list_change(state, val) {
        state.friend_list = val
    },
    friend_update_last(state, val) {
        state.last = new Date().getTime()
    },
    friend_history_update(state, name) {
        state.friend_list[name].update = true
    },
    add_chat_record(state, playload) {
        let new_record = {
            sender: playload.sender,
            text: playload.text,
            in: playload.IN,
            time: playload.time
        }
        state.friend_list[playload.name].chat_record.push(new_record)
    },
    unread_add_one(state, name) {
        state.friend_list[name].unread++
    },
    unread_zero(state, name) {
        state.friend_list[name].unread = 0
    }
}

const actions = {
    friend_list_update({ commit }) {
        let now = new Date().getTime()
        let temp_dict = {}
        if (now - state.last > 5 * 60 * 1000) {
            $.get('/helper/chat/user/', function(data) {
                for (let each in data.user_list) {
                    let temp_name = data.user_list[each].name
                    temp_dict[temp_name] = data.user_list[each]
                    temp_dict[temp_name].path = '/' + data.user_list[each].path
                    temp_dict[temp_name].show = true
                    temp_dict[temp_name].unread = 0
                    temp_dict[temp_name].update = false
                    if (!temp_dict[temp_name].chat_record) {
                        temp_dict[temp_name].chat_record = []
                    }
                }
                commit('friend_list_change', temp_dict)
                commit('friend_update_last')
            })
        }
    }
}

export default {
    state,
    mutations,
    actions
}