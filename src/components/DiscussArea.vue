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
    class="mb15"
    @load="getDiscuss"
  >
    <template v-if="list.length">
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
          <p class="discuss-title">
            <span class="user-name">{{
              optionalChaining(item.user, 'nickname')
            }}</span
            ><span class="discuss-floor">{{ item.floor }}楼</span>
          </p>
          <p
            class="discuss-time"
            v-time="item.createdAt"
            @click="replyUser(item.id, item.user.nickname)"
          ></p>
          <p
            class="discuss-text"
            :class="{ 'text-ell': item.expand === false }"
            :id="item.id"
            @click="replyUser(item.id, item.user.nickname)"
          >
            {{ item.content }}
          </p>
          <p
            class="expand-btn"
            v-if="item.expand === false || item.expand === true"
          >
            <span @click="item.expand = !item.expand">{{
              item.expand ? '收起' : '展开'
            }}</span>
          </p>
          <div class="discuss-bottom">
            <div>
              <span
                v-if="item.signalType !== '0'"
                class="iconfont icon-good signal"
                @click="giveSignal(item.id, '0')"
              ></span
              ><span
                v-else
                class="iconfont icon-good-fill signal-fill"
                @click="deleteSignal(item.id, '0')"
              ></span
              ><span class="signal-count">{{ item.likeCount }}</span>
              <span
                v-if="item.signalType !== '1'"
                class="iconfont icon-bad signal"
                @click="giveSignal(item.id, '1')"
              ></span
              ><span
                v-else
                class="iconfont icon-bad-fill signal-fill"
                @click="deleteSignal(item.id, '1')"
              ></span
              ><span class="signal-count">{{ item.dislikeCount }}</span>
            </div>
            <div
              class="reply-btn"
              v-if="item.voteDiscuss.length"
              @click="openReply(item.id)"
            >
              <span>回复({{ item.voteDiscuss.length }})</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <van-empty v-else image="search" description="暂无评论" />
  </van-list>

  <div class="discuss-input-view">
    <van-field
      v-model="message"
      rows="1"
      autosize
      size="mini"
      type="textarea"
      maxlength="500"
      :placeholder="point.placeholder"
      class="discuss-input"
    />
    <div class="discuss-button">
      <van-button
        plain
        size="mini"
        type="primary"
        @click="submitDiscuss"
        v-preventReClick
        >评论</van-button
      >
      <van-button
        plain
        size="mini"
        type="primary"
        v-if="point.replyId !== '-1'"
        @click="resetMessage"
        v-preventReClick
        >取消</van-button
      >
    </div>
  </div>
  <ReplyArea :showPopover="showPopover" :reply="reply" @close="closeReply" />
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import {
  createVoteDiscuss,
  createVoteDiscussSignal,
  deleteVoteDiscussSignal,
  readAll,
  readCount,
} from '@/graphql/vote/voteDiscuss'
import { Toast } from 'vant'
import { optionalChaining } from '@/utils/utils'
import ReplyArea from './ReplyArea.vue'

const route = useRoute()
const store = useStore()
const token = computed(() => store.getters['common/token'])
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
ref: showPopover = false
ref: reply = []
ref: point = {
  replyId: '-1',
  placeholder: '请输入评论',
}

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
    page: { limit: size, offset: (current - 1) * size },
  }).then((res) => {
    if (!res.errors) {
      list = list.concat(res.data.data)
      list.forEach((v) => {
        nextTick(() => {
          if (document.getElementById(v.id).offsetHeight > 60) {
            v.expand = false
          }
        })
      })
      loading = false
    } else {
      Toast.fail('获取评论失败，请重试！')
    }
  })
}

const openReply = (id) => {
  reply = id
  showPopover = true
}
const closeReply = () => {
  showPopover = false
}

const resetMessage = () => {
  point.replyId = '-1'
  point.placeholder = '请输入评论'
}

const replyUser = (id, nickname) => {
  point.replyId = id
  point.placeholder = `@${nickname}`
}

const giveSignal = (id, type) => {
  if (!token.value) {
    Toast.fail('请先登录')
    return
  }
  $mutate(createVoteDiscussSignal, {
    input: {
      voteDiscussId: id,
      signalType: type,
      userId: user.value.id,
    },
  }).then((res) => {
    if (!res.errors) {
      const index = list.findIndex((v) => v.id === id)
      list[index][type === '0' ? 'likeCount' : 'dislikeCount']++
      if (list[index].signalType === '0' || list[index].signalType === '1') {
        list[index][type !== '0' ? 'likeCount' : 'dislikeCount']--
      }
      list[index].signalType = type
    } else {
      Toast.fail('失败，请重试！')
    }
  })
}

const deleteSignal = (id, type) => {
  if (!token.value) {
    Toast.fail('请先登录')
    return
  }
  $mutate(deleteVoteDiscussSignal, {
    id,
  }).then((res) => {
    if (!res.errors) {
      const index = list.findIndex((v) => v.id === id)
      list[index][type === '0' ? 'likeCount' : 'dislikeCount']--
      list[index].signalType = null
    } else {
      Toast.fail('失败，请重试！')
    }
  })
}

const submitDiscuss = () => {
  if (!token.value) {
    Toast.fail('请先登录')
    return
  }
  $mutate(createVoteDiscuss, {
    input: {
      voteId: route.params.id,
      replyId: point.replyId,
      content: message,
      likeCount: 0,
      dislikeCount: 0,
      userId: user.value.id,
    },
  }).then((res) => {
    if (!res.errors) {
      message = ''
      if (point.replyId === '-1') {
        list.unshift(res.data.data)
      } else {
        const index = list.findIndex((v) => v.id === point.replyId)
        list[index].voteDiscuss.unshift(res.data.data)
      }
      resetMessage()
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
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #ececec;
  .user-avatar {
    width: 40px;
    img {
      border-radius: 50%;
    }
  }
  .discuss-title {
    width: calc(100vw - 80px);
    @include flex;
    justify-content: space-between;
    margin: 0 10px;
    .user-name {
      color: #ff009d;
      font-size: 13px;
    }
    .discuss-floor {
      margin-right: 5px;
      color: #9c9b9b;
      font-size: 13px;
    }
  }
  .discuss-time {
    margin: 0 10px;
    font-size: 12px;
    color: #9c9b9b;
  }
  .discuss-text {
    margin: 10px 10px 0;
    font-size: 14px;
    color: #333;
    line-height: 20px;
    word-break: break-all;
  }
  .signal {
    margin: 5px 10px 0;
    font-size: 16px;
    color: #9c9b9b;
  }
  .signal-fill {
    margin: 5px 10px 0;
    font-size: 16px;
    color: #ff0000;
  }
  .signal-count {
    min-width: 10px;
    display: inline-block;
    font-size: 14px;
    color: rgb(71, 70, 70);
    text-align: center;
  }
  .expand-btn {
    margin: 5px 10px 0;
    color: rgb(71, 70, 70);
    font-size: 14px;
  }
  .discuss-bottom {
    margin-top: 10px;
    margin-bottom: 1px;
    @include flex;
    justify-content: space-between;
    .reply-btn {
      margin-right: 15px;
      font-size: 14px;
      color: rgb(71, 70, 70);
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
.text-ell {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
