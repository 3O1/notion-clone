'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Heading = () => {
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

      <Button>
        Enter Notion <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
