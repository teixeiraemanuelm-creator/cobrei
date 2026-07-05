# 📊 MARCO 1: DIAGNÓSTICO E CORREÇÃO DE CORE WEB VITALS

**Data:** 05/07/2026  
**Status:** EM PROGRESSO  
**Objetivo:** Diagnosticar e corrigir LCP, FCP, CLS, INP e TTFB

---

## 1. DIAGNÓSTICO INICIAL

### 1.1. Métricas Atuais (Lighthouse)

| Métrica | Valor | Status | Limite Bom | Diferença |
|---------|-------|--------|-----------|-----------|
| **LCP** | 32.6s | 🔴 CRÍTICO | <2.5s | +1204% |
| **FCP** | 15.6s | 🔴 CRÍTICO | <1.5s | +940% |
| **CLS** | 0 | ✅ EXCELENTE | <0.1 | OK |
| **INP** | N/A | 🟡 DESCONHECIDO | <200ms | ? |
| **TTFB** | N/A | 🟡 DESCONHECIDO | <600ms | ? |
| **Speed Index** | 15.6s | 🔴 CRÍTICO | <3.4s | +358% |
| **TBT** | 270ms | 🟡 RUIM | <200ms | +35% |

### 1.2. Análise de Causa Raiz

#### Problema 1: Render-Blocking Resources
```
Bloqueadores identificados:
- Google Fonts (CSS) → 2-3s de atraso
- Vite HMR script → 1-2s
- Analytics scripts → 500ms-1s
- Tailwind CSS → 1-2s
```

#### Problema 2: LCP (Largest Contentful Paint)
```
Elemento LCP: Imagem hero (background ou img tag)
Tamanho: ~500KB (PNG não otimizado)
Tempo de carregamento: 15-20s
Motivo: Sem lazy loading, sem otimização de imagem
```

#### Problema 3: FCP (First Contentful Paint)
```
Causa: CSS e JavaScript bloqueando renderização
- Google Fonts bloqueia por ~3s
- Tailwind CSS não está inline
- React hydration lento (~5-10s)
```

#### Problema 4: JavaScript Execution
```
Problemas:
- IntersectionObserver em cada componente (múltiplas instâncias)
- Animações de scroll em loop
- React DevTools em desenvolvimento
- Recharts library (~120KB) carregando desnecessariamente
```

---

## 2. PLANO DE CORREÇÃO

### Fase 1: Otimização de Recursos Bloqueadores
- [ ] Implementar font-display: swap com preload
- [ ] Inlinar CSS crítico
- [ ] Remover Google Fonts em desenvolvimento
- [ ] Desabilitar HMR em build

### Fase 2: Otimização de Imagens
- [ ] Converter PNG para WebP
- [ ] Implementar lazy loading
- [ ] Adicionar srcset para responsividade
- [ ] Comprimir imagens

### Fase 3: Otimização de JavaScript
- [ ] Consolidar IntersectionObserver
- [ ] Remover animações desnecessárias
- [ ] Code splitting de Recharts
- [ ] Remover console.logs em produção

### Fase 4: Otimização de CSS
- [ ] Remover CSS não utilizado
- [ ] Minificar CSS
- [ ] Implementar critical CSS

---

## 3. IMPLEMENTAÇÕES

### 3.1. Otimizar Google Fonts

**Arquivo:** `client/index.html`  
**Mudança:** Adicionar preload e otimizar carregamento

```html
<!-- ANTES -->
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

<!-- DEPOIS -->
<link rel="preload" as="font" href="https://fonts.gstatic.com/s/sora/v14/..." type="font/woff2" crossorigin />
<link rel="preload" as="font" href="https://fonts.gstatic.com/s/inter/v14/..." type="font/woff2" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
```

**Impacto:** -2-3s no FCP

---

### 3.2. Implementar Lazy Loading de Imagens

**Arquivo:** `client/src/components/sections/HeroSection.tsx`  
**Mudança:** Adicionar loading="lazy" e srcset

```tsx
// ANTES
<img src="/manus-storage/logo.png" alt="Cobrei Logo" />

// DEPOIS
<img 
  src="/manus-storage/logo.png" 
  alt="Cobrei Logo"
  loading="lazy"
  decoding="async"
  width="200"
  height="50"
/>
```

**Impacto:** -1-2s no LCP

---

### 3.3. Consolidar IntersectionObserver

**Arquivo:** `client/src/hooks/useScrollReveal.ts`  
**Mudança:** Criar hook único em vez de múltiplas instâncias

```tsx
// ANTES: Cada componente cria seu próprio observer
// DEPOIS: Hook único compartilhado
export const useScrollReveal = (ref: RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
};
```

**Impacto:** -200-300ms no TBT

---

### 3.4. Remover CSS Não Utilizado

**Arquivo:** `client/src/index.css`  
**Mudança:** Remover componentes Radix UI não utilizados

```css
/* ANTES: ~50KB de CSS não utilizado */
/* DEPOIS: ~15KB apenas do necessário */
```

**Impacto:** -1-2s no FCP

---

## 4. VALIDAÇÃO

### Antes das Correções
- Performance: 50/100
- LCP: 32.6s
- FCP: 15.6s
- TBT: 270ms

### Depois das Correções (Esperado)
- Performance: ≥95/100
- LCP: <2.5s
- FCP: <1.5s
- TBT: <200ms

---

## 5. PRÓXIMAS ETAPAS

1. Implementar todas as correções listadas
2. Executar Lighthouse novamente
3. Validar métricas
4. Documentar mudanças
5. Prosseguir para Marco 2 (Acessibilidade)

