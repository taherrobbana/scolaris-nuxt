<template>
  <q-page padding>
    <div style="max-width: 600px; margin: 0 auto">
      <div class="text-h5 text-primary text-weight-bold q-mb-lg">
        {{ $t("settings.title") }}
      </div>

      <!-- Préférences de l'application -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 text-primary q-mb-md">
            {{ $t("settings.uiPreferences") }}
          </div>

          <q-list>
            <!-- Mode Sombre -->
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-icon
                  :name="isDarkActive ? 'dark_mode' : 'light_mode'"
                  color="primary"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("settings.darkMode") }}</q-item-label>
                <q-item-label caption>{{
                  $t("settings.darkModeCaption")
                }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="isDarkActive"
                  color="primary"
                  @update:model-value="toggleDarkMode"
                />
              </q-item-section>
            </q-item>

            <!-- Langue -->
            <q-item>
              <q-item-section avatar>
                <q-icon name="language" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("settings.language") }}</q-item-label>
                <q-item-label caption>{{
                  $t("settings.languageCaption")
                }}</q-item-label>
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
                  @update:model-value="changeLanguage"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Notifications -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6 text-primary q-mb-md">
            {{ $t("settings.notifications") }}
          </div>

          <q-list>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-icon name="notifications" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{
                  $t("settings.emailNotifications")
                }}</q-item-label>
                <q-item-label caption>{{
                  $t("settings.emailNotificationsCaption")
                }}</q-item-label>
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
                <q-item-label>{{
                  $t("settings.pushNotifications")
                }}</q-item-label>
                <q-item-label caption>{{
                  $t("settings.pushNotificationsCaption")
                }}</q-item-label>
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
        <q-btn
          :label="$t('settings.save')"
          color="primary"
          @click="savePreferences"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { ALL_ROLES } from "~/utils/types";
import { Dark } from "quasar";
import { useLangModule } from "~/stores/lang/langModule";

definePageMeta({
  middleware: "auth",
  roles: ALL_ROLES,
});

const $q = useQuasar();
const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.settings")),
});
const langModule = useLangModule();

// Données mockées (initialisées avec des valeurs par défaut)
const isDarkActive = computed(() => Dark.isActive);
const selectedLanguage = computed(() => langModule.getLanguage);
const emailNotifications = ref(true);
const pushNotifications = ref(false);

const changeLanguage = () => {
  langModule.setLanguage();
};
const languageOptions = [
  { label: "Français", value: "fr" },
  { label: "English", value: "en" },
];

const toggleDarkMode = (val: boolean) => {
  $q.dark.set(val);
};

const savePreferences = () => {
  $q.notify({
    type: "positive",
    message: t("settings.simulation"),
    position: "top",
  });
};
</script>

<style scoped></style>
