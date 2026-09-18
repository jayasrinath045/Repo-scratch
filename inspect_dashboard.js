const fs = require('fs');
const code = fs.readFileSync('chunk_dashboard.js', 'utf8');

const leadSelectIdx = code.indexOf('glass-panel rounded-3xl border border-[rgba(60,35,10,0.08)] bg-white overflow-hidden shadow-sm flex flex-col h-[480px]');
console.log('--- CHAT BOX FULL ---');
if (leadSelectIdx !== -1) {
  console.log(code.substring(leadSelectIdx, leadSelectIdx + 2500));
}
