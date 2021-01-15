<template>
  <router-view />
  <van-tabbar v-model="activeBar" v-show="showTabber">
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
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { tabbarList } from './setting'

const route = useRoute()

ref: activeBar = 'vote'
ref: showTabber = true

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
