import React, {useState, useEffect} from 'react';
import {SafeAreaView, TouchableOpacity, View, Alert} from "react-native";
import {usePhotoStore, useGameStore} from "@/store/store";
import {Image} from "@/components/ui/image";
import {chunkArray, getRandomColor} from "@/utils";
import {Text} from "@/components/ui/text";
import {Card} from '@/types';
import {useRouter} from "expo-router";
import * as Haptics from 'expo-haptics';

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

const Game = () => {
    const {photos} = usePhotoStore();
    const {
        gameMode,
        score,
        setScore,
        flippedCards,
        setFlippedCards
    } = useGameStore();
    const [cards, setCards] = useState<Card[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const router = useRouter();

    const columns = getColumns(gameMode);

    useEffect(() => {
        initializeGame();
    }, [photos, gameMode]);

    const initializeGame = () => {
        const limitedPhotos = photos.slice(0, (columns * columns) / 2);
        const remainingSpaces = (columns * columns) / 2 - limitedPhotos.length;

        let gameCards: Card[] = [];

        limitedPhotos.forEach(photo => {
            const card1: Card = {
                id: `${photo.id}-1`,
                uri: photo.uri,
                isFlipped: false,
                isMatched: false
            };
            const card2: Card = {
                id: `${photo.id}-2`,
                uri: photo.uri,
                isFlipped: false,
                isMatched: false
            };
            gameCards.push(card1, card2);
        });

        for (let i = 0; i < remainingSpaces; i++) {
            const color = getRandomColor();
            const colorCard1: Card = {
                id: `color-${i}-1`,
                isColor: true,
                colorValue: color,
                isFlipped: false,
                isMatched: false
            };
            const colorCard2: Card = {
                id: `color-${i}-2`,
                isColor: true,
                colorValue: color,
                isFlipped: false,
                isMatched: false
            };
            gameCards.push(colorCard1, colorCard2);
        }

        gameCards = gameCards.sort(() => Math.random() - 0.5);
        setCards(gameCards);
        setFlippedCards([]);
        setScore(0);
    };

    const handleCardPress = (card: Card) => {
        if (isChecking || card.isMatched || card.isFlipped || flippedCards.length >= 2) {
            return;
        }

        const updatedCards = cards.map(c =>
            c.id === card.id ? {...c, isFlipped: true} : c
        );
        setCards(updatedCards);

        const newFlippedCards = [...flippedCards, card];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            setIsChecking(true);
            checkMatch(newFlippedCards, updatedCards);
        }
    };

    const checkMatch = (flipped: Card[], currentCards: Card[]) => {
        setTimeout(() => {
            const [card1, card2] = flipped;
            const isMatch = card1.isColor
                ? card1.colorValue === card2.colorValue
                : card1.uri === card2.uri;

            if (isMatch) {
                const updatedCards = currentCards.map(card =>
                    card.id === card1.id || card.id === card2.id
                        ? {...card, isMatched: true}
                        : card
                );
                setCards(updatedCards);
                setScore(score + 1);

                const allMatched = updatedCards.every(card => card.isMatched);
                if (allMatched) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    Alert.alert("Félicitations!", "Vous avez gagné!");
                    initializeGame();
                    router.push('/');
                }
            } else {
                const updatedCards = currentCards.map(card =>
                    card.id === card1.id || card.id === card2.id
                        ? {...card, isFlipped: false}
                        : card
                );
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setCards(updatedCards);
            }

            setFlippedCards([]);
            setIsChecking(false);
        }, 1000);
    };

    const renderCard = (card: Card) => {
        if (!card.isFlipped && !card.isMatched) {
            return (
                <View className="w-full h-full bg-gray-300 rounded-lg"/>
            );
        }

        if (card.isColor) {
            return (
                <View
                    className="w-full h-full rounded-lg"
                    style={{backgroundColor: card.colorValue}}
                />
            );
        }

        return (
            <Image
                source={{uri: card.uri}}
                className="w-full h-full object-cover rounded-lg"
                alt={card.id}
            />
        );
    };

    return (
        <SafeAreaView>
            <View className="p-4 flex flex-col items-center justify-center w-full h-full">
                <View className="mb-4">
                    <Text className="text-center text-2xl">Score: {score}</Text>
                </View>
                {chunkArray(cards, columns).map((row, rowIndex) => (
                    <View key={rowIndex} className="flex flex-row justify-center items-center">
                        {row.map((card) => (
                            <TouchableOpacity
                                key={card.id}
                                className="w-16 h-16 m-1"
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    handleCardPress(card);
                                }}
                                disabled={isChecking}
                            >
                                {renderCard(card)}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default Game;