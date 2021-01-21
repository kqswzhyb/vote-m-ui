import request from '../utils/request'

//登录
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}
//用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}
