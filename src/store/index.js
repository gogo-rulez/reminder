import Vue from 'vue';
import Vuex from 'vuex';
import { database, auth, authSettings } from '@/mixins/firebaseMixin';

const patients = database.ref('/patients');

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        patientsInfo: {},
        username: '',
        isAuthenticated: false
    },
    getters: {
        patientsDataFromStore: state => state.patientsInfo,
        isAuthenticated: state => state.isAuthenticated
    },
    mutations: {
        SAVE_PATIENT_INFO () {
            console.log('tu sam');
        },

        SAVE_PATIENT_DATA (state, data) {
            console.log('from save_patient_data', data);
            state.patientsInfo = data;
        },

        LOGIN_USER (state, data) {
            console.log('data', data);
            state.isAuthenticated = true;
            state.username = data.email;
        },

        LOGOUT_USER (state) {
            state.isAuthenticated = false;
            state.username = '';
        }
    },
    actions: {

        checkAuthentication ({ commit }) {
            return new Promise((resolve, reject) => {
                auth.onAuthStateChanged(user => {
                    if (user) {
                        commit('LOGIN_USER', user);
                        resolve(true);
                    } else {
                        console.log('user signed out');
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject(false);
                    }
                });

            });
        },

        loginUser ({ commit }, data) {
            console.log(auth);
            auth.setPersistence(authSettings.Auth.Persistence.SESSION)
                .then(() => auth.signInWithEmailAndPassword(data.username, data.password)
                    .then(user => {
                        commit('LOGIN_USER', user);
                        console.log('user', user);
                    })
                    .catch(error => {
                        console.log('error', error);
                    }));
        },

        logoutUser ({ commit }) {
            auth.signOut()
                .then (() => {
                    commit('LOGOUT_USER');
                });
        },

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
                patientPinChanged, patientPin, patientName, patientDoctorContact, patientDoctorName, drugs
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
                        patientPin,
                        patientDoctorName,
                        patientDoctorContact
                    });

                    console.log({ drugs });

                    drugs.forEach(drug => {
                        console.log('from foreach loop', drug);
                        patients.child(`${patientPin}/drugs/${drug.drugName}`).set({
                            drugName: drug.drugName,
                            drugAmount: drug.drugAmount,
                            drugDailyDose: drug.drugDailyDose,
                            drugPickupDate: drug.drugPickupDate,
                            drugNextPickupDate: drug.drugNextPickupDate,
                            drugAtUserExpense: drug.drugAtUserExpense
                        });
                    });

                    dispatch('getPatientsData').then(() => resolve(true));

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

                // delete drug entry
                // wait for data to be collected
                // resolve promise

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
