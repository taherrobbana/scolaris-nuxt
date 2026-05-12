<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <div class="row items-center q-mb-lg">
        <div class="text-h5 text-primary text-weight-bold">Gestion des groupes</div>
        <q-space />
        <q-btn color="primary" icon="add" label="Ajouter un groupe" @click="openGroupDialog()" unelevated />
      </div>

      <q-table :rows="groupStore.groups" :columns="columns" row-key="id" :loading="groupStore.loading" flat bordered
        class="groups-table">
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn flat round color="secondary" icon="person_add" @click="openAssignDialog(props.row)" size="sm">
              <q-tooltip>Affecter des utilisateurs</q-tooltip>
            </q-btn>
            <q-btn flat round color="primary" icon="edit" @click="openGroupDialog(props.row)" size="sm">
              <q-tooltip>Modifier</q-tooltip>
            </q-btn>
            <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row)" size="sm">
              <q-tooltip>Supprimer</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogue Ajout/Edition -->
    <q-dialog v-model="groupDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEditing ? 'Modifier le groupe' : 'Ajouter un groupe' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="groupForm.name" label="Nom du groupe" outlined dense @keyup.enter="saveGroup" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn unelevated :label="isEditing ? 'Mettre à jour' : 'Créer'" color="primary" @click="saveGroup"
            :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogue Affectation -->
    <q-dialog v-model="assignDialog">
      <q-card style="min-width: 500px; max-height: 80vh">
        <q-card-section class="row items-center">
          <div class="text-h6">Affectation : {{ selectedGroup?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none scroll" style="height: 400px">
          <q-list separator v-if="!assignLoading">
            <q-item v-for="user in allUsers" :key="user.id">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" size="30px">
                  {{ user.firstName?.charAt(0).toUpperCase() }}{{ user.lastName?.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ user.firstName }} {{ user.lastName }}</q-item-label>
                <q-item-label caption>{{ user.username }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle :model-value="user.group === selectedGroup?.name" @update:model-value="toggleAssignment(user)"
                  color="secondary" />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-if="assignLoading" class="flex flex-center q-pa-lg">
            <q-spinner color="primary" size="40px" />
          </div>
          <div v-if="!assignLoading && allUsers.length === 0" class="text-center q-pa-lg text-grey">
            Aucun utilisateur trouvé
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, Dialog } from 'quasar';
import { useGroupModule } from '@/stores/group/groupModule';
import { getAllUsers, updateUser } from '@/stores/auth/authService';

definePageMeta({
  middleware: 'auth',
  roles: ['admin'],
});

const $q = useQuasar();
const groupStore = useGroupModule();
const saving = ref(false);
const groupDialog = ref(false);
const isEditing = ref(false);

const groupForm = ref({
  id: '',
  name: ''
});

const assignDialog = ref(false);
const selectedGroup = ref<any>(null);
const allUsers = ref<any[]>([]);
const assignLoading = ref(false);

const columns = [
  { name: 'name', label: 'Nom du groupe', field: 'name', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' }
];

const fetchGroups = async () => {
  await groupStore.fetchGroups();
};

const openGroupDialog = (group = null) => {
  if (group) {
    isEditing.value = true;
    groupForm.value = { ...group };
  } else {
    isEditing.value = false;
    groupForm.value = { id: '', name: '' };
  }
  groupDialog.value = true;
};

const saveGroup = async () => {
  if (!groupForm.value.name) {
    $q.notify({ type: 'warning', message: 'Le nom du groupe est requis' });
    return;
  }

  saving.value = true;
  try {
    if (isEditing.value) {
      // 1. Récupérer l'ancien nom pour mettre à jour les utilisateurs si nécessaire
      const oldGroup = groupStore.groups.find(g => g.id === groupForm.value.id);
      const oldName = oldGroup ? oldGroup.name : null;
      const newName = groupForm.value.name;

      // 2. Mettre à jour le groupe via l'API
      await groupStore.editGroup(groupForm.value.id, { name: newName });

      // 3. Si le nom a changé, on met à jour les utilisateurs qui étaient dans l'ancien groupe
      if (oldName && oldName !== newName) {
        try {
          const usersRes = await getAllUsers();
          const affectedUsers = (usersRes || []).filter((u: any) => u.group === oldName);

          if (affectedUsers.length > 0) {
            $q.notify({
              message: `Mise à jour de ${affectedUsers.length} utilisateur(s)...`,
              color: 'info',
              icon: 'sync',
              timeout: 1000
            });

            // Mise à jour séquentielle pour éviter de surcharger le serveur
            for (const user of affectedUsers) {
              await updateUser(user.id, { ...user, group: newName });
            }
          }
        } catch (err) {
          console.error('Erreur lors de la mise à jour des utilisateurs affectés:', err);
        }
      }

      $q.notify({ type: 'positive', message: 'Groupe mis à jour' });
    } else {
      await groupStore.addGroup({ name: groupForm.value.name });
      $q.notify({ type: 'positive', message: 'Groupe créé' });
    }
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
  const newGroup = isAssigned ? '' : selectedGroup.value.name;

  try {
    // On met à jour l'utilisateur via l'API
    await updateUser(user.id, { ...user, group: newGroup });
    // On met à jour l'état local pour le toggle
    user.group = newGroup;
    $q.notify({
      type: 'positive',
      message: isAssigned ? 'Utilisateur désinfecté' : 'Utilisateur affecté',
      timeout: 1000
    });
  } catch (error) {
    console.error('Erreur lors de l\'affectation', error);
  }
};

const confirmDelete = (group: any) => {
  Dialog.create({
    title: 'Confirmer la suppression',
    message: `Voulez-vous vraiment supprimer le groupe "${group.name}" ?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await groupStore.removeGroup(group.id);
    $q.notify({ type: 'positive', message: 'Groupe supprimé' });
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
