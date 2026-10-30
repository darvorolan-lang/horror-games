/* =====================================================================
   HANTU ONRYŌ (perempuan berkimono putih) di kejaran jalan desa.
   - Model sesuai referensi: rambut hitam lurus belah tengah, satu mata tertutup poni,
     ikat kepala tipis, kimono putih kusam + obi berpita, lengan baju lebar,
     ujung kain compang-camping, kaki telanjang
   - Berdiri dulu (±1,7 m), lalu jatuh ke empat tangan-kaki dan merangkak
   - Suara 3D: klik-klik ala Clicker (The Last of Us) + tawa serak
   ===================================================================== */
let CW=null;
const CK={on:0,next:0,lnext:0,lbusy:0};
const _cv=new THREE.Vector3(),_cf=new THREE.Vector3();

/* sobekan kain: ujung bawah bergerigi, deterministik (tanpa retak di sambungan) */
function raggedHem(geo,lim,amp){
  const p=geo.attributes.position;
  for(let i=0;i<p.count;i++){const y=p.getY(i);if(y<lim){const an=Math.atan2(p.getZ(i),p.getX(i));
    p.setY(i,y-(Math.abs(Math.sin(an*5.3))*.6+Math.abs(Math.sin(an*11.7+1))*.4)*amp)}}
  geo.computeVertexNormals();return geo;
}

function kimonoTex(){
  return cv(256,256,(g,w,h)=>{
    g.fillStyle='#e2ded0';g.fillRect(0,0,w,h);
    for(let i=0;i<50;i++){const x=Math.random()*w,a=.05+Math.random()*.12;g.strokeStyle=`rgba(${110+Math.random()*40|0},${106+Math.random()*40|0},${95+Math.random()*30|0},${a})`;g.lineWidth=1+Math.random()*3;
      g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+(Math.random()-.5)*14,80,x+(Math.random()-.5)*14,170,x+(Math.random()-.5)*10,h);g.stroke()}
    for(let i=0;i<1200;i++){const v=140+Math.random()*80|0;g.fillStyle=`rgba(${v},${v-4},${v-14},${Math.random()*.18})`;g.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*4,1+Math.random()*8)}
    for(let i=0;i<13;i++){ // noda tanah & darah kering
      const x=Math.random()*w,y=Math.random()*h,r=10+Math.random()*32,red=Math.random()<.45;
      const gr=g.createRadialGradient(x,y,1,x,y,r);gr.addColorStop(0,red?'rgba(95,12,14,.7)':'rgba(70,54,38,.55)');gr.addColorStop(1,'rgba(60,40,30,0)');
      g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);
    }
    g.fillStyle='rgba(18,16,15,.85)'; // robekan gelap seperti di referensi
    for(let i=0;i<6;i++){const x=Math.random()*w,y=20+Math.random()*(h-40),s=6+Math.random()*12;
      g.beginPath();g.moveTo(x,y-s);g.lineTo(x+s*.5,y);g.lineTo(x+s*.2,y+s*1.4);g.lineTo(x-s*.5,y+s*.3);g.closePath();g.fill()}
  });
}

