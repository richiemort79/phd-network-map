(function(){
/* ---------- data (from Table_v3.xlsx) ---------- */
// [DC, [host, expertise], [[academic secondment, expertise], ...], [industrial secondment, expertise]]
const TABLE=[
["DC1", ["UniNA", "Organic chemistry"], [["UCC", "Spectroscopy"]], ["AV", "Immunology"]],
["DC2", ["UniNA", "Organic chemistry"], [["UCC", "Spectroscopy"], ["INAF", "Astrobiology"]], ["AV", "Immunology"]],
["DC3", ["KCL", "Computational chemistry"], [["UDG", "Computational chemistry"]], ["SA", "Software development"]],
["DC4", ["UDG", "Computational chemistry"], [["KCL", "Computational chemistry"]], ["ME", "Radioprotection"]],
["DC5", ["KCL", "Computational chemistry"], [["UDG", "Computational chemistry"]], ["SA", "Software development"]],
["DC6", ["UCC", "Spectroscopy"], [["UGent", "Microscopy"], ["UCMZ", "Phylogenetics"]], ["PE", "Organic chemistry"]],
["DC7", ["UCC", "Spectroscopy"], [["UGent", "Microscopy"], ["UCMZ", "Phylogenetics"]], ["PE", "Organic chemistry"]],
["DC8", ["LU", "Cell biology"], [["UCC", "Spectroscopy"], ["UniNA", "Organic chemistry"], ["UR", "Phylogenetics"]], ["BG", "Stimuli-responsive polymers"]],
["DC9", ["UniNA", "Biochemistry"], [["UNIL", "Phylogenetics"]], ["FIB", "Material chemistry"]],
["DC10", ["UGent", "Cell biology"], [["UniNA", "Organic chemistry"]], ["ME", "Radioprotection"]],
["DC11", ["UGent", "Cell biology"], [["UniNA", "Organic chemistry"], ["UE", "Biofabrication"]], ["TBD", "TBD"]],
["DC12", ["UGent", "Cell biology"], [["LU", "Cell biology"], ["OSU", "Cell biology"]], ["ME", "Radioprotection"]],
["DC13", ["UNIL", "Phylogenetics"], [["UCMZ", "Phylogenetics"]], ["SOI", "TBD"]],
["DC14", ["LU", "Cell biology"], [["UGent", "Microscopy"]], ["AV", "Immunology"]]
];
// project titles and work packages, as in the theme map
const TITLES=['Dark matter','Extreme conditions','IOM vs Melanin','PyM AM models','EM PM models','MS Chem Meth','MS Chem Shape',
  'Archaeal melanin','Bacterial melanin','Fungal melanin','Thermo-mech','MS organisation','Colour traits','MS dynamics'];
const WPS=[
  {id:'M',name:'Molecular',color:'#6B4FA0',dcs:[1,2,3,4,5]},
  {id:'S',name:'Subcellular',color:'#B65094',dcs:[6,7,8,9,10]},
  {id:'T',name:'Tissue & Organism',color:'#DFAA49',dcs:[11,12,13,14]}
];
// optional full names shown in tooltips, e.g. UCC:'University College Cork'
const FULL_NAMES={};
const HOST_WEIGHT=2, SEC_WEIGHT=1;

const TYPES={acad:{name:'Academic',color:'#005392'},ind:{name:'Industrial',color:'#DC7E65'}};
const KINDS={host:{name:'Host institution',color:'#005392'},acad:{name:'Academic secondment',color:'#D4C35A'},ind:{name:'Industrial secondment',color:'#DC7E65'}};
const TBD_COLOR='#B5BBBF';

// expertise pictograms (from Paola's MOSAIC script; Biochemistry added), drawn in a ±10 box
const ICONS={
  'Spectroscopy':'<path d="M-9 7V-7m0 14H9M-8 4l4-1 2-7 3 8 3-11 3 9 2 1"/>',
  'Computational chemistry':'<rect x="-9" y="-8" width="18" height="13" rx="2"/><path d="M-4 9h8M0 5v4m-5-8 5-5 5 5M-5 1h10"/>',
  'Microscopy':'<path d="m-4-8 4-2 5 8-4 2zM3 0q6 7-4 8m-7 2H8m-14-5h8M-1 8v2"/>',
  'Organic chemistry':'<path d="m0-9 8 4.5v9L0 9l-8-4.5v-9zM0-6l5 3m0 6-5 3m-5-3v-6"/>',
  'Biochemistry':'<path d="M-3-9h6M-2-9v6l-6 11q-1 1 1 1h14q2 0 1-1L2-3v-6M-5 4h10"/>',
  'Cell biology':'<path d="M-9 0c0-5 3-9 9-9s10 4 9 10-5 8-10 8-8-4-8-9z"/><circle cx="1" cy="0" r="3"/><path d="M-5-3h.1M5 4h.1"/>',
  'Phylogenetics':'<path d="M-9 0h5m0-5V5m0-10H2m-6 10H9M2-8v6m0-6h7M2-2h7"/>',
  'Radioprotection':'<path d="M0-9 8-6v5c0 5-4 8-8 10-4-2-8-5-8-10v-5zM0-4v8m-4-4h8"/>',
  'Astrobiology':'<circle r="5"/><ellipse rx="10" ry="3" transform="rotate(-30)"/><path d="M6-9h4m-2-2v4"/>',
  'Biofabrication':'<path d="m0-9 8 4-8 4-8-4zM-8 0l8 4 8-4M-8 5l8 4 8-4"/>',
  'Immunology':'<path d="M-8-8 0 0 8-8M0 0v9m-8-13 4 4m12-4-4 4M-5-10l-4 4m14-4 4 4"/>',
  'Software development':'<rect x="-10" y="-8" width="20" height="16" rx="2"/><path d="m-4-3-3 3 3 3m8-6 3 3-3 3M1-4-1 4"/>',
  'Stimuli-responsive polymers':'<path d="m-10 5 5-5 5 5 5-5 5 5M-8-5h7m-3-3 3 3-3 3M6-9l-2 5h4L5 0"/>',
  'Material chemistry':'<path d="m0-9 8 5v8L0 9l-8-5v-8zM-8-4 0 1l8-5M0 1v8"/><circle cx="0" cy="-9" r="1"/><circle cx="-8" cy="4" r="1"/><circle cx="8" cy="4" r="1"/>',
  'TBD':'<path d="M-4-4a4 4 0 1 1 7 3C2 0 0 1 0 3M0 7h.1"/>'
};
const ICON_STEP=26, KEY_ROW=34, KEY_COLS=3;

const DCS=TABLE.map((r,i)=>({id:r[0],code:r[0],title:TITLES[i]||'',wp:WPS.find(w=>w.dcs.includes(i+1)).id}));
const ALL=[];
TABLE.forEach(r=>{
  ALL.push({dc:r[0],pt:r[1][0],kind:'host',exp:r[1][1]});
  r[2].forEach(s=>ALL.push({dc:r[0],pt:s[0],kind:'acad',exp:s[1]}));
  if(r[3]&&r[3][0])ALL.push({dc:r[0],pt:r[3][0],kind:'ind',exp:r[3][1]});
});
const PARTNERS=[];
ALL.forEach(l=>{if(!PARTNERS.some(p=>p.id===l.pt))PARTNERS.push({id:l.pt,type:l.kind==='ind'?'ind':'acad',name:l.pt,tbd:l.pt==='TBD'});});

/* ---------- options ---------- */
// each page fixes its layout with <body data-layout="cols|circ">
const LAYOUT=document.body.dataset.layout==='circ'?'circ':'cols';
const KEY='phd-placement-map-'+LAYOUT;
const O={colorBy:'wp',links:'both',showLegend:true,showIcons:false,showKey:false,showWP:true};
try{Object.assign(O,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){}
O.layout=LAYOUT;
const hasHost=()=>O.links!=='sec', hasSec=()=>O.links!=='host';
const saveOpts=()=>{try{localStorage.setItem(KEY,JSON.stringify(O));}catch(e){}};

/* ---------- helpers ---------- */
const FONT="'Arial Rounded MT Bold','Arial Rounded MT','Nunito',Arial,sans-serif";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rad=d=>d*Math.PI/180, f=n=>n.toFixed(2), sum=a=>a.reduce((x,y)=>x+y,0);
const pt=(a,r)=>[r*Math.sin(a),-r*Math.cos(a)];
function shade(hex,t){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=t<0?0:255,k=Math.abs(t);
  r=Math.round(r+(m-r)*k);g=Math.round(g+(m-g)*k);b=Math.round(b+(m-b)*k);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function lum(hex){const n=parseInt(hex.slice(1),16);const c=[n>>16,n>>8&255,n&255].map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];}
const wpOf=dc=>WPS.find(w=>w.id===dc.wp);
const dcById=id=>DCS.find(d=>d.id===id), ptById=id=>PARTNERS.find(p=>p.id===id);
function dcColor(dc){const l=DCS.filter(d=>d.wp===dc.wp),i=l.indexOf(dc),n=l.length;return shade(wpOf(dc).color,n>1?-0.22+0.5*i/(n-1):0);}
function ptColor(p){if(p.tbd)return TBD_COLOR;const l=PARTNERS.filter(q=>q.type===p.type&&!q.tbd),i=l.indexOf(p),n=l.length;return shade(TYPES[p.type].color,n>1?-0.15+0.6*i/(n-1):0);}
function ribColor(l){return O.colorBy==='wp'?dcColor(dcById(l.dc)):O.colorBy==='kind'?KINDS[l.kind].color:ptColor(ptById(l.pt));}
const wOf=l=>l.kind==='host'?HOST_WEIGHT:SEC_WEIGHT;
const links=()=>ALL.filter(l=>l.kind==='host'?hasHost():hasSec());
const fullName=p=>FULL_NAMES[p.id]?`${esc(p.id)} · ${esc(FULL_NAMES[p.id])}`:esc(p.tbd?'Industrial partner to be confirmed':p.id);

// order partners by the mean position of the DCs they link to, so ribbons cross as little as possible
function partnerOrder(L,type){
  const bary=p=>{const ls=L.filter(l=>l.pt===p.id);return sum(ls.map(l=>DCS.indexOf(dcById(l.dc))*wOf(l)))/sum(ls.map(wOf));};
  return PARTNERS.filter(p=>p.type===type&&L.some(l=>l.pt===p.id))
    .sort((a,b)=>(a.tbd-b.tbd)||(bary(a)-bary(b)));
}

function annulus(a0,a1,r0,r1){const L=(a1-a0)>Math.PI?1:0;const p0=pt(a0,r1),p1=pt(a1,r1),p2=pt(a1,r0),p3=pt(a0,r0);
  return `M${f(p0[0])},${f(p0[1])}A${r1},${r1} 0 ${L} 1 ${f(p1[0])},${f(p1[1])}L${f(p2[0])},${f(p2[1])}A${r0},${r0} 0 ${L} 0 ${f(p3[0])},${f(p3[1])}Z`;}
function ribbon(r,rt,s0,s1,t0,t1){const a=pt(s0,r),b=pt(s1,r),c=pt(t0,rt),d=pt(t1,rt);
  return `M${f(a[0])},${f(a[1])}A${r},${r} 0 0 1 ${f(b[0])},${f(b[1])}Q0,0 ${f(c[0])},${f(c[1])}A${rt},${rt} 0 0 1 ${f(d[0])},${f(d[1])}Q0,0 ${f(a[0])},${f(a[1])}Z`;}
function arcPath(a0,a1,r){const mid=(a0+a1)/2,flip=mid>Math.PI/2&&mid<Math.PI*1.5,L=(a1-a0)>Math.PI?1:0;
  if(!flip){const p=pt(a0,r),q=pt(a1,r);return {d:`M${f(p[0])},${f(p[1])}A${r},${r} 0 ${L} 1 ${f(q[0])},${f(q[1])}`,flip};}
  const p=pt(a1,r),q=pt(a0,r);return {d:`M${f(p[0])},${f(p[1])}A${r},${r} 0 ${L} 0 ${f(q[0])},${f(q[1])}`,flip};}
const isFlip=(a0,a1)=>arcPath(a0,a1,1).flip;
function arcText(id,a0,a1,r,txt,attrs){const ap=arcPath(a0,a1,r);
  return `<path id="${id}" d="${ap.d}" fill="none"/><text font-family="${FONT}" ${attrs}><textPath href="#${id}" startOffset="50%" text-anchor="middle">${esc(txt)}</textPath></text>`;}
const ribAttrs=l=>`class="rib" data-dc="${l.dc}" data-pt="${l.pt}" data-kind="${l.kind}" fill="${ribColor(l)}" fill-opacity="0.72" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="0.8"`;

// expertise of a partner across the links currently shown (UGent is Microscopy for secondments, Cell biology as host)
function ptExps(L,id){const s=[];L.forEach(l=>{if(l.pt===id&&!s.includes(l.exp))s.push(l.exp);});return s;}
const iconPad=()=>{if(!O.showIcons)return 0;const L=links();return ICON_STEP*Math.max(0,...PARTNERS.map(p=>ptExps(L,p.id).length));};
function icon(x,y,exp,attrs){return `<g transform="translate(${f(x)} ${f(y)})"${attrs||''} fill="none" stroke="#1E2328" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><circle r="12" fill="#FFFFFF" fill-opacity="0" stroke="none"/>${ICONS[exp]||ICONS.TBD}</g>`;}
// icons stacked outward along the partner's radius, starting just beyond its arc
const ptIcons=(L,p,m,r0)=>O.showIcons?ptExps(L,p.id).map((e,k)=>{const [x,y]=pt(m,r0+12+k*ICON_STEP);return icon(x,y,e,` class="node" data-pt="${p.id}"`);}).join(''):'';
function keyExps(){const s=[];links().forEach(l=>{if(!s.includes(l.exp))s.push(l.exp);});return s.sort((a,b)=>(a==='TBD')-(b==='TBD')||a.localeCompare(b));}
const keyH=()=>O.showKey?80+Math.ceil(keyExps().length/KEY_COLS)*KEY_ROW:0;
function expKey(x0,y0,w){
  const ex=keyExps(),rows=Math.ceil(ex.length/KEY_COLS),cw=w/KEY_COLS;
  let out=`<path d="M${f(x0)},${f(y0)}H${f(x0+w)}" stroke="#D5DAD7" fill="none"/><text x="${f(x0)}" y="${f(y0+38)}" font-family="${FONT}" font-size="22" font-weight="700" fill="#1E2328">Expertise</text>`;
  ex.forEach((e,i)=>{const x=x0+Math.floor(i/rows)*cw+12,y=y0+76+(i%rows)*KEY_ROW;
    out+=icon(x,y,e)+`<text x="${f(x+22)}" y="${f(y)}" dominant-baseline="central" font-family="${FONT}" font-size="16" fill="#1E2328">${esc(e==='TBD'?'To be confirmed':e)}</text>`;});
  return out;
}

function legend(x,y){
  let out=`<g font-family="${FONT}" font-size="15" fill="#1E2328">`;let yy=y;
  if(O.colorBy==='kind'){
    Object.entries(KINDS).filter(([k])=>k==='host'?hasHost():hasSec()).forEach(([,k])=>{
      out+=`<rect x="${x}" y="${yy-11}" width="15" height="15" rx="2" fill="${k.color}"/><text x="${x+23}" y="${yy}">${esc(k.name)}</text>`;yy+=23;});
  }else if(O.colorBy==='wp'){
    WPS.forEach(w=>{out+=`<rect x="${x}" y="${yy-11}" width="15" height="15" rx="2" fill="${w.color}"/><text x="${x+23}" y="${yy}">${esc(w.name)}</text>`;yy+=23;});
  }
  out+=`<text x="${x}" y="${yy+4}" fill="#5D666E" font-size="13.5">${O.links==='both'?'Wide ribbon: host institution · narrow: secondment':O.links==='host'?'Each ribbon joins a DC to its host institution':'Each ribbon is one secondment'}</text>`;
  return out+'</g>';
}

/* ---------- DCs in the centre, partners on arcs either side ---------- */
const CB=620;
function buildCols(){
  const L=links(),Ri=440,TRK=22,bx=45,top=-370,bot=370,P=iconPad(),v=vb();
  let out=`<rect x="${v[0]}" y="${v[1]}" width="${v[2]}" height="${v[3]}" fill="#FFFFFF"/>`;
  const order={acad:partnerOrder(L,'acad'),ind:partnerOrder(L,'ind')};
  const pos=new Map();[...order.acad,...order.ind].forEach((p,i)=>pos.set(p.id,i));
  // centre column: box height by total link weight
  const dg=8,wg=34,tot=DCS.map(d=>sum(L.filter(l=>l.dc===d.id).map(wOf)));
  let gaps=wg;DCS.forEach((d,i)=>{if(i)gaps+=d.wp!==DCS[i-1].wp?wg:dg;});
  const k=(bot-top-gaps)/sum(tot);
  let y=top+wg;const dy=[];
  DCS.forEach((d,i)=>{if(i)y+=d.wp!==DCS[i-1].wp?wg:dg;dy.push([y,y+tot[i]*k]);y+=tot[i]*k;});
  // partner arcs: same width scale as the boxes, centred on 270° (left) and 90° (right)
  const ptot=p=>sum(L.filter(l=>l.pt===p.id).map(wOf));
  const pa=new Map(),span={};
  Object.entries(order).forEach(([type,ps])=>{
    if(!ps.length)return;
    const len=sum(ps.map(p=>ptot(p)*k))/Ri,maxSpan=rad(type==='acad'?112:92);
    const g=Math.min(rad(9),(maxSpan-len)/Math.max(1,ps.length-1)),all=len+g*(ps.length-1);
    // left side runs top→bottom with decreasing angle, right side with increasing angle
    const dir=type==='acad'?-1:1,c=type==='acad'?rad(270):rad(90);let a=c-dir*all/2;
    ps.forEach(p=>{const w=ptot(p)*k/Ri;pa.set(p.id,dir>0?[a,a+w]:[a-w,a]);a+=dir*(w+g);});
    span[type]=dir>0?[c-all/2,c+all/2]:[c-all/2,c+all/2];
  });
  // ribbons
  const cur=new Map([...pa].map(([id,v])=>[id,ptById(id).type==='acad'?v[1]:v[0]]));
  const ribs=[];
  DCS.forEach((d,i)=>{const [y0,y1]=dy[i];
    ['acad','ind'].forEach(side=>{
      const ls=L.filter(l=>l.dc===d.id&&ptById(l.pt).type===side).sort((a,b)=>pos.get(a.pt)-pos.get(b.pt));
      const h=sum(ls.map(wOf))*k;let s=(y0+y1-h)/2;
      const left=side==='acad',x=left?-bx:bx,dx=left?-150:150;
      ls.forEach(l=>{const w=wOf(l)*k,aw=w/Ri,t0=cur.get(l.pt),t1=left?t0-aw:t0+aw;cur.set(l.pt,t1);
        const p0=pt(t0,Ri-2),p1=pt(t1,Ri-2),c0=pt(t0,Ri-170),c1=pt(t1,Ri-170);
        ribs.push(`<path ${ribAttrs(l)} d="M${x},${f(s)}C${x+dx},${f(s)} ${f(c0[0])},${f(c0[1])} ${f(p0[0])},${f(p0[1])}`+
          `A${Ri-2},${Ri-2} 0 0 ${left?0:1} ${f(p1[0])},${f(p1[1])}C${f(c1[0])},${f(c1[1])} ${x+dx},${f(s+w)} ${x},${f(s+w)}Z"/>`);
        s+=w;});
    });});
  out+=`<g>${ribs.join('')}</g>`;
  // DC boxes + WP labels
  DCS.forEach((d,i)=>{const [y0,y1]=dy[i],col=dcColor(d),fc=lum(col)>0.21?'#1E2328':'#FFFFFF';
    out+=`<g class="node" data-dc="${d.id}"><rect x="${-bx}" y="${f(y0)}" width="${2*bx}" height="${f(y1-y0)}" rx="3" fill="${col}"/>`+
      `<text x="0" y="${f((y0+y1)/2)}" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-size="15" fill="${fc}"><tspan font-weight="700">${esc(d.code)}</tspan></text></g>`;});
  if(O.showWP)WPS.forEach(wp=>{const i=DCS.findIndex(d=>d.wp===wp.id);
    out+=`<text x="0" y="${f(dy[i][0]-11)}" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="700" fill="${wp.color}">${esc(wp.name)}</text>`;});
  out+=`<text x="0" y="${top-38}" text-anchor="middle" font-family="${FONT}" font-size="32" font-weight="700" fill="#6B4FA0">Doctoral candidates</text>`;
  // partner arcs with radial labels
  PARTNERS.filter(p=>pa.has(p.id)).forEach(p=>{const [a0,a1]=pa.get(p.id),m=(a0+a1)/2,left=p.type==='acad',[lx,ly]=pt(m,Ri+TRK+8+P);
    out+=`<path class="node" data-pt="${p.id}" d="${annulus(a0,a1,Ri,Ri+TRK)}" fill="${ptColor(p)}"/>`+ptIcons(L,p,m,Ri+TRK+4);
    out+=`<text class="node" data-pt="${p.id}" x="${f(lx)}" y="${f(ly)}" transform="rotate(${f(m*180/Math.PI+(left?90:-90))} ${f(lx)} ${f(ly)})" text-anchor="${left?'end':'start'}" dominant-baseline="central" font-family="${FONT}" font-size="17" fill="${p.tbd?'#5D666E':'#1E2328'}"${p.tbd?' font-style="italic"':''}>${esc(p.name)}</text>`;});
  // side brackets + headings
  const rp=Ri+TRK+78+P;
  [['acad',{both:'Academic partners',host:'Host institutions',sec:'Academic secondments'}[O.links]],['ind','Industrial secondments']].forEach(([type,txt])=>{
    if(!span[type])return;const [a0,a1]=span[type],c=TYPES[type].color;
    out+=`<path d="${annulus(a0,a1,rp,rp+4)}" fill="${c}"/>`+arcText('cs'+type,a0-rad(15),a1+rad(15),rp+14,txt,`font-size="40" font-weight="700" fill="${c}"`);});
  if(O.showLegend)out+=legend(-600-P,O.colorBy==='partner'?590:O.colorBy==='kind'&&O.links!=='both'?545:522);
  if(O.showKey)out+=expKey(v[0]+40,CB+10,v[2]-80);
  return out;
}

/* ---------- circular ---------- */
const CV=560;
function buildCirc(){
  const L=links(),R=300,PT=28,RT=340,TRK=24,P=iconPad(),v=vb();
  let out=`<rect x="${v[0]}" y="${v[1]}" width="${v[2]}" height="${v[3]}" fill="#FFFFFF"/>`;
  // DC arcs, equal size
  const P0=rad(185),P1=rad(355),dg=rad(0.9),wg=rad(4.5);
  let gaps=0;DCS.forEach((d,i)=>{if(i)gaps+=d.wp!==DCS[i-1].wp?wg:dg;});
  const kp=(P1-P0-gaps)/DCS.length;let a=P0;const pa=[];
  DCS.forEach((d,i)=>{if(i)a+=d.wp!==DCS[i-1].wp?wg:dg;pa.push([a,a+kp]);a+=kp;});
  // partners top to bottom: academic then industrial; within each, later DCs higher up
  const ps=[...partnerOrder(L,'acad').reverse(),...partnerOrder(L,'ind').filter(p=>!p.tbd).reverse(),...partnerOrder(L,'ind').filter(p=>p.tbd)];
  const pos=new Map(ps.map((p,i)=>[p.id,i]));
  const ptot=ps.map(p=>sum(L.filter(l=>l.pt===p.id).map(wOf)));
  const T0=rad(16),T1=rad(164),qg=rad(2.2),tg=rad(7);
  let g2=0;ps.forEach((p,j)=>{if(j)g2+=p.type!==ps[j-1].type?tg:qg;});
  const kt=(T1-T0-g2)/sum(ptot);let b=T0;const qa=[];
  ps.forEach((p,j)=>{if(j)b+=p.type!==ps[j-1].type?tg:qg;qa.push([b,b+ptot[j]*kt]);b+=ptot[j]*kt;});
  // ribbons
  const tCur=qa.map(x=>x[0]),tPos=new Map();
  for(let i=DCS.length-1;i>=0;i--)L.filter(l=>l.dc===DCS[i].id).sort((x,y)=>pos.get(x.pt)-pos.get(y.pt)).forEach(l=>{
    const j=pos.get(l.pt),w=wOf(l)*kt;tPos.set(l,[tCur[j],tCur[j]+w]);tCur[j]+=w;});
  const ribs=[];
  DCS.forEach((d,i)=>{const ls=L.filter(l=>l.dc===d.id).sort((x,y)=>pos.get(y.pt)-pos.get(x.pt));
    const ks=(pa[i][1]-pa[i][0])/sum(ls.map(wOf));let s=pa[i][0];
    ls.forEach(l=>{const w=wOf(l)*ks,t=tPos.get(l);ribs.push(`<path ${ribAttrs(l)} d="${ribbon(R-2,RT-2,s,s+w,t[0],t[1])}"/>`);s+=w;});});
  out+=`<g>${ribs.join('')}</g>`;
  // DC blocks
  DCS.forEach((d,i)=>{const [a0,a1]=pa[i],col=dcColor(d);
    out+=`<path class="node" data-dc="${d.id}" d="${annulus(a0,a1,R,R+PT)}" fill="${col}"/>`;
    out+=`<g class="node" data-dc="${d.id}">`+arcText('cc'+i,a0,a1,R+PT/2+(isFlip(a0,a1)?4.5:-4.5),d.code,`font-size="13" font-weight="700" fill="${lum(col)>0.21?'#1E2328':'#FFFFFF'}"`)+'</g>';});
  const rb=R+PT+42;
  if(O.showWP)WPS.forEach((wp,k)=>{const idx=DCS.map((d,i)=>d.wp===wp.id?i:-1).filter(i=>i>=0);const a0=pa[idx[0]][0],a1=pa[idx[idx.length-1]][1];
    out+=`<path d="${annulus(a0,a1,rb,rb+4)}" fill="${wp.color}"/>`+arcText('cw'+k,a0,a1,isFlip(a0,a1)?rb-8:rb-25,wp.name,`font-size="24" font-weight="500" fill="${wp.color}"`);});
  // partner arcs with radial labels
  ps.forEach((p,j)=>{const [a0,a1]=qa[j],m=(a0+a1)/2,[lx,ly]=pt(m,RT+TRK+8+P);
    out+=`<path class="node" data-pt="${p.id}" d="${annulus(a0,a1,RT,RT+TRK)}" fill="${ptColor(p)}"/>`+ptIcons(L,p,m,RT+TRK+4);
    out+=`<text class="node" data-pt="${p.id}" x="${f(lx)}" y="${f(ly)}" transform="rotate(${f(m*180/Math.PI-90)} ${f(lx)} ${f(ly)})" dominant-baseline="central" font-family="${FONT}" font-size="15" fill="${p.tbd?'#5D666E':'#1E2328'}"${p.tbd?' font-style="italic"':''}>${esc(p.name)}</text>`;});
  // type brackets, labels outside
  const rp=432+P;
  Object.entries(TYPES).forEach(([k,t])=>{const idx=ps.map((p,j)=>p.type===k?j:-1).filter(j=>j>=0);if(!idx.length)return;
    const a0=qa[idx[0]][0],a1=qa[idx[idx.length-1]][1];
    out+=`<path d="${annulus(a0,a1,rp,rp+4)}" fill="${t.color}"/>`+arcText('ct'+k,a0,a1,isFlip(a0,a1)?rp+28:rp+10,t.name,`font-size="24" font-weight="500" fill="${t.color}"`);});
  out+=arcText('chl',P0,P1,rb+22,'Doctoral candidates',`font-size="46" font-weight="700" fill="#6B4FA0"`);
  out+=arcText('chr',rad(20),rad(160),rp+52,{both:'Hosts & secondments',host:'Host institutions',sec:'Secondments'}[O.links],`font-size="40" font-weight="700" fill="#6B4FA0"`);
  if(O.showLegend)out+=legend(-540,O.colorBy==='partner'?530:450);
  if(O.showKey)out+=expKey(v[0]+40,CV+10,v[2]-80);
  return out;
}

/* ---------- render ---------- */
const fig=document.getElementById('fig');
const vb=()=>{const P=iconPad(),K=O.showKey?keyH()+10:0;
  return O.layout==='cols'?[-CB-P,-510,2*(CB+P),510+CB+K]:[-CV,-CV,2*CV+P,2*CV+K];};
const build=()=>O.layout==='cols'?buildCols():buildCirc();
function draw(){
  fig.setAttribute('viewBox',vb().join(' '));fig.style.maxWidth=O.layout==='circ'?'900px':'1000px';
  fig.innerHTML=build();
  document.querySelectorAll('[data-color]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.color===O.colorBy));
  document.querySelectorAll('[data-links]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.links===O.links));
  document.getElementById('optLegend').checked=O.showLegend;
  document.getElementById('optIcons').checked=O.showIcons;
  document.getElementById('optKey').checked=O.showKey;
  document.getElementById('optWP').checked=O.showWP;
}
const set=(k,v)=>{O[k]=v;saveOpts();draw();};
document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>set('colorBy',b.dataset.color)));
document.querySelectorAll('[data-links]').forEach(b=>b.addEventListener('click',()=>set('links',b.dataset.links)));
document.getElementById('optLegend').addEventListener('change',e=>set('showLegend',e.target.checked));
document.getElementById('optIcons').addEventListener('change',e=>set('showIcons',e.target.checked));
document.getElementById('optKey').addEventListener('change',e=>set('showKey',e.target.checked));
document.getElementById('optWP').addEventListener('change',e=>set('showWP',e.target.checked));

/* ---------- hover ---------- */
const tip=document.getElementById('tip');
const kindName=k=>KINDS[k].name;
function clearFocus(){fig.classList.remove('focus');fig.querySelectorAll('.on').forEach(e=>e.classList.remove('on'));tip.style.opacity=0;}
const on=sel=>fig.querySelectorAll(sel).forEach(e=>e.classList.add('on'));
fig.addEventListener('mouseover',e=>{
  const el=e.target.closest('[data-dc],[data-pt]');clearFocus();if(!el)return;fig.classList.add('focus');let html='';
  const L=links();
  if(el.classList.contains('rib')){
    const d=dcById(el.dataset.dc),p=ptById(el.dataset.pt),l=L.find(x=>x.dc===d.id&&x.pt===p.id&&x.kind===el.dataset.kind);
    el.classList.add('on');on(`.node[data-dc="${d.id}"],.node[data-pt="${p.id}"]`);
    html=`<b>${esc(d.code)}</b> ${esc(d.title)} → <b>${fullName(p)}</b><br>${kindName(l.kind)} · ${esc(l.exp)}`;
  }else if(el.dataset.dc){
    const d=dcById(el.dataset.dc),ls=L.filter(x=>x.dc===d.id);
    on(`[data-dc="${d.id}"]`);ls.forEach(x=>on(`.node[data-pt="${x.pt}"]`));
    html=`<b>${esc(d.code)}</b> ${esc(d.title)}`+ls.map(x=>`<br>${kindName(x.kind)}: <b>${esc(x.pt)}</b> (${esc(x.exp)})`).join('');
  }else{
    const p=ptById(el.dataset.pt),ls=L.filter(x=>x.pt===p.id);
    on(`[data-pt="${p.id}"]`);ls.forEach(x=>on(`.node[data-dc="${x.dc}"]`));
    const grp=k=>ls.filter(x=>x.kind===k).map(x=>x.dc);
    html=`<b>${fullName(p)}</b>`+Object.keys(KINDS).filter(k=>grp(k).length).map(k=>`<br>${kindName(k)}: ${grp(k).join(', ')}`).join('');
  }
  tip.innerHTML=html;tip.style.opacity=1;
});
fig.addEventListener('mousemove',e=>{const w=tip.offsetWidth;tip.style.left=Math.min(e.clientX+14,innerWidth-w-8)+'px';tip.style.top=(e.clientY+14)+'px';});
fig.addEventListener('mouseleave',clearFocus);

/* ---------- export ---------- */
function svgString(){clearFocus();const v=vb();
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${v.join(' ')}" width="${v[2]}" height="${v[3]}">`+build()+'</svg>';}
const dl=(name,blob)=>{const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);};
document.getElementById('dlSvg').addEventListener('click',()=>dl(`placement-map-${O.layout}.svg`,new Blob([svgString()],{type:'image/svg+xml'})));
document.getElementById('dlPng').addEventListener('click',()=>{
  const v=vb(),sc=3,img=new Image();
  img.onload=()=>{const c=document.createElement('canvas');c.width=v[2]*sc;c.height=v[3]*sc;c.getContext('2d').drawImage(img,0,0,c.width,c.height);c.toBlob(b=>dl(`placement-map-${O.layout}.png`,b),'image/png');};
  img.onerror=()=>{document.getElementById('dlNote').textContent='The PNG could not be drawn. Try the SVG download.';};
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgString());
});

draw();
})();
