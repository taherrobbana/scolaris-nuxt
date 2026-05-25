<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <div class="text-h5 text-primary text-weight-bold q-mb-lg">
        {{ $t("admin.index.title") }}
      </div>

      <!-- Stats Cards -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3" v-for="stat in stats" :key="stat.title">
          <q-card class="stat-card" flat bordered>
            <q-card-section class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-7">{{ stat.title }}</div>
                <div class="text-h5 text-weight-bold">{{ stat.value }}</div>
              </div>
              <q-avatar
                :color="stat.color"
                text-color="white"
                :icon="stat.icon"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Content -->
      <div class="row q-col-gutter-md q-mt-md">
        <!-- Recent Activity -->
        <div class="col-12 col-md-8">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md">
                {{ $t("admin.index.recentActivity") }}
              </div>
              <q-list separator>
                <q-item v-for="item in activities" :key="item.id">
                  <q-item-section avatar>
                    <q-icon :name="item.icon" :color="item.color" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.message }}</q-item-label>
                    <q-item-label caption>{{ item.date }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Quick Links Component -->
        <div class="col-12 col-md-4">
          <QuickLinks />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import QuickLinks from "~/components/QuickLinks.vue";

definePageMeta({
  middleware: "auth",
  roles: ["admin"],
});

const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.admin.index")),
});

const stats = computed(() => [
  {
    title: t("admin.index.stats.totalStudents"),
    value: "1,250",
    color: "primary",
    icon: "school",
  },
  { title: t("admin.index.stats.teachers"), value: "85", color: "secondary", icon: "person" },
  { title: t("admin.index.stats.activeGroups"), value: "42", color: "positive", icon: "group" },
  {
    title: t("admin.index.stats.pendingRequests"),
    value: "12",
    color: "warning",
    icon: "hourglass_empty",
  },
]);

const activities = computed(() => [
  {
    id: 1,
    message: t("admin.index.activity.newUser", { name: "John Doe" }),
    date: t("admin.index.time.minsAgo", { count: 10 }),
    icon: "person_add",
    color: "primary",
  },
  {
    id: 2,
    message: t("admin.index.activity.groupUpdated", { name: "Classe A" }),
    date: t("admin.index.time.hoursAgo", { count: 1 }),
    icon: "edit",
    color: "secondary",
  },
  {
    id: 3,
    message: t("admin.index.activity.docValidated", { name: "Sarah Smith" }),
    date: t("admin.index.time.hoursAgoPlural", { count: 2 }),
    icon: "verified",
    color: "positive",
  },
]);
</script>

<style scoped>
.myCard {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}
.stat-card {
  border-radius: 12px;
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-5px);
}
</style>
