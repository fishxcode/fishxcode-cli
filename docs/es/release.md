# Release y CI

## Validación local

```bash
bun run check
```

## GitHub Actions

- CI: `.github/workflows/ci.yml`
- Release: `.github/workflows/release.yml`

## Publicación npm

1. Configura `NPM_TOKEN` en secrets del repositorio
2. Haz push del tag: `vX.Y.Z`
3. El workflow Release publica automáticamente
