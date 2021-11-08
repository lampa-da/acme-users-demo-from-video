const Sequelize = require('sequelize')
const faker = require ('faker')
const {STRING, TEXT} = Sequelize
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_users_db1');

const User = db.define('User', {
  email: {
    type:STRING,
    allowNull: false,
    validate:{
      isEmail: true
    }
  },
  bio:{
    type: TEXT
  }
});

User.beforeSave ( user => {
  if(!user.bio){
    user.bio = `${user.email} BIO is ${faker.lorem.paragraphs(3)}`
  }
})

const syncAndSeed = async()=>{
  await db.sync({force: true})
  await User.create({email: 'moe@gmail.com', bio: "Moe's bio"})
  await User.create({email: 'lucy@yahoo.com'})
  await User.create({email: 'ethyl@aol.com'})
}

const init = async()=> {
  try{

    await db.authenticate();
    await syncAndSeed()
    // console.log(await User.findAll());
  }
  catch(ex){
    console.log(ex)
  }
}

init()
// const {Client} = require('pg');
// const client = new Client(process.env.DATABASE_URL || 'postgres://localhost/acme_users_db1');
// const express = require('express');
// const server = express(); 

// const syncAndSeed = async()=>{
//   const SQL =`
//     DROP TABLE IF EXISTS "Users";
//     CREATE TABLE "Users"(
//       id SERIAL PRIMARY KEY,
//       email VARCHAR(20) NOT NULL UNIQUE
//     );
//   `;
//   await client.query(SQL);

// };

// const getUsers = async()=>{
//   return (await client.query('SELECT * FROM "Users";')).rows;
// };

// const createUser = async({email})=>{
//   return (await client.query('INSERT INTO "Users"(email) VALUES ($1) RETURNING *;', [email])).rows[0];
// };

// const init = async()=> {
//   try{
//     await client.connect();
//     await syncAndSeed();
//     const user = await createUser({email: 'curly@gmail.com'});
//     console.log(await getUsers())
//     const port =process.env.PORT || 3000
//     server.listen(port, ()=> console.log(`listening on port ${port}`))
  
//   } 
//   catch(ex){
//     console.log(ex)
//   }
// };
// init();
