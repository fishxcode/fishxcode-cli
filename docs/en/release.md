# Release & CI

## Local Check

```bash
bun run check
```

## GitHub Actions

- CI: `.github/workflows/ci.yml`
- Release: `.github/workflows/release.yml`

## npm Publish

1. Configure `NPM_TOKEN` in repository secrets
2. Push tag: `vX.Y.Z`
3. Release workflow publishes automatically
