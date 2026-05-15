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
import UserViewPanel from "@/features/user-profile/ui/UserViewPanel.vue";
import UserProfilePanel from "@/features/user-profile/ui/UserProfilePanel.vue";
import Drawer from "primevue/drawer";

const props = defineProps<{
  chatId: string;
}>();

const emit = defineEmits<{ close: [] }>();

const chatStore = useChatStore();
const userStore = useUserStore();
const { removeMember, promoteMember, demoteMember, toggleMute } =
  useChatActions();

const isMuted = computed(() => chatStore.isChatMuted(props.chatId));
const now = useGlobalNow(30000);

const members = ref<{ userId: string; role: ChatMemberRole }[]>([]);
const participantsData = ref<Map<string, User>>(new Map());
const showAddModal = ref(false);
const showEditModal = ref(false);
const viewingUserId = ref<string | null>(null);
const showMyProfile = ref(false);

const openMemberProfile = (userId: string) => {
  if (userId === userStore.userId) {
    showMyProfile.value = true;
  } else {
    viewingUserId.value = userId;
  }
};

const chat = computed(() => chatStore.chats.find((c) => c.id === props.chatId));
const isOwner = computed(() => chatStore.isChatOwner(props.chatId));
const isAdmin = computed(() => chatStore.isChatAdmin(props.chatId));

const avatarBgColor = computed(() => getAvatarColor(props.chatId));

const memberSubscriptions = new Map<string, () => void>();
let chatMembersUnsubscribe: (() => void) | null = null;

