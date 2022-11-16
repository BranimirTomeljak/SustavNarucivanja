const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'medicina',
    password: 'postgres',
    port: 5432,
});

dangerous_query = (text, params) => {
    const start = Date.now();
    return pool.query(text, params)
        .then(res => {
            const duration = Date.now() - start;
            //console.log('executed query', {text, params, duration, rows: res.rows});
            return res;
        });
}

async function query(text, params, throwerr=False){
    try {
        const result = await dangerous_query(text, params);
        return result.rows;
    } catch (err) {
        console.error("Error while querying the database:")
        console.log(err);
        if (throwerr)
            throw err
    }
}

module.exports = {
    query: query,
    dangerous_query: dangerous_query,
    pool: pool
}
