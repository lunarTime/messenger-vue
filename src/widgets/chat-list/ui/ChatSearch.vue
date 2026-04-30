<script setup lang="ts">
import { ref } from "vue";
import { useUserSearch } from "@/features/search-users/model/useUserSearch";
import type { AutoCompleteOptionSelectEvent } from "primevue/autocomplete";
import type { User } from "@/shared/types/user";
import AutoComplete from "primevue/autocomplete";
import Avatar from "primevue/avatar";
import Message from "primevue/message";
import Button from "primevue/button";
import CreateGroupModal from "@/features/chat-actions/ui/CreateGroupModal.vue";
import { useChatStore } from "@/entities/chat/store/chat.store";

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

const onSelect = (event: AutoCompleteOptionSelectEvent) => {
  handleSelectUser(event.value as User);
};

const onGroupCreated = (chatId: string) => {
  chatStore.selectChat(chatId);
};
</script>

<template>
  <div class="flex items-center gap-2">
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
            class="flex items-center justify-between w-full gap-3 py-2 px-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-md transition-colors"
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
                  {{ option.email }}
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
      icon="pi pi-users"
      class="shrink-0"
      @click="isCreateModalVisible = true"
      title="Создать группу"
    />

    <CreateGroupModal
      v-model:visible="isCreateModalVisible"
      @created="onGroupCreated"
    />
  </div>
</template>
