import { createRouter, createWebHistory } from 'vue-router';
import NumberOne from '../components/NumberOne.vue';
import NumberTwo from '../components/NumberTwo.vue';
import NumberFour from '../components/NumberFour.vue';

const routes = [
    {
        path: '/number_1',
        name: 'NumberOne',
        component: NumberOne
    },
    {
        path: '/number_2',
        name: 'NumberTwo',
        component: NumberTwo
    },
    {
        path: '/number_4',
        name: 'NumberFour',
        component: NumberFour
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;