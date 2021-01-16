<template>
  <div class="bg">
    <div class="order-list">
      <div class="user-info">
        <div style="display: flex; align-items: center">
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
      </div>
    </div>
    <van-grid direction="horizontal" :column-num="3">
      <van-grid-item icon="records" text="投票记录" />
      <van-grid-item icon="star-o" text="我的关注" />
      <van-grid-item icon="discount" text="数据分析" />
    </van-grid>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const token = computed(() => store.getters['common/token'])
const info = computed(() => store.getters['user/info'])

const goLogin = () => {
  if (!token.value) {
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.bg {
  background-color: #f7f7f7;
  height: 100vh;
}

.user-info {
  width: 100vw;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
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
