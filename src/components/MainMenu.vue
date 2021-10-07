<template>
	<div>
        <h3 class="text-center my-5">ЭЛЕКТРОННАЯ РЕГИСТРАТУРА<br/>ФГБУЗ МСЧ№170 ФМБА России</h3>
        <div class="d-flex flex-wrap justify-content-between">
            <div v-for="item in staticConfig.menuItems"
                :key="item.id"
                @click="$emit('menu-item-clicked', item)"
                class="menu-item bg-white mb-4 rounded d-flex align-items-center justify-content-center text-center">
                <div style="font-size: 1.5rem;" v-html="item.title"></div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ['staticConfig']
}
</script>