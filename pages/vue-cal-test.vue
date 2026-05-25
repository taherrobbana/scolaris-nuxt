<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5 q-mb-md">Emploi du temps</div>

      <client-only>
        <!-- <vue-cal active-view="week" :disable-views="['years', 'year']" :time-from="8 * 60" :time-to="18 * 60"
                    :time-step="30" :locale="getLanguage" style="height: 600px" /> -->
        <vue-cal
          :class="{ 'vuecal--dark': isDarkActive }"
          :disable-views="['year', 'years']"
          default-view="week"
          :timeStep="60"
          :eventsOnMonthView="false"
          small
          @cell-dblclick="cellDblClick($event)"
          :events="events"
          :time-from="8 * 60"
          :time-to="20 * 60"
          :locale="getLanguage"
          today-button
          :today-button-style="{ color: 'white', border: '1px solid white' }"
          :editable-events="{ title: false, drag: true, resize: false }"
          :drag-to-create-event="false"
          @event-drag-create="onEventDragCreate"
          @event-drop="onEventDrop"
          :disable-drag="false"
          :drag-to-create-threshold="10"
          :drag-to-move-threshold="10"
          :snap-to-time="60"
          :drag-to-move-events="{ enable: true }"
          :event-editable="false"
          @event-title-change="onTitleChange"
          @event-resize="onEventResize"
          @event-duration-change="onDurationChange"
          @event-drag-start="onDragStart"
          @event-drag-end="onDragEnd"
        >
          <!-- Slot personnalisé pour les événements -->
          <template #event="{ event }">
            <div style="display: grid">
              <span style="overflow: hidden">
                {{ event.title }}
              </span>
              <span class="vuecal__event-time" style="overflow: hidden">
                {{ formatDate(event.start, "YYYY-MM-DD HH:mm", "HH:mm") }} -
                {{ formatDate(event.end, "YYYY-MM-DD HH:mm", "HH:mm") }}
              </span>
            </div>
            <q-badge
              rounded
              floating
              class="edit-badge"
              @click="onEditEvent(event)"
              :color="getBadgeColor(event.class)"
            >
              <q-icon name="edit" color="white" />
            </q-badge>
            <q-tooltip>
              <div style="display: grid">
                <span style="overflow: hidden; text-align: center">
                  {{ event.title }}
                </span>
                <span
                  class="vuecal__event-time"
                  style="overflow: hidden; text-align: center"
                >
                  {{ formatDate(event.start, "YYYY-MM-DD HH:mm", "HH:mm") }} -
                  {{ formatDate(event.end, "YYYY-MM-DD HH:mm", "HH:mm") }}
                </span>
                <span style="overflow: hidden; text-align: center">
                  {{ event.discription }}
                </span>
              </div>
            </q-tooltip>
          </template>
        </vue-cal>
        <!-- <EditEvent
                  :popupOpen="showEditEventDialog"
                  :persistent="true"
                  :fullHeight="false"
                  @closeDialog="showEditEventDialog = false"
                  :eventToEdit="eventToEdit"
                  :mode="mode"
                /> -->
      </client-only>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Dark } from "quasar";
import { useLangModule } from "~/stores/lang/langModule";
import { formatDate } from "~/utils";
import { ALL_ROLES } from "~/utils/types";

const langModule = useLangModule();
const getLanguage = computed(() => langModule.getLanguage);
const isDarkActive = computed(() => Dark.isActive);
const { t } = useI18n();

// function cellDblClick(event: any) {
//     this.mode = "add";
//     this.eventToEdit = {
//       id: null,
//       start: event,
//       end: "",
//       title: "",
//       discription: "",
//       class: "",
//     };
//     this.showEditEventDialog = true;
//   }

const events: any = [
  {
    id: 1,
    start: "2026-04-07 14:00",
    end: "2026-04-07 16:00",
    title: "Réunion équipe",
    discription: "Réunion de suivi de projet",
    class: "meeting",
  },
  {
    id: 2,
    start: "2026-04-08 14:00",
    end: "2026-04-08 16:00",
    title: "Réunion équipe 2",
    discription: "Réunion de suivi de projet",
    class: "meeting",
  },
  {
    id: 3,
    start: "2026-04-09 10:00",
    end: "2026-04-09 12:00",
    title: "Atelier de développement",
    discription: "Atelier sur les meilleures pratiques de développement",
    class: "workshop",
  },
  {
    id: 4,
    start: "2026-04-10 09:00",
    end: "2026-04-10 11:00",
    title: "Conférence en ligne",
    discription: "Conférence sur les dernières tendances en IA",
    class: "conference",
  },
];
const language = computed(() => langModule.getLanguage);

