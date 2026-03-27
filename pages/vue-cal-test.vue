<template>
    <q-page padding>
        <div class="myCard">
            <div class="text-h5 q-mb-md">Emploi du temps</div>

            <client-only>
                <vue-cal active-view="week" :disable-views="['years', 'year']" :time-from="8 * 60" :time-to="18 * 60"
                    :time-step="30" :locale="getLanguage" style="height: 600px" />
            </client-only>

        </div>
    </q-page>
</template>
<script setup>
import { useLangModule } from "~/stores/lang/langModule";

const langModule = useLangModule();
const getLanguage = computed(() => langModule.getLanguage);

</script>