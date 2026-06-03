<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <!-- Title & Main Filters -->
      <div class="row items-center justify-between q-mb-lg q-col-gutter-md">
        <div class="col-12 col-md-4">
          <div class="text-h5 text-primary text-weight-bold">
            Gestion du Planning
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Planification des cours par spécialité, groupe et enseignant
          </div>
        </div>

        <!-- Filters Bar -->
        <div class="col-12 col-md-8 row q-col-gutter-sm justify-end">
          <!-- Specialty Filter -->
          <div class="col-12 col-sm-3">
            <q-select
              v-model="filterSpecialty"
              :options="specialtyOptions"
              label="Spécialité"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="onFilterSpecialtyChange"
            >
              <template #prepend><q-icon name="school" size="xs" /></template>
            </q-select>
          </div>

          <!-- Group Filter -->
          <div class="col-12 col-sm-3">
            <q-select
              v-model="filterGroup"
              :options="filteredGroupOptions"
              label="Groupe"
              outlined
              dense
              clearable
              emit-value
              map-options
            >
              <template #prepend><q-icon name="groups" size="xs" /></template>
            </q-select>
          </div>

          <!-- Subject Filter -->
          <div class="col-12 col-sm-3">
            <q-select
              v-model="filterSubject"
              :options="filteredSubjectOptions"
              label="Matière"
              outlined
              dense
              clearable
              emit-value
              map-options
            >
              <template #prepend><q-icon name="menu_book" size="xs" /></template>
            </q-select>
          </div>

          <!-- Teacher Filter -->
          <div class="col-12 col-sm-3">
            <q-select
              v-model="filterTeacher"
              :options="teacherOptions"
              label="Enseignant"
              outlined
              dense
              clearable
              emit-value
              map-options
            >
              <template #prepend><q-icon name="person" size="xs" /></template>
            </q-select>
          </div>
        </div>
      </div>

      <q-separator class="q-mb-lg" />

      <!-- Calendar Presenter -->
      <div v-if="planningStore.isLoading && events.length === 0" class="row justify-center q-my-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>
      <div v-else>
        <MyCalender
          :events="filteredEvents"
          @cell-dblclick="cellDblClick"
          @event-edit="onEditEvent"
          @event-drop="onEventDrop"
          @event-resize="onEventResize"
        />
      </div>
    </div>

    <!-- Edit / Add Event Dialog -->
    <q-dialog v-model="showEditEventDialog" persistent>
      <q-card style="min-width: 480px; border-radius: 16px" class="q-pa-sm">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold text-primary">
            {{ mode === 'add' ? 'Planifier une séance' : 'Modifier la séance' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-y-md q-pt-md">
          <!-- Specialty Select -->
          <q-select
            v-model="eventForm.specialty"
            :options="dialogSpecialtyOptions"
            label="Spécialité"
            outlined
            dense
            :rules="[v => !!v || 'La spécialité est requise']"
            @update:model-value="onDialogSpecialtyChange"
          >
            <template #prepend><q-icon name="school" /></template>
          </q-select>

          <!-- Subject Select -->
          <q-select
            v-model="eventForm.subjectId"
            :options="dialogSubjectOptions"
            label="Matière"
            outlined
            dense
            emit-value
            map-options
            :rules="[v => !!v || 'La matière est requise']"
          >
            <template #prepend><q-icon name="menu_book" /></template>
          </q-select>

          <!-- Group Select -->
          <q-select
            v-model="eventForm.groupId"
            :options="dialogGroupOptions"
            label="Groupe"
            outlined
            dense
            emit-value
            map-options
            :rules="[v => !!v || 'Le groupe est requis']"
          >
            <template #prepend><q-icon name="groups" /></template>
          </q-select>

          <!-- Teacher Select -->
          <q-select
            v-model="eventForm.teacherId"
            :options="teacherOptions"
            label="Enseignant"
            outlined
            dense
            emit-value
            map-options
            :rules="[v => !!v || 'L\'enseignant est requis']"
          >
            <template #prepend><q-icon name="person" /></template>
          </q-select>

          <!-- Date de début -->
          <q-input outlined dense v-model="eventForm.start" label="Date et heure de début" :rules="[v => !!v || 'La date de début est requise']">
            <template #prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="eventForm.start" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fermer" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template #append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="eventForm.start" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fermer" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- Date de fin -->
          <q-input outlined dense v-model="eventForm.end" label="Date et heure de fin" :rules="[v => !!v || 'La date de fin est requise']">
            <template #prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="eventForm.end" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fermer" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template #append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="eventForm.end" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fermer" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- Class/Style Category -->
          <q-select
            v-model="eventForm.class"
            :options="[
              { label: 'Cours Standard (Meeting)', value: 'meeting' },
              { label: 'TD / TP (Workshop)', value: 'workshop' },
              { label: 'Conférence / Spécial (Conference)', value: 'conference' }
            ]"
            emit-value
            map-options
            outlined
            dense
            label="Type de Séance"
          >
            <template #prepend><q-icon name="category" /></template>
          </q-select>

          <!-- Description -->
          <q-input
            v-model="eventForm.discription"
            label="Description / Salle / Notes"
            outlined
            dense
            type="textarea"
            rows="2"
            autogrow
          >
            <template #prepend><q-icon name="notes" /></template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md q-gutter-x-sm">
          <q-btn
            v-if="mode === 'edit'"
            flat
            label="Supprimer"
            color="negative"
            no-caps
            @click="deleteEvent"
          />
          <q-btn flat label="Annuler" color="grey" no-caps v-close-popup />
          <q-btn
            unelevated
            label="Enregistrer"
            color="primary"
            no-caps
            rounded
            @click="saveEvent"
            :loading="planningStore.isLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Notify } from "quasar";
import MyCalender from "~/components/vue-cal/MyCalender.vue";
import { usePlanningModule } from "~/stores/planning/planningModule";
import { useSubjectModule } from "~/stores/subject/subjectModule";
import { useGroupModule } from "~/stores/group/groupModule";
import { getAllUsers } from "~/stores/auth/authService";
import { ALL_ROLES } from "~/utils/types";
import moment from "moment";

const { t } = useI18n();

definePageMeta({
  middleware: "auth",
  roles: ALL_ROLES
});

useHead({
  title: computed(() => t("useHead.planning")),
});

// Stores
const planningStore = usePlanningModule();
const subjectStore = useSubjectModule();
const groupStore = useGroupModule();

// Reactive data lists loaded from API
const teachers = ref<any[]>([]);

// Filter selections
const filterSpecialty = ref<string | null>(null);
const filterGroup = ref<string | null>(null);
const filterSubject = ref<string | null>(null);
const filterTeacher = ref<string | null>(null);

// Dialog form states
const showEditEventDialog = ref(false);
const mode = ref("add");
const eventForm = ref({
  id: "",
  start: "",
  end: "",
  title: "",
  subjectId: "",
  groupId: "",
  teacherId: "",
  specialty: "",
  discription: "",
  class: "meeting",
});

// Load all required data from stores & auth service
onMounted(async () => {
  await Promise.all([
    planningStore.loadPlanning(),
    subjectStore.loadSubjects(),
    groupStore.fetchGroups(),
    loadTeachers(),
  ]);
});

async function loadTeachers() {
  try {
    const list = await getAllUsers();
    teachers.value = (list || []).filter((u: any) => u.role === "teacher");
  } catch (error) {
    console.error("Failed to load teachers", error);
  }
}

// ── Dropdowns / Options Computeds ──────────────────────────────────────────

// Specialties list populated from available subjects
const specialties = computed(() => {
  const specs = subjectStore.getSubjects.map((s) => s.specialty).filter(Boolean);
  return Array.from(new Set(specs)) as string[];
});

const specialtyOptions = computed(() => {
  return specialties.value.map((spec) => ({ label: spec, value: spec }));
});

const dialogSpecialtyOptions = computed(() => {
  return specialties.value; // Simple string array for direct Quasar dialog selection
});

// Subjects Options
const subjectOptions = computed(() => {
  return subjectStore.getSubjects.map((s) => ({
    label: `${s.code} - ${s.name} (${s.specialty || 'N/A'})`,
    value: s.id,
    specialty: s.specialty,
    name: s.name,
  }));
});

// Groups Options
const groupOptions = computed(() => {
  return groupStore.groups.map((g) => {
    if (typeof g === "string") {
      return { label: g, value: g, specialty: null };
    }
    // We guess the specialty if the group name contains or matches a specialty keyword
    const groupName = g.name || g.label || g.id;
    const value = g.id || g.name;
    
    // Attempt matching specialty in name
    let matchedSpec = null;
    for (const spec of specialties.value) {
      if (groupName.toLowerCase().includes(spec.toLowerCase())) {
        matchedSpec = spec;
        break;
      }
    }
    return { label: groupName, value: value, specialty: matchedSpec };
  });
});

// Teachers Options
const teacherOptions = computed(() => {
  return teachers.value.map((t) => ({
    label: `${t.firstName} ${t.lastName}`,
    value: t.id,
  }));
});

// ── Filters Handling ────────────────────────────────────────────────────────

// When specialty filter changes, clear other dependent filters
function onFilterSpecialtyChange() {
  filterGroup.value = null;
  filterSubject.value = null;
}

// Groups filtered by active specialty
const filteredGroupOptions = computed(() => {
  if (!filterSpecialty.value) return groupOptions.value;
  return groupOptions.value.filter(
    (g) => !g.specialty || g.specialty === filterSpecialty.value
  );
});

// Subjects filtered by active specialty
const filteredSubjectOptions = computed(() => {
  if (!filterSpecialty.value) return subjectOptions.value;
  return subjectOptions.value.filter((s) => s.specialty === filterSpecialty.value);
});

// Final events list to pass to calendar component (filtered dynamically)
const events = computed(() => planningStore.getEvents);

const filteredEvents = computed(() => {
  let list = events.value;

  if (filterSpecialty.value) {
    list = list.filter((e) => e.specialty === filterSpecialty.value);
  }
  if (filterGroup.value) {
    list = list.filter((e) => e.groupId === filterGroup.value);
  }
  if (filterSubject.value) {
    list = list.filter((e) => e.subjectId === filterSubject.value);
  }
  if (filterTeacher.value) {
    list = list.filter((e) => e.teacherId === filterTeacher.value);
  }

  // Format events to make sure start/end are parsed by vue-cal (YYYY-MM-DD HH:mm format)
  return list.map((e) => ({
    ...e,
    // Vue-cal needs string dates or Date objects
    start: moment(e.start).format("YYYY-MM-DD HH:mm"),
    end: moment(e.end).format("YYYY-MM-DD HH:mm"),
  }));
});

// ── Dialog Handlers ─────────────────────────────────────────────────────────

// When dialog specialty changes, make sure selected subject belongs to the specialty
function onDialogSpecialtyChange(newSpec: string) {
  eventForm.value.subjectId = "";
}

const dialogSubjectOptions = computed(() => {
  if (!eventForm.value.specialty) return subjectOptions.value;
  return subjectOptions.value.filter((s) => s.specialty === eventForm.value.specialty);
});

const dialogGroupOptions = computed(() => {
  if (!eventForm.value.specialty) return groupOptions.value;
  return groupOptions.value.filter(
    (g) => !g.specialty || g.specialty === eventForm.value.specialty
  );
});

// Double click cell to create an event
function cellDblClick(date: Date) {
  mode.value = "add";
  const startStr = moment(date).format("YYYY-MM-DD HH:mm");
  const endStr = moment(date).add(1, "hours").format("YYYY-MM-DD HH:mm");

  eventForm.value = {
    id: "",
    start: startStr,
    end: endStr,
    title: "",
    subjectId: "",
    groupId: "",
    teacherId: "",
    specialty: filterSpecialty.value || "",
    discription: "",
    class: "meeting",
  };
  showEditEventDialog.value = true;
}

// Click edit on an event
function onEditEvent(event: any) {
  mode.value = "edit";
  eventForm.value = {
    id: event.id,
    start: moment(event.start).format("YYYY-MM-DD HH:mm"),
    end: moment(event.end).format("YYYY-MM-DD HH:mm"),
    title: event.title,
    subjectId: event.subjectId || "",
    groupId: event.groupId || "",
    teacherId: event.teacherId || "",
    specialty: event.specialty || "",
    discription: event.discription || "",
    class: event.class || "meeting",
  };
  showEditEventDialog.value = true;
}

// Drag & drop reschedule
async function onEventDrop({ event, originalEvent }: any) {
  const index = events.value.findIndex((e) => e.id === originalEvent.id);
  if (index !== -1) {
    const original = events.value[index];
    const payload = {
      title: original.title,
      start: moment(event.start).format("YYYY-MM-DD HH:mm"),
      end: moment(event.end).format("YYYY-MM-DD HH:mm"),
      subjectId: original.subjectId,
      groupId: original.groupId,
      teacherId: original.teacherId,
      specialty: original.specialty,
      discription: original.discription,
      class: original.class,
    };
    try {
      await planningStore.editPlanning(original.id, payload);
      Notify.create({
        type: "positive",
        message: "Séance déplacée avec succès",
        icon: "check_circle",
      });
    } catch (err) {
      Notify.create({
        type: "negative",
        message: "Erreur lors du déplacement",
        icon: "error",
      });
    }
  }
}

// Resize event
async function onEventResize({ event, originalEvent }: any) {
  const index = events.value.findIndex((e) => e.id === originalEvent.id);
  if (index !== -1) {
    const original = events.value[index];
    const payload = {
      title: original.title,
      start: moment(event.start).format("YYYY-MM-DD HH:mm"),
      end: moment(event.end).format("YYYY-MM-DD HH:mm"),
      subjectId: original.subjectId,
      groupId: original.groupId,
      teacherId: original.teacherId,
      specialty: original.specialty,
      discription: original.discription,
      class: original.class,
    };
    try {
      await planningStore.editPlanning(original.id, payload);
      Notify.create({
        type: "positive",
        message: "Durée de la séance mise à jour",
        icon: "check_circle",
      });
    } catch (err) {
      Notify.create({
        type: "negative",
        message: "Erreur lors de la mise à jour",
        icon: "error",
      });
    }
  }
}

// Drag create trigger
function onEventDragCreate(event: any) {
  mode.value = "add";
  const startStr = moment(event.start).format("YYYY-MM-DD HH:mm");
  const endStr = moment(event.end).format("YYYY-MM-DD HH:mm");

  eventForm.value = {
    id: "",
    start: startStr,
    end: endStr,
    title: "",
    subjectId: "",
    groupId: "",
    teacherId: "",
    specialty: filterSpecialty.value || "",
    discription: "",
    class: "meeting",
  };
  showEditEventDialog.value = true;
}

// Save form handler (Add / Edit)
async function saveEvent() {
  if (!eventForm.value.specialty || !eventForm.value.subjectId || !eventForm.value.groupId || !eventForm.value.teacherId) {
    Notify.create({
      type: "negative",
      message: "Veuillez renseigner tous les champs obligatoires",
      icon: "warning",
    });
    return;
  }

  // Auto-generate title using subject name, teacher name, and group label
  const matchedSubject = subjectOptions.value.find((s) => s.value === eventForm.value.subjectId);
  const matchedTeacher = teacherOptions.value.find((t) => t.value === eventForm.value.teacherId);
  const matchedGroup = groupOptions.value.find((g) => g.value === eventForm.value.groupId);

  const subjectName = matchedSubject ? matchedSubject.name : "Cours";
  const teacherName = matchedTeacher ? matchedTeacher.label : "Enseignant";
  const groupName = matchedGroup ? matchedGroup.label : "Groupe";

  const generatedTitle = `${subjectName} (${teacherName}) - ${groupName}`;

  const payload = {
    title: generatedTitle,
    start: eventForm.value.start,
    end: eventForm.value.end,
    subjectId: eventForm.value.subjectId,
    groupId: eventForm.value.groupId,
    teacherId: eventForm.value.teacherId,
    specialty: eventForm.value.specialty,
    discription: eventForm.value.discription?.trim() || "",
    class: eventForm.value.class || "meeting",
  };

  try {
    if (mode.value === "add") {
      await planningStore.addPlanning(payload);
      Notify.create({
        type: "positive",
        message: "Séance planifiée avec succès",
        icon: "check_circle",
      });
    } else {
      await planningStore.editPlanning(eventForm.value.id, payload);
      Notify.create({
        type: "positive",
        message: "Séance modifiée avec succès",
        icon: "check_circle",
      });
    }
    showEditEventDialog.value = false;
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Erreur lors de la sauvegarde",
      icon: "error",
    });
  }
}

// Delete scheduling event
async function deleteEvent() {
  try {
    await planningStore.removePlanning(eventForm.value.id);
    Notify.create({
      type: "positive",
      message: "Séance supprimée du planning",
      icon: "delete",
    });
    showEditEventDialog.value = false;
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Erreur lors de la suppression",
      icon: "error",
    });
  }
}
</script>

<style scoped>
.myCard {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 18px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06);
}

.body--dark .myCard {
  background: rgba(30, 30, 50, 0.85);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
}
</style>
