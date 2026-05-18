<template>
  <q-page padding>
    <div style="max-width: 800px; margin: 0 auto;">
      <div class="text-h5 text-primary text-weight-bold q-mb-lg">Centre d'aide & Support</div>

      <!-- Section FAQ -->
      <div class="text-h6 text-primary q-mb-md">Foire Aux Questions (FAQ)</div>
      
      <q-list bordered class="rounded-borders q-mb-xl">
        <q-expansion-item
          expand-separator
          icon="help_outline"
          label="Comment modifier mes informations personnelles ?"
          header-class="text-primary text-weight-bold"
        >
          <q-card>
            <q-card-section class="text-grey-8">
              Vous pouvez modifier vos informations en accédant à la page "Profil". Cliquez sur votre avatar ou nom dans le menu, puis modifiez les champs souhaités et cliquez sur "Enregistrer".
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="help_outline"
          label="Quels types de documents puis-je uploader ?"
          header-class="text-primary text-weight-bold"
        >
          <q-card>
            <q-card-section class="text-grey-8">
              Pour des raisons de sécurité et de compatibilité, seuls les fichiers au format **PDF** sont acceptés pour le moment.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="help_outline"
          label="J'ai oublié mon mot de passe, que faire ?"
          header-class="text-primary text-weight-bold"
        >
          <q-card>
            <q-card-section class="text-grey-8">
              Sur la page de connexion, cliquez sur "Mot de passe oublié". Vous recevrez un e-mail avec les instructions pour réinitialiser votre mot de passe.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="help_outline"
          label="Comment changer la langue de l'application ?"
          header-class="text-primary text-weight-bold"
        >
          <q-card>
            <q-card-section class="text-grey-8">
              Rendez-vous dans la page "Paramètres" (Settings). Vous y trouverez une option pour choisir votre langue par défaut.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <!-- Section Contact -->
      <div class="text-h6 text-primary q-mb-md">Contacter le support</div>
      
      <div class="row q-col-gutter-md">
        <!-- Infos de contact -->
        <div class="col-12 col-md-5">
          <q-card flat bordered class="full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">Nos coordonnées</div>
              
              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="email" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Email</q-item-label>
                    <q-item-label caption>support@scolaris.com</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="phone" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Téléphone</q-item-label>
                    <q-item-label caption>+216 71 000 000</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Horaires</q-item-label>
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
              <div class="text-subtitle1 text-weight-bold q-mb-md">Envoyer un message</div>
              
              <q-form @submit="submitTicket" class="q-gutter-md">
                <q-input
                  v-model="ticket.subject"
                  label="Sujet"
                  outlined
                  dense
                  :rules="[val => !!val || 'Le sujet est requis']"
                />
                
                <q-input
                  v-model="ticket.message"
                  label="Votre message"
                  type="textarea"
                  outlined
                  dense
                  :rules="[val => !!val || 'Le message est requis']"
                />

                <div class="row justify-end">
                  <q-btn label="Envoyer" type="submit" color="primary" />
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
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { ALL_ROLES } from '~/utils/types';

definePageMeta({
    middleware: 'auth',
    roles: ALL_ROLES,
})

useHead({
    title: 'Aide',
})

const $q = useQuasar();

const ticket = ref({
  subject: '',
  message: ''
});

const submitTicket = () => {
  $q.notify({
    type: 'positive',
    message: 'Votre message a été envoyé au support (Simulation)',
    position: 'top'
  });
  ticket.value.subject = '';
  ticket.value.message = '';
};
</script>

<style scoped>
</style>