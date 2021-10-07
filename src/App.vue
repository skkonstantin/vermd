<template>
	<div
        id="app"
        class="app d-flex mx-auto flex-column"
        @keyup.esc="onKeyUpEsc">
        <AppHeader
            :staticConfig="staticConfig"/>
        <main class="container mb-5" role="main" style="min-height: 40rem;">
            <ProfileHeader
                v-if="sessID !== ''"
                :sessID="sessID"
                :user="user"
                
                @appoint-to-therapist="appointToTherapist"
                @logout="tryLogout"/>
            <router-view ref="rv"
                :sessID="sessID"
                :appoints="appoints"
                :steps="steps"
                :state="state"
                :timer="timer"
                :isDebug = "isDebug"
                :apiUrl = "apiUrl"
                :staticConfig="staticConfig"
                :sended = "sended"
                :email = "email"

                @api-call="function (cmd, callBack, cbParams) { apiCall(cmd, callBack, cbParams, 'rv') }"
                @menu-item-clicked="menuItemClicked($event)"
                @flush-timer="flushTimeslots"
                @show-error="showError($event)"
                @step-item-clicked="stepClicked($event)"
                @remove-appoint="function (id, callBack) { removeAppointConfirm(id, callBack) }"
                @remove-appoint-no-confirm="removeAppointNoConfirm($event)"
                @block-appoint="blockAppoint($event)"
                @unblock-appoint="unblockAppoint($event)"
                @print-app="printApp($event)"
                @print-apps="printApps()"
                @send-mail="sendMail($event)"
                @goto-step="gotoStep($event)"
                @doctor-clicked="doctorClicked"
                @spec-clicked="specClicked"
                @goto-menu-clicked="gotoMenu"
                @doctor-day-clicked="ddClicked"
                @timeslot-clicked="timeslotClicked"
                @goto-confirm="tryGotoConfirm"/>
        </main>
        <AppFooter
            :staticConfig="staticConfig"/>
        <modal ref="md"
            v-if="showModal"

            :is="currentModal"
            :specToAdd="specToAdd"
            :appoints="appoints"
            :errorMsg="errorMsg"
            :appointToRemove="appointToRemove"
            :appointToRemoveIndex="appointToRemoveIndex"

            @confirm-appoint-removal="removeAppoint"
            @api-call="function (cmd, callBack) { apiCall(cmd, callBack, {}, 'md') }"
            @change-spec="changeSpec($event)"
            @close="showModal = false"
            @exit-no-logout="exitNoLogout"
            @exit-logout="exitLogout"
            @login="login">
        </modal>
    </div>
</template>

<script>
import SpecChangeModal from './components/SpecChangeModal.vue'
import LoginModal from './components/LoginModal.vue'
import ErrorModal from './components/ErrorModal.vue'
import TimerRottenModal from './components/TimerRottenModal.vue'
import RemoveAppointModal from './components/RemoveAppointModal.vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import MainMenu from './components/MainMenu.vue'
import ProfileHeader from './components/ProfileHeader.vue'
import AppointStep1 from './components/AppointStep1.vue'
import AppointStep2 from './components/AppointStep2.vue'
import AppointStep3 from './components/AppointStep3.vue'
import AppointStep4 from './components/AppointStep4.vue'
import AppointConfirmation from './components/AppointConfirmation.vue'
import '@babel/polyfill'
import axios from 'axios'

