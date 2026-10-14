import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import Agendamentos from "../components/Agendamentos";
import useNutricionista from "../hooks/useNutricionista";
import { formatarData } from "../utils/formatters";
import { useRef, useState } from "react";
import "../index.css";

function AdminHome() {
  const modal = useRef();
  const [fechando, setFechando] = useState(false);
  const { nutricionista, carregando, erro } = useNutricionista();

  function abrirModal() {
    setFechando(false);
    modal.current.showModal();
  }

  function fecharModal() {
    setFechando(true);
    setTimeout(() => {
      modal.current.close();
      setFechando(false);
    }, 300);
  }

  const nome = carregando
    ? "Carregando..."
    : nutricionista?.nome || "Nutricionista não identificado";

  // [rótulo, valor, quebra de linha em textos longos]
  const dados = [
    ["Nome completo", nutricionista?.nome],
    ["CRN", nutricionista?.crn],
    ["Especialidade", nutricionista?.especialidade],
    ["E-mail", nutricionista?.email, true],
    ["Gênero", nutricionista?.genero],
    [
      "Data de nascimento",
      nutricionista?.nascimento ? formatarData(nutricionista.nascimento) : "",
    ],
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="w-full p-4 lg:p-10">
        {/* Cabeçalho */}
        <div className="max-w-5xl mb-8">
          <h1 className="text-gray-800 text-3xl lg:text-4xl text-center font-bold w-full">
            {nome}
          </h1>
          {nutricionista && (
            <p className="text-gray-600 text-center text-lg mt-1 fs-6">
              ID: {nutricionista._id.slice(-6).toUpperCase()}
            </p>
          )}
        </div>

        {/* Aviso quando não há nutricionista identificado */}
        {!carregando && !nutricionista && (
          <div className="max-w-5xl mb-6 rounded-2xl bg-yellow-100 p-4 text-yellow-900">
            {erro || "Nenhum nutricionista identificado neste navegador."}{" "}
            <Link to="/CadNu" className="font-bold underline">
              Criar conta de nutricionista
            </Link>
          </div>
        )}

        {/* CARD DO PERFIL */}
        <main className="relative w-full max-w-auto shadow-xl/20 bg-gray-500 rounded-3xl p-6 lg:p-8 text-white overflow-hidden mb-10">
          {/* Decorações */}
          <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-gray-600/50 pointer-events-none" />
          <div className="absolute -right-10 -bottom-24 w-52 h-52 rounded-full bg-gray-600/30 pointer-events-none" />

          {/* Botão editar */}
          <button className="absolute top-4 right-4 z-20" onClick={abrirModal}>
            <Settings className="cursor-pointer size-13 p-1.5 bg-gray-500 rounded-2xl" />
          </button>

          {/* DIALOG */}
          <dialog
            ref={modal}
            className={`rounded-xl bg-taupe-50/90 h-160 w-150 p-5 fixed top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              ${
                fechando
                  ? "animate-[fecharModal_0.2s_ease-in_forwards]"
                  : "animate-[abrirModal_0.2s_ease-out_forwards]"
              }
            `}
          >
            <div className="bg-white p-5 rounded-xl shadow-md">
              <p className="font-bold text-3xl">Editar perfil</p>

              <label htmlFor="nome" className="text-lg mt-5 ">
                Nome:
              </label>
              <label htmlFor="sobrenome" className="text-lg ml-52">
                Sobrenome:
              </label>

              <br />

              <input
                id="nome"
                type="text"
                placeholder="   Digite o seu nome"
                className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 text-lg"
              />
              <input
                id="sobrenome"
                type="text"
                placeholder="   Digite o seu sobrenome"
                className="bg-gray-50 shadow-md rounded-lg w-60 h-10 ml-5 text-lg"
              />

              <br />

              <label htmlFor="nascimento" className="text-lg mt-5 ">
                Data de nascimento:
              </label>
              <label htmlFor="genero" className="text-lg mt-5 ml-25 ">
                Gênero:
              </label>

              <br />

              <input
                id="nascimento"
                type="text"
                placeholder="   Digite a sua data de nascimento"
                className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 text-lg"
              />

              <select
                id="genero"
                defaultValue=""
                className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 ml-5 text-lg text-black/50"
              >
                <option value="" disabled className="text-lg">
                  Selecione seu gênero
                </option>
                <option value="Masculino">Homem</option>
                <option value="Feminino">Mulher</option>
                <option value="Prefiro não responder">
                  Prefiro não responder
                </option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <br />

            <div className="bg-white p-5 rounded-xl shadow-md">
              <p className="font-bold text-3xl">Editar email</p>

              <p className="text-base">
                Caso queira editar o seu e-mail você tera que clicar no botão a
                baixo <br />e preencher os dados exigidos.
              </p>

              <div className="mt-3">
                <button className="cursor-pointer bg-gray-400 p-2 rounded-md text-lg text-white">
                  Editar email
                </button>
              </div>
            </div>

            <br />

            <button
              onClick={fecharModal}
              className="cursor-pointer bg-gray-400 p-2 rounded-md text-lg text-white w-full"
            >
              Salvar
            </button>

            <button
              onClick={fecharModal}
              className="cursor-pointer bg-red-700 p-2 rounded-md text-lg text-white w-full mt-5"
            >
              Cancelar
            </button>
          </dialog>

          {/* INFORMAÇÕES */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold">Dados da nutricionista</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dados.map(([rotulo, valor, quebra]) => (
                <div
                  key={rotulo}
                  className="bg-gray-600/70 rounded-2xl p-4 transition hover:bg-gray-600"
                >
                  <p className="text-sm text-gray-300">{rotulo}</p>
                  <p
                    className={`text-xl font-semibold mt-1 ${quebra ? "break-all" : ""}`}
                  >
                    {valor || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* AGENDAMENTOS (só deste nutricionista) */}
        <div className="max-w-auto">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-gray-800 text-3xl lg:text-4xl text-center font-bold w-full">
              Agendamentos
            </h2>
          </div>

          {nutricionista && (
            <Agendamentos nutricionistaId={nutricionista._id} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