/* wajah dilukis di tekstur bola kepala (u=.25 -> depan). Mata kiri (dari sudut pandang penonton) tertutup poni. */
function ghostFaceTex(){
  return cv(1024,512,(g,w,h)=>{
    const X=256;
    const sk=g.createLinearGradient(0,150,0,470);sk.addColorStop(0,'#b9bebb');sk.addColorStop(.55,'#d1d5d0');sk.addColorStop(1,'#aeb5b3');
    g.fillStyle=sk;g.fillRect(0,0,w,h);
    for(let i=0;i<2500;i++){g.fillStyle=`rgba(${60+Math.random()*60|0},${70+Math.random()*50|0},${80+Math.random()*50|0},${Math.random()*.06})`;g.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*3,1+Math.random()*2)}
    const ell=(cx,cy,rx,ry,c0,c1)=>{g.save();g.translate(cx,cy);g.scale(1,ry/rx);const gr=g.createRadialGradient(0,0,0,0,0,rx);gr.addColorStop(0,c0);gr.addColorStop(1,c1);g.fillStyle=gr;g.beginPath();g.arc(0,0,rx,0,7);g.fill();g.restore()};
    for(const sx of[-1,1]){ // pipi & pelipis cekung
      ell(X+sx*98,318,56,46,'rgba(48,58,70,.5)','rgba(48,58,70,0)');
      ell(X+sx*100,240,40,40,'rgba(48,58,70,.3)','rgba(48,58,70,0)');
    }
    ell(X,232,40,20,'rgba(255,255,255,.12)','rgba(255,255,255,0)');
    for(const sx of[-1,1]){
      const cx=X+sx*60;
      ell(cx,250,42,24,'rgba(8,8,16,.95)','rgba(8,8,16,0)');                    // rongga mata gelap
      g.fillStyle='#e3e7e9';g.beginPath();g.ellipse(cx,249,17,7,0,0,7);g.fill();   // bola mata
      g.fillStyle='#0b0c0f';g.beginPath();g.arc(cx,249,6.6,0,7);g.fill();           // iris gelap
      g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(cx-2,247,1.6,0,7);g.fill();
      g.strokeStyle='rgba(8,8,10,.95)';g.lineWidth=3;g.beginPath();g.ellipse(cx,249,18,8,0,Math.PI*1.04,Math.PI*1.96);g.stroke();
      g.lineWidth=2;g.beginPath();g.ellipse(cx,250,17,7,0,.1,Math.PI-.1);g.stroke();
      ell(cx,270,30,9,'rgba(70,64,100,.5)','rgba(70,64,100,0)');                    // kantung mata kebiruan
      g.strokeStyle='rgba(12,10,12,.85)';g.lineWidth=4;g.lineCap='round';           // alis
      g.beginPath();g.moveTo(cx-sx*22,230);g.quadraticCurveTo(cx,219,cx+sx*26,219);g.stroke();
    }
    g.strokeStyle='rgba(60,68,78,.35)';g.lineWidth=3;                              // hidung
    g.beginPath();g.moveTo(X-10,254);g.lineTo(X-14,288);g.stroke();g.beginPath();g.moveTo(X+10,254);g.lineTo(X+14,288);g.stroke();
    ell(X,284,10,8,'rgba(255,255,255,.2)','rgba(255,255,255,0)');
    g.fillStyle='rgba(20,20,24,.7)';g.beginPath();g.ellipse(X-8,294,4,2.6,0,0,7);g.fill();g.beginPath();g.ellipse(X+8,294,4,2.6,0,0,7);g.fill();
    g.fillStyle='#5e4e52';g.beginPath();g.moveTo(X-22,330);g.quadraticCurveTo(X,323,X+22,330);g.quadraticCurveTo(X,341,X-22,330);g.fill(); // bibir pucat
    g.strokeStyle='rgba(10,6,8,.9)';g.lineWidth=2.5;g.beginPath();g.moveTo(X-23,330);g.quadraticCurveTo(X,335,X+23,330);g.stroke();
    ell(X,334,12,3,'rgba(5,2,3,.9)','rgba(5,2,3,.2)');
    ell(X,372,40,18,'rgba(60,70,80,.3)','rgba(60,70,80,0)');
    g.strokeStyle='rgba(95,8,10,.8)';g.lineWidth=3;g.lineCap='round';              // jejak darah dari mata yang tertutup
    g.beginPath();g.moveTo(X-66,266);g.quadraticCurveTo(X-74,305,X-70,360);g.stroke();
    g.lineWidth=2;g.beginPath();g.moveTo(X-58,268);g.quadraticCurveTo(X-60,290,X-56,318);g.stroke();
  });
}

