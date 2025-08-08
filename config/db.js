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

//   await db.query(`ALTER TABLE hospital ADD COLUMN order_no INT DEFAULT NULL`);
// const [rows, fields] = await db.query('SELECT * FROM product');
// console.log("📋 Total number of services:", rows.length);
// console.log("📋 Service Columns:");
// fields.forEach(field => {
//   console.log('-', field.name);
// });

  

  // Create database if it doesn't exist
  await db.query(`CREATE DATABASE IF NOT EXISTS medbookdb`);
  await db.query(`USE medbookdb`);

  // Create hospitalType table
  await db.query(`
    CREATE TABLE IF NOT EXISTS hospitalType (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      imageUrl TEXT,
      order_no INT DEFAULT NULL
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
      address1 VARCHAR(255),
      address2 VARCHAR(255),
      district VARCHAR(100),
      pincode VARCHAR(20),
      order_no INT DEFAULT NULL,      
      FOREIGN KEY (hospitalTypeId) REFERENCES hospitalType(id)
        ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);

  await db.query(`
  CREATE TABLE IF NOT EXISTS traditionalType (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT,
    order_no INT DEFAULT NULL
  )
`);


// Create traditional table
await db.query(`
  CREATE TABLE IF NOT EXISTS traditional (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT,
    area VARCHAR(100),
    mapLink TEXT,
    phone VARCHAR(20),
    traditionalTypeId INT,
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    district VARCHAR(100),
    pincode VARCHAR(20),
    order_no INT DEFAULT NULL,
    FOREIGN KEY (traditionalTypeId) REFERENCES traditionalType(id)
      ON DELETE SET NULL ON UPDATE CASCADE
  )
`);



  await db.query(`
    CREATE TABLE IF NOT EXISTS doctorType (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      order_no INT DEFAULT NULL,
      imageUrl TEXT
    );
  `);

  

  await db.query(`
    CREATE TABLE IF NOT EXISTS doctor (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctorName VARCHAR(100) NOT NULL,
      imageUrl TEXT,
      businessName VARCHAR(100),
      designation VARCHAR(100),
      category VARCHAR(100),  
      location VARCHAR(255),
      degree VARCHAR(100),
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
      traditionalId INT,
      bannerUrl TEXT,
      area VARCHAR(100),
      district VARCHAR(100),
      pincode VARCHAR(20),
      order_no INT DEFAULT NULL,
      FOREIGN KEY (doctorTypeId) REFERENCES doctorType(id),
      FOREIGN KEY (hospitalId) REFERENCES hospital(id),
      FOREIGN KEY (traditionalId) REFERENCES traditional(id)
    );
  `);

  


  await db.query(`
    CREATE TABLE IF NOT EXISTS doctorReview (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctorId INT,
      comment TEXT,
      rating DECIMAL(2,1),
      userId INT,
      userName VARCHAR(255),
      FOREIGN KEY (doctorId) REFERENCES doctor(id) ON DELETE CASCADE
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS category (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text VARCHAR(100) NOT NULL,
      hospitalId INT DEFAULT NULL,
      traditionalId INT DEFAULT NULL,
      number INT NOT NULL DEFAULT 1,
      FOREIGN KEY (hospitalId) REFERENCES hospital(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (traditionalId) REFERENCES traditional(id)
        ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);


  await db.query(`
  CREATE TABLE IF NOT EXISTS availableServicetype (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT,
    order_no INT DEFAULT NULL
  )
`);

  // Create availableService table
await db.query(`
  CREATE TABLE IF NOT EXISTS availableService (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT,
    order_no INT DEFAULT NULL,
    availableServicetypeId INT NULL,
    FOREIGN KEY (availableServicetypeId) REFERENCES availableServicetype(id)
      ON DELETE SET NULL ON UPDATE CASCADE
  )
`);



// Create serviceType table
await db.query(`
  CREATE TABLE IF NOT EXISTS serviceType (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT,
    availableServiceId INT,
    order_no INT DEFAULT NULL,
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
    district VARCHAR(100),
    pincode VARCHAR(20),
    order_no INT DEFAULT NULL,
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

// Create availableProductType table
await db.query(`
  CREATE TABLE IF NOT EXISTS availableProductType (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT,
    order_no INT DEFAULT NULL
  )
`);

// Create availableProduct table
await db.query(`
  CREATE TABLE IF NOT EXISTS availableProduct (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT,
    order_no INT DEFAULT NULL
  )
`);



// const [rows, fields] = await db.query('SELECT * FROM availableProduct');
// console.log("📋 Total number of availableProduct:", rows.length);
// console.log("📋 availableProduct Columns:");
// fields.forEach(field => {
//   console.log('-', field.name);
// });

// Create productType table
await db.query(`
  CREATE TABLE IF NOT EXISTS productType (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    imageUrl TEXT,
    availableProductId INT,
    order_no INT DEFAULT NULL,
    FOREIGN KEY (availableProductId) REFERENCES availableProduct(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255),
    price VARCHAR(100),
    imageUrl TEXT,
    businessName VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    experience VARCHAR(100),
    rating DECIMAL(3,2),
    addressLine1 TEXT,
    addressLine2 TEXT,
    mapLink TEXT,
    about TEXT,
    youtubeLink TEXT,
    gallery JSON,
    bannerUrl TEXT,
    district VARCHAR(100),
    pincode VARCHAR(20),
    productTypeId INT,
    order_no INT DEFAULT NULL,
    FOREIGN KEY (productTypeId) REFERENCES productType(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(15),
    pincode VARCHAR(10),
    gender VARCHAR(10),
    dob DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    block VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    address TEXT
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    subject VARCHAR(255),
    description TEXT,
    review TEXT,
    location VARCHAR(255),
    gallery JSON,
    status VARCHAR(50) DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create blog table
await db.query(`
  CREATE TABLE IF NOT EXISTS blog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100),
    publishedDate DATE,
    status ENUM('Draft', 'Published', 'Archived') DEFAULT 'Draft',
    category VARCHAR(100),
    featuredImage TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50),
    typeId INT DEFAULT NULL,
    itemId INT DEFAULT NULL,
    imageUrl JSON,
    youtubeLinks JSON
  )
`);

// ✅ Schedule table
  await db.query(`
    CREATE TABLE IF NOT EXISTS schedule (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      description TEXT,
      doctorId INT NOT NULL,
      doctorName VARCHAR(100),
      username VARCHAR(100),
      status VARCHAR(50),
      age VARCHAR(3),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);


  await db.query(`
      CREATE TABLE IF NOT EXISTS blogtopics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        topic VARCHAR(255) NOT NULL,
        bannerUrl TEXT,
        description TEXT DEFAULT NULL
      )
    `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bannerImage VARCHAR(255),
      title VARCHAR(255) NOT NULL,
      content TEXT,
      videoUrl VARCHAR(255),
      imageUrl VARCHAR(255),
      author VARCHAR(100),
      category VARCHAR(100),
      status VARCHAR(50),
      gallery JSON,
      publishDate DATETIME,
      blogtopicsID INT,
      FOREIGN KEY (blogtopicsID) REFERENCES blogtopics(id)
    )
  `);

  //charities
  await db.query(`
    CREATE TABLE IF NOT EXISTS charities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      banner_image TEXT,         
      youtubeLink TEXT,
      imageUrl TEXT,          
      gallery JSON
)
`);

//event table
await db.query(`
  CREATE TABLE IF NOT EXISTS event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    banner_image TEXT,
    youtubeLink TEXT,
    gallery JSON
  )
`);

// districtArea table
await db.query(`CREATE TABLE IF NOT EXISTS district_area (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_no INT NOT NULL DEFAULT 1,
  district VARCHAR(100) NOT NULL,
  area VARCHAR(100) NOT NULL
)
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS primecareicon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image TEXT
  )
  `);

  //offers table
  await db.query(`
  CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gallery JSON
  )
`);



  console.log("✅ MySQL Connected & Tables Ensured");
  return db;
}; 

module.exports = connectDB;
