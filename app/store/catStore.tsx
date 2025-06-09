'use client';
import { create } from 'zustand';
export type State = {
    catImage: any[];
    favoriteCatImage: any[];
}

export type Action = {
    setCatImage: (image: any) => void;
    setFavoriteCatImage: (image: any) => void;
}

// Zustand store for managing cat images
export const useCatStore = create<State & Action>()((set) => ({
    catImage: [],
    favoriteCatImage: [],
    setCatImage: (image: any) => set({ catImage: image }),
    setFavoriteCatImage: (image) => set((state) => ({
        favoriteCatImage: [...state.favoriteCatImage, image]
    })),


}));