export default {
    components: {
        LoginModal, ErrorModal, SpecChangeModal, TimerRottenModal, RemoveAppointModal,
        AppHeader, AppFooter,
        ProfileHeader, 
        MainMenu, 
        AppointStep1, AppointStep2, AppointStep3, AppointStep4, AppointConfirmation
    },
    data () {
        return {
            isDebug: false,
            //isDebug: true,
            timerTimeOut: null,
            timerOn: false,
            timer: null,
            showModal: false,
            state: "menu", //menu, step1, step2, step3, step4, confirm
            steps: [
                { id: 1, title: "Выбор специализации", number: "01", msg: "Выберите специальность врача" },
                { id: 2, title: "Выбора врача и даты", number: "02", msg: "Выберите врача и дату" },
                { id: 3, title: "Выбор времени приема", number: "03", msg: "33" },
                { id: 4, title: "Подтверждение записи", number: "04", msg: "44" }
            ],
            appoints: [],
            sessID: '',
            user: {},
            actionAfterLogin : '',
            currentModal: 'ErrorModal',
            specToAdd: {},
            errorMsg : '',
            staticConfig : '',
            timerRnTimeOut: null,
            timerRnOn: false,
            timerRn: null,
            appointToRemove: {},
            appointRemovalCallBack: null,
            appointToRemoveIndex: -1,
            sended : -1,
            email : ''
        }
    },
    created: function () {
        window.localStorage.clear()
        Object.keys(this.$data).forEach(key => {
            if (window.sessionStorage.getItem(key) !== null && key !== 'timerTimeOut') {
                this[key] = JSON.parse(window.sessionStorage.getItem(key))
            }
        })

        var vm = this

        if (this.timerOn){
            this.timerTimeOut = 
                window.setInterval(function () {
                    if (vm.timer > 0)
                    {
                        vm.timer--
                    }
                    else
                    {
                        vm.timerRotten()
                    }
                }, 1000)
        }

        if (this.timerRnOn){
            this.timerRnTimeOut = window.setInterval(function () {
                if (vm.timerRn > 0)
                {
                    vm.timerRn--
                }
                else
                {
                    vm.exitNoLogout()
                }
            }, 1000)
        }

        //load config
        var url = 'config.json'
        axios
            .post(url)
            .then(function (response) {
                if (response.data.hasOwnProperty('staticConfig')){
                    vm.staticConfig = response.data.staticConfig
                }
                else vm.showError('Ошибка загрузки файла конфигурации')
            })
            .catch(function (error) {
                console.log(error)
            })
        window.onbeforeunload = function () {
            Object.keys(vm.$data).forEach(key => {
                if (key !== 'timerTimeOut' && key !== 'timerRnTimeOut'){
                    window.sessionStorage.setItem(key, JSON.stringify(vm.$data[key]))
                }
            })
            //return "Вы уверены, что хотите покинуть личный кабинет?"
        }
    },
    beforeUpdate: function () {

    },
    updated: function () {
        //$('[data-toggle="tooltip"]').tooltip()
    },
    computed: {
        currentState: function () {
            return 'App' + this.state.toLowerCase()
        },
        apiUrl: function () {
            return (this.isDebug ? "http://www.ingrussc.ru/lk170/" : "") + 'lk.php'// 'lk_test.php'
        }
    },
    watch: {
        $route : function(to, from){
            console.log(from.path + ' -> ' + to.path)
            if (to.path === '/step3')
            {
                this.appoints = this.appoints.filter(appoint => appoint.day.ID !== -1 && appoint.blocked != true)
            }
            else if (to.path === '/step4')
            {
                if (from.path === "/confirm")
                {
                    this.appoints = []
                    this.gotoStep(1)
                }
                this.appoints = this.appoints.filter(appoint => appoint.timeslot.iTime !== -1)
            }
            else if (to.path === '/confirm')
            {
                this.appoints = this.appoints.filter(appoint => appoint.blocked != true)
            }
        }
    },
    methods: {
        exitLogout: function(){
            this.exitRn()
            this.logout()
        },
        exitNoLogout: function(){
            this.exitRn()
            this.gotoMenu()
        },
        exitRn: function(){
            window.clearInterval(this.timerRnTimeOut)
            this.timerRnOn = false
            this.timerRn = null
            this.showModal = false
            this.gotoMenu()
        },
        onKeyUpEsc: function(){
            if (this.currentModal === "TimerRottenModal")
            {
                this.exitNoLogout()
            }
            else
            {
                this.showModal = false
            }
        },
        changeSpec : function(appointId){
            this.appoints.splice(appointId, 1)
            if (this.specToAdd !== {}){
                this.specClicked(this.specToAdd)
                this.specToAdd = {}
            }
            this.showModal = false
        },
        unblockAppoint: function(appointId){
            this.appoints[appointId].blocked = false
        },
        removeAppointConfirm : function(appointId, callBack = null){
            this.appointToRemoveIndex = appointId
            this.appointToRemove = this.appoints[appointId]
            this.currentModal = 'RemoveAppointModal'
            this.showModal = true
            this.appointRemovalCallBack = callBack
        },
        removeAppointNoConfirm : function (id){
            this.removeAppoint(id)
        },
        removeAppoint: function(appointId){
            this.showModal = false
            if (this.$route.path === "/confirm")
            {
                var appID = this.appoints[appointId].appID
                this.apiCall('AppDel' + '&ID=' + appID, 'onAppDelOK', appID)
            }
            else if (this.$route.path === "/step4")
            {
                this.appoints[appointId].blocked = true
                if (this.appoints.length === this.appoints.filter(app => app.blocked === true).length)
                {
                    this.appoints = []
                    if (this.timerOn){
                        this.clearTimer()
                    }
                    this.gotoStep(1)
                }
            }
            else
            {
                this.tryRemoveAppoint(appointId)
            }
        },
        tryRemoveAppoint : function(appointId){
            if (this.appoints.length === 1){
                this.appoints = []
            }
            else
            {
                this.appoints.splice(appointId, 1)
            }
            if (this.appointRemovalCallBack !== null){
                var callBack = this.appointRemovalCallBack
                this.$refs.rv[callBack](appointId)
            }
            if (this.timerOn && (this.appoints.length === 0 || this.appoints.filter(app => app.timeslot.iTime !== -1).length === 0)){
                this.clearTimer()
            }
            if (this.appoints.length === 0)
            {
                this.gotoStep(1)
            }
        },
        menuItemClicked : function (item) {
            if (item.type === "applink")
            {
                this[item.path]()
            }
            else if (item.type === "urlNewTab")
            {
                window.open(item.path, '_blank')
            }
            else if (item.type === "url")
            {
                window.location = item.path
            }
            else if (item.type === "urlNewTabLoggedIn" || item.type === "urlLoggedIn")
            {
                this.menuItemToGo = item
                if (this.sessID !== '')
                {
                    this.gotoUrl()
                }
                else
                {
                    this.showModal = true
                    this.currentModal = 'LoginModal'
                    this.actionAfterLogin = 'gotoUrl'
                }
            }
            else if (item.type === "blocked")
            {
                this.showError('Раздел в разработке')
            }
            else
            {
                this.showError('Раздел в разработке')
            }
        },
        showError: function (msg){
            this.errorMsg = msg
            this.showModal = true
            this.currentModal = 'ErrorModal'
        },
        appointToTherapist: function (){
            if (this.sessID !== ''){
                this.appoints = []
                this.clearTimer()
                var app = {
                    speciality: {
                        id: '0.' + this.user.JobID,
                        title:"Терапевт",
                        week: {
                            ID: 0
                        }
                    },
                    doctor: {
                        ID : -1
                    },
                    day: {
                        ID : -1
                    },
                    timeslot: {
                        iTime: -1
                    }
                }
                var isDoctosSet = this.user.hasOwnProperty('phID') && this.user.phID !== ''
                if (isDoctosSet)
                {
                    var date = new Date()
                    app.doctor = {
                        ID: this.user.phID,
                        name: this.user.ph,
                        shortname : this.user.ph
                    }
                    app.day = {
                        ID: this.user.phID.substr(2) + '.' + this.dateToIDate(date),
                        dat: this.dateToDat(date)
                    }
                }
                this.appoints.push(app)
                this.gotoStep(isDoctosSet ? 3 : 2)
            }
            else
            {
                this.showModal = true
                this.currentModal = 'LoginModal'
                this.actionAfterLogin = 'appointToTherapist'
            }
        },
        gotoUrl: function(){
            if (this.menuItemToGo !== undefined){
                if (this.menuItemToGo.type === "urlNewTabLoggedIn")
                {
                    window.open(this.menuItemToGo.path, '_blank')
                }
                else if (this.menuItemToGo.type === "urlLoggedIn")
                {
                    window.location = this.menuItemToGo.path
                }
            }
        },
        dateToIDate: function (date) {
            return date.getFullYear().toString() + this.get2DigitVal(date.getMonth() + 1).toString() + this.get2DigitVal(date.getDate()).toString()
        },
        dateToDat: function (date) {
            return this.get2DigitVal(date.getDate()).toString() + '.' + this.get2DigitVal(date.getMonth() + 1).toString() + '.' + date.getFullYear().toString()
        },
        get2DigitVal: function (v) {
            return (v < 10 ? '0' + v : '' + v)
        },
        appoint: function (){
            if (this.sessID !== ''){
                this.appoints = []
                this.clearTimer()
                this.gotoStep(1)
            }
            else
            {
                this.showModal = true
                this.currentModal = 'LoginModal'
                this.actionAfterLogin = 'appoint'
            }
        },
        login: function (res) {
            this.sessID = res.sessID
            this.user = res.user
            this.showModal = false
            if (this.actionAfterLogin !== '') this[this.actionAfterLogin]()
        },
        tryLogout: function (){
            this.clearTimer('logout')
        },
        logout: function (){
            this.apiCall('Logout', 'clearSession')
        },
        clearSession : function () {
            window.sessionStorage.clear()
            this.user = {}
            this.sessID = ''
            this.gotoMenu()
        },
        apiCall: function (cmd, callBack, paramsCB = {}, cc = null) {
            var url = this.apiUrl + '?cmd=' + cmd
            var vm = this
            axios
                .post(url)
                .then(function (response) {
                    if (response.data.state === 'ok'){
                        var res = response.data.hasOwnProperty('res') ? response.data.res : {}
                        if (cc !== null)
                        {
                            vm.$refs[cc][callBack](res, paramsCB)
                        }
                        else
                        {
                            vm[callBack](res, paramsCB)
                        }
                    }
                    else if (response.data.state === 'error')
                    {
                        if (cmd.indexOf('Login') !== -1){   
                            vm.$refs[cc].onLoginError(response.data.msg)
                        }
                        else if (cmd.indexOf('SendMail') !== -1)
                        {
                            vm.showError(response.data.msg)
                        }
                        else if (response.data.code === 256007)
                        {
                            if (cmd.indexOf('Search') !== -1){
                                if (vm.$refs[cc].hasOwnProperty('ddList'))
                                {
                                    vm.$refs[cc].ddList = {}
                                }
                            }
                            else if (cmd.indexOf('SpecApp') !== -1){
                                if (vm.$refs[cc].hasOwnProperty('specDates') && vm.$refs[cc].hasOwnProperty('oldSpecDates'))
                                {
                                    for (var i = 0; i < vm.$refs[cc].specDates.length; i++){
                                        vm.$refs[cc].specDates[i] = vm.$refs[cc].oldSpecDates[i]
                                    }
                                }
                            }
                            else if (cmd.indexOf('CanAppMonth') !== -1)
                            {
                                
                            }
                            else
                            {
                                vm.showError(response.data.msg)
                            }
                        }
                        else if (response.data.code === 256010 || response.data.code === 256011 || response.data.code === 256035 || response.data.code === 256021 || response.data.code === 256016)
                        {
                            vm.showError(response.data.msg)
                        }
                        else
                        {
                            vm.clearSession()
                            vm.showError(response.data.msg)
                        }
                    }
                    else
                    {
                        vm.showError("Что-то пошло не так")
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        gotoMenu: function () {
            if (this.timerOn && this.appoints.filter(app => app.timeslot.iTime !== -1).length === 0){
                this.clearTimer()
            }
            this.state = 'menu'
            this.$router.push('mainmenu')
        },
        gotoConfirm: function(res){
            var apps = res.apps

            var errorMsg = ''
            var errorsCount = 0
            for (var app in apps) {
                if (apps.hasOwnProperty(app))
                {                                
                    var appoint = this.appoints.filter(appoint => appoint.timeslot.iTime === app)[0]

                    if (apps[app].state === 0)
                    {
                        appoint.appID = apps[app].ID
                        appoint.appWtime = apps[app].wtime
                        appoint.appCDate = apps[app].cDate
                    }
                    else
                    {
                        appoint.appID = -1
                        errorsCount++
                        errorMsg += 'Талон к ' + appoint.doctor.name + ' не получен, причина:<br />' + apps[app].msg + '<br /><br />'
                        appoint.makeAppError = apps[app].msg
                    }
                }
            }

            if (errorsCount < Object.keys(apps).length)
            {
                if (res.hasOwnProperty('email'))
                {
                    this.email = res.email
                }
                else
                {
                    this.email = ''
                }
                if (res.hasOwnProperty('sended'))
                {
                    this.sended = res.sended
                }
                else
                {
                    this.sended = -1
                }
                this.clearTimer()
                this.state = 'confirm'
                this.$router.push('confirm')
            }
            else
            {
                this.showError(errorMsg)
            }
        },
        tryGotoConfirm: function () {
            this.appoints = this.appoints.filter(appoint => appoint.blocked != true)
            var ids = ''
            for (var i = 0; i < this.appoints.length; i++)
            {
                ids += this.appoints[i].timeslot.iTime
                if ((i + 1) < this.appoints.length)
                {
                    ids += ','
                }
            }
            this.apiCall('MakeApp' + '&ID=' + ids, 'gotoConfirm')
        },
        printApps : function (){
            var printableApps = this.appoints.filter(app => app.hasOwnProperty('appID') && app.appID !== -1)
            var ids = ''
            for (var i = 0; i < printableApps.length; i++)
            {
                ids += printableApps[i].appID
                if ((i + 1) < printableApps.length)
                {
                    ids += ','
                }
            }
            this.apiCall('Print' + '&ID=' + ids, 'openPrintLinks')
        },
        printApp : function (id){
            this.apiCall('Print' + '&ID=' + id, 'openPrintLinks')
        },
        openPrintLinks: function (data){
            if (data.hasOwnProperty('pdf')) window.open(data.pdf)
            if (data.hasOwnProperty('html')) window.open(data.html)
        },
        sendMail : function (email){
            var ids = ''
            for (var i = 0; i < this.appoints.length; i++)
            {
                ids += this.appoints[i].appID
                if ((i + 1) < this.appoints.length)
                {
                    ids += ','
                }
            }
            this.apiCall('SendMail' + '&ID=' + ids + '&email=' + email, 'showEmailSentMsg')
        },
        showEmailSentMsg : function(){
             // move showEmailSentMsg method to confirm component
        },
        onAppDelOK: function (res, id){
            for (var i = 0; i < this.appoints.length; i++){
                if (this.appoints[i].appID === id)
                {
                    this.tryRemoveAppoint(i)
                    break
                }
            }
        },
        gotoStep: function (step) {
            this.state = 'step' + step.toString()
            this.$router.push(this.state)
        },
        doctorClicked: function (doctor) {
            var date = new Date()
            this.appoints = []
            this.clearTimer()
            this.appoints.push({
                speciality: {
                    id: doctor.jID,
                    title: doctor.jname,
                    week: {
                        ID: 0
                    }
                },
                doctor: {
                    ID: doctor.ID,
                    name: doctor.name,
                    shortname : doctor.name
                },
                day: {
                    ID: doctor.ID.substr(2) + '.' + this.dateToIDate(date),
                    dat: this.dateToDat(date)
                },
                timeslot: {
                    iTime: -1
                }
            })
            this.gotoStep(3)
        },
        specClicked: function (spec) {
            var found = false
            for (var i = 0; i < this.appoints.length; i++)
            {
                if (this.appoints[i].speciality.id.substr(2) === spec.id.substr(2))
                {
                    found = true
                    if (this.appoints[i].speciality.id === spec.id)
                    {
                        this.appoints.splice(i, 1)
                    }
                    else
                    {
                        this.appoints[i].speciality = spec
                        //this.appoints[i].speciality.id = spec.id.charAt(0) + this.appoints[i].speciality.id.substr(1)
                    }
                }
            }
            
            if (!found)
            {
                if (this.appoints.length < 3)
                {
                    this.appoints.push({
                        //id: newId,
                        speciality: spec,
                        doctor: {
                            ID: -1
                        },
                        day: {
                            ID: -1
                        },
                        timeslot: {
                            iTime: -1
                        }
                    })
                }
                else
                {
                    this.currentModal = 'SpecChangeModal'
                    this.showModal = true
                    this.specToAdd = spec
                }
            }
        },
        ddClicked : function (params) {
            if (params.day.can === 1) {
                const [day, month, year] = params.day.dat.split(".")
                var checkDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day) + 1)
                var nowDate = new Date()

                if (checkDate >= nowDate)
                {
                    var appoint = this.appoints[params.appointIndex]
                    if (appoint.doctor.ID === params.doctor.ID)
                    {
                        if (appoint.day.ID === params.day.ID)
                        {
                            appoint.day = {
                                ID: -1
                            }
                            appoint.doctor = {
                                ID: -1
                            }
                        }
                        else
                        {
                            appoint.day = params.day
                        }
                    }
                    else
                    {
                        appoint.doctor = params.doctor
                        appoint.day = params.day
                        this.scrollTo(params.el)
                    }
                }
            }
        },
        onUnLockOK : function (res, params){
            if (params.appoint.timeslot.iTime === params.timeslot.iTime)
            {
                params.appoint.timeslot = {
                    iTime: -1
                }

                if (this.timerOn && this.appoints.filter(app => app.timeslot.iTime !== -1).length === 0){
                    this.clearTimer()
                }    
            }
            else
            {
                this.apiCall('Lock' + '&ID=' + params.timeslot.iTime, 'onLockOK', {appoint : params.appoint, timeslot: params.timeslot, day: params.day, el: params.el})
            }
        },
        scrollTo: function (el){
            if (el !== null)
            {
                window.scrollTo({
                    'behavior': 'smooth',
                    'left': 0,
                    'top': el.offsetTop
                })
            }
        },
        onLockOK : function (res, params){
            params.appoint.timeslot = params.timeslot
            params.appoint.day.ID = params.appoint.day.ID.substring(0, params.appoint.day.ID.lastIndexOf('.') + 1) + params.day.iDate.toString()
            params.appoint.day.dat = params.day.dat  // dd.mm.yyyy - ...
            params.appoint.day.wtime = params.day.wtime
            if (!this.timerOn && this.appoints.filter(app => app.timeslot.iTime !== -1).length > 0){
                this.timerOn = true
                this.timer = 3 * 60
                var vm = this
                this.timerTimeOut = window.setInterval(function () {
                    if (vm.timer > 0)
                    {
                        vm.timer--
                    }
                    else
                    {
                        vm.timerRotten()
                    }
                }, 1000)
            }
            this.scrollTo(params.el)
        },
        onUnLockAllOK : function (res, callBack){
            if (callBack !== null)
            {
                this[callBack]()
            }
        },
        timeslotClicked : function (params) { // appoint : appoint, timeslot : timeslot, day : day
            var index = -1

            for (var i = 0; i < this.appoints.length; i++) {
                if (this.appoints[i].doctor.ID.substr(2) === params.appoint.ID)
                {
                    index = i
                }
            }
            
            if (index !== -1) {
                var appoint = this.appoints[index]

                if (appoint.timeslot.iTime !== -1){
                    this.apiCall('UnLock' + '&ID=' + appoint.timeslot.iTime, 'onUnLockOK', {appoint : appoint, timeslot: params.timeslot, day: params.day, el: params.el})
                }
                else
                {
                    this.apiCall('Lock' + '&ID=' + params.timeslot.iTime, 'onLockOK', {appoint : appoint, timeslot: params.timeslot, day: params.day, el: params.el})
                }
                
            }
        },
        timerRotten : function () {
            this.clearTimer()
            for (var i = 0; i < this.appoints.length; i++)
            {
                this.appoints[i].timeslot = {
                    iTime: -1
                }
            }
            if (this.$route.path === "/step4"){
                this.gotoStep(3)
            }
            this.showModal = true
            this.currentModal = 'TimerRottenModal'

            this.timerRnOn = true
            this.timerRn = 30
            var vm = this
            this.timerRnTimeOut = window.setInterval(function () {
                if (vm.timerRn > 0)
                {
                    vm.timerRn--
                }
                else
                {
                    vm.exitNoLogout()
                }
            }, 1000)
        },
        flushTimeslots : function () {
            for (var i = 0; i < this.appoints.length; i++) {
                this.appoints[i].timeslot = {
                    iTime: -1
                }
            }
            this.clearTimer()
        },
        clearTimer : function (callBack = null) {
            //this.apiCall('UnLockAll', 'onUnLockAllOK', callBack)
            if (callBack !== null){
                this[callBack]()
            }
            window.clearInterval(this.timerTimeOut)
            this.timerOn = false
            this.timer = null
        },
        stepClicked: function (id) {
            if (parseInt(this.state.charAt(4)) > id) {
                this.gotoStep(id)
            }
        }
    }
}
</script>

<style>

.btn-primary, .btn-danger, .btn-outline-primary, .btn-outline-danger{
    border-width: 2px;
}

.btn-outline-danger{
    color: #373A3C;
}

.btn-primary, .btn-primary:hover, .btn-outline-primary:hover  {
    background-color: #1B6CF3;
    border-color: #1B6CF3;
}

.btn-outline-primary {
    color: #373A3C;
    border-color: #1B6CF3;
}


.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .75);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.login-modal-container
{
    min-height: 29.1875rem;
}

.modal-container {
    width: 39.6875rem;
    margin: 0px auto;
    /* padding: 20px 30px; */
    background-color: #FCFCFE;
    border-radius: 5px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 1);
    transition: all .3s ease;
}
.modal-header {
    background-color: #fff;
    border-bottom: 2px solid #1B6CF3;
}

