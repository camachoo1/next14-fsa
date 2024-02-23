import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='text-base font-medium hover:text-gray-300 cursor-pointer hover-underline-animation'
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-white'>
        <DialogHeader className='flex flex-col items-center'>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Please login using GitHub to continue!
          </DialogDescription>
        </DialogHeader>
        <div className='grid py-3 border-2'>
          <div className='flex justify-center items-center gap-2'>
            <Image
              src='/github-logo.png'
              alt='GitHub'
              width={30}
              height={30}
              className='rounded-full'
            />
            <a className='text-black' href='/login/github'>
              Sign in with GitHub
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
