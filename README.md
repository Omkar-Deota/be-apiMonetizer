# ChallengeX 🛡️

## Development

We use `node` version `18.19.0`

```
nvm install 18.19.0
```

```
nvm use 18.19.0
```

The first time, you will need to run

```
npm install
```

Then just start the server with

```
npm run start
```


## Database Migration

We use `typeorm` for managing database operations and migrations

 - To generate the migration details
```
npm run typeorm migration:generate -- -d src/database/data-source.ts src/database/migrations/MigrationName
```

 - To execute the above generated migration
 ```
 npm run migration:run
 ```

  - To revert the last executed migration
  ```
  npm run migration:revert
  ```

  Note: Before executing above commands, update below configuration in `package.json` file to be able to run in local. To CI there is no changes required
  ```
  "typeorm": "ts-node -r dotenv/config ./node_modules/typeorm/cli.js"
  ```
