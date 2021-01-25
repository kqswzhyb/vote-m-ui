<template>
  <div>
    <p class="pl10">
      共<span class="high-text"> {{ total }} </span>条评论
    </p>
  </div>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="getDiscuss"
  >
    <div v-for="item in list" class="discuss-cell" :key="item.id">
      <div class="user-avatar">
        <img
          v-lazy="
            optionalChaining(item.user, 'file')
              ? $imgBaseUrl +
                  optionalChaining(item.user, 'file', 'fileFullPath') ||
                '@/assets/images/none.png'
              : ''
          "
          width="40"
          height="40"
          alt=""
        />
      </div>
      <div>
        <span>{{ item.user.nickname }}</span>
        <span v-time="item.createdAt"></span>
      </div>
    </div>
  </van-list>
  <div class="discuss-input-view">
    <van-field
      v-model="message"
      rows="1"
      autosize
      size="mini"
      type="textarea"
      maxlength="50"
      placeholder="请输入评论"
      class="discuss-input"
    />
    <van-button
      plain
      size="mini"
      type="primary"
      class="discuss-button"
      @click="submitDiscuss"
      v-preventReClick
      >评论</van-button
    >
  </div>
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import {
  createVoteDiscuss,
  readAll,
  readCount,
} from '@/graphql/vote/voteDiscuss'
import { Toast } from 'vant'
import { optionalChaining } from '@/utils/utils'

const route = useRoute()
const store = useStore()
const user = computed(() => store.getters['user/info'])
const {
  appContext: {
    config: {
      globalProperties: { $query, $imgBaseUrl, $mutate },
    },
  },
} = getCurrentInstance()

ref: message = ''
ref: current = 0
ref: size = 10
ref: total = ''
ref: totalFloor = ''
ref: list = []
ref: loading = false
ref: finished = false

const getDiscuss = () => {
  loading = true
  if (totalFloor !== '' && totalFloor <= current * size) {
    finished = true
    return
  }
  current += 1
  const filter = {
    status: JSON.stringify({
      cond: 'eq',
      value: '0',
    }),
    voteId: JSON.stringify({
      cond: 'eq',
      value: route.params.id,
    }),
  }
  if (total === '') {
    $query(readCount, {
      filter,
    }).then((res) => {
      if (!res.errors) {
        total = res.data.data.total
      }
    })
  }
  if (totalFloor === '') {
    $query(readCount, {
      filter: {
        replyId: JSON.stringify({
          cond: 'eq',
          value: '-1',
        }),
        status: JSON.stringify({
          cond: 'eq',
          value: '0',
        }),
        voteId: JSON.stringify({
          cond: 'eq',
          value: route.params.id,
        }),
      },
    }).then((res) => {
      if (!res.errors) {
        totalFloor = res.data.data.total
      }
    })
  }
  $query(readAll, {
    filter,
    page: { limit: size, offset: (current - 1) * size },
  }).then((res) => {
    if (!res.errors) {
      list = res.data.data
      loading = false
    } else {
      Toast.fail('获取评论失败，请重试！')
    }
  })
}

const submitDiscuss = () => {
  $mutate(createVoteDiscuss, {
    input: {
      voteId: route.params.id,
      replyId: '-1',
      content: message,
      likeCount: 0,
      dislikeCount: 0,
      userId: user.value.id,
    },
  }).then((res) => {
    if (!res.errors) {
      message = ''
      current = 0
      size = 10
      total = ''
      totalFloor = ''
      list = []
      loading = false
      finished = false
      getDiscuss()
      Toast.success('评论成功！')
    } else {
      Toast.fail('评论失败，请重试！')
    }
  })
}
</script>
<style lang="scss" scoped>
.high-text {
  color: #ff4800;
}
.discuss-cell {
    display: flex;
    .user-avatar {
        width: 40px;
        img{
            border-radius: 50%;
        }
    }
}
.discuss-input-view {
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
  @include flex;
  border-top: 1px solid #eee;
  background-color: #fff;
  padding: 10px;
  .discuss-input {
    margin-right: 5vw;
    width: 75vw;
    border: 1px solid rgb(241, 158, 230);
    border-radius: 30px;
  }
  .discuss-button {
    width: calc(20vw - 20px);
  }
}
</style>
