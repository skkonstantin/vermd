<template>
	<transition name="modal">
        <div class="modal-mask" tabindex="0" ref="modalTop">
            <div class="modal-wrapper">
            <div class="modal-container">
    
                <div class="modal-header align-items-center">
                    <h3>Подтвердите действие</h3>
                    <button class="modal-default-button btn ml-auto" @click="$emit('close')">
                        <img
                            class="" height="26"
                            :src="'style/times-circle-solid-black.svg'">
                    </button>
                </div>
    
                <div class="modal-body d-flex justify-content-center flex-column" style="font-size:1.25rem;">
                    <div class="text-center">
                        Удалить данные о записи к<br />
                        {{ getFormatedName(appointToRemove) }},<br />
                        на {{ appointToRemove.appCDate.substring(0, appointToRemove.appCDate.indexOf("-")) }}?
                    </div>
                    <div class="d-flex justify-content-center mt-5">
                        <button
                            ref='RemoveBtn'
                            @click="$emit('confirm-appoint-removal', appointToRemoveIndex)"
                            type="button" class="btn btn-outline-danger btn-lg px-5 rounded-pill">Удалить</button>
                        <button
                            ref='CancelBtn'
                            @click="$emit('close')"
                            type="button" class="btn btn-outline-primary btn-lg px-5 rounded-pill ml-3">Отмена</button>
                    </div>
                </div>

            </div>
            </div>
        </div>
        </transition>
</template>

<script>
export default {
    props: ['isDebug', 'errorMsg', 'appointToRemove', 'appointToRemoveIndex'],
    data () {
        return {
            
        }
    },
    mounted : function () {
        if (this.$refs.RemoveBtn) this.$refs.RemoveBtn.focus()
            else this.$refs.modalTop.focus()
    },
    methods : {
        getFormatedName: function (appointToRemove){
            var t = appointToRemove.speciality.title
            var o = t[t.length - 1].toLowerCase()
            var postfix = (o === 'а' || o === 'у' || o === 'о' || o === 'и' || o === 'э' || o === 'ю' || o === 'я' || o === 'ё' || o === 'ы') ? '' : 'у'
            return appointToRemove.speciality.title.toLowerCase() + postfix + ((appointToRemove.doctor.ID === -1) ? '' : ' ' + appointToRemove.doctor.shortname)
        }
    }
}
</script>