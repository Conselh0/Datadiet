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

  // O useEffect roda a busca no banco apenas uma vez quando a página carrega
  useEffect(() => {
    //Pega os dados do usuário no local storage e joga no banco
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

        // 4. Como o back-end vai devolver só um objeto, basta preencher os estados
        if (usuario) {
          setNomeUsuario(usuario.nome);
          setDataNascimento(usuario.nascimento);
          setEmailUsuario(usuario.email);
          setGenero(usuario.genero);
        }
      } catch (error) {
        console.error("Deu erro ao buscar perfil:", error);
        setNomeUsuario("Erro ao carregar");
        setEmailUsuario("Erro ao carregar");
      }
    }

    mostrarDadosCadastrados();
  }, []);

  return (
    <main className="w-full p-4 lg:p-10 min-h-screen flex flex-col lg:block items-center">
      <div className="text-green-950 font-bold text-center lg:text-start">
        {/* Renderiza o nome vindo dinamicamente do banco de dados */}
        <h1 className="text-5xl ">{nomeUsuario}</h1>
        <p className="text-2xl">ID: 0001</p>
      </div>

      <div className="bg-green-950 text-white w-full lg:w-[60vw] p-4 h-auto rounded-xl text-xl lg:text-3xl flex flex-col justify-between mb-10 relative">
        <button className="absolute top-4 right-4" onClick={abrirModal}>
          <Settings className="cursor-pointer size-13 p-1.5 bg-green-700 rounded-2xl" />
        </button>

        <dialog
          ref={modal}
          className={`rounded-xl bg-taupe-50/90 overflow-hidden h-152 w-150 p-5 fixed top-1/2 left-1/2
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

            <label htmlFor="text" className="text-lg mt-5 ">
              Nome:
            </label>
            <label htmlFor="text" className="text-lg ml-52">
              Sobrenome:
            </label>

            <br />
            <input
              type="text"
              placeholder="   Digite o seu nome"
              className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 text-lg"
            />

            <input
              type="text"
              placeholder="   Digite o seu sobrenome"
              minLength="8"
              className="bg-gray-50 shadow-md rounded-lg w-60 h-10 ml-5 text-lg"
            />

            <br />

            <label htmlFor="text" className="text-lg mt-5 ">
              Data de nascimento:
            </label>

            <label htmlFor="text" className="text-lg mt-5 ml-25 ">
              Gênero:
            </label>

            <br />
            <input
              type="text"
              placeholder="   Digite o seu nome"
              className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 text-lg"
            />

            <select className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5 ml-5 text-lg text-black/50">
              <option value="" disabled selected className="text-lg">
                Selecione seu gênero
              </option>
              <option value="M">Homem</option>
              <option value="F">Mulher</option>
              <option value="Outro">Prefiro não responder</option>
            </select>
          </div>
          <br />

          <div className="bg-white p-5 rounded-xl shadow-md">
            <p className="font-bold text-3xl">Editar email</p>
            <p className="text-base">
              Caso queira editar o seu e-mail você terá que clicar no botão
              abaixo <br />e preencher os dados exigidos.
            </p>

            <div className="mt-3">
              <button className="cursor-pointer bg-green-700 p-2 rounded-md text-lg text-white">
                Editar email
              </button>
            </div>
          </div>

          <br />

          <button
            onClick={fecharModal}
            className="cursor-pointer bg-green-700 p-2 rounded-md text-lg text-white w-full"
          >
            Salvar
          </button>
        </dialog>

        <div>
          <p className="p-3">
            <b>Nome:</b> {nomeUsuario}
          </p>
          <p className="p-3">
            <b>Data de Nascimento:</b>{" "}
            {dataNascimento && dataNascimento !== "Carregando..."
              ? new Date(dataNascimento).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })
              : "Carregando..."}
          </p>
          <p className="p-3">
            <b>E-mail:</b> {emailUsuario}
          </p>
          <p className="p-3">
            <b>Gênero:</b> {genero}
          </p>
        </div>
      </div>
      <DataAgendamentos />
    </main>
  );
}

export default UserHome;

//Código antigo antes da correção
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
