<template>
    <header
        v-if="headerReady"
        class="header">

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

        <a
            role="button"
            class="header__logout_btn"
            @click="logoutUser()">Odjava</a>

    </header>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'SiteHeader',

    data () {
        return {
            headerReady: false
        };
    },

    mounted () {
        this.headerReady = true;
    },

    methods: {
        ...mapActions(['logoutUser'])
    }
};
</script>
