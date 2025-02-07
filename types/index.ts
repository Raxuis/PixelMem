export type Photo = {
    id: string;
    uri: string;
}

export type GameMode = "2x2" | "4x4" | "6x6";

export interface Card {
    id: string;
    uri?: string;
    isColor?: boolean;
    colorValue?: string;
    emojiValue?: string;
    isFlipped: boolean;
    isMatched: boolean;
}