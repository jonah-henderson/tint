import { BoardUpdateInput } from '@/app/api/types';
import ColourRadioGroup from '@/app/components/ColourSelect';
import { BoardIdContext } from '@/app/lib/context'
import { useBoard } from '@/app/lib/hooks'
import { del, patch } from '@/app/lib/request';
import { Button, Card, CardBody, CardFooter, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from '@nextui-org/react';
import { Colour } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useContext } from 'react'
import { useSWRConfig } from 'swr';

export default function SettingsTab() {
  const { mutate } = useSWRConfig();
  const boardId = useContext(BoardIdContext);
  const { data: board, error, isLoading } = useBoard(boardId);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const updateBoardSettings: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data)

    // TODO: enforce stricter form validation
    const name = json["boardName"] as string;
    const colour = json["colour"] as Colour;
    if (!name || !colour) {
      return;
    }
    const boardInput: BoardUpdateInput = {
      name, colour
    };

    const mutation = () => patch(`/api/boards/${boardId}`, boardInput);

    mutate(`/api/boards/${boardId}`, mutation, { revalidate: false });
  }

  async function handleBoardDelete() {
    await del(`/api/boards/${boardId}`);
    mutate(`/api/boards`);
    router.replace('/boards');
  }

  return (
    <div className="max-w-screen-md mx-auto mt-24">
      <form method='POST' onSubmit={updateBoardSettings}>
        <Card>
          <CardBody className="flex gap-2">
            <Input name="boardName" defaultValue={board?.name} label="Board name" labelPlacement='outside' placeholder='Set board name' />
            <ColourRadioGroup name="colour" defaultValue={board?.colour} />
            <Divider />
            <Spacer y={4} />
            <Button color="danger" onPress={onOpen}>Delete</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
              <ModalContent>
                {(onClose) => <>
                  <ModalHeader><h1 className="text-danger-foreground">Warning</h1></ModalHeader>
                  <ModalBody>
                    <p>Deleting this board will also delete all its lists, cards, projects, and tags.</p>
                    <p>Are you sure you want to proceed?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onPress={handleBoardDelete}>Yes, delete this board</Button>
                    <Button onPress={onClose}>Cancel</Button>
                  </ModalFooter>
                </>
                }
              </ModalContent>
            </Modal>
          </CardBody>
          <Divider />
          <CardFooter className="flex justify-end">
            <Button color="primary" type="submit">Save</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
