<template>
	<div class="profile-header">
        <div class="d-flex align-items-center py-3" style="font-size: 1.125rem; border-bottom: 2px solid #F1F1F5;">
            <!-- <template v-if="sessID !== ''"> -->
                <img
                    class="mr-2" height="18"
                    :src="'style/stethoscope-solid.svg'">
                <span>Ваш терапевт: {{ user.ph }}</span>
                <button @click="$emit('appoint-to-therapist')" class="btn btn-light ml-2">Записаться</button>
                <img
                    class="mr-2 ml-auto" height="18"
                    :src="'style/user-solid.svg'">
                <span>{{ user.name }}</span>
                <button
                    @click="$emit('logout')"
                    class="btn btn-light ml-2">
                        Выйти
                        <img
                            class="ml-2" height="18"
                            :src="'style/sign-out-alt-solid.svg'">
                    </button>
            <!-- </template> -->
            <!-- <template v-else>
                <button @click="$emit('appoint')" class="btn btn-light">Записаться к терапевту</button>
                <button @click="$emit('login')" class="btn btn-light ml-auto">Войти в личный кабинет<span class="fas fa-sign-in-alt ml-2"></span></button>
            </template> -->
        </div>
    </div>
</template>

<script>

export default {
    props: ['user', 'sessID'],
    data () {
        return {
            
        }
    },
    created: function () {

    },
    computed: {
        
    },
    methods: {
        
    }
}
</script>