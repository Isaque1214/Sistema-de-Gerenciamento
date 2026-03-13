/** @type {import('tailwindcss').Config} */
// Arquivo: tailwind.config.js
// Caminho: frontend/

module.exports = {
  // 1. Define onde o Tailwind deve procurar pelas classes utilitárias
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    extend: {
      // 2. Definição da Identidade Visual do EloGestão
      colors: {
        // Cores base para um visual limpo e profissional
        brand: {
          primary: "#1C3D5A",   // Azul Noite (Usado no Sidebar)
          secondary: "#2563eb", // Azul Royal (Ações e Botões)
          accent: "#f1f5f9",    // Cinza Suave (Fundos de cards)
        },
        // Escala de cinzas modernos (Slate) para tipografia refinada
        slate: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      
      // 3. Sistema de Sombras Suaves (Visual de Camadas)
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      },

      // 4. Configuração de Animações (Essencial para o PageWrapper)
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "enter": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-up": "slide-in-up 0.4s ease-out",
        "enter": "enter 0.2s ease-out",
      },
      
      // Arredondamento de cantos padrão Apple/SaaS Moderno
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  
  // Plugins para suporte a animações complexas e formulários
  plugins: [
    require("tailwindcss-animate"),
  ],
};