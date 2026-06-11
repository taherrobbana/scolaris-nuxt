<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <div class="row items-center q-mb-lg">
        <div class="text-h5 text-primary text-weight-bold">
          {{ $t("admin.groups.title") }}
        </div>
        <q-space />
        <q-btn
          color="primary"
          icon="add"
          :label="$t('admin.groups.add')"
          @click="openGroupDialog()"
          unelevated
        />
      </div>

      <q-table
        :rows="groupsWithSpecialty"
        :columns="columns"
        row-key="id"
        :loading="groupStore.loading"
        flat
        bordered
        class="groups-table"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              flat
              round
              color="secondary"
              icon="person_add"
              @click="openAssignDialog(props.row)"
              size="sm"
            >
              <q-tooltip>{{ $t("admin.groups.assignUsers") }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="openGroupDialog(props.row)"
              size="sm"
            >
              <q-tooltip>{{ $t("admin.groups.edit") }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row)"
              size="sm"
            >
              <q-tooltip>{{ $t("admin.groups.delete") }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogue Ajout/Edition -->
    <q-dialog v-model="groupDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{
              isEditing
                ? $t("admin.groups.editGroup")
                : $t("admin.groups.addGroup")
            }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input
            v-model="groupForm.name"
            :label="$t('admin.groups.name')"
            outlined
            dense
            :rules="[(v) => !!v || $t('admin.groups.nameRequired')]"
            ref="nameInputRef"
            @keyup.enter="saveGroup"
          />
          <q-select
            v-model="groupForm.specialty"
            :options="specialtyOptions"
            :label="$t('admin.groups.specialty')"
            outlined
            dense
            emit-value
            map-options
            :rules="[(v) => !!v || $t('admin.groups.specialtyRequired')]"
            ref="specialtyInputRef"
          >
            <template #prepend><q-icon name="school" /></template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('admin.groups.cancel')"
            color="primary"
            v-close-popup
          />
          <q-btn
            unelevated
            :label="
              isEditing ? $t('admin.groups.update') : $t('admin.groups.create')
            "
            color="primary"
            @click="saveGroup"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogue Affectation -->
    <q-dialog v-model="assignDialog">
      <q-card style="min-width: 500px; max-height: 80vh">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ $t("admin.groups.assignTitle", { name: selectedGroup?.name }) }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none scroll" style="height: 400px">
          <q-list separator v-if="!assignLoading">
            <q-item v-for="user in allUsers" :key="user.id">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" size="30px">
                  {{ user.firstName?.charAt(0).toUpperCase()
                  }}{{ user.lastName?.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label
                  >{{ user.firstName }} {{ user.lastName }}</q-item-label
                >
                <q-item-label caption>{{ user.username }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :model-value="user.group === selectedGroup?.name"
                  @update:model-value="toggleAssignment(user)"
                  color="secondary"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-if="assignLoading" class="flex flex-center q-pa-lg">
            <q-spinner color="primary" size="40px" />
          </div>
          <div
            v-if="!assignLoading && allUsers.length === 0"
            class="text-center q-pa-lg text-grey"
          >
            {{ $t("admin.groups.noUserFound") }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useQuasar, Dialog } from "quasar";
import { useI18n } from "vue-i18n";
import { useGroupModule } from "@/stores/group/groupModule";
import { getAllUsers, updateUser } from "@/stores/auth/authService";

definePageMeta({
  middleware: "auth",
  roles: ["admin"],
});

const $q = useQuasar();
const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.admin.groups")),
});

const groupStore = useGroupModule();
const saving = ref(false);
const groupDialog = ref(false);
const isEditing = ref(false);

const nameInputRef = ref<any>(null);
const specialtyInputRef = ref<any>(null);

const groupForm = ref({
  id: "",
  name: "",
  specialty: "",
});

const assignDialog = ref(false);
const selectedGroup = ref<any>(null);
const allUsers = ref<any[]>([]);
const assignLoading = ref(false);

const specialtyOptions = computed(() => [
  { label: "Software Engineering", value: "Software Engineering" },
  { label: "Data Science & IA", value: "Data Science & IA" },
  { label: "Embedded Systems", value: "Embedded Systems" },
]);

const specialtiesList = ref<any[]>([]);

const fetchSpecialties = async () => {
  try {
    const res: any = await $fetch("/api/groups/specialties");
    specialtiesList.value = res || [];
  } catch (error) {
    console.error("Failed to fetch specialties list", error);
  }
};

const groupsWithSpecialty = computed(() => {
  return groupStore.groups.map((g) => {
    const mapping = specialtiesList.value.find((s) => s.groupId === g.id);
    return {
      ...g,
      specialty: mapping ? mapping.specialty : "",
    };
  });
});

const columns = computed(() => [
  {
    name: "name",
    label: t("admin.groups.columns.name"),
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "specialty",
    label: t("admin.groups.columns.specialty"),
    field: "specialty",
    align: "left",
    sortable: true,
    format: (val: string) => {
      const opt = specialtyOptions.value.find((o) => o.value === val);
      return opt ? opt.label : (val || "—");
    },
  },
  {
    name: "actions",
    label: t("admin.groups.columns.actions"),
    align: "center",
  },
]);

const fetchGroups = async () => {
  await Promise.all([
    groupStore.fetchGroups(),
    fetchSpecialties()
  ]);
};

const openGroupDialog = (group = null) => {
  if (group) {
    isEditing.value = true;
    groupForm.value = {
      id: group.id,
      name: group.name,
      specialty: group.specialty || "",
    };
  } else {
    isEditing.value = false;
    groupForm.value = { id: "", name: "", specialty: "" };
  }
  groupDialog.value = true;
};

const saveGroup = async () => {
  const nameOk = await nameInputRef.value?.validate();
  const specOk = await specialtyInputRef.value?.validate();
  if (!nameOk || !specOk) return;

  saving.value = true;
  try {
    if (isEditing.value) {
      const oldGroup = groupStore.groups.find(
        (g) => g.id === groupForm.value.id,
      );
      const oldName = oldGroup ? oldGroup.name : null;
      const newName = groupForm.value.name;

      await groupStore.editGroup(groupForm.value.id, { name: newName });

      if (oldName && oldName !== newName) {
        try {
          const usersRes = await getAllUsers();
          const affectedUsers = (usersRes || []).filter(
            (u: any) => u.group === oldName,
          );

          if (affectedUsers.length > 0) {
            $q.notify({
              message: t("admin.groups.updatingUsers", {
                count: affectedUsers.length,
              }),
              color: "info",
              icon: "sync",
              timeout: 1000,
            });

            for (const user of affectedUsers) {
              await updateUser(user.id, { ...user, group: newName });
            }
          }
        } catch (err) {
          console.error(
            "Erreur lors de la mise à jour des utilisateurs affectés:",
            err,
          );
        }
      }

      await $fetch("/api/groups/specialties", {
        method: "POST",
        body: { groupId: groupForm.value.id, specialty: groupForm.value.specialty }
      });

      $q.notify({ type: "positive", message: t("admin.groups.successUpdate") });
    } else {
      const res = await groupStore.addGroup({ name: groupForm.value.name });
      let newId = res?.id;
      if (!newId && res?._id) {
        newId = res._id.toString();
      }
      if (!newId) {
        const found = groupStore.groups.find(g => g.name === groupForm.value.name);
        newId = found?.id;
      }

      if (newId) {
        await $fetch("/api/groups/specialties", {
          method: "POST",
          body: { groupId: newId, specialty: groupForm.value.specialty }
        });
      }

      $q.notify({ type: "positive", message: t("admin.groups.successCreate") });
    }
    await fetchSpecialties();
    groupDialog.value = false;
  } finally {
    saving.value = false;
  }
};

const openAssignDialog = async (group: any) => {
  selectedGroup.value = group;
  assignDialog.value = true;
  assignLoading.value = true;
  try {
    const res = await getAllUsers();
    allUsers.value = res || [];
  } finally {
    assignLoading.value = false;
  }
};

const toggleAssignment = async (user: any) => {
  const isAssigned = user.group === selectedGroup.value.name;
  const newGroup = isAssigned ? "" : selectedGroup.value.name;

  try {
    await updateUser(user.id, { ...user, group: newGroup });
    user.group = newGroup;
    $q.notify({
      type: "positive",
      message: isAssigned
        ? t("admin.groups.userUnassigned")
        : t("admin.groups.userAssigned"),
      timeout: 1000,
    });
  } catch (error) {
    console.error("Erreur lors de l'affectation", error);
  }
};

const confirmDelete = (group: any) => {
  Dialog.create({
    title: t("admin.groups.confirmDeleteTitle"),
    message: t("admin.groups.confirmDeleteMessage", { name: group.name }),
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await groupStore.removeGroup(group.id);
    $q.notify({ type: "positive", message: t("admin.groups.successDelete") });
  });
};

onMounted(() => {
  fetchGroups();
});
</script>

<style scoped>
.myCard {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.groups-table {
  background: white;
  border-radius: 12px;
}
</style>
