const fs = require('fs'); 
const files = [
  'e:/MediCarehms/Medicare_frontend/src/routes/management.index.tsx', 
  'e:/MediCarehms/Medicare_frontend/src/routes/reception.index.tsx', 
  'e:/MediCarehms/Medicare_frontend/src/routes/doctor.index.tsx', 
  'e:/MediCarehms/Medicare_frontend/src/routes/management.doctors.tsx', 
  'e:/MediCarehms/Medicare_frontend/src/routes/reception.patients.tsx'
]; 
for (const file of files) { 
  let content = fs.readFileSync(file, 'utf8'); 
  content = content.replace(/border-slate-100/g, 'border-border'); 
  content = content.replace(/border-slate-200/g, 'border-border'); 
  content = content.replace(/text-slate-800/g, 'text-foreground'); 
  content = content.replace(/text-slate-700/g, 'text-foreground'); 
  content = content.replace(/text-slate-600/g, 'text-muted-foreground'); 
  content = content.replace(/text-slate-500/g, 'text-muted-foreground'); 
  content = content.replace(/text-slate-400/g, 'text-muted-foreground'); 
  content = content.replace(/bg-slate-50\/50/g, 'bg-muted/30'); 
  content = content.replace(/bg-slate-50/g, 'bg-muted/50'); 
  content = content.replace(/bg-slate-100/g, 'bg-muted'); 
  content = content.replace(/bg-white\/60/g, 'bg-background/60'); 
  content = content.replace(/bg-white/g, 'bg-background'); 
  fs.writeFileSync(file, content); 
}
