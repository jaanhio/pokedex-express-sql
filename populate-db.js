const pg = require('pg');
const jsonfile = require('jsonfile');

const configs = {
  user: "jianhaotan",
  host: "127.0.0.1",
  database: "pokemons",
  port: 5432
};

// create a new instance of the client
const client = new pg.Client(configs);
const pool = new pg.Pool(configs);

const pokeFile = 'pokedex.json';

client.connect((err) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(`Connection success!`);
  }
});

jsonfile.readFile(pokeFile, (err, obj) => {
  if (err) {
    console.log(err);
  }

  // let values = [];
  let pokeArr = obj.pokemon;
  let numOfPokemon = pokeArr.length;

  // your queries go here
  let queryString = "INSERT INTO pokemon (id, num, name, img, weight, height, candy, candy_count, egg, avg_spawns, spawn_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

  // your dynamic values go here
  let values = [];
  let count = 1;

  pokeArr.forEach(poke => {
    count++;

    // let pokeStats = [];
    let id = poke.id || null;
    let num = poke.num || null;
    let name = poke.name || null;
    let img = poke.img || null;
    let height = poke.height || null;
    let weight = poke.weight || null;
    let candy = poke.candy || null;
    let candy_count = poke.candy_count || null;
    let egg = poke.egg || null;
    let avg_spawns = poke.avg_spawns || null;
    let spawn_time = poke.spawn_time || null;

    let pokeStats = [ id, num, name, img, weight, height, candy, candy_count, egg, avg_spawns, spawn_time];
    
    client.query(queryString, pokeStats, (err, res) => {
      if (err) {
        console.log(`query error ${err.message}`);
        // client.end();
      } else {
        console.log(`result is ${res.rows[0]}`);
        // client.end();
      }
    });
  });
});