import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, SyncStatus } from '@/types';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

interface SyncStore {
  syncStatus: SyncStatus;
  setSyncStatus: (status: Partial<SyncStatus>) => void;
  setOnlineStatus: (isOnline: boolean) => void;
}

export const useSyncStore = create<SyncStore>()(set => ({
  syncStatus: {
    is_online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    pending_actions: 0,
    last_sync: null,
    sync_in_progress: false,
  },
  setSyncStatus: status =>
    set(state => ({
      syncStatus: { ...state.syncStatus, ...status },
    })),
  setOnlineStatus: isOnline =>
    set(state => ({
      syncStatus: { ...state.syncStatus, is_online: isOnline },
    })),
}));

interface NotificationStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
}

export const useNotificationStore = create<NotificationStore>()(set => ({
  unreadCount: 0,
  setUnreadCount: count => set({ unreadCount: count }),
  incrementUnread: () => set(state => ({ unreadCount: state.unreadCount + 1 })),
  decrementUnread: () =>
    set(state => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
}));

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    set => ({
      sidebarOpen: true,
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: open => set({ sidebarOpen: open }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
