import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加載動態設定 REM 基準值
import 'amfe-flexible'

// 加載 dayjs 初始化配置
import './utils/dayjs'

import Vant from 'vant'
import { Locale } from 'vant';
import zhTW from 'vant/es/locale/lang/zh-TW';
import 'vant/lib/index.css'
import './styles/index.less'
Locale.use('zh-TW', zhTW);
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
