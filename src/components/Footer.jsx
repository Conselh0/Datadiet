function Footer() {
  return (
    <footer className="w-full h-full bg-green-900 flex flex-col lg:flex-row justify-between p-3 items-center ">
      <img
        src="/img/logo 2.png"
        alt="Logo da luana"
        className="w-[250px] h-[250px]"
      />
      <div className="flex-col text-white text-2xl text-center font-bold justify-center">
        {/*Todos os textos que estão no footer */}
        <p>
          Rua Ezequiel Freire, 55, Santana, <br />
          São Paulo, SP, 02034-000, Brasil <br />
          <br />
          LUANA TEIXEIRA <br />
          CRN/SP- 3 79016 <br />
          <br />
          +55 11 97117-2735
        </p>

        {/*Div que separa os ícones dos textos */}
        <div className="flex p-5 justify-center items-center gap-5">
          <img
            src="/img/whatsapp.png"
            alt=""
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <img
            src="/img/instagram.png"
            alt=""
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <img
            src="/img/facebook.png"
            alt=""
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <img
            src="/img/call.png"
            alt=""
            className="w-8 h-8 md:w-10 md:h-10 "
          />
        </div>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.7424233353763!2d-46.6241188!3d-23.5057854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef628300b7111%3A0x64f6dc425eba31d1!2sR.%20Ezequiel%20Freire%2C%2055%20-%20Santana%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002034-001!5e0!3m2!1spt-BR!2sbr!4v1786477564117!5m2!1spt-BR!2sbr"
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        className="max-w-[300px] h-[300px] max-h-[300px] rounded-[70px]"
      ></iframe>
    </footer>
  );
}

export default Footer;
