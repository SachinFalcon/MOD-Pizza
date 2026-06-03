const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/reports/page.tsx',
  'components/features/campaign-details/campaign-details-client.tsx',
  'components/features/campaigns/campaigns-client.tsx',
  'components/features/dashboard/header.tsx',
  'components/organisms/create-campaign-modal.tsx',
  'components/atoms/search-input.tsx'
];

filesToUpdate.forEach(relativePath => {
  const file = path.join(__dirname, relativePath);
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // We want to target the search bar container or input.
  // In most cases, it has placeholder="Search..." or similar, and the class bg-[rgba(255,255,255,0.75)] is either on the input or its wrapping div.
  
  // A regex to match a div or input tag containing bg-[rgba(255,255,255,0.75)] that is near a placeholder="Search..."
  // Actually, since there are very few instances of this color, let's just do a manual string replace or targeted regex.
  
  // In header.tsx:
  if (relativePath.includes('header.tsx')) {
     content = content.replace(/hidden md:flex items-center bg-\[rgba\(255,255,255,0\.75\)\] rounded-full pr-1\.5 pl-6 py-1 h-\[52px\]/, 'hidden md:flex items-center bg-[rgba(31,31,31,0.05)] rounded-full pr-1.5 pl-6 py-1 h-[52px]');
     // also the mobile search button if needed? The user said "inside search bars". Let's assume just the bar container.
  }
  
  if (relativePath.includes('search-input.tsx')) {
     content = content.replace(/className="bg-\[rgba\(255,255,255,0\.75\)\] border border-slate-200/, 'className="bg-[rgba(31,31,31,0.05)] border border-slate-200');
  }

  if (relativePath.includes('reports/page.tsx')) {
     content = content.replace(/className="pl-4 pr-10 py-2 bg-\[rgba\(255,255,255,0\.75\)\]/g, 'className="pl-4 pr-10 py-2 bg-[rgba(31,31,31,0.05)]');
     content = content.replace(/className="w-full pl-4 pr-10 py-2.5 bg-\[rgba\(255,255,255,0\.75\)\]/g, 'className="w-full pl-4 pr-10 py-2.5 bg-[rgba(31,31,31,0.05)]');
  }

  if (relativePath.includes('campaigns-client.tsx')) {
     content = content.replace(/className="w-full pl-4 pr-10 py-2.5 bg-\[rgba\(255,255,255,0\.75\)\]/g, 'className="w-full pl-4 pr-10 py-2.5 bg-[rgba(31,31,31,0.05)]');
  }

  if (relativePath.includes('create-campaign-modal.tsx')) {
     content = content.replace(/className="w-full bg-\[rgba\(255,255,255,0\.75\)\] border/g, 'className="w-full bg-[rgba(31,31,31,0.05)] border');
  }

  if (relativePath.includes('campaign-details-client.tsx')) {
     content = content.replace(/className="w-full bg-\[rgba\(255,255,255,0\.75\)\] border/g, 'className="w-full bg-[rgba(31,31,31,0.05)] border');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated ' + relativePath);
});
