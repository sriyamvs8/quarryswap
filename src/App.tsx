import { useEffect, useMemo, useState } from 'react'
import {
  Activity as ActivityIcon, AlertTriangle, ArrowRight, BadgeCheck, Boxes, ChevronLeft, Clock3,
  Factory, Handshake, LayoutDashboard, ListChecks, PackageCheck, Plus, RotateCcw, Search,
  ShieldCheck, SlidersHorizontal, Truck, Wrench, X, Zap
} from 'lucide-react'
import { getMatches } from './lib/compatibility'
import { useQuarryStore } from './lib/store'
import type { BearingSpecs, Condition, HoseSpecs, InventoryItem, Loan, PartFamily, PartRequest, TransactionType, Urgency } from './types'
import { ResultBadge, UrgencyBadge } from './components/StatusBadge'
import { SpecTable } from './components/SpecTable'

type View = 'dashboard' | 'request' | 'matches' | 'inventory' | 'loans' | 'activity'

const familyLabel = (f: PartFamily) => f === 'HYDRAULIC_HOSE' ? 'Hydraulic hose' : 'Bearing'
const formatTime = (s: string) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(s))

function App() {
  const { data, actions } = useQuarryStore()
  const [view, setView] = useState<View>('dashboard')
  const [selectedRequestId, setSelectedRequestId] = useState('req-1')
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null)
  const [modal, setModal] = useState<'handoff' | 'addInventory' | null>(null)
  const [actorSite, setActorSite] = useState('site-1')
  const [toast, setToast] = useState('')
  // Bridge request/inventory forms to the single store.
  // The forms stay reusable while the shell owns persistence.
  useEffect(() => {
    const onReq = (e: Event) => {
      const req = (e as CustomEvent).detail as PartRequest
      actions.createRequest(req)
    }
    const onInv = (e: Event) => {
      const item = (e as CustomEvent).detail as InventoryItem
      actions.addInventory(item)
      setSelectedInventoryId(item.id)
    }
    window.addEventListener('quarryswap:create-request', onReq)
    window.addEventListener('quarryswap:add-inventory', onInv)
    return () => {
      window.removeEventListener('quarryswap:create-request', onReq)
      window.removeEventListener('quarryswap:add-inventory', onInv)
    }
  }, [actions])

  const selectedRequest = data.requests.find(r => r.id === selectedRequestId) ?? data.requests[0]
  const selectedInventory = data.inventory.find(i => i.id === selectedInventoryId) ?? null
  const matches = selectedRequest ? getMatches(selectedRequest, data.inventory) : []
  const openRequests = data.requests.filter(r => r.status !== 'RESOLVED')
  const activeLoans = data.loans.filter(l => !['CLOSED','RETURNED'].includes(l.status))

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const openRequest = (id: string) => {
    setSelectedRequestId(id)
    setView('matches')
  }

  const demoCritical = () => {
    setSelectedRequestId('req-1')
    setView('matches')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Wrench size={19}/></div>
          <div><strong>QuarrySwap</strong><span>Emergency parts board</span></div>
        </div>
        <div className="demo-pill"><span/> DEMO DATA · MOCK SITES</div>
        <nav>
          <NavButton icon={<LayoutDashboard/>} label="Emergency Board" active={view==='dashboard'} onClick={()=>setView('dashboard')}/>
          <NavButton icon={<Plus/>} label="Request a Part" active={view==='request'} onClick={()=>setView('request')}/>
          <NavButton icon={<Boxes/>} label="Inventory" active={view==='inventory'} onClick={()=>setView('inventory')}/>
          <NavButton icon={<Handshake/>} label="Active Loans" active={view==='loans'} onClick={()=>setView('loans')}/>
          <NavButton icon={<ActivityIcon/>} label="Activity" active={view==='activity'} onClick={()=>setView('activity')}/>
        </nav>
        <div className="sidebar-bottom">
          <div className="rule-card"><ShieldCheck size={17}/><div><b>Decision support</b><small>No arbitrary compatibility score. Every result is explainable.</small></div></div>
          <button className="reset-btn" onClick={()=>{actions.resetDemo(); notify('Demo data reset')}}><RotateCcw size={14}/> Reset demo</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark"><Wrench size={18}/></div><strong>QuarrySwap</strong></div>
          <div className="topbar-right">
            <label className="site-switcher"><Factory size={15}/><select value={actorSite} onChange={e=>setActorSite(e.target.value)}>
              {data.sites.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}
            </select></label>
            <span className="live-dot"><span/> Local demo mode</span>
          </div>
        </header>

        <div className="content">
          {view === 'dashboard' && <Dashboard data={data} openRequests={openRequests} activeLoans={activeLoans} onRequest={()=>setView('request')} onDemo={demoCritical} onOpen={openRequest}/>}
          {view === 'request' && <RequestPage data={data} actorSite={actorSite} onCancel={()=>setView('dashboard')} onCreated={(id)=>{setSelectedRequestId(id);setView('matches')}}/>}
          {view === 'matches' && selectedRequest && <MatchesPage request={selectedRequest} data={data} matches={matches} onBack={()=>setView('dashboard')} onSelect={(id)=>{setSelectedInventoryId(id);setModal('handoff')}}/>}
          {view === 'inventory' && <InventoryPage data={data} actorSite={actorSite} onAdd={()=>setModal('addInventory')} onSelect={(id)=>{setSelectedInventoryId(id);setModal('handoff')}}/>}
          {view === 'loans' && <LoansPage data={data} onResolve={(id)=>{actions.resolveRequest(id);notify('Breakdown marked resolved')}} onUpdate={(id,status,msg)=>{actions.updateLoan(id,status,msg);notify(msg)}}/>}
          {view === 'activity' && <ActivityPage data={data}/>}
        </div>
      </main>

      <nav className="bottom-nav">
        <NavButton icon={<LayoutDashboard/>} label="Board" active={view==='dashboard'} onClick={()=>setView('dashboard')}/>
        <NavButton icon={<Plus/>} label="Request" active={view==='request'} onClick={()=>setView('request')}/>
        <NavButton icon={<Boxes/>} label="Stock" active={view==='inventory'} onClick={()=>setView('inventory')}/>
        <NavButton icon={<Handshake/>} label="Loans" active={view==='loans'} onClick={()=>setView('loans')}/>
      </nav>

      {modal === 'handoff' && selectedInventory && selectedRequest && (
        <HandoffModal request={selectedRequest} inventory={selectedInventory} data={data} actorSite={actorSite}
          onClose={()=>setModal(null)}
          onCreated={(loan)=>{actions.createLoan(loan, selectedInventory.partNumber); setModal(null); notify('Handoff workflow started')}}
        />
      )}
      {modal === 'addInventory' && <AddInventoryModal data={data} actorSite={actorSite} onClose={()=>setModal(null)} onSaved={()=>{setModal(null);notify('Inventory added to this demo session')}}/>}
      {toast && <div className="toast"><BadgeCheck size={17}/>{toast}</div>}
    </div>
  )
}