//   showEditEventDialog: boolean = false;
//   eventToEdit: any = null;
//   mode: string = "";
//  function onEditEvent(event: any) {
//     this.mode = "edit";
//     this.eventToEdit = event;
//     this.showEditEventDialog = true;
//     console.log("Événement à éditer", event);
//     Notify.create({
//       type: "positive",
//       // message: `Édition de l'événement '${event.title}'`,
//       message: `Édition de l'événement <strong>${event.title}</strong>`,
//     });
//   }

// Méthode appelée quand un événement est déplacé
//   onEventDrop(event: any, originalEvent: any) {
//     console.log("Événement déplacé", event);

//     // Trouve l'événement original dans le tableau et le met à jour
//     const index = this.events.findIndex(
//       (e: any) => e?.title === originalEvent?.title
//     );
//     if (index !== -1) {
//       this.events[index] = {
//         ...this.events[index],
//         start: event.start,
//         end: event.end,
//       };
//     }
//   }

// Méthode optionnelle pour la création par drag (si activé)
//   onEventDragCreate(event: any) {
//     console.log("Nouvel événement créé par drag", event);
//     this.events.push({
//       start: event.start,
//       end: event.end,
//       title: "Nouvel événement",
//       class: "meeting",
//     });
//   }

//   onTitleChange(event: any, originalEvent: any) {
//     console.log("Titre de l'événement modifié", event, originalEvent);

//     const index = this.events.findIndex(
//       (e: any) => e?.title === originalEvent?.title
//     );
//     if (index !== -1) {
//       this.events[index].title = event.title;

//       // Optionnel : Sauvegarde en base de données
//       // await api.updateEvent(this.events[index]);
//     }
//   }

//   onEventResize(event: any, originalEvent: any) {
//     console.log("Événement redimensionné", event, originalEvent);
//     const index = this.events.findIndex(
//       (e: any) => e?.id === originalEvent?.id
//     );
//     if (index !== -1) {
//       // Met à jour uniquement l'heure de fin
//       this.events[index].end = event.end;

//       // Optionnel : Sauvegarde en base de données
//       // await api.updateEvent(this.events[index]);
//     }
//   }

// Pour les ajustements précis
//   onDurationChange(event: any, originalEvent: any) {
//     console.log("Nouvelle durée :", event, originalEvent);
//   }

function getBadgeColor(eventClass: string): string {
  switch (eventClass) {
    case "meeting":
      return "blue";
    case "workshop":
      return "green";
    case "conference":
      return "purple";
    default:
      return "red"; // Couleur par défaut
  }
}

//   onDragStart(event: any) {
//     console.log("onDragStart");
//     event.event.classList.add("custom-dragging-class");
//   }

//   onDragEnd(event: any) {
//     console.log("onDragEnd");
//     event.event.classList.remove("custom-dragging-class");
//   }

definePageMeta({
  middleware: "auth",
  roles: ALL_ROLES,
});

