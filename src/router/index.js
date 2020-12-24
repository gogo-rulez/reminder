import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import PatientDetail from '../views/PatientDetail.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/patient/:id?',
        name: 'PatientDetail',
        component: PatientDetail,
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
