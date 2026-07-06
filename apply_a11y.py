#!/usr/bin/env python3
"""
Script para aplicar melhorias de acessibilidade WCAG 2.2 AA em todas as seções
Adiciona: aria-labels, focus-visible, aria-hidden, landmarks, etc.
"""

import re
import os

sections_config = {
    "HowItWorksSection": {
        "title_id": "how-it-works-title",
        "title": "Como Funciona",
    },
    "BenefitsSection": {
        "title_id": "benefits-title",
        "title": "Benefícios",
    },
    "DashboardSection": {
        "title_id": "dashboard-title",
        "title": "Dashboard",
    },
    "PricingSection": {
        "title_id": "pricing-title",
        "title": "Planos e Preços",
    },
    "CtaSection": {
        "title_id": "cta-title",
        "title": "Chamada para Ação",
    },
}

def apply_a11y_to_section(filename, title_id, title):
    """Aplica melhorias de acessibilidade a um arquivo de seção"""
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Adicionar aria-labelledby à section
    if '<section' in content and 'aria-labelledby' not in content:
        content = re.sub(
            r'(<section[^>]*?)(\s*>)',
            r'\1\n      aria-labelledby="' + title_id + r'"\2',
            content,
            count=1
        )
    
    # 2. Adicionar h2 com id se não existir
    if '<h2' not in content and '<h1' not in content:
        # Adicionar h2 logo após a section
        content = re.sub(
            r'(<section[^>]*>.*?<div className="container[^>]*>)',
            r'\1\n        {/* Heading */}\n        <h2\n          id="' + title_id + r'"\n          className="sr-only"\n        >\n          ' + title + r'\n        </h2>',
            content,
            flags=re.DOTALL,
            count=1
        )
    else:
        # Se h2 existe, adicionar id
        content = re.sub(
            r'<h2([^>]*)>',
            r'<h2\1 id="' + title_id + r'">',
            content,
            count=1
        )
    
    # 3. Adicionar focus-visible a todos os buttons
    content = re.sub(
        r'(<button[^>]*className="[^"]*)"([^>]*)>',
        lambda m: m.group(1) + ' focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10D876]"' + m.group(2) + '>',
        content
    )
    
    # 4. Adicionar aria-hidden a elementos decorativos (divs com apenas background/opacity)
    content = re.sub(
        r'(<div[^>]*?style=\{[^}]*?(background|opacity|blur)[^}]*?\}[^>]*?)(\s*>)',
        lambda m: m.group(1) + '\n        aria-hidden="true"' + m.group(3) if 'aria-hidden' not in m.group(1) else m.group(0),
        content
    )
    
    # 5. Adicionar aria-label a buttons sem texto descritivo
    # (buttons com apenas ícones)
    content = re.sub(
        r'<button([^>]*?)>\s*<[^>]*?size=\d+[^>]*?\/>\s*</button>',
        lambda m: '<button' + m.group(1) + ' aria-label="Button">' + m.group(0)[7:-9] + '</button>',
        content
    )
    
    # 6. Adicionar aria-hidden a ícones decorativos
    content = re.sub(
        r'(<(?:CheckCircle|Play|ArrowRight|Plus|Minus|ChevronDown)[^>]*?)(\s*/>)',
        lambda m: m.group(1) + ' aria-hidden="true"' + m.group(2) if 'aria-hidden' not in m.group(1) else m.group(0),
        content
    )
    
    if content != original_content:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ {os.path.basename(filename)} - Acessibilidade aplicada")
        return True
    else:
        print(f"⏭️  {os.path.basename(filename)} - Sem alterações necessárias")
        return False

def main():
    base_path = "client/src/components/sections"
    
    print("\n" + "=" * 70)
    print("APLICANDO ACESSIBILIDADE WCAG 2.2 AA A TODAS AS SEÇÕES")
    print("=" * 70 + "\n")
    
    modified_count = 0
    
    for section_name, config in sections_config.items():
        filename = os.path.join(base_path, f"{section_name}.tsx")
        
        if os.path.exists(filename):
            if apply_a11y_to_section(filename, config["title_id"], config["title"]):
                modified_count += 1
        else:
            print(f"❌ {filename} - Arquivo não encontrado")
    
    print("\n" + "=" * 70)
    print(f"Total de arquivos modificados: {modified_count}")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    main()
