<template>
	<header class="app-header">
        <div class="container d-flex justify-content-between align-items-center" style="height: 6.25rem;">
            <div
                v-html="staticConfig.headerHTML1">
            </div>
            <div
                v-html="staticConfig.headerHTML2">
            </div>
            <div
                v-html="staticConfig.headerHTML3">
            </div>
            <div class="border px-3 py-1 text-center rounded">
                <div class="border-bottom" style="font-size: 1.125rem;">{{ getTime }}</div>
                <div class="">{{ getDate }}</div>
            </div>
        </div>
    </header>
</template>

<script>

export default {
    props: ['staticConfig'],
    data () {
        return {
            timeOut: null,
            now: new Date(),
        }
    },
    created: function () {
        var vm = this
        this.timeOut = window.setInterval(function () {
            vm.now = new Date()
        }, 60 * 1000)
    },
    computed: {
        getTime: function () {
            return this.get2DigitVal(this.now.getHours()) + ":" + this.get2DigitVal(this.now.getMinutes())
        },
        getDate: function () {
            return this.get2DigitVal(this.now.getDate()) + "." + this.get2DigitVal(this.now.getMonth() + 1) + "." + this.now.getFullYear()
        }
    },
    methods: {
        get2DigitVal: function (v) {
            return (v < 10 ? '0' + v : '' + v);
        }
    },
    beforeDestroy: function () {
        window.clearInterval(this.timeOut)
    }
}
</script>