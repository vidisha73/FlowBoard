"use client";

import { toast } from "sonner";
import { ElementRef, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { Skeleton } from "@/components/ui/skeleton";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";

interface DescriptionProps {
  data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });

      toast.success("Card description updated");
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(data.description || "");

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const onSubmit = (formData: FormData) => {
    const newDescription = formData.get("description") as string;
    const boardId = params.boardId as string;

    if (newDescription === data.description) {
      return;
    }

    execute({
      id: data.id,
      description: newDescription,
      boardId,
    });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <div className="w-full">
        <div className="flex items-center gap-x-2">
          <h3 className="font-semibold text-neutral-700">Description</h3>
          <Button
            onClick={enableEditing}
            variant="ghost"
            size="sm"
          >
            {data.description ? "Edit" : "Add"}
          </Button>
        </div>
        {isEditing ? (
          <form action={onSubmit}>
            <FormTextarea
              ref={textareaRef}
              id="description"
              defaultValue={description}
              placeholder="Add a more detailed description..."
              className="w-full mt-2"
            />
            <div className="flex items-center gap-x-2 mt-2">
              <Button
                type="submit"
                size="sm"
              >
                Save
              </Button>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-24 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-6 w-24 bg-neutral-200" />
        <Skeleton className="h-[78px] w-full mt-2 bg-neutral-200" />
      </div>
    </div>
  );
};
