const sqlite3 = require('sqlite3');
const db = require('quick.db');

const sourceDb = new sqlite3.Database('old.sqlite');

const tableToMigrate = 'JSON';

async function migrateData() {
    try {
        await migrateTable(tableToMigrate);
        console.log('Data migration completed.');
    } catch (error) {
        console.error('Error during data migration:', error);
    } finally {
        sourceDb.close();
    }
}

async function migrateTable(tableName) {
    const rows = await getSourceTableData(tableName);

    for (const row of rows) {
        if (row.ID && row.json) {

            const newId = row.ID;

            try {
                const decodedJson = JSON.parse(JSON.parse(row.json));

                console.log({
                    id: newId,
                    data: decodedJson
                })

                db.set(newId, decodedJson);
            } catch (error) {
                console.error(`Error parsing JSON for ID ${row.ID}:`, error);
            }
        }
    }
}

function getSourceTableData(tableName) {
    return new Promise((resolve, reject) => {
        sourceDb.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

migrateData();
