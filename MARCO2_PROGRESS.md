# MARCO 2 - ACESSIBILIDADE WCAG 2.2 AA - PROGRESSO

## Status: EM ANDAMENTO

**Baseline Lighthouse:** 93/100  
**Meta:** 98+/100  
**Diferença:** 5 pontos

## Problemas Identificados

1. **Contraste de Cores (7 ocorrências)** - WCAG AA
2. **Ordem de Headings** - H4 sem H2/H3 antes

## Alterações Implementadas

### ✅ Navbar.tsx
- Adicionado `role="banner"` e `aria-label="Site header"`
- Adicionado `role="navigation"` e `aria-label` em nav
- Adicionado `aria-label` em todos os botões
- Adicionado `focus-visible:outline-2` em todos os botões
- Adicionado `aria-expanded` e `aria-controls` no menu mobile
- Adicionado `aria-hidden="true"` em elementos decorativos
- Adicionado keyboard navigation (Enter/Space)

### ✅ Home.tsx
- Adicionado `role="main"` em <main>
- Adicionado `aria-labelledby` em todas as <section>
- Adicionado `id` nas seções para referência
- Estrutura semântica completa com landmarks

## Próximas Alterações

### HeroSection.tsx
- [ ] Adicionar `aria-labelledby="hero-title"` na section
- [ ] Adicionar `id="hero-title"` no h1
- [ ] Adicionar `aria-label` nos botões CTA
- [ ] Adicionar `focus-visible` nos botões
- [ ] Revisar contraste de cores

### SocialProofSection.tsx
- [ ] Adicionar `aria-labelledby="social-proof-title"`
- [ ] Adicionar `id="social-proof-title"` no h2
- [ ] Adicionar `role="region"` se necessário
- [ ] Revisar contraste de cores

### HowItWorksSection.tsx
- [ ] Adicionar `aria-labelledby="how-it-works-title"`
- [ ] Adicionar `id="how-it-works-title"` no h2
- [ ] Adicionar `aria-label` nos números/ícones
- [ ] Revisar ordem de headings

### BenefitsSection.tsx
- [ ] Adicionar `aria-labelledby="benefits-title"`
- [ ] Adicionar `id="benefits-title"` no h2
- [ ] Adicionar `aria-label` nos cards
- [ ] Revisar contraste de cores

### DashboardSection.tsx
- [ ] Adicionar `aria-labelledby="dashboard-title"`
- [ ] Adicionar `id="dashboard-title"` no h2
- [ ] Adicionar `aria-label` nos elementos interativos
- [ ] Revisar contraste de cores

### PricingSection.tsx
- [ ] Adicionar `aria-labelledby="pricing-title"`
- [ ] Adicionar `id="pricing-title"` no h2
- [ ] Adicionar `aria-label` nos botões de plano
- [ ] Adicionar `aria-current="page"` no plano destacado
- [ ] Revisar contraste de cores

### CtaSection.tsx
- [ ] Adicionar `aria-labelledby="cta-title"`
- [ ] Adicionar `id="cta-title"` no h2
- [ ] Adicionar `role="contentinfo"` no footer
- [ ] Adicionar `aria-label` em links do footer
- [ ] Revisar contraste de cores

## Arquivos Modificados

1. ✅ `client/src/components/Navbar.tsx`
2. ✅ `client/src/pages/Home.tsx`
3. ⏳ `client/src/components/sections/HeroSection.tsx`
4. ⏳ `client/src/components/sections/SocialProofSection.tsx`
5. ⏳ `client/src/components/sections/HowItWorksSection.tsx`
6. ⏳ `client/src/components/sections/BenefitsSection.tsx`
7. ⏳ `client/src/components/sections/DashboardSection.tsx`
8. ⏳ `client/src/components/sections/PricingSection.tsx`
9. ⏳ `client/src/components/sections/CtaSection.tsx`

## Validações Pendentes

- [ ] Teste de contraste com WebAIM
- [ ] Teste de navegação por teclado
- [ ] Teste com screen reader (NVDA/JAWS)
- [ ] Lighthouse Accessibility final
- [ ] Zero regressões visuais
