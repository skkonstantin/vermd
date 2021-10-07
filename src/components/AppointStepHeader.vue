<template>
	<div class="step-header">
        <h3 class="text-center my-4">ЗАПИСЬ К ВРАЧУ</h3>
        <div class="d-flex align-items-center">
            <template v-for="(step, index) in steps">
                <div :key="step.id"
                    :class="'step-item' + ($route.path.substr(1) === ('step' + step.id.toString()) ? ' active' : '') + ((parseInt($route.path.substr(1).charAt(4)) > step.id) ? ' passed' : '') + ' btn btn-lg rounded-pill text-left'"
                    @click="$emit('step-item-clicked', step.id)"
                    :style="((parseInt($route.path.substr(1).charAt(4)) > step.id) ? 'padding-left: 0.5rem;' : '')">
                    <img
                        v-if="(parseInt($route.path.substr(1).charAt(4)) > step.id)"
                        style="vertical-align: sub;"
                        class="" height="32"
                        :src="'style/check-circle-solid-white.svg'">
                    <span class="step-item-number rounded-pill" v-else >{{ step.number }}</span>
                    <span class="step-item-title" :style="(parseInt($route.path.substr(1).charAt(4)) > step.id) ? 'vertical-align: super;' : ''">{{step.title}}</span>
                </div>
                <div v-if="index !== steps.length - 1" class="step-line" :style="((parseInt($route.path.substr(1).charAt(4)) > step.id) ? 'background-color: #1B6CF3;' : '')"></div>
            </template>
        </div>
    </div>
</template>

<script>

export default {
    props: ['steps', 'state'],
    data () {
        return {
            
        }
    },
    created: function () {

    },
    computed: {
        
    },
    methods: {
        
    }
}
</script>