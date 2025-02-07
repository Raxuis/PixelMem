import {useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {CameraIcon, InfoIcon, RefreshCcw, X} from "lucide-react-native";
import {HStack} from "@/components/ui/hstack";
import {useRouter} from "expo-router";
import {Button, ButtonText} from "@/components/ui/button";
import {usePhotoStore} from "@/store/store";
import uuid from 'react-native-uuid';
import * as Haptics from 'expo-haptics';
import {Badge, BadgeIcon, BadgeText} from "@/components/ui/badge";
import PhotoModal from "@/components/PhotoModal";
import {Photo} from "@/types";

const Camera = () => {
    const router = useRouter();
    const {photos, setPhotos, removePhoto} = usePhotoStore();
    const [showModal, setShowModal] = useState(false);
    const [photo, setPhoto] = useState<Photo>({
        uri: '',
        id: ''
    });
    const [facing, setFacing] = useState<"front" | "back">('back');
    const [permission, requestPermission] = useCameraPermissions();
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
            position: 'relative',
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

            const newPhoto = {
                id: uuid.v4(),
                uri: photo.uri,
            }

            setPhotos([...photos, newPhoto]);
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
                    <ButtonText>
                        Grant permission
                    </ButtonText>
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
                    <TouchableOpacity
                        style={[styles.button, {position: 'absolute', top: 0, left: 0}]}
                        onPress={() => {
                            router.push('/');
                        }}
                        hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                    >
                        <X size={30} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={toggleCameraFacing}
                        hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                    >
                        <RefreshCcw size={30} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={takePhoto}
                        hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                    >
                        <CameraIcon size={30} color="white"/>
                    </TouchableOpacity>
                </View>
            </CameraView>
            {!!photos.length && (
                <View className="flex flex-col gap-8 px-8 pt-8 pb-12">
                    <View className="mx-auto flex flex-col justify-center items-center">
                        <Badge size="md" variant="solid" action="info" className="border">
                            <BadgeIcon as={InfoIcon}/>
                            <BadgeText className="ml-2">Vous devez avoir au moins 2 photos</BadgeText>
                            <BadgeIcon as={InfoIcon} className="ml-2"/>
                        </Badge>
                    </View>
                    <ScrollView className="flex flex-row" horizontal showsHorizontalScrollIndicator={false}>
                        <HStack space="md" reversed>
                            {photos.map((photo, index) => (
                                <TouchableOpacity key={index} className="w-24 h-24 rounded-lg overflow-hidden relative"
                                                  onPress={() => {
                                                      setPhoto(photo);
                                                      setShowModal(true);
                                                  }}
                                >
                                    <Image
                                        source={{uri: photo.uri}}
                                        className="w-full h-full object-cover"
                                    />
                                    <View className="absolute top-0 right-0 rounded-full p-1">
                                        <TouchableOpacity
                                            hitSlop={{top: 2, right: 2, bottom: 2, left: 2}}
                                            onPress={() => {
                                                removePhoto(photo.id);
                                            }}
                                            className="bg-white/50 rounded-full">
                                            <Text className="text-black">
                                                <X size={18} color="black"/>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </HStack>
                    </ScrollView>
                    {photos.length >= 2 && (
                        <View>
                            <Button onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                router.push('/game');
                            }}>
                                <ButtonText className="text-white">Jouer avec ces images</ButtonText>
                            </Button>
                        </View>
                    )}
                </View>
            )}

            <PhotoModal
                showModal={showModal}
                setShowModal={setShowModal}
                photo={photo}
            />

        </View>
    );
}

export default Camera;