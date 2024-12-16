'use client';

import Image from 'next/image';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { useMutation } from 'convex/react';
// import { api } from '../../../../../convex/_generated/api';
import { api } from '@convex/_generated/api';
import { toast } from 'sonner';

const DocumentsPage = () => {
  const { user } = useUser();

  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({
      title: 'Untitled',
    });

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Image
        width="300"
        height="300"
        src="/img/empty.svg"
        alt="empty"
        className="dark:hidden"
      />

      <Image
        width="300"
        height="300"
        src="/img/empty-dark.svg"
        alt="empty"
        className="hidden dark:block"
      />

      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Notion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircleIcon className="w-4 h-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
