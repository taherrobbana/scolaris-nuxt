<template>
  <q-page padding>
    <div style="max-width: 600px; margin: 0 auto;">
      <div class="text-h5 text-primary text-weight-bold q-mb-lg">Paramètres</div>

      <!-- Préférences de l'application -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 text-primary q-mb-md">Préférences de l'interface</div>
          
          <q-list>
            <!-- Mode Sombre -->
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-icon :name="isDark ? 'dark_mode' : 'light_mode'" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Mode sombre</q-item-label>
                <q-item-label caption>Activer le thème sombre pour l'application</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="isDark" color="primary" @update:model-value="toggleDarkMode" />
              </q-item-section>
            </q-item>

            <!-- Langue -->
            <q-item>
              <q-item-section avatar>
                <q-icon name="language" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Langue par défaut</q-item-label>
                <q-item-label caption>Choisir la langue de l'interface</q-item-label>
              </q-item-section>
              <q-item-section side style="width: 150px">
                <q-select
                  v-model="selectedLanguage"
                  :options="languageOptions"
                  dense
                  outlined
                  emit-value
                  map-options
                  color="primary"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Notifications -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 text-primary q-mb-md">Notifications</div>
          
          <q-list>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-icon name="notifications" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Notifications par email</q-item-label>
                <q-item-label caption>Recevoir des emails pour les événements importants</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="emailNotifications" color="primary" />
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-icon name="phonelink_ring" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Notifications push</q-item-label>
                <q-item-label caption>Recevoir des notifications sur votre appareil</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="pushNotifications" color="primary" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Bouton Enregistrer -->
      <div class="row justify-end q-mt-lg">
        <q-btn label="Enregistrer les préférences" color="primary" @click="savePreferences" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { ALL_ROLES } from '~/utils/types';

definePageMeta({
  middleware: 'auth',
  roles: ALL_ROLES,
})

useHead({
  title: 'Paramètres',
})

const $q = useQuasar();

// Données mockées (initialisées avec des valeurs par défaut)
const isDark = ref($q.dark.isActive);
const selectedLanguage = ref('fr');
const emailNotifications = ref(true);
const pushNotifications = ref(false);

const languageOptions = [
  { label: 'Français', value: 'fr' },
  { label: 'English', value: 'en' },
  { label: 'العربية', value: 'ar' }
];

const toggleDarkMode = (val: boolean) => {
  $q.dark.set(val);
};

const savePreferences = () => {
  $q.notify({
    type: 'positive',
    message: 'Préférences enregistrées avec succès (Simulation)',
    position: 'top'
  });
};
</script>

<style scoped>
</style>