<template>
  <q-page padding>
    <!-- Academic Print Header (Only visible on paper / print layout) -->
    <div class="print-only print-header q-mb-xl">
      <div class="row justify-between items-center border-bottom q-pb-md">
        <div>
          <div class="text-h4 text-weight-bold text-indigo-9">SCOLARIS</div>
          <div class="text-subtitle2 text-grey-8">Établissement d'Enseignement Supérieur</div>
        </div>
        <div class="text-right">
          <div class="text-h5 text-weight-bold">RELEVÉ DE NOTES OFFICIEL</div>
          <div class="text-caption text-grey-7">Année Académique 2025-2026</div>
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="text-weight-bold text-subtitle1">{{ authModule.firstName }} {{ authModule.lastName }}</div>
          <div>Identifiant Étudiant: {{ authModule.getId }}</div>
          <div>Nom d'utilisateur: {{ authModule.username }}</div>
        </div>
        <div class="col-6 text-right">
          <div>Date d'impression: {{ printDate }}</div>
          <div>Statut de Validation: <span class="text-weight-bold text-success text-positive">VALIDÉ PAR L'ADMINISTRATION</span></div>
        </div>
      </div>
    </div>

    <div class="myCard q-pa-lg">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg no-print">
        <div>
          <div class="text-h5 text-primary text-weight-bold">
            {{ $t("student.grades.title") }}
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            {{ $t("student.grades.subtitle") }}
          </div>
        </div>
        <div>
          <q-btn
            v-if="reportCardValidated"
            color="primary"
            icon="print"
            :label="$t('student.grades.print')"
            unelevated
            rounded
            no-caps
            @click="printReportCard"
          />
        </div>
      </div>

      <!-- Notice when not validated -->
      <q-banner v-if="!loading && !reportCardValidated" inline-actions class="text-white bg-warning q-mb-lg rounded-borders shadow-2 no-print">
        <template v-slot:avatar>
          <q-icon name="warning" color="white" size="sm" />
        </template>
        {{ $t("student.grades.validationWarning") || "Votre relevé de notes est en cours de validation par l'administration. L'impression sera disponible une fois validé." }}
      </q-banner>

      <!-- Loading State -->
      <div v-if="loading" class="row justify-center q-my-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else>
        <!-- Stats Cards Row -->
        <div class="row q-col-gutter-md q-mb-lg">
          <!-- GPA / Moyenne générale -->
          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">
                    {{ $t("student.grades.gpa") }}
                  </div>
                  <div class="text-h5 text-weight-bold text-primary">
                    {{ gpa }} / 20
                  </div>
                </div>
                <q-circular-progress
                  show-value
                  class="text-caption text-weight-bold text-primary"
                  :value="((gpa / 20) * 100).toFixed(2)"
                  size="48px"
                  color="primary"
                  track-color="grey-2"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- Total Coefficients -->
          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">
                    {{ $t("student.grades.coefficientSum") }}
                  </div>
                  <div class="text-h5 text-weight-bold">
                    {{ coefficientSum }}
                  </div>
                </div>
                <q-avatar color="indigo-1" text-color="indigo-9" icon="functions" />
              </q-card-section>
            </q-card>
          </div>

          <!-- Status decision -->
          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">
                    {{ $t("student.grades.status") }}
                  </div>
                  <div
                    class="text-h6 text-weight-bold"
                    :class="statusTextColor"
                  >
                    {{ statusLabel }}
                  </div>
                </div>
                <q-avatar :color="statusBgColor" :text-color="statusTextColor" :icon="statusIcon" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Grades Table / List -->
        <div class="q-mt-md">
          <div v-if="grades.length === 0" class="text-center q-py-xl text-grey-7 bg-white rounded-borders border-grey">
            <q-icon name="assignment_late" size="50px" class="q-mb-md text-grey-5" />
            <div>{{ $t("student.grades.noGrades") }}</div>
          </div>

          <div v-else class="bg-white rounded-borders overflow-hidden border-grey">
            <q-table
              :rows="grades"
              :columns="columns"
              row-key="eventId"
              flat
              bordered
              :pagination="{ rowsPerPage: 10 }"
            >
              <!-- Subject Code + Name column -->
              <template v-slot:body-cell-subjectName="props">
                <q-td :props="props">
                  <div class="text-weight-bold">{{ props.row.subjectName }}</div>
                  <div class="text-caption text-grey-6">{{ props.row.subjectCode }}</div>
                </q-td>
              </template>

              <!-- Grade column with custom progress / chips -->
              <template v-slot:body-cell-grade="props">
                <q-td :props="props" class="text-right">
                  <q-chip
                    :color="getGradeColor(props.row.grade)"
                    text-color="white"
                    class="text-weight-bold font-mono"
                    square
                    dense
                  >
                    {{ props.row.grade }} / 20
                  </q-chip>
                </q-td>
              </template>

              <!-- Date column -->
              <template v-slot:body-cell-examDate="props">
                <q-td :props="props">
                  {{ formatDateLabel(props.row.examDate) }}
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthModule } from "~/stores/auth/authModule";
import { useI18n } from "vue-i18n";
import moment from "moment";

