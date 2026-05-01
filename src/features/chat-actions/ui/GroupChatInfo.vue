<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from "vue";
import { useChatStore } from "@/entities/chat/store/chat.store";
import { useUserStore } from "@/entities/user/store/user.store";
import {
  subscribeToChatMembers,
  subscribeToUser,
} from "@/shared/api/firebase/firestore";
import type { User } from "@/shared/types/user";
import type { ChatMemberRole } from "@/shared/types/chat";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Badge from "primevue/badge";
import { getAvatarColor } from "@/shared/utils/avatarColors";
import AddMemberModal from "./AddMemberModal.vue";
import { useGlobalNow } from "@/shared/composables/useGlobalNow";
import { useChatActions } from "@/features/chat-actions/model/useChatActions";
import EditGroupModal from "./EditGroupModal.vue";

const props = defineProps<{
  chatId: string;
}>();

const chatStore = useChatStore();
const userStore = useUserStore();
const { removeMember } = useChatActions();
const now = useGlobalNow(30000);

const members = ref<{ userId: string; role: ChatMemberRole }[]>([]);
const participantsData = ref<Map<string, User>>(new Map());
const showAddModal = ref(false);
const showEditModal = ref(false);

const chat = computed(() => chatStore.chats.find((c) => c.id === props.chatId));
const isAdmin = computed(() => chatStore.isChatAdmin(props.chatId));

const avatarBgColor = computed(() => getAvatarColor(props.chatId));

const memberSubscriptions = new Map<string, () => void>();
let chatMembersUnsubscribe: (() => void) | null = null;

const sortedMembers = computed(() => {
  return [...members.value].sort((a, b) => {
    if (a.userId === chat.value?.createdBy) return -1;
    if (b.userId === chat.value?.createdBy) return 1;
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;

    const nameA = participantsData.value.get(a.userId)?.displayName || "";
    const nameB = participantsData.value.get(b.userId)?.displayName || "";

    return nameA.localeCompare(nameB);
  });
});

const isUserOnline = (userId: string) => {
  const user = participantsData.value.get(userId);

  if (!user || !user.isOnline) return false;

  if (user.lastSeen) {
    const lastSeenMillis = user.lastSeen.toMillis();
    const diff = now.value - lastSeenMillis;

    return diff < 120000;
  }
  return false;
};

const setupSubscriptions = () => {
  if (chatMembersUnsubscribe) chatMembersUnsubscribe();

  chatMembersUnsubscribe = subscribeToChatMembers(
    props.chatId,
    (newMembers) => {
      members.value = newMembers;

      newMembers.forEach((m) => {
        if (!memberSubscriptions.has(m.userId)) {
          const unsub = subscribeToUser(m.userId, (userData) => {
            if (userData) {
              participantsData.value.set(m.userId, userData);
            }
          });

          memberSubscriptions.set(m.userId, unsub);
        }
      });

      const memberIds = new Set(newMembers.map((m) => m.userId));

      memberSubscriptions.forEach((unsub, userId) => {
        if (!memberIds.has(userId)) {
          unsub();

          memberSubscriptions.delete(userId);
          participantsData.value.delete(userId);
        }
      });
    },
  );
};

watch(() => props.chatId, setupSubscriptions, { immediate: true });

onUnmounted(() => {
  if (chatMembersUnsubscribe) chatMembersUnsubscribe();

  memberSubscriptions.forEach((unsub) => unsub());
});
</script>

<template>
  <div
    class="flex flex-col h-full overflow-hidden bg-surface-50 dark:bg-surface-950"
  >
    <div
      class="flex flex-col items-center gap-4 p-8 bg-surface-0 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800"
    >
      <Avatar
        :image="chat?.photoURL || undefined"
        :icon="!chat?.photoURL ? 'pi pi-users' : undefined"
        class="w-32! h-32! text-4xl! rounded-3xl! overflow-hidden shadow-lg"
        :class="[!chat?.photoURL ? avatarBgColor + ' text-white!' : '']"
        shape="square"
        :pt="{
          image: { class: 'object-cover' },
        }"
      />
      <div class="text-center">
        <div class="flex items-center justify-center gap-2">
          <h2 class="text-2xl font-bold truncate max-w-[200px]">
            {{ chat?.name || "Групповой чат" }}
          </h2>
          <Button
            v-if="isAdmin"
            icon="pi pi-pencil"
            text
            rounded
            size="small"
            class="w-8! h-8!"
            @click="showEditModal = true"
            v-tooltip.top="'Редактировать группу'"
          />
        </div>
        <p class="text-sm opacity-60 mt-1">{{ members.length }} участников</p>
      </div>

      <div v-if="isAdmin" class="mt-2">
        <Button
          label="Добавить участников"
          icon="pi pi-user-plus"
          rounded
          size="small"
          @click="showAddModal = true"
        />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <h3
        class="text-sm font-semibold opacity-50 uppercase tracking-wider mb-4 px-2"
      >
        Участники
      </h3>
      <div class="flex flex-col gap-1">
        <div
          v-for="member in sortedMembers"
          :key="member.userId"
          class="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors group"
        >
          <div class="relative">
            <Avatar
              :image="
                participantsData.get(member.userId)?.photoURL || undefined
              "
              :label="
                !participantsData.get(member.userId)?.photoURL
                  ? (participantsData.get(member.userId)?.displayName || '?')
                      .charAt(0)
                      .toUpperCase()
                  : undefined
              "
              class="w-12! h-12! rounded-xl! overflow-hidden"
              :class="[
                !participantsData.get(member.userId)?.photoURL
                  ? getAvatarColor(member.userId) + ' text-white!'
                  : '',
              ]"
            />
            <div
              v-if="isUserOnline(member.userId)"
              class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-surface-0 dark:border-surface-900 rounded-full"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium truncate">
                {{
                  participantsData.get(member.userId)?.displayName ||
                  "Загрузка..."
                }}
                <span
                  v-if="member.userId === userStore.userId"
                  class="opacity-50 font-normal"
                >
                  (Вы)
                </span>
              </span>
            </div>
            <div class="text-xs opacity-60">
              {{ isUserOnline(member.userId) ? "в сети" : "не в сети" }}
            </div>
          </div>

          <div class="flex items-center gap-1">
            <Badge
              v-if="member.userId === chat?.createdBy"
              value="Владелец"
              severity="warn"
              class="text-[10px]!"
            />
            <Badge
              v-else-if="member.role === 'admin'"
              value="Админ"
              severity="info"
              class="text-[10px]!"
            />

            <Button
              v-if="
                isAdmin &&
                member.userId !== userStore.userId &&
                member.userId !== chat?.createdBy
              "
              icon="pi pi-user-minus"
              severity="secondary"
              text
              rounded
              size="small"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              @click="removeMember(chatId, member.userId)"
              v-tooltip.top="'Исключить из группы'"
            />
          </div>
        </div>
      </div>
    </div>

    <AddMemberModal
      v-model:visible="showAddModal"
      :chat-id="chatId"
      :existing-participant-ids="members.map((m) => m.userId)"
    />

    <EditGroupModal v-model:visible="showEditModal" :chat-id="chatId" />
  </div>
</template>
