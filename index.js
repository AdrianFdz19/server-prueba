import express from 'express';
const app = express();
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
const {Pool} = pkg;
const PORT = process.env.PORT || 3005;

dotenv.config();

app.use(express.json());
app.use(cors());

//Conexion a la base de datos
const isDevServer = false;

export let pool;

if(isDevServer) {
    pool = new Pool({
        connectionString: process.env.EXTERNAL_DATABASE,
        ssl: true
    });
} else {
    pool = new Pool({
        connectionString: process.env.INTERNAL_DATABASE,
        /* ssl: true */
    });
}

app.get('/', (req,res) => res.send('Server online'));

// Ruta para probar la base de datos y devolver la fecha actual
app.get('/sql', async(req,res) => {
    try {
        const query = await pool.query('SELECT CURRENT_DATE as fecha_actual');
        const result = query.rows[0];
        res.status(200).json(result);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: err});
    }
});


app.listen(PORT, ()=> console.log('Server on port :', PORT));