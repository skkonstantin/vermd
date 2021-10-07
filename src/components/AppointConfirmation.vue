<template>
	<div>
        <h3 class="text-center my-5">
            <img
                class="mr-2" height="32"
                :src="'style/check-circle-solid.svg'">ЗАПИСЬ УСПЕШНО ПОДТВЕРЖДЕНА</h3>
        <div v-for="(appoint,index) in appoints"
            :key="index"
            :style="(appoint.appID === -1) ? 'opacity:0.4;' : ''"
            :class="'mt-' + (index === 0 ? '4' : '5') + (index === appoint.length - 1 ? ' mb-5' : '')">
            <div class="d-flex align-items-center mb-3">
                <div class="d-flex flex-column">
                    <strong style="font-size: 1.25rem;">{{ appoint.speciality.title }}</strong>
                </div>
            </div>
            <div class="doctor-item bg-white mb-3 rounded d-flex flex-column p-3">
                <div class="d-flex align-items-center">
                    <div class="d-flex justify-content-between w-100">
                        <div class="d-flex align-items-center">
                            <img :src="appoint.doctor.photo" class="rounded-circle"
                                style="width: 4.6875rem; height: 4.6875rem; border: 2px solid #F1F1F5;" />
                            <div class="d-flex flex-column ml-3" style="line-height: 1.15rem;">
                                <strong style="font-size: 1.25rem;">{{ appoint.doctor.name }} {{ appoint.doctor.io }}</strong>
                                <div class="mt-3">
                                    <span v-if="appoint.doctor.hasOwnProperty('zv')" style="color: #8E959B; font-size: 0.875rem;">{{ appoint.doctor.zv }}</span>
                                    <span v-else>&nbsp;</span>
                                    <img
                                        v-if="appoint.doctor.hasOwnProperty('cv')"
                                        :title="appoint.doctor.cv"
                                        class="ml-1" height="15"
                                        :src="'style/info-circle-solid-gray.svg'">
                                </div>
                            </div>
                        </div>
                        <div class="text-center" style="font-size: 1.5rem;">
                            <strong><img class="mr-2" height="24" :src="'style/receipt-solid.svg'">{{ appoint.appCDate }}</strong><br />
                            <span>{{ appoint.appWtime }}</span>
                        </div>
                    </div>
                    <div class="d-flex flex-column ml-5">
                            <button
                                v-if="appoint.appID !== -1"
                                @click="$emit('print-app', appoint.appID)"
                                class="btn btn-outline-primary rounded-pill mb-2"
                                style="min-width: 12.5rem;">Печать талона</button>
                            <button
                                v-if="appoint.appID !== -1"
                                @click="$emit('remove-appoint', index)"
                                class="btn btn-outline-danger rounded-pill"
                                style="min-width: 12.5rem;">Отменить запись</button>
                            <div
                                v-else>
                                {{ appoint.makeAppError }}
                            </div>
                        </div>
                </div>
            </div>
        </div>
        <div class="d-flex my-5">
            <div class="d-flex flex-column" style="max-width: 33.75rem;">
                <div v-if="sended === 1"
                    class="alert alert-primary">Уведомление о записи на прием вам было отправлено ранее автоматической службой рассылки</div>
                <div class="form-group">
                    <label for="emailInput">Эл. почта<span style="color: #1B6CF3;"> *</span></label>
                    <input v-model="emailInput" type="email" class="form-control form-control-lg" id="emailInput" placeholder="Введите адрес почты" required />
                </div>
                <button
                    :disabled="sendEmailDisabled()"
                    @click="$emit('send-mail', emailInput)"
                    type="button"
                    class="btn btn-outline-primary btn-lg rounded-pill d-flex align-items-center px-5 mb-4">
                    Отправить талоны на электронную почту
                </button>
                <div class=""><span style="color: #1B6CF3;">* </span>На электронную почту будет направлена информация о записи на прием</div>
            </div>
            <div class="d-flex flex-column ml-auto" style="min-width: 21.875rem;">
                <button
                    :disabled="printDisabled()"
                    @click="$emit('print-apps')"
                    type="button"
                    class="btn btn-primary btn-lg rounded-pill d-flex align-items-center px-5 mb-4">
                    Напечатать все талоны
                </button>
                <button type="button"
                    @click="$emit('goto-menu-clicked')"
                    class="btn btn-outline-primary btn-lg rounded-pill d-flex align-items-center px-5">
                    Выполнить новую запись
                </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ['appoints', 'email', 'sended'],
    data () {
        return {
            emailInput : ''
        }
    },
    created: function () {

    },
    mounted : function () {
        if (this.email.length > 0 && this.sended === 0)
        {
            this.emailInput = this.email
        }
    },
    computed: {
        
    },
    methods: {
        sendEmailDisabled: function(){
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return !re.test(String(this.emailInput).toLowerCase())
        },
        printDisabled: function () {
            return (this.appoints.filter(app => app.appID !== -1).length === 0)
        }
    }
}
</script>