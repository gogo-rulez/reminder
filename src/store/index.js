import Vue from 'vue';
import Vuex from 'vuex';
import { database } from '@/mixins/firebaseMixin';

const patients = database.ref('/patients');

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        patientsInfo: {}
    },
    getters: {
        patientsDataFromStore: state => state.patientsInfo
    },
    mutations: {
        SAVE_PATIENT_INFO () {
            console.log('tu sam');
        },

        SAVE_PATIENT_DATA (state, data) {
            console.log('from save_patient_data', data);
            state.patientsInfo = data;
        }
    },
    actions: {
        getPatientsData ({ commit }) {
            return new Promise(resolve => {
                patients.once('value', snapshot => {
                    commit('SAVE_PATIENT_DATA', snapshot.val());
                    resolve(true);
                });
            });
        },

        getPatientDetails ({ state }, patientId) {

            // if there are is patients info in the state, get the data from there
            if (Object.keys(state.patientsInfo).length) {
                return state.patientsInfo[patientId];
            }

            // else, get the data from the database
            return new Promise(resolve => {
                patients.child(patientId).on('value', snapshot => {
                    resolve(snapshot.val());
                });
            });


        },

        savePatientInfo ({ dispatch }, patientData) {
            const {
                patientPinChanged, patientPin, patientName, drugs
            } = patientData;
            console.log('save patient entry');

            // eslint-disable-next-line no-new
            return new Promise((resolve, reject) => {

                patients.child(patientPin).once('value', data => {

                    // if patientPinChanged && data.exists is true, then we are trying to save to an existing entry
                    if (patientPinChanged && data.exists()) {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject(false);
                        return;
                    }

                    patients.child(`${patientPin}/info`).set({
                        patientName,
                        patientPin
                    });

                    console.log({ drugs });

                    drugs.forEach(drug => {
                        console.log('from foreach loop', drug.drugAtUserExpense);
                        patients.child(`${patientPin}/drugs/${drug.drugName}`).set({
                            drugName: drug.drugName,
                            drugAmount: drug.drugAmount,
                            drugDailyDose: drug.drugDailyDose,
                            drugPickupDate: drug.drugPickupDate,
                            drugAtUserExpense: drug.drugAtUserExpense
                        });
                    });

                    resolve(true);
                    dispatch('getPatientsData');

                });

            });


        },

        deletePatientEntry ({ dispatch }, objData) {
            console.log('delete patient entry');
            patients.child(`${objData.patientId}`).remove();

            if (!objData.getData) return;

            dispatch('getPatientsData');
        },

        deleteDrugEntry ({ dispatch }, info) {

            return new Promise(resolve => {

                patients.child(`${info.patientPin}/drugs/${info.drugName}`)
                    .remove()
                    .then(async () => {
                        await dispatch('getPatientsData').then(() => resolve(true));
                    });

            });

        }
    },
    modules: {
    },
});
