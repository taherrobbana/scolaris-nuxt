<template>
  <q-page padding>
    <div class="myCard">
      <div class="row q-col-gutter-md">
        <!-- Colonne Avatar -->
        <div class="col-12 col-md-auto">
          <div style="width: min-content">
            <div class="text-h5 text-primary text-weight-bold" style="text-align: center;">
              {{ fullName }}
            </div>
            <div class="image-wrapper">
              <q-img v-if="authModule.getAvatar" :src="authModule.getAvatar" width="250px" height="250px"
                class="rounded-circle shadow-3" style="border: 4px solid white" />
              <q-avatar v-else size="250px" color="primary" text-color="white" class="rounded-circle shadow-3"
                style="border: 4px solid white; font-size: 180px; font-weight: bold; width: 250px; height: 250px;">
                {{ initials }}
              </q-avatar>
              <q-btn round color="primary" class="q-ml-xs badge-bottom-right" @click="editProfilePic()">
                <q-icon name="edit" />
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Colonne Contenu et Onglets -->
        <div class="col-12 col-md">
          <div class="row justify-center q-mb-md">
            <q-tabs v-model="tab" class="text-primary">
              <q-tab name="identity" :label="$t('profile.identity')" />
              <q-tab name="contactDetails" :label="$t('profile.contactDetails')" />
              <q-tab name="emergencyContacts" :label="$t('profile.emergencyContacts')" />
              <q-tab name="documents" :label="$t('profile.documents')" />
            </q-tabs>
          </div>
          
          <div style="width: 100%">
            <ProfileIdentity v-if="tab == 'identity'" />
            <ProfileContactDetails v-if="tab == 'contactDetails'" />
            <ProfileEmergencyContacts v-if="tab == 'emergencyContacts'" />
            <ProfileDocuments v-if="tab == 'documents'" />
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog pour changer la photo de profil -->
    <q-dialog v-model="showEditProfilePicPopUp">
      <q-card style="min-width: 400px; max-width: 600px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t('profile.editAvatar') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-file v-model="tempFile" :label="$t('profile.chooseImage')" outlined dense accept="image/*"
            @update:model-value="onFileSelected">
            <template v-slot:prepend>
              <q-icon name="image" />
            </template>
          </q-file>

          <div v-if="imageToCrop" class="q-mt-md">
            <ImageCropper :image-src="imageToCrop" @cropped="handleCropped" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import ImageCropper from "~/components/cropper/ImageCropper.vue";
import ProfileIdentity from "~/components/profile/ProfileIdentity.vue";
import ProfileContactDetails from "~/components/profile/ProfileContactDetails.vue";
import ProfileEmergencyContacts from "~/components/profile/ProfileEmergencyContacts.vue";
import ProfileDocuments from "~/components/profile/ProfileDocuments.vue";
import { useAuthModule } from "~/stores/auth/authModule";
import { ALL_ROLES } from '~/utils/types';

const $q = useQuasar();
const { t } = useI18n();
const authModule = useAuthModule();

const fullName = computed(
  () => authModule.getFirstName + " " + authModule.getLastName,
);
const tab = ref('identity');

const initials = computed(() => {
  const f = authModule.getFirstName?.charAt(0).toUpperCase() || "";
  const l = authModule.getLastName?.charAt(0).toUpperCase() || "";
  return f + l;
});

const tempFile = ref<File | null>(null);
const imageToCrop = ref('');

const onFileSelected = (file: any) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      imageToCrop.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleCropped = async (data: any) => {
  const base64 = data.base64;
  try {
    const res = await authModule.updateProfile({ avatar: base64 });
    if (res) {
      $q.notify({
        type: 'positive',
        message: t('profile.avatarSuccess'),
        timeout: 2000
      });
      showEditProfilePicPopUp.value = false;
      imageToCrop.value = '';
      tempFile.value = null;
    }
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'avatar', err);
  }
};

const showEditProfilePicPopUp = ref(false);

function editProfilePic() {
  showEditProfilePicPopUp.value = !showEditProfilePicPopUp.value;
}

definePageMeta({
  middleware: 'auth',
  roles: ALL_ROLES,
  alias: ['/mon-profil', '/account'],
})

useHead({
  title: t('profile.title'),
})
</script>

<style scoped lang="scss">
.rounded-circle {
  border-radius: 50% !important;
}

.image-wrapper {
  position: relative;
  width: 250px;
  height: 250px;
}

.badge-bottom-right {
  position: absolute;
  bottom: 25px;
  right: 25px;
  transform: translate(25%, 25%);
}
</style>