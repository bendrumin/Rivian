const { Client } = require('pg');
const fs = require('fs');

async function runMigration() {
  const client = new Client({
    connectionString: "postgresql://postgres:Bes91385!11@db.npyovadmjolgxlayhsnc.supabase.co:5432/postgres"
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read the migration file
    const migrationSQL = fs.readFileSync('./supabase/migrations/20240101000000_initial_schema.sql', 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    console.log('✅ Database schema created successfully!');
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('📊 Created tables:', result.rows.map(row => row.table_name));
    
    await client.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await client.end();
  }
}

runMigration();
