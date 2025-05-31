"use client";

import { Draggable } from "@hello-pangea/dnd";
import { ICard } from "@/models/Card";
import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
  data: ICard;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModal();
  const cardId = data.id;

  return (
    <Draggable draggableId={cardId} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(cardId)}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
