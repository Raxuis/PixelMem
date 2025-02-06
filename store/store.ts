import {create} from 'zustand';
import {Card, GameMode, Photo} from "@/types";

type PhotoStore = {
    photos: Photo[];
    setPhotos: (photos: Photo[]) => void;
    removePhoto: (id: string) => void;
}

type GameStore = {
    gameMode: GameMode;
    setGameMode: (gameMode: GameMode) => void;
    score: number;
    setScore: (score: number) => void;
    flippedCards: Card[];
    setFlippedCards: (flippedCards: Card[]) => void;
}

export const usePhotoStore = create<PhotoStore>((set) => ({
    photos: [],
    setPhotos: (photos: Photo[]) => set({photos}),
    removePhoto: (id) => set((state) => ({photos: state.photos.filter((photo) => photo.id !== id)}))
}));

export const useGameStore = create<GameStore>((set) => ({
    gameMode: "2x2",
    setGameMode: (gameMode: GameMode) => set({gameMode}),
    score: 0,
    setScore: (score: number) => set({score}),
    flippedCards: [],
    setFlippedCards: (flippedCards) => set({flippedCards}),
}));