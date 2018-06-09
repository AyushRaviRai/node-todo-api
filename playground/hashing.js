const bcrypt = require('bcryptjs');

password = 'ayush123';

// bcrypt.genSalt(10, (error, salt) => {
//     bcrypt.hash(password, salt, (error, hash) => {
//         console.log(salt, '\n\n\n', hash);
//     });
// });

hashed = "$2a$10$oCcRcm2wGTPDRSvAcgJzqefb.Imu9eOEYhnLy888yKJn.8MmkYxES";

console.log("\n\n\n");

bcrypt.compare('ayush123', hashed, (error, response) => {
    console.log(response);
});