<template>
    <div class="navigation-links">
        <router-link to="/number_1">Number 1</router-link> |
        <router-link to="/number_2">Number 2</router-link> |
        <router-link to="/number_4">Number 4</router-link>
    </div>
    <div class="number-one-container">
        <h2>Soal Nomor 1</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="type">Type:</label>
                <select v-model="type" id="type" class="form-control" placeholder="Select Type">
                    <option value="" disabled>Select Type</option>
                    <option value="1">Type 1</option>
                    <option value="2">Type 2</option>
                    <option value="3">Type 3</option>
                </select>
            </div>
            <div class="form-group">
                <label for="repetition">Repetition:</label>
                <input type="text" v-model="repetition" id="repetition" class="form-control" placeholder="Enter repetition" />
            </div>
            <button type="submit" class="btn-submit">Submit</button>
        </form>
        <div v-if="result && !errors.length" class="result" v-html="result.data"></div>
        <div v-if="errors.length" class="error-messages">
            <h4>Error:</h4>
            <ul>
                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
        </div>
    </div>
</template>
  
<script>
    import axios from 'axios';
    import { API_ENDPOINTS } from '../config';
    import '../assets/style.css';

    export default {
        data() {
            return {
                type: null,
                repetition: null,
                result: null,
                errors: [],
            };
        },
        methods: {
            async handleSubmit() {
                try {
                    this.errors = [];

                    const response = await axios.post(API_ENDPOINTS.NUMBER_ONE, {
                    type: this.type,
                    repetition: this.repetition,
                    });

                    this.result = response.data;
                } catch (error) {
                    if (error.response) {
                        const { data } = error.response;
                        if (data.code === 400 && data.errors) {
                            this.errors = data.errors.repetition || [];
                        }
                    } else {
                        console.error('Error fetching data:', error);
                    }
                }
            },
        },
    };
</script>