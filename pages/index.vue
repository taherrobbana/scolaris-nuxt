<template>
  <div class="flex flex-center" style="height: 100vh">
    <q-spinner color="primary" size="3em" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthModule } from "~/stores/auth/authModule";
import { ALL_ROLES } from "~/utils/types";

const authModule = useAuthModule();
const router = useRouter();
const role = computed(() => authModule.getRole);
const { t } = useI18n();

onMounted(() => {
  if (role.value) {
    router.replace(`/${role.value}`);
  } else {
    router.replace("/login");
  }
});

definePageMeta({
  middleware: "auth",
  roles: ALL_ROLES,
});

useHead({
  title: computed(() => t("useHead.index")),
});
</script>
