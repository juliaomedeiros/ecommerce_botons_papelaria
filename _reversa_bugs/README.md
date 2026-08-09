# Registro de Bugs (Reversa Bugs)

> Gerado pelo Reversa em 2026-08-09. Este arquivo é o contrato do registro de bugs deste projeto.
> Source of truth: cada `<contexto>/bugs/<ID>/bug.md`. Tudo em `generated/` é projeção regenerável.

## Configuração do projeto

```yaml
closure_policy: local-software   # local-software | package | production-service
control_mode: gated                  # supervised | gated | autonomous
```

- `closure_policy` define o que "resolvido" exige:
  - `local-software`: testes de regressão passando + veredito de spec
- `control_mode: gated` (padrão): leitura, reprodução isolada e diagnóstico fluem sem aprovação.

## Estrutura

Os bugs são agrupados por **contexto** (feature, módulo ou caso de uso). Cada contexto é uma pasta agregadora com TUDO daquela área.

```text
_reversa_bugs/
├── README.md                    este contrato
├── taxonomy.yaml                vocabulário controlado de area/module/feature
└── catalogo-e-categorias/
    ├── bugs/BUG-20260809-C4T1-dropdown-categorias-admin/
    ├── intake/
    └── generated/
```

## Regra de rastreabilidade

Todo bug DEVE identificar a spec correspondente ou marcar `spec-gap`, além de mapear os arquivos de código afetados.

## Protocolo dos agentes

1. Registrar (`/reversa-debugger`) NUNCA corrige. Corrigir (`/reversa-debugger-fix`) segue dois gates de aprovação com diff.
