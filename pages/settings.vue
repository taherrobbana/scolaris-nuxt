<template>settings</template>

<script setup>
import { ALL_ROLES } from '~/utils/types';

definePageMeta({
  middleware: 'auth',
  roles: ALL_ROLES,
})

useHead({
  title: 'Paramètres - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>