const sortedMembers = computed(() => {
  return [...members.value].sort((a, b) => {
    if (a.userId === chat.value?.createdBy) return -1;
    if (b.userId === chat.value?.createdBy) return 1;
    if ((a.role === "owner" || a.role === "admin") && b.role === "member")
      return -1;
    if (a.role === "member" && (b.role === "owner" || b.role === "admin"))
      return 1;

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
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex flex-col items-center md:gap-2 gap-1 md:p-8 p-3">
      <div class="relative">
        <Avatar
          :image="chat?.photoURL || undefined"
          :icon="!chat?.photoURL ? 'pi pi-users' : undefined"
          class="md:w-32! md:h-32! w-22! h-22! rounded-2xl! overflow-hidden shadow-lg"
          :class="[!chat?.photoURL ? avatarBgColor + ' text-white!' : '']"
          shape="square"
          :pt="{
            image: {
              class: 'object-cover',
              alt: chat?.name || 'Групповой чат',
            },
          }"
        />
        <Button
          v-if="isOwner"
          icon="pi pi-pencil"
          rounded
          size="small"
          class="absolute! -top-3 -right-3 w-8! h-8! opacity-50 hover:opacity-100 active:opacity-100 transition-opacity!"
          @click="showEditModal = true"
          aria-label="Редактировать группу"
          v-tooltip.top="'Редактировать группу'"
        />
      </div>

      <div class="text-center">
        <div class="flex items-center justify-center gap-2">
          <h2
            class="md:text-2xl text-lg font-bold truncate max-w-[200px] leading-6"
          >
            {{ chat?.name || "Групповой чат" }}
          </h2>
        </div>
        <p class="text-sm opacity-70 mt-1">{{ members.length }} участников</p>
      </div>

      <div class="mt-2 flex items-center gap-2">
        <Button
          v-if="isAdmin"
          label="Добавить участников"
          icon="pi pi-user-plus"
          rounded
          size="small"
          @click="showAddModal = true"
        />
        <Button
          :label="isMuted ? 'Включить уведомления' : 'Отключить уведомления'"
          :icon="isMuted ? 'pi pi-bell' : 'pi pi-bell-slash'"
          severity="secondary"
          rounded
          size="small"
          @click="toggleMute(chatId)"
        />
      </div>
    </div>

    <Divider class="md:my-0! my-1!" />

    <div class="flex-1 overflow-y-auto">
      <h3 class="md:my-4 mb-2 mt-2 md:text-xl text-sm font-semibold opacity-70">
        Участники
      </h3>
      <div class="flex flex-col gap-2">
        <div
          v-for="member in sortedMembers"
          :key="member.userId"
          class="flex items-center gap-2 group"
        >
          <button
            class="flex items-center gap-2 flex-1 min-w-0 cursor-pointer rounded-lg py-1 px-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
            @click="openMemberProfile(member.userId)"
          >
            <div class="relative flex min-w-max">
              <Avatar
                :image="
                  participantsData.get(member.userId)?.photoURL || undefined
                "
                shape="circle"
                :label="
                  !participantsData.get(member.userId)?.photoURL
                    ? (participantsData.get(member.userId)?.displayName || '?')
                        .charAt(0)
                        .toUpperCase()
                    : undefined
                "
                class="w-12! h-12! overflow-hidden"
                :class="[
                  !participantsData.get(member.userId)?.photoURL
                    ? getAvatarColor(member.userId) + ' text-white!'
                    : '',
                ]"
                :pt="{
                  image: {
                    alt: participantsData.get(member.userId)?.displayName,
                    class: 'object-cover',
                  },
                }"
              />
              <div
                v-if="isUserOnline(member.userId)"
                class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full"
              />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1">
                <span class="text-sm font-medium truncate">
                  {{
                    participantsData.get(member.userId)?.displayName ||
                    "Загрузка..."
                  }}
                </span>
                <span
                  v-if="member.userId === userStore.userId"
                  class="opacity-50 text-xs flex-none"
                >
                  (Вы)
                </span>
              </div>
              <div class="text-xs opacity-60">
                {{ isUserOnline(member.userId) ? "в сети" : "не в сети" }}
              </div>
            </div>
          </button>

          <div class="flex items-center gap-1">
            <Button
              v-if="
                isOwner &&
                member.userId !== userStore.userId &&
                member.role !== 'admin'
              "
              icon="pi pi-shield"
              severity="secondary"
              text
              rounded
              size="small"
              class="md:opacity-0 md:group-hover:opacity-100 md:transition-opacity"
              @click="promoteMember(chatId, member.userId)"
              aria-label="Назначить администратором"
              v-tooltip.top="'Назначить администратором'"
            />
            <Button
              v-if="
                isOwner &&
                member.userId !== userStore.userId &&
                member.role === 'admin'
              "
              icon="pi pi-shield"
              severity="warn"
              text
              rounded
              size="small"
              class="md:opacity-0 md:group-hover:opacity-100 md:transition-opacity"
              @click="demoteMember(chatId, member.userId)"
              aria-label="Снять права администратора"
              v-tooltip.top="'Снять права администратора'"
            />
            <Button
              v-if="
                isAdmin &&
                member.userId !== userStore.userId &&
                member.userId !== chat?.createdBy &&
                (isOwner || member.role !== 'admin')
              "
              icon="pi pi-user-minus"
              severity="secondary"
              text
              rounded
              size="small"
              class="md:opacity-0 md:group-hover:opacity-100 md:transition-opacity"
              @click="removeMember(chatId, member.userId)"
              aria-label="Исключить из группы"
              v-tooltip.top="'Исключить из группы'"
            />
            <Badge
              v-if="member.userId === chat?.createdBy"
              value="Владелец"
              severity="warn"
              class="text-sm!"
            />
            <Badge
              v-else-if="member.role === 'admin'"
              value="Админ"
              severity="info"
              class="text-sm!"
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

  <Drawer
    :visible="!!viewingUserId"
    @update:visible="
      (v) => {
        if (!v) viewingUserId = null;
      }
    "
    position="right"
    header="Профиль"
    class="w-full! max-w-md! border-none! dark:bg-black/70! md:rounded-l-xl bg-white/70! backdrop-blur-xs"
    :pt="{
      header: { class: 'md:p-[1.25rem]! p-3! pb-0!' },
      title: { class: 'md:text-2xl! text-lg! leading-none!' },
    }"
  >
    <UserViewPanel
      :user-id="viewingUserId"
      @open-chat="
        chatStore.selectChat($event);
        viewingUserId = null;
      "
      @write-directly="
        viewingUserId && chatStore.openChatWith(viewingUserId);
        viewingUserId = null;
        emit('close');
      "
    />
  </Drawer>

  <Drawer
    v-model:visible="showMyProfile"
    position="right"
    header="Мой профиль"
    class="w-full! max-w-md! border-none! dark:bg-black/70! md:rounded-l-xl bg-white/70! backdrop-blur-xs"
    :pt="{
      header: { class: 'md:p-[1.25rem]! p-3! pb-0!' },
      title: { class: 'md:text-2xl! text-lg! leading-none!' },
    }"
  >
    <UserProfilePanel :visible="showMyProfile" />
  </Drawer>
</template>
