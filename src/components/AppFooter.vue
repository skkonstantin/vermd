<template>
	<footer
        class="app-footer mt-auto"
        v-html="staticConfig.footerHTML">
    </footer>
</template>

<script>

export default {
    props: ['staticConfig']
}
</script>