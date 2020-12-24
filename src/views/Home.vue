<template>
    <div class="home">
        <patients-list
            v-if="patientsDataReady"
            :patients-data="patientsDataFromStore || {}"
        ></patients-list>
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
