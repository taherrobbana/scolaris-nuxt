<template>
  <client-only>
    <vue-cal
      :class="{ 'vuecal--dark': isDarkActive }"
      :disable-views="['year', 'years']"
      v-model:active-view="currentView"
      :dblclick-to-navigate="currentView === 'month'"
      default-view="week"
      :timeStep="60"
      :eventsOnMonthView="false"
      small
      @cell-dblclick="onCellDblClick"
      :events="events"
      :time-from="8 * 60 + 30"
      :time-to="22 * 60 + 30"
      :locale="getLanguage"
      today-button
      :today-button-style="{ color: 'white', border: '1px solid white' }"
      :editable-events="editableEventsConfig"
      :drag-to-create-event="false"
      @event-drag-create="emit('event-drag-create', $event)"
      @event-drop="emit('event-drop', $event)"
      :disable-drag="!isStaff"
      :drag-to-create-threshold="10"
      :drag-to-move-threshold="10"
      :snap-to-time="60"
      :drag-to-move-events="{ enable: isStaff }"
      :event-editable="false"
      @event-title-change="emit('event-title-change', $event)"
      @event-resize="emit('event-resize', $event)"
      @event-duration-change="emit('event-duration-change', $event)"
      @event-drag-start="emit('event-drag-start', $event)"
      @event-drag-end="emit('event-drag-end', $event)"
    >
      <!-- Slot personnalisé pour les événements -->
      <template #event="{ event }">
        <div style="display: grid">
          <span class="text-weight-bold" style="overflow: hidden">
            {{ event.subjectName || event.title }}
          </span>
          <span class="vuecal__event-time" style="overflow: hidden">
            {{ formatDate(event.start, "YYYY-MM-DD HH:mm", "HH:mm") }} -
            {{ formatDate(event.end, "YYYY-MM-DD HH:mm", "HH:mm") }}
          </span>
        </div>
        <q-badge
          v-if="isStaff"
          rounded
          floating
          class="edit-badge shadow-2"
          @click.stop="emit('event-edit', event)"
          :style="{
            backgroundColor: event.hasConflict
              ? 'var(--q-negative)'
              : getBadgeColor(event.class),
            color: 'white',
          }"
        >
          <q-icon
            :name="event.hasConflict ? 'warning' : 'edit'"
            color="white"
            size="12px"
          />
          <q-tooltip>Modifier</q-tooltip>
        </q-badge>
        <q-badge
          v-if="!isStudent"
          rounded
          floating
          class="attendance-badge shadow-2"
          @click.stop="emit('event-attendance', event)"
          :style="{
            backgroundColor: event.hasConflict
              ? 'var(--q-negative)'
              : getBadgeColor(event.class),
            color: 'white',
          }"
        >
          <q-icon name="how_to_reg" color="white" size="12px" />
          <q-tooltip>Faire l'appel</q-tooltip>
        </q-badge>
        <q-badge
          v-if="isTeacher && canGradeEvent(event)"
          rounded
          floating
          class="grades-badge shadow-2"
          @click.stop="emit('event-grades', event)"
          :style="{
            backgroundColor: event.hasConflict
              ? 'var(--q-negative)'
              : getBadgeColor(event.class),
            color: 'white',
          }"
        >
          <q-icon name="grade" color="white" size="12px" />
          <q-tooltip>Saisir les notes</q-tooltip>
        </q-badge>
        <q-tooltip
          class="bg-transparent q-pa-none shadow-0"
          transition-show="fade"
          transition-hide="fade"
        >
          <div class="custom-tooltip-card text-white">
            <div
              v-if="event.hasConflict"
              class="tooltip-conflict-banner q-px-md q-py-xs text-weight-bold text-center row items-center justify-center"
            >
              <q-icon name="warning" size="14px" class="q-mr-xs" />
              <span>CONFLIT DÉTECTÉ</span>
            </div>

            <div class="tooltip-body q-pa-md q-gutter-y-sm">
              <div class="row items-center no-wrap tooltip-item">
                <q-icon
                  name="menu_book"
                  size="16px"
                  color="blue-3"
                  class="q-mr-sm"
                />
                <div class="ellipsis">
                  <span class="text-grey-4 text-weight-medium">Matière :</span>
                  <span class="text-white text-weight-bold q-ml-xs">{{
                    event.subjectName || event.title
                  }}</span>
                </div>
              </div>

              <div class="row items-center no-wrap tooltip-item">
                <q-icon
                  name="access_time"
                  size="16px"
                  color="amber-3"
                  class="q-mr-sm"
                />
                <div>
                  <span class="text-white text-weight-bold">
                    {{ formatDate(event.start, "YYYY-MM-DD HH:mm", "HH:mm") }} -
                    {{ formatDate(event.end, "YYYY-MM-DD HH:mm", "HH:mm") }}
                  </span>
                </div>
              </div>

              <div class="row items-center no-wrap tooltip-item">
                <q-icon
                  name="person"
                  size="16px"
                  color="orange-3"
                  class="q-mr-sm"
                />
                <div class="ellipsis">
                  <span class="text-grey-4 text-weight-medium"
                    >Enseignant :</span
                  >
                  <span class="text-white q-ml-xs">{{
                    event.teacherName || "—"
                  }}</span>
                </div>
              </div>

              <div class="row items-center no-wrap tooltip-item">
                <q-icon
                  name="group"
                  size="16px"
                  color="green-3"
                  class="q-mr-sm"
                />
                <div>
                  <span class="text-grey-4 text-weight-medium">Groupe :</span>
                  <span class="text-white q-ml-xs">{{
                    event.groupName || "—"
                  }}</span>
                </div>
              </div>

              <div class="row items-center no-wrap tooltip-item">
                <q-icon
                  name="category"
                  size="16px"
                  color="purple-3"
                  class="q-mr-sm"
                />
                <div>
                  <span class="text-grey-4 text-weight-medium"
                    >Type de séance :</span
                  >
                  <span class="text-white q-ml-xs">{{
                    event.sessionTypeLabel || "—"
                  }}</span>
                </div>
              </div>

              <div
                v-if="event.discription"
                class="row items-start no-wrap tooltip-item q-mt-xs description-item"
              >
                <q-icon
                  name="notes"
                  size="16px"
                  color="grey-3"
                  class="q-mr-sm q-mt-xs"
                />
                <div class="col">
                  <span class="text-grey-4 text-weight-medium"
                    >Description :</span
                  >
                  <div
                    class="text-grey-3 q-mt-xs text-italic text-caption text-weight-light text-wrap-break"
                  >
                    {{ event.discription }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-tooltip>

        <q-menu v-if="userRole !== 'student'" context-menu>
          <q-list style="min-width: 180px">
            <q-item
              v-if="isStaff"
              clickable
              v-close-popup
              @click="emit('event-edit', event)"
            >
              <q-item-section avatar>
                <q-icon name="edit" color="primary" />
              </q-item-section>
              <q-item-section>Modifier la séance</q-item-section>
            </q-item>
            <q-item
              v-if="!isStudent"
              clickable
              v-close-popup
              @click="emit('event-attendance', event)"
            >
              <q-item-section avatar>
                <q-icon name="how_to_reg" color="teal" />
              </q-item-section>
              <q-item-section>Faire l'appel</q-item-section>
            </q-item>
            <q-item
              v-if="isTeacher && canGradeEvent(event)"
              clickable
              v-close-popup
              @click="emit('event-grades', event)"
            >
              <q-item-section avatar>
                <q-icon name="grade" color="purple" />
              </q-item-section>
              <q-item-section>Saisir les notes</q-item-section>
            </q-item>
            <q-item
              v-if="isStaff"
              clickable
              v-close-popup
              @click="emit('event-duplicate', event)"
            >
              <q-item-section avatar>
                <q-icon name="content_copy" color="secondary" />
              </q-item-section>
              <q-item-section>Dupliquer la séance</q-item-section>
            </q-item>
            <q-separator v-if="isStaff" />
            <q-item
              v-if="isStaff"
              clickable
              v-close-popup
              @click="emit('event-delete', event)"
            >
              <q-item-section avatar>
                <q-icon name="delete" color="negative" />
              </q-item-section>
              <q-item-section class="text-negative text-weight-bold"
                >Supprimer la séance</q-item-section
              >
            </q-item>
          </q-list>
        </q-menu>
      </template>
    </vue-cal>
  </client-only>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Dark } from "quasar";
