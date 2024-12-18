
```bash
docker compose --project-name nest-masterclass -f ./infrastructure/docker/docker-compose.postgres.yml up -d
```

```bash
npm run test:e2e -- users.post
```