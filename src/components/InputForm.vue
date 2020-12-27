<template>
    <form class="form">

        <div class="form__group">
            <div class="form__row">

                <label
                    for="patient-name"
                    class="form__label">Ime pacijenta</label>
                <input
                    v-model="patientName"
                    type="text"
                    class="form__input"
                    name="patient-name"
                    id="patient-name">

            </div>

            <div class="form__row">

                <label
                    for="patient-pin"
                    class="form__label">OIB pacijenta</label>
                <input
                    v-model="patientPin"
                    type="text"
                    class="form__input"
                    :class="{'has-error': userWithPinExists}"
                    name="patient-pin"
                    id="patient-pin">
                <span
                    v-if="userWithPinExists"
                    class="form__input_error">Korisnik s ovim OIB-om već postoji</span>

            </div>

            <div class="form__row">
                <label
                    for="patient-doctor-name"
                    class="form__label">
                    Ime doktora
                </label>
                <input
                    v-model="patientDoctorName"
                    type="text"
                    class="form__input"
                    name="patient-doctor-name"
                    id="patient-doctor-name">
            </div>

            <div class="form__row">
                <label
                    for="patient-doctor-contact"
                    class="form__label">
                    Kontakt doktora
                </label>
                <input
                    v-model="patientDoctorContact"
                    type="text"
                    class="form__input"
                    name="patient-doctor-contact"
                    id="patient-doctor-contact">
            </div>

        </div>

        <template v-for="i in numberOfDrugs">

            <form-group
                :key="`${patientName}_drug_number_${i}`"
                :iterator="i"
                :existing-drug="drugs[i-1]"
                @drugInfo="saveDrugData($event, i)"
                @deleteDrug="deleteDrugEntryHandler($event)"
            ></form-group>

        </template>

        <div class="form__submit_wrap">

            <a
                role="button"
                class="form__add_more_btn"
                @click="numberOfDrugs++"
            >
                Dodaj lijek
            </a>

            <a
                role="button"
                class="form__save_info_btn"
                @click="sendPatientInfo()"
            >
                Spremi podatke
            </a>

            <router-link
                :to="{ name: 'Home' }"
                class="form__back_btn">
                Povratak na listu
            </router-link>

        </div>

    </form>
</template>

<script>
import { mapActions } from 'vuex';
import FormGroup from '@/components/FormGroup';

export default {
    name: 'InputForm',

    components: {
        FormGroup
    },

    data () {
        return {
            patientName: '',
            patientPin: '',
            patientDoctorName: '',
            patientDoctorContact: '',
            numberOfDrugs: 0,
            drugs: [],
            existingPatient: false,
            existingPatientPin: '',
            userWithPinExists: false,
            patientDetails: {}
        };
    },

    mounted () {
        if (this.$route.params.id) {
            this.getPatientInfo();
            this.existingPatient = true;
        }
    },

    methods: {
        ...mapActions(['savePatientInfo', 'getPatientDetails', 'deletePatientEntry', 'deleteDrugEntry']),

        async deleteDrugEntryHandler (drugName) {

            // remove the drug from this. drugs, and reduce the numberOfDrugs
            // check if the drug is saved in patientDetails (is in database)
            // if it is, remove it from the database also

            const drugIndex = this.drugs.findIndex(x => x.name === drugName);
            this.drugs.splice(drugIndex, 1);
            this.numberOfDrugs--;

            if (!this.patientDetails.drugs) return;

            const patientDetailsDrugs = Object.keys(this.patientDetails.drugs);

            console.log({ patientDetailsDrugs });


            if (!patientDetailsDrugs.find(x => x === drugName)) return;

            console.log('lijek je spremljen u bazu, sad će biti izbrisan iz baze');

            const obj = {
                patientPin: this.patientPin,
                drugName
            };
            const $this = this;

            await this.deleteDrugEntry(obj).then(val => {
                console.log('val je ', val);
                $this.getPatientInfo();
            });

        },

        async getPatientInfo () {
            this.patientDetails = await this.getPatientDetails(this.$route.params.id).then(val => val);

            if (!this.patientDetails) return;
            console.log('evo me', this.patientDetails);

            this.numberOfDrugs = this.patientDetails.drugs ? Object.keys(this.patientDetails.drugs).length : 0;
            this.patientName = this.patientDetails.info.patientName;
            this.patientPin = this.patientDetails.info.patientPin;
            this.patientDoctorName = this.patientDetails.info.patientDoctorName;
            this.patientDoctorContact = this.patientDetails.info.patientDoctorContact;
            this.existingPatientPin = this.patientDetails.info.patientPin;
            this.drugs = [];
            const $this = this;

            if (!this.patientDetails.drugs) {
                return;
            }

            console.log(Object.values(this.patientDetails.drugs));

            Object.values(this.patientDetails.drugs).forEach(drug => {
                $this.drugs.push(drug);
            });
        },

        async sendPatientInfo () {
            const patientData = {
                patientPinChanged: this.existingPatientPin !== this.patientPin,
                patientPin: this.patientPin,
                patientName: this.patientName,
                patientDoctorName: this.patientDoctorName,
                patientDoctorContact: this.patientDoctorContact,
                drugs: this.drugs
            };

            console.log(patientData.drugs);

            // if this is an existing user, and for some reason the patientPin changes
            // delete this user with the old existingPatientPin
            // and save user with new patientPin
            if (this.existingPatient && this.existingPatientPin !== this.patientPin) {
                const obj = {
                    patientId: this.existingPatientPin,
                    getData: false
                };
                await this.deletePatientEntry(obj);
            }

            const dataSaved = await this.savePatientInfo(patientData).then(val => val).catch(val => val);

            console.log({ dataSaved });

            // if the data wasn't saved, it means that the there already exists a database entry with the current patientPin
            if (!dataSaved) {
                this.userWithPinExists = true;
                return;
            }

            this.userWithPinExists = false;

            if (this.$route.params.id === this.patientPin) {
                this.getPatientInfo();
                return;
            }

            this.existingPatient = true;

            this.$router.push({ name: 'PatientDetail', params: { id: this.patientPin } });
            this.getPatientInfo();
        },

        saveDrugData (drugData, i) {
            this.drugs[i - 1] = drugData;
            console.log(' drugs', this.drugs);
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
