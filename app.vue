<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { Dark } from 'quasar';

const isDarkActive = computed(() => Dark.isActive);

const sesameIconPath = computed(() =>
  isDarkActive.value ? '/sesameDarkIcon.png' : '/sesameIcon.png'
)
useHead({
  title: 'Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: sesameIconPath }],
})
</script>
