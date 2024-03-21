<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ApexChart from 'vue3-apexcharts'
import { loadColumnChartData } from '@/api/chart.js'
import bus from 'vue3-eventbus'


bus.on('show', (e) => {
  getData()
  console.log("chart2,bus exec")
})


const series = ref([{
  name: 'Inflation',
  data: [] // 这里将存放计数
}])

const chartOptions = ref({
  chart: {
    height: 350,
    type: 'bar',
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: 'top', // top, center, bottom
      },
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val // 如果不是百分比，直接返回val即可
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ["#304758"]
    }
  },
  xaxis: {
    categories: [], // 这里将存放月份
    position: 'top',
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        }
      }
    },
    tooltip: {
      enabled: true,
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: true, // 确保y轴标签显示
      formatter: function (val) {
        return val // 直接返回计数
      }
    }
  },
  title: {
    text: 'Monthly Inflation in Argentina, 2002',
    floating: true,
    offsetY: 330,
    align: 'center',
    style: {
      color: '#444'
    }
  }
})

onMounted(() => {
  getData()

})

// 按月份聚合数据的函数
function aggregateDataByMonth(data) {
  return data.reduce((acc, { _id, count }) => {
    const [day, month, year] = _id.split('/')
    const monthYear = `${month}/${year}`
    if (!acc[monthYear]) {
      acc[monthYear] = 0
    }
    acc[monthYear] += count // 累加同一月份的count
    return acc
  }, {})

}

const getData = async () => {
  try {
    const response = await loadColumnChartData()
    const dateData = response.dateData // 确保这是正确的路径

    // 聚合数据并更新图表选项
    const aggregatedData = aggregateDataByMonth(dateData)
    chartOptions.value.xaxis.categories = Object.keys(aggregatedData) // 月份作为x轴
    series.value[0].data = Object.values(aggregatedData) // 对应的计数作为y轴数据
  } catch (error) {
    console.error("Failed to load chart data:", error)
  }
}


</script>

<template>
  <div id="app">
    <apexchart type="bar" :options="chartOptions" :series="series" />
  </div>
</template>
