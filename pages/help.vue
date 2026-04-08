<template>help</template>

<script setup lang="ts">
import { ALL_ROLES } from '~/utils/types';

definePageMeta({
    middleware: 'auth',
    roles: ALL_ROLES,
})

useHead({
    title: 'Aide - Plateforme Scolaire',
})
</script>