import { useGradesModule } from "~/stores/grades/gradesModule";

definePageMeta({
  middleware: "auth",
  roles: ["student"],
});

const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.student.grades")),
});

const authModule = useAuthModule();
const gradesStore = useGradesModule();

const loading = computed(() => gradesStore.loading);
const grades = computed(() => gradesStore.studentGrades);
const gpa = computed(() => gradesStore.gpa);
const coefficientSum = computed(() => gradesStore.coefficientSum);
const status = computed(() => gradesStore.status);
const reportCardValidated = computed(() => gradesStore.reportCardValidated);
const printDate = computed(() => moment().format("DD/MM/YYYY [à] HH:mm"));

async function printReportCard() { 
  if (process.server) return;

  try {
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Helper to load image as base64
    const getBase64ImageFromUrl = (url: string): Promise<{ base64: string; width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve({
              base64: canvas.toDataURL("image/png"),
              width: img.width,
              height: img.height,
            });
          } else {
            reject(new Error("Could not get canvas context"));
          }
        };
        img.onerror = (err) => reject(err);
      });
    };

    // Load SESAME logo
    let logoData = null;
    try {
      logoData = await getBase64ImageFromUrl("/sesameLogo.png");
    } catch (e) {
      console.warn("Could not load sesameLogo.png, proceeding without logo", e);
    }

    // Add Logo or text header
    if (logoData) {
      const targetWidth = 45;
      const targetHeight = (logoData.height / logoData.width) * targetWidth;
      doc.addImage(logoData.base64, "PNG", 15, 15, targetWidth, targetHeight);
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(26, 35, 126);
      doc.text("SESAME", 15, 25);
    }

    // Institution info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Établissement d'Enseignement Supérieur", 15, 33);

    // Document title (Right side aligned)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(33, 33, 33);
    doc.text("RELEVÉ DE NOTES OFFICIEL", 115, 23, { align: "left" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Année Académique: 2025-2026", 115, 29);
    doc.text(`Date d'édition: ${moment().format("DD/MM/YYYY [à] HH:mm")}`, 115, 34);

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, 40, 195, 40);

    // Student information section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);
    doc.text("Informations de l'Étudiant", 15, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nom & Prénom: ${authModule.firstName} ${authModule.lastName}`, 15, 54);
    doc.text(`Identifiant: ${authModule.getId}`, 15, 60);
    doc.text(`Nom d'utilisateur: ${authModule.username}`, 15, 66);

    doc.text(`Statut de Validation: Validé par l'Administration`, 115, 54);
    doc.text(`Moyenne générale: ${gpa.value} / 20`, 115, 60);
    doc.text(`Décision du jury: ${statusLabel.value}`, 115, 66);

    // Separator
    doc.line(15, 72, 195, 72);

    // Table of grades
    const tableRows = grades.value.map((g: any) => [
      `${g.subjectName} (${g.subjectCode})`,
      g.examTitle || "—",
      g.coefficient.toString(),
      formatDateLabel(g.examDate),
      `${g.grade} / 20`,
    ]);

    autoTable(doc, {
      startY: 78,
      head: [["Matière", "Évaluation", "Coeff.", "Date d'évaluation", "Note"]],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [26, 35, 126], // Indigo 9
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 40 },
        2: { cellWidth: 15, halign: "center" },
        3: { cellWidth: 35, halign: "center" },
        4: { cellWidth: 20, halign: "right" },
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });

    // Summary statistics below table
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);
    doc.text("Synthèse des résultats", 15, finalY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Somme des coefficients: ${coefficientSum.value}`, 15, finalY + 7);
    doc.text(`Moyenne Générale: ${gpa.value} / 20`, 15, finalY + 13);

    // Status text color based on status value
    let statusText = statusLabel.value;
    if (status.value === "admitted") {
      doc.setTextColor(46, 125, 50); // Green
    } else if (status.value === "resit") {
      doc.setTextColor(239, 108, 0); // Orange
    } else if (status.value === "failed") {
      doc.setTextColor(198, 40, 40); // Red
    }
    doc.text(`Décision du jury: ${statusText}`, 15, finalY + 19);

    // Footer on the bottom of page
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text("Document officiel généré électroniquement par SCOLARIS.", 15, 285);
    doc.text("Page 1/1", 185, 285, { align: "right" });

    // Save the PDF
    const filename = `Releve_Notes_${authModule.firstName}_${authModule.lastName}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error("Failed to generate PDF", error);
  }
}

