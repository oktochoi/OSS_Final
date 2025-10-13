// src/store/userStore.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  name: '',
  profileImage: '/Avatar.svg',   
  setName: (name) => set({ name }),
  setProfileImage: (image) => set({ profileImage: image }),
}));
