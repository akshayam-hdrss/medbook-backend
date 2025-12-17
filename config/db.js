const mysql = require("mysql2/promise");
const fs = require("fs");
require("dotenv").config();

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
      ca: process.env.DB_SSL_CA.replace(/\\n/g, "\n"),
    },
  });

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

  // hospital_info table
  // await db.query(`CREATE TABLE IF NOT EXISTS hospital_info (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     name VARCHAR(255) NOT NULL,
  //     banner_image_url VARCHAR(500),
  //     journey_text TEXT,
  //     mission_text TEXT,
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  // )
  // `);

  // hospital information table

  // await db.query(DROP TABLE IF EXISTS hospitalInformation);

  await db.query(`CREATE TABLE IF NOT EXISTS hospitalInformation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospitalId INT NOT NULL,
    specialties TEXT,
    website VARCHAR(255),
    address VARCHAR(200),
    mission VARCHAR(200),
    vision VARCHAR(200),
    description TEXT,
    banner_img VARCHAR(255),
    ceo_name VARCHAR(255),
    ceo_image VARCHAR(255),
    nearest_location VARCHAR(255),
    youtubeLink VARCHAR(255)
  );
`);

  // await db.query(`ALTER TABLE hospitalInformation ADD youtubeLink VARCHAR(255)`);

  // quiz questions

  // await db.query(DROP TABLE IF EXISTS QuizQuestions);

  await db.query(`
  CREATE TABLE IF NOT EXISTS QuizQuestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    answer VARCHAR(255) NOT NULL,
    stage INT NOT NULL,
    CONSTRAINT chk_stage CHECK (stage BETWEEN 1 AND 6)
  );
`);

  // quiz_userdata
  // await db.query(DROP TABLE IF EXISTS quiz_stage_user_data);
  await db.query(`
  CREATE TABLE IF NOT EXISTS quiz_stage_user_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    stageNumber INT,
    marks INT,
    extraInfo JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_stage (userId, stageNumber)  -- ✅ Unique constraint
  );
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
      userId INT DEFAULT NULL,
      isVerified BOOLEAN DEFAULT FALSE,
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

  await db.query(`
    CREATE TABLE IF NOT EXISTS service_bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      serviceId INT,
      serviceName VARCHAR(255),
      userId INT,
      username VARCHAR(255),
      customerName VARCHAR(255),
      customerAge VARCHAR(50),
      customerGender VARCHAR(20),
      contactNumber VARCHAR(20),
      description TEXT,
      date DATE,
      time VARCHAR(50),
      status VARCHAR(50),
      remarks TEXT,
      paymentImageUrl TEXT,
      isOnline TINYINT DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS service_billing (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bookingId INT,
      serviceId INT,
      userId INT,
      subTotal DECIMAL(10,2),
      tax DECIMAL(10,2),
      total DECIMAL(10,2),
      items JSON,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bookingId) REFERENCES service_bookings(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (serviceId) REFERENCES service(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
    );
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
    address TEXT,
    isDoctor BOOLEAN DEFAULT FALSE,
    isPharmacy BOOLEAN DEFAULT FALSE,
    isProduct BOOLEAN DEFAULT FALSE,
    isService BOOLEAN DEFAULT FALSE,
    isLab BOOLEAN DEFAULT FALSE
  )
`);

  // await db.query(`ALTER TABLE users ADD COLUMN isService BOOLEAN DEFAULT FALSE`);

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

  // add column then FK (Option A)
  // await db.query(
  //   `ALTER TABLE schedule ADD COLUMN prescriptionID INT DEFAULT NULL;`
  // );

  // await db.query(`
  //   ALTER TABLE schedule
  //     ADD CONSTRAINT fk_schedule_prescription
  //       FOREIGN KEY (prescriptionID)
  //       REFERENCES prescription(id)
  //       ON DELETE SET NULL
  //       ON UPDATE CASCADE;
  // `);

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

  // ---- Bookings ----
  await db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctorId INT NOT NULL,
      doctorName VARCHAR(100),
      userId INT NOT NULL,
      username VARCHAR(100),
      patientName VARCHAR(100),
      patientAge INT,
      contactNumber VARCHAR(20),
      description TEXT,
      date DATE,
      time TIME,
      bloodPressure VARCHAR(50),
      height VARCHAR(20),
      weight VARCHAR(20),
      sugar VARCHAR(50),
      status ENUM('Pending','Confirmed','Rescheduled','Cancelled') DEFAULT 'Pending',
      remarks TEXT,
      paymentImageUrl TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (doctorId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB
  `);


  // Drop FK if it exists before re-adding
  //   await db.query(`
  //   ALTER TABLE schedule
  //   DROP FOREIGN KEY IF EXISTS fk_schedule_prescription;
  // `);

  //   await db.query(`
  //   ALTER TABLE bookings
  //     ADD CONSTRAINT fk_schedule_prescription
  //       FOREIGN KEY (prescriptionID)
  //       REFERENCES prescription(id)
  //       ON DELETE SET NULL
  //       ON UPDATE CASCADE;
  // `);

  // ---- Notifications ----
  await db.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      bookingId INT NOT NULL,
      title VARCHAR(255),
      message TEXT,
      isRead BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE ON UPDATE CASCADE,
      INDEX idx_notifications_userId (userId),
      INDEX idx_notifications_bookingId (bookingId)
    ) ENGINE=InnoDB
  `);

  // ✅ Employees table
  await db.query(`
      CREATE TABLE IF NOT EXISTS employees (
        employeeNumber VARCHAR(50) PRIMARY KEY,
        userName VARCHAR(100),
        employeeName VARCHAR(150),
        fatherName VARCHAR(150),
        doorStreet VARCHAR(255),
        villageArea VARCHAR(150),
        district VARCHAR(100),
        pincode VARCHAR(20),
        mobileNumber VARCHAR(20),
        gender VARCHAR(20),
        age INT,
        dateOfBirth DATE,
        education VARCHAR(100),
        designation VARCHAR(100),
        aadharNo VARCHAR(20),
        voterId VARCHAR(20),
        bloodGroup VARCHAR(10),
        salary DECIMAL(10,2),
        employeeRole VARCHAR(50),
        employeeAccess JSON,
        isTerminated BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

  await db.query(`
  CREATE TABLE IF NOT EXISTS membership (
    id INT AUTO_INCREMENT PRIMARY KEY,
    addInName VARCHAR(255),
    contactPerson VARCHAR(255),
    mobile VARCHAR(20),
    additionalNo VARCHAR(20),
    franchiseBranch VARCHAR(255),
    email VARCHAR(255),
    website VARCHAR(255),
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    district VARCHAR(100),
    pincode VARCHAR(20),
    additionalBranch INT DEFAULT 0,
    additionalDoctor INT DEFAULT 0,
    banner INT DEFAULT 0,
    premiumBanner INT DEFAULT 0,
    video INT DEFAULT 0,
    premiumVideo INT DEFAULT 0,
    paymentMode VARCHAR(50),
    transactionId VARCHAR(100),
    validFrom DATE,
    validTo DATE,
    validityDays INT DEFAULT 0,
    executiveId VARCHAR(50),
    executiveName VARCHAR(255),
    executiveMobile VARCHAR(20),
    category VARCHAR(100),
    subCategory VARCHAR(100),
    subSubCategory VARCHAR(100),
    package VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

  await db.query(`
  CREATE TABLE IF NOT EXISTS prescription (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prescriptionId INT NOT NULL,
    DoctorID INT,
    patientName VARCHAR(100) NOT NULL,
    age INT,
    date DATE,
    address TEXT,
    description TEXT,
    prescription JSON,
    nextVisit DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DoctorID) REFERENCES users(id)
      ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE(DoctorID, prescriptionId)
  )
`);

  //   await db.query(`
  //   ALTER TABLE prescription
  //   ADD COLUMN serviceId INT DEFAULT NULL
  // `);

  await db.query(`
  CREATE TABLE IF NOT EXISTS medicalProduct (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctorId INT  ,
    productName VARCHAR(255) NOT NULL,
     price DECIMAL(10,2) DEFAULT 0.00,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctorId) REFERENCES users(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`);

  // await db.query(`
  //   ALTER TABLE medicalProduct
  //   ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00
  // `);
  //add favourites table
  await db.query(`
  CREATE TABLE IF NOT EXISTS medicalFavourites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctorId INT,
    serviceId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
`);

  //app favourties
  await db.query(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    doctorId INT,
    serviceId INT,
    productId INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user
      FOREIGN KEY (userId) REFERENCES users(id)
      ON DELETE CASCADE
  )
`);

  //   await db.query(`ALTER TABLE hospital ADD COLUMN order_no INT DEFAULT NULL`);
  // const [rows, fields] = await db.query("SELECT * FROM service_billing");
  // console.log("📋 Total number:", rows.length);
  // console.log("📋 Columns:");
  // fields.forEach((field) => {
  //   console.log("-", field.name);
  // });

  // data
  // const [rows, fields] = await db.query("SELECT * FROM users where isService = 1");
  // console.log(rows);



  

  console.log("✅ MySQL Connected & Tables Ensured");
  return db;
};

module.exports = connectDB;
