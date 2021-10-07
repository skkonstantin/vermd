<template>
    <div 
        v-if="appoints.length > 0 && step < 4" class="my-3" style="font-size: 1.125rem; box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.05); border: 2px solid #F1F1F5; background-color: #fff;">
        <ul class="list-group list-group-flush px-3">
            <li v-for="(appoint, index) in appoints"
                :key="index"
                class="list-group-item row px-1 py-1 d-flex">
                <div class="col-4 d-flex align-items-center"><span class="appoint-item-number rounded-pill mr-2" style="padding: 0.01rem 0.5rem;">{{ index + 1 }}</span>{{ appoint.speciality.title }}</div>
                <div class="col">{{ (appoint.doctor.ID === -1) ? appoint.speciality.week.short : appoint.doctor.shortname }}</div>
                <div class="col">{{ (appoint.day.ID === -1) ? '' : appoint.day.dat }}</div>
                <div class="col">{{ (appoint.timeslot.iTime === -1) ? '' : appoint.timeslot.wtime }}</div>
                <div class="col-1 text-right"
                    @click="$emit('remove-appoint', index)">
                    <img
                        style="vertical-align: middle;"
                        class="" height="21"
                        :src="'style/times-circle-solid.svg'">
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    props: ['appoints', 'step'],
    computed: {

    },
    methods: {
        
    }
}
</script>