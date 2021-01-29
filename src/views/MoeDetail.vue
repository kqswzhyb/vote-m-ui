<template>
  <div class="bg">
    <van-sticky :offset-top="0">
      <van-nav-bar
        :title="voteInfo.voteName"
        left-text="返回"
        left-arrow
        @click-left="router.go(-1)"
      />
    </van-sticky>
    <div class="vote-info">
      <img
        v-lazy="
          optionalChaining(voteInfo, 'voteConfig', 'file')
            ? $imgBaseUrl +
                optionalChaining(
                  voteInfo,
                  'voteConfig',
                  'file',
                  'fileFullPath'
                ) || '@/assets/images/none.png'
            : ''
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
            v-preventReClick
            @click="followVote"
            >{{ token && isFollow ? '已关注' : '关注' }}</van-button
          >
        </div>
      </div>
    </div>
    <van-tabs v-model:active="area" class="mb15">
      <van-tab title="投票区" name="vote"></van-tab>
      <van-tab title="评论区" name="discuss"></van-tab>
      <van-tab
        title="趋势图"
        v-if="optionalChaining(voteInfo, 'voteConfig', 'showChart') === '0'"
        name="chart"
      ></van-tab>
    </van-tabs>
    <div v-if="area === 'vote'">
      <van-sticky :offset-top="46">
        <van-tabs
          class="no-margin"
          v-model:active="activeTab"
          @change="changeTab"
          v-if="voteInfo.roundStage"
          type="card"
        >
          <van-tab
            v-for="item in voteInfo.roundStage"
            :key="item.id"
            :name="item.id"
            :title="item.name"
          >
          </van-tab>
        </van-tabs>
      </van-sticky>
      <van-sticky
        :offset-top="74"
        v-if="voteInfo.voteRoleType && voteInfo.voteRoleType.length > 1"
      >
        <van-tabs v-model:active="activeRole" sticky>
          <van-tab
            v-for="item in voteInfo.voteRoleType"
            :key="item.id"
            :name="item.id"
            :title="item.name"
          >
          </van-tab>
        </van-tabs>
      </van-sticky>
      <p class="fs12 ml10" v-if="voteInfo.roundStage && rankList.length">
        每{{
          transferDic(
            dicList['vote_update_type'],
            optionalChaining(voteInfo, 'voteConfig', 'voteUpdateType')
          )
        }}更新一次，上次更新于{{
          optionalChaining(rankList, 0, 'roundRole', 0, 'updatedAt')
        }}
      </p>
      <p class="fs12 ml10" v-if="rankList.length">
        投票时间：<span
          >{{ roundStage.startTime }} ~ {{ roundStage.endTime }}</span
        >
      </p>
      <p
        class="fs12 ml10"
        v-if="
          token &&
          voteRecord.length &&
          new Date().getTime() >= new Date(roundStage.startTime).getTime()
        "
      >
        您的选择：<span v-for="(item, index) in voteRecord" :key="item.id"
          >{{ item.roundRole.voteRole.roleName
          }}{{ index === voteRecord.length - 1 ? '' : '，' }}</span
        >
      </p>
      <p
        class="fs12 ml10"
        v-if="
          token &&
          !voteRecord.length &&
          new Date().getTime() >= new Date(roundStage.startTime).getTime() &&
          new Date().getTime() <= new Date(roundStage.endTime).getTime()
        "
      >
        <van-button
          color="linear-gradient(to right, #ff6034, #ee0a24)"
          size="mini"
          @click="showSelectVote"
          >投票</van-button
        >
      </p>
      <div class="vote-cond">
        <template v-if="rankList.length && rankList[0].roundRole.length">
          <div v-for="item in rankList" :key="item.id" class="mt10">
            <h3 class="text-center">{{ item.groupName }}</h3>
            <div class="role-view">
              <div
                v-for="sin in item.roundRole"
                :key="sin.id"
                @click="selectRoundRole(item.id, sin.id)"
              >
                <img
                  v-lazy="
                    optionalChaining(sin.voteRole, 'file')
                      ? $imgBaseUrl +
                          optionalChaining(
                            sin.voteRole,
                            'file',
                            'fileFullPath'
                          ) || '@/assets/images/none.png'
                      : ''
                  "
                  style="width: calc(40vw - 10px); height: calc(40vw - 10px)"
                  alt=""
                />
                <p class="role-name">
                  {{ optionalChaining(sin.voteRole, 'roleName') }}
                </p>
                <p class="role-vote">
                  <van-icon name="fire" color="#fa3b19" class="mr5" /><span
                    class="fs15"
                    >{{ showCount ? sin.totalCount : '???' }}</span
                  >
                  <span
                    v-if="
                      showCount &&
                      new Date().getTime() > new Date(item.endTime).getTime()
                    "
                    >{{
                      sin.isPromotion === '0' ? '（淘汰）' : '（晋级）'
                    }}</span
                  >
                </p>
              </div>
            </div>
          </div>
        </template>
        <van-empty v-else image="search" description="暂无投票信息" />
      </div>
      <div class="select-view" v-if="selectRole">
        <span class="text-center">已选</span>
        <div class="role-view">
          <div
            v-for="(item, index) in rankList"
            class="empty-role"
            :key="item.id"
          >
            <img
              v-if="selectList[index]"
              v-lazy="
                optionalChaining(
                  rankList
                    .find((v) => v.id === selectList[index].roundId)
                    .roundRole.find(
                      (v) => v.id === selectList[index].roundRoleId
                    ).voteRole,
                  'file'
                )
                  ? $imgBaseUrl +
                      optionalChaining(
                        rankList
                          .find((v) => v.id === selectList[index].roundId)
                          .roundRole.find(
                            (v) => v.id === selectList[index].roundRoleId
                          ).voteRole,
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
          <div class="empty-role" @click="outSelect">
            <span>退出</span>
          </div>
          <div class="empty-role" v-preventReClick @click="toVote">
            <span>确定</span>
          </div>
        </div>
      </div>
    </div>
    <DiscussArea v-if="area === 'discuss'" />
    <Chart
      :show="
        voteInfo.status !== '5' ||
        voteInfo.voteConfig.voteShowType === '1' ||
        new Date().getTime() >= new Date(roundStage.endTime).getTime() ||
        !!voteRecord.length
      "
      :rounds="optionalChaining(voteInfo, 'roundStage') || []"
      v-if="area === 'chart'"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, getCurrentInstance, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { readOnePart } from '@/graphql/vote/vote'
import { readOne } from '@/graphql/vote/round'
import {
  createUserFollow,
  deleteUserFollow,
  readAll as readFollow,
} from '@/graphql/user/userFollow'
import { readAll, batchCreateVoteRecord } from '@/graphql/vote/voteRecord'
import { optionalChaining, shuffle, transferDic } from '@/utils/utils'
import { Dialog, Toast } from 'vant'
import DiscussArea from '@/components/DiscussArea.vue'
import Chart from '@/components/Chart.vue'

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
ref: roundStage = {}
ref: showCount = true
ref: voteRecord = []
ref: activeTab = ''
ref: activeRole = ''
ref: selectRole = false
ref: selectList = []
ref: isFollow = false
ref: followId = ''
ref: area = 'vote'

const getRecord = async () => {
  const result = await $query(readAll, {
    filter: {
      userId: JSON.stringify({
        cond: 'eq',
        value: user.value.id,
      }),
      roundStageId: JSON.stringify({
        cond: 'eq',
        value: activeTab,
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
const outSelect = () => {
  selectList = []
  selectRole = false
}
const changeTab = () => {
  if (activeTab !== route.hash.slice(1)) {
    router.replace({ name: 'MoeDetail', hash: `#${activeTab}` })
  }
  voteRecord = []
  outSelect()
  $query(readOne, {
    id: activeTab,
  }).then(async (res) => {
    roundStage = res.data.data
    if (token.value) {
      await getRecord()
      getFollow()
    }
    if (
      voteInfo.status !== '5' ||
      voteInfo.voteConfig.voteShowType === '1' ||
      new Date().getTime() >= new Date(roundStage.endTime).getTime() ||
      !!voteRecord.length
    ) {
      roundStage.round.forEach((v) => {
        v = v.roundRole.sort((a, b) => b.totalCount - a.totalCount)
      })
      rankList = roundStage.round
      showCount = true
    } else {
      roundStage.round.forEach((v) => {
        v = shuffle(v.roundRole)
      })
      rankList = roundStage.round
      showCount = false
    }
  })
}

const getVote = (id) => {
  $query(readOnePart, { id }).then(async (res) => {
    if (!res.errors) {
      voteInfo = res.data.data
      activeRole = voteInfo.voteRoleType[0].id
      if (activeTab !== route.hash.slice(1)) {
        activeTab = voteInfo.roundStage[0].id
      }
      changeTab()
      voteInfo.roundStage.filter(
        (v) => v.roleTypeId === voteInfo.voteRoleType[0].id
      )
    }
  })
}

const showSelectVote = () => {
  selectList = []
  selectRole = true
}

const selectRoundRole = (roundId, roundRoleId) => {
  const index = selectList.findIndex((v) => v.roundId === roundId)
  const data = {
    voteId: route.params.id,
    roundStageId: roundStage.id,
    userId: user.value.id,
    roundId,
    voteType: '0',
    isExtra: '0',
    roundRoleId,
  }
  if (index === -1) {
    selectList.push(data)
  } else {
    selectList.splice(index, 1, data)
  }
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
  if (!selectList.length) {
    Toast.fail('必须至少选择1个投票角色')
    return
  }
  Dialog.confirm({
    title: '提示',
    allowHtml: true,
    message: `确认投票吗，投票后今日将不能继续该类投票，是否继续？`,
  }).then(() => {
    $mutate(batchCreateVoteRecord, {
      input: selectList,
    }).then(async (res) => {
      if (!res.errors) {
        if (res.data.data.code === '0') {
          rankList = voteInfo.roundStage[0].round[0].roundRole.sort(
            (a, b) => b.totalCount - a.totalCount
          )
          showCount = true
          outSelect()
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
  [() => route.hash],
  ([hash]) => {
    if (hash) {
      activeTab = hash.slice(1)
    }
  },
  {
    immediate: true,
  }
)
onBeforeMount(() => {
  voteInfo = {}
  roundStage = {}
  rankList = []
  showCount = true
  voteRecord = []
  selectList = []
  selectRole = false
  area = 'vote'
  getVote(route.params.id)
})
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
    padding-bottom: 70px;
    width: 100%;
    background-color: #fff;
    .role-view {
      display: flex;
      justify-content: space-around;
      .role-name {
        text-align: center;
        margin: 5px 0;
        color: #333;
      }
      .role-vote {
        padding-left: 15px;
        display: flex;
        align-items: center;
        text-align: left;
        margin: 5px 0;
        color: rgb(218, 109, 76);
      }
    }
  }
  .select-view {
    position: fixed;
    left: 20px;
    bottom: 70px;
    @include flex;
    border: 1px solid #333;
    background-color: #fff;
    .role-view {
      @include flex;
      .role-name {
        text-align: center;
        margin: 5px 0;
        color: #333;
      }
    }
    .empty-role {
      width: 40px;
      height: 40px;
      border-left: 1px solid #333;
      line-height: 40px;
    }
  }
}
.no-margin:deep(.van-tabs__nav--card) {
  margin: 0 !important;
}
.no-margin:deep(.van-tabs__nav--complete) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
