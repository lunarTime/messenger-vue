import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/shared/api/firebase";
import {
  getUserById,
  searchUsers,
  setUserOnlineStatus,
  updateUserProfile,
  subscribeToUser,
} from "@/shared/api/firebase/firestore";
import type { User } from "@/shared/types/user";
import type { UserUpdateData } from "@/shared/types/user";
import type { Unsubscribe } from "firebase/firestore";

const USER_CACHE_KEY = "messenger_user_cache";

type UserCache = Pick<User, "id" | "displayName" | "email" | "photoURL">;

function readUserCache(): UserCache | null {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);

    return raw ? (JSON.parse(raw) as UserCache) : null;
  } catch {
    return null;
  }
}

function writeUserCache(user: User) {
  try {
    const cache: UserCache = {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function clearUserCache() {
  localStorage.removeItem(USER_CACHE_KEY);
}

export const useUserStore = defineStore("user", () => {
  const cachedUser = readUserCache();

  const currentUser = ref<User | null>(null);
  const firebaseUser = ref<FirebaseUser | null>(null);
  const isLoading = ref(true);
  const searchResults = ref<User[]>([]);
  const isSearching = ref(false);

  let selfUnsub: Unsubscribe | null = null;

  const userId = computed(
    () => currentUser.value?.id ?? cachedUser?.id ?? null,
  );
  const isAuthenticated = computed(() => !!currentUser.value);
  const cachedUserId = cachedUser?.id ?? null;

  const initAuth = () => {
    isLoading.value = true;

    return onAuthStateChanged(auth, async (user) => {
      firebaseUser.value = user;

      if (user) {
        try {
          let userData = await getUserById(user.uid);

          if (!userData) {
            await new Promise((resolve) => setTimeout(resolve, 500));

            userData = await getUserById(user.uid);
          }

          currentUser.value = userData;

          if (userData) {
            writeUserCache(userData);

            await setUserOnlineStatus(user.uid, true);
          }

          selfUnsub?.();
          selfUnsub = subscribeToUser(user.uid, (updated) => {
            if (updated) {
              currentUser.value = updated;
              writeUserCache(updated);
            }
          });
        } catch (error) {
          currentUser.value = null;
        }
      } else {
        selfUnsub?.();
        selfUnsub = null;
        currentUser.value = null;

        clearUserCache();
      }

      isLoading.value = false;
    });
  };

  const search = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      searchResults.value = [];

      return;
    }

    isSearching.value = true;

    try {
      const results = await searchUsers(searchTerm, 50);

      if (userId.value) {
        searchResults.value = results.filter(
          (user) => user.id !== userId.value,
        );
      } else {
        searchResults.value = results;
      }
    } catch (error) {
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  };

  const clearSearch = () => {
    searchResults.value = [];
  };

  const updateProfile = async (data: UserUpdateData): Promise<void> => {
    const id = userId.value;

    if (!id) throw new Error("Пользователь не авторизован");

    await updateUserProfile(id, data);
  };

  const setOfflineStatus = async () => {
    if (userId.value) {
      try {
        await setUserOnlineStatus(userId.value, false);
      } catch (error) {
        console.error("Ошибка установки офлайн статуса:", error);
      }
    }
  };

  return {
    currentUser,
    firebaseUser,
    userId,
    isAuthenticated,
    isLoading,
    cachedUserId,
    searchResults,
    isSearching,
    initAuth,
    updateProfile,
    search,
    clearSearch,
    setOfflineStatus,
  };
});
