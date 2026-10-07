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

1. O usuário informa o e-mail e a nova senha em `/RedefinirSenha`.
2. O servidor envia um link de confirmação por e-mail. A senha atual só é
   substituída quando o link é acessado, e o token expira em uma hora.

Configure as variáveis de banco e SMTP do arquivo `.env` conforme o
[`.env.example`](./.env.example). `APP_URL` deve apontar para a URL em que o
frontend está sendo executado, pois ela será usada no link de confirmação.
