<template>
  <q-card flat bordered class="quick-links-card">
    <q-card-section>
      <div class="text-h6 q-mb-md">{{ $t('commun.quickLinks') }}</div>
      <q-list separator>
        <q-item v-for="route in filteredRoutes" :key="route.route" clickable v-ripple :to="route.route">
          <q-item-section avatar>
            <q-icon :name="route.icon" color="primary" size="24px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ route.label }}</q-item-label>
            <q-item-label caption v-if="route.caption" class="text-grey-7">{{ route.caption }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { routes } from '~/utils';
import { useAuthModule } from '~/stores/auth/authModule';

const authModule = useAuthModule();
const role = authModule.getRole;

const filteredRoutes = computed(() => {
  if (!routes.value) return [];
  return routes.value.filter(r => r.roles.includes(role as Role) && r.route && !r.isFooter);
});
</script>

<style scoped>
.quick-links-card {
  border-radius: 12px;
}
</style>
