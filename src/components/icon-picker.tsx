'use client';

import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
}

export const IconPicker = ({
  onChange,
  children,
  asChild,
}: IconPickerProps) => {
  const { resolvedTheme } = useTheme();

  const themeMap: Record<'dark' | 'light', Theme> = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };

  const currentTheme =
    resolvedTheme === 'dark' || resolvedTheme === 'light'
      ? resolvedTheme
      : 'light';

  const theme = themeMap[currentTheme];

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="w-full p-0 border-none shadow-none">
        <EmojiPicker
          onEmojiClick={(data) => onChange(data.emoji)}
          height={350}
          theme={theme}
        />
      </PopoverContent>
    </Popover>
  );
};
