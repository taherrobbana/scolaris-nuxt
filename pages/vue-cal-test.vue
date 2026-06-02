<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <MyCalender
        :events="events"
        @cell-dblclick="cellDblClick"
        @event-edit="onEditEvent"
        @event-drop="onEventDrop"
        @event-resize="onEventResize"
        @event-drag-create="onEventDragCreate"
      />
    </div>

    <!-- Edit / Add Event Dialog -->
    <q-dialog v-model="showEditEventDialog" persistent>
      <q-card style=" border-radius: 16px" class="q-pa-sm">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold text-primary">
            {{ mode === 'add' ? 'Ajouter un cours / événement' : 'Modifier l\'événement' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-y-md q-pt-md">
          <!-- Title -->
          <q-input
            v-model="eventToEdit.title"
            label="Titre de l'événement"
            outlined
            dense
            :rules="[v => !!v || 'Le titre est requis']"
          >
            <template #prepend><q-icon name="title" /></template>
          </q-input>

          <!-- Type (Class) -->
          <q-select
            v-model="eventToEdit.class"
            :options="[
              { label: 'Réunion (Meeting)', value: 'meeting' },
              { label: 'Atelier (Workshop)', value: 'workshop' },
              { label: 'Conférence (Conference)', value: 'conference' }
            ]"
            emit-value
            map-options
            outlined
            dense
            label="Type d'événement"
          >
            <template #prepend><q-icon name="category" /></template>
          </q-select>

          <!-- Date de début -->
          <q-input outlined dense v-model="eventToEdit.start" label="Date et heure de début">
            <template #prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="eventToEdit.start" mask="YYYY-MM-DD HH:mm">
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
                  <q-time v-model="eventToEdit.start" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fermer" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- Date de fin -->
          <q-input outlined dense v-model="eventToEdit.end" label="Date et heure de fin">
            <template #prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="eventToEdit.end" mask="YYYY-MM-DD HH:mm">
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
                  <q-time v-model="eventToEdit.end" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fermer" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- Description -->
          <q-input
            v-model="eventToEdit.discription"
            label="Description / Détails"
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
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Notify } from "quasar";
import MyCalender from "~/components/vue-cal/MyCalender.vue";
import { ALL_ROLES } from "~/utils/types";
import moment from "moment";

const i18n = useI18n();

definePageMeta({
  middleware: "auth",
  roles: ALL_ROLES,
});

useHead({
  title: computed(() => i18n.t("useHead.vue-cal-test")),
});

// Dialog & Form State
const showEditEventDialog = ref(false);
const mode = ref("add");
const eventToEdit = ref({
  id: "",
  start: "",
  end: "",
  title: "",
  discription: "",
  class: "meeting",
});

function generateEventId(): string {
  return "ev_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Initial Events List
const events = ref<any[]>([
  {
    id: "1",
    start: "2026-04-07 14:00",
    end: "2026-04-07 16:00",
    title: "Réunion équipe",
    discription: "Réunion de suivi de projet",
    class: "meeting",
  },
  {
    id: "2",
    start: "2026-04-08 14:00",
    end: "2026-04-08 16:00",
    title: "Réunion équipe 2",
    discription: "Réunion de suivi de projet",
    class: "meeting",
  },
  {
    id: "3",
    start: "2026-04-09 10:00",
    end: "2026-04-09 12:00",
    title: "Atelier de développement",
    discription: "Atelier sur les meilleures pratiques de développement",
    class: "workshop",
  },
  {
    id: "4",
    start: "2026-04-10 09:00",
    end: "2026-04-10 11:00",
    title: "Conférence en ligne",
    discription: "Conférence sur les dernières tendances en IA",
    class: "conference",
  },
]);

// Double click to create event
function cellDblClick(date: Date) {
  mode.value = "add";
  const startStr = moment(date).format("YYYY-MM-DD HH:mm");
  const endStr = moment(date).add(1, "hours").format("YYYY-MM-DD HH:mm");

  eventToEdit.value = {
    id: generateEventId(),
    start: startStr,
    end: endStr,
    title: "",
    discription: "",
    class: "meeting",
  };
  showEditEventDialog.value = true;
}

// Edit existing event
function onEditEvent(event: any) {
  mode.value = "edit";
  eventToEdit.value = {
    id: event.id,
    start: moment(event.start).format("YYYY-MM-DD HH:mm"),
    end: moment(event.end).format("YYYY-MM-DD HH:mm"),
    title: event.title,
    discription: event.discription || "",
    class: event.class || "meeting",
  };
  showEditEventDialog.value = true;
}

// Drag and drop event handler
function onEventDrop({ event, originalEvent }: any) {
  console.log("Événement déplacé", event);
  const index = events.value.findIndex((e: any) => e.id === originalEvent.id);
  if (index !== -1) {
    events.value[index] = {
      ...events.value[index],
      start: moment(event.start).format("YYYY-MM-DD HH:mm"),
      end: moment(event.end).format("YYYY-MM-DD HH:mm"),
    };
    Notify.create({
      type: "positive",
      message: `Événement déplacé avec succès`,
      icon: "check_circle",
    });
  }
}

// Drag to create event handler
function onEventDragCreate(event: any) {
  console.log("Nouvel événement créé par drag", event);
  const newEv = {
    id: generateEventId(),
    start: moment(event.start).format("YYYY-MM-DD HH:mm"),
    end: moment(event.end).format("YYYY-MM-DD HH:mm"),
    title: "Nouvel événement",
    discription: "",
    class: "meeting",
  };
  events.value.push(newEv);
}

// Resize event handler
function onEventResize({ event, originalEvent }: any) {
  console.log("Événement redimensionné", event);
  const index = events.value.findIndex((e: any) => e.id === originalEvent.id);
  if (index !== -1) {
    events.value[index].end = moment(event.end).format("YYYY-MM-DD HH:mm");
    Notify.create({
      type: "positive",
      message: `Durée de l'événement modifiée`,
      icon: "check_circle",
    });
  }
}

// Save edit or new event
function saveEvent() {
  if (!eventToEdit.value.title.trim()) {
    Notify.create({
      type: "negative",
      message: "Le titre est requis",
      icon: "warning",
    });
    return;
  }

  if (mode.value === "add") {
    events.value.push({
      id: eventToEdit.value.id || generateEventId(),
      start: eventToEdit.value.start,
      end: eventToEdit.value.end,
      title: eventToEdit.value.title.trim(),
      discription: eventToEdit.value.discription.trim(),
      class: eventToEdit.value.class,
    });
    Notify.create({
      type: "positive",
      message: "Événement créé avec succès",
      icon: "check_circle",
    });
  } else {
    const idx = events.value.findIndex(e => e.id === eventToEdit.value.id);
    if (idx !== -1) {
      events.value[idx] = {
        id: eventToEdit.value.id,
        start: eventToEdit.value.start,
        end: eventToEdit.value.end,
        title: eventToEdit.value.title.trim(),
        discription: eventToEdit.value.discription.trim(),
        class: eventToEdit.value.class,
      };
      Notify.create({
        type: "positive",
        message: "Événement mis à jour avec succès",
        icon: "check_circle",
      });
    }
  }
  showEditEventDialog.value = false;
}

// Delete event from list
function deleteEvent() {
  events.value = events.value.filter(e => e.id !== eventToEdit.value.id);
  Notify.create({
    type: "positive",
    message: "Événement supprimé avec succès",
    icon: "delete",
  });
  showEditEventDialog.value = false;
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
