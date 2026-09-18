const fs = require('fs');
const code = fs.readFileSync('chunk_services.js', 'utf8');

// find array of providers
const startMarker = 'const providers = [';
const altMarker = 'providers=[';
let start = code.indexOf(altMarker);
if (start === -1) {
  start = code.indexOf('id:');
}
console.log('Start index:', start);
if (start !== -1) {
  console.log(code.substring(start - 20, start + 3000));
}
