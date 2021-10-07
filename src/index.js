import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import MainMenu from './components/MainMenu.vue'
import AppointStep1 from './components/AppointStep1.vue'
import AppointStep2 from './components/AppointStep2.vue'
import AppointStep3 from './components/AppointStep3.vue'
import AppointStep4 from './components/AppointStep4.vue'
import AppointConfirmation from './components/AppointConfirmation.vue'


Vue.use(VueRouter)

const routes = [
    {
        path: '/step1',
        component: AppointStep1
    },
    {
        path: '/step2',
        component: AppointStep2
    },
    {
        path: '/step3',
        component: AppointStep3
    },
    {
        path: '/step4',
        component: AppointStep4
    },
    {
        path: '/confirm',
        component: AppointConfirmation
    },
    {
        path: '/mainmenu',
        component: MainMenu
    },
    {
        path: '/',
        redirect: '/mainmenu',
    },

    // {
    //     path: '/*',
    //     redirect: '/mainmenu',
    // },
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    el: '#app',
    router,
    render: h => h(App)
})