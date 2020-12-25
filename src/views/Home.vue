<template>
    <div class="home">
        <patients-list
            v-if="patientsDataReady"
            :patients-data="patientsDataFromStore || {}"
        ></patients-list>

        <div class="home__buttons_wrap">
            <router-link
                :to="{ name: 'PatientDetail' }"
                class="home__add_patient_btn">
                Dodaj pacijenta
            </router-link>
            <router-link
                :to="{ name: 'ExpiringDrugs' }"
                class="home__view_list_btn">
                Lista lijekova
            </router-link>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapGetters } from 'vuex';
import PatientsList from '@/components/PatientsList';

export default {
    name: 'Home',
    components: {
        PatientsList
    },
    data () {
        return {
            patients: [],
            patientsDataReady: false,
        };
    },
    computed: {
        ...mapGetters(['patientsDataFromStore']),
    },
    watch: {
    },
    mounted () {
        this.getPatientsData();

        setTimeout(() => {
            this.patientsDataReady = true;
        }, 0);
    },
    methods: {
        ...mapActions(['getPatientsData']),
    }
};
</script>
