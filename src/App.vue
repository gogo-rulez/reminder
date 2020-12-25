<template>
    <div
        id="app"
        class="site_wrap">
        <site-header></site-header>
        <router-view/>
    </div>
</template>

<script>
import SiteHeader from '@/components/SiteHeader';

export default {
    name: 'App',

    components: {
        SiteHeader
    }
};
</script>

<style lang="scss">
@import "@/assets/scss/styles";
</style>
