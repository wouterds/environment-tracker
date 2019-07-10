import fs from 'fs';
import db from 'infrastructure/database/service';
import path from 'path';

if (!['staging', 'local'].includes(process.env.MODE || '')) {
  // tslint:disable-next-line
  console.error("Unsafe application mode, don't sync models to database!");
  process.exit(1);
}

const importModels = (location: string) => {
  const resolvedLocation = path.resolve(__dirname, location);

  for (const file of fs.readdirSync(resolvedLocation)) {
    const resolvedFileLocation = path.resolve(resolvedLocation, file);
    const stat = fs.lstatSync(resolvedFileLocation);

    // Go inside directory and repeat
    if (stat.isDirectory()) {
      importModels(resolvedFileLocation);
      continue;
    }

    // Not a model, skip
    if (file.indexOf('model.ts') === -1) {
      continue;
    }

    // Load model
    require(resolvedFileLocation);
  }
};

// Find & import models in application
importModels('./../../application');

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
