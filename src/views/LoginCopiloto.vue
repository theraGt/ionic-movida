<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="login-icon">
          <ion-icon :icon="heartCircleOutline" />
        </div>
        <h1>Copiloto Emocional</h1>
        <p>{{ isRegister ? 'Crea tu cuenta' : 'Inicia sesión para continuar' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div v-if="isRegister" class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="formData.nombre" placeholder="Tu nombre" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="formData.email" placeholder="tu@email.com" required />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="formData.password" placeholder="Tu contraseña" required />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Cargando...' : (isRegister ? 'Crear Cuenta' : 'Iniciar Sesión') }}
        </button>
      </form>

      <div class="login-footer">
        <p v-if="!isRegister">
          No tienes cuenta?
          <button type="button" @click="toggleMode" class="link-btn">Regístrate</button>
        </p>
        <p v-else>
          Ya tienes cuenta?
          <button type="button" @click="toggleMode" class="link-btn">Inicia sesión</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { IonIcon } from '@ionic/vue';
import { heartCircleOutline } from 'ionicons/icons';
import { llmService, type CopilotoUser } from '@/services/llmService';

interface Props {
  onLogin: (user: CopilotoUser) => void;
}

const props = defineProps<Props>();

const isRegister = ref(false);
const loading = ref(false);
const error = ref('');

const formData = reactive({
  nombre: '',
  email: '',
  password: ''
});

const toggleMode = () => {
  isRegister.value = !isRegister.value;
  error.value = '';
};

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    if (isRegister.value) {
      const result = await llmService.registerCopiloto(
        formData.email,
        formData.password,
        formData.nombre
      );

      if (result.success && result.data) {
        localStorage.setItem('copilotoUser', JSON.stringify(result.data));
        props.onLogin(result.data);
      } else {
        error.value = result.error || 'Error al registrar usuario';
      }
    } else {
      const result = await llmService.loginCopiloto(
        formData.email,
        formData.password
      );

      if (result.success && result.data) {
        localStorage.setItem('copilotoUser', JSON.stringify(result.data));
        props.onLogin(result.data);
      } else {
        error.value = result.error || 'Credenciales inválidas';
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Error de conexión';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
}

.login-icon ion-icon {
  font-size: 36px;
  color: white;
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #1e293b;
}

.login-header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.error-message {
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #dc2626;
  font-size: 14px;
}

.btn-submit {
  padding: 14px 24px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  margin-top: 24px;
  text-align: center;
}

.login-footer p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.link-btn {
  background: none;
  border: none;
  color: #0ea5e9;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.link-btn:hover {
  text-decoration: underline;
}

/* Dark Mode Styles */
.dark .login-container {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
}

.dark .login-card {
  background: #1e293b;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.dark .login-header h1 {
  color: #f3f4f6;
}

.dark .login-header p {
  color: #94a3b8;
}

.dark .form-group label {
  color: #d1d5db;
}

.dark .form-group input {
  background: #0f172a;
  border-color: #334155;
  color: #f3f4f6;
}

.dark .form-group input:focus {
  border-color: #0ea5e9;
  background: #1e293b;
}

.dark .login-footer p {
  color: #94a3b8;
}

.dark .link-btn {
  color: #38bdf8;
}
</style>
