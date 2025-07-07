import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkey',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate essential environment variables
if (!config.databaseUrl) {
  console.error('FATAL ERROR: DATABASE_URL is not defined.');
  process.exit(1);
}

if (!config.jwtSecret) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

if (!config.jwtRefreshSecret) {
  console.error('FATAL ERROR: JWT_REFRESH_SECRET is not defined.');
  process.exit(1);
}