function NavButton({icon,label,active,onClick}:{icon:React.ReactNode,label:string,active:boolean,onClick:()=>void}) {
  return <button className={`nav-btn ${active?'active':''}`} onClick={onClick}>{icon}<span>{label}</span></button>
}

function Dashboard({data,openRequests,activeLoans,onRequest,onDemo,onOpen}:{data:any,openRequests:PartRequest[],activeLoans:Loan[],onRequest:()=>void,onDemo:()=>void,onOpen:(id:string)=>void}) {
  const critical = openRequests.filter(r=>r.urgency==='CRITICAL')
  return <div>
    <section className="hero">
      <div>
        <div className="eyebrow"><Zap size={13}/> EMERGENCY SPARE-PART NETWORK</div>
        <h1>Get the machine moving.<br/><span>Verify before you swap.</span></h1>
        <p>Specification-based matching for hydraulic hoses and bearings across nearby quarry sites.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onRequest}><Plus size={17}/> Request a part</button>
          <button className="btn btn-secondary" onClick={onDemo}><Search size={16}/> Open critical demo</button>
        </div>
      </div>
      <div className="hero-flow">
        {['REQUEST','MATCH','VERIFY','HANDOFF','RESOLVE'].map((x,i)=><div className="flow-step" key={x}><b>{String(i+1).padStart(2,'0')}</b><span>{x}</span>{i<4&&<ArrowRight size={14}/>}</div>)}
      </div>
    </section>

    <div className="stat-grid">
      <Stat icon={<AlertTriangle/>} label="Critical requests" value={critical.length} note="Need immediate attention"/>
      <Stat icon={<Boxes/>} label="Available parts" value={data.inventory.filter((i:InventoryItem)=>i.availability==='AVAILABLE').length} note="Across 3 demo sites"/>
      <Stat icon={<Handshake/>} label="Active handoffs" value={activeLoans.length} note="Tracked with terms"/>
      <Stat icon={<ActivityIcon/>} label="Activity events" value={data.activities.length} note="Audit-style feed"/>
    </div>

    <div className="section-head"><div><span className="eyebrow">LIVE BOARD</span><h2>Requests needing a response</h2></div><button className="text-btn" onClick={()=>onRequest()}>New request <ArrowRight size={15}/></button></div>
    <div className="request-list">
      {openRequests.map(r=>{
        const machine=data.machines.find((m:any)=>m.id===r.machineId)
        const site=data.sites.find((s:any)=>s.id===r.siteId)
        return <button className="request-card" key={r.id} onClick={()=>onOpen(r.id)}>
          <div className="request-icon">{r.partFamily==='HYDRAULIC_HOSE'?<Truck size={19}/>:<PackageCheck size={19}/>}</div>
          <div className="request-main"><div className="request-top"><UrgencyBadge urgency={r.urgency}/><span>{familyLabel(r.partFamily)}</span><span className="muted">{formatTime(r.createdAt)}</span></div><h3>{r.description}</h3><p>{site?.name} · {machine?.manufacturer} {machine?.model} · {machine?.machineType}</p></div>
          <div className="request-cta"><span>Find matches</span><ArrowRight size={17}/></div>
        </button>
      })}
    </div>

    <div className="two-col">
      <div className="panel">
        <div className="panel-head"><div><span className="eyebrow">NETWORK INVENTORY</span><h3>What can move right now?</h3></div><Boxes size={20}/></div>
        <div className="mini-list">
          {data.inventory.filter((i:InventoryItem)=>i.availability==='AVAILABLE').slice(0,5).map((i:InventoryItem)=><div className="mini-row" key={i.id}><span className={`condition-dot ${i.condition.toLowerCase()}`}/><div><b>{i.partNumber}</b><small>{familyLabel(i.partFamily)} · {i.condition.toLowerCase()}</small></div><span className="site-tag">{data.sites.find((s:any)=>s.id===i.siteId)?.location}</span></div>)}
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><div><span className="eyebrow">WHY THIS DESIGN</span><h3>Safety-first matching</h3></div><ShieldCheck size={20}/></div>
        <div className="principles"><p><b>Known failure → red.</b> A lower pressure rating or wrong dimension is never hidden by a score.</p><p><b>Missing data → yellow.</b> The system asks a human to verify instead of guessing.</p><p><b>Green → entered requirements only.</b> It is not an engineering certification.</p></div>
      </div>
    </div>
  </div>
}

