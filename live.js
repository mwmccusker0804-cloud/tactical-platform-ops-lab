(() => {
  const $=id=>document.getElementById(id);
  let token='',busy=false,connected=false,authorized=false;
  const actions=[...document.querySelectorAll('[data-action]')];
  const local=['localhost','127.0.0.1'].includes(location.hostname);
  function access(value){authorized=value;window.dispatchEvent(new CustomEvent('tpol-access',{detail:{authorized:value}}));$('authorization-status').textContent=value?'Authorized':'Not authorized';$('authorization-status').classList.toggle('authorized',value);enable();}
  function enable(){actions.forEach(b=>b.disabled=busy||!connected||!authorized);$('live-connect').disabled=busy;$('live-refresh').disabled=busy||!authorized;$('live-disconnect').disabled=busy||!authorized;}
  function stale(message){connected=false;$('live-state').textContent=message;$('live-target').textContent='';$('live-summary').replaceChildren();$('live-pods').replaceChildren();$('live-raw').textContent='No current readings. Refresh after reconnecting.';enable();}
  async function api(path,action){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),180000);
    try{
      const response=await fetch(path,{method:action?'POST':'GET',cache:'no-store',signal:controller.signal,headers:{Authorization:'Bearer '+token,...(action?{'Content-Type':'application/json'}:{})},...(action?{body:JSON.stringify({action})}:{})});
      if(response.status===401||response.status===403){access(false);$('connection-settings').open=true;}
      if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Start the updated connector and open http://localhost:8765.');
      const data=await response.json();if(!response.ok)throw Error(data.error||'Connection failed');return data;
    }catch(e){if(e.name==='AbortError')throw Error('The cluster took too long to respond. Check Ubuntu, then refresh.');throw e;}finally{clearTimeout(timer);}
  }
  window.tpolRead = path => {if(!authorized)return Promise.reject(Error('Authorize in Live UDS Lab first.'));if(!['/api/monitoring','/api/security-events','/api/operations'].includes(path))return Promise.reject(Error('Unsupported read'));return api(path);};
  function card(title,value){const d=document.createElement('div');d.className='card';const h=document.createElement('h3'),v=document.createElement('p');h.textContent=title;v.textContent=value;d.append(h,v);return d;}
  function packageState(pkg){if(!pkg)return 'Not deployed';const status=pkg.status;if(typeof status==='string')return status;const phase=status?.phase||status?.status;if(typeof phase==='string')return phase;const ready=status?.conditions?.find(c=>c.type==='Ready');if(ready)return ready.status==='True'?'Ready':'Not ready';return 'Check details';}
  function show(s){
    connected=true;$('live-state').textContent='Updated '+new Date(s.observedAt).toLocaleTimeString()+'. Refresh after a change.';$('live-target').textContent=s.context+' · '+s.namespace;
    const d=s.deployments.find(x=>x.metadata.name==='mission-api');
    const desired=d?.spec.replicas??0,ready=d?.status.readyReplicas??0;
    const endpoints=s.endpoints.flatMap(x=>x.endpoints||[]).filter(x=>x.conditions?.ready===true).length;
    $('live-summary').replaceChildren(card('App copies',d?ready+' ready / '+desired+' requested':'Not deployed'),card('Ready destinations',String(endpoints)),card('UDS integration',packageState(s.packages.find(x=>x.metadata.name==='tpol-training'))));
    $('live-pods').replaceChildren(...s.pods.map(p=>{const cs=p.status?.containerStatuses||[];return card(p.metadata.name,cs.map(c=>c.name+': '+(c.state?.waiting?.reason||c.state?.terminated?.reason||(c.ready?'Ready':'Not ready'))+' · restarts '+c.restartCount).join('\n')||p.status?.phase||'Pending');}));
    if(!s.pods.length)$('live-pods').textContent='No training pods found. Check the requested copy count or open Troubleshooting.';
    $('live-raw').textContent=JSON.stringify(s,null,2);
    if(Object.keys(s.errors).length)$('live-state').textContent+=' Some checks failed; open Raw status evidence.';
    enable();
  }
  async function refresh(){busy=true;enable();$('live-state').textContent='Checking your cluster…';try{show(await api('/api/status'));}catch(e){stale(e.message);}finally{busy=false;enable();}}
  $('live-connect').addEventListener('click',async()=>{
    if(!local){access(false);stale('Live mode runs at http://localhost:8765 on your Windows PC. Use the simulator here.');return;}
    token=$('bridge-token').value.trim();access(false);connected=false;
    if(!token){stale('Paste the session token in Connection settings.');return;}
    busy=true;enable();$('live-state').textContent='Checking access…';
    try{const s=await api('/api/session');if(s.authorized!==true)throw Error('Access was not confirmed.');access(true);$('bridge-token').value='';$('connection-settings').open=false;show(await api('/api/status'));}
    catch(e){stale(e.message);}finally{busy=false;enable();}
  });
  $('live-refresh').addEventListener('click',refresh);
  $('live-disconnect').addEventListener('click',()=>{token='';$('bridge-token').value='';access(false);$('live-output').textContent='Choose an action to see its result.';$('action-notice').textContent='';stale('Disconnected. Your cluster keeps running.');});
  const guidance={
    'scale-down':'Requested zero app copies. Refresh in a few seconds: the pod should disappear. Open Troubleshooting → Missing replicas to read the evidence.',
    'break-service':'Changed the Service selector. Pods may remain Ready, but ready destinations should fall to zero. Open Troubleshooting → Broken route.',
    'bad-start':'Added an invalid executable. Inspect events; a previous healthy pod may keep serving during the failed rollout. Open Troubleshooting → Startup failure.',
    'restore':'Recovery requested. Refresh until the app has a ready copy and a ready destination, then open the training app to verify it works.'
  };
  actions.forEach(button=>button.addEventListener('click',async()=>{
    const action=button.dataset.action;if(['scale-down','break-service','bad-start'].includes(action)&&!confirm('Apply this exercise fault to tpol-training on your connected local cluster?'))return;
    busy=true;enable();$('action-notice').textContent='Working…';
    try{const result=await api('/api/action',action);$('live-output').textContent=result.output;$('action-notice').textContent=guidance[action]||'Evidence is shown in Investigation tools & command output.';show(await api('/api/status'));}
    catch(e){$('live-output').textContent=e.message;$('action-notice').textContent='Action or refresh failed. Read the message below.';stale(e.message);}
    finally{busy=false;enable();}
  }));
  access(false);enable();
})();
