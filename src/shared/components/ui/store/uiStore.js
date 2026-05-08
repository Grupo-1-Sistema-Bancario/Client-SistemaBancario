import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // UI state placeholder
  state: {},
  setState: (newState) => set({ state: newState }),
}));
