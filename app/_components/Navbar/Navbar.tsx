import Image from 'next/image';
import Link from 'next/link';
import { DialogDemo } from '../Modal/Modal';
import { validateRequest } from '@/lib/auth';

export default async function Navbar() {
  const { user } = await validateRequest();
  console.log(user);

  return (
    <nav className='block top-0 left-0 right-0 z-50 bg-transparent mr-auto ml-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-3 md:justify-start'>
          {/* Logo */}
          <Link href='/'>
            <div className='flex-shrink-0 mr-10 cursor-pointer'>
              {' '}
              {/* Add cursor-pointer to imply clickability */}
              <Image
                src='/alo.svg'
                alt='alo-logo'
                width={40}
                height={40}
              />
            </div>
          </Link>

          {/* Category Links - Centered with the logo */}
          <div className='flex-grow flex items-center justify-start space-x-6'>
            <Link href='/collections/women'>
              <span className='text-base font-medium hover:text-gray-300 cursor-pointer hover-underline-animation'>
                WOMEN
              </span>
            </Link>
            <Link href='/collections/men'>
              <span className='text-base font-medium hover:text-gray-300 cursor-pointer hover-underline-animation'>
                MEN
              </span>
            </Link>
            <Link href='/collections/accessories'>
              <span className='text-base font-medium hover:text-gray-300 cursor-pointer hover-underline-animation'>
                ACCESSORIES
              </span>
            </Link>
          </div>

          {/* Nav Links - Aligned to the right */}
          <div className='hidden md:flex items-center space-x-10 ml-10'>
            <Link href='/about'>
              <span className='text-base font-medium hover:text-gray-300 cursor-pointer hover-underline-animation'>
                ABOUT
              </span>
            </Link>
            {!!user ? (
              <span className='text-base font-medium hover:text-gray-300 cursor-pointer hover-underline-animation'>
                Hi, {user?.username}
              </span>
            ) : (
              <DialogDemo />
            )}
            {/* <Link href='/login'>
              <span className='flex items-center gap-1 text-base font-medium text-white hover:text-gray-300 cursor-pointer hover-underline-animation'>
                <Image
                  src='/person.svg'
                  alt='person'
                  height={24}
                  width={24}
                />
                LOGIN{'  '}
              </span>
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
