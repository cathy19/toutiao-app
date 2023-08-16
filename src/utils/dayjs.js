import Vue from 'vue'
import dayjs from 'dayjs'

// 加載中文語言包
import 'dayjs/locale/zh-tw'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用處理相對時間的插件
dayjs.extend(relativeTime)

dayjs.locale('zh-tw') // 全局使用
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
