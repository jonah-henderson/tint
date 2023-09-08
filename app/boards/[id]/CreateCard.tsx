import { Button, Chip, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Textarea, User, useDisclosure, Selection } from '@nextui-org/react'
import React, { FormEventHandler, useContext, useRef, useState } from 'react'
import { MdAdd, MdGrade, MdLeaderboard, MdNotes, MdPerson, MdTag } from 'react-icons/md';
import { useProjects, useTags } from '@/app/lib/hooks';
import { CreateCardInput } from '@/app/api/types';
import { BoardIdContext } from '@/app/lib/context';
import { bgGradientFromColour } from '@/app/lib/colours';

export interface CreateCardProps {
  onCardCreated: (data: CreateCardInputWithoutList) => unknown
}

const users = [
  { name: "Jonah Henderson", email: "jsh229.wa@gmail.com", id: "jonahhenderson" }
];

// TODO: this split individual custom UI items out to their own components
// to make this one easier to read

// This component should not need to know about what list it is on
// so it uses a slightly relaxed CreateCardInput type
type CreateCardInputWithoutList = Omit<CreateCardInput, "listId">

export default function CreateCard(props: CreateCardProps) {
  const boardId = useContext(BoardIdContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: projects, error: projectsError, isLoading: projectsAreLoading } = useProjects(boardId);
  const { data: tags, error: tagsError, isLoading: tagsAreLoading } = useTags(boardId);

  // Multi-select mode seems to cause some problems with submitted form data
  // so we need to track the current selection with state
  const [selectedTagIds, setSelectedTagIds] = useState<Selection>(new Set<string>([]));

  const areProjectsAvailable = (!projectsAreLoading && !projectsError && !!projects);
  const areTagsAvailable = (!tagsAreLoading && !tagsError && !!tags);

  const onSaveClicked: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const json = Object.fromEntries(data);

    const tagIds = tags!.map(tag => tag.id);

    // TODO: enforce stricter form validation
    const draftCardData: CreateCardInputWithoutList = {
      projectId: json["projectId"] as string,
      summary: json["summary"] as string,
      description: json["description"] as string,
      tagIds: selectedTagIds === "all" ? tagIds : tagIds.filter(id => selectedTagIds.has(id))
    }

    props.onCardCreated(draftCardData)
    onClose();
  }

  return (
    <>
      <Button variant="bordered" onPress={onOpen} className="border-0 w-full justify-start hover:bg-white/20">
        <MdAdd />
        Add card
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={"5xl"} isDismissable={false} isKeyboardDismissDisabled={true} backdrop={"blur"}>
        <ModalContent>{(onClose) =>
          <form method="post" onSubmit={onSaveClicked}>
            <ModalHeader>
              Add a new card
            </ModalHeader>
            <Divider />
            <ModalBody>

              <div className='flex flex-row gap-4'>
                <MdGrade className="self-center" />
                <Input isRequired name="summary" label="Summary" variant="underlined" autoFocus={true} />
              </div>

              <div className='flex flex-row gap-4'>
                <MdLeaderboard className="self-center" />
                {areProjectsAvailable
                  ? <Select isRequired name="projectId" label="Project" placeholder="Select a project">

                    {projects.map(proj => <SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>)}

                  </Select>
                  : <Spinner />}
              </div>

              <div className='flex flex-row gap-4'>
                <MdNotes className="self-center" />
                <Textarea name="description" label="Description" variant="bordered"></Textarea>
              </div>

              <div className='flex flex-row gap-4'>
                <MdPerson className="self-center" />
                <Select name="assignedTo" label="Assign to" placeholder="Leave unassigned" items={users}>

                  {users.map(user => <SelectItem key={user.id} textValue={user.name}>
                    <User name={user.name} description={user.email} avatarProps={{
                      size: "sm",
                      getInitials: (name) => name.split(' ').reduce((acc, next) => acc + next.at(0)?.toLocaleUpperCase(), "")
                    }} />
                  </SelectItem>)}

                </Select>
              </div>

              <div className='flex flex-row gap-4'>
                <MdTag className="self-center" />
                {areTagsAvailable
                  ? <Select
                    name="tagIds"
                    label="Tags"
                    placeholder="Select tags"
                    items={tags}
                    selectionMode='multiple'
                    isMultiline={true}
                    onSelectionChange={setSelectedTagIds}
                    renderValue={(items) =>
                    (
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <Chip key={item.key} className={item.data ? `bg-gradient-to-br ${bgGradientFromColour[item.data?.colour]}` : ""}>{item.data?.name}</Chip>
                        ))}
                      </div>
                    )
                    }>
                    {
                      (tag) =>
                        <SelectItem key={tag.id} textValue={tag.name}>
                          {tag.name}
                        </SelectItem>
                    }
                  </Select>
                  : <Spinner />}

              </div>


            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button color="danger" onPress={onClose}>Cancel</Button>
              <Button color="primary" type="submit">Save</Button>
            </ModalFooter>
          </form>
        }
        </ModalContent>
      </Modal>
    </>
  )
}
