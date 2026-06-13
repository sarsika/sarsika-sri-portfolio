/* ============ Typing effect ============ */
const typingEl = document.getElementById('typing');
const typingMessages = [
  "Turning ideas into intelligent software solutions using Java, AI and Full Stack Development.",
  "Building secure, scalable applications with Java & Spring Boot.",
  "Open to Software Developer / Java Developer / Full Stack roles."
];
let tmi = 0, tci = 0, tdeleting = false;
function typeLoop(){
  const msg = typingMessages[tmi];
  if(!tdeleting){
    typingEl.textContent = msg.slice(0,++tci);
    if(tci===msg.length){tdeleting=true;setTimeout(typeLoop,2200);return;}
  } else {
    typingEl.textContent = msg.slice(0,--tci);
    if(tci===0){tdeleting=false;tmi=(tmi+1)%typingMessages.length;}
  }
  setTimeout(typeLoop,tdeleting?25:40);
}
typingEl.textContent='';
setTimeout(typeLoop,600);

/* ============ Cursor glow ============ */
const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove',(e)=>{
  glow.style.left=e.clientX+'px';
  glow.style.top=e.clientY+'px';
});

/* ============ Reveal on scroll ============ */
document.querySelectorAll('section,.timeline-item,.project-card,.skill-card,.cert-card,.achievement-card,.why-card,.counter-card')
  .forEach(el=>el.classList.add('reveal'));
const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');});
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ============ Animated counters ============ */
const counters=document.querySelectorAll('.counter');
let countersStarted=false;
function animateCounters(){
  counters.forEach(counter=>{
    const target=parseFloat(counter.dataset.target);
    const isDecimal=target%1!==0;
    const duration=1500;
    const startTime=performance.now();
    function update(now){
      const progress=Math.min((now-startTime)/duration,1);
      const value=progress*target;
      counter.textContent=isDecimal?value.toFixed(2):Math.floor(value);
      if(progress<1)requestAnimationFrame(update);
      else counter.textContent=isDecimal?target.toFixed(2):target;
    }
    requestAnimationFrame(update);
  });
}
const counterSection=document.querySelector('.counter-section');
if(counterSection){
  const counterIO=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting&&!countersStarted){countersStarted=true;animateCounters();}
    });
  },{threshold:0.3});
  counterIO.observe(counterSection);
}

/* ============ Active nav ============ */
const navLinks=document.querySelectorAll('.navbar ul li a');
const sectionIds=[...navLinks].map(a=>a.getAttribute('href').slice(1));
function updateActiveNav(){
  let current=sectionIds[0];
  for(const id of sectionIds){
    const el=document.getElementById(id);
    if(el&&el.getBoundingClientRect().top<window.innerHeight*0.4)current=id;
  }
  navLinks.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+current);});
}
window.addEventListener('scroll',updateActiveNav,{passive:true});
updateActiveNav();

/* ============ 3D Particles ============ */
const prefersReduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
if(typeof THREE!=='undefined'){
  const canvas=document.getElementById('particles');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.z=5;
  const particleCount=350;
  const positions=new Float32Array(particleCount*3);
  for(let i=0;i<particleCount;i++){positions[i*3]=(Math.random()-0.5)*16;positions[i*3+1]=(Math.random()-0.5)*10;positions[i*3+2]=(Math.random()-0.5)*10;}
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const material=new THREE.PointsMaterial({color:0x5eead4,size:0.035,transparent:true,opacity:0.6});
  const points=new THREE.Points(geometry,material);
  scene.add(points);
  const accentCount=60;
  const accentPositions=new Float32Array(accentCount*3);
  for(let i=0;i<accentCount;i++){accentPositions[i*3]=(Math.random()-0.5)*16;accentPositions[i*3+1]=(Math.random()-0.5)*10;accentPositions[i*3+2]=(Math.random()-0.5)*10;}
  const accentGeo=new THREE.BufferGeometry();
  accentGeo.setAttribute('position',new THREE.BufferAttribute(accentPositions,3));
  const accentMat=new THREE.PointsMaterial({color:0xfbbf24,size:0.045,transparent:true,opacity:0.55});
  const accentPoints=new THREE.Points(accentGeo,accentMat);
  scene.add(accentPoints);
  window.addEventListener('resize',()=>{renderer.setSize(window.innerWidth,window.innerHeight);camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();});
  let mouseX=0,mouseY=0;
  window.addEventListener('mousemove',(e)=>{mouseX=(e.clientX/window.innerWidth-0.5);mouseY=(e.clientY/window.innerHeight-0.5);});
  function animate(){
    if(!prefersReduced){
      points.rotation.y+=0.0006;points.rotation.x+=0.0002;accentPoints.rotation.y-=0.0004;
      camera.position.x+=(mouseX*0.6-camera.position.x)*0.02;
      camera.position.y+=(-mouseY*0.6-camera.position.y)*0.02;
      camera.lookAt(scene.position);
    }
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============ Lightbox ============ */
const lightbox=document.getElementById('lightbox');
const lightboxImg=document.getElementById('lightboxImg');
const lightboxClose=document.getElementById('lightboxClose');
document.querySelectorAll('.project-img-wrap img').forEach(img=>{
  img.addEventListener('click',()=>{
    lightboxImg.src=img.src;
    lightbox.classList.add('active');
    document.body.style.overflow='hidden';
  });
});
function closeLightbox(){lightbox.classList.remove('active');document.body.style.overflow='';}
lightboxClose.addEventListener('click',closeLightbox);
lightbox.addEventListener('click',(e)=>{if(e.target===lightbox)closeLightbox();});
document.addEventListener('keydown',(e)=>{if(e.key==='Escape')closeLightbox();});