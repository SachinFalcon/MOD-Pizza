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

  // We want to find any className that contains shadow-[(0,0,0,0.18)]
  // and REMOVE the shadow if it's an "inside item".
  // Inside items typically have: rounded-md, rounded-sm, rounded-full, rounded-lg
  // EXCEPT we might want to keep it on main containers.
  // Main containers typically have: p-5, p-6, p-8, rounded-xl, rounded-2xl, rounded-[1.5rem]
  // Let's just look at the elements identified in task-495 logs:
  
  const classRegex = /(className\s*=\s*(["']))([^"']*)(shadow-\[0_8px_30px_rgba\(31,31,31,0\.25\)\])([^"']*)(\2)/g;
  const templateClassRegex = /(className\s*=\s*\{`)([^`]*)(shadow-\[0_8px_30px_rgba\(31,31,31,0\.25\)\])([^`]*)(`\})/g;

  function processClassStr(before, shadowStr, after) {
    let combined = before + after;
    
    // Condition to remove shadow:
    // If it's a small input, button, pill, checkbox, badge.
    // Identifiers: rounded-full (if not a big modal), py-2.5, px-4, w-5 h-5, rounded-md, rounded-lg, text-[10px], text-[11px], p-2
    // Let's be safer:
    // If the class contains 'rounded-xl', 'rounded-2xl', 'rounded-[1.5rem]' we KEEP the shadow.
    // OTHERWISE we remove it.
    // Wait, what if it's a main card with no explicit rounded class (e.g. inherited)? Usually they have rounded-xl.
    // Let's check for 'rounded-xl', 'rounded-2xl', 'rounded-[1.5rem]', 'shadow-2xl' (previously had it).
    
    if (combined.includes('rounded-xl') || 
        combined.includes('rounded-2xl') || 
        combined.includes('rounded-[1.5rem]') ||
        combined.includes('max-w-sm md:max-w-2xl')) {
      // KEEP SHADOW
      return before + shadowStr + after;
    } else {
      // REMOVE SHADOW
      return combined.replace(/\s+/g, ' ').trim();
    }
  }

  function replaceShadows(match, p1, p2, before, shadowStr, after, p6) {
    return p1 + processClassStr(before, shadowStr, after) + p6;
  }

  function replaceTemplateShadows(match, p1, before, shadowStr, after, p5) {
    return p1 + processClassStr(before, shadowStr, after) + p5;
  }

  content = content.replace(classRegex, replaceShadows);
  content = content.replace(templateClassRegex, replaceTemplateShadows);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Removed inner shadow from ' + filePath);
  }
});
