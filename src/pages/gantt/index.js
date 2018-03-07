import Vue from 'vue'
import router from './router'
import gantt from './gantt'

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(gantt)
})
