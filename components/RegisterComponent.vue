<template>
  <q-card class="q-pa-md" style="max-width: 500px; width: 100%">
    <q-card-section>
      <div class="text-h6 text-center">{{ $t('auth.register.title') }}</div>
    </q-card-section>

    <q-form @submit="onSubmit" class="q-gutter-y-md">
      <div style="display: flex; justify-content: space-between">
        <q-input v-model="form.firstName" :label="$t('auth.fields.firstName')" outlined dense style="width: 48%"
          :rules="[(val) => !!val || $t('auth.validation.firstNameRequired')]" />
        <q-input v-model="form.lastName" :label="$t('auth.fields.lastName')" outlined dense style="width: 48%"
          :rules="[(val) => !!val || $t('auth.validation.lastNameRequired')]" />
      </div>
      <q-input v-model="form.username" :label="$t('auth.fields.email')" type="email" outlined dense :rules="[
        (val) => !!val || $t('auth.validation.emailRequired'),
        (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) || $t('auth.validation.emailInvalid'),
      ]" />

      <q-input v-model="form.password" :label="$t('auth.fields.password')" :type="showPassword ? 'text' : 'password'" outlined dense
        :rules="[
          (val) => !!val || $t('auth.validation.passwordRequired'),
          (val) => val.length >= 6 || $t('auth.validation.passwordMin'),
        ]">
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <q-input v-model="form.confirmPassword" :label="$t('auth.fields.confirmPassword')"
        :type="showConfirmPassword ? 'text' : 'password'" outlined dense :rules="[
          (val) => !!val || $t('auth.validation.confirmRequired'),
          (val) =>
            val === form.password || $t('auth.validation.mismatch'),
        ]">
        <template v-slot:append>
          <q-icon :name="showConfirmPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="showConfirmPassword = !showConfirmPassword" />
        </template>
      </q-input>

      <div class="text-center">
        <q-btn type="submit" color="primary" :label="$t('auth.register.submit')" :loading="loading" class="full-width" />
      </div>

      <div class="text-center q-mt-md">
        <span class="text-caption">{{ $t('auth.register.alreadyAccount') }} </span>
        <q-btn flat color="primary" :label="$t('auth.register.login')" @click="$emit('switch-to-login')" dense no-caps />
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAuthModule } from "@/stores/auth/authModule";

const $q = useQuasar();

const emit = defineEmits(["switch-to-login"]);

const authModule = useAuthModule();

const form = ref({
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  confirmPassword: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;

  await authModule.register(form.value)
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped></style>
