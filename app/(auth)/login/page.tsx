import LoginForm from "./_components/login-form";

export default async function LoginPage() {
  return (
    <div className="p-auto mx-auto flex max-w-lg flex-col items-center justify-center px-6 pt-8 dark:bg-background">
      <a
        href="/"
        className="flex items-center justify-center text-2xl font-semibold dark:invert"
      >
        <img src="/alo.svg" alt="logo" />
      </a>
      <div className="maw-w-xl flex w-full flex-col items-center space-y-8 rounded-lg bg-white p-6 shadow dark:bg-background">
        <h2 className="text-2xl font-bold text-muted-foreground dark:text-white">
          Sign in to your account
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
