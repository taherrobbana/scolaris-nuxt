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
        <div class="col row q-col-gutter-sm justify-end">
          <!-- Session Type Filter -->
          <div class="col">
            <q-select
              v-model="filterType"
              :options="[
                { label: 'Cours', value: 'cours' },
                { label: 'TD / TP', value: 'workshop' },
                { label: 'Conférence / Spécial', value: 'conference' },
                { label: 'Examen', value: 'exam' },
              ]"
              emit-value
              map-options
              outlined
              dense
              label="Type de Séance"
              clearable
            >
              <template #prepend><q-icon name="category" size="xs" /></template>
            </q-select>
          </div>

          <!-- Specialty Filter -->
          <div class="col">
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
          <div class="col">
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
          <div class="col">
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
              <template #prepend
                ><q-icon name="menu_book" size="xs"
              /></template>
            </q-select>
          </div>

          <!-- Teacher Filter -->
          <div class="col">
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
      <!-- Conflicts Warning Banner -->
      <div v-if="allConflicts.length > 0" class="q-mb-lg">
        <q-banner
          inline-actions
          class="bg-red-1 text-red-9 rounded-borders border-red shadow-1 q-pa-md"
        >
          <template #avatar>
            <q-icon name="warning" color="negative" size="md" />
          </template>
          <div class="text-subtitle1 text-weight-bold">
            {{ allConflicts.length }} conflit(s) de planification détecté(s) !
          </div>
          <div>
            Certains enseignants ou groupes d'élèves ont plusieurs cours prévus
            sur les mêmes créneaux horaires.
          </div>
          <template #action>
            <q-btn
              v-if="isStaff"
              flat
              color="negative"
              label="Résoudre les conflits"
              no-caps
              icon="offline_pin"
              class="q-px-md bg-red-2 text-weight-bold"
              @click="showConflictsDialog = true"
            />
          </template>
        </q-banner>
      </div>

      <!-- Calendar Presenter -->
      <div
        v-if="planningStore.isLoading && events.length === 0"
        class="row justify-center q-my-xl"
      >
        <q-spinner-dots color="primary" size="40px" />
      </div>
      <div v-else>
        <MyCalender
          :key="calendarKey"
          :events="filteredEvents"
          @cell-dblclick="cellDblClick"
          @event-edit="onEditEvent"
          @event-drop="onEventDrop"
          @event-resize="onEventResize"
          @event-attendance="onEventAttendance"
          @event-delete="confirmDeleteEvent"
          @event-duplicate="onDuplicateEvent"
        />
      </div>
    </div>

    <!-- Edit / Add Event Dialog -->
    <q-dialog v-model="showEditEventDialog" persistent>
      <q-card style="min-width: 480px; border-radius: 16px" class="q-pa-sm">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold text-primary">
            {{ mode === "add" ? "Planifier une séance" : "Modifier la séance" }}
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
            :rules="[(v) => !!v || 'La spécialité est requise']"
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
            :rules="[(v) => !!v || 'La matière est requise']"
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
            :rules="[(v) => !!v || 'Le groupe est requis']"
            @update:model-value="onDialogGroupChange"
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
            :rules="[(v) => !!v || 'L\'enseignant est requis']"
          >
            <template #prepend><q-icon name="person" /></template>
          </q-select>

          <!-- Date de début -->
          <q-input
            outlined
            dense
            v-model="eventForm.start"
            label="Date et heure de début"
            :rules="[(v) => !!v || 'La date de début est requise']"
          >
            <template #prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="eventForm.start" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Fermer"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template #append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    v-model="eventForm.start"
                    mask="YYYY-MM-DD HH:mm"
                    format24h
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Fermer"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- Date de fin -->
          <q-input
            outlined
            dense
            v-model="eventForm.end"
            label="Date et heure de fin"
            :rules="[(v) => !!v || 'La date de fin est requise']"
          >
            <template #prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="eventForm.end" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Fermer"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template #append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    v-model="eventForm.end"
                    mask="YYYY-MM-DD HH:mm"
                    format24h
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Fermer"
                        color="primary"
                        flat
                      />
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
              { label: 'Cours', value: 'cours' },
              { label: 'TD / TP', value: 'workshop' },
              { label: 'Conférence / Spécial', value: 'conference' },
              { label: 'Examen', value: 'exam' },
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

    <!-- Dialog Conflits -->
    <q-dialog v-model="showConflictsDialog">
      <q-card
        style="min-width: 600px; max-width: 800px; border-radius: 16px"
        class="q-pa-sm"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold text-negative row items-center">
            <q-icon name="warning" color="negative" class="q-mr-sm" size="md" />
            Conflits de Planification Détectés
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section
          class="q-pt-md"
          style="max-height: 70vh; overflow-y: auto"
        >
          <div v-if="allConflicts.length === 0" class="text-center q-py-xl">
            <q-icon name="check_circle" color="positive" size="50px" />
            <div class="text-subtitle1 text-grey-8 q-mt-md">
              Aucun conflit détecté. Tout est en ordre !
            </div>
          </div>
          <div v-else class="q-gutter-y-md">
            <div
              v-for="conflict in allConflicts"
              :key="conflict.id"
              class="conflict-card q-pa-md rounded-borders bg-red-0"
              style="
                border: 1px solid #ffcdd2;
                border-left: 6px solid #f44336;
                border-radius: 8px;
              "
            >
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle2 text-weight-bold text-red-9">
                  <span v-if="conflict.type === 'teacher'">
                    👨‍🏫 Conflit Enseignant :
                    {{ getTeacherName(conflict.teacherId) }}
                  </span>
                  <span v-else-if="conflict.type === 'student'">
                    👥 Conflit Groupe : {{ getGroupName(conflict.groupId) }}
                  </span>
                  <span v-else> ⚠️ Double Conflit (Enseignant & Groupe) </span>
                </div>
                <div
                  class="text-caption text-grey-7 bg-red-1 q-px-sm q-py-xs rounded-borders"
                >
                  Créneaux qui se chevauchent
                </div>
              </div>

              <div class="row q-col-gutter-sm items-stretch">
                <!-- Event 1 Card -->
                <div class="col-12 col-sm-6">
                  <q-card
                    flat
                    bordered
                    class="column justify-between full-height q-pa-sm bg-white"
                  >
                    <div>
                      <div class="text-weight-bold text-primary">
                        {{ conflict.event1.title }}
                      </div>
                      <div class="text-caption text-grey-8 q-mt-xs">
                        <q-icon name="schedule" size="xs" class="q-mr-xs" />
                        {{
                          formatConflictTime(
                            conflict.event1.start,
                            conflict.event1.end,
                          )
                        }}
                      </div>
                      <div
                        v-if="conflict.event1.discription"
                        class="text-caption text-grey-6 text-italic q-mt-xs ellipsis-2-lines"
                      >
                        {{ conflict.event1.discription }}
                      </div>
                    </div>
                    <div class="row justify-end q-mt-md q-gutter-xs">
                      <q-btn
                        flat
                        dense
                        round
                        color="primary"
                        icon="edit"
                        @click="openEditConflictEvent(conflict.event1)"
                      >
                        <q-tooltip>Modifier la séance</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        dense
                        round
                        color="negative"
                        icon="delete"
                        @click="confirmDeleteEvent(conflict.event1)"
                      >
                        <q-tooltip>Supprimer la séance</q-tooltip>
                      </q-btn>
                    </div>
                  </q-card>
                </div>

                <!-- Event 2 Card -->
                <div class="col-12 col-sm-6">
                  <q-card
                    flat
                    bordered
                    class="column justify-between full-height q-pa-sm bg-white"
                  >
                    <div>
                      <div class="text-weight-bold text-primary">
                        {{ conflict.event2.title }}
                      </div>
                      <div class="text-caption text-grey-8 q-mt-xs">
                        <q-icon name="schedule" size="xs" class="q-mr-xs" />
                        {{
                          formatConflictTime(
                            conflict.event2.start,
                            conflict.event2.end,
                          )
                        }}
                      </div>
                      <div
                        v-if="conflict.event2.discription"
                        class="text-caption text-grey-6 text-italic q-mt-xs ellipsis-2-lines"
                      >
                        {{ conflict.event2.discription }}
                      </div>
                    </div>
                    <div class="row justify-end q-mt-md q-gutter-xs">
                      <q-btn
                        flat
                        dense
                        round
                        color="primary"
                        icon="edit"
                        @click="openEditConflictEvent(conflict.event2)"
                      >
                        <q-tooltip>Modifier la séance</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        dense
                        round
                        color="negative"
                        icon="delete"
                        @click="confirmDeleteEvent(conflict.event2)"
                      >
                        <q-tooltip>Supprimer la séance</q-tooltip>
                      </q-btn>
                    </div>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Fermer" color="grey" no-caps v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Appel / Présence -->
    <q-dialog v-model="showAttendanceDialog" persistent>
      <q-card style="min-width: 500px; border-radius: 16px" class="q-pa-sm">
        <q-card-section class="row items-center q-pb-none">
          <div class="column">
            <div class="text-h6 text-weight-bold text-teal">
              Feuille d'Appel
            </div>
            <div class="text-caption text-grey-7">
              {{ attendanceEvent?.subjectName || attendanceEvent?.title }} - {{ attendanceEvent?.groupName }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md" style="max-height: 60vh; overflow-y: auto">
          <div v-if="attendanceLoading" class="row justify-center q-my-xl">
            <q-spinner color="teal" size="40px" />
          </div>
          <div v-else>
            <div v-if="attendanceStudents.length === 0" class="text-center q-py-xl text-grey-7">
              <q-icon name="group_off" size="50px" class="q-mb-md" />
              <div>Aucun étudiant n'est inscrit dans ce groupe.</div>
            </div>
            <div v-else>
              <!-- Global Actions -->
              <div class="row justify-end q-mb-md q-gutter-x-sm">
                <q-btn
                  size="sm"
                  color="teal-1"
                  text-color="teal-9"
                  label="Tous présents"
                  no-caps
                  icon="check"
                  @click="markAll(true)"
                  unelevated
                />
                <q-btn
                  size="sm"
                  color="red-1"
                  text-color="red-9"
                  label="Tous absents"
                  no-caps
                  icon="close"
                  @click="markAll(false)"
                  unelevated
                />
              </div>

              <q-list bordered separator class="rounded-borders overflow-hidden">
                <q-item v-for="student in attendanceStudents" :key="student.id" class="q-py-sm">
                  <q-item-section avatar>
                    <q-avatar size="32px" color="teal" text-color="white">
                      {{ student.firstName?.charAt(0).toUpperCase() }}{{ student.lastName?.charAt(0).toUpperCase() }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ student.firstName }} {{ student.lastName }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ student.username }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="row items-center q-gutter-x-sm">
                      <q-btn
                        flat
                        round
                        dense
                        :color="getRecord(student.id)?.present ? 'positive' : 'grey-4'"
                        :icon="getRecord(student.id)?.present ? 'check_circle' : 'radio_button_unchecked'"
                        @click="toggleStudentPresence(student.id)"
                      >
                        <q-tooltip>{{ getRecord(student.id)?.present ? 'Présent' : 'Absent' }}</q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Annuler" color="grey" v-close-popup />
          <q-btn
            unelevated
            label="Enregistrer"
            color="teal"
            :loading="savingAttendance"
            :disable="attendanceStudents.length === 0"
            @click="saveAttendance"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Notify, useQuasar } from "quasar";
