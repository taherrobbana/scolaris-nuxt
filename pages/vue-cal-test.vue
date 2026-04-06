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
import { ALL_ROLES } from '~/utils/types';

const langModule = useLangModule();
const getLanguage = computed(() => langModule.getLanguage);

definePageMeta({
    middleware: 'auth',
    roles: ALL_ROLES,
})

useHead({
    title: 'Emploi du temps - Plateforme Scolaire',
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>