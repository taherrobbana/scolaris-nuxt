<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <q-card-section>
            <h6 class="text-h6 q-mb-md">Recadrage d'image</h6>
            
            <q-file
              v-model="file"
              label="Choisir une image"
              accept="image/*"
              @update:model-value="onFileSelect"
              outlined
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            
            <div v-if="imageSrc">
              <ImageCropper
                ref="cropperRef"
                :image-src="imageSrc"
                :aspect-ratio="1"
                @cropped="onCropped"
              />
            </div>
            
            <div v-else class="text-center q-pa-lg">
              <q-icon name="image" size="xl" color="grey-5" />
              <div class="text-grey-6 q-mt-md">
                Sélectionnez une image pour commencer le recadrage
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <!-- Colonne droite : Résultat et Base64 -->
       <br>
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <q-card-section>
            <h6 class="text-h6 q-mb-md">Résultat</h6>
            
            <!-- Image recadrée -->
            <div v-if="croppedImageUrl" class="text-center q-mb-lg">
              <div class="text-subtitle2 q-mb-sm">Image recadrée (circulaire)</div>
              <q-img 
                :src="croppedImageUrl" 
                width="250px"
                height="250px"
                class="rounded-circle shadow-3"
                style="border: 4px solid white;"
              />
              
              <!-- Téléchargement -->
              <q-btn 
                color="primary" 
                @click="downloadImage"
                icon="download"
                class="q-mt-md"
              >
                Télécharger
              </q-btn>
            </div>
            
            <!-- Base64 -->
            <div v-if="croppedImageBase64">
              <div class="text-subtitle2 q-mb-sm">Base64 de l'image</div>
              
              <!-- Aperçu court du base64 -->
              <q-card bordered flat class="q-mb-sm">
                <q-card-section class="q-py-xs">
                  <div class="text-caption text-grey">
                    {{ croppedImageBase64.substring(0, 80) }}...
                  </div>
                </q-card-section>
              </q-card>
              
              <!-- Bouton pour copier -->
              <q-btn 
                color="secondary" 
                @click="copyBase64"
                icon="content_copy"
                class="q-mr-sm"
              >
                Copier Base64
              </q-btn>
              
              <!-- Bouton pour voir le code complet -->
              <q-btn 
                color="info" 
                @click="showBase64Dialog = true"
                icon="visibility"
              >
                Voir Base64 complet
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
        
        <!-- Infos techniques -->
        <q-card v-if="croppedImageInfo" class="q-mt-md q-pa-md">
          <q-card-section>
            <h6 class="text-subtitle1 q-mb-sm">Informations</h6>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-caption text-grey">Taille du fichier</div>
                <div>{{ (croppedImageInfo.size / 1024).toFixed(2) }} KB</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey">Dimensions</div>
                <div>{{ croppedImageInfo.width }} × {{ croppedImageInfo.height }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <!-- Dialog pour afficher le Base64 complet -->
    <q-dialog v-model="showBase64Dialog" full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">Base64 complet</div>
        </q-card-section>
        
        <q-card-section>
          <q-input
            v-model="croppedImageBase64"
            type="textarea"
            autogrow
            readonly
            class="base64-textarea"
          />
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn 
            flat 
            label="Fermer" 
            color="primary" 
            v-close-popup 
          />
          <q-btn 
            label="Copier" 
            color="primary" 
            @click="copyBase64" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import ImageCropper from '~/components/cropper/ImageCropper.vue'

const $q = useQuasar()
const file = ref<File | null>(null)
const imageSrc = ref('')
const croppedImageUrl = ref('')
const croppedImageBase64 = ref('')
const croppedImageInfo = ref<{
  size: number;
  type: string;
  width: number;
  height: number;
} | null>(null)
const showBase64Dialog = ref(false)
const cropperRef = ref<InstanceType<typeof ImageCropper> | null>(null)

const onFileSelect = (file: any) => {
  if (file) {
    // Libérer l'ancienne URL si elle existe
    if (imageSrc.value) {
      URL.revokeObjectURL(imageSrc.value)
    }
    imageSrc.value = URL.createObjectURL(file)
    
    // Réinitialiser les résultats précédents
    croppedImageUrl.value = ''
    croppedImageBase64.value = ''
  }
}

const onCropped = (data: any) => {
  croppedImageUrl.value = data.url
  croppedImageBase64.value = data.base64
  
  // Calculer les informations
  if (data.blob) {
    croppedImageInfo.value = {
      size: data.blob.size,
      type: data.blob.type,
      width: 250, // Définir selon votre configuration
      height: 250
    }
  }
}

const downloadImage = () => {
  if (croppedImageUrl.value) {
    const link = document.createElement('a')
    link.href = croppedImageUrl.value
    link.download = `image-circulaire-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const copyBase64 = async () => {
  try {
    await navigator.clipboard.writeText(croppedImageBase64.value)
    $q.notify({
      type: 'positive',
      message: 'Base64 copié dans le presse-papier !',
      timeout: 2000
    })
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la copie',
      timeout: 2000
    })
  }
}

// Nettoyage
onUnmounted(() => {
  if (imageSrc.value) {
    URL.revokeObjectURL(imageSrc.value)
  }
  if (croppedImageUrl.value) {
    URL.revokeObjectURL(croppedImageUrl.value)
  }
})
</script>

<style scoped>
.rounded-circle {
  border-radius: 50% !important;
}

.base64-textarea :deep(textarea) {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.2;
}
</style>