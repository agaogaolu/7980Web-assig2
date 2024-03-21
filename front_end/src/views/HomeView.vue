<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import SurveyFragment from '@/components/SurveyFragment.vue'
import Chart1 from '@/components/Chart1.vue'
import Chart2 from '@/components/Chart2.vue'
import Chart3 from '@/components/Chart3.vue'
import { onUnmounted, onMounted ,ref} from 'vue'
import bus from 'vue3-eventbus'

bus.on('show', (e) => {
  show.value = true
})


onUnmounted(()=>{
  bus.off('show')
})
let show = ref(true)
</script>

<template>
  <main>
    <SurveyFragment></SurveyFragment>
    <Chart1 v-if="show"></Chart1>
    <Chart2 v-if="show"></Chart2>
    <Chart3 v-if="show"></Chart3>
  </main>
</template>
