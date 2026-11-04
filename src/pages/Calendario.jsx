import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CalendarioConsultas from "../components/CalendarioConsultas";
import { getSessao } from "../utils/sessao";

const API = import.meta.env.VITE_API_URL

function Calendario() {
  const location = useLocation();
  const dataInicial = location.state?.data;
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(() => Boolean(getSessao()?.id));
  const [erro, setErro] = useState(() =>
    getSessao()?.id ? "" : "Não foi possível identificar o nutricionista logado.",
  );

  useEffect(() => {
    const sessao = getSessao();
    if (!sessao?.id) return;

    fetch(`${API}/agendamentos?nutricionistaId=${sessao.id}`)
      .then(async (resposta) => {
        const dados = await resposta.json().catch(() => ({}));
        if (!resposta.ok) {
          throw new Error(dados.erro || "Falha ao carregar a agenda.");
        }
        return dados;
      })
      .then((dados) =>
        setConsultas(
          dados.map((consulta) => ({
            ...consulta,
            id: consulta._id,
          })),
        ),
      )
      .catch((error) => setErro(error.message))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return <main className="p-10 text-gray-600">Carregando agenda...</main>;
  }

  if (erro) {
    return <main className="p-10 text-red-700">{erro}</main>;
  }

  return (
    <main className="min-h-screen w-full bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            <CalendarDays size={17} aria-hidden="true" />
            Agenda profissional
          </div>
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Agenda
          </h1>
          <p className="mt-2 text-gray-500">
            Consulte os atendimentos por dia e navegue entre os meses.
          </p>
        </header>

        <CalendarioConsultas
          consultas={consultas}
          dataInicial={dataInicial}
          expandido
          className="p-5 sm:p-8"
        />
      </div>
    </main>
  );
}

export default Calendario;
