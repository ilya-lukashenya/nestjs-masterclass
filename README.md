
```bash
docker compose --project-name nest-masterclass -f ./infrastructure/docker/docker-compose.postgres.yml up -d
```

```bash
npm run test:e2e -- users.post
```

The project was made according to the course: https://coursehunter.net/course/master-klass-po-nestjs-polnoe-rukovodstvo-po-bekendu-na-nodejs