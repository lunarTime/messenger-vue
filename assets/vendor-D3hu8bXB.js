function sa(e){const o=Object.create(null);for(const t of e.split(","))o[t]=1;return t=>t in o}const ge={},Ht=[],Oo=()=>{},ql=()=>!1,_n=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),la=e=>e.startsWith("onUpdate:"),Oe=Object.assign,ca=(e,o)=>{const t=e.indexOf(o);t>-1&&e.splice(t,1)},ju=Object.prototype.hasOwnProperty,pe=(e,o)=>ju.call(e,o),oe=Array.isArray,Vt=e=>Cn(e)==="[object Map]",Jl=e=>Cn(e)==="[object Set]",re=e=>typeof e=="function",ke=e=>typeof e=="string",Go=e=>typeof e=="symbol",be=e=>e!==null&&typeof e=="object",Ql=e=>(be(e)||re(e))&&re(e.then)&&re(e.catch),ec=Object.prototype.toString,Cn=e=>ec.call(e),Wu=e=>Cn(e).slice(8,-1),oc=e=>Cn(e)==="[object Object]",da=e=>ke(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,pr=sa(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),$n=e=>{const o=Object.create(null);return(t=>o[t]||(o[t]=e(t)))},Uu=/-\w/g,yo=$n(e=>e.replace(Uu,o=>o.slice(1).toUpperCase())),Zu=/\B([A-Z])/g,At=$n(e=>e.replace(Zu,"-$1").toLowerCase()),Sn=$n(e=>e.charAt(0).toUpperCase()+e.slice(1)),li=$n(e=>e?`on${Sn(e)}`:""),rt=(e,o)=>!Object.is(e,o),ci=(e,...o)=>{for(let t=0;t<e.length;t++)e[t](...o)},tc=(e,o,t,r=!1)=>{Object.defineProperty(e,o,{configurable:!0,enumerable:!1,writable:r,value:t})},Hu=e=>{const o=parseFloat(e);return isNaN(o)?e:o},Vu=e=>{const o=ke(e)?Number(e):NaN;return isNaN(o)?e:o};let ps;const Rn=()=>ps||(ps=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function En(e){if(oe(e)){const o={};for(let t=0;t<e.length;t++){const r=e[t],n=ke(r)?Xu(r):En(r);if(n)for(const i in n)o[i]=n[i]}return o}else if(ke(e)||be(e))return e}const Gu=/;(?![^(]*\))/g,Ku=/:([^]+)/,Yu=/\/\*[^]*?\*\//g;function Xu(e){const o={};return e.replace(Yu,"").split(Gu).forEach(t=>{if(t){const r=t.split(Ku);r.length>1&&(o[r[0].trim()]=r[1].trim())}}),o}function Tn(e){let o="";if(ke(e))o=e;else if(oe(e))for(let t=0;t<e.length;t++){const r=Tn(e[t]);r&&(o+=r+" ")}else if(be(e))for(const t in e)e[t]&&(o+=t+" ");return o.trim()}function jS(e){if(!e)return null;let{class:o,style:t}=e;return o&&!ke(o)&&(e.class=Tn(o)),t&&(e.style=En(t)),e}const qu="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Ju=sa(qu);function rc(e){return!!e||e===""}const nc=e=>!!(e&&e.__v_isRef===!0),Qu=e=>ke(e)?e:e==null?"":oe(e)||be(e)&&(e.toString===ec||!re(e.toString))?nc(e)?Qu(e.value):JSON.stringify(e,ic,2):String(e),ic=(e,o)=>nc(o)?ic(e,o.value):Vt(o)?{[`Map(${o.size})`]:[...o.entries()].reduce((t,[r,n],i)=>(t[di(r,i)+" =>"]=n,t),{})}:Jl(o)?{[`Set(${o.size})`]:[...o.values()].map(t=>di(t))}:Go(o)?di(o):be(o)&&!oe(o)&&!oc(o)?String(o):o,di=(e,o="")=>{var t;return Go(e)?`Symbol(${(t=e.description)!=null?t:o})`:e};let Ge;class ac{constructor(o=!1){this.detached=o,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=Ge,!o&&Ge&&(this.index=(Ge.scopes||(Ge.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let o,t;if(this.scopes)for(o=0,t=this.scopes.length;o<t;o++)this.scopes[o].pause();for(o=0,t=this.effects.length;o<t;o++)this.effects[o].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let o,t;if(this.scopes)for(o=0,t=this.scopes.length;o<t;o++)this.scopes[o].resume();for(o=0,t=this.effects.length;o<t;o++)this.effects[o].resume()}}run(o){if(this._active){const t=Ge;try{return Ge=this,o()}finally{Ge=t}}}on(){++this._on===1&&(this.prevScope=Ge,Ge=this)}off(){this._on>0&&--this._on===0&&(Ge=this.prevScope,this.prevScope=void 0)}stop(o){if(this._active){this._active=!1;let t,r;for(t=0,r=this.effects.length;t<r;t++)this.effects[t].stop();for(this.effects.length=0,t=0,r=this.cleanups.length;t<r;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){for(t=0,r=this.scopes.length;t<r;t++)this.scopes[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!o){const n=this.parent.scopes.pop();n&&n!==this&&(this.parent.scopes[this.index]=n,n.index=this.index)}this.parent=void 0}}}function sc(e){return new ac(e)}function ua(){return Ge}function lc(e,o=!1){Ge&&Ge.cleanups.push(e)}let he;const ui=new WeakSet;class cc{constructor(o){this.fn=o,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Ge&&Ge.active&&Ge.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,ui.has(this)&&(ui.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||uc(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,gs(this),fc(this);const o=he,t=_o;he=this,_o=!0;try{return this.fn()}finally{pc(this),he=o,_o=t,this.flags&=-3}}stop(){if(this.flags&1){for(let o=this.deps;o;o=o.nextDep)ga(o);this.deps=this.depsTail=void 0,gs(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?ui.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){zi(this)&&this.run()}get dirty(){return zi(this)}}let dc=0,gr,hr;function uc(e,o=!1){if(e.flags|=8,o){e.next=hr,hr=e;return}e.next=gr,gr=e}function fa(){dc++}function pa(){if(--dc>0)return;if(hr){let o=hr;for(hr=void 0;o;){const t=o.next;o.next=void 0,o.flags&=-9,o=t}}let e;for(;gr;){let o=gr;for(gr=void 0;o;){const t=o.next;if(o.next=void 0,o.flags&=-9,o.flags&1)try{o.trigger()}catch(r){e||(e=r)}o=t}}if(e)throw e}function fc(e){for(let o=e.deps;o;o=o.nextDep)o.version=-1,o.prevActiveLink=o.dep.activeLink,o.dep.activeLink=o}function pc(e){let o,t=e.depsTail,r=t;for(;r;){const n=r.prevDep;r.version===-1?(r===t&&(t=n),ga(r),ef(r)):o=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=n}e.deps=o,e.depsTail=t}function zi(e){for(let o=e.deps;o;o=o.nextDep)if(o.dep.version!==o.version||o.dep.computed&&(gc(o.dep.computed)||o.dep.version!==o.version))return!0;return!!e._dirty}function gc(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Cr)||(e.globalVersion=Cr,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!zi(e))))return;e.flags|=2;const o=e.dep,t=he,r=_o;he=e,_o=!0;try{fc(e);const n=e.fn(e._value);(o.version===0||rt(n,e._value))&&(e.flags|=128,e._value=n,o.version++)}catch(n){throw o.version++,n}finally{he=t,_o=r,pc(e),e.flags&=-3}}function ga(e,o=!1){const{dep:t,prevSub:r,nextSub:n}=e;if(r&&(r.nextSub=n,e.prevSub=void 0),n&&(n.prevSub=r,e.nextSub=void 0),t.subs===e&&(t.subs=r,!r&&t.computed)){t.computed.flags&=-5;for(let i=t.computed.deps;i;i=i.nextDep)ga(i,!0)}!o&&!--t.sc&&t.map&&t.map.delete(t.key)}function ef(e){const{prevDep:o,nextDep:t}=e;o&&(o.nextDep=t,e.prevDep=void 0),t&&(t.prevDep=o,e.nextDep=void 0)}let _o=!0;const hc=[];function Ho(){hc.push(_o),_o=!1}function Vo(){const e=hc.pop();_o=e===void 0?!0:e}function gs(e){const{cleanup:o}=e;if(e.cleanup=void 0,o){const t=he;he=void 0;try{o()}finally{he=t}}}let Cr=0;class of{constructor(o,t){this.sub=o,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class ha{constructor(o){this.computed=o,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(o){if(!he||!_o||he===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==he)t=this.activeLink=new of(he,this),he.deps?(t.prevDep=he.depsTail,he.depsTail.nextDep=t,he.depsTail=t):he.deps=he.depsTail=t,bc(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){const r=t.nextDep;r.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=r),t.prevDep=he.depsTail,t.nextDep=void 0,he.depsTail.nextDep=t,he.depsTail=t,he.deps===t&&(he.deps=r)}return t}trigger(o){this.version++,Cr++,this.notify(o)}notify(o){fa();try{for(let t=this.subs;t;t=t.prevSub)t.sub.notify()&&t.sub.dep.notify()}finally{pa()}}}function bc(e){if(e.dep.sc++,e.sub.flags&4){const o=e.dep.computed;if(o&&!e.dep.subs){o.flags|=20;for(let r=o.deps;r;r=r.nextDep)bc(r)}const t=e.dep.subs;t!==e&&(e.prevSub=t,t&&(t.nextSub=e)),e.dep.subs=e}}const cn=new WeakMap,xt=Symbol(""),Oi=Symbol(""),$r=Symbol("");function Ke(e,o,t){if(_o&&he){let r=cn.get(e);r||cn.set(e,r=new Map);let n=r.get(t);n||(r.set(t,n=new ha),n.map=r,n.key=t),n.track()}}function Uo(e,o,t,r,n,i){const a=cn.get(e);if(!a){Cr++;return}const s=l=>{l&&l.trigger()};if(fa(),o==="clear")a.forEach(s);else{const l=oe(e),d=l&&da(t);if(l&&t==="length"){const c=Number(r);a.forEach((u,f)=>{(f==="length"||f===$r||!Go(f)&&f>=c)&&s(u)})}else switch((t!==void 0||a.has(void 0))&&s(a.get(t)),d&&s(a.get($r)),o){case"add":l?d&&s(a.get("length")):(s(a.get(xt)),Vt(e)&&s(a.get(Oi)));break;case"delete":l||(s(a.get(xt)),Vt(e)&&s(a.get(Oi)));break;case"set":Vt(e)&&s(a.get(xt));break}}pa()}function tf(e,o){const t=cn.get(e);return t&&t.get(o)}function Mt(e){const o=ue(e);return o===e?o:(Ke(o,"iterate",$r),vo(e)?o:o.map(je))}function An(e){return Ke(e=ue(e),"iterate",$r),e}const rf={__proto__:null,[Symbol.iterator](){return fi(this,Symbol.iterator,je)},concat(...e){return Mt(this).concat(...e.map(o=>oe(o)?Mt(o):o))},entries(){return fi(this,"entries",e=>(e[1]=je(e[1]),e))},every(e,o){return Lo(this,"every",e,o,void 0,arguments)},filter(e,o){return Lo(this,"filter",e,o,t=>t.map(je),arguments)},find(e,o){return Lo(this,"find",e,o,je,arguments)},findIndex(e,o){return Lo(this,"findIndex",e,o,void 0,arguments)},findLast(e,o){return Lo(this,"findLast",e,o,je,arguments)},findLastIndex(e,o){return Lo(this,"findLastIndex",e,o,void 0,arguments)},forEach(e,o){return Lo(this,"forEach",e,o,void 0,arguments)},includes(...e){return pi(this,"includes",e)},indexOf(...e){return pi(this,"indexOf",e)},join(e){return Mt(this).join(e)},lastIndexOf(...e){return pi(this,"lastIndexOf",e)},map(e,o){return Lo(this,"map",e,o,void 0,arguments)},pop(){return sr(this,"pop")},push(...e){return sr(this,"push",e)},reduce(e,...o){return hs(this,"reduce",e,o)},reduceRight(e,...o){return hs(this,"reduceRight",e,o)},shift(){return sr(this,"shift")},some(e,o){return Lo(this,"some",e,o,void 0,arguments)},splice(...e){return sr(this,"splice",e)},toReversed(){return Mt(this).toReversed()},toSorted(e){return Mt(this).toSorted(e)},toSpliced(...e){return Mt(this).toSpliced(...e)},unshift(...e){return sr(this,"unshift",e)},values(){return fi(this,"values",je)}};function fi(e,o,t){const r=An(e),n=r[o]();return r!==e&&!vo(e)&&(n._next=n.next,n.next=()=>{const i=n._next();return i.done||(i.value=t(i.value)),i}),n}const nf=Array.prototype;function Lo(e,o,t,r,n,i){const a=An(e),s=a!==e&&!vo(e),l=a[o];if(l!==nf[o]){const u=l.apply(e,i);return s?je(u):u}let d=t;a!==e&&(s?d=function(u,f){return t.call(this,je(u),f,e)}:t.length>2&&(d=function(u,f){return t.call(this,u,f,e)}));const c=l.call(a,d,r);return s&&n?n(c):c}function hs(e,o,t,r){const n=An(e);let i=t;return n!==e&&(vo(e)?t.length>3&&(i=function(a,s,l){return t.call(this,a,s,l,e)}):i=function(a,s,l){return t.call(this,a,je(s),l,e)}),n[o](i,...r)}function pi(e,o,t){const r=ue(e);Ke(r,"iterate",$r);const n=r[o](...t);return(n===-1||n===!1)&&va(t[0])?(t[0]=ue(t[0]),r[o](...t)):n}function sr(e,o,t=[]){Ho(),fa();const r=ue(e)[o].apply(e,t);return pa(),Vo(),r}const af=sa("__proto__,__v_isRef,__isVue"),mc=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Go));function sf(e){Go(e)||(e=String(e));const o=ue(this);return Ke(o,"has",e),o.hasOwnProperty(e)}class vc{constructor(o=!1,t=!1){this._isReadonly=o,this._isShallow=t}get(o,t,r){if(t==="__v_skip")return o.__v_skip;const n=this._isReadonly,i=this._isShallow;if(t==="__v_isReactive")return!n;if(t==="__v_isReadonly")return n;if(t==="__v_isShallow")return i;if(t==="__v_raw")return r===(n?i?mf:xc:i?wc:kc).get(o)||Object.getPrototypeOf(o)===Object.getPrototypeOf(r)?o:void 0;const a=oe(o);if(!n){let l;if(a&&(l=rf[t]))return l;if(t==="hasOwnProperty")return sf}const s=Reflect.get(o,t,$e(o)?o:r);if((Go(t)?mc.has(t):af(t))||(n||Ke(o,"get",t),i))return s;if($e(s)){const l=a&&da(t)?s:s.value;return n&&be(l)?Pi(l):l}return be(s)?n?Pi(s):$t(s):s}}class yc extends vc{constructor(o=!1){super(!1,o)}set(o,t,r,n){let i=o[t];if(!this._isShallow){const l=ct(i);if(!vo(r)&&!ct(r)&&(i=ue(i),r=ue(r)),!oe(o)&&$e(i)&&!$e(r))return l||(i.value=r),!0}const a=oe(o)&&da(t)?Number(t)<o.length:pe(o,t),s=Reflect.set(o,t,r,$e(o)?o:n);return o===ue(n)&&(a?rt(r,i)&&Uo(o,"set",t,r):Uo(o,"add",t,r)),s}deleteProperty(o,t){const r=pe(o,t);o[t];const n=Reflect.deleteProperty(o,t);return n&&r&&Uo(o,"delete",t,void 0),n}has(o,t){const r=Reflect.has(o,t);return(!Go(t)||!mc.has(t))&&Ke(o,"has",t),r}ownKeys(o){return Ke(o,"iterate",oe(o)?"length":xt),Reflect.ownKeys(o)}}class lf extends vc{constructor(o=!1){super(!0,o)}set(o,t){return!0}deleteProperty(o,t){return!0}}const cf=new yc,df=new lf,uf=new yc(!0);const Ii=e=>e,Kr=e=>Reflect.getPrototypeOf(e);function ff(e,o,t){return function(...r){const n=this.__v_raw,i=ue(n),a=Vt(i),s=e==="entries"||e===Symbol.iterator&&a,l=e==="keys"&&a,d=n[e](...r),c=t?Ii:o?dn:je;return!o&&Ke(i,"iterate",l?Oi:xt),{next(){const{value:u,done:f}=d.next();return f?{value:u,done:f}:{value:s?[c(u[0]),c(u[1])]:c(u),done:f}},[Symbol.iterator](){return this}}}}function Yr(e){return function(...o){return e==="delete"?!1:e==="clear"?void 0:this}}function pf(e,o){const t={get(n){const i=this.__v_raw,a=ue(i),s=ue(n);e||(rt(n,s)&&Ke(a,"get",n),Ke(a,"get",s));const{has:l}=Kr(a),d=o?Ii:e?dn:je;if(l.call(a,n))return d(i.get(n));if(l.call(a,s))return d(i.get(s));i!==a&&i.get(n)},get size(){const n=this.__v_raw;return!e&&Ke(ue(n),"iterate",xt),n.size},has(n){const i=this.__v_raw,a=ue(i),s=ue(n);return e||(rt(n,s)&&Ke(a,"has",n),Ke(a,"has",s)),n===s?i.has(n):i.has(n)||i.has(s)},forEach(n,i){const a=this,s=a.__v_raw,l=ue(s),d=o?Ii:e?dn:je;return!e&&Ke(l,"iterate",xt),s.forEach((c,u)=>n.call(i,d(c),d(u),a))}};return Oe(t,e?{add:Yr("add"),set:Yr("set"),delete:Yr("delete"),clear:Yr("clear")}:{add(n){!o&&!vo(n)&&!ct(n)&&(n=ue(n));const i=ue(this);return Kr(i).has.call(i,n)||(i.add(n),Uo(i,"add",n,n)),this},set(n,i){!o&&!vo(i)&&!ct(i)&&(i=ue(i));const a=ue(this),{has:s,get:l}=Kr(a);let d=s.call(a,n);d||(n=ue(n),d=s.call(a,n));const c=l.call(a,n);return a.set(n,i),d?rt(i,c)&&Uo(a,"set",n,i):Uo(a,"add",n,i),this},delete(n){const i=ue(this),{has:a,get:s}=Kr(i);let l=a.call(i,n);l||(n=ue(n),l=a.call(i,n)),s&&s.call(i,n);const d=i.delete(n);return l&&Uo(i,"delete",n,void 0),d},clear(){const n=ue(this),i=n.size!==0,a=n.clear();return i&&Uo(n,"clear",void 0,void 0),a}}),["keys","values","entries",Symbol.iterator].forEach(n=>{t[n]=ff(n,e,o)}),t}function ba(e,o){const t=pf(e,o);return(r,n,i)=>n==="__v_isReactive"?!e:n==="__v_isReadonly"?e:n==="__v_raw"?r:Reflect.get(pe(t,n)&&n in r?t:r,n,i)}const gf={get:ba(!1,!1)},hf={get:ba(!1,!0)},bf={get:ba(!0,!1)};const kc=new WeakMap,wc=new WeakMap,xc=new WeakMap,mf=new WeakMap;function vf(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function yf(e){return e.__v_skip||!Object.isExtensible(e)?0:vf(Wu(e))}function $t(e){return ct(e)?e:ma(e,!1,cf,gf,kc)}function _c(e){return ma(e,!1,uf,hf,wc)}function Pi(e){return ma(e,!0,df,bf,xc)}function ma(e,o,t,r,n){if(!be(e)||e.__v_raw&&!(o&&e.__v_isReactive))return e;const i=yf(e);if(i===0)return e;const a=n.get(e);if(a)return a;const s=new Proxy(e,i===2?r:t);return n.set(e,s),s}function nt(e){return ct(e)?nt(e.__v_raw):!!(e&&e.__v_isReactive)}function ct(e){return!!(e&&e.__v_isReadonly)}function vo(e){return!!(e&&e.__v_isShallow)}function va(e){return e?!!e.__v_raw:!1}function ue(e){const o=e&&e.__v_raw;return o?ue(o):e}function ya(e){return!pe(e,"__v_skip")&&Object.isExtensible(e)&&tc(e,"__v_skip",!0),e}const je=e=>be(e)?$t(e):e,dn=e=>be(e)?Pi(e):e;function $e(e){return e?e.__v_isRef===!0:!1}function ka(e){return Cc(e,!1)}function br(e){return Cc(e,!0)}function Cc(e,o){return $e(e)?e:new kf(e,o)}class kf{constructor(o,t){this.dep=new ha,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?o:ue(o),this._value=t?o:je(o),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(o){const t=this._rawValue,r=this.__v_isShallow||vo(o)||ct(o);o=r?o:ue(o),rt(o,t)&&(this._rawValue=o,this._value=r?o:je(o),this.dep.trigger())}}function it(e){return $e(e)?e.value:e}function ro(e){return re(e)?e():it(e)}const wf={get:(e,o,t)=>o==="__v_raw"?e:it(Reflect.get(e,o,t)),set:(e,o,t,r)=>{const n=e[o];return $e(n)&&!$e(t)?(n.value=t,!0):Reflect.set(e,o,t,r)}};function $c(e){return nt(e)?e:new Proxy(e,wf)}function xf(e){const o=oe(e)?new Array(e.length):{};for(const t in e)o[t]=Cf(e,t);return o}class _f{constructor(o,t,r){this._object=o,this._key=t,this._defaultValue=r,this.__v_isRef=!0,this._value=void 0}get value(){const o=this._object[this._key];return this._value=o===void 0?this._defaultValue:o}set value(o){this._object[this._key]=o}get dep(){return tf(ue(this._object),this._key)}}function Cf(e,o,t){const r=e[o];return $e(r)?r:new _f(e,o,t)}class $f{constructor(o,t,r){this.fn=o,this.setter=t,this._value=void 0,this.dep=new ha(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Cr-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&he!==this)return uc(this,!0),!0}get value(){const o=this.dep.track();return gc(this),o&&(o.version=this.dep.version),this._value}set value(o){this.setter&&this.setter(o)}}function Sf(e,o,t=!1){let r,n;return re(e)?r=e:(r=e.get,n=e.set),new $f(r,n,t)}const Xr={},un=new WeakMap;let yt;function Rf(e,o=!1,t=yt){if(t){let r=un.get(t);r||un.set(t,r=[]),r.push(e)}}function Ef(e,o,t=ge){const{immediate:r,deep:n,once:i,scheduler:a,augmentJob:s,call:l}=t,d=L=>n?L:vo(L)||n===!1||n===0?Zo(L,1):Zo(L);let c,u,f,g,v=!1,w=!1;if($e(e)?(u=()=>e.value,v=vo(e)):nt(e)?(u=()=>d(e),v=!0):oe(e)?(w=!0,v=e.some(L=>nt(L)||vo(L)),u=()=>e.map(L=>{if($e(L))return L.value;if(nt(L))return d(L);if(re(L))return l?l(L,2):L()})):re(e)?o?u=l?()=>l(e,2):e:u=()=>{if(f){Ho();try{f()}finally{Vo()}}const L=yt;yt=c;try{return l?l(e,3,[g]):e(g)}finally{yt=L}}:u=Oo,o&&n){const L=u,Z=n===!0?1/0:n;u=()=>Zo(L(),Z)}const T=ua(),A=()=>{c.stop(),T&&T.active&&ca(T.effects,c)};if(i&&o){const L=o;o=(...Z)=>{L(...Z),A()}}let E=w?new Array(e.length).fill(Xr):Xr;const F=L=>{if(!(!(c.flags&1)||!c.dirty&&!L))if(o){const Z=c.run();if(n||v||(w?Z.some((G,X)=>rt(G,E[X])):rt(Z,E))){f&&f();const G=yt;yt=c;try{const X=[Z,E===Xr?void 0:w&&E[0]===Xr?[]:E,g];E=Z,l?l(o,3,X):o(...X)}finally{yt=G}}}else c.run()};return s&&s(F),c=new cc(u),c.scheduler=a?()=>a(F,!1):F,g=L=>Rf(L,!1,c),f=c.onStop=()=>{const L=un.get(c);if(L){if(l)l(L,4);else for(const Z of L)Z();un.delete(c)}},o?r?F(!0):E=c.run():a?a(F.bind(null,!0),!0):c.run(),A.pause=c.pause.bind(c),A.resume=c.resume.bind(c),A.stop=A,A}function Zo(e,o=1/0,t){if(o<=0||!be(e)||e.__v_skip||(t=t||new Map,(t.get(e)||0)>=o))return e;if(t.set(e,o),o--,$e(e))Zo(e.value,o,t);else if(oe(e))for(let r=0;r<e.length;r++)Zo(e[r],o,t);else if(Jl(e)||Vt(e))e.forEach(r=>{Zo(r,o,t)});else if(oc(e)){for(const r in e)Zo(e[r],o,t);for(const r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&Zo(e[r],o,t)}return e}function Pr(e,o,t,r){try{return r?e(...r):e()}catch(n){Bn(n,o,t)}}function $o(e,o,t,r){if(re(e)){const n=Pr(e,o,t,r);return n&&Ql(n)&&n.catch(i=>{Bn(i,o,t)}),n}if(oe(e)){const n=[];for(let i=0;i<e.length;i++)n.push($o(e[i],o,t,r));return n}}function Bn(e,o,t,r=!0){const n=o?o.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:a}=o&&o.appContext.config||ge;if(o){let s=o.parent;const l=o.proxy,d=`https://vuejs.org/error-reference/#runtime-${t}`;for(;s;){const c=s.ec;if(c){for(let u=0;u<c.length;u++)if(c[u](e,l,d)===!1)return}s=s.parent}if(i){Ho(),Pr(i,null,10,[e,l,d]),Vo();return}}Tf(e,t,n,r,a)}function Tf(e,o,t,r=!0,n=!1){if(n)throw e;console.error(e)}const no=[];let Bo=-1;const Gt=[];let Qo=null,jt=0;const Sc=Promise.resolve();let fn=null;function zn(e){const o=fn||Sc;return e?o.then(this?e.bind(this):e):o}function Af(e){let o=Bo+1,t=no.length;for(;o<t;){const r=o+t>>>1,n=no[r],i=Sr(n);i<e||i===e&&n.flags&2?o=r+1:t=r}return o}function wa(e){if(!(e.flags&1)){const o=Sr(e),t=no[no.length-1];!t||!(e.flags&2)&&o>=Sr(t)?no.push(e):no.splice(Af(o),0,e),e.flags|=1,Rc()}}function Rc(){fn||(fn=Sc.then(Tc))}function Bf(e){oe(e)?Gt.push(...e):Qo&&e.id===-1?Qo.splice(jt+1,0,e):e.flags&1||(Gt.push(e),e.flags|=1),Rc()}function bs(e,o,t=Bo+1){for(;t<no.length;t++){const r=no[t];if(r&&r.flags&2){if(e&&r.id!==e.uid)continue;no.splice(t,1),t--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function Ec(e){if(Gt.length){const o=[...new Set(Gt)].sort((t,r)=>Sr(t)-Sr(r));if(Gt.length=0,Qo){Qo.push(...o);return}for(Qo=o,jt=0;jt<Qo.length;jt++){const t=Qo[jt];t.flags&4&&(t.flags&=-2),t.flags&8||t(),t.flags&=-2}Qo=null,jt=0}}const Sr=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Tc(e){try{for(Bo=0;Bo<no.length;Bo++){const o=no[Bo];o&&!(o.flags&8)&&(o.flags&4&&(o.flags&=-2),Pr(o,o.i,o.i?15:14),o.flags&4||(o.flags&=-2))}}finally{for(;Bo<no.length;Bo++){const o=no[Bo];o&&(o.flags&=-2)}Bo=-1,no.length=0,Ec(),fn=null,(no.length||Gt.length)&&Tc()}}let Ue=null,Ac=null;function pn(e){const o=Ue;return Ue=e,Ac=e&&e.type.__scopeId||null,o}function zf(e,o=Ue,t){if(!o||e._n)return e;const r=(...n)=>{r._d&&bn(-1);const i=pn(o);let a;try{a=e(...n)}finally{pn(i),r._d&&bn(1)}return a};return r._n=!0,r._c=!0,r._d=!0,r}function WS(e,o){if(Ue===null)return e;const t=Mn(Ue),r=e.dirs||(e.dirs=[]);for(let n=0;n<o.length;n++){let[i,a,s,l=ge]=o[n];i&&(re(i)&&(i={mounted:i,updated:i}),i.deep&&Zo(a),r.push({dir:i,instance:t,value:a,oldValue:void 0,arg:s,modifiers:l}))}return e}function ht(e,o,t,r){const n=e.dirs,i=o&&o.dirs;for(let a=0;a<n.length;a++){const s=n[a];i&&(s.oldValue=i[a].value);let l=s.dir[r];l&&(Ho(),$o(l,t,8,[e.el,s,e,o]),Vo())}}const Bc=Symbol("_vte"),zc=e=>e.__isTeleport,mr=e=>e&&(e.disabled||e.disabled===""),ms=e=>e&&(e.defer||e.defer===""),vs=e=>typeof SVGElement<"u"&&e instanceof SVGElement,ys=e=>typeof MathMLElement=="function"&&e instanceof MathMLElement,Di=(e,o)=>{const t=e&&e.to;return ke(t)?o?o(t):null:t},Oc={name:"Teleport",__isTeleport:!0,process(e,o,t,r,n,i,a,s,l,d){const{mc:c,pc:u,pbc:f,o:{insert:g,querySelector:v,createText:w,createComment:T}}=d,A=mr(o.props);let{shapeFlag:E,children:F,dynamicChildren:L}=o;if(e==null){const Z=o.el=w(""),G=o.anchor=w("");g(Z,t,r),g(G,t,r);const X=(k,S)=>{E&16&&c(F,k,S,n,i,a,s,l)},W=()=>{const k=o.target=Di(o.props,v),S=Ic(k,o,w,g);k&&(a!=="svg"&&vs(k)?a="svg":a!=="mathml"&&ys(k)&&(a="mathml"),n&&n.isCE&&(n.ce._teleportTargets||(n.ce._teleportTargets=new Set)).add(k),A||(X(k,S),rn(o,!1)))};A&&(X(t,G),rn(o,!0)),ms(o.props)?(o.el.__isMounted=!1,oo(()=>{W(),delete o.el.__isMounted},i)):W()}else{if(ms(o.props)&&e.el.__isMounted===!1){oo(()=>{Oc.process(e,o,t,r,n,i,a,s,l,d)},i);return}o.el=e.el,o.targetStart=e.targetStart;const Z=o.anchor=e.anchor,G=o.target=e.target,X=o.targetAnchor=e.targetAnchor,W=mr(e.props),k=W?t:G,S=W?Z:X;if(a==="svg"||vs(G)?a="svg":(a==="mathml"||ys(G))&&(a="mathml"),L?(f(e.dynamicChildren,L,k,n,i,a,s),Ra(e,o,!0)):l||u(e,o,k,S,n,i,a,s,!1),A)W?o.props&&e.props&&o.props.to!==e.props.to&&(o.props.to=e.props.to):qr(o,t,Z,d,1);else if((o.props&&o.props.to)!==(e.props&&e.props.to)){const q=o.target=Di(o.props,v);q&&qr(o,q,null,d,0)}else W&&qr(o,G,X,d,1);rn(o,A)}},remove(e,o,t,{um:r,o:{remove:n}},i){const{shapeFlag:a,children:s,anchor:l,targetStart:d,targetAnchor:c,target:u,props:f}=e;if(u&&(n(d),n(c)),i&&n(l),a&16){const g=i||!mr(f);for(let v=0;v<s.length;v++){const w=s[v];r(w,o,t,g,!!w.dynamicChildren)}}},move:qr,hydrate:Of};function qr(e,o,t,{o:{insert:r},m:n},i=2){i===0&&r(e.targetAnchor,o,t);const{el:a,anchor:s,shapeFlag:l,children:d,props:c}=e,u=i===2;if(u&&r(a,o,t),(!u||mr(c))&&l&16)for(let f=0;f<d.length;f++)n(d[f],o,t,2);u&&r(s,o,t)}function Of(e,o,t,r,n,i,{o:{nextSibling:a,parentNode:s,querySelector:l,insert:d,createText:c}},u){function f(w,T,A,E){T.anchor=u(a(w),T,s(w),t,r,n,i),T.targetStart=A,T.targetAnchor=E}const g=o.target=Di(o.props,l),v=mr(o.props);if(g){const w=g._lpa||g.firstChild;if(o.shapeFlag&16)if(v)f(e,o,w,w&&a(w));else{o.anchor=a(e);let T=w;for(;T;){if(T&&T.nodeType===8){if(T.data==="teleport start anchor")o.targetStart=T;else if(T.data==="teleport anchor"){o.targetAnchor=T,g._lpa=o.targetAnchor&&a(o.targetAnchor);break}}T=a(T)}o.targetAnchor||Ic(g,o,c,d),u(w&&a(w),o,g,t,r,n,i)}rn(o,v)}else v&&o.shapeFlag&16&&f(e,o,e,a(e));return o.anchor&&a(o.anchor)}const US=Oc;function rn(e,o){const t=e.ctx;if(t&&t.ut){let r,n;for(o?(r=e.el,n=e.anchor):(r=e.targetStart,n=e.targetAnchor);r&&r!==n;)r.nodeType===1&&r.setAttribute("data-v-owner",t.uid),r=r.nextSibling;t.ut()}}function Ic(e,o,t,r){const n=o.targetStart=t(""),i=o.targetAnchor=t("");return n[Bc]=i,e&&(r(n,e),r(i,e)),i}const Wo=Symbol("_leaveCb"),Jr=Symbol("_enterCb");function Pc(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return Pn(()=>{e.isMounted=!0}),Zc(()=>{e.isUnmounting=!0}),e}const mo=[Function,Array],Dc={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:mo,onEnter:mo,onAfterEnter:mo,onEnterCancelled:mo,onBeforeLeave:mo,onLeave:mo,onAfterLeave:mo,onLeaveCancelled:mo,onBeforeAppear:mo,onAppear:mo,onAfterAppear:mo,onAppearCancelled:mo},Nc=e=>{const o=e.subTree;return o.component?Nc(o.component):o},If={name:"BaseTransition",props:Dc,setup(e,{slots:o}){const t=Bt(),r=Pc();return()=>{const n=o.default&&xa(o.default(),!0);if(!n||!n.length)return;const i=Lc(n),a=ue(e),{mode:s}=a;if(r.isLeaving)return gi(i);const l=ks(i);if(!l)return gi(i);let d=Rr(l,a,r,t,u=>d=u);l.type!==Ye&&St(l,d);let c=t.subTree&&ks(t.subTree);if(c&&c.type!==Ye&&!kt(c,l)&&Nc(t).type!==Ye){let u=Rr(c,a,r,t);if(St(c,u),s==="out-in"&&l.type!==Ye)return r.isLeaving=!0,u.afterLeave=()=>{r.isLeaving=!1,t.job.flags&8||t.update(),delete u.afterLeave,c=void 0},gi(i);s==="in-out"&&l.type!==Ye?u.delayLeave=(f,g,v)=>{const w=Mc(r,c);w[String(c.key)]=c,f[Wo]=()=>{g(),f[Wo]=void 0,delete d.delayedLeave,c=void 0},d.delayedLeave=()=>{v(),delete d.delayedLeave,c=void 0}}:c=void 0}else c&&(c=void 0);return i}}};function Lc(e){let o=e[0];if(e.length>1){for(const t of e)if(t.type!==Ye){o=t;break}}return o}const Pf=If;function Mc(e,o){const{leavingVNodes:t}=e;let r=t.get(o.type);return r||(r=Object.create(null),t.set(o.type,r)),r}function Rr(e,o,t,r,n){const{appear:i,mode:a,persisted:s=!1,onBeforeEnter:l,onEnter:d,onAfterEnter:c,onEnterCancelled:u,onBeforeLeave:f,onLeave:g,onAfterLeave:v,onLeaveCancelled:w,onBeforeAppear:T,onAppear:A,onAfterAppear:E,onAppearCancelled:F}=o,L=String(e.key),Z=Mc(t,e),G=(k,S)=>{k&&$o(k,r,9,S)},X=(k,S)=>{const q=S[1];G(k,S),oe(k)?k.every(z=>z.length<=1)&&q():k.length<=1&&q()},W={mode:a,persisted:s,beforeEnter(k){let S=l;if(!t.isMounted)if(i)S=T||l;else return;k[Wo]&&k[Wo](!0);const q=Z[L];q&&kt(e,q)&&q.el[Wo]&&q.el[Wo](),G(S,[k])},enter(k){let S=d,q=c,z=u;if(!t.isMounted)if(i)S=A||d,q=E||c,z=F||u;else return;let Q=!1;const de=k[Jr]=se=>{Q||(Q=!0,se?G(z,[k]):G(q,[k]),W.delayedLeave&&W.delayedLeave(),k[Jr]=void 0)};S?X(S,[k,de]):de()},leave(k,S){const q=String(e.key);if(k[Jr]&&k[Jr](!0),t.isUnmounting)return S();G(f,[k]);let z=!1;const Q=k[Wo]=de=>{z||(z=!0,S(),de?G(w,[k]):G(v,[k]),k[Wo]=void 0,Z[q]===e&&delete Z[q])};Z[q]=e,g?X(g,[k,Q]):Q()},clone(k){const S=Rr(k,o,t,r,n);return n&&n(S),S}};return W}function gi(e){if(On(e))return e=dt(e),e.children=null,e}function ks(e){if(!On(e))return zc(e.type)&&e.children?Lc(e.children):e;if(e.component)return e.component.subTree;const{shapeFlag:o,children:t}=e;if(t){if(o&16)return t[0];if(o&32&&re(t.default))return t.default()}}function St(e,o){e.shapeFlag&6&&e.component?(e.transition=o,St(e.component.subTree,o)):e.shapeFlag&128?(e.ssContent.transition=o.clone(e.ssContent),e.ssFallback.transition=o.clone(e.ssFallback)):e.transition=o}function xa(e,o=!1,t){let r=[],n=0;for(let i=0;i<e.length;i++){let a=e[i];const s=t==null?a.key:String(t)+String(a.key!=null?a.key:i);a.type===uo?(a.patchFlag&128&&n++,r=r.concat(xa(a.children,o,s))):(o||a.type!==Ye)&&r.push(s!=null?dt(a,{key:s}):a)}if(n>1)for(let i=0;i<r.length;i++)r[i].patchFlag=-2;return r}function Fc(e,o){return re(e)?Oe({name:e.name},o,{setup:e}):e}function ZS(){const e=Bt();return e?(e.appContext.config.idPrefix||"v")+"-"+e.ids[0]+e.ids[1]++:""}function jc(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}const gn=new WeakMap;function vr(e,o,t,r,n=!1){if(oe(e)){e.forEach((v,w)=>vr(v,o&&(oe(o)?o[w]:o),t,r,n));return}if(Kt(r)&&!n){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&vr(e,o,t,r.component.subTree);return}const i=r.shapeFlag&4?Mn(r.component):r.el,a=n?null:i,{i:s,r:l}=e,d=o&&o.r,c=s.refs===ge?s.refs={}:s.refs,u=s.setupState,f=ue(u),g=u===ge?ql:v=>pe(f,v);if(d!=null&&d!==l){if(ws(o),ke(d))c[d]=null,g(d)&&(u[d]=null);else if($e(d)){d.value=null;const v=o;v.k&&(c[v.k]=null)}}if(re(l))Pr(l,s,12,[a,c]);else{const v=ke(l),w=$e(l);if(v||w){const T=()=>{if(e.f){const A=v?g(l)?u[l]:c[l]:l.value;if(n)oe(A)&&ca(A,i);else if(oe(A))A.includes(i)||A.push(i);else if(v)c[l]=[i],g(l)&&(u[l]=c[l]);else{const E=[i];l.value=E,e.k&&(c[e.k]=E)}}else v?(c[l]=a,g(l)&&(u[l]=a)):w&&(l.value=a,e.k&&(c[e.k]=a))};if(a){const A=()=>{T(),gn.delete(e)};A.id=-1,gn.set(e,A),oo(A,t)}else ws(e),T()}}}function ws(e){const o=gn.get(e);o&&(o.flags|=8,gn.delete(e))}Rn().requestIdleCallback;Rn().cancelIdleCallback;const Kt=e=>!!e.type.__asyncLoader,On=e=>e.type.__isKeepAlive;function Df(e,o){Wc(e,"a",o)}function Nf(e,o){Wc(e,"da",o)}function Wc(e,o,t=Xe){const r=e.__wdc||(e.__wdc=()=>{let n=t;for(;n;){if(n.isDeactivated)return;n=n.parent}return e()});if(In(o,r,t),t){let n=t.parent;for(;n&&n.parent;)On(n.parent.vnode)&&Lf(r,o,t,n),n=n.parent}}function Lf(e,o,t,r){const n=In(o,e,r,!0);Hc(()=>{ca(r[o],n)},t)}function In(e,o,t=Xe,r=!1){if(t){const n=t[e]||(t[e]=[]),i=o.__weh||(o.__weh=(...a)=>{Ho();const s=Dr(t),l=$o(o,t,e,a);return s(),Vo(),l});return r?n.unshift(i):n.push(i),i}}const Ko=e=>(o,t=Xe)=>{(!Ar||e==="sp")&&In(e,(...r)=>o(...r),t)},Mf=Ko("bm"),Pn=Ko("m"),Ff=Ko("bu"),Uc=Ko("u"),Zc=Ko("bum"),Hc=Ko("um"),jf=Ko("sp"),Wf=Ko("rtg"),Uf=Ko("rtc");function Zf(e,o=Xe){In("ec",e,o)}const _a="components",Hf="directives";function HS(e,o){return Ca(_a,e,!0,o)||e}const Vc=Symbol.for("v-ndc");function VS(e){return ke(e)?Ca(_a,e,!1)||e:e||Vc}function GS(e){return Ca(Hf,e)}function Ca(e,o,t=!0,r=!1){const n=Ue||Xe;if(n){const i=n.type;if(e===_a){const s=Ip(i,!1);if(s&&(s===o||s===yo(o)||s===Sn(yo(o))))return i}const a=xs(n[e]||i[e],o)||xs(n.appContext[e],o);return!a&&r?i:a}}function xs(e,o){return e&&(e[o]||e[yo(o)]||e[Sn(yo(o))])}function KS(e,o,t,r){let n;const i=t,a=oe(e);if(a||ke(e)){const s=a&&nt(e);let l=!1,d=!1;s&&(l=!vo(e),d=ct(e),e=An(e)),n=new Array(e.length);for(let c=0,u=e.length;c<u;c++)n[c]=o(l?d?dn(je(e[c])):je(e[c]):e[c],c,void 0,i)}else if(typeof e=="number"){n=new Array(e);for(let s=0;s<e;s++)n[s]=o(s+1,s,void 0,i)}else if(be(e))if(e[Symbol.iterator])n=Array.from(e,(s,l)=>o(s,l,void 0,i));else{const s=Object.keys(e);n=new Array(s.length);for(let l=0,d=s.length;l<d;l++){const c=s[l];n[l]=o(e[c],c,l,i)}}else n=[];return n}function YS(e,o){for(let t=0;t<o.length;t++){const r=o[t];if(oe(r))for(let n=0;n<r.length;n++)e[r[n].name]=r[n].fn;else r&&(e[r.name]=r.key?(...n)=>{const i=r.fn(...n);return i&&(i.key=r.key),i}:r.fn)}return e}function XS(e,o,t={},r,n){if(Ue.ce||Ue.parent&&Kt(Ue.parent)&&Ue.parent.ce){const d=Object.keys(t).length>0;return o!=="default"&&(t.name=o),Rt(),ji(uo,null,[io("slot",t,r&&r())],d?-2:64)}let i=e[o];i&&i._c&&(i._d=!1),Rt();const a=i&&Gc(i(t)),s=t.key||a&&a.key,l=ji(uo,{key:(s&&!Go(s)?s:`_${o}`)+(!a&&r?"_fb":"")},a||(r?r():[]),a&&e._===1?64:-2);return l.scopeId&&(l.slotScopeIds=[l.scopeId+"-s"]),i&&i._c&&(i._d=!0),l}function Gc(e){return e.some(o=>Tr(o)?!(o.type===Ye||o.type===uo&&!Gc(o.children)):!0)?e:null}const Ni=e=>e?fd(e)?Mn(e):Ni(e.parent):null,yr=Oe(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>Ni(e.parent),$root:e=>Ni(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Yc(e),$forceUpdate:e=>e.f||(e.f=()=>{wa(e.update)}),$nextTick:e=>e.n||(e.n=zn.bind(e.proxy)),$watch:e=>pp.bind(e)}),hi=(e,o)=>e!==ge&&!e.__isScriptSetup&&pe(e,o),Vf={get({_:e},o){if(o==="__v_skip")return!0;const{ctx:t,setupState:r,data:n,props:i,accessCache:a,type:s,appContext:l}=e;let d;if(o[0]!=="$"){const g=a[o];if(g!==void 0)switch(g){case 1:return r[o];case 2:return n[o];case 4:return t[o];case 3:return i[o]}else{if(hi(r,o))return a[o]=1,r[o];if(n!==ge&&pe(n,o))return a[o]=2,n[o];if((d=e.propsOptions[0])&&pe(d,o))return a[o]=3,i[o];if(t!==ge&&pe(t,o))return a[o]=4,t[o];Li&&(a[o]=0)}}const c=yr[o];let u,f;if(c)return o==="$attrs"&&Ke(e.attrs,"get",""),c(e);if((u=s.__cssModules)&&(u=u[o]))return u;if(t!==ge&&pe(t,o))return a[o]=4,t[o];if(f=l.config.globalProperties,pe(f,o))return f[o]},set({_:e},o,t){const{data:r,setupState:n,ctx:i}=e;return hi(n,o)?(n[o]=t,!0):r!==ge&&pe(r,o)?(r[o]=t,!0):pe(e.props,o)||o[0]==="$"&&o.slice(1)in e?!1:(i[o]=t,!0)},has({_:{data:e,setupState:o,accessCache:t,ctx:r,appContext:n,propsOptions:i,type:a}},s){let l,d;return!!(t[s]||e!==ge&&s[0]!=="$"&&pe(e,s)||hi(o,s)||(l=i[0])&&pe(l,s)||pe(r,s)||pe(yr,s)||pe(n.config.globalProperties,s)||(d=a.__cssModules)&&d[s])},defineProperty(e,o,t){return t.get!=null?e._.accessCache[o]=0:pe(t,"value")&&this.set(e,o,t.value,null),Reflect.defineProperty(e,o,t)}};function _s(e){return oe(e)?e.reduce((o,t)=>(o[t]=null,o),{}):e}let Li=!0;function Gf(e){const o=Yc(e),t=e.proxy,r=e.ctx;Li=!1,o.beforeCreate&&Cs(o.beforeCreate,e,"bc");const{data:n,computed:i,methods:a,watch:s,provide:l,inject:d,created:c,beforeMount:u,mounted:f,beforeUpdate:g,updated:v,activated:w,deactivated:T,beforeDestroy:A,beforeUnmount:E,destroyed:F,unmounted:L,render:Z,renderTracked:G,renderTriggered:X,errorCaptured:W,serverPrefetch:k,expose:S,inheritAttrs:q,components:z,directives:Q,filters:de}=o;if(d&&Kf(d,r,null),a)for(const ee in a){const ne=a[ee];re(ne)&&(r[ee]=ne.bind(t))}if(n){const ee=n.call(t,t);be(ee)&&(e.data=$t(ee))}if(Li=!0,i)for(const ee in i){const ne=i[ee],me=re(ne)?ne.bind(t,t):re(ne.get)?ne.get.bind(t,t):Oo,Ae=!re(ne)&&re(ne.set)?ne.set.bind(t):Oo,Se=We({get:me,set:Ae});Object.defineProperty(r,ee,{enumerable:!0,configurable:!0,get:()=>Se.value,set:xe=>Se.value=xe})}if(s)for(const ee in s)Kc(s[ee],r,t,ee);if(l){const ee=re(l)?l.call(t):l;Reflect.ownKeys(ee).forEach(ne=>{nn(ne,ee[ne])})}c&&Cs(c,e,"c");function te(ee,ne){oe(ne)?ne.forEach(me=>ee(me.bind(t))):ne&&ee(ne.bind(t))}if(te(Mf,u),te(Pn,f),te(Ff,g),te(Uc,v),te(Df,w),te(Nf,T),te(Zf,W),te(Uf,G),te(Wf,X),te(Zc,E),te(Hc,L),te(jf,k),oe(S))if(S.length){const ee=e.exposed||(e.exposed={});S.forEach(ne=>{Object.defineProperty(ee,ne,{get:()=>t[ne],set:me=>t[ne]=me,enumerable:!0})})}else e.exposed||(e.exposed={});Z&&e.render===Oo&&(e.render=Z),q!=null&&(e.inheritAttrs=q),z&&(e.components=z),Q&&(e.directives=Q),k&&jc(e)}function Kf(e,o,t=Oo){oe(e)&&(e=Mi(e));for(const r in e){const n=e[r];let i;be(n)?"default"in n?i=Co(n.from||r,n.default,!0):i=Co(n.from||r):i=Co(n),$e(i)?Object.defineProperty(o,r,{enumerable:!0,configurable:!0,get:()=>i.value,set:a=>i.value=a}):o[r]=i}}function Cs(e,o,t){$o(oe(e)?e.map(r=>r.bind(o.proxy)):e.bind(o.proxy),o,t)}function Kc(e,o,t,r){let n=r.includes(".")?sd(t,r):()=>t[r];if(ke(e)){const i=o[e];re(i)&&at(n,i)}else if(re(e))at(n,e.bind(t));else if(be(e))if(oe(e))e.forEach(i=>Kc(i,o,t,r));else{const i=re(e.handler)?e.handler.bind(t):o[e.handler];re(i)&&at(n,i,e)}}function Yc(e){const o=e.type,{mixins:t,extends:r}=o,{mixins:n,optionsCache:i,config:{optionMergeStrategies:a}}=e.appContext,s=i.get(o);let l;return s?l=s:!n.length&&!t&&!r?l=o:(l={},n.length&&n.forEach(d=>hn(l,d,a,!0)),hn(l,o,a)),be(o)&&i.set(o,l),l}function hn(e,o,t,r=!1){const{mixins:n,extends:i}=o;i&&hn(e,i,t,!0),n&&n.forEach(a=>hn(e,a,t,!0));for(const a in o)if(!(r&&a==="expose")){const s=Yf[a]||t&&t[a];e[a]=s?s(e[a],o[a]):o[a]}return e}const Yf={data:$s,props:Ss,emits:Ss,methods:ur,computed:ur,beforeCreate:Qe,created:Qe,beforeMount:Qe,mounted:Qe,beforeUpdate:Qe,updated:Qe,beforeDestroy:Qe,beforeUnmount:Qe,destroyed:Qe,unmounted:Qe,activated:Qe,deactivated:Qe,errorCaptured:Qe,serverPrefetch:Qe,components:ur,directives:ur,watch:qf,provide:$s,inject:Xf};function $s(e,o){return o?e?function(){return Oe(re(e)?e.call(this,this):e,re(o)?o.call(this,this):o)}:o:e}function Xf(e,o){return ur(Mi(e),Mi(o))}function Mi(e){if(oe(e)){const o={};for(let t=0;t<e.length;t++)o[e[t]]=e[t];return o}return e}function Qe(e,o){return e?[...new Set([].concat(e,o))]:o}function ur(e,o){return e?Oe(Object.create(null),e,o):o}function Ss(e,o){return e?oe(e)&&oe(o)?[...new Set([...e,...o])]:Oe(Object.create(null),_s(e),_s(o??{})):o}function qf(e,o){if(!e)return o;if(!o)return e;const t=Oe(Object.create(null),e);for(const r in o)t[r]=Qe(e[r],o[r]);return t}function Xc(){return{app:null,config:{isNativeTag:ql,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Jf=0;function Qf(e,o){return function(r,n=null){re(r)||(r=Oe({},r)),n!=null&&!be(n)&&(n=null);const i=Xc(),a=new WeakSet,s=[];let l=!1;const d=i.app={_uid:Jf++,_component:r,_props:n,_container:null,_context:i,_instance:null,version:Dp,get config(){return i.config},set config(c){},use(c,...u){return a.has(c)||(c&&re(c.install)?(a.add(c),c.install(d,...u)):re(c)&&(a.add(c),c(d,...u))),d},mixin(c){return i.mixins.includes(c)||i.mixins.push(c),d},component(c,u){return u?(i.components[c]=u,d):i.components[c]},directive(c,u){return u?(i.directives[c]=u,d):i.directives[c]},mount(c,u,f){if(!l){const g=d._ceVNode||io(r,n);return g.appContext=i,f===!0?f="svg":f===!1&&(f=void 0),e(g,c,f),l=!0,d._container=c,c.__vue_app__=d,Mn(g.component)}},onUnmount(c){s.push(c)},unmount(){l&&($o(s,d._instance,16),e(null,d._container),delete d._container.__vue_app__)},provide(c,u){return i.provides[c]=u,d},runWithContext(c){const u=_t;_t=d;try{return c()}finally{_t=u}}};return d}}let _t=null;function nn(e,o){if(Xe){let t=Xe.provides;const r=Xe.parent&&Xe.parent.provides;r===t&&(t=Xe.provides=Object.create(r)),t[e]=o}}function Co(e,o,t=!1){const r=Bt();if(r||_t){let n=_t?_t._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(n&&e in n)return n[e];if(arguments.length>1)return t&&re(o)?o.call(r&&r.proxy):o}}function ep(){return!!(Bt()||_t)}const qc={},Jc=()=>Object.create(qc),Qc=e=>Object.getPrototypeOf(e)===qc;function op(e,o,t,r=!1){const n={},i=Jc();e.propsDefaults=Object.create(null),ed(e,o,n,i);for(const a in e.propsOptions[0])a in n||(n[a]=void 0);t?e.props=r?n:_c(n):e.type.props?e.props=n:e.props=i,e.attrs=i}function tp(e,o,t,r){const{props:n,attrs:i,vnode:{patchFlag:a}}=e,s=ue(n),[l]=e.propsOptions;let d=!1;if((r||a>0)&&!(a&16)){if(a&8){const c=e.vnode.dynamicProps;for(let u=0;u<c.length;u++){let f=c[u];if(Dn(e.emitsOptions,f))continue;const g=o[f];if(l)if(pe(i,f))g!==i[f]&&(i[f]=g,d=!0);else{const v=yo(f);n[v]=Fi(l,s,v,g,e,!1)}else g!==i[f]&&(i[f]=g,d=!0)}}}else{ed(e,o,n,i)&&(d=!0);let c;for(const u in s)(!o||!pe(o,u)&&((c=At(u))===u||!pe(o,c)))&&(l?t&&(t[u]!==void 0||t[c]!==void 0)&&(n[u]=Fi(l,s,u,void 0,e,!0)):delete n[u]);if(i!==s)for(const u in i)(!o||!pe(o,u))&&(delete i[u],d=!0)}d&&Uo(e.attrs,"set","")}function ed(e,o,t,r){const[n,i]=e.propsOptions;let a=!1,s;if(o)for(let l in o){if(pr(l))continue;const d=o[l];let c;n&&pe(n,c=yo(l))?!i||!i.includes(c)?t[c]=d:(s||(s={}))[c]=d:Dn(e.emitsOptions,l)||(!(l in r)||d!==r[l])&&(r[l]=d,a=!0)}if(i){const l=ue(t),d=s||ge;for(let c=0;c<i.length;c++){const u=i[c];t[u]=Fi(n,l,u,d[u],e,!pe(d,u))}}return a}function Fi(e,o,t,r,n,i){const a=e[t];if(a!=null){const s=pe(a,"default");if(s&&r===void 0){const l=a.default;if(a.type!==Function&&!a.skipFactory&&re(l)){const{propsDefaults:d}=n;if(t in d)r=d[t];else{const c=Dr(n);r=d[t]=l.call(null,o),c()}}else r=l;n.ce&&n.ce._setProp(t,r)}a[0]&&(i&&!s?r=!1:a[1]&&(r===""||r===At(t))&&(r=!0))}return r}const rp=new WeakMap;function od(e,o,t=!1){const r=t?rp:o.propsCache,n=r.get(e);if(n)return n;const i=e.props,a={},s=[];let l=!1;if(!re(e)){const c=u=>{l=!0;const[f,g]=od(u,o,!0);Oe(a,f),g&&s.push(...g)};!t&&o.mixins.length&&o.mixins.forEach(c),e.extends&&c(e.extends),e.mixins&&e.mixins.forEach(c)}if(!i&&!l)return be(e)&&r.set(e,Ht),Ht;if(oe(i))for(let c=0;c<i.length;c++){const u=yo(i[c]);Rs(u)&&(a[u]=ge)}else if(i)for(const c in i){const u=yo(c);if(Rs(u)){const f=i[c],g=a[u]=oe(f)||re(f)?{type:f}:Oe({},f),v=g.type;let w=!1,T=!0;if(oe(v))for(let A=0;A<v.length;++A){const E=v[A],F=re(E)&&E.name;if(F==="Boolean"){w=!0;break}else F==="String"&&(T=!1)}else w=re(v)&&v.name==="Boolean";g[0]=w,g[1]=T,(w||pe(g,"default"))&&s.push(u)}}const d=[a,s];return be(e)&&r.set(e,d),d}function Rs(e){return e[0]!=="$"&&!pr(e)}const $a=e=>e==="_"||e==="_ctx"||e==="$stable",Sa=e=>oe(e)?e.map(zo):[zo(e)],np=(e,o,t)=>{if(o._n)return o;const r=zf((...n)=>Sa(o(...n)),t);return r._c=!1,r},td=(e,o,t)=>{const r=e._ctx;for(const n in e){if($a(n))continue;const i=e[n];if(re(i))o[n]=np(n,i,r);else if(i!=null){const a=Sa(i);o[n]=()=>a}}},rd=(e,o)=>{const t=Sa(o);e.slots.default=()=>t},nd=(e,o,t)=>{for(const r in o)(t||!$a(r))&&(e[r]=o[r])},ip=(e,o,t)=>{const r=e.slots=Jc();if(e.vnode.shapeFlag&32){const n=o._;n?(nd(r,o,t),t&&tc(r,"_",n,!0)):td(o,r)}else o&&rd(e,o)},ap=(e,o,t)=>{const{vnode:r,slots:n}=e;let i=!0,a=ge;if(r.shapeFlag&32){const s=o._;s?t&&s===1?i=!1:nd(n,o,t):(i=!o.$stable,td(o,n)),a=o}else o&&(rd(e,o),a={default:1});if(i)for(const s in n)!$a(s)&&a[s]==null&&delete n[s]},oo=wp;function sp(e){return lp(e)}function lp(e,o){const t=Rn();t.__VUE__=!0;const{insert:r,remove:n,patchProp:i,createElement:a,createText:s,createComment:l,setText:d,setElementText:c,parentNode:u,nextSibling:f,setScopeId:g=Oo,insertStaticContent:v}=e,w=(p,h,m,x=null,$=null,_=null,j=void 0,M=null,D=!!h.dynamicChildren)=>{if(p===h)return;p&&!kt(p,h)&&(x=C(p),xe(p,$,_,!0),p=null),h.patchFlag===-2&&(D=!1,h.dynamicChildren=null);const{type:R,ref:I,shapeFlag:y}=h;switch(R){case Nn:T(p,h,m,x);break;case Ye:A(p,h,m,x);break;case mi:p==null&&E(h,m,x,j);break;case uo:z(p,h,m,x,$,_,j,M,D);break;default:y&1?Z(p,h,m,x,$,_,j,M,D):y&6?Q(p,h,m,x,$,_,j,M,D):(y&64||y&128)&&R.process(p,h,m,x,$,_,j,M,D,Y)}I!=null&&$?vr(I,p&&p.ref,_,h||p,!h):I==null&&p&&p.ref!=null&&vr(p.ref,null,_,p,!0)},T=(p,h,m,x)=>{if(p==null)r(h.el=s(h.children),m,x);else{const $=h.el=p.el;h.children!==p.children&&d($,h.children)}},A=(p,h,m,x)=>{p==null?r(h.el=l(h.children||""),m,x):h.el=p.el},E=(p,h,m,x)=>{[p.el,p.anchor]=v(p.children,h,m,x,p.el,p.anchor)},F=({el:p,anchor:h},m,x)=>{let $;for(;p&&p!==h;)$=f(p),r(p,m,x),p=$;r(h,m,x)},L=({el:p,anchor:h})=>{let m;for(;p&&p!==h;)m=f(p),n(p),p=m;n(h)},Z=(p,h,m,x,$,_,j,M,D)=>{if(h.type==="svg"?j="svg":h.type==="math"&&(j="mathml"),p==null)G(h,m,x,$,_,j,M,D);else{const R=p.el&&p.el._isVueCE?p.el:null;try{R&&R._beginPatch(),k(p,h,$,_,j,M,D)}finally{R&&R._endPatch()}}},G=(p,h,m,x,$,_,j,M)=>{let D,R;const{props:I,shapeFlag:y,transition:P,dirs:N}=p;if(D=p.el=a(p.type,_,I&&I.is,I),y&8?c(D,p.children):y&16&&W(p.children,D,null,x,$,bi(p,_),j,M),N&&ht(p,null,x,"created"),X(D,p,p.scopeId,j,x),I){for(const ie in I)ie!=="value"&&!pr(ie)&&i(D,ie,null,I[ie],_,x);"value"in I&&i(D,"value",null,I.value,_),(R=I.onVnodeBeforeMount)&&To(R,x,p)}N&&ht(p,null,x,"beforeMount");const K=cp($,P);K&&P.beforeEnter(D),r(D,h,m),((R=I&&I.onVnodeMounted)||K||N)&&oo(()=>{R&&To(R,x,p),K&&P.enter(D),N&&ht(p,null,x,"mounted")},$)},X=(p,h,m,x,$)=>{if(m&&g(p,m),x)for(let _=0;_<x.length;_++)g(p,x[_]);if($){let _=$.subTree;if(h===_||cd(_.type)&&(_.ssContent===h||_.ssFallback===h)){const j=$.vnode;X(p,j,j.scopeId,j.slotScopeIds,$.parent)}}},W=(p,h,m,x,$,_,j,M,D=0)=>{for(let R=D;R<p.length;R++){const I=p[R]=M?et(p[R]):zo(p[R]);w(null,I,h,m,x,$,_,j,M)}},k=(p,h,m,x,$,_,j)=>{const M=h.el=p.el;let{patchFlag:D,dynamicChildren:R,dirs:I}=h;D|=p.patchFlag&16;const y=p.props||ge,P=h.props||ge;let N;if(m&&bt(m,!1),(N=P.onVnodeBeforeUpdate)&&To(N,m,h,p),I&&ht(h,p,m,"beforeUpdate"),m&&bt(m,!0),(y.innerHTML&&P.innerHTML==null||y.textContent&&P.textContent==null)&&c(M,""),R?S(p.dynamicChildren,R,M,m,x,bi(h,$),_):j||ne(p,h,M,null,m,x,bi(h,$),_,!1),D>0){if(D&16)q(M,y,P,m,$);else if(D&2&&y.class!==P.class&&i(M,"class",null,P.class,$),D&4&&i(M,"style",y.style,P.style,$),D&8){const K=h.dynamicProps;for(let ie=0;ie<K.length;ie++){const ce=K[ie],Ie=y[ce],Le=P[ce];(Le!==Ie||ce==="value")&&i(M,ce,Ie,Le,$,m)}}D&1&&p.children!==h.children&&c(M,h.children)}else!j&&R==null&&q(M,y,P,m,$);((N=P.onVnodeUpdated)||I)&&oo(()=>{N&&To(N,m,h,p),I&&ht(h,p,m,"updated")},x)},S=(p,h,m,x,$,_,j)=>{for(let M=0;M<h.length;M++){const D=p[M],R=h[M],I=D.el&&(D.type===uo||!kt(D,R)||D.shapeFlag&198)?u(D.el):m;w(D,R,I,null,x,$,_,j,!0)}},q=(p,h,m,x,$)=>{if(h!==m){if(h!==ge)for(const _ in h)!pr(_)&&!(_ in m)&&i(p,_,h[_],null,$,x);for(const _ in m){if(pr(_))continue;const j=m[_],M=h[_];j!==M&&_!=="value"&&i(p,_,M,j,$,x)}"value"in m&&i(p,"value",h.value,m.value,$)}},z=(p,h,m,x,$,_,j,M,D)=>{const R=h.el=p?p.el:s(""),I=h.anchor=p?p.anchor:s("");let{patchFlag:y,dynamicChildren:P,slotScopeIds:N}=h;N&&(M=M?M.concat(N):N),p==null?(r(R,m,x),r(I,m,x),W(h.children||[],m,I,$,_,j,M,D)):y>0&&y&64&&P&&p.dynamicChildren?(S(p.dynamicChildren,P,m,$,_,j,M),(h.key!=null||$&&h===$.subTree)&&Ra(p,h,!0)):ne(p,h,m,I,$,_,j,M,D)},Q=(p,h,m,x,$,_,j,M,D)=>{h.slotScopeIds=M,p==null?h.shapeFlag&512?$.ctx.activate(h,m,x,j,D):de(h,m,x,$,_,j,D):se(p,h,D)},de=(p,h,m,x,$,_,j)=>{const M=p.component=Tp(p,x,$);if(On(p)&&(M.ctx.renderer=Y),Ap(M,!1,j),M.asyncDep){if($&&$.registerDep(M,te,j),!p.el){const D=M.subTree=io(Ye);A(null,D,h,m),p.placeholder=D.el}}else te(M,p,h,m,$,_,j)},se=(p,h,m)=>{const x=h.component=p.component;if(yp(p,h,m))if(x.asyncDep&&!x.asyncResolved){ee(x,h,m);return}else x.next=h,x.update();else h.el=p.el,x.vnode=h},te=(p,h,m,x,$,_,j)=>{const M=()=>{if(p.isMounted){let{next:y,bu:P,u:N,parent:K,vnode:ie}=p;{const bo=id(p);if(bo){y&&(y.el=ie.el,ee(p,y,j)),bo.asyncDep.then(()=>{p.isUnmounted||M()});return}}let ce=y,Ie;bt(p,!1),y?(y.el=ie.el,ee(p,y,j)):y=ie,P&&ci(P),(Ie=y.props&&y.props.onVnodeBeforeUpdate)&&To(Ie,K,y,ie),bt(p,!0);const Le=Ts(p),Ze=p.subTree;p.subTree=Le,w(Ze,Le,u(Ze.el),C(Ze),p,$,_),y.el=Le.el,ce===null&&kp(p,Le.el),N&&oo(N,$),(Ie=y.props&&y.props.onVnodeUpdated)&&oo(()=>To(Ie,K,y,ie),$)}else{let y;const{el:P,props:N}=h,{bm:K,m:ie,parent:ce,root:Ie,type:Le}=p,Ze=Kt(h);bt(p,!1),K&&ci(K),!Ze&&(y=N&&N.onVnodeBeforeMount)&&To(y,ce,h),bt(p,!0);{Ie.ce&&Ie.ce._def.shadowRoot!==!1&&Ie.ce._injectChildStyle(Le);const bo=p.subTree=Ts(p);w(null,bo,m,x,p,$,_),h.el=bo.el}if(ie&&oo(ie,$),!Ze&&(y=N&&N.onVnodeMounted)){const bo=h;oo(()=>To(y,ce,bo),$)}(h.shapeFlag&256||ce&&Kt(ce.vnode)&&ce.vnode.shapeFlag&256)&&p.a&&oo(p.a,$),p.isMounted=!0,h=m=x=null}};p.scope.on();const D=p.effect=new cc(M);p.scope.off();const R=p.update=D.run.bind(D),I=p.job=D.runIfDirty.bind(D);I.i=p,I.id=p.uid,D.scheduler=()=>wa(I),bt(p,!0),R()},ee=(p,h,m)=>{h.component=p;const x=p.vnode.props;p.vnode=h,p.next=null,tp(p,h.props,x,m),ap(p,h.children,m),Ho(),bs(p),Vo()},ne=(p,h,m,x,$,_,j,M,D=!1)=>{const R=p&&p.children,I=p?p.shapeFlag:0,y=h.children,{patchFlag:P,shapeFlag:N}=h;if(P>0){if(P&128){Ae(R,y,m,x,$,_,j,M,D);return}else if(P&256){me(R,y,m,x,$,_,j,M,D);return}}N&8?(I&16&&Ne(R,$,_),y!==R&&c(m,y)):I&16?N&16?Ae(R,y,m,x,$,_,j,M,D):Ne(R,$,_,!0):(I&8&&c(m,""),N&16&&W(y,m,x,$,_,j,M,D))},me=(p,h,m,x,$,_,j,M,D)=>{p=p||Ht,h=h||Ht;const R=p.length,I=h.length,y=Math.min(R,I);let P;for(P=0;P<y;P++){const N=h[P]=D?et(h[P]):zo(h[P]);w(p[P],N,m,null,$,_,j,M,D)}R>I?Ne(p,$,_,!0,!1,y):W(h,m,x,$,_,j,M,D,y)},Ae=(p,h,m,x,$,_,j,M,D)=>{let R=0;const I=h.length;let y=p.length-1,P=I-1;for(;R<=y&&R<=P;){const N=p[R],K=h[R]=D?et(h[R]):zo(h[R]);if(kt(N,K))w(N,K,m,null,$,_,j,M,D);else break;R++}for(;R<=y&&R<=P;){const N=p[y],K=h[P]=D?et(h[P]):zo(h[P]);if(kt(N,K))w(N,K,m,null,$,_,j,M,D);else break;y--,P--}if(R>y){if(R<=P){const N=P+1,K=N<I?h[N].el:x;for(;R<=P;)w(null,h[R]=D?et(h[R]):zo(h[R]),m,K,$,_,j,M,D),R++}}else if(R>P)for(;R<=y;)xe(p[R],$,_,!0),R++;else{const N=R,K=R,ie=new Map;for(R=K;R<=P;R++){const Pe=h[R]=D?et(h[R]):zo(h[R]);Pe.key!=null&&ie.set(Pe.key,R)}let ce,Ie=0;const Le=P-K+1;let Ze=!1,bo=0;const ft=new Array(Le);for(R=0;R<Le;R++)ft[R]=0;for(R=N;R<=y;R++){const Pe=p[R];if(Ie>=Le){xe(Pe,$,_,!0);continue}let He;if(Pe.key!=null)He=ie.get(Pe.key);else for(ce=K;ce<=P;ce++)if(ft[ce-K]===0&&kt(Pe,h[ce])){He=ce;break}He===void 0?xe(Pe,$,_,!0):(ft[He-K]=R+1,He>=bo?bo=He:Ze=!0,w(Pe,h[He],m,null,$,_,j,M,D),Ie++)}const Nr=Ze?dp(ft):Ht;for(ce=Nr.length-1,R=Le-1;R>=0;R--){const Pe=K+R,He=h[Pe],Lr=h[Pe+1],Mr=Pe+1<I?Lr.el||Lr.placeholder:x;ft[R]===0?w(null,He,m,Mr,$,_,j,M,D):Ze&&(ce<0||R!==Nr[ce]?Se(He,m,Mr,2):ce--)}}},Se=(p,h,m,x,$=null)=>{const{el:_,type:j,transition:M,children:D,shapeFlag:R}=p;if(R&6){Se(p.component.subTree,h,m,x);return}if(R&128){p.suspense.move(h,m,x);return}if(R&64){j.move(p,h,m,Y);return}if(j===uo){r(_,h,m);for(let y=0;y<D.length;y++)Se(D[y],h,m,x);r(p.anchor,h,m);return}if(j===mi){F(p,h,m);return}if(x!==2&&R&1&&M)if(x===0)M.beforeEnter(_),r(_,h,m),oo(()=>M.enter(_),$);else{const{leave:y,delayLeave:P,afterLeave:N}=M,K=()=>{p.ctx.isUnmounted?n(_):r(_,h,m)},ie=()=>{_._isLeaving&&_[Wo](!0),y(_,()=>{K(),N&&N()})};P?P(_,K,ie):ie()}else r(_,h,m)},xe=(p,h,m,x=!1,$=!1)=>{const{type:_,props:j,ref:M,children:D,dynamicChildren:R,shapeFlag:I,patchFlag:y,dirs:P,cacheIndex:N}=p;if(y===-2&&($=!1),M!=null&&(Ho(),vr(M,null,m,p,!0),Vo()),N!=null&&(h.renderCache[N]=void 0),I&256){h.ctx.deactivate(p);return}const K=I&1&&P,ie=!Kt(p);let ce;if(ie&&(ce=j&&j.onVnodeBeforeUnmount)&&To(ce,h,p),I&6)ho(p.component,m,x);else{if(I&128){p.suspense.unmount(m,x);return}K&&ht(p,null,h,"beforeUnmount"),I&64?p.type.remove(p,h,m,Y,x):R&&!R.hasOnce&&(_!==uo||y>0&&y&64)?Ne(R,h,m,!1,!0):(_===uo&&y&384||!$&&I&16)&&Ne(D,h,m),x&&go(p)}(ie&&(ce=j&&j.onVnodeUnmounted)||K)&&oo(()=>{ce&&To(ce,h,p),K&&ht(p,null,h,"unmounted")},m)},go=p=>{const{type:h,el:m,anchor:x,transition:$}=p;if(h===uo){lo(m,x);return}if(h===mi){L(p);return}const _=()=>{n(m),$&&!$.persisted&&$.afterLeave&&$.afterLeave()};if(p.shapeFlag&1&&$&&!$.persisted){const{leave:j,delayLeave:M}=$,D=()=>j(m,_);M?M(p.el,_,D):D()}else _()},lo=(p,h)=>{let m;for(;p!==h;)m=f(p),n(p),p=m;n(h)},ho=(p,h,m)=>{const{bum:x,scope:$,job:_,subTree:j,um:M,m:D,a:R}=p;Es(D),Es(R),x&&ci(x),$.stop(),_&&(_.flags|=8,xe(j,p,h,m)),M&&oo(M,h),oo(()=>{p.isUnmounted=!0},h)},Ne=(p,h,m,x=!1,$=!1,_=0)=>{for(let j=_;j<p.length;j++)xe(p[j],h,m,x,$)},C=p=>{if(p.shapeFlag&6)return C(p.component.subTree);if(p.shapeFlag&128)return p.suspense.next();const h=f(p.anchor||p.el),m=h&&h[Bc];return m?f(m):h};let H=!1;const U=(p,h,m)=>{p==null?h._vnode&&xe(h._vnode,null,null,!0):w(h._vnode||null,p,h,null,null,null,m),h._vnode=p,H||(H=!0,bs(),Ec(),H=!1)},Y={p:w,um:xe,m:Se,r:go,mt:de,mc:W,pc:ne,pbc:S,n:C,o:e};return{render:U,hydrate:void 0,createApp:Qf(U)}}function bi({type:e,props:o},t){return t==="svg"&&e==="foreignObject"||t==="mathml"&&e==="annotation-xml"&&o&&o.encoding&&o.encoding.includes("html")?void 0:t}function bt({effect:e,job:o},t){t?(e.flags|=32,o.flags|=4):(e.flags&=-33,o.flags&=-5)}function cp(e,o){return(!e||e&&!e.pendingBranch)&&o&&!o.persisted}function Ra(e,o,t=!1){const r=e.children,n=o.children;if(oe(r)&&oe(n))for(let i=0;i<r.length;i++){const a=r[i];let s=n[i];s.shapeFlag&1&&!s.dynamicChildren&&((s.patchFlag<=0||s.patchFlag===32)&&(s=n[i]=et(n[i]),s.el=a.el),!t&&s.patchFlag!==-2&&Ra(a,s)),s.type===Nn&&s.patchFlag!==-1&&(s.el=a.el),s.type===Ye&&!s.el&&(s.el=a.el)}}function dp(e){const o=e.slice(),t=[0];let r,n,i,a,s;const l=e.length;for(r=0;r<l;r++){const d=e[r];if(d!==0){if(n=t[t.length-1],e[n]<d){o[r]=n,t.push(r);continue}for(i=0,a=t.length-1;i<a;)s=i+a>>1,e[t[s]]<d?i=s+1:a=s;d<e[t[i]]&&(i>0&&(o[r]=t[i-1]),t[i]=r)}}for(i=t.length,a=t[i-1];i-- >0;)t[i]=a,a=o[a];return t}function id(e){const o=e.subTree.component;if(o)return o.asyncDep&&!o.asyncResolved?o:id(o)}function Es(e){if(e)for(let o=0;o<e.length;o++)e[o].flags|=8}const up=Symbol.for("v-scx"),fp=()=>Co(up);function at(e,o,t){return ad(e,o,t)}function ad(e,o,t=ge){const{immediate:r,deep:n,flush:i,once:a}=t,s=Oe({},t),l=o&&r||!o&&i!=="post";let d;if(Ar){if(i==="sync"){const g=fp();d=g.__watcherHandles||(g.__watcherHandles=[])}else if(!l){const g=()=>{};return g.stop=Oo,g.resume=Oo,g.pause=Oo,g}}const c=Xe;s.call=(g,v,w)=>$o(g,c,v,w);let u=!1;i==="post"?s.scheduler=g=>{oo(g,c&&c.suspense)}:i!=="sync"&&(u=!0,s.scheduler=(g,v)=>{v?g():wa(g)}),s.augmentJob=g=>{o&&(g.flags|=4),u&&(g.flags|=2,c&&(g.id=c.uid,g.i=c))};const f=Ef(e,o,s);return Ar&&(d?d.push(f):l&&f()),f}function pp(e,o,t){const r=this.proxy,n=ke(e)?e.includes(".")?sd(r,e):()=>r[e]:e.bind(r,r);let i;re(o)?i=o:(i=o.handler,t=o);const a=Dr(this),s=ad(n,i.bind(r),t);return a(),s}function sd(e,o){const t=o.split(".");return()=>{let r=e;for(let n=0;n<t.length&&r;n++)r=r[t[n]];return r}}const gp=(e,o)=>o==="modelValue"||o==="model-value"?e.modelModifiers:e[`${o}Modifiers`]||e[`${yo(o)}Modifiers`]||e[`${At(o)}Modifiers`];function hp(e,o,...t){if(e.isUnmounted)return;const r=e.vnode.props||ge;let n=t;const i=o.startsWith("update:"),a=i&&gp(r,o.slice(7));a&&(a.trim&&(n=t.map(c=>ke(c)?c.trim():c)),a.number&&(n=t.map(Hu)));let s,l=r[s=li(o)]||r[s=li(yo(o))];!l&&i&&(l=r[s=li(At(o))]),l&&$o(l,e,6,n);const d=r[s+"Once"];if(d){if(!e.emitted)e.emitted={};else if(e.emitted[s])return;e.emitted[s]=!0,$o(d,e,6,n)}}const bp=new WeakMap;function ld(e,o,t=!1){const r=t?bp:o.emitsCache,n=r.get(e);if(n!==void 0)return n;const i=e.emits;let a={},s=!1;if(!re(e)){const l=d=>{const c=ld(d,o,!0);c&&(s=!0,Oe(a,c))};!t&&o.mixins.length&&o.mixins.forEach(l),e.extends&&l(e.extends),e.mixins&&e.mixins.forEach(l)}return!i&&!s?(be(e)&&r.set(e,null),null):(oe(i)?i.forEach(l=>a[l]=null):Oe(a,i),be(e)&&r.set(e,a),a)}function Dn(e,o){return!e||!_n(o)?!1:(o=o.slice(2).replace(/Once$/,""),pe(e,o[0].toLowerCase()+o.slice(1))||pe(e,At(o))||pe(e,o))}function Ts(e){const{type:o,vnode:t,proxy:r,withProxy:n,propsOptions:[i],slots:a,attrs:s,emit:l,render:d,renderCache:c,props:u,data:f,setupState:g,ctx:v,inheritAttrs:w}=e,T=pn(e);let A,E;try{if(t.shapeFlag&4){const L=n||r,Z=L;A=zo(d.call(Z,L,c,u,g,f,v)),E=s}else{const L=o;A=zo(L.length>1?L(u,{attrs:s,slots:a,emit:l}):L(u,null)),E=o.props?s:mp(s)}}catch(L){kr.length=0,Bn(L,e,1),A=io(Ye)}let F=A;if(E&&w!==!1){const L=Object.keys(E),{shapeFlag:Z}=F;L.length&&Z&7&&(i&&L.some(la)&&(E=vp(E,i)),F=dt(F,E,!1,!0))}return t.dirs&&(F=dt(F,null,!1,!0),F.dirs=F.dirs?F.dirs.concat(t.dirs):t.dirs),t.transition&&St(F,t.transition),A=F,pn(T),A}const mp=e=>{let o;for(const t in e)(t==="class"||t==="style"||_n(t))&&((o||(o={}))[t]=e[t]);return o},vp=(e,o)=>{const t={};for(const r in e)(!la(r)||!(r.slice(9)in o))&&(t[r]=e[r]);return t};function yp(e,o,t){const{props:r,children:n,component:i}=e,{props:a,children:s,patchFlag:l}=o,d=i.emitsOptions;if(o.dirs||o.transition)return!0;if(t&&l>=0){if(l&1024)return!0;if(l&16)return r?As(r,a,d):!!a;if(l&8){const c=o.dynamicProps;for(let u=0;u<c.length;u++){const f=c[u];if(a[f]!==r[f]&&!Dn(d,f))return!0}}}else return(n||s)&&(!s||!s.$stable)?!0:r===a?!1:r?a?As(r,a,d):!0:!!a;return!1}function As(e,o,t){const r=Object.keys(o);if(r.length!==Object.keys(e).length)return!0;for(let n=0;n<r.length;n++){const i=r[n];if(o[i]!==e[i]&&!Dn(t,i))return!0}return!1}function kp({vnode:e,parent:o},t){for(;o;){const r=o.subTree;if(r.suspense&&r.suspense.activeBranch===e&&(r.el=e.el),r===e)(e=o.vnode).el=t,o=o.parent;else break}}const cd=e=>e.__isSuspense;function wp(e,o){o&&o.pendingBranch?oe(e)?o.effects.push(...e):o.effects.push(e):Bf(e)}const uo=Symbol.for("v-fgt"),Nn=Symbol.for("v-txt"),Ye=Symbol.for("v-cmt"),mi=Symbol.for("v-stc"),kr=[];let po=null;function Rt(e=!1){kr.push(po=e?null:[])}function xp(){kr.pop(),po=kr[kr.length-1]||null}let Er=1;function bn(e,o=!1){Er+=e,e<0&&po&&o&&(po.hasOnce=!0)}function dd(e){return e.dynamicChildren=Er>0?po||Ht:null,xp(),Er>0&&po&&po.push(e),e}function Ln(e,o,t,r,n,i){return dd(er(e,o,t,r,n,i,!0))}function ji(e,o,t,r,n){return dd(io(e,o,t,r,n,!0))}function Tr(e){return e?e.__v_isVNode===!0:!1}function kt(e,o){return e.type===o.type&&e.key===o.key}const ud=({key:e})=>e??null,an=({ref:e,ref_key:o,ref_for:t})=>(typeof e=="number"&&(e=""+e),e!=null?ke(e)||$e(e)||re(e)?{i:Ue,r:e,k:o,f:!!t}:e:null);function er(e,o=null,t=null,r=0,n=null,i=e===uo?0:1,a=!1,s=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:o,key:o&&ud(o),ref:o&&an(o),scopeId:Ac,slotScopeIds:null,children:t,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:r,dynamicProps:n,dynamicChildren:null,appContext:null,ctx:Ue};return s?(Ea(l,t),i&128&&e.normalize(l)):t&&(l.shapeFlag|=ke(t)?8:16),Er>0&&!a&&po&&(l.patchFlag>0||i&6)&&l.patchFlag!==32&&po.push(l),l}const io=_p;function _p(e,o=null,t=null,r=0,n=null,i=!1){if((!e||e===Vc)&&(e=Ye),Tr(e)){const s=dt(e,o,!0);return t&&Ea(s,t),Er>0&&!i&&po&&(s.shapeFlag&6?po[po.indexOf(e)]=s:po.push(s)),s.patchFlag=-2,s}if(Pp(e)&&(e=e.__vccOpts),o){o=Cp(o);let{class:s,style:l}=o;s&&!ke(s)&&(o.class=Tn(s)),be(l)&&(va(l)&&!oe(l)&&(l=Oe({},l)),o.style=En(l))}const a=ke(e)?1:cd(e)?128:zc(e)?64:be(e)?4:re(e)?2:0;return er(e,o,t,r,n,a,i,!0)}function Cp(e){return e?va(e)||Qc(e)?Oe({},e):e:null}function dt(e,o,t=!1,r=!1){const{props:n,ref:i,patchFlag:a,children:s,transition:l}=e,d=o?Sp(n||{},o):n,c={__v_isVNode:!0,__v_skip:!0,type:e.type,props:d,key:d&&ud(d),ref:o&&o.ref?t&&i?oe(i)?i.concat(an(o)):[i,an(o)]:an(o):i,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:o&&e.type!==uo?a===-1?16:a|16:a,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:l,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&dt(e.ssContent),ssFallback:e.ssFallback&&dt(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return l&&r&&St(c,l.clone(c)),c}function $p(e=" ",o=0){return io(Nn,null,e,o)}function qS(e="",o=!1){return o?(Rt(),ji(Ye,null,e)):io(Ye,null,e)}function zo(e){return e==null||typeof e=="boolean"?io(Ye):oe(e)?io(uo,null,e.slice()):Tr(e)?et(e):io(Nn,null,String(e))}function et(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:dt(e)}function Ea(e,o){let t=0;const{shapeFlag:r}=e;if(o==null)o=null;else if(oe(o))t=16;else if(typeof o=="object")if(r&65){const n=o.default;n&&(n._c&&(n._d=!1),Ea(e,n()),n._c&&(n._d=!0));return}else{t=32;const n=o._;!n&&!Qc(o)?o._ctx=Ue:n===3&&Ue&&(Ue.slots._===1?o._=1:(o._=2,e.patchFlag|=1024))}else re(o)?(o={default:o,_ctx:Ue},t=32):(o=String(o),r&64?(t=16,o=[$p(o)]):t=8);e.children=o,e.shapeFlag|=t}function Sp(...e){const o={};for(let t=0;t<e.length;t++){const r=e[t];for(const n in r)if(n==="class")o.class!==r.class&&(o.class=Tn([o.class,r.class]));else if(n==="style")o.style=En([o.style,r.style]);else if(_n(n)){const i=o[n],a=r[n];a&&i!==a&&!(oe(i)&&i.includes(a))&&(o[n]=i?[].concat(i,a):a)}else n!==""&&(o[n]=r[n])}return o}function To(e,o,t,r=null){$o(e,o,7,[t,r])}const Rp=Xc();let Ep=0;function Tp(e,o,t){const r=e.type,n=(o?o.appContext:e.appContext)||Rp,i={uid:Ep++,vnode:e,type:r,parent:o,appContext:n,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new ac(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:o?o.provides:Object.create(n.provides),ids:o?o.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:od(r,n),emitsOptions:ld(r,n),emit:null,emitted:null,propsDefaults:ge,inheritAttrs:r.inheritAttrs,ctx:ge,data:ge,props:ge,attrs:ge,slots:ge,refs:ge,setupState:ge,setupContext:null,suspense:t,suspenseId:t?t.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=o?o.root:i,i.emit=hp.bind(null,i),e.ce&&e.ce(i),i}let Xe=null;const Bt=()=>Xe||Ue;let mn,Wi;{const e=Rn(),o=(t,r)=>{let n;return(n=e[t])||(n=e[t]=[]),n.push(r),i=>{n.length>1?n.forEach(a=>a(i)):n[0](i)}};mn=o("__VUE_INSTANCE_SETTERS__",t=>Xe=t),Wi=o("__VUE_SSR_SETTERS__",t=>Ar=t)}const Dr=e=>{const o=Xe;return mn(e),e.scope.on(),()=>{e.scope.off(),mn(o)}},Bs=()=>{Xe&&Xe.scope.off(),mn(null)};function fd(e){return e.vnode.shapeFlag&4}let Ar=!1;function Ap(e,o=!1,t=!1){o&&Wi(o);const{props:r,children:n}=e.vnode,i=fd(e);op(e,r,i,o),ip(e,n,t||o);const a=i?Bp(e,o):void 0;return o&&Wi(!1),a}function Bp(e,o){const t=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Vf);const{setup:r}=t;if(r){Ho();const n=e.setupContext=r.length>1?Op(e):null,i=Dr(e),a=Pr(r,e,0,[e.props,n]),s=Ql(a);if(Vo(),i(),(s||e.sp)&&!Kt(e)&&jc(e),s){if(a.then(Bs,Bs),o)return a.then(l=>{zs(e,l)}).catch(l=>{Bn(l,e,0)});e.asyncDep=a}else zs(e,a)}else pd(e)}function zs(e,o,t){re(o)?e.type.__ssrInlineRender?e.ssrRender=o:e.render=o:be(o)&&(e.setupState=$c(o)),pd(e)}function pd(e,o,t){const r=e.type;e.render||(e.render=r.render||Oo);{const n=Dr(e);Ho();try{Gf(e)}finally{Vo(),n()}}}const zp={get(e,o){return Ke(e,"get",""),e[o]}};function Op(e){const o=t=>{e.exposed=t||{}};return{attrs:new Proxy(e.attrs,zp),slots:e.slots,emit:e.emit,expose:o}}function Mn(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy($c(ya(e.exposed)),{get(o,t){if(t in o)return o[t];if(t in yr)return yr[t](e)},has(o,t){return t in o||t in yr}})):e.proxy}function Ip(e,o=!0){return re(e)?e.displayName||e.name:e.name||o&&e.__name}function Pp(e){return re(e)&&"__vccOpts"in e}const We=(e,o)=>Sf(e,o,Ar);function Ta(e,o,t){try{bn(-1);const r=arguments.length;return r===2?be(o)&&!oe(o)?Tr(o)?io(e,null,[o]):io(e,o):io(e,null,o):(r>3?t=Array.prototype.slice.call(arguments,2):r===3&&Tr(t)&&(t=[t]),io(e,o,t))}finally{bn(1)}}const Dp="3.5.24";let Ui;const Os=typeof window<"u"&&window.trustedTypes;if(Os)try{Ui=Os.createPolicy("vue",{createHTML:e=>e})}catch{}const gd=Ui?e=>Ui.createHTML(e):e=>e,Np="http://www.w3.org/2000/svg",Lp="http://www.w3.org/1998/Math/MathML",jo=typeof document<"u"?document:null,Is=jo&&jo.createElement("template"),Mp={insert:(e,o,t)=>{o.insertBefore(e,t||null)},remove:e=>{const o=e.parentNode;o&&o.removeChild(e)},createElement:(e,o,t,r)=>{const n=o==="svg"?jo.createElementNS(Np,e):o==="mathml"?jo.createElementNS(Lp,e):t?jo.createElement(e,{is:t}):jo.createElement(e);return e==="select"&&r&&r.multiple!=null&&n.setAttribute("multiple",r.multiple),n},createText:e=>jo.createTextNode(e),createComment:e=>jo.createComment(e),setText:(e,o)=>{e.nodeValue=o},setElementText:(e,o)=>{e.textContent=o},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>jo.querySelector(e),setScopeId(e,o){e.setAttribute(o,"")},insertStaticContent(e,o,t,r,n,i){const a=t?t.previousSibling:o.lastChild;if(n&&(n===i||n.nextSibling))for(;o.insertBefore(n.cloneNode(!0),t),!(n===i||!(n=n.nextSibling)););else{Is.innerHTML=gd(r==="svg"?`<svg>${e}</svg>`:r==="mathml"?`<math>${e}</math>`:e);const s=Is.content;if(r==="svg"||r==="mathml"){const l=s.firstChild;for(;l.firstChild;)s.appendChild(l.firstChild);s.removeChild(l)}o.insertBefore(s,t)}return[a?a.nextSibling:o.firstChild,t?t.previousSibling:o.lastChild]}},Yo="transition",lr="animation",Xt=Symbol("_vtc"),hd={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},bd=Oe({},Dc,hd),Fp=e=>(e.displayName="Transition",e.props=bd,e),JS=Fp((e,{slots:o})=>Ta(Pf,md(e),o)),mt=(e,o=[])=>{oe(e)?e.forEach(t=>t(...o)):e&&e(...o)},Ps=e=>e?oe(e)?e.some(o=>o.length>1):e.length>1:!1;function md(e){const o={};for(const z in e)z in hd||(o[z]=e[z]);if(e.css===!1)return o;const{name:t="v",type:r,duration:n,enterFromClass:i=`${t}-enter-from`,enterActiveClass:a=`${t}-enter-active`,enterToClass:s=`${t}-enter-to`,appearFromClass:l=i,appearActiveClass:d=a,appearToClass:c=s,leaveFromClass:u=`${t}-leave-from`,leaveActiveClass:f=`${t}-leave-active`,leaveToClass:g=`${t}-leave-to`}=e,v=jp(n),w=v&&v[0],T=v&&v[1],{onBeforeEnter:A,onEnter:E,onEnterCancelled:F,onLeave:L,onLeaveCancelled:Z,onBeforeAppear:G=A,onAppear:X=E,onAppearCancelled:W=F}=o,k=(z,Q,de,se)=>{z._enterCancelled=se,qo(z,Q?c:s),qo(z,Q?d:a),de&&de()},S=(z,Q)=>{z._isLeaving=!1,qo(z,u),qo(z,g),qo(z,f),Q&&Q()},q=z=>(Q,de)=>{const se=z?X:E,te=()=>k(Q,z,de);mt(se,[Q,te]),Ds(()=>{qo(Q,z?l:i),Ao(Q,z?c:s),Ps(se)||Ns(Q,r,w,te)})};return Oe(o,{onBeforeEnter(z){mt(A,[z]),Ao(z,i),Ao(z,a)},onBeforeAppear(z){mt(G,[z]),Ao(z,l),Ao(z,d)},onEnter:q(!1),onAppear:q(!0),onLeave(z,Q){z._isLeaving=!0;const de=()=>S(z,Q);Ao(z,u),z._enterCancelled?(Ao(z,f),Zi(z)):(Zi(z),Ao(z,f)),Ds(()=>{z._isLeaving&&(qo(z,u),Ao(z,g),Ps(L)||Ns(z,r,T,de))}),mt(L,[z,de])},onEnterCancelled(z){k(z,!1,void 0,!0),mt(F,[z])},onAppearCancelled(z){k(z,!0,void 0,!0),mt(W,[z])},onLeaveCancelled(z){S(z),mt(Z,[z])}})}function jp(e){if(e==null)return null;if(be(e))return[vi(e.enter),vi(e.leave)];{const o=vi(e);return[o,o]}}function vi(e){return Vu(e)}function Ao(e,o){o.split(/\s+/).forEach(t=>t&&e.classList.add(t)),(e[Xt]||(e[Xt]=new Set)).add(o)}function qo(e,o){o.split(/\s+/).forEach(r=>r&&e.classList.remove(r));const t=e[Xt];t&&(t.delete(o),t.size||(e[Xt]=void 0))}function Ds(e){requestAnimationFrame(()=>{requestAnimationFrame(e)})}let Wp=0;function Ns(e,o,t,r){const n=e._endId=++Wp,i=()=>{n===e._endId&&r()};if(t!=null)return setTimeout(i,t);const{type:a,timeout:s,propCount:l}=vd(e,o);if(!a)return r();const d=a+"end";let c=0;const u=()=>{e.removeEventListener(d,f),i()},f=g=>{g.target===e&&++c>=l&&u()};setTimeout(()=>{c<l&&u()},s+1),e.addEventListener(d,f)}function vd(e,o){const t=window.getComputedStyle(e),r=v=>(t[v]||"").split(", "),n=r(`${Yo}Delay`),i=r(`${Yo}Duration`),a=Ls(n,i),s=r(`${lr}Delay`),l=r(`${lr}Duration`),d=Ls(s,l);let c=null,u=0,f=0;o===Yo?a>0&&(c=Yo,u=a,f=i.length):o===lr?d>0&&(c=lr,u=d,f=l.length):(u=Math.max(a,d),c=u>0?a>d?Yo:lr:null,f=c?c===Yo?i.length:l.length:0);const g=c===Yo&&/\b(?:transform|all)(?:,|$)/.test(r(`${Yo}Property`).toString());return{type:c,timeout:u,propCount:f,hasTransform:g}}function Ls(e,o){for(;e.length<o.length;)e=e.concat(e);return Math.max(...o.map((t,r)=>Ms(t)+Ms(e[r])))}function Ms(e){return e==="auto"?0:Number(e.slice(0,-1).replace(",","."))*1e3}function Zi(e){return(e?e.ownerDocument:document).body.offsetHeight}function Up(e,o,t){const r=e[Xt];r&&(o=(o?[o,...r]:[...r]).join(" ")),o==null?e.removeAttribute("class"):t?e.setAttribute("class",o):e.className=o}const vn=Symbol("_vod"),yd=Symbol("_vsh"),QS={name:"show",beforeMount(e,{value:o},{transition:t}){e[vn]=e.style.display==="none"?"":e.style.display,t&&o?t.beforeEnter(e):cr(e,o)},mounted(e,{value:o},{transition:t}){t&&o&&t.enter(e)},updated(e,{value:o,oldValue:t},{transition:r}){!o!=!t&&(r?o?(r.beforeEnter(e),cr(e,!0),r.enter(e)):r.leave(e,()=>{cr(e,!1)}):cr(e,o))},beforeUnmount(e,{value:o}){cr(e,o)}};function cr(e,o){e.style.display=o?e[vn]:"none",e[yd]=!o}const Zp=Symbol(""),Hp=/(?:^|;)\s*display\s*:/;function Vp(e,o,t){const r=e.style,n=ke(t);let i=!1;if(t&&!n){if(o)if(ke(o))for(const a of o.split(";")){const s=a.slice(0,a.indexOf(":")).trim();t[s]==null&&sn(r,s,"")}else for(const a in o)t[a]==null&&sn(r,a,"");for(const a in t)a==="display"&&(i=!0),sn(r,a,t[a])}else if(n){if(o!==t){const a=r[Zp];a&&(t+=";"+a),r.cssText=t,i=Hp.test(t)}}else o&&e.removeAttribute("style");vn in e&&(e[vn]=i?r.display:"",e[yd]&&(r.display="none"))}const Fs=/\s*!important$/;function sn(e,o,t){if(oe(t))t.forEach(r=>sn(e,o,r));else if(t==null&&(t=""),o.startsWith("--"))e.setProperty(o,t);else{const r=Gp(e,o);Fs.test(t)?e.setProperty(At(r),t.replace(Fs,""),"important"):e[r]=t}}const js=["Webkit","Moz","ms"],yi={};function Gp(e,o){const t=yi[o];if(t)return t;let r=yo(o);if(r!=="filter"&&r in e)return yi[o]=r;r=Sn(r);for(let n=0;n<js.length;n++){const i=js[n]+r;if(i in e)return yi[o]=i}return o}const Ws="http://www.w3.org/1999/xlink";function Us(e,o,t,r,n,i=Ju(o)){r&&o.startsWith("xlink:")?t==null?e.removeAttributeNS(Ws,o.slice(6,o.length)):e.setAttributeNS(Ws,o,t):t==null||i&&!rc(t)?e.removeAttribute(o):e.setAttribute(o,i?"":Go(t)?String(t):t)}function Zs(e,o,t,r,n){if(o==="innerHTML"||o==="textContent"){t!=null&&(e[o]=o==="innerHTML"?gd(t):t);return}const i=e.tagName;if(o==="value"&&i!=="PROGRESS"&&!i.includes("-")){const s=i==="OPTION"?e.getAttribute("value")||"":e.value,l=t==null?e.type==="checkbox"?"on":"":String(t);(s!==l||!("_value"in e))&&(e.value=l),t==null&&e.removeAttribute(o),e._value=t;return}let a=!1;if(t===""||t==null){const s=typeof e[o];s==="boolean"?t=rc(t):t==null&&s==="string"?(t="",a=!0):s==="number"&&(t=0,a=!0)}try{e[o]=t}catch{}a&&e.removeAttribute(n||o)}function Kp(e,o,t,r){e.addEventListener(o,t,r)}function Yp(e,o,t,r){e.removeEventListener(o,t,r)}const Hs=Symbol("_vei");function Xp(e,o,t,r,n=null){const i=e[Hs]||(e[Hs]={}),a=i[o];if(r&&a)a.value=r;else{const[s,l]=qp(o);if(r){const d=i[o]=eg(r,n);Kp(e,s,d,l)}else a&&(Yp(e,s,a,l),i[o]=void 0)}}const Vs=/(?:Once|Passive|Capture)$/;function qp(e){let o;if(Vs.test(e)){o={};let r;for(;r=e.match(Vs);)e=e.slice(0,e.length-r[0].length),o[r[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):At(e.slice(2)),o]}let ki=0;const Jp=Promise.resolve(),Qp=()=>ki||(Jp.then(()=>ki=0),ki=Date.now());function eg(e,o){const t=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=t.attached)return;$o(og(r,t.value),o,5,[r])};return t.value=e,t.attached=Qp(),t}function og(e,o){if(oe(o)){const t=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{t.call(e),e._stopped=!0},o.map(r=>n=>!n._stopped&&r&&r(n))}else return o}const Gs=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,tg=(e,o,t,r,n,i)=>{const a=n==="svg";o==="class"?Up(e,r,a):o==="style"?Vp(e,t,r):_n(o)?la(o)||Xp(e,o,t,r,i):(o[0]==="."?(o=o.slice(1),!0):o[0]==="^"?(o=o.slice(1),!1):rg(e,o,r,a))?(Zs(e,o,r),!e.tagName.includes("-")&&(o==="value"||o==="checked"||o==="selected")&&Us(e,o,r,a,i,o!=="value")):e._isVueCE&&(/[A-Z]/.test(o)||!ke(r))?Zs(e,yo(o),r,i,o):(o==="true-value"?e._trueValue=r:o==="false-value"&&(e._falseValue=r),Us(e,o,r,a))};function rg(e,o,t,r){if(r)return!!(o==="innerHTML"||o==="textContent"||o in e&&Gs(o)&&re(t));if(o==="spellcheck"||o==="draggable"||o==="translate"||o==="autocorrect"||o==="sandbox"&&e.tagName==="IFRAME"||o==="form"||o==="list"&&e.tagName==="INPUT"||o==="type"&&e.tagName==="TEXTAREA")return!1;if(o==="width"||o==="height"){const n=e.tagName;if(n==="IMG"||n==="VIDEO"||n==="CANVAS"||n==="SOURCE")return!1}return Gs(o)&&ke(t)?!1:o in e}const kd=new WeakMap,wd=new WeakMap,yn=Symbol("_moveCb"),Ks=Symbol("_enterCb"),ng=e=>(delete e.props.mode,e),ig=ng({name:"TransitionGroup",props:Oe({},bd,{tag:String,moveClass:String}),setup(e,{slots:o}){const t=Bt(),r=Pc();let n,i;return Uc(()=>{if(!n.length)return;const a=e.moveClass||`${e.name||"v"}-move`;if(!cg(n[0].el,t.vnode.el,a)){n=[];return}n.forEach(ag),n.forEach(sg);const s=n.filter(lg);Zi(t.vnode.el),s.forEach(l=>{const d=l.el,c=d.style;Ao(d,a),c.transform=c.webkitTransform=c.transitionDuration="";const u=d[yn]=f=>{f&&f.target!==d||(!f||f.propertyName.endsWith("transform"))&&(d.removeEventListener("transitionend",u),d[yn]=null,qo(d,a))};d.addEventListener("transitionend",u)}),n=[]}),()=>{const a=ue(e),s=md(a);let l=a.tag||uo;if(n=[],i)for(let d=0;d<i.length;d++){const c=i[d];c.el&&c.el instanceof Element&&(n.push(c),St(c,Rr(c,s,r,t)),kd.set(c,{left:c.el.offsetLeft,top:c.el.offsetTop}))}i=o.default?xa(o.default()):[];for(let d=0;d<i.length;d++){const c=i[d];c.key!=null&&St(c,Rr(c,s,r,t))}return io(l,null,i)}}}),eR=ig;function ag(e){const o=e.el;o[yn]&&o[yn](),o[Ks]&&o[Ks]()}function sg(e){wd.set(e,{left:e.el.offsetLeft,top:e.el.offsetTop})}function lg(e){const o=kd.get(e),t=wd.get(e),r=o.left-t.left,n=o.top-t.top;if(r||n){const i=e.el.style;return i.transform=i.webkitTransform=`translate(${r}px,${n}px)`,i.transitionDuration="0s",e}}function cg(e,o,t){const r=e.cloneNode(),n=e[Xt];n&&n.forEach(s=>{s.split(/\s+/).forEach(l=>l&&r.classList.remove(l))}),t.split(/\s+/).forEach(s=>s&&r.classList.add(s)),r.style.display="none";const i=o.nodeType===1?o:o.parentNode;i.appendChild(r);const{hasTransform:a}=vd(r);return i.removeChild(r),a}const dg=["ctrl","shift","alt","meta"],ug={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,o)=>dg.some(t=>e[`${t}Key`]&&!o.includes(t))},oR=(e,o)=>{const t=e._withMods||(e._withMods={}),r=o.join(".");return t[r]||(t[r]=((n,...i)=>{for(let a=0;a<o.length;a++){const s=ug[o[a]];if(s&&s(n,o))return}return e(n,...i)}))},fg=Oe({patchProp:tg},Mp);let Ys;function pg(){return Ys||(Ys=sp(fg))}const tR=((...e)=>{const o=pg().createApp(...e),{mount:t}=o;return o.mount=r=>{const n=hg(r);if(!n)return;const i=o._component;!re(i)&&!i.render&&!i.template&&(i.template=n.innerHTML),n.nodeType===1&&(n.textContent="");const a=t(n,!1,gg(n));return n instanceof Element&&(n.removeAttribute("v-cloak"),n.setAttribute("data-v-app","")),a},o});function gg(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function hg(e){return ke(e)?document.querySelector(e):e}var bg=Object.defineProperty,Xs=Object.getOwnPropertySymbols,mg=Object.prototype.hasOwnProperty,vg=Object.prototype.propertyIsEnumerable,qs=(e,o,t)=>o in e?bg(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t,yg=(e,o)=>{for(var t in o||(o={}))mg.call(o,t)&&qs(e,t,o[t]);if(Xs)for(var t of Xs(o))vg.call(o,t)&&qs(e,t,o[t]);return e};function Aa(e){return e==null||e===""||Array.isArray(e)&&e.length===0||!(e instanceof Date)&&typeof e=="object"&&Object.keys(e).length===0}function Hi(e,o,t=new WeakSet){if(e===o)return!0;if(!e||!o||typeof e!="object"||typeof o!="object"||t.has(e)||t.has(o))return!1;t.add(e).add(o);let r=Array.isArray(e),n=Array.isArray(o),i,a,s;if(r&&n){if(a=e.length,a!=o.length)return!1;for(i=a;i--!==0;)if(!Hi(e[i],o[i],t))return!1;return!0}if(r!=n)return!1;let l=e instanceof Date,d=o instanceof Date;if(l!=d)return!1;if(l&&d)return e.getTime()==o.getTime();let c=e instanceof RegExp,u=o instanceof RegExp;if(c!=u)return!1;if(c&&u)return e.toString()==o.toString();let f=Object.keys(e);if(a=f.length,a!==Object.keys(o).length)return!1;for(i=a;i--!==0;)if(!Object.prototype.hasOwnProperty.call(o,f[i]))return!1;for(i=a;i--!==0;)if(s=f[i],!Hi(e[s],o[s],t))return!1;return!0}function kg(e,o){return Hi(e,o)}function xd(e){return typeof e=="function"&&"call"in e&&"apply"in e}function Te(e){return!Aa(e)}function Js(e,o){if(!e||!o)return null;try{let t=e[o];if(Te(t))return t}catch{}if(Object.keys(e).length){if(xd(o))return o(e);if(o.indexOf(".")===-1)return e[o];{let t=o.split("."),r=e;for(let n=0,i=t.length;n<i;++n){if(r==null)return null;r=r[t[n]]}return r}}return null}function rR(e,o,t){return t?Js(e,t)===Js(o,t):kg(e,o)}function st(e,o=!0){return e instanceof Object&&e.constructor===Object&&(o||Object.keys(e).length!==0)}function _d(e={},o={}){let t=yg({},e);return Object.keys(o).forEach(r=>{let n=r;st(o[n])&&n in e&&st(e[n])?t[n]=_d(e[n],o[n]):t[n]=o[n]}),t}function Cd(...e){return e.reduce((o,t,r)=>r===0?t:_d(o,t),{})}function nR(e,o){let t=-1;if(Te(e))try{t=e.findLastIndex(o)}catch{t=e.lastIndexOf([...e].reverse().find(o))}return t}function tt(e,...o){return xd(e)?e(...o):e}function ut(e,o=!0){return typeof e=="string"&&(o||e!=="")}function Qs(e){return ut(e)?e.replace(/(-|_)/g,"").toLowerCase():e}function wg(e,o="",t={}){let r=Qs(o).split("."),n=r.shift();if(n){if(st(e)){let i=Object.keys(e).find(a=>Qs(a)===n)||"";return wg(tt(e[i],t),r.join("."),t)}return}return tt(e,t)}function iR(e,o=!0){return Array.isArray(e)&&(o||e.length!==0)}function xg(e){return Te(e)&&!isNaN(e)}function Ct(e,o){if(o){let t=o.test(e);return o.lastIndex=0,t}return!1}function aR(...e){return Cd(...e)}function el(e){return e&&e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g,"").replace(/ {2,}/g," ").replace(/ ([{:}]) /g,"$1").replace(/([;,]) /g,"$1").replace(/ !/g,"!").replace(/: /g,":").trim()}function sR(e){return ut(e,!1)?e[0].toUpperCase()+e.slice(1):e}function $d(e){return ut(e)?e.replace(/(_)/g,"-").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase():e}function _g(){let e=new Map;return{on(o,t){let r=e.get(o);return r?r.push(t):r=[t],e.set(o,r),this},off(o,t){let r=e.get(o);return r&&r.splice(r.indexOf(t)>>>0,1),this},emit(o,t){let r=e.get(o);r&&r.forEach(n=>{n(t)})},clear(){e.clear()}}}function Cg(...e){if(e){let o=[];for(let t=0;t<e.length;t++){let r=e[t];if(!r)continue;let n=typeof r;if(n==="string"||n==="number")o.push(r);else if(n==="object"){let i=Array.isArray(r)?[Cg(...r)]:Object.entries(r).map(([a,s])=>s?a:void 0);o=i.length?o.concat(i.filter(a=>!!a)):o}}return o.join(" ").trim()}}function $g(e,o){return e?e.classList?e.classList.contains(o):new RegExp("(^| )"+o+"( |$)","gi").test(e.className):!1}function ol(e,o){if(e&&o){let t=r=>{$g(e,r)||(e.classList?e.classList.add(r):e.className+=" "+r)};[o].flat().filter(Boolean).forEach(r=>r.split(" ").forEach(t))}}function Sg(){return window.innerWidth-document.documentElement.offsetWidth}function lR(e){typeof e=="string"?ol(document.body,e||"p-overflow-hidden"):(e!=null&&e.variableName&&document.body.style.setProperty(e.variableName,Sg()+"px"),ol(document.body,e?.className||"p-overflow-hidden"))}function tl(e,o){if(e&&o){let t=r=>{e.classList?e.classList.remove(r):e.className=e.className.replace(new RegExp("(^|\\b)"+r.split(" ").join("|")+"(\\b|$)","gi")," ")};[o].flat().filter(Boolean).forEach(r=>r.split(" ").forEach(t))}}function cR(e){typeof e=="string"?tl(document.body,e||"p-overflow-hidden"):(e!=null&&e.variableName&&document.body.style.removeProperty(e.variableName),tl(document.body,e?.className||"p-overflow-hidden"))}function Vi(e){for(let o of document?.styleSheets)try{for(let t of o?.cssRules)for(let r of t?.style)if(e.test(r))return{name:r,value:t.style.getPropertyValue(r).trim()}}catch{}return null}function Sd(e){let o={width:0,height:0};if(e){let[t,r]=[e.style.visibility,e.style.display],n=e.getBoundingClientRect();e.style.visibility="hidden",e.style.display="block",o.width=n.width||e.offsetWidth,o.height=n.height||e.offsetHeight,e.style.display=r,e.style.visibility=t}return o}function Rd(){let e=window,o=document,t=o.documentElement,r=o.getElementsByTagName("body")[0],n=e.innerWidth||t.clientWidth||r.clientWidth,i=e.innerHeight||t.clientHeight||r.clientHeight;return{width:n,height:i}}function Gi(e){return e?Math.abs(e.scrollLeft):0}function Rg(){let e=document.documentElement;return(window.pageXOffset||Gi(e))-(e.clientLeft||0)}function Eg(){let e=document.documentElement;return(window.pageYOffset||e.scrollTop)-(e.clientTop||0)}function Tg(e){return e?getComputedStyle(e).direction==="rtl":!1}function dR(e,o,t=!0){var r,n,i,a;if(e){let s=e.offsetParent?{width:e.offsetWidth,height:e.offsetHeight}:Sd(e),l=s.height,d=s.width,c=o.offsetHeight,u=o.offsetWidth,f=o.getBoundingClientRect(),g=Eg(),v=Rg(),w=Rd(),T,A,E="top";f.top+c+l>w.height?(T=f.top+g-l,E="bottom",T<0&&(T=g)):T=c+f.top+g,f.left+d>w.width?A=Math.max(0,f.left+v+u-d):A=f.left+v,Tg(e)?e.style.insetInlineEnd=A+"px":e.style.insetInlineStart=A+"px",e.style.top=T+"px",e.style.transformOrigin=E,t&&(e.style.marginTop=E==="bottom"?`calc(${(n=(r=Vi(/-anchor-gutter$/))==null?void 0:r.value)!=null?n:"2px"} * -1)`:(a=(i=Vi(/-anchor-gutter$/))==null?void 0:i.value)!=null?a:"")}}function uR(e,o){e&&(typeof o=="string"?e.style.cssText=o:Object.entries(o||{}).forEach(([t,r])=>e.style[t]=r))}function fR(e,o){if(e instanceof HTMLElement){let t=e.offsetWidth;if(o){let r=getComputedStyle(e);t+=parseFloat(r.marginLeft)+parseFloat(r.marginRight)}return t}return 0}function pR(e,o,t=!0,r=void 0){var n;if(e){let i=e.offsetParent?{width:e.offsetWidth,height:e.offsetHeight}:Sd(e),a=o.offsetHeight,s=o.getBoundingClientRect(),l=Rd(),d,c,u=r??"top";if(!r&&s.top+a+i.height>l.height?(d=-1*i.height,u="bottom",s.top+d<0&&(d=-1*s.top)):d=a,i.width>l.width?c=s.left*-1:s.left+i.width>l.width?c=(s.left+i.width-l.width)*-1:c=0,e.style.top=d+"px",e.style.insetInlineStart=c+"px",e.style.transformOrigin=u,t){let f=(n=Vi(/-anchor-gutter$/))==null?void 0:n.value;e.style.marginTop=u==="bottom"?`calc(${f??"2px"} * -1)`:f??""}}}function Ed(e){if(e){let o=e.parentNode;return o&&o instanceof ShadowRoot&&o.host&&(o=o.host),o}return null}function gR(e){return!!(e!==null&&typeof e<"u"&&e.nodeName&&Ed(e))}function or(e){return typeof Element<"u"?e instanceof Element:e!==null&&typeof e=="object"&&e.nodeType===1&&typeof e.nodeName=="string"}function Td(e,o={}){if(or(e)){let t=(r,n)=>{var i,a;let s=(i=e?.$attrs)!=null&&i[r]?[(a=e?.$attrs)==null?void 0:a[r]]:[];return[n].flat().reduce((l,d)=>{if(d!=null){let c=typeof d;if(c==="string"||c==="number")l.push(d);else if(c==="object"){let u=Array.isArray(d)?t(r,d):Object.entries(d).map(([f,g])=>r==="style"&&(g||g===0)?`${f.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}:${g}`:g?f:void 0);l=u.length?l.concat(u.filter(f=>!!f)):l}}return l},s)};Object.entries(o).forEach(([r,n])=>{if(n!=null){let i=r.match(/^on(.+)/);i?e.addEventListener(i[1].toLowerCase(),n):r==="p-bind"||r==="pBind"?Td(e,n):(n=r==="class"?[...new Set(t("class",n))].join(" ").trim():r==="style"?t("style",n).join(";").trim():n,(e.$attrs=e.$attrs||{})&&(e.$attrs[r]=n),e.setAttribute(r,n))}})}}function hR(e,o={},...t){if(e){let r=document.createElement(e);return Td(r,o),r.append(...t),r}}function bR(e,o){if(e){e.style.opacity="0";let t=+new Date,r="0",n=function(){r=`${+e.style.opacity+(new Date().getTime()-t)/o}`,e.style.opacity=r,t=+new Date,+r<1&&("requestAnimationFrame"in window?requestAnimationFrame(n):setTimeout(n,16))};n()}}function Ag(e,o){return or(e)?Array.from(e.querySelectorAll(o)):[]}function Bg(e,o){return or(e)?e.matches(o)?e:e.querySelector(o):null}function mR(e,o){e&&document.activeElement!==e&&e.focus(o)}function vR(e,o){if(or(e)){let t=e.getAttribute(o);return isNaN(t)?t==="true"||t==="false"?t==="true":t:+t}}function Ad(e,o=""){let t=Ag(e,`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${o},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o}`),r=[];for(let n of t)getComputedStyle(n).display!="none"&&getComputedStyle(n).visibility!="hidden"&&r.push(n);return r}function yR(e,o){let t=Ad(e,o);return t.length>0?t[0]:null}function kR(e){if(e){let o=e.offsetHeight,t=getComputedStyle(e);return o-=parseFloat(t.paddingTop)+parseFloat(t.paddingBottom)+parseFloat(t.borderTopWidth)+parseFloat(t.borderBottomWidth),o}return 0}function wR(e,o){let t=Ad(e,o);return t.length>0?t[t.length-1]:null}function xR(e){if(e){let o=e.getBoundingClientRect();return{top:o.top+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0),left:o.left+(window.pageXOffset||Gi(document.documentElement)||Gi(document.body)||0)}}return{top:"auto",left:"auto"}}function _R(e,o){if(e){let t=e.offsetHeight;if(o){let r=getComputedStyle(e);t+=parseFloat(r.marginTop)+parseFloat(r.marginBottom)}return t}return 0}function Bd(e,o=[]){let t=Ed(e);return t===null?o:Bd(t,o.concat([t]))}function CR(e){let o=[];if(e){let t=Bd(e),r=/(auto|scroll)/,n=i=>{try{let a=window.getComputedStyle(i,null);return r.test(a.getPropertyValue("overflow"))||r.test(a.getPropertyValue("overflowX"))||r.test(a.getPropertyValue("overflowY"))}catch{return!1}};for(let i of t){let a=i.nodeType===1&&i.dataset.scrollselectors;if(a){let s=a.split(",");for(let l of s){let d=Bg(i,l);d&&n(d)&&o.push(d)}}i.nodeType!==9&&n(i)&&o.push(i)}}return o}function $R(e){if(e){let o=e.offsetWidth,t=getComputedStyle(e);return o-=parseFloat(t.paddingLeft)+parseFloat(t.paddingRight)+parseFloat(t.borderLeftWidth)+parseFloat(t.borderRightWidth),o}return 0}function SR(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}function RR(e,o=""){return or(e)?e.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${o}`):!1}function ER(e){return!!(e&&e.offsetParent!=null)}function TR(){return"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0}function AR(e,o="",t){or(e)&&t!==null&&t!==void 0&&e.setAttribute(o,t)}var Qr={};function BR(e="pui_id_"){return Object.hasOwn(Qr,e)||(Qr[e]=0),Qr[e]++,`${e}${Qr[e]}`}function zg(){let e=[],o=(a,s,l=999)=>{let d=n(a,s,l),c=d.value+(d.key===a?0:l)+1;return e.push({key:a,value:c}),c},t=a=>{e=e.filter(s=>s.value!==a)},r=(a,s)=>n(a).value,n=(a,s,l=0)=>[...e].reverse().find(d=>!0)||{key:a,value:l},i=a=>a&&parseInt(a.style.zIndex,10)||0;return{get:i,set:(a,s,l)=>{s&&(s.style.zIndex=String(o(a,!0,l)))},clear:a=>{a&&(t(i(a)),a.style.zIndex="")},getCurrent:a=>r(a)}}var zR=zg(),Og=Object.defineProperty,Ig=Object.defineProperties,Pg=Object.getOwnPropertyDescriptors,kn=Object.getOwnPropertySymbols,zd=Object.prototype.hasOwnProperty,Od=Object.prototype.propertyIsEnumerable,rl=(e,o,t)=>o in e?Og(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t,xo=(e,o)=>{for(var t in o||(o={}))zd.call(o,t)&&rl(e,t,o[t]);if(kn)for(var t of kn(o))Od.call(o,t)&&rl(e,t,o[t]);return e},wi=(e,o)=>Ig(e,Pg(o)),Mo=(e,o)=>{var t={};for(var r in e)zd.call(e,r)&&o.indexOf(r)<0&&(t[r]=e[r]);if(e!=null&&kn)for(var r of kn(e))o.indexOf(r)<0&&Od.call(e,r)&&(t[r]=e[r]);return t};function Dg(...e){return Cd(...e)}var Ng=_g(),vt=Ng,Br=/{([^}]*)}/g,Id=/(\d+\s+[\+\-\*\/]\s+\d+)/g,Pd=/var\([^)]+\)/g;function nl(e){return ut(e)?e.replace(/[A-Z]/g,(o,t)=>t===0?o:"."+o.toLowerCase()).toLowerCase():e}function Lg(e){return st(e)&&e.hasOwnProperty("$value")&&e.hasOwnProperty("$type")?e.$value:e}function Mg(e){return e.replaceAll(/ /g,"").replace(/[^\w]/g,"-")}function Ki(e="",o=""){return Mg(`${ut(e,!1)&&ut(o,!1)?`${e}-`:e}${o}`)}function Dd(e="",o=""){return`--${Ki(e,o)}`}function Fg(e=""){let o=(e.match(/{/g)||[]).length,t=(e.match(/}/g)||[]).length;return(o+t)%2!==0}function Nd(e,o="",t="",r=[],n){if(ut(e)){let i=e.trim();if(Fg(i))return;if(Ct(i,Br)){let a=i.replaceAll(Br,s=>{let l=s.replace(/{|}/g,"").split(".").filter(d=>!r.some(c=>Ct(d,c)));return`var(${Dd(t,$d(l.join("-")))}${Te(n)?`, ${n}`:""})`});return Ct(a.replace(Pd,"0"),Id)?`calc(${a})`:a}return i}else if(xg(e))return e}function jg(e,o,t){ut(o,!1)&&e.push(`${o}:${t};`)}function Wt(e,o){return e?`${e}{${o}}`:""}function Ld(e,o){if(e.indexOf("dt(")===-1)return e;function t(a,s){let l=[],d=0,c="",u=null,f=0;for(;d<=a.length;){let g=a[d];if((g==='"'||g==="'"||g==="`")&&a[d-1]!=="\\"&&(u=u===g?null:g),!u&&(g==="("&&f++,g===")"&&f--,(g===","||d===a.length)&&f===0)){let v=c.trim();v.startsWith("dt(")?l.push(Ld(v,s)):l.push(r(v)),c="",d++;continue}g!==void 0&&(c+=g),d++}return l}function r(a){let s=a[0];if((s==='"'||s==="'"||s==="`")&&a[a.length-1]===s)return a.slice(1,-1);let l=Number(a);return isNaN(l)?a:l}let n=[],i=[];for(let a=0;a<e.length;a++)if(e[a]==="d"&&e.slice(a,a+3)==="dt(")i.push(a),a+=2;else if(e[a]===")"&&i.length>0){let s=i.pop();i.length===0&&n.push([s,a])}if(!n.length)return e;for(let a=n.length-1;a>=0;a--){let[s,l]=n[a],d=e.slice(s+3,l),c=t(d,o),u=o(...c);e=e.slice(0,s)+u+e.slice(l+1)}return e}var OR=e=>{var o;let t=zr.getTheme(),r=Yi(t,e,void 0,"variable"),n=(o=r?.match(/--[\w-]+/g))==null?void 0:o[0],i=Yi(t,e,void 0,"value");return{name:n,variable:r,value:i}},wr=(...e)=>Yi(zr.getTheme(),...e),Yi=(e={},o,t,r)=>{if(o){let{variable:n,options:i}=zr.defaults||{},{prefix:a,transform:s}=e?.options||i||{},l=Ct(o,Br)?o:`{${o}}`;return r==="value"||Aa(r)&&s==="strict"?zr.getTokenValue(o):Nd(l,void 0,a,[n.excludedKeyRegex],t)}return""};function IR(e,...o){if(e instanceof Array){let t=e.reduce((r,n,i)=>{var a;return r+n+((a=tt(o[i],{dt:wr}))!=null?a:"")},"");return Ld(t,wr)}return tt(e,{dt:wr})}function Wg(e,o={}){let t=zr.defaults.variable,{prefix:r=t.prefix,selector:n=t.selector,excludedKeyRegex:i=t.excludedKeyRegex}=o,a=[],s=[],l=[{node:e,path:r}];for(;l.length;){let{node:c,path:u}=l.pop();for(let f in c){let g=c[f],v=Lg(g),w=Ct(f,i)?Ki(u):Ki(u,$d(f));if(st(v))l.push({node:v,path:w});else{let T=Dd(w),A=Nd(v,w,r,[i]);jg(s,T,A);let E=w;r&&E.startsWith(r+"-")&&(E=E.slice(r.length+1)),a.push(E.replace(/-/g,"."))}}}let d=s.join("");return{value:s,tokens:a,declarations:d,css:Wt(n,d)}}var wo={regex:{rules:{class:{pattern:/^\.([a-zA-Z][\w-]*)$/,resolve(e){return{type:"class",selector:e,matched:this.pattern.test(e.trim())}}},attr:{pattern:/^\[(.*)\]$/,resolve(e){return{type:"attr",selector:`:root${e},:host${e}`,matched:this.pattern.test(e.trim())}}},media:{pattern:/^@media (.*)$/,resolve(e){return{type:"media",selector:e,matched:this.pattern.test(e.trim())}}},system:{pattern:/^system$/,resolve(e){return{type:"system",selector:"@media (prefers-color-scheme: dark)",matched:this.pattern.test(e.trim())}}},custom:{resolve(e){return{type:"custom",selector:e,matched:!0}}}},resolve(e){let o=Object.keys(this.rules).filter(t=>t!=="custom").map(t=>this.rules[t]);return[e].flat().map(t=>{var r;return(r=o.map(n=>n.resolve(t)).find(n=>n.matched))!=null?r:this.rules.custom.resolve(t)})}},_toVariables(e,o){return Wg(e,{prefix:o?.prefix})},getCommon({name:e="",theme:o={},params:t,set:r,defaults:n}){var i,a,s,l,d,c,u;let{preset:f,options:g}=o,v,w,T,A,E,F,L;if(Te(f)&&g.transform!=="strict"){let{primitive:Z,semantic:G,extend:X}=f,W=G||{},{colorScheme:k}=W,S=Mo(W,["colorScheme"]),q=X||{},{colorScheme:z}=q,Q=Mo(q,["colorScheme"]),de=k||{},{dark:se}=de,te=Mo(de,["dark"]),ee=z||{},{dark:ne}=ee,me=Mo(ee,["dark"]),Ae=Te(Z)?this._toVariables({primitive:Z},g):{},Se=Te(S)?this._toVariables({semantic:S},g):{},xe=Te(te)?this._toVariables({light:te},g):{},go=Te(se)?this._toVariables({dark:se},g):{},lo=Te(Q)?this._toVariables({semantic:Q},g):{},ho=Te(me)?this._toVariables({light:me},g):{},Ne=Te(ne)?this._toVariables({dark:ne},g):{},[C,H]=[(i=Ae.declarations)!=null?i:"",Ae.tokens],[U,Y]=[(a=Se.declarations)!=null?a:"",Se.tokens||[]],[le,p]=[(s=xe.declarations)!=null?s:"",xe.tokens||[]],[h,m]=[(l=go.declarations)!=null?l:"",go.tokens||[]],[x,$]=[(d=lo.declarations)!=null?d:"",lo.tokens||[]],[_,j]=[(c=ho.declarations)!=null?c:"",ho.tokens||[]],[M,D]=[(u=Ne.declarations)!=null?u:"",Ne.tokens||[]];v=this.transformCSS(e,C,"light","variable",g,r,n),w=H;let R=this.transformCSS(e,`${U}${le}`,"light","variable",g,r,n),I=this.transformCSS(e,`${h}`,"dark","variable",g,r,n);T=`${R}${I}`,A=[...new Set([...Y,...p,...m])];let y=this.transformCSS(e,`${x}${_}color-scheme:light`,"light","variable",g,r,n),P=this.transformCSS(e,`${M}color-scheme:dark`,"dark","variable",g,r,n);E=`${y}${P}`,F=[...new Set([...$,...j,...D])],L=tt(f.css,{dt:wr})}return{primitive:{css:v,tokens:w},semantic:{css:T,tokens:A},global:{css:E,tokens:F},style:L}},getPreset({name:e="",preset:o={},options:t,params:r,set:n,defaults:i,selector:a}){var s,l,d;let c,u,f;if(Te(o)&&t.transform!=="strict"){let g=e.replace("-directive",""),v=o,{colorScheme:w,extend:T,css:A}=v,E=Mo(v,["colorScheme","extend","css"]),F=T||{},{colorScheme:L}=F,Z=Mo(F,["colorScheme"]),G=w||{},{dark:X}=G,W=Mo(G,["dark"]),k=L||{},{dark:S}=k,q=Mo(k,["dark"]),z=Te(E)?this._toVariables({[g]:xo(xo({},E),Z)},t):{},Q=Te(W)?this._toVariables({[g]:xo(xo({},W),q)},t):{},de=Te(X)?this._toVariables({[g]:xo(xo({},X),S)},t):{},[se,te]=[(s=z.declarations)!=null?s:"",z.tokens||[]],[ee,ne]=[(l=Q.declarations)!=null?l:"",Q.tokens||[]],[me,Ae]=[(d=de.declarations)!=null?d:"",de.tokens||[]],Se=this.transformCSS(g,`${se}${ee}`,"light","variable",t,n,i,a),xe=this.transformCSS(g,me,"dark","variable",t,n,i,a);c=`${Se}${xe}`,u=[...new Set([...te,...ne,...Ae])],f=tt(A,{dt:wr})}return{css:c,tokens:u,style:f}},getPresetC({name:e="",theme:o={},params:t,set:r,defaults:n}){var i;let{preset:a,options:s}=o,l=(i=a?.components)==null?void 0:i[e];return this.getPreset({name:e,preset:l,options:s,params:t,set:r,defaults:n})},getPresetD({name:e="",theme:o={},params:t,set:r,defaults:n}){var i,a;let s=e.replace("-directive",""),{preset:l,options:d}=o,c=((i=l?.components)==null?void 0:i[s])||((a=l?.directives)==null?void 0:a[s]);return this.getPreset({name:s,preset:c,options:d,params:t,set:r,defaults:n})},applyDarkColorScheme(e){return!(e.darkModeSelector==="none"||e.darkModeSelector===!1)},getColorSchemeOption(e,o){var t;return this.applyDarkColorScheme(e)?this.regex.resolve(e.darkModeSelector===!0?o.options.darkModeSelector:(t=e.darkModeSelector)!=null?t:o.options.darkModeSelector):[]},getLayerOrder(e,o={},t,r){let{cssLayer:n}=o;return n?`@layer ${tt(n.order||n.name||"primeui",t)}`:""},getCommonStyleSheet({name:e="",theme:o={},params:t,props:r={},set:n,defaults:i}){let a=this.getCommon({name:e,theme:o,params:t,set:n,defaults:i}),s=Object.entries(r).reduce((l,[d,c])=>l.push(`${d}="${c}"`)&&l,[]).join(" ");return Object.entries(a||{}).reduce((l,[d,c])=>{if(st(c)&&Object.hasOwn(c,"css")){let u=el(c.css),f=`${d}-variables`;l.push(`<style type="text/css" data-primevue-style-id="${f}" ${s}>${u}</style>`)}return l},[]).join("")},getStyleSheet({name:e="",theme:o={},params:t,props:r={},set:n,defaults:i}){var a;let s={name:e,theme:o,params:t,set:n,defaults:i},l=(a=e.includes("-directive")?this.getPresetD(s):this.getPresetC(s))==null?void 0:a.css,d=Object.entries(r).reduce((c,[u,f])=>c.push(`${u}="${f}"`)&&c,[]).join(" ");return l?`<style type="text/css" data-primevue-style-id="${e}-variables" ${d}>${el(l)}</style>`:""},createTokens(e={},o,t="",r="",n={}){let i=function(s,l={},d=[]){if(d.includes(this.path))return console.warn(`Circular reference detected at ${this.path}`),{colorScheme:s,path:this.path,paths:l,value:void 0};d.push(this.path),l.name=this.path,l.binding||(l.binding={});let c=this.value;if(typeof this.value=="string"&&Br.test(this.value)){let u=this.value.trim().replace(Br,f=>{var g;let v=f.slice(1,-1),w=this.tokens[v];if(!w)return console.warn(`Token not found for path: ${v}`),"__UNRESOLVED__";let T=w.computed(s,l,d);return Array.isArray(T)&&T.length===2?`light-dark(${T[0].value},${T[1].value})`:(g=T?.value)!=null?g:"__UNRESOLVED__"});c=Id.test(u.replace(Pd,"0"))?`calc(${u})`:u}return Aa(l.binding)&&delete l.binding,d.pop(),{colorScheme:s,path:this.path,paths:l,value:c.includes("__UNRESOLVED__")?void 0:c}},a=(s,l,d)=>{Object.entries(s).forEach(([c,u])=>{let f=Ct(c,o.variable.excludedKeyRegex)?l:l?`${l}.${nl(c)}`:nl(c),g=d?`${d}.${c}`:c;st(u)?a(u,f,g):(n[f]||(n[f]={paths:[],computed:(v,w={},T=[])=>{if(n[f].paths.length===1)return n[f].paths[0].computed(n[f].paths[0].scheme,w.binding,T);if(v&&v!=="none")for(let A=0;A<n[f].paths.length;A++){let E=n[f].paths[A];if(E.scheme===v)return E.computed(v,w.binding,T)}return n[f].paths.map(A=>A.computed(A.scheme,w[A.scheme],T))}}),n[f].paths.push({path:g,value:u,scheme:g.includes("colorScheme.light")?"light":g.includes("colorScheme.dark")?"dark":"none",computed:i,tokens:n}))})};return a(e,t,r),n},getTokenValue(e,o,t){var r;let n=(s=>s.split(".").filter(l=>!Ct(l.toLowerCase(),t.variable.excludedKeyRegex)).join("."))(o),i=o.includes("colorScheme.light")?"light":o.includes("colorScheme.dark")?"dark":void 0,a=[(r=e[n])==null?void 0:r.computed(i)].flat().filter(s=>s);return a.length===1?a[0].value:a.reduce((s={},l)=>{let d=l,{colorScheme:c}=d,u=Mo(d,["colorScheme"]);return s[c]=u,s},void 0)},getSelectorRule(e,o,t,r){return t==="class"||t==="attr"?Wt(Te(o)?`${e}${o},${e} ${o}`:e,r):Wt(e,Wt(o??":root,:host",r))},transformCSS(e,o,t,r,n={},i,a,s){if(Te(o)){let{cssLayer:l}=n;if(r!=="style"){let d=this.getColorSchemeOption(n,a);o=t==="dark"?d.reduce((c,{type:u,selector:f})=>(Te(f)&&(c+=f.includes("[CSS]")?f.replace("[CSS]",o):this.getSelectorRule(f,s,u,o)),c),""):Wt(s??":root,:host",o)}if(l){let d={name:"primeui"};st(l)&&(d.name=tt(l.name,{name:e,type:r})),Te(d.name)&&(o=Wt(`@layer ${d.name}`,o),i?.layerNames(d.name))}return o}return""}},zr={defaults:{variable:{prefix:"p",selector:":root,:host",excludedKeyRegex:/^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi},options:{prefix:"p",darkModeSelector:"system",cssLayer:!1}},_theme:void 0,_layerNames:new Set,_loadedStyleNames:new Set,_loadingStyles:new Set,_tokens:{},update(e={}){let{theme:o}=e;o&&(this._theme=wi(xo({},o),{options:xo(xo({},this.defaults.options),o.options)}),this._tokens=wo.createTokens(this.preset,this.defaults),this.clearLoadedStyleNames())},get theme(){return this._theme},get preset(){var e;return((e=this.theme)==null?void 0:e.preset)||{}},get options(){var e;return((e=this.theme)==null?void 0:e.options)||{}},get tokens(){return this._tokens},getTheme(){return this.theme},setTheme(e){this.update({theme:e}),vt.emit("theme:change",e)},getPreset(){return this.preset},setPreset(e){this._theme=wi(xo({},this.theme),{preset:e}),this._tokens=wo.createTokens(e,this.defaults),this.clearLoadedStyleNames(),vt.emit("preset:change",e),vt.emit("theme:change",this.theme)},getOptions(){return this.options},setOptions(e){this._theme=wi(xo({},this.theme),{options:e}),this.clearLoadedStyleNames(),vt.emit("options:change",e),vt.emit("theme:change",this.theme)},getLayerNames(){return[...this._layerNames]},setLayerNames(e){this._layerNames.add(e)},getLoadedStyleNames(){return this._loadedStyleNames},isStyleNameLoaded(e){return this._loadedStyleNames.has(e)},setLoadedStyleName(e){this._loadedStyleNames.add(e)},deleteLoadedStyleName(e){this._loadedStyleNames.delete(e)},clearLoadedStyleNames(){this._loadedStyleNames.clear()},getTokenValue(e){return wo.getTokenValue(this.tokens,e,this.defaults)},getCommon(e="",o){return wo.getCommon({name:e,theme:this.theme,params:o,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},getComponent(e="",o){let t={name:e,theme:this.theme,params:o,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return wo.getPresetC(t)},getDirective(e="",o){let t={name:e,theme:this.theme,params:o,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return wo.getPresetD(t)},getCustomPreset(e="",o,t,r){let n={name:e,preset:o,options:this.options,selector:t,params:r,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return wo.getPreset(n)},getLayerOrderCSS(e=""){return wo.getLayerOrder(e,this.options,{names:this.getLayerNames()},this.defaults)},transformCSS(e="",o,t="style",r){return wo.transformCSS(e,o,r,t,this.options,{layerNames:this.setLayerNames.bind(this)},this.defaults)},getCommonStyleSheet(e="",o,t={}){return wo.getCommonStyleSheet({name:e,theme:this.theme,params:o,props:t,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},getStyleSheet(e,o,t={}){return wo.getStyleSheet({name:e,theme:this.theme,params:o,props:t,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},onStyleMounted(e){this._loadingStyles.add(e)},onStyleUpdated(e){this._loadingStyles.add(e)},onStyleLoaded(e,{name:o}){this._loadingStyles.size&&(this._loadingStyles.delete(o),vt.emit(`theme:${o}:load`,e),!this._loadingStyles.size&&vt.emit("theme:load"))}},PR=`
    *,
    ::before,
    ::after {
        box-sizing: border-box;
    }

    .p-collapsible-enter-active {
        animation: p-animate-collapsible-expand 0.2s ease-out;
        overflow: hidden;
    }

    .p-collapsible-leave-active {
        animation: p-animate-collapsible-collapse 0.2s ease-out;
        overflow: hidden;
    }

    @keyframes p-animate-collapsible-expand {
        from {
            grid-template-rows: 0fr;
        }
        to {
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-collapsible-collapse {
        from {
            grid-template-rows: 1fr;
        }
        to {
            grid-template-rows: 0fr;
        }
    }

    .p-disabled,
    .p-disabled * {
        cursor: default;
        pointer-events: none;
        user-select: none;
    }

    .p-disabled,
    .p-component:disabled {
        opacity: dt('disabled.opacity');
    }

    .pi {
        font-size: dt('icon.size');
    }

    .p-icon {
        width: dt('icon.size');
        height: dt('icon.size');
    }

    .p-overlay-mask {
        background: var(--px-mask-background, dt('mask.background'));
        color: dt('mask.color');
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .p-overlay-mask-enter-active {
        animation: p-animate-overlay-mask-enter dt('mask.transition.duration') forwards;
    }

    .p-overlay-mask-leave-active {
        animation: p-animate-overlay-mask-leave dt('mask.transition.duration') forwards;
    }

    @keyframes p-animate-overlay-mask-enter {
        from {
            background: transparent;
        }
        to {
            background: var(--px-mask-background, dt('mask.background'));
        }
    }
    @keyframes p-animate-overlay-mask-leave {
        from {
            background: var(--px-mask-background, dt('mask.background'));
        }
        to {
            background: transparent;
        }
    }

    .p-anchored-overlay-enter-active {
        animation: p-animate-anchored-overlay-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .p-anchored-overlay-leave-active {
        animation: p-animate-anchored-overlay-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes p-animate-anchored-overlay-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-anchored-overlay-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;let Md;const Fn=e=>Md=e,Fd=Symbol();function Xi(e){return e&&typeof e=="object"&&Object.prototype.toString.call(e)==="[object Object]"&&typeof e.toJSON!="function"}var xr;(function(e){e.direct="direct",e.patchObject="patch object",e.patchFunction="patch function"})(xr||(xr={}));function DR(){const e=sc(!0),o=e.run(()=>ka({}));let t=[],r=[];const n=ya({install(i){Fn(n),n._a=i,i.provide(Fd,n),i.config.globalProperties.$pinia=n,r.forEach(a=>t.push(a)),r=[]},use(i){return this._a?t.push(i):r.push(i),this},_p:t,_a:null,_e:e,_s:new Map,state:o});return n}const jd=()=>{};function il(e,o,t,r=jd){e.add(o);const n=()=>{e.delete(o)&&r()};return!t&&ua()&&lc(n),n}function Ft(e,...o){e.forEach(t=>{t(...o)})}const Ug=e=>e(),al=Symbol(),xi=Symbol();function qi(e,o){e instanceof Map&&o instanceof Map?o.forEach((t,r)=>e.set(r,t)):e instanceof Set&&o instanceof Set&&o.forEach(e.add,e);for(const t in o){if(!o.hasOwnProperty(t))continue;const r=o[t],n=e[t];Xi(n)&&Xi(r)&&e.hasOwnProperty(t)&&!$e(r)&&!nt(r)?e[t]=qi(n,r):e[t]=r}return e}const Zg=Symbol();function Hg(e){return!Xi(e)||!Object.prototype.hasOwnProperty.call(e,Zg)}const{assign:Jo}=Object;function Vg(e){return!!($e(e)&&e.effect)}function Gg(e,o,t,r){const{state:n,actions:i,getters:a}=o,s=t.state.value[e];let l;function d(){s||(t.state.value[e]=n?n():{});const c=xf(t.state.value[e]);return Jo(c,i,Object.keys(a||{}).reduce((u,f)=>(u[f]=ya(We(()=>{Fn(t);const g=t._s.get(e);return a[f].call(g,g)})),u),{}))}return l=Wd(e,d,o,t,r,!0),l}function Wd(e,o,t={},r,n,i){let a;const s=Jo({actions:{}},t),l={deep:!0};let d,c,u=new Set,f=new Set,g;const v=r.state.value[e];!i&&!v&&(r.state.value[e]={}),ka({});let w;function T(W){let k;d=c=!1,typeof W=="function"?(W(r.state.value[e]),k={type:xr.patchFunction,storeId:e,events:g}):(qi(r.state.value[e],W),k={type:xr.patchObject,payload:W,storeId:e,events:g});const S=w=Symbol();zn().then(()=>{w===S&&(d=!0)}),c=!0,Ft(u,k,r.state.value[e])}const A=i?function(){const{state:k}=t,S=k?k():{};this.$patch(q=>{Jo(q,S)})}:jd;function E(){a.stop(),u.clear(),f.clear(),r._s.delete(e)}const F=(W,k="")=>{if(al in W)return W[xi]=k,W;const S=function(){Fn(r);const q=Array.from(arguments),z=new Set,Q=new Set;function de(ee){z.add(ee)}function se(ee){Q.add(ee)}Ft(f,{args:q,name:S[xi],store:Z,after:de,onError:se});let te;try{te=W.apply(this&&this.$id===e?this:Z,q)}catch(ee){throw Ft(Q,ee),ee}return te instanceof Promise?te.then(ee=>(Ft(z,ee),ee)).catch(ee=>(Ft(Q,ee),Promise.reject(ee))):(Ft(z,te),te)};return S[al]=!0,S[xi]=k,S},L={_p:r,$id:e,$onAction:il.bind(null,f),$patch:T,$reset:A,$subscribe(W,k={}){const S=il(u,W,k.detached,()=>q()),q=a.run(()=>at(()=>r.state.value[e],z=>{(k.flush==="sync"?c:d)&&W({storeId:e,type:xr.direct,events:g},z)},Jo({},l,k)));return S},$dispose:E},Z=$t(L);r._s.set(e,Z);const X=(r._a&&r._a.runWithContext||Ug)(()=>r._e.run(()=>(a=sc()).run(()=>o({action:F}))));for(const W in X){const k=X[W];if($e(k)&&!Vg(k)||nt(k))i||(v&&Hg(k)&&($e(k)?k.value=v[W]:qi(k,v[W])),r.state.value[e][W]=k);else if(typeof k=="function"){const S=F(k,W);X[W]=S,s.actions[W]=k}}return Jo(Z,X),Jo(ue(Z),X),Object.defineProperty(Z,"$state",{get:()=>r.state.value[e],set:W=>{T(k=>{Jo(k,W)})}}),r._p.forEach(W=>{Jo(Z,a.run(()=>W({store:Z,app:r._a,pinia:r,options:s})))}),v&&i&&t.hydrate&&t.hydrate(Z.$state,v),d=!0,c=!0,Z}function NR(e,o,t){let r;const n=typeof o=="function";r=n?t:o;function i(a,s){const l=ep();return a=a||(l?Co(Fd,null):null),a&&Fn(a),a=Md,a._s.has(e)||(n?Wd(e,o,r,a):Gg(e,r,a)),a._s.get(e)}return i.$id=e,i}const Kg=(e,o)=>o.some(t=>e instanceof t);let sl,ll;function Yg(){return sl||(sl=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Xg(){return ll||(ll=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ud=new WeakMap,Ji=new WeakMap,Zd=new WeakMap,_i=new WeakMap,Ba=new WeakMap;function qg(e){const o=new Promise((t,r)=>{const n=()=>{e.removeEventListener("success",i),e.removeEventListener("error",a)},i=()=>{t(lt(e.result)),n()},a=()=>{r(e.error),n()};e.addEventListener("success",i),e.addEventListener("error",a)});return o.then(t=>{t instanceof IDBCursor&&Ud.set(t,e)}).catch(()=>{}),Ba.set(o,e),o}function Jg(e){if(Ji.has(e))return;const o=new Promise((t,r)=>{const n=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",a),e.removeEventListener("abort",a)},i=()=>{t(),n()},a=()=>{r(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",i),e.addEventListener("error",a),e.addEventListener("abort",a)});Ji.set(e,o)}let Qi={get(e,o,t){if(e instanceof IDBTransaction){if(o==="done")return Ji.get(e);if(o==="objectStoreNames")return e.objectStoreNames||Zd.get(e);if(o==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return lt(e[o])},set(e,o,t){return e[o]=t,!0},has(e,o){return e instanceof IDBTransaction&&(o==="done"||o==="store")?!0:o in e}};function Qg(e){Qi=e(Qi)}function eh(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(o,...t){const r=e.call(Ci(this),o,...t);return Zd.set(r,o.sort?o.sort():[o]),lt(r)}:Xg().includes(e)?function(...o){return e.apply(Ci(this),o),lt(Ud.get(this))}:function(...o){return lt(e.apply(Ci(this),o))}}function oh(e){return typeof e=="function"?eh(e):(e instanceof IDBTransaction&&Jg(e),Kg(e,Yg())?new Proxy(e,Qi):e)}function lt(e){if(e instanceof IDBRequest)return qg(e);if(_i.has(e))return _i.get(e);const o=oh(e);return o!==e&&(_i.set(e,o),Ba.set(o,e)),o}const Ci=e=>Ba.get(e);function LR(e,o,{blocked:t,upgrade:r,blocking:n,terminated:i}={}){const a=indexedDB.open(e,o),s=lt(a);return r&&a.addEventListener("upgradeneeded",l=>{r(lt(a.result),l.oldVersion,l.newVersion,lt(a.transaction),l)}),t&&a.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),s.then(l=>{i&&l.addEventListener("close",()=>i()),n&&l.addEventListener("versionchange",d=>n(d.oldVersion,d.newVersion,d))}).catch(()=>{}),s}const th=["get","getKey","getAll","getAllKeys","count"],rh=["put","add","delete","clear"],$i=new Map;function cl(e,o){if(!(e instanceof IDBDatabase&&!(o in e)&&typeof o=="string"))return;if($i.get(o))return $i.get(o);const t=o.replace(/FromIndex$/,""),r=o!==t,n=rh.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(n||th.includes(t)))return;const i=async function(a,...s){const l=this.transaction(a,n?"readwrite":"readonly");let d=l.store;return r&&(d=d.index(s.shift())),(await Promise.all([d[t](...s),n&&l.done]))[0]};return $i.set(o,i),i}Qg(e=>({...e,get:(o,t,r)=>cl(o,t)||e.get(o,t,r),has:(o,t)=>!!cl(o,t)||e.has(o,t)}));function nh(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Si,dl;function ul(){if(dl)return Si;dl=1;const{entries:e,setPrototypeOf:o,isFrozen:t,getPrototypeOf:r,getOwnPropertyDescriptor:n}=Object;let{freeze:i,seal:a,create:s}=Object,{apply:l,construct:d}=typeof Reflect<"u"&&Reflect;i||(i=function(y){return y}),a||(a=function(y){return y}),l||(l=function(y,P){for(var N=arguments.length,K=new Array(N>2?N-2:0),ie=2;ie<N;ie++)K[ie-2]=arguments[ie];return y.apply(P,K)}),d||(d=function(y){for(var P=arguments.length,N=new Array(P>1?P-1:0),K=1;K<P;K++)N[K-1]=arguments[K];return new y(...N)});const c=W(Array.prototype.forEach),u=W(Array.prototype.lastIndexOf),f=W(Array.prototype.pop),g=W(Array.prototype.push),v=W(Array.prototype.splice),w=W(String.prototype.toLowerCase),T=W(String.prototype.toString),A=W(String.prototype.match),E=W(String.prototype.replace),F=W(String.prototype.indexOf),L=W(String.prototype.trim),Z=W(Object.prototype.hasOwnProperty),G=W(RegExp.prototype.test),X=k(TypeError);function W(I){return function(y){y instanceof RegExp&&(y.lastIndex=0);for(var P=arguments.length,N=new Array(P>1?P-1:0),K=1;K<P;K++)N[K-1]=arguments[K];return l(I,y,N)}}function k(I){return function(){for(var y=arguments.length,P=new Array(y),N=0;N<y;N++)P[N]=arguments[N];return d(I,P)}}function S(I,y){let P=arguments.length>2&&arguments[2]!==void 0?arguments[2]:w;o&&o(I,null);let N=y.length;for(;N--;){let K=y[N];if(typeof K=="string"){const ie=P(K);ie!==K&&(t(y)||(y[N]=ie),K=ie)}I[K]=!0}return I}function q(I){for(let y=0;y<I.length;y++)Z(I,y)||(I[y]=null);return I}function z(I){const y=s(null);for(const[P,N]of e(I))Z(I,P)&&(Array.isArray(N)?y[P]=q(N):N&&typeof N=="object"&&N.constructor===Object?y[P]=z(N):y[P]=N);return y}function Q(I,y){for(;I!==null;){const N=n(I,y);if(N){if(N.get)return W(N.get);if(typeof N.value=="function")return W(N.value)}I=r(I)}function P(){return null}return P}const de=i(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),se=i(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),te=i(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),ee=i(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),ne=i(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),me=i(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Ae=i(["#text"]),Se=i(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),xe=i(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),go=i(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),lo=i(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),ho=a(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Ne=a(/<%[\w\W]*|[\w\W]*%>/gm),C=a(/\$\{[\w\W]*/gm),H=a(/^data-[\-\w.\u00B7-\uFFFF]+$/),U=a(/^aria-[\-\w]+$/),Y=a(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),le=a(/^(?:\w+script|data):/i),p=a(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),h=a(/^html$/i),m=a(/^[a-z][.\w]*(-[.\w]+)+$/i);var x=Object.freeze({__proto__:null,ARIA_ATTR:U,ATTR_WHITESPACE:p,CUSTOM_ELEMENT:m,DATA_ATTR:H,DOCTYPE_NAME:h,ERB_EXPR:Ne,IS_ALLOWED_URI:Y,IS_SCRIPT_OR_DATA:le,MUSTACHE_EXPR:ho,TMPLIT_EXPR:C});const $={element:1,text:3,progressingInstruction:7,comment:8,document:9},_=function(){return typeof window>"u"?null:window},j=function(y,P){if(typeof y!="object"||typeof y.createPolicy!="function")return null;let N=null;const K="data-tt-policy-suffix";P&&P.hasAttribute(K)&&(N=P.getAttribute(K));const ie="dompurify"+(N?"#"+N:"");try{return y.createPolicy(ie,{createHTML(ce){return ce},createScriptURL(ce){return ce}})}catch{return console.warn("TrustedTypes policy "+ie+" could not be created."),null}},M=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function D(){let I=arguments.length>0&&arguments[0]!==void 0?arguments[0]:_();const y=J=>D(J);if(y.version="3.3.1",y.removed=[],!I||!I.document||I.document.nodeType!==$.document||!I.Element)return y.isSupported=!1,y;let{document:P}=I;const N=P,K=N.currentScript,{DocumentFragment:ie,HTMLTemplateElement:ce,Node:Ie,Element:Le,NodeFilter:Ze,NamedNodeMap:bo=I.NamedNodeMap||I.MozNamedAttrMap,HTMLFormElement:ft,DOMParser:Nr,trustedTypes:Pe}=I,He=Le.prototype,Lr=Q(He,"cloneNode"),Mr=Q(He,"remove"),_u=Q(He,"nextSibling"),Cu=Q(He,"childNodes"),Fr=Q(He,"parentNode");if(typeof ce=="function"){const J=P.createElement("template");J.content&&J.content.ownerDocument&&(P=J.content.ownerDocument)}let qe,rr="";const{implementation:Vn,createNodeIterator:$u,createDocumentFragment:Su,getElementsByTagName:Ru}=P,{importNode:Eu}=N;let Je=M();y.isSupported=typeof e=="function"&&typeof Fr=="function"&&Vn&&Vn.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:Gn,ERB_EXPR:Kn,TMPLIT_EXPR:Yn,DATA_ATTR:Tu,ARIA_ATTR:Au,IS_SCRIPT_OR_DATA:Bu,ATTR_WHITESPACE:Ua,CUSTOM_ELEMENT:zu}=x;let{IS_ALLOWED_URI:Za}=x,De=null;const Ha=S({},[...de,...se,...te,...ne,...Ae]);let Me=null;const Va=S({},[...Se,...xe,...go,...lo]);let Re=Object.seal(s(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),nr=null,Xn=null;const zt=Object.seal(s(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Ga=!0,qn=!0,Ka=!1,Ya=!0,Ot=!1,jr=!0,pt=!1,Jn=!1,Qn=!1,It=!1,Wr=!1,Ur=!1,Xa=!0,qa=!1;const Ou="user-content-";let ei=!0,ir=!1,Pt={},Ro=null;const oi=S({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Ja=null;const Qa=S({},["audio","video","img","source","image","track"]);let ti=null;const es=S({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Zr="http://www.w3.org/1998/Math/MathML",Hr="http://www.w3.org/2000/svg",Po="http://www.w3.org/1999/xhtml";let Dt=Po,ri=!1,ni=null;const Iu=S({},[Zr,Hr,Po],T);let Vr=S({},["mi","mo","mn","ms","mtext"]),Gr=S({},["annotation-xml"]);const Pu=S({},["title","style","font","a","script"]);let ar=null;const Du=["application/xhtml+xml","text/html"],Nu="text/html";let Be=null,Nt=null;const Lu=P.createElement("form"),os=function(b){return b instanceof RegExp||b instanceof Function},ii=function(){let b=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Nt&&Nt===b)){if((!b||typeof b!="object")&&(b={}),b=z(b),ar=Du.indexOf(b.PARSER_MEDIA_TYPE)===-1?Nu:b.PARSER_MEDIA_TYPE,Be=ar==="application/xhtml+xml"?T:w,De=Z(b,"ALLOWED_TAGS")?S({},b.ALLOWED_TAGS,Be):Ha,Me=Z(b,"ALLOWED_ATTR")?S({},b.ALLOWED_ATTR,Be):Va,ni=Z(b,"ALLOWED_NAMESPACES")?S({},b.ALLOWED_NAMESPACES,T):Iu,ti=Z(b,"ADD_URI_SAFE_ATTR")?S(z(es),b.ADD_URI_SAFE_ATTR,Be):es,Ja=Z(b,"ADD_DATA_URI_TAGS")?S(z(Qa),b.ADD_DATA_URI_TAGS,Be):Qa,Ro=Z(b,"FORBID_CONTENTS")?S({},b.FORBID_CONTENTS,Be):oi,nr=Z(b,"FORBID_TAGS")?S({},b.FORBID_TAGS,Be):z({}),Xn=Z(b,"FORBID_ATTR")?S({},b.FORBID_ATTR,Be):z({}),Pt=Z(b,"USE_PROFILES")?b.USE_PROFILES:!1,Ga=b.ALLOW_ARIA_ATTR!==!1,qn=b.ALLOW_DATA_ATTR!==!1,Ka=b.ALLOW_UNKNOWN_PROTOCOLS||!1,Ya=b.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ot=b.SAFE_FOR_TEMPLATES||!1,jr=b.SAFE_FOR_XML!==!1,pt=b.WHOLE_DOCUMENT||!1,It=b.RETURN_DOM||!1,Wr=b.RETURN_DOM_FRAGMENT||!1,Ur=b.RETURN_TRUSTED_TYPE||!1,Qn=b.FORCE_BODY||!1,Xa=b.SANITIZE_DOM!==!1,qa=b.SANITIZE_NAMED_PROPS||!1,ei=b.KEEP_CONTENT!==!1,ir=b.IN_PLACE||!1,Za=b.ALLOWED_URI_REGEXP||Y,Dt=b.NAMESPACE||Po,Vr=b.MATHML_TEXT_INTEGRATION_POINTS||Vr,Gr=b.HTML_INTEGRATION_POINTS||Gr,Re=b.CUSTOM_ELEMENT_HANDLING||{},b.CUSTOM_ELEMENT_HANDLING&&os(b.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(Re.tagNameCheck=b.CUSTOM_ELEMENT_HANDLING.tagNameCheck),b.CUSTOM_ELEMENT_HANDLING&&os(b.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(Re.attributeNameCheck=b.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),b.CUSTOM_ELEMENT_HANDLING&&typeof b.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(Re.allowCustomizedBuiltInElements=b.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Ot&&(qn=!1),Wr&&(It=!0),Pt&&(De=S({},Ae),Me=[],Pt.html===!0&&(S(De,de),S(Me,Se)),Pt.svg===!0&&(S(De,se),S(Me,xe),S(Me,lo)),Pt.svgFilters===!0&&(S(De,te),S(Me,xe),S(Me,lo)),Pt.mathMl===!0&&(S(De,ne),S(Me,go),S(Me,lo))),b.ADD_TAGS&&(typeof b.ADD_TAGS=="function"?zt.tagCheck=b.ADD_TAGS:(De===Ha&&(De=z(De)),S(De,b.ADD_TAGS,Be))),b.ADD_ATTR&&(typeof b.ADD_ATTR=="function"?zt.attributeCheck=b.ADD_ATTR:(Me===Va&&(Me=z(Me)),S(Me,b.ADD_ATTR,Be))),b.ADD_URI_SAFE_ATTR&&S(ti,b.ADD_URI_SAFE_ATTR,Be),b.FORBID_CONTENTS&&(Ro===oi&&(Ro=z(Ro)),S(Ro,b.FORBID_CONTENTS,Be)),b.ADD_FORBID_CONTENTS&&(Ro===oi&&(Ro=z(Ro)),S(Ro,b.ADD_FORBID_CONTENTS,Be)),ei&&(De["#text"]=!0),pt&&S(De,["html","head","body"]),De.table&&(S(De,["tbody"]),delete nr.tbody),b.TRUSTED_TYPES_POLICY){if(typeof b.TRUSTED_TYPES_POLICY.createHTML!="function")throw X('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof b.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw X('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');qe=b.TRUSTED_TYPES_POLICY,rr=qe.createHTML("")}else qe===void 0&&(qe=j(Pe,K)),qe!==null&&typeof rr=="string"&&(rr=qe.createHTML(""));i&&i(b),Nt=b}},ts=S({},[...se,...te,...ee]),rs=S({},[...ne,...me]),Mu=function(b){let O=Fr(b);(!O||!O.tagName)&&(O={namespaceURI:Dt,tagName:"template"});const V=w(b.tagName),ve=w(O.tagName);return ni[b.namespaceURI]?b.namespaceURI===Hr?O.namespaceURI===Po?V==="svg":O.namespaceURI===Zr?V==="svg"&&(ve==="annotation-xml"||Vr[ve]):!!ts[V]:b.namespaceURI===Zr?O.namespaceURI===Po?V==="math":O.namespaceURI===Hr?V==="math"&&Gr[ve]:!!rs[V]:b.namespaceURI===Po?O.namespaceURI===Hr&&!Gr[ve]||O.namespaceURI===Zr&&!Vr[ve]?!1:!rs[V]&&(Pu[V]||!ts[V]):!!(ar==="application/xhtml+xml"&&ni[b.namespaceURI]):!1},Eo=function(b){g(y.removed,{element:b});try{Fr(b).removeChild(b)}catch{Mr(b)}},gt=function(b,O){try{g(y.removed,{attribute:O.getAttributeNode(b),from:O})}catch{g(y.removed,{attribute:null,from:O})}if(O.removeAttribute(b),b==="is")if(It||Wr)try{Eo(O)}catch{}else try{O.setAttribute(b,"")}catch{}},ns=function(b){let O=null,V=null;if(Qn)b="<remove></remove>"+b;else{const Ee=A(b,/^[\r\n\t ]+/);V=Ee&&Ee[0]}ar==="application/xhtml+xml"&&Dt===Po&&(b='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+b+"</body></html>");const ve=qe?qe.createHTML(b):b;if(Dt===Po)try{O=new Nr().parseFromString(ve,ar)}catch{}if(!O||!O.documentElement){O=Vn.createDocument(Dt,"template",null);try{O.documentElement.innerHTML=ri?rr:ve}catch{}}const Ve=O.body||O.documentElement;return b&&V&&Ve.insertBefore(P.createTextNode(V),Ve.childNodes[0]||null),Dt===Po?Ru.call(O,pt?"html":"body")[0]:pt?O.documentElement:Ve},is=function(b){return $u.call(b.ownerDocument||b,b,Ze.SHOW_ELEMENT|Ze.SHOW_COMMENT|Ze.SHOW_TEXT|Ze.SHOW_PROCESSING_INSTRUCTION|Ze.SHOW_CDATA_SECTION,null)},ai=function(b){return b instanceof ft&&(typeof b.nodeName!="string"||typeof b.textContent!="string"||typeof b.removeChild!="function"||!(b.attributes instanceof bo)||typeof b.removeAttribute!="function"||typeof b.setAttribute!="function"||typeof b.namespaceURI!="string"||typeof b.insertBefore!="function"||typeof b.hasChildNodes!="function")},as=function(b){return typeof Ie=="function"&&b instanceof Ie};function Do(J,b,O){c(J,V=>{V.call(y,b,O,Nt)})}const ss=function(b){let O=null;if(Do(Je.beforeSanitizeElements,b,null),ai(b))return Eo(b),!0;const V=Be(b.nodeName);if(Do(Je.uponSanitizeElement,b,{tagName:V,allowedTags:De}),jr&&b.hasChildNodes()&&!as(b.firstElementChild)&&G(/<[/\w!]/g,b.innerHTML)&&G(/<[/\w!]/g,b.textContent)||b.nodeType===$.progressingInstruction||jr&&b.nodeType===$.comment&&G(/<[/\w]/g,b.data))return Eo(b),!0;if(!(zt.tagCheck instanceof Function&&zt.tagCheck(V))&&(!De[V]||nr[V])){if(!nr[V]&&cs(V)&&(Re.tagNameCheck instanceof RegExp&&G(Re.tagNameCheck,V)||Re.tagNameCheck instanceof Function&&Re.tagNameCheck(V)))return!1;if(ei&&!Ro[V]){const ve=Fr(b)||b.parentNode,Ve=Cu(b)||b.childNodes;if(Ve&&ve){const Ee=Ve.length;for(let co=Ee-1;co>=0;--co){const No=Lr(Ve[co],!0);No.__removalCount=(b.__removalCount||0)+1,ve.insertBefore(No,_u(b))}}}return Eo(b),!0}return b instanceof Le&&!Mu(b)||(V==="noscript"||V==="noembed"||V==="noframes")&&G(/<\/no(script|embed|frames)/i,b.innerHTML)?(Eo(b),!0):(Ot&&b.nodeType===$.text&&(O=b.textContent,c([Gn,Kn,Yn],ve=>{O=E(O,ve," ")}),b.textContent!==O&&(g(y.removed,{element:b.cloneNode()}),b.textContent=O)),Do(Je.afterSanitizeElements,b,null),!1)},ls=function(b,O,V){if(Xa&&(O==="id"||O==="name")&&(V in P||V in Lu))return!1;if(!(qn&&!Xn[O]&&G(Tu,O))){if(!(Ga&&G(Au,O))){if(!(zt.attributeCheck instanceof Function&&zt.attributeCheck(O,b))){if(!Me[O]||Xn[O]){if(!(cs(b)&&(Re.tagNameCheck instanceof RegExp&&G(Re.tagNameCheck,b)||Re.tagNameCheck instanceof Function&&Re.tagNameCheck(b))&&(Re.attributeNameCheck instanceof RegExp&&G(Re.attributeNameCheck,O)||Re.attributeNameCheck instanceof Function&&Re.attributeNameCheck(O,b))||O==="is"&&Re.allowCustomizedBuiltInElements&&(Re.tagNameCheck instanceof RegExp&&G(Re.tagNameCheck,V)||Re.tagNameCheck instanceof Function&&Re.tagNameCheck(V))))return!1}else if(!ti[O]){if(!G(Za,E(V,Ua,""))){if(!((O==="src"||O==="xlink:href"||O==="href")&&b!=="script"&&F(V,"data:")===0&&Ja[b])){if(!(Ka&&!G(Bu,E(V,Ua,"")))){if(V)return!1}}}}}}}return!0},cs=function(b){return b!=="annotation-xml"&&A(b,zu)},ds=function(b){Do(Je.beforeSanitizeAttributes,b,null);const{attributes:O}=b;if(!O||ai(b))return;const V={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:Me,forceKeepAttr:void 0};let ve=O.length;for(;ve--;){const Ve=O[ve],{name:Ee,namespaceURI:co,value:No}=Ve,Lt=Be(Ee),si=No;let Fe=Ee==="value"?si:L(si);if(V.attrName=Lt,V.attrValue=Fe,V.keepAttr=!0,V.forceKeepAttr=void 0,Do(Je.uponSanitizeAttribute,b,V),Fe=V.attrValue,qa&&(Lt==="id"||Lt==="name")&&(gt(Ee,b),Fe=Ou+Fe),jr&&G(/((--!?|])>)|<\/(style|title|textarea)/i,Fe)){gt(Ee,b);continue}if(Lt==="attributename"&&A(Fe,"href")){gt(Ee,b);continue}if(V.forceKeepAttr)continue;if(!V.keepAttr){gt(Ee,b);continue}if(!Ya&&G(/\/>/i,Fe)){gt(Ee,b);continue}Ot&&c([Gn,Kn,Yn],fs=>{Fe=E(Fe,fs," ")});const us=Be(b.nodeName);if(!ls(us,Lt,Fe)){gt(Ee,b);continue}if(qe&&typeof Pe=="object"&&typeof Pe.getAttributeType=="function"&&!co)switch(Pe.getAttributeType(us,Lt)){case"TrustedHTML":{Fe=qe.createHTML(Fe);break}case"TrustedScriptURL":{Fe=qe.createScriptURL(Fe);break}}if(Fe!==si)try{co?b.setAttributeNS(co,Ee,Fe):b.setAttribute(Ee,Fe),ai(b)?Eo(b):f(y.removed)}catch{gt(Ee,b)}}Do(Je.afterSanitizeAttributes,b,null)},Fu=function J(b){let O=null;const V=is(b);for(Do(Je.beforeSanitizeShadowDOM,b,null);O=V.nextNode();)Do(Je.uponSanitizeShadowNode,O,null),ss(O),ds(O),O.content instanceof ie&&J(O.content);Do(Je.afterSanitizeShadowDOM,b,null)};return y.sanitize=function(J){let b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},O=null,V=null,ve=null,Ve=null;if(ri=!J,ri&&(J="<!-->"),typeof J!="string"&&!as(J))if(typeof J.toString=="function"){if(J=J.toString(),typeof J!="string")throw X("dirty is not a string, aborting")}else throw X("toString is not a function");if(!y.isSupported)return J;if(Jn||ii(b),y.removed=[],typeof J=="string"&&(ir=!1),ir){if(J.nodeName){const No=Be(J.nodeName);if(!De[No]||nr[No])throw X("root node is forbidden and cannot be sanitized in-place")}}else if(J instanceof Ie)O=ns("<!---->"),V=O.ownerDocument.importNode(J,!0),V.nodeType===$.element&&V.nodeName==="BODY"||V.nodeName==="HTML"?O=V:O.appendChild(V);else{if(!It&&!Ot&&!pt&&J.indexOf("<")===-1)return qe&&Ur?qe.createHTML(J):J;if(O=ns(J),!O)return It?null:Ur?rr:""}O&&Qn&&Eo(O.firstChild);const Ee=is(ir?J:O);for(;ve=Ee.nextNode();)ss(ve),ds(ve),ve.content instanceof ie&&Fu(ve.content);if(ir)return J;if(It){if(Wr)for(Ve=Su.call(O.ownerDocument);O.firstChild;)Ve.appendChild(O.firstChild);else Ve=O;return(Me.shadowroot||Me.shadowrootmode)&&(Ve=Eu.call(N,Ve,!0)),Ve}let co=pt?O.outerHTML:O.innerHTML;return pt&&De["!doctype"]&&O.ownerDocument&&O.ownerDocument.doctype&&O.ownerDocument.doctype.name&&G(h,O.ownerDocument.doctype.name)&&(co="<!DOCTYPE "+O.ownerDocument.doctype.name+`>
`+co),Ot&&c([Gn,Kn,Yn],No=>{co=E(co,No," ")}),qe&&Ur?qe.createHTML(co):co},y.setConfig=function(){let J=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};ii(J),Jn=!0},y.clearConfig=function(){Nt=null,Jn=!1},y.isValidAttribute=function(J,b,O){Nt||ii({});const V=Be(J),ve=Be(b);return ls(V,ve,O)},y.addHook=function(J,b){typeof b=="function"&&g(Je[J],b)},y.removeHook=function(J,b){if(b!==void 0){const O=u(Je[J],b);return O===-1?void 0:v(Je[J],O,1)[0]}return f(Je[J])},y.removeHooks=function(J){Je[J]=[]},y.removeAllHooks=function(){Je=M()},y}var R=D();return Si=R,Si}var Ri,fl;function ih(){return fl||(fl=1,Ri=self.DOMPurify||(self.DOMPurify=ul().default||ul())),Ri}var ah=ih();const MR=nh(ah);const Ut=typeof document<"u";function Hd(e){return typeof e=="object"||"displayName"in e||"props"in e||"__vccOpts"in e}function sh(e){return e.__esModule||e[Symbol.toStringTag]==="Module"||e.default&&Hd(e.default)}const fe=Object.assign;function Ei(e,o){const t={};for(const r in o){const n=o[r];t[r]=So(n)?n.map(e):e(n)}return t}const _r=()=>{},So=Array.isArray;function pl(e,o){const t={};for(const r in e)t[r]=r in o?o[r]:e[r];return t}const Vd=/#/g,lh=/&/g,ch=/\//g,dh=/=/g,uh=/\?/g,Gd=/\+/g,fh=/%5B/g,ph=/%5D/g,Kd=/%5E/g,gh=/%60/g,Yd=/%7B/g,hh=/%7C/g,Xd=/%7D/g,bh=/%20/g;function za(e){return e==null?"":encodeURI(""+e).replace(hh,"|").replace(fh,"[").replace(ph,"]")}function mh(e){return za(e).replace(Yd,"{").replace(Xd,"}").replace(Kd,"^")}function ea(e){return za(e).replace(Gd,"%2B").replace(bh,"+").replace(Vd,"%23").replace(lh,"%26").replace(gh,"`").replace(Yd,"{").replace(Xd,"}").replace(Kd,"^")}function vh(e){return ea(e).replace(dh,"%3D")}function yh(e){return za(e).replace(Vd,"%23").replace(uh,"%3F")}function kh(e){return yh(e).replace(ch,"%2F")}function Or(e){if(e==null)return null;try{return decodeURIComponent(""+e)}catch{}return""+e}const wh=/\/$/,xh=e=>e.replace(wh,"");function Ti(e,o,t="/"){let r,n={},i="",a="";const s=o.indexOf("#");let l=o.indexOf("?");return l=s>=0&&l>s?-1:l,l>=0&&(r=o.slice(0,l),i=o.slice(l,s>0?s:o.length),n=e(i.slice(1))),s>=0&&(r=r||o.slice(0,s),a=o.slice(s,o.length)),r=Sh(r??o,t),{fullPath:r+i+a,path:r,query:n,hash:Or(a)}}function _h(e,o){const t=o.query?e(o.query):"";return o.path+(t&&"?")+t+(o.hash||"")}function gl(e,o){return!o||!e.toLowerCase().startsWith(o.toLowerCase())?e:e.slice(o.length)||"/"}function Ch(e,o,t){const r=o.matched.length-1,n=t.matched.length-1;return r>-1&&r===n&&qt(o.matched[r],t.matched[n])&&qd(o.params,t.params)&&e(o.query)===e(t.query)&&o.hash===t.hash}function qt(e,o){return(e.aliasOf||e)===(o.aliasOf||o)}function qd(e,o){if(Object.keys(e).length!==Object.keys(o).length)return!1;for(const t in e)if(!$h(e[t],o[t]))return!1;return!0}function $h(e,o){return So(e)?hl(e,o):So(o)?hl(o,e):e===o}function hl(e,o){return So(o)?e.length===o.length&&e.every((t,r)=>t===o[r]):e.length===1&&e[0]===o}function Sh(e,o){if(e.startsWith("/"))return e;if(!e)return o;const t=o.split("/"),r=e.split("/"),n=r[r.length-1];(n===".."||n===".")&&r.push("");let i=t.length-1,a,s;for(a=0;a<r.length;a++)if(s=r[a],s!==".")if(s==="..")i>1&&i--;else break;return t.slice(0,i).join("/")+"/"+r.slice(a).join("/")}const Xo={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};let oa=(function(e){return e.pop="pop",e.push="push",e})({}),Ai=(function(e){return e.back="back",e.forward="forward",e.unknown="",e})({});function Rh(e){if(!e)if(Ut){const o=document.querySelector("base");e=o&&o.getAttribute("href")||"/",e=e.replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return e[0]!=="/"&&e[0]!=="#"&&(e="/"+e),xh(e)}const Eh=/^[^#]+#/;function Th(e,o){return e.replace(Eh,"#")+o}function Ah(e,o){const t=document.documentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return{behavior:o.behavior,left:r.left-t.left-(o.left||0),top:r.top-t.top-(o.top||0)}}const jn=()=>({left:window.scrollX,top:window.scrollY});function Bh(e){let o;if("el"in e){const t=e.el,r=typeof t=="string"&&t.startsWith("#"),n=typeof t=="string"?r?document.getElementById(t.slice(1)):document.querySelector(t):t;if(!n)return;o=Ah(n,e)}else o=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(o):window.scrollTo(o.left!=null?o.left:window.scrollX,o.top!=null?o.top:window.scrollY)}function bl(e,o){return(history.state?history.state.position-o:-1)+e}const ta=new Map;function zh(e,o){ta.set(e,o)}function Oh(e){const o=ta.get(e);return ta.delete(e),o}function Ih(e){return typeof e=="string"||e&&typeof e=="object"}function Jd(e){return typeof e=="string"||typeof e=="symbol"}let Ce=(function(e){return e[e.MATCHER_NOT_FOUND=1]="MATCHER_NOT_FOUND",e[e.NAVIGATION_GUARD_REDIRECT=2]="NAVIGATION_GUARD_REDIRECT",e[e.NAVIGATION_ABORTED=4]="NAVIGATION_ABORTED",e[e.NAVIGATION_CANCELLED=8]="NAVIGATION_CANCELLED",e[e.NAVIGATION_DUPLICATED=16]="NAVIGATION_DUPLICATED",e})({});const Qd=Symbol("");Ce.MATCHER_NOT_FOUND+"",Ce.NAVIGATION_GUARD_REDIRECT+"",Ce.NAVIGATION_ABORTED+"",Ce.NAVIGATION_CANCELLED+"",Ce.NAVIGATION_DUPLICATED+"";function Jt(e,o){return fe(new Error,{type:e,[Qd]:!0},o)}function Fo(e,o){return e instanceof Error&&Qd in e&&(o==null||!!(e.type&o))}const Ph=["params","query","hash"];function Dh(e){if(typeof e=="string")return e;if(e.path!=null)return e.path;const o={};for(const t of Ph)t in e&&(o[t]=e[t]);return JSON.stringify(o,null,2)}function Nh(e){const o={};if(e===""||e==="?")return o;const t=(e[0]==="?"?e.slice(1):e).split("&");for(let r=0;r<t.length;++r){const n=t[r].replace(Gd," "),i=n.indexOf("="),a=Or(i<0?n:n.slice(0,i)),s=i<0?null:Or(n.slice(i+1));if(a in o){let l=o[a];So(l)||(l=o[a]=[l]),l.push(s)}else o[a]=s}return o}function ml(e){let o="";for(let t in e){const r=e[t];if(t=vh(t),r==null){r!==void 0&&(o+=(o.length?"&":"")+t);continue}(So(r)?r.map(n=>n&&ea(n)):[r&&ea(r)]).forEach(n=>{n!==void 0&&(o+=(o.length?"&":"")+t,n!=null&&(o+="="+n))})}return o}function Lh(e){const o={};for(const t in e){const r=e[t];r!==void 0&&(o[t]=So(r)?r.map(n=>n==null?null:""+n):r==null?r:""+r)}return o}const Mh=Symbol(""),vl=Symbol(""),Wn=Symbol(""),eu=Symbol(""),ra=Symbol("");function dr(){let e=[];function o(r){return e.push(r),()=>{const n=e.indexOf(r);n>-1&&e.splice(n,1)}}function t(){e=[]}return{add:o,list:()=>e.slice(),reset:t}}function ot(e,o,t,r,n,i=a=>a()){const a=r&&(r.enterCallbacks[n]=r.enterCallbacks[n]||[]);return()=>new Promise((s,l)=>{const d=f=>{f===!1?l(Jt(Ce.NAVIGATION_ABORTED,{from:t,to:o})):f instanceof Error?l(f):Ih(f)?l(Jt(Ce.NAVIGATION_GUARD_REDIRECT,{from:o,to:f})):(a&&r.enterCallbacks[n]===a&&typeof f=="function"&&a.push(f),s())},c=i(()=>e.call(r&&r.instances[n],o,t,d));let u=Promise.resolve(c);e.length<3&&(u=u.then(d)),u.catch(f=>l(f))})}function Bi(e,o,t,r,n=i=>i()){const i=[];for(const a of e)for(const s in a.components){let l=a.components[s];if(!(o!=="beforeRouteEnter"&&!a.instances[s]))if(Hd(l)){const d=(l.__vccOpts||l)[o];d&&i.push(ot(d,t,r,a,s,n))}else{let d=l();i.push(()=>d.then(c=>{if(!c)throw new Error(`Couldn't resolve component "${s}" at "${a.path}"`);const u=sh(c)?c.default:c;a.mods[s]=c,a.components[s]=u;const f=(u.__vccOpts||u)[o];return f&&ot(f,t,r,a,s,n)()}))}}return i}function Fh(e,o){const t=[],r=[],n=[],i=Math.max(o.matched.length,e.matched.length);for(let a=0;a<i;a++){const s=o.matched[a];s&&(e.matched.find(d=>qt(d,s))?r.push(s):t.push(s));const l=e.matched[a];l&&(o.matched.find(d=>qt(d,l))||n.push(l))}return[t,r,n]}let jh=()=>location.protocol+"//"+location.host;function ou(e,o){const{pathname:t,search:r,hash:n}=o,i=e.indexOf("#");if(i>-1){let a=n.includes(e.slice(i))?e.slice(i).length:1,s=n.slice(a);return s[0]!=="/"&&(s="/"+s),gl(s,"")}return gl(t,e)+r+n}function Wh(e,o,t,r){let n=[],i=[],a=null;const s=({state:f})=>{const g=ou(e,location),v=t.value,w=o.value;let T=0;if(f){if(t.value=g,o.value=f,a&&a===v){a=null;return}T=w?f.position-w.position:0}else r(g);n.forEach(A=>{A(t.value,v,{delta:T,type:oa.pop,direction:T?T>0?Ai.forward:Ai.back:Ai.unknown})})};function l(){a=t.value}function d(f){n.push(f);const g=()=>{const v=n.indexOf(f);v>-1&&n.splice(v,1)};return i.push(g),g}function c(){if(document.visibilityState==="hidden"){const{history:f}=window;if(!f.state)return;f.replaceState(fe({},f.state,{scroll:jn()}),"")}}function u(){for(const f of i)f();i=[],window.removeEventListener("popstate",s),window.removeEventListener("pagehide",c),document.removeEventListener("visibilitychange",c)}return window.addEventListener("popstate",s),window.addEventListener("pagehide",c),document.addEventListener("visibilitychange",c),{pauseListeners:l,listen:d,destroy:u}}function yl(e,o,t,r=!1,n=!1){return{back:e,current:o,forward:t,replaced:r,position:window.history.length,scroll:n?jn():null}}function Uh(e){const{history:o,location:t}=window,r={value:ou(e,t)},n={value:o.state};n.value||i(r.value,{back:null,current:r.value,forward:null,position:o.length-1,replaced:!0,scroll:null},!0);function i(l,d,c){const u=e.indexOf("#"),f=u>-1?(t.host&&document.querySelector("base")?e:e.slice(u))+l:jh()+e+l;try{o[c?"replaceState":"pushState"](d,"",f),n.value=d}catch(g){console.error(g),t[c?"replace":"assign"](f)}}function a(l,d){i(l,fe({},o.state,yl(n.value.back,l,n.value.forward,!0),d,{position:n.value.position}),!0),r.value=l}function s(l,d){const c=fe({},n.value,o.state,{forward:l,scroll:jn()});i(c.current,c,!0),i(l,fe({},yl(r.value,l,null),{position:c.position+1},d),!1),r.value=l}return{location:r,state:n,push:s,replace:a}}function FR(e){e=Rh(e);const o=Uh(e),t=Wh(e,o.state,o.location,o.replace);function r(i,a=!0){a||t.pauseListeners(),history.go(i)}const n=fe({location:"",base:e,go:r,createHref:Th.bind(null,e)},o,t);return Object.defineProperty(n,"location",{enumerable:!0,get:()=>o.location.value}),Object.defineProperty(n,"state",{enumerable:!0,get:()=>o.state.value}),n}let wt=(function(e){return e[e.Static=0]="Static",e[e.Param=1]="Param",e[e.Group=2]="Group",e})({});var ze=(function(e){return e[e.Static=0]="Static",e[e.Param=1]="Param",e[e.ParamRegExp=2]="ParamRegExp",e[e.ParamRegExpEnd=3]="ParamRegExpEnd",e[e.EscapeNext=4]="EscapeNext",e})(ze||{});const Zh={type:wt.Static,value:""},Hh=/[a-zA-Z0-9_]/;function Vh(e){if(!e)return[[]];if(e==="/")return[[Zh]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function o(g){throw new Error(`ERR (${t})/"${d}": ${g}`)}let t=ze.Static,r=t;const n=[];let i;function a(){i&&n.push(i),i=[]}let s=0,l,d="",c="";function u(){d&&(t===ze.Static?i.push({type:wt.Static,value:d}):t===ze.Param||t===ze.ParamRegExp||t===ze.ParamRegExpEnd?(i.length>1&&(l==="*"||l==="+")&&o(`A repeatable param (${d}) must be alone in its segment. eg: '/:ids+.`),i.push({type:wt.Param,value:d,regexp:c,repeatable:l==="*"||l==="+",optional:l==="*"||l==="?"})):o("Invalid state to consume buffer"),d="")}function f(){d+=l}for(;s<e.length;){if(l=e[s++],l==="\\"&&t!==ze.ParamRegExp){r=t,t=ze.EscapeNext;continue}switch(t){case ze.Static:l==="/"?(d&&u(),a()):l===":"?(u(),t=ze.Param):f();break;case ze.EscapeNext:f(),t=r;break;case ze.Param:l==="("?t=ze.ParamRegExp:Hh.test(l)?f():(u(),t=ze.Static,l!=="*"&&l!=="?"&&l!=="+"&&s--);break;case ze.ParamRegExp:l===")"?c[c.length-1]=="\\"?c=c.slice(0,-1)+l:t=ze.ParamRegExpEnd:c+=l;break;case ze.ParamRegExpEnd:u(),t=ze.Static,l!=="*"&&l!=="?"&&l!=="+"&&s--,c="";break;default:o("Unknown state");break}}return t===ze.ParamRegExp&&o(`Unfinished custom RegExp for param "${d}"`),u(),a(),n}const kl="[^/]+?",Gh={sensitive:!1,strict:!1,start:!0,end:!0};var to=(function(e){return e[e._multiplier=10]="_multiplier",e[e.Root=90]="Root",e[e.Segment=40]="Segment",e[e.SubSegment=30]="SubSegment",e[e.Static=40]="Static",e[e.Dynamic=20]="Dynamic",e[e.BonusCustomRegExp=10]="BonusCustomRegExp",e[e.BonusWildcard=-50]="BonusWildcard",e[e.BonusRepeatable=-20]="BonusRepeatable",e[e.BonusOptional=-8]="BonusOptional",e[e.BonusStrict=.7000000000000001]="BonusStrict",e[e.BonusCaseSensitive=.25]="BonusCaseSensitive",e})(to||{});const Kh=/[.+*?^${}()[\]/\\]/g;function Yh(e,o){const t=fe({},Gh,o),r=[];let n=t.start?"^":"";const i=[];for(const d of e){const c=d.length?[]:[to.Root];t.strict&&!d.length&&(n+="/");for(let u=0;u<d.length;u++){const f=d[u];let g=to.Segment+(t.sensitive?to.BonusCaseSensitive:0);if(f.type===wt.Static)u||(n+="/"),n+=f.value.replace(Kh,"\\$&"),g+=to.Static;else if(f.type===wt.Param){const{value:v,repeatable:w,optional:T,regexp:A}=f;i.push({name:v,repeatable:w,optional:T});const E=A||kl;if(E!==kl){g+=to.BonusCustomRegExp;try{`${E}`}catch(L){throw new Error(`Invalid custom RegExp for param "${v}" (${E}): `+L.message)}}let F=w?`((?:${E})(?:/(?:${E}))*)`:`(${E})`;u||(F=T&&d.length<2?`(?:/${F})`:"/"+F),T&&(F+="?"),n+=F,g+=to.Dynamic,T&&(g+=to.BonusOptional),w&&(g+=to.BonusRepeatable),E===".*"&&(g+=to.BonusWildcard)}c.push(g)}r.push(c)}if(t.strict&&t.end){const d=r.length-1;r[d][r[d].length-1]+=to.BonusStrict}t.strict||(n+="/?"),t.end?n+="$":t.strict&&!n.endsWith("/")&&(n+="(?:/|$)");const a=new RegExp(n,t.sensitive?"":"i");function s(d){const c=d.match(a),u={};if(!c)return null;for(let f=1;f<c.length;f++){const g=c[f]||"",v=i[f-1];u[v.name]=g&&v.repeatable?g.split("/"):g}return u}function l(d){let c="",u=!1;for(const f of e){(!u||!c.endsWith("/"))&&(c+="/"),u=!1;for(const g of f)if(g.type===wt.Static)c+=g.value;else if(g.type===wt.Param){const{value:v,repeatable:w,optional:T}=g,A=v in d?d[v]:"";if(So(A)&&!w)throw new Error(`Provided param "${v}" is an array but it is not repeatable (* or + modifiers)`);const E=So(A)?A.join("/"):A;if(!E)if(T)f.length<2&&(c.endsWith("/")?c=c.slice(0,-1):u=!0);else throw new Error(`Missing required param "${v}"`);c+=E}}return c||"/"}return{re:a,score:r,keys:i,parse:s,stringify:l}}function Xh(e,o){let t=0;for(;t<e.length&&t<o.length;){const r=o[t]-e[t];if(r)return r;t++}return e.length<o.length?e.length===1&&e[0]===to.Static+to.Segment?-1:1:e.length>o.length?o.length===1&&o[0]===to.Static+to.Segment?1:-1:0}function tu(e,o){let t=0;const r=e.score,n=o.score;for(;t<r.length&&t<n.length;){const i=Xh(r[t],n[t]);if(i)return i;t++}if(Math.abs(n.length-r.length)===1){if(wl(r))return 1;if(wl(n))return-1}return n.length-r.length}function wl(e){const o=e[e.length-1];return e.length>0&&o[o.length-1]<0}const qh={strict:!1,end:!0,sensitive:!1};function Jh(e,o,t){const r=Yh(Vh(e.path),t),n=fe(r,{record:e,parent:o,children:[],alias:[]});return o&&!n.record.aliasOf==!o.record.aliasOf&&o.children.push(n),n}function Qh(e,o){const t=[],r=new Map;o=pl(qh,o);function n(u){return r.get(u)}function i(u,f,g){const v=!g,w=_l(u);w.aliasOf=g&&g.record;const T=pl(o,u),A=[w];if("alias"in u){const L=typeof u.alias=="string"?[u.alias]:u.alias;for(const Z of L)A.push(_l(fe({},w,{components:g?g.record.components:w.components,path:Z,aliasOf:g?g.record:w})))}let E,F;for(const L of A){const{path:Z}=L;if(f&&Z[0]!=="/"){const G=f.record.path,X=G[G.length-1]==="/"?"":"/";L.path=f.record.path+(Z&&X+Z)}if(E=Jh(L,f,T),g?g.alias.push(E):(F=F||E,F!==E&&F.alias.push(E),v&&u.name&&!Cl(E)&&a(u.name)),ru(E)&&l(E),w.children){const G=w.children;for(let X=0;X<G.length;X++)i(G[X],E,g&&g.children[X])}g=g||E}return F?()=>{a(F)}:_r}function a(u){if(Jd(u)){const f=r.get(u);f&&(r.delete(u),t.splice(t.indexOf(f),1),f.children.forEach(a),f.alias.forEach(a))}else{const f=t.indexOf(u);f>-1&&(t.splice(f,1),u.record.name&&r.delete(u.record.name),u.children.forEach(a),u.alias.forEach(a))}}function s(){return t}function l(u){const f=tb(u,t);t.splice(f,0,u),u.record.name&&!Cl(u)&&r.set(u.record.name,u)}function d(u,f){let g,v={},w,T;if("name"in u&&u.name){if(g=r.get(u.name),!g)throw Jt(Ce.MATCHER_NOT_FOUND,{location:u});T=g.record.name,v=fe(xl(f.params,g.keys.filter(F=>!F.optional).concat(g.parent?g.parent.keys.filter(F=>F.optional):[]).map(F=>F.name)),u.params&&xl(u.params,g.keys.map(F=>F.name))),w=g.stringify(v)}else if(u.path!=null)w=u.path,g=t.find(F=>F.re.test(w)),g&&(v=g.parse(w),T=g.record.name);else{if(g=f.name?r.get(f.name):t.find(F=>F.re.test(f.path)),!g)throw Jt(Ce.MATCHER_NOT_FOUND,{location:u,currentLocation:f});T=g.record.name,v=fe({},f.params,u.params),w=g.stringify(v)}const A=[];let E=g;for(;E;)A.unshift(E.record),E=E.parent;return{name:T,path:w,params:v,matched:A,meta:ob(A)}}e.forEach(u=>i(u));function c(){t.length=0,r.clear()}return{addRoute:i,resolve:d,removeRoute:a,clearRoutes:c,getRoutes:s,getRecordMatcher:n}}function xl(e,o){const t={};for(const r of o)r in e&&(t[r]=e[r]);return t}function _l(e){const o={path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:e.aliasOf,beforeEnter:e.beforeEnter,props:eb(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||null:e.component&&{default:e.component}};return Object.defineProperty(o,"mods",{value:{}}),o}function eb(e){const o={},t=e.props||!1;if("component"in e)o.default=t;else for(const r in e.components)o[r]=typeof t=="object"?t[r]:t;return o}function Cl(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function ob(e){return e.reduce((o,t)=>fe(o,t.meta),{})}function tb(e,o){let t=0,r=o.length;for(;t!==r;){const i=t+r>>1;tu(e,o[i])<0?r=i:t=i+1}const n=rb(e);return n&&(r=o.lastIndexOf(n,r-1)),r}function rb(e){let o=e;for(;o=o.parent;)if(ru(o)&&tu(e,o)===0)return o}function ru({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function $l(e){const o=Co(Wn),t=Co(eu),r=We(()=>{const l=it(e.to);return o.resolve(l)}),n=We(()=>{const{matched:l}=r.value,{length:d}=l,c=l[d-1],u=t.matched;if(!c||!u.length)return-1;const f=u.findIndex(qt.bind(null,c));if(f>-1)return f;const g=Sl(l[d-2]);return d>1&&Sl(c)===g&&u[u.length-1].path!==g?u.findIndex(qt.bind(null,l[d-2])):f}),i=We(()=>n.value>-1&&lb(t.params,r.value.params)),a=We(()=>n.value>-1&&n.value===t.matched.length-1&&qd(t.params,r.value.params));function s(l={}){if(sb(l)){const d=o[it(e.replace)?"replace":"push"](it(e.to)).catch(_r);return e.viewTransition&&typeof document<"u"&&"startViewTransition"in document&&document.startViewTransition(()=>d),d}return Promise.resolve()}return{route:r,href:We(()=>r.value.href),isActive:i,isExactActive:a,navigate:s}}function nb(e){return e.length===1?e[0]:e}const ib=Fc({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"},viewTransition:Boolean},useLink:$l,setup(e,{slots:o}){const t=$t($l(e)),{options:r}=Co(Wn),n=We(()=>({[Rl(e.activeClass,r.linkActiveClass,"router-link-active")]:t.isActive,[Rl(e.exactActiveClass,r.linkExactActiveClass,"router-link-exact-active")]:t.isExactActive}));return()=>{const i=o.default&&nb(o.default(t));return e.custom?i:Ta("a",{"aria-current":t.isExactActive?e.ariaCurrentValue:null,href:t.href,onClick:t.navigate,class:n.value},i)}}}),ab=ib;function sb(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&!(e.button!==void 0&&e.button!==0)){if(e.currentTarget&&e.currentTarget.getAttribute){const o=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(o))return}return e.preventDefault&&e.preventDefault(),!0}}function lb(e,o){for(const t in o){const r=o[t],n=e[t];if(typeof r=="string"){if(r!==n)return!1}else if(!So(n)||n.length!==r.length||r.some((i,a)=>i!==n[a]))return!1}return!0}function Sl(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const Rl=(e,o,t)=>e??o??t,cb=Fc({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(e,{attrs:o,slots:t}){const r=Co(ra),n=We(()=>e.route||r.value),i=Co(vl,0),a=We(()=>{let d=it(i);const{matched:c}=n.value;let u;for(;(u=c[d])&&!u.components;)d++;return d}),s=We(()=>n.value.matched[a.value]);nn(vl,We(()=>a.value+1)),nn(Mh,s),nn(ra,n);const l=ka();return at(()=>[l.value,s.value,e.name],([d,c,u],[f,g,v])=>{c&&(c.instances[u]=d,g&&g!==c&&d&&d===f&&(c.leaveGuards.size||(c.leaveGuards=g.leaveGuards),c.updateGuards.size||(c.updateGuards=g.updateGuards))),d&&c&&(!g||!qt(c,g)||!f)&&(c.enterCallbacks[u]||[]).forEach(w=>w(d))},{flush:"post"}),()=>{const d=n.value,c=e.name,u=s.value,f=u&&u.components[c];if(!f)return El(t.default,{Component:f,route:d});const g=u.props[c],v=g?g===!0?d.params:typeof g=="function"?g(d):g:null,T=Ta(f,fe({},v,o,{onVnodeUnmounted:A=>{A.component.isUnmounted&&(u.instances[c]=null)},ref:l}));return El(t.default,{Component:T,route:d})||T}}});function El(e,o){if(!e)return null;const t=e(o);return t.length===1?t[0]:t}const db=cb;function jR(e){const o=Qh(e.routes,e),t=e.parseQuery||Nh,r=e.stringifyQuery||ml,n=e.history,i=dr(),a=dr(),s=dr(),l=br(Xo);let d=Xo;Ut&&e.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const c=Ei.bind(null,C=>""+C),u=Ei.bind(null,kh),f=Ei.bind(null,Or);function g(C,H){let U,Y;return Jd(C)?(U=o.getRecordMatcher(C),Y=H):Y=C,o.addRoute(Y,U)}function v(C){const H=o.getRecordMatcher(C);H&&o.removeRoute(H)}function w(){return o.getRoutes().map(C=>C.record)}function T(C){return!!o.getRecordMatcher(C)}function A(C,H){if(H=fe({},H||l.value),typeof C=="string"){const m=Ti(t,C,H.path),x=o.resolve({path:m.path},H),$=n.createHref(m.fullPath);return fe(m,x,{params:f(x.params),hash:Or(m.hash),redirectedFrom:void 0,href:$})}let U;if(C.path!=null)U=fe({},C,{path:Ti(t,C.path,H.path).path});else{const m=fe({},C.params);for(const x in m)m[x]==null&&delete m[x];U=fe({},C,{params:u(m)}),H.params=u(H.params)}const Y=o.resolve(U,H),le=C.hash||"";Y.params=c(f(Y.params));const p=_h(r,fe({},C,{hash:mh(le),path:Y.path})),h=n.createHref(p);return fe({fullPath:p,hash:le,query:r===ml?Lh(C.query):C.query||{}},Y,{redirectedFrom:void 0,href:h})}function E(C){return typeof C=="string"?Ti(t,C,l.value.path):fe({},C)}function F(C,H){if(d!==C)return Jt(Ce.NAVIGATION_CANCELLED,{from:H,to:C})}function L(C){return X(C)}function Z(C){return L(fe(E(C),{replace:!0}))}function G(C,H){const U=C.matched[C.matched.length-1];if(U&&U.redirect){const{redirect:Y}=U;let le=typeof Y=="function"?Y(C,H):Y;return typeof le=="string"&&(le=le.includes("?")||le.includes("#")?le=E(le):{path:le},le.params={}),fe({query:C.query,hash:C.hash,params:le.path!=null?{}:C.params},le)}}function X(C,H){const U=d=A(C),Y=l.value,le=C.state,p=C.force,h=C.replace===!0,m=G(U,Y);if(m)return X(fe(E(m),{state:typeof m=="object"?fe({},le,m.state):le,force:p,replace:h}),H||U);const x=U;x.redirectedFrom=H;let $;return!p&&Ch(r,Y,U)&&($=Jt(Ce.NAVIGATION_DUPLICATED,{to:x,from:Y}),Se(Y,Y,!0,!1)),($?Promise.resolve($):S(x,Y)).catch(_=>Fo(_)?Fo(_,Ce.NAVIGATION_GUARD_REDIRECT)?_:Ae(_):ne(_,x,Y)).then(_=>{if(_){if(Fo(_,Ce.NAVIGATION_GUARD_REDIRECT))return X(fe({replace:h},E(_.to),{state:typeof _.to=="object"?fe({},le,_.to.state):le,force:p}),H||x)}else _=z(x,Y,!0,h,le);return q(x,Y,_),_})}function W(C,H){const U=F(C,H);return U?Promise.reject(U):Promise.resolve()}function k(C){const H=lo.values().next().value;return H&&typeof H.runWithContext=="function"?H.runWithContext(C):C()}function S(C,H){let U;const[Y,le,p]=Fh(C,H);U=Bi(Y.reverse(),"beforeRouteLeave",C,H);for(const m of Y)m.leaveGuards.forEach(x=>{U.push(ot(x,C,H))});const h=W.bind(null,C,H);return U.push(h),Ne(U).then(()=>{U=[];for(const m of i.list())U.push(ot(m,C,H));return U.push(h),Ne(U)}).then(()=>{U=Bi(le,"beforeRouteUpdate",C,H);for(const m of le)m.updateGuards.forEach(x=>{U.push(ot(x,C,H))});return U.push(h),Ne(U)}).then(()=>{U=[];for(const m of p)if(m.beforeEnter)if(So(m.beforeEnter))for(const x of m.beforeEnter)U.push(ot(x,C,H));else U.push(ot(m.beforeEnter,C,H));return U.push(h),Ne(U)}).then(()=>(C.matched.forEach(m=>m.enterCallbacks={}),U=Bi(p,"beforeRouteEnter",C,H,k),U.push(h),Ne(U))).then(()=>{U=[];for(const m of a.list())U.push(ot(m,C,H));return U.push(h),Ne(U)}).catch(m=>Fo(m,Ce.NAVIGATION_CANCELLED)?m:Promise.reject(m))}function q(C,H,U){s.list().forEach(Y=>k(()=>Y(C,H,U)))}function z(C,H,U,Y,le){const p=F(C,H);if(p)return p;const h=H===Xo,m=Ut?history.state:{};U&&(Y||h?n.replace(C.fullPath,fe({scroll:h&&m&&m.scroll},le)):n.push(C.fullPath,le)),l.value=C,Se(C,H,U,h),Ae()}let Q;function de(){Q||(Q=n.listen((C,H,U)=>{if(!ho.listening)return;const Y=A(C),le=G(Y,ho.currentRoute.value);if(le){X(fe(le,{replace:!0,force:!0}),Y).catch(_r);return}d=Y;const p=l.value;Ut&&zh(bl(p.fullPath,U.delta),jn()),S(Y,p).catch(h=>Fo(h,Ce.NAVIGATION_ABORTED|Ce.NAVIGATION_CANCELLED)?h:Fo(h,Ce.NAVIGATION_GUARD_REDIRECT)?(X(fe(E(h.to),{force:!0}),Y).then(m=>{Fo(m,Ce.NAVIGATION_ABORTED|Ce.NAVIGATION_DUPLICATED)&&!U.delta&&U.type===oa.pop&&n.go(-1,!1)}).catch(_r),Promise.reject()):(U.delta&&n.go(-U.delta,!1),ne(h,Y,p))).then(h=>{h=h||z(Y,p,!1),h&&(U.delta&&!Fo(h,Ce.NAVIGATION_CANCELLED)?n.go(-U.delta,!1):U.type===oa.pop&&Fo(h,Ce.NAVIGATION_ABORTED|Ce.NAVIGATION_DUPLICATED)&&n.go(-1,!1)),q(Y,p,h)}).catch(_r)}))}let se=dr(),te=dr(),ee;function ne(C,H,U){Ae(C);const Y=te.list();return Y.length?Y.forEach(le=>le(C,H,U)):console.error(C),Promise.reject(C)}function me(){return ee&&l.value!==Xo?Promise.resolve():new Promise((C,H)=>{se.add([C,H])})}function Ae(C){return ee||(ee=!C,de(),se.list().forEach(([H,U])=>C?U(C):H()),se.reset()),C}function Se(C,H,U,Y){const{scrollBehavior:le}=e;if(!Ut||!le)return Promise.resolve();const p=!U&&Oh(bl(C.fullPath,0))||(Y||!U)&&history.state&&history.state.scroll||null;return zn().then(()=>le(C,H,p)).then(h=>h&&Bh(h)).catch(h=>ne(h,C,H))}const xe=C=>n.go(C);let go;const lo=new Set,ho={currentRoute:l,listening:!0,addRoute:g,removeRoute:v,clearRoutes:o.clearRoutes,hasRoute:T,getRoutes:w,resolve:A,options:e,push:L,replace:Z,go:xe,back:()=>xe(-1),forward:()=>xe(1),beforeEach:i.add,beforeResolve:a.add,afterEach:s.add,onError:te.add,isReady:me,install(C){C.component("RouterLink",ab),C.component("RouterView",db),C.config.globalProperties.$router=ho,Object.defineProperty(C.config.globalProperties,"$route",{enumerable:!0,get:()=>it(l)}),Ut&&!go&&l.value===Xo&&(go=!0,L(n.location).catch(Y=>{}));const H={};for(const Y in Xo)Object.defineProperty(H,Y,{get:()=>l.value[Y],enumerable:!0});C.provide(Wn,ho),C.provide(eu,_c(H)),C.provide(ra,l);const U=C.unmount;lo.add(C),C.unmount=function(){lo.delete(C),lo.size<1&&(d=Xo,Q&&Q(),Q=null,l.value=Xo,go=!1,ee=!1),U()}}};function Ne(C){return C.reduce((H,U)=>H.then(()=>k(U)),Promise.resolve())}return ho}function WR(){return Co(Wn)}var UR=(...e)=>Dg(...e),ub={transitionDuration:"{transition.duration}"},fb={borderWidth:"0 0 1px 0",borderColor:"{content.border.color}"},pb={color:"{text.muted.color}",hoverColor:"{text.color}",activeColor:"{text.color}",activeHoverColor:"{text.color}",padding:"1.125rem",fontWeight:"600",borderRadius:"0",borderWidth:"0",borderColor:"{content.border.color}",background:"{content.background}",hoverBackground:"{content.background}",activeBackground:"{content.background}",activeHoverBackground:"{content.background}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"-1px",shadow:"{focus.ring.shadow}"},toggleIcon:{color:"{text.muted.color}",hoverColor:"{text.color}",activeColor:"{text.color}",activeHoverColor:"{text.color}"},first:{topBorderRadius:"{content.border.radius}",borderWidth:"0"},last:{bottomBorderRadius:"{content.border.radius}",activeBottomBorderRadius:"0"}},gb={borderWidth:"0",borderColor:"{content.border.color}",background:"{content.background}",color:"{text.color}",padding:"0 1.125rem 1.125rem 1.125rem"},hb={root:ub,panel:fb,header:pb,content:gb},bb={background:"{form.field.background}",disabledBackground:"{form.field.disabled.background}",filledBackground:"{form.field.filled.background}",filledHoverBackground:"{form.field.filled.hover.background}",filledFocusBackground:"{form.field.filled.focus.background}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.hover.border.color}",focusBorderColor:"{form.field.focus.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",color:"{form.field.color}",disabledColor:"{form.field.disabled.color}",placeholderColor:"{form.field.placeholder.color}",invalidPlaceholderColor:"{form.field.invalid.placeholder.color}",shadow:"{form.field.shadow}",paddingX:"{form.field.padding.x}",paddingY:"{form.field.padding.y}",borderRadius:"{form.field.border.radius}",focusRing:{width:"{form.field.focus.ring.width}",style:"{form.field.focus.ring.style}",color:"{form.field.focus.ring.color}",offset:"{form.field.focus.ring.offset}",shadow:"{form.field.focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}"},mb={background:"{overlay.select.background}",borderColor:"{overlay.select.border.color}",borderRadius:"{overlay.select.border.radius}",color:"{overlay.select.color}",shadow:"{overlay.select.shadow}"},vb={padding:"{list.padding}",gap:"{list.gap}"},yb={focusBackground:"{list.option.focus.background}",selectedBackground:"{list.option.selected.background}",selectedFocusBackground:"{list.option.selected.focus.background}",color:"{list.option.color}",focusColor:"{list.option.focus.color}",selectedColor:"{list.option.selected.color}",selectedFocusColor:"{list.option.selected.focus.color}",padding:"{list.option.padding}",borderRadius:"{list.option.border.radius}"},kb={background:"{list.option.group.background}",color:"{list.option.group.color}",fontWeight:"{list.option.group.font.weight}",padding:"{list.option.group.padding}"},wb={width:"2.5rem",sm:{width:"2rem"},lg:{width:"3rem"},borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.border.color}",activeBorderColor:"{form.field.border.color}",borderRadius:"{form.field.border.radius}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},xb={borderRadius:"{border.radius.sm}"},_b={padding:"{list.option.padding}"},Cb={light:{chip:{focusBackground:"{surface.200}",focusColor:"{surface.800}"},dropdown:{background:"{surface.100}",hoverBackground:"{surface.200}",activeBackground:"{surface.300}",color:"{surface.600}",hoverColor:"{surface.700}",activeColor:"{surface.800}"}},dark:{chip:{focusBackground:"{surface.700}",focusColor:"{surface.0}"},dropdown:{background:"{surface.800}",hoverBackground:"{surface.700}",activeBackground:"{surface.600}",color:"{surface.300}",hoverColor:"{surface.200}",activeColor:"{surface.100}"}}},$b={root:bb,overlay:mb,list:vb,option:yb,optionGroup:kb,dropdown:wb,chip:xb,emptyMessage:_b,colorScheme:Cb},Sb={width:"2rem",height:"2rem",fontSize:"1rem",background:"{content.border.color}",color:"{content.color}",borderRadius:"{content.border.radius}"},Rb={size:"1rem"},Eb={borderColor:"{content.background}",offset:"-0.75rem"},Tb={width:"3rem",height:"3rem",fontSize:"1.5rem",icon:{size:"1.5rem"},group:{offset:"-1rem"}},Ab={width:"4rem",height:"4rem",fontSize:"2rem",icon:{size:"2rem"},group:{offset:"-1.5rem"}},Bb={root:Sb,icon:Rb,group:Eb,lg:Tb,xl:Ab},zb={borderRadius:"{border.radius.md}",padding:"0 0.5rem",fontSize:"0.75rem",fontWeight:"700",minWidth:"1.5rem",height:"1.5rem"},Ob={size:"0.5rem"},Ib={fontSize:"0.625rem",minWidth:"1.25rem",height:"1.25rem"},Pb={fontSize:"0.875rem",minWidth:"1.75rem",height:"1.75rem"},Db={fontSize:"1rem",minWidth:"2rem",height:"2rem"},Nb={light:{primary:{background:"{primary.color}",color:"{primary.contrast.color}"},secondary:{background:"{surface.100}",color:"{surface.600}"},success:{background:"{green.500}",color:"{surface.0}"},info:{background:"{sky.500}",color:"{surface.0}"},warn:{background:"{orange.500}",color:"{surface.0}"},danger:{background:"{red.500}",color:"{surface.0}"},contrast:{background:"{surface.950}",color:"{surface.0}"}},dark:{primary:{background:"{primary.color}",color:"{primary.contrast.color}"},secondary:{background:"{surface.800}",color:"{surface.300}"},success:{background:"{green.400}",color:"{green.950}"},info:{background:"{sky.400}",color:"{sky.950}"},warn:{background:"{orange.400}",color:"{orange.950}"},danger:{background:"{red.400}",color:"{red.950}"},contrast:{background:"{surface.0}",color:"{surface.950}"}}},Lb={root:zb,dot:Ob,sm:Ib,lg:Pb,xl:Db,colorScheme:Nb},Mb={borderRadius:{none:"0",xs:"2px",sm:"4px",md:"6px",lg:"8px",xl:"12px"},emerald:{50:"#ecfdf5",100:"#d1fae5",200:"#a7f3d0",300:"#6ee7b7",400:"#34d399",500:"#10b981",600:"#059669",700:"#047857",800:"#065f46",900:"#064e3b",950:"#022c22"},green:{50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d",950:"#052e16"},lime:{50:"#f7fee7",100:"#ecfccb",200:"#d9f99d",300:"#bef264",400:"#a3e635",500:"#84cc16",600:"#65a30d",700:"#4d7c0f",800:"#3f6212",900:"#365314",950:"#1a2e05"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},orange:{50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12",950:"#431407"},amber:{50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e",900:"#78350f",950:"#451a03"},yellow:{50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",800:"#854d0e",900:"#713f12",950:"#422006"},teal:{50:"#f0fdfa",100:"#ccfbf1",200:"#99f6e4",300:"#5eead4",400:"#2dd4bf",500:"#14b8a6",600:"#0d9488",700:"#0f766e",800:"#115e59",900:"#134e4a",950:"#042f2e"},cyan:{50:"#ecfeff",100:"#cffafe",200:"#a5f3fc",300:"#67e8f9",400:"#22d3ee",500:"#06b6d4",600:"#0891b2",700:"#0e7490",800:"#155e75",900:"#164e63",950:"#083344"},sky:{50:"#f0f9ff",100:"#e0f2fe",200:"#bae6fd",300:"#7dd3fc",400:"#38bdf8",500:"#0ea5e9",600:"#0284c7",700:"#0369a1",800:"#075985",900:"#0c4a6e",950:"#082f49"},blue:{50:"#eff6ff",100:"#dbeafe",200:"#bfdbfe",300:"#93c5fd",400:"#60a5fa",500:"#3b82f6",600:"#2563eb",700:"#1d4ed8",800:"#1e40af",900:"#1e3a8a",950:"#172554"},indigo:{50:"#eef2ff",100:"#e0e7ff",200:"#c7d2fe",300:"#a5b4fc",400:"#818cf8",500:"#6366f1",600:"#4f46e5",700:"#4338ca",800:"#3730a3",900:"#312e81",950:"#1e1b4b"},violet:{50:"#f5f3ff",100:"#ede9fe",200:"#ddd6fe",300:"#c4b5fd",400:"#a78bfa",500:"#8b5cf6",600:"#7c3aed",700:"#6d28d9",800:"#5b21b6",900:"#4c1d95",950:"#2e1065"},purple:{50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",400:"#c084fc",500:"#a855f7",600:"#9333ea",700:"#7e22ce",800:"#6b21a8",900:"#581c87",950:"#3b0764"},fuchsia:{50:"#fdf4ff",100:"#fae8ff",200:"#f5d0fe",300:"#f0abfc",400:"#e879f9",500:"#d946ef",600:"#c026d3",700:"#a21caf",800:"#86198f",900:"#701a75",950:"#4a044e"},pink:{50:"#fdf2f8",100:"#fce7f3",200:"#fbcfe8",300:"#f9a8d4",400:"#f472b6",500:"#ec4899",600:"#db2777",700:"#be185d",800:"#9d174d",900:"#831843",950:"#500724"},rose:{50:"#fff1f2",100:"#ffe4e6",200:"#fecdd3",300:"#fda4af",400:"#fb7185",500:"#f43f5e",600:"#e11d48",700:"#be123c",800:"#9f1239",900:"#881337",950:"#4c0519"},slate:{50:"#f8fafc",100:"#f1f5f9",200:"#e2e8f0",300:"#cbd5e1",400:"#94a3b8",500:"#64748b",600:"#475569",700:"#334155",800:"#1e293b",900:"#0f172a",950:"#020617"},gray:{50:"#f9fafb",100:"#f3f4f6",200:"#e5e7eb",300:"#d1d5db",400:"#9ca3af",500:"#6b7280",600:"#4b5563",700:"#374151",800:"#1f2937",900:"#111827",950:"#030712"},zinc:{50:"#fafafa",100:"#f4f4f5",200:"#e4e4e7",300:"#d4d4d8",400:"#a1a1aa",500:"#71717a",600:"#52525b",700:"#3f3f46",800:"#27272a",900:"#18181b",950:"#09090b"},neutral:{50:"#fafafa",100:"#f5f5f5",200:"#e5e5e5",300:"#d4d4d4",400:"#a3a3a3",500:"#737373",600:"#525252",700:"#404040",800:"#262626",900:"#171717",950:"#0a0a0a"},stone:{50:"#fafaf9",100:"#f5f5f4",200:"#e7e5e4",300:"#d6d3d1",400:"#a8a29e",500:"#78716c",600:"#57534e",700:"#44403c",800:"#292524",900:"#1c1917",950:"#0c0a09"}},Fb={transitionDuration:"0.2s",focusRing:{width:"1px",style:"solid",color:"{primary.color}",offset:"2px",shadow:"none"},disabledOpacity:"0.6",iconSize:"1rem",anchorGutter:"2px",primary:{50:"{emerald.50}",100:"{emerald.100}",200:"{emerald.200}",300:"{emerald.300}",400:"{emerald.400}",500:"{emerald.500}",600:"{emerald.600}",700:"{emerald.700}",800:"{emerald.800}",900:"{emerald.900}",950:"{emerald.950}"},formField:{paddingX:"0.75rem",paddingY:"0.5rem",sm:{fontSize:"0.875rem",paddingX:"0.625rem",paddingY:"0.375rem"},lg:{fontSize:"1.125rem",paddingX:"0.875rem",paddingY:"0.625rem"},borderRadius:"{border.radius.md}",focusRing:{width:"0",style:"none",color:"transparent",offset:"0",shadow:"none"},transitionDuration:"{transition.duration}"},list:{padding:"0.25rem 0.25rem",gap:"2px",header:{padding:"0.5rem 1rem 0.25rem 1rem"},option:{padding:"0.5rem 0.75rem",borderRadius:"{border.radius.sm}"},optionGroup:{padding:"0.5rem 0.75rem",fontWeight:"600"}},content:{borderRadius:"{border.radius.md}"},mask:{transitionDuration:"0.3s"},navigation:{list:{padding:"0.25rem 0.25rem",gap:"2px"},item:{padding:"0.5rem 0.75rem",borderRadius:"{border.radius.sm}",gap:"0.5rem"},submenuLabel:{padding:"0.5rem 0.75rem",fontWeight:"600"},submenuIcon:{size:"0.875rem"}},overlay:{select:{borderRadius:"{border.radius.md}",shadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"},popover:{borderRadius:"{border.radius.md}",padding:"0.75rem",shadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"},modal:{borderRadius:"{border.radius.xl}",padding:"1.25rem",shadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"},navigation:{shadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"}},colorScheme:{light:{surface:{0:"#ffffff",50:"{slate.50}",100:"{slate.100}",200:"{slate.200}",300:"{slate.300}",400:"{slate.400}",500:"{slate.500}",600:"{slate.600}",700:"{slate.700}",800:"{slate.800}",900:"{slate.900}",950:"{slate.950}"},primary:{color:"{primary.500}",contrastColor:"#ffffff",hoverColor:"{primary.600}",activeColor:"{primary.700}"},highlight:{background:"{primary.50}",focusBackground:"{primary.100}",color:"{primary.700}",focusColor:"{primary.800}"},mask:{background:"rgba(0,0,0,0.4)",color:"{surface.200}"},formField:{background:"{surface.0}",disabledBackground:"{surface.200}",filledBackground:"{surface.50}",filledHoverBackground:"{surface.50}",filledFocusBackground:"{surface.50}",borderColor:"{surface.300}",hoverBorderColor:"{surface.400}",focusBorderColor:"{primary.color}",invalidBorderColor:"{red.400}",color:"{surface.700}",disabledColor:"{surface.500}",placeholderColor:"{surface.500}",invalidPlaceholderColor:"{red.600}",floatLabelColor:"{surface.500}",floatLabelFocusColor:"{primary.600}",floatLabelActiveColor:"{surface.500}",floatLabelInvalidColor:"{form.field.invalid.placeholder.color}",iconColor:"{surface.400}",shadow:"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)"},text:{color:"{surface.700}",hoverColor:"{surface.800}",mutedColor:"{surface.500}",hoverMutedColor:"{surface.600}"},content:{background:"{surface.0}",hoverBackground:"{surface.100}",borderColor:"{surface.200}",color:"{text.color}",hoverColor:"{text.hover.color}"},overlay:{select:{background:"{surface.0}",borderColor:"{surface.200}",color:"{text.color}"},popover:{background:"{surface.0}",borderColor:"{surface.200}",color:"{text.color}"},modal:{background:"{surface.0}",borderColor:"{surface.200}",color:"{text.color}"}},list:{option:{focusBackground:"{surface.100}",selectedBackground:"{highlight.background}",selectedFocusBackground:"{highlight.focus.background}",color:"{text.color}",focusColor:"{text.hover.color}",selectedColor:"{highlight.color}",selectedFocusColor:"{highlight.focus.color}",icon:{color:"{surface.400}",focusColor:"{surface.500}"}},optionGroup:{background:"transparent",color:"{text.muted.color}"}},navigation:{item:{focusBackground:"{surface.100}",activeBackground:"{surface.100}",color:"{text.color}",focusColor:"{text.hover.color}",activeColor:"{text.hover.color}",icon:{color:"{surface.400}",focusColor:"{surface.500}",activeColor:"{surface.500}"}},submenuLabel:{background:"transparent",color:"{text.muted.color}"},submenuIcon:{color:"{surface.400}",focusColor:"{surface.500}",activeColor:"{surface.500}"}}},dark:{surface:{0:"#ffffff",50:"{zinc.50}",100:"{zinc.100}",200:"{zinc.200}",300:"{zinc.300}",400:"{zinc.400}",500:"{zinc.500}",600:"{zinc.600}",700:"{zinc.700}",800:"{zinc.800}",900:"{zinc.900}",950:"{zinc.950}"},primary:{color:"{primary.400}",contrastColor:"{surface.900}",hoverColor:"{primary.300}",activeColor:"{primary.200}"},highlight:{background:"color-mix(in srgb, {primary.400}, transparent 84%)",focusBackground:"color-mix(in srgb, {primary.400}, transparent 76%)",color:"rgba(255,255,255,.87)",focusColor:"rgba(255,255,255,.87)"},mask:{background:"rgba(0,0,0,0.6)",color:"{surface.200}"},formField:{background:"{surface.950}",disabledBackground:"{surface.700}",filledBackground:"{surface.800}",filledHoverBackground:"{surface.800}",filledFocusBackground:"{surface.800}",borderColor:"{surface.600}",hoverBorderColor:"{surface.500}",focusBorderColor:"{primary.color}",invalidBorderColor:"{red.300}",color:"{surface.0}",disabledColor:"{surface.400}",placeholderColor:"{surface.400}",invalidPlaceholderColor:"{red.400}",floatLabelColor:"{surface.400}",floatLabelFocusColor:"{primary.color}",floatLabelActiveColor:"{surface.400}",floatLabelInvalidColor:"{form.field.invalid.placeholder.color}",iconColor:"{surface.400}",shadow:"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)"},text:{color:"{surface.0}",hoverColor:"{surface.0}",mutedColor:"{surface.400}",hoverMutedColor:"{surface.300}"},content:{background:"{surface.900}",hoverBackground:"{surface.800}",borderColor:"{surface.700}",color:"{text.color}",hoverColor:"{text.hover.color}"},overlay:{select:{background:"{surface.900}",borderColor:"{surface.700}",color:"{text.color}"},popover:{background:"{surface.900}",borderColor:"{surface.700}",color:"{text.color}"},modal:{background:"{surface.900}",borderColor:"{surface.700}",color:"{text.color}"}},list:{option:{focusBackground:"{surface.800}",selectedBackground:"{highlight.background}",selectedFocusBackground:"{highlight.focus.background}",color:"{text.color}",focusColor:"{text.hover.color}",selectedColor:"{highlight.color}",selectedFocusColor:"{highlight.focus.color}",icon:{color:"{surface.500}",focusColor:"{surface.400}"}},optionGroup:{background:"transparent",color:"{text.muted.color}"}},navigation:{item:{focusBackground:"{surface.800}",activeBackground:"{surface.800}",color:"{text.color}",focusColor:"{text.hover.color}",activeColor:"{text.hover.color}",icon:{color:"{surface.500}",focusColor:"{surface.400}",activeColor:"{surface.400}"}},submenuLabel:{background:"transparent",color:"{text.muted.color}"},submenuIcon:{color:"{surface.500}",focusColor:"{surface.400}",activeColor:"{surface.400}"}}}}},jb={primitive:Mb,semantic:Fb},Wb={borderRadius:"{content.border.radius}"},Ub={root:Wb},Zb={padding:"1rem",background:"{content.background}",gap:"0.5rem",transitionDuration:"{transition.duration}"},Hb={color:"{text.muted.color}",hoverColor:"{text.color}",borderRadius:"{content.border.radius}",gap:"{navigation.item.gap}",icon:{color:"{navigation.item.icon.color}",hoverColor:"{navigation.item.icon.focus.color}"},focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Vb={color:"{navigation.item.icon.color}"},Gb={root:Zb,item:Hb,separator:Vb},Kb={borderRadius:"{form.field.border.radius}",roundedBorderRadius:"2rem",gap:"0.5rem",paddingX:"{form.field.padding.x}",paddingY:"{form.field.padding.y}",iconOnlyWidth:"2.5rem",sm:{fontSize:"{form.field.sm.font.size}",paddingX:"{form.field.sm.padding.x}",paddingY:"{form.field.sm.padding.y}",iconOnlyWidth:"2rem"},lg:{fontSize:"{form.field.lg.font.size}",paddingX:"{form.field.lg.padding.x}",paddingY:"{form.field.lg.padding.y}",iconOnlyWidth:"3rem"},label:{fontWeight:"500"},raisedShadow:"0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",offset:"{focus.ring.offset}"},badgeSize:"1rem",transitionDuration:"{form.field.transition.duration}"},Yb={light:{root:{primary:{background:"{primary.color}",hoverBackground:"{primary.hover.color}",activeBackground:"{primary.active.color}",borderColor:"{primary.color}",hoverBorderColor:"{primary.hover.color}",activeBorderColor:"{primary.active.color}",color:"{primary.contrast.color}",hoverColor:"{primary.contrast.color}",activeColor:"{primary.contrast.color}",focusRing:{color:"{primary.color}",shadow:"none"}},secondary:{background:"{surface.100}",hoverBackground:"{surface.200}",activeBackground:"{surface.300}",borderColor:"{surface.100}",hoverBorderColor:"{surface.200}",activeBorderColor:"{surface.300}",color:"{surface.600}",hoverColor:"{surface.700}",activeColor:"{surface.800}",focusRing:{color:"{surface.600}",shadow:"none"}},info:{background:"{sky.500}",hoverBackground:"{sky.600}",activeBackground:"{sky.700}",borderColor:"{sky.500}",hoverBorderColor:"{sky.600}",activeBorderColor:"{sky.700}",color:"#ffffff",hoverColor:"#ffffff",activeColor:"#ffffff",focusRing:{color:"{sky.500}",shadow:"none"}},success:{background:"{green.500}",hoverBackground:"{green.600}",activeBackground:"{green.700}",borderColor:"{green.500}",hoverBorderColor:"{green.600}",activeBorderColor:"{green.700}",color:"#ffffff",hoverColor:"#ffffff",activeColor:"#ffffff",focusRing:{color:"{green.500}",shadow:"none"}},warn:{background:"{orange.500}",hoverBackground:"{orange.600}",activeBackground:"{orange.700}",borderColor:"{orange.500}",hoverBorderColor:"{orange.600}",activeBorderColor:"{orange.700}",color:"#ffffff",hoverColor:"#ffffff",activeColor:"#ffffff",focusRing:{color:"{orange.500}",shadow:"none"}},help:{background:"{purple.500}",hoverBackground:"{purple.600}",activeBackground:"{purple.700}",borderColor:"{purple.500}",hoverBorderColor:"{purple.600}",activeBorderColor:"{purple.700}",color:"#ffffff",hoverColor:"#ffffff",activeColor:"#ffffff",focusRing:{color:"{purple.500}",shadow:"none"}},danger:{background:"{red.500}",hoverBackground:"{red.600}",activeBackground:"{red.700}",borderColor:"{red.500}",hoverBorderColor:"{red.600}",activeBorderColor:"{red.700}",color:"#ffffff",hoverColor:"#ffffff",activeColor:"#ffffff",focusRing:{color:"{red.500}",shadow:"none"}},contrast:{background:"{surface.950}",hoverBackground:"{surface.900}",activeBackground:"{surface.800}",borderColor:"{surface.950}",hoverBorderColor:"{surface.900}",activeBorderColor:"{surface.800}",color:"{surface.0}",hoverColor:"{surface.0}",activeColor:"{surface.0}",focusRing:{color:"{surface.950}",shadow:"none"}}},outlined:{primary:{hoverBackground:"{primary.50}",activeBackground:"{primary.100}",borderColor:"{primary.200}",color:"{primary.color}"},secondary:{hoverBackground:"{surface.50}",activeBackground:"{surface.100}",borderColor:"{surface.200}",color:"{surface.500}"},success:{hoverBackground:"{green.50}",activeBackground:"{green.100}",borderColor:"{green.200}",color:"{green.500}"},info:{hoverBackground:"{sky.50}",activeBackground:"{sky.100}",borderColor:"{sky.200}",color:"{sky.500}"},warn:{hoverBackground:"{orange.50}",activeBackground:"{orange.100}",borderColor:"{orange.200}",color:"{orange.500}"},help:{hoverBackground:"{purple.50}",activeBackground:"{purple.100}",borderColor:"{purple.200}",color:"{purple.500}"},danger:{hoverBackground:"{red.50}",activeBackground:"{red.100}",borderColor:"{red.200}",color:"{red.500}"},contrast:{hoverBackground:"{surface.50}",activeBackground:"{surface.100}",borderColor:"{surface.700}",color:"{surface.950}"},plain:{hoverBackground:"{surface.50}",activeBackground:"{surface.100}",borderColor:"{surface.200}",color:"{surface.700}"}},text:{primary:{hoverBackground:"{primary.50}",activeBackground:"{primary.100}",color:"{primary.color}"},secondary:{hoverBackground:"{surface.50}",activeBackground:"{surface.100}",color:"{surface.500}"},success:{hoverBackground:"{green.50}",activeBackground:"{green.100}",color:"{green.500}"},info:{hoverBackground:"{sky.50}",activeBackground:"{sky.100}",color:"{sky.500}"},warn:{hoverBackground:"{orange.50}",activeBackground:"{orange.100}",color:"{orange.500}"},help:{hoverBackground:"{purple.50}",activeBackground:"{purple.100}",color:"{purple.500}"},danger:{hoverBackground:"{red.50}",activeBackground:"{red.100}",color:"{red.500}"},contrast:{hoverBackground:"{surface.50}",activeBackground:"{surface.100}",color:"{surface.950}"},plain:{hoverBackground:"{surface.50}",activeBackground:"{surface.100}",color:"{surface.700}"}},link:{color:"{primary.color}",hoverColor:"{primary.color}",activeColor:"{primary.color}"}},dark:{root:{primary:{background:"{primary.color}",hoverBackground:"{primary.hover.color}",activeBackground:"{primary.active.color}",borderColor:"{primary.color}",hoverBorderColor:"{primary.hover.color}",activeBorderColor:"{primary.active.color}",color:"{primary.contrast.color}",hoverColor:"{primary.contrast.color}",activeColor:"{primary.contrast.color}",focusRing:{color:"{primary.color}",shadow:"none"}},secondary:{background:"{surface.800}",hoverBackground:"{surface.700}",activeBackground:"{surface.600}",borderColor:"{surface.800}",hoverBorderColor:"{surface.700}",activeBorderColor:"{surface.600}",color:"{surface.300}",hoverColor:"{surface.200}",activeColor:"{surface.100}",focusRing:{color:"{surface.300}",shadow:"none"}},info:{background:"{sky.400}",hoverBackground:"{sky.300}",activeBackground:"{sky.200}",borderColor:"{sky.400}",hoverBorderColor:"{sky.300}",activeBorderColor:"{sky.200}",color:"{sky.950}",hoverColor:"{sky.950}",activeColor:"{sky.950}",focusRing:{color:"{sky.400}",shadow:"none"}},success:{background:"{green.400}",hoverBackground:"{green.300}",activeBackground:"{green.200}",borderColor:"{green.400}",hoverBorderColor:"{green.300}",activeBorderColor:"{green.200}",color:"{green.950}",hoverColor:"{green.950}",activeColor:"{green.950}",focusRing:{color:"{green.400}",shadow:"none"}},warn:{background:"{orange.400}",hoverBackground:"{orange.300}",activeBackground:"{orange.200}",borderColor:"{orange.400}",hoverBorderColor:"{orange.300}",activeBorderColor:"{orange.200}",color:"{orange.950}",hoverColor:"{orange.950}",activeColor:"{orange.950}",focusRing:{color:"{orange.400}",shadow:"none"}},help:{background:"{purple.400}",hoverBackground:"{purple.300}",activeBackground:"{purple.200}",borderColor:"{purple.400}",hoverBorderColor:"{purple.300}",activeBorderColor:"{purple.200}",color:"{purple.950}",hoverColor:"{purple.950}",activeColor:"{purple.950}",focusRing:{color:"{purple.400}",shadow:"none"}},danger:{background:"{red.400}",hoverBackground:"{red.300}",activeBackground:"{red.200}",borderColor:"{red.400}",hoverBorderColor:"{red.300}",activeBorderColor:"{red.200}",color:"{red.950}",hoverColor:"{red.950}",activeColor:"{red.950}",focusRing:{color:"{red.400}",shadow:"none"}},contrast:{background:"{surface.0}",hoverBackground:"{surface.100}",activeBackground:"{surface.200}",borderColor:"{surface.0}",hoverBorderColor:"{surface.100}",activeBorderColor:"{surface.200}",color:"{surface.950}",hoverColor:"{surface.950}",activeColor:"{surface.950}",focusRing:{color:"{surface.0}",shadow:"none"}}},outlined:{primary:{hoverBackground:"color-mix(in srgb, {primary.color}, transparent 96%)",activeBackground:"color-mix(in srgb, {primary.color}, transparent 84%)",borderColor:"{primary.700}",color:"{primary.color}"},secondary:{hoverBackground:"rgba(255,255,255,0.04)",activeBackground:"rgba(255,255,255,0.16)",borderColor:"{surface.700}",color:"{surface.400}"},success:{hoverBackground:"color-mix(in srgb, {green.400}, transparent 96%)",activeBackground:"color-mix(in srgb, {green.400}, transparent 84%)",borderColor:"{green.700}",color:"{green.400}"},info:{hoverBackground:"color-mix(in srgb, {sky.400}, transparent 96%)",activeBackground:"color-mix(in srgb, {sky.400}, transparent 84%)",borderColor:"{sky.700}",color:"{sky.400}"},warn:{hoverBackground:"color-mix(in srgb, {orange.400}, transparent 96%)",activeBackground:"color-mix(in srgb, {orange.400}, transparent 84%)",borderColor:"{orange.700}",color:"{orange.400}"},help:{hoverBackground:"color-mix(in srgb, {purple.400}, transparent 96%)",activeBackground:"color-mix(in srgb, {purple.400}, transparent 84%)",borderColor:"{purple.700}",color:"{purple.400}"},danger:{hoverBackground:"color-mix(in srgb, {red.400}, transparent 96%)",activeBackground:"color-mix(in srgb, {red.400}, transparent 84%)",borderColor:"{red.700}",color:"{red.400}"},contrast:{hoverBackground:"{surface.800}",activeBackground:"{surface.700}",borderColor:"{surface.500}",color:"{surface.0}"},plain:{hoverBackground:"{surface.800}",activeBackground:"{surface.700}",borderColor:"{surface.600}",color:"{surface.0}"}},text:{primary:{hoverBackground:"color-mix(in srgb, {primary.color}, transparent 96%)",activeBackground:"color-mix(in srgb, {primary.color}, transparent 84%)",color:"{primary.color}"},secondary:{hoverBackground:"{surface.800}",activeBackground:"{surface.700}",color:"{surface.400}"},success:{hoverBackground:"color-mix(in srgb, {green.400}, transparent 96%)",activeBackground:"color-mix(in srgb, {green.400}, transparent 84%)",color:"{green.400}"},info:{hoverBackground:"color-mix(in srgb, {sky.400}, transparent 96%)",activeBackground:"color-mix(in srgb, {sky.400}, transparent 84%)",color:"{sky.400}"},warn:{hoverBackground:"color-mix(in srgb, {orange.400}, transparent 96%)",activeBackground:"color-mix(in srgb, {orange.400}, transparent 84%)",color:"{orange.400}"},help:{hoverBackground:"color-mix(in srgb, {purple.400}, transparent 96%)",activeBackground:"color-mix(in srgb, {purple.400}, transparent 84%)",color:"{purple.400}"},danger:{hoverBackground:"color-mix(in srgb, {red.400}, transparent 96%)",activeBackground:"color-mix(in srgb, {red.400}, transparent 84%)",color:"{red.400}"},contrast:{hoverBackground:"{surface.800}",activeBackground:"{surface.700}",color:"{surface.0}"},plain:{hoverBackground:"{surface.800}",activeBackground:"{surface.700}",color:"{surface.0}"}},link:{color:"{primary.color}",hoverColor:"{primary.color}",activeColor:"{primary.color}"}}},Xb={root:Kb,colorScheme:Yb},qb={background:"{content.background}",borderRadius:"{border.radius.xl}",color:"{content.color}",shadow:"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"},Jb={padding:"1.25rem",gap:"0.5rem"},Qb={gap:"0.5rem"},em={fontSize:"1.25rem",fontWeight:"500"},om={color:"{text.muted.color}"},tm={root:qb,body:Jb,caption:Qb,title:em,subtitle:om},rm={transitionDuration:"{transition.duration}"},nm={gap:"0.25rem"},im={padding:"1rem",gap:"0.5rem"},am={width:"2rem",height:"0.5rem",borderRadius:"{content.border.radius}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},sm={light:{indicator:{background:"{surface.200}",hoverBackground:"{surface.300}",activeBackground:"{primary.color}"}},dark:{indicator:{background:"{surface.700}",hoverBackground:"{surface.600}",activeBackground:"{primary.color}"}}},lm={root:rm,content:nm,indicatorList:im,indicator:am,colorScheme:sm},cm={background:"{form.field.background}",disabledBackground:"{form.field.disabled.background}",filledBackground:"{form.field.filled.background}",filledHoverBackground:"{form.field.filled.hover.background}",filledFocusBackground:"{form.field.filled.focus.background}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.hover.border.color}",focusBorderColor:"{form.field.focus.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",color:"{form.field.color}",disabledColor:"{form.field.disabled.color}",placeholderColor:"{form.field.placeholder.color}",invalidPlaceholderColor:"{form.field.invalid.placeholder.color}",shadow:"{form.field.shadow}",paddingX:"{form.field.padding.x}",paddingY:"{form.field.padding.y}",borderRadius:"{form.field.border.radius}",focusRing:{width:"{form.field.focus.ring.width}",style:"{form.field.focus.ring.style}",color:"{form.field.focus.ring.color}",offset:"{form.field.focus.ring.offset}",shadow:"{form.field.focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}",sm:{fontSize:"{form.field.sm.font.size}",paddingX:"{form.field.sm.padding.x}",paddingY:"{form.field.sm.padding.y}"},lg:{fontSize:"{form.field.lg.font.size}",paddingX:"{form.field.lg.padding.x}",paddingY:"{form.field.lg.padding.y}"}},dm={width:"2.5rem",color:"{form.field.icon.color}"},um={background:"{overlay.select.background}",borderColor:"{overlay.select.border.color}",borderRadius:"{overlay.select.border.radius}",color:"{overlay.select.color}",shadow:"{overlay.select.shadow}"},fm={padding:"{list.padding}",gap:"{list.gap}",mobileIndent:"1rem"},pm={focusBackground:"{list.option.focus.background}",selectedBackground:"{list.option.selected.background}",selectedFocusBackground:"{list.option.selected.focus.background}",color:"{list.option.color}",focusColor:"{list.option.focus.color}",selectedColor:"{list.option.selected.color}",selectedFocusColor:"{list.option.selected.focus.color}",padding:"{list.option.padding}",borderRadius:"{list.option.border.radius}",icon:{color:"{list.option.icon.color}",focusColor:"{list.option.icon.focus.color}",size:"0.875rem"}},gm={color:"{form.field.icon.color}"},hm={root:cm,dropdown:dm,overlay:um,list:fm,option:pm,clearIcon:gm},bm={borderRadius:"{border.radius.sm}",width:"1.25rem",height:"1.25rem",background:"{form.field.background}",checkedBackground:"{primary.color}",checkedHoverBackground:"{primary.hover.color}",disabledBackground:"{form.field.disabled.background}",filledBackground:"{form.field.filled.background}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.hover.border.color}",focusBorderColor:"{form.field.border.color}",checkedBorderColor:"{primary.color}",checkedHoverBorderColor:"{primary.hover.color}",checkedFocusBorderColor:"{primary.color}",checkedDisabledBorderColor:"{form.field.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",shadow:"{form.field.shadow}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}",sm:{width:"1rem",height:"1rem"},lg:{width:"1.5rem",height:"1.5rem"}},mm={size:"0.875rem",color:"{form.field.color}",checkedColor:"{primary.contrast.color}",checkedHoverColor:"{primary.contrast.color}",disabledColor:"{form.field.disabled.color}",sm:{size:"0.75rem"},lg:{size:"1rem"}},vm={root:bm,icon:mm},ym={borderRadius:"16px",paddingX:"0.75rem",paddingY:"0.5rem",gap:"0.5rem",transitionDuration:"{transition.duration}"},km={width:"2rem",height:"2rem"},wm={size:"1rem"},xm={size:"1rem",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{form.field.focus.ring.shadow}"}},_m={light:{root:{background:"{surface.100}",color:"{surface.800}"},icon:{color:"{surface.800}"},removeIcon:{color:"{surface.800}"}},dark:{root:{background:"{surface.800}",color:"{surface.0}"},icon:{color:"{surface.0}"},removeIcon:{color:"{surface.0}"}}},Cm={root:ym,image:km,icon:wm,removeIcon:xm,colorScheme:_m},$m={transitionDuration:"{transition.duration}"},Sm={width:"1.5rem",height:"1.5rem",borderRadius:"{form.field.border.radius}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Rm={shadow:"{overlay.popover.shadow}",borderRadius:"{overlay.popover.borderRadius}"},Em={light:{panel:{background:"{surface.800}",borderColor:"{surface.900}"},handle:{color:"{surface.0}"}},dark:{panel:{background:"{surface.900}",borderColor:"{surface.700}"},handle:{color:"{surface.0}"}}},Tm={root:$m,preview:Sm,panel:Rm,colorScheme:Em},Am={size:"2rem",color:"{overlay.modal.color}"},Bm={gap:"1rem"},zm={icon:Am,content:Bm},Om={background:"{overlay.popover.background}",borderColor:"{overlay.popover.border.color}",color:"{overlay.popover.color}",borderRadius:"{overlay.popover.border.radius}",shadow:"{overlay.popover.shadow}",gutter:"10px",arrowOffset:"1.25rem"},Im={padding:"{overlay.popover.padding}",gap:"1rem"},Pm={size:"1.5rem",color:"{overlay.popover.color}"},Dm={gap:"0.5rem",padding:"0 {overlay.popover.padding} {overlay.popover.padding} {overlay.popover.padding}"},Nm={root:Om,content:Im,icon:Pm,footer:Dm},Lm={background:"{content.background}",borderColor:"{content.border.color}",color:"{content.color}",borderRadius:"{content.border.radius}",shadow:"{overlay.navigation.shadow}",transitionDuration:"{transition.duration}"},Mm={padding:"{navigation.list.padding}",gap:"{navigation.list.gap}"},Fm={focusBackground:"{navigation.item.focus.background}",activeBackground:"{navigation.item.active.background}",color:"{navigation.item.color}",focusColor:"{navigation.item.focus.color}",activeColor:"{navigation.item.active.color}",padding:"{navigation.item.padding}",borderRadius:"{navigation.item.border.radius}",gap:"{navigation.item.gap}",icon:{color:"{navigation.item.icon.color}",focusColor:"{navigation.item.icon.focus.color}",activeColor:"{navigation.item.icon.active.color}"}},jm={mobileIndent:"1rem"},Wm={size:"{navigation.submenu.icon.size}",color:"{navigation.submenu.icon.color}",focusColor:"{navigation.submenu.icon.focus.color}",activeColor:"{navigation.submenu.icon.active.color}"},Um={borderColor:"{content.border.color}"},Zm={root:Lm,list:Mm,item:Fm,submenu:jm,submenuIcon:Wm,separator:Um},Hm=`
    li.p-autocomplete-option,
    div.p-cascadeselect-option-content,
    li.p-listbox-option,
    li.p-multiselect-option,
    li.p-select-option,
    li.p-listbox-option,
    div.p-tree-node-content,
    li.p-datatable-filter-constraint,
    .p-datatable .p-datatable-tbody > tr,
    .p-treetable .p-treetable-tbody > tr,
    div.p-menu-item-content,
    div.p-tieredmenu-item-content,
    div.p-contextmenu-item-content,
    div.p-menubar-item-content,
    div.p-megamenu-item-content,
    div.p-panelmenu-header-content,
    div.p-panelmenu-item-content,
    th.p-datatable-header-cell,
    th.p-treetable-header-cell,
    thead.p-datatable-thead > tr > th,
    .p-treetable thead.p-treetable-thead>tr>th {
        transition: none;
    }
`,Vm={transitionDuration:"{transition.duration}"},Gm={background:"{content.background}",borderColor:"{datatable.border.color}",color:"{content.color}",borderWidth:"0 0 1px 0",padding:"0.75rem 1rem",sm:{padding:"0.375rem 0.5rem"},lg:{padding:"1rem 1.25rem"}},Km={background:"{content.background}",hoverBackground:"{content.hover.background}",selectedBackground:"{highlight.background}",borderColor:"{datatable.border.color}",color:"{content.color}",hoverColor:"{content.hover.color}",selectedColor:"{highlight.color}",gap:"0.5rem",padding:"0.75rem 1rem",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"-1px",shadow:"{focus.ring.shadow}"},sm:{padding:"0.375rem 0.5rem"},lg:{padding:"1rem 1.25rem"}},Ym={fontWeight:"600"},Xm={background:"{content.background}",hoverBackground:"{content.hover.background}",selectedBackground:"{highlight.background}",color:"{content.color}",hoverColor:"{content.hover.color}",selectedColor:"{highlight.color}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"-1px",shadow:"{focus.ring.shadow}"}},qm={borderColor:"{datatable.border.color}",padding:"0.75rem 1rem",sm:{padding:"0.375rem 0.5rem"},lg:{padding:"1rem 1.25rem"}},Jm={background:"{content.background}",borderColor:"{datatable.border.color}",color:"{content.color}",padding:"0.75rem 1rem",sm:{padding:"0.375rem 0.5rem"},lg:{padding:"1rem 1.25rem"}},Qm={fontWeight:"600"},e0={background:"{content.background}",borderColor:"{datatable.border.color}",color:"{content.color}",borderWidth:"0 0 1px 0",padding:"0.75rem 1rem",sm:{padding:"0.375rem 0.5rem"},lg:{padding:"1rem 1.25rem"}},o0={color:"{primary.color}"},t0={width:"0.5rem"},r0={width:"1px",color:"{primary.color}"},n0={color:"{text.muted.color}",hoverColor:"{text.hover.muted.color}",size:"0.875rem"},i0={size:"2rem"},a0={hoverBackground:"{content.hover.background}",selectedHoverBackground:"{content.background}",color:"{text.muted.color}",hoverColor:"{text.color}",selectedHoverColor:"{primary.color}",size:"1.75rem",borderRadius:"50%",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},s0={inlineGap:"0.5rem",overlaySelect:{background:"{overlay.select.background}",borderColor:"{overlay.select.border.color}",borderRadius:"{overlay.select.border.radius}",color:"{overlay.select.color}",shadow:"{overlay.select.shadow}"},overlayPopover:{background:"{overlay.popover.background}",borderColor:"{overlay.popover.border.color}",borderRadius:"{overlay.popover.border.radius}",color:"{overlay.popover.color}",shadow:"{overlay.popover.shadow}",padding:"{overlay.popover.padding}",gap:"0.5rem"},rule:{borderColor:"{content.border.color}"},constraintList:{padding:"{list.padding}",gap:"{list.gap}"},constraint:{focusBackground:"{list.option.focus.background}",selectedBackground:"{list.option.selected.background}",selectedFocusBackground:"{list.option.selected.focus.background}",color:"{list.option.color}",focusColor:"{list.option.focus.color}",selectedColor:"{list.option.selected.color}",selectedFocusColor:"{list.option.selected.focus.color}",separator:{borderColor:"{content.border.color}"},padding:"{list.option.padding}",borderRadius:"{list.option.border.radius}"}},l0={borderColor:"{datatable.border.color}",borderWidth:"0 0 1px 0"},c0={borderColor:"{datatable.border.color}",borderWidth:"0 0 1px 0"},d0={light:{root:{borderColor:"{content.border.color}"},row:{stripedBackground:"{surface.50}"},bodyCell:{selectedBorderColor:"{primary.100}"}},dark:{root:{borderColor:"{surface.800}"},row:{stripedBackground:"{surface.950}"},bodyCell:{selectedBorderColor:"{primary.900}"}}},u0=`
    .p-datatable-mask.p-overlay-mask {
        --px-mask-background: light-dark(rgba(255,255,255,0.5),rgba(0,0,0,0.3));
    }
`,f0={root:Vm,header:Gm,headerCell:Km,columnTitle:Ym,row:Xm,bodyCell:qm,footerCell:Jm,columnFooter:Qm,footer:e0,dropPoint:o0,columnResizer:t0,resizeIndicator:r0,sortIcon:n0,loadingIcon:i0,rowToggleButton:a0,filter:s0,paginatorTop:l0,paginatorBottom:c0,colorScheme:d0,css:u0},p0={borderColor:"transparent",borderWidth:"0",borderRadius:"0",padding:"0"},g0={background:"{content.background}",color:"{content.color}",borderColor:"{content.border.color}",borderWidth:"0 0 1px 0",padding:"0.75rem 1rem",borderRadius:"0"},h0={background:"{content.background}",color:"{content.color}",borderColor:"transparent",borderWidth:"0",padding:"0",borderRadius:"0"},b0={background:"{content.background}",color:"{content.color}",borderColor:"{content.border.color}",borderWidth:"1px 0 0 0",padding:"0.75rem 1rem",borderRadius:"0"},m0={borderColor:"{content.border.color}",borderWidth:"0 0 1px 0"},v0={borderColor:"{content.border.color}",borderWidth:"1px 0 0 0"},y0={root:p0,header:g0,content:h0,footer:b0,paginatorTop:m0,paginatorBottom:v0},k0={transitionDuration:"{transition.duration}"},w0={background:"{content.background}",borderColor:"{content.border.color}",color:"{content.color}",borderRadius:"{content.border.radius}",shadow:"{overlay.popover.shadow}",padding:"{overlay.popover.padding}"},x0={background:"{content.background}",borderColor:"{content.border.color}",color:"{content.color}",padding:"0 0 0.5rem 0"},_0={gap:"0.5rem",fontWeight:"500"},C0={width:"2.5rem",sm:{width:"2rem"},lg:{width:"3rem"},borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.border.color}",activeBorderColor:"{form.field.border.color}",borderRadius:"{form.field.border.radius}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},$0={color:"{form.field.icon.color}"},S0={hoverBackground:"{content.hover.background}",color:"{content.color}",hoverColor:"{content.hover.color}",padding:"0.25rem 0.5rem",borderRadius:"{content.border.radius}"},R0={hoverBackground:"{content.hover.background}",color:"{content.color}",hoverColor:"{content.hover.color}",padding:"0.25rem 0.5rem",borderRadius:"{content.border.radius}"},E0={borderColor:"{content.border.color}",gap:"{overlay.popover.padding}"},T0={margin:"0.5rem 0 0 0"},A0={padding:"0.25rem",fontWeight:"500",color:"{content.color}"},B0={hoverBackground:"{content.hover.background}",selectedBackground:"{primary.color}",rangeSelectedBackground:"{highlight.background}",color:"{content.color}",hoverColor:"{content.hover.color}",selectedColor:"{primary.contrast.color}",rangeSelectedColor:"{highlight.color}",width:"2rem",height:"2rem",borderRadius:"50%",padding:"0.25rem",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},z0={margin:"0.5rem 0 0 0"},O0={padding:"0.375rem",borderRadius:"{content.border.radius}"},I0={margin:"0.5rem 0 0 0"},P0={padding:"0.375rem",borderRadius:"{content.border.radius}"},D0={padding:"0.5rem 0 0 0",borderColor:"{content.border.color}"},N0={padding:"0.5rem 0 0 0",borderColor:"{content.border.color}",gap:"0.5rem",buttonGap:"0.25rem"},L0={light:{dropdown:{background:"{surface.100}",hoverBackground:"{surface.200}",activeBackground:"{surface.300}",color:"{surface.600}",hoverColor:"{surface.700}",activeColor:"{surface.800}"},today:{background:"{surface.200}",color:"{surface.900}"}},dark:{dropdown:{background:"{surface.800}",hoverBackground:"{surface.700}",activeBackground:"{surface.600}",color:"{surface.300}",hoverColor:"{surface.200}",activeColor:"{surface.100}"},today:{background:"{surface.700}",color:"{surface.0}"}}},M0={root:k0,panel:w0,header:x0,title:_0,dropdown:C0,inputIcon:$0,selectMonth:S0,selectYear:R0,group:E0,dayView:T0,weekDay:A0,date:B0,monthView:z0,month:O0,yearView:I0,year:P0,buttonbar:D0,timePicker:N0,colorScheme:L0},F0={background:"{overlay.modal.background}",borderColor:"{overlay.modal.border.color}",color:"{overlay.modal.color}",borderRadius:"{overlay.modal.border.radius}",shadow:"{overlay.modal.shadow}"},j0={padding:"{overlay.modal.padding}",gap:"0.5rem"},W0={fontSize:"1.25rem",fontWeight:"600"},U0={padding:"0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}"},Z0={padding:"0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}",gap:"0.5rem"},H0={root:F0,header:j0,title:W0,content:U0,footer:Z0},V0={borderColor:"{content.border.color}"},G0={background:"{content.background}",color:"{text.color}"},K0={margin:"1rem 0",padding:"0 1rem",content:{padding:"0 0.5rem"}},Y0={margin:"0 1rem",padding:"0.5rem 0",content:{padding:"0.5rem 0"}},X0={root:V0,content:G0,horizontal:K0,vertical:Y0},q0={background:"rgba(255, 255, 255, 0.1)",borderColor:"rgba(255, 255, 255, 0.2)",padding:"0.5rem",borderRadius:"{border.radius.xl}"},J0={borderRadius:"{content.border.radius}",padding:"0.5rem",size:"3rem",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Q0={root:q0,item:J0},ev={background:"{overlay.modal.background}",borderColor:"{overlay.modal.border.color}",color:"{overlay.modal.color}",shadow:"{overlay.modal.shadow}"},ov={padding:"{overlay.modal.padding}"},tv={fontSize:"1.5rem",fontWeight:"600"},rv={padding:"0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}"},nv={padding:"{overlay.modal.padding}"},iv={root:ev,header:ov,title:tv,content:rv,footer:nv},av={background:"{content.background}",borderColor:"{content.border.color}",borderRadius:"{content.border.radius}"},sv={color:"{text.muted.color}",hoverColor:"{text.color}",activeColor:"{primary.color}"},lv={background:"{overlay.select.background}",borderColor:"{overlay.select.border.color}",borderRadius:"{overlay.select.border.radius}",color:"{overlay.select.color}",shadow:"{overlay.select.shadow}",padding:"{list.padding}"},cv={focusBackground:"{list.option.focus.background}",color:"{list.option.color}",focusColor:"{list.option.focus.color}",padding:"{list.option.padding}",borderRadius:"{list.option.border.radius}"},dv={background:"{content.background}",borderColor:"{content.border.color}",color:"{content.color}",borderRadius:"{content.border.radius}"},uv={toolbar:av,toolbarItem:sv,overlay:lv,overlayOption:cv,content:dv},fv={background:"{content.background}",borderColor:"{content.border.color}",borderRadius:"{content.border.radius}",color:"{content.color}",padding:"0 1.125rem 1.125rem 1.125rem",transitionDuration:"{transition.duration}"},pv={background:"{content.background}",hoverBackground:"{content.hover.background}",color:"{content.color}",hoverColor:"{content.hover.color}",borderRadius:"{content.border.radius}",borderWidth:"1px",borderColor:"transparent",padding:"0.5rem 0.75rem",gap:"0.5rem",fontWeight:"600",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},gv={color:"{text.muted.color}",hoverColor:"{text.hover.muted.color}"},hv={padding:"0"},bv={root:fv,legend:pv,toggleIcon:gv,content:hv},mv={background:"{content.background}",borderColor:"{content.border.color}",color:"{content.color}",borderRadius:"{content.border.radius}",transitionDuration:"{transition.duration}"},vv={background:"transparent",color:"{text.color}",padding:"1.125rem",borderColor:"unset",borderWidth:"0",borderRadius:"0",gap:"0.5rem"},yv={highlightBorderColor:"{primary.color}",padding:"0 1.125rem 1.125rem 1.125rem",gap:"1rem"},kv={padding:"1rem",gap:"1rem",borderColor:"{content.border.color}",info:{gap:"0.5rem"}},wv={gap:"0.5rem"},xv={height:"0.25rem"},_v={gap:"0.5rem"},Cv={root:mv,header:vv,content:yv,file:kv,fileList:wv,progressbar:xv,basic:_v},$v={color:"{form.field.float.label.color}",focusColor:"{form.field.float.label.focus.color}",activeColor:"{form.field.float.label.active.color}",invalidColor:"{form.field.float.label.invalid.color}",transitionDuration:"0.2s",positionX:"{form.field.padding.x}",positionY:"{form.field.padding.y}",fontWeight:"500",active:{fontSize:"0.75rem",fontWeight:"400"}},Sv={active:{top:"-1.25rem"}},Rv={input:{paddingTop:"1.5rem",paddingBottom:"{form.field.padding.y}"},active:{top:"{form.field.padding.y}"}},Ev={borderRadius:"{border.radius.xs}",active:{background:"{form.field.background}",padding:"0 0.125rem"}},Tv={root:$v,over:Sv,in:Rv,on:Ev},Av={borderWidth:"1px",borderColor:"{content.border.color}",borderRadius:"{content.border.radius}",transitionDuration:"{transition.duration}"},Bv={background:"rgba(255, 255, 255, 0.1)",hoverBackground:"rgba(255, 255, 255, 0.2)",color:"{surface.100}",hoverColor:"{surface.0}",size:"3rem",gutter:"0.5rem",prev:{borderRadius:"50%"},next:{borderRadius:"50%"},focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},zv={size:"1.5rem"},Ov={background:"{content.background}",padding:"1rem 0.25rem"},Iv={size:"2rem",borderRadius:"{content.border.radius}",gutter:"0.5rem",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Pv={size:"1rem"},Dv={background:"rgba(0, 0, 0, 0.5)",color:"{surface.100}",padding:"1rem"},Nv={gap:"0.5rem",padding:"1rem"},Lv={width:"1rem",height:"1rem",activeBackground:"{primary.color}",borderRadius:"50%",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Mv={background:"rgba(0, 0, 0, 0.5)"},Fv={background:"rgba(255, 255, 255, 0.4)",hoverBackground:"rgba(255, 255, 255, 0.6)",activeBackground:"rgba(255, 255, 255, 0.9)"},jv={size:"3rem",gutter:"0.5rem",background:"rgba(255, 255, 255, 0.1)",hoverBackground:"rgba(255, 255, 255, 0.2)",color:"{surface.50}",hoverColor:"{surface.0}",borderRadius:"50%",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Wv={size:"1.5rem"},Uv={light:{thumbnailNavButton:{hoverBackground:"{surface.100}",color:"{surface.600}",hoverColor:"{surface.700}"},indicatorButton:{background:"{surface.200}",hoverBackground:"{surface.300}"}},dark:{thumbnailNavButton:{hoverBackground:"{surface.700}",color:"{surface.400}",hoverColor:"{surface.0}"},indicatorButton:{background:"{surface.700}",hoverBackground:"{surface.600}"}}},Zv={root:Av,navButton:Bv,navIcon:zv,thumbnailsContent:Ov,thumbnailNavButton:Iv,thumbnailNavButtonIcon:Pv,caption:Dv,indicatorList:Nv,indicatorButton:Lv,insetIndicatorList:Mv,insetIndicatorButton:Fv,closeButton:jv,closeButtonIcon:Wv,colorScheme:Uv},Hv={color:"{form.field.icon.color}"},Vv={icon:Hv},Gv={color:"{form.field.float.label.color}",focusColor:"{form.field.float.label.focus.color}",invalidColor:"{form.field.float.label.invalid.color}",transitionDuration:"0.2s",positionX:"{form.field.padding.x}",top:"{form.field.padding.y}",fontSize:"0.75rem",fontWeight:"400"},Kv={paddingTop:"1.5rem",paddingBottom:"{form.field.padding.y}"},Yv={root:Gv,input:Kv},Xv={transitionDuration:"{transition.duration}"},qv={icon:{size:"1.5rem"},mask:{background:"{mask.background}",color:"{mask.color}"}},Jv={position:{left:"auto",right:"1rem",top:"1rem",bottom:"auto"},blur:"8px",background:"rgba(255,255,255,0.1)",borderColor:"rgba(255,255,255,0.2)",borderWidth:"1px",borderRadius:"30px",padding:".5rem",gap:"0.5rem"},Qv={hoverBackground:"rgba(255,255,255,0.1)",color:"{surface.50}",hoverColor:"{surface.0}",size:"3rem",iconSize:"1.5rem",borderRadius:"50%",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},ey={root:Xv,preview:qv,toolbar:Jv,action:Qv},oy={size:"15px",hoverSize:"30px",background:"rgba(255,255,255,0.3)",hoverBackground:"rgba(255,255,255,0.3)",borderColor:"unset",hoverBorderColor:"unset",borderWidth:"0",borderRadius:"50%",transitionDuration:"{transition.duration}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"rgba(255,255,255,0.3)",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},ty={handle:oy},ry={padding:"{form.field.padding.y} {form.field.padding.x}",borderRadius:"{content.border.radius}",gap:"0.5rem"},ny={fontWeight:"500"},iy={size:"1rem"},ay={light:{info:{background:"color-mix(in srgb, {blue.50}, transparent 5%)",borderColor:"{blue.200}",color:"{blue.600}",shadow:"0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)"},success:{background:"color-mix(in srgb, {green.50}, transparent 5%)",borderColor:"{green.200}",color:"{green.600}",shadow:"0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)"},warn:{background:"color-mix(in srgb,{yellow.50}, transparent 5%)",borderColor:"{yellow.200}",color:"{yellow.600}",shadow:"0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)"},error:{background:"color-mix(in srgb, {red.50}, transparent 5%)",borderColor:"{red.200}",color:"{red.600}",shadow:"0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)"},secondary:{background:"{surface.100}",borderColor:"{surface.200}",color:"{surface.600}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)"},contrast:{background:"{surface.900}",borderColor:"{surface.950}",color:"{surface.50}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)"}},dark:{info:{background:"color-mix(in srgb, {blue.500}, transparent 84%)",borderColor:"color-mix(in srgb, {blue.700}, transparent 64%)",color:"{blue.500}",shadow:"0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)"},success:{background:"color-mix(in srgb, {green.500}, transparent 84%)",borderColor:"color-mix(in srgb, {green.700}, transparent 64%)",color:"{green.500}",shadow:"0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)"},warn:{background:"color-mix(in srgb, {yellow.500}, transparent 84%)",borderColor:"color-mix(in srgb, {yellow.700}, transparent 64%)",color:"{yellow.500}",shadow:"0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)"},error:{background:"color-mix(in srgb, {red.500}, transparent 84%)",borderColor:"color-mix(in srgb, {red.700}, transparent 64%)",color:"{red.500}",shadow:"0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)"},secondary:{background:"{surface.800}",borderColor:"{surface.700}",color:"{surface.300}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)"},contrast:{background:"{surface.0}",borderColor:"{surface.100}",color:"{surface.950}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)"}}},sy={root:ry,text:ny,icon:iy,colorScheme:ay},ly={padding:"{form.field.padding.y} {form.field.padding.x}",borderRadius:"{content.border.radius}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"},transitionDuration:"{transition.duration}"},cy={hoverBackground:"{content.hover.background}",hoverColor:"{content.hover.color}"},dy={root:ly,display:cy},uy={background:"{form.field.background}",disabledBackground:"{form.field.disabled.background}",filledBackground:"{form.field.filled.background}",filledFocusBackground:"{form.field.filled.focus.background}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.hover.border.color}",focusBorderColor:"{form.field.focus.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",color:"{form.field.color}",disabledColor:"{form.field.disabled.color}",placeholderColor:"{form.field.placeholder.color}",shadow:"{form.field.shadow}",paddingX:"{form.field.padding.x}",paddingY:"{form.field.padding.y}",borderRadius:"{form.field.border.radius}",focusRing:{width:"{form.field.focus.ring.width}",style:"{form.field.focus.ring.style}",color:"{form.field.focus.ring.color}",offset:"{form.field.focus.ring.offset}",shadow:"{form.field.focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}"},fy={borderRadius:"{border.radius.sm}"},py={light:{chip:{focusBackground:"{surface.200}",color:"{surface.800}"}},dark:{chip:{focusBackground:"{surface.700}",color:"{surface.0}"}}},gy={root:uy,chip:fy,colorScheme:py},hy={background:"{form.field.background}",borderColor:"{form.field.border.color}",color:"{form.field.icon.color}",borderRadius:"{form.field.border.radius}",padding:"0.5rem",minWidth:"2.5rem"},by={addon:hy},my={transitionDuration:"{transition.duration}"},vy={width:"2.5rem",borderRadius:"{form.field.border.radius}",verticalPadding:"{form.field.padding.y}"},yy={light:{button:{background:"transparent",hoverBackground:"{surface.100}",activeBackground:"{surface.200}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.border.color}",activeBorderColor:"{form.field.border.color}",color:"{surface.400}",hoverColor:"{surface.500}",activeColor:"{surface.600}"}},dark:{button:{background:"transparent",hoverBackground:"{surface.800}",activeBackground:"{surface.700}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.border.color}",activeBorderColor:"{form.field.border.color}",color:"{surface.400}",hoverColor:"{surface.300}",activeColor:"{surface.200}"}}},ky={root:my,button:vy,colorScheme:yy},wy={gap:"0.5rem"},xy={width:"2.5rem",sm:{width:"2rem"},lg:{width:"3rem"}},_y={root:wy,input:xy},Cy={background:"{form.field.background}",disabledBackground:"{form.field.disabled.background}",filledBackground:"{form.field.filled.background}",filledHoverBackground:"{form.field.filled.hover.background}",filledFocusBackground:"{form.field.filled.focus.background}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.hover.border.color}",focusBorderColor:"{form.field.focus.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",color:"{form.field.color}",disabledColor:"{form.field.disabled.color}",placeholderColor:"{form.field.placeholder.color}",invalidPlaceholderColor:"{form.field.invalid.placeholder.color}",shadow:"{form.field.shadow}",paddingX:"{form.field.padding.x}",paddingY:"{form.field.padding.y}",borderRadius:"{form.field.border.radius}",focusRing:{width:"{form.field.focus.ring.width}",style:"{form.field.focus.ring.style}",color:"{form.field.focus.ring.color}",offset:"{form.field.focus.ring.offset}",shadow:"{form.field.focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}",sm:{fontSize:"{form.field.sm.font.size}",paddingX:"{form.field.sm.padding.x}",paddingY:"{form.field.sm.padding.y}"},lg:{fontSize:"{form.field.lg.font.size}",paddingX:"{form.field.lg.padding.x}",paddingY:"{form.field.lg.padding.y}"}},$y={root:Cy},Sy={transitionDuration:"{transition.duration}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Ry={background:"{primary.color}"},Ey={background:"{content.border.color}"},Ty={color:"{text.muted.color}"},Ay={root:Sy,value:Ry,range:Ey,text:Ty},By={background:"{form.field.background}",disabledBackground:"{form.field.disabled.background}",borderColor:"{form.field.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",color:"{form.field.color}",disabledColor:"{form.field.disabled.color}",shadow:"{form.field.shadow}",borderRadius:"{form.field.border.radius}",transitionDuration:"{form.field.transition.duration}"},zy={padding:"{list.padding}",gap:"{list.gap}",header:{padding:"{list.header.padding}"}},Oy={focusBackground:"{list.option.focus.background}",selectedBackground:"{list.option.selected.background}",selectedFocusBackground:"{list.option.selected.focus.background}",color:"{list.option.color}",focusColor:"{list.option.focus.color}",selectedColor:"{list.option.selected.color}",selectedFocusColor:"{list.option.selected.focus.color}",padding:"{list.option.padding}",borderRadius:"{list.option.border.radius}"},Iy={background:"{list.option.group.background}",color:"{list.option.group.color}",fontWeight:"{list.option.group.font.weight}",padding:"{list.option.group.padding}"},Py={color:"{list.option.color}",gutterStart:"-0.375rem",gutterEnd:"0.375rem"},Dy={padding:"{list.option.padding}"},Ny={light:{option:{stripedBackground:"{surface.50}"}},dark:{option:{stripedBackground:"{surface.900}"}}},Ly={root:By,list:zy,option:Oy,optionGroup:Iy,checkmark:Py,emptyMessage:Dy,colorScheme:Ny},My={background:"{content.background}",borderColor:"{content.border.color}",borderRadius:"{content.border.radius}",color:"{content.color}",gap:"0.5rem",verticalOrientation:{padding:"{navigation.list.padding}",gap:"{navigation.list.gap}"},horizontalOrientation:{padding:"0.5rem 0.75rem",gap:"0.5rem"},transitionDuration:"{transition.duration}"},Fy={borderRadius:"{content.border.radius}",padding:"{navigation.item.padding}"},jy={focusBackground:"{navigation.item.focus.background}",activeBackground:"{navigation.item.active.background}",color:"{navigation.item.color}",focusColor:"{navigation.item.focus.color}",activeColor:"{navigation.item.active.color}",padding:"{navigation.item.padding}",borderRadius:"{navigation.item.border.radius}",gap:"{navigation.item.gap}",icon:{color:"{navigation.item.icon.color}",focusColor:"{navigation.item.icon.focus.color}",activeColor:"{navigation.item.icon.active.color}"}},Wy={padding:"0",background:"{content.background}",borderColor:"{content.border.color}",borderRadius:"{content.border.radius}",color:"{content.color}",shadow:"{overlay.navigation.shadow}",gap:"0.5rem"},Uy={padding:"{navigation.list.padding}",gap:"{navigation.list.gap}"},Zy={padding:"{navigation.submenu.label.padding}",fontWeight:"{navigation.submenu.label.font.weight}",background:"{navigation.submenu.label.background}",color:"{navigation.submenu.label.color}"},Hy={size:"{navigation.submenu.icon.size}",color:"{navigation.submenu.icon.color}",focusColor:"{navigation.submenu.icon.focus.color}",activeColor:"{navigation.submenu.icon.active.color}"},Vy={borderColor:"{content.border.color}"},Gy={borderRadius:"50%",size:"1.75rem",color:"{text.muted.color}",hoverColor:"{text.hover.muted.color}",hoverBackground:"{content.hover.background}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Ky={root:My,baseItem:Fy,item:jy,overlay:Wy,submenu:Uy,submenuLabel:Zy,submenuIcon:Hy,separator:Vy,mobileButton:Gy},Yy={background:"{content.background}",borderColor:"{content.border.color}",color:"{content.color}",borderRadius:"{content.border.radius}",shadow:"{overlay.navigation.shadow}",transitionDuration:"{transition.duration}"},Xy={padding:"{navigation.list.padding}",gap:"{navigation.list.gap}"},qy={focusBackground:"{navigation.item.focus.background}",color:"{navigation.item.color}",focusColor:"{navigation.item.focus.color}",padding:"{navigation.item.padding}",borderRadius:"{navigation.item.border.radius}",gap:"{navigation.item.gap}",icon:{color:"{navigation.item.icon.color}",focusColor:"{navigation.item.icon.focus.color}"}},Jy={padding:"{navigation.submenu.label.padding}",fontWeight:"{navigation.submenu.label.font.weight}",background:"{navigation.submenu.label.background}",color:"{navigation.submenu.label.color}"},Qy={borderColor:"{content.border.color}"},ek={root:Yy,list:Xy,item:qy,submenuLabel:Jy,separator:Qy},ok={background:"{content.background}",borderColor:"{content.border.color}",borderRadius:"{content.border.radius}",color:"{content.color}",gap:"0.5rem",padding:"0.5rem 0.75rem",transitionDuration:"{transition.duration}"},tk={borderRadius:"{content.border.radius}",padding:"{navigation.item.padding}"},rk={focusBackground:"{navigation.item.focus.background}",activeBackground:"{navigation.item.active.background}",color:"{navigation.item.color}",focusColor:"{navigation.item.focus.color}",activeColor:"{navigation.item.active.color}",padding:"{navigation.item.padding}",borderRadius:"{navigation.item.border.radius}",gap:"{navigation.item.gap}",icon:{color:"{navigation.item.icon.color}",focusColor:"{navigation.item.icon.focus.color}",activeColor:"{navigation.item.icon.active.color}"}},nk={padding:"{navigation.list.padding}",gap:"{navigation.list.gap}",background:"{content.background}",borderColor:"{content.border.color}",borderRadius:"{content.border.radius}",shadow:"{overlay.navigation.shadow}",mobileIndent:"1rem",icon:{size:"{navigation.submenu.icon.size}",color:"{navigation.submenu.icon.color}",focusColor:"{navigation.submenu.icon.focus.color}",activeColor:"{navigation.submenu.icon.active.color}"}},ik={borderColor:"{content.border.color}"},ak={borderRadius:"50%",size:"1.75rem",color:"{text.muted.color}",hoverColor:"{text.hover.muted.color}",hoverBackground:"{content.hover.background}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},sk={root:ok,baseItem:tk,item:rk,submenu:nk,separator:ik,mobileButton:ak},lk={borderRadius:"{content.border.radius}",borderWidth:"1px",transitionDuration:"{transition.duration}"},ck={padding:"0.5rem 0.75rem",gap:"0.5rem",sm:{padding:"0.375rem 0.625rem"},lg:{padding:"0.625rem 0.875rem"}},dk={fontSize:"1rem",fontWeight:"500",sm:{fontSize:"0.875rem"},lg:{fontSize:"1.125rem"}},uk={size:"1.125rem",sm:{size:"1rem"},lg:{size:"1.25rem"}},fk={width:"1.75rem",height:"1.75rem",borderRadius:"50%",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",offset:"{focus.ring.offset}"}},pk={size:"1rem",sm:{size:"0.875rem"},lg:{size:"1.125rem"}},gk={root:{borderWidth:"1px"}},hk={content:{padding:"0"}},bk={light:{info:{background:"color-mix(in srgb, {blue.50}, transparent 5%)",borderColor:"{blue.200}",color:"{blue.600}",shadow:"0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)",closeButton:{hoverBackground:"{blue.100}",focusRing:{color:"{blue.600}",shadow:"none"}},outlined:{color:"{blue.600}",borderColor:"{blue.600}"},simple:{color:"{blue.600}"}},success:{background:"color-mix(in srgb, {green.50}, transparent 5%)",borderColor:"{green.200}",color:"{green.600}",shadow:"0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)",closeButton:{hoverBackground:"{green.100}",focusRing:{color:"{green.600}",shadow:"none"}},outlined:{color:"{green.600}",borderColor:"{green.600}"},simple:{color:"{green.600}"}},warn:{background:"color-mix(in srgb,{yellow.50}, transparent 5%)",borderColor:"{yellow.200}",color:"{yellow.600}",shadow:"0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)",closeButton:{hoverBackground:"{yellow.100}",focusRing:{color:"{yellow.600}",shadow:"none"}},outlined:{color:"{yellow.600}",borderColor:"{yellow.600}"},simple:{color:"{yellow.600}"}},error:{background:"color-mix(in srgb, {red.50}, transparent 5%)",borderColor:"{red.200}",color:"{red.600}",shadow:"0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)",closeButton:{hoverBackground:"{red.100}",focusRing:{color:"{red.600}",shadow:"none"}},outlined:{color:"{red.600}",borderColor:"{red.600}"},simple:{color:"{red.600}"}},secondary:{background:"{surface.100}",borderColor:"{surface.200}",color:"{surface.600}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)",closeButton:{hoverBackground:"{surface.200}",focusRing:{color:"{surface.600}",shadow:"none"}},outlined:{color:"{surface.500}",borderColor:"{surface.500}"},simple:{color:"{surface.500}"}},contrast:{background:"{surface.900}",borderColor:"{surface.950}",color:"{surface.50}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)",closeButton:{hoverBackground:"{surface.800}",focusRing:{color:"{surface.50}",shadow:"none"}},outlined:{color:"{surface.950}",borderColor:"{surface.950}"},simple:{color:"{surface.950}"}}},dark:{info:{background:"color-mix(in srgb, {blue.500}, transparent 84%)",borderColor:"color-mix(in srgb, {blue.700}, transparent 64%)",color:"{blue.500}",shadow:"0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)",closeButton:{hoverBackground:"rgba(255, 255, 255, 0.05)",focusRing:{color:"{blue.500}",shadow:"none"}},outlined:{color:"{blue.500}",borderColor:"{blue.500}"},simple:{color:"{blue.500}"}},success:{background:"color-mix(in srgb, {green.500}, transparent 84%)",borderColor:"color-mix(in srgb, {green.700}, transparent 64%)",color:"{green.500}",shadow:"0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)",closeButton:{hoverBackground:"rgba(255, 255, 255, 0.05)",focusRing:{color:"{green.500}",shadow:"none"}},outlined:{color:"{green.500}",borderColor:"{green.500}"},simple:{color:"{green.500}"}},warn:{background:"color-mix(in srgb, {yellow.500}, transparent 84%)",borderColor:"color-mix(in srgb, {yellow.700}, transparent 64%)",color:"{yellow.500}",shadow:"0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)",closeButton:{hoverBackground:"rgba(255, 255, 255, 0.05)",focusRing:{color:"{yellow.500}",shadow:"none"}},outlined:{color:"{yellow.500}",borderColor:"{yellow.500}"},simple:{color:"{yellow.500}"}},error:{background:"color-mix(in srgb, {red.500}, transparent 84%)",borderColor:"color-mix(in srgb, {red.700}, transparent 64%)",color:"{red.500}",shadow:"0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)",closeButton:{hoverBackground:"rgba(255, 255, 255, 0.05)",focusRing:{color:"{red.500}",shadow:"none"}},outlined:{color:"{red.500}",borderColor:"{red.500}"},simple:{color:"{red.500}"}},secondary:{background:"{surface.800}",borderColor:"{surface.700}",color:"{surface.300}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)",closeButton:{hoverBackground:"{surface.700}",focusRing:{color:"{surface.300}",shadow:"none"}},outlined:{color:"{surface.400}",borderColor:"{surface.400}"},simple:{color:"{surface.400}"}},contrast:{background:"{surface.0}",borderColor:"{surface.100}",color:"{surface.950}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)",closeButton:{hoverBackground:"{surface.100}",focusRing:{color:"{surface.950}",shadow:"none"}},outlined:{color:"{surface.0}",borderColor:"{surface.0}"},simple:{color:"{surface.0}"}}}},mk={root:lk,content:ck,text:dk,icon:uk,closeButton:fk,closeIcon:pk,outlined:gk,simple:hk,colorScheme:bk},vk={borderRadius:"{content.border.radius}",gap:"1rem"},yk={background:"{content.border.color}",size:"0.5rem"},kk={gap:"0.5rem"},wk={size:"0.5rem"},xk={size:"1rem"},_k={verticalGap:"0.5rem",horizontalGap:"1rem"},Ck={root:vk,meters:yk,label:kk,labelMarker:wk,labelIcon:xk,labelList:_k},$k={background:"{form.field.background}",disabledBackground:"{form.field.disabled.background}",filledBackground:"{form.field.filled.background}",filledHoverBackground:"{form.field.filled.hover.background}",filledFocusBackground:"{form.field.filled.focus.background}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.hover.border.color}",focusBorderColor:"{form.field.focus.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",color:"{form.field.color}",disabledColor:"{form.field.disabled.color}",placeholderColor:"{form.field.placeholder.color}",invalidPlaceholderColor:"{form.field.invalid.placeholder.color}",shadow:"{form.field.shadow}",paddingX:"{form.field.padding.x}",paddingY:"{form.field.padding.y}",borderRadius:"{form.field.border.radius}",focusRing:{width:"{form.field.focus.ring.width}",style:"{form.field.focus.ring.style}",color:"{form.field.focus.ring.color}",offset:"{form.field.focus.ring.offset}",shadow:"{form.field.focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}",sm:{fontSize:"{form.field.sm.font.size}",paddingX:"{form.field.sm.padding.x}",paddingY:"{form.field.sm.padding.y}"},lg:{fontSize:"{form.field.lg.font.size}",paddingX:"{form.field.lg.padding.x}",paddingY:"{form.field.lg.padding.y}"}},Sk={width:"2.5rem",color:"{form.field.icon.color}"},Rk={background:"{overlay.select.background}",borderColor:"{overlay.select.border.color}",borderRadius:"{overlay.select.border.radius}",color:"{overlay.select.color}",shadow:"{overlay.select.shadow}"},Ek={padding:"{list.padding}",gap:"{list.gap}",header:{padding:"{list.header.padding}"}},Tk={focusBackground:"{list.option.focus.background}",selectedBackground:"{list.option.selected.background}",selectedFocusBackground:"{list.option.selected.focus.background}",color:"{list.option.color}",focusColor:"{list.option.focus.color}",selectedColor:"{list.option.selected.color}",selectedFocusColor:"{list.option.selected.focus.color}",padding:"{list.option.padding}",borderRadius:"{list.option.border.radius}",gap:"0.5rem"},Ak={background:"{list.option.group.background}",color:"{list.option.group.color}",fontWeight:"{list.option.group.font.weight}",padding:"{list.option.group.padding}"},Bk={color:"{form.field.icon.color}"},zk={borderRadius:"{border.radius.sm}"},Ok={padding:"{list.option.padding}"},Ik={root:$k,dropdown:Sk,overlay:Rk,list:Ek,option:Tk,optionGroup:Ak,chip:zk,clearIcon:Bk,emptyMessage:Ok},Pk={gap:"1.125rem"},Dk={gap:"0.5rem"},Nk={root:Pk,controls:Dk},Lk={gutter:"0.75rem",transitionDuration:"{transition.duration}"},Mk={background:"{content.background}",hoverBackground:"{content.hover.background}",selectedBackground:"{highlight.background}",borderColor:"{content.border.color}",color:"{content.color}",selectedColor:"{highlight.color}",hoverColor:"{content.hover.color}",padding:"0.75rem 1rem",toggleablePadding:"0.75rem 1rem 1.25rem 1rem",borderRadius:"{content.border.radius}"},Fk={background:"{content.background}",hoverBackground:"{content.hover.background}",borderColor:"{content.border.color}",color:"{text.muted.color}",hoverColor:"{text.color}",size:"1.5rem",borderRadius:"50%",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},jk={color:"{content.border.color}",borderRadius:"{content.border.radius}",height:"24px"},Wk={root:Lk,node:Mk,nodeToggleButton:Fk,connector:jk},Uk={outline:{width:"2px",color:"{content.background}"}},Zk={root:Uk},Hk={padding:"0.5rem 1rem",gap:"0.25rem",borderRadius:"{content.border.radius}",background:"{content.background}",color:"{content.color}",transitionDuration:"{transition.duration}"},Vk={background:"transparent",hoverBackground:"{content.hover.background}",selectedBackground:"{highlight.background}",color:"{text.muted.color}",hoverColor:"{text.hover.muted.color}",selectedColor:"{highlight.color}",width:"2.5rem",height:"2.5rem",borderRadius:"50%",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Gk={color:"{text.muted.color}"},Kk={maxWidth:"2.5rem"},Yk={root:Hk,navButton:Vk,currentPageReport:Gk,jumpToPageInput:Kk},Xk={background:"{content.background}",borderColor:"{content.border.color}",color:"{content.color}",borderRadius:"{content.border.radius}"},qk={background:"transparent",color:"{text.color}",padding:"1.125rem",borderColor:"{content.border.color}",borderWidth:"0",borderRadius:"0"},Jk={padding:"0.375rem 1.125rem"},Qk={fontWeight:"600"},ew={padding:"0 1.125rem 1.125rem 1.125rem"},ow={padding:"0 1.125rem 1.125rem 1.125rem"},tw={root:Xk,header:qk,toggleableHeader:Jk,title:Qk,content:ew,footer:ow},rw={gap:"0.5rem",transitionDuration:"{transition.duration}"},nw={background:"{content.background}",borderColor:"{content.border.color}",borderWidth:"1px",color:"{content.color}",padding:"0.25rem 0.25rem",borderRadius:"{content.border.radius}",first:{borderWidth:"1px",topBorderRadius:"{content.border.radius}"},last:{borderWidth:"1px",bottomBorderRadius:"{content.border.radius}"}},iw={focusBackground:"{navigation.item.focus.background}",color:"{navigation.item.color}",focusColor:"{navigation.item.focus.color}",gap:"0.5rem",padding:"{navigation.item.padding}",borderRadius:"{content.border.radius}",icon:{color:"{navigation.item.icon.color}",focusColor:"{navigation.item.icon.focus.color}"}},aw={indent:"1rem"},sw={color:"{navigation.submenu.icon.color}",focusColor:"{navigation.submenu.icon.focus.color}"},lw={root:rw,panel:nw,item:iw,submenu:aw,submenuIcon:sw},cw={background:"{content.border.color}",borderRadius:"{content.border.radius}",height:".75rem"},dw={color:"{form.field.icon.color}"},uw={background:"{overlay.popover.background}",borderColor:"{overlay.popover.border.color}",borderRadius:"{overlay.popover.border.radius}",color:"{overlay.popover.color}",padding:"{overlay.popover.padding}",shadow:"{overlay.popover.shadow}"},fw={gap:"0.5rem"},pw={light:{strength:{weakBackground:"{red.500}",mediumBackground:"{amber.500}",strongBackground:"{green.500}"}},dark:{strength:{weakBackground:"{red.400}",mediumBackground:"{amber.400}",strongBackground:"{green.400}"}}},gw={meter:cw,icon:dw,overlay:uw,content:fw,colorScheme:pw},hw={gap:"1.125rem"},bw={gap:"0.5rem"},mw={root:hw,controls:bw},vw={background:"{overlay.popover.background}",borderColor:"{overlay.popover.border.color}",color:"{overlay.popover.color}",borderRadius:"{overlay.popover.border.radius}",shadow:"{overlay.popover.shadow}",gutter:"10px",arrowOffset:"1.25rem"},yw={padding:"{overlay.popover.padding}"},kw={root:vw,content:yw},ww={background:"{content.border.color}",borderRadius:"{content.border.radius}",height:"1.25rem"},xw={background:"{primary.color}"},_w={color:"{primary.contrast.color}",fontSize:"0.75rem",fontWeight:"600"},Cw={root:ww,value:xw,label:_w},$w={light:{root:{colorOne:"{red.500}",colorTwo:"{blue.500}",colorThree:"{green.500}",colorFour:"{yellow.500}"}},dark:{root:{colorOne:"{red.400}",colorTwo:"{blue.400}",colorThree:"{green.400}",colorFour:"{yellow.400}"}}},Sw={colorScheme:$w},Rw={width:"1.25rem",height:"1.25rem",background:"{form.field.background}",checkedBackground:"{primary.color}",checkedHoverBackground:"{primary.hover.color}",disabledBackground:"{form.field.disabled.background}",filledBackground:"{form.field.filled.background}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.hover.border.color}",focusBorderColor:"{form.field.border.color}",checkedBorderColor:"{primary.color}",checkedHoverBorderColor:"{primary.hover.color}",checkedFocusBorderColor:"{primary.color}",checkedDisabledBorderColor:"{form.field.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",shadow:"{form.field.shadow}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}",sm:{width:"1rem",height:"1rem"},lg:{width:"1.5rem",height:"1.5rem"}},Ew={size:"0.75rem",checkedColor:"{primary.contrast.color}",checkedHoverColor:"{primary.contrast.color}",disabledColor:"{form.field.disabled.color}",sm:{size:"0.5rem"},lg:{size:"1rem"}},Tw={root:Rw,icon:Ew},Aw={gap:"0.25rem",transitionDuration:"{transition.duration}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Bw={size:"1rem",color:"{text.muted.color}",hoverColor:"{primary.color}",activeColor:"{primary.color}"},zw={root:Aw,icon:Bw},Ow={light:{root:{background:"rgba(0,0,0,0.1)"}},dark:{root:{background:"rgba(255,255,255,0.3)"}}},Iw={colorScheme:Ow},Pw={transitionDuration:"{transition.duration}"},Dw={size:"9px",borderRadius:"{border.radius.sm}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Nw={light:{bar:{background:"{surface.100}"}},dark:{bar:{background:"{surface.800}"}}},Lw={root:Pw,bar:Dw,colorScheme:Nw},Mw={background:"{form.field.background}",disabledBackground:"{form.field.disabled.background}",filledBackground:"{form.field.filled.background}",filledHoverBackground:"{form.field.filled.hover.background}",filledFocusBackground:"{form.field.filled.focus.background}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.hover.border.color}",focusBorderColor:"{form.field.focus.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",color:"{form.field.color}",disabledColor:"{form.field.disabled.color}",placeholderColor:"{form.field.placeholder.color}",invalidPlaceholderColor:"{form.field.invalid.placeholder.color}",shadow:"{form.field.shadow}",paddingX:"{form.field.padding.x}",paddingY:"{form.field.padding.y}",borderRadius:"{form.field.border.radius}",focusRing:{width:"{form.field.focus.ring.width}",style:"{form.field.focus.ring.style}",color:"{form.field.focus.ring.color}",offset:"{form.field.focus.ring.offset}",shadow:"{form.field.focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}",sm:{fontSize:"{form.field.sm.font.size}",paddingX:"{form.field.sm.padding.x}",paddingY:"{form.field.sm.padding.y}"},lg:{fontSize:"{form.field.lg.font.size}",paddingX:"{form.field.lg.padding.x}",paddingY:"{form.field.lg.padding.y}"}},Fw={width:"2.5rem",color:"{form.field.icon.color}"},jw={background:"{overlay.select.background}",borderColor:"{overlay.select.border.color}",borderRadius:"{overlay.select.border.radius}",color:"{overlay.select.color}",shadow:"{overlay.select.shadow}"},Ww={padding:"{list.padding}",gap:"{list.gap}",header:{padding:"{list.header.padding}"}},Uw={focusBackground:"{list.option.focus.background}",selectedBackground:"{list.option.selected.background}",selectedFocusBackground:"{list.option.selected.focus.background}",color:"{list.option.color}",focusColor:"{list.option.focus.color}",selectedColor:"{list.option.selected.color}",selectedFocusColor:"{list.option.selected.focus.color}",padding:"{list.option.padding}",borderRadius:"{list.option.border.radius}"},Zw={background:"{list.option.group.background}",color:"{list.option.group.color}",fontWeight:"{list.option.group.font.weight}",padding:"{list.option.group.padding}"},Hw={color:"{form.field.icon.color}"},Vw={color:"{list.option.color}",gutterStart:"-0.375rem",gutterEnd:"0.375rem"},Gw={padding:"{list.option.padding}"},Kw={root:Mw,dropdown:Fw,overlay:jw,list:Ww,option:Uw,optionGroup:Zw,clearIcon:Hw,checkmark:Vw,emptyMessage:Gw},Yw={borderRadius:"{form.field.border.radius}"},Xw={light:{root:{invalidBorderColor:"{form.field.invalid.border.color}"}},dark:{root:{invalidBorderColor:"{form.field.invalid.border.color}"}}},qw={root:Yw,colorScheme:Xw},Jw={borderRadius:"{content.border.radius}"},Qw={light:{root:{background:"{surface.200}",animationBackground:"rgba(255,255,255,0.4)"}},dark:{root:{background:"rgba(255, 255, 255, 0.06)",animationBackground:"rgba(255, 255, 255, 0.04)"}}},ex={root:Jw,colorScheme:Qw},ox={transitionDuration:"{transition.duration}"},tx={background:"{content.border.color}",borderRadius:"{content.border.radius}",size:"3px"},rx={background:"{primary.color}"},nx={width:"20px",height:"20px",borderRadius:"50%",background:"{content.border.color}",hoverBackground:"{content.border.color}",content:{borderRadius:"50%",hoverBackground:"{content.background}",width:"16px",height:"16px",shadow:"0px 0.5px 0px 0px rgba(0, 0, 0, 0.08), 0px 1px 1px 0px rgba(0, 0, 0, 0.14)"},focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},ix={light:{handle:{content:{background:"{surface.0}"}}},dark:{handle:{content:{background:"{surface.950}"}}}},ax={root:ox,track:tx,range:rx,handle:nx,colorScheme:ix},sx={gap:"0.5rem",transitionDuration:"{transition.duration}"},lx={root:sx},cx={borderRadius:"{form.field.border.radius}",roundedBorderRadius:"2rem",raisedShadow:"0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)"},dx={root:cx},ux={background:"{content.background}",borderColor:"{content.border.color}",color:"{content.color}",transitionDuration:"{transition.duration}"},fx={background:"{content.border.color}"},px={size:"24px",background:"transparent",borderRadius:"{content.border.radius}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},gx={root:ux,gutter:fx,handle:px},hx={transitionDuration:"{transition.duration}"},bx={background:"{content.border.color}",activeBackground:"{primary.color}",margin:"0 0 0 1.625rem",size:"2px"},mx={padding:"0.5rem",gap:"1rem"},vx={padding:"0",borderRadius:"{content.border.radius}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"},gap:"0.5rem"},yx={color:"{text.muted.color}",activeColor:"{primary.color}",fontWeight:"500"},kx={background:"{content.background}",activeBackground:"{content.background}",borderColor:"{content.border.color}",activeBorderColor:"{content.border.color}",color:"{text.muted.color}",activeColor:"{primary.color}",size:"2rem",fontSize:"1.143rem",fontWeight:"500",borderRadius:"50%",shadow:"0px 0.5px 0px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.12)"},wx={padding:"0.875rem 0.5rem 1.125rem 0.5rem"},xx={background:"{content.background}",color:"{content.color}",padding:"0",indent:"1rem"},_x={root:hx,separator:bx,step:mx,stepHeader:vx,stepTitle:yx,stepNumber:kx,steppanels:wx,steppanel:xx},Cx={transitionDuration:"{transition.duration}"},$x={background:"{content.border.color}"},Sx={borderRadius:"{content.border.radius}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"},gap:"0.5rem"},Rx={color:"{text.muted.color}",activeColor:"{primary.color}",fontWeight:"500"},Ex={background:"{content.background}",activeBackground:"{content.background}",borderColor:"{content.border.color}",activeBorderColor:"{content.border.color}",color:"{text.muted.color}",activeColor:"{primary.color}",size:"2rem",fontSize:"1.143rem",fontWeight:"500",borderRadius:"50%",shadow:"0px 0.5px 0px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.12)"},Tx={root:Cx,separator:$x,itemLink:Sx,itemLabel:Rx,itemNumber:Ex},Ax={transitionDuration:"{transition.duration}"},Bx={borderWidth:"0 0 1px 0",background:"{content.background}",borderColor:"{content.border.color}"},zx={background:"transparent",hoverBackground:"transparent",activeBackground:"transparent",borderWidth:"0 0 1px 0",borderColor:"{content.border.color}",hoverBorderColor:"{content.border.color}",activeBorderColor:"{primary.color}",color:"{text.muted.color}",hoverColor:"{text.color}",activeColor:"{primary.color}",padding:"1rem 1.125rem",fontWeight:"600",margin:"0 0 -1px 0",gap:"0.5rem",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},Ox={color:"{text.muted.color}",hoverColor:"{text.color}",activeColor:"{primary.color}"},Ix={height:"1px",bottom:"-1px",background:"{primary.color}"},Px={root:Ax,tablist:Bx,item:zx,itemIcon:Ox,activeBar:Ix},Dx={transitionDuration:"{transition.duration}"},Nx={borderWidth:"0 0 1px 0",background:"{content.background}",borderColor:"{content.border.color}"},Lx={background:"transparent",hoverBackground:"transparent",activeBackground:"transparent",borderWidth:"0 0 1px 0",borderColor:"{content.border.color}",hoverBorderColor:"{content.border.color}",activeBorderColor:"{primary.color}",color:"{text.muted.color}",hoverColor:"{text.color}",activeColor:"{primary.color}",padding:"1rem 1.125rem",fontWeight:"600",margin:"0 0 -1px 0",gap:"0.5rem",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"-1px",shadow:"{focus.ring.shadow}"}},Mx={background:"{content.background}",color:"{content.color}",padding:"0.875rem 1.125rem 1.125rem 1.125rem",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"inset {focus.ring.shadow}"}},Fx={background:"{content.background}",color:"{text.muted.color}",hoverColor:"{text.color}",width:"2.5rem",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"-1px",shadow:"{focus.ring.shadow}"}},jx={height:"1px",bottom:"-1px",background:"{primary.color}"},Wx={light:{navButton:{shadow:"0px 0px 10px 50px rgba(255, 255, 255, 0.6)"}},dark:{navButton:{shadow:"0px 0px 10px 50px color-mix(in srgb, {content.background}, transparent 50%)"}}},Ux={root:Dx,tablist:Nx,tab:Lx,tabpanel:Mx,navButton:Fx,activeBar:jx,colorScheme:Wx},Zx={transitionDuration:"{transition.duration}"},Hx={background:"{content.background}",borderColor:"{content.border.color}"},Vx={borderColor:"{content.border.color}",activeBorderColor:"{primary.color}",color:"{text.muted.color}",hoverColor:"{text.color}",activeColor:"{primary.color}"},Gx={background:"{content.background}",color:"{content.color}"},Kx={background:"{content.background}",color:"{text.muted.color}",hoverColor:"{text.color}"},Yx={light:{navButton:{shadow:"0px 0px 10px 50px rgba(255, 255, 255, 0.6)"}},dark:{navButton:{shadow:"0px 0px 10px 50px color-mix(in srgb, {content.background}, transparent 50%)"}}},Xx={root:Zx,tabList:Hx,tab:Vx,tabPanel:Gx,navButton:Kx,colorScheme:Yx},qx={fontSize:"0.875rem",fontWeight:"700",padding:"0.25rem 0.5rem",gap:"0.25rem",borderRadius:"{content.border.radius}",roundedBorderRadius:"{border.radius.xl}"},Jx={size:"0.75rem"},Qx={light:{primary:{background:"{primary.100}",color:"{primary.700}"},secondary:{background:"{surface.100}",color:"{surface.600}"},success:{background:"{green.100}",color:"{green.700}"},info:{background:"{sky.100}",color:"{sky.700}"},warn:{background:"{orange.100}",color:"{orange.700}"},danger:{background:"{red.100}",color:"{red.700}"},contrast:{background:"{surface.950}",color:"{surface.0}"}},dark:{primary:{background:"color-mix(in srgb, {primary.500}, transparent 84%)",color:"{primary.300}"},secondary:{background:"{surface.800}",color:"{surface.300}"},success:{background:"color-mix(in srgb, {green.500}, transparent 84%)",color:"{green.300}"},info:{background:"color-mix(in srgb, {sky.500}, transparent 84%)",color:"{sky.300}"},warn:{background:"color-mix(in srgb, {orange.500}, transparent 84%)",color:"{orange.300}"},danger:{background:"color-mix(in srgb, {red.500}, transparent 84%)",color:"{red.300}"},contrast:{background:"{surface.0}",color:"{surface.950}"}}},e_={root:qx,icon:Jx,colorScheme:Qx},o_={background:"{form.field.background}",borderColor:"{form.field.border.color}",color:"{form.field.color}",height:"18rem",padding:"{form.field.padding.y} {form.field.padding.x}",borderRadius:"{form.field.border.radius}"},t_={gap:"0.25rem"},r_={margin:"2px 0"},n_={root:o_,prompt:t_,commandResponse:r_},i_={background:"{form.field.background}",disabledBackground:"{form.field.disabled.background}",filledBackground:"{form.field.filled.background}",filledHoverBackground:"{form.field.filled.hover.background}",filledFocusBackground:"{form.field.filled.focus.background}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.hover.border.color}",focusBorderColor:"{form.field.focus.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",color:"{form.field.color}",disabledColor:"{form.field.disabled.color}",placeholderColor:"{form.field.placeholder.color}",invalidPlaceholderColor:"{form.field.invalid.placeholder.color}",shadow:"{form.field.shadow}",paddingX:"{form.field.padding.x}",paddingY:"{form.field.padding.y}",borderRadius:"{form.field.border.radius}",focusRing:{width:"{form.field.focus.ring.width}",style:"{form.field.focus.ring.style}",color:"{form.field.focus.ring.color}",offset:"{form.field.focus.ring.offset}",shadow:"{form.field.focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}",sm:{fontSize:"{form.field.sm.font.size}",paddingX:"{form.field.sm.padding.x}",paddingY:"{form.field.sm.padding.y}"},lg:{fontSize:"{form.field.lg.font.size}",paddingX:"{form.field.lg.padding.x}",paddingY:"{form.field.lg.padding.y}"}},a_={root:i_},s_={background:"{content.background}",borderColor:"{content.border.color}",color:"{content.color}",borderRadius:"{content.border.radius}",shadow:"{overlay.navigation.shadow}",transitionDuration:"{transition.duration}"},l_={padding:"{navigation.list.padding}",gap:"{navigation.list.gap}"},c_={focusBackground:"{navigation.item.focus.background}",activeBackground:"{navigation.item.active.background}",color:"{navigation.item.color}",focusColor:"{navigation.item.focus.color}",activeColor:"{navigation.item.active.color}",padding:"{navigation.item.padding}",borderRadius:"{navigation.item.border.radius}",gap:"{navigation.item.gap}",icon:{color:"{navigation.item.icon.color}",focusColor:"{navigation.item.icon.focus.color}",activeColor:"{navigation.item.icon.active.color}"}},d_={mobileIndent:"1rem"},u_={size:"{navigation.submenu.icon.size}",color:"{navigation.submenu.icon.color}",focusColor:"{navigation.submenu.icon.focus.color}",activeColor:"{navigation.submenu.icon.active.color}"},f_={borderColor:"{content.border.color}"},p_={root:s_,list:l_,item:c_,submenu:d_,submenuIcon:u_,separator:f_},g_={minHeight:"5rem"},h_={eventContent:{padding:"1rem 0"}},b_={eventContent:{padding:"0 1rem"}},m_={size:"1.125rem",borderRadius:"50%",borderWidth:"2px",background:"{content.background}",borderColor:"{content.border.color}",content:{borderRadius:"50%",size:"0.375rem",background:"{primary.color}",insetShadow:"0px 0.5px 0px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.12)"}},v_={color:"{content.border.color}",size:"2px"},y_={event:g_,horizontal:h_,vertical:b_,eventMarker:m_,eventConnector:v_},k_={width:"25rem",borderRadius:"{content.border.radius}",borderWidth:"1px",transitionDuration:"{transition.duration}"},w_={size:"1.125rem"},x_={padding:"{overlay.popover.padding}",gap:"0.5rem"},__={gap:"0.5rem"},C_={fontWeight:"500",fontSize:"1rem"},$_={fontWeight:"500",fontSize:"0.875rem"},S_={width:"1.75rem",height:"1.75rem",borderRadius:"50%",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",offset:"{focus.ring.offset}"}},R_={size:"1rem"},E_={light:{root:{blur:"1.5px"},info:{background:"color-mix(in srgb, {blue.50}, transparent 5%)",borderColor:"{blue.200}",color:"{blue.600}",detailColor:"{surface.700}",shadow:"0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)",closeButton:{hoverBackground:"{blue.100}",focusRing:{color:"{blue.600}",shadow:"none"}}},success:{background:"color-mix(in srgb, {green.50}, transparent 5%)",borderColor:"{green.200}",color:"{green.600}",detailColor:"{surface.700}",shadow:"0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)",closeButton:{hoverBackground:"{green.100}",focusRing:{color:"{green.600}",shadow:"none"}}},warn:{background:"color-mix(in srgb,{yellow.50}, transparent 5%)",borderColor:"{yellow.200}",color:"{yellow.600}",detailColor:"{surface.700}",shadow:"0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)",closeButton:{hoverBackground:"{yellow.100}",focusRing:{color:"{yellow.600}",shadow:"none"}}},error:{background:"color-mix(in srgb, {red.50}, transparent 5%)",borderColor:"{red.200}",color:"{red.600}",detailColor:"{surface.700}",shadow:"0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)",closeButton:{hoverBackground:"{red.100}",focusRing:{color:"{red.600}",shadow:"none"}}},secondary:{background:"{surface.100}",borderColor:"{surface.200}",color:"{surface.600}",detailColor:"{surface.700}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)",closeButton:{hoverBackground:"{surface.200}",focusRing:{color:"{surface.600}",shadow:"none"}}},contrast:{background:"{surface.900}",borderColor:"{surface.950}",color:"{surface.50}",detailColor:"{surface.0}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)",closeButton:{hoverBackground:"{surface.800}",focusRing:{color:"{surface.50}",shadow:"none"}}}},dark:{root:{blur:"10px"},info:{background:"color-mix(in srgb, {blue.500}, transparent 84%)",borderColor:"color-mix(in srgb, {blue.700}, transparent 64%)",color:"{blue.500}",detailColor:"{surface.0}",shadow:"0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)",closeButton:{hoverBackground:"rgba(255, 255, 255, 0.05)",focusRing:{color:"{blue.500}",shadow:"none"}}},success:{background:"color-mix(in srgb, {green.500}, transparent 84%)",borderColor:"color-mix(in srgb, {green.700}, transparent 64%)",color:"{green.500}",detailColor:"{surface.0}",shadow:"0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)",closeButton:{hoverBackground:"rgba(255, 255, 255, 0.05)",focusRing:{color:"{green.500}",shadow:"none"}}},warn:{background:"color-mix(in srgb, {yellow.500}, transparent 84%)",borderColor:"color-mix(in srgb, {yellow.700}, transparent 64%)",color:"{yellow.500}",detailColor:"{surface.0}",shadow:"0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)",closeButton:{hoverBackground:"rgba(255, 255, 255, 0.05)",focusRing:{color:"{yellow.500}",shadow:"none"}}},error:{background:"color-mix(in srgb, {red.500}, transparent 84%)",borderColor:"color-mix(in srgb, {red.700}, transparent 64%)",color:"{red.500}",detailColor:"{surface.0}",shadow:"0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)",closeButton:{hoverBackground:"rgba(255, 255, 255, 0.05)",focusRing:{color:"{red.500}",shadow:"none"}}},secondary:{background:"{surface.800}",borderColor:"{surface.700}",color:"{surface.300}",detailColor:"{surface.0}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)",closeButton:{hoverBackground:"{surface.700}",focusRing:{color:"{surface.300}",shadow:"none"}}},contrast:{background:"{surface.0}",borderColor:"{surface.100}",color:"{surface.950}",detailColor:"{surface.950}",shadow:"0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)",closeButton:{hoverBackground:"{surface.100}",focusRing:{color:"{surface.950}",shadow:"none"}}}}},T_={root:k_,icon:w_,content:x_,text:__,summary:C_,detail:$_,closeButton:S_,closeIcon:R_,colorScheme:E_},A_={padding:"0.25rem",borderRadius:"{content.border.radius}",gap:"0.5rem",fontWeight:"500",disabledBackground:"{form.field.disabled.background}",disabledBorderColor:"{form.field.disabled.background}",disabledColor:"{form.field.disabled.color}",invalidBorderColor:"{form.field.invalid.border.color}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}",sm:{fontSize:"{form.field.sm.font.size}",padding:"0.25rem"},lg:{fontSize:"{form.field.lg.font.size}",padding:"0.25rem"}},B_={disabledColor:"{form.field.disabled.color}"},z_={padding:"0.25rem 0.75rem",borderRadius:"{content.border.radius}",checkedShadow:"0px 1px 2px 0px rgba(0, 0, 0, 0.02), 0px 1px 2px 0px rgba(0, 0, 0, 0.04)",sm:{padding:"0.25rem 0.75rem"},lg:{padding:"0.25rem 0.75rem"}},O_={light:{root:{background:"{surface.100}",checkedBackground:"{surface.100}",hoverBackground:"{surface.100}",borderColor:"{surface.100}",color:"{surface.500}",hoverColor:"{surface.700}",checkedColor:"{surface.900}",checkedBorderColor:"{surface.100}"},content:{checkedBackground:"{surface.0}"},icon:{color:"{surface.500}",hoverColor:"{surface.700}",checkedColor:"{surface.900}"}},dark:{root:{background:"{surface.950}",checkedBackground:"{surface.950}",hoverBackground:"{surface.950}",borderColor:"{surface.950}",color:"{surface.400}",hoverColor:"{surface.300}",checkedColor:"{surface.0}",checkedBorderColor:"{surface.950}"},content:{checkedBackground:"{surface.800}"},icon:{color:"{surface.400}",hoverColor:"{surface.300}",checkedColor:"{surface.0}"}}},I_={root:A_,icon:B_,content:z_,colorScheme:O_},P_={width:"2.5rem",height:"1.5rem",borderRadius:"30px",gap:"0.25rem",shadow:"{form.field.shadow}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"},borderWidth:"1px",borderColor:"transparent",hoverBorderColor:"transparent",checkedBorderColor:"transparent",checkedHoverBorderColor:"transparent",invalidBorderColor:"{form.field.invalid.border.color}",transitionDuration:"{form.field.transition.duration}",slideDuration:"0.2s"},D_={borderRadius:"50%",size:"1rem"},N_={light:{root:{background:"{surface.300}",disabledBackground:"{form.field.disabled.background}",hoverBackground:"{surface.400}",checkedBackground:"{primary.color}",checkedHoverBackground:"{primary.hover.color}"},handle:{background:"{surface.0}",disabledBackground:"{form.field.disabled.color}",hoverBackground:"{surface.0}",checkedBackground:"{surface.0}",checkedHoverBackground:"{surface.0}",color:"{text.muted.color}",hoverColor:"{text.color}",checkedColor:"{primary.color}",checkedHoverColor:"{primary.hover.color}"}},dark:{root:{background:"{surface.700}",disabledBackground:"{surface.600}",hoverBackground:"{surface.600}",checkedBackground:"{primary.color}",checkedHoverBackground:"{primary.hover.color}"},handle:{background:"{surface.400}",disabledBackground:"{surface.900}",hoverBackground:"{surface.300}",checkedBackground:"{surface.900}",checkedHoverBackground:"{surface.900}",color:"{surface.900}",hoverColor:"{surface.800}",checkedColor:"{primary.color}",checkedHoverColor:"{primary.hover.color}"}}},L_={root:P_,handle:D_,colorScheme:N_},M_={background:"{content.background}",borderColor:"{content.border.color}",borderRadius:"{content.border.radius}",color:"{content.color}",gap:"0.5rem",padding:"0.75rem"},F_={root:M_},j_={maxWidth:"12.5rem",gutter:"0.25rem",shadow:"{overlay.popover.shadow}",padding:"0.5rem 0.75rem",borderRadius:"{overlay.popover.border.radius}"},W_={light:{root:{background:"{surface.700}",color:"{surface.0}"}},dark:{root:{background:"{surface.700}",color:"{surface.0}"}}},U_={root:j_,colorScheme:W_},Z_={background:"{content.background}",color:"{content.color}",padding:"1rem",gap:"2px",indent:"1rem",transitionDuration:"{transition.duration}"},H_={padding:"0.25rem 0.5rem",borderRadius:"{content.border.radius}",hoverBackground:"{content.hover.background}",selectedBackground:"{highlight.background}",color:"{text.color}",hoverColor:"{text.hover.color}",selectedColor:"{highlight.color}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"-1px",shadow:"{focus.ring.shadow}"},gap:"0.25rem"},V_={color:"{text.muted.color}",hoverColor:"{text.hover.muted.color}",selectedColor:"{highlight.color}"},G_={borderRadius:"50%",size:"1.75rem",hoverBackground:"{content.hover.background}",selectedHoverBackground:"{content.background}",color:"{text.muted.color}",hoverColor:"{text.hover.muted.color}",selectedHoverColor:"{primary.color}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},K_={size:"2rem"},Y_={margin:"0 0 0.5rem 0"},X_=`
    .p-tree-mask.p-overlay-mask {
        --px-mask-background: light-dark(rgba(255,255,255,0.5),rgba(0,0,0,0.3));
    }
`,q_={root:Z_,node:H_,nodeIcon:V_,nodeToggleButton:G_,loadingIcon:K_,filter:Y_,css:X_},J_={background:"{form.field.background}",disabledBackground:"{form.field.disabled.background}",filledBackground:"{form.field.filled.background}",filledHoverBackground:"{form.field.filled.hover.background}",filledFocusBackground:"{form.field.filled.focus.background}",borderColor:"{form.field.border.color}",hoverBorderColor:"{form.field.hover.border.color}",focusBorderColor:"{form.field.focus.border.color}",invalidBorderColor:"{form.field.invalid.border.color}",color:"{form.field.color}",disabledColor:"{form.field.disabled.color}",placeholderColor:"{form.field.placeholder.color}",invalidPlaceholderColor:"{form.field.invalid.placeholder.color}",shadow:"{form.field.shadow}",paddingX:"{form.field.padding.x}",paddingY:"{form.field.padding.y}",borderRadius:"{form.field.border.radius}",focusRing:{width:"{form.field.focus.ring.width}",style:"{form.field.focus.ring.style}",color:"{form.field.focus.ring.color}",offset:"{form.field.focus.ring.offset}",shadow:"{form.field.focus.ring.shadow}"},transitionDuration:"{form.field.transition.duration}",sm:{fontSize:"{form.field.sm.font.size}",paddingX:"{form.field.sm.padding.x}",paddingY:"{form.field.sm.padding.y}"},lg:{fontSize:"{form.field.lg.font.size}",paddingX:"{form.field.lg.padding.x}",paddingY:"{form.field.lg.padding.y}"}},Q_={width:"2.5rem",color:"{form.field.icon.color}"},eC={background:"{overlay.select.background}",borderColor:"{overlay.select.border.color}",borderRadius:"{overlay.select.border.radius}",color:"{overlay.select.color}",shadow:"{overlay.select.shadow}"},oC={padding:"{list.padding}"},tC={padding:"{list.option.padding}"},rC={borderRadius:"{border.radius.sm}"},nC={color:"{form.field.icon.color}"},iC={root:J_,dropdown:Q_,overlay:eC,tree:oC,emptyMessage:tC,chip:rC,clearIcon:nC},aC={transitionDuration:"{transition.duration}"},sC={background:"{content.background}",borderColor:"{treetable.border.color}",color:"{content.color}",borderWidth:"0 0 1px 0",padding:"0.75rem 1rem"},lC={background:"{content.background}",hoverBackground:"{content.hover.background}",selectedBackground:"{highlight.background}",borderColor:"{treetable.border.color}",color:"{content.color}",hoverColor:"{content.hover.color}",selectedColor:"{highlight.color}",gap:"0.5rem",padding:"0.75rem 1rem",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"-1px",shadow:"{focus.ring.shadow}"}},cC={fontWeight:"600"},dC={background:"{content.background}",hoverBackground:"{content.hover.background}",selectedBackground:"{highlight.background}",color:"{content.color}",hoverColor:"{content.hover.color}",selectedColor:"{highlight.color}",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"-1px",shadow:"{focus.ring.shadow}"}},uC={borderColor:"{treetable.border.color}",padding:"0.75rem 1rem",gap:"0.5rem"},fC={background:"{content.background}",borderColor:"{treetable.border.color}",color:"{content.color}",padding:"0.75rem 1rem"},pC={fontWeight:"600"},gC={background:"{content.background}",borderColor:"{treetable.border.color}",color:"{content.color}",borderWidth:"0 0 1px 0",padding:"0.75rem 1rem"},hC={width:"0.5rem"},bC={width:"1px",color:"{primary.color}"},mC={color:"{text.muted.color}",hoverColor:"{text.hover.muted.color}",size:"0.875rem"},vC={size:"2rem"},yC={hoverBackground:"{content.hover.background}",selectedHoverBackground:"{content.background}",color:"{text.muted.color}",hoverColor:"{text.color}",selectedHoverColor:"{primary.color}",size:"1.75rem",borderRadius:"50%",focusRing:{width:"{focus.ring.width}",style:"{focus.ring.style}",color:"{focus.ring.color}",offset:"{focus.ring.offset}",shadow:"{focus.ring.shadow}"}},kC={borderColor:"{content.border.color}",borderWidth:"0 0 1px 0"},wC={borderColor:"{content.border.color}",borderWidth:"0 0 1px 0"},xC={light:{root:{borderColor:"{content.border.color}"},bodyCell:{selectedBorderColor:"{primary.100}"}},dark:{root:{borderColor:"{surface.800}"},bodyCell:{selectedBorderColor:"{primary.900}"}}},_C=`
    .p-treetable-mask.p-overlay-mask {
        --px-mask-background: light-dark(rgba(255,255,255,0.5),rgba(0,0,0,0.3));
    }
`,CC={root:aC,header:sC,headerCell:lC,columnTitle:cC,row:dC,bodyCell:uC,footerCell:fC,columnFooter:pC,footer:gC,columnResizer:hC,resizeIndicator:bC,sortIcon:mC,loadingIcon:vC,nodeToggleButton:yC,paginatorTop:kC,paginatorBottom:wC,colorScheme:xC,css:_C},$C={mask:{background:"{content.background}",color:"{text.muted.color}"},icon:{size:"2rem"}},SC={loader:$C},RC=Object.defineProperty,EC=Object.defineProperties,TC=Object.getOwnPropertyDescriptors,Tl=Object.getOwnPropertySymbols,AC=Object.prototype.hasOwnProperty,BC=Object.prototype.propertyIsEnumerable,Al=(e,o,t)=>o in e?RC(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t,Bl,ZR=(Bl=((e,o)=>{for(var t in o||(o={}))AC.call(o,t)&&Al(e,t,o[t]);if(Tl)for(var t of Tl(o))BC.call(o,t)&&Al(e,t,o[t]);return e})({},jb),EC(Bl,TC({components:{accordion:hb,autocomplete:$b,avatar:Bb,badge:Lb,blockui:Ub,breadcrumb:Gb,button:Xb,card:tm,carousel:lm,cascadeselect:hm,checkbox:vm,chip:Cm,colorpicker:Tm,confirmdialog:zm,confirmpopup:Nm,contextmenu:Zm,datatable:f0,dataview:y0,datepicker:M0,dialog:H0,divider:X0,dock:Q0,drawer:iv,editor:uv,fieldset:bv,fileupload:Cv,floatlabel:Tv,galleria:Zv,iconfield:Vv,iftalabel:Yv,image:ey,imagecompare:ty,inlinemessage:sy,inplace:dy,inputchips:gy,inputgroup:by,inputnumber:ky,inputotp:_y,inputtext:$y,knob:Ay,listbox:Ly,megamenu:Ky,menu:ek,menubar:sk,message:mk,metergroup:Ck,multiselect:Ik,orderlist:Nk,organizationchart:Wk,overlaybadge:Zk,paginator:Yk,panel:tw,panelmenu:lw,password:gw,picklist:mw,popover:kw,progressbar:Cw,progressspinner:Sw,radiobutton:Tw,rating:zw,ripple:Iw,scrollpanel:Lw,select:Kw,selectbutton:qw,skeleton:ex,slider:ax,speeddial:lx,splitbutton:dx,splitter:gx,stepper:_x,steps:Tx,tabmenu:Px,tabs:Ux,tabview:Xx,tag:e_,terminal:n_,textarea:a_,tieredmenu:p_,timeline:y_,toast:T_,togglebutton:I_,toggleswitch:L_,toolbar:F_,tooltip:U_,tree:q_,treeselect:iC,treetable:CC,virtualscroller:SC},css:Hm}))),HR=`
    .p-badge {
        display: inline-flex;
        border-radius: dt('badge.border.radius');
        align-items: center;
        justify-content: center;
        padding: dt('badge.padding');
        background: dt('badge.primary.background');
        color: dt('badge.primary.color');
        font-size: dt('badge.font.size');
        font-weight: dt('badge.font.weight');
        min-width: dt('badge.min.width');
        height: dt('badge.height');
    }

    .p-badge-dot {
        width: dt('badge.dot.size');
        min-width: dt('badge.dot.size');
        height: dt('badge.dot.size');
        border-radius: 50%;
        padding: 0;
    }

    .p-badge-circle {
        padding: 0;
        border-radius: 50%;
    }

    .p-badge-secondary {
        background: dt('badge.secondary.background');
        color: dt('badge.secondary.color');
    }

    .p-badge-success {
        background: dt('badge.success.background');
        color: dt('badge.success.color');
    }

    .p-badge-info {
        background: dt('badge.info.background');
        color: dt('badge.info.color');
    }

    .p-badge-warn {
        background: dt('badge.warn.background');
        color: dt('badge.warn.color');
    }

    .p-badge-danger {
        background: dt('badge.danger.background');
        color: dt('badge.danger.color');
    }

    .p-badge-contrast {
        background: dt('badge.contrast.background');
        color: dt('badge.contrast.color');
    }

    .p-badge-sm {
        font-size: dt('badge.sm.font.size');
        min-width: dt('badge.sm.min.width');
        height: dt('badge.sm.height');
    }

    .p-badge-lg {
        font-size: dt('badge.lg.font.size');
        min-width: dt('badge.lg.min.width');
        height: dt('badge.lg.height');
    }

    .p-badge-xl {
        font-size: dt('badge.xl.font.size');
        min-width: dt('badge.xl.min.width');
        height: dt('badge.xl.height');
    }
`,VR=`
    .p-ink {
        display: block;
        position: absolute;
        background: dt('ripple.background');
        border-radius: 100%;
        transform: scale(0);
        pointer-events: none;
    }

    .p-ink-active {
        animation: ripple 0.4s linear;
    }

    @keyframes ripple {
        100% {
            opacity: 0;
            transform: scale(2.5);
        }
    }
`,GR=`
    .p-button {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        color: dt('button.primary.color');
        background: dt('button.primary.background');
        border: 1px solid dt('button.primary.border.color');
        padding: dt('button.padding.y') dt('button.padding.x');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('button.transition.duration'),
            color dt('button.transition.duration'),
            border-color dt('button.transition.duration'),
            outline-color dt('button.transition.duration'),
            box-shadow dt('button.transition.duration');
        border-radius: dt('button.border.radius');
        outline-color: transparent;
        gap: dt('button.gap');
    }

    .p-button:disabled {
        cursor: default;
    }

    .p-button-icon-right {
        order: 1;
    }

    .p-button-icon-right:dir(rtl) {
        order: -1;
    }

    .p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
        order: 1;
    }

    .p-button-icon-bottom {
        order: 2;
    }

    .p-button-icon-only {
        width: dt('button.icon.only.width');
        padding-inline-start: 0;
        padding-inline-end: 0;
        gap: 0;
    }

    .p-button-icon-only.p-button-rounded {
        border-radius: 50%;
        height: dt('button.icon.only.width');
    }

    .p-button-icon-only .p-button-label {
        visibility: hidden;
        width: 0;
    }

    .p-button-icon-only::after {
        content: "\0A0";
        visibility: hidden;
        width: 0;
    }

    .p-button-sm {
        font-size: dt('button.sm.font.size');
        padding: dt('button.sm.padding.y') dt('button.sm.padding.x');
    }

    .p-button-sm .p-button-icon {
        font-size: dt('button.sm.font.size');
    }

    .p-button-sm.p-button-icon-only {
        width: dt('button.sm.icon.only.width');
    }

    .p-button-sm.p-button-icon-only.p-button-rounded {
        height: dt('button.sm.icon.only.width');
    }

    .p-button-lg {
        font-size: dt('button.lg.font.size');
        padding: dt('button.lg.padding.y') dt('button.lg.padding.x');
    }

    .p-button-lg .p-button-icon {
        font-size: dt('button.lg.font.size');
    }

    .p-button-lg.p-button-icon-only {
        width: dt('button.lg.icon.only.width');
    }

    .p-button-lg.p-button-icon-only.p-button-rounded {
        height: dt('button.lg.icon.only.width');
    }

    .p-button-vertical {
        flex-direction: column;
    }

    .p-button-label {
        font-weight: dt('button.label.font.weight');
    }

    .p-button-fluid {
        width: 100%;
    }

    .p-button-fluid.p-button-icon-only {
        width: dt('button.icon.only.width');
    }

    .p-button:not(:disabled):hover {
        background: dt('button.primary.hover.background');
        border: 1px solid dt('button.primary.hover.border.color');
        color: dt('button.primary.hover.color');
    }

    .p-button:not(:disabled):active {
        background: dt('button.primary.active.background');
        border: 1px solid dt('button.primary.active.border.color');
        color: dt('button.primary.active.color');
    }

    .p-button:focus-visible {
        box-shadow: dt('button.primary.focus.ring.shadow');
        outline: dt('button.focus.ring.width') dt('button.focus.ring.style') dt('button.primary.focus.ring.color');
        outline-offset: dt('button.focus.ring.offset');
    }

    .p-button .p-badge {
        min-width: dt('button.badge.size');
        height: dt('button.badge.size');
        line-height: dt('button.badge.size');
    }

    .p-button-raised {
        box-shadow: dt('button.raised.shadow');
    }

    .p-button-rounded {
        border-radius: dt('button.rounded.border.radius');
    }

    .p-button-secondary {
        background: dt('button.secondary.background');
        border: 1px solid dt('button.secondary.border.color');
        color: dt('button.secondary.color');
    }

    .p-button-secondary:not(:disabled):hover {
        background: dt('button.secondary.hover.background');
        border: 1px solid dt('button.secondary.hover.border.color');
        color: dt('button.secondary.hover.color');
    }

    .p-button-secondary:not(:disabled):active {
        background: dt('button.secondary.active.background');
        border: 1px solid dt('button.secondary.active.border.color');
        color: dt('button.secondary.active.color');
    }

    .p-button-secondary:focus-visible {
        outline-color: dt('button.secondary.focus.ring.color');
        box-shadow: dt('button.secondary.focus.ring.shadow');
    }

    .p-button-success {
        background: dt('button.success.background');
        border: 1px solid dt('button.success.border.color');
        color: dt('button.success.color');
    }

    .p-button-success:not(:disabled):hover {
        background: dt('button.success.hover.background');
        border: 1px solid dt('button.success.hover.border.color');
        color: dt('button.success.hover.color');
    }

    .p-button-success:not(:disabled):active {
        background: dt('button.success.active.background');
        border: 1px solid dt('button.success.active.border.color');
        color: dt('button.success.active.color');
    }

    .p-button-success:focus-visible {
        outline-color: dt('button.success.focus.ring.color');
        box-shadow: dt('button.success.focus.ring.shadow');
    }

    .p-button-info {
        background: dt('button.info.background');
        border: 1px solid dt('button.info.border.color');
        color: dt('button.info.color');
    }

    .p-button-info:not(:disabled):hover {
        background: dt('button.info.hover.background');
        border: 1px solid dt('button.info.hover.border.color');
        color: dt('button.info.hover.color');
    }

    .p-button-info:not(:disabled):active {
        background: dt('button.info.active.background');
        border: 1px solid dt('button.info.active.border.color');
        color: dt('button.info.active.color');
    }

    .p-button-info:focus-visible {
        outline-color: dt('button.info.focus.ring.color');
        box-shadow: dt('button.info.focus.ring.shadow');
    }

    .p-button-warn {
        background: dt('button.warn.background');
        border: 1px solid dt('button.warn.border.color');
        color: dt('button.warn.color');
    }

    .p-button-warn:not(:disabled):hover {
        background: dt('button.warn.hover.background');
        border: 1px solid dt('button.warn.hover.border.color');
        color: dt('button.warn.hover.color');
    }

    .p-button-warn:not(:disabled):active {
        background: dt('button.warn.active.background');
        border: 1px solid dt('button.warn.active.border.color');
        color: dt('button.warn.active.color');
    }

    .p-button-warn:focus-visible {
        outline-color: dt('button.warn.focus.ring.color');
        box-shadow: dt('button.warn.focus.ring.shadow');
    }

    .p-button-help {
        background: dt('button.help.background');
        border: 1px solid dt('button.help.border.color');
        color: dt('button.help.color');
    }

    .p-button-help:not(:disabled):hover {
        background: dt('button.help.hover.background');
        border: 1px solid dt('button.help.hover.border.color');
        color: dt('button.help.hover.color');
    }

    .p-button-help:not(:disabled):active {
        background: dt('button.help.active.background');
        border: 1px solid dt('button.help.active.border.color');
        color: dt('button.help.active.color');
    }

    .p-button-help:focus-visible {
        outline-color: dt('button.help.focus.ring.color');
        box-shadow: dt('button.help.focus.ring.shadow');
    }

    .p-button-danger {
        background: dt('button.danger.background');
        border: 1px solid dt('button.danger.border.color');
        color: dt('button.danger.color');
    }

    .p-button-danger:not(:disabled):hover {
        background: dt('button.danger.hover.background');
        border: 1px solid dt('button.danger.hover.border.color');
        color: dt('button.danger.hover.color');
    }

    .p-button-danger:not(:disabled):active {
        background: dt('button.danger.active.background');
        border: 1px solid dt('button.danger.active.border.color');
        color: dt('button.danger.active.color');
    }

    .p-button-danger:focus-visible {
        outline-color: dt('button.danger.focus.ring.color');
        box-shadow: dt('button.danger.focus.ring.shadow');
    }

    .p-button-contrast {
        background: dt('button.contrast.background');
        border: 1px solid dt('button.contrast.border.color');
        color: dt('button.contrast.color');
    }

    .p-button-contrast:not(:disabled):hover {
        background: dt('button.contrast.hover.background');
        border: 1px solid dt('button.contrast.hover.border.color');
        color: dt('button.contrast.hover.color');
    }

    .p-button-contrast:not(:disabled):active {
        background: dt('button.contrast.active.background');
        border: 1px solid dt('button.contrast.active.border.color');
        color: dt('button.contrast.active.color');
    }

    .p-button-contrast:focus-visible {
        outline-color: dt('button.contrast.focus.ring.color');
        box-shadow: dt('button.contrast.focus.ring.shadow');
    }

    .p-button-outlined {
        background: transparent;
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):hover {
        background: dt('button.outlined.primary.hover.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):active {
        background: dt('button.outlined.primary.active.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined.p-button-secondary {
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):hover {
        background: dt('button.outlined.secondary.hover.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):active {
        background: dt('button.outlined.secondary.active.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-success {
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):hover {
        background: dt('button.outlined.success.hover.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):active {
        background: dt('button.outlined.success.active.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-info {
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):hover {
        background: dt('button.outlined.info.hover.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):active {
        background: dt('button.outlined.info.active.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-warn {
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):hover {
        background: dt('button.outlined.warn.hover.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):active {
        background: dt('button.outlined.warn.active.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-help {
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):hover {
        background: dt('button.outlined.help.hover.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):active {
        background: dt('button.outlined.help.active.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-danger {
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):hover {
        background: dt('button.outlined.danger.hover.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):active {
        background: dt('button.outlined.danger.active.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-contrast {
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):hover {
        background: dt('button.outlined.contrast.hover.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):active {
        background: dt('button.outlined.contrast.active.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-plain {
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):hover {
        background: dt('button.outlined.plain.hover.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):active {
        background: dt('button.outlined.plain.active.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-text {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):hover {
        background: dt('button.text.primary.hover.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):active {
        background: dt('button.text.primary.active.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text.p-button-secondary {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):hover {
        background: dt('button.text.secondary.hover.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):active {
        background: dt('button.text.secondary.active.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-success {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):hover {
        background: dt('button.text.success.hover.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):active {
        background: dt('button.text.success.active.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-info {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):hover {
        background: dt('button.text.info.hover.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):active {
        background: dt('button.text.info.active.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-warn {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):hover {
        background: dt('button.text.warn.hover.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):active {
        background: dt('button.text.warn.active.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-help {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):hover {
        background: dt('button.text.help.hover.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):active {
        background: dt('button.text.help.active.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-danger {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):hover {
        background: dt('button.text.danger.hover.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):active {
        background: dt('button.text.danger.active.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-contrast {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):hover {
        background: dt('button.text.contrast.hover.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):active {
        background: dt('button.text.contrast.active.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-plain {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):hover {
        background: dt('button.text.plain.hover.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):active {
        background: dt('button.text.plain.active.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-link {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.color');
    }

    .p-button-link:not(:disabled):hover {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.hover.color');
    }

    .p-button-link:not(:disabled):hover .p-button-label {
        text-decoration: underline;
    }

    .p-button-link:not(:disabled):active {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.active.color');
    }
`,KR=`
    .p-confirmpopup {
        position: absolute;
        margin-top: dt('confirmpopup.gutter');
        top: 0;
        left: 0;
        background: dt('confirmpopup.background');
        color: dt('confirmpopup.color');
        border: 1px solid dt('confirmpopup.border.color');
        border-radius: dt('confirmpopup.border.radius');
        box-shadow: dt('confirmpopup.shadow');
        will-change: transform;
    }

    .p-confirmpopup-content {
        display: flex;
        align-items: center;
        padding: dt('confirmpopup.content.padding');
        gap: dt('confirmpopup.content.gap');
    }

    .p-confirmpopup-icon {
        font-size: dt('confirmpopup.icon.size');
        width: dt('confirmpopup.icon.size');
        height: dt('confirmpopup.icon.size');
        color: dt('confirmpopup.icon.color');
    }

    .p-confirmpopup-footer {
        display: flex;
        justify-content: flex-end;
        gap: dt('confirmpopup.footer.gap');
        padding: dt('confirmpopup.footer.padding');
    }

    .p-confirmpopup-footer button {
        width: auto;
    }

    .p-confirmpopup-footer button:last-child {
        margin: 0;
    }

    .p-confirmpopup-flipped {
        margin-block-start: calc(dt('confirmpopup.gutter') * -1);
        margin-block-end: dt('confirmpopup.gutter');
    }

    .p-confirmpopup:after,
    .p-confirmpopup:before {
        bottom: 100%;
        left: calc(dt('confirmpopup.arrow.offset') + dt('confirmpopup.arrow.left'));
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    .p-confirmpopup:after {
        border-width: calc(dt('confirmpopup.gutter') - 2px);
        margin-left: calc(-1 * (dt('confirmpopup.gutter') - 2px));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('confirmpopup.background');
    }

    .p-confirmpopup:before {
        border-width: dt('confirmpopup.gutter');
        margin-left: calc(-1 * dt('confirmpopup.gutter'));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('confirmpopup.border.color');
    }

    .p-confirmpopup-flipped:after,
    .p-confirmpopup-flipped:before {
        bottom: auto;
        top: 100%;
    }

    .p-confirmpopup-flipped:after {
        border-bottom-color: transparent;
        border-top-color: dt('confirmpopup.background');
    }

    .p-confirmpopup-flipped:before {
        border-bottom-color: transparent;
        border-top-color: dt('confirmpopup.border.color');
    }
`,YR=`
    .p-toast {
        width: dt('toast.width');
        white-space: pre-line;
        word-break: break-word;
    }

    .p-toast-message {
        margin: 0 0 1rem 0;
        display: grid;
        grid-template-rows: 1fr;
    }

    .p-toast-message-icon {
        flex-shrink: 0;
        font-size: dt('toast.icon.size');
        width: dt('toast.icon.size');
        height: dt('toast.icon.size');
    }

    .p-toast-message-content {
        display: flex;
        align-items: flex-start;
        padding: dt('toast.content.padding');
        gap: dt('toast.content.gap');
        min-height: 0;
        overflow: hidden;
        transition: padding 250ms ease-in;
    }

    .p-toast-message-text {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        gap: dt('toast.text.gap');
    }

    .p-toast-summary {
        font-weight: dt('toast.summary.font.weight');
        font-size: dt('toast.summary.font.size');
    }

    .p-toast-detail {
        font-weight: dt('toast.detail.font.weight');
        font-size: dt('toast.detail.font.size');
    }

    .p-toast-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        background: transparent;
        transition:
            background dt('toast.transition.duration'),
            color dt('toast.transition.duration'),
            outline-color dt('toast.transition.duration'),
            box-shadow dt('toast.transition.duration');
        outline-color: transparent;
        color: inherit;
        width: dt('toast.close.button.width');
        height: dt('toast.close.button.height');
        border-radius: dt('toast.close.button.border.radius');
        margin: -25% 0 0 0;
        right: -25%;
        padding: 0;
        border: none;
        user-select: none;
    }

    .p-toast-close-button:dir(rtl) {
        margin: -25% 0 0 auto;
        left: -25%;
        right: auto;
    }

    .p-toast-message-info,
    .p-toast-message-success,
    .p-toast-message-warn,
    .p-toast-message-error,
    .p-toast-message-secondary,
    .p-toast-message-contrast {
        border-width: dt('toast.border.width');
        border-style: solid;
        backdrop-filter: blur(dt('toast.blur'));
        border-radius: dt('toast.border.radius');
    }

    .p-toast-close-icon {
        font-size: dt('toast.close.icon.size');
        width: dt('toast.close.icon.size');
        height: dt('toast.close.icon.size');
    }

    .p-toast-close-button:focus-visible {
        outline-width: dt('focus.ring.width');
        outline-style: dt('focus.ring.style');
        outline-offset: dt('focus.ring.offset');
    }

    .p-toast-message-info {
        background: dt('toast.info.background');
        border-color: dt('toast.info.border.color');
        color: dt('toast.info.color');
        box-shadow: dt('toast.info.shadow');
    }

    .p-toast-message-info .p-toast-detail {
        color: dt('toast.info.detail.color');
    }

    .p-toast-message-info .p-toast-close-button:focus-visible {
        outline-color: dt('toast.info.close.button.focus.ring.color');
        box-shadow: dt('toast.info.close.button.focus.ring.shadow');
    }

    .p-toast-message-info .p-toast-close-button:hover {
        background: dt('toast.info.close.button.hover.background');
    }

    .p-toast-message-success {
        background: dt('toast.success.background');
        border-color: dt('toast.success.border.color');
        color: dt('toast.success.color');
        box-shadow: dt('toast.success.shadow');
    }

    .p-toast-message-success .p-toast-detail {
        color: dt('toast.success.detail.color');
    }

    .p-toast-message-success .p-toast-close-button:focus-visible {
        outline-color: dt('toast.success.close.button.focus.ring.color');
        box-shadow: dt('toast.success.close.button.focus.ring.shadow');
    }

    .p-toast-message-success .p-toast-close-button:hover {
        background: dt('toast.success.close.button.hover.background');
    }

    .p-toast-message-warn {
        background: dt('toast.warn.background');
        border-color: dt('toast.warn.border.color');
        color: dt('toast.warn.color');
        box-shadow: dt('toast.warn.shadow');
    }

    .p-toast-message-warn .p-toast-detail {
        color: dt('toast.warn.detail.color');
    }

    .p-toast-message-warn .p-toast-close-button:focus-visible {
        outline-color: dt('toast.warn.close.button.focus.ring.color');
        box-shadow: dt('toast.warn.close.button.focus.ring.shadow');
    }

    .p-toast-message-warn .p-toast-close-button:hover {
        background: dt('toast.warn.close.button.hover.background');
    }

    .p-toast-message-error {
        background: dt('toast.error.background');
        border-color: dt('toast.error.border.color');
        color: dt('toast.error.color');
        box-shadow: dt('toast.error.shadow');
    }

    .p-toast-message-error .p-toast-detail {
        color: dt('toast.error.detail.color');
    }

    .p-toast-message-error .p-toast-close-button:focus-visible {
        outline-color: dt('toast.error.close.button.focus.ring.color');
        box-shadow: dt('toast.error.close.button.focus.ring.shadow');
    }

    .p-toast-message-error .p-toast-close-button:hover {
        background: dt('toast.error.close.button.hover.background');
    }

    .p-toast-message-secondary {
        background: dt('toast.secondary.background');
        border-color: dt('toast.secondary.border.color');
        color: dt('toast.secondary.color');
        box-shadow: dt('toast.secondary.shadow');
    }

    .p-toast-message-secondary .p-toast-detail {
        color: dt('toast.secondary.detail.color');
    }

    .p-toast-message-secondary .p-toast-close-button:focus-visible {
        outline-color: dt('toast.secondary.close.button.focus.ring.color');
        box-shadow: dt('toast.secondary.close.button.focus.ring.shadow');
    }

    .p-toast-message-secondary .p-toast-close-button:hover {
        background: dt('toast.secondary.close.button.hover.background');
    }

    .p-toast-message-contrast {
        background: dt('toast.contrast.background');
        border-color: dt('toast.contrast.border.color');
        color: dt('toast.contrast.color');
        box-shadow: dt('toast.contrast.shadow');
    }
    
    .p-toast-message-contrast .p-toast-detail {
        color: dt('toast.contrast.detail.color');
    }

    .p-toast-message-contrast .p-toast-close-button:focus-visible {
        outline-color: dt('toast.contrast.close.button.focus.ring.color');
        box-shadow: dt('toast.contrast.close.button.focus.ring.shadow');
    }

    .p-toast-message-contrast .p-toast-close-button:hover {
        background: dt('toast.contrast.close.button.hover.background');
    }

    .p-toast-top-center {
        transform: translateX(-50%);
    }

    .p-toast-bottom-center {
        transform: translateX(-50%);
    }

    .p-toast-center {
        min-width: 20vw;
        transform: translate(-50%, -50%);
    }

    .p-toast-message-enter-active {
        animation: p-animate-toast-enter 300ms ease-out;
    }

    .p-toast-message-leave-active {
        animation: p-animate-toast-leave 250ms ease-in;
    }

    .p-toast-message-leave-to .p-toast-message-content {
        padding-top: 0;
        padding-bottom: 0;
    }

    @keyframes p-animate-toast-enter {
        from {
            opacity: 0;
            transform: scale(0.6);
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

     @keyframes p-animate-toast-leave {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            margin-bottom: 0;
            grid-template-rows: 0fr;
            transform: translateY(-100%) scale(0.6);
        }
    }
`,XR=`
    .p-tooltip {
        position: absolute;
        display: none;
        max-width: dt('tooltip.max.width');
    }

    .p-tooltip-right,
    .p-tooltip-left {
        padding: 0 dt('tooltip.gutter');
    }

    .p-tooltip-top,
    .p-tooltip-bottom {
        padding: dt('tooltip.gutter') 0;
    }

    .p-tooltip-text {
        white-space: pre-line;
        word-break: break-word;
        background: dt('tooltip.background');
        color: dt('tooltip.color');
        padding: dt('tooltip.padding');
        box-shadow: dt('tooltip.shadow');
        border-radius: dt('tooltip.border.radius');
    }

    .p-tooltip-arrow {
        position: absolute;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
    }

    .p-tooltip-right .p-tooltip-arrow {
        margin-top: calc(-1 * dt('tooltip.gutter'));
        border-width: dt('tooltip.gutter') dt('tooltip.gutter') dt('tooltip.gutter') 0;
        border-right-color: dt('tooltip.background');
    }

    .p-tooltip-left .p-tooltip-arrow {
        margin-top: calc(-1 * dt('tooltip.gutter'));
        border-width: dt('tooltip.gutter') 0 dt('tooltip.gutter') dt('tooltip.gutter');
        border-left-color: dt('tooltip.background');
    }

    .p-tooltip-top .p-tooltip-arrow {
        margin-left: calc(-1 * dt('tooltip.gutter'));
        border-width: dt('tooltip.gutter') dt('tooltip.gutter') 0 dt('tooltip.gutter');
        border-top-color: dt('tooltip.background');
        border-bottom-color: dt('tooltip.background');
    }

    .p-tooltip-bottom .p-tooltip-arrow {
        margin-left: calc(-1 * dt('tooltip.gutter'));
        border-width: 0 dt('tooltip.gutter') dt('tooltip.gutter') dt('tooltip.gutter');
        border-top-color: dt('tooltip.background');
        border-bottom-color: dt('tooltip.background');
    }
`,qR=`
    .p-message {
        display: grid;
        grid-template-rows: 1fr;
        border-radius: dt('message.border.radius');
        outline-width: dt('message.border.width');
        outline-style: solid;
    }

    .p-message-content-wrapper {
        min-height: 0;
    }

    .p-message-content {
        display: flex;
        align-items: center;
        padding: dt('message.content.padding');
        gap: dt('message.content.gap');
    }

    .p-message-icon {
        flex-shrink: 0;
    }

    .p-message-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-inline-start: auto;
        overflow: hidden;
        position: relative;
        width: dt('message.close.button.width');
        height: dt('message.close.button.height');
        border-radius: dt('message.close.button.border.radius');
        background: transparent;
        transition:
            background dt('message.transition.duration'),
            color dt('message.transition.duration'),
            outline-color dt('message.transition.duration'),
            box-shadow dt('message.transition.duration'),
            opacity 0.3s;
        outline-color: transparent;
        color: inherit;
        padding: 0;
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .p-message-close-icon {
        font-size: dt('message.close.icon.size');
        width: dt('message.close.icon.size');
        height: dt('message.close.icon.size');
    }

    .p-message-close-button:focus-visible {
        outline-width: dt('message.close.button.focus.ring.width');
        outline-style: dt('message.close.button.focus.ring.style');
        outline-offset: dt('message.close.button.focus.ring.offset');
    }

    .p-message-info {
        background: dt('message.info.background');
        outline-color: dt('message.info.border.color');
        color: dt('message.info.color');
        box-shadow: dt('message.info.shadow');
    }

    .p-message-info .p-message-close-button:focus-visible {
        outline-color: dt('message.info.close.button.focus.ring.color');
        box-shadow: dt('message.info.close.button.focus.ring.shadow');
    }

    .p-message-info .p-message-close-button:hover {
        background: dt('message.info.close.button.hover.background');
    }

    .p-message-info.p-message-outlined {
        color: dt('message.info.outlined.color');
        outline-color: dt('message.info.outlined.border.color');
    }

    .p-message-info.p-message-simple {
        color: dt('message.info.simple.color');
    }

    .p-message-success {
        background: dt('message.success.background');
        outline-color: dt('message.success.border.color');
        color: dt('message.success.color');
        box-shadow: dt('message.success.shadow');
    }

    .p-message-success .p-message-close-button:focus-visible {
        outline-color: dt('message.success.close.button.focus.ring.color');
        box-shadow: dt('message.success.close.button.focus.ring.shadow');
    }

    .p-message-success .p-message-close-button:hover {
        background: dt('message.success.close.button.hover.background');
    }

    .p-message-success.p-message-outlined {
        color: dt('message.success.outlined.color');
        outline-color: dt('message.success.outlined.border.color');
    }

    .p-message-success.p-message-simple {
        color: dt('message.success.simple.color');
    }

    .p-message-warn {
        background: dt('message.warn.background');
        outline-color: dt('message.warn.border.color');
        color: dt('message.warn.color');
        box-shadow: dt('message.warn.shadow');
    }

    .p-message-warn .p-message-close-button:focus-visible {
        outline-color: dt('message.warn.close.button.focus.ring.color');
        box-shadow: dt('message.warn.close.button.focus.ring.shadow');
    }

    .p-message-warn .p-message-close-button:hover {
        background: dt('message.warn.close.button.hover.background');
    }

    .p-message-warn.p-message-outlined {
        color: dt('message.warn.outlined.color');
        outline-color: dt('message.warn.outlined.border.color');
    }

    .p-message-warn.p-message-simple {
        color: dt('message.warn.simple.color');
    }

    .p-message-error {
        background: dt('message.error.background');
        outline-color: dt('message.error.border.color');
        color: dt('message.error.color');
        box-shadow: dt('message.error.shadow');
    }

    .p-message-error .p-message-close-button:focus-visible {
        outline-color: dt('message.error.close.button.focus.ring.color');
        box-shadow: dt('message.error.close.button.focus.ring.shadow');
    }

    .p-message-error .p-message-close-button:hover {
        background: dt('message.error.close.button.hover.background');
    }

    .p-message-error.p-message-outlined {
        color: dt('message.error.outlined.color');
        outline-color: dt('message.error.outlined.border.color');
    }

    .p-message-error.p-message-simple {
        color: dt('message.error.simple.color');
    }

    .p-message-secondary {
        background: dt('message.secondary.background');
        outline-color: dt('message.secondary.border.color');
        color: dt('message.secondary.color');
        box-shadow: dt('message.secondary.shadow');
    }

    .p-message-secondary .p-message-close-button:focus-visible {
        outline-color: dt('message.secondary.close.button.focus.ring.color');
        box-shadow: dt('message.secondary.close.button.focus.ring.shadow');
    }

    .p-message-secondary .p-message-close-button:hover {
        background: dt('message.secondary.close.button.hover.background');
    }

    .p-message-secondary.p-message-outlined {
        color: dt('message.secondary.outlined.color');
        outline-color: dt('message.secondary.outlined.border.color');
    }

    .p-message-secondary.p-message-simple {
        color: dt('message.secondary.simple.color');
    }

    .p-message-contrast {
        background: dt('message.contrast.background');
        outline-color: dt('message.contrast.border.color');
        color: dt('message.contrast.color');
        box-shadow: dt('message.contrast.shadow');
    }

    .p-message-contrast .p-message-close-button:focus-visible {
        outline-color: dt('message.contrast.close.button.focus.ring.color');
        box-shadow: dt('message.contrast.close.button.focus.ring.shadow');
    }

    .p-message-contrast .p-message-close-button:hover {
        background: dt('message.contrast.close.button.hover.background');
    }

    .p-message-contrast.p-message-outlined {
        color: dt('message.contrast.outlined.color');
        outline-color: dt('message.contrast.outlined.border.color');
    }

    .p-message-contrast.p-message-simple {
        color: dt('message.contrast.simple.color');
    }

    .p-message-text {
        font-size: dt('message.text.font.size');
        font-weight: dt('message.text.font.weight');
    }

    .p-message-icon {
        font-size: dt('message.icon.size');
        width: dt('message.icon.size');
        height: dt('message.icon.size');
    }

    .p-message-sm .p-message-content {
        padding: dt('message.content.sm.padding');
    }

    .p-message-sm .p-message-text {
        font-size: dt('message.text.sm.font.size');
    }

    .p-message-sm .p-message-icon {
        font-size: dt('message.icon.sm.size');
        width: dt('message.icon.sm.size');
        height: dt('message.icon.sm.size');
    }

    .p-message-sm .p-message-close-icon {
        font-size: dt('message.close.icon.sm.size');
        width: dt('message.close.icon.sm.size');
        height: dt('message.close.icon.sm.size');
    }

    .p-message-lg .p-message-content {
        padding: dt('message.content.lg.padding');
    }

    .p-message-lg .p-message-text {
        font-size: dt('message.text.lg.font.size');
    }

    .p-message-lg .p-message-icon {
        font-size: dt('message.icon.lg.size');
        width: dt('message.icon.lg.size');
        height: dt('message.icon.lg.size');
    }

    .p-message-lg .p-message-close-icon {
        font-size: dt('message.close.icon.lg.size');
        width: dt('message.close.icon.lg.size');
        height: dt('message.close.icon.lg.size');
    }

    .p-message-outlined {
        background: transparent;
        outline-width: dt('message.outlined.border.width');
    }

    .p-message-simple {
        background: transparent;
        outline-color: transparent;
        box-shadow: none;
    }

    .p-message-simple .p-message-content {
        padding: dt('message.simple.content.padding');
    }

    .p-message-outlined .p-message-close-button:hover,
    .p-message-simple .p-message-close-button:hover {
        background: transparent;
    }

    .p-message-enter-active {
        animation: p-animate-message-enter 0.3s ease-out forwards;
        overflow: hidden;
    }

    .p-message-leave-active {
        animation: p-animate-message-leave 0.15s ease-in forwards;
        overflow: hidden;
    }

    @keyframes p-animate-message-enter {
        from {
            opacity: 0;
            grid-template-rows: 0fr;
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-message-leave {
        from {
            opacity: 1;
            grid-template-rows: 1fr;
        }
        to {
            opacity: 0;
            margin: 0;
            grid-template-rows: 0fr;
        }
    }
`,JR=`
    .p-floatlabel {
        display: block;
        position: relative;
    }

    .p-floatlabel label {
        position: absolute;
        pointer-events: none;
        top: 50%;
        transform: translateY(-50%);
        transition-property: all;
        transition-timing-function: ease;
        line-height: 1;
        font-weight: dt('floatlabel.font.weight');
        inset-inline-start: dt('floatlabel.position.x');
        color: dt('floatlabel.color');
        transition-duration: dt('floatlabel.transition.duration');
    }

    .p-floatlabel:has(.p-textarea) label {
        top: dt('floatlabel.position.y');
        transform: translateY(0);
    }

    .p-floatlabel:has(.p-inputicon:first-child) label {
        inset-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-floatlabel:has(input:focus) label,
    .p-floatlabel:has(input.p-filled) label,
    .p-floatlabel:has(input:-webkit-autofill) label,
    .p-floatlabel:has(textarea:focus) label,
    .p-floatlabel:has(textarea.p-filled) label,
    .p-floatlabel:has(.p-inputwrapper-focus) label,
    .p-floatlabel:has(.p-inputwrapper-filled) label,
    .p-floatlabel:has(input[placeholder]) label,
    .p-floatlabel:has(textarea[placeholder]) label {
        top: dt('floatlabel.over.active.top');
        transform: translateY(0);
        font-size: dt('floatlabel.active.font.size');
        font-weight: dt('floatlabel.active.font.weight');
    }

    .p-floatlabel:has(input.p-filled) label,
    .p-floatlabel:has(textarea.p-filled) label,
    .p-floatlabel:has(.p-inputwrapper-filled) label {
        color: dt('floatlabel.active.color');
    }

    .p-floatlabel:has(input:focus) label,
    .p-floatlabel:has(input:-webkit-autofill) label,
    .p-floatlabel:has(textarea:focus) label,
    .p-floatlabel:has(.p-inputwrapper-focus) label {
        color: dt('floatlabel.focus.color');
    }

    .p-floatlabel-in .p-inputtext,
    .p-floatlabel-in .p-textarea,
    .p-floatlabel-in .p-select-label,
    .p-floatlabel-in .p-multiselect-label,
    .p-floatlabel-in .p-multiselect-label:has(.p-chip),
    .p-floatlabel-in .p-autocomplete-input-multiple,
    .p-floatlabel-in .p-cascadeselect-label,
    .p-floatlabel-in .p-treeselect-label {
        padding-block-start: dt('floatlabel.in.input.padding.top');
        padding-block-end: dt('floatlabel.in.input.padding.bottom');
    }

    .p-floatlabel-in:has(input:focus) label,
    .p-floatlabel-in:has(input.p-filled) label,
    .p-floatlabel-in:has(input:-webkit-autofill) label,
    .p-floatlabel-in:has(textarea:focus) label,
    .p-floatlabel-in:has(textarea.p-filled) label,
    .p-floatlabel-in:has(.p-inputwrapper-focus) label,
    .p-floatlabel-in:has(.p-inputwrapper-filled) label,
    .p-floatlabel-in:has(input[placeholder]) label,
    .p-floatlabel-in:has(textarea[placeholder]) label {
        top: dt('floatlabel.in.active.top');
    }

    .p-floatlabel-on:has(input:focus) label,
    .p-floatlabel-on:has(input.p-filled) label,
    .p-floatlabel-on:has(input:-webkit-autofill) label,
    .p-floatlabel-on:has(textarea:focus) label,
    .p-floatlabel-on:has(textarea.p-filled) label,
    .p-floatlabel-on:has(.p-inputwrapper-focus) label,
    .p-floatlabel-on:has(.p-inputwrapper-filled) label,
    .p-floatlabel-on:has(input[placeholder]) label,
    .p-floatlabel-on:has(textarea[placeholder]) label {
        top: 0;
        transform: translateY(-50%);
        border-radius: dt('floatlabel.on.border.radius');
        background: dt('floatlabel.on.active.background');
        padding: dt('floatlabel.on.active.padding');
    }

    .p-floatlabel:has([class^='p-'][class$='-fluid']) {
        width: 100%;
    }

    .p-floatlabel:has(.p-invalid) label {
        color: dt('floatlabel.invalid.color');
    }
`,QR=`
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`,eE=`
    .p-password {
        display: inline-flex;
        position: relative;
    }

    .p-password .p-password-overlay {
        min-width: 100%;
    }

    .p-password-meter {
        height: dt('password.meter.height');
        background: dt('password.meter.background');
        border-radius: dt('password.meter.border.radius');
    }

    .p-password-meter-label {
        height: 100%;
        width: 0;
        transition: width 1s ease-in-out;
        border-radius: dt('password.meter.border.radius');
    }

    .p-password-meter-weak {
        background: dt('password.strength.weak.background');
    }

    .p-password-meter-medium {
        background: dt('password.strength.medium.background');
    }

    .p-password-meter-strong {
        background: dt('password.strength.strong.background');
    }

    .p-password-fluid {
        display: flex;
    }

    .p-password-fluid .p-password-input {
        width: 100%;
    }

    .p-password-input::-ms-reveal,
    .p-password-input::-ms-clear {
        display: none;
    }

    .p-password-overlay {
        padding: dt('password.overlay.padding');
        background: dt('password.overlay.background');
        color: dt('password.overlay.color');
        border: 1px solid dt('password.overlay.border.color');
        box-shadow: dt('password.overlay.shadow');
        border-radius: dt('password.overlay.border.radius');
    }

    .p-password-content {
        display: flex;
        flex-direction: column;
        gap: dt('password.content.gap');
    }

    .p-password-toggle-mask-icon {
        inset-inline-end: dt('form.field.padding.x');
        color: dt('password.icon.color');
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * calc(dt('icon.size') / 2));
        width: dt('icon.size');
        height: dt('icon.size');
    }

    .p-password-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .p-password:has(.p-password-toggle-mask-icon) .p-password-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-password:has(.p-password-toggle-mask-icon) .p-password-clear-icon {
        inset-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-password:has(.p-password-clear-icon) .p-password-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-password:has(.p-password-clear-icon):has(.p-password-toggle-mask-icon)  .p-password-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 3) + calc(dt('icon.size') * 2));
    }

`,oE=`
    .p-tabs {
        display: flex;
        flex-direction: column;
    }

    .p-tablist {
        display: flex;
        position: relative;
        overflow: hidden;
        background: dt('tabs.tablist.background');
    }

    .p-tablist-viewport {
        overflow-x: auto;
        overflow-y: hidden;
        scroll-behavior: smooth;
        scrollbar-width: none;
        overscroll-behavior: contain auto;
    }

    .p-tablist-viewport::-webkit-scrollbar {
        display: none;
    }

    .p-tablist-tab-list {
        position: relative;
        display: flex;
        border-style: solid;
        border-color: dt('tabs.tablist.border.color');
        border-width: dt('tabs.tablist.border.width');
    }

    .p-tablist-content {
        flex-grow: 1;
    }

    .p-tablist-nav-button {
        all: unset;
        position: absolute !important;
        flex-shrink: 0;
        inset-block-start: 0;
        z-index: 2;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: dt('tabs.nav.button.background');
        color: dt('tabs.nav.button.color');
        width: dt('tabs.nav.button.width');
        transition:
            color dt('tabs.transition.duration'),
            outline-color dt('tabs.transition.duration'),
            box-shadow dt('tabs.transition.duration');
        box-shadow: dt('tabs.nav.button.shadow');
        outline-color: transparent;
        cursor: pointer;
    }

    .p-tablist-nav-button:focus-visible {
        z-index: 1;
        box-shadow: dt('tabs.nav.button.focus.ring.shadow');
        outline: dt('tabs.nav.button.focus.ring.width') dt('tabs.nav.button.focus.ring.style') dt('tabs.nav.button.focus.ring.color');
        outline-offset: dt('tabs.nav.button.focus.ring.offset');
    }

    .p-tablist-nav-button:hover {
        color: dt('tabs.nav.button.hover.color');
    }

    .p-tablist-prev-button {
        inset-inline-start: 0;
    }

    .p-tablist-next-button {
        inset-inline-end: 0;
    }

    .p-tablist-prev-button:dir(rtl),
    .p-tablist-next-button:dir(rtl) {
        transform: rotate(180deg);
    }

    .p-tab {
        flex-shrink: 0;
        cursor: pointer;
        user-select: none;
        position: relative;
        border-style: solid;
        white-space: nowrap;
        gap: dt('tabs.tab.gap');
        background: dt('tabs.tab.background');
        border-width: dt('tabs.tab.border.width');
        border-color: dt('tabs.tab.border.color');
        color: dt('tabs.tab.color');
        padding: dt('tabs.tab.padding');
        font-weight: dt('tabs.tab.font.weight');
        transition:
            background dt('tabs.transition.duration'),
            border-color dt('tabs.transition.duration'),
            color dt('tabs.transition.duration'),
            outline-color dt('tabs.transition.duration'),
            box-shadow dt('tabs.transition.duration');
        margin: dt('tabs.tab.margin');
        outline-color: transparent;
    }

    .p-tab:not(.p-disabled):focus-visible {
        z-index: 1;
        box-shadow: dt('tabs.tab.focus.ring.shadow');
        outline: dt('tabs.tab.focus.ring.width') dt('tabs.tab.focus.ring.style') dt('tabs.tab.focus.ring.color');
        outline-offset: dt('tabs.tab.focus.ring.offset');
    }

    .p-tab:not(.p-tab-active):not(.p-disabled):hover {
        background: dt('tabs.tab.hover.background');
        border-color: dt('tabs.tab.hover.border.color');
        color: dt('tabs.tab.hover.color');
    }

    .p-tab-active {
        background: dt('tabs.tab.active.background');
        border-color: dt('tabs.tab.active.border.color');
        color: dt('tabs.tab.active.color');
    }

    .p-tabpanels {
        background: dt('tabs.tabpanel.background');
        color: dt('tabs.tabpanel.color');
        padding: dt('tabs.tabpanel.padding');
        outline: 0 none;
    }

    .p-tabpanel:focus-visible {
        box-shadow: dt('tabs.tabpanel.focus.ring.shadow');
        outline: dt('tabs.tabpanel.focus.ring.width') dt('tabs.tabpanel.focus.ring.style') dt('tabs.tabpanel.focus.ring.color');
        outline-offset: dt('tabs.tabpanel.focus.ring.offset');
    }

    .p-tablist-active-bar {
        z-index: 1;
        display: block;
        position: absolute;
        inset-block-end: dt('tabs.active.bar.bottom');
        height: dt('tabs.active.bar.height');
        background: dt('tabs.active.bar.background');
        transition: 250ms cubic-bezier(0.35, 0, 0.25, 1);
    }
`,tE=`
    .p-divider-horizontal {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        margin: dt('divider.horizontal.margin');
        padding: dt('divider.horizontal.padding');
    }

    .p-divider-horizontal:before {
        position: absolute;
        display: block;
        inset-block-start: 50%;
        inset-inline-start: 0;
        width: 100%;
        content: '';
        border-block-start: 1px solid dt('divider.border.color');
    }

    .p-divider-horizontal .p-divider-content {
        padding: dt('divider.horizontal.content.padding');
    }

    .p-divider-vertical {
        min-height: 100%;
        display: flex;
        position: relative;
        justify-content: center;
        margin: dt('divider.vertical.margin');
        padding: dt('divider.vertical.padding');
    }

    .p-divider-vertical:before {
        position: absolute;
        display: block;
        inset-block-start: 0;
        inset-inline-start: 50%;
        height: 100%;
        content: '';
        border-inline-start: 1px solid dt('divider.border.color');
    }

    .p-divider.p-divider-vertical .p-divider-content {
        padding: dt('divider.vertical.content.padding');
    }

    .p-divider-content {
        z-index: 1;
        background: dt('divider.content.background');
        color: dt('divider.content.color');
    }

    .p-divider-solid.p-divider-horizontal:before {
        border-block-start-style: solid;
    }

    .p-divider-solid.p-divider-vertical:before {
        border-inline-start-style: solid;
    }

    .p-divider-dashed.p-divider-horizontal:before {
        border-block-start-style: dashed;
    }

    .p-divider-dashed.p-divider-vertical:before {
        border-inline-start-style: dashed;
    }

    .p-divider-dotted.p-divider-horizontal:before {
        border-block-start-style: dotted;
    }

    .p-divider-dotted.p-divider-vertical:before {
        border-inline-start-style: dotted;
    }

    .p-divider-left:dir(rtl),
    .p-divider-right:dir(rtl) {
        flex-direction: row-reverse;
    }
`,rE=`
    .p-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: dt('avatar.width');
        height: dt('avatar.height');
        font-size: dt('avatar.font.size');
        background: dt('avatar.background');
        color: dt('avatar.color');
        border-radius: dt('avatar.border.radius');
    }

    .p-avatar-image {
        background: transparent;
    }

    .p-avatar-circle {
        border-radius: 50%;
    }

    .p-avatar-circle img {
        border-radius: 50%;
    }

    .p-avatar-icon {
        font-size: dt('avatar.icon.size');
        width: dt('avatar.icon.size');
        height: dt('avatar.icon.size');
    }

    .p-avatar img {
        width: 100%;
        height: 100%;
    }

    .p-avatar-lg {
        width: dt('avatar.lg.width');
        height: dt('avatar.lg.width');
        font-size: dt('avatar.lg.font.size');
    }

    .p-avatar-lg .p-avatar-icon {
        font-size: dt('avatar.lg.icon.size');
        width: dt('avatar.lg.icon.size');
        height: dt('avatar.lg.icon.size');
    }

    .p-avatar-xl {
        width: dt('avatar.xl.width');
        height: dt('avatar.xl.width');
        font-size: dt('avatar.xl.font.size');
    }

    .p-avatar-xl .p-avatar-icon {
        font-size: dt('avatar.xl.icon.size');
        width: dt('avatar.xl.icon.size');
        height: dt('avatar.xl.icon.size');
    }

    .p-avatar-group {
        display: flex;
        align-items: center;
    }

    .p-avatar-group .p-avatar + .p-avatar {
        margin-inline-start: dt('avatar.group.offset');
    }

    .p-avatar-group .p-avatar {
        border: 2px solid dt('avatar.group.border.color');
    }

    .p-avatar-group .p-avatar-lg + .p-avatar-lg {
        margin-inline-start: dt('avatar.lg.group.offset');
    }

    .p-avatar-group .p-avatar-xl + .p-avatar-xl {
        margin-inline-start: dt('avatar.xl.group.offset');
    }
`;function zC(e,o){return ua()?(lc(e,o),!0):!1}const OC=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const IC=e=>e!=null,PC=Object.prototype.toString,DC=e=>PC.call(e)==="[object Object]",Qt=()=>{};function Oa(e,o){function t(...r){return new Promise((n,i)=>{Promise.resolve(e(()=>o.apply(this,r),{fn:o,thisArg:this,args:r})).then(n).catch(i)})}return t}const NC=e=>e();function nu(e,o={}){let t,r,n=Qt;const i=l=>{clearTimeout(l),n(),n=Qt};let a;return l=>{const d=ro(e),c=ro(o.maxWait);return t&&i(t),d<=0||c!==void 0&&c<=0?(r&&(i(r),r=void 0),Promise.resolve(l())):new Promise((u,f)=>{n=o.rejectOnCancel?f:u,a=l,c&&!r&&(r=setTimeout(()=>{t&&i(t),r=void 0,u(a())},c)),t=setTimeout(()=>{r&&i(r),r=void 0,u(l())},d)})}}function LC(...e){let o=0,t,r=!0,n=Qt,i,a,s,l,d;!$e(e[0])&&typeof e[0]=="object"?{delay:a,trailing:s=!0,leading:l=!0,rejectOnCancel:d=!1}=e[0]:[a,s=!0,l=!0,d=!1]=e;const c=()=>{t&&(clearTimeout(t),t=void 0,n(),n=Qt)};return f=>{const g=ro(a),v=Date.now()-o,w=()=>i=f();return c(),g<=0?(o=Date.now(),w()):(v>g?(o=Date.now(),(l||!r)&&w()):s&&(i=new Promise((T,A)=>{n=d?A:T,t=setTimeout(()=>{o=Date.now(),r=!0,T(w()),c()},Math.max(0,g-v))})),!l&&!t&&(t=setTimeout(()=>r=!0,g)),r=!1,i)}}function ln(e){return Array.isArray(e)?e:[e]}function MC(e){return Bt()}function FC(e,o=200,t={}){return Oa(nu(o,t),e)}function jC(e,o=200,t=!1,r=!0,n=!1){return Oa(LC(o,t,r,n),e)}function WC(e,o,t={}){const{eventFilter:r=NC,...n}=t;return at(e,Oa(r,o),n)}function UC(e,o=!0,t){MC()?Pn(e,t):o?e():zn(e)}function nE(e,o,t={}){const{debounce:r=0,maxWait:n=void 0,...i}=t;return WC(e,o,{...i,eventFilter:nu(r,{maxWait:n})})}function ZC(e,o,t){return at(e,o,{...t,immediate:!0})}const Ia=OC?window:void 0;function Pa(e){var o;const t=ro(e);return(o=t?.$el)!==null&&o!==void 0?o:t}function zl(...e){const o=(r,n,i,a)=>(r.addEventListener(n,i,a),()=>r.removeEventListener(n,i,a)),t=We(()=>{const r=ln(ro(e[0])).filter(n=>n!=null);return r.every(n=>typeof n!="string")?r:void 0});return ZC(()=>{var r,n;return[(r=(n=t.value)===null||n===void 0?void 0:n.map(i=>Pa(i)))!==null&&r!==void 0?r:[Ia].filter(i=>i!=null),ln(ro(t.value?e[1]:e[0])),ln(it(t.value?e[2]:e[1])),ro(t.value?e[3]:e[2])]},([r,n,i,a],s,l)=>{if(!r?.length||!n?.length||!i?.length)return;const d=DC(a)?{...a}:a,c=r.flatMap(u=>n.flatMap(f=>i.map(g=>o(u,f,g,d))));l(()=>{c.forEach(u=>u())})},{flush:"post"})}function HC(){const e=br(!1),o=Bt();return o&&Pn(()=>{e.value=!0},o),e}function VC(e){const o=HC();return We(()=>(o.value,!!e()))}function GC(e,o,t={}){const{window:r=Ia,...n}=t;let i;const a=VC(()=>r&&"MutationObserver"in r),s=()=>{i&&(i.disconnect(),i=void 0)},l=at(We(()=>{const u=ln(ro(e)).map(Pa).filter(IC);return new Set(u)}),u=>{s(),a.value&&u.size&&(i=new MutationObserver(o),u.forEach(f=>i.observe(f,n)))},{immediate:!0,flush:"post"}),d=()=>i?.takeRecords(),c=()=>{l(),s()};return zC(c),{isSupported:a,stop:c,takeRecords:d}}const Ol=1;function iE(e,o={}){const{throttle:t=0,idle:r=200,onStop:n=Qt,onScroll:i=Qt,offset:a={left:0,right:0,top:0,bottom:0},observe:s={mutation:!1},eventListenerOptions:l={capture:!1,passive:!0},behavior:d="auto",window:c=Ia,onError:u=k=>{console.error(k)}}=o,f=typeof s=="boolean"?{mutation:s}:s,g=br(0),v=br(0),w=We({get(){return g.value},set(k){A(k,void 0)}}),T=We({get(){return v.value},set(k){A(void 0,k)}});function A(k,S){var q,z,Q,de;if(!c)return;const se=ro(e);if(!se)return;(q=se instanceof Document?c.document.body:se)===null||q===void 0||q.scrollTo({top:(z=ro(S))!==null&&z!==void 0?z:T.value,left:(Q=ro(k))!==null&&Q!==void 0?Q:w.value,behavior:ro(d)});const te=(se==null||(de=se.document)===null||de===void 0?void 0:de.documentElement)||se?.documentElement||se;w!=null&&(g.value=te.scrollLeft),T!=null&&(v.value=te.scrollTop)}const E=br(!1),F=$t({left:!0,right:!1,top:!0,bottom:!1}),L=$t({left:!1,right:!1,top:!1,bottom:!1}),Z=k=>{E.value&&(E.value=!1,L.left=!1,L.right=!1,L.top=!1,L.bottom=!1,n(k))},G=FC(Z,t+r),X=k=>{var S;if(!c)return;const q=(k==null||(S=k.document)===null||S===void 0?void 0:S.documentElement)||k?.documentElement||Pa(k),{display:z,flexDirection:Q,direction:de}=c.getComputedStyle(q),se=de==="rtl"?-1:1,te=q.scrollLeft;L.left=te<g.value,L.right=te>g.value;const ee=Math.abs(te*se)<=(a.left||0),ne=Math.abs(te*se)+q.clientWidth>=q.scrollWidth-(a.right||0)-Ol;z==="flex"&&Q==="row-reverse"?(F.left=ne,F.right=ee):(F.left=ee,F.right=ne),g.value=te;let me=q.scrollTop;k===c.document&&!me&&(me=c.document.body.scrollTop),L.top=me<v.value,L.bottom=me>v.value;const Ae=Math.abs(me)<=(a.top||0),Se=Math.abs(me)+q.clientHeight>=q.scrollHeight-(a.bottom||0)-Ol;z==="flex"&&Q==="column-reverse"?(F.top=Se,F.bottom=Ae):(F.top=Ae,F.bottom=Se),v.value=me},W=k=>{var S;c&&(X((S=k.target.documentElement)!==null&&S!==void 0?S:k.target),E.value=!0,G(k),i(k))};return zl(e,"scroll",t?jC(W,t,!0,!1):W,l),UC(()=>{try{const k=ro(e);if(!k)return;X(k)}catch(k){u(k)}}),f?.mutation&&e!=null&&e!==c&&e!==document&&GC(e,()=>{const k=ro(e);k&&X(k)},{attributes:!0,childList:!0,subtree:!0}),zl(e,"scrollend",Z,l),{x:w,y:T,isScrolling:E,arrivedState:F,directions:L,measure(){const k=ro(e);c&&k&&X(k)}}}function B(e,o,t){function r(s,l){if(s._zod||Object.defineProperty(s,"_zod",{value:{def:l,constr:a,traits:new Set},enumerable:!1}),s._zod.traits.has(e))return;s._zod.traits.add(e),o(s,l);const d=a.prototype,c=Object.keys(d);for(let u=0;u<c.length;u++){const f=c[u];f in s||(s[f]=d[f].bind(s))}}const n=t?.Parent??Object;class i extends n{}Object.defineProperty(i,"name",{value:e});function a(s){var l;const d=t?.Parent?new i:this;r(d,s),(l=d._zod).deferred??(l.deferred=[]);for(const c of d._zod.deferred)c();return d}return Object.defineProperty(a,"init",{value:r}),Object.defineProperty(a,Symbol.hasInstance,{value:s=>t?.Parent&&s instanceof t.Parent?!0:s?._zod?.traits?.has(e)}),Object.defineProperty(a,"name",{value:e}),a}class Yt extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}}class iu extends Error{constructor(o){super(`Encountered unidirectional transform during encode: ${o}`),this.name="ZodEncodeError"}}const KC={};function Et(e){return KC}function na(e,o){return typeof o=="bigint"?o.toString():o}function Da(e){return e==null}function Na(e){const o=e.startsWith("^")?1:0,t=e.endsWith("$")?e.length-1:e.length;return e.slice(o,t)}const Il=Symbol("evaluating");function ye(e,o,t){let r;Object.defineProperty(e,o,{get(){if(r!==Il)return r===void 0&&(r=Il,r=t()),r},set(n){Object.defineProperty(e,o,{value:n})},configurable:!0})}function YC(...e){const o={};for(const t of e){const r=Object.getOwnPropertyDescriptors(t);Object.assign(o,r)}return Object.defineProperties({},o)}function XC(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}const au="captureStackTrace"in Error?Error.captureStackTrace:(...e)=>{};function Pl(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function ia(e){if(Pl(e)===!1)return!1;const o=e.constructor;if(o===void 0||typeof o!="function")return!0;const t=o.prototype;return!(Pl(t)===!1||Object.prototype.hasOwnProperty.call(t,"isPrototypeOf")===!1)}function su(e){return ia(e)?{...e}:Array.isArray(e)?[...e]:e}function La(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function qC(e,o,t){const r=new e._zod.constr(o??e._zod.def);return(!o||t?.parent)&&(r._zod.parent=e),r}function ae(e){const o=e;if(!o)return{};if(typeof o=="string")return{error:()=>o};if(o?.message!==void 0){if(o?.error!==void 0)throw new Error("Cannot specify both `message` and `error` params");o.error=o.message}return delete o.message,typeof o.error=="string"?{...o,error:()=>o.error}:o}function Zt(e,o=0){if(e.aborted===!0)return!0;for(let t=o;t<e.issues.length;t++)if(e.issues[t]?.continue!==!0)return!0;return!1}function JC(e,o){return o.map(t=>{var r;return(r=t).path??(r.path=[]),t.path.unshift(e),t})}function en(e){return typeof e=="string"?e:e?.message}function Tt(e,o,t){const r={...e,path:e.path??[]};if(!e.message){const n=en(e.inst?._zod.def?.error?.(e))??en(o?.error?.(e))??en(t.customError?.(e))??en(t.localeError?.(e))??"Invalid input";r.message=n}return delete r.inst,delete r.continue,o?.reportInput||delete r.input,r}function Ma(e){return Array.isArray(e)?"array":typeof e=="string"?"string":"unknown"}function Ir(...e){const[o,t,r]=e;return typeof o=="string"?{message:o,code:"custom",input:t,inst:r}:{...o}}const lu=(e,o)=>{e.name="$ZodError",Object.defineProperty(e,"_zod",{value:e._zod,enumerable:!1}),Object.defineProperty(e,"issues",{value:o,enumerable:!1}),e.message=JSON.stringify(o,na,2),Object.defineProperty(e,"toString",{value:()=>e.message,enumerable:!1})},cu=B("$ZodError",lu),du=B("$ZodError",lu,{Parent:Error});function QC(e,o=t=>t.message){const t={},r=[];for(const n of e.issues)n.path.length>0?(t[n.path[0]]=t[n.path[0]]||[],t[n.path[0]].push(o(n))):r.push(o(n));return{formErrors:r,fieldErrors:t}}function e1(e,o=t=>t.message){const t={_errors:[]},r=n=>{for(const i of n.issues)if(i.code==="invalid_union"&&i.errors.length)i.errors.map(a=>r({issues:a}));else if(i.code==="invalid_key")r({issues:i.issues});else if(i.code==="invalid_element")r({issues:i.issues});else if(i.path.length===0)t._errors.push(o(i));else{let a=t,s=0;for(;s<i.path.length;){const l=i.path[s];s===i.path.length-1?(a[l]=a[l]||{_errors:[]},a[l]._errors.push(o(i))):a[l]=a[l]||{_errors:[]},a=a[l],s++}}};return r(e),t}const Fa=e=>(o,t,r,n)=>{const i=r?Object.assign(r,{async:!1}):{async:!1},a=o._zod.run({value:t,issues:[]},i);if(a instanceof Promise)throw new Yt;if(a.issues.length){const s=new(n?.Err??e)(a.issues.map(l=>Tt(l,i,Et())));throw au(s,n?.callee),s}return a.value},ja=e=>async(o,t,r,n)=>{const i=r?Object.assign(r,{async:!0}):{async:!0};let a=o._zod.run({value:t,issues:[]},i);if(a instanceof Promise&&(a=await a),a.issues.length){const s=new(n?.Err??e)(a.issues.map(l=>Tt(l,i,Et())));throw au(s,n?.callee),s}return a.value},Un=e=>(o,t,r)=>{const n=r?{...r,async:!1}:{async:!1},i=o._zod.run({value:t,issues:[]},n);if(i instanceof Promise)throw new Yt;return i.issues.length?{success:!1,error:new(e??cu)(i.issues.map(a=>Tt(a,n,Et())))}:{success:!0,data:i.value}},o1=Un(du),Zn=e=>async(o,t,r)=>{const n=r?Object.assign(r,{async:!0}):{async:!0};let i=o._zod.run({value:t,issues:[]},n);return i instanceof Promise&&(i=await i),i.issues.length?{success:!1,error:new e(i.issues.map(a=>Tt(a,n,Et())))}:{success:!0,data:i.value}},t1=Zn(du),r1=e=>(o,t,r)=>{const n=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return Fa(e)(o,t,n)},n1=e=>(o,t,r)=>Fa(e)(o,t,r),i1=e=>async(o,t,r)=>{const n=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return ja(e)(o,t,n)},a1=e=>async(o,t,r)=>ja(e)(o,t,r),s1=e=>(o,t,r)=>{const n=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return Un(e)(o,t,n)},l1=e=>(o,t,r)=>Un(e)(o,t,r),c1=e=>async(o,t,r)=>{const n=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return Zn(e)(o,t,n)},d1=e=>async(o,t,r)=>Zn(e)(o,t,r),u1=/^[cC][^\s-]{8,}$/,f1=/^[0-9a-z]+$/,p1=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,g1=/^[0-9a-vA-V]{20}$/,h1=/^[A-Za-z0-9]{27}$/,b1=/^[a-zA-Z0-9_-]{21}$/,m1=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,v1=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,Dl=e=>e?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,y1=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,k1="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function w1(){return new RegExp(k1,"u")}const x1=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,_1=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,C1=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,$1=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,S1=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,uu=/^[A-Za-z0-9_-]*$/,R1=/^\+(?:[0-9]){6,14}[0-9]$/,fu="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",E1=new RegExp(`^${fu}$`);function pu(e){const o="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof e.precision=="number"?e.precision===-1?`${o}`:e.precision===0?`${o}:[0-5]\\d`:`${o}:[0-5]\\d\\.\\d{${e.precision}}`:`${o}(?::[0-5]\\d(?:\\.\\d+)?)?`}function T1(e){return new RegExp(`^${pu(e)}$`)}function A1(e){const o=pu({precision:e.precision}),t=["Z"];e.local&&t.push(""),e.offset&&t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");const r=`${o}(?:${t.join("|")})`;return new RegExp(`^${fu}T(?:${r})$`)}const B1=e=>{const o=e?`[\\s\\S]{${e?.minimum??0},${e?.maximum??""}}`:"[\\s\\S]*";return new RegExp(`^${o}$`)},z1=/^[^A-Z]*$/,O1=/^[^a-z]*$/,Io=B("$ZodCheck",(e,o)=>{var t;e._zod??(e._zod={}),e._zod.def=o,(t=e._zod).onattach??(t.onattach=[])}),I1=B("$ZodCheckMaxLength",(e,o)=>{var t;Io.init(e,o),(t=e._zod.def).when??(t.when=r=>{const n=r.value;return!Da(n)&&n.length!==void 0}),e._zod.onattach.push(r=>{const n=r._zod.bag.maximum??Number.POSITIVE_INFINITY;o.maximum<n&&(r._zod.bag.maximum=o.maximum)}),e._zod.check=r=>{const n=r.value;if(n.length<=o.maximum)return;const a=Ma(n);r.issues.push({origin:a,code:"too_big",maximum:o.maximum,inclusive:!0,input:n,inst:e,continue:!o.abort})}}),P1=B("$ZodCheckMinLength",(e,o)=>{var t;Io.init(e,o),(t=e._zod.def).when??(t.when=r=>{const n=r.value;return!Da(n)&&n.length!==void 0}),e._zod.onattach.push(r=>{const n=r._zod.bag.minimum??Number.NEGATIVE_INFINITY;o.minimum>n&&(r._zod.bag.minimum=o.minimum)}),e._zod.check=r=>{const n=r.value;if(n.length>=o.minimum)return;const a=Ma(n);r.issues.push({origin:a,code:"too_small",minimum:o.minimum,inclusive:!0,input:n,inst:e,continue:!o.abort})}}),D1=B("$ZodCheckLengthEquals",(e,o)=>{var t;Io.init(e,o),(t=e._zod.def).when??(t.when=r=>{const n=r.value;return!Da(n)&&n.length!==void 0}),e._zod.onattach.push(r=>{const n=r._zod.bag;n.minimum=o.length,n.maximum=o.length,n.length=o.length}),e._zod.check=r=>{const n=r.value,i=n.length;if(i===o.length)return;const a=Ma(n),s=i>o.length;r.issues.push({origin:a,...s?{code:"too_big",maximum:o.length}:{code:"too_small",minimum:o.length},inclusive:!0,exact:!0,input:r.value,inst:e,continue:!o.abort})}}),Hn=B("$ZodCheckStringFormat",(e,o)=>{var t,r;Io.init(e,o),e._zod.onattach.push(n=>{const i=n._zod.bag;i.format=o.format,o.pattern&&(i.patterns??(i.patterns=new Set),i.patterns.add(o.pattern))}),o.pattern?(t=e._zod).check??(t.check=n=>{o.pattern.lastIndex=0,!o.pattern.test(n.value)&&n.issues.push({origin:"string",code:"invalid_format",format:o.format,input:n.value,...o.pattern?{pattern:o.pattern.toString()}:{},inst:e,continue:!o.abort})}):(r=e._zod).check??(r.check=()=>{})}),N1=B("$ZodCheckRegex",(e,o)=>{Hn.init(e,o),e._zod.check=t=>{o.pattern.lastIndex=0,!o.pattern.test(t.value)&&t.issues.push({origin:"string",code:"invalid_format",format:"regex",input:t.value,pattern:o.pattern.toString(),inst:e,continue:!o.abort})}}),L1=B("$ZodCheckLowerCase",(e,o)=>{o.pattern??(o.pattern=z1),Hn.init(e,o)}),M1=B("$ZodCheckUpperCase",(e,o)=>{o.pattern??(o.pattern=O1),Hn.init(e,o)}),F1=B("$ZodCheckIncludes",(e,o)=>{Io.init(e,o);const t=La(o.includes),r=new RegExp(typeof o.position=="number"?`^.{${o.position}}${t}`:t);o.pattern=r,e._zod.onattach.push(n=>{const i=n._zod.bag;i.patterns??(i.patterns=new Set),i.patterns.add(r)}),e._zod.check=n=>{n.value.includes(o.includes,o.position)||n.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:o.includes,input:n.value,inst:e,continue:!o.abort})}}),j1=B("$ZodCheckStartsWith",(e,o)=>{Io.init(e,o);const t=new RegExp(`^${La(o.prefix)}.*`);o.pattern??(o.pattern=t),e._zod.onattach.push(r=>{const n=r._zod.bag;n.patterns??(n.patterns=new Set),n.patterns.add(t)}),e._zod.check=r=>{r.value.startsWith(o.prefix)||r.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:o.prefix,input:r.value,inst:e,continue:!o.abort})}}),W1=B("$ZodCheckEndsWith",(e,o)=>{Io.init(e,o);const t=new RegExp(`.*${La(o.suffix)}$`);o.pattern??(o.pattern=t),e._zod.onattach.push(r=>{const n=r._zod.bag;n.patterns??(n.patterns=new Set),n.patterns.add(t)}),e._zod.check=r=>{r.value.endsWith(o.suffix)||r.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:o.suffix,input:r.value,inst:e,continue:!o.abort})}}),U1=B("$ZodCheckOverwrite",(e,o)=>{Io.init(e,o),e._zod.check=t=>{t.value=o.tx(t.value)}}),Z1={major:4,minor:2,patch:1},so=B("$ZodType",(e,o)=>{var t;e??(e={}),e._zod.def=o,e._zod.bag=e._zod.bag||{},e._zod.version=Z1;const r=[...e._zod.def.checks??[]];e._zod.traits.has("$ZodCheck")&&r.unshift(e);for(const n of r)for(const i of n._zod.onattach)i(e);if(r.length===0)(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{const n=(a,s,l)=>{let d=Zt(a),c;for(const u of s){if(u._zod.def.when){if(!u._zod.def.when(a))continue}else if(d)continue;const f=a.issues.length,g=u._zod.check(a);if(g instanceof Promise&&l?.async===!1)throw new Yt;if(c||g instanceof Promise)c=(c??Promise.resolve()).then(async()=>{await g,a.issues.length!==f&&(d||(d=Zt(a,f)))});else{if(a.issues.length===f)continue;d||(d=Zt(a,f))}}return c?c.then(()=>a):a},i=(a,s,l)=>{if(Zt(a))return a.aborted=!0,a;const d=n(s,r,l);if(d instanceof Promise){if(l.async===!1)throw new Yt;return d.then(c=>e._zod.parse(c,l))}return e._zod.parse(d,l)};e._zod.run=(a,s)=>{if(s.skipChecks)return e._zod.parse(a,s);if(s.direction==="backward"){const d=e._zod.parse({value:a.value,issues:[]},{...s,skipChecks:!0});return d instanceof Promise?d.then(c=>i(c,a,s)):i(d,a,s)}const l=e._zod.parse(a,s);if(l instanceof Promise){if(s.async===!1)throw new Yt;return l.then(d=>n(d,r,s))}return n(l,r,s)}}e["~standard"]={validate:n=>{try{const i=o1(e,n);return i.success?{value:i.data}:{issues:i.error?.issues}}catch{return t1(e,n).then(a=>a.success?{value:a.data}:{issues:a.error?.issues})}},vendor:"zod",version:1}}),Wa=B("$ZodString",(e,o)=>{so.init(e,o),e._zod.pattern=[...e?._zod.bag?.patterns??[]].pop()??B1(e._zod.bag),e._zod.parse=(t,r)=>{if(o.coerce)try{t.value=String(t.value)}catch{}return typeof t.value=="string"||t.issues.push({expected:"string",code:"invalid_type",input:t.value,inst:e}),t}}),we=B("$ZodStringFormat",(e,o)=>{Hn.init(e,o),Wa.init(e,o)}),H1=B("$ZodGUID",(e,o)=>{o.pattern??(o.pattern=v1),we.init(e,o)}),V1=B("$ZodUUID",(e,o)=>{if(o.version){const r={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[o.version];if(r===void 0)throw new Error(`Invalid UUID version: "${o.version}"`);o.pattern??(o.pattern=Dl(r))}else o.pattern??(o.pattern=Dl());we.init(e,o)}),G1=B("$ZodEmail",(e,o)=>{o.pattern??(o.pattern=y1),we.init(e,o)}),K1=B("$ZodURL",(e,o)=>{we.init(e,o),e._zod.check=t=>{try{const r=t.value.trim(),n=new URL(r);o.hostname&&(o.hostname.lastIndex=0,o.hostname.test(n.hostname)||t.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:o.hostname.source,input:t.value,inst:e,continue:!o.abort})),o.protocol&&(o.protocol.lastIndex=0,o.protocol.test(n.protocol.endsWith(":")?n.protocol.slice(0,-1):n.protocol)||t.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:o.protocol.source,input:t.value,inst:e,continue:!o.abort})),o.normalize?t.value=n.href:t.value=r;return}catch{t.issues.push({code:"invalid_format",format:"url",input:t.value,inst:e,continue:!o.abort})}}}),Y1=B("$ZodEmoji",(e,o)=>{o.pattern??(o.pattern=w1()),we.init(e,o)}),X1=B("$ZodNanoID",(e,o)=>{o.pattern??(o.pattern=b1),we.init(e,o)}),q1=B("$ZodCUID",(e,o)=>{o.pattern??(o.pattern=u1),we.init(e,o)}),J1=B("$ZodCUID2",(e,o)=>{o.pattern??(o.pattern=f1),we.init(e,o)}),Q1=B("$ZodULID",(e,o)=>{o.pattern??(o.pattern=p1),we.init(e,o)}),e5=B("$ZodXID",(e,o)=>{o.pattern??(o.pattern=g1),we.init(e,o)}),o5=B("$ZodKSUID",(e,o)=>{o.pattern??(o.pattern=h1),we.init(e,o)}),t5=B("$ZodISODateTime",(e,o)=>{o.pattern??(o.pattern=A1(o)),we.init(e,o)}),r5=B("$ZodISODate",(e,o)=>{o.pattern??(o.pattern=E1),we.init(e,o)}),n5=B("$ZodISOTime",(e,o)=>{o.pattern??(o.pattern=T1(o)),we.init(e,o)}),i5=B("$ZodISODuration",(e,o)=>{o.pattern??(o.pattern=m1),we.init(e,o)}),a5=B("$ZodIPv4",(e,o)=>{o.pattern??(o.pattern=x1),we.init(e,o),e._zod.bag.format="ipv4"}),s5=B("$ZodIPv6",(e,o)=>{o.pattern??(o.pattern=_1),we.init(e,o),e._zod.bag.format="ipv6",e._zod.check=t=>{try{new URL(`http://[${t.value}]`)}catch{t.issues.push({code:"invalid_format",format:"ipv6",input:t.value,inst:e,continue:!o.abort})}}}),l5=B("$ZodCIDRv4",(e,o)=>{o.pattern??(o.pattern=C1),we.init(e,o)}),c5=B("$ZodCIDRv6",(e,o)=>{o.pattern??(o.pattern=$1),we.init(e,o),e._zod.check=t=>{const r=t.value.split("/");try{if(r.length!==2)throw new Error;const[n,i]=r;if(!i)throw new Error;const a=Number(i);if(`${a}`!==i)throw new Error;if(a<0||a>128)throw new Error;new URL(`http://[${n}]`)}catch{t.issues.push({code:"invalid_format",format:"cidrv6",input:t.value,inst:e,continue:!o.abort})}}});function gu(e){if(e==="")return!0;if(e.length%4!==0)return!1;try{return atob(e),!0}catch{return!1}}const d5=B("$ZodBase64",(e,o)=>{o.pattern??(o.pattern=S1),we.init(e,o),e._zod.bag.contentEncoding="base64",e._zod.check=t=>{gu(t.value)||t.issues.push({code:"invalid_format",format:"base64",input:t.value,inst:e,continue:!o.abort})}});function u5(e){if(!uu.test(e))return!1;const o=e.replace(/[-_]/g,r=>r==="-"?"+":"/"),t=o.padEnd(Math.ceil(o.length/4)*4,"=");return gu(t)}const f5=B("$ZodBase64URL",(e,o)=>{o.pattern??(o.pattern=uu),we.init(e,o),e._zod.bag.contentEncoding="base64url",e._zod.check=t=>{u5(t.value)||t.issues.push({code:"invalid_format",format:"base64url",input:t.value,inst:e,continue:!o.abort})}}),p5=B("$ZodE164",(e,o)=>{o.pattern??(o.pattern=R1),we.init(e,o)});function g5(e,o=null){try{const t=e.split(".");if(t.length!==3)return!1;const[r]=t;if(!r)return!1;const n=JSON.parse(atob(r));return!("typ"in n&&n?.typ!=="JWT"||!n.alg||o&&(!("alg"in n)||n.alg!==o))}catch{return!1}}const h5=B("$ZodJWT",(e,o)=>{we.init(e,o),e._zod.check=t=>{g5(t.value,o.alg)||t.issues.push({code:"invalid_format",format:"jwt",input:t.value,inst:e,continue:!o.abort})}});function Nl(e,o,t){e.issues.length&&o.issues.push(...JC(t,e.issues)),o.value[t]=e.value}const b5=B("$ZodArray",(e,o)=>{so.init(e,o),e._zod.parse=(t,r)=>{const n=t.value;if(!Array.isArray(n))return t.issues.push({expected:"array",code:"invalid_type",input:n,inst:e}),t;t.value=Array(n.length);const i=[];for(let a=0;a<n.length;a++){const s=n[a],l=o.element._zod.run({value:s,issues:[]},r);l instanceof Promise?i.push(l.then(d=>Nl(d,t,a))):Nl(l,t,a)}return i.length?Promise.all(i).then(()=>t):t}});function Ll(e,o,t,r){for(const i of e)if(i.issues.length===0)return o.value=i.value,o;const n=e.filter(i=>!Zt(i));return n.length===1?(o.value=n[0].value,n[0]):(o.issues.push({code:"invalid_union",input:o.value,inst:t,errors:e.map(i=>i.issues.map(a=>Tt(a,r,Et())))}),o)}const m5=B("$ZodUnion",(e,o)=>{so.init(e,o),ye(e._zod,"optin",()=>o.options.some(n=>n._zod.optin==="optional")?"optional":void 0),ye(e._zod,"optout",()=>o.options.some(n=>n._zod.optout==="optional")?"optional":void 0),ye(e._zod,"values",()=>{if(o.options.every(n=>n._zod.values))return new Set(o.options.flatMap(n=>Array.from(n._zod.values)))}),ye(e._zod,"pattern",()=>{if(o.options.every(n=>n._zod.pattern)){const n=o.options.map(i=>i._zod.pattern);return new RegExp(`^(${n.map(i=>Na(i.source)).join("|")})$`)}});const t=o.options.length===1,r=o.options[0]._zod.run;e._zod.parse=(n,i)=>{if(t)return r(n,i);let a=!1;const s=[];for(const l of o.options){const d=l._zod.run({value:n.value,issues:[]},i);if(d instanceof Promise)s.push(d),a=!0;else{if(d.issues.length===0)return d;s.push(d)}}return a?Promise.all(s).then(l=>Ll(l,n,e,i)):Ll(s,n,e,i)}}),v5=B("$ZodIntersection",(e,o)=>{so.init(e,o),e._zod.parse=(t,r)=>{const n=t.value,i=o.left._zod.run({value:n,issues:[]},r),a=o.right._zod.run({value:n,issues:[]},r);return i instanceof Promise||a instanceof Promise?Promise.all([i,a]).then(([l,d])=>Ml(t,l,d)):Ml(t,i,a)}});function aa(e,o){if(e===o)return{valid:!0,data:e};if(e instanceof Date&&o instanceof Date&&+e==+o)return{valid:!0,data:e};if(ia(e)&&ia(o)){const t=Object.keys(o),r=Object.keys(e).filter(i=>t.indexOf(i)!==-1),n={...e,...o};for(const i of r){const a=aa(e[i],o[i]);if(!a.valid)return{valid:!1,mergeErrorPath:[i,...a.mergeErrorPath]};n[i]=a.data}return{valid:!0,data:n}}if(Array.isArray(e)&&Array.isArray(o)){if(e.length!==o.length)return{valid:!1,mergeErrorPath:[]};const t=[];for(let r=0;r<e.length;r++){const n=e[r],i=o[r],a=aa(n,i);if(!a.valid)return{valid:!1,mergeErrorPath:[r,...a.mergeErrorPath]};t.push(a.data)}return{valid:!0,data:t}}return{valid:!1,mergeErrorPath:[]}}function Ml(e,o,t){if(o.issues.length&&e.issues.push(...o.issues),t.issues.length&&e.issues.push(...t.issues),Zt(e))return e;const r=aa(o.value,t.value);if(!r.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(r.mergeErrorPath)}`);return e.value=r.data,e}const y5=B("$ZodTransform",(e,o)=>{so.init(e,o),e._zod.parse=(t,r)=>{if(r.direction==="backward")throw new iu(e.constructor.name);const n=o.transform(t.value,t);if(r.async)return(n instanceof Promise?n:Promise.resolve(n)).then(a=>(t.value=a,t));if(n instanceof Promise)throw new Yt;return t.value=n,t}});function Fl(e,o){return e.issues.length&&o===void 0?{issues:[],value:void 0}:e}const k5=B("$ZodOptional",(e,o)=>{so.init(e,o),e._zod.optin="optional",e._zod.optout="optional",ye(e._zod,"values",()=>o.innerType._zod.values?new Set([...o.innerType._zod.values,void 0]):void 0),ye(e._zod,"pattern",()=>{const t=o.innerType._zod.pattern;return t?new RegExp(`^(${Na(t.source)})?$`):void 0}),e._zod.parse=(t,r)=>{if(o.innerType._zod.optin==="optional"){const n=o.innerType._zod.run(t,r);return n instanceof Promise?n.then(i=>Fl(i,t.value)):Fl(n,t.value)}return t.value===void 0?t:o.innerType._zod.run(t,r)}}),w5=B("$ZodNullable",(e,o)=>{so.init(e,o),ye(e._zod,"optin",()=>o.innerType._zod.optin),ye(e._zod,"optout",()=>o.innerType._zod.optout),ye(e._zod,"pattern",()=>{const t=o.innerType._zod.pattern;return t?new RegExp(`^(${Na(t.source)}|null)$`):void 0}),ye(e._zod,"values",()=>o.innerType._zod.values?new Set([...o.innerType._zod.values,null]):void 0),e._zod.parse=(t,r)=>t.value===null?t:o.innerType._zod.run(t,r)}),x5=B("$ZodDefault",(e,o)=>{so.init(e,o),e._zod.optin="optional",ye(e._zod,"values",()=>o.innerType._zod.values),e._zod.parse=(t,r)=>{if(r.direction==="backward")return o.innerType._zod.run(t,r);if(t.value===void 0)return t.value=o.defaultValue,t;const n=o.innerType._zod.run(t,r);return n instanceof Promise?n.then(i=>jl(i,o)):jl(n,o)}});function jl(e,o){return e.value===void 0&&(e.value=o.defaultValue),e}const _5=B("$ZodPrefault",(e,o)=>{so.init(e,o),e._zod.optin="optional",ye(e._zod,"values",()=>o.innerType._zod.values),e._zod.parse=(t,r)=>(r.direction==="backward"||t.value===void 0&&(t.value=o.defaultValue),o.innerType._zod.run(t,r))}),C5=B("$ZodNonOptional",(e,o)=>{so.init(e,o),ye(e._zod,"values",()=>{const t=o.innerType._zod.values;return t?new Set([...t].filter(r=>r!==void 0)):void 0}),e._zod.parse=(t,r)=>{const n=o.innerType._zod.run(t,r);return n instanceof Promise?n.then(i=>Wl(i,e)):Wl(n,e)}});function Wl(e,o){return!e.issues.length&&e.value===void 0&&e.issues.push({code:"invalid_type",expected:"nonoptional",input:e.value,inst:o}),e}const $5=B("$ZodCatch",(e,o)=>{so.init(e,o),ye(e._zod,"optin",()=>o.innerType._zod.optin),ye(e._zod,"optout",()=>o.innerType._zod.optout),ye(e._zod,"values",()=>o.innerType._zod.values),e._zod.parse=(t,r)=>{if(r.direction==="backward")return o.innerType._zod.run(t,r);const n=o.innerType._zod.run(t,r);return n instanceof Promise?n.then(i=>(t.value=i.value,i.issues.length&&(t.value=o.catchValue({...t,error:{issues:i.issues.map(a=>Tt(a,r,Et()))},input:t.value}),t.issues=[]),t)):(t.value=n.value,n.issues.length&&(t.value=o.catchValue({...t,error:{issues:n.issues.map(i=>Tt(i,r,Et()))},input:t.value}),t.issues=[]),t)}}),S5=B("$ZodPipe",(e,o)=>{so.init(e,o),ye(e._zod,"values",()=>o.in._zod.values),ye(e._zod,"optin",()=>o.in._zod.optin),ye(e._zod,"optout",()=>o.out._zod.optout),ye(e._zod,"propValues",()=>o.in._zod.propValues),e._zod.parse=(t,r)=>{if(r.direction==="backward"){const i=o.out._zod.run(t,r);return i instanceof Promise?i.then(a=>on(a,o.in,r)):on(i,o.in,r)}const n=o.in._zod.run(t,r);return n instanceof Promise?n.then(i=>on(i,o.out,r)):on(n,o.out,r)}});function on(e,o,t){return e.issues.length?(e.aborted=!0,e):o._zod.run({value:e.value,issues:e.issues},t)}const R5=B("$ZodReadonly",(e,o)=>{so.init(e,o),ye(e._zod,"propValues",()=>o.innerType._zod.propValues),ye(e._zod,"values",()=>o.innerType._zod.values),ye(e._zod,"optin",()=>o.innerType?._zod?.optin),ye(e._zod,"optout",()=>o.innerType?._zod?.optout),e._zod.parse=(t,r)=>{if(r.direction==="backward")return o.innerType._zod.run(t,r);const n=o.innerType._zod.run(t,r);return n instanceof Promise?n.then(Ul):Ul(n)}});function Ul(e){return e.value=Object.freeze(e.value),e}const E5=B("$ZodCustom",(e,o)=>{Io.init(e,o),so.init(e,o),e._zod.parse=(t,r)=>t,e._zod.check=t=>{const r=t.value,n=o.fn(r);if(n instanceof Promise)return n.then(i=>Zl(i,t,r,e));Zl(n,t,r,e)}});function Zl(e,o,t,r){if(!e){const n={code:"custom",input:t,inst:r,path:[...r._zod.def.path??[]],continue:!r._zod.def.abort};r._zod.def.params&&(n.params=r._zod.def.params),o.issues.push(Ir(n))}}var Hl;class T5{constructor(){this._map=new WeakMap,this._idmap=new Map}add(o,...t){const r=t[0];if(this._map.set(o,r),r&&typeof r=="object"&&"id"in r){if(this._idmap.has(r.id))throw new Error(`ID ${r.id} already exists in the registry`);this._idmap.set(r.id,o)}return this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(o){const t=this._map.get(o);return t&&typeof t=="object"&&"id"in t&&this._idmap.delete(t.id),this._map.delete(o),this}get(o){const t=o._zod.parent;if(t){const r={...this.get(t)??{}};delete r.id;const n={...r,...this._map.get(o)};return Object.keys(n).length?n:void 0}return this._map.get(o)}has(o){return this._map.has(o)}}function A5(){return new T5}(Hl=globalThis).__zod_globalRegistry??(Hl.__zod_globalRegistry=A5());const fr=globalThis.__zod_globalRegistry;function B5(e,o){return new e({type:"string",...ae(o)})}function hu(e,o){return new e({type:"string",format:"email",check:"string_format",abort:!1,...ae(o)})}function Vl(e,o){return new e({type:"string",format:"guid",check:"string_format",abort:!1,...ae(o)})}function z5(e,o){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,...ae(o)})}function O5(e,o){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...ae(o)})}function I5(e,o){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...ae(o)})}function P5(e,o){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...ae(o)})}function D5(e,o){return new e({type:"string",format:"url",check:"string_format",abort:!1,...ae(o)})}function N5(e,o){return new e({type:"string",format:"emoji",check:"string_format",abort:!1,...ae(o)})}function L5(e,o){return new e({type:"string",format:"nanoid",check:"string_format",abort:!1,...ae(o)})}function M5(e,o){return new e({type:"string",format:"cuid",check:"string_format",abort:!1,...ae(o)})}function F5(e,o){return new e({type:"string",format:"cuid2",check:"string_format",abort:!1,...ae(o)})}function j5(e,o){return new e({type:"string",format:"ulid",check:"string_format",abort:!1,...ae(o)})}function W5(e,o){return new e({type:"string",format:"xid",check:"string_format",abort:!1,...ae(o)})}function U5(e,o){return new e({type:"string",format:"ksuid",check:"string_format",abort:!1,...ae(o)})}function Z5(e,o){return new e({type:"string",format:"ipv4",check:"string_format",abort:!1,...ae(o)})}function H5(e,o){return new e({type:"string",format:"ipv6",check:"string_format",abort:!1,...ae(o)})}function V5(e,o){return new e({type:"string",format:"cidrv4",check:"string_format",abort:!1,...ae(o)})}function G5(e,o){return new e({type:"string",format:"cidrv6",check:"string_format",abort:!1,...ae(o)})}function K5(e,o){return new e({type:"string",format:"base64",check:"string_format",abort:!1,...ae(o)})}function Y5(e,o){return new e({type:"string",format:"base64url",check:"string_format",abort:!1,...ae(o)})}function X5(e,o){return new e({type:"string",format:"e164",check:"string_format",abort:!1,...ae(o)})}function q5(e,o){return new e({type:"string",format:"jwt",check:"string_format",abort:!1,...ae(o)})}function J5(e,o){return new e({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...ae(o)})}function Q5(e,o){return new e({type:"string",format:"date",check:"string_format",...ae(o)})}function e$(e,o){return new e({type:"string",format:"time",check:"string_format",precision:null,...ae(o)})}function o$(e,o){return new e({type:"string",format:"duration",check:"string_format",...ae(o)})}function bu(e,o){return new I1({check:"max_length",...ae(o),maximum:e})}function wn(e,o){return new P1({check:"min_length",...ae(o),minimum:e})}function mu(e,o){return new D1({check:"length_equals",...ae(o),length:e})}function t$(e,o){return new N1({check:"string_format",format:"regex",...ae(o),pattern:e})}function r$(e){return new L1({check:"string_format",format:"lowercase",...ae(e)})}function n$(e){return new M1({check:"string_format",format:"uppercase",...ae(e)})}function i$(e,o){return new F1({check:"string_format",format:"includes",...ae(o),includes:e})}function a$(e,o){return new j1({check:"string_format",format:"starts_with",...ae(o),prefix:e})}function s$(e,o){return new W1({check:"string_format",format:"ends_with",...ae(o),suffix:e})}function tr(e){return new U1({check:"overwrite",tx:e})}function l$(e){return tr(o=>o.normalize(e))}function c$(){return tr(e=>e.trim())}function d$(){return tr(e=>e.toLowerCase())}function u$(){return tr(e=>e.toUpperCase())}function f$(){return tr(e=>XC(e))}function p$(e,o,t){return new e({type:"array",element:o,...ae(t)})}function g$(e,o,t){return new e({type:"custom",check:"custom",fn:o,...ae(t)})}function h$(e){const o=b$(t=>(t.addIssue=r=>{if(typeof r=="string")t.issues.push(Ir(r,t.value,o._zod.def));else{const n=r;n.fatal&&(n.continue=!1),n.code??(n.code="custom"),n.input??(n.input=t.value),n.inst??(n.inst=o),n.continue??(n.continue=!o._zod.def.abort),t.issues.push(Ir(n))}},e(t.value,t)));return o}function b$(e,o){const t=new Io({check:"custom",...ae(o)});return t._zod.check=e,t}function vu(e){let o=e?.target??"draft-2020-12";return o==="draft-4"&&(o="draft-04"),o==="draft-7"&&(o="draft-07"),{processors:e.processors??{},metadataRegistry:e?.metadata??fr,target:o,unrepresentable:e?.unrepresentable??"throw",override:e?.override??(()=>{}),io:e?.io??"output",counter:0,seen:new Map,cycles:e?.cycles??"ref",reused:e?.reused??"inline",external:e?.external??void 0}}function ao(e,o,t={path:[],schemaPath:[]}){var r;const n=e._zod.def,i=o.seen.get(e);if(i)return i.count++,t.schemaPath.includes(e)&&(i.cycle=t.path),i.schema;const a={schema:{},count:1,cycle:void 0,path:t.path};o.seen.set(e,a);const s=e._zod.toJSONSchema?.();if(s)a.schema=s;else{const c={...t,schemaPath:[...t.schemaPath,e],path:t.path},u=e._zod.parent;if(u)a.ref=u,ao(u,o,c),o.seen.get(u).isParent=!0;else if(e._zod.processJSONSchema)e._zod.processJSONSchema(o,a.schema,c);else{const f=a.schema,g=o.processors[n.type];if(!g)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${n.type}`);g(e,o,f,c)}}const l=o.metadataRegistry.get(e);return l&&Object.assign(a.schema,l),o.io==="input"&&eo(e)&&(delete a.schema.examples,delete a.schema.default),o.io==="input"&&a.schema._prefault&&((r=a.schema).default??(r.default=a.schema._prefault)),delete a.schema._prefault,o.seen.get(e).schema}function yu(e,o){const t=e.seen.get(o);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");const r=i=>{const a=e.target==="draft-2020-12"?"$defs":"definitions";if(e.external){const c=e.external.registry.get(i[0])?.id,u=e.external.uri??(g=>g);if(c)return{ref:u(c)};const f=i[1].defId??i[1].schema.id??`schema${e.counter++}`;return i[1].defId=f,{defId:f,ref:`${u("__shared")}#/${a}/${f}`}}if(i[1]===t)return{ref:"#"};const l=`#/${a}/`,d=i[1].schema.id??`__schema${e.counter++}`;return{defId:d,ref:l+d}},n=i=>{if(i[1].schema.$ref)return;const a=i[1],{ref:s,defId:l}=r(i);a.def={...a.schema},l&&(a.defId=l);const d=a.schema;for(const c in d)delete d[c];d.$ref=s};if(e.cycles==="throw")for(const i of e.seen.entries()){const a=i[1];if(a.cycle)throw new Error(`Cycle detected: #/${a.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(const i of e.seen.entries()){const a=i[1];if(o===i[0]){n(i);continue}if(e.external){const l=e.external.registry.get(i[0])?.id;if(o!==i[0]&&l){n(i);continue}}if(e.metadataRegistry.get(i[0])?.id){n(i);continue}if(a.cycle){n(i);continue}if(a.count>1&&e.reused==="ref"){n(i);continue}}}function ku(e,o){const t=e.seen.get(o);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");const r=a=>{const s=e.seen.get(a),l=s.def??s.schema,d={...l};if(s.ref===null)return;const c=s.ref;if(s.ref=null,c){r(c);const u=e.seen.get(c).schema;u.$ref&&(e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0")?(l.allOf=l.allOf??[],l.allOf.push(u)):(Object.assign(l,u),Object.assign(l,d))}s.isParent||e.override({zodSchema:a,jsonSchema:l,path:s.path??[]})};for(const a of[...e.seen.entries()].reverse())r(a[0]);const n={};if(e.target==="draft-2020-12"?n.$schema="https://json-schema.org/draft/2020-12/schema":e.target==="draft-07"?n.$schema="http://json-schema.org/draft-07/schema#":e.target==="draft-04"?n.$schema="http://json-schema.org/draft-04/schema#":e.target,e.external?.uri){const a=e.external.registry.get(o)?.id;if(!a)throw new Error("Schema is missing an `id` property");n.$id=e.external.uri(a)}Object.assign(n,t.def??t.schema);const i=e.external?.defs??{};for(const a of e.seen.entries()){const s=a[1];s.def&&s.defId&&(i[s.defId]=s.def)}e.external||Object.keys(i).length>0&&(e.target==="draft-2020-12"?n.$defs=i:n.definitions=i);try{const a=JSON.parse(JSON.stringify(n));return Object.defineProperty(a,"~standard",{value:{...o["~standard"],jsonSchema:{input:xn(o,"input"),output:xn(o,"output")}},enumerable:!1,writable:!1}),a}catch{throw new Error("Error converting schema to JSON.")}}function eo(e,o){const t=o??{seen:new Set};if(t.seen.has(e))return!1;t.seen.add(e);const r=e._zod.def;if(r.type==="transform")return!0;if(r.type==="array")return eo(r.element,t);if(r.type==="set")return eo(r.valueType,t);if(r.type==="lazy")return eo(r.getter(),t);if(r.type==="promise"||r.type==="optional"||r.type==="nonoptional"||r.type==="nullable"||r.type==="readonly"||r.type==="default"||r.type==="prefault")return eo(r.innerType,t);if(r.type==="intersection")return eo(r.left,t)||eo(r.right,t);if(r.type==="record"||r.type==="map")return eo(r.keyType,t)||eo(r.valueType,t);if(r.type==="pipe")return eo(r.in,t)||eo(r.out,t);if(r.type==="object"){for(const n in r.shape)if(eo(r.shape[n],t))return!0;return!1}if(r.type==="union"){for(const n of r.options)if(eo(n,t))return!0;return!1}if(r.type==="tuple"){for(const n of r.items)if(eo(n,t))return!0;return!!(r.rest&&eo(r.rest,t))}return!1}const m$=(e,o={})=>t=>{const r=vu({...t,processors:o});return ao(e,r),yu(r,e),ku(r,e)},xn=(e,o)=>t=>{const{libraryOptions:r,target:n}=t??{},i=vu({...r??{},target:n,io:o,processors:{}});return ao(e,i),yu(i,e),ku(i,e)},v$={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},y$=(e,o,t,r)=>{const n=t;n.type="string";const{minimum:i,maximum:a,format:s,patterns:l,contentEncoding:d}=e._zod.bag;if(typeof i=="number"&&(n.minLength=i),typeof a=="number"&&(n.maxLength=a),s&&(n.format=v$[s]??s,n.format===""&&delete n.format),d&&(n.contentEncoding=d),l&&l.size>0){const c=[...l];c.length===1?n.pattern=c[0].source:c.length>1&&(n.allOf=[...c.map(u=>({...o.target==="draft-07"||o.target==="draft-04"||o.target==="openapi-3.0"?{type:"string"}:{},pattern:u.source}))])}},k$=(e,o,t,r)=>{if(o.unrepresentable==="throw")throw new Error("Custom types cannot be represented in JSON Schema")},w$=(e,o,t,r)=>{if(o.unrepresentable==="throw")throw new Error("Transforms cannot be represented in JSON Schema")},x$=(e,o,t,r)=>{const n=t,i=e._zod.def,{minimum:a,maximum:s}=e._zod.bag;typeof a=="number"&&(n.minItems=a),typeof s=="number"&&(n.maxItems=s),n.type="array",n.items=ao(i.element,o,{...r,path:[...r.path,"items"]})},_$=(e,o,t,r)=>{const n=e._zod.def,i=n.inclusive===!1,a=n.options.map((s,l)=>ao(s,o,{...r,path:[...r.path,i?"oneOf":"anyOf",l]}));i?t.oneOf=a:t.anyOf=a},C$=(e,o,t,r)=>{const n=e._zod.def,i=ao(n.left,o,{...r,path:[...r.path,"allOf",0]}),a=ao(n.right,o,{...r,path:[...r.path,"allOf",1]}),s=d=>"allOf"in d&&Object.keys(d).length===1,l=[...s(i)?i.allOf:[i],...s(a)?a.allOf:[a]];t.allOf=l},$$=(e,o,t,r)=>{const n=e._zod.def,i=ao(n.innerType,o,r),a=o.seen.get(e);o.target==="openapi-3.0"?(a.ref=n.innerType,t.nullable=!0):t.anyOf=[i,{type:"null"}]},S$=(e,o,t,r)=>{const n=e._zod.def;ao(n.innerType,o,r);const i=o.seen.get(e);i.ref=n.innerType},R$=(e,o,t,r)=>{const n=e._zod.def;ao(n.innerType,o,r);const i=o.seen.get(e);i.ref=n.innerType,t.default=JSON.parse(JSON.stringify(n.defaultValue))},E$=(e,o,t,r)=>{const n=e._zod.def;ao(n.innerType,o,r);const i=o.seen.get(e);i.ref=n.innerType,o.io==="input"&&(t._prefault=JSON.parse(JSON.stringify(n.defaultValue)))},T$=(e,o,t,r)=>{const n=e._zod.def;ao(n.innerType,o,r);const i=o.seen.get(e);i.ref=n.innerType;let a;try{a=n.catchValue(void 0)}catch{throw new Error("Dynamic catch values are not supported in JSON Schema")}t.default=a},A$=(e,o,t,r)=>{const n=e._zod.def,i=o.io==="input"?n.in._zod.def.type==="transform"?n.out:n.in:n.out;ao(i,o,r);const a=o.seen.get(e);a.ref=i},B$=(e,o,t,r)=>{const n=e._zod.def;ao(n.innerType,o,r);const i=o.seen.get(e);i.ref=n.innerType,t.readOnly=!0},z$=(e,o,t,r)=>{const n=e._zod.def;ao(n.innerType,o,r);const i=o.seen.get(e);i.ref=n.innerType},O$=B("ZodISODateTime",(e,o)=>{t5.init(e,o),_e.init(e,o)});function I$(e){return J5(O$,e)}const P$=B("ZodISODate",(e,o)=>{r5.init(e,o),_e.init(e,o)});function D$(e){return Q5(P$,e)}const N$=B("ZodISOTime",(e,o)=>{n5.init(e,o),_e.init(e,o)});function L$(e){return e$(N$,e)}const M$=B("ZodISODuration",(e,o)=>{i5.init(e,o),_e.init(e,o)});function F$(e){return o$(M$,e)}const j$=(e,o)=>{cu.init(e,o),e.name="ZodError",Object.defineProperties(e,{format:{value:t=>e1(e,t)},flatten:{value:t=>QC(e,t)},addIssue:{value:t=>{e.issues.push(t),e.message=JSON.stringify(e.issues,na,2)}},addIssues:{value:t=>{e.issues.push(...t),e.message=JSON.stringify(e.issues,na,2)}},isEmpty:{get(){return e.issues.length===0}}})},ko=B("ZodError",j$,{Parent:Error}),W$=Fa(ko),U$=ja(ko),Z$=Un(ko),H$=Zn(ko),V$=r1(ko),G$=n1(ko),K$=i1(ko),Y$=a1(ko),X$=s1(ko),q$=l1(ko),J$=c1(ko),Q$=d1(ko),fo=B("ZodType",(e,o)=>(so.init(e,o),Object.assign(e["~standard"],{jsonSchema:{input:xn(e,"input"),output:xn(e,"output")}}),e.toJSONSchema=m$(e,{}),e.def=o,e.type=o.type,Object.defineProperty(e,"_def",{value:o}),e.check=(...t)=>e.clone(YC(o,{checks:[...o.checks??[],...t.map(r=>typeof r=="function"?{_zod:{check:r,def:{check:"custom"},onattach:[]}}:r)]})),e.clone=(t,r)=>qC(e,t,r),e.brand=()=>e,e.register=((t,r)=>(t.add(e,r),e)),e.parse=(t,r)=>W$(e,t,r,{callee:e.parse}),e.safeParse=(t,r)=>Z$(e,t,r),e.parseAsync=async(t,r)=>U$(e,t,r,{callee:e.parseAsync}),e.safeParseAsync=async(t,r)=>H$(e,t,r),e.spa=e.safeParseAsync,e.encode=(t,r)=>V$(e,t,r),e.decode=(t,r)=>G$(e,t,r),e.encodeAsync=async(t,r)=>K$(e,t,r),e.decodeAsync=async(t,r)=>Y$(e,t,r),e.safeEncode=(t,r)=>X$(e,t,r),e.safeDecode=(t,r)=>q$(e,t,r),e.safeEncodeAsync=async(t,r)=>J$(e,t,r),e.safeDecodeAsync=async(t,r)=>Q$(e,t,r),e.refine=(t,r)=>e.check(MS(t,r)),e.superRefine=t=>e.check(FS(t)),e.overwrite=t=>e.check(tr(t)),e.optional=()=>Kl(e),e.nullable=()=>Yl(e),e.nullish=()=>Kl(Yl(e)),e.nonoptional=t=>zS(e,t),e.array=()=>vS(e),e.or=t=>kS([e,t]),e.and=t=>xS(e,t),e.transform=t=>Xl(e,CS(t)),e.default=t=>ES(e,t),e.prefault=t=>AS(e,t),e.catch=t=>IS(e,t),e.pipe=t=>Xl(e,t),e.readonly=()=>NS(e),e.describe=t=>{const r=e.clone();return fr.add(r,{description:t}),r},Object.defineProperty(e,"description",{get(){return fr.get(e)?.description},configurable:!0}),e.meta=(...t)=>{if(t.length===0)return fr.get(e);const r=e.clone();return fr.add(r,t[0]),r},e.isOptional=()=>e.safeParse(void 0).success,e.isNullable=()=>e.safeParse(null).success,e)),wu=B("_ZodString",(e,o)=>{Wa.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(r,n,i)=>y$(e,r,n);const t=e._zod.bag;e.format=t.format??null,e.minLength=t.minimum??null,e.maxLength=t.maximum??null,e.regex=(...r)=>e.check(t$(...r)),e.includes=(...r)=>e.check(i$(...r)),e.startsWith=(...r)=>e.check(a$(...r)),e.endsWith=(...r)=>e.check(s$(...r)),e.min=(...r)=>e.check(wn(...r)),e.max=(...r)=>e.check(bu(...r)),e.length=(...r)=>e.check(mu(...r)),e.nonempty=(...r)=>e.check(wn(1,...r)),e.lowercase=r=>e.check(r$(r)),e.uppercase=r=>e.check(n$(r)),e.trim=()=>e.check(c$()),e.normalize=(...r)=>e.check(l$(...r)),e.toLowerCase=()=>e.check(d$()),e.toUpperCase=()=>e.check(u$()),e.slugify=()=>e.check(f$())}),eS=B("ZodString",(e,o)=>{Wa.init(e,o),wu.init(e,o),e.email=t=>e.check(hu(xu,t)),e.url=t=>e.check(D5(oS,t)),e.jwt=t=>e.check(q5(bS,t)),e.emoji=t=>e.check(N5(tS,t)),e.guid=t=>e.check(Vl(Gl,t)),e.uuid=t=>e.check(z5(tn,t)),e.uuidv4=t=>e.check(O5(tn,t)),e.uuidv6=t=>e.check(I5(tn,t)),e.uuidv7=t=>e.check(P5(tn,t)),e.nanoid=t=>e.check(L5(rS,t)),e.guid=t=>e.check(Vl(Gl,t)),e.cuid=t=>e.check(M5(nS,t)),e.cuid2=t=>e.check(F5(iS,t)),e.ulid=t=>e.check(j5(aS,t)),e.base64=t=>e.check(K5(pS,t)),e.base64url=t=>e.check(Y5(gS,t)),e.xid=t=>e.check(W5(sS,t)),e.ksuid=t=>e.check(U5(lS,t)),e.ipv4=t=>e.check(Z5(cS,t)),e.ipv6=t=>e.check(H5(dS,t)),e.cidrv4=t=>e.check(V5(uS,t)),e.cidrv6=t=>e.check(G5(fS,t)),e.e164=t=>e.check(X5(hS,t)),e.datetime=t=>e.check(I$(t)),e.date=t=>e.check(D$(t)),e.time=t=>e.check(L$(t)),e.duration=t=>e.check(F$(t))});function aE(e){return B5(eS,e)}const _e=B("ZodStringFormat",(e,o)=>{we.init(e,o),wu.init(e,o)}),xu=B("ZodEmail",(e,o)=>{G1.init(e,o),_e.init(e,o)});function sE(e){return hu(xu,e)}const Gl=B("ZodGUID",(e,o)=>{H1.init(e,o),_e.init(e,o)}),tn=B("ZodUUID",(e,o)=>{V1.init(e,o),_e.init(e,o)}),oS=B("ZodURL",(e,o)=>{K1.init(e,o),_e.init(e,o)}),tS=B("ZodEmoji",(e,o)=>{Y1.init(e,o),_e.init(e,o)}),rS=B("ZodNanoID",(e,o)=>{X1.init(e,o),_e.init(e,o)}),nS=B("ZodCUID",(e,o)=>{q1.init(e,o),_e.init(e,o)}),iS=B("ZodCUID2",(e,o)=>{J1.init(e,o),_e.init(e,o)}),aS=B("ZodULID",(e,o)=>{Q1.init(e,o),_e.init(e,o)}),sS=B("ZodXID",(e,o)=>{e5.init(e,o),_e.init(e,o)}),lS=B("ZodKSUID",(e,o)=>{o5.init(e,o),_e.init(e,o)}),cS=B("ZodIPv4",(e,o)=>{a5.init(e,o),_e.init(e,o)}),dS=B("ZodIPv6",(e,o)=>{s5.init(e,o),_e.init(e,o)}),uS=B("ZodCIDRv4",(e,o)=>{l5.init(e,o),_e.init(e,o)}),fS=B("ZodCIDRv6",(e,o)=>{c5.init(e,o),_e.init(e,o)}),pS=B("ZodBase64",(e,o)=>{d5.init(e,o),_e.init(e,o)}),gS=B("ZodBase64URL",(e,o)=>{f5.init(e,o),_e.init(e,o)}),hS=B("ZodE164",(e,o)=>{p5.init(e,o),_e.init(e,o)}),bS=B("ZodJWT",(e,o)=>{h5.init(e,o),_e.init(e,o)}),mS=B("ZodArray",(e,o)=>{b5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>x$(e,t,r,n),e.element=o.element,e.min=(t,r)=>e.check(wn(t,r)),e.nonempty=t=>e.check(wn(1,t)),e.max=(t,r)=>e.check(bu(t,r)),e.length=(t,r)=>e.check(mu(t,r)),e.unwrap=()=>e.element});function vS(e,o){return p$(mS,e,o)}const yS=B("ZodUnion",(e,o)=>{m5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>_$(e,t,r,n),e.options=o.options});function kS(e,o){return new yS({type:"union",options:e,...ae(o)})}const wS=B("ZodIntersection",(e,o)=>{v5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>C$(e,t,r,n)});function xS(e,o){return new wS({type:"intersection",left:e,right:o})}const _S=B("ZodTransform",(e,o)=>{y5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>w$(e,t),e._zod.parse=(t,r)=>{if(r.direction==="backward")throw new iu(e.constructor.name);t.addIssue=i=>{if(typeof i=="string")t.issues.push(Ir(i,t.value,o));else{const a=i;a.fatal&&(a.continue=!1),a.code??(a.code="custom"),a.input??(a.input=t.value),a.inst??(a.inst=e),t.issues.push(Ir(a))}};const n=o.transform(t.value,t);return n instanceof Promise?n.then(i=>(t.value=i,t)):(t.value=n,t)}});function CS(e){return new _S({type:"transform",transform:e})}const $S=B("ZodOptional",(e,o)=>{k5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>z$(e,t,r,n),e.unwrap=()=>e._zod.def.innerType});function Kl(e){return new $S({type:"optional",innerType:e})}const SS=B("ZodNullable",(e,o)=>{w5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>$$(e,t,r,n),e.unwrap=()=>e._zod.def.innerType});function Yl(e){return new SS({type:"nullable",innerType:e})}const RS=B("ZodDefault",(e,o)=>{x5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>R$(e,t,r,n),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function ES(e,o){return new RS({type:"default",innerType:e,get defaultValue(){return typeof o=="function"?o():su(o)}})}const TS=B("ZodPrefault",(e,o)=>{_5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>E$(e,t,r,n),e.unwrap=()=>e._zod.def.innerType});function AS(e,o){return new TS({type:"prefault",innerType:e,get defaultValue(){return typeof o=="function"?o():su(o)}})}const BS=B("ZodNonOptional",(e,o)=>{C5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>S$(e,t,r,n),e.unwrap=()=>e._zod.def.innerType});function zS(e,o){return new BS({type:"nonoptional",innerType:e,...ae(o)})}const OS=B("ZodCatch",(e,o)=>{$5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>T$(e,t,r,n),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function IS(e,o){return new OS({type:"catch",innerType:e,catchValue:typeof o=="function"?o:()=>o})}const PS=B("ZodPipe",(e,o)=>{S5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>A$(e,t,r,n),e.in=o.in,e.out=o.out});function Xl(e,o){return new PS({type:"pipe",in:e,out:o})}const DS=B("ZodReadonly",(e,o)=>{R5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>B$(e,t,r,n),e.unwrap=()=>e._zod.def.innerType});function NS(e){return new DS({type:"readonly",innerType:e})}const LS=B("ZodCustom",(e,o)=>{E5.init(e,o),fo.init(e,o),e._zod.processJSONSchema=(t,r,n)=>k$(e,t)});function MS(e,o={}){return g$(LS,e,o)}function FS(e){return h$(e)}var lE=`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.font.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`,cE=`
    .p-virtualscroller-loader {
        background: dt('virtualscroller.loader.mask.background');
        color: dt('virtualscroller.loader.mask.color');
    }

    .p-virtualscroller-loading-icon {
        font-size: dt('virtualscroller.loader.icon.size');
        width: dt('virtualscroller.loader.icon.size');
        height: dt('virtualscroller.loader.icon.size');
    }
`,dE=`
    .p-autocomplete {
        display: inline-flex;
    }

    .p-autocomplete-loader {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-loader {
        inset-inline-end: calc(dt('autocomplete.dropdown.width') + dt('autocomplete.padding.x'));
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        flex: 1 1 auto;
        width: 1%;
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input,
    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input-multiple {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-autocomplete-dropdown {
        cursor: pointer;
        display: inline-flex;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('autocomplete.dropdown.width');
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
        background: dt('autocomplete.dropdown.background');
        border: 1px solid dt('autocomplete.dropdown.border.color');
        border-inline-start: 0 none;
        color: dt('autocomplete.dropdown.color');
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
    }

    .p-autocomplete-dropdown:not(:disabled):hover {
        background: dt('autocomplete.dropdown.hover.background');
        border-color: dt('autocomplete.dropdown.hover.border.color');
        color: dt('autocomplete.dropdown.hover.color');
    }

    .p-autocomplete-dropdown:not(:disabled):active {
        background: dt('autocomplete.dropdown.active.background');
        border-color: dt('autocomplete.dropdown.active.border.color');
        color: dt('autocomplete.dropdown.active.color');
    }

    .p-autocomplete-dropdown:focus-visible {
        box-shadow: dt('autocomplete.dropdown.focus.ring.shadow');
        outline: dt('autocomplete.dropdown.focus.ring.width') dt('autocomplete.dropdown.focus.ring.style') dt('autocomplete.dropdown.focus.ring.color');
        outline-offset: dt('autocomplete.dropdown.focus.ring.offset');
    }

    .p-autocomplete-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('autocomplete.overlay.background');
        color: dt('autocomplete.overlay.color');
        border: 1px solid dt('autocomplete.overlay.border.color');
        border-radius: dt('autocomplete.overlay.border.radius');
        box-shadow: dt('autocomplete.overlay.shadow');
        min-width: 100%;
    }

    .p-autocomplete-list-container {
        overflow: auto;
    }

    .p-autocomplete-list {
        margin: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: dt('autocomplete.list.gap');
        padding: dt('autocomplete.list.padding');
    }

    .p-autocomplete-option {
        cursor: pointer;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('autocomplete.option.padding');
        border: 0 none;
        color: dt('autocomplete.option.color');
        background: transparent;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration');
        border-radius: dt('autocomplete.option.border.radius');
    }

    .p-autocomplete-option:not(.p-autocomplete-option-selected):not(.p-disabled).p-focus {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .p-autocomplete-option:not(.p-autocomplete-option-selected):not(.p-disabled):hover {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .p-autocomplete-option-selected {
        background: dt('autocomplete.option.selected.background');
        color: dt('autocomplete.option.selected.color');
    }

    .p-autocomplete-option-selected.p-focus {
        background: dt('autocomplete.option.selected.focus.background');
        color: dt('autocomplete.option.selected.focus.color');
    }

    .p-autocomplete-option-group {
        margin: 0;
        padding: dt('autocomplete.option.group.padding');
        color: dt('autocomplete.option.group.color');
        background: dt('autocomplete.option.group.background');
        font-weight: dt('autocomplete.option.group.font.weight');
    }

    .p-autocomplete-input-multiple {
        margin: 0;
        list-style-type: none;
        cursor: text;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: calc(dt('autocomplete.padding.y') / 2) dt('autocomplete.padding.x');
        gap: calc(dt('autocomplete.padding.y') / 2);
        color: dt('autocomplete.color');
        background: dt('autocomplete.background');
        border: 1px solid dt('autocomplete.border.color');
        border-radius: dt('autocomplete.border.radius');
        width: 100%;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
        box-shadow: dt('autocomplete.shadow');
    }

    .p-autocomplete-input-multiple.p-disabled {
        opacity: 1;
        background: dt('autocomplete.disabled.background');
        color: dt('autocomplete.disabled.color');
    }

    .p-autocomplete-input-multiple:not(.p-disabled):hover {
        border-color: dt('autocomplete.hover.border.color');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple:not(.p-disabled) {
        border-color: dt('autocomplete.focus.border.color');
        box-shadow: dt('autocomplete.focus.ring.shadow');
        outline: dt('autocomplete.focus.ring.width') dt('autocomplete.focus.ring.style') dt('autocomplete.focus.ring.color');
        outline-offset: dt('autocomplete.focus.ring.offset');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.invalid.border.color');
    }

    .p-variant-filled.p-autocomplete-input-multiple {
        background: dt('autocomplete.filled.background');
    }

    .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled):hover {
        background: dt('autocomplete.filled.hover.background');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled) {
        background: dt('autocomplete.filled.focus.background');
    }

    .p-autocomplete-chip.p-chip {
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
        border-radius: dt('autocomplete.chip.border.radius');
    }

    .p-autocomplete-input-multiple:has(.p-autocomplete-chip) {
        padding-inline-start: calc(dt('autocomplete.padding.y') / 2);
        padding-inline-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-chip-item.p-focus .p-autocomplete-chip {
        background: dt('autocomplete.chip.focus.background');
        color: dt('autocomplete.chip.focus.color');
    }

    .p-autocomplete-input-chip {
        flex: 1 1 auto;
        display: inline-flex;
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-input-chip input {
        border: 0 none;
        outline: 0 none;
        background: transparent;
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: inherit;
    }

    .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.placeholder.color');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }

    .p-autocomplete-empty-message {
        padding: dt('autocomplete.empty.message.padding');
    }

    .p-autocomplete-fluid {
        display: flex;
    }

    .p-autocomplete-fluid:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        width: 1%;
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.sm.width');
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.lg.width');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-autocomplete-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        color: dt('form.field.icon.color');
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-clear-icon {
        inset-inline-end: calc(dt('autocomplete.padding.x') + dt('autocomplete.dropdown.width'));
    }

    .p-autocomplete:has(.p-autocomplete-clear-icon) .p-autocomplete-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputgroup .p-autocomplete-dropdown {
        border-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child:has(.p-autocomplete-dropdown) > .p-autocomplete-input {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child .p-autocomplete-dropdown {
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
    }
`,uE=`
    .p-scrollpanel-content-container {
        overflow: hidden;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
        float: left;
    }

    .p-scrollpanel-content {
        height: calc(100% + calc(2 * dt('scrollpanel.bar.size')));
        width: calc(100% + calc(2 * dt('scrollpanel.bar.size')));
        padding-inline: 0 calc(2 * dt('scrollpanel.bar.size'));
        padding-block: 0 calc(2 * dt('scrollpanel.bar.size'));
        position: relative;
        overflow: auto;
        box-sizing: border-box;
        scrollbar-width: none;
    }

    .p-scrollpanel-content::-webkit-scrollbar {
        display: none;
    }

    .p-scrollpanel-bar {
        position: relative;
        border-radius: dt('scrollpanel.bar.border.radius');
        z-index: 2;
        cursor: pointer;
        opacity: 0;
        outline-color: transparent;
        background: dt('scrollpanel.bar.background');
        border: 0 none;
        transition:
            outline-color dt('scrollpanel.transition.duration'),
            opacity dt('scrollpanel.transition.duration');
    }

    .p-scrollpanel-bar:focus-visible {
        box-shadow: dt('scrollpanel.bar.focus.ring.shadow');
        outline: dt('scrollpanel.barfocus.ring.width') dt('scrollpanel.bar.focus.ring.style') dt('scrollpanel.bar.focus.ring.color');
        outline-offset: dt('scrollpanel.barfocus.ring.offset');
    }

    .p-scrollpanel-bar-y {
        width: dt('scrollpanel.bar.size');
        inset-block-start: 0;
    }

    .p-scrollpanel-bar-x {
        height: dt('scrollpanel.bar.size');
        inset-block-end: 0;
    }

    .p-scrollpanel-hidden {
        visibility: hidden;
    }

    .p-scrollpanel:hover .p-scrollpanel-bar,
    .p-scrollpanel:active .p-scrollpanel-bar {
        opacity: 1;
    }

    .p-scrollpanel-grabbed {
        user-select: none;
    }
`,fE=`
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`,pE=`
    .p-splitter {
        display: flex;
        flex-wrap: nowrap;
        border: 1px solid dt('splitter.border.color');
        background: dt('splitter.background');
        border-radius: dt('border.radius.md');
        color: dt('splitter.color');
    }

    .p-splitter-vertical {
        flex-direction: column;
    }

    .p-splitter-gutter {
        flex-grow: 0;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        background: dt('splitter.gutter.background');
    }

    .p-splitter-gutter-handle {
        border-radius: dt('splitter.handle.border.radius');
        background: dt('splitter.handle.background');
        transition:
            outline-color dt('splitter.transition.duration'),
            box-shadow dt('splitter.transition.duration');
        outline-color: transparent;
    }

    .p-splitter-gutter-handle:focus-visible {
        box-shadow: dt('splitter.handle.focus.ring.shadow');
        outline: dt('splitter.handle.focus.ring.width') dt('splitter.handle.focus.ring.style') dt('splitter.handle.focus.ring.color');
        outline-offset: dt('splitter.handle.focus.ring.offset');
    }

    .p-splitter-horizontal.p-splitter-resizing {
        cursor: col-resize;
        user-select: none;
    }

    .p-splitter-vertical.p-splitter-resizing {
        cursor: row-resize;
        user-select: none;
    }

    .p-splitter-horizontal > .p-splitter-gutter > .p-splitter-gutter-handle {
        height: dt('splitter.handle.size');
        width: 100%;
    }

    .p-splitter-vertical > .p-splitter-gutter > .p-splitter-gutter-handle {
        width: dt('splitter.handle.size');
        height: 100%;
    }

    .p-splitter-horizontal > .p-splitter-gutter {
        cursor: col-resize;
    }

    .p-splitter-vertical > .p-splitter-gutter {
        cursor: row-resize;
    }

    .p-splitterpanel {
        flex-grow: 1;
        overflow: hidden;
    }

    .p-splitterpanel-nested {
        display: flex;
    }

    .p-splitterpanel .p-splitter {
        flex-grow: 1;
        border: 0 none;
    }
`;function gE(e,o){return Rt(),Ln("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[er("path",{"fill-rule":"evenodd",d:"M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z","clip-rule":"evenodd"})])}function hE(e,o){return Rt(),Ln("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[er("path",{"fill-rule":"evenodd",d:"M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z","clip-rule":"evenodd"})])}function bE(e,o){return Rt(),Ln("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[er("path",{d:"M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"})])}function mE(e,o){return Rt(),Ln("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[er("path",{"fill-rule":"evenodd",d:"M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z","clip-rule":"evenodd"})])}var vE=`
    .p-menu {
        background: dt('menu.background');
        color: dt('menu.color');
        border: 1px solid dt('menu.border.color');
        border-radius: dt('menu.border.radius');
        min-width: 12.5rem;
    }

    .p-menu-list {
        margin: 0;
        padding: dt('menu.list.padding');
        outline: 0 none;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: dt('menu.list.gap');
    }

    .p-menu-item-content {
        transition:
            background dt('menu.transition.duration'),
            color dt('menu.transition.duration');
        border-radius: dt('menu.item.border.radius');
        color: dt('menu.item.color');
        overflow: hidden;
    }

    .p-menu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menu.item.padding');
        gap: dt('menu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .p-menu-item-label {
        line-height: 1;
    }

    .p-menu-item-icon {
        color: dt('menu.item.icon.color');
    }

    .p-menu-item.p-focus .p-menu-item-content {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item.p-focus .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-overlay {
        box-shadow: dt('menu.shadow');
    }

    .p-menu-submenu-label {
        background: dt('menu.submenu.label.background');
        padding: dt('menu.submenu.label.padding');
        color: dt('menu.submenu.label.color');
        font-weight: dt('menu.submenu.label.font.weight');
    }

    .p-menu-separator {
        border-block-start: 1px solid dt('menu.separator.border.color');
    }
`,yE=`
    .p-progressspinner {
        position: relative;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        display: inline-block;
    }

    .p-progressspinner::before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .p-progressspinner-spin {
        height: 100%;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: p-progressspinner-rotate 2s linear infinite;
    }

    .p-progressspinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        stroke: dt('progressspinner.colorOne');
        animation:
            p-progressspinner-dash 1.5s ease-in-out infinite,
            p-progressspinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes p-progressspinner-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes p-progressspinner-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    @keyframes p-progressspinner-color {
        100%,
        0% {
            stroke: dt('progressspinner.color.one');
        }
        40% {
            stroke: dt('progressspinner.color.two');
        }
        66% {
            stroke: dt('progressspinner.color.three');
        }
        80%,
        90% {
            stroke: dt('progressspinner.color.four');
        }
    }
`,kE=`
    .p-dialog {
        max-height: 90%;
        transform: scale(1);
        border-radius: dt('dialog.border.radius');
        box-shadow: dt('dialog.shadow');
        background: dt('dialog.background');
        border: 1px solid dt('dialog.border.color');
        color: dt('dialog.color');
        will-change: transform;
    }

    .p-dialog-content {
        overflow-y: auto;
        padding: dt('dialog.content.padding');
    }

    .p-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('dialog.header.padding');
    }

    .p-dialog-title {
        font-weight: dt('dialog.title.font.weight');
        font-size: dt('dialog.title.font.size');
    }

    .p-dialog-footer {
        flex-shrink: 0;
        padding: dt('dialog.footer.padding');
        display: flex;
        justify-content: flex-end;
        gap: dt('dialog.footer.gap');
    }

    .p-dialog-header-actions {
        display: flex;
        align-items: center;
        gap: dt('dialog.header.gap');
    }

    .p-dialog-top .p-dialog,
    .p-dialog-bottom .p-dialog,
    .p-dialog-left .p-dialog,
    .p-dialog-right .p-dialog,
    .p-dialog-topleft .p-dialog,
    .p-dialog-topright .p-dialog,
    .p-dialog-bottomleft .p-dialog,
    .p-dialog-bottomright .p-dialog {
        margin: 1rem;
    }

    .p-dialog-maximized {
        width: 100vw !important;
        height: 100vh !important;
        top: 0px !important;
        left: 0px !important;
        max-height: 100%;
        height: 100%;
        border-radius: 0;
    }

    .p-dialog-maximized .p-dialog-content {
        flex-grow: 1;
    }

    .p-dialog .p-resizable-handle {
        position: absolute;
        font-size: 0.1px;
        display: block;
        cursor: se-resize;
        width: 12px;
        height: 12px;
        right: 1px;
        bottom: 1px;
    }

    .p-dialog-enter-active {
        animation: p-animate-dialog-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .p-dialog-leave-active {
        animation: p-animate-dialog-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes p-animate-dialog-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-dialog-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;export{ol as $,Td as A,er as B,iR as C,HR as D,wr as E,wg as F,Cg as G,aR as H,XS as I,$p as J,Qu as K,BR as L,sR as M,vt as N,st as O,VR as P,vR as Q,tl as R,zr as S,gR as T,kR as U,$R as V,fR as W,_R as X,el as Y,xR as Z,AR as _,Pi as a,MR as a$,hR as a0,GR as a1,HS as a2,GS as a3,WS as a4,ji as a5,zf as a6,qS as a7,Tn as a8,VS as a9,QR as aA,eE as aB,pR as aC,uR as aD,oE as aE,Tg as aF,rR as aG,QS as aH,tE as aI,rE as aJ,lE as aK,cE as aL,ER as aM,dE as aN,nR as aO,Js as aP,En as aQ,uE as aR,fE as aS,pE as aT,vE as aU,Ag as aV,yE as aW,cR as aX,lR as aY,kE as aZ,We as a_,wR as aa,mR as ab,yR as ac,RR as ad,US as ae,KR as af,TR as ag,dR as ah,OR as ai,zR as aj,io as ak,JS as al,uo as am,YS as an,YR as ao,jS as ap,eR as aq,KS as ar,XR as as,$g as at,Rd as au,Rg as av,Eg as aw,bR as ax,qR as ay,JR as az,Pn as b,NR as b0,DR as b1,jR as b2,FR as b3,UR as b4,ZR as b5,Fc as b6,it as b7,db as b8,tR as b9,WR as ba,oR as bb,Hc as bc,aE as bd,sE as be,nE as bf,$e as bg,bE as bh,mE as bi,gE as bj,hE as bk,iE as bl,jC as bm,IR as c,Te as d,_g as e,$t as f,Bt as g,CR as h,Co as i,Sp as j,ut as k,Qs as l,tt as m,zn as n,LR as o,xd as p,or as q,ka as r,PR as s,SR as t,ZS as u,Aa as v,at as w,Ln as x,Rt as y,Bg as z};
