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
      :time-to="22 * 60 - 15"
      :locale="getLanguage"
      today-button
      :today-button-style="{ color: 'white', border: '1px solid white' }"
      :editable-events="{ title: false, drag: true, resize: false }"
      :drag-to-create-event="false"
      @event-drag-create="emit('event-drag-create', $event)"
      @event-drop="emit('event-drop', $event)"
      :disable-drag="false"
      :drag-to-create-threshold="10"
      :drag-to-move-threshold="10"
      :snap-to-time="60"
      :drag-to-move-events="{ enable: true }"
      :event-editable="false"
      @event-title-change="emit('event-title-change', $event)"
      @event-resize="emit('event-resize', $event)"
      @event-duration-change="emit('event-duration-change', $event)"
      @event-drag-start="emit('event-drag-start', $event)"
      @event-drag-end="emit('event-drag-end', $event)"
    >
      <!-- Slot personnalisé pour les événements -->
      <template #event="{ event }">
        <div style="display: grid" :class="{ 'text-negative': event.hasConflict }">
          <span class="text-weight-bold" style="overflow: hidden">
            {{ event.subjectName || event.title }}
          </span>
          <span class="vuecal__event-time" style="overflow: hidden">
            {{ formatDate(event.start, "YYYY-MM-DD HH:mm", "HH:mm") }} -
            {{ formatDate(event.end, "YYYY-MM-DD HH:mm", "HH:mm") }}
          </span>
        </div>
        <q-badge
          rounded
          floating
          class="edit-badge shadow-2"
          @click.stop="emit('event-edit', event)"
          :color="event.hasConflict ? 'negative' : getBadgeColor(event.class)"
        >
          <q-icon :name="event.hasConflict ? 'warning' : 'edit'" color="white" size="12px" />
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
      </template>
    </vue-cal>
  </client-only>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Dark } from "quasar";
import { useLangModule } from "~/stores/lang/langModule";
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
]);

const langModule = useLangModule();
const getLanguage = computed(() => langModule.getLanguage);
const isDarkActive = computed(() => Dark.isActive);

const currentView = ref("week");

function onCellDblClick(date: Date) {
  if (currentView.value !== "month") {
    emit("cell-dblclick", date);
  }
}

function getBadgeColor(eventClass: string): string {
  switch (eventClass) {
    case "cours":
      return "blue";
    case "workshop":
      return "green";
    case "conference":
      return "purple";
    case "exam":
      return "yellow";
    default:
      return "blue";
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
  background-color: #e3f2fd;
  border-left-color: #2196f3;
  color: #0d47a1;
}

.vuecal__event.workshop {
  background-color: #e8f5e9;
  border-left-color: #4caf50;
  color: #1b5e20;
}

.vuecal__event.exam {
  background-color: #fff5bd;
  border-left-color: yellow;
  color: #000;
}

.vuecal__event.conference {
  background-color: #f3e5f5;
  border-left-color: #9c27b0;
  color: #4a148c;
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
  right: 4px;
  height: 20px;
  width: 20px;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vuecal__event:hover .edit-badge {
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

.vuecal--dark .vuecal__event.cours {
  background-color: #0d3c80;
  border-left-color: #2196f3;
  color: #e0f2f1 !important;
}

.vuecal--dark .vuecal__event.workshop {
  background-color: #114b15;
  border-left-color: #4caf50;
  color: #e8f5e9 !important;
}

.vuecal--dark .vuecal__event.exam {
  background-color: #fff3b0;
  border-left-color: yellow;
  color: #000 !important;
}

.vuecal--dark .vuecal__event.conference {
  background-color: #3c0c70;
  border-left-color: #9c27b0;
  color: #f3e5f5 !important;
}

.vuecal__event.conflict-event {
  border-left-color: #f44336 !important;
  background-color: #ffebee !important;
  color: #c62828 !important;
}

.vuecal--dark .vuecal__event.conflict-event {
  border-left-color: #e53935 !important;
  background-color: #5c1919 !important;
  color: #ffebee !important;
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
