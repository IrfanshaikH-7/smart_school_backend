const { execSync } = require('child_process');
const path = require('path');

const prismaSchemaPath = path.join(__dirname, '../src/prisma/schema.prisma');

try {
  console.log('Resetting database and applying migrations...');
  // Use prisma migrate reset to drop the database, create it, and apply all migrations
  execSync(`npx prisma migrate reset --force --schema=${prismaSchemaPath}`, { stdio: 'inherit' });
  console.log('Database reset and migrations applied successfully.');

  console.log('Running Prisma seed...');
  // Run the seed script after reset
  execSync(`npx prisma db seed --schema=${prismaSchemaPath}`, { stdio: 'inherit' });
  console.log('Prisma seed completed successfully.');

} catch (error) {
  console.error('Error during database reset or seeding:', error.message);
  process.exit(1);
}