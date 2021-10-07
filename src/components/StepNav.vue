<template>
	<div class="d-flex mt-4 align-items-center justify-content-between" style="position: sticky; top: 0; background-color: #fcfcfe; z-index: 1000;">
        <button
            v-if="step === 1"
            @click="$emit('goto-menu-clicked')"
            class="btn btn-light">
            <img
                class="mr-2" height="18"
                :src="'style/arrow-left-solid.svg'">Назад
        </button>
        <button
            v-if="step > 1"
            @click="$emit('goto-step', step - 1)"
            class="btn btn-light">
            <img
                class="mr-2" height="18"
                :src="'style/arrow-left-solid.svg'">Назад
        </button>
        <div
            v-if="showTimer"
            class="" style="color: #E66660;"
            :class="(step === 4 ? 'mx-auto' : '')">
            <img
                class="mr-1" height="22"
                :src="'style/clock-solid-timer.svg'"><span class="mx-3">Ожидание подтверждения</span>
            <span style="font-size: 1.625rem;">{{ getTimerFormated(timer) }}</span>
        </div>
        <span
            v-else
            style="font-size: 1.25rem; text-transform: uppercase;">{{ title }}</span>
        <button
            v-if="step < 4"
            @click="$emit('goto-step', step + 1)"
            :disabled="continueState()"
            class="btn btn-primary btn-lg rounded-pill d-flex align-items-center"
            type="button"
            style="min-width:15.9375rem;">
            <span>Продолжить</span>
            <img
                class="ml-auto" height="26" width="23"
                :src="'style/arrow-right-solid.svg'">
        </button>
    </div>
</template>

<script>

export default {
    props: ['appoints', 'timer', 'step', 'title'],
    computed: {
        showTimer : function () {
            return this.appoints.filter(appoint => appoint.timeslot.iTime !== -1).length > 0
        }
    },
    methods: {
        getTimerFormated: function (timer){
            return (this.get2DigitVal(Math.floor(timer / 60)) + ':' + this.get2DigitVal(timer % 60))
        },
        get2DigitVal: function (v) {
            return (v < 10 ? '0' + v : '' + v);
        },
        continueState : function(){
            if (this.step === 1){
                return this.appoints.length === 0
            } else if (this.step === 2){
                return this.appoints.length === this.appoints.filter(appoint => appoint.day.ID === -1).length
            } else if (this.step === 3){
                return this.appoints.length === this.appoints.filter(appoint => appoint.timeslot.iTime === -1).length
            }
        }
    }
}
</script>