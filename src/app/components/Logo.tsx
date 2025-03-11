'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link href="/" className={`block ${className}`}>
      <Image
        src="/logo/aqqozy-logo.svg"
        alt="Aqqozy Logo"
        width={120}
        height={58}
        priority
      />
    </Link>
  );
};

export default Logo; 