.modal-body {
    padding: 1.875rem;
}

.modal-default-button {
    padding: 0;
    float: right;
}

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.app, body{
    background-color: #fcfcfe;
}

.app-header {
    background-color: #fff;
    box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.05);
}

.app-footer {
    box-shadow: 0px -3px 10px 0px rgba(0, 0, 0, 0.05);
    background-color: #E9F4F4;
}

html,
body {
    height: 100%;
    font-family: 'Roboto', sans-serif;
    color: #373A3C;
}

html {
    font-size: 16px !important;
}

@media 
(-webkit-min-device-pixel-ratio: 1.15), 
(min-resolution: 110dpi){ 
    html{
        font-size: 12px !important;
    }
}

.menu-item{
    height: 8.75rem;
    width: 21.875rem;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.05);
    border: 2px solid #F1F1F5;
    cursor: pointer;
}

.menu-item:hover{
    border-color: #1B6CF3;
}

.step-item{
    width: 15.9375rem;
    height: 3.125rem;
    background-color: #F1F1F5;
    color: #8E959B;
    padding-left: 0.15rem; /* 0.1 ?*/
}

.step-item.active, .step-item.passed{
    color: #FFF;
    background-color: #1B6CF3;
    cursor: pointer;
}

.step-item.active{
    box-shadow: 0px 5px 15px 0px rgba(27, 18, 243, 0.25);
}

