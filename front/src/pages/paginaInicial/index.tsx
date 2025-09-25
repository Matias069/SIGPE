// src/pages/HomePage/index.tsx
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

// Insira o caminho para uma imagem real da Expocanp ou do IFRJ
const expocanpImageUrl = "/path/to/your/expocanp-image.jpg"; 

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />

      <main className="flex-grow">
        {/* Seção Hero */}
        <div className="hero min-h-[60vh] bg-base-100">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold">Sistema Integrado de Gestão de Projetos da Expocanp (SIGPE)</h1>
              <p className="py-6">
                Uma solução digital para otimizar e automatizar a gestão de avaliações da Expocanp, a feira de projetos do IFRJ – Campus Pinheiral.
              </p>
              <Link to="/projetos" className="btn btn-primary">Ver Projetos</Link>
            </div>
          </div>
        </div>

        {/* Seção de Conteúdo */}
        <div className="container mx-auto p-8 space-y-12">

          {/* ==================== CÓDIGO DE TESTE INICIA AQUI ==================== */}
          <div className="text-center p-8 bg-base-100 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Área de Teste do Tailwind CSS</h2>
            <p className="mb-6">Se você está vendo um círculo vermelho abaixo, o Tailwind CSS está funcionando!</p>
            <div className="w-32 h-32 bg-red-500 rounded-full mx-auto shadow-lg flex items-center justify-center">
              <span className="text-white font-bold">OK!</span>
            </div>
          </div>
          {/* ===================== CÓDIGO DE TESTE TERMINA AQUI ===================== */}


          {/* Sobre a Expocanp */}
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <figure className="lg:w-1/3">
                <img src={expocanpImageUrl} alt="Foto da Expocanp" />
            </figure>
            <div className="card-body lg:w-2/3">
              <h2 className="card-title text-2xl">Sobre a Expocanp</h2>
              <p>
                A EXPOCANP é a tradicional feira de projetos do IFRJ - Campus Pinheiral, realizada anualmente. O evento tem como objetivo principal apresentar à comunidade acadêmica e ao público visitante os trabalhos desenvolvidos pelos estudantes, incentivando a criatividade, a pesquisa e a troca de conhecimentos.
              </p>
               <p>
                É um momento de integração entre estudantes, docentes e comunidade, reunindo ciência, tecnologia, cultura e inovação em um espaço de aprendizado coletivo.
              </p>
            </div>
          </div>

          {/* O Problema e a Solução */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">O Problema</h2>
                <p>
                  Atualmente, o processo de avaliação depende do Google Forms, um método manual, suscetível a erros e pouco eficiente. A equipe organizadora enfrenta dificuldades como a consolidação manual de notas e a complexa organização de planilhas, comprometendo a agilidade dos resultados.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">A Solução: SIGPE</h2>
                <p>
                  O objetivo central é implementar uma plataforma digital intuitiva que permita aos avaliadores registrar notas de forma rápida e segura, fornecendo à comissão acesso a dados consolidados em tempo real. O sistema visa reduzir o esforço operacional, minimizar erros e aumentar a transparência do processo.
                </p>
              </div>
            </div>
          </div>
          
          {/* Orientações */}
           <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">Orientações e Justificativa</h2>
                <p>
                  Este sistema foi desenvolvido para auxiliar a Comissão Organizadora da Expocanp nas avaliações de projetos. O objetivo é tornar o processo mais fácil tanto para os avaliadores quanto para os organizadores. Além disso, o sistema permitirá aos professores orientadores o cadastramento de projetos e aos alunos o acompanhamento de suas notas. A relevância está em resolver um problema real enfrentado pela comissão, que hoje depende de processos manuais.
                </p>
              </div>
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;