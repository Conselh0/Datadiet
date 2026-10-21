import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useNutricionista from "../hooks/useNutricionista";
import {
  listarPacientes,
  listarAnamneses,
} from "../services/nutricionistaService";
import AnamneseView from "../components/AnamneseView";
import { formatarData, iniciais } from "../utils/formatters";

const idCurto = (id = "") => id.slice(-6).toUpperCase();

function Quando({ valor }) {
  if (!valor) return <span className="text-gray-400">—</span>;
  return (
    <>
      <p className="font-bold text-slate-800">{formatarData(valor.data)}</p>
      <p className="text-sm text-gray-400">{valor.horario}</p>
    </>
  );
}

function Pacientes() {
  const { nutricionista, carregando } = useNutricionista();
  const [pacientes, setPacientes] = useState([]);
  const [buscando, setBuscando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(null);

  // Ficha de anamnese do paciente aberto
  const [fichas, setFichas] = useState(null); // null = ainda não carregou
  const [fichaSel, setFichaSel] = useState(0);
  const [carregandoFichas, setCarregandoFichas] = useState(false);
  const [erroFicha, setErroFicha] = useState("");

  function abrir(p) {
    setAberto(p);
    setFichas(null);
    setFichaSel(0);
    setErroFicha("");
  }

  async function carregarFichas() {
    try {
      setCarregandoFichas(true);
      setErroFicha("");
      setFichas(await listarAnamneses(nutricionista._id, aberto.pacienteId));
    } catch (e) {
      setErroFicha(e.message);
    } finally {
      setCarregandoFichas(false);
    }
  }

  useEffect(() => {
    if (!nutricionista) return;
    listarPacientes(nutricionista._id)
      .then(setPacientes)
      .catch((e) => setErro(e.message))
      .finally(() => setBuscando(false));
  }, [nutricionista]);

  const termo = busca.trim().toLowerCase().replace("#", "");
  const visiveis = pacientes.filter(
    (p) =>
      !termo ||
      p.paciente.toLowerCase().includes(termo) ||
      idCurto(p.pacienteId).toLowerCase().includes(termo),
  );

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="w-full p-4 lg:p-10">
        <div className="max-w-auto">
          <h1 className="mb-8 text-4xl text-center font-bold text-gray-800 lg:text-5xl">
            Pacientes
          </h1>

          {!carregando && !nutricionista && (
            <div className="rounded-2xl bg-yellow-100 p-4 text-yellow-900">
              Nenhum nutricionista identificado.{" "}
              <Link to="/LoginPa" className="font-bold underline">
                Entrar
              </Link>
            </div>
          )}

          {nutricionista && (
            <>
              {/* Busca */}
              <div className="mb-6 rounded-2xl bg-gray-500 p-5 shadow-xl">
                <label
                  htmlFor="busca"
                  className="text-sm font-semibold text-white"
                >
                  Buscar paciente
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="busca"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Digite o ID ou nome do paciente"
                    className="h-10 flex-1 rounded-lg bg-gray-100 px-3"
                  />
                  <Link
                    to="/CadPa"
                    className="flex h-10 items-center justify-center rounded-lg bg-slate-700 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    + Cadastrar novo paciente
                  </Link>
                </div>
              </div>

              {erro && (
                <p className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
                  {erro}
                </p>
              )}
              {buscando && (
                <p className="text-gray-600">Carregando pacientes...</p>
              )}

              {!buscando && !erro && visiveis.length === 0 && (
                <p className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow">
                  {pacientes.length === 0
                    ? "Nenhum paciente agendou com você ainda."
                    : "Nenhum paciente encontrado."}
                </p>
              )}

              {visiveis.length > 0 && (
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                  <table className="w-full text-center">
                    <thead>
                      <tr className="bg-gray-500 text-sm text-white lg:text-base">
                        <th className="hidden p-4 sm:table-cell">ID</th>
                        <th className="p-4">PACIENTE</th>
                        <th className="p-4">ÚLTIMA CONSULTA</th>
                        <th className="p-4">PRÓXIMA CONSULTA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {visiveis.map((p) => (
                        <tr
                          key={p.pacienteId}
                          onClick={() => abrir(p)}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <td className="hidden p-4 font-bold text-slate-700 sm:table-cell">
                            #{idCurto(p.pacienteId)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-xs font-bold text-white">
                                {iniciais(p.paciente)}
                              </span>
                              <span className="font-semibold text-slate-800">
                                {p.paciente}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Quando valor={p.ultima} />
                          </td>
                          <td className="p-4">
                            <Quando valor={p.proxima} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {visiveis.length > 0 && (
                <p className="mt-3 text-gray-500">
                  Clique no paciente para ver mais informações.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detalhes do paciente */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setAberto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 text-center shadow-2xl"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-500 text-xl font-bold text-white">
              {iniciais(aberto.paciente)}
            </span>
            <h2 className="mt-3 text-2xl font-bold text-gray-800">
              {aberto.paciente}
            </h2>
            <p className="text-sm text-gray-500">
              ID #{idCurto(aberto.pacienteId)}
            </p>

            <div className="mt-5 space-y-2 text-left">
              <div className="rounded-xl bg-gray-100 p-3">
                <p className="text-xs text-gray-500">Consultas com você</p>
                <p className="font-bold text-gray-800">{aberto.total}</p>
              </div>
              <div className="rounded-xl bg-gray-100 p-3">
                <p className="text-xs text-gray-500">Última consulta</p>
                <p className="font-bold text-gray-800">
                  {aberto.ultima
                    ? `${formatarData(aberto.ultima.data)} às ${aberto.ultima.horario}`
                    : "—"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-100 p-3">
                <p className="text-xs text-gray-500">Próxima consulta</p>
                <p className="font-bold text-gray-800">
                  {aberto.proxima
                    ? `${formatarData(aberto.proxima.data)} às ${aberto.proxima.horario}`
                    : "—"}
                </p>
              </div>
            </div>

            {/* Ficha de anamnese */}
            <div className="mt-5 text-left">
              {fichas === null ? (
                <button
                  onClick={carregarFichas}
                  disabled={carregandoFichas}
                  className="w-full cursor-pointer rounded-lg border border-gray-500 py-2 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                >
                  {carregandoFichas
                    ? "Carregando ficha..."
                    : "Ver ficha de anamnese"}
                </button>
              ) : fichas.length === 0 ? (
                <p className="rounded-xl bg-gray-100 p-3 text-center text-sm text-gray-600">
                  Este paciente ainda não preencheu a ficha de anamnese.
                </p>
              ) : (
                <>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Ficha da consulta
                    <select
                      value={fichaSel}
                      onChange={(e) => setFichaSel(Number(e.target.value))}
                      className="mt-1 h-10 w-full rounded-lg bg-gray-100 px-3 font-normal"
                    >
                      {fichas.map((f, i) => (
                        <option key={f._id} value={i}>
                          #{f.numero} · {formatarData(f.data)} às {f.horario} ·{" "}
                          {f.status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <AnamneseView anamnese={fichas[fichaSel].anamnese} />
                </>
              )}
              {erroFicha && (
                <p className="mt-2 rounded-md bg-red-100 p-2 text-sm text-red-700">
                  {erroFicha}
                </p>
              )}
            </div>

            <button
              onClick={() => setAberto(null)}
              className="mt-6 w-full cursor-pointer rounded-lg bg-gray-500 py-2 font-semibold text-white hover:bg-gray-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pacientes;
