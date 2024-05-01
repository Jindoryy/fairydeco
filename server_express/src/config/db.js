//db.js
require('dotenv').config();

// mysql2 모듈을 사용하는 이유 => 기존 mysql 모듈은 caching_sha2_password 방식을 지원을 안해서 MySql 설정 변경이 필요하다. 
// mysql2/promise 모듈을 사용하는 이유 => 비동기 처리 async/await, then, catch 사용하려면 필요 
// mysql2/promise 모듈 사용시에는 connection.connect를 호출할 필요가 없다. 하면 에러 난다.
const mysql = require('mysql2/promise');

async function connectDB() {
    try {
        return await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    } catch (err) {
        console.error('Error connecting: ' + err.stack);
        throw err;
    }
}

// 모듈 외부에서 사용할 수 있도록 connection 객체 내보내기
module.exports = connectDB;