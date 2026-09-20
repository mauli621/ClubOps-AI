import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
const __filename=fileURLToPath(import.meta.url), __dirname=path.dirname(__filename), publicDir=path.join(__dirname,'public');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json'};
function demoAI(action,text){
 if(action==='meeting'){const lines=text.split(/\n+/).map(s=>s.trim()).filter(Boolean);return {summary:lines.slice(0,3).join(' ')||'Meeting notes processed.',tasks:lines.filter(x=>/action|todo|task|need to|assign|prepare|send|book|confirm|create|contact/i.test(x)).slice(0,6).map((x,i)=>({title:x.replace(/^[-*]\s*/,''),owner:['Event Lead','Marketing Lead','Tech Lead','Volunteer Lead'][i%4],due:'7 days'})),risks:['Confirm owners for every action item.','Validate deadlines before the event.']};}
 if(action==='risk'){const r=[];if(/deadline|late|delay|pending|not done/i.test(text))r.push({level:'High',title:'Deadline slippage',detail:'One or more commitments may miss their intended deadline.'});if(/volunteer|staff|people|owner/i.test(text))r.push({level:'Medium',title:'Ownership gap',detail:'A task or event area may not have a confirmed owner.'});if(/venue|room|equipment|internet|speaker|vendor/i.test(text))r.push({level:'Medium',title:'Operational dependency',detail:'A venue, equipment, speaker, or vendor dependency should be confirmed.'});return {risks:r.length?r:[{level:'Low',title:'Review required',detail:'No obvious risk phrase was detected; review dependencies manually.'}]};}
 if(action==='announcement')return {draft:`📣 ClubOps Update\n\n${text||'We have an important club update.'}\n\nPlease check your assigned tasks and deadlines in ClubOps AI.\n\n— ClubOps Team`};
 if(action==='plan')return {plan:['Define event goal, audience, date, venue and budget','Create workstreams for program, marketing, logistics and volunteers','Assign owners and due dates to critical tasks','Review risks and dependencies before publishing the event','Run a final readiness check 24–48 hours before the event']};
 return {answer:'I can help with tasks, meetings, risks, volunteers, documents, announcements, and event planning. Try “extract tasks”, “find risks”, or “draft an announcement”.'};
}
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,`http://${req.headers.host}`);
 if(req.method==='POST'&&url.pathname==='/api/documents/open'){
  let body='';
  req.on('data',c=>body+=c);
  req.on('end',()=>{
    try{
      const x=JSON.parse(body||'{}');
      const filePath=String(x.path||'').trim();

      if(!filePath){
        res.writeHead(400,{'Content-Type':'application/json'});
        return res.end(JSON.stringify({ok:false,error:'Document path is required'}));
      }

      if(!fs.existsSync(filePath)){
        res.writeHead(404,{'Content-Type':'application/json'});
        return res.end(JSON.stringify({ok:false,error:'File not found: '+filePath}));
      }

      const stats=fs.statSync(filePath);
      if(!stats.isFile()){
        res.writeHead(400,{'Content-Type':'application/json'});
        return res.end(JSON.stringify({ok:false,error:'The selected path is not a file'}));
      }

      if(process.platform==='win32'){
        execFile('explorer.exe',[filePath],error=>{
          if(error){
            res.writeHead(500,{'Content-Type':'application/json'});
            return res.end(JSON.stringify({ok:false,error:'Could not open the document'}));
          }
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end(JSON.stringify({ok:true}));
        });
        return;
      }

      if(process.platform==='darwin'){
        execFile('open',[filePath],error=>{
          if(error){
            res.writeHead(500,{'Content-Type':'application/json'});
            return res.end(JSON.stringify({ok:false,error:'Could not open the document'}));
          }
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end(JSON.stringify({ok:true}));
        });
        return;
      }

      execFile('xdg-open',[filePath],error=>{
        if(error){
          res.writeHead(500,{'Content-Type':'application/json'});
          return res.end(JSON.stringify({ok:false,error:'Could not open the document'}));
        }
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify({ok:true}));
      });
    }catch(e){
      res.writeHead(400,{'Content-Type':'application/json'});
      res.end(JSON.stringify({ok:false,error:'Invalid request'}));
    }
  });
  return;
}
 if(req.method==='POST'&&url.pathname==='/api/ai'){let body='';req.on('data',c=>body+=c);req.on('end',()=>{try{const x=JSON.parse(body||'{}');const out=demoAI(String(x.action||'chat'),String(x.input||''));res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,mode:'demo',response:out}));}catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,error:'Invalid JSON'}));}});return;}
 let file=url.pathname==='/'?'/index.html':url.pathname;file=path.normalize(file).replace(/^\.\.[\\/]/,'');const fp=path.join(publicDir,file);if(!fp.startsWith(publicDir)){res.writeHead(403);return res.end('Forbidden')}fs.readFile(fp,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime[path.extname(fp)]||'application/octet-stream'});res.end(data)});
});
const port = process.env.PORT || 3000;

server.listen(port, "0.0.0.0", () => {
  console.log(`ClubOps AI running on port ${port}`);
});