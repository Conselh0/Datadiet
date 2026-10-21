import { useEffect, useMemo, useState } from "react";
import ModalPaciente from "../components/ModalPaciente";
import { getSessao } from "../utils/sessao";

const API = "http://localhost:8080";

function formatarData(data) {
  if (!data) return "Não informado";
  const dataFormatada = new Date(data);
  return Number.isNaN(dataFormatada.getTime())
    ? data
    : dataFormatada.toLocaleDateString("pt-BR");
}

function formatarIdVisual(numero) {
  return String(numero).padStart(3, "0");
}

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(() => Boolean(getSessao()?.id));
  const [erro, setErro] = useState(() =>
    getSessao()?.id ? "" : "Não foi possível identificar o nutricionista logado.",
  );

  useEffect(() => {
    const sessao = getSessao();
    if (!sessao?.id) {
      return;
    }

    fetch(`${API}/nutricionistas/${sessao.id}/pacientes`)
      .then(async (resposta) => {
        const dados = await resposta.json().catch(() => ({}));
        if (!resposta.ok) throw new Error(dados.erro || "Falha ao carregar pacientes.");
        return dados;
      })
      .then((dados) => {
        setPacientes(
          dados.map((paciente, indice) => ({
            ...paciente,
            id: paciente.pacienteId,
            idVisual: formatarIdVisual(indice + 1),
            nome: [paciente.nome, paciente.sobrenome].filter(Boolean).join(" "),
            data: paciente.ultima?.data || paciente.proxima?.data,
            hora: paciente.ultima?.horario || paciente.proxima?.horario,
          })),
        );
      })
      .catch((error) => setErro(error.message))
      .finally(() => setCarregando(false));
  }, []);

  const pacientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    if (!termo) return pacientes;
    return pacientes.filter(
      (paciente) =>
        paciente.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
        String(paciente.id).toLocaleLowerCase("pt-BR").includes(termo),
    );
  }, [busca, pacientes]);

  function iniciais(nome) {
    return nome
      .split(" ")
      .map((parte) => parte[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="w-full p-4 lg:p-10">
        <div className="mb-8 max-w-5xl">
          <h1 className="text-4xl font-bold text-gray-800 lg:text-5xl">
            Pacientes
          </h1>
        </div>

        <div className="mb-6 max-w-5xl">
          <div className="rounded-3xl bg-gray-500 p-5 shadow-xl/20 lg:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <label
                  htmlFor="buscarPaciente"
                  className="mb-2 block font-semibold text-white"
                >
                  Buscar paciente
                </label>
                <input
                  id="buscarPaciente"
                  type="search"
                  placeholder="Digite o ID ou nome do paciente"
                  className="h-11 w-full rounded-xl bg-gray-100 px-4 text-gray-700 shadow-md outline-none focus:ring-2 focus:ring-gray-300"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                />
              </div>
              <button
                type="button"
                className="h-11 cursor-pointer whitespace-nowrap rounded-xl bg-gray-700 px-5 font-semibold text-white transition hover:bg-gray-800 active:scale-95"
              >
                + Cadastrar novo paciente
              </button>
            </div>
          </div>
        </div>

        {erro && (
          <p className="mb-4 max-w-5xl rounded-xl bg-red-100 p-4 text-red-700">
            {erro}
          </p>
        )}
        <div className="max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl/20">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-gray-500 text-white">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">PACIENTE</th>
                  <th className="p-4 font-semibold">ÚLTIMA CONSULTA</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-gray-500">
                      Carregando pacientes...
                    </td>
                  </tr>
                ) : pacientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-gray-500">
                      Nenhum paciente encontrado.
                    </td>
                  </tr>
                ) : pacientesFiltrados.map((paciente) => (
                  <tr
                    key={paciente.id}
                    onClick={() => setPacienteSelecionado(paciente)}
                    className="cursor-pointer border-b border-gray-200 transition hover:bg-gray-100"
                  >
                    <td className="p-4 font-semibold text-gray-700">
                      #{paciente.idVisual}
                    </td>
                    <td className="p-4">
                      <div className="mx-auto flex w-64 items-center gap-3 text-left">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 font-bold text-white">
                          {iniciais(paciente.nome)}
                        </div>
                        <span className="font-semibold text-gray-700">
                          {paciente.nome}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700">
                          {formatarData(paciente.data)}
                        </span>
                        <span className="text-gray-400">{paciente.hora}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ModalPaciente
          paciente={pacienteSelecionado}
          aberto={pacienteSelecionado !== null}
          fechar={() => setPacienteSelecionado(null)}
        />
        <p className="ml-1 mt-5 text-lg text-gray-500">
          Clique no paciente para ver mais informações.
        </p>
      </div>
    </div>
  );
}

export default Pacientes;
