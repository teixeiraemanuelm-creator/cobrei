#!/usr/bin/env python3
import json

with open('lighthouse-report.json', 'r') as f:
    data = json.load(f)

scores = data['categories']
audits = data['audits']

print("=" * 60)
print("LIGHTHOUSE AUDIT RESULTS")
print("=" * 60)
print(f"\nPerformance:     {scores['performance']['score']*100:.0f}/100")
print(f"Accessibility:   {scores['accessibility']['score']*100:.0f}/100")
print(f"Best Practices:  {scores['best-practices']['score']*100:.0f}/100")
print(f"SEO:             {scores['seo']['score']*100:.0f}/100")

print("\n" + "=" * 60)
print("CORE WEB VITALS & METRICS")
print("=" * 60)

metrics = {
    'first-contentful-paint': 'First Contentful Paint (FCP)',
    'largest-contentful-paint': 'Largest Contentful Paint (LCP)',
    'cumulative-layout-shift': 'Cumulative Layout Shift (CLS)',
    'interaction-to-next-paint': 'Interaction to Next Paint (INP)',
    'speed-index': 'Speed Index',
    'total-blocking-time': 'Total Blocking Time (TBT)',
}

for metric_key, metric_name in metrics.items():
    if metric_key in audits:
        audit = audits[metric_key]
        if 'displayValue' in audit:
            print(f"\n{metric_name}:")
            print(f"  Value: {audit['displayValue']}")
            print(f"  Score: {audit.get('score', 'N/A')}")

print("\n" + "=" * 60)
print("FAILED AUDITS (Priority Issues)")
print("=" * 60)

failed_audits = [
    (k, v) for k, v in audits.items() 
    if v.get('score') is not None and v['score'] < 0.5 and 'details' in v
]

for audit_key, audit in sorted(failed_audits, key=lambda x: x[1].get('score', 1)):
    print(f"\n❌ {audit['title']}")
    print(f"   Score: {audit['score']}")
    if 'description' in audit:
        print(f"   Description: {audit['description'][:100]}...")

print("\n" + "=" * 60)
