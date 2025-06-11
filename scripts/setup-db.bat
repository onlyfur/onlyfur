@echo off
echo Setting up environment variables...
set PRISMA_CLIENT_ENGINE_TYPE=binary
set PRISMA_CLI_QUERY_ENGINE_TYPE=binary

echo Generating Prisma client...
call npx prisma generate

echo Running database migrations...
call npx prisma migrate dev --name init

echo Seeding database...
call npx prisma db seed

echo Done!
