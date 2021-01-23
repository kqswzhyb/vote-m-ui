<template>
  <div class="bg">
      <van-sticky class="mb10" :offset-top="0">
      <van-nav-bar
        title="消息中心"
        left-text="返回"
        left-arrow
        @click-left="router.go(-1)"
      />
    </van-sticky>
    <van-list
      v-if="token && message.list.length"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      :offset="0"
      @load="onLoad"
    >
      <van-cell v-for="item in message.list" :key="item.id" :title="item.title">
        <template #right-icon>
          <span :class="item.status === '0' ? 'unread' : 'read'">{{
            item.status === '0' ? '未读' : '已读'
          }}</span>
        </template>
        <template #label>
          <div>
            <span>{{ item.content }}</span>
            <router-link :to="item.url" v-if="item.url">网页链接</router-link>
          </div>
          <p :class="item.status === '0' ? 'hasBtn' : 'noBtn'">
            <van-button
              v-if="item.status === '0'"
              color="linear-gradient(to right, #ff6034, #ee0a24)"
              size="mini"
              v-preventReClick
              @click="readMessage(item.id)"
            >
              标记为已读
            </van-button>
            <span class="ml5">{{ item.createdAt }}</span>
          </p>
        </template>
      </van-cell>
    </van-list>
    <van-empty v-else image="search" description="暂无消息" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { updateUserMessage } from '@/graphql/user/userMessage'
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
const message = computed(() => store.getters['user/message'])
const finished = computed(
  () => message.value.total <= message.value.page * message.value.size
)

ref: loading = false

const onLoad = async () => {
  loading = true
  await store.dispatch('user/getUserMessage')
  loading = false
}

const readMessage = (id) => {
  $mutate(updateUserMessage, {
    id,
    input: {
      status: '1',
    },
  }).then((res) => {
    if (!res.errors) {
      const index = message.value.list.findIndex((v) => v.id === id)
      message.value.list[index] = res.data.data
      store.dispatch('user/getUserUnreadMessage')
      Toast.success('成功')
    } else {
      Toast.fail(res.data.message)
    }
  })
}
</script>

<style lang="scss" scoped>
.unread {
  color: #ff0000;
}
.read {
  color: #aaa;
}
.hasBtn {
  @include flex;
  justify-content: space-between;
}
.noBtn {
  @include flex;
  justify-content: flex-end;
}
</style>
