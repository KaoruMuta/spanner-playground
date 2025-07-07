import { Spanner } from '@google-cloud/spanner';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const projectId = process.env.SPANNER_PROJECT_ID || 'test-project';
const instanceId = process.env.SPANNER_INSTANCE_ID || 'test-instance';
const databaseId = process.env.SPANNER_DATABASE_ID || 'todo-db';

async function setupDatabase() {
  const spanner = new Spanner({
    projectId,
    apiEndpoint: process.env.SPANNER_EMULATOR_HOST,
  });

  try {
    console.log('Creating Spanner instance...');
    const instance = spanner.instance(instanceId);
    
    const [instanceExists] = await instance.exists();
    if (!instanceExists) {
      const [, operation] = await spanner.createInstance(instanceId, {
        config: 'emulator-config',
        nodes: 1,
        displayName: 'Test Instance',
      });
      await operation.promise();
      console.log(`Instance ${instanceId} created.`);
    } else {
      console.log(`Instance ${instanceId} already exists.`);
    }

    console.log('Creating database...');
    const database = instance.database(databaseId);
    const [databaseExists] = await database.exists();
    
    if (databaseExists) {
      console.log(`Database ${databaseId} already exists. Dropping...`);
      await database.delete();
    }

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    const [, createOperation] = await instance.createDatabase(databaseId, {
      schema: statements,
    });
    
    await createOperation.promise();
    console.log(`Database ${databaseId} created with schema.`);

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();