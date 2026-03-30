import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <header className="px-8 py-6 flex flex-col sm:flex-row justify-between items-center sm:gap-0 gap-4 border-b border-border/50 bg-white/50 backdrop-blur-md">
        <div className="font-bold text-2xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-accent shrink-0 flex items-center justify-center text-sm text-white">S</div>
          Signer
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-accent transition-colors">Entrar</Link>
          <Link href="/signup">
            <Button className="bg-primary text-white hover:bg-primary-light">Criar Conta</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 flex flex-col items-center justify-center text-center mt-20 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl text-balance">
          O portal profissional para o seu estúdio criativo.
        </h1>
        <p className="text-xl text-text-secondary mb-10 max-w-2xl text-balance">
          Faça a gestão dos seus clientes, organize projetos e partilhe ficheiros com uma interface incrivelmente limpa. Feito à medida para freelancers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary-light text-white text-base h-12 px-8 w-full">Começar Gratuitamente</Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-base h-12 px-8 w-full">Ver Funcionalidades</Button>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-text-secondary border-t border-border/50 mt-auto">
        <p>&copy; {new Date().getFullYear()} Signer. Todos os direitos reservados.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/privacidade" className="hover:underline">Privacidade</Link>
          <Link href="/termos" className="hover:underline">Termos</Link>
        </div>
      </footer>
    </div>
  )
}
