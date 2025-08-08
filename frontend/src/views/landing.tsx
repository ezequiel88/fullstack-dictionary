"use client"

import { useState } from "react";
import { BookOpen, Globe, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/modal-auth";
import Image from "next/image";


export default function Landing() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Logomarca"
              width={180}
              height={40}
              priority
              className="w-auto h-12"
            />
          </div>

          {/* Challenge Badge */}
          <div className="mb-6 inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            🏆 Desafio Técnico Fullstack - Desenvolvido como Produto
          </div>

          <h2 className="text-5xl font-bold text-foreground mb-6">
            Dictionary: Desafio que virou
            <span className="text-primary"> Produto</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Um desafio técnico fullstack desenvolvido com mentalidade de produto real.
            Explore definições, pronúncias e etimologias de palavras em inglês com uma experiência profissional completa.
          </p>

          {/* Technical Highlights */}
          <div className="mb-8 flex flex-wrap justify-center gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Next.js 15</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Node.js + Fastify</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">PostgreSQL</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full">Clean Architecture</span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">100% Testado</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => openAuthModal('signup')}
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => openAuthModal('signin')}
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-4">
            Recursos Desenvolvidos com Excelência Técnica
          </h3>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Cada funcionalidade foi pensada e implementada seguindo as melhores práticas de desenvolvimento,
            desde a arquitetura limpa até a experiência do usuário.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Definições Completas
              </h4>
              <p className="text-muted-foreground">
                Significados detalhados, exemplos de uso e diferentes classes gramaticais.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Pronúncia Nativa
              </h4>
              <p className="text-muted-foreground">
                Ouça a pronúncia correta das palavras com áudios de falantes nativos.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Histórico Pessoal
              </h4>
              <p className="text-muted-foreground">
                Mantenha registro de todas as palavras que você já consultou.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                Palavras Favoritas
              </h4>
              <p className="text-muted-foreground">
                Salve suas palavras preferidas e crie sua coleção pessoal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Excellence Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-4">
            Desafio Técnico com Padrões de Mercado
          </h3>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Este projeto demonstra competências técnicas avançadas através de uma implementação completa e profissional.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg border">
              <h4 className="text-xl font-semibold text-foreground mb-3">🏗️ Arquitetura Limpa</h4>
              <p className="text-muted-foreground mb-3">
                Implementação seguindo princípios SOLID com separação clara de responsabilidades.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Domain-Driven Design</li>
                <li>• Dependency Injection</li>
                <li>• Repository Pattern</li>
              </ul>
            </div>

            <div className="bg-background p-6 rounded-lg border">
              <h4 className="text-xl font-semibold text-foreground mb-3">🧪 Qualidade de Código</h4>
              <p className="text-muted-foreground mb-3">
                Cobertura completa de testes e validações rigorosas em todas as camadas.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Testes Unitários e Integração</li>
                <li>• Validação de Dados</li>
                <li>• TypeScript Strict Mode</li>
              </ul>
            </div>

            <div className="bg-background p-6 rounded-lg border">
              <h4 className="text-xl font-semibold text-foreground mb-3">🚀 Performance & UX</h4>
              <p className="text-muted-foreground mb-3">
                Otimizações avançadas e experiência de usuário cuidadosamente planejada.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Cache Inteligente</li>
                <li>• Paginação Cursor-based</li>
                <li>• Interface Responsiva</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Experimente o Resultado do Desafio
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Teste todas as funcionalidades desenvolvidas e veja como um desafio técnico
            pode se transformar em um produto completo e profissional.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => openAuthModal('signup')}
          >
            Testar Aplicação
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Logomarca"
              width={180}
              height={40}
              priority
              className="w-auto h-12"
            />
          </div>
          <p className="text-muted-foreground mb-2">
            <strong>Desafio Técnico Fullstack</strong> - Um desafio com mentalidade de produto!
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dictionary Challenge
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};