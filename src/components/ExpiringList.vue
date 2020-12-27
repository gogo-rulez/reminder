<template>
    <ul class="expiring_list">
        <li
            v-for="(entry, name) in expiringDrugs"
            :key="name"
            class="expiring_list__item">

            <h3 class="expiring_list__doctor_name">{{ name }}</h3>

            <div
                v-for="patient in entry"
                :key="patient.info.patientPin"
                class="expiring_list__patient">

                <p class="expiring_list__patient_name">
                    <router-link :to="{ name: 'PatientDetail', params: {id: patient.info.patientPin} }">
                        {{ patient.info.patientName }} - {{ patient.info.patientPin }}
                    </router-link>
                </p>

                <div
                    v-for="drug in patient.drugs"
                    :key="`${drug.patientPin}-${drug.drugName}`"
                    class="expiring_list__drugs_info">

                    <p><span>Naziv lijeka:</span> {{ drug.drugName }}</p>
                    <p><span>Istek lijeka:</span> {{ formatDate(drug.drugNextPickupDate) }}</p>
                    <p><span>Lijek se plaća:</span> {{ drug.drugAtUserExpense ? 'Da' : 'Ne' }}</p>

                </div>

            </div>


        </li>
    </ul>
</template>

<script>
export default {
    name: 'ExpiringList',
    props: {
        expiringDrugs: {
            type: Object,
            required: true
        }
    },

    methods: {

        formatDate (date) {

            if (!date) return;

            const dateArray = date.split('-');

            [dateArray[0], dateArray[2]] = [dateArray[2], dateArray[0]];

            return dateArray.join('.');

        },
    }
};
</script>
