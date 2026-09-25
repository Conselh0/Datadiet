import { CircleArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CadPa() {
  const navigate = useNavigate();
  //Pegando os dados e armazenando nos states
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [genero, setGenero] = useState("");

  //O clique do botão chama essa função que envia para o cadastro
  async function salvar() {
    try {
      const res = await fetch("http://localhost:8080/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          sobrenome,
          nascimento,
          email,
          senha,
          confirmarSenha,
          cpf,
          telefone,
          genero,
        }),
      });

      const data = await res.json().catch(() => ({}));
      console.log(data);

      if (data.mensagem) {
        navigate("/User");
      } else {
        alert(data.erro || "Erro desconhecido");
      }
    } catch (error) {
      console.error("Erro no fetch:", error);
      alert("Erro ao conectar com o servidor");
    }
  }
  return (
    <main className="bg-orange-50/50 bg-full flex items-center bg-[url('./img/bolas.png')] h-[100vh] ">
      <section className="w-135 mx-auto p-4 rounded-2xl bg-taupe-50/70 shadow-2xl">
        <Link to="/">
          <CircleArrowLeft
            color="#ffffff"
            className="cursor-pointer absolute ml-116 size-10  p-1.5 bg-green-700 rounded-2xl"
          />
        </Link>
        <h2 className="text-3xl mb-4">Criar conta</h2>
        {/*Textos de Nome e sobrenome kk*/}
        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            salvar();
          }}
        >
          <label for="text" className="text-lg mt-5 font-medium ">
            Nome:
          </label>
          <label for="text" className="ml-54 font-semibold">
            Sobrenome:
          </label>

          {/*Input de nome e sobrenome kk*/}
          <br />
          <input
            type="text"
            placeholder="   Digite o seu nome"
            className="bg-white shadow-md rounded-lg w-60 h-10 mb-5"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="text"
            placeholder="   Digite o seu sobrenome"
            id="sobrenome"
            minlength="8"
            className="bg-white shadow-md rounded-lg w-60 h-10 ml-5"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
          />
          <br />

          {/*Input de Nascimento e email kk*/}
          <label for="text" className="text-lg mt-5 font-me">
            Nascimento:
          </label>
          <label for="email" className="ml-42 font-semibold">
            E-mail:
          </label>

          {/*Input de Nascimento e email kk*/}
          <br />
          <input
            type="text"
            placeholder="   DD/MM/AAAA"
            className="bg-white shadow-md rounded-lg w-60 h-10 mb-5"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
          />

          <input
            type="email"
            placeholder="   seu@email.com"
            className="bg-white shadow-md rounded-lg w-60 h-10 ml-5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />

          {/*Input de Nascimento e email kk*/}
          <label for="text" className="text-lg mt-5 font-me">
            Senha:
          </label>
          <label for="text" className="ml-53 font-semibold">
            Confirmar senha:
          </label>

          {/*Input de Nascimento e email kk*/}
          <br />
          <input
            type="password"
            placeholder="   Digite sua senha"
            className="bg-white shadow-md rounded-lg w-60 h-10 mb-5"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <input
            type="password"
            placeholder="   Confirme sua senha"
            className="bg-white shadow-md rounded-lg w-60 h-10 ml-5"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <br />

          {/*Input de CPF e telefone kk*/}
          <label for="text" className="text-lg mt-5 font-me">
            CPF:
          </label>
          <label for="text" className="ml-57 font-semibold">
            Telefone:
          </label>

          {/*Input de CPF e telefone kk*/}
          <br />
          <input
            type="text"
            placeholder="   Digite o seu CPF"
            className="bg-white shadow-md rounded-lg w-60 h-10 mb-5"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />

          <input
            type="text"
            placeholder="   (00) 00000-0000"
            className="bg-white shadow-md rounded-lg w-60 h-10 ml-5"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <label for="text" className="text-lg mt-5 ">
            Gênero:
          </label>
          <br />

          <select
            className="bg-gray-50 shadow-md rounded-lg w-60 h-10 mb-5text-lg text-black/50"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option value="" disabled selected className="text-lg">
              Selecione seu gênero
            </option>

            <option value="M">Homem</option>
            <option value="F">Mulher</option>
            <option value="Outro">Prefiro não responder</option>
          </select>
          <br />
          <br />

          <center>
            <button
              type="submit"
              className="cursor-pointer bg-green-700 mx-auto shadow-md rounded-lg w-80 h-10 text-white"
            >
              Criar conta
            </button>

            <br />

            <Link to="/CadNu" className="text-gray-400">
              Criar conta de nutricionista
            </Link>
          </center>
          <br />
        </form>
      </section>
    </main>
  );
}

export default CadPa;