import MyCalender from "~/components/MyCalender.vue";
import { usePlanningModule } from "~/stores/planning/planningModule";
import { useSubjectModule } from "~/stores/subject/subjectModule";
import { useGroupModule } from "~/stores/group/groupModule";
import { useAuthModule } from "~/stores/auth/authModule";
import { getAllUsers } from "~/stores/auth/authService";
import { ALL_ROLES } from "~/utils/types";
import moment from "moment";

const authModule = useAuthModule();
const userRole = computed(() => authModule.getRole);
const isStaff = computed(
  () => userRole.value === "admin" || userRole.value === "coordinator",
);
const canTakeAttendance = computed(() => userRole.value !== "student");

const STANDARD_SLOTS = [
  { start: "08:30", end: "10:15" },
  { start: "10:30", end: "12:15" },
  { start: "12:30", end: "14:15" },
  { start: "14:30", end: "16:15" },
  { start: "16:30", end: "18:15" },
  { start: "18:15", end: "20:00" },
  { start: "20:00", end: "21:45" },
];

function snapToPlanningSlot(date: Date | string | moment.Moment): {
  start: moment.Moment;
  end: moment.Moment;
} {
  const mDate = moment(date);
  const dayStr = mDate.format("YYYY-MM-DD");
  const targetMinutes = mDate.hours() * 60 + mDate.minutes();

  let closestSlot = STANDARD_SLOTS[0];
  let minDiff = Infinity;

  for (const slot of STANDARD_SLOTS) {
    const [startH, startM] = slot.start.split(":").map(Number);
    const slotStartMinutes = startH * 60 + startM;
    const diff = Math.abs(targetMinutes - slotStartMinutes);
    if (diff < minDiff) {
      minDiff = diff;
      closestSlot = slot;
    }
  }

  const start = moment(`${dayStr} ${closestSlot.start}`, "YYYY-MM-DD HH:mm");
  const end = moment(`${dayStr} ${closestSlot.end}`, "YYYY-MM-DD HH:mm");
  return { start, end };
}

