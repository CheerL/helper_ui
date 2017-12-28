const state = {
    is_login: false,
    size: 'xs',
    robot: ''
}

const mutations = {
    is_login(state, val) {
        state.is_login = val
    },
    size(state, val) {
        state.size = val
    },
    robot(state, val) {
        state.robot = val
    }
}

export default {
    state,
    mutations
}