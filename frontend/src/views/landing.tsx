"use client"

import { useState } from "react";
import { BookOpen, Globe, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/modal-auth";

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
          <div className="mb-12">
            <img src="/logo.png" alt="Logomarca" />
          </div>
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Explore o inglês de forma
            <span className="text-primary"> completa</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubra significados, pronúncias e etimologias de palavras em inglês.
            Gerencie seu histórico de buscas e organize suas palavras favoritas.
          </p>
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
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Recursos do Dictionary
          </h3>
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
      {/* CTA Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Comece a explorar agora
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Acesse milhares de definições em inglês e organize seu aprendizado pessoal.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => openAuthModal('signup')}
          >
            Criar Conta Gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.png" alt="Logomarca" />
          </div>
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Dictionary. Todos os direitos reservados.
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