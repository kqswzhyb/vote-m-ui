<template>
  <van-sticky>
    <van-tabs v-model:active="activeTab" @change="resetList">
      <van-tab title="进行中" name="5"></van-tab>
      <van-tab title="待开始" name="4"></van-tab>
      <van-tab title="已结束" name="6"></van-tab>
    </van-tabs>
  </van-sticky>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    offset="0"
    @load="onLoad"
    v-if="listData.length"
    class="list-view"
  >
    <div v-for="item in listData" class="list-cell" :key="item.id">
      <img
        v-lazy="
          item.voteConfig.file
            ? $imgBaseUrl + item.voteConfig.file.fileFullPath
            : '@/assets/images/none.png'
        "
        style="width: 45vw; height: 45vw"
        alt=""
      />
      <div>
        <p>{{ item.voteName }}</p>
        <p class="fs12 grey1">{{ item.startTime }} 至</p>
        <p class="fs12 grey1">{{ item.endTime }}</p>
        <p class="fs12 grey1">
          {{
            item.voteConfig.voteLevel === 0
              ? '等级无限制'
              : `等级大于等于${item.voteConfig.voteLevel}`
          }}
        </p>
        <p class="fs12 grey1">
          {{ item.voteConfig.voteQqVip === '0' ? '需要QQ会员' : '无会员限制' }}
        </p>
      </div>
    </div>
  </van-list>
  <van-empty v-else image="search" description="暂无评选" />
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, onBeforeMount, computed } from 'vue'
import { readAll, readCount } from '@/graphql/vote/vote'

const {
  appContext: {
    config: {
      globalProperties: { $query, $imgBaseUrl },
    },
  },
} = getCurrentInstance()

ref: loading = false
ref: finished = false
ref: activeTab = '5'
ref: listData = []
ref: current = 1
ref: limit = 3
ref: total = ''

const getList = () => {
  loading = true
  const filter = {
    status: JSON.stringify({
      cond: 'eq',
      value: activeTab,
    }),
    voteType: JSON.stringify({
      cond: 'eq',
      value: '1',
    }),
  }
  if (total === '') {
    $query(readCount, {
      filter,
    }).then((res) => {
      if (!res.errors) {
        total = res.data.page.total
      }
    })
  }
  $query(readAll, {
    filter,
    page: { limit, offset: (current - 1) * limit },
  }).then((res) => {
    if (!res.errors) {
      listData = listData.concat(res.data.data)
    }
    loading = false
  })
}

const resetList = () => {
  limit = 3
  current = 1
  loading = false
  finished = false
  listData = []
  getList()
}

const onLoad = () => {
  if ((total || 0) <= (current - 1) * limit) {
    finished = true
  } else {
    current++
    getList()
  }
}

onBeforeMount(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.list-view {
  display: flex;
  flex-wrap: wrap;
  background-color: #f6f9fa;
  padding-bottom: 50px;
  .list-cell {
    display: flex;
    margin: 20px calc(5vw - 2px) 0;
    box-sizing: border-box;
    width: 100%;
    height: calc(45vw + 2px);
    border: 1px solid rgb(239, 239, 239);
    background-color: #fff;
    border-radius: 10px;
    img {
      margin-right: 10px;
    }
  }
}
.list-view::v-deep {
  .van-list__finished-text {
    width: 100%;
  }
  .van-list__loading {
    width: 100%;
  }
}
</style>
