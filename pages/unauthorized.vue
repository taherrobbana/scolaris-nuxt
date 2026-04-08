<template>
    <q-page padding>
        <div class="myCard">
            <div class="unauthorized-container">
                <div class="content">
                    <div class="icon">🚫</div>
                    <h1>Accès Restreint</h1>
                    <p>
                        <i18n-t keypath="unauthorizedPage.unauthorizedMessage" tag="p">
                            <template #name>
                                <strong>{{ user?.firstName || 'utilisateur' }}</strong>
                            </template>
                            <template #role>
                                <span class="text-red text-bold">{{ user?.role }}</span>
                            </template>
                        </i18n-t>
                    </p>
                    <div class="actions">
                        <q-btn flat no-caps :label="$t('error.back')" @click="router.back()" />
                        <q-btn no-caps :label="$t('error.home')" color="primary" to="/" />
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { useAuthModule } from '~/stores/auth/authModule';

const router = useRouter()
const authModule = useAuthModule();
const user = authModule;

definePageMeta({
    layout: 'default'
})

useHead({
  title: 'Accès restreint - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>
<style scoped lang="scss">
.unauthorized-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70vh;
    text-align: center;
    font-family: sans-serif;
}

.icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

h1 {
    color: #2d3748;
    font-size: 2rem;
}

p {
    color: #718096;
    margin: 1rem 0 2rem;
}

span {
    font-weight: bold;
    color: #e53e3e;
    text-transform: uppercase;
}

.actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn-primary {
    background: #4f46e5;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
}

.btn-secondary {
    background: #edf2f7;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
}
</style>