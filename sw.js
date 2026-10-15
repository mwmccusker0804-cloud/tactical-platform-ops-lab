const CACHE='tpol-v4.3-expanded';
const ASSETS=["./python-projects.js","./python-projects-data.js","./assets/python-hunters.png","./python.js","./python-data.js","./PYTHON-LAB.md","./directory.js","./ACTIVE-DIRECTORY-LAB.md","./deployment.js","./deployment-data.js","./assets/unicorn-operations-v4.png","./integrations/operations/README.md","./DEPLOYMENT-GUIDE.md","./SOURCES.md","./curriculum.js", "./quiz.js", "./exercises.js", "./operations.js", "./assets/unicorn-rf-operations.png", "./assets/unicorn-rf-field.png", "./integrations/monitoring/tactical-dashboard.json", "./integrations/monitoring/README.md", "./integrations/siem/README.md", "./integrations/redpanda/README.md", "./UPGRADE.md"] .concat(['./','./index.html','./app.js','./live.js','./styles.css','./learning.js','./learning-data.js','./assets/linux-worksheet.png','./assets/unicorn-workshop.png','./manifest.webmanifest','./icon.svg']);
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('tpol-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
if(new URL(e.request.url).pathname.startsWith('/api/'))return;
if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
e.respondWith(caches.open(CACHE).then(async cache=>{
if(e.request.mode==='navigate'){
try{return await fetch(e.request);}catch{return (await cache.match('./index.html'))||Response.error();}
}
return (await cache.match(e.request))||fetch(e.request);
}));

});
