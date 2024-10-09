<template>
    <div>
        <div class="navigation-links">
            <router-link to="/number_1">Number 1</router-link> |
            <router-link to="/number_2">Number 2</router-link> |
            <router-link to="/number_4">Number 4</router-link>
        </div>
        <KaryawanTable />
        <LevelTable />
        <JabatanTable />
        <DepartmentTable />
    </div>
  </template>
  
  <script>
  import KaryawanTable from './components/KaryawanTable.vue';
  import LevelTable from './components/LevelTable.vue';
  import JabatanTable from './components/JabatanTable.vue';
  import DepartmentTable from './components/DepartmentTable.vue';
  
  export default {
    components: {
      KaryawanTable,
      LevelTable,
      JabatanTable,
      DepartmentTable,
    },
  };
  </script>