function Stat({icon,label,value,note}:{icon:React.ReactNode,label:string,value:number,note:string}) {
  return <div className="stat"><div className="stat-icon">{icon}</div><div><b>{value}</b><span>{label}</span><small>{note}</small></div></div>
}

function RequestPage({data,actorSite,onCancel,onCreated}:{data:any,actorSite:string,onCancel:()=>void,onCreated:(id:string)=>void}) {
  const [family,setFamily]=useState<PartFamily>('HYDRAULIC_HOSE')
  const [urgency,setUrgency]=useState<Urgency>('CRITICAL')
  const [machineId,setMachineId]=useState(data.machines.find((m:any)=>m.siteId===actorSite)?.id ?? data.machines[0].id)
  const [description,setDescription]=useState('')
  const [spec,setSpec]=useState<Record<string,string>>({sizeIn:'0.5',pressureBar:'300',maxTempC:'100',fluid:'Petroleum hydraulic oil',application:'Hydraulic line',end1:'JIC',end2:'JIC'})
  const site=data.sites.find((s:any)=>s.id===actorSite)
  const machines=data.machines.filter((m:any)=>m.siteId===actorSite)
  const set=(k:string,v:string)=>setSpec(s=>({...s,[k]:v}))
  const numeric=(v:string)=>v===''?undefined:Number(v)
  const submit=()=>{
    const requiredSpecifications = family==='HYDRAULIC_HOSE'
      ? {sizeIn:numeric(spec.sizeIn),pressureBar:numeric(spec.pressureBar),maxTempC:numeric(spec.maxTempC),fluid:spec.fluid||undefined,application:spec.application||undefined,end1:spec.end1||undefined,end2:spec.end2||undefined,flowLpm:numeric(spec.flowLpm)}
      : {designation:spec.designation||undefined,type:spec.type||undefined,boreMm:numeric(spec.boreMm),outerMm:numeric(spec.outerMm),widthMm:numeric(spec.widthMm),dynamicLoadKn:numeric(spec.dynamicLoadKn),staticLoadKn:numeric(spec.staticLoadKn),lubrication:spec.lubrication||undefined,clearance:spec.clearance||undefined,sealing:spec.sealing||undefined,fit:spec.fit||undefined,application:spec.application||undefined}
    const req:PartRequest={id:crypto.randomUUID(),siteId:actorSite,machineId,partFamily:family,requiredSpecifications,urgency,description:description||`Urgent ${familyLabel(family).toLowerCase()} required for stopped machine.`,status:'OPEN',createdAt:new Date().toISOString()}
    // local store is reached by a custom event to keep this page intentionally isolated from layout code
    window.dispatchEvent(new CustomEvent('quarryswap:create-request',{detail:req}))
    onCreated(req.id)
  }
  return <div>
    <div className="page-head"><div><button className="back-btn" onClick={onCancel}><ChevronLeft size={16}/> Board</button><span className="eyebrow">EMERGENCY REQUEST</span><h1>Tell the network exactly what failed.</h1><p>Only enter specifications you can verify from the machine, hose assembly, or bearing documentation.</p></div></div>
    <div className="form-layout">
      <div className="panel form-panel">
        <label>Part family</label>
        <div className="segmented">{(['HYDRAULIC_HOSE','BEARING'] as PartFamily[]).map(f=><button key={f} className={family===f?'selected':''} onClick={()=>{setFamily(f);setSpec(f==='HYDRAULIC_HOSE'?{sizeIn:'0.5',pressureBar:'300',maxTempC:'100',fluid:'Petroleum hydraulic oil',application:'Hydraulic line',end1:'JIC',end2:'JIC'}:{designation:'63010',type:'Deep groove ball bearing',boreMm:'50',outerMm:'90',widthMm:'20',lubrication:'Grease',clearance:'CN',sealing:'Open',fit:'Standard',application:'Crusher drive'})}}>{f==='HYDRAULIC_HOSE'?'Hydraulic hose':'Bearing'}</button>)}</div>
        <div className="form-grid">
          <Field label="Your site"><input value={site?.name} disabled/></Field>
          <Field label="Machine"><select value={machineId} onChange={e=>setMachineId(e.target.value)}>{machines.map((m:any)=><option value={m.id} key={m.id}>{m.manufacturer} {m.model} · {m.machineType}</option>)}</select></Field>
          <Field label="Urgency"><select value={urgency} onChange={e=>setUrgency(e.target.value as Urgency)}><option>CRITICAL</option><option>HIGH</option><option>NORMAL</option></select></Field>
        </div>
        <Field label="Breakdown description"><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="What stopped? What is the mechanic seeing?"/></Field>
        <div className="form-section-title"><span>Required specifications</span><small>Missing fields become verification warnings.</small></div>
        {family==='HYDRAULIC_HOSE'
          ? <div className="form-grid">{[['sizeIn','Size (in)','number'],['pressureBar','Working pressure (bar)','number'],['maxTempC','Max temperature (°C)','number'],['fluid','Fluid','text'],['application','Application','text'],['end1','End 1','text'],['end2','End 2','text'],['flowLpm','Flow capacity (L/min)','number']].map(([k,l,t])=><Field key={k} label={l}><input type={t} value={spec[k]??''} onChange={e=>set(k,e.target.value)} placeholder={k==='flowLpm'?'Optional':''}/></Field>)}</div>
          : <div className="form-grid">{[['designation','Designation','text'],['type','Bearing type','text'],['boreMm','Bore (mm)','number'],['outerMm','Outside diameter (mm)','number'],['widthMm','Width (mm)','number'],['dynamicLoadKn','Dynamic load (kN)','number'],['staticLoadKn','Static load (kN)','number'],['lubrication','Lubrication','text'],['clearance','Clearance','text'],['sealing','Sealing','text'],['fit','Mounting/fit','text'],['application','Application','text']].map(([k,l,t])=><Field key={k} label={l}><input type={t} value={spec[k]??''} onChange={e=>set(k,e.target.value)}/></Field>)}</div>}
        <div className="form-footer"><button className="btn btn-secondary" onClick={onCancel}>Cancel</button><button className="btn btn-primary" onClick={submit}><Search size={17}/> Find available parts</button></div>
      </div>
      <div className="side-note"><ShieldCheck size={20}/><h3>What happens next?</h3><ol><li>We compare this request against available {familyLabel(family).toLowerCase()} stock at other demo sites.</li><li>Each candidate gets a transparent green / yellow / red result.</li><li>You can inspect the exact spec comparison before starting a loan or trade.</li><li>The handoff records return terms, deposit and replacement guarantee.</li></ol></div>
    </div>
  </div>
}

