function LoginUs() {
  return (
    <main className="bg-orange-50/50 bg-full bg-[url('./img/bolas.png')] ">
      <section className="max-w-90 mx-auto p-4 rounded-2xl bg-taupe-50/70 shadow-2xl">
        <h2 className="text-3xl mb-4">Entrar</h2>

        <form method="post">
          <label for="email" class="form-label" className="text-lg mt-5">
            E-mail ou CRN:
          </label>
          <br />
          <input
            type="text"
            placeholder="   seu@email.com"
            className="bg-white shadow-md rounded-lg w-80 h-10 mb-5"
          />
          <br />

          <label for="password" class="form-label">
            Senha:
          </label>
          <br />
          <input
            type="password"
            placeholder="   Digite sua senha"
            minlength="8"
            className="bg-white shadow-md rounded-lg w-80 h-10"
          />
          <br />

          <a className="text-gray-400">Esqueceu a senha?</a>
          <br />
          <br />

          <center>
            <button className="bg-green-500 mx-auto shadow-md rounded-lg w-80 h-10 text-white"><b>Entrar</b></button>
          </center>

          <center>
            <a href="../criarconta/criarconta.html" className="text-gray-400">Criar conta</a>
          </center>
        </form>
      </section>
    </main>
  );
}

export default LoginUs;