const { t } = useI18n();

definePageMeta({
  middleware: "auth",
  roles: ALL_ROLES,
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
const students = ref<any[]>([]);
const groupSpecialties = ref<any[]>([]);

const $q = useQuasar();
const showConflictsDialog = ref(false);

// Attendance / Roll call states
const showAttendanceDialog = ref(false);
const attendanceEvent = ref<any>(null);
const attendanceRecords = ref<any[]>([]);
const attendanceStudents = ref<any[]>([]);
const attendanceLoading = ref(false);
const savingAttendance = ref(false);

// Filter selections
const filterSpecialty = ref<string | null>(null);
const filterGroup = ref<string | null>(null);
const filterSubject = ref<string | null>(null);
const filterTeacher = ref<string | null>(null);
const filterType = ref<string | null>(null);

const calendarKey = ref(0);

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
  class: "cours",
});

const fetchGroupSpecialties = async () => {
  try {
    const res: any = await $fetch("/api/groups/specialties");
    groupSpecialties.value = res || [];
  } catch (err) {
    console.error("Failed to load group specialties", err);
  }
};

// Load all required data from stores & auth service
onMounted(async () => {
  await Promise.all([
    planningStore.loadPlanning(),
    subjectStore.loadSubjects(),
    groupStore.fetchGroups(),
    fetchGroupSpecialties(),
    loadUsers(),
  ]);
});