function Field({label,children}:{label:string,children:React.ReactNode}) {
  return <label className="field"><span>{label}</span>{children}</label>
}

function MatchesPage({request,data,matches,onBack,onSelect}:{request:PartRequest,data:any,matches:any[],onBack:()=>void,onSelect:(id:string)=>void}) {
  const site=data.sites.find((s:any)=>s.id===request.siteId)
  const machine=data.machines.find((m:any)=>m.id===request.machineId)
  return <div>
    <div className="page-head"><div><button className="back-btn" onClick={onBack}><ChevronLeft size={16}/> Board</button><span className="eyebrow">MATCH RESULTS · {matches.length} CANDIDATES</span><h1>Verify the part before you claim it.</h1><p>{site?.name} · {machine?.manufacturer} {machine?.model} · {request.description}</p></div><UrgencyBadge urgency={request.urgency}/></div>
    <div className="decision-banner"><div className="decision-icon"><ShieldCheck/></div><div><b>No compatibility percentage.</b><span>We surface the exact requirement checks. Green means entered requirements are met; yellow means a human must verify missing information; red means a known requirement fails.</span></div></div>
    <div className="match-list">
      {matches.map(m=><MatchCard key={m.inventory.id} match={m} request={request} data={data} onSelect={onSelect}/>)}
      {!matches.length && <Empty title="No available stock found" text="Try another part family or ask a site manager to list a part."/>}
    </div>
  </div>
}

