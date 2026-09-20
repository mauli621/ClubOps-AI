const KEY='clubops-ai-v1';
const seed={
 club:{name:'Tech Society',college:'Your College',email:'club@college.edu',timezone:'Asia/Kolkata'},
 events:[{id:1,name:'TechFest 2026',date:'2026-10-18',venue:'Main Auditorium',status:'Planning',progress:62,lead:'Hasti'},{id:2,name:'AI Workshop',date:'2026-09-28',venue:'Lab 3',status:'Ready',progress:86,lead:'Riya'}],
 tasks:[{id:1,title:'Confirm auditorium booking',event:'TechFest 2026',owner:'Hasti',due:'2026-09-24',status:'In progress',priority:'High'},{id:2,title:'Publish sponsor deck',event:'TechFest 2026',owner:'Aarav',due:'2026-09-26',status:'Todo',priority:'Medium'},{id:3,title:'Recruit 12 volunteers',event:'TechFest 2026',owner:'Meera',due:'2026-09-22',status:'Done',priority:'High'},{id:4,title:'Test projector and microphones',event:'AI Workshop',owner:'Dev',due:'2026-09-25',status:'Todo',priority:'Medium'}],
 volunteers:[{id:1,name:'Hasti',role:'Lead',team:'Core',status:'Active',hours:16},{id:2,name:'Aarav',role:'Marketing',team:'Outreach',status:'Active',hours:8},{id:3,name:'Meera',role:'Volunteer Lead',team:'Operations',status:'Active',hours:12},{id:4,name:'Dev',role:'Tech Volunteer',team:'Tech',status:'Pending',hours:4}],
 meetings:[{id:1,title:'TechFest weekly sync',date:'2026-09-18',attendees:8,notes:'Confirm auditorium booking. Marketing team needs sponsor deck. Prepare volunteer roster by Friday.'},{id:2,title:'AI Workshop planning',date:'2026-09-16',attendees:5,notes:'Test projector. Contact speaker. Send registration reminder.'}],
 documents:[{id:1,name:'TechFest Event Plan.pdf',type:'PDF',size:'1.8 MB',updated:'Today'},{id:2,name:'Volunteer Handbook.docx',type:'DOCX',size:'420 KB',updated:'Yesterday'},{id:3,name:'Venue Checklist.xlsx',type:'XLSX',size:'96 KB',updated:'Sep 14'}],
 risks:[{id:1,title:'Venue confirmation pending',level:'High',event:'TechFest 2026',owner:'Hasti',detail:'Auditorium booking must be confirmed before public launch.'},{id:2,title:'Volunteer coverage',level:'Medium',event:'TechFest 2026',owner:'Meera',detail:'Two operations shifts still need coverage.'},{id:3,title:'Speaker response',level:'Low',event:'AI Workshop',owner:'Dev',detail:'Waiting for final travel confirmation.'}],
 announcements:[{id:1,title:'TechFest volunteer briefing',audience:'Volunteers',tone:'Friendly',date:'2026-09-19',body:'Volunteer briefing is scheduled for Monday at 5 PM.'},{id:2,title:'AI Workshop registration reminder',audience:'All members',tone:'Professional',date:'2026-09-18',body:'Registration closes this weekend. Please share the form.'}],
 settings:{newMembers:'Volunteer',invite:'Leads only',approve:true,aiModel:'Gemini',aiAct:'Ask first',createTasks:true,assign:true,remind:true,post:false,review:true,findActions:true,due:'1 week after the meeting',owner:'Suggest the least busy member',riskSensitivity:'Medium',flagNoOwner:true,markRisk:'1 day before it is due',deadlineReminders:true,remindMe:'1 day before',riskAlerts:true,meetingSummaries:true,notifyTo:'ClubOps AI only',tone:'Friendly',useDocs:true,includeNotes:true,sources:true,theme:'System',density:'Comfortable',twoStep:false},
};
let state=load(); let current='dashboard'; let settingsSection='club';
function load(){try{return {...seed,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return structuredClone(seed)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
const nav=[['dashboard','▦','Dashboard'],['events','◈','Events'],['tasks','✓','Tasks'],['volunteers','♙','Volunteers'],['meetings','◷','Meetings'],['documents','▤','Documents'],['risks','△','Risks'],['announcements','◌','Announcements'],['assistant','✦','AI Assistant']];
const content=document.getElementById('content');
function renderNav(){document.getElementById('nav').innerHTML=`<div class="nav-section">Workspace</div>`+nav.map(n=>`<button class="nav-item ${current===n[0]?'active':''}" data-view="${n[0]}"><span class="nav-icon">${n[1]}</span><span>${n[2]}</span></button>`).join('')+`<div class="nav-section">Manage</div><button class="nav-item ${current==='settings'?'active':''}" data-view="settings"><span class="nav-icon">⚙</span><span>Settings</span></button>`}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function pageHead(title,desc,button,handler=''){return `<div class="page-head"><div><div class="eyebrow">CLUBOPS AI</div><h1>${title}</h1><p>${desc}</p></div>${button?`<div class="actions"><button class="btn primary" data-action="${handler}">${button}</button></div>`:''}</div>`}
function panel(title,body,extra=''){return `<section class="panel"><div class="panel-head"><h3>${title}</h3><span>${extra}</span></div><div class="panel-body">${body}</div></section>`}
function badge(v){let c=v==='High'?'b-red':v==='Medium'?'b-amber':v==='Low'?'b-green':v==='Done'||v==='Ready'?'b-green':v==='In progress'?'b-blue':'b-purple';return `<span class="badge ${c}">${esc(v)}</span>`}
function dashboard(){let done=state.tasks.filter(t=>t.status==='Done').length;let due=state.tasks.filter(t=>t.status!=='Done').length;return pageHead('Good evening, Hasti 👋','Plan events, coordinate volunteers, and let AI keep operations moving.','New event','new-event')+`<div class="grid stats"><div class="stat"><div class="label">Active events</div><div class="num">${state.events.length}</div><div class="delta">● On track</div></div><div class="stat"><div class="label">Open tasks</div><div class="num">${due}</div><div class="delta">${done} completed</div></div><div class="stat"><div class="label">Volunteers</div><div class="num">${state.volunteers.length}</div><div class="delta">${state.volunteers.filter(v=>v.status==='Pending').length} pending approval</div></div><div class="stat"><div class="label">Open risks</div><div class="num">${state.risks.length}</div><div class="delta">${state.risks.filter(r=>r.level==='High').length} high priority</div></div></div><div style="height:16px"></div><div class="grid two">${panel('Upcoming events',state.events.map(e=>`<div class="event-card"><div style="display:flex;justify-content:space-between;gap:10px"><div><h3>${esc(e.name)}</h3><div class="event-meta">${e.date} · ${esc(e.venue)} · Lead: ${esc(e.lead)}</div></div>${badge(e.status)}</div><div style="margin-top:14px"><div style="display:flex;justify-content:space-between;font-size:10px;color:#697386;margin-bottom:6px"><span>Readiness</span><b>${e.progress}%</b></div><div class="progress"><span style="width:${e.progress}%"></span></div></div></div>`).join('')||'<div class="empty">No events yet.</div>','')}${panel('AI operations pulse',`<div class="notice"><b>AI found ${state.risks.length} operational risks.</b><br>Use the AI Assistant to extract actions from meeting notes or draft announcements.</div><div style="height:12px"></div><div class="kpi"><b>Tasks without owner</b><span>${state.tasks.filter(t=>!t.owner).length}</span></div><div class="kpi"><b>High-priority tasks</b><span>${state.tasks.filter(t=>t.priority==='High'&&t.status!=='Done').length}</span></div><div class="kpi"><b>Announcements drafted</b><span>${state.announcements.length}</span></div><button class="btn small" data-view="assistant" style="margin-top:8px">Open AI Assistant →</button>`,'') }</div><div style="height:16px"></div><div class="grid two">${panel('Recent tasks',`<table class="table"><thead><tr><th>Task</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead><tbody>${state.tasks.slice(0,5).map(t=>`<tr><td>${esc(t.title)}</td><td>${esc(t.owner)}</td><td>${esc(t.due)}</td><td>${badge(t.status)}</td></tr>`).join('')}</tbody></table>`,'')}${panel('Recent activity',`<div class="timeline"><div class="dot"></div><div><b>AI extracted action items</b><p>From TechFest weekly sync · 10 min ago</p></div></div><div class="timeline"><div class="dot"></div><div><b>Volunteer sign-up approved</b><p>Dev joined Tech team · 2h ago</p></div></div><div class="timeline"><div class="dot"></div><div><b>Risk flagged</b><p>Venue confirmation pending · 3h ago</p></div></div>`,'') }</div>`}
function events(){return pageHead('Events','Plan every event from kickoff to final readiness.','Create event','new-event')+`<div class="grid three">${state.events.map(e=>`<div class="panel"><div class="event-card"><div style="display:flex;justify-content:space-between">${badge(e.status)}<button class="btn small" data-edit="event:${e.id}">Edit</button></div><h3 style="margin-top:16px">${esc(e.name)}</h3><div class="event-meta">${esc(e.date)} · ${esc(e.venue)}</div><div style="margin-top:16px" class="event-meta">Event lead: <b>${esc(e.lead)}</b></div><div style="margin-top:12px" class="progress"><span style="width:${e.progress}%"></span></div><div style="font-size:10px;color:#697386;margin-top:5px">${e.progress}% ready</div></div></div>`).join('')}</div>`}
function tasks(){return pageHead('Tasks','Assign owners, due dates, priorities, and dependencies.','Add task','new-task')+panel('Task board',`<div class="actions" style="margin-bottom:12px"><button class="btn small" data-filter="all">All</button><button class="btn small" data-filter="Todo">Todo</button><button class="btn small" data-filter="In progress">In progress</button><button class="btn small" data-filter="Done">Done</button></div><table class="table"><thead><tr><th>Task</th><th>Event</th><th>Owner</th><th>Due</th><th>Priority</th><th>Status</th><th></th></tr></thead><tbody>${state.tasks.map(t=>`<tr data-task-row data-status="${t.status}"><td><b>${esc(t.title)}</b></td><td>${esc(t.event)}</td><td>${esc(t.owner||'Unassigned')}</td><td>${esc(t.due)}</td><td>${badge(t.priority)}</td><td>${badge(t.status)}</td><td><button class="btn small" data-edit="task:${t.id}">Edit</button></td></tr>`).join('')}</tbody></table>`,'')}
function volunteers(){return pageHead('Volunteers','Manage members, teams, roles, hours, and approvals.','Add volunteer','new-volunteer')+panel('Team and roles',`<table class="table"><thead><tr><th>Member</th><th>Role</th><th>Team</th><th>Status</th><th>Hours</th><th></th></tr></thead><tbody>${state.volunteers.map(v=>`<tr><td><div class="person"><span class="avatar-sm">${esc(v.name[0])}</span>${esc(v.name)}</div></td><td>${esc(v.role)}</td><td>${esc(v.team)}</td><td>${badge(v.status)}</td><td>${v.hours}h</td><td><button class="btn small" data-edit="volunteer:${v.id}">Edit</button></td></tr>`).join('')}</tbody></table>`,'')}
function meetings(){return pageHead('Meetings','Capture notes, process transcripts, and extract action items.','New meeting','new-meeting')+`<div class="grid two">${panel('Meeting notes',state.meetings.map(m=>`<div class="event-card"><div style="display:flex;justify-content:space-between"><div><h3>${esc(m.title)}</h3><div class="event-meta">${m.date} · ${m.attendees} attendees</div></div><button class="btn small" data-action="process-meeting" data-id="${m.id}">✨ Process with AI</button></div><p style="font-size:11px;line-height:1.6;color:#475467">${esc(m.notes)}</p></div>`).join(''),'')}${panel('AI extraction preview',`
  <div id="meetingAiPreview">
    <div class="notice">
      Select “Process with AI” on a meeting to extract tasks,
      owners, deadlines, and risks.
    </div>

    <div style="height:12px"></div>

    <div class="checklist">
      <div class="check">✓ <span>Action item extraction</span></div>
      <div class="check">✓ <span>Suggested owner assignment</span></div>
      <div class="check">✓ <span>Suggested due dates</span></div>
      <div class="check">✓ <span>Risk detection</span></div>
    </div>
  </div>
`,'')}</div>`}
function documents(){return pageHead('Documents','Keep event plans, handbooks, checklists, and other files searchable.','Add document','new-document')+`<div class="grid two">${panel('Knowledge repository',state.documents.map(d=>`<div class="doc"><div class="doc-icon">▤</div><div style="flex:1"><b>${esc(d.name)}</b><small>${d.type} · ${d.size} · Updated ${d.updated}${d.path?` · ${esc(d.path)}`:''}</small></div><button class="btn small" data-action="view-doc" data-id="${d.id}">Open</button></div>`).join(''),'')}${panel('AI retrieval',`<div class="notice"><b>Sources enabled.</b><br>AI can use club documents and meeting notes when answering questions.</div><div style="height:15px"></div><div class="kpi"><b>Indexed documents</b><span>${state.documents.length}</span></div><div class="kpi"><b>Meeting notes included</b><span>${state.settings.includeNotes?'Yes':'No'}</span></div><button class="btn small" data-view="settings">Knowledge settings →</button>`,'')}</div>`}
function risks(){return pageHead('Risks','Identify operational problems early and track mitigations.','Scan for risks','scan-risks')+`<div class="grid two">${panel('Open risks',state.risks.map(r=>`<div class="risk-card"><div class="risk-title"><b>${esc(r.title)}</b>${badge(r.level)}</div><p>${esc(r.detail)}</p><div class="event-meta">${esc(r.event)} · Owner: ${esc(r.owner)}</div></div>`).join(''),'')}${panel('Risk engine',`<div class="notice">Current sensitivity: <b>${state.settings.riskSensitivity}</b>. Higher sensitivity flags more issues, including smaller dependencies.</div><div style="height:14px"></div><div class="kpi"><b>High</b><span>${state.risks.filter(r=>r.level==='High').length}</span></div><div class="kpi"><b>Medium</b><span>${state.risks.filter(r=>r.level==='Medium').length}</span></div><div class="kpi"><b>Low</b><span>${state.risks.filter(r=>r.level==='Low').length}</span></div>`,'')}</div>`}
function announcements(){return pageHead('Announcements','Draft and review club communication before it reaches members.','Draft announcement','new-announcement')+`<div class="grid two">${panel('Announcement drafts',state.announcements.map(a=>`<div class="event-card"><div style="display:flex;justify-content:space-between"><div><h3>${esc(a.title)}</h3><div class="event-meta">${esc(a.audience)} · ${esc(a.date)} · ${esc(a.tone)}</div></div>${badge('Draft')}</div><p style="font-size:11px;color:#475467;line-height:1.6">${esc(a.body)}</p><div class="actions"><button class="btn small" data-edit="announcement:${a.id}">Edit</button><button class="btn small" data-action="publish" data-id="${a.id}">Publish</button></div></div>`).join(''),'')}${panel('AI writing controls',`<div class="kpi"><b>Post announcements automatically</b><button class="toggle ${state.settings.post?'on':''}" data-setting="post"><span></span></button></div><div class="kpi"><b>Review before posting</b><button class="toggle ${state.settings.review?'on':''}" data-setting="review"><span></span></button></div><div class="kpi"><b>Tone</b><span>${esc(state.settings.tone)}</span></div>`,'')}</div>`}
function assistant(){return pageHead('AI Assistant','Turn planning, meeting notes, and club knowledge into actions.','Generate event plan','ai-plan')+`<div class="ai-shell"><section class="panel chat"><div class="panel-head"><h3>ClubOps AI</h3><span>Model: ${esc(state.settings.aiModel)} · ${esc(state.settings.aiAct)}</span></div><div id="messages" class="messages"><div class="msg ai">Hi! I’m your ClubOps AI assistant. I can plan events, extract action items, identify risks, draft announcements, and help you find information in the club knowledge base.</div></div><div class="suggestions"><button data-ai-prompt="Extract tasks from these meeting notes: Confirm venue. Send sponsor deck. Recruit volunteers.">Extract tasks</button><button data-ai-prompt="Find risks for TechFest 2026">Find risks</button><button data-ai-prompt="Draft a friendly announcement for our volunteer briefing">Draft announcement</button></div><div class="chat-input"><input id="aiInput" placeholder="Ask ClubOps AI anything..."/><button class="btn primary" id="sendAI">Send</button></div></section>${panel('AI actions',`<div class="notice"><b>Action mode: ${esc(state.settings.aiAct)}</b><br>When “Ask first” is selected, the assistant proposes application changes and waits for approval.</div><div style="height:14px"></div><div class="checklist"><div class="check">✓ <span>Create tasks from notes</span></div><div class="check">✓ <span>Assign owners and due dates</span></div><div class="check">✓ <span>Remind volunteers</span></div><div class="check">✓ <span>Draft announcements</span></div><div class="check">✓ <span>Flag risks</span></div></div><button class="btn small" data-view="settings" style="margin-top:15px">Configure AI behavior →</button>`,'')}</div>`}
function settings(){const sections=[['club','Club'],['team','Team and roles'],['ai','AI assistant'],['meetings','Meetings, tasks, and risks'],['notifications','Notifications and announcements'],['knowledge','Knowledge base'],['appearance','Appearance and security']];let body='';if(settingsSection==='club')body=`<div class="setting-section"><h3>Club</h3><p>Basic details used across ClubOps AI.</p>${settingInput('Club name','club.name',state.club.name)}${settingInput('College','club.college',state.club.college)}${settingInput('Club email','club.email',state.club.email)}${settingSelect('Time zone','club.timezone',state.club.timezone,['Asia/Kolkata','UTC','America/New_York','Europe/London'])}</div>`;if(settingsSection==='team')body=`<div class="setting-section"><h3>Team and roles</h3><p>Decide who can join and who can invite.</p>${settingSelect('New members join as','newMembers',state.settings.newMembers,['Volunteer','Member','Lead'])}${settingSelect('Who can invite members','invite',state.settings.invite,['Leads only','Anyone','Admins only'])}${toggleRow('Approve volunteer sign-ups','approve','New volunteers wait for a lead to accept them.')}</div>`;if(settingsSection==='ai')body=`<div class="setting-section"><h3>AI assistant</h3><p>Choose the model and how much it can do without you.</p>${settingSelect('AI model','aiModel',state.settings.aiModel,['Gemini','GPT','Claude','Local model'])}<div class="setting-row"><div class="setting-label"><b>How the AI acts</b><small>Suggest only never changes anything. Ask first shows each action for approval. Auto runs allowed actions right away.</small></div><div class="segmented">${['Suggest only','Ask first','Auto'].map(v=>`<button class="${state.settings.aiAct===v?'active':''}" data-ai-act="${v}">${v}</button>`).join('')}</div></div>${toggleRow('Create tasks','createTasks','From meeting notes and event plans.')}${toggleRow('Assign owners and due dates','assign','')}${toggleRow('Remind volunteers','remind','Nudge people about tasks and shifts.')}${toggleRow('Post announcements','post','')}${toggleRow('Review announcements before posting','review','Recommended, even when the AI acts on its own.')}</div>`;if(settingsSection==='meetings')body=`<div class="setting-section"><h3>Meetings, tasks, and risks</h3><p>Turn notes into tasks and catch problems early.</p>${toggleRow('Find action items in meeting notes','findActions','Pulls tasks, owners, and deadlines out of notes and transcripts.')}${settingSelect('Due date when none is mentioned','due',state.settings.due,['1 week after the meeting','3 days after the meeting','1 day before event'])}${settingSelect('Owner when none is named','owner',state.settings.owner,['Suggest the least busy member','Suggest the event lead','Leave unassigned'])}<div class="setting-row"><div class="setting-label"><b>Risk sensitivity</b><small>Higher flags more issues, including small ones.</small></div><div class="segmented">${['Low','Medium','High'].map(v=>`<button class="${state.settings.riskSensitivity===v?'active':''}" data-risk="${v}">${v}</button>`).join('')}</div></div>${toggleRow('Flag tasks with no owner','flagNoOwner','')}${settingSelect('Mark a task at risk','markRisk',state.settings.markRisk,['1 day before it is due','2 days before it is due','3 days before it is due'])}</div>`;if(settingsSection==='notifications')body=`<div class="setting-section"><h3>Notifications and announcements</h3><p>Choose what reaches you and how drafts sound.</p>${toggleRow('Deadline reminders','deadlineReminders','')}${settingSelect('Remind me','remindMe',state.settings.remindMe,['1 day before','2 days before','1 week before'])}${toggleRow('Risk alerts','riskAlerts','When the AI finds a problem with an event.')}${toggleRow('Meeting summaries','meetingSummaries','Sent after each meeting with its action items.')}${settingSelect('Send notifications to','notifyTo',state.settings.notifyTo,['ClubOps AI only','Club leads','All members'])}${settingSelect('Announcement tone','tone',state.settings.tone,['Friendly','Professional','Concise','Energetic'])}</div>`;if(settingsSection==='knowledge')body=`<div class="setting-section"><h3>Knowledge base</h3><p>Control what the AI can read and quote.</p>${toggleRow('Use club documents','useDocs','Lets the AI answer from files in your club repository.')}${toggleRow('Include meeting notes','includeNotes','')}${toggleRow('Show sources with answers','sources','')}${settingButton('Re-index documents','Refresh what the AI knows after large uploads.')}</div>`;if(settingsSection==='appearance')body=`<div class="setting-section"><h3>Appearance and security</h3><p>Theme changes preview right away. Save to keep them.</p><div class="setting-row"><div class="setting-label"><b>Theme</b></div><div class="segmented">${['System','Light','Dark'].map(v=>`<button class="${state.settings.theme===v?'active':''}" data-theme="${v}">${v}</button>`).join('')}</div></div><div class="setting-row"><div class="setting-label"><b>Density</b><small>Compact fits more on screen.</small></div><div class="segmented">${['Comfortable','Compact'].map(v=>`<button class="${state.settings.density===v?'active':''}" data-density="${v}">${v}</button>`).join('')}</div></div>${toggleRow('Two-step verification','twoStep','Ask for a code when you sign in on a new device.')}<div class="setting-row"><div class="setting-label"><b>Other devices</b><small>End every session except this one.</small></div><button class="btn small" data-action="signout">Sign out others</button></div></div>`;return pageHead('Settings','Set up your club, your team, and how much the AI can do for you while you plan events.')+`<div class="setting-layout"><div class="setting-nav">${sections.map(s=>`<button class="setting-link ${settingsSection===s[0]?'active':''}" data-setting-section="${s[0]}">${s[1]}</button>`).join('')}</div><div>${panel('',body,'')}</div></div>`}
function settingInput(label,path,value){return `<div class="setting-row"><div class="setting-label"><b>${label}</b></div><input data-setting-input="${path}" value="${esc(value)}" style="width:300px;border:1px solid #dfe3ea;border-radius:8px;padding:9px;font-size:11px"></div>`}
function settingSelect(label,key,value,opts){return `<div class="setting-row"><div class="setting-label"><b>${label}</b></div><select data-setting-select="${key}" style="width:250px;border:1px solid #dfe3ea;border-radius:8px;padding:9px;font-size:11px">${opts.map(o=>`<option ${o===value?'selected':''}>${o}</option>`).join('')}</select></div>`}
function toggleRow(label,key,help=''){return `<div class="setting-row"><div class="setting-label"><b>${label}</b>${help?`<small>${help}</small>`:''}</div><button class="toggle ${state.settings[key]?'on':''}" data-setting="${key}"><span></span></button></div>`}
function settingButton(label,help){return `<div class="setting-row"><div class="setting-label"><b>${label}</b><small>${help}</small></div><button class="btn small" data-action="reindex">Re-index now</button></div>`}
function render(){
  renderNav();

  const pages={
    dashboard,
    events,
    tasks,
    volunteers,
    meetings,
    documents,
    risks,
    announcements,
    assistant,
    settings
  };

  content.innerHTML=pages[current]();
  applyTheme();

  if(current==='assistant'){
    const sendAI=document.getElementById('sendAI');
    const aiInput=document.getElementById('aiInput');

    if(sendAI){
      sendAI.onclick=()=>{
        if(aiInput.value.trim()){
          askAI(aiInput.value);
          aiInput.value='';
        }
      };
    }

    if(aiInput){
      aiInput.addEventListener('keydown',e=>{
        if(e.key==='Enter'){
          sendAI?.click();
        }
      });
    }
  }
}
function openModal(title,inner,onSave){document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h3>${title}</h3><button class="close" id="closeModal">×</button></div><div class="modal-body">${inner}</div><div class="modal-foot"><button class="btn" id="cancelModal">Cancel</button><button class="btn primary" id="saveModal">Save</button></div></div></div>`;document.getElementById('closeModal').onclick=closeModal;document.getElementById('cancelModal').onclick=closeModal;document.getElementById('saveModal').onclick=()=>{onSave();closeModal();save();render();toast('Saved successfully');}}
function closeModal(){document.getElementById('modalRoot').innerHTML=''}
function formFields(type,item={}){if(type==='event')return `<div class="form-grid"><div class="field"><label>Event name</label><input id="f-name" value="${esc(item.name||'')}" placeholder="e.g. TechFest 2026"></div><div class="field"><label>Date</label><input id="f-date" type="date" value="${esc(item.date||'')}" /></div><div class="field"><label>Venue</label><input id="f-venue" value="${esc(item.venue||'')}" placeholder="Main Auditorium"></div><div class="field"><label>Lead</label><input id="f-lead" value="${esc(item.lead||'')}" placeholder="Club lead"></div></div>`;if(type==='task')return `<div class="form-grid"><div class="field full"><label>Task title</label><input id="f-title" value="${esc(item.title||'')}" /></div><div class="field"><label>Event</label><select id="f-event">${state.events.map(e=>`<option ${e.name===item.event?'selected':''}>${esc(e.name)}</option>`).join('')}</select></div><div class="field"><label>Owner</label><select id="f-owner"><option>Unassigned</option>${state.volunteers.map(v=>`<option ${v.name===item.owner?'selected':''}>${esc(v.name)}</option>`).join('')}</select></div><div class="field"><label>Due date</label><input id="f-due" type="date" value="${esc(item.due||'')}" /></div><div class="field"><label>Priority</label><select id="f-priority">${['Low','Medium','High'].map(x=>`<option ${x===item.priority?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Status</label><select id="f-status">${['Todo','In progress','Done'].map(x=>`<option ${x===item.status?'selected':''}>${x}</option>`).join('')}</select></div></div>`;if(type==='volunteer')return `<div class="form-grid"><div class="field"><label>Name</label><input id="f-name" value="${esc(item.name||'')}" /></div><div class="field"><label>Role</label><input id="f-role" value="${esc(item.role||'Volunteer')}" /></div><div class="field"><label>Team</label><input id="f-team" value="${esc(item.team||'Operations')}" /></div><div class="field"><label>Status</label><select id="f-status"><option>Active</option><option>Pending</option></select></div></div>`;if(type==='meeting')return `<div class="form-grid"><div class="field full"><label>Meeting title</label><input id="f-title" /></div><div class="field"><label>Date</label><input id="f-date" type="date" value="${new Date().toISOString().slice(0,10)}" /></div><div class="field"><label>Attendees</label><input id="f-attendees" type="number" value="5" /></div><div class="field full"><label>Notes / transcript</label><textarea id="f-notes" placeholder="Paste meeting notes or transcript..."></textarea></div></div>`;if(type==='announcement')return `<div class="form-grid"><div class="field full"><label>Title</label><input id="f-title" /></div><div class="field"><label>Audience</label><select id="f-audience"><option>All members</option><option>Volunteers</option><option>Leads</option></select></div><div class="field"><label>Tone</label><select id="f-tone"><option>Friendly</option><option>Professional</option><option>Concise</option></select></div><div class="field full"><label>Message</label><textarea id="f-body" placeholder="What should members know?"></textarea></div></div>`;if(type==='document')return `<div class="form-grid"><div class="field full"><label>Document name</label><input id="f-name" value="${esc(item.name||'')}" placeholder="Event plan.pdf" /></div><div class="field full"><label>Document path</label><input id="f-path" value="${esc(item.path||'')}" placeholder="C:\\Users\\Hasti\\Documents\\Event Plan.pdf" /><small style="color:#697386">Enter the full path of the document on this computer.</small></div><div class="field"><label>Type</label><select id="f-type"><option ${item.type==='PDF'?'selected':''}>PDF</option><option ${item.type==='DOCX'?'selected':''}>DOCX</option><option ${item.type==='XLSX'?'selected':''}>XLSX</option><option ${item.type==='TXT'?'selected':''}>TXT</option></select></div><div class="field"><label>Size</label><input id="f-size" value="${esc(item.size||'')}" placeholder="250 KB" /></div></div>`}
function create(type,id){let item=id?state[type+'s'].find(x=>String(x.id)===String(id)):{};const labels={event:'Event',task:'Task',volunteer:'Volunteer',meeting:'Meeting',announcement:'Announcement',document:'Document'};openModal(`${id?'Edit':'Create'} ${labels[type]}`,formFields(type,item),()=>{if(type==='event'){const x={id:item.id||Date.now(),name:val('f-name'),date:val('f-date'),venue:val('f-venue'),lead:val('f-lead'),status:item.status||'Planning',progress:item.progress||10};upsert('events',x)}if(type==='task'){const x={id:item.id||Date.now(),title:val('f-title'),event:val('f-event'),owner:val('f-owner'),due:val('f-due'),priority:val('f-priority'),status:val('f-status')};upsert('tasks',x)}if(type==='volunteer'){const x={id:item.id||Date.now(),name:val('f-name'),role:val('f-role'),team:val('f-team'),status:val('f-status'),hours:item.hours||0};upsert('volunteers',x)}if(type==='meeting'){state.meetings.unshift({id:Date.now(),title:val('f-title'),date:val('f-date'),attendees:Number(val('f-attendees')),notes:val('f-notes')})}if(type==='announcement'){state.announcements.unshift({id:Date.now(),title:val('f-title'),audience:val('f-audience'),tone:val('f-tone'),date:new Date().toISOString().slice(0,10),body:val('f-body')})}if(type==='document'){const docPath=val('f-path').trim();if(!docPath){toast('Please enter the document path');return}const fallbackName=docPath.split(/[\\\\/]/).pop()||'Untitled document';const fallbackExt=(fallbackName.split('.').pop()||'').toUpperCase();const knownTypes=['PDF','DOCX','XLSX','TXT'];state.documents.unshift({id:Date.now(),name:val('f-name').trim()||fallbackName,path:docPath,type:knownTypes.includes(fallbackExt)?fallbackExt:val('f-type'),size:val('f-size')||'—',updated:'Just now'});save()}})}
function upsert(k,x){const i=state[k].findIndex(a=>a.id===x.id);if(i<0)state[k].push(x);else state[k][i]=x}
function val(id){return document.getElementById(id)?.value||''}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function applyTheme(){document.body.dataset.theme=state.settings.theme;document.body.classList.toggle('compact',state.settings.density==='Compact');if(state.settings.theme==='Dark'){document.documentElement.style.setProperty('--bg','#0f172a');document.documentElement.style.setProperty('--panel','#111827');document.documentElement.style.setProperty('--text','#e5e7eb');document.documentElement.style.setProperty('--muted','#9ca3af');document.documentElement.style.setProperty('--line','#263244')}else{document.documentElement.style.setProperty('--bg','#f6f7fb');document.documentElement.style.setProperty('--panel','#fff');document.documentElement.style.setProperty('--text','#18212f');document.documentElement.style.setProperty('--muted','#697386');document.documentElement.style.setProperty('--line','#e6e9ef')}}
async function askAI(prompt){const box=document.getElementById('messages');if(!box)return;box.insertAdjacentHTML('beforeend',`<div class="msg user">${esc(prompt)}</div>`);const res=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:inferAction(prompt),input:prompt,context:state})});const data=await res.json();let r=data.response;let html='';if(r.answer)html=esc(r.answer);if(r.summary)html=`<b>Summary</b><br>${esc(r.summary)}<br><br><b>Suggested tasks</b><br>${r.tasks?.map(t=>`• ${esc(t.title)} — ${esc(t.owner)}, ${esc(t.due)}`).join('<br>')||'None'}`;if(r.risks)html=`<b>Risks detected</b><br>${r.risks.map(x=>`• ${badge(x.level)} ${esc(x.title)} — ${esc(x.detail)}`).join('<br>')}`;if(r.draft)html=`<b>Draft announcement</b><br><br>${esc(r.draft).replace(/\n/g,'<br>')}`;if(r.plan)html=`<b>Event plan</b><br>${r.plan.map(x=>'• '+esc(x)).join('<br>')}`;box.insertAdjacentHTML('beforeend',`<div class="msg ai">${html}</div>`);box.scrollTop=box.scrollHeight}
function inferAction(p){if(/meeting|notes|transcript|extract task|action item/i.test(p))return'meeting';if(/risk|problem|issue|danger/i.test(p))return'risk';if(/announcement|message|draft/i.test(p))return'announcement';if(/plan|planning|event plan/i.test(p))return'plan';return'chat'}
async function processMeeting(id){
  const m=state.meetings.find(x=>x.id==id);
  const preview=document.getElementById('meetingAiPreview');

  if(!m || !preview) return;

  preview.innerHTML=`
    <div class="notice">
      <b>Processing meeting with AI...</b><br>
      Extracting action items, owners, deadlines, and risks.
    </div>
  `;

  try{
    const res=await fetch('/api/ai',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        action:'meeting',
        input:`Analyze these meeting notes and extract:
1. Action items
2. Suggested owners
3. Suggested deadlines
4. Risks

Meeting: ${m.title}

Notes:
${m.notes}`,
        context:state
      })
    });

    const data=await res.json();
    const r=data.response||{};

    let html='';

    if(r.summary){
      html+=`
        <div class="notice">
          <b>Summary</b><br>
          ${esc(r.summary)}
        </div>
        <div style="height:12px"></div>
      `;
    }

    if(r.tasks && r.tasks.length){
      html+=`
        <h4 style="margin:0 0 8px">Action items</h4>
        <div class="checklist">
          ${r.tasks.map(t=>`
            <div class="check">
              ✓
              <span>
                <b>${esc(t.title||'Action item')}</b><br>
                <small>
                  Owner: ${esc(t.owner||'Suggested owner')} ·
                  Due: ${esc(t.due||'Suggested date')}
                </small>
              </span>
            </div>
          `).join('')}
        </div>
        <div style="height:16px"></div>
      `;
    }

    if(r.risks && r.risks.length){
      html+=`
        <h4 style="margin:0 0 8px">Risks detected</h4>
        ${r.risks.map(x=>`
          <div class="risk-card">
            <div class="risk-title">
              <b>${esc(x.title||'Risk')}</b>
              ${badge(x.level||'Medium')}
            </div>
            <p>${esc(x.detail||'')}</p>
          </div>
        `).join('')}
      `;
    }

    if(!html){
      html=`
        <div class="notice">
          <b>AI processing completed.</b><br>
          No structured action items or risks were returned.
        </div>
      `;
    }

    preview.innerHTML=html;
    toast('Meeting processed successfully');

  }catch(error){
    console.error(error);

    preview.innerHTML=`
      <div class="notice" style="border-color:#fca5a5">
        <b>AI processing failed</b><br>
        Please check that the AI server is running and try again.
      </div>
    `;

    toast('AI processing failed');
  }
}function handleAction(a,el){if(a==='new-event')create('event');if(a==='new-task')create('task');if(a==='new-volunteer')create('volunteer');if(a==='new-meeting')create('meeting');if(a==='new-announcement')create('announcement');if(a==='new-document')create('document');if(a==='ai-plan'){current='assistant';render();setTimeout(()=>askAI('Create an event plan for our next college club event.'),50)}if(a==='process-meeting')processMeeting(el.dataset.id);if(a==='scan-risks'){const text=state.tasks.map(t=>`${t.title} ${t.status} ${t.owner}`).join('. ');askAI(`Find risks in these event tasks: ${text}`);toast('AI risk scan complete')}if(a==='publish')toast('Announcement marked ready to publish');if(a==='reindex')toast('Knowledge base re-indexed');if(a==='signout')toast('Other sessions signed out');if(a==='view-doc'){const doc=state.documents.find(x=>String(x.id)===String(el.dataset.id));if(!doc?.path){toast('No document path saved');return}fetch('/api/documents/open',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:doc.path})}).then(r=>r.json()).then(data=>{if(data.ok)toast('Document opened');else toast(data.error||'Could not open document')}).catch(()=>toast('Could not connect to the server'))}}
document.addEventListener('click',e=>{const v=e.target.closest('[data-view]')?.dataset.view;if(v){current=v;render();return}const a=e.target.closest('[data-action]');if(a){handleAction(a.dataset.action,a);return}const edit=e.target.closest('[data-edit]')?.dataset.edit;if(edit){const [type,id]=edit.split(':');create(type,id);return}const sec=e.target.closest('[data-setting-section]')?.dataset.settingSection;if(sec){settingsSection=sec;render();return}const tog=e.target.closest('[data-setting]');if(tog){state.settings[tog.dataset.setting]=!state.settings[tog.dataset.setting];save();render();toast('Setting updated');return}const aiAct=e.target.closest('[data-ai-act]')?.dataset.aiAct;if(aiAct){state.settings.aiAct=aiAct;save();render();toast('AI behavior updated');return}const risk=e.target.closest('[data-risk]')?.dataset.risk;if(risk){state.settings.riskSensitivity=risk;save();render();return}const theme=e.target.closest('[data-theme]')?.dataset.theme;if(theme){state.settings.theme=theme;save();render();return}const density=e.target.closest('[data-density]')?.dataset.density;if(density){state.settings.density=density;save();render();return}const prompt=e.target.closest('[data-ai-prompt]')?.dataset.aiPrompt;if(prompt){if(current!=='assistant'){current='assistant';render();setTimeout(()=>askAI(prompt),30)}else askAI(prompt);return}const filter=e.target.closest('[data-filter]')?.dataset.filter;if(filter){document.querySelectorAll('[data-task-row]').forEach(r=>r.style.display=(filter==='all'||r.dataset.status===filter)?'':'none');return}});
document.addEventListener('change',e=>{const s=e.target.closest('[data-setting-select]');if(s){state.settings[s.dataset.settingSelect]=e.target.value;save();toast('Setting updated')}const inp=e.target.closest('[data-setting-input]');if(inp){const [obj,key]=inp.dataset.settingInput.split('.');state[obj][key]=e.target.value;save();toast('Saved')}});
// Global search
document.addEventListener('input', e => {
  if (e.target.id !== 'globalSearch') return;

  const query = e.target.value.trim().toLowerCase();
  const results = document.getElementById('searchResults');

  if (!results) return;

  if (!query) {
    results.innerHTML = '';
    results.style.display = 'none';
    return;
  }

  const items = [];

  state.events?.forEach(x => {
    if (
      x.name?.toLowerCase().includes(query) ||
      x.description?.toLowerCase().includes(query)
    ) {
      items.push({ type: 'Event', title: x.name, page: 'events' });
    }
  });

  state.tasks?.forEach(x => {
    if (
      x.title?.toLowerCase().includes(query) ||
      x.description?.toLowerCase().includes(query)
    ) {
      items.push({ type: 'Task', title: x.title, page: 'tasks' });
    }
  });

  state.volunteers?.forEach(x => {
    if (
      x.name?.toLowerCase().includes(query) ||
      x.role?.toLowerCase().includes(query)
    ) {
      items.push({ type: 'Volunteer', title: x.name, page: 'volunteers' });
    }
  });

  state.meetings?.forEach(x => {
    if (
      x.title?.toLowerCase().includes(query) ||
      x.notes?.toLowerCase().includes(query)
    ) {
      items.push({ type: 'Meeting', title: x.title, page: 'meetings' });
    }
  });

  state.documents?.forEach(x => {
    if (
      x.name?.toLowerCase().includes(query) ||
      x.description?.toLowerCase().includes(query)
    ) {
      items.push({ type: 'Document', title: x.name, page: 'documents' });
    }
  });

  state.risks?.forEach(x => {
    if (
      x.title?.toLowerCase().includes(query) ||
      x.description?.toLowerCase().includes(query)
    ) {
      items.push({ type: 'Risk', title: x.title, page: 'risks' });
    }
  });

  if (!items.length) {
    results.innerHTML = `
      <div class="search-empty">No results found</div>
    `;
  } else {
    results.innerHTML = items.slice(0, 8).map((item, index) => `
      <div class="search-result" data-page="${item.page}">
        <div class="search-result-type">${item.type}</div>
        <div>${item.title || 'Untitled'}</div>
      </div>
    `).join('');
  }

  results.style.display = 'block';
});

