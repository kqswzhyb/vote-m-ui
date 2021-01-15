import { createApp } from 'vue'
import { apolloProvider, query, mutate } from './utils/apollo'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button, Toast, Tabbar, TabbarItem, Tab, Tabs, Sticky } from 'vant'

const app = createApp(App)
app.config.warnHandler = () => {}
app.use(apolloProvider)
app.config.globalProperties.$query = query
app.config.globalProperties.$mutate = mutate
app.use(store)
app.use(router)
app.use(Button)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Tab)
app.use(Tabs)
app.use(Sticky)
app.use(Toast)
app.mount('#app')
