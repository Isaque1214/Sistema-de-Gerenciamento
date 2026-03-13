// Arquivo: postcss.config.js
// Caminho: frontend/

// Este ficheiro configura os plugins que processam o CSS do sistema.
// É obrigatório para que as classes do Tailwind sejam interpretadas pelo Next.js.

module.exports = {
  plugins: {
    // Ativa o motor do Tailwind CSS
    tailwindcss: {},
    
    // Adiciona prefixos automaticamente (ex: -webkit-) para garantir que 
    // o design não quebre em navegadores mais antigos.
    autoprefixer: {},
  },
};