function makeCrawler(){
  const G=new THREE.Group(),S=new THREE.Group(),B=new THREE.Group();G.add(S);S.add(B);
  S.position.set(0,.76,-.3);B.position.set(0,-.76,.3);
  const ft=ghostFaceTex();
  const skin=std({color:0xc3c9c6,roughness:.65,emissive:0x4a5256,emissiveIntensity:.75});
  const headM=std({map:ft,color:0xffffff,roughness:.7,emissive:0xffffff,emissiveMap:ft,emissiveIntensity:.55});
  const kt=kimonoTex();kt.wrapS=kt.wrapT=THREE.RepeatWrapping;
  const kim=std({map:kt,color:0xffffff,roughness:.95,emissive:0x2b2a26,emissiveIntensity:.8,side:THREE.DoubleSide});
  const kim2=std({map:kt,color:0xb9b5a6,roughness:.95,emissive:0x1e1d1a,emissiveIntensity:.7,side:THREE.DoubleSide});
  const hairM=std({color:0x060507,roughness:.3,emissive:0x07080a,emissiveIntensity:.5,side:THREE.DoubleSide});
  const ad=(geo,m,x,y,z,p=B)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);p.add(o);return o};

  /* badan ramping (sumbu +z = arah kepala, sisi depan = -y) */
  const tg=new THREE.LatheGeometry([[.1,-.32],[.14,-.2],[.19,-.02],[.2,.14],[.175,.28],[.1,.37],[.06,.4]].map(([r,y])=>new THREE.Vector2(r,y)),16);
  const tor=ad(tg,kim,0,.79,0);tor.rotation.x=Math.PI/2;tor.scale.set(1.05,1,.82);
  for(const sx of[-1,1])ad(new THREE.SphereGeometry(.075,10,8),kim,sx*.25,.86,.27);
  // kerah kimono bentuk V (kiri menimpa kanan)
  for(const [sx,m] of[[1,kim2],[-1,kim]]){const c=ad(new THREE.BoxGeometry(.042,.012,.4),m,sx*.036,.618,.16);c.rotation.y=sx*.2}
  // obi + pita di depan
  const obi=ad(new THREE.CylinderGeometry(.19,.19,.15,20),kim2,0,.79,-.1);obi.rotation.x=Math.PI/2;obi.scale.set(1.0,1,.82);
  ad(new THREE.BoxGeometry(.07,.05,.06),kim2,0,.605,-.1);
  for(const sx of[-1,1]){
    const lp=ad(new THREE.BoxGeometry(.11,.035,.075),kim2,sx*.085,.608,-.1);lp.rotation.z=sx*.28;
    const tl=ad(new THREE.BoxGeometry(.065,.012,.34),kim2,sx*.035,.604,-.29);tl.rotation.y=sx*.13;
  }
  // leher
  ad(new THREE.CylinderGeometry(.04,.058,.52,10),skin,0,1.0,.47).rotation.x=.95;

  /* kepala: bola kulit + wajah lukis, rambut, poni, ikat kepala */
  const head=new THREE.Group();head.position.set(0,1.2,.72);B.add(head);
  const sk=ad(new THREE.SphereGeometry(.2,36,26),headM,0,-.01,-.02,head);sk.scale.set(.98,1.18,.94);
  ad(new THREE.SphereGeometry(.105,14,10),skin,0,-.2,.035,head).scale.set(.95,.8,.85);   // rahang & dagu
  const band=ad(new THREE.TorusGeometry(.205,.009,6,32),kim,0,.085,-.015,head);band.rotation.x=Math.PI/2;band.scale.set(.98,.94,1);
  for(const sx of[-1,1])ad(new THREE.SphereGeometry(.014,8,6),kim2,sx*.045,.09,.195,head);
  const cap=ad(new THREE.SphereGeometry(.214,28,18,Math.PI/2+.9,Math.PI*2-1.8,0,Math.PI*.62),hairM,0,-.01,-.02,head);cap.scale.set(.99,1.19,.95);
  const flap=ad(new THREE.SphereGeometry(.213,14,10,.95,.55,1.2,.75),hairM,0,-.01,-.02,head);flap.scale.set(.99,1.19,.95);  // poni penutup satu mata
  const hair=new THREE.Group();head.add(hair);
  const shg=new THREE.CylinderGeometry(.215,.285,.8,32,10,true,.85,Math.PI*2-1.7);
  {const p=shg.attributes.position;for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i),an=Math.atan2(z,x);
    if(y<-.34)p.setY(i,y-(Math.abs(Math.sin(an*6.1))*.6+Math.abs(Math.sin(an*13.3+1))*.4)*.15);
    const w=1+Math.sin(an*9+y*5)*.025;p.setX(i,x*w);p.setZ(i,z*w)}
   shg.computeVertexNormals()}
  ad(shg,hairM,0,-.42,0,hair);
  for(let i=0;i<56;i++){ // helai rambut panjang menjuntai
    const th=.85+Math.random()*(Math.PI*2-1.7),r=.26+Math.random()*.03,ln=.3+Math.random()*.4,x0=Math.sin(th)*r,z0=Math.cos(th)*r,wv=(Math.random()-.5)*.06;
    const pts=[0,.33,.66,1].map(k=>new THREE.Vector3(x0*(1+k*.08)+wv*Math.sin(k*5+i),-.8-ln*k,z0*(1+k*.08)+wv*Math.cos(k*4+i)));
    hair.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),8,.007+Math.random()*.006,4),hairM));
  }
  head.rotation.x=-.18;

  /* 4 anggota gerak: lengan berlengan kimono lebar, kaki telanjang */
  const limbs=[];
  const mkLimb=(x,y,z,up,dn,arm,off)=>{
    const side=x<0?-1:1;
    const p=new THREE.Group();p.position.set(x,y,z);B.add(p);
    ad(new THREE.SphereGeometry(.05,8,6),skin,0,0,0,p);
    ad(new THREE.CylinderGeometry(.04,.032,up,8),skin,0,-up/2,0,p);
    const e=new THREE.Group();e.position.y=-up;p.add(e);
    ad(new THREE.SphereGeometry(.038,8,6),skin,0,0,0,e);
    ad(new THREE.CylinderGeometry(.032,.024,dn,8),skin,0,-dn/2,0,e);
    const h=new THREE.Group();h.position.y=-dn;e.add(h);
    let sl=null;
    if(arm){ // tangan pucat berjari panjang + lengan baju lebar
      ad(new THREE.SphereGeometry(.045,8,6),skin,0,0,.04,h).scale.set(1.1,.4,1.5);
      for(let f=0;f<5;f++){const fl=f===0?.12:.17+Math.random()*.04;
        const fi=ad(new THREE.CylinderGeometry(.01,.006,fl,4),skin,(f-2)*.028,0,.08+fl/2,h);fi.rotation.x=Math.PI/2;fi.rotation.z=(f-2)*.08}
      sl=new THREE.Group();p.add(sl);
      const sg=raggedHem(new THREE.CylinderGeometry(.1,.17,.6,16,6,true),-.2,.12);
      const sm=new THREE.Mesh(sg,kim);sm.scale.set(.42,1,1);sm.position.set(side*.03,-.3,0);sl.add(sm);
    }else{ // kaki telanjang
      ad(new THREE.BoxGeometry(.07,.03,.17),skin,0,0,.05,h);
      for(let f=0;f<5;f++)ad(new THREE.BoxGeometry(.012,.014,.035),skin,(f-2)*.014,0,.15,h);
    }
    limbs.push({p,e,h,arm,off,side,sl,prev:0});
  };
  mkLimb(-.27,.86,.27,.45,.45,1,0);mkLimb(.27,.86,.27,.45,.45,1,Math.PI);
  mkLimb(-.2,.74,-.3,.43,.43,0,Math.PI);mkLimb(.2,.74,-.3,.43,.43,0,0);

  /* kimono bawah (hakama) berlapis & compang-camping, tidak ikut berputar */
  const sg1=raggedHem(new THREE.CylinderGeometry(.19,.33,1,26,8,true),-.42,.2);
  const sg2=raggedHem(new THREE.CylinderGeometry(.18,.27,.92,22,6,true),-.38,.22);
  const skirt=new THREE.Group();G.add(skirt);
  const s1=new THREE.Mesh(sg1,kim);skirt.add(s1);
  const s2=new THREE.Mesh(sg2,kim2);s2.position.y=-.04;s2.rotation.y=.5;skirt.add(s2);

  const au=spr(0xaa2222,3.2);au.position.set(0,.9,0);au.material.opacity=.13;G.add(au);   // aura merah tipis
  G.userData={S,body:B,head,hair,skirt,limbs,ph:0,tw:0,st:1,mode:'stand',mt:0,spd:0};
  return G;
}