async function loadUsers() {
  try {
    const list = await getAllUsers();
    teachers.value = (list || []).filter((u: any) => u.role === "teacher");
    students.value = (list || []).filter((u: any) => u.role === "student");
  } catch (error) {
    console.error("Failed to load users", error);
  }
}

// ── Dropdowns / Options Computeds ──────────────────────────────────────────

// Specialties list populated from available subjects
const specialties = computed(() => {
  const specs = subjectStore.getSubjects
    .map((s) => s.specialty)
    .filter(Boolean);
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
    label: `${s.code} - ${s.name} (${s.specialty || "N/A"})`,
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
    const groupName = g.name || g.label || g.id;
    const value = g.id || g.name;

    // Resolve specialty from groupSpecialties mapping loaded from DB
    const mapping = groupSpecialties.value.find((m) => m.groupId === g.id);
    const specialty = mapping ? mapping.specialty : null;

    return { label: groupName, value: value, specialty: specialty };
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
    (g) => !g.specialty || g.specialty === filterSpecialty.value,
  );
});

// Subjects filtered by active specialty
const filteredSubjectOptions = computed(() => {
  if (!filterSpecialty.value) return subjectOptions.value;
  return subjectOptions.value.filter(
    (s) => s.specialty === filterSpecialty.value,
  );
});

