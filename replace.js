const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const dirs = [
    path.join(__dirname, 'app'),
    path.join(__dirname, 'components')
];

dirs.forEach(dir => {
    const files = walk(dir);
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        // Match bg-white precisely without matching bg-white/50
        const regex = /(?<![\w-])bg-white(?![\w/-])/g;
        if (regex.test(content)) {
            const newContent = content.replace(regex, 'bg-[rgba(255,255,255,0.75)]');
            fs.writeFileSync(file, newContent, 'utf8');
            console.log(`Updated ${file}`);
        }
    });
});
