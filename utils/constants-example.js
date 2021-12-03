const dbName = '';
const port = 5000;

exports.dbUrl = 'mongodb://localhost:27017/'+dbName;

exports.port = port;

const url = 'http://localhost:' + port;
exports.baseUrl = url + '/api/';
exports.imageUrl = url + '/';

exports.recordsPerPage = 10;

exports.mailHost = '';
exports.mailPort = 587;
exports.mailUsername = '';
exports.mailPassword = '';
