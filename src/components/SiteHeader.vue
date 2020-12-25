<template>
    <header class="header">

        <nav class="header__nav">

            <router-link
                :to="{ name: 'Home' }"
                exact>
                Početna
            </router-link>
            <router-link
                :to="{ name: 'ExpiringDrugs' }"
                exact>
                Lista za narudžbu
            </router-link>

        </nav>

    </header>
</template>

<script>
export default {
    name: 'SiteHeader'
};
</script>
