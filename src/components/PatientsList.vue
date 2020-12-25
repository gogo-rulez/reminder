<template>
    <ul
        class="patients_list">
        <li
            v-for="entry in patientsData"
            :key="entry.info.patientPin"
            class="patients_list__item">
            <router-link :to="{ name: 'PatientDetail', params: { id: entry.info.patientPin} }">
                {{ entry.info.patientName }}
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'PatientsList',
    props: {
        patientsData: {
            type: Object,
            required: true
        }
    }
};
</script>