document.addEventListener('click', e => {
  const result = e.target.closest('.search-result');

  if (result) {
    current = result.dataset.page;
    render();

    const search = document.getElementById('globalSearch');
    if (search) search.value = '';

    const results = document.getElementById('searchResults');
    if (results) results.style.display = 'none';
  }
});
// =============================
// Header: Notifications + Profile
// =============================

function closeHeaderMenus() {
  document.getElementById('notificationPanel')?.remove();
  document.getElementById('profilePanel')?.remove();
}

function showNotifications() {
  closeHeaderMenus();

  const panel = document.createElement('div');
  panel.id = 'notificationPanel';

  panel.style.cssText = `
    position: fixed;
    top: 68px;
    right: 76px;
    width: 330px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    box-shadow: 0 12px 35px rgba(0,0,0,.15);
    z-index: 9999;
    overflow: hidden;
  `;

  panel.innerHTML = `
    <div style="
      padding:16px;
      border-bottom:1px solid #eef0f3;
      display:flex;
      justify-content:space-between;
      align-items:center;
    ">
      <strong style="font-size:15px;">Notifications</strong>
      <button id="clearNotifications"
        style="border:0;background:none;color:#2563eb;cursor:pointer;font-size:12px;">
        Mark all read
      </button>
    </div>

    <div style="padding:8px 0;">
      <div class="header-notification-item">
        <div class="notification-dot red"></div>
        <div>
          <b>Venue confirmation pending</b>
          <small>High priority risk · TechFest 2026</small>
        </div>
      </div>

      <div class="header-notification-item">
        <div class="notification-dot amber"></div>
        <div>
          <b>2 tasks need attention</b>
          <small>Check your task board</small>
        </div>
      </div>

      <div class="header-notification-item">
        <div class="notification-dot green"></div>
        <div>
          <b>Volunteer update</b>
          <small>New volunteer activity available</small>
        </div>
      </div>
    </div>

    <div style="
      padding:12px 16px;
      border-top:1px solid #eef0f3;
      text-align:center;
    ">
      <button id="viewAllNotifications"
        style="
          border:0;
          background:none;
          color:#2563eb;
          cursor:pointer;
          font-weight:600;
          font-size:12px;
        ">
        View all notifications
      </button>
    </div>
  `;

  document.body.appendChild(panel);

  document.getElementById('clearNotifications').onclick = () => {
    panel.querySelectorAll('.notification-dot').forEach(dot => {
      dot.style.opacity = '0.25';
    });
    toast('Notifications marked as read');
  };

  document.getElementById('viewAllNotifications').onclick = () => {
    panel.remove();
    current = 'risks';
    render();
  };
}

