import React, {useState, useEffect} from 'react';
import {SafeAreaView, TouchableOpacity, View, Alert} from "react-native";
import {usePhotoStore, useGameStore} from "@/store/store";
import {Image} from "@/components/ui/image";
import {chunkArray, getColumns, getRandomColor, getRandomEmoji} from "@/utils";
import {Text} from "@/components/ui/text";
import {Card} from '@/types';
import {useRouter} from "expo-router";
import * as Haptics from 'expo-haptics';
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {Undo2} from "lucide-react-native";
import useSound from "@/hooks/useSound";

const Game = () => {
    const {photos} = usePhotoStore();
    const {
        playSound: playFlipSound
    } = useSound(
        require('@/assets/sounds/card-flip.mp3')
    )

    const {
        playSound: playWinSound
    } = useSound(
        require('@/assets/sounds/win.mp3')
    )

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
        // Start at 0 and go to the number of columns squared divided by 2
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
            const emoji = getRandomEmoji();

            const colorWithColorCard1: Card = {
                id: `color-${i}-1`,
                isColor: true,
                colorValue: color,
                emojiValue: emoji,
                isFlipped: false,
                isMatched: false
            };
            const colorWithColorCard2: Card = {
                id: `color-${i}-2`,
                isColor: true,
                colorValue: color,
                emojiValue: emoji,
                isFlipped: false,
                isMatched: false
            };
            gameCards.push(colorWithColorCard1, colorWithColorCard2);
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

        playFlipSound();

        // Get previous flipped card with the same id
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
                    playWinSound();
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    Alert.alert("Félicitations!", "Vous avez gagné!", [
                        {
                            text: 'Rejouer',
                            onPress: () => {
                                initializeGame();
                            },
                            style: 'cancel',
                        },
                        {
                            text: "Changer de mode",
                            onPress: () => {
                                initializeGame();
                                router.push('/');
                            },
                        }
                    ]);
                }
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
                    className="w-full h-full rounded-lg flex items-center justify-center"
                    style={{backgroundColor: card.colorValue}}
                >
                    <Text className="text-white text-2xl text-center">
                        {card.emojiValue}
                    </Text>
                </View>
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
                <Button
                    action="primary"
                    className="w-1/2 m-4"
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        router.push('/camera');
                    }}
                >
                    <ButtonIcon as={Undo2} width={16} className="text-white"/>
                    <ButtonText className="text-white">
                        Retour
                    </ButtonText>
                </Button>
            </View>
        </SafeAreaView>
    );
};

export default Game;