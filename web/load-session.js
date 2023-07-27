import sqlite3 from "sqlite3";
import { open } from "sqlite";
export const DB_PATH = `${process.cwd()}/database.sqlite`;

export const loadAllSessions = async () => {
    const db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });

    try {
        const rows = await db.all('SELECT * FROM shopify_sessions');
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await db.close();
    }
};