function showProfile() {
  closeHeaderMenus();

  const panel = document.createElement('div');
  panel.id = 'profilePanel';

  panel.style.cssText = `
    position: fixed;
    top: 68px;
    right: 18px;
    width: 230px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    box-shadow: 0 12px 35px rgba(0,0,0,.15);
    z-index: 9999;
    overflow: hidden;
  `;

  panel.innerHTML = `
    <div style="
      padding:16px;
      border-bottom:1px solid #eef0f3;
    ">
      <div style="font-weight:700;font-size:14px;">Hasti</div>
      <div style="font-size:12px;color:#697386;margin-top:3px;">
        Club administrator
      </div>
    </div>

    <div style="padding:7px;">
      <button class="profile-menu-item" data-profile-action="settings">
        ⚙️
        <span>Settings</span>
      </button>

      <button class="profile-menu-item" data-profile-action="profile">
        👤
        <span>My profile</span>
      </button>

      <button class="profile-menu-item" data-profile-action="help">
        ❓
        <span>Help & support</span>
      </button>
    </div>

    <div style="border-top:1px solid #eef0f3;padding:7px;">
      <button class="profile-menu-item danger" data-profile-action="logout">
        ↪
        <span>Sign out</span>
      </button>
    </div>
  `;

  document.body.appendChild(panel);

  panel.querySelectorAll('[data-profile-action]').forEach(button => {
    button.onclick = () => {
      const action = button.dataset.profileAction;

      panel.remove();

      if (action === 'settings') {
        current = 'settings';
        render();
      }

      if (action === 'profile') {
        showProfilePage();
    }

      if (action === 'help') {
        current = 'assistant';
        render();
      }

      if (action === 'logout') {
        toast('Signed out successfully');
      }
    };
  });
}
function showProfilePage() {
  const old = document.getElementById('profilePageModal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'profilePageModal';

  modal.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  `;

  modal.innerHTML = `
    <div style="
      width: 100%;
      max-width: 520px;
      background: white;
      border-radius: 18px;
      box-shadow: 0 20px 60px rgba(0,0,0,.2);
      overflow: hidden;
    ">

      <div style="
        padding: 22px 24px;
        border-bottom: 1px solid #eef0f3;
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">
        <div>
          <h2 style="margin:0;font-size:20px;color:#18212f;">
            My Profile
          </h2>
          <div style="margin-top:4px;font-size:12px;color:#697386;">
            Manage your ClubOps AI profile
          </div>
        </div>

        <button id="closeProfilePage"
          style="
            border:0;
            background:#f3f4f6;
            width:34px;
            height:34px;
            border-radius:50%;
            cursor:pointer;
            font-size:18px;
          ">
          ×
        </button>
      </div>

      <div style="padding:24px;">

        <div style="
          display:flex;
          align-items:center;
          gap:16px;
          margin-bottom:24px;
        ">
          <div style="
            width:64px;
            height:64px;
            border-radius:50%;
            background:#18212f;
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:24px;
            font-weight:700;
          ">
            H
          </div>

          <div>
            <div style="
              font-size:18px;
              font-weight:700;
              color:#18212f;
            ">
              Hasti
            </div>

            <div style="
              font-size:13px;
              color:#697386;
              margin-top:4px;
            ">
              Club Administrator
            </div>
          </div>
        </div>

        <label style="
          display:block;
          font-size:12px;
          font-weight:600;
          color:#344054;
          margin-bottom:6px;
        ">
          Name
        </label>

        <input
          id="profileName"
          value="Hasti"
          style="
            width:100%;
            box-sizing:border-box;
            padding:11px 12px;
            border:1px solid #d9dee7;
            border-radius:9px;
            margin-bottom:16px;
            font-size:13px;
          "
        />

        <label style="
          display:block;
          font-size:12px;
          font-weight:600;
          color:#344054;
          margin-bottom:6px;
        ">
          Role
        </label>

        <input
          value="Club Administrator"
          disabled
          style="
            width:100%;
            box-sizing:border-box;
            padding:11px 12px;
            border:1px solid #d9dee7;
            border-radius:9px;
            margin-bottom:20px;
            font-size:13px;
            background:#f8fafc;
          "
        />

        <div style="
          display:flex;
          justify-content:flex-end;
          gap:10px;
        ">
          <button id="cancelProfile"
            style="
              padding:10px 16px;
              border:1px solid #d9dee7;
              background:white;
              border-radius:9px;
              cursor:pointer;
            ">
            Cancel
          </button>

          <button id="saveProfile"
            style="
              padding:10px 16px;
              border:0;
              background:#2563eb;
              color:white;
              border-radius:9px;
              cursor:pointer;
              font-weight:600;
            ">
            Save changes
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('closeProfilePage').onclick = () => {
    modal.remove();
  };

  document.getElementById('cancelProfile').onclick = () => {
    modal.remove();
  };

  document.getElementById('saveProfile').onclick = () => {
    const name = document.getElementById('profileName').value.trim();

    if (!name) {
      toast('Please enter your name');
      return;
    }

    localStorage.setItem('clubops_profile_name', name);

    modal.remove();

    toast('Profile updated successfully');
  };
}
// Header button clicks
document.addEventListener('click', e => {
  const notify = e.target.closest('#notifyBtn');
  const avatar = e.target.closest('.avatar');

  if (notify) {
    showNotifications();
    return;
  }

  if (avatar) {
    showProfile();
    return;
  }

  if (
    !e.target.closest('#notificationPanel') &&
    !e.target.closest('#profilePanel')
  ) {
    closeHeaderMenus();
  }
});
render();
