const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && f !== 'node_modules' && f !== '.next') {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      callback(path.join(dir, f));
    }
  });
}

const dir = path.join(__dirname);

walkDir(dir, function(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Regex to find classNames containing bg-[rgba(255,255,255,0.75)]
  // We will replace existing shadow-* classes inside the same className string, 
  // and then append shadow-[(0,0,0,0.18)] if it's not already there.

  // First let's just do a simple approach: find every bg-[rgba(255,255,255,0.75)]
  // But wait, it's easier to just do it via regex replacement on the whole file if we're careful.
  
  // Actually, replacing shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl, shadow-inner, drop-shadow-* is hard with plain regex.
  // Instead, let's match `className="..."` or `className={`...`}`
  const classRegex = /(className\s*=\s*(["']))([^"']*)(bg-\[rgba\(255,255,255,0\.75\)\])([^"']*)(\2)/g;
  const templateClassRegex = /(className\s*=\s*\{`)([^`]*)(bg-\[rgba\(255,255,255,0\.75\)\])([^`]*)(`\})/g;

  function replaceShadows(match, p1, p2, before, bg, after, p6) {
    let combined = before + " " + bg + " " + after;
    // remove existing shadows
    combined = combined.replace(/\bshadow-(sm|md|lg|xl|2xl|inner|none)\b/g, '');
    combined = combined.replace(/\bshadow\b/g, '');
    // remove our own shadow if it exists to avoid duplicates
    combined = combined.replace(/shadow-\[.*?\]/g, '');
    
    // add our custom shadow
    combined = combined.replace(/\s+/g, ' ').trim();
    combined += ' shadow-[(0,0,0,0.18)]';
    
    return p1 + combined + p6;
  }

  content = content.replace(classRegex, replaceShadows);
  
  function replaceTemplateShadows(match, p1, before, bg, after, p5) {
    let combined = before + " " + bg + " " + after;
    combined = combined.replace(/\bshadow-(sm|md|lg|xl|2xl|inner|none)\b/g, '');
    combined = combined.replace(/\bshadow\b/g, '');
    combined = combined.replace(/shadow-\[.*?\]/g, '');
    combined = combined.replace(/\s+/g, ' ').trim();
    combined += ' shadow-[(0,0,0,0.18)]';
    return p1 + combined + p5;
  }

  content = content.replace(templateClassRegex, replaceTemplateShadows);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filePath);
  }
});
