<template>
    <div
        class="form__group">

        <div class="form__row">
            <label
                :for="`drug-${iterator}-name`"
                class="form__label">Naziv lijeka</label>
            <input
                v-model="drugData.drugName"
                type="text"
                class="form__input"
                :name="`drug-${iterator}-name`"
                :id="`drug-${iterator}-name`">
        </div>

        <div class="form__row">
            <label
                :for="`drug-${iterator}-amount-in-package`"
                class="form__label">Broj tableta</label>
            <input
                v-model="drugData.drugAmount"
                type="text"
                class="form__input"
                :name="`drug-${iterator}-amount-in-package`"
                :id="`drug-${iterator}-amount-in-package`">
        </div>

        <div class="form__row">
            <label
                :for="`drug-${iterator}-prescription_amount`"
                class="form__label">Dnevna doza</label>
            <input
                v-model="drugData.drugDailyDose"
                type="text"
                class="form__input"
                :name="`drug-${iterator}-prescription_amount`"
                :id="`drug-${iterator}-prescription_amount`">
        </div>

        <div class="form__row">
            <label
                :for="`drug-${iterator}-last_pickup_date`"
                class="form__label">Zadnje podizanje</label>
            <input
                v-model="drugData.drugPickupDate"
                type="date"
                class="form__input"
                :name="`drug-${iterator}-last_pickup_date`"
                :id="`drug-${iterator}-last_pickup_date`">
        </div>

        <div class="form__row">
            <label
                :for="`drug-${iterator}-users-expense`"
                class="form__label">
                <input
                    v-model="drugData.drugAtUserExpense"
                    type="checkbox"
                    class="form__checkbox"
                    :name="`drug-${iterator}-users-expense`"
                    @input="drugData.drugAtUserExpense = !drugData.drugAtUserExpense"
                    :id="`drug-${iterator}-users-expense`">
                Lijek se plaća
            </label>
        </div>

        <div class="form__row"></div>

        <div
            class="form__row has-multiple-children">
            <a
                role="button"
                class="form__confirm_entry_btn"
                :class="{'is-disabled': btnDisabled}"
                @click="confirmEntry()"
            >Potvrdi unos</a>

            <a
                role="button"
                class="form__delete_entry_btn"
                @click="deleteDrug()"
            >Izbriši unos</a>
        </div>

        <div
            class="form__row">
            <p class="form__next_pickup_date">Lijek se može podignuti: <span :class="{'is-warning': warnAboutDate}">{{ calculateNextPickup() }}</span></p>
        </div>

    </div>
</template>

<script>
export default {
    name: 'FormGroup',

    data () {
        return {
            drugData: {
                drugName: this.existingDrug?.drugName || '',
                drugAmount: this.existingDrug?.drugAmount || 0,
                drugDailyDose: this.existingDrug?.drugDailyDose || 0,
                drugPickupDate: this.existingDrug?.drugPickupDate || '',
                drugAtUserExpense: this.existingDrug?.drugAtUserExpense || false
            },
            warnAboutDate: false,
            btnDisabled: true,
            showCalculatedText: false
        };
    },

    watch: {
        drugData: {
            deep: true,
            handler () {
                this.btnDisabled = false;
            }
        }
    },

    props: {
        iterator: {
            type: Number,
            required: true,
            default: 0
        },
        existingDrug: {
            type: Object,
            required: false
        }
    },

    methods: {
        confirmEntry () {
            const drugObject = {
                drugName: this.drugData.drugName,
                drugAmount: Number(this.drugData.drugAmount),
                drugDailyDose: Number(this.drugData.drugDailyDose),
                drugPickupDate: this.drugData.drugPickupDate,
                drugAtUserExpense: this.drugData.drugAtUserExpense,
            };

            this.$emit('drugInfo', drugObject);
            this.btnDisabled = true;
        },

        deleteDrug () {
            this.$emit('deleteDrug', this.drugData.drugName);
        },

        calculateNextPickup () {

            if (!this.drugData.drugAmount || !this.drugData.drugDailyDose || !this.drugData.drugPickupDate) return;

            const daysCovered = Number(this.drugData.drugAmount) / Number(this.drugData.drugDailyDose);
            const lastPickup = new Date(this.drugData.drugPickupDate);
            const futureDate = new Date(lastPickup.getTime() + (daysCovered * 24 * 60 * 60 * 1000));
            const currentDate = new Date();
            const daysUntilNextPickup = Math.ceil((futureDate - currentDate) / (24 * 60 * 60 * 1000));
            const futureDay = futureDate.getDate();
            const futureMonth = futureDate.getMonth() + 1;
            const futureYear = futureDate.getFullYear();

            if (daysUntilNextPickup < 5) {
                this.warnAboutDate = true;
            }

            this.showCalculatedText = true;

            if (daysUntilNextPickup > 0) {
                return `${futureDay}.${futureMonth}.${futureYear}. (${daysUntilNextPickup} dana)`;
            } if (daysUntilNextPickup === 0) {
                return `${futureDay}.${futureMonth}.${futureYear}. (danas)`;
            }

            return `${futureDay}.${futureMonth}.${futureYear}. (prije ${daysUntilNextPickup * -1} dana)`;

        }
    }
};
</script>
