<template>
  <div class="bg">
    <van-nav-bar
      :title="voteInfo.voteName"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="vote-info">
      <img
        v-lazy="
          $imgBaseUrl +
            optionalChaining(voteInfo, 'voteConfig', 'file', 'fileFullPath') ||
          '@/assets/images/none.png'
        "
        style="width: calc(50vw - 10px); height: calc(50vw - 10px)"
        alt=""
      />
      <div class="ml15">
        <p class="fs12 grey1">从 {{ voteInfo.startTime }}</p>
        <p class="fs12 grey1">至 {{ voteInfo.endTime }}</p>
        <p class="fs12 grey1">
          {{
            optionalChaining(voteInfo, 'voteConfig', 'voteLevel') === 0
              ? '等级无限制'
              : `等级大于等于${optionalChaining(
                  voteInfo,
                  'voteConfig',
                  'voteLevel'
                )}`
          }}
        </p>
        <p class="fs12 grey1">
          {{
            optionalChaining(voteInfo, 'voteConfig', 'voteQqVip') === '0'
              ? '需要QQ会员'
              : '无会员限制'
          }}
        </p>
        <p class="fs12 grey1">
          {{
            optionalChaining(voteInfo, 'voteConfig', 'voteQqVip') === '0'
              ? '需要QQ会员'
              : '无会员限制'
          }}
        </p>
        <p class="fs12 grey1">
          {{ voteInfo.hasReward === '0' ? '无奖励' : '有奖励' }}
        </p>
        <div>
          <van-button
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            size="mini"
            @click="showDialog('rule')"
            >查看规则</van-button
          >
          <van-button
            v-if="voteInfo.hasReward"
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            plain
            size="mini"
            @click="showDialog('reward')"
            >查看奖励</van-button
          >
        </div>
      </div>
    </div>
    <div class="vote-cond">
      <div class="vote-table-header">
        <p class="text-center" style="width: 20vw">名次</p>
        <p style="width: 60vw">角色</p>
        <p style="width: 20vw">票数</p>
      </div>
      <template v-if="voteInfo.roundStage">
        <div
          v-for="(item, index) in rankList"
          :key="item.id"
          class="vote-table-body"
        >
          <p class="text-center" style="width: 20vw">
            {{ showCount ? index + 1 : '???' }}
          </p>
          <p style="width: 60vw">{{ item.voteRole.roleName }}</p>
          <p style="width: 20vw">
            <span v-if="showCount">{{ item.totalCount }}</span>
            <van-button
              v-else
              type="primary"
              plain
              size="mini"
              @click="toVote(item.id)"
              >投票</van-button
            >
          </p>
        </div>
      </template>
      <van-empty v-else image="search" description="暂无投票信息" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, getCurrentInstance, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { readOne } from '@/graphql/vote/vote'
import { optionalChaining, shuffle } from '@/utils/utils'
import { Dialog, Toast } from 'vant'

const route = useRoute()
const router = useRouter()
const store = useStore()
const {
  appContext: {
    config: {
      globalProperties: { $query, $imgBaseUrl },
    },
  },
} = getCurrentInstance()
const token = computed(() => store.getters['common/token'])

ref: voteInfo = {}
ref: rankList = []
ref: showCount = true

const getVote = (id) => {
  $query(readOne, { id }).then((res) => {
    if (!res.errors) {
      voteInfo = res.data.data
      if (
        voteInfo.status !== '5' ||
        voteInfo.voteConfig.voteShowType === '1' ||
        new Date().getTime() >=
          new Date(voteInfo.roundStage[0].round[0].endTime).getTime()
      ) {
        rankList = voteInfo.roundStage[0].round[0].roundRole.sort(
          (a, b) => a.totalCount - b.totalCount
        )
        showCount = true
      } else {
        rankList = shuffle(voteInfo.roundStage[0].round[0].roundRole)
        showCount = false
      }
    }
  })
}

const onClickLeft = () => {
  router.back()
}
const showDialog = (mode) => {
  let title = ''
  let message = ''
  if (mode === 'rule') {
    title = '投票规则'
    message = voteInfo.ruleContent
  }
  if (mode === 'reward') {
    title = '奖励'
    message = voteInfo.rewardContent
  }
  Dialog.alert({
    title,
    message,
  }).then(() => {
    // on close
  })
}

const toVote = (id) => {
  if (!token.value) {
    Toast.fail('请先登录')
    return
  }
}

watch(
  () => route.params,
  (val) => {
    if (val.id) {
      getVote(val.id)
    }
    console.log(val)
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
.bg {
  background-color: #f7f7f7;
  min-height: 100vh;
  height: auto;
  .vote-title {
    margin: 0;
    padding: 10px;
    background-color: #f50;
    color: #fff;
  }
  .vote-info {
    margin: 10px;
    display: flex;
  }
  .vote-cond {
    margin-top: 20px;
    width: 100%;
    background-color: #fff;
    .vote-table-header {
      display: flex;
    }
    .vote-table-body {
      display: flex;
    }
  }
}
</style>
