<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <div class="row items-center q-mb-lg">
        <div class="text-h5 text-primary text-weight-bold">{{ $t('admin.users.title') }}</div>
        <q-space />
        <q-btn color="secondary" icon="group_add" :label="$t('admin.users.bulkCreate')" @click="showBulkDialog = true"
          class="q-mr-sm" unelevated />
        <q-btn color="primary" icon="add" :label="$t('admin.users.add')" @click="openEditDialog()" unelevated />
      </div>
      <q-table :rows="users" :columns="columns" row-key="id" :loading="loading" :filter="filter" flat bordered
        class="users-table">
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('admin.users.search')">
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
              {{ $t(`admin.users.roles.${props.row.role}`) }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn flat round color="primary" icon="edit" @click="openEditDialog(props.row)" size="sm">
              <q-tooltip>{{ $t('admin.users.edit') }}</q-tooltip>
            </q-btn>
            <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row)" size="sm">
              <q-tooltip>{{ $t('admin.users.delete') }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogue Edition/Ajout -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEditing ? $t('admin.users.editUser') : $t('admin.users.addUser') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="editForm.firstName" :label="$t('admin.users.firstName')" outlined dense />
          <q-input v-model="editForm.lastName" :label="$t('admin.users.lastName')" outlined dense />
          <q-input v-model="editForm.username" :label="$t('admin.users.email')" outlined dense :disable="isEditing" />
          <q-input v-if="!isEditing" v-model="editForm.password" :label="$t('admin.users.password')" type="password" outlined dense />

          <q-select v-model="editForm.role" :options="roleOptions" :label="$t('admin.users.role')" outlined dense emit-value map-options />
          <q-select v-model="editForm.group" :options="groupOptions" :label="$t('admin.users.group')" outlined dense emit-value
            map-options />
          <q-input v-model="editForm.avatar" :label="$t('admin.users.avatarUrl')" outlined dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('admin.users.cancel')" color="primary" v-close-popup />
          <q-btn unelevated :label="isEditing ? $t('admin.users.update') : $t('admin.users.create')" color="primary" @click="saveUser"
            :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogue Bulk -->
    <q-dialog v-model="showBulkDialog">
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">{{ $t('admin.users.bulkTitle') }}</div>
          <div class="text-caption text-grey-7 q-mt-sm">
            {{ $t('admin.users.bulkSubtitle') }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <q-file v-model="excelFile" :label="$t('admin.users.importExcel')" outlined dense
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
          <q-btn flat :label="$t('admin.users.cancel')" color="primary" v-close-popup />
          <q-btn unelevated :label="$t('admin.users.import')" color="secondary" @click="handleBulkUpload" :loading="bulkLoading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar, Dialog } from 'quasar';
import { useI18n } from 'vue-i18n';
import * as XLSX from 'xlsx';
import { getAllUsers, updateUser, bulkCreateUsers, register } from '@/stores/auth/authService';
import { useGroupModule } from '@/stores/group/groupModule';

definePageMeta({
  middleware: 'auth',
  roles: ['admin'],
});

const $q = useQuasar();
const { t } = useI18n();
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

const columns = computed(() => [
  { name: 'avatar', label: '', field: 'avatar', align: 'left' },
  { name: 'username', label: t('admin.users.columns.email'), field: 'username', align: 'left', sortable: true },
  { name: 'firstName', label: t('admin.users.columns.firstName'), field: 'firstName', align: 'left', sortable: true },
  { name: 'lastName', label: t('admin.users.columns.lastName'), field: 'lastName', align: 'left', sortable: true },
  { name: 'role', label: t('admin.users.columns.role'), field: 'role', align: 'center', sortable: true },
  { name: 'group', label: t('admin.users.columns.group'), field: 'group', align: 'left', sortable: true },
  { name: 'actions', label: t('admin.users.columns.actions'), align: 'center' }
]);

const roleOptions = computed(() => [
  { label: t('admin.users.roles.student'), value: 'student' },
  { label: t('admin.users.roles.teacher'), value: 'teacher' },
  { label: t('admin.users.roles.admin'), value: 'admin' },
  { label: t('admin.users.roles.coordinator'), value: 'coordinator' }
]);

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
      $q.notify({ type: 'positive', message: t('admin.users.successUpdate') });
    } else {
      await register(editForm.value);
      $q.notify({ type: 'positive', message: t('admin.users.successCreate') });
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
    $q.notify({ type: 'positive', message: t('admin.users.successImport') });
    showBulkDialog.value = false;
    bulkJson.value = '';
    excelFile.value = null;
    fetchUsers();
  } catch (e: any) {
    $q.notify({ type: 'negative', message: t('admin.users.invalidJson') });
  } finally {
    bulkLoading.value = false;
  }
};

const confirmDelete = (user: any) => {
  Dialog.create({
    title: t('admin.users.confirmDeleteTitle'),
    message: t('admin.users.confirmDeleteMessage', { name: `${user.firstName} ${user.lastName}` }),
    cancel: true,
    persistent: true
  }).onOk(() => {
    $q.notify({ message: t('admin.users.deleteNotImplemented'), color: 'warning' });
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
