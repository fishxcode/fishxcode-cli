# Release & CI

## Vérification locale

```bash
bun run check
```

## GitHub Actions

- CI : `.github/workflows/ci.yml`
- Release : `.github/workflows/release.yml`

## Publication npm

1. Configurer `NPM_TOKEN` dans les secrets du dépôt
2. Pousser un tag : `vX.Y.Z`
3. Le workflow Release publie automatiquement
