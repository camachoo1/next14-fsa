import Image from 'next/image';

export default async function Page() {
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-6'>
      <div className='border-2 border-white p-4 rounded flex items-center space-x-2'>
        <Image
          src='/github-logo.png'
          alt='GitHub'
          width={24}
          height={24}
          className='rounded-full'
        />
        <a className='text-white' href='/login/github'>
          Sign in with GitHub
        </a>
      </div>
    </div>
  );
}
