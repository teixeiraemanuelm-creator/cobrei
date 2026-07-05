# Cobrei – Brainstorming de Design

## Três Abordagens Estilísticas

### 1. Fintech Precision
**Tema:** Precisão e confiança financeira, inspirado em Stripe e Linear.
**Intro:** Interface limpa com tipografia forte, fundo branco com acentos verde-esmeralda e azul petróleo. Transmite credibilidade e seriedade tecnológica.
**Probabilidade:** 0.07

### 2. Conversational Tech *(ESCOLHIDA)*
**Tema:** Tecnologia amigável e conversacional, onde o WhatsApp é protagonista.
**Intro:** Combina a leveza de um produto de mensageria com a robustez de um SaaS financeiro. O verde do Pix/WhatsApp dialoga com o azul petróleo, criando contraste premium.
**Probabilidade:** 0.04

### 3. Dashboard-First
**Tema:** O produto é o herói — o dashboard ocupa o centro da narrativa visual.
**Intro:** Foco em demonstrar o produto com screenshots grandes, mockups 3D e dados reais. Estilo mais técnico e orientado a produto.
**Probabilidade:** 0.09

---

## Abordagem Escolhida: Conversational Tech

### Design Movement
Neo-SaaS com influência de product-led growth: combina a linguagem visual de ferramentas como Stripe e Linear com a familiaridade do WhatsApp.

### Core Principles
1. **Clareza acima de tudo** — cada seção tem um único objetivo de conversão
2. **O produto fala por si** — mockups e simulações de interface são os heróis visuais
3. **Verde como sinal de ação** — #10D876 é reservado exclusivamente para CTAs e confirmações
4. **Assimetria intencional** — layouts que quebram a simetria para criar dinamismo

### Color Philosophy
- **#10D876** (Verde Cobrei): Energia, ação, confirmação — usado em botões primários, ícones de check e destaques
- **#0B1736** (Azul Petróleo): Profundidade, confiança, seriedade — backgrounds escuros e textos de destaque
- **#FFFFFF** (Branco): Espaço, clareza, respiração — fundo principal
- **#F5F7FA** (Cinza Claro): Suavidade, separação de seções — backgrounds alternados
- Gradientes sutis de #0B1736 para #1a2d5a para profundidade

### Layout Paradigm
- Hero assimétrico: texto à esquerda (60%) + mockup à direita (40%) com leve rotação
- Cards flutuantes com sombras suaves e bordas arredondadas (16px)
- Seções alternadas entre fundo branco e cinza claro para ritmo visual
- Grid de 12 colunas com gutters generosos

### Signature Elements
1. **Bolha de WhatsApp animada** — simulação de conversa com animação de digitação
2. **Cards de status flutuantes** — pequenos badges com check verde e dados em tempo real
3. **Dashboard mockup com gráfico** — visual de software premium com dados fictícios

### Interaction Philosophy
- Scroll reveal suave para cada seção (fade-in + translateY)
- Hover em cards: elevação suave (shadow increase + translateY -4px)
- CTAs com pulse sutil no verde para chamar atenção
- Contador animado nos números de prova social

### Animation
- Entrada de elementos: `opacity: 0 → 1` + `translateY: 20px → 0` em 600ms ease-out
- Stagger de 100ms entre cards em grupos
- Hover em botões: scale(1.02) em 150ms
- Active em botões: scale(0.97) em 100ms
- Números de prova social: counter animation ao entrar na viewport

### Typography System
- **Display/Headlines:** Sora (bold 700/800) — moderna, geométrica, tecnológica
- **Body:** Inter (400/500) — legível, familiar, confiável
- **Monospace/Dados:** JetBrains Mono — para valores financeiros e código
- Hierarquia: 56px / 40px / 28px / 20px / 16px / 14px

### Brand Essence
**Cobrei** — o sistema de cobrança automática para quem não tem tempo de cobrar. Para pequenas empresas que querem receber mais sem trabalhar mais.
Personalidade: **Confiável. Simples. Inteligente.**

### Brand Voice
Tom direto, sem jargão financeiro, como um parceiro de negócios que resolve problemas.
- Exemplo 1: "Seu cliente recebe o Pix no WhatsApp. Você recebe o dinheiro na conta."
- Exemplo 2: "Chega de cobrar no boca a boca. Automatize e receba mais."
Banido: "Bem-vindo ao nosso sistema", "Solução completa para sua empresa"

### Wordmark & Logo
Ícone: balão de conversa estilizado com um check (✓) integrado, em verde #10D876 sobre fundo azul petróleo. Wordmark "cobrei" em Sora Bold, todo em minúsculas, com o "i" substituído pelo ícone do check.

### Signature Brand Color
**#10D876** — Verde Cobrei. Inconfundível, associado a confirmação de pagamento e WhatsApp.
