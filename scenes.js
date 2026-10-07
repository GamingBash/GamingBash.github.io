/* Browser adaptations of Mopixy's native scenes. Artwork is copied, never regenerated. */
window.MopixyScenes = (() => {
  const definitions = {
    snow:{title:'Snow Pine',asset:'snow_pine_flat.png',category:'A SIX-HOUR SEASON',description:'Falling flakes, resting branches and a slow, sunlit thaw.'},
    chime:{title:'Summer Chime',asset:'summer_chime_base.png',category:'A BREATH OF SUMMER',description:'A glass bell and a little paper ribbon, following the breeze.'},
    console:{title:'Retro Handheld',asset:'retro_handheld_base.png',category:'ONE MORE LITTLE LEVEL',description:'A tiny pixel adventure, playing on the console screen.'},
    soda:{title:'Peach Soda',asset:'peach_soda_base.png',category:'SOMETHING SWEET',description:'A warm afternoon. Bubbles rising through a peach-coloured drink.'},
    lantern:{title:'Amber Lantern',asset:'amber_lantern_base.png',category:'STAY A LITTLE LONGER',description:'A softly glowing lamp, with five fireflies finding their way.'}
  };
  const images={}, errors=[];let loaded=false;
  const promises=Object.entries({...definitions,chimeSprite:{asset:'summer_chime_sprite.png'}}).map(([id,d])=>new Promise(resolve=>{const im=new Image();im.onload=()=>{images[id]=im;resolve()};im.onerror=()=>{errors.push(d.asset);resolve()};im.src='assets/'+d.asset}));
  const mod=(n,m)=>(n%m+m)%m;
  const smooth=v=>{const x=Math.max(0,Math.min(1,v));return x*x*(3-2*x)};
  const tau=Math.PI*2;
  function buffer(w,h){const b=document.createElement('canvas');b.width=w;b.height=h;return b}
  function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
  function tile(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.floor(x),Math.floor(y),w,h)}
  let chimeSprite;
  function prepareChime(){const im=images.chimeSprite;if(!im)return;const temp=buffer(im.width,im.height),c=temp.getContext('2d',{willReadFrequently:true});c.drawImage(im,0,0);const p=c.getImageData(0,0,im.width,im.height).data;let l=im.width,r=0,t=im.height,b=0;for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++)if(p[(y*im.width+x)*4+3]>=240){l=Math.min(l,x);r=Math.max(r,x+1);t=Math.min(t,y);b=Math.max(b,y+1)}chimeSprite=buffer(28,110);const s=chimeSprite.getContext('2d',{willReadFrequently:true});s.imageSmoothingEnabled=false;s.drawImage(im,l,t,r-l,b-t,0,0,28,110);const data=s.getImageData(0,0,28,110);for(let i=0;i<data.data.length;i+=4){const n=i/4,u=(n%28+.5)/28,v=(Math.floor(n/28)+.5)/110,d=Math.hypot((u-.515)/.48,(v-.423)/.114),a=data.data[i+3];if(d<.86&&a<235){data.data[i]=180;data.data[i+1]=227;data.data[i+2]=235;data.data[i+3]=35}else data.data[i+3]=(d<=1.05&&a>=110)||a>=235?255:0}s.putImageData(data,0,0)}
  const firefly=buffer(9,9);{
    const c=firefly.getContext('2d');for(let y=-3;y<=3;y++){const half=Math.abs(y)===3?1:Math.abs(y)===2?2:3;tile(c,4-half,4+y,half*2+1,1,'#ffb35012')}
    tile(c,3,2,3,5,'#ffd4763c');tile(c,2,3,5,3,'#ffd4763c');tile(c,2,3,1,1,'#cdcaa04b');tile(c,5,5,1,1,'#cdcaa04b');tile(c,4,3,1,1,'#73592d');tile(c,3,4,2,1,'#fff4ab');tile(c,4,4,1,1,'#ffffd3');
  }
  const paths=[];
  for(let i=0;i<5;i++){const random=rng(1739+i*937),nodes=Array.from({length:12},(_,k)=>i>=3&&k%4===1?[12+random()*168,(Math.floor(k/4)+i)%2===0?20+random()*341*.27:341*.82+random()*341*.1]:[96+(random()-.5)*86,341*.638+(random()-.5)*104]);const path=[],distances=[0];for(let s=0;s<=768;s++){const q=s/768*12,k=Math.floor(q)%12,u=q-Math.floor(q),a=nodes[(k+11)%12],b=nodes[k],c=nodes[(k+1)%12],d=nodes[(k+2)%12];const curve=j=>.5*(2*b[j]+(-a[j]+c[j])*u+(2*a[j]-5*b[j]+4*c[j]-d[j])*u*u+(-a[j]+3*b[j]-3*c[j]+d[j])*u*u*u);path.push([Math.max(8,Math.min(184,curve(0))),Math.max(8,Math.min(333,curve(1)))]);if(s)distances.push(distances[s-1]+Math.hypot(path[s][0]-path[s-1][0],path[s][1]-path[s-1][1]))}paths.push({path,distances})}
  function wandering(i,t){const cycle=mod(t,120)/120,phase=i*.83,progress=cycle+.045*(Math.sin(tau*cycle+phase)-Math.sin(phase))+.012*(Math.sin(tau*cycle*3+phase)-Math.sin(phase)),{path,distances}=paths[i],target=progress*distances[768];let lo=0,hi=768;while(hi-lo>1){const mid=Math.floor((lo+hi)/2);if(distances[mid]<target)lo=mid;else hi=mid}const mix=(target-distances[lo])/(distances[hi]-distances[lo]||1);return [path[lo][0]+(path[hi][0]-path[lo][0])*mix,path[lo][1]+(path[hi][1]-path[lo][1])*mix]}
  function triangle(c,im,src,dst){const [x0,y0,x1,y1,x2,y2]=src,[u0,v0,u1,v1,u2,v2]=dst,den=x0*(y1-y2)+x1*(y2-y0)+x2*(y0-y1);const a=(u0*(y1-y2)+u1*(y2-y0)+u2*(y0-y1))/den,b=(v0*(y1-y2)+v1*(y2-y0)+v2*(y0-y1))/den,cc=(u0*(x2-x1)+u1*(x0-x2)+u2*(x1-x0))/den,d=(v0*(x2-x1)+v1*(x0-x2)+v2*(x1-x0))/den,e=u0-a*x0-cc*y0,f=v0-b*x0-d*y0;c.save();c.beginPath();c.moveTo(u0,v0);c.lineTo(u1,v1);c.lineTo(u2,v2);c.closePath();c.clip();c.transform(a,b,cc,d,e,f);c.drawImage(im,0,0);c.restore()}
  function gameFrame(c,t){
    const dark='#11313f',mint='#a3e7bd',amber='#ffd67f',far='#377d81',near='#194f55',travel=mod(t,32)*8;
    c.fillStyle='#50a5a2';c.fillRect(0,0,96,56);
    for(let i=0;i<4;i++){const x=mod(i*32-travel*.25,128)-12;tile(c,x,9+i%2*3,12,2,mint);tile(c,x+3,7+i%2*3,6,2,mint)}
    for(let i=-1;i<=4;i++){const x=i*32-mod(travel*.125,32);for(let row=0;row<=17;row++)tile(c,x+15-row,21+row,row*2+2,1,far)}
    tile(c,0,35,96,21,near);
    for(let x=0;x<96;x++){const wx=mod(travel+x,128);if(wx<80||wx>=100){tile(c,x,40,1,16,dark);tile(c,x,39,1,2,mint);if(Math.floor(wx)%8<3)tile(c,x,44,1,1,far);if(Math.floor(wx)%11<2)tile(c,x,51,1,1,far)}}
    const star=(x,y,color)=>{tile(c,x+1,y,1,5,color);tile(c,x-1,y+2,5,1,color)};
    for(let i=0;i<2;i++){const x=mod(i*128+45-travel+24,256)-24;tile(c,x,31,2,8,dark);tile(c,x-3,27,8,5,near);tile(c,x-1,24,4,4,near);const coin=mod(i*128+89-travel+24,256)-24;if(coin>25)star(coin,24+Math.sin(t*Math.PI/2)*1.2,amber)}
    const world=mod(travel+24,128),jump=world>=70&&world<=110?Math.sin(Math.PI*(world-70)/40)*15:0;
    // Same original character and jump timing, enlarged to read on a miniature phone.
    const size=1.75,top=Math.round(39-jump)-17,walk=Math.floor(t*4)%2;
    const hero=['..111..','.12221.','.12321.','..222..','.44444.','4454544','.45554.','..454..'];
    hero.forEach((row,y)=>[...row].forEach((n,x)=>{if(n!=='.')tile(c,18+x*size,top+y*size,2,2,{'1':dark,'3':dark,'2':amber,'4':mint,'5':far}[n])}));
    tile(c,20-(jump>.5?0:walk),top+14,3,3,dark);tile(c,26+(jump>.5?1:walk),top+14,3,jump>.5?2:3,dark);
    if(world>=91&&world<=101){const s=(world-91)*.6;star(25-s,top-3-s,mint);star(28+s,top+s,amber)}
    for(let i=0;i<2;i++){const x=5+i*7;tile(c,x,3,2,1,amber);tile(c,x+3,3,2,1,amber);tile(c,x,4,5,2,amber);tile(c,x+1,6,3,1,amber);tile(c,x+2,7,1,1,amber)}
  }
  class Scene {
    constructor(canvas,id){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.id=id;this.t=0;this.frames=0;this.visible=true;this.night=false;this.brightness=1;this.zoom=1;this.cropY=0;this.speed=1;this.animationTime=0;this.snowPhase=0;this.lastT=0;this.prepared=false;this.game=buffer(96,56);this.gc=this.game.getContext('2d');this.gc.imageSmoothingEnabled=false;this.snowDeposits=new Float32Array(192);const random=rng(706);this.flakes=Array.from({length:112},(_,i)=>({x:random()*192,y:random()*280,speed:9+random()*14,drift:random()*4-2,size:i%4===0?2:1}));this.dirty=true}
    prepare(){if(this.prepared)return;this.prepared=true;this.snowTop=new Int16Array(192).fill(290);this.snowTree=new Int16Array(192).fill(341);this.branchMask=Array.from({length:192},()=>[]);const sc=buffer(192,341),c=sc.getContext('2d',{willReadFrequently:true});c.drawImage(images.snow,0,0,192,341);const p=c.getImageData(0,0,192,341).data,tree=(x,y)=>{const i=(y*192+x)*4;return x>34&&x<150&&y>201&&y<307&&p[i]<90&&p[i+1]>p[i]*1.15&&p[i+1]>=p[i+2]*.85&&p[i+2]<150};for(let x=0;x<192;x++){for(let y=265;y<341;y++){const i=(y*192+x)*4;if(p[i]>70&&p[i+1]>95&&p[i+1]>p[i+2]*1.08){this.snowTop[x]=y;break}}for(let y=201;y<307;y++)if(tree(x,y)){if(this.snowTree[x]===341)this.snowTree[x]=y;if(!tree(x,y-1))this.branchMask[x].push(y)}}this.lampDim=buffer(192,341);this.lampBright=buffer(192,341);const lc=buffer(192,341).getContext('2d',{willReadFrequently:true});lc.drawImage(images.lantern,0,0,192,341);const lp=lc.getImageData(0,0,192,341),dim=lc.createImageData(192,341),bright=lc.createImageData(192,341);for(let y=190;y<242;y++)for(let x=80;x<=111;x++){const i=(y*192+x)*4;if(lp.data[i]>155&&lp.data[i+1]>80&&lp.data[i+2]<190){for(let j=0;j<3;j++){dim.data[i+j]=lp.data[i+j]*.84;bright.data[i+j]=Math.min(255,lp.data[i+j]*1.03)}dim.data[i+3]=bright.data[i+3]=255}}this.lampDim.getContext('2d').putImageData(dim,0,0);this.lampBright.getContext('2d').putImageData(bright,0,0);const bc=buffer(192,341).getContext('2d',{willReadFrequently:true});bc.drawImage(images.soda,0,0,192,341);const bp=bc.getImageData(0,0,192,341).data;this.liquid=new Uint8Array(192*341);for(let y=204;y<275;y++)for(let x=64;x<=109;x++){const i=(y*192+x)*4;this.liquid[y*192+x]=bp[i]-bp[i+1]>45&&bp[i+1]>=75&&bp[i+1]<=195&&bp[i+2]<185?1:0}}
    prepareSnowTerrain(){
      if(this.terrain)return;
      this.terrain=new Float32Array(192);this.peakSurface=new Float32Array(192);
      const bounds=(left,right)=>{let top=341,bottom=0,l=192,r=0;for(let x=left;x<right;x++)for(const y of this.branchMask[x]){top=Math.min(top,y);bottom=Math.max(bottom,y);l=Math.min(l,x);r=Math.max(r,x)}return {top,bottom,center:(l+r)/2}};
      const big=bounds(34,94),small=bounds(94,150);
      const a=big.top+(big.bottom-big.top)/3+1,b=small.top+(small.bottom-small.top)/4+1;
      for(let x=0;x<192;x++){
        let sum=0,count=0;for(let j=Math.max(0,x-8);j<=Math.min(191,x+8);j++){sum+=this.snowTop[j];count++}
        this.terrain[x]=sum/count;
        const blend=smooth((x-big.center)/Math.max(1,small.center-big.center));
        this.peakSurface[x]=a+(b-a)*blend+Math.max(0,x-small.center)*.07+Math.max(0,big.center-x)*.04;
      }
      this.branchDeposits=Array.from({length:192},(_,x)=>new Float32Array(this.branchMask[x].length));
      this.previousDepth=0;
    }
    snowSurface(x,depth){return Math.max(this.peakSurface[x]-.5,this.terrain[x]+(this.peakSurface[x]-this.terrain[x])*depth-this.snowDeposits[x])}
    snow(c,t,dt){
      this.prepareSnowTerrain();
      const s=mod(this.snowPhase+t,21600)/90;
      const depth=s<120?.32*smooth(s/12)+.68*smooth(s/120):s<138?1:s<216?1-smooth((s-138)/78):0;
      const sun=smooth((s-128)/14)*(1-smooth((s-224)/16)),fall=1-smooth((s-120)/12),speed=.65+.35*smooth(s/40)-.45*smooth((s-110)/22);
      if(depth<this.previousDepth){const ratio=this.previousDepth?depth/this.previousDepth:0;for(let x=0;x<192;x++){this.snowDeposits[x]*=ratio;this.branchDeposits[x].forEach((v,j)=>this.branchDeposits[x][j]=v*ratio)}}this.previousDepth=depth;
      c.fillStyle=`rgba(15,41,78,${fall*.23})`;c.fillRect(0,0,192,341);
      if(sun>.001){c.fillStyle=`rgba(255,229,156,${sun*.1})`;c.fillRect(113,38,38,38);c.fillStyle=`rgba(255,237,173,${sun})`;for(let y=-10;y<=10;y+=2){const extent=Math.sqrt(Math.max(0,100-y*y));c.fillRect(132-extent,58+y,extent*2,2)}}
      for(let x=0;x<192;x++){
        const y=Math.round(this.snowSurface(x,depth));
        if(depth>.0001){c.fillStyle=`rgba(238,247,253,${smooth(depth/.025)})`;c.fillRect(x,y,1,341-y);c.fillStyle=`rgba(255,254,251,${smooth(depth/.025)})`;c.fillRect(x,y,1,3)}
        c.fillStyle='#fafcff';
        this.branchMask[x].forEach((by,j)=>{const d=Math.round(depth*3+this.branchDeposits[x][j]);if(d&&by<y)c.fillRect(x,by-d,1,d)});
        if(this.snowDeposits[x]>.1)c.fillRect(x,y,1,1);
      }
      for(let i=0;i<Math.round(112*fall);i++){
        const f=this.flakes[i],before=f.y;
        f.x=mod(f.x+(f.drift+Math.sin(t*.31)*1.8)*dt,192);f.y+=f.speed*speed*dt;
        const x=Math.floor(f.x);let floor=this.snowSurface(x,depth),branch=-1;
        this.branchMask[x].forEach((by,j)=>{const top=by-depth*3-this.branchDeposits[x][j];if(top<floor&&before+f.size<=top&&f.y+f.size>=top){floor=top;branch=j}});
        if(f.y+f.size>=floor){if(branch>=0)this.branchDeposits[x][branch]=Math.min(1.5,this.branchDeposits[x][branch]+f.size*.22);else this.snowDeposits[x]=Math.min(1.5,this.snowDeposits[x]+f.size*.22);f.x=mod(i*53+t*7,192);f.y=-2-mod(i*7,12)}
        tile(c,f.x,f.y,f.size,f.size,i%4===0?'#fcfeff':'#eff8ffbb');
      }
    }
    soda(c,t){
      // Buoyant bubbles grow as they rise. Cache the liquid mask so ice and the rim occlude them.
      this.bubblePixels=0;
      for(let i=0;i<18;i++){
        const period=[9,12,15][i%3],age=mod(t/period+i*.061,1);
        const x=68+(i*11%35)+Math.sin(t*.7+i)*.65;
        const surface=341*.608,bottom=341*.796;
        const y=bottom-(bottom-surface)*(.82*age+.18*age*age),r=.9+age*1.25;
        const opacity=age>.94?(1-age)/.06:1;
        for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){
          if(Math.abs(Math.hypot(dx,dy)-r)>.6)continue;
          const xx=Math.floor(x+dx),yy=Math.floor(y+dy);
          if(this.liquid[yy*192+xx]){c.fillStyle=`rgba(255,${dy<0?253:233},${dy<0?240:199},${opacity})`;c.fillRect(xx,yy,1,1);this.bubblePixels++}
        }
        // Small surface bursts fade inside the glass rather than floating above the scene.
        if(age>.95)for(const side of [-1,1]){
          const xx=Math.floor(x+side*(age-.95)*70),yy=Math.floor(surface+1);
          if(this.liquid[yy*192+xx])tile(c,xx,yy,1,1,`rgba(255,250,234,${opacity})`);
        }
      }
    }
    lantern(c,t){const flicker=Math.max(.84,Math.min(1.03,.93+.065*Math.sin(tau*t/6)+.025*Math.sin(tau*t*37/60)));c.globalAlpha=1;c.drawImage(this.lampDim,0,0);c.globalAlpha=Math.max(0,Math.min(1,(flicker-.84)/.19));c.drawImage(this.lampBright,0,0);c.globalAlpha=1;for(let i=0;i<5;i++){const [x,y]=wandering(i,t);if(x>=78&&x<=114&&y>=341*.545&&y<=341*.722)continue;c.globalAlpha=.65+.35*Math.sin(tau*t/5+i*1.7)**2;c.drawImage(firefly,Math.round(x)-4,Math.round(y)-4)}c.globalAlpha=1}
    chime(c,t){if(!chimeSprite)return;let angle=0;for(let i=0;i<3;i++){const f=tau*(15+i*12)/60,force=[3.2,.7,.3][i],real=5.5**2-f*f,imaginary=2*.42*5.5*f;angle+=force*5.5**2/Math.hypot(real,imaginary)*Math.sin(f*t-Math.atan2(imaginary,real)+i*.8)}const flex=Math.sin(tau*t/1.5-.8)*2.2+Math.sin(tau*t/2.5+.4)*1.2;c.save();c.translate(192*.816,341*.426);c.rotate(angle*Math.PI/180);for(let y=0;y<110;y++){const v=y/110,paper=Math.max(0,(v-.65)/.35),cord=v<.3?Math.sin(v/.3*Math.PI)*Math.sin(tau*t/2.5)*.6:0;c.drawImage(chimeSprite,0,y,28,1,-14+paper*paper*flex+cord,y-paper*paper*Math.abs(flex)*.15,28,1)}c.restore()}
    console(c,t){gameFrame(this.gc,t);const p=[534/941*192,972/1672*341,713/941*192,1006/1672*341,652/941*192,1111/1672*341,459/941*192,1073/1672*341];triangle(c,this.game,[0,0,96,0,96,56],[...p.slice(0,6)]);triangle(c,this.game,[0,0,96,56,0,56],[...p.slice(0,2),...p.slice(4,8)])}
    draw(t){this.t=t;const im=images[this.id],c=this.ctx;if(!loaded||!im||errors.length)return;this.prepare();const w=this.canvas.width,h=this.canvas.height,dt=Math.max(0,Math.min(.15,t-this.lastT));this.lastT=t;this.animationTime+=dt*this.speed;c.imageSmoothingEnabled=false;c.clearRect(0,0,w,h);c.save();c.translate(w*(1-this.zoom)/2,h*(1-this.zoom)/2-this.cropY*h*(this.zoom-1)/2);c.scale(this.zoom,this.zoom);c.drawImage(im,0,0,w,h);c.save();c.scale(w/192,h/341);this[this.id](c,this.animationTime,dt*this.speed);c.restore();c.restore();if(this.night){c.fillStyle='#17213e66';c.fillRect(0,0,w,h)}if(this.brightness<1){c.fillStyle=`rgba(0,0,0,${1-this.brightness})`;c.fillRect(0,0,w,h)}else if(this.brightness>1){c.fillStyle=`rgba(255,248,232,${(this.brightness-1)*.5})`;c.fillRect(0,0,w,h)}this.frames++;this.dirty=false}
  }
  return {definitions,Scene,ready:Promise.all(promises).then(()=>{prepareChime();loaded=true}),images,errors,mod};
})();
