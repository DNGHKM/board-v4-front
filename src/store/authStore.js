import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            username: null,
            name: null,

            setAuth: ({ username, name }) => set({ isLoggedIn: true, username, name }),
            clearAuth: () => set({ isLoggedIn: false, username: null, name: null })
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                isLoggedIn: state.isLoggedIn,
                username: state.username,
                name: state.name
            }),
        }
    )
);

export default useAuthStore;
