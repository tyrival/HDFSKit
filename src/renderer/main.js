import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import db from './data/datastore'
import './assets/styles/theme/light.less'
import './fonts/iconfont.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$db = db
Vue.prototype.$dbServers = (servers) => {
  db.remove({}, {multi: true}, () => {
    db.insert(servers)
  })
}

Vue.use(iView, {
  // 全局设置组件默认尺寸
  size: 'small'
})

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
