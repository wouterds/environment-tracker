import fs from 'fs';
import path from 'path';
import db from 'services/database';

if (!['staging', 'local'].includes(process.env.MODE || '')) {
  // tslint:disable-next-line
  console.error("Unsafe application mode, don't sync models to database!");
  process.exit(1);
}

for (const file of fs.readdirSync(path.resolve(__dirname, './../models'))) {
  // tslint:disable-next-line
  require(`models/${file}`);
}

(async () => {
  try {
    // tslint:disable-next-line
    await db.sync({ force: true });
    await db.close();
    process.exit(0);
  } catch (e) {
    // tslint:disable-next-line
    console.error(e);
    process.exit(1);
  }
})();
