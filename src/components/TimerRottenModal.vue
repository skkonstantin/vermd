<template>
	<transition name="modal">
        <div class="modal-mask" tabindex="0" ref="modalTop">
            <div class="modal-wrapper">
            <div class="modal-container">
    
                <div class="modal-header align-items-center">
                    <h3>Время истекло</h3>
                    <button class="modal-default-button btn ml-auto" @click="$emit('exit-no-logout')">
                        <img
                            class="" height="26"
                            :src="'style/times-circle-solid-black.svg'">
                    </button>
                </div>
    
                <div class="modal-body d-flex justify-content-center flex-column" style="font-size:1.25rem;">
                    <strong>Время для подтверждения записи на прием истекло</strong>
                    <div class="d-flex justify-content-center mt-5">
                        <button
                            ref='ОкBtn'
                            @click="$emit('exit-no-logout')"
                            type="button" class="btn btn-primary btn-lg px-5 rounded-pill">Вернуться на главную страницу</button>
                        <button
                            ref='ОкBtn'
                            @click="$emit('exit-logout')"
                            type="button" class="btn btn-primary btn-lg px-5 rounded-pill ml-3">Выйти</button>
                    </div>
                </div>

            </div>
            </div>
        </div>
        </transition>
</template>

<script>
export default {
    props: ['isDebug', 'errorMsg'],
    data () {
        return {
            
        }
    },
    mounted : function () {
        if (this.$refs.ОкBtn) this.$refs.ОкBtn.focus()
            else this.$refs.modalTop.focus()
    },
    methods : {
        
    }
}
</script>