useHead({
  title: computed(() => t("useHead.vue-cal-test")),
});
</script>
<style lang="scss">
.vuecal {
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Styles généraux pour les événements */
.vuecal__event {
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: 0.9;
  transition: all 0.2s ease;
  padding: 4px 8px;
  font-size: 12px;
  border-left: 4px solid;
}

.vuecal__event:hover {
  opacity: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

/* Couleurs spécifiques pour chaque classe d'événement */
.vuecal__event.meeting {
  background-color: #e3f2fd;
  border-left-color: #2196f3;
  color: #0d47a1;
}

.vuecal__event.workshop {
  background-color: #e8f5e9;
  border-left-color: #4caf50;
  color: #1b5e20;
}

.vuecal__event.conference {
  background-color: #f3e5f5;
  border-left-color: #9c27b0;
  color: #4a148c;
}

/* Style pour les événements qui se chevauchent */
.vuecal__event--overlapped {
  width: calc(100% - 8px) !important;
  margin-left: 8px;
}

/* Style pour l'heure dans les événements */
.vuecal__event-time {
  font-weight: bold;
  margin-bottom: 4px;
}

/* Style pour le titre dans les événements */
.vuecal__event-title {
  font-weight: 500;
  white-space: nowrap;
  /* overflow: hidden; */
  text-overflow: ellipsis;
}

/* Style pour le jour courant */
.vuecal__cell--today {
  background-color: #fff8e1;
}

/* Style pour le header */
.vuecal__header {
  background-color: #2196f3;
  color: white;
  border-radius: 8px 8px 0 0;
}

/* Style pour les boutons de navigation */
.vuecal__arrow {
  color: white;
}

/* Style pour les cellules de temps */
.vuecal__time-cell {
  height: 40px;
}

/* Style pour l'heure dans la colonne de temps */
.vuecal__time-column-header {
  font-size: 12px;
  color: #666;
}

/* Zone de dépôt potentielle */
.vuecal__cell--highlighted:not(.vuecal__cell--disabled) {
  background-color: rgba(236, 239, 241, 0.3);
}

/* Curseur pendant le drag */
.vuecal__event--draggable {
  cursor: move;
}

::v-deep .vuecal__event {
  cursor: move !important;
  /* Curseur "drag" même sans editable-events */
}

::v-deep .vuecal__header {
  background-color: #3f51b5;
  /* Bleu matériel */
}

.vuecal__today-btn {
  color: white;
}

.vuecal__title > button {
  color: white !important;
}

/* ::v-deep .vuecal__flex.vuecal__title > button {
  color: white !important;
  border-color: white !important;
} */

::v-deep button[data-vuecal-today-btn] {
  color: white !important;
}

::v-deep .vuecal__header,
/* ::v-deep .vuecal__title, */
::v-deep .vuecal__arrow,
::v-deep .vuecal__today-btn {
  color: white !important;
}

::v-deep .vuecal__header {
  background-color: #3f51b5 !important;
}

/* Désactive complètement le resize cursor */
::v-deep .vuecal__event-resize-handle {
  display: none !important;
}

::v-deep .vuecal__event:active {
  cursor: grabbing !important;
  /* Pendant le drag */
}

.vuecal__event {
  cursor: grab !important;
  /* Version plus moderne */
  /* overflow: visible !important;  */
  /* overflow: visible !important; */
}

::v-deep .vuecal__event {
  cursor: grab !important;
  /* Curseur avant le drag */
}

/* Style du badge d'édition */
::v-deep .vuecal__event-content {
  position: relative;
  height: 100%;
}

.event-badge {
  position: absolute !important;
  top: 4px !important;
  right: 4px !important;
  width: 16px !important;
  height: 16px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: white !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  /* opacity: 0 !important; */
  transition: opacity 0.2s !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
}

::v-deep .vuecal__event:hover .event-badge {
  display: flex !important;
  opacity: 1;
}

::v-deep .event-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
  background: red;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.edit-badge {
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  cursor: pointer;
  top: 3px;
  right: 3px;
  height: 24px;
  width: 24px;
}

.vuecal__event:hover .edit-badge {
  opacity: 1;
}

.custom-dragging-class {
  opacity: 0.5 !important;
  background-color: #ff0000 !important;
  /* Couleur de fond personnalisée */
  border: 2px dashed #ff0000 !important;
  /* Bordure personnalisée */
  box-shadow: 0 4px 8px #ff0000 !important;
  /* Ombre personnalisée */
}

.vuecal__event--static {
  display: none !important;
  /* Masque les événements statiques */
}

.vuecal__event--overlapped {
  opacity: 0.5 !important;
  background-color: #ff0000 !important;
  /* Couleur de fond personnalisée */
  border: 2px dashed #ff0000 !important;
  /* Bordure personnalisée */
  box-shadow: 0 4px 8px #ff0000 !important;
  /* Ombre personnalisée */
}

.vuecal--dark {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
}

.vuecal--dark .vuecal__header {
  background-color: #424242 !important;
  color: #ffffff !important;
}

.vuecal--dark .vuecal__title {
  color: #ffffff !important;
}

.vuecal--dark .vuecal__cell {
  background-color: #2d2d2d;
  border-color: #424242;
}

.vuecal--dark .vuecal__cell--today {
  background-color: #383838 !important;
}

.vuecal--dark .vuecal__cell--selected {
  background-color: #4a4a4a;
}

.vuecal--dark .vuecal__time-cell {
  color: #b0b0b0;
}

/* Styles des événements en mode sombre */
.vuecal--dark .vuecal__event {
  color: #ffffff !important;
  opacity: 0.9;
}

.vuecal--dark .vuecal__event.meeting {
  background-color: #0d47a1;
  border-left-color: #42a5f5;
}

.vuecal--dark .vuecal__event.workshop {
  background-color: #1b5e20;
  border-left-color: #66bb6a;
}

.vuecal--dark .vuecal__event.conference {
  background-color: #4a148c;
  border-left-color: #ab47bc;
}

/* Bouton Today en mode sombre */
.vuecal--dark .vuecal__today-btn {
  color: #ffffff !important;
  border-color: #ffffff !important;
}

.vuecal__cell-events-count {
  background-color: red;
}
</style>
