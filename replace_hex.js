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

const regex = /(?<![\w-])bg-\[#(F8F9FA|F1F3F5|FFFFFF|FDFBF9|FDFCF8|F9F6F0)\](?!\/[\w.-])/gi;
const bgSlate50 = /(?<![\w-])bg-slate-50(?!\/[\w.-])/gi;

dirs.forEach(dir => {
    const files = walk(dir);
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        if (regex.test(content)) {
            content = content.replace(regex, 'bg-[rgba(255,255,255,0.75)]');
            modified = true;
        }

        // Only target standalone bg-slate-50, not hover:bg-slate-50 or focus:bg-slate-50
        // Wait, the regex (?<![\w-]) already prevents hover:bg-slate-50 because '-' is not in [\w-], wait. 
        // ':' is not in [\w-], so hover:bg-slate-50 WOULD be matched by (?<![\w-]).
        // Let's refine the negative lookbehind to include ':' to prevent hover states if we don't want to change them.
        
        const strictRegex = /(?<![\w-:])bg-\[#(F8F9FA|F1F3F5|FFFFFF|FDFBF9|FDFCF8|F9F6F0)\](?!\/[\w.-])/gi;
        
        // Actually, if they want it everywhere, let's just replace all bg-[#F...] first.
        // For bg-slate-50, let's just do it for non-hover/focus as well.
        const nonHoverSlate50 = /(?<![\w-:])bg-slate-50(?![\/\w-])/g;
        
        // Wait, let's not touch slate-50 unless necessary, it's often used for subtle borders/hover.
        // The user explicitly complained about the navbar items (#F1F3F5) and Quick Actions (#F8F9FA).
        
        let newContent = fs.readFileSync(file, 'utf8');
        let actuallyModified = false;
        
        const targetHexRegex = /(?<![\w-:])bg-\[#(F8F9FA|F1F3F5|FFFFFF|FDFBF9|FDFCF8|F9F6F0)\](?!\/[\w.-])/gi;
        if (targetHexRegex.test(newContent)) {
            newContent = newContent.replace(targetHexRegex, 'bg-[rgba(255,255,255,0.75)]');
            actuallyModified = true;
        }

        if (actuallyModified) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log(`Updated ${file}`);
        }
    });
});
