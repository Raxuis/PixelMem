import {useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {CameraIcon, RefreshCcw} from "lucide-react-native";
import {HStack} from "@/components/ui/hstack";
import {useRouter} from "expo-router";
import {Button} from "@/components/ui/button";

const Camera = () => {
    const router = useRouter();
    const [facing, setFacing] = useState<"front" | "back">('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photos, setPhotos] = useState<string[]>([]);
    const cameraRef = useRef<CameraView>(null);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
        },
        message: {
            textAlign: 'center',
            paddingBottom: 10,
        },
        camera: {
            flex: 1,
        },
        buttonContainer: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'transparent',
            margin: 64,
        },
        button: {
            flex: 1,
            alignSelf: 'flex-end',
            alignItems: 'center',
        },
        text: {
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
        },
        photo: {
            borderRadius: 10,
        },
    });

    const takePhoto = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                base64: true
            });
            if (!photo) return;
            setPhotos([...photos, photo.uri]);

            console.log(photos);
        }
    };

    if (!permission) {
        return (
            <View>
                <Text>Pour activer la camera activer les permissions</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission}>
                    Grant permission
                </Button>
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <RefreshCcw size={30} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePhoto}>
                        <CameraIcon size={30} color="white"/>
                    </TouchableOpacity>
                </View>
            </CameraView>
            {!!photos.length && (
                <View className="flex flex-col gap-4 mx-8 my-12">
                    <ScrollView className="flex flex-row" horizontal showsHorizontalScrollIndicator={false}>
                        <HStack space="md" reversed>
                            {photos.map((photo, index) => (
                                <Image
                                    key={index}
                                    source={{uri: photo}}
                                    className="size-24 rounded-lg"
                                />
                            ))}
                        </HStack>
                    </ScrollView>
                    {photos.length >= 2 && (
                        <View>
                            <Button onPress={() => router.push('/game')}>
                                <Text className="text-white font-spaceMono">Jouer avec ces images</Text>
                            </Button>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

export default Camera;