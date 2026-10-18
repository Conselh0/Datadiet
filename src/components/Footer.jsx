import { Link } from "react-router-dom";

function Footer() {
  // Link de redirecionamento oficial para quando o usuário clicar no mapa
  const mapaUrl = "https://www.google.com/maps/place/R.+Ezequiel+Freire,+55+-+Santana,+S%C3%A3o+Paulo+-+SP,+02034-000/data=!4m2!3m1!1s0x94cef628277f7583:0xdfd4b6e7e3189487?sa=X&ved=1t:242&ictx=111";

  return (
    <footer id="contato" className="w-full bg-emerald-950 text-white pt-8 pb-6 px-6 md:px-16 lg:px-24">
      {/* Linha Principal: Conteúdo Organizado */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-10 pb-8 border-b border-emerald-800/50">
        
        {/* Esquerda: Logo e CRN (Largura fixa para equilíbrio visual) */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3 lg:w-1/4">
          <img src="/img/logo 2.png" alt="Logo da Luana" className="w-[140px] h-auto object-contain brightness-110" />
          <div className="mt-1">
            <h3 className="font-bold tracking-wider text-lg">LUANA TEIXEIRA</h3>
            <p className="text-xs text-emerald-300/80">CRN/SP- 3 79016</p>
          </div>
        </div>

        {/* Centro: Contato e Endereço Perfeitamente Centralizados e Harmônicos */}
        <div className="flex flex-col items-center text-center gap-2 text-sm lg:w-2/5">
          <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-1">Contato & Localização</h4>
          <p className="leading-relaxed text-emerald-100/90 font-medium">
            Rua Ezequiel Freire, 55, Santana<br />
            São Paulo, SP, 02034-000
          </p>
          <p className="font-bold text-base text-emerald-200 mt-1 tracking-wide">+55 11 97117-2735</p>
        </div>

        {/* Direita: Bloco do Mapa Clicável Ampliado */}
        <div className="w-full max-w-[350px] h-[250px] overflow-hidden rounded-xl border border-emerald-800 shadow-md relative group lg:w-1/3">
          
          {/* Link invisível por cima de todo o mapa para garantir o clique */}
          <a 
            href={mapaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center bg-transparent group-hover:bg-emerald-950/20 transition-colors"
            title="Clique para abrir no Google Maps"
          >
            <span className="bg-emerald-900/90 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              Abrir no Maps ↗
            </span>
          </a>

          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.7424233353763!2d-46.6241188!3d-23.5057854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef628300b7111%3A0x64f6dc425eba31d1!2sR.%20Ezequiel%20Freire%2C%2055%20-%20Santana%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002034-001!5e0!3m2!1spt-BR!2sbr!4v1786477564117!5m2!1spt-BR!2sbr" 
            loading="lazy" 
            referrerPolicy="strict-origin-when-cross-origin" 
            className="w-full h-full border-none pointer-events-none z-10"
          ></iframe>
        </div>
      </div>

      {/* Linha Inferior: Redes sociais perfeitamente centralizadas em Grid de 3 Colunas no Desktop */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center pt-6 gap-4 text-xs text-emerald-300/70 text-center md:text-left">
        
        {/* Coluna 1: Copyright à esquerda */}
        <p className="md:order-1">&copy; {new Date().getFullYear()} Datadiet. Todos os direitos reservados.</p>
        
        {/* Coluna 2: Redes Sociais perfeitamente centralizadas no meio */}
        <div className="flex items-center justify-center gap-5 md:order-2">
          {/* Link do WhatsApp Corrigido e Valido */}
          <a 
            href="https://wa.me/5511971172735"
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block cursor-pointer z-50"
          >
            <img src="/img/whatsapp.png" alt="Whatsapp" className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" />
          </a>

          {/* Link do Instagram */}
          <a 
            href="https://www.instagram.com/nutriluanateixeira/"
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block cursor-pointer z-50"
          >
            <img src="/img/instagram.png" alt="Instagram" className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" />
          </a>

          {/* Link do Facebook */}
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block cursor-pointer z-50"
          >
            <img src="/img/facebook.png" alt="Facebook" className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" />
          </a>

          {/* Link de Ligação Telefônica Corrigido */}
          <a 
            href="tel:+5511971172735" 
            className="inline-block cursor-pointer z-50"
          >
            <img src="/img/call.png" alt="Telefone" className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Coluna 3: Link de acesso à direita */}
        <div className="md:text-right md:order-3">
          <Link to={"/Admin"} className="hover:text-white hover:underline transition-colors">
            Área da Nutricionista
          </Link>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
