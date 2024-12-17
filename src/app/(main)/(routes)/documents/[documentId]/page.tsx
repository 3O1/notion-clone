'use client';

import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { Toolbar } from '@/components/toolbar';
import { Cover } from '@/components/cover';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<'documents'>;
  }>;
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import('@/components/editor'), { ssr: false }),
    []
  );

  const [documentId, setDocumentId] = useState<Id<'documents'> | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setDocumentId(resolvedParams.documentId);
    };

    resolveParams();
  }, [params]);

  const document = useQuery(
    api.documents.getById,
    documentId ? { documentId } : 'skip'
  );

  const update = useMutation(api.documents.update);
  const onChange = (content: string) => {
    update({
      id: documentId!,
      content,
    });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="pt-4 pl-8 space-y-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
