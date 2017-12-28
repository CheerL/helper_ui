import Vue from 'vue'
import iView from 'iview'
import Router from 'vue-router'
import Login from '../components/Login'
import Setting from '../components/Setting'
import Chat from '../components/Chat'
import Log from '../components/Log'

Vue.use(Router)
Vue.use(iView)

const router = new Router({
    mode: 'history',
    base: '/helper/',
    routes: [
        { path: '/login', component: Login, alias: '/' },
        { path: '/setting', component: Setting },
        { path: '/chat', component: Chat },
        { path: '/log', component: Log },
    ],
})

router.beforeEach((to, from, next) => {
    if (from.path == '/setting' && _setting.unsave) {
        _setting.leave_setting()
        _setting.to = to
        return
    }
    iView.LoadingBar.start()
    next()
})

router.afterEach((to, from) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
})

export default router