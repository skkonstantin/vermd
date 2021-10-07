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
        <div v-for="(specApp, index) in specApps"
            :id="'jid' + index.toString()"
            :key="specApp.ID"
            :class="'mt-5'">
            <div class="d-flex align-items-center mb-3">
                <div class="d-flex flex-column">
                    <strong style="font-size: 1.25rem;">{{ specApp.jname }}</strong>
                </div>
            </div>
            <div class="doctor-item bg-white mb-3 rounded d-flex flex-column p-3">
                <div class="d-flex align-items-center">
                    <img :src="specApp.photo" class="rounded-circle"
                        style="width: 4.6875rem; height: 4.6875rem; border: 2px solid #F1F1F5;" />
                    <div class="d-flex flex-column ml-3" style="line-height: 1.15rem;">
                        <strong style="font-size: 1.25rem;">{{ specApp.name }} {{ specApp.io }}</strong>
                        <div class="mt-3">
                            <span v-if="specApp.hasOwnProperty('zv')" style="color: #8E959B; font-size: 0.875rem;">{{ specApp.zv }}</span>
                            <span v-else>&nbsp;</span>
                            <img
                                v-if="specApp.hasOwnProperty('cv')"
                                :title="specApp.cv"
                                class="ml-1" height="15"
                                :src="'style/info-circle-solid-gray.svg'">
                        </div>
                    </div>
                    <div
                        v-if="Object.keys(specApps).length > 1"
                        class="ml-auto form-inline">
                        <button
                            class="btn btn-secondary py-0" style="min-width: 5.9375rem;"
                            :disabled="!canDateExist(specApp.days[Object.keys(specApp.days)[0]].iDate, index, -1)"
                            @click="loadSpecApp(getNewIDate(specApp.ID, specApp.days[Object.keys(specApp.days)[0]].iDate, index, -1), 'dayChange')">
                            <img
                                class="mr-2" height="16"
                                :src="'style/chevron-left-solid-1.svg'">
                            Ранее</button>
                        <input
                            type="date"
                            class="form-control form-control-lg mx-3 rounded-pill"
                            :value="specDates[index]"
                            @input="onDateInput(index, $event.target.value)"/>
                        <button
                            class="btn btn-secondary py-0" style="min-width: 5.9375rem;"
                            :disabled="!canDateExist(specApp.days[Object.keys(specApp.days)[0]].iDate, index, +1)"
                            @click="loadSpecApp(getNewIDate(specApp.ID, specApp.days[Object.keys(specApp.days)[0]].iDate, index, +1), 'dayChange')">
                            Позднее
                            <img
                                class="ml-2" height="16"
                                :src="'style/chevron-right-solid-1.svg'"></button>
                    </div>
                    <div
                        v-else
                        class="ml-auto form-inline">
                        <button
                            @click="$emit('goto-step', 2)"
                            class="btn btn-outline-primary rounded-pill mb-2"
                            style="min-width: 12.5rem;">Изменить</button>
                    </div>
                </div>
                <div
                    v-if="Object.keys(specApps).length > 1"
                    class="d-flex align-items-start mt-4 flex-wrap">
                    <button style="font-size: 1.5rem;"
                        v-for="timeslot in specApp.days[Object.keys(specApp.days)[0]].slots"
                        :key="timeslot.iTime"
                        @click="timeslotClicked({appoint : specApp, timeslot : timeslot, day : specApp.days[Object.keys(specApp.days)[0]], index : index})"
                        :class="{ active: isTimeslotActive(timeslot.iTime) }"
                        class="btn btn-light px-3 py-2 mr-2 mb-2 timeslot-item"
                        :disabled="!isTimeslotActual(specApp.days[Object.keys(specApp.days)[0]].dat, timeslot)">
                        {{ timeslot.wtime.substring(0, 5) }}
                    </button>
                </div>
            </div>
            <div
                v-if="Object.keys(specApps).length === 1"
                class="d-flex align-items-center">
                <button
                    :disabled="!canDateExist(specApp.days[Object.keys(specApp.days)[0]].iDate, index, -1)"
                    @click="loadSpecApp(getNewIDate(specApp.ID, specApp.days[Object.keys(specApp.days)[0]].iDate, index, -6), 'dayChange', 6)"
                    type="button"
                    class="btn btn-primary mr-2"
                    style="margin-left: -3.5rem;padding: 0.9rem;">
                    <img
                        v-if="true"
                        class="" height="28" width="18"
                        :src="'style/chevron-left-solid-active.svg'">
                    <img
                        v-else
                        class="" height="28" width="18"
                        :src="'style/chevron-left-solid.svg'">
                </button>
                <div
                    class="d-flex flex-wrap mt-4 justify-content-between">
                    <div
                        v-for="day in specApp.days"
                        :key="day.iDate"
                        class="mb-4 rounded bg-white"
                        style="width: 21.875rem; cursor: pointer; box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.05); border: 1px solid #F1F1F5;">
                        <div
                            class="w-100 text-center rounded-top"
                            style="border: 1px solid #DCDCE1;"
                            :style="'background-color: #' + getStateBackgroundColor(day) + ';'">
                            <span style="font-size: 1.125rem;">{{ day.name }}</span>
                            <br />
                            <span style="font-size: 1.25rem;">{{ day.wtime }}</span>
                        </div>
                        <div
                            class="d-flex align-items-start flex-wrap bg-white p-3 rounded-bottom">
                            <button style="font-size: 1.5rem;"
                                v-for="timeslot in day.slots"
                                :key="timeslot.iTime"
                                @click="$emit('timeslot-clicked', {appoint : specApp, timeslot : timeslot, day : day})"
                                :class="{ active: isTimeslotActive(timeslot.iTime) }"
                                class="btn btn-light px-3 py-2 mr-2 mb-2 timeslot-item"
                                :disabled="!isTimeslotActual(day.dat, timeslot)">
                                {{ timeslot.wtime.substring(0, 5) }}
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    :disabled="!canDateExist(specApp.days[Object.keys(specApp.days)[Object.keys(specApp.days).length - 1]].iDate, index, +1)"
                    @click="loadSpecApp(getNewIDate(specApp.ID, specApp.days[Object.keys(specApp.days)[Object.keys(specApp.days).length - 1]].iDate, index, +1), 'dayChange', 6)"
                    type="button"
                    class="btn btn-primary ml-2"
                    style="margin-right: -3.5rem;padding: 0.9rem;">
                    <img
                        v-if="true"
                        class="" height="28" width="18"
                        :src="'style/chevron-right-solid-active.svg'">
                    <img
                        v-else
                        class="" height="28" width="18"
                        :src="'style/chevron-right-solid.svg'">
                </button>
            </div>
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
            step: 3,
            stepTitle: "ВЫБЕРИТЕ ВРЕМЯ ПРИЕМА",
            oldSpecDates: [],
            specDates: [],
            specApps:[],
            canDates: []
        }
    },
    created: function () {

    },
    mounted: function () {
        this.init()
    },
    computed: {
        
    },
    methods: {
        init : function (){
            var ids = ''
            for (var i = 0; i < this.appoints.length; i++)
            {
                ids += this.appoints[i].day.ID
                if ((i + 1) < this.appoints.length)
                {
                    ids += ','
                }
            }
            var depth = this.appoints.length === 1 ? 6 : 0
            this.loadSpecApp(ids, 'firstLoad', depth)
        },
        datToISODate : function (dat) {
            const [day, month, year] = dat.split(".")
            var date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day) + 1)
            return date.toISOString().split('T')[0]
        },
        firstLoad : function (specAppList){
            this.canDates = []
            this.oldSpecDates = []
            this.specDates = []
            this.specApps = []
            
            for (var key in specAppList) {
                if (specAppList.hasOwnProperty(key)) {
                    var value = specAppList[key]
                    this.canDates.push([])
                    var date = this.datToISODate(value.days[Object.keys(value.days)[0]].dat)
                    this.specDates.push(date)
                    this.oldSpecDates.push(date)
                    this.specApps.push(value)
                    for (var i = 0; i < this.appoints.length; i++){
                        var app = this.appoints[i]
                        if (app.doctor.ID.substr(2) === key){
                            if (!app.doctor.hasOwnProperty('io'))
                            {
                                app.doctor.io = value.io
                            }
                            if (!app.doctor.hasOwnProperty('photo'))
                            {
                                app.doctor.photo = value.photo
                            }
                        }
                    }
                }
            }

            var index = 0
            for (var key in specAppList) {
                var value = specAppList[key]
                var now = new Date()
                var last = new Date(now)
                last.setDate(last.getDate() + 22)
                this.$emit('api-call', 'CanAppMonth' + '&ID=' + value.ID + '.' + this.dateToIDate(now), 'onCanAppMonthOK', index)
                if (now.getMonth() !== last.getMonth()){
                    this.$emit('api-call', 'CanAppMonth' + '&ID=' + value.ID + '.' + this.dateToIDate(last), 'onCanAppMonthOK', index)
                }
                index++
            }
        },
        dateToIDate: function (date){
            return date.getFullYear().toString() + this.get2DigitVal(date.getMonth() + 1) + this.get2DigitVal(date.getDate())
        },
        onCanAppMonthOK : function(res, index){
            this.canDates[index].push.apply(this.canDates[index], Object.keys(res).map(function(key) { return res[key].iDate }))
            this.canDates[index].sort(function(a, b) { return a - b })
            //this.canDates.splice(index, 1, res)
        },
        getIDateKey: function(iDate, index, cd){
            var iDateKey = -1
            for (var i = 0; i < cd.length; i++){
                if (cd[i] === iDate){
                    iDateKey = i
                }
            }
            return iDateKey
        },
        canDateExist : function (iDate, index, diff){
            var cd = this.canDates[index]
            var iDateKey = this.getIDateKey(iDate, index, cd)
            var newKey = iDateKey + diff
            return ((iDateKey !== -1) && (-1 < newKey) && (newKey < cd.length))
        },
        getNewIDate: function(specAppID, iDate, index, diff){
            var newIDate = this.canDates[0]

            var cd = this.canDates[index]
            var iDateKey = this.getIDateKey(iDate, index, cd)
            var newKey = iDateKey + diff
            
            if ((iDateKey !== -1) && (-1 < newKey) && (newKey < cd.length)){
                newIDate = cd[newKey]
            }
            
            return specAppID + '.' + newIDate.toString()
        },

        
        timeslotClicked: function (params){
            var jid = 'jid' + parseInt(params.index + 1).toString()
            var el = this.$el.querySelector('#' + jid)
            params.el = el
            this.$emit('timeslot-clicked', params)
        },
        updateDates : function(index, newValue){
            this.specDates.splice(index, 1, newValue)
            this.oldSpecDates.splice(index, 1, newValue)
        },
        onDateInput : function (index, newValue) {
            if (newValue !== ''){
                this.loadSpecApp(this.specApps[index].ID.toString() + '.' + this.isoDateToIDate(newValue), 'dayChange')
            }
            else
            {
                this.specDates.splice(index, 1, this.oldSpecDates[index])
            }
        },
        
        getDateFromDat : function(dat){
            const [day, month, year] = dat.split(".")
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

        },
        isTimeslotActual (dat, timeslot){
            var date = this.getDateFromDat(dat)
            var hh = parseInt(timeslot.wtime.substring(0, 2))
            var mm = parseInt(timeslot.wtime.substring(3, 5))
            date.setHours(hh,mm,0,0)
            var now = new Date()
            return (date > now)
        },
        removeAppoint: function(appoint){
            this.$emit('remove-appoint', appoint, 'onRemoveAppointOK')
        },
        onRemoveAppointOK: function(appoint){
            this.canDates.splice(appoint, 1)
            this.specApps.splice(appoint, 1)
            this.specDates.splice(appoint, 1)
            this.oldSpecDates.splice(appoint, 1)
            if (this.specApps.length === 1)
            {
                this.init()
            }
        },
        loadSpecApp : function (id, callBack, depth = 0) {
            this.$emit('api-call', 'SpecApp' + '&ID=' + id + '&depth=' + depth, callBack)
        },
        dayChange : function (specAppList){
            var oldID = Object.keys(specAppList)[0]
            var newValue = Object.values(specAppList)[0]
            for (var i=0; i<this.specApps.length; i++){
                if (this.specApps[i].ID === oldID)
                {
                    var isoDate = this.datToISODate(newValue.days[Object.keys(newValue.days)[0]].dat)
                    this.updateDates(i, isoDate)
                    
                    this.specApps.splice(i, 1, newValue)
                }
            }
        },
        isoDateToIDate: function (date) {
            const [year, month, day] = date.split("-")
            return year + month + day
        },
        get2DigitVal: function (v) {
            return (v < 10 ? '0' + v.toString() : '' + v.toString())
        },
        isTimeslotActive : function (timeslotId) {
            return this.appoints.filter(appoint => appoint.timeslot.iTime === timeslotId).length > 0
        },
        getStateBackgroundColor(day) {
            if (day.part === 0) {
                return 'FAFFE2'
            } else if (day.part === 1) {
                return 'EBF7FF'
            } else if (day.part === 2) {
                return 'DFF2EA'
            }
        }
    }
}
</script>