import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

function requireEnvVariable(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Environment variable ${name} is not set or empty.`);
  }
  return value;
}

export const APP_BASE_URL = requireEnvVariable('APP_BASE_URL');
export const APP_API_URL = requireEnvVariable('APP_API_URL');
