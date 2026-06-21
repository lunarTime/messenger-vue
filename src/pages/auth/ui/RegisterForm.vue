<script setup lang="ts">
import { reactive, ref, computed, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/shared/api/firebase";
import { sendOtp, verifyOtp } from "@/shared/api/otp";
import { useUserStore } from "@/entities/user/store/user.store";
import type { RegisterFormData } from "@/shared/types/auth";
import {
  getErrorMessage,
  getRetryAfter,
} from "@/shared/lib/errors/error";
import Button from "primevue/button";
import Message from "primevue/message";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import InputOtp from "primevue/inputotp";

const router = useRouter();
const userStore = useUserStore();

const formData = reactive<RegisterFormData>({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  jobTitle: "",
});

const confirmPassword = ref("");
const isLoading = ref(false);
const error = ref<string | null>(null);
const step = ref<"form" | "otp">("form");
const otpCode = ref("");
const otpInvalid = ref(false);
const resendCooldown = ref(0);
let resendTimer: ReturnType<typeof setInterval> | null = null;

const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true;
  return formData.password === confirmPassword.value;
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

async function handleRegister() {
  if (!formData.email || !formData.password || !formData.firstName) {
    error.value = "Заполните обязательные поля";

    return;
  }

  if (formData.password.length < 6) {
    error.value = "Пароль должен содержать минимум 6 символов";

    return;
  }

  if (formData.password !== confirmPassword.value) {
    error.value = "Пароли не совпадают";

    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const { expiresIn } = await sendOtp({
      email: formData.email,
      firstName: formData.firstName,
    });

    step.value = "otp";
    otpCode.value = "";
    otpInvalid.value = false;

    startResendCooldown(60);
    void expiresIn;
  } catch (caughtError) {
    error.value = getErrorMessage(
      caughtError,
      "Не удалось отправить код. Попробуйте позже",
    );
  } finally {
    isLoading.value = false;
  }
}

async function handleVerify(code?: string) {
  const value = code ?? otpCode.value;

  if (value.length !== 6) {
    error.value = "Введите 6-значный код";

    return;
  }

  isLoading.value = true;
  error.value = null;
  otpInvalid.value = false;

  try {
    const { customToken } = await verifyOtp({
      email: formData.email,
      code: value,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      jobTitle: formData.jobTitle,
    });

    await signInWithCustomToken(auth, customToken);

    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      if (userStore.isAuthenticated && !userStore.isLoading) {
        await router.replace({ name: "chat" });

        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));

      attempts++;
    }

    error.value = "Не удалось подтвердить вход. Попробуйте войти вручную";
  } catch (caughtError) {
    otpInvalid.value = true;
    otpCode.value = "";
    error.value = getErrorMessage(caughtError, "Неверный код");
  } finally {
    isLoading.value = false;
  }
}

async function handleResend() {
  if (resendCooldown.value > 0 || isLoading.value) return;

  isLoading.value = true;
  error.value = null;
  otpInvalid.value = false;

  try {
    await sendOtp({
      email: formData.email,
      firstName: formData.firstName,
    });

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

function onOtpUpdate(value: string | number | undefined | null) {
  const str = value == null ? "" : String(value);

  otpCode.value = str;

  if (otpInvalid.value && str.length > 0) {
    otpInvalid.value = false;
  }

  if (str.length === 6) {
    handleVerify(str);
  }
}

function backToForm() {
  step.value = "form";
  otpCode.value = "";
  otpInvalid.value = false;
  error.value = null;
}
</script>

<template>
  <div>
    <Message v-if="error" severity="error" class="mb-6">
      {{ error }}
    </Message>

    <form
      v-if="step === 'form'"
      @submit.prevent="handleRegister"
      class="space-y-4"
    >
      <div class="grid grid-cols-2 gap-4">
        <FloatLabel variant="on">
          <InputText
            id="firstName"
            v-model="formData.firstName"
            autocomplete="given-name"
            fluid
            required
            :disabled="isLoading"
          />
          <label for="firstName">Имя</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText
            id="lastName"
            v-model="formData.lastName"
            autocomplete="family-name"
            fluid
            :disabled="isLoading"
          />
          <label for="lastName">Фамилия</label>
        </FloatLabel>
      </div>

      <FloatLabel variant="on">
        <InputText
          id="jobTitle"
          v-model="formData.jobTitle"
          autocomplete="organization-title"
          fluid
          :maxlength="100"
          :disabled="isLoading"
        />
        <label for="jobTitle">Должность</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <InputText
          id="reg-email"
          v-model="formData.email"
          type="email"
          autocomplete="email"
          fluid
          required
          :disabled="isLoading"
        />
        <label for="reg-email">E-mail</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Password
          id="password"
          v-model="formData.password"
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
        <label for="password">Пароль</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Password
          id="confirmPassword"
          v-model="confirmPassword"
          :feedback="false"
          toggleMask
          fluid
          required
          :disabled="isLoading"
          :invalid="!passwordsMatch"
        />
        <label for="confirmPassword">Подтвердите пароль</label>
      </FloatLabel>

      <Button
        type="submit"
        class="w-full"
        :loading="isLoading"
        :disabled="!passwordsMatch"
      >
        Зарегистрироваться
      </Button>
    </form>

    <div v-else class="space-y-5">
      <div class="text-center space-y-1">
        <h3 class="text-lg font-semibold">Подтвердите email</h3>
        <p class="text-sm opacity-70">
          Мы отправили 6-значный код на
          <span class="font-medium">{{ formData.email }}</span>
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
        @click="handleVerify()"
      >
        Подтвердить
      </Button>

      <div class="flex items-center justify-between text-sm">
        <button
          type="button"
          class="opacity-70 hover:opacity-100 underline-offset-2 hover:underline"
          :disabled="isLoading"
          @click="backToForm"
        >
          Изменить данные
        </button>

        <button
          type="button"
          class="opacity-70 hover:opacity-100 underline-offset-2 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="resendCooldown > 0 || isLoading"
          @click="handleResend"
        >
          <span v-if="resendCooldown > 0">
            Отправить снова через {{ resendCooldown }} c
          </span>
          <span v-else>Отправить код повторно</span>
        </button>
      </div>
    </div>
  </div>
</template>
