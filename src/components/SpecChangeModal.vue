<template>
	<transition name="modal">
        <div class="modal-mask" tabindex="0" ref="modalTop">
            <div class="modal-wrapper">
            <div class="modal-container">
    
                <div class="modal-header align-items-center">
                    <span>&nbsp;</span>
                    <span style="font-size: 1.75rem;">Добавить {{ getFormatedName(specToAdd.title.toLowerCase()) }} в запись?</span>
                    <button class="modal-default-button btn" @click="$emit('close')">
                        <img
                            class="" height="26"
                            :src="'style/times-circle-solid-black.svg'">
                    </button>
                </div>
    
                <div class="modal-body d-flex justify-content-center flex-column" style="font-size:1.25rem;">
                    <span class="text-center mb-4" style="font-size: 1.25rem;">Извините, ограничение выбора.<br />Для добавления новой специальности,<br />необходимо заменить ранее выбранную:</span>
                    <ul class="list-group list-group-flush" style="font-size: 1.125rem;">
                        <li v-for="(appoint, index) in appoints"
                            :key="appoint.id"
                            class="list-group-item d-flex align-items-center py-2 px-0"
                            style="background-color: transparent;"
                            :style="((index === 0) ? 'border-top: none; ': '') + ((index === appoints.length - 1) ? 'border-bottom: none; ' : '')">
                            <div class="mr-auto">{{ (index + 1) + '. ' + formatSpecTitle(appoint.speciality.title) }}</div>
                            <div class="">{{ (appoint.doctor.ID === -1) ? appoint.speciality.week.short : appoint.doctor.name }}</div>
                            <div class="ml-5">
                                <button
                                @click="$emit('change-spec', index)"
                                class="btn btn-outline-danger rounded-pill"
                                style="min-width: 10rem; font-size: 1.125rem; line-height: 1.375rem;">Заменить</button>
                            </div>
                        </li>
                    </ul>
                    <div class="d-flex justify-content-center mt-4">
                        <button
                            ref='ОкBtn'
                            @click="$emit('close')"
                            type="button" class="btn btn-outline-primary rounded-pill" style="min-width: 10rem; font-size: 1.125rem; line-height: 1.375rem;">Отмена</button>
                    </div>
                </div>

            </div>
            </div>
        </div>
        </transition>
</template>

<script>
export default {
    props: ['specToAdd', 'appoints'],
    data () {
        return {

        }
    },
    mounted : function () {
        if (this.$refs.ОкBtn) this.$refs.ОкBtn.focus()
            else this.$refs.modalTop.focus()
    },
    methods : {
        getFormatedName: function (v){
            var o = v[v.length - 1].toLowerCase()
            var postfix = (o === 'а' || o === 'у' || o === 'о' || o === 'и' || o === 'э' || o === 'ю' || o === 'я' || o === 'ё' || o === 'ы') ? '' : 'а'
            return v + postfix
        },
        formatSpecTitle(title){
            return title.charAt(0).toUpperCase() + title.substr(1).toLowerCase()
        }
    }
}
</script>