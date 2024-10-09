<template>
    <div class="karyawan-table">
        <h2>Data Karyawan</h2>
        <button @click="isCreateMode = true; reset();">Create Karyawan</button>
        <br/>
        <br/>
        <table>
            <thead>
                <tr>
                    <th>ID Karyawan</th>
                    <th>NIK</th>
                    <th>Nama</th>
                    <th>Tanggal Lahir</th>
                    <th>Alamat</th>
                    <th>Jabatan</th>
                    <th>Departemen</th>
                    <th>Level</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="karyawan in karyawanList" :key="karyawan.id_karyawan">
                <td>{{ karyawan.id_karyawan }}</td>
                <td>{{ karyawan.nik }}</td>
                <td>{{ karyawan.nama }}</td>
                <td>{{ formatDate(karyawan.ttl) }}</td>
                <td>{{ karyawan.alamat }}</td>
                <td>{{ karyawan.jabatan.nama_jabatan }}</td>
                <td>{{ karyawan.department.nama_dept }}</td>
                <td>{{ karyawan.level.nama_level }}</td>
                <td><a @click.prevent="editKaryawan(karyawan)">Edit</a> | <a @click.prevent="deleteKaryawan(karyawan)">Delete</a></td>
            </tr>
            </tbody>
        </table>

        <div v-if="isEditMode || isCreateMode">
            <h3>{{ isCreateMode ? 'Create' : 'Edit '}} Data</h3>
            <form @submit.prevent="upsertKaryawan">
                <div>
                    <label>NIK:</label>
                    <input type="text" v-model="editedKaryawan.nik" required />
                </div>
                <div>
                    <label>Nama:</label>
                    <input type="text" v-model="editedKaryawan.nama" required />
                </div>
                <div>
                    <label>Tanggal Lahir:</label>
                    <input type="date" v-model="editedKaryawan.ttl" required />
                </div>
                <div>
                    <label>Alamat:</label>
                    <input type="text" v-model="editedKaryawan.alamat" required />
                </div>
                <div>
                    <label>Jabatan:</label>
                    <select v-model="editedKaryawan.id_jabatan" required>
                        <option v-for="jabatan in jabatanList" :key="jabatan.id_jabatan" :value="jabatan.id_jabatan">
                            {{ jabatan.nama_jabatan }}
                        </option>
                    </select>
                </div>
                <div>
                    <label>Departemen:</label>
                    <select v-model="editedKaryawan.id_dept" required>
                        <option v-for="department in departmentList" :key="department.id_dept" :value="department.id_dept">
                            {{ department.nama_dept }}
                        </option>
                    </select>
                </div>
                <div>
                    <label>Level:</label>
                    <select v-model="editedKaryawan.id_level" required>
                        <option v-for="level in levelList" :key="level.id_level" :value="level.id_level">
                            {{ level.nama_level }}
                        </option>
                    </select>
                </div>
                <button type="submit">{{ isCreateMode ? 'Create' : 'Edit '}}</button>
                <button @click="cancel">Cancel</button>
            </form>

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
                karyawanList: [],
                isEditMode: false,
                editedKaryawan: {
                    id_karyawan: null,
                    nik: '',
                    nama: '',
                    ttl: '',
                    alamat: '',
                    id_jabatan: null,
                    id_dept: null,
                    id_level: null,
                },
                jabatanList: [],
                departmentList: [],
                levelList: [],
                isCreateMode: false,
                errorMessages: [],
            };
        },
        async mounted() {
            await this.fetchKaryawan();
            await this.fetchJabatan();
            await this.fetchDepartment();
            await this.fetchLevel();
        },
        methods: {
            async fetchKaryawan() {
                try {
                    const response = await axios.get(`${API_ENDPOINTS.NUMBER_FOUR}/karyawan`);
                    if (response.data.code === 200) {
                        this.karyawanList = response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching karyawan data:', error);
                }
            },
            async fetchJabatan() {
                const response = await axios.get(`${API_ENDPOINTS.NUMBER_FOUR}/jabatan`);
                this.jabatanList = response.data.data;
            },
            async fetchDepartment() {
                const response = await axios.get(`${API_ENDPOINTS.NUMBER_FOUR}/department`);
                this.departmentList = response.data.data;
            },
            async fetchLevel() {
                const response = await axios.get(`${API_ENDPOINTS.NUMBER_FOUR}/level`);
                this.levelList = response.data.data;
            },
            editKaryawan(karyawan) {
                this.isEditMode = true;
                this.isCreateMode = false;
                this.editedKaryawan = { ...karyawan };
                delete this.editedKaryawan.level;
                delete this.editedKaryawan.jabatan;
                delete this.editedKaryawan.department;
            },
            async upsertKaryawan() {
                try {
                    const endpoint = `${API_ENDPOINTS.NUMBER_FOUR}/karyawan`;
                    const payload = this.editedKaryawan;
                    const response = this.isCreateMode ? (await axios.post(endpoint, payload)) : (await axios.put(endpoint, payload));

                    if (response.data.code >= 200 && response.data.code < 300) {
                        this.isEditMode = false;
                        this.isCreateMode = false;
                        await this.fetchKaryawan();
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
            async deleteKaryawan(karyawan) {
                try {
                    const endpoint = `${API_ENDPOINTS.NUMBER_FOUR}/karyawan?id=${karyawan.id_karyawan}`;
                    const response = await axios.delete(endpoint);

                    if (response.data.code >= 200 && response.data.code < 300) {
                        this.isEditMode = false;
                        this.isCreateMode = false;
                        await this.fetchKaryawan();
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
            reset() {
                this.editedKaryawan = {
                    id_karyawan: null,
                    nik: '',
                    nama: '',
                    ttl: '',
                    alamat: '',
                    id_jabatan: null,
                    id_dept: null,
                    id_level: null,
                };
            },
            cancel() {
              this.isEditMode = false;
              this.isCreateMode = false;
              this.reset();
            },
            formatDate(dateString) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(dateString).toLocaleDateString(undefined, options);
            },
        },
    };
</script>