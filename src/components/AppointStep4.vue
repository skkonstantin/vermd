<template>
    <div>
        <AppointStepHeader
            v-bind:steps="steps"
            v-bind:state="state"
            v-on:step-item-clicked="$emit('step-item-clicked', $event)"/>
        <StepNav
            v-bind:appoints="appoints"
            v-bind:step="step"
            v-bind:title="stepTitle"
            v-bind:timer="timer"
            v-on:goto-step="$emit('goto-step', $event)"
            v-on:goto-menu-clicked="$emit('goto-menu-clicked')"/>
        <AppointList 
            v-bind:appoints="appoints"
            v-bind:step="step"
            v-on:remove-appoint="$emit('remove-appoint', $event)"/>
        <div v-for="(appoint, index) in appoints"
            :key="index"
            :class="'mt-' + (index === 0 ? '4' : '5') + (index === appoint.length - 1 ? ' mb-5' : '')">
            <div class="d-flex align-items-center mb-3">
                <div class="d-flex flex-column">
                    <strong style="font-size: 1.25rem;">{{ appoint.speciality.title }}</strong>
                </div>
            </div>
            <div
                :style="appoint.blocked ? 'opacity:0.4;' : ''"
                class="doctor-item bg-white mb-3 rounded d-flex flex-column p-3">
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
                            <strong>
                                <img
                                    class="mr-2" height="24"
                                    :src="'style/receipt-solid.svg'">
                                    {{ formatDate(appoint.day.dat) }}</strong><br />
                            <strong>{{ appoint.timeslot.wtime }}</strong>
                        </div>
                    </div>
                    <div class="d-flex flex-column  ml-5">
                            <button
                                v-if="!appoint.blocked"
                                @click="$emit('goto-step', 3)"
                                class="btn btn-outline-primary rounded-pill mb-2"
                                style="min-width: 12.5rem;">Изменить</button>
                            <button
                                v-if="!appoint.blocked"
                                @click="$emit('remove-appoint-no-confirm', index)"
                                class="btn btn-outline-danger rounded-pill"
                                style="min-width: 12.5rem;">Отменить запись</button>
                            <button
                                v-if="appoint.blocked"
                                @click="$emit('unblock-appoint', index)"
                                class="btn btn-outline-secondary rounded-pill"
                                style="min-width: 12.5rem;">Восстановить запись</button>
                        </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center my-5">
            <button
                :disabled="continueState()"
                @click="$emit('goto-confirm')" type="button"
                class="btn btn-primary btn-lg rounded-pill d-flex align-items-center px-5">
                Подтвердить запись
            </button>
        </div>
    </div>
</template>

<script>
import AppointList from './AppointList.vue'
import StepNav from './StepNav.vue'
import AppointStepHeader from './AppointStepHeader.vue'
export default {
    props: ['appoints', 'timer', 'sessID', 'isDebug', 'steps', 'state', 'apiUrl'],
    components: {
        AppointList, AppointStepHeader, StepNav
    },
    data () {
        return {
            step: 4,
            stepTitle: "Подтвердите выбор",
            mNames: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
        }
    },
    created: function () {
        
    },
    mounted: function () {
        
    },
    computed: {
        
    },
    methods: {
        formatDate: function (dat) {
            const [day, month, year] = dat.split(".")
            return (parseInt(day).toString() + ' ' + this.mNames[parseInt(month - 1)] + ' ' + (new Date(year, month - 1, day)).toLocaleDateString('ru-RU', { weekday: 'long' }))
        },
        continueState : function(){
            return this.appoints.length === this.appoints.filter(appoint => appoint.blocked === true).length
        }
    },
    beforeDestroy: function () {
        
    }
}
</script>
