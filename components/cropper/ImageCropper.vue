<template>
  <div class="cropper-wrapper">
    <AdvancedCropper ref="cropper" :src="imageSrc" :stencil-props="stencilProps" :stencil-component="CircleStencil"
      class="cropper" />

    <div class="row justify-center q-mt-md q-gutter-sm">
      <q-btn color="primary" flat @click="rotate(-90)" icon="rotate_left">
        <q-tooltip>{{ $t("cropper.rotateLeft") }}</q-tooltip>
      </q-btn>
      <q-btn color="primary" flat @click="rotate(90)" icon="rotate_right">
        <q-tooltip>{{ $t("cropper.rotateRight") }}</q-tooltip>
      </q-btn>
      <q-btn color="positive" unelevated @click="crop" icon="check" :label="$t('cropper.validate')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Cropper as AdvancedCropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const props = defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  aspectRatio: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['cropped'])

const cropper = ref<InstanceType<typeof AdvancedCropper> | null>(null)
const croppedImageBase64 = ref('')

const stencilProps = computed(() => ({
  aspectRatio: props.aspectRatio,
  movable: true,
  resizable: true,
  previewClass: 'cropper-preview' // Classe pour le preview
}))

const onChange = (data: any) => {
  console.log('Cropper data:', data)
}

const rotate = (angle: any) => {
  if (cropper.value) {
    cropper.value.rotate(angle)
  }
}

const crop = () => {
  if (cropper.value) {
    const { canvas } = cropper.value.getResult()

    if (canvas) {
      // Convertir le canvas en base64
      const base64 = canvas.toDataURL('image/jpeg', 0.95)
      croppedImageBase64.value = base64

      // Convertir aussi en blob si besoin
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        emit('cropped', {
          blob,
          url,
          base64,
          filename: `cropped-${Date.now()}.jpg`
        })
      }, 'image/jpeg', 0.95)
    }
  }
}

// Exposer la base64 pour le parent si besoin
defineExpose({
  getBase64: () => croppedImageBase64.value
})
</script>

<style scoped lang="scss">
.cropper-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.cropper {
  max-height: 500px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5 !important;
}

/* Pour rendre le preview circulaire */
.cropper-preview {
  border-radius: 50% !important;
}

/* Style pour le stencil circulaire */
:deep(.vue-advanced-cropper__stencil) {
  border-radius: 50%;
}

:deep(.vue-advanced-cropper__stencil-grid) {
  border-radius: 50%;
}

:deep(.vue-advanced-cropper__stencil-overlay) {
  border-radius: 50%;
}








/* Personnalisation avancée */
:deep(.circle-stencil) {
  border-radius: 50%;
  overflow: hidden;
}

:deep(.circle-stencil .vue-advanced-cropper__stencil-grid) {
  border-radius: 50%;
}

:deep(.circle-stencil .vue-advanced-cropper__stencil-overlay) {
  border-radius: 50%;
}

/* Pour un effet de grille circulaire */
:deep(.vue-advanced-cropper__stencil-grid) {
  background-image:
    radial-gradient(circle, transparent 70%, rgba(0, 0, 0, 0.3) 70%),
    linear-gradient(0deg, transparent 49.5%, rgba(255, 255, 255, 0.5) 49.5%, rgba(255, 255, 255, 0.5) 50.5%, transparent 50.5%),
    linear-gradient(90deg, transparent 49.5%, rgba(255, 255, 255, 0.5) 49.5%, rgba(255, 255, 255, 0.5) 50.5%, transparent 50.5%);
}
</style>