import { useLangModule } from "~/stores/lang/langModule";
import { useAuthModule } from "~/stores/auth/authModule";
import { formatDate } from "~/utils";

const props = defineProps({
  events: {
    type: Array as () => any[],
    required: true,
  },
});

const emit = defineEmits([
  "cell-dblclick",
  "event-edit",
  "event-drop",
  "event-resize",
  "event-drag-create",
  "event-title-change",
  "event-duration-change",
  "event-drag-start",
  "event-drag-end",
  "event-attendance",
  "event-delete",
  "event-duplicate",
  "event-grades",
]);

const canGradeEvent = (event: any) => {
  return event.class === 'exam' &&
         (userRole.value === 'teacher' && event.teacherId === authModule.getId) &&
         new Date(event.end) < new Date();
};

const langModule = useLangModule();
const authModule = useAuthModule();

const getLanguage = computed(() => langModule.getLanguage);
const isDarkActive = computed(() => Dark.isActive);
const userRole = computed(() => authModule.getRole);

// isStaff means admin or coordinator (full write privileges)
const isStaff = computed(
  () => userRole.value === "admin" || userRole.value === "coordinator",
);
const isStudent = computed(() => userRole.value === "student");
const isTeacher = computed(() => userRole.value === "teacher");

const editableEventsConfig = computed(() => {
  if (isStaff.value) {
    return { title: false, drag: true, resize: false };
  }
  return { title: false, drag: false, resize: false };
});

