<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from "vue";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/shared/api/firebase";
import { useAuthNavigation } from "@/entities/user/model/useAuthNavigation";
import { loginWithEmail } from "@/shared/api/firebase/auth";
import { confirmPasswordReset, requestPasswordReset } from "@/shared/api/otp";
import type { LoginFormData } from "@/shared/types/auth";
import {
  getErrorCode,
  getErrorMessage,
  getRetryAfter,
} from "@/shared/lib/errors/error";
import Button from "primevue/button";
import Message from "primevue/message";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import InputOtp from "primevue/inputotp";

type Step = "login" | "reset-email" | "reset-otp" | "reset-password";

const { navigateAfterAuthFast } = useAuthNavigation();

const formData = reactive<LoginFormData>({
  email: "",
  password: "",
});

const isLoading = ref(false);
const error = ref<string | null>(null);
const info = ref<string | null>(null);
const step = ref<Step>("login");
const resetEmail = ref("");
const otpCode = ref("");
const otpInvalid = ref(false);
const newPassword = ref("");
const confirmNewPassword = ref("");
const resendCooldown = ref(0);
let resendTimer: ReturnType<typeof setInterval> | null = null;

const passwordsMatch = computed(() => {
  if (!confirmNewPassword.value) return true;
  return newPassword.value === confirmNewPassword.value;
});

function startResendCooldown(seconds: number) {
  resendCooldown.value = seconds;

  if (resendTimer) clearInterval(resendTimer);

  resendTimer = setInterval(() => {
    resendCooldown.value -= 1;

    if (resendCooldown.value <= 0 && resendTimer) {
      clearInterval(resendTimer);

      resendTimer = null;
    }
  }, 1000);
}

onBeforeUnmount(() => {
  if (resendTimer) clearInterval(resendTimer);
});

function resetState() {
  error.value = null;
  info.value = null;
  otpCode.value = "";
  otpInvalid.value = false;
  newPassword.value = "";
  confirmNewPassword.value = "";
}

function goToLogin() {
  step.value = "login";

  resetState();

  resetEmail.value = "";
}

function goToResetEmail() {
  const previousEmail = resetEmail.value || formData.email;

  step.value = "reset-email";

  resetState();

  resetEmail.value = previousEmail;
}

async function handleEmailLogin() {
  if (!formData.email || !formData.password) {
    error.value = "Заполните все поля";
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    await loginWithEmail(formData.email, formData.password);
    await navigateAfterAuthFast();
  } catch (caughtError) {
    error.value = getLoginErrorMessage(getErrorCode(caughtError));
  } finally {
    isLoading.value = false;
  }
}

async function handleResetRequest() {
  if (!resetEmail.value) {
    error.value = "Введите email";

    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    await requestPasswordReset({ email: resetEmail.value });

    step.value = "reset-otp";
    info.value =
      "Если этот email зарегистрирован, мы отправили на него код подтверждения. Не пришло письмо? Проверьте папку «Спам».";

    startResendCooldown(60);
  } catch (caughtError) {
    const retryAfter = getRetryAfter(caughtError);

    error.value = getErrorMessage(
      caughtError,
      "Не удалось отправить код. Попробуйте позже",
    );
    if (retryAfter !== null) {
      startResendCooldown(retryAfter);
    }
  } finally {
    isLoading.value = false;
  }
}

async function handleResendReset() {
  if (resendCooldown.value > 0 || isLoading.value) return;

  isLoading.value = true;
  error.value = null;
  otpInvalid.value = false;

  try {
    await requestPasswordReset({ email: resetEmail.value });

    otpCode.value = "";

    startResendCooldown(60);
  } catch (caughtError) {
    const retryAfter = getRetryAfter(caughtError);

    if (retryAfter !== null) {
      startResendCooldown(retryAfter);
    }

    error.value = getErrorMessage(caughtError, "Не удалось отправить код");
  } finally {
    isLoading.value = false;
  }
}

function handleOtpComplete(code: string) {
  otpCode.value = code;
  otpInvalid.value = false;
  error.value = null;
  info.value = null;
  step.value = "reset-password";
}

function onOtpUpdate(value: string | number | undefined | null) {
  const str = value == null ? "" : String(value);

  otpCode.value = str;

  if (otpInvalid.value && str.length > 0) {
    otpInvalid.value = false;
  }

  if (str.length === 6) {
    handleOtpComplete(str);
  }
}

async function handlePasswordChange() {
  if (newPassword.value.length < 6) {
    error.value = "Пароль должен содержать минимум 6 символов";

    return;
  }
  if (newPassword.value !== confirmNewPassword.value) {
    error.value = "Пароли не совпадают";

    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const { customToken } = await confirmPasswordReset({
      email: resetEmail.value,
      code: otpCode.value,
      newPassword: newPassword.value,
    });

    await signInWithCustomToken(auth, customToken);
    await navigateAfterAuthFast();
  } catch (caughtError) {
    const message = getErrorMessage(caughtError, "Не удалось сменить пароль");

    if (message.toLowerCase().includes("код")) {
      otpInvalid.value = true;
      otpCode.value = "";
      step.value = "reset-otp";
    }

    error.value = message;
  } finally {
    isLoading.value = false;
  }
}

function getLoginErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    "auth/invalid-email": "Неверный формат email",
    "auth/user-disabled": "Аккаунт заблокирован",
    "auth/user-not-found": "Пользователь не найден",
    "auth/wrong-password": "Неверный пароль",
    "auth/invalid-credential": "Неверный email или пароль",
    "auth/too-many-requests": "Слишком много попыток. Попробуйте позже",
    "auth/network-request-failed": "Ошибка сети",
  };

  return messages[code] || "Произошла ошибка. Попробуйте еще раз";
}
</script>

<template>
  <div>
    <Message v-if="error" severity="error" class="mb-6">
      {{ error }}
    </Message>

    <Message v-if="info && !error" severity="info" class="mb-6">
      {{ info }}
    </Message>

    <form
      v-if="step === 'login'"
      @submit.prevent="handleEmailLogin"
      class="space-y-4"
    >
      <FloatLabel variant="on">
        <InputText
          id="email"
          v-model="formData.email"
          autocomplete="on"
          showClear
          required
          fluid
          :disabled="isLoading"
        />
        <label for="email">E-mail</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Password
          id="password"
          v-model="formData.password"
          showClear
          required
          fluid
          :feedback="false"
          :disabled="isLoading"
        />
        <label for="password">Пароль</label>
      </FloatLabel>

      <div class="flex justify-end">
        <button
          type="button"
          class="text-sm opacity-70 hover:opacity-100 underline-offset-2 hover:underline"
          :disabled="isLoading"
          @click="goToResetEmail"
        >
          Забыли пароль?
        </button>
      </div>

      <Button
        type="submit"
        :disabled="isLoading"
        :loading="isLoading"
        class="w-full"
      >
        {{ isLoading ? "Вход..." : "Войти" }}
      </Button>
    </form>

    <form
      v-else-if="step === 'reset-email'"
      @submit.prevent="handleResetRequest"
      class="space-y-5"
    >
      <div class="text-center space-y-1">
        <h3 class="text-lg font-semibold">Сброс пароля</h3>
        <p class="text-sm opacity-70">
          Введите email, на который зарегистрирован аккаунт
        </p>
      </div>

      <FloatLabel variant="on">
        <InputText
          id="reset-email"
          v-model="resetEmail"
          type="email"
          autocomplete="email"
          fluid
          required
          :disabled="isLoading"
        />
        <label for="reset-email">E-mail</label>
      </FloatLabel>

      <Button
        type="submit"
        class="w-full"
        :loading="isLoading"
        :disabled="!resetEmail"
      >
        Отправить код
      </Button>

      <div class="flex justify-center">
        <button
          type="button"
          class="text-sm opacity-70 hover:opacity-100 underline-offset-2 hover:underline"
          :disabled="isLoading"
          @click="goToLogin"
        >
          ← Назад ко входу
        </button>
      </div>
    </form>

    <div v-else-if="step === 'reset-otp'" class="space-y-5">
      <div class="text-center space-y-1">
        <h3 class="text-lg font-semibold">Подтвердите email</h3>
        <p class="text-sm opacity-70">
          Введите 6-значный код из письма на
          <span class="font-medium">{{ resetEmail }}</span>
        </p>
      </div>

      <div class="flex justify-center">
        <InputOtp
          v-model="otpCode"
          :length="6"
          integerOnly
          :disabled="isLoading"
          :invalid="otpInvalid"
          @update:modelValue="onOtpUpdate"
        />
      </div>

      <Button
        class="w-full"
        :loading="isLoading"
        :disabled="otpCode.length !== 6"
        @click="handleOtpComplete(otpCode)"
      >
        Продолжить
      </Button>

      <div class="flex items-center justify-between text-sm">
        <button
          type="button"
          class="opacity-70 hover:opacity-100 underline-offset-2 hover:underline"
          :disabled="isLoading"
          @click="goToResetEmail"
        >
          Изменить email
        </button>

        <button
          type="button"
          class="opacity-70 hover:opacity-100 underline-offset-2 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="resendCooldown > 0 || isLoading"
          @click="handleResendReset"
        >
          <span v-if="resendCooldown > 0">
            Отправить снова через {{ resendCooldown }} c
          </span>
          <span v-else>Отправить код повторно</span>
        </button>
      </div>
    </div>

    <form
      v-else-if="step === 'reset-password'"
      @submit.prevent="handlePasswordChange"
      class="space-y-5"
    >
      <div class="text-center space-y-1">
        <h3 class="text-lg font-semibold">Новый пароль</h3>
        <p class="text-sm opacity-70">
          Придумайте пароль, который вы будете использовать для входа
        </p>
      </div>

      <FloatLabel variant="on">
        <Password
          id="new-password"
          v-model="newPassword"
          :feedback="true"
          promptLabel="Введите пароль"
          weakLabel="Слабый пароль"
          mediumLabel="Средний пароль"
          strongLabel="Сложный пароль"
          toggleMask
          fluid
          required
          :disabled="isLoading"
        />
        <label for="new-password">Новый пароль</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Password
          id="confirm-new-password"
          v-model="confirmNewPassword"
          :feedback="false"
          toggleMask
          fluid
          required
          :disabled="isLoading"
          :invalid="!passwordsMatch"
        />
        <label for="confirm-new-password">Подтвердите пароль</label>
      </FloatLabel>

      <Button
        type="submit"
        class="w-full"
        :loading="isLoading"
        :disabled="!passwordsMatch || !newPassword || !confirmNewPassword"
      >
        Сменить пароль и войти
      </Button>
    </form>
  </div>
</template>
