<template>
  <q-page padding>
    <div class="myCard">
      <div class="unauthorized-container">
        <div class="content">
          <div style="font-size: 10vh" class="text-primary">
            404
          </div>
          <div class="text-h2" style="opacity:.4">
            {{ $t('error.pageNotFoundTitle') }}
          </div>
          <p class="text-faded">
            {{ $t('error.pageNotFoundSubtitle') }}
          </p>
          <div class="actions">
            <q-btn flat no-caps :label="$t('error.back')" @click="router.back()" />
            <q-btn no-caps :label="$t('error.home')" color="primary" to="/" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">

const router = useRouter()

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Page introuvable',
})
</script>
<style scoped lang="scss">
.unauthorized-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70vh;
  text-align: center;
  font-family: sans-serif;
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h1 {
  color: #2d3748;
  font-size: 2rem;
}

p {
  color: #718096;
  margin: 1rem 0 2rem;
}

span {
  font-weight: bold;
  color: #e53e3e;
  text-transform: uppercase;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary {
  background: #4f46e5;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
}

.btn-secondary {
  background: #edf2f7;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
}
</style>