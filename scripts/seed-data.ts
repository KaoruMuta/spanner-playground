import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../src/services/spanner-client';
import { TodoStatus, TodoPriority } from '../src/types';

async function seedData() {
  const database = getDatabase();
  
  try {
    console.log('Starting data seeding...');
    
    const userId1 = uuidv4();
    const userId2 = uuidv4();
    const now = new Date().toISOString();
    
    try {
    await database.insert('users', [
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
        },
      ]);
      
      const categoryId1 = uuidv4();
      const categoryId2 = uuidv4();
      const categoryId3 = uuidv4();
      
      await database.insert('categories', [
        {
          user_id: userId1,
          category_id: categoryId1,
          name: 'Work',
          color: '#3498db',
          created_at: now,
        },
        {
          user_id: userId1,
          category_id: categoryId2,
          name: 'Personal',
          color: '#2ecc71',
          created_at: now,
        },
        {
          user_id: userId2,
          category_id: categoryId3,
          name: 'Shopping',
          color: '#e74c3c',
          created_at: now,
        },
      ]);
      
      const todoId1 = uuidv4();
      const todoId2 = uuidv4();
      const todoId3 = uuidv4();
      
      await database.insert('todos', [
        {
          todo_id: todoId1,
          user_id: userId1,
          category_id: categoryId1,
          title: 'Complete project proposal',
          description: 'Write and submit the Q4 project proposal',
          status: TodoStatus.IN_PROGRESS,
          priority: TodoPriority.HIGH,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: now,
          updated_at: now,
        },
        {
          todo_id: todoId2,
          user_id: userId1,
          category_id: categoryId2,
          title: 'Buy groceries',
          description: 'Milk, eggs, bread, vegetables',
          status: TodoStatus.PENDING,
          priority: TodoPriority.MEDIUM,
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: now,
          updated_at: now,
        },
        {
          todo_id: todoId3,
          user_id: userId2,
          category_id: categoryId3,
          title: 'Order new laptop',
          description: 'Research and order a new work laptop',
          status: TodoStatus.COMPLETED,
          priority: TodoPriority.HIGH,
          created_at: now,
          updated_at: now,
          completed_at: now,
        },
      ]);
      
      const tagId1 = uuidv4();
      const tagId2 = uuidv4();
      const tagId3 = uuidv4();
      
      await database.insert('tags', [
        {
          tag_id: tagId1,
          name: 'urgent',
          created_at: now,
        },
        {
          tag_id: tagId2,
          name: 'important',
          created_at: now,
        },
        {
          tag_id: tagId3,
          name: 'recurring',
          created_at: now,
        },
      ]);
      
      await database.insert('todo_tags', [
        {
          todo_id: todoId1,
          tag_id: tagId1,
          created_at: now,
        },
        {
          todo_id: todoId1,
          tag_id: tagId2,
          created_at: now,
        },
        {
          todo_id: todoId2,
          tag_id: tagId3,
          created_at: now,
        },
      ]);
      
      await database.insert('comments', [
        {
          todo_id: todoId1,
          comment_id: uuidv4(),
          user_id: userId1,
          content: 'Started working on the outline',
          created_at: now,
        },
        {
          todo_id: todoId1,
          comment_id: uuidv4(),
          user_id: userId1,
          content: 'Need to review with the team tomorrow',
          created_at: now,
        },
      ]);
    
    console.log('Data seeding completed successfully!');
    console.log('\nSeeded users:');
    console.log('- john@example.com (john_doe)');
    console.log('- jane@example.com (jane_smith)');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();