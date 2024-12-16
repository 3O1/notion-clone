'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConvexAuth } from 'convex/react';
import { Spinner } from '@/components/spinner';
import Link from 'next/link';
import { SignInButton } from '@clerk/clerk-react';

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
        Your Ieas, Documents, & Plans. Unified. Welcome to{' '}
        <span className="underline">Notion</span>
      </h1>

      <h3 className="text-base font-medium sm:text-xl md:text-2xl">
        Notion is the connected workspace where <br />
        better, faster work happens.
      </h3>

      {isLoading && (
        <div className="flex items-center justify-center w-full">
          <Spinner size="lg" />
        </div>
      )}

      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter Notion <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      )}

      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Get Notion free <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
