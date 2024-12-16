import Image from 'next/image';

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px]">
          <Image
            className="hidden dark:block"
            fill
            src="/img/hero-1-dark.svg"
            alt="hero image"
          />
          <Image
            className="dark:hidden"
            fill
            src="/img/hero-1.svg"
            alt="hero image"
          />
        </div>
      </div>
    </div>
  );
};
