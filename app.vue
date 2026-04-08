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

const numberOfNotifications = ref(2)

useHead({
  titleTemplate: (titleChunk) => {
    const prefix = numberOfNotifications.value > 0 ? `(${numberOfNotifications.value}) ` : ''
    const baseTitle = 'Plateforme Scolaire'
    
    return titleChunk && titleChunk !== baseTitle 
      ? `${prefix}${titleChunk} - ${baseTitle}` 
      : `${prefix}${baseTitle}`
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: sesameIconPath }],
})
</script>