const columns = computed(() => [
  {
    name: "subjectName",
    label: t("student.grades.subject"),
    field: "subjectName",
    align: "left",
    sortable: true,
  },
  {
    name: "examTitle",
    label: "Évaluation",
    field: "examTitle",
    align: "left",
    sortable: true,
  },
  {
    name: "coefficient",
    label: t("student.grades.coefficient"),
    field: "coefficient",
    align: "center",
    sortable: true,
  },
  {
    name: "examDate",
    label: t("student.grades.date"),
    field: "examDate",
    align: "left",
    sortable: true,
  },
  {
    name: "grade",
    label: t("student.grades.grade"),
    field: "grade",
    align: "right",
    sortable: true,
  },
]);

const statusLabel = computed(() => {
  if (status.value === "admitted") return t("student.grades.admitted");
  if (status.value === "resit") return t("student.grades.resit");
  if (status.value === "failed") return t("student.grades.failed");
  return "En attente";
});

const statusTextColor = computed(() => {
  if (status.value === "admitted") return "text-positive";
  if (status.value === "resit") return "text-warning";
  if (status.value === "failed") return "text-negative";
  return "text-grey";
});

const statusBgColor = computed(() => {
  if (status.value === "admitted") return "green-1";
  if (status.value === "resit") return "orange-1";
  if (status.value === "failed") return "red-1";
  return "grey-2";
});

const statusIcon = computed(() => {
  if (status.value === "admitted") return "school";
  if (status.value === "resit") return "warning";
  if (status.value === "failed") return "gavel";
  return "help";
});

function getGradeColor(val: number) {
  if (val >= 10) return "positive";
  if (val >= 8) return "warning";
  return "negative";
}

function formatDateLabel(dateStr: string) {
  if (!dateStr) return "—";
  return moment(dateStr).format("DD MMMM YYYY [à] HH:mm");
}

async function loadGrades() {
  try {
    const studentId = authModule.getId;
    await gradesStore.loadStudentGrades(studentId);
  } catch (error) {
    console.error("Failed to load student grades", error);
  }
}

onMounted(() => {
  loadGrades();
});
</script>

<style scoped lang="scss">
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

.stat-card {
  border-radius: 12px;
  background: white;
  transition: transform 0.2s;
}

.body--dark .stat-card {
  background: #1e1e32;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.border-grey {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.print-only {
  display: none;
}

@media print {
  body {
    background: white !important;
    color: black !important;
  }
  
  .no-print,
  .q-drawer-container,
  .q-header,
  .q-footer,
  aside,
  button,
  .q-btn,
  .q-banner {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }

  .q-page-container {
    padding: 0 !important;
  }

  .q-page {
    padding: 0 !important;
    min-height: auto !important;
  }

  .myCard {
    box-shadow: none !important;
    border: none !important;
    background: white !important;
    padding: 0 !important;
    backdrop-filter: none !important;
  }

  .stat-card {
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    box-shadow: none !important;
    background: white !important;
    color: black !important;
  }

  .border-grey {
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
  }

  .q-table__container {
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    box-shadow: none !important;
  }

  .q-table th {
    background-color: #f5f5f5 !important;
    color: black !important;
    border-bottom: 2px solid rgba(0, 0, 0, 0.2) !important;
  }

  .q-table td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  }
  
  .text-primary {
    color: #1a237e !important;
  }
}
</style>
