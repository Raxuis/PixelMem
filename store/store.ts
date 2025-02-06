import {create} from 'zustand';

type Photo = {
    id: string;
    url: string;
    title: string;
}

type Store = {
    photos: Photo[];
    addPhoto: (photo: Photo) => void;
    removePhoto: (id: string) => void;
}

const usePhotoStore = create<Store>((set) => ({
    photos: [],
    addPhoto: (photo) => set((state) => ({photos: [...state.photos, photo]})),
    removePhoto: (id) => set((state) => ({photos: state.photos.filter((photo) => photo.id !== id)}))
}));