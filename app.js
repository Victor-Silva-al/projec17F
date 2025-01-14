const express = require('express')
const mysql = require('mysql2');
const app = express()
const port = 3000

// Middleware para parse de JSON no corpo da requisição
app.use(express.json());

// Criação da conexão com a base de dados
const connection = mysql.createConnection({
  host: '127.0.0.1',       // Endereço do servidor MySQL
  user: 'root',            // user do MySQL
  password: '',            // Senha do MySQL
  database: 'finalvh',         // Nome da base de dados
  port: 3306
});


// Teste da conexão
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar à base de dados:', err.message);
  } else {
    console.log('Conectado à base de dados MySQL!');
  }
});

const NOME_TABELA = "songs"

app.get('/api/songs', (req, res) => {

  const myQuery = `SELECT * FROM ${NOME_TABELA}`

  connection.query(myQuery, (err, results) => {

    if (err) {
      return res.status(500).send('Erro ao buscar música: ' + err.message);
    }

    res.json(results);
  });
  
});


app.post('/api/songs/', (req, res) => {
  const title = req.body.title;
  const artist = req.body.artist;
  const album = req.body.album;
  const genre = req.body.genre;
  const duration_secs = req.body.duration_secs;
  const release_date = req.body.release_date;
  const likes = req.body.likes;

  if (!title || !artist || !album || !genre || !duration_secs || !release_date || !likes) {
    return res.status(400).send('Campos obrigatórios: title, artist, album, genre, duration_secs, release_date, likes');
  }

  const query = `INSERT INTO  songs (title, artist, album, genre, duration_secs, release_date, likes) VALUES ("${title}", "${artist}", "${album}", "${genre}", "${duration_secs}", "${release_date}", "${likes}")`;
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao adicionar música: ' + err.message);
    }
    res.status(200).send('Música adicionada com sucesso!');
  });
});


app.put('/api/songs/:id', (req, res) => {
  const id = req.params.id
  const title = req.body.title;
  const artist = req.body.artist;
  const album = req.body.album;
  const genre = req.body.genre;
  const duration_secs = req.body.duration_secs;
  const release_date = req.body.release_date;
  const likes = req.body.likes;

  const query = `UPDATE ${NOME_TABELA} SET title = "${title}", artist = "${artist}", album = "${album}", genre = "${genre}", album = "${album}", duration_secs = "${duration_secs}", release_date = "${release_date}", likes = "${likes}" WHERE id = "${id}"`;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao atualizar música: ' + err.message);
    }
    res.status(200).send('Música atualizada com sucesso!');
  });
});

app.delete('/api/songs/:id', (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM ${NOME_TABELA} WHERE id = ${id}`;

  connection.query(query, (err, results) => {
    // Dar erro se err existir
    if (err) {
      return res.status(500).send('Erro ao deletar música: ' + err.message);
    }
    // Enviar resposta
    res.status(200).send('Música removida com sucesso!');
  });
});

app.get('/api/songs/:id', (req, res) => {

  const id = req.params.id;
  const myQuery = `SELECT * FROM ${NOME_TABELA} WHERE id = ${id}`

  connection.query(myQuery, (err, results) => {

    if (err) {
      return res.status(500).send('Erro ao buscar música: ' + err.message);
    }

    res.json(results);
  });
  
});

var pricePerLike = 0.2

app.get ('/api/price', (req, res)=> {
  res.send(`Valor: ${pricePerLike} €`);
});


app.put ('/api/price', (req, res)=> {
  if (pricePerLike != null){
      pricePerLike = req.body.pricePerLike;
      res.sendStatus(200);
  } else {
      res.sendStatus(400);
  }
});

app.get ('/api/songs/:id/revenue', (req, res)=> {
  const id = req.params.id;
  const myQuery = (`Select likes FROM songs WHERE id = ${id}`);
  connection.query(myQuery, (err, results) => {

    if (err) {
      return res.status(500).send('Erro ao buscar música: ' + err.message);
    }
    
    const result = results[0].likes * pricePerLike;
    res.json(result);
  });
});

app.get ('/api/songs/:id/bands', (req, res)=> {
  const id = req.params.id;
  const myQuery = (`Select artist FROM songs WHERE id = ${id}`);
});


// Criar o servidor HTTP
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
