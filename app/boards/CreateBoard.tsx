import { Button, Card, CardBody, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import React, { FormEventHandler } from 'react'
import { IconContext } from 'react-icons'
import { MdAdd } from 'react-icons/md'
import ColourSelect from '../components/ColourSelect';
import { Colour } from '@prisma/client';
import { CreateBoardInput } from '../api/types';
import { post } from '../lib/request';
import { useSWRConfig } from 'swr';

export default function CreateBoard() {
  const { mutate } = useSWRConfig();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleBoardCreate: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const json = Object.fromEntries(data);

    const name = json["boardName"] as string;
    const colour = json["boardColour"] as string;

    if (!name || !colour) {
      return;
    }

    const boardCreateInput: CreateBoardInput = {
      name,
      colour
    };

    const key = "/api/boards";
    await post(key, boardCreateInput);
    mutate(key);
    onClose();
  }

  return (
    <Card isPressable={true} isBlurred className={`w-card-width h-card-height`} onPress={onOpen}>
      <CardBody className="flex flex-col items-center justify-center">
        <IconContext.Provider value={{
          size: "4em"
        }}>
          <MdAdd />
        </IconContext.Provider>
        <p>Create</p>
      </CardBody>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent>
            {(onClose) =>
              <form method="POST" onSubmit={handleBoardCreate}>
                <ModalHeader>Create board</ModalHeader>
                <ModalBody>
                  <Input isRequired name="boardName" label="Board name" autoFocus={true} />
                  <ColourSelect name="boardColour" defaultValue={Colour.BLUE} />
                </ModalBody>
                <Divider />
                <ModalFooter>
                  <Button type="button" onPress={onClose}>Cancel</Button>
                  <Button type="submit" color="primary">Create</Button>
                </ModalFooter>
              </form>
            }
          </ModalContent>
        </Modal>
      </Modal>
    </Card>
  )
}