function MatchCard({match,request,data,onSelect}:{match:any,request:PartRequest,data:any,onSelect:(id:string)=>void}) {
  const i=match.inventory
  const site=data.sites.find((s:any)=>s.id===i.siteId)
  return <div className={`match-card ${match.result.toLowerCase()}`}>
    <div className="match-main">
      <div className="match-top"><ResultBadge result={match.result}/><span className="condition">{i.condition}</span><span className="distance">{i.distanceKm} km</span></div>
      <div className="match-title"><div className="part-symbol">{request.partFamily==='HYDRAULIC_HOSE'?<Truck/>:<PackageCheck/>}</div><div><h3>{i.partName}</h3><p>{i.partNumber} · {site?.name} · {site?.location}</p></div></div>
      <SpecTable request={request} inventory={i}/>
      <div className="reason-block">{match.reasons.slice(0,4).map((x:string)=><span className="reason" key={x}><BadgeCheck size={14}/>{x}</span>)}{match.warnings.slice(0,4).map((x:string)=><span className="warning" key={x}><AlertTriangle size={14}/>{x}</span>)}</div>
      <div className="match-foot"><span>{i.notes}</span><button className={`btn ${match.result==='RED'?'btn-disabled':'btn-primary'}`} disabled={match.result==='RED'} onClick={()=>onSelect(i.id)}>{match.result==='RED'?'Not claimable':'Review & start handoff'} <ArrowRight size={15}/></button></div>
    </div>
  </div>
}

