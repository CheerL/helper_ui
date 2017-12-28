// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import App from './App'
import Util from './lib/util';
import router from './router/index.js'
import store from './store'
import "./theme/theme.less"

Vue.use(iView);

var main = new Vue({
    el: '#app',
    router,
    store,
    template: '<App></App>',
    components: { App }
})