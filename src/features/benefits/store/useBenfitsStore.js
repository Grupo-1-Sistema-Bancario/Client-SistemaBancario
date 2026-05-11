import { create } from 'zustand';

export const useBenefitsStore = create((set) => ({
  benefits: [],

  addBenefit: (benefit) =>
    set((state) => ({
      benefits: [
        ...state.benefits,
        {
          ...benefit,
          id: crypto.randomUUID()
        }
      ]
    })),

  updateBenefit: (id, updatedBenefit) =>
    set((state) => ({
      benefits: state.benefits.map((b) =>
        b.id === id ? { ...b, ...updatedBenefit } : b
      )
    })),

  deleteBenefit: (id) =>
    set((state) => ({
      benefits: state.benefits.filter((b) => b.id !== id)
    }))
}));