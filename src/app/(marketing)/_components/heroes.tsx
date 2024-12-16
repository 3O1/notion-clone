import Image from 'next/image';

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
          <Image fill src="/img/hero-1.svg" alt="hero image" />
        </div>
        <div className="relative h-[300px] w-[300px] hidden md:block">
          <Image
            className="object-contain"
            fill
            src="/img/hero-2.svg"
            alt="hero image"
          />
        </div>
      </div>
    </div>
  );
};
