const Time = {
  // 获取当前时间戳
  getUnix: function () {
    let date = new Date()
    return date.getTime()
  },

  // 获取今天 0 点 0 分 0 秒的时间戳
  getTodayUnix: function () {
    let date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },

  // 获取今年 1 月 1 日 0 点 0 分 0 秒的时间戮
  getYearUnix: function () {
    let date = new Date()
    date.setMonth(0)
    date.setDate(1)
    date.setHours(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },

  // 获取标准年月日
  getLastDate: function (time) {
    let date = new Date(time)
    let month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return date.getFullYear() + '-' + month + '-' + day
  },

  // 转换时间
  // 自定义指令 v-time 所需的，入参为毫秒级时间戳
  getFormatTime: function (timestamp) {
    let now = this.getUnix() // 当前时间戮
    let today = this.getTodayUnix() // 当天 0 点时间戮
    let year = this.getYearUnix() // 当年 0 点时间戮
    let timer = (now - timestamp) / 1000 // 转换为秒级时间戮
    let tip = ''

    if (timer <= 0) {
      tip = '刚刚'
    } else if (Math.floor(timer / 60) <= 0) {
      tip = '刚刚'
    } else if (timer < 3600) {
      tip = Math.floor(timer / 60) + '分钟前'
    } else if (timer >= 3600 && timestamp - today >= 0) {
      tip = Math.floor(timer / 3600) + '小时前'
    } else if (timer / 86400 <= 31) {
      tip = Math.ceil(timer / 86400) + '天前'
    } else {
      tip = this.getLastDate(timestamp)
    }
    // 返回己整理好时间格式的字符串。
    return tip
  },
}
export default {
  preventReClick: {
    mounted(el, binding) {
      el.addEventListener('click', () => {
        if (!el.disabled) {
          el.disabled = true
          setTimeout(() => {
            el.disabled = false
          }, binding.value || 1000)
        }
      })
    },
  },
  time: {
    mounted(el, binding) {
      el.innerHTML = Time.getFormatTime(binding.value)
      // 定时器 el.__timeout__ 每分钟触发一次，更新时间
      el.__timeout__ = setInterval(function () {
        // 将格式化时间写入指令所在元素
        el.innerHTML = Time.getFormatTime(binding.value)
      }, 60000) // 注意这里的60000是毫秒
    },
    unmounted(el) {
      // 在 unbind 钩子里清除定时器。
      clearInterval(el.__timeout__)
      delete el.__timeout__
    },
  },
}
