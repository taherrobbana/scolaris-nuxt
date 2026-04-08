<template>index</template>

<script setup lang="ts">
import { ALL_ROLES } from '~/utils/types';
definePageMeta({
  middleware: 'auth',
  roles: ALL_ROLES,
})

useHead({
  title: 'Accueil - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>
