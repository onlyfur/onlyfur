const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set Prisma engine type for 32-bit Node
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary';
process.env.PRISMA_CLI_QUERY_ENGINE_TYPE = 'binary';

console.log('🚀 Starting OnlyFur Production Server Setup...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please create one with your database configuration.');
  process.exit(1);
}

try {
  // Step 1: Install dependencies if needed
  console.log('📦 Checking dependencies...');
  if (!fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Step 2: Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Step 3: Run database migrations
  console.log('🗄️  Running database migrations...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Migration failed, trying to create and migrate...');
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  }

  // Step 4: Seed the database
  console.log('🌱 Seeding database...');
  try {
    execSync('npx prisma db seed', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Seeding failed, running custom seed...');
    execSync('npx ts-node prisma/seed.ts', { stdio: 'inherit' });
  }

  // Step 5: Build the application
  console.log('🏗️  Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ Setup completed successfully!');
  console.log('\n🎯 You can now:');
  console.log('   • Start the production server: npm run server:prod');
  console.log('   • Start development server: npm run server:dev');
  console.log('   • View database: npm run prisma:studio');
  console.log('\n📝 Default credentials:');
  console.log('   • Admin: admin@onlyfur.com / admin123');
  console.log('   • Test User: test@example.com / password123');
  console.log('   • Test Creator: creator@example.com / password123');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('   • Make sure PostgreSQL is running');
  console.log('   • Check your DATABASE_URL in .env');
  console.log('   • Ensure you have the required permissions');
  process.exit(1);
}
