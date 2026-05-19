<template>
  <div class="error-page flex flex-center">
    <div class="error-card q-pa-xl text-center">
      <div class="text-h1 text-weight-bold text-primary q-mb-md">{{ error?.statusCode || '500' }}</div>
      <div class="text-h5 text-grey-8 q-mb-lg">{{ error?.statusMessage || 'Une erreur est survenue' }}</div>
      
      <p class="text-body1 text-grey-6 q-mb-xl max-width-text">
        {{ isChunkError ? 'Mise à jour de l\'application détectée. Rechargement en cours...' : (error?.message || 'Désolé, une erreur inattendue est survenue.') }}
      </p>

      <div class="row justify-center q-gutter-md">
        <q-btn 
          label="Retour à l'accueil" 
          color="primary" 
          unelevated 
          rounded 
          class="q-px-lg"
          @click="handleClearError" 
        />
        <q-btn 
          label="Recharger la page" 
          color="secondary" 
          outline 
          rounded 
          class="q-px-lg"
          @click="forceReload" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';

const props = defineProps({
  error: {
    type: Object,
    default: null
  }
});

const isChunkError = computed(() => {
  const errorMsg = String(props.error?.message || props.error?.stack || '').toLowerCase();
  return (
    errorMsg.includes('failed to fetch dynamically imported module') ||
    errorMsg.includes('failed to load module script') ||
    errorMsg.includes('mime type')
  );
});

const handleClearError = () => {
  clearError({ redirect: '/' });
};

const forceReload = () => {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

onMounted(() => {
  // Si c'est une erreur de chargement de module/chunk, on récupère et on recharge automatiquement
  if (isChunkError.value) {
    console.warn('[Scolaris Error Recovery] Chunk loading error detected. Auto-reloading current path...');
    if (typeof window !== 'undefined') {
      // Force un rechargement complet sans cache
      window.location.reload();
    }
  }
});
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.error-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  max-width: 500px;
  width: 90%;
}
.max-width-text {
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
</style>
