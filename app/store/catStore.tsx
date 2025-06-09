import { create } from 'zustand';

export type CatImage = {
    id: string;
    url: string;
    height: number;
    width: number;
}

export type State = {
    catImage: CatImage[];
    favoriteCatImage: CatImage[];
}

export type Action = {
    setCatImage: (images: CatImage[]) => void;
    setFavoriteCatImage: (image: CatImage) => void;
}

// Zustand store for managing cat images
export const useCatStore = create<State & Action>()((set) => ({
    catImage: [],
    favoriteCatImage: [],
    setCatImage: (images) => set({ catImage: images }),
    setFavoriteCatImage: (image) => set((state) => ({
        favoriteCatImage: [...state.favoriteCatImage, image]
    })),


}));