// Final events list to pass to calendar component (filtered dynamically)
const events = computed(() => planningStore.getEvents);

// Get teacher name helper
function getTeacherName(teacherId: string | null | undefined) {
  if (!teacherId) return "";
  const t = teacherOptions.value.find((o) => o.value === teacherId);
  return t ? t.label : "Enseignant inconnu";
}

// Get group name helper
function getGroupName(groupId: string | null | undefined) {
  if (!groupId) return "";
  const g = groupOptions.value.find((o) => o.value === groupId);
  return g ? g.label : "Groupe inconnu";
}

// Detect conflicts globally across all events
const allConflicts = computed(() => {
  const list = events.value;
  const conflictsList: any[] = [];
  const checkedPairs = new Set<string>();

  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const e1 = list[i];
      const e2 = list[j];

      // Match conditions
      const sameTeacher =
        e1.teacherId && e2.teacherId && e1.teacherId === e2.teacherId;
      const sameGroup = e1.groupId && e2.groupId && e1.groupId === e2.groupId;

      if (!sameTeacher && !sameGroup) continue;

      // Check time overlap
      const start1 = moment(e1.start);
      const end1 = moment(e1.end);
      const start2 = moment(e2.start);
      const end2 = moment(e2.end);

      const overlap = start1.isBefore(end2) && start2.isBefore(end1);
      if (overlap) {
        const pairKey = [e1.id, e2.id].sort().join("-");
        if (!checkedPairs.has(pairKey)) {
          checkedPairs.add(pairKey);
          conflictsList.push({
            id: pairKey,
            type:
              sameTeacher && sameGroup
                ? "both"
                : sameTeacher
                  ? "teacher"
                  : "student",
            teacherId: sameTeacher ? e1.teacherId : null,
            groupId: sameGroup ? e1.groupId : null,
            event1: e1,
            event2: e2,
          });
        }
      }
    }
  }
  return conflictsList;
});

// Set of conflicted event IDs
const conflictedEventIds = computed(() => {
  const ids = new Set<string>();
  for (const c of allConflicts.value) {
    ids.add(c.event1.id);
    ids.add(c.event2.id);
  }
  return ids;
});

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
  if (filterType.value) {
    list = list.filter((e) => e.class === filterType.value);
  }

  const conflictIds = conflictedEventIds.value;

  // Format events to make sure start/end are parsed by vue-cal (YYYY-MM-DD HH:mm format)
  const sessionTypeLabels: Record<string, string> = {
    cours: "Cours",
    workshop: "TD / TP",
    conference: "Conférence / Spécial",
    exam: "Examen",
  };

  return list.map((e) => {
    const hasConflict = conflictIds.has(e.id);
    const baseClass = (e.class || "cours").split(" ")[0];
    const subject = subjectStore.getSubjects.find((s) => s.id === e.subjectId);
    const group = groupOptions.value.find((g) => g.value === e.groupId);

    return {
      ...e,
      // Vue-cal needs string dates or Date objects
      start: moment(e.start).format("YYYY-MM-DD HH:mm"),
      end: moment(e.end).format("YYYY-MM-DD HH:mm"),
      hasConflict,
      class: baseClass + (hasConflict ? " conflict-event" : ""),
      subjectName: subject ? subject.name : e.subjectId || "—",
      groupName: group ? group.label : e.groupId || "—",
      sessionTypeLabel: sessionTypeLabels[baseClass] || baseClass,
      teacherName: getTeacherName(e.teacherId),
    };
  });
});

