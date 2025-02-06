import {Text} from "@/components/ui/text";
import {View} from "@/components/Themed";
import {Image} from "@/components/ui/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "expo-router";
import {useGameStore} from "@/store/store";
import {useState} from "react";

export default function Homepage() {
    const router = useRouter();
    const {gameMode, setGameMode} = useGameStore();

    const [selectedMode, setSelectedMode] = useState(gameMode);


    return (
        <View className="min-h-screen min-w-screen flex flex-col justify-center items-center">
            <Image
                source={require('@/assets/images/icon.png')}
                className="h-44 w-44 object-cover"
                alt="icon"
            />
            <View className="flex flex-col items-center px-10 pt-6 gap-4">
                <View className="flex flex-col items-center px-10 gap-2">
                    <Text size="3xl" className="font-spaceMono">PixelMem</Text>
                    <Text className="text-slate-500 text-xs text-center">
                        Un jeu de mémoire simple et amusant où vous pouvez jouer avec vos photos.
                    </Text>
                </View>

                <View className="flex flex-row gap-4">
                    <Button
                        action={
                            selectedMode === '2x2' ? 'positive' : 'negative'
                        }
                        onPress={() => {
                            setSelectedMode('2x2');
                        }}
                    >
                        <Text className="text-white mx-auto">2x2</Text>
                    </Button>
                    <Button
                        action={
                            selectedMode === '4x4' ? 'positive' : 'negative'
                        }
                        onPress={() => {
                            setSelectedMode('4x4');
                        }}
                    >
                        <Text className="text-white mx-auto">4x4</Text>
                    </Button>

                    <Button
                        action={
                            selectedMode === '8x8' ? 'positive' : 'negative'
                        }
                        onPress={() => {
                            setSelectedMode('8x8');
                        }}
                    >
                        <Text className="text-white mx-auto">8x8</Text>
                    </Button>
                </View>

                <Button
                    action="primary"
                    className="w-full mx-4"
                    onPress={() => {
                        router.push('/camera');
                        setGameMode(selectedMode);
                    }}
                >
                    <Text className="text-white mx-auto">Jouer</Text>
                </Button>
            </View>
        </View>
    );
}