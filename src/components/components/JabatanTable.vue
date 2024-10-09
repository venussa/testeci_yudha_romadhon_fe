<template>
    <div class="karyawan-table">
        <h2>Data Jabatan</h2>
        <button class="btn-create" @click="openCreateModal">Create New Jabatan</button>
        <br />
        <br />
        <table class="table">
            <thead>
                <tr>
                    <th>ID Jabatan</th>
                    <th>Nama Jabatan</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="jabatan in jabatans" :key="jabatan.id_jabatan">
                    <td>{{ jabatan.id_jabatan }}</td>
                    <td>{{ jabatan.nama_jabatan }}</td>
                    <td>
                        <a @click="openEditModal(jabatan)">Edit</a> | 
                        <a @click="deleteJabatan(jabatan)">Delete</a>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="isEditModalOpen || isCreateModalOpen" class="modal">
            <h3>{{ isCreateModalOpen ? 'Create' : 'Edit' }} Jabatan</h3>
            <input v-model="editingJabatan.nama_jabatan" type="text" placeholder="Nama Jabatan" />
            <button @click="upsertJabatan">{{ isCreateModalOpen ? 'Create' : 'Edit' }}</button>
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
                jabatans: [],
                newJabatan: {},
                editingJabatan: {},
                isCreateModalOpen: false,
                isEditModalOpen: false,
                errorMessages: [],
            };
        },
        async mounted() {
            await this.fetchJabatans();
        },
        methods: {
            async fetchJabatans() {
                try {
                    const response = await axios.get(`${API_ENDPOINTS.NUMBER_FOUR}/jabatan`);
                    this.jabatans = response.data.data;
                } catch (error) {
                    console.error('Error fetching jabatans:', error);
                }
            },
            openCreateModal() {
                this.isCreateModalOpen = true;
                this.newJabatan.nama_jabatan = '';
                this.editingJabatan = {};
            },
            openEditModal(jabatan) {
                this.editingJabatan = { ...jabatan };
                this.isEditModalOpen = true;
            },
            closeModal() {
                this.isEditModalOpen = false;
                this.isCreateModalOpen = false;
                this.editingJabatan = {};
            },
            async upsertJabatan() {
                try {
                    const endpoint = `${API_ENDPOINTS.NUMBER_FOUR}/jabatan`;
                    const response =this.isCreateModalOpen ? await axios.post(endpoint, this.editingJabatan) : await axios.put(endpoint, this.editingJabatan);
                    if (response.data.code >= 200 && response.data.code < 299) {
                        await this.fetchJabatans();
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
            async deleteJabatan(jabatan) {
                try {
                    const response = await axios.delete(`${API_ENDPOINTS.NUMBER_FOUR}/jabatan?id=${jabatan.id_jabatan}`);
                    if (response.data.code === 200) {
                        this.isEditMode = false;
                        await this.fetchJabatans();
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