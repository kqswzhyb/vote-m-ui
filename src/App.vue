<template>
  <router-view />
</template>

<script lang="ts" setup>
import { getCurrentInstance, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { readAll } from '@/graphql/dic/dicType'

const store = useStore()
const {
  appContext: {
    config: {
      globalProperties: { $query },
    },
  },
} = getCurrentInstance()

const getDic = () => {
  $query(readAll, { page: { limit: 9999, offset: 0 } }).then((res) => {
    if (!res.errors) {
      let dic = {}
      res.data.data.forEach((v) => {
        dic[v.code] = v.dic
      })
      store.commit('common/setDicList', dic)
    }
  })
}
onBeforeMount(() => {
  getDic()
})
</script>

<style lang="scss">
@import './assets/icon/iconfont.css';
</style>
