import { useEffect } from "react";
import { Link } from "react-router-dom";

function TermosServico() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="bg-[#f7f5ee] px-5 py-14 text-gray-700 sm:px-8 sm:py-20">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-10 shadow-sm sm:px-12 sm:py-14">
        <header className="mb-10 border-b border-emerald-900/10 pb-8">
          <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Uso responsável da plataforma
          </p>
          <h1 className="font-display text-4xl font-medium leading-tight text-emerald-950 sm:text-5xl">
            Termos de Serviço
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
              1. Sobre os termos
            </h2>
            <p>
              Estes Termos de Serviço regulam o acesso e o uso da plataforma
              Datadiet, incluindo seus módulos, páginas, recursos de cadastro,
              agendamento, atendimento e gestão de informações. Ao utilizar a
              plataforma, você declara que leu e concorda com estes termos. Caso
              não concorde com alguma condição, não utilize os serviços.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              2. Cadastro e conta
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Você deve fornecer informações verdadeiras, completas e
                atualizadas no cadastro.
              </li>
              <li>
                Cada usuário é responsável por manter suas credenciais em
                segurança e não compartilhá-las com terceiros.
              </li>
              <li>
                O usuário deve comunicar qualquer suspeita de uso indevido da
                conta pelos canais oficiais da plataforma.
              </li>
              <li>
                A Datadiet poderá solicitar a atualização ou confirmação de
                informações para preservar a segurança do serviço.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              3. Uso da plataforma
            </h2>
            <p>
              A Datadiet oferece recursos tecnológicos para organizar e apoiar
              processos de atendimento nutricional. A disponibilidade de cada
              módulo pode variar conforme o perfil de acesso, as configurações
              do serviço e as permissões concedidas ao usuário.
            </p>
            <p className="mt-3">
              A plataforma não substitui avaliação profissional, diagnóstico,
              prescrição ou orientação de emergência. Em situações urgentes,
              procure os serviços de saúde adequados.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              4. Agendamentos e comunicações
            </h2>
            <p>
              Os recursos de agendamento dependem da disponibilidade informada
              pelos profissionais e das regras aplicáveis a cada serviço. Um
              agendamento somente será considerado confirmado quando essa
              confirmação for apresentada pela plataforma ou pelo responsável
              pelo atendimento.
            </p>
            <p className="mt-3">
              A Datadiet poderá enviar mensagens relacionadas a cadastro,
              consultas, alterações, confirmações, lembretes, segurança e
              funcionamento do serviço. É responsabilidade do usuário manter
              seus dados de contato atualizados.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              5. Condutas proibidas
            </h2>
            <p>É proibido utilizar a plataforma para:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>violar leis, direitos de terceiros ou estes termos;</li>
              <li>
                acessar, alterar ou tentar obter dados de outras contas sem
                autorização;
              </li>
              <li>
                inserir conteúdo falso, fraudulento, ofensivo ou malicioso;
              </li>
              <li>
                introduzir vírus, códigos maliciosos ou qualquer mecanismo que
                prejudique o serviço; ou
              </li>
              <li>
                realizar engenharia reversa, copiar ou explorar a plataforma
                fora das permissões legais.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              6. Conteúdo e responsabilidades
            </h2>
            <p>
              O usuário é responsável pelas informações que insere na
              plataforma e deve possuir autorização para utilizar quaisquer
              dados ou arquivos enviados. A Datadiet poderá remover conteúdo
              que viole a legislação, estes termos ou a segurança do serviço.
            </p>
            <p className="mt-3">
              A Datadiet trabalha para manter a plataforma disponível e segura,
              mas podem ocorrer interrupções por manutenção, falhas técnicas,
              indisponibilidade de serviços de terceiros ou eventos fora de seu
              controle.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              7. Privacidade e dados pessoais
            </h2>
            <p>
              O tratamento de dados pessoais realizado durante o uso da
              plataforma é explicado na{" "}
              <a
                href="/politica-de-privacidade"
                className="font-semibold text-emerald-800 underline underline-offset-2"
              >
                Política de Privacidade
              </a>
              . Ao utilizar a Datadiet, o usuário também se compromete a
              respeitar as regras de proteção de dados aplicáveis, especialmente
              ao inserir ou acessar informações de terceiros.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              8. Suspensão e encerramento
            </h2>
            <p>
              O acesso poderá ser suspenso ou encerrado quando houver violação
              destes termos, uso fraudulento, risco à segurança, determinação
              legal ou necessidade de manutenção do serviço. O usuário também
              poderá solicitar o encerramento da conta pelos canais oficiais,
              observadas as obrigações legais de retenção de informações.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-sans text-xl font-semibold text-emerald-900">
              9. Alterações dos termos
            </h2>
            <p>
              Estes termos poderão ser atualizados para refletir mudanças na
              plataforma, na legislação ou nos procedimentos operacionais. A
              versão vigente estará disponível nesta página, com indicação da
              data da última atualização. O uso continuado após alterações
              representa a concordância com a nova versão.
            </p>
          </section>

          <section className="rounded-2xl bg-emerald-50 p-5 text-emerald-950">
            <h2 className="mb-2 font-sans text-xl font-semibold">
              Dúvidas e suporte
            </h2>
            <p>
              Para dúvidas sobre estes termos, suporte ou solicitações
              relacionadas à conta, utilize o canal oficial de contato
              disponibilizado pela Datadiet.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

export default TermosServico;
