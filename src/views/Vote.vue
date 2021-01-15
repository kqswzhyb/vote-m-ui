<template>
  <van-sticky>
    <van-tabs v-model:active="activeTab" @change="resetList">
      <van-tab title="进行中" name="5"></van-tab>
      <van-tab title="待开始" name="4"></van-tab>
      <van-tab title="已结束" name="6"></van-tab>
      <van-tab title="关停" name="2"></van-tab>
    </van-tabs>
  </van-sticky>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, onBeforeMount, computed } from 'vue'
import { readAll } from '@/graphql/vote/vote'

const {
  appContext: {
    config: {
      globalProperties: { $query },
    },
  },
} = getCurrentInstance()

ref: activeTab = '5'
ref: current = 1
ref: limit = 10

const getList = () => {
  $query(readAll, {
    filter: {
      status: JSON.stringify({
        cond: 'eq',
        value: activeTab,
      }),
      voteType: JSON.stringify({
        cond: 'eq',
        value: '0',
      }),
    },
    page: { limit, offset: (current - 1) * limit },
  }).then((res) => {
    console.log(res)
  })
}

const resetList = () => {
  limit = 10
  current = 1
  getList()
}

onBeforeMount(() => {
  getList()
})
</script>
