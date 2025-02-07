import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {Image} from "@/components/ui/image";
import {Modal, ModalBackdrop, ModalContent, ModalFooter} from "@/components/ui/modal";
import React, {Dispatch} from "react";
import {Photo} from "@/types";
import {usePhotoStore} from "@/store/store";
import {TrashIcon, Undo2} from "lucide-react-native";

const PhotoModal = (
    {
        showModal,
        setShowModal,
        photo,
    }: {
        showModal: boolean,
        setShowModal: Dispatch<boolean>
        photo: Photo
    }) => {

    const {removePhoto} = usePhotoStore();

    return (
        <Modal
            isOpen={showModal}
            onClose={() => {
                setShowModal(false);
            }}
        >
            <ModalBackdrop/>
            <ModalContent className="max-w-[375px] relative">
                <Image
                    source={{uri: photo.uri}}
                    alt="image"
                    className="h-[300px] w-full rounded"
                />
                <ModalFooter className="w-full mt-6">
                    <Button
                        variant="outline"
                        action="negative"
                        size="sm"
                        onPress={() => {
                            setShowModal(false);
                        }}
                        className="flex-grow"
                    >
                        <ButtonIcon as={Undo2} width={16} className="text-primary-500"/>
                        <ButtonText>Annuler</ButtonText>
                    </Button>
                    <Button
                        onPress={() => {
                            removePhoto(photo.id)
                            setShowModal(false);
                        }}
                        size="sm"
                        className="flex-grow"
                    >
                        <ButtonIcon as={TrashIcon} width={12} className="text-white"/>
                        <ButtonText>
                            Supprimer
                        </ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default PhotoModal;