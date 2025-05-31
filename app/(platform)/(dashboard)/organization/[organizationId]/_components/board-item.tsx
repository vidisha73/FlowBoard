"use client";

import Link from "next/link";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAction } from "@/hooks/use-action";
import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BoardItemProps {
  id: string;
  title: string;
  imageThumbUrl: string;
}

export const BoardItem = ({
  id,
  title,
  imageThumbUrl,
}: BoardItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { execute } = useAction(deleteBoard, {
    onSuccess: (data) => {
      toast.success(`Board "${title}" deleted`);
      setIsDeleting(false);
    },
    onError: (error) => {
      toast.error(error);
      setIsDeleting(false);
    },
  });

  const onDelete = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isDeleting) return;

    const confirmation = confirm(`Are you sure you want to delete "${title}"?`);
    
    if (confirmation) {
      setIsDeleting(true);
      execute({ id });
    }
  };

  return (
    <div 
      className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
      style={{ backgroundImage: `url(${imageThumbUrl})` }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
      <div className="relative flex flex-col justify-between h-full w-full">
        <div className="flex items-start justify-between">
          <Link 
            href={`/board/${id}`}
            className="text-white font-semibold truncate relative z-10 w-full"
          >
            {title}
          </Link>
          <Button
            onClick={onDelete}
            className="text-white opacity-0 group-hover:opacity-100 transition bg-rose-500/80 hover:bg-rose-500"
            variant="ghost"
            size="sm"
            disabled={isDeleting}
            type="button"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Delete board</span>
          </Button>
        </div>
        <Link 
          href={`/board/${id}`}
          className="absolute inset-0 z-0"
        >
          <span className="sr-only">View board</span>
        </Link>
      </div>
    </div>
  );
}; 