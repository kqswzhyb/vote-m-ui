var Time = {
  // 获取标准年月日
  getStandardDate(time) {
    var date = new Date(time)
    var year = date.getFullYear()
    var month =
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    var day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return `${year}-${month}-${day}`
  },
  // 获取转换后的时间
  getFormatTime(timestamp) {
    var now = new Date().getTime()
    var offset = (now - timestamp) / 1000
    var tip = ''
    if (offset < 60) {
      tip = '刚刚'
    } else if (offset > 60 && offset < 3600) {
      tip = `${Math.floor(offset / 60)}分钟前`
    } else if (offset >= 3600 && offset < 86400) {
      tip = `${Math.floor(offset / 3600)}小时前`
    } else if (offset / 86400 < 31) {
      tip = `${Math.ceil(offset / 86400)}天前`
    } else {
      tip = this.getStandardDate(timestamp)
    }
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
      // 显示内容
      el.innerHTML = Time.getFormatTime(new Date(binding.value).getTime())
      // 创建自定义属性：定时器
      el.__timeout__ = setInterval(function () {
        el.innerHTML = Time.getFormatTime(new Date(binding.value).getTime())
      }, 60000)
    },
    unmounted(el) {
      // 删除自定义属性
      clearInterval(el.__timeout__)
      delete el.__timeout__
    },
  },
}
