import { AuthForm } from '@/components/auth-form'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">SirenCY AI Chatter</h1>
        <AuthForm />
      </div>
    </main>
  )
}
