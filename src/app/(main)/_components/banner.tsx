'use client';

import { Button } from '@/components/ui/button';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/modals/confirm-modal';

interface BannerProps {
  documentId: Id<'documents'>;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({
      id: documentId,
    });

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Deleted note!',
      error: 'Failed to delete note.',
    });

    router.push('/documents');
  };

  const onRestore = () => {
    const promise = restore({
      id: documentId,
    });

    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Restored note!',
      error: 'Failed to restore note.',
    });
  };

  return (
    <div className="flex items-center justify-center w-full p-2 text-sm text-center text-white bg-rose-500 gap-x-2">
      <p>This page is in the trash.</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="h-auto font-normal text-white py-1.5 text-xs bg-transparent border border-white dark:border-white dark:hover:bg-white/10 dark:bg-transparent hover:text-white"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="h-auto py-1.5 text-xs font-normal text-white bg-transparent border border-white dark:border-white dark:hover:bg-white/10 dark:bg-transparent hover:text-white"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Banner;
