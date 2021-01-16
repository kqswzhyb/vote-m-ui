<template>
  <div class="bg">
    <h2 class="text-center">登录</h2>
    <van-form @submit="onSubmit">
      <van-field
        v-model="state.username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="state.qqOpenId"
        type="password"
        name="qqOpenId"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { login } from '@/graphql/api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'

const router = useRouter()
const store = useStore()
const state = reactive({
  username: '',
  qqOpenId: '',
})
const onSubmit = (values) => {
  login(values).then((res) => {
    if (res.data.code === '0') {
      localStorage.setItem('token', res.data.data)
      store.commit('common/setToken', res.data.data)
      Toast.success('登录成功')
      router.push('/')
    } else {
      Toast.fail(res.data.message)
    }
  })
}
</script>

<style lang="scss">
.bg {
  background-color: #f7f7f7;
  height: 100vh;
}
</style>
