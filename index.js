const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const uuidv4 = require('uuid/v4');
const cookieParser = require('cookie-parser');
const { Client } = require('pg');

// Initialise postgres client
const client = new Client({
  user: 'jianhaotan',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.log(`Error connecting: ${err.stack}`);
  }
  else {
    console.log('Connection success!');
  }
});
/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());


/**
 * ===================================
 * Routes
 * ===================================
 */



app.get('/:id', (req, res) => {
  let pokemonId = req.params.id;
  let queryString = `SELECT * from pokemon where id = '${pokemonId}'`;
  client.query(queryString, (err, result) => {
    if (err) {
      console.log(err.stack);
    }
    else {
      console.log(result.rows[0]);
      res.render('pokemon', { pokemon: result.rows[0]});
    }
  });
});

app.get('/:id/edit', (req, res) => {
  let pokemonId = req.params.id;
  let queryString = `SELECT * from pokemon where id = ${pokemonId};`
  client.query(queryString, (err, results) => {
    if (err) {
      console.log(err.stack);
    }
    else {
      console.log(`Pokemon data for editing retrieved`);
      console.log(results.rows[0]);
      res.render('edit', { pokemon: results.rows[0]});
    }
  });
});

app.post('/:id', (req, res) => {
  let params = req.body;
  console.log(`Posting pokemon params: ${params}`);
  console.log(params);

  let id = parseInt(params.id, 10) || null;
  let num = id || null;
  let name = params.name || null;
  let img = params.name || null;
  let weight = params.weight || null;
  let height = params.height || null;
  let candy = params.candy || null;
  let candy_count = params.candy_count || 0;
  let egg = params.egg || null;
  let avg_spawns = params.avg_spawns || null;
  let spawn_time = params.spawn_time || null;

  let queryString = `UPDATE pokemon SET name = '${name}', img = '${img}', weight = '${weight}', height = '${height}', candy = '${candy}', candy_count = '${candy_count}', egg = '${egg}', avg_spawns = '${avg_spawns}', spawn_time = '${spawn_time}' where id = ${id}
  ;`;

  client.query(queryString, (err, result) => {
    if (err) {
      console.log(err.stack);
    }
    else {
      console.log(result.rows[0]);
      res.redirect(`/${id}`);
    }
  });
});

app.get('/', (req, res) => {
  // query database for all pokemon 
  if (req.query.sortby === 'name') {
    let queryString = 'SELECT * from pokemon ORDER BY name';
    client.query(queryString, (err, result) => {
      if (err) {
        console.log(err.stack);
      }
      else {
        console.log(`Alphabet sorted query success!`);
        let pokeArr = result.rows;
        console.log(pokeArr);
        res.render("home", { pokeNameArr: pokeArr });
      }
    });
  }
  else {
    let queryString = 'SELECT * from pokemon ORDER BY id';
    client.query(queryString, (err, result) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(`Home page query Success! Total number of pokemons: ${result.rows.length}`);
        let pokeArr = result.rows;
        console.log(pokeArr);
        res.render("home", { pokeNameArr: pokeArr });
        // client.end();
      }
    });
  }
});

// app.get(':/id', (req, res) => {
//   let id = req.params;
//   console.log(req.params);
//   res.send(req.params);
// });

app.get('/new', (request, response) => {
  // respond with HTML page with form to create new pokemon
  response.render('new');
});


app.post('/pokemon', (req, res) => {
  let params = req.body;
  console.log(params);
  const queryString = 'INSERT INTO pokemon(id, num, name, img, weight, height, candy, candy_count, egg, avg_spawns, spawn_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';

  let id = params.id || null;
  let num = id || null;
  let name = params.name || null;
  let img = params.name || null;
  let weight = params.weight || null;
  let height = params.height || null;
  let candy = params.candy || null;
  let candy_count = params.candy_count || null;
  let egg = params.egg || null;
  let avg_spawns = params.avg_spawns || null;
  let spawn_time = params.spawn_time || null;

  let pokeStats = [id, num, name, img, weight, height, candy, candy_count, egg, avg_spawns, spawn_time];

  client.query(queryString, pokeStats, (err, result) => {
    if (err) {
      console.log(err.stack);
    }
    else {
      console.log(result.rows[0]);
      res.redirect('/');
    }
  });
});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
