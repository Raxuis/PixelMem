import {Text} from "@/components/ui/text";
import {View} from "@/components/Themed";
import {Image} from "@/components/ui/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "expo-router";

export default function TabOneScreen() {
    const router = useRouter();
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

                <Button
                    action="primary"
                    className="w-full mx-4"
                    onPress={() => {
                        router.push('/camera');
                    }}
                >
                    <Text className="text-white mx-auto">Jouer</Text>
                </Button>
            </View>
        </View>
    );
}