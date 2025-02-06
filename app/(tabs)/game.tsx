import React from 'react';
import {SafeAreaView, View} from "react-native";
import {usePhotoStore, useGameStore} from "@/store/store";
import {Image} from "@/components/ui/image";

// Utility to get the number of columns based on the game mode
const getColumns = (gameMode: "2x2" | "4x4" | "8x8"): number => {
    switch (gameMode) {
        case "2x2":
            return 2;
        case "4x4":
            return 4;
        case "8x8":
            return 8;
        default:
            return 2;
    }
};

// Utility to chunk the array into smaller arrays of a specific size
const chunkArray = <T, >(arr: T[], size: number): T[][] => {
    return arr.reduce<T[][]>((acc, _, i) =>
        i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc, []
    );
};

// Function to generate a random color for the card
const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const Game: React.FC = () => {
    const {photos} = usePhotoStore();
    const {gameMode} = useGameStore();

    const columns = getColumns(gameMode);

    const limitedPhotos = photos.slice(0, columns * columns);

    const remainingCards = columns * columns - limitedPhotos.length;

    const rows = chunkArray(limitedPhotos.concat(new Array(remainingCards).fill(null)), columns);

    return (
        <SafeAreaView>
            <View className="p-4">
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} className="flex flex-row justify-center">
                        {row.map((photo, index) => (
                            <View key={index} className="w-32 h-32 m-4">
                                {photo ? (
                                    <Image
                                        source={{uri: photo.uri}}
                                        className="w-full h-full object-cover rounded-lg"
                                        alt={photo.id}
                                    />
                                ) : (
                                    <View
                                        className="w-full h-full rounded-lg"
                                        style={{backgroundColor: getRandomColor()}}
                                    >
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default Game;
