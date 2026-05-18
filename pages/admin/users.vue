<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <div class="row items-center q-mb-lg">
        <div class="text-h5 text-primary text-weight-bold">Gestion des utilisateurs</div>
        <q-space />
        <q-btn color="secondary" icon="group_add" label="Création en masse" @click="showBulkDialog = true"
          class="q-mr-sm" unelevated />
        <q-btn color="primary" icon="add" label="Ajouter" @click="openEditDialog()" unelevated />
      </div>
      <q-table :rows="users" :columns="columns" row-key="id" :loading="loading" :filter="filter" flat bordered
        class="users-table">
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Rechercher">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-avatar="props">
          <q-td :props="props">
            <q-avatar size="30px">
              <img v-if="props.row.avatar" :src="props.row.avatar" />
              <q-avatar v-else color="primary" text-color="white" size="30px">
                {{ props.row.firstName?.charAt(0).toUpperCase() }}{{ props.row.lastName?.charAt(0).toUpperCase() }}
              </q-avatar>
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-chip :color="getRoleColor(props.row.role)" text-color="white" dense class="text-weight-medium">
              {{ props.row.role }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn flat round color="primary" icon="edit" @click="openEditDialog(props.row)" size="sm">
              <q-tooltip>Modifier</q-tooltip>
            </q-btn>
            <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row)" size="sm">
              <q-tooltip>Supprimer</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogue Edition/Ajout -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEditing ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="editForm.firstName" label="Prénom" outlined dense />
          <q-input v-model="editForm.lastName" label="Nom" outlined dense />
          <q-input v-model="editForm.username" label="Email" outlined dense :disable="isEditing" />
          <q-input v-if="!isEditing" v-model="editForm.password" label="Mot de passe" type="password" outlined dense />

          <q-select v-model="editForm.role" :options="roleOptions" label="Rôle" outlined dense emit-value map-options />
          <q-select v-model="editForm.group" :options="groupOptions" label="Groupe" outlined dense emit-value
            map-options />
          <q-input v-model="editForm.avatar" label="URL Avatar" outlined dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn unelevated :label="isEditing ? 'Mettre à jour' : 'Créer'" color="primary" @click="saveUser"
            :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogue Bulk -->
    <q-dialog v-model="showBulkDialog">
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">Création en masse</div>
          <div class="text-caption text-grey-7 q-mt-sm">
            Collez ici une liste d'utilisateurs au format JSON ou importez un fichier Excel.
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <q-file v-model="excelFile" label="Importer un fichier Excel (.xlsx, .xls)" outlined dense
              accept=".xlsx, .xls" @update:model-value="processExcel">
              <template v-slot:prepend>
                <q-icon name="upload_file" />
              </template>
              <template v-slot:append>
                <q-btn flat round dense icon="close" @click.stop.prevent="excelFile = null" v-if="excelFile" />
              </template>
            </q-file>
          </div>
          <q-input v-model="bulkJson" type="textarea" label="JSON Payload" outlined placeholder='[{
  "username": "",
  "password": "",
  "firstName": "",
  "lastName": "",
  "role": "",
  "group": ""
}]' rows="10" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn unelevated label="Importer" color="secondary" @click="handleBulkUpload" :loading="bulkLoading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar, Dialog } from 'quasar';
import * as XLSX from 'xlsx';
import { getAllUsers, updateUser, bulkCreateUsers, register } from '@/stores/auth/authService';
import { useGroupModule } from '@/stores/group/groupModule';

definePageMeta({
  middleware: 'auth',
  roles: ['admin'],
});

const $q = useQuasar();
const users = ref<any[]>([]);
const loading = ref(false);
const filter = ref('');
const saving = ref(false);
const bulkLoading = ref(false);

const editDialog = ref(false);
const isEditing = ref(false);
const showBulkDialog = ref(false);
const bulkJson = ref('');
const excelFile = ref<any>(null);
const groupStore = useGroupModule();

const processExcel = (file: any) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    bulkJson.value = JSON.stringify(json, null, 2);
  };
  reader.readAsArrayBuffer(file);
};

const editForm = ref({
  id: '',
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'student',
  group: '',
  avatar: ''
});

const columns = [
  { name: 'avatar', label: '', field: 'avatar', align: 'left' },
  { name: 'username', label: 'Email', field: 'username', align: 'left', sortable: true },
  { name: 'firstName', label: 'Prénom', field: 'firstName', align: 'left', sortable: true },
  { name: 'lastName', label: 'Nom', field: 'lastName', align: 'left', sortable: true },
  { name: 'role', label: 'Rôle', field: 'role', align: 'center', sortable: true },
  { name: 'group', label: 'Groupe', field: 'group', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' }
];

const roleOptions = [
  { label: 'Étudiant', value: 'student' },
  { label: 'Enseignant', value: 'teacher' },
  { label: 'Administrateur', value: 'admin' },
  { label: 'Coordinateur', value: 'coordinator' }
];

const groupOptions = computed(() => {
  return groupStore.groups.map(g => {
    if (typeof g === 'string') return { label: g, value: g };
    return { label: g.name || g.label || g.id, value: g.name || g.id };
  });
});

const fetchGroups = async () => {
  await groupStore.fetchGroups();
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await getAllUsers();
    users.value = res || [];
  } finally {
    loading.value = false;
  }
};

const openEditDialog = (user = null) => {
  if (user) {
    isEditing.value = true;
    editForm.value = { ...user };
  } else {
    isEditing.value = false;
    editForm.value = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'student',
      group: '',
      avatar: ''
    };
  }
  editDialog.value = true;
};

const saveUser = async () => {
  saving.value = true;
  try {
    if (isEditing.value) {
      await updateUser(editForm.value.id, editForm.value);
      $q.notify({ type: 'positive', message: 'Utilisateur mis à jour' });
    } else {
      await register(editForm.value);
      $q.notify({ type: 'positive', message: 'Utilisateur créé' });
    }
    editDialog.value = false;
    fetchUsers();
  } finally {
    saving.value = false;
  }
};

const handleBulkUpload = async () => {
  try {
    const data = JSON.parse(bulkJson.value);
    if (!Array.isArray(data)) throw new Error('Le format doit être un tableau');

    bulkLoading.value = true;
    await bulkCreateUsers(data);
    $q.notify({ type: 'positive', message: 'Importation réussie' });
    showBulkDialog.value = false;
    bulkJson.value = '';
    excelFile.value = null;
    fetchUsers();
  } catch (e: any) {
    $q.notify({ type: 'negative', message: 'Format JSON invalide' });
  } finally {
    bulkLoading.value = false;
  }
};

const confirmDelete = (user: any) => {
  Dialog.create({
    title: 'Confirmer la suppression',
    message: `Voulez-vous vraiment supprimer ${user.firstName} ${user.lastName} ?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // API delete non spécifiée par l'utilisateur, mais on pourrait l'ajouter
    // TODO
    $q.notify({ message: 'Fonction de suppression non implémentée côté serveur', color: 'warning' });
  });
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'negative';
    case 'teacher': return 'warning';
    case 'coordinator': return 'info';
    default: return 'primary';
  }
};

onMounted(() => {
  fetchUsers();
  fetchGroups();
});
</script>

<style scoped>
.users-table {
  background: white;
  border-radius: 12px;
}

.myCard {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}
</style>
