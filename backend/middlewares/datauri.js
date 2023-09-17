const dataUriParser = require('datauri/parser');
const path = require('path');

const getUri = (file)=>{
const parser = new dataUriParser();
const extname = path.extname(file.originalname);
return parser.format(extname,file.buffer);
}

module.exports = getUri;