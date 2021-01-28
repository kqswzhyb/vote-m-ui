<template>
  <div v-if="show">
    <van-field
      v-model="state.fieldValue"
      is-link
      readonly
      label="场次"
      placeholder="请选择查看的场次"
      @click="state.show = true"
    />
    <van-popup v-model:show="state.show" round position="bottom">
      <van-cascader
        v-model="state.cascaderValue"
        title="请选择所在地区"
        :options="options"
        @close="state.show = false"
        @change="onChange"
        @finish="onFinish"
      />
    </van-popup>
    <div ref="chart" class="chart"></div>
  </div>

  <van-empty v-else image="search" description="未满足查看条件" />
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  getCurrentInstance,
  computed,
  defineProps,
  reactive,
  watch,
} from 'vue'
import * as echarts from 'echarts'
import { readOne } from '@/graphql/vote/roundRoleChart'
import { readOne as readRound } from '@/graphql/vote/round'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'

const route = useRoute()
const store = useStore()
const token = computed(() => store.getters['common/token'])
const user = computed(() => store.getters['user/info'])
const {
  appContext: {
    config: {
      globalProperties: { $query, $imgBaseUrl, $mutate },
    },
  },
} = getCurrentInstance()
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  rounds: {
    type: Array,
    default: () => [],
  },
})
ref: chart = null
ref: myChart = null
ref: option = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: [],
    type: 'scroll',
    left: '3%',
    top: '0',
    show: true,
    textStyle: {
      color: '#333',
    },
  },
  grid: {
    left: '1%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: ['10px', '10px'],
    axisLabel: { showMaxLabel: true, color: '#333' },
    axisLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    axisTick: {
      length: '0',
    },
    data: [],
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100,
    },
    {
      start: 0,
      end: 100,
      dataBackground: {
        lineStyle: {
          color: '#333',
        },
        areaStyle: {
          color: 'rgba(255,255,255,.3)',
        },
      },
      handleStyle: {
        color: '#333',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      },
      textStyle: {
        color: '#333',
      },
    },
  ],
  color: [
    '#d82020',
    '#473ce2',
    '#fed435',
    'pink',
    '#be5dee',
    'green',
    '#00eaee',
    '#6e7074',
    '#546570',
    '#c4ccd3',
  ],
  yAxis: {
    scale: true,
    axisLine: {
      show: false,
    },
    axisLabel: { color: '#333' },
    axisTick: {
      inside: true,
      length: 1771,
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  series: [],
}
ref: options = []
const state = reactive({
  show: false,
  fieldValue: '',
  cascaderValue: '',
})


const getChart = (id) => {
  $query(readOne, { id }).then((res) => {
    if (!res.errors) {
      const data = res.data.data
      option.legend.data = data.roles.map((v) => v.name)
      option.xAxis.data = data.times
      option.series = data.roles.map((v) => ({
        name: v.name,
        type: 'line',
        data: v.totalCount,
      }))
      myChart.setOption(option)
    } else {
      Toast.fail('获取场次失败，请重试！')
    }
  })
}

const onFinish = ({ selectedOptions }) => {
  state.show = false
  getChart(selectedOptions[1].value)
  state.fieldValue = selectedOptions.map((option) => option.text).join('/')
}

const onChange = ({ value }) => {
  const index = options.findIndex((v) => v.value === value)
  if (index !== -1 && !options[index].children.length) {
    $query(readRound, {
      id: value,
    }).then(async (res) => {
      if (!res.errors) {
        options[index].children = res.data.data.round.map((v) => ({
          text: v.groupName,
          value: v.id,
        }))
      } else {
        Toast.fail('获取场次失败，请重试！')
      }
    })
  }
}

onMounted(() => {
  myChart = echarts.init(chart)
})

watch(
  () => props.rounds,
  (val) => {
    options = val.map((v) => ({
      text: v.name,
      value: v.id,
      children: [],
    }))
  },
  {
    immediate: true,
  }
)
</script>
<style lang="scss" scoped>
.chart {
  margin: 0 10px;
  width: calc(100vw - 20px);
  height: calc(70vw - 10px);
}
</style>
