import { createApp } from 'vue'
import { apolloProvider, query, mutate } from './utils/apollo'
import directive from './utils/directive'
import App from './App.vue'
import router from './router'
import store from './store'
import { imgBaseUrl } from './setting'
import {
  Button,
  Toast,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  Sticky,
  Empty,
  Lazyload,
  List,
  Form,
  Field,
  Grid,
  GridItem,
  NavBar,
  Dialog,
  Icon,
  Badge,
  Cell,
  ActionSheet
} from 'vant'

const app = createApp(App)
app.config.warnHandler = () => {}
app.use(apolloProvider)
app.config.globalProperties.$query = query
app.config.globalProperties.$mutate = mutate
app.config.globalProperties.$imgBaseUrl = imgBaseUrl
Object.keys(directive).forEach(v=>{
  app.directive(v, directive[v])
})
app.use(store)
app.use(router)
app.use(Button)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Tab)
app.use(Tabs)
app.use(Sticky)
app.use(Empty)
app.use(Lazyload, {
  loading: '@/assets/images/loading.gif',
  error: '@/assets/images/none.png',
})
app.use(Toast)
app.use(List)
app.use(Form)
app.use(Field)
app.use(Grid)
app.use(GridItem)
app.use(NavBar)
app.use(Dialog)
app.use(Icon)
app.use(Badge)
app.use(Cell)
app.use(ActionSheet)
app.mount('#app')
