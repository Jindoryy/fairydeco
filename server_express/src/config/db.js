//db.js
require('dotenv').config();

// mysql2 모듈을 사용하는 이유 => 기존 mysql 모듈은 caching_sha2_password 방식을 지원을 안해서 MySql 설정 변경이 필요하다. 
const mysql = require('mysql2');

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 데이터베이스 연결
connection.connect(err => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

// 모듈 외부에서 사용할 수 있도록 connection 객체 내보내기
module.exports = connection;