import { useEffect } from "react";
import { Link } from "react-router-dom";

function PoliticaPrivacidade() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="bg-[#f7f5ee] px-5 py-14 text-gray-700 sm:px-8 sm:py-20">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-10 shadow-sm sm:px-12 sm:py-14">
        <header className="mb-10 border-b border-emerald-900/10 pb-8">
          <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Transparência e segurança
          </p>
          <h1 className="font-display text-4xl font-medium leading-tight text-emerald-950 sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Última atualização: 27 de outubro de 2026
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            <span aria-hidden="true">←</span>
            Voltar para a página principal
          </Link>
        </header>

        <div className="space-y-8 font-delicate leading-relaxed">
          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              1. Quem somos
            </h2>
            <p>
              Esta Política de Privacidade explica como a plataforma Datadiet
              trata os dados pessoais de seus usuários, profissionais,
              administradores e visitantes. A Datadiet é uma plataforma
              modularizada para gestão de atendimentos nutricionais, consultas,
              agendamentos e informações relacionadas aos usuários.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              2. Quais dados são tratados
            </h2>
            <p>
              Podemos tratar os dados fornecidos por você ou gerados durante o
              uso da plataforma. A Datadiet aplica o princípio da necessidade e
              solicita apenas as informações adequadas e necessárias para cada
              finalidade:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                dados de identificação e contato, como nome, CPF, data de
                nascimento, telefone e e-mail;
              </li>
              <li>
                dados de acesso, como credenciais da conta e registros
                necessários para manter a sessão segura;
              </li>
              <li>
                dados de saúde e informações preenchidas em anamneses, quando
                necessários para os serviços oferecidos pela plataforma;
              </li>
              <li>
                informações de consultas, agendamentos, histórico e
                comunicações relacionadas ao atendimento; e
              </li>
              <li>
                dados técnicos básicos, como endereço IP, dispositivo e
                registros de erro, quando necessários para segurança e
                funcionamento da plataforma.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              3. Para que usamos os dados
            </h2>
            <p>Os dados podem ser utilizados para:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>criar e administrar sua conta;</li>
              <li>disponibilizar os módulos e funcionalidades da plataforma;</li>
              <li>agendar, confirmar, alterar e acompanhar consultas;</li>
              <li>enviar comunicações sobre o serviço e lembretes;</li>
              <li>atender obrigações legais e regulatórias; e</li>
              <li>prevenir fraudes, proteger a plataforma e melhorar o serviço.</li>
            </ul>
            <p className="mt-3">
              O tratamento observa as bases legais aplicáveis da Lei Geral de
              Proteção de Dados (Lei nº 13.709/2018), incluindo a execução de
              contrato ou serviço, o cumprimento de obrigações legais, o
              exercício regular de direitos e, quando necessário, o
              consentimento do titular. Dados referentes à saúde são tratados
              com as salvaguardas exigidas para dados pessoais sensíveis.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              4. Compartilhamento e armazenamento
            </h2>
            <p>
              O acesso aos dados é limitado às pessoas que precisam deles para
              utilizar os módulos da plataforma ou prestar os serviços
              relacionados a ela. Poderemos utilizar
              fornecedores de hospedagem, banco de dados, envio de mensagens e
              suporte técnico, sempre com medidas de segurança e apenas na
              extensão necessária. Também poderemos compartilhar informações
              quando houver obrigação legal, ordem de autoridade competente ou
              necessidade de proteger direitos.
            </p>
            <p className="mt-3">
              Mantemos os dados pelo período necessário para cumprir as
              finalidades desta política e as obrigações legais aplicáveis.
              Depois desse período, os dados serão eliminados ou anonimizados,
              salvo quando a conservação for autorizada ou exigida por lei.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              5. Segurança
            </h2>
            <p>
              Adotamos medidas técnicas e administrativas compatíveis com a
              natureza dos dados tratados para reduzir riscos de acesso não
              autorizado, perda, alteração ou divulgação indevida. Nenhum
              serviço, porém, é completamente imune a incidentes. Caso ocorra
              um evento relevante, serão adotadas as providências previstas na
              legislação aplicável.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              6. Seus direitos
            </h2>
            <p>
              Nos termos da LGPD, você pode solicitar confirmação da existência
              de tratamento, acesso, correção, atualização, anonimização,
              bloqueio ou eliminação de dados desnecessários, portabilidade
              quando regulamentada, informação sobre compartilhamentos e
              revogação do consentimento, quando essa for a base legal.
              Solicitações podem ser feitas pelo canal de contato
              disponibilizado na própria plataforma. Podemos solicitar
              informações para confirmar a identidade do solicitante e proteger
              os dados contra acessos indevidos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              7. Cookies e alterações
            </h2>
            <p>
              A plataforma pode utilizar recursos essenciais, como
              armazenamento local, para manter a sessão e permitir o
              funcionamento das áreas autenticadas. Esta política poderá ser
              atualizada para refletir mudanças no serviço ou na legislação. A
              versão vigente estará sempre disponível nesta página, com a data
              da última atualização.
            </p>
          </section>

          <section className="rounded-2xl bg-emerald-50 p-5 text-emerald-950">
            <h2 className="mb-2 font-sans text-xl font-semibold">
              Dúvidas sobre privacidade
            </h2>
            <p>
              Se você tiver dúvidas ou quiser exercer seus direitos, entre em
              contato pelo canal oficial disponibilizado pela Datadiet. As
              solicitações serão analisadas conforme a legislação aplicável.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

export default PoliticaPrivacidade;
