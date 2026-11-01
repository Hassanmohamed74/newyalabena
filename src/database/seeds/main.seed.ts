import { DataSource } from 'typeorm'
import { dataSourceOptions } from '../data-source';
import { seedComprehensive } from './comprehensive.seed';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

async function runSeeds() {
  const pgOptions = dataSourceOptions as PostgresConnectionOptions;

  console.log('--- DB Connection Check ---');
  console.log('Host:', pgOptions.host);
  console.log('Port:', pgOptions.port);
  console.log('Database:', pgOptions.database);
  console.log('User:', pgOptions.username);
  console.log('---------------------------');

  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();
  console.log('Database connected. Running comprehensive seed...');

  await seedComprehensive(dataSource);

  console.log('All seeds completed successfully.');
  await dataSource.destroy();
}

runSeeds().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});