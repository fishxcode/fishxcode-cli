# Release e CI

## Verificação local

```bash
bun run check
```

## GitHub Actions

- CI: `.github/workflows/ci.yml`
- Release: `.github/workflows/release.yml`

## Publicação npm

1. Configure `NPM_TOKEN` nos secrets do repositório
2. Faça push da tag: `vX.Y.Z`
3. O workflow Release publica automaticamente
