<script setup>
import { ref, onMounted,provide } from 'vue'
import request from '@/utlis/request'
import { submit } from '@/api/survey'
import bus from 'vue3-eventbus'

// 定义国家列表数组
const countries = ref([])

// 表单数据
const formData = ref({
    partyDate: '',
    question1Rating: '',
    question2Rating: '',
    question3Improvement: '',
    region: '',
})

// 获取国家列表的函数
const fetchCountries = async () => {

    try {
        // 使用REST Countries API
        const response = await fetch('https://restcountries.com/v3.1/all')
        if (!response.ok) {
            throw new Error('Failed to fetch countries')
        }
        const data = await response.json()
        // 假设我们感兴趣的是国家名称和国际电话代码
        countries.value = data.map(country => ({
            name: country.name.common,
            value: country.cca2, // 2字母国家代码，如US
        }))
            .sort((a, b) => a.name.localeCompare(b.name)) // 使用localeCompare进行排序
    } catch (error) {
        console.error('Failed to fetch countries:', error)
    }
}


const submitForm = async (event) => {


    event.preventDefault() // 阻止表单默认提交行为

    const res = await submit(formData.value)
    console.log(res)
    bus.emit('show', {})
}

// 组件加载时调用
onMounted(() => {
    fetchCountries()
})

</script>


<template>


    <body>

        <div class="container text-center">
            <div class="row row-cols-1">
                <div class="col">
                    <div class="mx-0 mx-sm-auto">
                        <div class="card">
                            <div class="card-header bg-primary">
                                <h5 class="card-title text-white mt-2" id="titleLabel">Survey request</h5>
                            </div>
                            <div class="modal-body">
                                <div class="text-center">
                                    <i class="far fa-file-alt fa-4x mb-3 text-primary mt-3"></i>
                                    <!-- Question 1 -->
                                    <p><strong>Dinner Party Participation Questionnaire</strong></p>
                                    <p>Have some ideas how to improve our party? <strong>Give us your feedback.</strong>
                                    </p>
                                </div>
                                <hr />
                                <form @submit.prevent="submitForm">
                                    <div class="modal-body px-4">
                                        <!-- Date Picker -->
                                        <div class="mb-3 text-center">
                                            <label for="datePicker" class="form-label"><strong>Select the date of the
                                                    dinner
                                                    party:</strong></label>
                                            <input type="date" class="form-control" id="datePicker" name="partyDate"
                                                v-model="formData.partyDate" required>
                                        </div>
                                        <!-- Question 1 Rating -->
                                        <p class="text-center"><strong>Food quality evaluation:</strong></p>
                                        <div class="row">
                                            <!-- Adjusting the layout for different screen sizes for Question 1 -->
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question1Rating"
                                                    v-model="formData.question1Rating" id="q1VeryGood" value="1"
                                                    required>
                                                <label class="form-check-label" for="q1VeryGood">Very good</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question1Rating"
                                                    v-model="formData.question1Rating" id="q1Good" value="2" required />
                                                <label class="form-check-label" for="q1Good">Good</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question1Rating"
                                                    v-model="formData.question1Rating" id="q1Moderate" value="3"
                                                    required />
                                                <label class="form-check-label" for="q1Moderate">Moderate</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question1Rating"
                                                    v-model="formData.question1Rating" id="q1Bad" value="4" required />
                                                <label class="form-check-label" for="q1Bad">Bad</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question1Rating"
                                                    v-model="formData.question1Rating" id="q1VeryBad" value="5"
                                                    required />
                                                <label class="form-check-label" for="q1VeryBad">Very bad</label>
                                            </div>
                                            <!-- Repeat for other options -->
                                        </div>
                                        <!-- Question 2 Rating -->
                                        <p class="text-center"><strong>Quality of service</strong></p>
                                        <div class="row">
                                            <!-- Adjusting the layout for different screen sizes for Question 1 -->
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question2Rating"
                                                    v-model="formData.question2Rating" id="q2VeryGood" value="1"
                                                    required />
                                                <label class="form-check-label" for="q2VeryGood">Very good</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question2Rating"
                                                    v-model="formData.question2Rating" id="q2Good" value="2" required />
                                                <label class="form-check-label" for="q2Good">Good</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question2Rating"
                                                    v-model="formData.question2Rating" id="q2Moderate" value="3"
                                                    required />
                                                <label class="form-check-label" for="q2Moderate">Moderate</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question2Rating"
                                                    v-model="formData.question2Rating" id="q2Bad" value="4" required />
                                                <label class="form-check-label" for="q2Bad">Bad</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question2Rating"
                                                    v-model="formData.question2Rating" id="q2VeryBad" value="5"
                                                    required />
                                                <label class="form-check-label" for="q2VeryBad">Very bad</label>
                                            </div>
                                            <!-- Repeat for other options -->
                                        </div>
                                        <!-- Question 3 -->
                                        <p class="text-center"><strong>What could we improve?</strong></p>
                                        <div class="row">
                                            <!-- Adjusting the layout for different screen sizes for Question 2 -->
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question3Improvement"
                                                    v-model="formData.question3Improvement" id="q3Feature" value="1"
                                                    required />
                                                <label class="form-check-label" for="q3Feature">Feature</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question3Improvement"
                                                    v-model="formData.question3Improvement" id="q3Support" value="2"
                                                    required />
                                                <label class="form-check-label" for="q3Support">Customer Support</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question3Improvement"
                                                    v-model="formData.question3Improvement" id="q3Food" value="3"
                                                    required />
                                                <label class="form-check-label" for="q3Food">Food Quality</label>
                                            </div>
                                            <div class="col-12 col-sm-4 col-lg-2 form-check mb-2">
                                                <input class="form-check-input" type="radio" name="question3Improvement"
                                                    v-model="formData.question3Improvement" id="q3Venue" value="4"
                                                    required />
                                                <label class="form-check-label" for="q3Venue">Venue Setup</label>
                                            </div>
                                            <!-- Repeat for other options -->
                                        </div>
                                        <div class="row">
                                            < <div class="form-group">
                                                <label for="regionSelect"><strong>Select Your Country:</strong></label>
                                                <select id="regionSelect" v-model="formData.region" class="form-control"
                                                    required>
                                                    <option value="" disabled selected hidden>Please choose your country
                                                    </option>
                                                    <option v-for="country in countries" :key="country.value"
                                                        :value="country.value">
                                                        {{ country.name }}
                                                    </option>
                                                </select>
                                        </div>
                                    </div>
                            </div>
                            <div class="card-footer text-end mt-3">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                            </form>
                        </div>
                    </div>
                    <div class="container px-0">
                        <div class="col">
                            <div class="d-flex justify-content-center mt-3">
                                <a class="btn btn-primary me-2" href="chart" role="button">Chart1</a>
                                <a class="btn btn-primary me-2" href="chart-date" role="button">Chart2</a>
                                <a class="btn btn-primary " href="chart-map" role="button">Chart3</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </body>
</template>

<style></style>