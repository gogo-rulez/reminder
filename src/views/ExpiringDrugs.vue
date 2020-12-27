<template>
    <div
        v-if="dataReady"
        class="expiring_drugs">

        <expiring-list :expiring-drugs="expiringDrugs"></expiring-list>

    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ExpiringList from '@/components/ExpiringList';

export default {
    name: 'ExpiringDrugs',

    components: {
        ExpiringList
    },

    data () {
        return {
            expiringDrugs: {},
            dataReady: false
        };
    },

    computed: {
        ...mapGetters(['patientsDataFromStore'])
    },

    watch: {
        $route () {
            console.log('route changed');
            this.getExpiringDrugs();
        }
    },

    mounted () {
        this.getExpiringDrugs();
    },

    methods: {

        ...mapActions(['getPatientsData']),

        async getExpiringDrugs () {

            this.expiringDrugs = {};
            this.dataReady = false;

            if (!Object.keys(this.patientsDataFromStore).length) {
                await this.getPatientsData();
            }

            const data = this.patientsDataFromStore;
            const dataKeys = Object.keys(data);
            const dataValues = Object.values(data);
            const currentTimestamp = new Date().getTime();
            let expiringDrugs = {};

            console.log(dataKeys);
            console.log(dataValues);

            dataValues.forEach(entry => {

                if (!entry.drugs) return;

                const entryValues = Object.values(entry.drugs);

                expiringDrugs = entryValues.filter(x => {

                    const atUserExpense = this.$route.params.type === 'payed';
                    console.log(atUserExpense);

                    if (x.drugAtUserExpense !== atUserExpense) return;

                    const nextPickupTimestamp = new Date(x.drugNextPickupDate).getTime();
                    const difference = nextPickupTimestamp - currentTimestamp;
                    const expiresInDays = difference / (24 * 60 * 60 * 1000);

                    if (expiresInDays > 4) return;

                    return x;

                });

                console.log(entry.info.patientName, expiringDrugs);

                if (!expiringDrugs.length) return;

                console.log(this.expiringDrugs[entry.info.patientDoctorName]);

                if (!this.expiringDrugs[entry.info.patientDoctorName]) {
                    this.expiringDrugs[entry.info.patientDoctorName] = {};
                }

                this.expiringDrugs[entry.info.patientDoctorName][entry.info.patientName] = {
                    info: {
                        patientName: entry.info.patientName,
                        patientPin: entry.info.patientPin
                    },
                    drugs: expiringDrugs

                };

                // this.expiringDrugs[entry.info.patientName] = expiringDrugs;

            });

            this.dataReady = true;
        }

    }
};
</script>
