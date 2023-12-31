import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const accessToken = localStorage.getItem('access_token');

const useAuthStore = create(
    persist(
        (set) => ({
            loggedIn: accessToken == null || accessToken == '' ? false : true,
            logIn: () => set({ loggedIn: true }),
            logOut: () => set({ loggedIn: false }),
        }),
        {
            name: 'logged-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
export default useAuthStore;