const currentView = ref("week");

function onCellDblClick(date: Date) {
  if (!isStaff.value) return;
  if (currentView.value !== "month") {
    emit("cell-dblclick", date);
  }
}

function getBadgeColor(eventClass: string): string {
  switch (eventClass) {
    case "cours":
      return "#2196f3";
    case "workshop":
      return "#4caf50";
    case "conference":
      return "#713e5a";
    case "exam":
      return "#f18d05";
    default:
      return "#2196f3";
  }
}
</script>

<style lang="scss">
.vuecal {
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
}

/* Styles généraux pour les événements */
.vuecal__event {
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  opacity: 0.9;
  transition: all 0.2s ease;
  padding: 6px 10px;
  font-size: 11px;
  border-left: 4px solid;
}

.vuecal__event:hover {
  opacity: 1;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

/* Couleurs spécifiques pour chaque classe d'événement */
.vuecal__event.cours {
  background-color: #d6ecfd;
  border-left-color: #2196f3;
  color: #0d47a1;
}

.vuecal--dark .vuecal__event.cours {
  background-color: #1a4d8c;
  border-left-color: #64b5f6;
  color: #e3f2fd;
}

.vuecal__event.workshop {
  background-color: #ddf3de;
  border-left-color: #4caf50;
  color: #1b5e20;
}

.vuecal--dark .vuecal__event.workshop {
  background-color: #1b5e20;
  border-left-color: #81c784;
  color: #e8f5e9;
}

.vuecal__event.exam {
  background-color: #ffe8c7;
  border-left-color: #f18d05;
  color: #e65100; /* Changé pour meilleur contraste */
}

.vuecal--dark .vuecal__event.exam {
  background-color: #b85c00;
  border-left-color: #ffb74d;
  color: #fff3e0;
}

.vuecal__event.conference {
  background-color: #e6d8e0;
  border-left-color: #713e5a;
  color: #4a1a36;
}

.vuecal--dark .vuecal__event.conference {
  background-color: #5c2e4a;
  border-left-color: #ab47bc;
  color: #f3e5f5;
}

.vuecal__event.conflict-event {
  background-color: #fcd9cf !important;
  border-left-color: #eb4511 !important;
  color: #bf360c !important;
}

.vuecal--dark .vuecal__event.conflict-event {
  background-color: #a8320c !important;
  border-left-color: #ff7043 !important;
  color: #ffccbc !important;
}

.vuecal__event-time {
  font-weight: bold;
  margin-top: 2px;
  font-size: 10px;
}

.vuecal__cell--today {
  background-color: #fffde7;
}

.vuecal__header {
  background-color: #3f51b5;
  color: white !important;
  border-radius: 12px 12px 0 0;
}

.vuecal__arrow,
.vuecal__today-btn {
  color: white !important;
}

.vuecal__title > button {
  color: white !important;
}

::v-deep button[data-vuecal-today-btn] {
  color: white !important;
}

::v-deep .vuecal__header,
::v-deep .vuecal__arrow,
::v-deep .vuecal__today-btn {
  color: white !important;
}

::v-deep .vuecal__header {
  background-color: #3f51b5 !important;
}

.edit-badge {
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  cursor: pointer;
  top: 4px;
  right: 28px;
  height: 20px;
  width: 20px;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attendance-badge {
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  cursor: pointer;
  top: 4px;
  right: 4px;
  height: 20px;
  width: 20px;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grades-badge {
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  cursor: pointer;
  top: 4px;
  right: 28px;
  height: 20px;
  width: 20px;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vuecal__event:hover .edit-badge,
.vuecal__event:hover .attendance-badge,
.vuecal__event:hover .grades-badge {
  opacity: 1;
}

/* Thème sombre */
.vuecal--dark {
  background-color: #1e1e32 !important;
  color: #e0e0fc !important;
}

.vuecal--dark .vuecal__header {
  background-color: #313155 !important;
  color: #ffffff !important;
}

.vuecal--dark .vuecal__cell {
  background-color: #262640;
  border-color: #3c3c60;
}

.vuecal--dark .vuecal__cell--today {
  background-color: #333355 !important;
}

.vuecal--dark .vuecal__time-cell {
  color: #a0a0c0;
}

/* Custom Tooltip Card Style */
.custom-tooltip-card {
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  overflow: hidden;
  max-width: 290px;
  font-size: 13px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
}

.tooltip-conflict-banner {
  background: linear-gradient(90deg, #c62828, #ef5350);
  color: white;
  letter-spacing: 0.5px;
  font-size: 11px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
}

.tooltip-body {
  padding: 12px 14px;
}

.tooltip-item {
  line-height: 1.4;
  padding: 3px 0;
}

.description-item {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 8px;
}

.text-wrap-break {
  word-break: break-word;
  white-space: pre-wrap;
}

/* Custom Event Cell Style */
.custom-event-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  text-align: left;
  line-height: 1.25;
  padding: 2px 4px;
}

.event-title {
  font-size: 11px;
  margin-bottom: 2px;
}

.event-time {
  font-size: 10px;
  margin-bottom: 1px;
  opacity: 0.9;
}

.event-detail {
  font-size: 10px;
  opacity: 0.8;
}

.event-desc {
  border-top: 1px dashed rgba(0, 0, 0, 0.12);
  padding-top: 4px;
  line-height: 1.2;
}

/* For dark mode */
.vuecal--dark .event-desc {
  border-top-color: rgba(255, 255, 255, 0.12);
}

.opacity-80 {
  opacity: 0.8;
}
.opacity-70 {
  opacity: 0.7;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
