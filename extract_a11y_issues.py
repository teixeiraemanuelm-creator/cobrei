#!/usr/bin/env python3
import json

with open('lighthouse-a11y-baseline.json', 'r') as f:
    data = json.load(f)

audits = data['audits']
a11y_score = int(data['categories']['accessibility']['score'] * 100)

print("\n" + "=" * 90)
print(f"LIGHTHOUSE ACCESSIBILITY BASELINE - Score: {a11y_score}/100")
print("=" * 90)

# Audits específicos de acessibilidade
a11y_audits = [
    'color-contrast',
    'heading-order',
    'aria-allowed-attr',
    'aria-hidden-body',
    'aria-hidden-focus',
    'aria-required-attr',
    'aria-required-children',
    'aria-required-parent',
    'aria-role',
    'aria-valid-attr-value',
    'aria-valid-attr',
    'button-name',
    'bypass',
    'document-title',
    'duplicate-id-active',
    'duplicate-id-aria',
    'duplicate-id',
    'form-field-multiple-labels',
    'frame-title',
    'html-has-lang',
    'html-lang-valid',
    'image-alt',
    'input-image-alt',
    'input-button-name',
    'label',
    'link-name',
    'list',
    'listitem',
    'meta-refresh',
    'meta-viewport',
    'object-alt',
    'select-name',
    'tabindex',
    'td-headers-attr',
    'th-has-data-cells',
    'valid-aria-role',
]

print(f"\n📋 PROBLEMAS DE ACESSIBILIDADE:\n")

issues_found = 0
for audit_id in a11y_audits:
    if audit_id in audits:
        audit = audits[audit_id]
        score = audit.get('score')
        
        if score is not None and score < 1:
            issues_found += 1
            title = audit.get('title', audit_id)
            description = audit.get('description', '')
            
            print(f"\n{'🔴' if score == 0 else '⚠️ '} {title}")
            print(f"   Score: {int(score * 100)}/100")
            
            if audit.get('details') and 'items' in audit['details']:
                items = audit['details']['items']
                print(f"   Occurrences: {len(items)}")
                
                for i, item in enumerate(items[:2]):
                    if isinstance(item, dict):
                        snippet = item.get('node', {}).get('snippet', 'N/A')
                        if snippet != 'N/A':
                            print(f"     [{i+1}] {snippet[:70]}...")

if issues_found == 0:
    print("✅ Nenhum problema de acessibilidade encontrado!")
else:
    print(f"\n\n{'=' * 90}")
    print(f"Total de problemas: {issues_found}")
    print(f"Score atual: {a11y_score}/100")
    print(f"Meta: 98+/100")
    print(f"Diferença: {98 - a11y_score} pontos")

print("=" * 90 + "\n")