function InventoryPage({data,actorSite,onAdd,onSelect}:{data:any,actorSite:string,onAdd:()=>void,onSelect:(id:string)=>void}) {
  const [family,setFamily]=useState<'ALL'|PartFamily>('ALL')
  const items=data.inventory.filter((i:InventoryItem)=>i.availability==='AVAILABLE' && (family==='ALL'||i.partFamily===family))
  return <div>
    <div className="page-head"><div><span className="eyebrow">SITE MANAGER VIEW</span><h1>Available spare parts</h1><p>List stock or salvage that another site can review for an emergency handoff.</p></div><button className="btn btn-primary" onClick={onAdd}><Plus size={17}/> List a part</button></div>
    <div className="filterbar"><div className="segmented">{(['ALL','HYDRAULIC_HOSE','BEARING'] as const).map(f=><button key={f} className={family===f?'selected':''} onClick={()=>setFamily(f)}>{f==='ALL'?'All parts':familyLabel(f as PartFamily)}</button>)}</div><span><SlidersHorizontal size={14}/> {items.length} available</span></div>
    <div className="inventory-grid">
      {items.map((i:InventoryItem)=><div className="inventory-card" key={i.id}><div className="inventory-head"><div className="part-symbol small">{i.partFamily==='HYDRAULIC_HOSE'?<Truck/>:<PackageCheck/>}</div><span className={`condition-chip ${i.condition.toLowerCase()}`}>{i.condition}</span></div><h3>{i.partName}</h3><p>{i.partNumber}</p><div className="inventory-meta"><span><Factory size={14}/>{data.sites.find((s:any)=>s.id===i.siteId)?.name}</span><span><Truck size={14}/>{i.distanceKm} km</span></div><div className="spec-strip">{Object.entries(i.specifications).slice(0,4).map(([k,v])=><span key={k}><b>{k.replace(/([A-Z])/g,' $1')}</b>{String(v)}</span>)}</div><button className="btn btn-secondary full" onClick={()=>onSelect(i.id)}>View & handoff</button></div>)}
    </div>
    <div className="manager-note"><ShieldCheck size={18}/><div><b>Manager principle:</b> inventory records are not certifications. Record the specification you can verify, and let the requester review it before handoff.</div></div>
  </div>
}

function LoansPage({data,onResolve,onUpdate}:{data:any,onResolve:(id:string)=>void,onUpdate:(id:string,status:any,msg:string)=>void}) {
  return <div>
    <div className="page-head"><div><span className="eyebrow">ACCOUNTABILITY</span><h1>Active handoffs</h1><p>Every emergency swap keeps explicit terms and a status trail.</p></div></div>
    <div className="loan-list">
      {data.loans.filter((l:Loan)=>!['CLOSED','RETURNED'].includes(l.status)).map((l:Loan)=><LoanCard key={l.id} loan={l} data={data} onResolve={onResolve} onUpdate={onUpdate}/>)}
      {!data.loans.some((l:Loan)=>!['CLOSED','RETURNED'].includes(l.status)) && <Empty title="No active handoffs" text="Start one from Match Results or Inventory."/>}
    </div>
  </div>
}

