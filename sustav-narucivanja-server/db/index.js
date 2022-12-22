const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'medicina',
    password: 'postgres',
    port: 5432,
});

dangerous_query = async (text, params) => {
    return await pool.query(text, params)
        .then(res => {
            return res;
        });
}

async function query(text, params, throwerr=false){
    try {
        console.log(text)
        const result = await dangerous_query(text, params);
        //console.log(result.rows)
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
