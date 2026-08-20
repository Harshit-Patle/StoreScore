const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('./db');

async function seed() {
    console.log('🌱 Starting StoreScore database migration & seed...');

    try {
        // 1. Run Schema DDL
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);
        console.log('✅ Schema tables and indexes verified.');

        const passwordHash = await bcrypt.hash('DemoPassword123!', 10);

        // 2. Seed Admin User
        const adminRes = await pool.query(
            `INSERT INTO users (name, email, password_hash, address, role)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO UPDATE SET password_hash = $3, role = $5
             RETURNING id, email, role`,
            [
                'System Administrator Full Account',
                'admin@storescore.com',
                passwordHash,
                '100 Administrative Plaza, Headquarters District, NY 10001',
                'ADMIN'
            ]
        );
        console.log('✅ Admin account seeded:', adminRes.rows[0].email);

        // 3. Seed Store Owner User
        const ownerRes = await pool.query(
            `INSERT INTO users (name, email, password_hash, address, role)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO UPDATE SET password_hash = $3, role = $5
             RETURNING id, email, role`,
            [
                'Enterprise Store Owner Partner',
                'owner@storescore.com',
                passwordHash,
                '200 Commercial Boulevard, Suite 400, San Francisco, CA 94105',
                'STORE_OWNER'
            ]
        );
        const ownerId = ownerRes.rows[0].id;
        console.log('✅ Store Owner account seeded:', ownerRes.rows[0].email);

        // 4. Seed Normal User
        const userRes = await pool.query(
            `INSERT INTO users (name, email, password_hash, address, role)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO UPDATE SET password_hash = $3, role = $5
             RETURNING id, email, role`,
            [
                'Verified Platform Consumer User',
                'user@storescore.com',
                passwordHash,
                '300 Residential Avenue, Apartment 12B, Austin, TX 78701',
                'USER'
            ]
        );
        const userId = userRes.rows[0].id;
        console.log('✅ Normal User account seeded:', userRes.rows[0].email);

        // 5. Seed Sample Stores for Owner
        const storeRes = await pool.query(
            `SELECT id FROM stores WHERE owner_id = $1 LIMIT 1`,
            [ownerId]
        );

        let storeId;
        if (storeRes.rows.length === 0) {
            const newStore = await pool.query(
                `INSERT INTO stores (name, email, address, owner_id)
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                [
                    'Apex Electronics & Tech Emporium',
                    'contact@apexelectronics.com',
                    '500 Technology Drive, Silicon Valley, CA 94025',
                    ownerId
                ]
            );
            storeId = newStore.rows[0].id;
            console.log('✅ Sample store created: Apex Electronics & Tech Emporium');
        } else {
            storeId = storeRes.rows[0].id;
            console.log('ℹ️ Store already exists for owner, skipping creation.');
        }

        // 6. Seed Sample Rating
        if (storeId && userId) {
            await pool.query(
                `INSERT INTO ratings (user_id, store_id, rating)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (user_id, store_id) DO UPDATE SET rating = $3`,
                [userId, storeId, 5]
            );
            console.log('✅ Sample 5-star rating recorded.');
        }

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('───────────────────────────────────────────────────────');
        console.log('Demo Credentials:');
        console.log('• Admin:  admin@storescore.com | DemoPassword123!');
        console.log('• Owner:  owner@storescore.com | DemoPassword123!');
        console.log('• User:   user@storescore.com  | DemoPassword123!');
        console.log('───────────────────────────────────────────────────────');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        await pool.end();
    }
}

seed();
