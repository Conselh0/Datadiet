import DataAgendamentos from "../components/DataAgendamentos";
import { Settings } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import "../index.css";

function UserHome() {
  const modal = useRef();
  const [fechando, setFechando] = useState(false);

  // Criando estados para armazenar os dados reais que vêm do banco
  const [nomeUsuario, setNomeUsuario] = useState("Carregando...");
  const [dataNascimento, setDataNascimento] = useState("Carregando...");
  const [emailUsuario, setEmailUsuario] = useState("Carregando...");
  const [genero, setGenero] = useState("Carregando...");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [urlFoto, setUrlFoto] = useState("");
  const [erroFoto, setErroFoto] = useState("");
  const [mensagemFoto, setMensagemFoto] = useState("");
  const [salvandoFoto, setSalvandoFoto] = useState(false);

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

  function obterIdUsuarioLogado() {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {
      return "";
    }

    try {
      const usuarioJSON = JSON.parse(usuarioSalvo);
      return usuarioJSON.id || "";
    } catch {
      return "";
    }
  }

  async function atualizarFotoPerfil(tipo, valor) {
    try {
      setErroFoto("");
      setMensagemFoto("");
      setSalvandoFoto(true);

      const idUsuario = obterIdUsuarioLogado();

      if (!idUsuario) {
        setErroFoto("Não foi possível identificar o usuário logado.");
        return;
      }

      const resposta = await fetch(`http://localhost:8080/perfil/${idUsuario}/foto`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, valor }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        setErroFoto(dados.erro || "Não foi possível atualizar a foto de perfil.");
        return;
      }

      setFotoPerfil(dados.fotoPerfil || "");
      setMensagemFoto("Foto de perfil atualizada com sucesso!");
      window.dispatchEvent(
        new CustomEvent("perfil-atualizado", {
          detail: { fotoPerfil: dados.fotoPerfil || "" },
        }),
      );

      if (tipo === "url") {
        setUrlFoto("");
      }
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
      setErroFoto("Não foi possível conectar ao servidor para atualizar a foto.");
    } finally {
      setSalvandoFoto(false);
    }
  }

  async function salvarFotoPorUrl() {
    const urlNormalizada = urlFoto.trim();

    if (!urlNormalizada) {
      setErroFoto("Digite uma URL de imagem.");
      return;
    }

    await atualizarFotoPerfil("url", urlNormalizada);
  }

  async function removerFotoPerfil() {
    await atualizarFotoPerfil("remover", "");
  }

  async function enviarUploadFoto(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    if (!arquivo.type.startsWith("image/")) {
      setErroFoto("Selecione um arquivo de imagem válido.");
      return;
    }

    if (arquivo.size > 2 * 1024 * 1024) {
      setErroFoto("A imagem deve ter no máximo 2 MB.");
      return;
    }

    const leitor = new FileReader();

    leitor.onload = async () => {
      const resultado = typeof leitor.result === "string" ? leitor.result : "";

      if (!resultado) {
        setErroFoto("Não foi possível ler a imagem selecionada.");
        return;
      }

      await atualizarFotoPerfil("upload", resultado);
    };

    leitor.onerror = () => {
      setErroFoto("Não foi possível processar o upload da imagem.");
    };

    leitor.readAsDataURL(arquivo);
    event.target.value = "";
  }

  // O useEffect roda a busca no banco apenas uma vez quando a página carrega
  useEffect(() => {
    // Pega os dados do usuário no local storage e joga no banco
    async function mostrarDadosCadastrados() {
      try {
        // 1. Pega o ID do usuário que foi salvo no login lá no local storage
        const idUsuarioLogado = localStorage.getItem("usuario");

        if (!idUsuarioLogado) {
          console.error("Usuário não está logado ou ID não encontrado.");
          return;
        }

        const usuarioJSON = JSON.parse(idUsuarioLogado);

        const idUsuario = usuarioJSON.id;

        // 2. Passa o ID diretamente na URL da requisição
        const res = await fetch(`http://localhost:8080/perfil/${idUsuario}`);

        if (!res.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        // 3. O res.json() deve ser chamado APENAS UMA VEZ
        const usuario = await res.json();

        // 4. Como o back-end vai devolver só um objeto,
        // basta preencher os estados
        if (usuario) {
          setNomeUsuario(usuario.nome);
          setDataNascimento(usuario.nascimento);
          setEmailUsuario(usuario.email);
          setGenero(usuario.genero);
          setFotoPerfil(usuario.fotoPerfil || "");
        }
      } catch (error) {
        console.error("Deu erro ao buscar perfil:", error);

        setNomeUsuario("Erro ao carregar");
        setDataNascimento("Erro ao carregar");
        setEmailUsuario("Erro ao carregar");
        setGenero("Erro ao carregar");
        setFotoPerfil("");
      }
    }

    mostrarDadosCadastrados();
  }, []);

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-4 lg:p-10">
      {/* Cabeçalho do perfil */}
      <div className="max-w-5xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            {/* Nome vindo dinamicamente do banco */}
            <h1 className="text-4xl lg:text-5xl font-bold text-green-950">
              {nomeUsuario}
            </h1>

            <p className="text-green-800/70 text-lg mt-1">ID: 0001</p>
          </div>
        </div>
      </div>

      {/* Card com informações do paciente */}
      <div
        className="
          bg-green-950
          text-white
          w-full
          max-w-5xl
          p-6
          lg:p-8
          rounded-3xl
          shadow-xl/30
          mb-8
          relative
          overflow-hidden
        "
      >
        {/* Detalhe decorativo */}
        <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-green-800/40" />

        <div className="absolute -right-8 -bottom-20 w-48 h-48 rounded-full bg-green-800/20" />

        {/* Botão editar */}
        <button className="absolute top-4 right-4 z-20" onClick={abrirModal}>
          <Settings className="cursor-pointer size-13 p-1.5 bg-green-700 rounded-2xl" />
        </button>

        {/* =============================== */}
        {/* MODAL DE EDIÇÃO */}
        {/* =============================== */}

        <dialog
          ref={modal}
          className={`
            rounded-xl
            bg-taupe-50/90
            max-h-[90vh]
            w-[min(38rem,calc(100vw-2rem))]
            overflow-y-auto
            p-5
            fixed
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2

            ${
              fechando
                ? "animate-[fecharModal_0.2s_ease-in_forwards]"
                : "animate-[abrirModal_0.2s_ease-out_forwards]"
            }
          `}
        >
          {/* EDITAR PERFIL */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="font-bold text-3xl">Editar perfil</p>

            <label htmlFor="nome" className="text-lg mt-5">
              Nome:
            </label>

            <label htmlFor="sobrenome" className="text-lg ml-52">
              Sobrenome:
            </label>

            <br />

            <input
              id="nome"
              type="text"
              placeholder="Digite o seu nome"
              defaultValue={nomeUsuario}
              className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 text-lg px-2"
            />

            <input
              id="sobrenome"
              type="text"
              placeholder="Digite o seu sobrenome"
              minLength="8"
              className="bg-gray-50 shadow-md rounded-lg w-60 h-10 ml-5 text-lg px-2"
            />

            <br />

            <label htmlFor="nascimento" className="text-lg mt-5">
              Data de nascimento:
            </label>

            <label htmlFor="genero" className="text-lg mt-5 ml-25">
              Gênero:
            </label>

            <br />

            <input
              id="nascimento"
              type="date"
              className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 text-lg px-2"
            />

            <select
              id="genero"
              defaultValue=""
              className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 ml-5 text-lg text-black/50 px-2"
            >
              <option value="" disabled>
                Selecione seu gênero
              </option>

              <option value="M">Homem</option>

              <option value="F">Mulher</option>

              <option value="Outro">Prefiro não responder</option>
            </select>
          </div>

          <br />

          {/* EDITAR EMAIL */}
          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="font-bold text-3xl">Editar email</p>

            <p className="text-base">
              Caso queira editar o seu e-mail você terá que clicar no botão
              abaixo <br />e preencher os dados exigidos.
            </p>

            <div className="mt-3">
              <button
                className="
                  cursor-pointer
                  bg-green-700
                  hover:bg-green-800
                  p-2
                  rounded-md
                  text-lg
                  text-white
                  transition-colors
                "
              >
                Editar email
              </button>
            </div>
          </div>

          <br />

          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="font-bold text-3xl">Foto de perfil</p>

            <div className="flex items-center gap-4 mt-4">
              <img
                src={fotoPerfil || "/img/avatar.png"}
                alt="Pré-visualização da foto de perfil"
                className="w-32 h-32 rounded-full object-cover border border-gray-300"
              />
              <p className="text-sm text-gray-600">
                Você pode usar um link (URL) ou fazer upload de uma imagem.
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="url"
                placeholder="https://exemplo.com/minha-foto.jpg"
                value={urlFoto}
                onChange={(event) => setUrlFoto(event.target.value)}
                className="bg-gray-50 shadow-md rounded-lg w-full h-10 px-3 text-sm"
              />
              <button
                type="button"
                onClick={salvarFotoPorUrl}
                disabled={salvandoFoto}
                className="cursor-pointer bg-green-700 hover:bg-green-800 px-4 rounded-md text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {salvandoFoto ? "Salvando..." : "Salvar URL"}
              </button>
            </div>

            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                onChange={enviarUploadFoto}
                disabled={salvandoFoto}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-green-700 file:text-white hover:file:bg-green-800"
              />
            </div>

            <button
              type="button"
              onClick={removerFotoPerfil}
              disabled={salvandoFoto || !fotoPerfil}
              className="cursor-pointer mt-3 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remover foto
            </button>

            {erroFoto && <p className="text-red-600 text-sm mt-2">{erroFoto}</p>}
            {mensagemFoto && (
              <p className="text-green-700 text-sm mt-2">{mensagemFoto}</p>
            )}
          </div>

          <br />

          {/* BOTÕES DO MODAL */}
          <div className="flex gap-3">
            {/* SALVAR */}
            <button
              onClick={fecharModal}
              className="
                cursor-pointer
                bg-green-700
                hover:bg-green-800
                p-2
                rounded-md
                text-lg
                text-white
                w-full
                transition-colors
              "
            >
              Salvar
            </button>

            {/* CANCELAR */}
            <button
              onClick={fecharModal}
              className="
                cursor-pointer
                bg-red-700
                hover:bg-red-800
                p-2
                rounded-md
                text-lg
                text-white
                w-full
                transition-colors
              "
            >
              Cancelar
            </button>
          </div>
        </dialog>

        {/* Conteúdo do perfil */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Dados do paciente</h2>
            </div>
          </div>

          {/* Informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NOME */}
            <div className="bg-green-900/60 rounded-2xl p-4">
              <p className="text-sm text-green-200">Nome completo</p>

              <p className="text-xl font-semibold mt-1">{nomeUsuario}</p>
            </div>

            {/* DATA DE NASCIMENTO */}
            <div className="bg-green-900/60 rounded-2xl p-4">
              <p className="text-sm text-green-200">Data de nascimento</p>

              <p className="text-xl font-semibold mt-1">
                {dataNascimento &&
                dataNascimento !== "Carregando..." &&
                dataNascimento !== "Erro ao carregar"
                  ? new Date(dataNascimento).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })
                  : dataNascimento}
              </p>
            </div>

            {/* E-MAIL */}
            <div className="bg-green-900/60 rounded-2xl p-4">
              <p className="text-sm text-green-200">E-mail</p>

              <p className="text-xl font-semibold mt-1 break-all">
                {emailUsuario}
              </p>
            </div>

            {/* GÊNERO */}
            <div className="bg-green-900/60 rounded-2xl p-4">
              <p className="text-sm text-green-200">Gênero</p>

              <p className="text-xl font-semibold mt-1">{genero}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Próximo agendamento */}
      <DataAgendamentos />
    </main>
  );
}

