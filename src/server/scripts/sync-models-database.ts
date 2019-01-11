import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import db from '../services/database';

config();

if (process.env.MODE === 'production') {
  /* tslint:disable */
  console.error("Production mode, don't sync models to database!");
  /* tslint:enable */

  process.exit();
}

for (const file of readdirSync(resolve(__dirname, '../models'))) {
  const path = resolve(__dirname, `../models/${file}`);

  /* tslint:disable */
  require(path);
  /* tslint:enable */
}

(async () => {
  await db.sync({
    alter: true,
  });

  db.close();

  process.exit();
})();
