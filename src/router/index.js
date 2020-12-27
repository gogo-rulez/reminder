import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import PatientDetail from '../views/PatientDetail';
import ExpiringDrugs from '../views/ExpiringDrugs';

Vue.use(VueRouter);

const routes = [
    {
        path: '/patient/:id?',
        name: 'PatientDetail',
        component: PatientDetail,
    },
    {
        path: '/expiring/:type?',
        name: 'ExpiringDrugs',
        component: ExpiringDrugs,
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