function formatConflictTime(start: any, end: any) {
  const s = moment(start);
  const e = moment(end);
  if (s.isSame(e, "day")) {
    return `${s.format("DD/MM/YYYY")} de ${s.format("HH:mm")} à ${e.format("HH:mm")}`;
  }
  return `Du ${s.format("DD/MM/YYYY HH:mm")} au ${e.format("DD/MM/YYYY HH:mm")}`;
}

function openEditConflictEvent(event: any) {
  showConflictsDialog.value = false;
  onEditEvent(event);
}

function confirmDeleteEvent(event: any) {
  if (!isStaff.value) return;
  $q.dialog({
    title: "Confirmation de suppression",
    message: `Voulez-vous vraiment supprimer la séance "${event.title}" du planning ?`,
    persistent: true,
    ok: {
      label: "Supprimer",
      color: "negative",
      flat: true,
    },
    cancel: {
      label: "Annuler",
      color: "grey",
      flat: true,
    },
  }).onOk(async () => {
    try {
      await planningStore.removePlanning(event.id);
      Notify.create({
        type: "positive",
        message: "Séance supprimée avec succès",
        icon: "delete",
      });
      // Check if there are remaining conflicts, if not close dialog
      if (allConflicts.value.length === 0) {
        showConflictsDialog.value = false;
      }
    } catch (error) {
      Notify.create({
        type: "negative",
        message: "Erreur lors de la suppression",
        icon: "error",
      });
    }
  });
}

// ── Dialog Handlers ─────────────────────────────────────────────────────────

// When dialog specialty changes, make sure selected subject belongs to the specialty
function onDialogSpecialtyChange(newSpec: string) {
  eventForm.value.subjectId = "";
}

function onDialogGroupChange(newGroupId: string) {
  if (newGroupId) {
    const group = groupOptions.value.find((g) => g.value === newGroupId);
    if (group && group.specialty) {
      eventForm.value.specialty = group.specialty;
    }
  }
}

const dialogSubjectOptions = computed(() => {
  if (!eventForm.value.specialty) return subjectOptions.value;
  return subjectOptions.value.filter(
    (s) => s.specialty === eventForm.value.specialty,
  );
});

const dialogGroupOptions = computed(() => {
  if (!eventForm.value.specialty) return groupOptions.value;
  return groupOptions.value.filter(
    (g) => !g.specialty || g.specialty === eventForm.value.specialty,
  );
});

// Double click cell to create an event
function cellDblClick(date: Date) {
  if (!isStaff.value) return;
  mode.value = "add";
  const snapped = snapToPlanningSlot(date);
  const startStr = snapped.start.format("YYYY-MM-DD HH:mm");
  const endStr = snapped.end.format("YYYY-MM-DD HH:mm");

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
    class: "cours",
  };
  showEditEventDialog.value = true;
}

// Click edit on an event
function onEditEvent(event: any) {
  if (!isStaff.value) return;
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
    class: event.class || "cours",
  };
  showEditEventDialog.value = true;
}

// Click duplicate on an event
function onDuplicateEvent(event: any) {
  if (!isStaff.value) return;
  mode.value = "add";
  eventForm.value = {
    id: "", // Empty to trigger create
    start: moment(event.start).format("YYYY-MM-DD HH:mm"),
    end: moment(event.end).format("YYYY-MM-DD HH:mm"),
    title: event.title,
    subjectId: event.subjectId || "",
    groupId: event.groupId || "",
    teacherId: event.teacherId || "",
    specialty: event.specialty || "",
    discription: event.discription || "",
    class: event.class || "cours",
  };
  showEditEventDialog.value = true;
}

