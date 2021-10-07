<template>
	<transition name="modal">
        <div class="modal-mask" tabindex="0" ref="modalTop">
            <div class="modal-wrapper">
            <div class="modal-container login-modal-container">
    
                <div class="modal-header align-items-center">
                    <h3 name="header" class="m-0">Авторизация</h3>
                    <button class="modal-default-button btn ml-auto" @click="$emit('close')">
                        <img
                            class="" height="26"
                            :src="'style/times-circle-solid-black.svg'">
                    </button>
                </div>
    
                <div class="modal-body d-flex justify-content-center" style="font-size:1.25rem;">
                    <form v-on:submit.prevent="login" class="w-100">
                        <div class="form-group" style="margin-bottom: 2.375rem;">
                            <label for="userId">Номер пропуска, полис ДМС или номер направления</label>
                            <input ref='userId' v-model="userId" name="userId" placeholder="12345" autocomplete="off" class="form-control form-control-lg text-center" />
                        </div>
                        <div class="form-group">
                            <label for="userId">Дата рождения</label>
                            <div class="input-group text-center">
                                <input ref='birthDay' v-model="birthDay" placeholder="День" autocomplete="off" class="form-control form-control-lg text-center"
                                    :class="(parseInt(birthDay) < 1 || parseInt(birthDay) > 31) ? 'is-invalid' : ''" @focusout="completeDay" @input="verifyBirthDay"/>
                                <input ref='birthMonth' v-model="birthMonth" placeholder="Месяц" autocomplete="off" class="form-control form-control-lg text-center"
                                    :class="(parseInt(birthMonth) < 1 || parseInt(birthMonth) > 12) ? 'is-invalid' : ''" @focusout="completeMonth" @input="verifyBirthMonth"/>
                                <input ref='birthYear' v-model="birthYear" placeholder="Год" autocomplete="off" class="form-control form-control-lg text-center"
                                    :class="(parseInt(birthYear) < 1900 || parseInt(birthYear) > (new Date()).getFullYear().toString()) ? 'is-invalid' : ''" @input="verifyBirthYear" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-center mt-5">
                            <button ref="submitBtn" type="submit" class="btn btn-primary btn-lg px-5 rounded-pill" style="min-width: 15.9375rem;">Войти</button>
                        </div>
                        <div v-if="isError" class="alert alert-danger mt-5">{{ errorMsg }}</div>
                    </form>
                </div>

            </div>
            </div>
        </div>
        </transition>
</template>

<script>
export default {
    props: ['title', 'isDebug'],
    data () {
        return {
            userId : "",
            birthDay : "",
            birthMonth : "",
            birthYear : "",
            info : "",
            info1 : "",
            isError : false,
            errorMsg : ""
        }
    },
    watch: {
        // userId: function (newval, oldval) {
        //     if (newval.length === 5){
        //         this.trySetFocus()
        //     }
        // }
    },
    mounted : function () {
        // if (this.isDebug)
        // {
            // this.userId = "2565.12"
            // this.birthDay = "12"
            // this.birthMonth = "08"
            // this.birthYear = "1963"
        // }
        if (this.$refs.userId) this.$refs.userId.focus()
            else this.$refs.modalTop.focus()
    },
    methods : {
        verifyBirthDay: function () {
            this.birthDay = this.birthDay.replace(/\D/g,'')
            var val = this.birthDay
            if (val.length === 2 || (val.length === 1 && 3 < parseInt(val) && parseInt(val) < 10)){
                this.trySetFocus()
            }
            else if (val.length > 2)
            {
                this.birthDay = val.substr(0,2)
            }
        },
        verifyBirthMonth: function () {
            this.birthMonth = this.birthMonth.replace(/\D/g,'')
            var val = this.birthMonth
            if (val.length === 2 || (val.length === 1 && 1 < parseInt(val) && parseInt(val) < 10)){
                this.trySetFocus()
            }
            else if (val.length > 2)
            {
                this.birthMonth = val.substr(0,2)
            }
        },
        verifyBirthYear: function () {
            this.birthYear = this.birthYear.replace(/\D/g,'')
            var val = this.birthYear
            if (val.length === 4){
                this.trySetFocus()
            }
            else if (val.length > 4)
            {
                this.birthYear = val.substr(0,4)
            }
        },
        completeDay : function(){
            this.birthDay = this.get2DigitVal(this.birthDay)
        },
        completeMonth : function(){
            this.birthMonth = this.get2DigitVal(this.birthMonth)
        },
        get2DigitVal: function (v) {
            return ((0 < parseInt(v) && parseInt(v) < 10 && v.length === 1) ? '0' : '') + v
        },
        trySetFocus: function(){
            console.log('trySetFocus')
            if (this.birthDay.length === 2 || (this.birthDay.length === 1 && 3 < parseInt(this.birthDay) && parseInt(this.birthDay) < 10)){
                if (this.birthMonth.length === 2 || (this.birthMonth.length === 1 && 1 < parseInt(this.birthMonth) && parseInt(this.birthMonth) < 10)){
                    if (this.birthYear.length === 4){
                        if (this.userId.length > 0){
                            this.login()
                        }
                    }
                    else if (this.$refs.birthYear)
                    {
                        this.$refs.birthYear.focus()
                    }
                }
                else if (this.$refs.birthMonth)
                {
                    this.$refs.birthMonth.focus()
                }
            }
            else if (this.$refs.birthDay)
            {
                this.$refs.birthDay.focus()
            }
        },
        onLoginOK : function (res) {
            this.$emit('login', res)
        },
        onLoginError : function (msg) {
            this.isError = true
            this.errorMsg = msg
        },
        login : function () {
            this.$emit('api-call', 'Login' + '&user=' + this.userId + '&dd=' + this.birthDay + '&mm=' + this.birthMonth + '&yy=' + this.birthYear, 'onLoginOK')
        }
    }
}
</script>