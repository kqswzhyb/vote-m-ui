<template>
  <div class="bg">
    <van-sticky :offset-top="0">
      <van-nav-bar
        :title="voteInfo.voteName"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
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
                  $imgBaseUrl +
                    optionalChaining(sin.voteRole, 'file', 'fileFullPath') ||
                  '@/assets/images/none.png'
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
                  >{{ sin.totalCount }}</span
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
              $imgBaseUrl +
                optionalChaining(
                  rankList
                    .find((v) => v.id === selectList[index].roundId)
                    .roundRole.find(
                      (v) => v.id === selectList[index].roundRoleId
                    ).voteRole,
                  'file',
                  'fileFullPath'
                ) || '@/assets/images/none.png'
            "
            width="40"
            height="40"
            alt=""
          />
        </div>
        <div class="empty-role" @click="outSelect">
          <span>退出</span>
        </div>
        <div class="empty-role" @click="toVote">
          <span>确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, getCurrentInstance, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { readOnePart } from '@/graphql/vote/vote'
import { readOne } from '@/graphql/vote/round'
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

ref:voteInfo = {}
ref:rankList = []
ref:roundStage = {}
ref:showCount = true
ref:voteRecord = []
ref:activeTab = ''
ref:activeRole = ''
ref:selectRole = false
ref:selectList = []

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
const outSelect = () => {
  selectList = []
  selectRole = false
}
const changeTab = () => {
  // router.go(`#${activeTab}`)
  voteRecord = []
  outSelect()
  $query(readOne, {
    id: activeTab,
  }).then(async (res) => {
    roundStage = res.data.data
    if (token.value) {
      await getRecord()
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
      activeTab = voteInfo.roundStage[0].id
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
  [() => route.params.id, () => route.hash],
  ([id, hash]) => {
    if (id) {
      voteInfo = {}
      roundStage = {}
      rankList = []
      showCount = true
      voteRecord = []
      selectList = []
      selectRole = false
      getVote(id)
    }
    if (hash) {
      //   activeTab = hash
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
    padding-bottom: 50px;
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
    display: flex;
    align-items: center;
    border: 1px solid #333;
    background-color: #fff;
    .role-view {
      display: flex;
      align-items: center;
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
