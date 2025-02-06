import React from 'react';
import {SafeAreaView, View} from "react-native";
import {usePhotoStore} from "@/store/store";
import {Image} from "@/components/ui/image";

const Game = () => {
    const {photos} = usePhotoStore();
    return (
        <SafeAreaView>
            <View className="grid grid-flow-row grid-cols-3 gap-4 p-4">
                {photos.map((photo, index) => (
                    <View key={index} className="w-32 h-32">
                        <Image
                            source={{uri: photo.uri}}
                            className="w-full h-full object-cover rounded-lg"
                            alt={photo.id}
                        />
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default Game;
