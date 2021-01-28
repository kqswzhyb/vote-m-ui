<template>
  <div class="bg">
    <div class="order-list">
      <div class="user-info">
        <div class="flex-between">
          <div class="avatar-view" @click="goLogin">
            <img
              class="avatar"
              :src="
                token
                  ? info.file
                    ? $imgBaseUrl + info.file.fileFullPath
                    : '@/assets/images/default_user.jpg'
                  : '@/assets/images/default_user.jpg'
              "
            />
          </div>
          <p @click="goLogin">{{ !token ? '请先登录' : info.nickname }}</p>
        </div>
        <van-badge
          v-if="message.unread > 0"
          :content="message.unread"
          :max="99"
          @click="router.push('/message')"
        >
          <span class="iconfont icon-remind fs24" style="color: #fff"></span>
        </van-badge>
        <span
          v-else
          class="iconfont icon-remind fs24"
          style="color: #fff"
        ></span>
      </div>
    </div>
    <van-grid direction="horizontal" :column-num="3">
      <van-grid-item
        v-for="item in personGridList"
        :key="item.content"
        :icon="item.icon"
        :text="item.content"
        @click="router.push(item.path)"
      />
    </van-grid>
    <van-button v-if='token' type="primary" size="large" plain @click="goLogout"
      >退出登录</van-button
    >
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { personGridList } from '@/setting'
import { logout } from '@/graphql/api.ts'

const store = useStore()
const router = useRouter()

const token = computed(() => store.getters['common/token'])
const info = computed(() => store.getters['user/info'])
const message = computed(() => store.getters['user/message'])

const goLogin = () => {
  if (!token.value) {
    router.push('/login')
  }
}
const goLogout = () => {
  logout().then((res) => {
    if (res.data.code === '0') {
      localStorage.removeItem('token')
      window.location.reload()
    }
  })
}
</script>

<style lang="scss" scoped>
.user-info {
  width: 100vw;
  padding: 15px;
  box-sizing: border-box;
  @include flex;
  justify-content: space-between;
  background-color: #f50;

  .avatar-view {
    margin-right: 15px;
    width: 20vw;
    height: 20vw;
    border-radius: 50%;
    border: 1px solid #eee;
  }

  .avatar {
    width: 20vw;
    height: 20vw;
    border-radius: 50%;
  }
}
</style>
