import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../src/services/spanner-client';

async function simpleSeeding() {
  console.log('Creating users...');
  const database = getDatabase();
  
  const userId1 = uuidv4();
  const userId2 = uuidv4();
  const now = new Date().toISOString();
  
  try {
    const table = database.table('users');
    await table.insert([
      {
        user_id: userId1,
        email: 'john@example.com',
        username: 'john_doe',
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userId2,
        email: 'jane@example.com',
        username: 'jane_smith',
        created_at: now,
        updated_at: now,
      }
    ]);
    
    console.log('Users created successfully!');
    console.log('- john@example.com (john_doe)');
    console.log('- jane@example.com (jane_smith)');
    
  } catch (error) {
    console.error('Error creating users:', error);
  }
}

simpleSeeding();