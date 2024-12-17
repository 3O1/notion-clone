'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from './ui/button';
import { ImageIcon, X } from 'lucide-react';
import { useCoverImage } from '@/hooks/use-cover-image';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '@convex/_generated/dataModel';
import { useEdgeStore } from '@/lib/edgestore';

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url: url,
      });
    }
    removeCoverImage({
      id: params.documentId as Id<'documents'>,
    });
  };

  return (
    <div
      className={cn(
        'relative w-full h-[35vh] group',
        !url && 'h-[12vh]',
        url && 'bg-secondary'
      )}
    >
      {!!url && (
        <Image src={url} fill alt="cover image" className="object-cover" />
      )}

      {url && !preview && (
        <div className="absolute flex items-center opacity-0 group-hover:opacity-100 bottom-5 right-5 gap-x-2">
          <Button
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
            onClick={() => coverImage.onReplace(url)}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Change cover
          </Button>

          <Button
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
            onClick={onRemove}
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};
