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
          {{ voteInfo.hasReward === '0' ? '无奖励' : '有奖励' }}
        </p>
        <div>
          <van-button
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            size="mini"
            class="mr5"
            @click="showDialog('rule')"
            >规则</van-button
          >
          <van-button
            v-if="voteInfo.hasReward"
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            plain
            size="mini"
            class="mr5"
            @click="showDialog('reward')"
            >奖励</van-button
          >
          <van-button
            color="#7232dd"
            size="mini"
            :plain="token && isFollow"
            @click="followVote"
            >{{ token && isFollow ? '已关注' : '关注' }}</van-button
          >
        </div>
      </div>
    </div>
    <div class="ml10" v-if="voteRecord.length">
      <p>
        您的选择：<span v-for="item in voteRecord" :key="item.id">{{
          item.roundRole.voteRole.roleName
        }}</span>
      </p>
    </div>
    <p class="fs12 ml10" v-if="voteInfo.roundStage">
      每{{
        transferDic(
          dicList['vote_update_type'],
          voteInfo.voteConfig.voteUpdateType
        )
      }}更新一次，上次更新于{{
        voteInfo.roundStage[0].round[0].roundRole[0].updatedAt
      }}
    </p>
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
              @click="toVote(item)"
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
import {
  createUserFollow,
  deleteUserFollow,
  readAll as readFollow,
} from '@/graphql/user/userFollow'
import { readAll, batchCreateVoteRecord } from '@/graphql/vote/voteRecord'
import { optionalChaining, shuffle, transferDic } from '@/utils/utils'
import { Dialog, Toast } from 'vant'

const route = useRoute()
const router = useRouter()
const store = useStore()
const {
  appContext: {
    config: {
      globalProperties: { $query, $imgBaseUrl, $mutate },
    },
  },
} = getCurrentInstance()
const token = computed(() => store.getters['common/token'])
const user = computed(() => store.getters['user/info'])
const dicList = computed(() => store.getters['common/dicList'])

ref: voteInfo = {}
ref: rankList = []
ref: showCount = true
ref: voteRecord = []
ref: isFollow = false
ref: followId = ''

const getRecord = async () => {
  const result = await $query(readAll, {
    filter: {
      userId: JSON.stringify({
        cond: 'eq',
        value: user.value.id,
      }),
      roundId: JSON.stringify({
        cond: 'eq',
        value: voteInfo.roundStage[0].round[0].id,
      }),
    },
    page: { limit: 10, offset: 0 },
  })
  if (!result.errors) {
    voteRecord = result.data.data
  }
}

const getFollow = async () => {
  const result = await $query(readFollow, {
    filter: {
      userId: JSON.stringify({
        cond: 'eq',
        value: user.value.id,
      }),
      followId: JSON.stringify({
        cond: 'eq',
        value: route.params.id,
      }),
    },
    page: { limit: 10, offset: 0 },
  })
  if (!result.errors) {
    isFollow = result.data.data.length
    if (result.data.data.length) {
      followId = result.data.data[0].id
    }
  }
}

const getVote = (id) => {
  $query(readOne, { id }).then(async (res) => {
    if (!res.errors) {
      voteInfo = res.data.data
      if (token.value) {
        await getRecord()
        getFollow()
      }
      if (
        voteInfo.status !== '5' ||
        voteInfo.voteConfig.voteShowType === '1' ||
        new Date().getTime() >=
          new Date(voteInfo.roundStage[0].round[0].endTime).getTime() ||
        !!voteRecord.length
      ) {
        rankList = voteInfo.roundStage[0].round[0].roundRole.sort(
          (a, b) => b.totalCount - a.totalCount
        )
        showCount = true
      } else {
        rankList = shuffle(voteInfo.roundStage[0].round[0].roundRole)
        showCount = false
      }
    }
  })
}

const followVote = () => {
  if (!token.value) {
    Toast.fail('请先登录')
    return
  }
  if (!isFollow) {
    $mutate(createUserFollow, {
      input: {
        userId: user.value.id,
        followId: route.params.id,
        followType: '0',
      },
    }).then((res) => {
      if (!res.errors) {
        getFollow()
        Toast.success('关注成功！')
      } else {
        Toast.fail('关注失败，请重试！')
      }
    })
  } else {
    $mutate(deleteUserFollow, {
      id: followId,
    }).then((res) => {
      if (!res.errors) {
        if (res.data.data.code === '0') {
          isFollow = false
          Toast.success('取关成功！')
        } else {
          Toast.fail(res.data.data.message)
        }
      } else {
        Toast.fail('取关失败，请重试！')
      }
    })
  }
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

const toVote = (row) => {
  if (!token.value) {
    Toast.fail('请先登录')
    return
  }
  Dialog.confirm({
    title: '提示',
    allowHtml: true,
    message: `确认为 <b>${row.voteRole.roleName}</b> 投票吗，投票后将不能投票其他角色，是否继续？`,
  }).then(() => {
    $mutate(batchCreateVoteRecord, {
      input: [
        {
          voteId: route.params.id,
          roundStageId: voteInfo.roundStage[0].id,
          userId: user.value.id,
          roundId: voteInfo.roundStage[0].round[0].id,
          voteType: '0',
          isExtra: '0',
          roundRoleId: row.id,
        },
      ],
    }).then(async (res) => {
      if (!res.errors) {
        if (res.data.data.code === '0') {
          rankList = voteInfo.roundStage[0].round[0].roundRole.sort(
            (a, b) => b.totalCount - a.totalCount
          )
          showCount = true
          await getRecord()
          Toast.success('投票成功！')
        } else {
          Toast.fail(res.data.data.message)
        }
      } else {
        Toast.fail('投票失败，请重试！')
      }
    })
  })
}

watch(
  () => route.params,
  (val) => {
    if (val.id) {
      voteInfo = {}
      rankList = []
      showCount = true
      voteRecord = []
      isFollow = false
      getVote(val.id)
    }
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
