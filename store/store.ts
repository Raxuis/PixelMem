import {create} from 'zustand';

type Photo = {
    id: string;
    uri: string;
}

type PhotoStore = {
    photos: Photo[];
    setPhotos: (photos: Photo[]) => void;
    removePhoto: (id: string) => void;
}

type GameMode = "2x2" | "4x4" | "8x8";

type GameStore = {
    gameMode: GameMode;
    setGameMode: (gameMode: GameMode) => void;
}

export const usePhotoStore = create<PhotoStore>((set) => ({
    photos: [],
    setPhotos: (photos: Photo[]) => set({photos}),
    removePhoto: (id) => set((state) => ({photos: state.photos.filter((photo) => photo.id !== id)}))
}));

export const useGameStore = create<GameStore>((set) => ({
    gameMode: "2x2",
    setGameMode: (gameMode: GameMode) => set({gameMode})
}));