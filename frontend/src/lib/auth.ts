// Aqui ensinamos o NextAuth a ler as senhas do nosso arquivo .env.local
// e validar o seu acesso com segurança criptografada.

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const emailCorreto = credentials?.email === process.env.APP_USER_EMAIL;
        
        // Verifica se a senha digitada bate com a criptografia do .env
        const senhaCorreta = await bcrypt.compare(
          credentials?.password || "",
          process.env.APP_USER_PASSWORD_HASH || ""
        );

        if (emailCorreto && senhaCorreta) {
          return { id: "1", name: "Diretoria", email: credentials!.email };
        }
        return null; // Login inválido
      },
    }),
  ],
  pages: {
    signIn: "/login", // Manda para a nossa tela de login bonitona
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // A sessão dura 8 horas (um dia de trabalho)
  },
  secret: process.env.NEXTAUTH_SECRET,
};