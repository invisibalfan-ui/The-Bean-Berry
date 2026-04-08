// Temporary patch script - safe to delete after running
const fs = require('fs');
const path = require('path');
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (!pkg.scripts['seed:admin']) {
  pkg.scripts['seed:admin'] = 'node scripts/seed-admin.js';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log('package.json updated successfully.');
} else {
  console.log('seed:admin already present, no changes made.');
}
