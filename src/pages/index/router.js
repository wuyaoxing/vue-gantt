import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const nativeEncode = encodeURIComponent
window.encodeURIComponent = str => nativeEncode(str).replace(/%2f/ig, '/')

const routes = [
    {
        path: '/',
        name: 'gantt',
        component: () => import(/* webpackChunkName: "gantt" */ 'views/gantt/GanttContainer')
    }
]

export default new VueRouter({
    routes,
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
})
