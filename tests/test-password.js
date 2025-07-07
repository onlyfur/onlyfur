const crypto = require('crypto');

// Load environment variables
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    
    envFile.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=');
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.warn('Warning: Could not load .env file:', error.message);
  }
}

loadEnvFile();

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

class PasswordHasher {
  static async hash(password) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(32).toString('hex');
      crypto.pbkdf2(password, salt, BCRYPT_ROUNDS * 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        else resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }
  
  static async compare(password, hash) {
    return new Promise((resolve, reject) => {
      if (!hash || !hash.includes(':')) {
        resolve(false);
        return;
      }
      
      const [salt, key] = hash.split(':');
      crypto.pbkdf2(password, salt, BCRYPT_ROUNDS * 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        else resolve(key === derivedKey.toString('hex'));
      });
    });
  }
}

async function testPassword() {
  console.log('Testing password hashing...');
  console.log('Admin password from env: [REDACTED FOR SECURITY]');
  console.log('BCrypt rounds:', BCRYPT_ROUNDS);
  
  // Test hashing and comparison
  const hash = await PasswordHasher.hash(ADMIN_PASSWORD);
  console.log('Generated hash:', hash);
  
  const isValid = await PasswordHasher.compare(ADMIN_PASSWORD, hash);
  console.log('Password verification test:', isValid);
  
  // Test with database
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  await client.connect();
  
  const result = await client.query('SELECT password FROM users WHERE email = $1', ['kenoschreibt@gmail.com']);
  const dbHash = result.rows[0]?.password;
  
  console.log('Database hash exists:', !!dbHash);
  console.log('Database hash preview:', dbHash ? dbHash.substring(0, 20) + '...' : 'none');
  
  if (dbHash) {
    const dbValid = await PasswordHasher.compare(ADMIN_PASSWORD, dbHash);
    console.log('Database password verification:', dbValid);
  }
  
  await client.end();
}

testPassword().catch(console.error);
