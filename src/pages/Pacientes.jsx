import { useEffect, useMemo, useState } from "react";
import { UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
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

  function atualizarPaciente(usuario) {
    const atualizado = {
      ...usuario,
      id: usuario._id,
      nome: [usuario.nome, usuario.sobrenome].filter(Boolean).join(" "),
    };
    setPacientes((atuais) =>
      atuais.map((paciente) =>
        paciente.id === atualizado.id ? { ...paciente, ...atualizado } : paciente,
      ),
    );
    setPacienteSelecionado((atual) =>
      atual?.id === atualizado.id ? { ...atual, ...atualizado } : atual,
    );
  }

  function removerPaciente(id) {
    setPacientes((atuais) => atuais.filter((paciente) => paciente.id !== id));
    setPacienteSelecionado(null);
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-10">
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3 text-gray-700">
            <UsersRound className="size-8 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Área administrativa
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Pacientes
          </h1>
          <p className="mt-2 text-gray-500">
            Consulte seus pacientes e acesse os detalhes de cada cadastro.
          </p>
        </header>

        <div className="mb-5 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label
                htmlFor="buscarPaciente"
                className="mb-2 block font-semibold text-gray-700"
              >
                Buscar paciente
              </label>
              <input
                id="buscarPaciente"
                type="search"
                placeholder="Digite o ID ou nome do paciente"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
              />
            </div>
            <Link
              to="/CadPa"
              className="inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-gray-700 px-5 text-center font-semibold text-white transition hover:bg-gray-800 active:scale-95"
            >
              + Cadastrar novo paciente
            </Link>
          </div>
        </div>

        {erro && (
          <p className="mb-4 rounded-xl bg-red-100 p-4 text-red-700">
            {erro}
          </p>
        )}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Paciente</th>
                  <th className="px-6 py-4 font-semibold">Última consulta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {carregando ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">
                      Carregando pacientes...
                    </td>
                  </tr>
                ) : pacientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">
                      Nenhum paciente encontrado.
                    </td>
                  </tr>
                ) : pacientesFiltrados.map((paciente) => (
                  <tr
                    key={paciente.id}
                    onClick={() => setPacienteSelecionado(paciente)}
                    className="cursor-pointer transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      #{paciente.idVisual}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                          {iniciais(paciente.nome)}
                        </div>
                        <span className="font-medium text-gray-700">
                          {paciente.nome}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700">
                          {formatarData(paciente.data)}
                        </span>
                        {paciente.hora && (
                          <span className="text-sm text-gray-400">
                            {paciente.hora}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ModalPaciente
          key={pacienteSelecionado?.id || "sem-paciente"}
          paciente={pacienteSelecionado}
          aberto={pacienteSelecionado !== null}
          fechar={() => setPacienteSelecionado(null)}
          onAtualizado={atualizarPaciente}
          onExcluido={removerPaciente}
        />
        <p className="ml-1 mt-5 text-lg text-gray-500">
          Clique no paciente para ver mais informações.
        </p>
      </div>
    </div>
  );
}

export default Pacientes;
