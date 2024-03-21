<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import { loadPieChartData } from '@/api/chart.js'
import bus from 'vue3-eventbus'


bus.on('show', (e) => {
    getData()
    console.log("chart1,bus exec")
})


const seriesA = ref([])
const chartOptionsA = ref({
    chart: {
        type: 'pie',
        width: 380
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: { width: 200 },
            legend: { position: 'bottom' }
        }
    }]
})

const chartLabelA = computed({
    get: () => { return chartOptionsA.value },
    set: (val) => {
        chartOptionsA.value.labels = val
    },
})

const seriesB = ref([])
const chartOptionsB = ref({ ...chartOptionsA.value })

const seriesC = ref([])
const chartOptionsC = ref({ ...chartOptionsA.value })

const transformChartData = (data, seriesRef, chartOptionsRef) => {
    const labels = data.map(item => item.label)
    const counts = data.map(item => item.count)
    seriesRef.value = counts
    chartOptionsRef.value.labels = labels
    console.log(chartOptionsRef.value.labels)

}

const getData = async () => {
    try {
        const response = await loadPieChartData()
        if (response) {
            transformChartData(response.question1Data, seriesA, chartOptionsA)
            transformChartData(response.question2Data, seriesB, chartOptionsB)
            transformChartData(response.question3Data, seriesC, chartOptionsC)

            console.log(chartOptionsA.value, seriesB.value, seriesC.value)
        } else {
            console.error('No data returned from loadChartData')
        }
    } catch (error) {
        console.error("Failed to load chart data:", error)
    }
}


getData()

onMounted(() => {

    
})

onUnmounted(() => {
    bus.off('test', {})
})


const changeData = () => {
    chartLabelA.value = ['1', '2', '3', '4', '5']
    console.log(chartLabelA.value)
}
</script>

<template>
    <div class="charts">
        <apexchart type="pie" :options="chartOptionsA" :series="seriesA"></apexchart>
        <apexchart type="pie" :options="chartOptionsB" :series="seriesB"></apexchart>
        <apexchart type="pie" :options="chartOptionsC" :series="seriesC"></apexchart>
    </div>
    <button @click="changeData">Reload Data</button>
</template>
