import Vue from 'vue'
import router from './router'
import App from './App'

import 'styles/app.less'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
