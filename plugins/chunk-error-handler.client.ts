export default defineNuxtPlugin((nuxtApp) => {
  // Gestionnaire d'erreur global de Vue
  nuxtApp.vueApp.config.errorHandler = (error: any, instance: any, info: string) => {
    const errorMsg = String(error);
    if (
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('Failed to load module script') ||
      errorMsg.includes('Dynamic import failed')
    ) {
      console.warn('[Chunk Handler] Erreur d\'import dynamique détectée. Rechargement de la page pour rafraîchir les fichiers...');
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } else {
      // Pour les autres types d'erreurs, on laisse l'erreur se propager normalement
      console.error('[Vue Error]', error, info);
    }
  };

  // Écouter les erreurs de chargement globales (pour les balises <script> insérées dynamiquement par Vite)
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      const errorMsg = event.message || '';
      if (
        errorMsg.includes('Failed to fetch dynamically imported module') ||
        errorMsg.includes('Failed to load module script')
      ) {
        console.warn('[Chunk Handler] Erreur globale de chunk détectée. Rechargement...');
        window.location.reload();
      }
    }, true);

    // Écouter les promesses rejetées (Vite utilise des Promesses pour charger les modules dynamiques)
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason ? String(event.reason) : '';
      if (
        reason.includes('Failed to fetch dynamically imported module') ||
        reason.includes('Failed to load module script')
      ) {
        console.warn('[Chunk Handler] Promesse d\'import rejetée. Rechargement...');
        window.location.reload();
      }
    });
  }
});
