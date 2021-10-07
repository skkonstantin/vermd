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
            v-on:remove-appoint="removeAppoint($event)"/>
        <div v-for="(jobspec, jIndex) in jobSpecs"
            :key="jobspec.ID"
            :id="'jid' + jIndex.toString()"
            class="mt-5 row">
            <div class="d-flex align-items-center mb-3 w-100">
                <div class="d-flex flex-column mr-auto" style="min-width: 16.55rem;">
                    <strong style="font-size: 1.25rem;">{{ jobspec.name }}</strong>
                </div>
                <div class="d-flex text-center">
                    <div v-for="(value, key, index) in jobspec.days"
                        :key="key"
                        class="day-item d-flex align-items-center justify-content-between">
                        <button
                            v-if="(index === 0)"
                            :disabled="!jobspec.hasOwnProperty('pWeek')"
                            @click="loadJobSpec(jobspec.pWeek, 'pWeek')"
                            type="button"
                            class="btn btn-sm btn-primary">
                            <img
                                v-if="jobspec.hasOwnProperty('pWeek')"
                                style="vertical-align: middle;"
                                class="" height="18" width="11"
                                :src="'style/chevron-left-solid-active.svg'">
                            <img
                                v-else
                                style="vertical-align: middle;"
                                class="" height="18" width="11"
                                :src="'style/chevron-left-solid.svg'">
                        </button>
                        <span v-else>&nbsp;</span>
                        <div v-html="value"></div>
                        <button
                            v-if="(index === (Object.keys(jobspec.days).length - 1))"
                            :disabled="!jobspec.hasOwnProperty('nWeek')"
                            @click="loadJobSpec(jobspec.nWeek, 'nWeek')"
                            type="button"
                            class="btn btn-sm btn-primary">
                            <img
                                v-if="jobspec.hasOwnProperty('nWeek')"
                                style="vertical-align: middle;"
                                class="" height="18" width="11"
                                :src="'style/chevron-right-solid-active.svg'">
                            <img
                                v-else
                                style="vertical-align: middle;"
                                class="" height="18" width="11"
                                :src="'style/chevron-right-solid.svg'">
                        </button>
                        <span v-else>&nbsp;</span>
                    </div>
                </div>
            </div>
            <div v-for="doctor in jobspec.docts"
                :key="doctor.ID"
                v-bind:class="[{active: isDoctorActive(doctor.ID)}, invalidDoctor(doctor.ID, jobspec.ID) ? 'd-none' : 'doctor-item doctor-item-fixed-height bg-white mb-3 rounded d-flex align-items-center w-100']">
                <img
                    class="item-check-circle" height="22"
                    :src="'style/check-circle-solid.svg'">
                <div class="d-flex align-items-center h-100 pl-2" style="min-width: 15.7rem;">
                    <img :src="doctor.photo" class="rounded-circle"
                        style="width: 4.6875rem; height: 4.6875rem; border: 2px solid #F1F1F5;" />
                    <div class="d-flex flex-column ml-3" style="line-height: 1.15rem;">
                        <strong style="font-size: 1.125rem;">{{ doctor.name }}</strong>
                        <span style="font-size: 0.875rem;">{{ doctor.io }}</span>
                        <div 
                            v-if="doctor.hasOwnProperty('zv')"
                            class="mt-2"
                            style="color: #8E959B; font-size: 0.875rem;">
                                {{ doctor.zv }}
                                <img
                                    v-if="doctor.hasOwnProperty('cv')"
                                    :title="doctor.cv"
                                    class="ml-1" height="15"
                                    :src="'style/info-circle-solid-gray.svg'">
                        </div>
                    </div>
                </div>
                <div class="ml-auto d-flex h-100">
                    <div v-for="(ticket, index) in doctor.wtimes"
                        :key="ticket.ID"
                        @click="doctorDayClicked({ appointIndex: jIndex, appoint : jobspec, doctor : doctor, day : ticket, index : jIndex })"
                        :class="{ active: isTicketActive(ticket.ID), 'rounded-right': index === (doctor.wtimes.length - 1) }"
                        class="doctor-day-item text-center d-flex flex-column align-items-center justify-content-center"
                        :style="(!isTicketActive(ticket.ID) ? 'background-color: #' + getStateBackgroundColor(ticket) + ';' : '') + (isTicketActual(ticket)?'':'opacity:0.4;')">
                        <template v-if="ticket.hasOwnProperty('cnt') && ticket.cnt !== null && ticket.hasOwnProperty('wtime') && ticket.wtime !== null">
                            <div class="my-2" style="font-size: 1.25rem;">{{ ticket.wtime }}</div>
                            <div class="border-top pt-3 w-50"
                                :style="'line-height: 1.25rem; ' + (ticket.can === 0 ? 'color:#8E959B;' : '')">
                                <span style="font-size: 1.75rem;">{{ ticket.cnt }}</span>
                            </div>
                        </template>
                        <div v-else class="">
                            <div v-html="getTicketMsg(ticket.info)" style="font-size: 1.125rem; color:#8E959B;" class=""></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center row mt-3">
            <div style="width: 3.125rem; height: 1.875rem; background-color: #FAFFE2; border: 1px solid #CACACE;"></div>
            <span class="ml-2">— утро</span>
            <div class="ml-5" style="width: 3.125rem; height: 1.875rem; background-color: #EBF7FF; border: 1px solid #CACACE;"></div>
            <span class="ml-2">— вечер</span>
            <div class="ml-5" style="width: 3.125rem; height: 1.875rem; background-color: #DFF2EA; border: 1px solid #CACACE;"></div>
            <span class="ml-2">— веcь день</span>
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
            step: 2,
            stepTitle: "Выберите врача и дату",
            jobSpecs:[]
        }
    },
    created: function () {

    },
    mounted: function () {
        this.$emit('flush-timer')
        this.jobSpecs = []
        var ids = ''
        for (var i = 0; i < this.appoints.length; i++)
        {
            ids += this.appoints[i].speciality.id
            if ((i + 1) < this.appoints.length)
            {
                ids += ','
            }
        }
        this.loadJobSpec(ids, 'firstLoad')
    },
    computed: {
        
    },
    methods: {
        isTicketActual (ticket){
            const [day, month, year] = ticket.dat.split(".")
            var checkDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day) + 1)
            var nowDate = new Date()

            if (checkDate >= nowDate)
            {
                return true
            }
            else
            {
                return false
            }
        },
        doctorDayClicked: function (params){
            var jid = 'jid' + parseInt(params.index + 1).toString()
            var el = this.$el.querySelector('#' + jid)
            params.el = el
            this.$emit('doctor-day-clicked', params)
        },
        removeAppoint: function(appoint){
            this.$emit('remove-appoint', appoint, 'onRemoveAppointOK')
        },
        onRemoveAppointOK: function(appoint)
        {
            this.jobSpecs.splice(appoint, 1)
        },
        nWeek : function (jobSpecList){
            this.weekChange(jobSpecList, -1)
        },
        pWeek : function (jobSpecList){
            this.weekChange(jobSpecList, +1)
        },
        weekChange : function (jobSpecList, diff){
            var oldID = Object.keys(jobSpecList)[0]
            var newValue = Object.values(jobSpecList)[0]
            oldID = oldID.replace(oldID[0], parseInt(oldID[0]) + diff)
            for (var i=0; i<this.jobSpecs.length; i++){
                if (this.jobSpecs[i].ID === oldID)
                {
                    this.jobSpecs.splice(i, 1, newValue)
                }
            }
        },
        firstLoad : function (jobSpecList){
            for (var key in jobSpecList) {
                if (jobSpecList.hasOwnProperty(key)) {
                    this.jobSpecs.push(jobSpecList[key])
                }
            }
        },
        loadJobSpec : function (id, callBack) {
            this.$emit('api-call', 'JobSpec' + '&ID=' + id, callBack)
        },
        invalidDoctor: function (doctorID, jobspecID) {
            return this.appoints.filter(app => app.doctor.ID !== -1).filter(app => app.speciality.id.substr(2) === jobspecID.substr(2) && app.doctor.ID.substr(2) !== doctorID.substr(2)).length > 0
        },
        isDoctorActive: function (docid) {
            var found = false
            for (var i = 0; i < this.appoints.length; i++) {
                if (this.appoints[i].doctor.ID !== -1){
                    if (this.appoints[i].doctor.ID.substr(2) === docid.substr(2)) {
                        found = true   
                        break
                    }
                }
            }
            return found
        },
        isTicketActive: function (ticketid) {
            var found = false
            for (var i = 0; i < this.appoints.length; i++) {
                if (this.appoints[i].doctor !== undefined) {
                    if (this.appoints[i].day.ID === ticketid) {
                        found = true
                        break
                    }
                }
            }
            return found
        },
        getStateBackgroundColor(ticket) {
            if (ticket.can === 1) {
                //Временной период (0 – утро, 1 – вечер, 2 – весь день)
                if (ticket.part === 0) {
                    return 'FAFFE2'
                } else if (ticket.part === 1) {
                    return 'EBF7FF'
                } else if (ticket.part === 2) {
                    return 'DFF2EA'
                }
            }
            else {
                return 'FFF'
            }
        },
        getTicketMsg(msg) {
            if (msg !== '')
            {
                return msg
            }
            else
            {
                return 'Нет<br />приема!'
            }
        }
    }
}
</script>