function animCrawler(c,dt,spd,loud){
  const u=c.userData,st=u.st,cr=1-st,sc=1-.25*st;
  u.ph+=dt*spd*3.6;const ph=u.ph,mv=spd>.15?1:.15;
  u.S.rotation.x=-1.15*st;                 // berdiri tegak <-> merangkak
  u.S.scale.setScalar(sc);
  u.S.rotation.z=Math.sin(ph)*.05*mv*cr+Math.sin(T*.8)*.04*st;
  const hy=.76-.115*st+Math.abs(Math.sin(ph))*.03*mv*cr;
  u.S.position.y=hy;
  const len=Math.max(.3,hy-.1);            // hem kimono sampai pergelangan kaki
  u.skirt.scale.set(sc,len,sc);u.skirt.position.set(0,hy-len/2,-.3);u.skirt.rotation.z=Math.sin(T*1.7)*.03;
  u.limbs.forEach(L=>{
    const s=Math.sin(ph+L.off),cs=Math.cos(ph+L.off);let p,e,ps,es;
    if(L.arm){p=-.95+s*.55*mv;e=.95+Math.max(0,cs)*.8*mv;ps=1.15+Math.sin(T*1.3+L.off)*.06;es=.14+Math.sin(T*1.1+L.off)*.06}
    else{p=.8+s*.45*mv;e=-1.6-Math.max(0,cs)*.6*mv;ps=1.15;es=0}
    L.p.rotation.x=p*cr+ps*st;L.e.rotation.x=e*cr+es*st;
    L.p.rotation.z=L.side*((L.arm?.42:.3)*cr+.05*st);      // siku & lutut mencuat ke samping
    const flat=-(u.S.rotation.x+L.p.rotation.x+L.e.rotation.x);
    L.h.rotation.x=L.arm?flat*cr+(Math.PI/2)*st:flat;       // tangan menjuntai saat berdiri, telapak kaki selalu rata
    if(L.sl){L.sl.rotation.z=L.side*Math.sin(T*2+L.off)*.05;L.sl.rotation.x=Math.sin(T*7+L.off)*.1*cr*mv}
    if(loud&&cr>.95&&L.prev>0&&s<=0&&spd>.5)slap();
    L.prev=s;
  });
  if(Math.random()<dt*(.9+st*1.2))u.tw=(Math.random()-.35)*(.55+st*.4);u.tw*=1-Math.min(1,dt*7);
  u.head.rotation.x=-.18+1.33*st;                          // berdiri: kepala agak menunduk
  u.head.rotation.z=.22+Math.sin(T*1.7)*.07+u.tw;u.head.rotation.y=Math.sin(T*.9)*.16+u.tw*.5;
  u.hair.scale.y=.78+.22*st;u.hair.rotation.x=Math.sin(T*2.2)*.06;u.hair.rotation.z=Math.sin(T*1.4)*.05;
}

