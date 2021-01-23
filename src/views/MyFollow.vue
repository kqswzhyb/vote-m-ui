<template>
  <div class="bg">
    <van-sticky class="mb10" :offset-top="0">
      <van-nav-bar
        title="我的关注"
        left-text="返回"
        left-arrow
        @click-left="router.go(-1)"
      />
    </van-sticky>
    <van-list
      v-if="token && list.length"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      :offset="0"
      @load="getFollow"
    >
      <van-cell v-for="item in list" :key="item.id" @click="goDetail(item)">
        <template #title>
          <div class="flex">
            <div class="follow-avatar">
              <img
                v-lazy="
                  $imgBaseUrl +
                    optionalChaining(item.follow, 'file', 'fileFullPath') ||
                  '@/assets/images/none.png'
                "
                width="40"
                height="40"
                alt=""
              />
            </div>
            <div v-if="item.follow.__typename === 'Vote'">
              {{ item.follow.voteName }}
            </div>
            <div v-else>
              {{ item.follow.nickname }}
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>
    <van-empty v-else image="search" description="暂无关注" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, getCurrentInstance, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { readAll, readCount } from '@/graphql/user/userFollow'
import { optionalChaining } from '@/utils/utils'
import { Toast } from 'vant'

const store = useStore()
const router = useRouter()
const {
  appContext: {
    config: {
      globalProperties: { $query, $imgBaseUrl, $mutate },
    },
  },
} = getCurrentInstance()
const token = computed(() => store.getters['common/token'])
const info = computed(() => store.getters['user/info'])
ref: finished = false
ref: loading = false
ref: list = []
ref: total = 0
ref: page = 0
ref: size = 10

const getFollow = () => {
  loading = true
  page += 1
  $query(readAll, {
    filter: {
      userId: JSON.stringify({
        cond: 'eq',
        value: info.value.id,
      }),
    },
    page: { limit: size, offset: (page - 1) * size },
  }).then((res) => {
    if (!res.errors) {
      if (total <= page * size) {
        finished = true
      }
      list = list.concat(res.data.data)
    } else {
      Toast.fail(res.data.message)
    }
    loading = false
  })
}

const goDetail = (item) => {
  if (item.follow.__typename === 'Vote') {
    router.push(
      `/${item.follow.voteType === '0' ? 'vote' : 'moe'}/${item.followId}`
    )
  } else {
    Toast.fail('用户界面暂未开放')
  }
}

onBeforeMount(() => {
  $query(readCount, {
    filter: {
      userId: JSON.stringify({
        cond: 'eq',
        value: info.value.id,
      }),
    },
  }).then((res) => {
    if (!res.errors) {
      total = res.data.data.total
      getFollow()
    } else {
      Toast.fail(res.data.message)
    }
  })
})
</script>

<style lang="scss" scoped>
.follow-avatar {
  margin-right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
