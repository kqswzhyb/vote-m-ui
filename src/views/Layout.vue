<template>
  <router-view />
  <van-tabbar v-model="activeBar">
    <van-tabbar-item
      v-for="item in tabbarList"
      :key="item.name"
      :icon="item.icon"
      :to="item.path"
      :name="item.name"
      >{{ item.content }}</van-tabbar-item
    >
  </van-tabbar>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import io from 'socket.io-client'
import { tabbarList } from '../setting'

const route = useRoute()

ref: activeBar = 'vote'
ref: websocket = null

onBeforeMount(() => {
  websocket = io('http://localhost:7001', {
    transports: ['websocket']
  })
  websocket.on('connect', () => {
    const id = websocket.id;
    console.log('建立链接',id)
    // websocket.emit(传参)
  })
  websocket.on('disconnect', () => {
    console.log('连接断开')
  })
  websocket.on('card message', (msg) => {
    // 接受数据
  })
  websocket.on('error message', (msg) => {
    console.log('error:' + msg)
  })
})

watch(
  () => route.path,
  (val) => {
    tabbarList.some((v) => {
      if (v.path === val) {
        activeBar = v.name
        return true
      }
    })
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss"></style>
