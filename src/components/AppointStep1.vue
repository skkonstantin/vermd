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
        <div class="input-group mt-4">
            <input ref='searchInput' type="text" class="form-control form-control-lg w-100 rounded-top" placeholder="ПОИСК ПО ФИО ВРАЧА ИЛИ СПЕЦИАЛЬНОСТИ"
                style="border: 2px solid #1B6CF3; box-shadow: 0px 2px 10px 0px rgba(27, 18, 243, 0.15);"
                :style="((search.length >= searchLimit && Object.keys(ddList).length > 0) ? 'border-bottom-left-radius: 0;' : '')"
                v-model="search"
                @keyup.esc="search=''"
                @keyup.down="searchInputKeyDown"
                @keyup.up="searchInputKeyUp"
                @keyup.enter="searchInputKeyEnter" />
            <div
                v-if="(search.length >= searchLimit && Object.keys(ddList).length > 0)" 
                class="ddlist rounded-bottom bg-white">
                <div
                    v-for="(item, name, index) in ddList"
                    :key="item.ID"
                    @click="ddListItemClicked(item)"
                    :style="item.can === 0 ? 'opacity: 0.4;' : ''"
                    :class="{active: index === ddListIndex}"
                    class="px-3 py-2">{{ (item.type === 0 ? item.name + " — " + item.jname : item.name) }}</div>
            </div>
        </div>
        <div class="d-flex align-items-center mt-4">
            <strong style="font-size: 1.25rem;">Свободные талоны на даты</strong>
            <div v-for="week in weeks"
                :key="week.ID"
                class="date-item btn btn-lg bg-white ml-3"
                @click="setWeek(week)"
                v-bind:class="{ active: activeWeek.ID === week.ID }">
                <img
                    v-if="activeWeek.ID === week.ID"
                    style="vertical-align: middle;"
                    class="mr-2" height="20"
                    :src="'style/calendar-alt-solid-active.svg'">
                <img
                    v-else
                    style="vertical-align: middle;"
                    class="mr-2" height="20"
                    :src="'style/calendar-alt-solid.svg'">
                <span style="font-size: 1.125rem;">{{ week.name }}</span>
            </div>
        </div>
        <div class="d-flex flex-wrap mt-4 justify-content-between">
            <div v-for="spec in sortedSpecs"
                :key="spec.ID"
                @click="specClicked(spec)"
                class="spec-item bg-white mb-4 rounded d-flex align-items-center"
                v-bind:class="{ active: isSpecActive(spec.ID) }">
                <img
                    class="item-check-circle" height="22"
                    :src="'style/check-circle-solid.svg'">
                <div class="p-1" style="font-size: 1.375rem;">
                    <strong>{{ spec.name }}</strong>
                </div>
                <div class="spec-item-ticket ml-auto h-100 align-items-center d-flex justify-content-center"
                    :style="(spec.cnt === 0 ? 'color: #8E959B; background-color: #F1F1F5;' : '')"
                    style="min-width:5rem;">
                    <strong style="font-size: 2rem;">{{ spec.cnt }}</strong>
                </div>
            </div>
        </div>
        <div class="mt-2 mb-5">
            <strong style="font-size:1.25rem;">Не нашли нужного специалиста?</strong>
            <p class="mt-2">Запись к узким специалистам, на диагностику (УЗИ, рентгенографию, функциональную диагностику)<br />осуществляется по направлению лечащего врача при наличии медицинских показаний.</p>
        </div>
    </div>
</template>

<script>
import AppointList from './AppointList.vue'
import StepNav from './StepNav.vue'
import AppointStepHeader from './AppointStepHeader.vue'

var debounce = require('lodash.debounce')

export default {
    props: ['appoints', 'timer', 'sessID', 'isDebug', 'steps', 'state', 'apiUrl'],
    components: {
        AppointList, AppointStepHeader, StepNav
    },
    data () {
        return {
            searchLimit: 3, //3,
            step: 1,
            stepTitle: "Выберите специальность врача",
            specs: [],
            activeWeek: {
                ID: -1,
                name: ""
            },
            search: "",
            ddList: {},
            weeks : [],
            ddListIndex: 0
        }
    },
    created: function () {
        this.debouncedLoadDDList = debounce(this.loadDDList, 500)
    },
    mounted : function () {
        this.$emit('flush-timer')
        this.$refs.searchInput.focus()
        this.$emit('api-call', 'Weeks', 'onWeeksOk', {})
    },
    watch: {
        search: function () {
            if (this.search.length >= this.searchLimit)
                this.debouncedLoadDDList()
        }
    },
    computed: {
        sortedSpecs: function () {
            var vm = this
            return Object.values(this.specs).sort(function(a,b){
                if(a.name < b.name) { return -1 }
                if(a.name > b.name) { return 1 }
                return 0
            })
        }
    },
    methods: {
        searchInputKeyDown : function(){
            if (this.ddListIndex === Object.keys(this.ddList).length - 1)
            {
                this.ddListIndex = 0
            }
            else
            {
                this.ddListIndex++
            }
        },
        searchInputKeyUp : function(){
            if (this.ddListIndex === 0)
            {
                this.ddListIndex = Object.keys(this.ddList).length - 1
            }
            else
            {
                this.ddListIndex--
            }
        },
        searchInputKeyEnter: function () {
            this.ddListItemClicked(Object.values(this.ddList)[this.ddListIndex])
        },
        onWeeksOk: function (res) {
            this.weeks = res
            if (this.activeWeek.ID === -1 && Object.keys(this.weeks).length > 0){
                this.activeWeek = this.weeks[Object.keys(this.weeks)[0]]
            }
            this.loadSpecList(this.activeWeek.ID)
        },
        setWeek: function (week){
            this.activeWeek = week
            this.loadSpecList()
        },
        onJobsOk: function (res) {
            this.specs = res
        },
        loadSpecList : function (){
            this.$emit('api-call', 'Jobs' + '&week=' + this.activeWeek.ID, 'onJobsOk', {})
        },
        onSearchOk: function (res) {
            this.ddListIndex = 0
            this.ddList = res
        },
        loadDDList : function (){
            this.$emit('api-call', 'Search' + '&week=' + this.activeWeek.ID + '&key=' + encodeURIComponent(this.search), 'onSearchOk', {})
        },
        specClicked : function (spec) {
            if (spec.cnt > 0){
                this.$emit('spec-clicked', { id: spec.ID, title: spec.name, week: this.activeWeek })
            }
        },
        ddListItemClicked: function (item) {
            if (item.can === 1){
                if (item.type === 0){
                    this.$emit('doctor-clicked', item)
                } else if (item.type === 1){
                    this.$emit('spec-clicked', { id: item.ID, title: item.name, week: this.activeWeek })
                }
                this.search = ""
            }
        },
        isSpecActive: function (specId) {
            var found = false
            for (var i = 0; i < this.appoints.length; i++)
            {
                if (this.appoints[i].speciality.id === specId)
                {
                    found = true
                }
            }
            return found
        }
    }
}
</script>