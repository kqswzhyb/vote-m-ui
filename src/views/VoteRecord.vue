<template>
  <div class="bg">
    <van-sticky class="mb10" :offset-top="0">
      <van-nav-bar
        title="投票记录"
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
      <van-cell v-for="item in list" :key="item.id">
        <template #title>
          <div class="flex" style="flex-wrap: wrap">
            <span>{{
              `于 ${item.createdAt} ，在 ${item.vote.voteName} 比赛 ${item.round.roundName} 场次中，为 `
            }}</span>
            <div class="follow-avatar">
              <img
                v-lazy="
                  optionalChaining(item.roundRole, 'voteRole', 'file')
                    ? $imgBaseUrl +
                        optionalChaining(
                          item.roundRole,
                          'voteRole',
                          'file',
                          'fileFullPath'
                        ) || '@/assets/images/none.png'
                    : ''
                "
                width="40"
                height="40"
                alt=""
              />
            </div>
            <span>{{
              optionalChaining(item.roundRole, 'voteRole', 'roleName')
            }}</span>
            <span>{{
              ` 投了 ${item.voteType === '0' ? '普通票' : '特殊票'} 一张`
            }}</span>
          </div>
        </template>
      </van-cell>
    </van-list>
    <van-empty v-else image="search" description="暂无记录" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, getCurrentInstance, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { readAll, readCount } from '@/graphql/vote/voteRecord'
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

const getRecord = () => {
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
      getRecord()
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
