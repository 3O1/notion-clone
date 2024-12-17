'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Spinner } from '@/components/spinner';
import { Input } from '@/components/ui/input';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { SearchIcon, Trash, Undo } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState('');

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<'documents'>
  ) => {
    event.stopPropagation();

    const promise = restore({
      id: documentId,
    });

    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Failed to restore note.',
    });
  };

  const onRemove = (documentId: Id<'documents'>) => {
    const promise = remove({
      id: documentId,
    });

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note deleted!',
      error: 'Failed to delete note.',
    });

    if (params.documentId == documentId) {
      router.push('/documents');
    }
  };

  if (documents === undefined) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center p-2 gap-x-1">
        <SearchIcon className="w-4 h-4" />
        <Input
          className="px-2 h-7 focus-visible:ring-transparent bg-neutral-200 dark:bg-neutral-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by page title..."
        />
      </div>

      <div className="px-1 pb-1 mt-2">
        <p className="hidden pb-2 text-xs text-center last:block text-muted-foreground">
          No documents found.
        </p>

        {filteredDocuments?.map((document) => (
          <div
            role="button"
            onClick={() => onClick(document._id)}
            key={document._id}
            className="flex items-center justify-between w-full text-sm text-black rounded-sm dark:hover:bg-neutral-800 hover:bg-neutral-200 dark:text-white"
          >
            <span className="pl-2 truncate">{document.title}</span>
            <div className="flex items-center ">
              <div
                onClick={(e) => onRestore(e, document._id)}
                role="button"
                className="p-2 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <Undo className="w-4 h-4 text-muted-foreground" />
              </div>

              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="p-2 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-700"
                >
                  <Trash className="w-4 h-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
