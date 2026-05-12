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
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, Dialog } from 'quasar';
import { useGroupModule } from '@/stores/group/groupModule';

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
      await groupStore.editGroup(groupForm.value.id, { name: groupForm.value.name });
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
