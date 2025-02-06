import {create} from 'zustand';

type Store = {
    photos: string[];
    addPhoto: (photo: string) => void;
}

const usePhotoStore = create<Store>((set) => ({
    photos: [],
    addPhoto: (photo) => set((state) => ({photos: [...state.photos, photo]})),
}));