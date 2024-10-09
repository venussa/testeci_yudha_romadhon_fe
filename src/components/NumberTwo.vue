<template>
    <div class="navigation-links">
        <router-link to="/number_1">Number 1</router-link> |
        <router-link to="/number_2">Number 2</router-link> |
        <router-link to="/number_4">Number 4</router-link>
    </div>
    <div class="number-one-container">
        <h2>Soal Nomor 2</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="number">Number:</label>
                <input 
                    type="text" 
                    v-model="number" 
                    id="number" 
                    class="form-control" 
                    placeholder="Enter number" 
                />
            </div>
            <button type="submit" class="btn-submit">Submit</button>
        </form>
        
        <div v-if="result && !errors.length" class="result">
            <p><strong>Formatted Number:</strong> {{ result.data.formatted_number }}</p>
            <p><strong>Converted Number:</strong> {{ result.data.converted_number }}</p>
        </div>
        
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
                number: null,
                result: null,
                errors: [],
            };
        },
        methods: {
            async handleSubmit() {
                try {
                    this.errors = [];
                    const response = await axios.post(API_ENDPOINTS.NUMBER_TWO, {
                        number: this.number,
                    });
                    this.result = response.data;
                } catch (error) {
                    if (error.response) {
                        const { data } = error.response;
                        if (data.code === 400 && data.errors) {
                            this.errors = data.errors.number || [];
                        }
                    } else {
                        console.error('Error fetching data:', error);
                    }
                }
            },
        },
    };
</script>