export default UserHome;

// Código antigo antes da correção
// import DataAgendamentos from "../components/DataAgendamentos";
// import { Settings } from "lucide-react";
// import { useRef, useState } from "react";
// import "../index.css";
// import perfilRouter from "../server/routes/perfilUsuario";

// function UserHome() {
//   const modal = useRef();

//   const [fechando, setFechando] = useState(false);

//   function abrirModal() {
//     setFechando(false);
//     modal.current.showModal();
//   }

//   function fecharModal() {
//     setFechando(true);

//     setTimeout(() => {
//       modal.current.close();
//       setFechando(false);
//     }, 300);
//   }

//   async function mostrarDadosCadastrados(){
//     try{
//       const res = await fetch (`http://localhost:8080/perfil/id:`)
//       const {nome, email, idade} = req.body
//     }catch(error){
//       res.status(400)
//       console.log(`Deu erro no: ${error}`)
//     }

//   }

//   mostrarDadosCadastrados()

//   return (
//     <main className="w-full p-4 lg:p-10 min-h-screen flex flex-col lg:block items-center">
//       <div className="text-green-950 font-bold text-center lg:text-start">
//         <h1 className="text-5xl ">{nome}</h1>
//         <p className="text-2xl">ID: 0001</p>
//       </div>

//       <div className="bg-green-950 text-white w-full lg:w-[60vw] p-4 h-auto rounded-xl text-xl lg:text-3xl flex flex-col justify-between mb-10 relative">
//         <button className="absolute top-4 right-4" onClick={abrirModal}>
//           <Settings className="cursor-pointer size-13 p-1.5 bg-green-700 rounded-2xl" />
//         </button>

