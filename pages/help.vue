<template>
  <q-page padding>
    <div style="max-width: 800px; margin: 0 auto">
      <div class="text-h5 text-primary text-weight-bold q-mb-lg">
        {{ $t("help.title") }}
      </div>

      <!-- Section FAQ -->
      <div class="text-h6 text-primary q-mb-md">{{ $t("help.faq") }}</div>

      <q-list bordered class="rounded-borders q-mb-xl">
        <q-expansion-item
          expand-separator
          icon="help_outline"
          :label="$t('help.q1')"
          header-class="text-primary text-weight-bold"
        >
          <q-card>
            <q-card-section class="text-grey-8">
              {{ $t("help.a1") }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="help_outline"
          :label="$t('help.q2')"
          header-class="text-primary text-weight-bold"
        >
          <q-card>
            <q-card-section class="text-grey-8">
              {{ $t("help.a2") }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="help_outline"
          :label="$t('help.q3')"
          header-class="text-primary text-weight-bold"
        >
          <q-card>
            <q-card-section class="text-grey-8">
              {{ $t("help.a3") }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="help_outline"
          :label="$t('help.q4')"
          header-class="text-primary text-weight-bold"
        >
          <q-card>
            <q-card-section class="text-grey-8">
              {{ $t("help.a4") }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <!-- Section Contact -->
      <div class="text-h6 text-primary q-mb-md">
        {{ $t("help.contactSupport") }}
      </div>

      <div class="row q-col-gutter-md">
        <!-- Infos de contact -->
        <div class="col-12 col-md-5">
          <q-card flat bordered class="full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">
                {{ $t("help.ourDetails") }}
              </div>

              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="email" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ $t("help.email") }}</q-item-label>
                    <q-item-label caption>support@scolaris.com</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="phone" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ $t("help.phone") }}</q-item-label>
                    <q-item-label caption>+216 71 000 000</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ $t("help.schedule") }}</q-item-label>
                    <q-item-label caption>Lun - Ven, 8h00 - 17h00</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Formulaire de contact -->
        <div class="col-12 col-md-7">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">
                {{ $t("help.sendMessage") }}
              </div>

              <q-form @submit="submitTicket" class="q-gutter-md">
                <q-input
                  v-model="ticket.subject"
                  :label="$t('help.subject')"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'Le sujet est requis']"
                />

                <q-input
                  v-model="ticket.message"
                  :label="$t('help.message')"
                  type="textarea"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'Le message est requis']"
                />

                <div class="row justify-end">
                  <q-btn
                    :label="$t('help.send')"
                    type="submit"
                    color="primary"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { ALL_ROLES } from "~/utils/types";

definePageMeta({
  middleware: "auth",
  roles: ALL_ROLES,
});

const $q = useQuasar();
const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.help")),
});

const ticket = ref({
  subject: "",
  message: "",
});

const submitTicket = () => {
  $q.notify({
    type: "positive",
    message: t("help.simulation"),
    position: "top",
  });
  ticket.value.subject = "";
  ticket.value.message = "";
};
</script>

<style scoped></style>
