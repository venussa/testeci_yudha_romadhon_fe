<template>
    <div class="karyawan-table">
        <h2>Data Department</h2>
        <button class="btn-create" @click="openCreateModal">Create New Department</button>
        <br />
        <br />
        <table class="table">
            <thead>
                <tr>
                    <th>ID Dept</th>
                    <th>Nama Dept</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="dept in depts" :key="dept.id_dept">
                    <td>{{ dept.id_dept }}</td>
                    <td>{{ dept.nama_dept }}</td>
                    <td>
                        <a @click="openEditModal(dept)">Edit</a> | 
                        <a @click="deleteDept(dept)">Delete</a>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="isEditModalOpen || isCreateModalOpen" class="modal">
            <h3>{{ isCreateModalOpen ? 'Create' : 'Edit' }} Department</h3>
            <input v-model="editingDept.nama_dept" type="text" placeholder="Nama Dept" />
            <button @click="upsertDept">{{ isCreateModalOpen ? 'Create' : 'Edit' }}</button>
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
                depts: [],
                newDept: {},
                editingDept: {},
                isCreateModalOpen: false,
                isEditModalOpen: false,
                errorMessages: [],
            };
        },
        async mounted() {
            await this.fetchDepts();
        },
        methods: {
            async fetchDepts() {
                try {
                    const response = await axios.get(`${API_ENDPOINTS.NUMBER_FOUR}/department`);
                    this.depts = response.data.data;
                } catch (error) {
                    console.error('Error fetching depts:', error);
                }
            },
            openCreateModal() {
                this.isCreateModalOpen = true;
                this.newDept.nama_dept = '';
                this.editingDept = {};
            },
            openEditModal(dept) {
                this.editingDept = { ...dept };
                this.isEditModalOpen = true;
            },
            closeModal() {
                this.isEditModalOpen = false;
                this.isCreateModalOpen = false;
                this.editingDept = {};
            },
            async upsertDept() {
                try {
                    const endpoint = `${API_ENDPOINTS.NUMBER_FOUR}/department`;
                    const response =this.isCreateModalOpen ? await axios.post(endpoint, this.editingDept) : await axios.put(endpoint, this.editingDept);
                    if (response.data.code >= 200 && response.data.code < 299) {
                        await this.fetchDepts();
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
            async deleteDept(dept) {
                try {
                    const response = await axios.delete(`${API_ENDPOINTS.NUMBER_FOUR}/department?id=${dept.id_dept}`);
                    if (response.data.code === 200) {
                        this.isEditMode = false;
                        await this.fetchDepts();
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