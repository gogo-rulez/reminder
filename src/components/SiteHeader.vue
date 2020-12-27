<template>
    <header class="header">

        <nav class="header__nav">

            <router-link
                :to="{ name: 'Home' }"
                exact>
                Početna
            </router-link>
            <router-link
                :to="{ name: 'ExpiringDrugs', params: { type: 'free' } }"
                exact>
                Lista besplatnih lijekova
            </router-link>
            <router-link
                :to="{ name: 'ExpiringDrugs', params: { type: 'payed' } }"
                exact>
                Lista plaćenih lijekova
            </router-link>

        </nav>

    </header>
</template>

<script>
export default {
    name: 'SiteHeader'
};
</script>
