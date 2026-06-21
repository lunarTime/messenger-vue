<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useUserSearch } from "@/features/search-users/model/useUserSearch";
import type { AutoCompleteOptionSelectEvent } from "primevue/autocomplete";
import type { User } from "@/shared/types/user";
import AutoComplete from "primevue/autocomplete";
import Avatar from "primevue/avatar";
import Message from "primevue/message";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import CreateGroupModal from "@/features/chat-actions/ui/CreateGroupModal.vue";
import { useChatStore } from "@/entities/chat/store/chat.store";

const emit = defineEmits<{
  "filter-change": [query: string];
}>();

const chatStore = useChatStore();
const {
  searchQuery,
  users,
  isLoading,
  error,
  handleSelectUser,
  getUserOnlineStatus,
} = useUserSearch();

const isCreateModalVisible = ref(false);
const isFilterOpen = ref(false);
const filterQuery = ref("");
const filterInputRef = ref<InstanceType<typeof InputText> | null>(null);

const onSelect = (event: AutoCompleteOptionSelectEvent) => {
  searchQuery.value = "";
  handleSelectUser(event.value as User);
};

const onGroupCreated = (chatId: string) => {
  chatStore.selectChat(chatId);
};

const toggleFilter = async () => {
  isFilterOpen.value = !isFilterOpen.value;

  if (isFilterOpen.value) {
    await nextTick();

    (filterInputRef.value as any)?.$el?.focus();
  } else {
    filterQuery.value = "";

    emit("filter-change", "");
  }
};

const onFilterInput = (e: Event) => {
  filterQuery.value = (e.target as HTMLInputElement).value;

  emit("filter-change", filterQuery.value);
};

const onFilterKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") toggleFilter();
};
</script>

<template>
  <div class="flex flex-col dark:bg-black/20 bg-white/40 rounded-md">
    <div class="flex items-center gap-2 py-2 px-2">
      <div class="flex-1">
        <AutoComplete
          v-model="searchQuery"
          :suggestions="users"
          :loading="isLoading"
          @item-select="onSelect"
          placeholder="Поиск по email или имени..."
          :virtual-scroller-options="{ itemSize: 64 }"
          fluid
        >
          <template #option="{ option }">
            <div
              class="flex items-center justify-between w-full gap-3 py-2 px-1 rounded-md transition-colors"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="relative shrink-0">
                  <Avatar
                    :image="option?.photoURL ?? undefined"
                    :label="
                      option?.photoURL
                        ? undefined
                        : option?.displayName?.charAt(0).toUpperCase()
                    "
                    :class="
                      option?.photoURL
                        ? undefined
                        : 'bg-(--p-primary-color)! text-white!'
                    "
                    shape="circle"
                    size="large"
                    :pt="{
                      image: {
                        alt: option?.displayName,
                        class: 'object-cover',
                      },
                    }"
                  />

                  <Transition
                    enter-active-class="transition-transform duration-200"
                    enter-from-class="scale-0"
                    enter-to-class="scale-100"
                    leave-active-class="transition-transform duration-150"
                    leave-from-class="scale-100"
                    leave-to-class="scale-0"
                  >
                    <div
                      v-if="getUserOnlineStatus(option)"
                      class="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-500 border"
                      title="Онлайн"
                    />
                  </Transition>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-base truncate">
                    {{ option.displayName }}
                  </div>
                  <div class="text-sm truncate">
                    {{ option.jobTitle ? `${option.jobTitle} · ${option.email}` : option.email }}
                  </div>
                </div>
              </div>

              <i class="pi pi-angle-right shrink-0" />
            </div>
          </template>

          <template #empty>
            <div class="p-6 text-center">
              <i class="pi pi-search text-3xl mb-3 block opacity-50"></i>
              <p class="text-base font-medium mb-1">
                {{
                  searchQuery
                    ? "Пользователи не найдены"
                    : "Начните вводить для поиска"
                }}
              </p>
              <p v-if="!searchQuery" class="text-sm opacity-75">
                Поиск по имени или email адресу
              </p>
            </div>
          </template>
          <template #header>
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <Message
                v-if="error"
                severity="error"
                :closable="false"
                class="m-3"
              >
                {{ error }}
              </Message>
            </Transition>
          </template>
        </AutoComplete>
      </div>

      <Button
        :icon="isFilterOpen ? 'pi pi-times' : 'pi pi-search'"
        :text="!isFilterOpen"
        :severity="isFilterOpen ? 'secondary' : 'secondary'"
        class="shrink-0"
        :title="isFilterOpen ? 'Закрыть фильтр' : 'Фильтр чатов'"
        @click="toggleFilter"
      />

      <Button
        icon="pi pi-users"
        class="shrink-0"
        @click="isCreateModalVisible = true"
        aria-label="Создать группу"
        title="Создать группу"
      />
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isFilterOpen" class="px-2 pb-2">
        <InputText
          ref="filterInputRef"
          :value="filterQuery"
          placeholder="Фильтр по имени или сообщению..."
          class="w-full h-8! text-sm!"
          @input="onFilterInput"
          @keydown="onFilterKeydown"
        />
      </div>
    </Transition>

    <CreateGroupModal
      v-model:visible="isCreateModalVisible"
      @created="onGroupCreated"
    />
  </div>
</template>
