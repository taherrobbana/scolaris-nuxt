<template>
  <q-page padding>
    <div class="myCard">
      <div class="row q-col-gutter-lg">
        <div style="width: min-content">
          <div style="width: min-content">
            <div class="text-h5 q-mb-md" style="text-align: center; font-weight: bold">
              {{ fullName }}
            </div>
            <div class="image-wrapper">
              <q-img :src="studentPhotoBase64" width="250px" height="250px" class="rounded-circle"
                style="border: 4px solid white" />
              <q-btn round color="primary" class="q-ml-xs badge-bottom-right" @click="editProfilePic()">
                <q-icon name="edit" class="cursor-pointer" @click="editProfilePic()" />
              </q-btn>
            </div>
          </div>
          <q-tabs v-model="tab" vertical class="text-primary">
            <q-tab name="identity" label="Identité" />
            <q-tab name="contactDetails" label="Coordonnées" />
            <q-tab name="emergencyContacts" label="Contacts d'urgence" />
            <q-tab name="documents" label="Documents" />
          </q-tabs>
        </div>
        <div>
          <ProfileIdentity v-if="tab == 'identity'" />
          <ProfileContactDetails v-if="tab == 'contactDetails'" />
          <ProfileEmergencyContacts v-if="tab == 'emergencyContacts'" />
          <ProfileDocuments v-if="tab == 'documents'" />
        </div>
        <!-- <div>
          <q-form class="q-gutter-md">
            <q-input dense outlined v-model="profile.name" label="Nom complet" />
            <q-input dense outlined v-model="profile.email" label="Email" />
            <q-input dense outlined v-model="profile.phone" label="Téléphone" />

            <q-file v-model="profile.cv" label="Uploader CV (PDF)" accept=".pdf" />
            <Upload />
            <q-btn label="Enregistrer" color="primary" />
          </q-form>
        </div> -->
      </div>
    </div>
  </q-page>
</template>

<script setup>
import Upload from "~/components/cropper/Upload.vue";
import ProfileIdentity from "~/components/profile/ProfileIdentity.vue";
import ProfileContactDetails from "~/components/profile/ProfileContactDetails.vue";
import ProfileEmergencyContacts from "~/components/profile/ProfileEmergencyContacts.vue";
import ProfileDocuments from "~/components/profile/ProfileDocuments.vue";
import { useAuthModule } from "~/stores/auth/authModule";

const authModule = useAuthModule();
const fullName = computed(
  () => authModule.getFirstName + " " + authModule.getLastName,
);
const tab = ref('identity');
const studentPhotoBase64 =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAA0ADQDASIAAhEBAxEB/8QAGwABAQEAAgMAAAAAAAAAAAAAAAUEAwcBCAn/xAA0EAAABgEBBAULBQAAAAAAAAAAAQIDBAUGEQcIEjEWISJBYRM1NlV0dYGRlLG0FDIzUXH/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAGBEBAAMBAAAAAAAAAAAAAAAAAAERIUH/2gAMAwEAAhEDEQA/APkGAC5a2PRyYqlqoUYjj9h55+Kh1Tiy5n2yMiLXkRDq5oYCszkeQSNfIQ4i9OfBTsHp8mweyLIY5Eb8KIgj5GunYLX5thiakgKiMrnmsilwYDzevbaOuaRxF/XEhJKL4GODIYMevtVswyUTK223mUrPU0ocbS4kjPvMiURfABiAAEUFLMvSqf7Ur7iaKWZelU/2pX3F4nXtxuvxFU27ri1xWX7lFCSzk13lcurpokibYNQjjIaZQuQhRJ/k0LrIi1M9BnTtw3Yt6m0pdgGRr2hk5kWRw4tbaS6+n1gyXVmwherLaFm3q6RrSR9fCXeQ6+3Vt4SkjY5J2DbTLuBTU0nHbuFVZBJYcV+jfnJYPhd4NT8nxMa6kRmRqG/Y3sT2G7LNr2K7TrrfNwaVDxzI4NpKjQos5Tzzcd9DqkII2SI1GSDItT5mN3kJToDLseexLK7PFpD6XXK2e9FW4kupRtrNJmX+6DzlnnRr3ZC/FaHNtCv4uVZ7dZPBQpLNjbSJLKV8yStxSiI/HQxw5Z50a92QvxWhhU0AARQWrKLEyKSdvDtYzTj3akMyXSQaV9+hnzIRQFiRS6Mu+uqz65IdGXfXVZ9ckTQC4RURjbaFkqXf16Gy/epuSS1EXgkusxnvrBmytFyYyFJaShDTJK58CEJQnXx0SQxgFqAACAAAAAAAAAAAAAA//9k=";

const profile = ref({
  name: "Ahmed Benali",
  email: "ahmed@student.tn",
  phone: "22123456",
  cv: null,
});


const showEditProfilePicPopUp = ref(false);

function editProfilePic() {
  showEditProfilePicPopUp.value = !showEditProfilePicPopUp.value;
}

definePageMeta({
  middleware: 'auth',
  roles: ['student', 'teacher', 'admin', 'coordinator'],
  alias: ['/mon-profil', '/account'], // La page pages/profile.vue répondra à 3 URLs
})

useHead({
  title: 'Mon Profil - Plateforme Scolaire', // Modifie le <title>
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/sesameSmallLogo.png' } // Modifie l'icône
  ]
})

</script>
<style scoped>
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