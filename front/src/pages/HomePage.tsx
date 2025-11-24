import { useAuth } from "../contexts/auth/useAuth";
import ImgExpocanpi from "../assets/Img_Expocanpi.jpg";

export default function HomePage() {
   const { orientador } = useAuth();

   const renderWelcomeMessage = () => {
      if (orientador && orientador.isAdmin) {
         return `Bem vindo, Administrador ${orientador.nomeOrientador}!`;
      } else if (orientador && !orientador.isAdmin) {
         return `Bem vindo, Orientador ${orientador.nomeOrientador}!`;
      } else {
         return "Bem vindo ao SIGPE!";
      }
   };

   return (
      <div className="leading-relaxed w-full px-6 py-10 mx-auto text-gray-800 text-center justify-center">
         <h1 className="mt-8 text-green-700 text-3xl font-bold">
            {renderWelcomeMessage()}
         </h1>

         <h3 className="mt-10 text-xl font-semibold">APRESENTAÇÃO</h3>
         <p className="mt-4">
            A Exposição Técnico-Científica do Colégio Agrícola Nilo Peçanha
            (EXPOCANP) nasceu em 1999, idealizada pelos(as) servidores(as)
            Cristiane Oliveira, Jorge Baronto, Aníbal dos Santos, Marlon Sarubi
            e Almir Ferreira. Seu objetivo era expor à comunidade local as
            tecnologias e atividades realizadas nas aulas, promovendo a
            integração entre os participantes. Com a criação do IFRJ, a EXPOCANP
            adquiriu o caráter de semana acadêmica e passou a se chamar
            EXPOCANP/SEMATEC. A EXPOCANP/SEMATEC é um evento acadêmico anual do
            IFRJ - Campus Pinheiral, que tem como principal objetivo divulgar
            conhecimento científico e oferecer atividades complementares que
            enriquecem e aprimoram a variedade de experiências nas diversas
            áreas do conhecimento. Em 2025, a edição XXVII EXPOCANP/ IX SEMATEC
            ocorrerá de 29 de setembro a 04 de outubro, na modalidade
            presencial, e oferecerá palestras e oficinas com pesquisadores(as)
            de diversas áreas que atuam na contribuição do desenvolvimento no
            âmbito científico, cultural e tecnológico da nossa sociedade.
         </p>

         <div className="w-full flex justify-center mt-6">
            <img
               src={ImgExpocanpi}
               alt="Expocanpi"
               className="rounded shadow-md max-w-full h-auto"
            />
         </div>

         <h3 className="mt-10 text-xl font-semibold">REGRAS DE PARTICIPAÇÃO</h3>
         <p className="mt-2">
            A participação na EXPOCANP/SEMATEC é obrigatória, correspondendo às
            atividades letivas dos cursos.
         </p>

         <h4 className="mt-6 text-lg font-semibold">PRESENÇA NAS ATIVIDADES</h4>
         <p className="mt-2">
            Os(as) estudantes dos Cursos Técnicos Integrados e Concomitantes
            deverão participar obrigatoriamente de ao menos 1 (uma) atividade
            por dia. Para os estudantes que atingirem o requisito mínimo de
            participação, será atribuído 1,0 (um) ponto para compor a nota do
            bimestre corrente em todas as disciplinas. Estudantes dos cursos
            técnicos, dos cursos de graduação e de pós-graduação que
            participarem das atividades serão certificados.
         </p>

         <h4 className="mt-6 text-lg font-semibold">
            APRESENTAÇÃO DE TRABALHOS
         </h4>
         <p className="mt-2">
            Os(as) estudantes bolsistas dos Editais Integrados do IFRJ e
            Programa Jovens Talentos (FAPERJ) devem, obrigatoriamente,
            apresentar o trabalho referente ao seu projeto no Evento. Todos(as)
            os(as) estudantes regularmente matriculados(as) nos cursos técnicos
            integrados do IFRJ Campus Pinheiral deverão obrigatoriamente
            apresentar, individualmente ou em grupo, um trabalho no Evento.
         </p>

         <h3 className="mt-10 text-xl font-semibold">
            ORIENTAÇÕES PARA A SUBMISSÃO DE RESUMOS
         </h3>
         <p className="mt-4">
            A apresentação dos trabalhos será realizada no sábado, dia 04 de
            outubro de 2025, das 9h às 15h. Serão aceitas apresentações de
            trabalhos oriundos de projetos em desenvolvimento ou concluídos e de
            trabalhos diversos realizados sob orientação de servidores(as).
         </p>

         <h3 className="mt-10 text-xl font-semibold">
            ORIENTAÇÕES PARA A APRESENTAÇÃO DE TRABALHOS
         </h3>
         <p className="mt-4">
            Esse ano não será obrigatória a utilização de pôsteres na
            apresentação dos trabalhos. Embora seja o formato mais comum e
            recomendado, o grupo poderá usar a criatividade para confeccionar
            materiais visuais como cartazes, murais e maquetes.
         </p>
      </div>
   );
}
