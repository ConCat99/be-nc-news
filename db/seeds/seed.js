const db = require("../connection")
const pgFormat = require('pg-format')
const {topicData, userData, articleData, commentData} = require('../data/development-data/index')

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
    return db.query("DROP TABLE IF EXISTS articles;")
    })
    .then(() => {
    return db.query("DROP TABLE IF EXISTS users;")
    })
    .then(()=>{
    return db.query("DROP TABLE IF EXISTS topics;")
    })
    .then(()=>{
      return createTopics()
    })
    .then(()=>{
      return createUsers()
    })
    .then(()=>{
      return createArticles()
    })
    .then(()=>{
      return createComments()
    })
    .then(()=>{
      return insertTopicData()
    })
    .then(()=>{
      return insertUserData()
    })
};

function createTopics(){
  return db.query(`
    CREATE TABLE topics(
    slug VARCHAR(50) PRIMARY KEY,
    description VARCHAR(500) NOT NULL,
    img_url VARCHAR(1000)
      );
  `)

}

function createUsers(){
  return db.query(`
    CREATE TABLE users(
    username VARCHAR(30) PRIMARY KEY,
    name VARCHAR(30),
    avatar_url VARCHAR(1000)
      );
  `)
}

function createArticles(){
  return db.query(`
    CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    topic VARCHAR(50) REFERENCES topics(slug),
    author VARCHAR(50) NOT NULL REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP,
    votes INT,
    article_img_url VARCHAR(1000)
      );
  `)
}

function createComments(){
  return db.query(`
    CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    body TEXT,
    votes INT,
    author VARCHAR(50) REFERENCES users(username),
    created_at TIMESTAMP
      );
  `)
}

function insertTopicData(){
  const formattedTopics = topicData.map((topicData)=>{
    return [topicData.slug, topicData.description, topicData.img_url]
}) 
  const formattedTopicsStr = pgFormat(`INSERT INTO topics(slug, description, img_url) VALUES %L`, formattedTopics)
  return db.query(formattedTopicsStr)
}

function insertUserData(){
  const formattedUsers = userData.map((userData)=>{
    return [userData.username, userData.name, userData.avatar_url]
    
})
  const formattedUsersStr = pgFormat(`INSERT INTO users(username, name, avatar_url) VALUES %L`, formattedUsers)
  return db.query(formattedUsersStr)
}




module.exports = seed;
