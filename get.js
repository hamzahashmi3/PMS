
var bcrypt =require('bcrypt');

let pswrd = bcrypt.hashSync("1234", 10);

console.log(pswrd)