.active .step-item-number{
    color: #1B6CF3;
    font-weight: 700;
}

.step-item-number{
    font-size: 1.125rem;
    background-color: #fff;
    padding: 0.75rem;
}

.appoint-item-number{
    font-size: 1rem;
    background-color: #1B6CF3;
    padding: 0.75rem;
    color: #fff;
}

.step-item-title{
    font-size: 1rem;
}

.step-line{
    height: 3px; flex: 1; background: #F1F1F5;
}

.date-item{
    border: 2px solid #F1F1F5;
    cursor: pointer;
}

.date-item.active{
    border-color: #1B6CF3;
}

.spec-item{
    width: 21.875rem;
    height: 5rem;
    cursor: pointer;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.05);
    border: 2px solid #F1F1F5;
}

.spec-item.active{
    border-color: #1B6CF3;
}

.item-check-circle{
    margin-left: -0.75rem;
    visibility: hidden;
    background-color: #fff;
}

.active .item-check-circle{
    visibility: visible;
}

.spec-item-ticket{
    background-color: #1B6CF3;
    border-top-right-radius: .25rem;
    border-bottom-right-radius: .25rem;
    text-align: center;
    color: #fff;
}

.active .spec-item-ticket{
    border-radius: 0;
}

.doctor-item-fixed-height{
    height: 6.5625rem;
}

