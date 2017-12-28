import $ from 'jquery'

const func = {
    get_now: function() {
        var temp_func = ((num) => {
            return num < 10 ? '0' + String(num) : String(num)
        })
        var now = new Date()
        var date_obj = {
            year: now.getYear() + 1900,
            mouth: temp_func(now.getMonth() + 1),
            day: temp_func(now.getDate()),
            hour: temp_func(now.getHours()),
            min: temp_func(now.getMinutes()),
            sec: temp_func(now.getSeconds())
        }
        return `[${date_obj.day}/${date_obj.mouth}/${date_obj.year} ${date_obj.hour}:${date_obj.min}:${date_obj.sec}]`
    },
    add_time: function(log) {
        for (var i = 0; i < log.length; i++) {
            log[i] = func.get_now() + ' ' + log[i]
        }
        return log
    },

}

const state = {
    log_list: []
}

const mutations = {
    log_list_change(state, val) {
        state.log_list = val
    },
    append_log: function(state, new_log) {
        new_log = func.add_time(new_log)
        state.log_list = state.log_list.concat(new_log)
    },
    prepend_log: function(state, new_log) {
        new_log = func.add_time(new_log)
        state.log_list = new_log.concat(state.log_list)
    },
}

const actions = {
    get_log({ commit }, playload) {
        let start = playload.start
        let count = playload.count
        if (!state.log_list.length) {
            $.get('/helper/log/get/start=' + start + '&count=' + count, function(data) {
                commit('append_log', data.log_list)
            })
        }
    },
    get_all_log({ dispatch, commit }) {
        commit('log_list_change', [])
        dispatch('get_log', { start: 0, count: -1 })
    }
}

export default {
    state,
    mutations,
    actions
}