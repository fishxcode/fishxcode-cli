# 发布与 CI

## 本地校验

```bash
bun run check
```

## GitHub Actions

- CI: `.github/workflows/ci.yml`
- Release: `.github/workflows/release.yml`

## npm 发布

1. 仓库 Secrets 配置 `NPM_TOKEN`
2. 推送 tag：`vX.Y.Z`
3. Release workflow 自动执行发布
