import { createApp } from "../server/_core/app";

// Vercel Serverless Function: qualquer requisição sob /api/* cai aqui
// (rota "catch-all" via nome de arquivo [...path]). Os arquivos estáticos
// do frontend (build do Vite) são servidos separadamente pela Vercel a
// partir de dist/public — não passam por esta função.
const app = createApp();

export default app;