/* ---------- audio 3D ---------- */
let CP=null,CKB=null;
function cpan(){
  if(!AC)return null;
  if(!CP){
    const mg=AC.createGain();mg.gain.value=.95;mg.connect(AC.destination);
    CP=AC.createPanner();CP.panningModel='HRTF';CP.distanceModel='inverse';CP.refDistance=2.2;CP.rolloffFactor=1.35;CP.maxDistance=80;CP.connect(mg);
  }
  return CP;
}
function cSpatial(){
  if(!AC||!CP||!CW)return;
  const hd=CW.userData.head;hd.getWorldPosition(_cv);cam.getWorldDirection(_cf);
  if(CP.positionX){CP.positionX.value=_cv.x;CP.positionY.value=_cv.y;CP.positionZ.value=_cv.z}else CP.setPosition(_cv.x,_cv.y,_cv.z);
  const l=AC.listener,p=cam.position;
  if(l.positionX){l.positionX.value=p.x;l.positionY.value=p.y;l.positionZ.value=p.z;l.forwardX.value=_cf.x;l.forwardY.value=_cf.y;l.forwardZ.value=_cf.z;l.upX.value=0;l.upY.value=1;l.upZ.value=0}
  else{l.setPosition(p.x,p.y,p.z);l.setOrientation(_cf.x,_cf.y,_cf.z,0,1,0)}
}
function clickBuf(){
  if(CKB)return CKB;const n=Math.floor(AC.sampleRate*.03);CKB=AC.createBuffer(1,n,AC.sampleRate);
  const d=CKB.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);return CKB;
}
function clicks(n,vol=.6){ // klik-klik echolokasi ala Clicker
  const P=cpan();if(!P)return;const t0=AC.currentTime;let t=t0;
  for(let i=0;i<n;i++){
    t+=.055+Math.random()*.04;
    const s=AC.createBufferSource();s.buffer=clickBuf();
    const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1400+Math.random()*1800;bp.Q.value=4+Math.random()*5;
    const g=AC.createGain();g.gain.value=vol*(.7+Math.random()*.7)*2.2;
    s.connect(bp);bp.connect(g);g.connect(P);s.start(t);
    const o=AC.createOscillator(),og=AC.createGain();o.type='triangle';
    o.frequency.setValueAtTime(1000+Math.random()*600,t);o.frequency.exponentialRampToValueAtTime(360,t+.035);
    og.gain.setValueAtTime(vol*.55,t);og.gain.exponentialRampToValueAtTime(.0001,t+.04);
    o.connect(og);og.connect(P);o.start(t);o.stop(t+.06);
  }
  // geraman basah di tenggorokan
  const d=t-t0+.15,o=AC.createOscillator(),lp=AC.createBiquadFilter(),g=AC.createGain(),lf=AC.createOscillator(),ld=AC.createGain();
  o.type='sawtooth';o.frequency.setValueAtTime(70,t0);o.frequency.linearRampToValueAtTime(52,t0+d);
  lp.type='lowpass';lp.frequency.value=380;
  g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(vol*.28,t0+.05);g.gain.exponentialRampToValueAtTime(.0001,t0+d);
  lf.frequency.value=23;ld.gain.value=vol*.2;lf.connect(ld);ld.connect(g.gain);
  o.connect(lp);lp.connect(g);g.connect(P);o.start(t0);lf.start(t0);o.stop(t0+d+.05);lf.stop(t0+d+.05);
}
function slap(){ // telapak tangan menampar aspal
  const P=cpan();if(!P)return;const t=AC.currentTime,n=Math.floor(AC.sampleRate*.1),b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,5);
  const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=520;
  const g=AC.createGain();g.gain.value=.5;s.connect(f);f.connect(g);g.connect(P);s.start(t);
}
let _shp=null;
function laugh(){ // tawa serak: tarik napas, lalu ha-ha-ha menurun
  const P=cpan();if(!P||CK.lbusy>T)return;
  const t0=AC.currentTime;
  if(!_shp){_shp=AC.createWaveShaper();const c=new Float32Array(256);for(let i=0;i<256;i++){const x=i/128-1;c[i]=Math.tanh(x*3.2)}_shp.curve=c;_shp.connect(P)}
  // tarikan napas
  {const n=Math.floor(AC.sampleRate*.4),b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.sin(i/n*Math.PI);
   const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=2;f.frequency.setValueAtTime(600,t0);f.frequency.exponentialRampToValueAtTime(2600,t0+.4);
   const g=AC.createGain();g.gain.value=.5;s.connect(f);f.connect(g);g.connect(P);s.start(t0)}
  const n=7+Math.floor(Math.random()*4),base=215+Math.random()*50;let t=t0+.5;
  for(let i=0;i<n;i++){
    const f0=base*(1-i*.028),dur=.15+Math.random()*.03;
    for(const [type,det] of [['sawtooth',0],['sawtooth',14]]){
      const o=AC.createOscillator();o.type=type;o.detune.value=det;
      o.frequency.setValueAtTime(f0*1.14,t);o.frequency.exponentialRampToValueAtTime(f0*.88,t+dur);
      const vb=AC.createOscillator(),vg=AC.createGain();vb.frequency.value=7+Math.random()*3;vg.gain.value=f0*.025;vb.connect(vg);vg.connect(o.frequency);
      const a=AC.createBiquadFilter(),b2=AC.createBiquadFilter(),g=AC.createGain();
      a.type=b2.type='bandpass';a.Q.value=6;b2.Q.value=8;a.frequency.value=780+Math.random()*80;b2.frequency.value=1250+i*20;
      g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.55,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
      o.connect(a);o.connect(b2);a.connect(g);b2.connect(g);g.connect(_shp);
      o.start(t);vb.start(t);o.stop(t+dur+.02);vb.stop(t+dur+.02);
    }
    // hembusan "h"
    const nn=Math.floor(AC.sampleRate*.06),bb=AC.createBuffer(1,nn,AC.sampleRate),dd=bb.getChannelData(0);for(let k=0;k<nn;k++)dd[k]=(Math.random()*2-1)*(1-k/nn);
    const ns=AC.createBufferSource();ns.buffer=bb;const nf=AC.createBiquadFilter();nf.type='highpass';nf.frequency.value=2200;const ng=AC.createGain();ng.gain.value=.3;
    ns.connect(nf);nf.connect(ng);ng.connect(P);ns.start(t);
    t+=.2+Math.random()*.04+i*.006;
  }
  CK.lbusy=T+(t-t0)+.4;
}