.doctor-item{
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.05);
    border: 1px solid #CACACE;
}

.doctor-item.active{
    border-color: #1B6CF3;
    box-shadow: 0px 5px 15px 0px rgba(27, 18, 243, 0.25);
}

.doctor-day-item{
    border-left: 1px solid #CACACE;
    cursor: pointer;
    width: 7.5rem;
}

.doctor-day-item.active{
    border-color: #1B6CF3;
    background-color: #1B6CF3;
    color: #fff;
}

.btn-light:not(:disabled):not(.disabled).active{
    border-color: #1B6CF3;
    background-color: #1B6CF3;
    color: #FFF;
    box-shadow: 0px 5px 15px 0px rgba(27, 18, 243, 0.25);
}

.day-item{
    width: 7.5rem;
    font-size: 1.25rem;
}

.active-inline-list-item{
    display: inline-block;
}
.active-inline-list-item::before {
    content: "● ";
    color: #1B6CF3;
}

.form-control{
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);
    border: 2px solid #F1F1F5;
}

.form-control::placeholder{
    color: #8E959B;
}

.form-control:focus{
    border-color: #1B6CF3;
}

.btn-light{
    font-size: 1.125rem;
    border: 2px solid #F1F1F5;
    /* box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.05); */
    background-color: #fff;
    color:#373A3C;
}

