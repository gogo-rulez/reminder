<template>
    <div
        id="app"
        v-if="pageReady"
        class="site_wrap">

        <template v-if="isAuthenticated">
            <site-header></site-header>
            <router-view/>
        </template>

        <div
            v-else
            class="modal modal--login">

            <div class="modal__header">
                <p class="modal__title">Prijava</p>
            </div>
            <form class="modal__form">

                <div class="modal__form_row">
                    <label
                        for="username"
                        class="modal__form_label">Korisničko ime/email</label>
                    <input
                        v-model="user.username"
                        type="text"
                        class="modal__form_input"
                        nam="username"
                        id="username">
                </div>

                <div class="modal__form_row">
                    <label
                        for="password"
                        class="modal__form_label">Lozinka</label>
                    <input
                        v-model="user.password"
                        type="text"
                        class="modal__form_input"
                        name="password"
                        id="password">
                </div>

                <div class="modal__form_row">
                    <a
                        role="button"
                        class="modal__form_submit_btn"
                        @click="loginUser({username: user.username, password: user.password})">
                        Prijava
                    </a>
                </div>

            </form>

        </div>

    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SiteHeader from '@/components/SiteHeader';

export default {
    name: 'App',

    data () {
        return {
            pageReady: false,
            user: {
                username: '',
                password: ''
            }
        };
    },

    components: {
        SiteHeader
    },

    computed: {
        ...mapGetters(['isAuthenticated'])
    },

    mounted () {
        this.checkAuthentication()
            .then(() => {
                this.pageReady = true;
            })
            .catch (() => {
                this.pageReady = true;
            });
    },

    methods: {
        ...mapActions(['loginUser', 'checkAuthentication'])
    }
};
</script>

<style lang="scss">
@import "@/assets/scss/styles";
</style>
