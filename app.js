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

  const genreQuery = req.query.genre;
  const artistQuery = req.query.artist;
  const likesQuery = req.query.likes;
  const opQuery = req.query.op;

  let myQuery = `SELECT * FROM ${NOME_TABELA}`;

  if (genreQuery!=undefined){
    myQuery = `SELECT * FROM ${NOME_TABELA} WHERE genre = "${genreQuery}"`;
  } else if (artistQuery!=undefined){
    myQuery = `SELECT * FROM ${NOME_TABELA} WHERE artist = "${artistQuery}"`;
  } else if (likesQuery!=undefined){
    myQuery = `SELECT * FROM ${NOME_TABELA} WHERE likes = "${likesQuery}"`;
    
    if (opQuery!="above"){
      myQuery = `SELECT * FROM ${NOME_TABELA} WHERE likes < "${likesQuery}"`;  
    }else if (opQuery!="under"){
      myQuery = `SELECT * FROM ${NOME_TABELA} WHERE likes > "${likesQuery}"`;  
    }else if (opQuery!="equal"){
      myQuery = `SELECT * FROM ${NOME_TABELA} WHERE likes = "${likesQuery}"`;  
    }

  }

  console.log(opQuery)
  console.log(myQuery)

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
  const myQuery = (`Select likes FROM ${NOME_TABELA} WHERE id = ${id}`);
  connection.query(myQuery, (err, results) => {

    if (err) {
      return res.status(500).send('Erro ao buscar música: ' + err.message);
    }
    
    const result = results[0].likes * pricePerLike;
    res.json(result);
  });
});

app.get('/api/songs/:id/bands', (req, res) =>{;
 
  const id = req.params.id;

  const myQuery = `SELECT artist FROM ${NOME_TABELA} where id=${id}`

  connection.query(myQuery, (err, results) => {


      if (err) {
          return res.status(500).send('Erro ao buscar artista: ' + err.message);
      }


      if (results.length !== 0){
          for (let i=0; i < bands.length; i++){

              if (bands[i].artist == results[0].artist){
                  res.json(bands[i]);
                  return;
              }
          }

          res.status(404).send('Artista não encontrado na banda')

      }else{
         
          res.status(404).send('Artista não encontrado na base de dados')

      }
     
  });
 

});


app.post('/api/songs/:id/bands', (req, res) =>{;

  const id = req.params.id;
  const band_members = req.body.band_members;

  const myQuery = `SELECT artist FROM ${NOME_TABELA} where id=${id}`

  connection.query(myQuery, (err, results) => {

      if (err) {
          return res.status(500).send('Erro ao buscar artista: ' + err.message);
      }

      const Banda = {
         
          "artist": results[0].artist,
          "band_members": band_members
      }
     
      bands.push(Banda);

      res.sendStatus(200);

  });

});

// Criar o servidor HTTP
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
