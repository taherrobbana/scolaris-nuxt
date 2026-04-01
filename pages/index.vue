<template>index</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  roles: ['student', 'teacher', 'admin', 'coordinator'],
})

useHead({
  title: 'Accueil - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>
