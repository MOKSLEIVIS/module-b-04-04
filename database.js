const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    max: process.env.DB_MAX,
    connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT_MS,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT_MS,
    allowExitOnIdle: process.env.DB_ALLOW_EXIT_IDLE
});

process.on('exit', () => {
    pool.end();
});

async function getRooms() {
    const client = await pool.connect();

    try {
        const res = await client.query(`SELECT * FROM rooms ORDER BY id ASC`, []);

        return res.rows.length > 0 ? res.rows : null;
    } catch (err) {
        console.log(err);

        return null;
    } finally {
        client.release();
    }
};

async function getRoomReservationsBetweenDates(roomId, checkIn, checkOut) {
    const client = await pool.connect();

    try {
        const res = await client.query(`SELECT id, checkin, checkout FROM reservations WHERE room_id = $1 AND checkin BETWEEN $2 AND $3 OR room_id = $1 AND checkout BETWEEN $2 AND $3`, [roomId, checkIn, checkOut]);

        return res.rows.length > 0 ? res.rows : null;
    } catch (err) {
        console.log(err);

        return null;
    } finally {
        client.release();
    }
};

async function getRoomReservations(roomId) {
    const client = await pool.connect();

    try {
        const res = await client.query(`SELECT id, checkin, checkout FROM reservations WHERE room_id = $1`, [roomId]);

        return res.rows.length > 0 ? res.rows : null;
    } catch (err) {
        console.log(err);

        return null;
    } finally {
        client.release();
    }
};

async function getRoomById(roomId) {
    const client = await pool.connect();

    try {
        const res = await client.query(`SELECT * FROM rooms WHERE id = $1`, [roomId]);

        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (err) {
        console.log(err);

        return null;
    } finally {
        client.release();
    }
};

async function insertReservation(code, name, address, city, zip, country, checkin, checkout, roomId, roomNumber) {
    const client = await pool.connect();

    try {
        const timestamp = new Date().toUTCString();

        const res = await client.query(`INSERT INTO reservations (code, name, address, city, zip, country, checkin, checkout, created_at, room_id, room_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`, [code, name, address, city, zip, country, checkin, checkout, timestamp, roomId, roomNumber]);
    
        const obj = {
            id: res.rows.length > 0 ? res.rows[0].id : null,
            created_at: timestamp
        };

        return obj;
    } catch (err) {
        console.log(err);

        return false;
    } finally {
        client.release();
    }
};

async function getReservations(code, name) {
    const client = await pool.connect();

    try {
        const res = await client.query(`SELECT created_at, id, checkin, checkout, room_id, room_number FROM reservations WHERE code = $1 AND name = $2`, [code, name]);

        return res.rows.length > 0 ? res.rows : null;
    } catch (err) {
        console.log(err);

        return null;
    } finally {
        client.release();
    }
};

async function deleteReservation(id, code, name) {
    const client = await pool.connect();

    try {
        await client.query(`DELETE FROM reservations WHERE id = $1 AND code = $2 AND name = $3`, [id, code, name]);

        return true;
    } catch (err) {
        console.log(err);

        return false;
    } finally {
        client.release();
    }
};

async function getReservationById(id, code, name) {
    const client = await pool.connect();

    try {
        const res = await client.query(`SELECT id, code, name FROM reservations WHERE id = $1 AND code = $2 AND name = $3`, [id, code, name]);

        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (err) {
        console.log(err);

        return null;
    } finally {
        client.release();
    }
};

module.exports = {
    getRooms, getRoomReservations, getRoomById, insertReservation, getReservations, deleteReservation, getReservationById, getRoomReservationsBetweenDates
};