/* ---------- logika kejaran: berdiri dulu, lalu jatuh dan merangkak ---------- */
function ensureCW(){if(!CW){CW=makeCrawler();CW.visible=false;scene.add(CW)}}
function crawlerReset(x,z){
  const u=CW.userData;u.mode='stand';u.mt=0;u.st=1;u.spd=0;
  CW.position.set(x,0,z);CW.visible=true;CK.on=1;CK.next=T+1.4;CK.lnext=T+1.2;CK.lbusy=0;
}
chaseStart=function(){
  ensureCW();
  H.ph=4;mus('kejar');ghost.visible=false;
  crawlerReset(300,me.z+13);
  flash('#fff',140);toast('Ada sesuatu berdiri di jalan…');
  objSet('Lari ke rumah Nenek! <span style="opacity:.6">(tahan Shift)</span>');
};
chase=function(dt){
  ensureCW();ghost.visible=false;
  const u=CW.userData,gx=CW.position.x,gz=CW.position.z,d=Math.hypot(me.x-gx,me.z-gz),vx=(me.x-gx)/d,vz=(me.z-gz)/d;
  CW.rotation.y=Math.atan2(vx,vz);u.mt+=dt;
  if(u.mode==='stand'){
    u.st=1;u.spd=0;
    if(u.mt>3){u.mode='drop';u.mt=0;scream();flash('#fff',100);if(AC){clicks(9,1);thump(40,.9)}toast('LARI! Ke rumah Nenek!')}
  }else if(u.mode==='drop'){
    const k=clamp(u.mt/.4,0,1);u.st=1-k*k;u.spd=0;
    if(k>=1){u.mode='crawl';u.st=0;if(AC){slap();setTimeout(slap,90)}}
  }else{
    const sp=CFG.hantuLari*(1+.2*Math.max(0,Math.sin(T*2.4))); // menerkam sebentar-sebentar
    CW.position.x+=vx*sp*dt;CW.position.z+=vz*sp*dt;u.spd=sp;
    if(d<5&&Math.random()<.05)flash('#a00',60);
    if(d<1.8)return jump('Kamu tertangkap di jalan desa.',()=>{
      me.x=300;me.z=26;yaw=Math.PI;H.ph=4;crawlerReset(300,39);mus('kejar');
    });
  }
  if(me.z<3&&Math.abs(me.x-300)<1.6)arriveGrandma();
};
const _jumpOrig=jump;
jump=function(msg,retry){
  if(BUSY)return;
  const crawling=H&&H.ph===4&&CW;
  _jumpOrig(msg,retry);
  if(crawling){
    ghost.visible=false;
    const u=CW.userData;u.mode='crawl';u.st=0;u.spd=0;
    const gx=me.x-Math.sin(yaw)*1.7,gz=me.z-Math.cos(yaw)*1.7;
    CW.position.set(gx,0,gz);CW.rotation.y=Math.atan2(me.x-gx,me.z-gz);CW.visible=true;
    cSpatial();clicks(10,1);setTimeout(laugh,250);
  }
};
const _arriveOrig=arriveGrandma;
arriveGrandma=function(){CK.on=0;if(CW)CW.visible=false;_arriveOrig()};

const _tick2Orig=tick2;
tick2=function(dt){
  _tick2Orig(dt);
  if(!CW||!CW.visible)return;
  const u=CW.userData,chasing=H&&H.ph===4&&!BUSY;
  if(chasing){
    animCrawler(CW,dt,u.spd||0,u.mode==='crawl');
    cSpatial();
    const d=Math.hypot(me.x-CW.position.x,me.z-CW.position.z),near=clamp(d/12,.35,1);
    if(AC&&CK.on){
      if(T>CK.next){clicks(u.mode==='stand'?2+Math.floor(Math.random()*3):3+Math.floor(Math.random()*6),u.mode==='stand'?.4:.55);CK.next=T+(.9+Math.random()*1.6)*near}
      if(T>CK.lnext&&CK.lbusy<T){laugh();CK.lnext=T+(5+Math.random()*4)*(.6+near*.4)}
    }
  }else{
    // saat tertangkap: kepala bergetar liar
    animCrawler(CW,dt,0,false);
    u.head.rotation.z=.3+Math.sin(T*40)*.14;u.head.rotation.y=Math.sin(T*33)*.2;
    cSpatial();
  }
};