function LoanCard({loan,data,onResolve,onUpdate}:{loan:Loan,data:any,onResolve:(id:string)=>void,onUpdate:(id:string,status:any,msg:string)=>void}) {
  const item=data.inventory.find((i:InventoryItem)=>i.id===loan.inventoryId)
  const req=data.requests.find((r:PartRequest)=>r.id===loan.requestId)
  const from=data.sites.find((s:any)=>s.id===loan.fromSiteId)
  const to=data.sites.find((s:any)=>s.id===loan.toSiteId)
  const next = loan.status==='REQUESTED' ? ['TERMS_AGREED','Agree terms'] : loan.status==='TERMS_AGREED' ? ['HANDOFF_CONFIRMED','Confirm handoff'] : loan.status==='HANDOFF_CONFIRMED' ? ['ACTIVE','Mark active'] : null
  return <div className="loan-card"><div className="loan-head"><div><span className="eyebrow">{loan.transactionType}</span><h3>{item?.partNumber}</h3><p>{item?.partName}</p></div><span className="status-chip">{loan.status.replaceAll('_',' ')}</span></div><div className="loan-route"><div><small>FROM</small><b>{from?.name}</b></div><ArrowRight/><div><small>TO</small><b>{to?.name}</b></div><div><small>RETURN</small><b>{loan.returnDate}</b></div><div><small>DEPOSIT</small><b>₹{loan.deposit.toLocaleString('en-IN')}</b></div></div><div className="loan-terms"><span><Handshake size={15}/> Replacement guarantee: <b>{loan.replacementGuarantee?'Yes':'No'}</b></span><span><Clock3 size={15}/> {loan.notes||'No notes'}</span></div><div className="loan-actions">{next&&<button className="btn btn-primary" onClick={()=>onUpdate(loan.id,next[0],next[1])}>{next[1]} <ArrowRight size={15}/></button>}{loan.status==='ACTIVE'&&<><button className="btn btn-secondary" onClick={()=>onResolve(loan.requestId)}>Mark breakdown resolved</button><button className="btn btn-secondary" onClick={()=>onUpdate(loan.id,'RETURNED','Part marked returned.')}>Mark returned</button></>}</div></div>
}

function ActivityPage({data}:{data:any}) {
  return <div><div className="page-head"><div><span className="eyebrow">AUDIT TRAIL</span><h1>What changed?</h1><p>Recent requests, terms, handoffs and resolutions.</p></div></div><div className="timeline">{data.activities.map((a:any)=><div className="timeline-item" key={a.id}><div className="timeline-dot"><ActivityIcon size={14}/></div><div><b>{a.message}</b><span>{formatTime(a.createdAt)} · {a.type.replaceAll('_',' ')}</span></div></div>)}</div></div>
}

function HandoffModal({request,inventory,data,actorSite,onClose,onCreated}:{request:PartRequest,inventory:InventoryItem,data:any,actorSite:string,onClose:()=>void,onCreated:(loan:Loan)=>void}) {
  const [type,setType]=useState<TransactionType>('LOAN')
  const [returnDate,setReturnDate]=useState(new Date(Date.now()+7*86400_000).toISOString().slice(0,10))
  const [deposit,setDeposit]=useState('5000')
  const [guarantee,setGuarantee]=useState(true)
  const [notes,setNotes]=useState('')
  const site=data.sites.find((s:any)=>s.id===inventory.siteId)
  const isRed = getMatches(request,[inventory])[0]?.result==='RED'
  if (isRed) return <ModalShell onClose={onClose}><div className="modal-alert"><AlertTriangle size={30}/><h2>This part cannot be claimed</h2><p>A known requirement fails. QuarrySwap blocks the handoff button rather than allowing a safety-critical mismatch to be treated as compatible.</p><button className="btn btn-secondary" onClick={onClose}>Close</button></div></ModalShell>
  const submit=()=>onCreated({id:crypto.randomUUID(),requestId:request.id,inventoryId:inventory.id,fromSiteId:inventory.siteId,toSiteId:actorSite,transactionType:type,returnDate,deposit:Number(deposit)||0,replacementGuarantee:guarantee,status:'REQUESTED',notes,createdAt:new Date().toISOString()})
  return <ModalShell onClose={onClose}><div className="modal-head"><div><span className="eyebrow">HANDOFF REVIEW</span><h2>{inventory.partNumber}</h2><p>{inventory.partName} · {site?.name}</p></div><button className="icon-btn" onClick={onClose}><X/></button></div><div className="modal-result"><ResultBadge result={getMatches(request,[inventory])[0]?.result ?? 'YELLOW'}/><p>Review the specification comparison in Match Results before agreeing terms.</p></div><div className="modal-grid"><Field label="Transaction"><div className="segmented"><button className={type==='LOAN'?'selected':''} onClick={()=>setType('LOAN')}>Loan</button><button className={type==='TRADE'?'selected':''} onClick={()=>setType('TRADE')}>Trade</button></div></Field><Field label="Return date"><input type="date" value={returnDate} onChange={e=>setReturnDate(e.target.value)}/></Field><Field label="Cash deposit (₹)"><input type="number" value={deposit} onChange={e=>setDeposit(e.target.value)}/></Field><Field label="Replacement guarantee"><select value={guarantee?'yes':'no'} onChange={e=>setGuarantee(e.target.value==='yes')}><option value="yes">Yes</option><option value="no">No</option></select></Field></div><Field label="Handoff notes"><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Condition at handoff, inspection notes, return expectations…"/></Field><div className="modal-footer"><button className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={submit}><Handshake size={17}/> Start handoff workflow</button></div></ModalShell>
}

