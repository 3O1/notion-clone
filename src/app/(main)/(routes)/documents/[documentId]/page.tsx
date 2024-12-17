'use client';

import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { Toolbar } from '@/components/toolbar';
import { Cover } from '@/components/cover';

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<'documents'>;
  }>;
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
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

  if (document === undefined) {
    return <div>loading...</div>;
  }

  if (document === null) {
    return <div>not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
