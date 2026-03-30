import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Criar Conta - Signer',
  description: 'Registe-se no Signer.',
}

export default async function SignupPage({ searchParams }: { searchParams: { message: string } }) {
  const signup = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return redirect('/signup?message=Falha ao criar conta. Tente novamente.')
    }

    return redirect('/onboarding')
  }

  return (
    <Card className="border-0 shadow-card-subtle bg-surface">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Registar</CardTitle>
        <CardDescription>
          Crie a sua conta para começar a gerir os seus projetos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={signup} className="space-y-4">
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
            Criar conta
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center w-full text-text-secondary">
          Já tem conta?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
