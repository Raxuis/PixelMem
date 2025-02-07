import {useState, useEffect, useCallback} from 'react';
import {Audio, AVPlaybackSource} from 'expo-av';
import {Sound} from "expo-av/build/Audio/Sound";

const useSound = (soundSource: AVPlaybackSource) => {
    const [sound, setSound] = useState<Sound | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadSound = async () => {
            try {
                const {sound: newSound} = await Audio.Sound.createAsync(
                    soundSource,
                    {
                        shouldPlay: false,
                        volume: 0.2
                    },
                );

                setSound(newSound);
                setIsLoaded(true);
                setError(null);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err);
                }
            }
        };

        loadSound();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [soundSource]);

    const playSound = useCallback(async () => {
        if (sound) {
            try {
                await sound.stopAsync();
                await sound.setPositionAsync(0);
                await sound.playAsync();
            } catch (err) {
                if (err instanceof Error) {
                    setError(err);
                }
            }
        } else {
            try {
                const {sound: newSound} = await Audio.Sound.createAsync(soundSource);
                setSound(newSound);
                await newSound.playAsync();
            } catch (err) {
                if (err instanceof Error) {
                    setError(err);
                }
            }
        }
    }, [sound]);

    return {
        sound,
        isLoaded,
        error,
        playSound
    };
};

export default useSound;