.btn-light:hover, .btn-secondary:hover{
    border-color: #1B6CF3;
    background-color: #1B6CF3;
    color: #fff;
    box-shadow: 0px 5px 10px 0px rgba(27, 18, 243, 0.25);
    box-shadow: #1B6CF3
}

.btn-light.timeslot-item:hover{
    background-color: #fff;
    color: inherit;
}

.btn-secondary{
    border: 2px solid #F1F1F5;
    background-color: #F1F1F5;
    color: #373A3C;
}

.btn-primary.disabled, .btn-primary:disabled {
    border-color: #8E959B;
    background-color: #F1F1F5;
    color: #8E959B;
}

.tooltip > .tooltip-inner { background-color: #fff; color: #8E959B;}
.tooltip-inner {
    color: #8E959B;
    background-color: #fff;
    border: 2px solid #F1F1F5;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.05);
}
.tooltip.bs-tooltip-auto[x-placement^=top] .arrow::before, .tooltip.bs-tooltip-top .arrow::before {
    border-top-color: #fff;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.05);
}

.tooltip.show {
    opacity: 1;
} 

.ddlist{
    position: absolute;
    border: 2px solid rgb(27, 108, 243);
    box-shadow: rgba(27, 18, 243, 0.15) 0px 2px 10px 0px;
    border-top: none;
    z-index: 99;
    top: 100%;
    left: 0;
    right: 0;
}

.ddlist div {
    font-size: 1.25rem;
    cursor: pointer;
    background-color: #fff;
    border-bottom: 1px solid #d4d4d4;
}

.ddlist div:hover, .ddlist div.active {
    background-color: #F1F1F5;
}

</style>