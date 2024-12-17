'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Image
        src="/img/error.svg"
        height="300"
        width="300"
        alt="error"
        className="dark:hidden"
      />

      <Image
        src="/img/error-dark.svg"
        height="300"
        width="300"
        alt="error"
        className="hidden dark:block"
      />

      <h2 className="text-xl font-medium">Something went wrong!</h2>

      <Button asChild>
        <Link href="/documents">Go back</Link>
      </Button>
    </div>
  );
};

export default Error;
