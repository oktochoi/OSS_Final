import { create } from 'zustand'

export const useUserStore = create((set) => ({
  name: '',
  setName: (name) => set({ name }),
}))

