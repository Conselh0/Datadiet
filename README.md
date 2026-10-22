# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Se o concurrently falhar: npm install concurrently --save-dev
Erro do npm no powershell: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

## Recuperação de senha

O fluxo de recuperação é feito em duas etapas:

1. O usuário informa apenas o e-mail em `/RedefinirSenha`.
2. O servidor envia um link por e-mail. Ao acessá-lo, o usuário informa e
   confirma a nova senha. O token expira em uma hora e só então a senha é
   substituída.

Configure as variáveis de banco e Resend do arquivo `.env` conforme o
[`.env.example`](./.env.example). `APP_URL` deve apontar para a URL em que o
frontend está sendo executado, pois ela será usada no link de confirmação.

Ao agendar uma consulta, o sistema envia um e-mail de confirmação ao paciente
e um aviso à nutricionista selecionada. A recuperação de senha também envia
pela API do Resend. Configure `RESEND_API_KEY` e `RESEND_FROM_EMAIL` no `.env`;
o endereço remetente precisa pertencer a um domínio verificado no Resend.
Se a notificação do agendamento não puder ser enviada, a consulta continua
agendada e o paciente verá um aviso na tela.

### Configuração do Resend

1. Crie uma conta em [resend.com](https://resend.com/).
2. No painel **Domains**, adicione um domínio seu ou um subdomínio para os
   envios, como `email.seudominio.com`.
3. Cadastre no provedor DNS do domínio os registros mostrados pelo Resend e
   aguarde a verificação ficar concluída.
4. No painel **API Keys**, crie uma chave com permissão de envio para o domínio
   verificado e copie-a. A chave só é exibida na criação; guarde-a em local
   seguro e nunca a coloque no frontend ou em um commit.
5. No `.env` do projeto, preencha `RESEND_API_KEY` com a chave e
   `RESEND_FROM_EMAIL` com um remetente desse domínio, por exemplo
   `Datadiet <notificacoes@email.seudominio.com>`.
6. Salve o `.env` e reinicie o servidor backend para carregar as variáveis.
7. Teste a recuperação de senha e faça um novo agendamento; consulte os logs
   do servidor e o painel **Emails** do Resend se algum envio falhar.

O domínio precisa ser seu e estar verificado; um endereço público como Gmail
não pode ser usado como domínio remetente. Enquanto não tiver domínio
verificado, use o fluxo de teste/documentação do Resend e os destinatários
permitidos para a sua conta.
