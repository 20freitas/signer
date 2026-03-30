import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Login - Signer',
  description: 'Faça login na sua conta Signer.',
}

export default async function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  const login = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Não foi possível autenticar o utilizador')
    }

    return redirect('/dashboard')
  }

  return (
    <Card className="border-0 shadow-card-subtle bg-surface">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Entrar no Signer</CardTitle>
        <CardDescription>
          Insira o seu email e password para aceder à sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={login} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="nome@exemplo.com" required className="bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className="bg-white" />
          </div>
          {searchParams?.message && (
            <p className="text-sm font-medium text-destructive">{searchParams.message}</p>
          )}
          <Button type="submit" className="w-full bg-primary hover:bg-primary-light text-primary-foreground">
            Entrar
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center w-full text-text-secondary">
          Não tem uma conta?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Criar conta
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
