Write-Host "Setting up environment variables..." -ForegroundColor Green
$env:PRISMA_CLIENT_ENGINE_TYPE = "binary"
$env:PRISMA_CLI_QUERY_ENGINE_TYPE = "binary"

Write-Host "Generating Prisma client..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "✅ Prisma client generated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma client: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Running database migrations..." -ForegroundColor Yellow
try {
    npx prisma migrate dev --name init
    Write-Host "✅ Database migrations completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to run migrations: $_" -ForegroundColor Red
    Write-Host "Trying to deploy migrations instead..." -ForegroundColor Yellow
    try {
        npx prisma migrate deploy
        Write-Host "✅ Database migrations deployed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to deploy migrations: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Seeding database..." -ForegroundColor Yellow
try {
    npx prisma db seed
    Write-Host "✅ Database seeded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to seed database with prisma db seed, trying ts-node..." -ForegroundColor Yellow
    try {
        npx ts-node prisma/seed.ts
        Write-Host "✅ Database seeded successfully with ts-node" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to seed database: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
Write-Host "You can now start the production server with: npm run server:dev" -ForegroundColor Cyan
