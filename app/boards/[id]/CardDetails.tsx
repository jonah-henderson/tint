import { Button, Chip, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from '@nextui-org/react'
import { MdGrade, MdNotes, MdTag } from 'react-icons/md';
import { useCard } from '@/app/lib/hooks';
import { bgGradientFromColour } from '@/app/lib/colours';



interface CardDetailsProps {
  cardId: string;
  isOpen: boolean;
  onOpenChange: () => void
}
export default function CardDetails(props: CardDetailsProps) {
  const { data: card, error, isLoading } = useCard(props.cardId);

  const cardLoaded = (!isLoading && !error && !!card);

  return (
    <Modal size={"5xl"} backdrop={"blur"} isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>{(onClose) => !cardLoaded
        ? <>
          <ModalBody>
            <Spinner />
          </ModalBody>
        </>
        : <>
          <ModalHeader>
            {card.project.name}-{card.readableId}
          </ModalHeader>
          <Divider />
          <ModalBody>
            <div className='flex flex-row gap-4'>
              <MdGrade className="self-center" />
              <p>{card.summary}</p>
            </div>

            <div className='flex flex-row gap-4'>
              <MdNotes className="self-center" />
              <p>{card.description}</p>
            </div>

            <div className='flex flex-row gap-4'>
              <MdTag className="self-center" />
              <div className="flex flex-wrap gap-1">{
                card.tags.map(tag => <Chip key={tag.id} className={`bg-gradient-to-br ${bgGradientFromColour[tag.colour]}`}>{tag.name}</Chip>)
              }</div>
            </div>


          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button onPress={onClose}>Close</Button>
          </ModalFooter>
        </>
      }
      </ModalContent>
    </Modal>
  )
}