//         <dialog
//           ref={modal}
//           className={`rounded-xl bg-taupe-50/90 overflow-hidden h-152 w-150 p-5 fixed top-1/2 left-1/2
//   -translate-x-1/2 -translate-y-1/2
//     ${
//       fechando
//         ? "animate-[fecharModal_0.2s_ease-in_forwards]"
//         : "animate-[abrirModal_0.2s_ease-out_forwards]"
//     }
//   `}
//         >
//           <div className="bg-white p-5 rounded-xl shadow-md">
//             <p className="font-bold text-3xl">Editar perfil</p>

//             <label for="text" className="text-lg mt-5 ">
//               Nome:
//             </label>
//             <label for="text" className="text-lg ml-52">
//               Sobrenome:
//             </label>

//             <br />
//             <input
//               type="text"
//               placeholder="   Digite o seu nome"
//               className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 text-lg"
//             />

//             <input
//               type="text"
//               placeholder="   Digite o seu sobrenome"
//               minlength="8"
//               className="bg-gray-50 shadow-md rounded-lg w-60 h-10 ml-5 text-lg"
//             />

//             <br />

//             <label for="text" className="text-lg mt-5 ">
//               Data de nascimento:
//             </label>

//             <label for="text" className="text-lg mt-5 ml-25 ">
//               Gênero:
//             </label>

