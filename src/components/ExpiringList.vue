<template>
    <ul class="expiring_list">
        <li
            v-for="entry in expiringDrugs"
            :key="entry.info.patientPin"
            class="expiring_list__item">

            <p class="expiring_list__patient_name">
                <router-link :to="{ name: 'PatientDetail', params: {id: entry.info.patientPin} }">
                    {{ entry.info.patientName }} - {{ entry.info.patientPin }}
                </router-link>
            </p>

            <div
                v-for="drug in entry.drugs"
                :key="`${drug.patientPin}-${drug.drugName}`"
                class="expiring_list__drugs_info">

                <p><span>Naziv lijeka:</span> {{ drug.drugName }}</p>
                <p><span>Istek lijeka:</span> {{ formatDate(drug.drugNextPickupDate) }}</p>
                <p><span>Lijek se plaća:</span> {{ drug.drugAtUserExpense ? 'Da' : 'Ne' }}</p>

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
