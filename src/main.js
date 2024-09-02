import './assets/main.scss'

import { createApp } from 'vue'
import ElementPlus from "element-plus"
import 'element-plus/dist/index.css'
import router from '@/router/index.js'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import locale from 'element-plus/dist/locale/zh-cn.js'
const persistedstate = createPersistedState()
const pinia = createPinia()
const app = createApp(App)


app.use(ElementPlus, { locale })
pinia.use(persistedstate)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