//             <br />
//             <input
//               type="text"
//               placeholder="   Digite o seu nome"
//               className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 text-lg"
//             />

//             <select className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 ml-5 text-lg text-black/50">
//               <option value="" disabled selected className="text-lg">
//                 Selecione seu gênero
//               </option>

//               <option value="Clinica e Hospitalar">Homem</option>
//               <option value="Esportiva">Mulher</option>
//               <option value="Materno-Infantil">Prefiro não responder</option>
//               <option value="Comportamental e Emagrecimento">Outro</option>
//             </select>
//           </div>
//           <br />

//           <div className="bg-white p-5 rounded-xl shadow-md">
//             <p className="font-bold text-3xl">Editar email</p>
//             <p className="text-base">
//               Caso queira editar o seu e-mail você tera que clicar no botão a
//               baixo <br />e preencher os dados exigidos.
//             </p>

//             <div className="mt-3">
//               <button className="cursor-pointer bg-green-700 p-2 rounded-md text-lg text-white">
//                 Editar email
//               </button>
//             </div>
//           </div>

//           <br />

//           <button
//             onClick={fecharModal}
//             className="cursor-pointer bg-green-700 p-2 rounded-md text-lg text-white w-full"
//           >
//             Salvar
//           </button>
//         </dialog>

//         <div>
//           <p className="p-3">
//             <b>Nome:</b> Ana Clara
//           </p>

//           <p className="p-3">
//             <b>Data</b> de Nascimento: 20/01/2000
//           </p>
//           <p className="p-3">
//             <b>E-mail:</b> ana@hotmail.com
//           </p>
//           <p className="p-3">
//             <b>Gênero:</b> Feminino
//           </p>
//         </div>
//       </div>
//       <DataAgendamentos />
//     </main>
//   );
// }

// export default UserHome;
