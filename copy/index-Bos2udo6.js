import{I as x,Q as O,i as I,a as W,x as b}from"./index-CWdX713u.js";import{a as M,n as w,c as N}from"./if-defined-Bmgtyenu.js";import"./index-BsccQCB1.js";const A=.1,k=2.5,$=7;function E(c,r,h){return c===r?!1:(c-r<0?r-c:c-r)<=h+A}function Q(c,r){const h=Array.prototype.slice.call(O.create(c,{errorCorrectionLevel:r}).modules.data,0),d=Math.sqrt(h.length);return h.reduce((p,u,f)=>(f%d===0?p.push([u]):p[p.length-1].push(u))&&p,[])}const D={generate({uri:c,size:r,logoSize:h,dotColor:d="#141414"}){const p="transparent",f=[],l=Q(c,"Q"),n=r/l.length,C=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];C.forEach(({x:o,y:t})=>{const s=(l.length-$)*n*o,e=(l.length-$)*n*t,a=.45;for(let i=0;i<C.length;i+=1){const m=n*($-i*2);f.push(x`
            <rect
              fill=${i===2?d:p}
              width=${i===0?m-5:m}
              rx= ${i===0?(m-5)*a:m*a}
              ry= ${i===0?(m-5)*a:m*a}
              stroke=${d}
              stroke-width=${i===0?5:0}
              height=${i===0?m-5:m}
              x= ${i===0?e+n*i+5/2:e+n*i}
              y= ${i===0?s+n*i+5/2:s+n*i}
            />
          `)}});const R=Math.floor((h+25)/n),z=l.length/2-R/2,S=l.length/2+R/2-1,_=[];l.forEach((o,t)=>{o.forEach((s,e)=>{if(l[t][e]&&!(t<$&&e<$||t>l.length-($+1)&&e<$||t<$&&e>l.length-($+1))&&!(t>z&&t<S&&e>z&&e<S)){const a=t*n+n/2,i=e*n+n/2;_.push([a,i])}})});const y={};return _.forEach(([o,t])=>{var s;y[o]?(s=y[o])==null||s.push(t):y[o]=[t]}),Object.entries(y).map(([o,t])=>{const s=t.filter(e=>t.every(a=>!E(e,a,n)));return[Number(o),s]}).forEach(([o,t])=>{t.forEach(s=>{f.push(x`<circle cx=${o} cy=${s} fill=${d} r=${n/k} />`)})}),Object.entries(y).filter(([o,t])=>t.length>1).map(([o,t])=>{const s=t.filter(e=>t.some(a=>E(e,a,n)));return[Number(o),s]}).map(([o,t])=>{t.sort((e,a)=>e<a?-1:1);const s=[];for(const e of t){const a=s.find(i=>i.some(m=>E(e,m,n)));a?a.push(e):s.push([e])}return[o,s.map(e=>[e[0],e[e.length-1]])]}).forEach(([o,t])=>{t.forEach(([s,e])=>{f.push(x`
              <line
                x1=${o}
                x2=${o}
                y1=${s}
                y2=${e}
                stroke=${d}
                stroke-width=${n/(k/2)}
                stroke-linecap="round"
              />
            `)})}),f}},T=I`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: var(--local-icon-color) !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`;var v=function(c,r,h,d){var p=arguments.length,u=p<3?r:d===null?d=Object.getOwnPropertyDescriptor(r,h):d,f;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")u=Reflect.decorate(c,r,h,d);else for(var l=c.length-1;l>=0;l--)(f=c[l])&&(u=(p<3?f(u):p>3?f(r,h,u):f(r,h))||u);return p>3&&u&&Object.defineProperty(r,h,u),u};const q="#3396ff";let g=class extends W{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`
     --local-size: ${this.size}px;
     --local-icon-color: ${this.color??q}
    `,b`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){const r=this.theme==="light"?this.size:this.size-32;return x`
      <svg height=${r} width=${r}>
        ${D.generate({uri:this.uri,size:r,logoSize:this.arenaClear?0:r/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?b`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?b`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:b`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};g.styles=[M,T];v([w()],g.prototype,"uri",void 0);v([w({type:Number})],g.prototype,"size",void 0);v([w()],g.prototype,"theme",void 0);v([w()],g.prototype,"imageSrc",void 0);v([w()],g.prototype,"alt",void 0);v([w()],g.prototype,"color",void 0);v([w({type:Boolean})],g.prototype,"arenaClear",void 0);v([w({type:Boolean})],g.prototype,"farcaster",void 0);g=v([N("wui-qr-code")],g);
