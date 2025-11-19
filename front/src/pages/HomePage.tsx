import { useAuth } from '../contexts/auth/useAuth';
import ImgExpocanpi from "../assets/Img_Expocanpi.jpg";
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";


export default function HomePage() {
    // Obter o 'user' do contexto de autenticação
    const { orientador } = useAuth();

    // Função para renderizar a mensagem de boas-vindas
    const renderWelcomeMessage = () => {
        if (orientador && orientador.isAdmin) {
            // Caso 1: Administrador
            return `Bem vindo, Administrador ${orientador.nomeOrientador}!`;
        } else if (orientador && !orientador.isAdmin) {
            // Caso 2: Orientador
            return `Bem vindo, Orientador ${orientador.nomeOrientador}!`;
        } else {
            // Caso 3: Utilizador não logado
            return "Bem vindo ao SIGPE!";
        }
    };

    return (
        <div className="page">
            <h1 style={{ textAlign: 'center', marginTop: '2rem', color: 'rgba(0, 128, 0, 0.7)' }}>
                {renderWelcomeMessage()}
            </h1>
            <br />
            <h3 className="text-center">APRESENTAÇÃO</h3>
            <p>
                A Exposição Técnico-Científica do Colégio Agrícola Nilo Peçanha (EXPOCANP) nasceu em 1999, idealizada pelos(as) servidores(as) Cristiane Oliveira, Jorge Baronto, Aníbal dos Santos, Marlon Sarubi e Almir Ferreira. Seu objetivo era expor à comunidade local as tecnologias e atividades realizadas nas aulas, promovendo a integração entre os participantes. Com a criação do IFRJ, a EXPOCANP adquiriu o caráter de semana acadêmica e passou a se chamar EXPOCANP/SEMATEC. A EXPOCANP/SEMATEC é um evento acadêmico anual do IFRJ - Campus Pinheiral, que tem como principal objetivo divulgar conhecimento científico e oferecer atividades complementares que enriquecem e aprimoram a variedade de experiências nas diversas áreas do conhecimento. Em 2025, a edição XXVII EXPOCANP/ IX SEMATEC ocorrerá de 29 de setembro a 04 de outubro, na modalidade presencial, e oferecerá palestras e oficinas com pesquisadores(as) de diversas áreas que atuam na contribuição do desenvolvimento no âmbito científico, cultural e tecnológico da nossa sociedade. Além disso, teremos apresentações de trabalhos de estudantes e orientadores(as), no formato de pôsteres e/ou de painéis (exposições de fotos, maquetes, cartazes, jogos etc.). De 29 de setembro a 04 de outubro, teremos atividades acadêmicas, científicas, esportivas e culturais que ocorrerão, preferencialmente, em três horários, distribuídos em dois turnos (13h às 15h, 15h30 às 17h30 e 19h às 21h). Algumas atividades pontuais poderão ser ofertadas pela manhã No sábado, 04 de outubro, das 9h às 15h, teremos apresentação e avaliação dos trabalhos, cujos resumos devem ser submetidos de acordo com o modelo e cronograma.
            </p>
            <div className="image-container">
                <img src={ImgExpocanpi} alt="Expocanpi" />
            </div>
            <h3 className="text-center">REGRAS DE PARTICIPAÇÃO</h3>
            <p className="text-center">
                A participação na EXPOCANP/SEMATEC é obrigatória, correspondendo às atividades letivas dos cursos.
            </p>
            <h4>PRESENÇA NAS ATIVIDADES</h4>
            <p>
                Os(as) estudantes dos Cursos Técnicos Integrados e Concomitantes deverão participar obrigatoriamente de ao menos 1 (uma) atividade por dia. Para os estudantes que atingirem o requisito mínimo de participação, será atribuído 1,0 (um) ponto para compor a nota do bimestre corrente em todas as disciplinas. O ponto será fracionado caso o estudante não atinja o mínimo de participação.Estudantes dos cursos técnicos, dos cursos de graduação e de pós-graduação que participarem das atividades serão certificados. Para estudantes do ensino superior, a certificação conta como horas de atividades complementares. A pontuação nas disciplinas será facultativa, tendo cada professor(a) autonomia para determinar se e como irá pontuar em suas disciplinas. Para participar das atividades e fazer jus à pontuação, os(as) estudantes devem se inscrever previamente nas atividades e registrar a sua presença. Não será garantido o registro da presença e a emissão de certificados para estudantes que participarem de atividades para as quais não se inscreveu. 
            </p>
            <h4>APRESENTAÇÃO DE TRABALHOS</h4>
            <p>Os(as) estudantes bolsistas dos Editais Integrados do IFRJ e Programa Jovens Talentos (FAPERJ) devem, obrigatoriamente, apresentar o trabalho referente ao seu projeto no Evento. Todos(as) os(as) estudantes regularmente matriculados(as) nos cursos técnicos integrados do IFRJ Campus Pinheiral deverão obrigatoriamente apresentar, individualmente ou em grupo, um trabalho no Evento. A apresentação de trabalho constitui requisito de participação na EXPOCANP 2025 e integra a programação letiva e formativa da semana acadêmica. A não submissão e apresentação implicará na ausência injustificada do(a) estudante nas atividades obrigatórias do Evento.</p>
            <h3 className="text-center">ORIENTAÇÕES PARA A SUBMISSÃO DE RESUMOS</h3>
            <p>
                A apresentação dos trabalhos será realizada no sábado, dia 04 de outubro de 2025, das 9h às 15h.Serão aceitas apresentações de trabalhos oriundos de projetos em desenvolvimento ou concluídos e de trabalhos diversos realizados sob orientação de servidores(as). Não serão aceitas apresentações de projetos não iniciados.Para a submissão do resumo, no período de 01/07 a 25/08/2025, o(a) orientador(a) deverá seguir as recomendações abaixo.Utilizar o Modelo de Resumo - EXPOCANP 2025, que contém as regras de formatação e pode ser obtido clicando aqui.Organizar as informações do trabalho em: título, autores, colaboradores (se houver), resumo, palavras-chave, área de conhecimento e financiamento (se houver).Incluir o mínimo de 1 (um) estudante e o máximo de 8 (oito). Faz-se necessário nome completo, turma, curso e e-mail válido dos(as) estudantes;A submissão dos trabalhos deve ser feita, exclusivamente pelo(a) orientador(a), por meio de formulário eletrônico
            </p>
            <h3 className="text-center">ORIENTAÇÕES PARA A APRESENTAÇÃO DE TRABALHOS</h3>
            <p>
                Esse ano não será obrigatória a utilização de pôsteres na apresentação dos trabalhos. Embora seja o formato mais comum e recomendado para a apresentação de trabalhos científicos, o grupo poderá usar a criatividade para confeccionar outros tipos de materiais visuais, como cartazes, murais, maquetes etc, desde que contenha o título do trabalho e a identificação dos autores.Caso o grupo opte pela apresentação utilizando pôsteres, eles devem ser confeccionados na dimensão de 0,90 m de largura por 1,20 m de altura em papel ou lona (impresso). A diagramação e a escolha das fontes, cores, imagens e objetos que compõem o pôster devem considerar a visualização do trabalho à distância de um metro. Mencionar apoio quando for o caso. A necessidade de materiais de apoio (mesas e cadeiras extras, porta banner, extensão, fonte de energia elétrica, ponto de água etc.) deve ser especificada no momento da submissão do resumo.
            </p>

        </div>
    );
}