// Drag & drop reschedule
async function onEventDrop({ event, originalEvent }: any) {
  const index = events.value.findIndex((e) => e.id === originalEvent.id);
  if (index !== -1) {
    const original = events.value[index];
    const snapped = snapToPlanningSlot(event.start);
    const startStr = snapped.start.format("YYYY-MM-DD HH:mm");
    const endStr = snapped.end.format("YYYY-MM-DD HH:mm");

    const payload = {
      title: original.title,
      start: startStr,
      end: endStr,
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
      // Revert event times to original values
      event.start = originalEvent.start;
      event.end = originalEvent.end;
      calendarKey.value++;

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
  const snapped = snapToPlanningSlot(event.start);
  const startStr = snapped.start.format("YYYY-MM-DD HH:mm");
  const endStr = snapped.end.format("YYYY-MM-DD HH:mm");

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
    class: "cours",
  };
  showEditEventDialog.value = true;
}

// Save form handler (Add / Edit)
async function saveEvent() {
  if (!isStaff.value) return;
  if (
    !eventForm.value.specialty ||
    !eventForm.value.subjectId ||
    !eventForm.value.groupId ||
    !eventForm.value.teacherId
  ) {
    Notify.create({
      type: "negative",
      message: "Veuillez renseigner tous les champs obligatoires",
      icon: "warning",
    });
    return;
  }

  // Auto-generate title using subject name, teacher name, and group label
  const matchedSubject = subjectOptions.value.find(
    (s) => s.value === eventForm.value.subjectId,
  );
  const matchedTeacher = teacherOptions.value.find(
    (t) => t.value === eventForm.value.teacherId,
  );
  const matchedGroup = groupOptions.value.find(
    (g) => g.value === eventForm.value.groupId,
  );

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
    class: eventForm.value.class || "cours",
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
  if (!isStaff.value) return;
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

// Attendance handlers
async function onEventAttendance(calEvent: any) {
  if (!canTakeAttendance.value) return;
  attendanceEvent.value = calEvent;
  showAttendanceDialog.value = true;
  attendanceLoading.value = true;

  const matchedGroup = groupOptions.value.find((g) => g.value === calEvent.groupId);
  const groupName = matchedGroup ? matchedGroup.label : "";

  attendanceStudents.value = students.value.filter((s) => s.group === groupName);

  try {
    const HeaderRole = detectRoleFromHeader(`Bearer ${authModule.token}`);

    if (!HeaderRole) {
      throw createError({
        statusCode: 403,
        statusMessage:
          "Forbidden: Only coordinators, teachers, and admins can register attendance",
      });
    }
    const res: any = await $fetch(`/api/attendance`, {
      headers: {
        Authorization: `Bearer ${authModule.token}`,
      },
      params: { eventId: calEvent.id },
    });
    const dbRecords = res?.records || [];
    attendanceRecords.value = attendanceStudents.value.map((s) => {
      const dbRec = dbRecords.find((r: any) => r.studentId === s.id);
      return {
        studentId: s.id,
        present: dbRec ? dbRec.present : true,
      };
    });
  } catch (error) {
    console.error("Failed to load attendance", error);
    Notify.create({
      type: "negative",
      message: "Erreur lors de la récupération des présences",
    });
  } finally {
    attendanceLoading.value = false;
  }
}

function getRecord(studentId: string) {
  return attendanceRecords.value.find((r) => r.studentId === studentId);
}

function toggleStudentPresence(studentId: string) {
  const rec = getRecord(studentId);
  if (rec) {
    rec.present = !rec.present;
  }
}

function markAll(present: boolean) {
  attendanceRecords.value.forEach((r) => {
    r.present = present;
  });
}

async function saveAttendance() {
  if (!canTakeAttendance.value) return;
  if (!attendanceEvent.value) return;

  savingAttendance.value = true;
  try {
    await $fetch(`/api/attendance`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authModule.token}`,
      },
      body: {
        eventId: attendanceEvent.value.id,
        records: attendanceRecords.value,
      },
    });

    Notify.create({
      type: "positive",
      message: "Feuille d'appel enregistrée avec succès !",
      icon: "check_circle",
    });
    showAttendanceDialog.value = false;
  } catch (error) {
    console.error("Failed to save attendance", error);
    Notify.create({
      type: "negative",
      message: "Erreur lors de l'enregistrement de l'appel",
      icon: "error",
    });
  } finally {
    savingAttendance.value = false;
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
