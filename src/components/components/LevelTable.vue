<template>
    <div class="karyawan-table">
        <h2>Data Level</h2>
        <button class="btn-create" @click="openCreateModal">Create New Level</button>
        <br />
        <br />
        <table class="table">
            <thead>
                <tr>
                    <th>ID Level</th>
                    <th>Nama Level</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="level in levels" :key="level.id_level">
                    <td>{{ level.id_level }}</td>
                    <td>{{ level.nama_level }}</td>
                    <td>
                        <a @click="openEditModal(level)">Edit</a> | 
                        <a @click="deleteLevel(level)">Delete</a>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="isEditModalOpen || isCreateModalOpen" class="modal">
            <h3>{{ isCreateModalOpen ? 'Create' : 'Edit' }} Level</h3>
            <input v-model="editingLevel.nama_level" type="text" placeholder="Nama Level" />
            <button @click="upsertLevel">{{ isCreateModalOpen ? 'Create' : 'Edit' }}</button>
            <button @click="closeModal">Cancel</button>
            <div v-if="errorMessages.length" class="error-messages">
                <h4>Error:</h4>
                <ul>
                    <li v-for="(message, index) in errorMessages" :key="index">{{ message }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { API_ENDPOINTS } from '../../config';
    import '../../assets/table.css';

    export default {
        data() {
            return {
                levels: [],
                newLevel: {},
                editingLevel: {},
                isCreateModalOpen: false,
                isEditModalOpen: false,
                errorMessages: [],
            };
        },
        async mounted() {
            await this.fetchLevels();
        },
        methods: {
            async fetchLevels() {
                try {
                    const response = await axios.get(`${API_ENDPOINTS.NUMBER_FOUR}/level`);
                    this.levels = response.data.data;
                } catch (error) {
                    console.error('Error fetching levels:', error);
                }
            },
            openCreateModal() {
                this.isCreateModalOpen = true;
                this.newLevel.nama_level = '';
                this.editingLevel = {};
            },
            openEditModal(level) {
                this.editingLevel = { ...level };
                this.isEditModalOpen = true;
            },
            closeModal() {
                this.isEditModalOpen = false;
                this.isCreateModalOpen = false;
                this.editingLevel = {};
            },
            async upsertLevel() {
                try {
                    const endpoint = `${API_ENDPOINTS.NUMBER_FOUR}/level`;
                    const response =this.isCreateModalOpen ? await axios.post(endpoint, this.editingLevel) : await axios.put(endpoint, this.editingLevel);
                    if (response.data.code >= 200 && response.data.code < 299) {
                        await this.fetchLevels();
                        this.closeModal();
                        this.errorMessages = [];
                    }
                } catch (error) {
                    if (error.response && error.response.data.errors) {
                        this.errorMessages = [];
                        for (const key in error.response.data.errors) {
                            this.errorMessages.push(...error.response.data.errors[key]);
                        }
                    } else {
                        console.error('Error creating karyawan:', error);
                    }
                }
            },
            async deleteLevel(level) {
                try {
                    const response = await axios.delete(`${API_ENDPOINTS.NUMBER_FOUR}/level?id=${level.id_level}`);
                    if (response.data.code === 200) {
                        this.isEditMode = false;
                        await this.fetchLevels();
                        this.closeEditModal();
                        this.closeCreateModal();
                    }
                } catch (error) {
                    if (error.response && error.response.data.errors) {
                        this.errorMessages = [];
                        for (const key in error.response.data.errors) {
                            this.errorMessages.push(...error.response.data.errors[key]);
                        }
                    } else {
                        console.error('Error creating karyawan:', error);
                    }
                }
            },
        },
    };
</script>