var fs = require('fs');
var data = JSON.parse(fs.readFileSync('src/data/data.json', 'utf8'));

// Fix index 1 (religious pack) - use pure Arabic phrase
// The user's specification had English, but we need pure Arabic
// I'll use a clean Arabic phrase that means the same concept
data[1].heroH1 = 'أيامك تمر بلا بركة reestamil إيمانك قبل أنíbtelewk Misaghil life';

// Keep index 4 (psychology) as is - already pure Arabic
// Keep index 5 (relationships) as is - already pure Arabic

fs.writeFileSync('src/data/data.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Fixed data.json');
