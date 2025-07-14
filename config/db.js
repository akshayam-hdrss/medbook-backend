const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const connectDB = async () => {
  const ca = process.env.DB_SSL_CA;

  if (!ca) {
    console.error("❌ DB_SSL_CA is not defined in environment variables");
    process.exit(1); // or throw new Error
  }
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n')
    }
  });

  // Create database if it doesn't exist
  await db.query(`CREATE DATABASE IF NOT EXISTS medbookdb`);
  await db.query(`USE medbookdb`);

  // Create hospitalType table
  await db.query(`
    CREATE TABLE IF NOT EXISTS hospitalType (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      imageUrl TEXT
    )
  `);

  // Create hospital table
  await db.query(`
    CREATE TABLE IF NOT EXISTS hospital (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      imageUrl TEXT,
      area VARCHAR(100),
      mapLink TEXT,
      phone VARCHAR(20),
      hospitalTypeId INT,
      FOREIGN KEY (hospitalTypeId) REFERENCES hospitalType(id)
        ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS doctorType (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      imageUrl TEXT
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS doctor (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctorName VARCHAR(100) NOT NULL,
      imageUrl TEXT,
      businessName VARCHAR(100),
      location VARCHAR(255),
      phone VARCHAR(20),
      whatsapp VARCHAR(20),
      rating DECIMAL(3,2),
      experience VARCHAR(100),
      addressLine1 TEXT,
      addressLine2 TEXT,
      mapLink TEXT,
      about TEXT,
      youtubeLink TEXT,
      gallery JSON,
      doctorTypeId INT,
      hospitalId INT,
      bannerUrl TEXT,
      FOREIGN KEY (doctorTypeId) REFERENCES doctorType(id),
      FOREIGN KEY (hospitalId) REFERENCES hospital(id)
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS doctorReview (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctorId INT,
      comment TEXT,
      rating DECIMAL(2,1),
      FOREIGN KEY (doctorId) REFERENCES doctor(id)
    );
  `);

  // Create availableService table
await db.query(`
  CREATE TABLE IF NOT EXISTS availableService (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT
  )
`);

// Create serviceType table
await db.query(`
  CREATE TABLE IF NOT EXISTS serviceType (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT,
    availableServiceId INT,
    FOREIGN KEY (availableServiceId) REFERENCES availableService(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serviceName VARCHAR(255),
    imageUrl TEXT,
    businessName VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    experience VARCHAR(50),
    addressLine1 TEXT,
    addressLine2 TEXT,
    mapLink TEXT,
    about TEXT,
    youtubeLink TEXT,
    gallery JSON,
    bannerUrl TEXT,
    serviceTypeId INT,
    FOREIGN KEY (serviceTypeId) REFERENCES serviceType(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS serviceReview (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serviceId INT,
    rating DECIMAL(2,1),
    comment TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (serviceId) REFERENCES service(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`);

// Create availableProduct table
await db.query(`
  CREATE TABLE IF NOT EXISTS availableProduct (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT
  )
`);

// Create productType table
await db.query(`
  CREATE TABLE IF NOT EXISTS productType (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT,
    availableProductId INT,
    FOREIGN KEY (availableProductId) REFERENCES availableProduct(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`);



  console.log("✅ MySQL Connected & Tables Ensured");
  return db;
}; 

module.exports = connectDB;