function ModalShell({children,onClose}:{children:React.ReactNode,onClose:()=>void}) {
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal">{children}</div></div>
}

function AddInventoryModal({data,actorSite,onClose,onSaved}:{data:any,actorSite:string,onClose:()=>void,onSaved:()=>void}) {
  const [family,setFamily]=useState<PartFamily>('HYDRAULIC_HOSE')
  const [condition,setCondition]=useState<Condition>('NEW')
  const [partNumber,setPartNumber]=useState('')
  const [name,setName]=useState('')
  const [raw,setRaw]=useState(family==='HYDRAULIC_HOSE'?'0.5,400,121,Petroleum hydraulic oil,JIC,JIC':'63010,50,90,20')
  const save=()=>{
    const vals=raw.split(',').map(x=>x.trim())
    const specifications = family==='HYDRAULIC_HOSE'
      ? {sizeIn:Number(vals[0]),pressureBar:Number(vals[1]),maxTempC:Number(vals[2]),fluid:vals[3],application:'Hydraulic line',end1:vals[4],end2:vals[5]}
      : {designation:vals[0],type:'Deep groove ball bearing',boreMm:Number(vals[1]),outerMm:Number(vals[2]),widthMm:Number(vals[3]),lubrication:'Grease',clearance:'CN',sealing:'Open',fit:'Standard',application:'Crusher drive'}
    const item:InventoryItem={id:crypto.randomUUID(),siteId:actorSite,partFamily:family,partName:name||familyLabel(family),partNumber:partNumber||`DEMO-${Date.now().toString().slice(-5)}`,condition,availability:'AVAILABLE',specifications,notes:'Added during demo session.',distanceKm:0}
    window.dispatchEvent(new CustomEvent('quarryswap:add-inventory',{detail:item}))
    onSaved()
  }
  return <ModalShell onClose={onClose}><div className="modal-head"><div><span className="eyebrow">SITE MANAGER</span><h2>List available part</h2><p>Record only what you can verify.</p></div><button className="icon-btn" onClick={onClose}><X/></button></div><div className="modal-grid"><Field label="Part family"><select value={family} onChange={e=>{const f=e.target.value as PartFamily;setFamily(f);setRaw(f==='HYDRAULIC_HOSE'?'0.5,400,121,Petroleum hydraulic oil,JIC,JIC':'63010,50,90,20')}}><option value="HYDRAULIC_HOSE">Hydraulic hose</option><option value="BEARING">Bearing</option></select></Field><Field label="Condition"><select value={condition} onChange={e=>setCondition(e.target.value as Condition)}>{['NEW','USED','REFURBISHED','SALVAGE'].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Part number"><input value={partNumber} onChange={e=>setPartNumber(e.target.value)} placeholder="e.g. HS-12-JJ-400"/></Field><Field label="Display name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Hydraulic Hose 1/2 JIC"/></Field></div><Field label={family==='HYDRAULIC_HOSE'?'Specs: size, pressure, temp, fluid, end1, end2':'Specs: designation, bore, OD, width'}><input value={raw} onChange={e=>setRaw(e.target.value)}/></Field><p className="input-help">Comma-separated demo entry. Production version should use structured fields.</p><div className="modal-footer"><button className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={save}><Plus size={17}/> Add to inventory</button></div></ModalShell>
}

function Empty({title,text}:{title:string,text:string}) { return <div className="empty"><Boxes size={25}/><h3>{title}</h3><p>{text}</p></div> }

export default App
