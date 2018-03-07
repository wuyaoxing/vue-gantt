import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const nativeEncode = encodeURIComponent
window.encodeURIComponent = str => nativeEncode(str).replace(/%2f/ig, '/')

export default new Router({
    routes: [
        {
            path: '/',
            name: 'gantt',
            component: () => import(/* webpackChunkName: "gantt" */ 'views/gantt')
        },
    ]
})
