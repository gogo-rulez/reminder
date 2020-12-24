<template>
    <div class="patient">
        <input-form></input-form>
    </div>
</template>

<script>
// @ is an alias to /src
import InputForm from '@/components/InputForm';

export default {
    name: 'PatientDetail',
    components: {
        InputForm
    },
};
</script>
