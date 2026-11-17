(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();const hl="187",mn={ROTATE:0,DOLLY:1,PAN:2},Cn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ed=0,ql=1,Ad=2,Zs=1,Rd=2,qs=3,qn=0,Ei=1,Ot=2,$n=0,xs=1,en=2,Yl=3,Kl=4,Cd=5,ms=100,Pd=101,Id=102,Dd=103,Ld=104,Nd=200,Ud=201,Fd=202,Od=203,gh=204,vh=205,Bd=206,kd=207,zd=208,Gd=209,Hd=210,Wd=211,Vd=212,Xd=213,$d=214,xo=0,_o=1,So=2,na=3,Mo=4,yo=5,bo=6,wo=7,dl=0,qd=1,Yd=2,gn=0,ul=1,fl=2,pl=3,Rr=4,ml=5,gl=6,vl=7,xh=300,ws=301,sa=302,Nr=303,Ur=304,aa=1e3,pn=1001,To=1002,ci=1003,Kd=1004,Sa=1005,Ri=1006,Fr=1007,Pn=1008,Ni=1009,_h=1010,Sh=1011,ra=1012,xl=1013,tn=1014,Yi=1015,Ci=1016,_l=1017,Sl=1018,Ts=1020,Mh=35902,yh=35899,bh=1021,wh=1022,ji=1023,Nn=1026,In=1027,Ml=1028,yl=1029,Yn=1030,bl=1031,wl=1033,ar=33776,rr=33777,or=33778,lr=33779,Eo=35840,Ao=35841,Ro=35842,Co=35843,Po=36196,Io=37492,Do=37496,Lo=37488,No=37489,fr=37490,Uo=37491,Fo=37808,Oo=37809,Bo=37810,ko=37811,zo=37812,Go=37813,Ho=37814,Wo=37815,Vo=37816,Xo=37817,$o=37818,qo=37819,Yo=37820,Ko=37821,Zo=36492,Jo=36494,Qo=36495,jo=36283,el=36284,pr=36285,tl=36286,Zd=3200,mr=0,Jd=1,Rn="",li="srgb",gr="srgb-linear",vr="linear",Tt="srgb",Or=7680,Qd=519,jd=512,eu=513,tu=514,Th=515,iu=516,nu=517,Eh=518,Ah=519,su=35044,Zl="300 es",Ki=2e3,oa=2001;function au(a){for(let e=a.length-1;e>=0;--e)if(a[e]>=65535)return!0;return!1}function xr(a){return document.createElementNS("http://www.w3.org/1999/xhtml",a)}function ru(){const a=xr("canvas");return a.style.display="block",a}const Jl={};function Ql(...a){const e="THREE."+a.shift();console.log(e,...a)}function Rh(a){const e=a[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=a[1];t&&t.isStackTrace?a[0]+=" "+t.getLocation():a[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return a}function $e(...a){a=Rh(a);const e="THREE."+a.shift();{const t=a[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...a)}}function _t(...a){a=Rh(a);const e="THREE."+a.shift();{const t=a[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...a)}}function cr(...a){const e=a.join(" ");e in Jl||(Jl[e]=!0,$e(...a))}function ou(a,e,t){return new Promise(function(i,n){function s(){switch(a.clientWaitSync(e,a.SYNC_FLUSH_COMMANDS_BIT,0)){case a.WAIT_FAILED:n();break;case a.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const lu={[xo]:xo,[So]:bo,[Mo]:Mo,[na]:yo,[_o]:_o,[bo]:So,[wo]:wo,[yo]:na};class Fn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const n=i[e];if(n!==void 0){const s=n.indexOf(t);s!==-1&&n.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const n=i.slice(0);for(let s=0,r=n.length;s<r;s++)n[s].call(this,e);e.target=null}}}const fi=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let jl=1234567;const _s=Math.PI/180,la=180/Math.PI;function Jn(){const a=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(fi[a&255]+fi[a>>8&255]+fi[a>>16&255]+fi[a>>24&255]+"-"+fi[e&255]+fi[e>>8&255]+"-"+fi[e>>16&15|64]+fi[e>>24&255]+"-"+fi[t&63|128]+fi[t>>8&255]+"-"+fi[t>>16&255]+fi[t>>24&255]+fi[i&255]+fi[i>>8&255]+fi[i>>16&255]+fi[i>>24&255]).toLowerCase()}function st(a,e,t){return Math.max(e,Math.min(t,a))}function Tl(a,e){return(a%e+e)%e}function cu(a,e,t,i,n){return i+(a-e)*(n-i)/(t-e)}function hu(a,e,t){return a!==e?(t-a)/(e-a):0}function Js(a,e,t){return(1-t)*a+t*e}function du(a,e,t,i){return Js(a,e,1-Math.exp(-t*i))}function uu(a,e=1){return e-Math.abs(Tl(a,e*2)-e)}function fu(a,e,t){return a<=e?0:a>=t?1:(a=(a-e)/(t-e),a*a*(3-2*a))}function pu(a,e,t){return a<=e?0:a>=t?1:(a=(a-e)/(t-e),a*a*a*(a*(a*6-15)+10))}function mu(a,e){return a+Math.floor(Math.random()*(e-a+1))}function gu(a,e){return a+Math.random()*(e-a)}function vu(a){return a*(.5-Math.random())}function xu(a){a!==void 0&&(jl=a);let e=jl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function _u(a){return a*_s}function Su(a){return a*la}function Mu(a){return a>0&&Number.isInteger(a)&&2**Math.round(Math.log2(a))===a}function yu(a){return Math.pow(2,Math.ceil(Math.log(a)/Math.LN2))}function Ch(a){return Math.pow(2,Math.floor(Math.log(a)/Math.LN2))}function bu(a,e,t,i,n){const s=Math.cos,r=Math.sin,o=s(t/2),l=r(t/2),c=s((e+i)/2),h=r((e+i)/2),u=s((e-i)/2),d=r((e-i)/2),f=s((i-e)/2),m=r((i-e)/2);switch(n){case"XYX":a.set(o*h,l*u,l*d,o*c);break;case"YZY":a.set(l*d,o*h,l*u,o*c);break;case"ZXZ":a.set(l*u,l*d,o*h,o*c);break;case"XZX":a.set(o*h,l*m,l*f,o*c);break;case"YXY":a.set(l*f,o*h,l*m,o*c);break;case"ZYZ":a.set(l*m,l*f,o*h,o*c);break;default:$e("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function El(a){switch(a.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Ph(a,e){if(e.constructor===Float32Array)return a;const t=El(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(a/t,-1)}function Ih(a,e){if(e.constructor===Float32Array)return a;const t=El(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(a*t)}const oi={DEG2RAD:_s,RAD2DEG:la,generateUUID:Jn,clamp:st,euclideanModulo:Tl,mapLinear:cu,inverseLerp:hu,lerp:Js,damp:du,pingpong:uu,smoothstep:fu,smootherstep:pu,randInt:mu,randFloat:gu,randFloatSpread:vu,seededRandom:xu,degToRad:_u,radToDeg:Su,isPowerOfTwo:Mu,ceilPowerOfTwo:yu,floorPowerOfTwo:Ch,setQuaternionFromProperEuler:bu,normalize:Ih,denormalize:Ph};class re{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(st(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(st(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),n=Math.sin(t),s=this.x-e.x,r=this.y-e.y;return this.x=s*i-r*n+e.x,this.y=s*n+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Un{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,s,r,o){let l=i[n+0],c=i[n+1],h=i[n+2],u=i[n+3],d=s[r+0],f=s[r+1],m=s[r+2],x=s[r+3];if(u!==x||l!==d||c!==f||h!==m){let p=l*d+c*f+h*m+u*x;p<0&&(d=-d,f=-f,m=-m,x=-x,p=-p);let g=1-o;if(p<.9995){const S=Math.acos(p),w=Math.sin(S);g=Math.sin(g*S)/w,o=Math.sin(o*S)/w,l=l*g+d*o,c=c*g+f*o,h=h*g+m*o,u=u*g+x*o}else{l=l*g+d*o,c=c*g+f*o,h=h*g+m*o,u=u*g+x*o;const S=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=S,c*=S,h*=S,u*=S}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,n,s,r){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],u=s[r],d=s[r+1],f=s[r+2],m=s[r+3];return e[t]=o*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-o*f,e[t+2]=c*m+h*f+o*d-l*u,e[t+3]=h*m-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,n=e._y,s=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),u=o(s/2),d=l(i/2),f=l(n/2),m=l(s/2);switch(r){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:$e("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],n=t[4],s=t[8],r=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=i+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(r-n)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(n+r)/f,this._z=(s+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(s-c)/f,this._x=(n+r)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(r-n)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,n=e._y,s=e._z,r=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+r*o+n*c-s*l,this._y=n*h+r*l+s*o-i*c,this._z=s*h+r*c+i*l-n*o,this._w=r*h-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,n=e._y,s=e._z,r=e._w,o=this.dot(e);o<0&&(i=-i,n=-n,s=-s,r=-r,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+n*t,this._z=this._z*l+s*t,this._w=this._w*l+r*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+n*t,this._z=this._z*l+s*t,this._w=this._w*l+r*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{static{this.prototype.isVector3=!0}constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ec.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ec.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*n,this.y=s[1]*t+s[4]*i+s[7]*n,this.z=s[2]*t+s[5]*i+s[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,s=e.elements,r=1/(s[3]*t+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*n+s[12])*r,this.y=(s[1]*t+s[5]*i+s[9]*n+s[13])*r,this.z=(s[2]*t+s[6]*i+s[10]*n+s[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,n=this.z,s=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*n-o*i),h=2*(o*t-s*n),u=2*(s*i-r*t);return this.x=t+l*c+r*u-o*h,this.y=i+l*h+o*c-s*u,this.z=n+l*u+s*h-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*n,this.y=s[1]*t+s[5]*i+s[9]*n,this.z=s[2]*t+s[6]*i+s[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(st(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,n=e.y,s=e.z,r=t.x,o=t.y,l=t.z;return this.x=n*l-s*o,this.y=s*r-i*l,this.z=i*o-n*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Br.copy(this).projectOnVector(e),this.sub(Br)}reflect(e){return this.sub(Br.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(st(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Br=new C,ec=new Un;class et{static{this.prototype.isMatrix3=!0}constructor(e,t,i,n,s,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,r,o,l,c)}set(e,t,i,n,s,r,o,l,c){const h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,s=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],m=i[8],x=n[0],p=n[3],g=n[6],S=n[1],w=n[4],_=n[7],E=n[2],T=n[5],v=n[8];return s[0]=r*x+o*S+l*E,s[3]=r*p+o*w+l*T,s[6]=r*g+o*_+l*v,s[1]=c*x+h*S+u*E,s[4]=c*p+h*w+u*T,s[7]=c*g+h*_+u*v,s[2]=d*x+f*S+m*E,s[5]=d*p+f*w+m*T,s[8]=d*g+f*_+m*v,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*r*h-t*o*c-i*s*h+i*o*l+n*s*c-n*r*l}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*r-o*c,d=o*l-h*s,f=c*s-r*l,m=t*u+i*d+n*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return e[0]=u*x,e[1]=(n*c-h*i)*x,e[2]=(o*i-n*r)*x,e[3]=d*x,e[4]=(h*t-n*l)*x,e[5]=(n*s-o*t)*x,e[6]=f*x,e[7]=(i*l-c*t)*x,e[8]=(r*t-i*s)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,s,r,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*r+c*o)+r+e,-n*c,n*l,-n*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return cr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(kr.makeScale(e,t)),this}rotate(e){return cr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(kr.makeRotation(-e)),this}translate(e,t){return cr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(kr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const kr=new et,tc=new et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ic=new et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function wu(){const a={enabled:!0,workingColorSpace:gr,spaces:{},convert:function(n,s,r){return this.enabled===!1||s===r||!s||!r||(this.spaces[s].transfer===Tt&&(n.r=vn(n.r),n.g=vn(n.g),n.b=vn(n.b)),this.spaces[s].primaries!==this.spaces[r].primaries&&(n.applyMatrix3(this.spaces[s].toXYZ),n.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===Tt&&(n.r=Ss(n.r),n.g=Ss(n.g),n.b=Ss(n.b))),n},workingToColorSpace:function(n,s){return this.convert(n,this.workingColorSpace,s)},colorSpaceToWorking:function(n,s){return this.convert(n,s,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Rn?vr:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,s=this.workingColorSpace){return n.fromArray(this.spaces[s].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,s,r){return n.copy(this.spaces[r].fromXYZ).multiply(this.spaces[s].toXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return a.define({[gr]:{primaries:e,whitePoint:i,transfer:vr,toXYZ:tc,fromXYZ:ic,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:li},outputColorSpaceConfig:{drawingBufferColorSpace:li}},[li]:{primaries:e,whitePoint:i,transfer:Tt,toXYZ:tc,fromXYZ:ic,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:li}}}),a}const gt=wu();function vn(a){return a<.04045?a*.0773993808:Math.pow(a*.9478672986+.0521327014,2.4)}function Ss(a){return a<.0031308?a*12.92:1.055*Math.pow(a,.41666)-.055}let es;class Tu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{es===void 0&&(es=xr("canvas")),es.width=e.width,es.height=e.height;const n=es.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),i=es}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=xr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const n=i.getImageData(0,0,e.width,e.height),s=n.data;for(let r=0;r<s.length;r++)s[r]=vn(s[r]/255)*255;return i.putImageData(n,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(vn(t[i]/255)*255):t[i]=vn(t[i]);return{data:t,width:e.width,height:e.height}}else return $e("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Eu=0;class Al{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Eu++}),this.uuid=Jn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let r=0,o=n.length;r<o;r++)n[r].isDataTexture?s.push(zr(n[r].image)):s.push(zr(n[r]))}else s=zr(n);i.url=s}return t||(e.images[this.uuid]=i),i}}function zr(a){return typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&a instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&a instanceof ImageBitmap?Tu.getDataURL(a):a.data?{data:Array.from(a.data),width:a.width,height:a.height,type:a.data.constructor.name}:($e("Texture: Unable to serialize Texture."),{})}let Au=0;const Gr=new C;class mi extends Fn{constructor(e=mi.DEFAULT_IMAGE,t=mi.DEFAULT_MAPPING,i=pn,n=pn,s=Ri,r=Pn,o=ji,l=Ni,c=mi.DEFAULT_ANISOTROPY,h=Rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Au++}),this.uuid=Jn(),this.name="",this.source=new Al(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new re(0,0),this.repeat=new re(1,1),this.center=new re(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new et,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Gr).x}get height(){return this.source.getSize(Gr).y}get depth(){return this.source.getSize(Gr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){$e(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){$e(`Texture.setValues(): property '${t}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==xh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case aa:e.x=e.x-Math.floor(e.x);break;case pn:e.x=e.x<0?0:1;break;case To:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case aa:e.y=e.y-Math.floor(e.y);break;case pn:e.y=e.y<0?0:1;break;case To:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}mi.DEFAULT_IMAGE=null;mi.DEFAULT_MAPPING=xh;mi.DEFAULT_ANISOTROPY=1;class Xt{static{this.prototype.isVector4=!0}constructor(e=0,t=0,i=0,n=1){this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*n+r[12]*s,this.y=r[1]*t+r[5]*i+r[9]*n+r[13]*s,this.z=r[2]*t+r[6]*i+r[10]*n+r[14]*s,this.w=r[3]*t+r[7]*i+r[11]*n+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,s;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],x=l[2],p=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+p)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,_=(f+1)/2,E=(g+1)/2,T=(h+d)/4,v=(u+x)/4,M=(m+p)/4;return w>_&&w>E?w<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(w),n=T/i,s=v/i):_>E?_<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(_),i=T/n,s=M/n):E<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(E),i=v/s,n=M/s),this.set(i,n,s,t),this}let S=Math.sqrt((p-m)*(p-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(p-m)/S,this.y=(u-x)/S,this.z=(d-h)/S,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this.w=st(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this.w=st(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(st(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ru extends Fn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ri,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Xt(0,0,e,t),this.scissorTest=!1,this.viewport=new Xt(0,0,e,t),this.textures=[];const n=i.count;for(let s=0;s<n;s++)this.textures[s]=new mi({width:e,height:t,depth:i.depth}),this.textures[s].isRenderTargetTexture=!0,this.textures[s].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Ri,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const n=Object.assign({},e.textures[t].image);this.textures[t].source=new Al(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pi extends Ru{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Dh extends mi{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=ci,this.minFilter=ci,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Cu extends mi{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=ci,this.minFilter=ci,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class Ct{static{this.prototype.isMatrix4=!0}constructor(e,t,i,n,s,r,o,l,c,h,u,d,f,m,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,r,o,l,c,h,u,d,f,m,x,p)}set(e,t,i,n,s,r,o,l,c,h,u,d,f,m,x,p){const g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=n,g[1]=s,g[5]=r,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=m,g[11]=x,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ct().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,n=1/ts.setFromMatrixColumn(e,0).length(),s=1/ts.setFromMatrixColumn(e,1).length(),r=1/ts.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,n=e.y,s=e.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const d=r*h,f=r*u,m=o*h,x=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=m+f*c,t[10]=r*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,m=c*h,x=c*u;t[0]=d+x*o,t[4]=m*o-f,t[8]=r*c,t[1]=r*u,t[5]=r*h,t[9]=-o,t[2]=f*o-m,t[6]=x+d*o,t[10]=r*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,m=c*h,x=c*u;t[0]=d-x*o,t[4]=-r*u,t[8]=m+f*o,t[1]=f+m*o,t[5]=r*h,t[9]=x-d*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const d=r*h,f=r*u,m=o*h,x=o*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+x,t[1]=l*u,t[5]=x*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const d=r*l,f=r*c,m=o*l,x=o*c;t[0]=l*h,t[4]=x-d*u,t[8]=m*u+f,t[1]=u,t[5]=r*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-x*u}else if(e.order==="XZY"){const d=r*l,f=r*c,m=o*l,x=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+x,t[5]=r*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=o*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Pu,e,Iu)}lookAt(e,t,i){const n=this.elements;return Ii.subVectors(e,t),Ii.lengthSq()===0&&(Ii.z=1),Ii.normalize(),Mn.crossVectors(i,Ii),Mn.lengthSq()===0&&(Math.abs(i.z)===1?Ii.x+=1e-4:Ii.z+=1e-4,Ii.normalize(),Mn.crossVectors(i,Ii)),Mn.normalize(),Ma.crossVectors(Ii,Mn),n[0]=Mn.x,n[4]=Ma.x,n[8]=Ii.x,n[1]=Mn.y,n[5]=Ma.y,n[9]=Ii.y,n[2]=Mn.z,n[6]=Ma.z,n[10]=Ii.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,s=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],m=i[2],x=i[6],p=i[10],g=i[14],S=i[3],w=i[7],_=i[11],E=i[15],T=n[0],v=n[4],M=n[8],I=n[12],R=n[1],D=n[5],O=n[9],W=n[13],N=n[2],H=n[6],K=n[10],B=n[14],le=n[3],q=n[7],ie=n[11],ae=n[15];return s[0]=r*T+o*R+l*N+c*le,s[4]=r*v+o*D+l*H+c*q,s[8]=r*M+o*O+l*K+c*ie,s[12]=r*I+o*W+l*B+c*ae,s[1]=h*T+u*R+d*N+f*le,s[5]=h*v+u*D+d*H+f*q,s[9]=h*M+u*O+d*K+f*ie,s[13]=h*I+u*W+d*B+f*ae,s[2]=m*T+x*R+p*N+g*le,s[6]=m*v+x*D+p*H+g*q,s[10]=m*M+x*O+p*K+g*ie,s[14]=m*I+x*W+p*B+g*ae,s[3]=S*T+w*R+_*N+E*le,s[7]=S*v+w*D+_*H+E*q,s[11]=S*M+w*O+_*K+E*ie,s[15]=S*I+w*W+_*B+E*ae,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],n=e[8],s=e[12],r=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],x=e[7],p=e[11],g=e[15],S=l*f-c*d,w=o*f-c*u,_=o*d-l*u,E=r*f-c*h,T=r*d-l*h,v=r*u-o*h;return t*(x*S-p*w+g*_)-i*(m*S-p*E+g*T)+n*(m*w-x*E+g*v)-s*(m*_-x*T+p*v)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],n=e[8],s=e[1],r=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(r*h-o*c)-i*(s*h-o*l)+n*(s*c-r*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],x=e[13],p=e[14],g=e[15],S=t*o-i*r,w=t*l-n*r,_=t*c-s*r,E=i*l-n*o,T=i*c-s*o,v=n*c-s*l,M=h*x-u*m,I=h*p-d*m,R=h*g-f*m,D=u*p-d*x,O=u*g-f*x,W=d*g-f*p,N=S*W-w*O+_*D+E*R-T*I+v*M;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const H=1/N;return e[0]=(o*W-l*O+c*D)*H,e[1]=(n*O-i*W-s*D)*H,e[2]=(x*v-p*T+g*E)*H,e[3]=(d*T-u*v-f*E)*H,e[4]=(l*R-r*W-c*I)*H,e[5]=(t*W-n*R+s*I)*H,e[6]=(p*_-m*v-g*w)*H,e[7]=(h*v-d*_+f*w)*H,e[8]=(r*O-o*R+c*M)*H,e[9]=(i*R-t*O-s*M)*H,e[10]=(m*T-x*_+g*S)*H,e[11]=(u*_-h*T-f*S)*H,e[12]=(o*I-r*D-l*M)*H,e[13]=(t*D-i*I+n*M)*H,e[14]=(x*w-m*E-p*S)*H,e[15]=(h*E-u*w+d*S)*H,this}scale(e){const t=this.elements,i=e.x,n=e.y,s=e.z;return t[0]*=i,t[4]*=n,t[8]*=s,t[1]*=i,t[5]*=n,t[9]*=s,t[2]*=i,t[6]*=n,t[10]*=s,t[3]*=i,t[7]*=n,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),n=Math.sin(t),s=1-i,r=e.x,o=e.y,l=e.z,c=s*r,h=s*o;return this.set(c*r+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*r,0,c*l-n*o,h*l+n*r,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,s,r){return this.set(1,i,s,0,e,1,r,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){const n=this.elements,s=t._x,r=t._y,o=t._z,l=t._w,c=s+s,h=r+r,u=o+o,d=s*c,f=s*h,m=s*u,x=r*h,p=r*u,g=o*u,S=l*c,w=l*h,_=l*u,E=i.x,T=i.y,v=i.z;return n[0]=(1-(x+g))*E,n[1]=(f+_)*E,n[2]=(m-w)*E,n[3]=0,n[4]=(f-_)*T,n[5]=(1-(d+g))*T,n[6]=(p+S)*T,n[7]=0,n[8]=(m+w)*v,n[9]=(p-S)*v,n[10]=(1-(d+x))*v,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){const n=this.elements;e.x=n[12],e.y=n[13],e.z=n[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),t.identity(),this;let r=ts.set(n[0],n[1],n[2]).length();const o=ts.set(n[4],n[5],n[6]).length(),l=ts.set(n[8],n[9],n[10]).length();s<0&&(r=-r),Wi.copy(this);const c=1/r,h=1/o,u=1/l;return Wi.elements[0]*=c,Wi.elements[1]*=c,Wi.elements[2]*=c,Wi.elements[4]*=h,Wi.elements[5]*=h,Wi.elements[6]*=h,Wi.elements[8]*=u,Wi.elements[9]*=u,Wi.elements[10]*=u,t.setFromRotationMatrix(Wi),i.x=r,i.y=o,i.z=l,this}makePerspective(e,t,i,n,s,r,o=Ki,l=!1){const c=this.elements,h=2*s/(t-e),u=2*s/(i-n),d=(t+e)/(t-e),f=(i+n)/(i-n);let m,x;if(l)m=s/(r-s),x=r*s/(r-s);else if(o===Ki)m=-(r+s)/(r-s),x=-2*r*s/(r-s);else if(o===oa)m=-r/(r-s),x=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,n,s,r,o=Ki,l=!1){const c=this.elements,h=2/(t-e),u=2/(i-n),d=-(t+e)/(t-e),f=-(i+n)/(i-n);let m,x;if(l)m=1/(r-s),x=r/(r-s);else if(o===Ki)m=-2/(r-s),x=-(r+s)/(r-s);else if(o===oa)m=-1/(r-s),x=-s/(r-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const ts=new C,Wi=new Ct,Pu=new C(0,0,0),Iu=new C(1,1,1),Mn=new C,Ma=new C,Ii=new C,nc=new Ct,sc=new Un;class xn{constructor(e=0,t=0,i=0,n=xn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const n=e.elements,s=n[0],r=n[4],o=n[8],l=n[1],c=n[5],h=n[9],u=n[2],d=n[6],f=n[10];switch(t){case"XYZ":this._y=Math.asin(st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-st(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(st(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-st(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(st(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-st(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:$e("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return nc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(nc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return sc.setFromEuler(this),this.setFromQuaternion(sc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xn.DEFAULT_ORDER="XYZ";class Rl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Du=0;const ac=new C,is=new Un,rn=new Ct,ya=new C,Bs=new C,Lu=new C,Nu=new Un,rc=new C(1,0,0),oc=new C(0,1,0),lc=new C(0,0,1),cc={type:"added"},Uu={type:"removed"},ns={type:"childadded",child:null},Hr={type:"childremoved",child:null};class ft extends Fn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Du++}),this.uuid=Jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ft.DEFAULT_UP.clone();const e=new C,t=new xn,i=new Un,n=new C(1,1,1);function s(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new Ct},normalMatrix:{value:new et}}),this.matrix=new Ct,this.matrixWorld=new Ct,this.matrixAutoUpdate=ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Rl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return is.setFromAxisAngle(e,t),this.quaternion.multiply(is),this}rotateOnWorldAxis(e,t){return is.setFromAxisAngle(e,t),this.quaternion.premultiply(is),this}rotateX(e){return this.rotateOnAxis(rc,e)}rotateY(e){return this.rotateOnAxis(oc,e)}rotateZ(e){return this.rotateOnAxis(lc,e)}translateOnAxis(e,t){return ac.copy(e).applyQuaternion(this.quaternion),this.position.add(ac.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(rc,e)}translateY(e){return this.translateOnAxis(oc,e)}translateZ(e){return this.translateOnAxis(lc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(rn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ya.copy(e):ya.set(e,t,i);const n=this.parent;this.updateWorldMatrix(!0,!1),Bs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?rn.lookAt(Bs,ya,this.up):rn.lookAt(ya,Bs,this.up),this.quaternion.setFromRotationMatrix(rn),n&&(rn.extractRotation(n.matrixWorld),is.setFromRotationMatrix(rn),this.quaternion.premultiply(is.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(_t("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(cc),ns.child=e,this.dispatchEvent(ns),ns.child=null):_t("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Uu),Hr.child=e,this.dispatchEvent(Hr),Hr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),rn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),rn.multiply(e.parent.matrixWorld)),e.applyMatrix4(rn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(cc),ns.child=e,this.dispatchEvent(ns),ns.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const n=this.children;for(let s=0,r=n.length;s<r;s++)n[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bs,e,Lu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bs,Nu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,n=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*n,s[13]+=i-s[1]*t-s[5]*i-s[9]*n,s[14]+=n-s[2]*t-s[6]*i-s[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,n.name=this.name,n.castShadow=this.castShadow,n.receiveShadow=this.receiveShadow,n.visible=this.visible,n.frustumCulled=this.frustumCulled,n.renderOrder=this.renderOrder,n.static=this.static,n.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(e),n.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));n.material=o}else n.material=s(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(s(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),h=r(e.images),u=r(e.shapes),d=r(e.skeletons),f=r(e.animations),m=r(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=n,i;function r(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const n=e.children[i];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}ft.DEFAULT_UP=new C(0,1,0);ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class oe extends ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Fu={type:"move"};class Wr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new oe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new oe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new oe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,s=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const x of e.hand.values()){const p=t.getJointPose(x,i),g=this._getHandJoint(c,x);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.quaternion,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Fu)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new oe;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Lh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},yn={h:0,s:0,l:0},ba={h:0,s:0,l:0};function Vr(a,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?a+(e-a)*6*t:t<1/2?e:t<2/3?a+(e-a)*6*(2/3-t):a}class Ke{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=li){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,gt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,n=gt.workingColorSpace){return this.r=e,this.g=t,this.b=i,gt.colorSpaceToWorking(this,n),this}setHSL(e,t,i,n=gt.workingColorSpace){if(e=Tl(e,1),t=st(t,0,1),i=st(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,r=2*i-s;this.r=Vr(r,s,e+1/3),this.g=Vr(r,s,e),this.b=Vr(r,s,e-1/3)}return gt.colorSpaceToWorking(this,n),this}setStyle(e,t=li){function i(s){s!==void 0&&parseFloat(s)<1&&$e("Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const r=n[1],o=n[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseFloat(s[1]))/100,Math.min(100,parseFloat(s[2]))/100,Math.min(100,parseFloat(s[3]))/100,t);break;case"hsl":case"hsla":if(s=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:$e("Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=n[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(s,16),t);$e("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=li){const i=Lh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):$e("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=vn(e.r),this.g=vn(e.g),this.b=vn(e.b),this}copyLinearToSRGB(e){return this.r=Ss(e.r),this.g=Ss(e.g),this.b=Ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=li){return gt.workingToColorSpace(pi.copy(this),e),Math.round(st(pi.r*255,0,255))*65536+Math.round(st(pi.g*255,0,255))*256+Math.round(st(pi.b*255,0,255))}getHexString(e=li){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=gt.workingColorSpace){gt.workingToColorSpace(pi.copy(this),t);const i=pi.r,n=pi.g,s=pi.b,r=Math.max(i,n,s),o=Math.min(i,n,s);let l,c;const h=(o+r)/2;if(o===r)l=0,c=0;else{const u=r-o;switch(c=h<=.5?u/(r+o):u/(2-r-o),r){case i:l=(n-s)/u+(n<s?6:0);break;case n:l=(s-i)/u+2;break;case s:l=(i-n)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=gt.workingColorSpace){return gt.workingToColorSpace(pi.copy(this),t),e.r=pi.r,e.g=pi.g,e.b=pi.b,e}getStyle(e=li){gt.workingToColorSpace(pi.copy(this),e);const t=pi.r,i=pi.g,n=pi.b;return e!==li?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(e,t,i){return this.getHSL(yn),this.setHSL(yn.h+e,yn.s+t,yn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(yn),e.getHSL(ba);const i=Js(yn.h,ba.h,t),n=Js(yn.s,ba.s,t),s=Js(yn.l,ba.l,t);return this.setHSL(i,n,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,n=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*n,this.g=s[1]*t+s[4]*i+s[7]*n,this.b=s[2]*t+s[5]*i+s[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const pi=new Ke;Ke.NAMES=Lh;class _r{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ke(e),this.density=t}clone(){return new _r(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Nh extends ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xn,this.environmentIntensity=1,this.environmentRotation=new xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Vi=new C,on=new C,Xr=new C,ln=new C,ss=new C,as=new C,hc=new C,$r=new C,qr=new C,Yr=new C,Kr=new Xt,Zr=new Xt,Jr=new Xt;class zi{constructor(e=new C,t=new C,i=new C){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),Vi.subVectors(e,t),n.cross(Vi);const s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(e,t,i,n,s){Vi.subVectors(n,t),on.subVectors(i,t),Xr.subVectors(e,t);const r=Vi.dot(Vi),o=Vi.dot(on),l=Vi.dot(Xr),c=on.dot(on),h=on.dot(Xr),u=r*c-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,m=(r*h-o*l)*d;return s.set(1-f-m,m,f)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,ln)===null?!1:ln.x>=0&&ln.y>=0&&ln.x+ln.y<=1}static getInterpolation(e,t,i,n,s,r,o,l){return this.getBarycoord(e,t,i,n,ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ln.x),l.addScaledVector(r,ln.y),l.addScaledVector(o,ln.z),l)}static getInterpolatedAttribute(e,t,i,n,s,r){return Kr.setScalar(0),Zr.setScalar(0),Jr.setScalar(0),Kr.fromBufferAttribute(e,t),Zr.fromBufferAttribute(e,i),Jr.fromBufferAttribute(e,n),r.setScalar(0),r.addScaledVector(Kr,s.x),r.addScaledVector(Zr,s.y),r.addScaledVector(Jr,s.z),r}static isFrontFacing(e,t,i,n){return Vi.subVectors(i,t),on.subVectors(e,t),Vi.cross(on).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vi.subVectors(this.c,this.b),on.subVectors(this.a,this.b),Vi.cross(on).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return zi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return zi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,s){return zi.getInterpolation(e,this.a,this.b,this.c,t,i,n,s)}containsPoint(e){return zi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return zi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,n=this.b,s=this.c;let r,o;ss.subVectors(n,i),as.subVectors(s,i),$r.subVectors(e,i);const l=ss.dot($r),c=as.dot($r);if(l<=0&&c<=0)return t.copy(i);qr.subVectors(e,n);const h=ss.dot(qr),u=as.dot(qr);if(h>=0&&u<=h)return t.copy(n);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return r=l/(l-h),t.copy(i).addScaledVector(ss,r);Yr.subVectors(e,s);const f=ss.dot(Yr),m=as.dot(Yr);if(m>=0&&f<=m)return t.copy(s);const x=f*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(as,o);const p=h*m-f*u;if(p<=0&&u-h>=0&&f-m>=0)return hc.subVectors(s,n),o=(u-h)/(u-h+(f-m)),t.copy(n).addScaledVector(hc,o);const g=1/(p+x+d);return r=x*g,o=d*g,t.copy(i).addScaledVector(ss,r).addScaledVector(as,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Qn{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Xi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Xi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Xi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let r=0,o=s.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,Xi):Xi.fromBufferAttribute(s,r),Xi.applyMatrix4(e.matrixWorld),this.expandByPoint(Xi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wa.copy(i.boundingBox)),wa.applyMatrix4(e.matrixWorld),this.union(wa)}const n=e.children;for(let s=0,r=n.length;s<r;s++)this.expandByObject(n[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Xi),Xi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ks),Ta.subVectors(this.max,ks),rs.subVectors(e.a,ks),os.subVectors(e.b,ks),ls.subVectors(e.c,ks),bn.subVectors(os,rs),wn.subVectors(ls,os),kn.subVectors(rs,ls);let t=[0,-bn.z,bn.y,0,-wn.z,wn.y,0,-kn.z,kn.y,bn.z,0,-bn.x,wn.z,0,-wn.x,kn.z,0,-kn.x,-bn.y,bn.x,0,-wn.y,wn.x,0,-kn.y,kn.x,0];return!Qr(t,rs,os,ls,Ta)||(t=[1,0,0,0,1,0,0,0,1],!Qr(t,rs,os,ls,Ta))?!1:(Ea.crossVectors(bn,wn),t=[Ea.x,Ea.y,Ea.z],Qr(t,rs,os,ls,Ta))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Xi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Xi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(cn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),cn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),cn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),cn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),cn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),cn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),cn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),cn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(cn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const cn=[new C,new C,new C,new C,new C,new C,new C,new C],Xi=new C,wa=new Qn,rs=new C,os=new C,ls=new C,bn=new C,wn=new C,kn=new C,ks=new C,Ta=new C,Ea=new C,zn=new C;function Qr(a,e,t,i,n){for(let s=0,r=a.length-3;s<=r;s+=3){zn.fromArray(a,s);const o=n.x*Math.abs(zn.x)+n.y*Math.abs(zn.y)+n.z*Math.abs(zn.z),l=e.dot(zn),c=t.dot(zn),h=i.dot(zn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Zt=new C,Aa=new re;let Ou=0;class Ln extends Fn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ou++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=su,this.updateRanges=[],this.gpuType=Yi,this.version=0,this._normalizationScale=e!==void 0?El(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Aa.fromBufferAttribute(this,t),Aa.applyMatrix3(e),this.setXY(t,Aa.x,Aa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Zt.fromBufferAttribute(this,t),Zt.applyMatrix3(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Zt.fromBufferAttribute(this,t),Zt.applyMatrix4(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Zt.fromBufferAttribute(this,t),Zt.applyNormalMatrix(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Zt.fromBufferAttribute(this,t),Zt.transformDirection(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),n=this._normalize(n),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Ph(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Ih(e,this.array)}}class Uh extends Ln{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Fh extends Ln{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ot extends Ln{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Bu=new Qn,zs=new C,jr=new C;class Is{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Bu.setFromPoints(e).getCenter(i);let n=0;for(let s=0,r=e.length;s<r;s++)n=Math.max(n,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;zs.subVectors(e,this.center);const t=zs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),n=(i-this.radius)*.5;this.center.addScaledVector(zs,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(jr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(zs.copy(e.center).add(jr)),this.expandByPoint(zs.copy(e.center).sub(jr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let ku=0;const Fi=new Ct,eo=new ft,cs=new C,Di=new Qn,Gs=new Qn,ni=new C;class Ht extends Fn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ku++}),this.uuid=Jn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(au(e)?Fh:Uh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new et().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Fi.makeRotationFromQuaternion(e),this.applyMatrix4(Fi),this}rotateX(e){return Fi.makeRotationX(e),this.applyMatrix4(Fi),this}rotateY(e){return Fi.makeRotationY(e),this.applyMatrix4(Fi),this}rotateZ(e){return Fi.makeRotationZ(e),this.applyMatrix4(Fi),this}translate(e,t,i){return Fi.makeTranslation(e,t,i),this.applyMatrix4(Fi),this}scale(e,t,i){return Fi.makeScale(e,t,i),this.applyMatrix4(Fi),this}lookAt(e){return eo.lookAt(e),eo.updateMatrix(),this.applyMatrix4(eo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ot(i,3))}else{const i=Math.min(e.length,t.count);for(let n=0;n<i;n++){const s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&$e("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){_t("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){const s=t[i];Di.setFromBufferAttribute(s),this.morphTargetsRelative?(ni.addVectors(this.boundingBox.min,Di.min),this.boundingBox.expandByPoint(ni),ni.addVectors(this.boundingBox.max,Di.max),this.boundingBox.expandByPoint(ni)):(this.boundingBox.expandByPoint(Di.min),this.boundingBox.expandByPoint(Di.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&_t('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Is);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){_t("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){const i=this.boundingSphere.center;if(Di.setFromBufferAttribute(e),t)for(let s=0,r=t.length;s<r;s++){const o=t[s];Gs.setFromBufferAttribute(o),this.morphTargetsRelative?(ni.addVectors(Di.min,Gs.min),Di.expandByPoint(ni),ni.addVectors(Di.max,Gs.max),Di.expandByPoint(ni)):(Di.expandByPoint(Gs.min),Di.expandByPoint(Gs.max))}Di.getCenter(i);let n=0;for(let s=0,r=e.count;s<r;s++)ni.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(ni));if(t)for(let s=0,r=t.length;s<r;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)ni.fromBufferAttribute(o,c),l&&(cs.fromBufferAttribute(e,c),ni.add(cs)),n=Math.max(n,i.distanceToSquared(ni))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&_t('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){_t("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,n=t.normal,s=t.uv;let r=this.getAttribute("tangent");(r===void 0||r.count!==i.count)&&(r=new Ln(new Float32Array(4*i.count),4),this.setAttribute("tangent",r));const o=[],l=[],c=new Uint8Array(i.count);for(let I=0;I<i.count;I++)o[I]=new C,l[I]=new C;const h=new C,u=new C,d=new C,f=new re,m=new re,x=new re,p=new C,g=new C;function S(I,R,D){c[I]=c[R]=c[D]=1,h.fromBufferAttribute(i,I),u.fromBufferAttribute(i,R),d.fromBufferAttribute(i,D),f.fromBufferAttribute(s,I),m.fromBufferAttribute(s,R),x.fromBufferAttribute(s,D),u.sub(h),d.sub(h),m.sub(f),x.sub(f);const O=1/(m.x*x.y-x.x*m.y);isFinite(O)&&(p.copy(u).multiplyScalar(x.y).addScaledVector(d,-m.y).multiplyScalar(O),g.copy(d).multiplyScalar(m.x).addScaledVector(u,-x.x).multiplyScalar(O),o[I].add(p),o[R].add(p),o[D].add(p),l[I].add(g),l[R].add(g),l[D].add(g))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let I=0,R=w.length;I<R;++I){const D=w[I],O=D.start,W=D.count;for(let N=O,H=O+W;N<H;N+=3)S(e.getX(N+0),e.getX(N+1),e.getX(N+2))}const _=new C,E=new C,T=new C,v=new C;function M(I){T.fromBufferAttribute(n,I),v.copy(T);const R=o[I];_.copy(R),_.sub(T.multiplyScalar(T.dot(R))).normalize(),E.crossVectors(v,R);const O=E.dot(l[I])<0?-1:1;r.setXYZW(I,_.x,_.y,_.z,O)}for(let I=0,R=i.count;I<R;++I)c[I]&&M(I);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Ln(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const n=new C,s=new C,r=new C,o=new C,l=new C,c=new C,h=new C,u=new C;if(e)for(let d=0,f=e.count;d<f;d+=3){const m=e.getX(d+0),x=e.getX(d+1),p=e.getX(d+2);n.fromBufferAttribute(t,m),s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,p),h.subVectors(r,s),u.subVectors(n,s),h.cross(u),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,p),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)n.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),h.subVectors(r,s),u.subVectors(n,s),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)ni.fromBufferAttribute(e,t),ni.normalize(),e.setXYZ(t,ni.x,ni.y,ni.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,m=0;for(let x=0,p=l.length;x<p;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let g=0;g<h;g++)d[m++]=c[f++]}return new Ln(d,h,u)}if(this.index===null)return $e("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ht,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=e(l,i);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const n={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(n[l]=h,s=!0)}s&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const n=e.attributes;for(const c in n){const h=n[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,h=r.length;c<h;c++){const u=r[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const to=new C,zu=new C,Gu=new et;class un{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const n=to.subVectors(i,t).cross(zu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const n=e.delta(to),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Gu.getNormalMatrix(e),n=this.coplanarPoint(to).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Hu=0;class jn extends Fn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Hu++}),this.uuid=Jn(),this.name="",this.type="Material",this.blending=xs,this.side=qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=gh,this.blendDst=vh,this.blendEquation=ms,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=na,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Qd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Or,this.stencilZFail=Or,this.stencilZPass=Or,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){$e(`Material: parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){$e(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(s){const r=[];for(const o in s){const l=s[o];delete l.metadata,r.push(l)}return r}if(t){const s=n(e.textures),r=n(e.images);s.length>0&&(i.textures=s),r.length>0&&(i.images=r)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ke().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new un().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new re().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new re().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const n=t.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const hn=new C,io=new C,Ra=new C,Ca=new C;class Cr{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hn.copy(this.origin).addScaledVector(this.direction,t),hn.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){io.copy(e).add(t).multiplyScalar(.5),Ra.copy(t).sub(e).normalize(),Ca.copy(this.origin).sub(io);const s=e.distanceTo(t)*.5,r=-this.direction.dot(Ra),o=Ca.dot(this.direction),l=-Ca.dot(Ra),c=Ca.lengthSq(),h=Math.abs(1-r*r);let u,d,f,m;if(h>0)if(u=r*l-o,d=r*o-l,m=s*h,u>=0)if(d>=-m)if(d<=m){const x=1/h;u*=x,d*=x,f=u*(u+r*d+2*o)+d*(r*u+d+2*l)+c}else d=s,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-r*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(r*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=r>0?-s:s,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),n&&n.copy(io).addScaledVector(Ra,d),f}intersectSphere(e,t){if(e.radius<0)return null;hn.subVectors(e.center,this.origin);const i=hn.dot(this.direction),n=hn.dot(hn)-i*i,s=e.radius*e.radius;if(n>s)return null;const r=Math.sqrt(s-n),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,s,r,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,n=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,n=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,r=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,r=(e.min.y-d.y)*h),i>r||s>n||((s>i||isNaN(i))&&(i=s),(r<n||isNaN(n))&&(n=r),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,t)}intersectsBox(e){return this.intersectBox(e,hn)!==null}intersectTriangle(e,t,i,n,s){const r=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-r.x,d=e.y-r.y,f=e.z-r.z,m=t.x-r.x,x=t.y-r.y,p=t.z-r.z,g=i.x-r.x,S=i.y-r.y,w=i.z-r.z,_=Math.abs(l),E=Math.abs(c),T=Math.abs(h);let v,M,I,R,D,O,W,N,H,K,B,le;if(_>=E&&_>=T?(I=l,O=u,H=m,le=g,l>=0?(v=c,M=h,R=d,D=f,W=x,N=p,K=S,B=w):(v=h,M=c,R=f,D=d,W=p,N=x,K=w,B=S)):E>=T?(I=c,O=d,H=x,le=S,c>=0?(v=h,M=l,R=f,D=u,W=p,N=m,K=w,B=g):(v=l,M=h,R=u,D=f,W=m,N=p,K=g,B=w)):(I=h,O=f,H=p,le=w,h>=0?(v=l,M=c,R=u,D=d,W=m,N=x,K=g,B=S):(v=c,M=l,R=d,D=u,W=x,N=m,K=S,B=g)),I===0)return null;const q=v/I,ie=M/I,ae=1/I,Ce=R-q*O,He=D-ie*O,J=W-q*H,be=N-ie*H,Pe=K-q*le,Oe=B-ie*le,we=Pe*be-Oe*J,Be=Ce*Oe-He*Pe,At=J*He-be*Ce;if(n){if(we<0||Be<0||At<0)return null}else if((we<0||Be<0||At<0)&&(we>0||Be>0||At>0))return null;const We=we+Be+At;if(We===0)return null;const it=ae*(we*O+Be*H+At*le);return(We>0?it<0:it>0)?null:this.at(it/We,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Pt extends jn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=dl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const dc=new Ct,Gn=new Cr,Pa=new Is,uc=new C,Ia=new C,Da=new C,La=new C,no=new C,Na=new C,fc=new C,Ua=new C;class V extends ft{constructor(e=new Ht,t=new Pt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=n.length;s<r;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(n,e);const o=this.morphTargetInfluences;if(s&&o){Na.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],u=s[l];h!==0&&(no.fromBufferAttribute(u,e),r?Na.addScaledVector(no,h):Na.addScaledVector(no.sub(t),h))}t.add(Na)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,n=this.material,s=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Pa.copy(i.boundingSphere),Pa.applyMatrix4(s),Gn.copy(e.ray).recast(e.near),!(Pa.containsPoint(Gn.origin)===!1&&(Gn.intersectSphere(Pa,uc)===null||Gn.origin.distanceToSquared(uc)>(e.far-e.near)**2))&&(dc.copy(s).invert(),Gn.copy(e.ray).applyMatrix4(dc),!(i.boundingBox!==null&&Gn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Gn)))}_computeIntersections(e,t,i){let n;const s=this.geometry,r=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(r))for(let m=0,x=d.length;m<x;m++){const p=d[m],g=r[p.materialIndex],S=Math.max(p.start,f.start),w=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let _=S,E=w;_<E;_+=3){const T=o.getX(_),v=o.getX(_+1),M=o.getX(_+2);n=Fa(this,g,e,i,c,h,u,T,v,M),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=p.materialIndex,t.push(n))}}else{const m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let p=m,g=x;p<g;p+=3){const S=o.getX(p),w=o.getX(p+1),_=o.getX(p+2);n=Fa(this,r,e,i,c,h,u,S,w,_),n&&(n.faceIndex=Math.floor(p/3),t.push(n))}}else if(l!==void 0)if(Array.isArray(r))for(let m=0,x=d.length;m<x;m++){const p=d[m],g=r[p.materialIndex],S=Math.max(p.start,f.start),w=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let _=S,E=w;_<E;_+=3){const T=_,v=_+1,M=_+2;n=Fa(this,g,e,i,c,h,u,T,v,M),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=p.materialIndex,t.push(n))}}else{const m=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let p=m,g=x;p<g;p+=3){const S=p,w=p+1,_=p+2;n=Fa(this,r,e,i,c,h,u,S,w,_),n&&(n.faceIndex=Math.floor(p/3),t.push(n))}}}}function Wu(a,e,t,i,n,s,r,o){let l;if(e.side===Ei?l=i.intersectTriangle(r,s,n,!0,o):l=i.intersectTriangle(n,s,r,e.side===qn,o),l===null)return null;Ua.copy(o),Ua.applyMatrix4(a.matrixWorld);const c=t.ray.origin.distanceTo(Ua);return c<t.near||c>t.far?null:{distance:c,point:Ua.clone(),object:a}}function Fa(a,e,t,i,n,s,r,o,l,c){a.getVertexPosition(o,Ia),a.getVertexPosition(l,Da),a.getVertexPosition(c,La);const h=Wu(a,e,t,i,Ia,Da,La,fc);if(h){const u=new C;zi.getBarycoord(fc,Ia,Da,La,u),n&&(h.uv=zi.getInterpolatedAttribute(n,o,l,c,u,new re)),s&&(h.uv1=zi.getInterpolatedAttribute(s,o,l,c,u,new re)),r&&(h.normal=zi.getInterpolatedAttribute(r,o,l,c,u,new C),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new C,materialIndex:0};zi.getNormal(Ia,Da,La,d.normal),h.face=d,h.barycoord=u}return h}class Oh extends mi{constructor(e=null,t=1,i=1,n,s,r,o,l,c=ci,h=ci,u,d){super(null,r,o,l,c,h,n,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class pc extends Ln{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const hs=new Ct,mc=new Ct,Oa=[],gc=new Qn,Vu=new Ct,Hs=new V,Ws=new Is;class Xu extends V{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new pc(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,Vu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Qn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,hs),gc.copy(e.boundingBox).applyMatrix4(hs),this.boundingBox.union(gc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Is),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,hs),Ws.copy(e.boundingSphere).applyMatrix4(hs),this.boundingSphere.union(Ws)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,n=this.morphTexture.source.data.data,s=i.length+1,r=e*s+1;for(let o=0;o<i.length;o++)i[o]=n[r+o]}raycast(e,t){const i=this.matrixWorld,n=this.count;if(Hs.geometry=this.geometry,Hs.material=this.material,Hs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ws.copy(this.boundingSphere),Ws.applyMatrix4(i),e.ray.intersectsSphere(Ws)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,hs),mc.multiplyMatrices(i,hs),Hs.matrixWorld=mc,Hs.raycast(e,Oa);for(let r=0,o=Oa.length;r<o;r++){const l=Oa[r];l.instanceId=s,l.object=this,t.push(l)}Oa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new pc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new Oh(new Float32Array(n*this.count),n,this.count,Ml,Yi));const s=this.morphTexture.source.data.data;let r=0;for(let c=0;c<i.length;c++)r+=i[c];const o=this.geometry.morphTargetsRelative?1:1-r,l=n*e;return s[l]=o,s.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Hn=new Is,$u=new re(.5,.5),Ba=new C;class ca{constructor(e=new un,t=new un,i=new un,n=new un,s=new un,r=new un){this.planes=[e,t,i,n,s,r]}set(e,t,i,n,s,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ki,i=!1){const n=this.planes,s=e.elements,r=s[0],o=s[1],l=s[2],c=s[3],h=s[4],u=s[5],d=s[6],f=s[7],m=s[8],x=s[9],p=s[10],g=s[11],S=s[12],w=s[13],_=s[14],E=s[15];if(n[0].setComponents(c-r,f-h,g-m,E-S).normalize(),n[1].setComponents(c+r,f+h,g+m,E+S).normalize(),n[2].setComponents(c+o,f+u,g+x,E+w).normalize(),n[3].setComponents(c-o,f-u,g-x,E-w).normalize(),i)n[4].setComponents(l,d,p,_).normalize(),n[5].setComponents(c-l,f-d,g-p,E-_).normalize();else if(n[4].setComponents(c-l,f-d,g-p,E-_).normalize(),t===Ki)n[5].setComponents(c+l,f+d,g+p,E+_).normalize();else if(t===oa)n[5].setComponents(l,d,p,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Hn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hn)}intersectsSprite(e){Hn.center.set(0,0,0);const t=$u.distanceTo(e.center);return Hn.radius=.7071067811865476+t,Hn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hn)}intersectsSphere(e){const t=this.planes,i=e.center,n=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const n=t[i];if(Ba.x=n.normal.x>0?e.max.x:e.min.x,Ba.y=n.normal.y>0?e.max.y:e.min.y,Ba.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(Ba)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const vc=new Ct;class Cl{constructor(){this.coordinateSystem=Ki,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let n=0;n<t.length;n++){const s=t[n];vc.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),i[n]===void 0&&(i[n]=new ca),i[n].setFromProjectionMatrix(vc,s.coordinateSystem,s.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let n=0;n<e._count;n++)t[n]===void 0&&(t[n]=new ca),t[n].copy(i[n]);return this._count=e._count,this}clone(){return new Cl().copy(this)}}class gs extends jn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Sr=new C,Mr=new C,xc=new Ct,Vs=new Cr,ka=new Is,so=new C,_c=new C;class Qs extends ft{constructor(e=new Ht,t=new gs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let n=1,s=t.count;n<s;n++)Sr.fromBufferAttribute(t,n-1),Mr.fromBufferAttribute(t,n),i[n]=i[n-1],i[n]+=Sr.distanceTo(Mr);e.setAttribute("lineDistance",new ot(i,1))}else $e("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,n=this.matrixWorld,s=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ka.copy(i.boundingSphere),ka.applyMatrix4(n),ka.radius+=s,e.ray.intersectsSphere(ka)===!1)return;xc.copy(n).invert(),Vs.copy(e.ray).applyMatrix4(xc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,r.start),m=Math.min(h.count,r.start+r.count);for(let x=f,p=m-1;x<p;x+=c){const g=h.getX(x),S=h.getX(x+1),w=za(this,e,Vs,l,g,S,x);w&&t.push(w)}if(this.isLineLoop){const x=h.getX(m-1),p=h.getX(f),g=za(this,e,Vs,l,x,p,m-1);g&&t.push(g)}}else{const f=Math.max(0,r.start),m=Math.min(d.count,r.start+r.count);for(let x=f,p=m-1;x<p;x+=c){const g=za(this,e,Vs,l,x,x+1,x);g&&t.push(g)}if(this.isLineLoop){const x=za(this,e,Vs,l,m-1,f,m-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=n.length;s<r;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function za(a,e,t,i,n,s,r){const o=a.geometry.attributes.position;if(Sr.fromBufferAttribute(o,n),Mr.fromBufferAttribute(o,s),t.distanceSqToSegment(Sr,Mr,so,_c)>i)return;so.applyMatrix4(a.matrixWorld);const c=e.ray.origin.distanceTo(so);if(!(c<e.near||c>e.far))return{distance:c,point:_c.clone().applyMatrix4(a.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:a}}const Sc=new C,Mc=new C;class qu extends Qs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let n=0,s=t.count;n<s;n+=2)Sc.fromBufferAttribute(t,n),Mc.fromBufferAttribute(t,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+Sc.distanceTo(Mc);e.setAttribute("lineDistance",new ot(i,1))}else $e("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Yu extends Qs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Bh extends mi{constructor(e=[],t=ws,i,n,s,r,o,l,c,h){super(e,t,i,n,s,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ms extends mi{constructor(e,t,i,n,s,r,o,l,c){super(e,t,i,n,s,r,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Es extends mi{constructor(e,t,i=tn,n,s,r,o=ci,l=ci,c,h=Nn,u=1){if(h!==Nn&&h!==In)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,n,s,r,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Al(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class kh extends Es{constructor(e,t=tn,i=ws,n,s,r=ci,o=ci,l,c=Nn){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,i,n,s,r,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class zh extends mi{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Et extends Ht{constructor(e=1,t=1,i=1,n=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:s,depthSegments:r};const o=this;n=Math.floor(n),s=Math.floor(s),r=Math.floor(r);const l=[],c=[],h=[],u=[];let d=0,f=0;m("z","y","x",-1,-1,i,t,e,r,s,0),m("z","y","x",1,-1,i,t,-e,r,s,1),m("x","z","y",1,1,e,i,t,n,r,2),m("x","z","y",1,-1,e,i,-t,n,r,3),m("x","y","z",1,-1,e,t,i,n,s,4),m("x","y","z",-1,-1,e,t,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(u,2));function m(x,p,g,S,w,_,E,T,v,M,I){const R=_/v,D=E/M,O=_/2,W=E/2,N=T/2,H=v+1,K=M+1;let B=0,le=0;const q=new C;for(let ie=0;ie<K;ie++){const ae=ie*D-W;for(let Ce=0;Ce<H;Ce++){const He=Ce*R-O;q[x]=He*S,q[p]=ae*w,q[g]=N,c.push(q.x,q.y,q.z),q[x]=0,q[p]=0,q[g]=T>0?1:-1,h.push(q.x,q.y,q.z),u.push(Ce/v),u.push(1-ie/M),B+=1}}for(let ie=0;ie<M;ie++)for(let ae=0;ae<v;ae++){const Ce=d+ae+H*ie,He=d+ae+H*(ie+1),J=d+(ae+1)+H*(ie+1),be=d+(ae+1)+H*ie;l.push(Ce,He,be),l.push(He,J,be),le+=6}o.addGroup(f,le,I),f+=le,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Et(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class ys extends Ht{constructor(e=1,t=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:n},t=Math.max(3,t);const s=[],r=[],o=[],l=[],c=new C,h=new re;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=i+u/t*n;c.x=e*Math.cos(f),c.y=e*Math.sin(f),r.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(r[d]/e+1)/2,h.y=(r[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new ot(r,3)),this.setAttribute("normal",new ot(o,3)),this.setAttribute("uv",new ot(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ys(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class wi extends Ht{constructor(e=1,t=1,i=1,n=32,s=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),s=Math.floor(s);const h=[],u=[],d=[],f=[];let m=0;const x=[],p=i/2;let g=0;S(),r===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new ot(u,3)),this.setAttribute("normal",new ot(d,3)),this.setAttribute("uv",new ot(f,2));function S(){const _=new C,E=new C;let T=0;const v=(t-e)/i;for(let M=0;M<=s;M++){const I=[],R=M/s,D=R*(t-e)+e;for(let O=0;O<=n;O++){const W=O/n,N=W*l+o,H=Math.sin(N),K=Math.cos(N);E.x=D*H,E.y=-R*i+p,E.z=D*K,u.push(E.x,E.y,E.z),_.set(H,v,K).normalize(),d.push(_.x,_.y,_.z),f.push(W,1-R),I.push(m++)}x.push(I)}for(let M=0;M<n;M++)for(let I=0;I<s;I++){const R=x[I][M],D=x[I+1][M],O=x[I+1][M+1],W=x[I][M+1];(e>0||I!==0)&&(h.push(R,D,W),T+=3),(t>0||I!==s-1)&&(h.push(D,O,W),T+=3)}c.addGroup(g,T,0),g+=T}function w(_){const E=m,T=new re,v=new C;let M=0;const I=_===!0?e:t,R=_===!0?1:-1;for(let O=1;O<=n;O++)u.push(0,p*R,0),d.push(0,R,0),f.push(.5,.5),m++;const D=m;for(let O=0;O<=n;O++){const N=O/n*l+o,H=Math.cos(N),K=Math.sin(N);v.x=I*K,v.y=p*R,v.z=I*H,u.push(v.x,v.y,v.z),d.push(0,R,0),T.x=H*.5+.5,T.y=K*.5*R+.5,f.push(T.x,T.y),m++}for(let O=0;O<n;O++){const W=E+O,N=D+O;_===!0?h.push(N,N+1,W):h.push(N+1,N,W),M+=3}c.addGroup(g,M,_===!0?1:2),g+=M}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wi(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class qi extends wi{constructor(e=1,t=1,i=32,n=1,s=!1,r=0,o=Math.PI*2){super(0,e,t,i,n,s,r,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:r,thetaLength:o}}static fromJSON(e){return new qi(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Pl extends Ht{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};const s=[],r=[];o(n),c(i),h(),this.setAttribute("position",new ot(s,3)),this.setAttribute("normal",new ot(s.slice(),3)),this.setAttribute("uv",new ot(r,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const w=new C,_=new C,E=new C;for(let T=0;T<t.length;T+=3)f(t[T+0],w),f(t[T+1],_),f(t[T+2],E),l(w,_,E,S)}function l(S,w,_,E){const T=E+1,v=[];for(let M=0;M<=T;M++){v[M]=[];const I=S.clone().lerp(_,M/T),R=w.clone().lerp(_,M/T),D=T-M;for(let O=0;O<=D;O++)O===0&&M===T?v[M][O]=I:v[M][O]=I.clone().lerp(R,O/D)}for(let M=0;M<T;M++)for(let I=0;I<2*(T-M)-1;I++){const R=Math.floor(I/2);I%2===0?(d(v[M][R+1]),d(v[M+1][R]),d(v[M][R])):(d(v[M][R+1]),d(v[M+1][R+1]),d(v[M+1][R]))}}function c(S){const w=new C;for(let _=0;_<s.length;_+=3)w.x=s[_+0],w.y=s[_+1],w.z=s[_+2],w.normalize().multiplyScalar(S),s[_+0]=w.x,s[_+1]=w.y,s[_+2]=w.z}function h(){const S=new C;for(let w=0;w<s.length;w+=3){S.x=s[w+0],S.y=s[w+1],S.z=s[w+2];const _=p(S)/2/Math.PI+.5,E=g(S)/Math.PI+.5;r.push(_,1-E)}m(),u()}function u(){for(let S=0;S<r.length;S+=6){const w=r[S+0],_=r[S+2],E=r[S+4],T=Math.max(w,_,E),v=Math.min(w,_,E);T>.9&&v<.1&&(w<.2&&(r[S+0]+=1),_<.2&&(r[S+2]+=1),E<.2&&(r[S+4]+=1))}}function d(S){s.push(S.x,S.y,S.z)}function f(S,w){const _=S*3;w.x=e[_+0],w.y=e[_+1],w.z=e[_+2]}function m(){const S=new C,w=new C,_=new C,E=new C,T=new re,v=new re,M=new re;for(let I=0,R=0;I<s.length;I+=9,R+=6){S.set(s[I+0],s[I+1],s[I+2]),w.set(s[I+3],s[I+4],s[I+5]),_.set(s[I+6],s[I+7],s[I+8]),T.set(r[R+0],r[R+1]),v.set(r[R+2],r[R+3]),M.set(r[R+4],r[R+5]),E.copy(S).add(w).add(_).divideScalar(3);const D=p(E);x(T,R+0,S,D),x(v,R+2,w,D),x(M,R+4,_,D)}}function x(S,w,_,E){E<0&&S.x===1&&(r[w]=S.x-1),_.x===0&&_.z===0&&(r[w]=E/2/Math.PI+.5)}function p(S){return Math.atan2(S.z,-S.x)}function g(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pl(e.vertices,e.indices,e.radius,e.detail)}}class js extends Pl{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,n=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],r=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,r,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new js(e.radius,e.detail)}}const Ga=new C,Ha=new C,ao=new C,Wa=new zi;class Ku extends Ht{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const n=Math.pow(10,4),s=Math.cos(_s*t),r=e.getIndex(),o=e.getAttribute("position"),l=r?r.count:o.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d=new Map,f=[];for(let m=0;m<l;m+=3){r?(c[0]=r.getX(m),c[1]=r.getX(m+1),c[2]=r.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:x,b:p,c:g}=Wa;if(x.fromBufferAttribute(o,c[0]),p.fromBufferAttribute(o,c[1]),g.fromBufferAttribute(o,c[2]),Wa.getNormal(ao),u[0]=`${Math.round(x.x*n)},${Math.round(x.y*n)},${Math.round(x.z*n)}`,u[1]=`${Math.round(p.x*n)},${Math.round(p.y*n)},${Math.round(p.z*n)}`,u[2]=`${Math.round(g.x*n)},${Math.round(g.y*n)},${Math.round(g.z*n)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let S=0;S<3;S++){const w=(S+1)%3,_=u[S],E=u[w],T=Wa[h[S]],v=Wa[h[w]],M=`${_}_${E}`,I=`${E}_${_}`,R=d.get(I);R?(ao.dot(R.normal)<=s&&(f.push(T.x,T.y,T.z),f.push(v.x,v.y,v.z)),d.set(I,null)):d.has(M)||d.set(M,{index0:c[S],index1:c[w],normal:ao.clone()})}}for(const m of d.values())if(m){const{index0:x,index1:p}=m;Ga.fromBufferAttribute(o,x),Ha.fromBufferAttribute(o,p),f.push(Ga.x,Ga.y,Ga.z),f.push(Ha.x,Ha.y,Ha.z)}this.setAttribute("position",new ot(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class sn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){$e("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,n=this.getPoint(0),s=0;t.push(0);for(let r=1;r<=e;r++)i=this.getPoint(r/e),s+=i.distanceTo(n),t.push(s),n=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let n=0;const s=i.length;let r;t?r=t:r=e*i[s-1];let o=0,l=s-1,c;for(;o<=l;)if(n=Math.floor(o+(l-o)/2),c=i[n]-r,c<0)o=n+1;else if(c>0)l=n-1;else{l=n;break}if(n=l,i[n]===r)return n/(s-1);const h=i[n],d=i[n+1]-h,f=(r-h)/d;return(n+f)/(s-1)}getTangent(e,t){let n=e-1e-4,s=e+1e-4;n<0&&(n=0),s>1&&(s=1);const r=this.getPoint(n),o=this.getPoint(s),l=t||(r.isVector2?new re:new C);return l.copy(o).sub(r).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new C,n=[],s=[],r=[],o=new C,l=new Ct;for(let f=0;f<=e;f++){const m=f/e;n[f]=this.getTangentAt(m,new C)}s[0]=new C,r[0]=new C;let c=Number.MAX_VALUE;const h=Math.abs(n[0].x),u=Math.abs(n[0].y),d=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),s[0].crossVectors(n[0],o),r[0].crossVectors(n[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),r[f]=r[f-1].clone(),o.crossVectors(n[f-1],n[f]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(st(n[f-1].dot(n[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(o,m))}r[f].crossVectors(n[f],s[f])}if(t===!0){let f=Math.acos(st(s[0].dot(s[e]),-1,1));f/=e,n[0].dot(o.crossVectors(s[0],s[e]))>0&&(f=-f);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(n[m],f*m)),r[m].crossVectors(n[m],s[m])}return{tangents:n,normals:s,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}}class Il extends sn{constructor(e=0,t=0,i=1,n=1,s=0,r=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=n,this.aStartAngle=s,this.aEndAngle=r,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new re){const i=t,n=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const r=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=n;for(;s>n;)s-=n;s<Number.EPSILON&&(r?s=0:s=n),this.aClockwise===!0&&!r&&(s===n?s=-n:s=s-n);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Zu extends Il{constructor(e,t,i,n,s,r){super(e,t,i,i,n,s,r),this.isArcCurve=!0,this.type="ArcCurve"}}function Dl(){let a=0,e=0,t=0,i=0;function n(s,r,o,l){a=s,e=o,t=-3*s+3*r-2*o-l,i=2*s-2*r+o+l}return{initCatmullRom:function(s,r,o,l,c){n(r,o,c*(o-s),c*(l-r))},initNonuniformCatmullRom:function(s,r,o,l,c,h,u){let d=(r-s)/c-(o-s)/(c+h)+(o-r)/h,f=(o-r)/h-(l-r)/(h+u)+(l-o)/u;d*=h,f*=h,n(r,o,d,f)},calc:function(s){const r=s*s,o=r*s;return a+e*s+t*r+i*o}}}const yc=new C,bc=new C,ro=new Dl,oo=new Dl,lo=new Dl;class Ju extends sn{constructor(e=[],t=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=n}getPoint(e,t=new C){const i=t,n=this.points,s=n.length,r=(s-(this.closed?0:1))*e;let o=Math.floor(r),l=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,h;this.closed||o>0?c=n[(o-1)%s]:(bc.subVectors(n[0],n[1]).add(n[0]),c=bc);const u=n[o%s],d=n[(o+1)%s];if(this.closed||o+2<s?h=n[(o+2)%s]:(yc.subVectors(n[s-1],n[s-2]).add(n[s-1]),h=yc),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),m<1e-4&&(m=x),p<1e-4&&(p=x),ro.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,x,p),oo.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,x,p),lo.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,x,p)}else this.curveType==="catmullrom"&&(ro.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),oo.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),lo.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return i.set(ro.calc(l),oo.calc(l),lo.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(new C().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function wc(a,e,t,i,n){const s=(i-e)*.5,r=(n-t)*.5,o=a*a,l=a*o;return(2*t-2*i+s+r)*l+(-3*t+3*i-2*s-r)*o+s*a+t}function Qu(a,e){const t=1-a;return t*t*e}function ju(a,e){return 2*(1-a)*a*e}function ef(a,e){return a*a*e}function ea(a,e,t,i){return Qu(a,e)+ju(a,t)+ef(a,i)}function tf(a,e){const t=1-a;return t*t*t*e}function nf(a,e){const t=1-a;return 3*t*t*a*e}function sf(a,e){return 3*(1-a)*a*a*e}function af(a,e){return a*a*a*e}function ta(a,e,t,i,n){return tf(a,e)+nf(a,t)+sf(a,i)+af(a,n)}class Gh extends sn{constructor(e=new re,t=new re,i=new re,n=new re){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new re){const i=t,n=this.v0,s=this.v1,r=this.v2,o=this.v3;return i.set(ta(e,n.x,s.x,r.x,o.x),ta(e,n.y,s.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class rf extends sn{constructor(e=new C,t=new C,i=new C,n=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new C){const i=t,n=this.v0,s=this.v1,r=this.v2,o=this.v3;return i.set(ta(e,n.x,s.x,r.x,o.x),ta(e,n.y,s.y,r.y,o.y),ta(e,n.z,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Hh extends sn{constructor(e=new re,t=new re){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new re){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new re){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class of extends sn{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Wh extends sn{constructor(e=new re,t=new re,i=new re){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new re){const i=t,n=this.v0,s=this.v1,r=this.v2;return i.set(ea(e,n.x,s.x,r.x),ea(e,n.y,s.y,r.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ll extends sn{constructor(e=new C,t=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new C){const i=t,n=this.v0,s=this.v1,r=this.v2;return i.set(ea(e,n.x,s.x,r.x),ea(e,n.y,s.y,r.y),ea(e,n.z,s.z,r.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Vh extends sn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new re){const i=t,n=this.points,s=(n.length-1)*e,r=Math.floor(s),o=s-r,l=n[r===0?r:r-1],c=n[r],h=n[r>n.length-2?n.length-1:r+1],u=n[r>n.length-3?n.length-1:r+2];return i.set(wc(o,l.x,c.x,h.x,u.x),wc(o,l.y,c.y,h.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(n.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(new re().fromArray(n))}return this}}var yr=Object.freeze({__proto__:null,ArcCurve:Zu,CatmullRomCurve3:Ju,CubicBezierCurve:Gh,CubicBezierCurve3:rf,EllipseCurve:Il,LineCurve:Hh,LineCurve3:of,QuadraticBezierCurve:Wh,QuadraticBezierCurve3:Ll,SplineCurve:Vh});class lf extends sn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new yr[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),n=this.getCurveLengths();let s=0;for(;s<n.length;){if(n[s]>=i){const r=n[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-r/l;return o.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,n=this.curves.length;i<n;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let n=0,s=this.curves;n<s.length;n++){const r=s[n],o=r.isEllipseCurve?e*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?e*r.points.length:e,l=r.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const n=e.curves[t];this.curves.push(new yr[n.type]().fromJSON(n))}return this.cacheLengths=null,this}}class Tc extends lf{constructor(e){super(),this.type="Path",this.currentPoint=new re,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Hh(this.currentPoint.clone(),new re(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,n){const s=new Wh(this.currentPoint.clone(),new re(e,t),new re(i,n));return this.curves.push(s),this.currentPoint.set(i,n),this}bezierCurveTo(e,t,i,n,s,r){const o=new Gh(this.currentPoint.clone(),new re(e,t),new re(i,n),new re(s,r));return this.curves.push(o),this.currentPoint.set(s,r),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Vh(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,n,s,r){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,n,s,r),this}absarc(e,t,i,n,s,r){return this.absellipse(e,t,i,i,n,s,r),this}ellipse(e,t,i,n,s,r,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,n,s,r,o,l),this}absellipse(e,t,i,n,s,r,o,l){const c=new Il(e,t,i,n,s,r,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Nl extends Tc{constructor(e){super(e),this.uuid=Jn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,n=this.holes.length;i<n;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const n=e.holes[t];this.holes.push(new Tc().fromJSON(n))}return this}}function cf(a,e,t=2){const i=e&&e.length,n=i?e[0]*t:a.length;let s=Xh(a,0,n,t,!0);const r=[];if(!s||s.next===s.prev)return r;let o,l,c;if(i&&(s=pf(a,e,s,t)),a.length>80*t){o=a[0],l=a[1];let h=o,u=l;for(let d=t;d<n;d+=t){const f=a[d],m=a[d+1];f<o&&(o=f),m<l&&(l=m),f>h&&(h=f),m>u&&(u=m)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return ha(s,r,t,o,l,c,0),r}function Xh(a,e,t,i,n){let s;if(n===Tf(a,e,t,i)>0)for(let r=e;r<t;r+=i)s=Ec(r/i|0,a[r],a[r+1],s);else for(let r=t-i;r>=e;r-=i)s=Ec(r/i|0,a[r],a[r+1],s);return s&&As(s,s.next)&&(ua(s),s=s.next),s}function Kn(a,e){if(!a)return a;e||(e=a);let t=a,i;do if(i=!1,!t.steiner&&(As(t,t.next)||Gt(t.prev,t,t.next)===0)){if(ua(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function ha(a,e,t,i,n,s,r){if(!a)return;!r&&s&&_f(a,i,n,s);let o=a;for(;a.prev!==a.next;){const l=a.prev,c=a.next;if(s?df(a,i,n,s):hf(a)){e.push(l.i,a.i,c.i),ua(a),a=c.next,o=c.next;continue}if(a=c,a===o){r?r===1?(a=uf(Kn(a),e),ha(a,e,t,i,n,s,2)):r===2&&ff(a,e,t,i,n,s):ha(Kn(a),e,t,i,n,s,1);break}}}function hf(a){const e=a.prev,t=a,i=a.next;if(Gt(e,t,i)>=0)return!1;const n=e.x,s=t.x,r=i.x,o=e.y,l=t.y,c=i.y,h=Math.min(n,s,r),u=Math.min(o,l,c),d=Math.max(n,s,r),f=Math.max(o,l,c);let m=i.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Ys(n,o,s,l,r,c,m.x,m.y)&&Gt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function df(a,e,t,i){const n=a.prev,s=a,r=a.next;if(Gt(n,s,r)>=0)return!1;const o=n.x,l=s.x,c=r.x,h=n.y,u=s.y,d=r.y,f=Math.min(o,l,c),m=Math.min(h,u,d),x=Math.max(o,l,c),p=Math.max(h,u,d),g=il(f,m,e,t,i),S=il(x,p,e,t,i);let w=a.prevZ,_=a.nextZ;for(;w&&w.z>=g&&_&&_.z<=S;){if(w.x>=f&&w.x<=x&&w.y>=m&&w.y<=p&&w!==n&&w!==r&&Ys(o,h,l,u,c,d,w.x,w.y)&&Gt(w.prev,w,w.next)>=0||(w=w.prevZ,_.x>=f&&_.x<=x&&_.y>=m&&_.y<=p&&_!==n&&_!==r&&Ys(o,h,l,u,c,d,_.x,_.y)&&Gt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;w&&w.z>=g;){if(w.x>=f&&w.x<=x&&w.y>=m&&w.y<=p&&w!==n&&w!==r&&Ys(o,h,l,u,c,d,w.x,w.y)&&Gt(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;_&&_.z<=S;){if(_.x>=f&&_.x<=x&&_.y>=m&&_.y<=p&&_!==n&&_!==r&&Ys(o,h,l,u,c,d,_.x,_.y)&&Gt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function uf(a,e){let t=a;do{const i=t.prev,n=t.next.next;!As(i,n)&&qh(i,t,t.next,n)&&da(i,n)&&da(n,i)&&(e.push(i.i,t.i,n.i),ua(t),ua(t.next),t=a=n),t=t.next}while(t!==a);return Kn(t)}function ff(a,e,t,i,n,s){let r=a;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&yf(r,o)){let l=Yh(r,o);r=Kn(r,r.next),l=Kn(l,l.next),ha(r,e,t,i,n,s,0),ha(l,e,t,i,n,s,0);return}o=o.next}r=r.next}while(r!==a)}function pf(a,e,t,i){const n=[];for(let s=0,r=e.length;s<r;s++){const o=e[s]*i,l=s<r-1?e[s+1]*i:a.length,c=Xh(a,o,l,i,!1);c===c.next&&(c.steiner=!0),n.push(Mf(c))}n.sort(mf);for(let s=0;s<n.length;s++)t=gf(n[s],t);return t}function mf(a,e){let t=a.x-e.x;if(t===0&&(t=a.y-e.y,t===0)){const i=(a.next.y-a.y)/(a.next.x-a.x),n=(e.next.y-e.y)/(e.next.x-e.x);t=i-n}return t}function gf(a,e){const t=vf(a,e);if(!t)return e;const i=Yh(t,a);return Kn(i,i.next),Kn(t,t.next)}function vf(a,e){let t=e;const i=a.x,n=a.y;let s=-1/0,r;if(As(a,t))return t;do{if(As(a,t.next))return t.next;if(n<=t.y&&n>=t.next.y&&t.next.y!==t.y){const u=t.x+(n-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>s&&(s=u,r=t.x<t.next.x?t:t.next,u===i))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,l=r.x,c=r.y;let h=1/0;t=r;do{if(i>=t.x&&t.x>=l&&i!==t.x&&$h(n<c?i:s,n,l,c,n<c?s:i,n,t.x,t.y)){const u=Math.abs(n-t.y)/(i-t.x);da(t,a)&&(u<h||u===h&&(t.x>r.x||t.x===r.x&&xf(r,t)))&&(r=t,h=u)}t=t.next}while(t!==o);return r}function xf(a,e){return Gt(a.prev,a,e.prev)<0&&Gt(e.next,a,a.next)<0}function _f(a,e,t,i){let n=a;do n.z===0&&(n.z=il(n.x,n.y,e,t,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==a);n.prevZ.nextZ=null,n.prevZ=null,Sf(n)}function Sf(a){let e,t=1;do{let i=a,n;a=null;let s=null;for(e=0;i;){e++;let r=i,o=0;for(let c=0;c<t&&(o++,r=r.nextZ,!!r);c++);let l=t;for(;o>0||l>0&&r;)o!==0&&(l===0||!r||i.z<=r.z)?(n=i,i=i.nextZ,o--):(n=r,r=r.nextZ,l--),s?s.nextZ=n:a=n,n.prevZ=s,s=n;i=r}s.nextZ=null,t*=2}while(e>1);return a}function il(a,e,t,i,n){return a=(a-t)*n|0,e=(e-i)*n|0,a=(a|a<<8)&16711935,a=(a|a<<4)&252645135,a=(a|a<<2)&858993459,a=(a|a<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,a|e<<1}function Mf(a){let e=a,t=a;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==a);return t}function $h(a,e,t,i,n,s,r,o){return(n-r)*(e-o)>=(a-r)*(s-o)&&(a-r)*(i-o)>=(t-r)*(e-o)&&(t-r)*(s-o)>=(n-r)*(i-o)}function Ys(a,e,t,i,n,s,r,o){return!(a===r&&e===o)&&$h(a,e,t,i,n,s,r,o)}function yf(a,e){return a.next.i!==e.i&&a.prev.i!==e.i&&!bf(a,e)&&(da(a,e)&&da(e,a)&&wf(a,e)&&(Gt(a.prev,a,e.prev)||Gt(a,e.prev,e))||As(a,e)&&Gt(a.prev,a,a.next)>0&&Gt(e.prev,e,e.next)>0)}function Gt(a,e,t){return(e.y-a.y)*(t.x-e.x)-(e.x-a.x)*(t.y-e.y)}function As(a,e){return a.x===e.x&&a.y===e.y}function qh(a,e,t,i){const n=Xa(Gt(a,e,t)),s=Xa(Gt(a,e,i)),r=Xa(Gt(t,i,a)),o=Xa(Gt(t,i,e));return!!(n!==s&&r!==o||n===0&&Va(a,t,e)||s===0&&Va(a,i,e)||r===0&&Va(t,a,i)||o===0&&Va(t,e,i))}function Va(a,e,t){return e.x<=Math.max(a.x,t.x)&&e.x>=Math.min(a.x,t.x)&&e.y<=Math.max(a.y,t.y)&&e.y>=Math.min(a.y,t.y)}function Xa(a){return a>0?1:a<0?-1:0}function bf(a,e){let t=a;do{if(t.i!==a.i&&t.next.i!==a.i&&t.i!==e.i&&t.next.i!==e.i&&qh(t,t.next,a,e))return!0;t=t.next}while(t!==a);return!1}function da(a,e){return Gt(a.prev,a,a.next)<0?Gt(a,e,a.next)>=0&&Gt(a,a.prev,e)>=0:Gt(a,e,a.prev)<0||Gt(a,a.next,e)<0}function wf(a,e){let t=a,i=!1;const n=(a.x+e.x)/2,s=(a.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&n<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==a);return i}function Yh(a,e){const t=nl(a.i,a.x,a.y),i=nl(e.i,e.x,e.y),n=a.next,s=e.prev;return a.next=e,e.prev=a,t.next=n,n.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Ec(a,e,t,i){const n=nl(a,e,t);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function ua(a){a.next.prev=a.prev,a.prev.next=a.next,a.prevZ&&(a.prevZ.nextZ=a.nextZ),a.nextZ&&(a.nextZ.prevZ=a.prevZ)}function nl(a,e,t){return{i:a,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Tf(a,e,t,i){let n=0;for(let s=e,r=t-i;s<t;s+=i)n+=(a[r]-a[s])*(a[s+1]+a[r+1]),r=s;return n}class Ef{static triangulate(e,t,i=2){return cf(e,t,i)}}class vs{static area(e){const t=e.length;let i=0;for(let n=t-1,s=0;s<t;n=s++)i+=e[n].x*e[s].y-e[s].x*e[n].y;return i*.5}static isClockWise(e){return vs.area(e)<0}static triangulateShape(e,t){const i=[],n=[],s=[];Ac(e),Rc(i,e);let r=e.length;t.forEach(Ac);for(let l=0;l<t.length;l++)n.push(r),r+=t[l].length,Rc(i,t[l]);const o=Ef.triangulate(i,n);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function Ac(a){const e=a.length;e>2&&a[e-1].equals(a[0])&&a.pop()}function Rc(a,e){for(let t=0;t<e.length;t++)a.push(e[t].x),a.push(e[t].y)}class Pr extends Ht{constructor(e=new Nl([new re(.5,.5),new re(-.5,.5),new re(-.5,-.5),new re(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,n=[],s=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];r(c)}this.setAttribute("position",new ot(n,3)),this.setAttribute("uv",new ot(s,2)),this.computeVertexNormals();function r(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const g=t.extrudePath,S=t.UVGenerator!==void 0?t.UVGenerator:Af;let w,_=!1,E,T,v,M;if(g){w=g.getSpacedPoints(h),_=!0,d=!1;const ne=g.isCatmullRomCurve3?g.closed:!1;E=g.computeFrenetFrames(h,ne),T=new C,v=new C,M=new C}d||(p=0,f=0,m=0,x=0);const I=o.extractPoints(c);let R=I.shape;const D=I.holes;if(!vs.isClockWise(R)){R=R.reverse();for(let ne=0,ge=D.length;ne<ge;ne++){const ve=D[ne];vs.isClockWise(ve)&&(D[ne]=ve.reverse())}}function W(ne){const ve=10000000000000001e-36;let Ae=ne[0];for(let Me=1;Me<=ne.length;Me++){const Ze=Me%ne.length,Ue=ne[Ze],ct=Ue.x-Ae.x,dt=Ue.y-Ae.y,vt=ct*ct+dt*dt,F=Math.max(Math.abs(Ue.x),Math.abs(Ue.y),Math.abs(Ae.x),Math.abs(Ae.y)),Bt=ve*F*F;if(vt<=Bt){ne.splice(Ze,1),Me--;continue}Ae=Ue}}W(R),D.forEach(W);const N=D.length,H=R;for(let ne=0;ne<N;ne++){const ge=D[ne];R=R.concat(ge)}function K(ne,ge,ve){return ge||_t("ExtrudeGeometry: vec does not exist"),ne.clone().addScaledVector(ge,ve)}const B=R.length;function le(ne,ge,ve){let Ae,Me,Ze;const Ue=ne.x-ge.x,ct=ne.y-ge.y,dt=ve.x-ne.x,vt=ve.y-ne.y,F=Ue*Ue+ct*ct,Bt=Ue*vt-ct*dt;if(Math.abs(Bt)>Number.EPSILON){const at=Math.sqrt(F),Rt=Math.sqrt(dt*dt+vt*vt),_e=ge.x-ct/at,Ft=ge.y+Ue/at,Ge=ve.x-vt/Rt,qe=ve.y+dt/Rt,A=((Ge-_e)*vt-(qe-Ft)*dt)/(Ue*vt-ct*dt);Ae=_e+Ue*A-ne.x,Me=Ft+ct*A-ne.y;const y=Ae*Ae+Me*Me;if(y<=2)return new re(Ae,Me);Ze=Math.sqrt(y/2)}else{let at=!1;Ue>Number.EPSILON?dt>Number.EPSILON&&(at=!0):Ue<-Number.EPSILON?dt<-Number.EPSILON&&(at=!0):Math.sign(ct)===Math.sign(vt)&&(at=!0),at?(Ae=-ct,Me=Ue,Ze=Math.sqrt(F)):(Ae=Ue,Me=ct,Ze=Math.sqrt(F/2))}return new re(Ae/Ze,Me/Ze)}const q=[];for(let ne=0,ge=H.length,ve=ge-1,Ae=ne+1;ne<ge;ne++,ve++,Ae++)ve===ge&&(ve=0),Ae===ge&&(Ae=0),q[ne]=le(H[ne],H[ve],H[Ae]);const ie=[];let ae,Ce=q.concat();for(let ne=0,ge=N;ne<ge;ne++){const ve=D[ne];ae=[];for(let Ae=0,Me=ve.length,Ze=Me-1,Ue=Ae+1;Ae<Me;Ae++,Ze++,Ue++)Ze===Me&&(Ze=0),Ue===Me&&(Ue=0),ae[Ae]=le(ve[Ae],ve[Ze],ve[Ue]);ie.push(ae),Ce=Ce.concat(ae)}let He;if(p===0)He=vs.triangulateShape(H,D);else{const ne=[],ge=[];for(let ve=0;ve<p;ve++){const Ae=ve/p,Me=f*Math.cos(Ae*Math.PI/2),Ze=m*Math.sin(Ae*Math.PI/2)+x;for(let Ue=0,ct=H.length;Ue<ct;Ue++){const dt=K(H[Ue],q[Ue],Ze);Be(dt.x,dt.y,-Me),Ae===0&&ne.push(dt)}for(let Ue=0,ct=N;Ue<ct;Ue++){const dt=D[Ue];ae=ie[Ue];const vt=[];for(let F=0,Bt=dt.length;F<Bt;F++){const at=K(dt[F],ae[F],Ze);Be(at.x,at.y,-Me),Ae===0&&vt.push(at)}Ae===0&&ge.push(vt)}}He=vs.triangulateShape(ne,ge)}const J=He.length,be=m+x;for(let ne=0;ne<B;ne++){const ge=d?K(R[ne],Ce[ne],be):R[ne];_?(v.copy(E.normals[0]).multiplyScalar(ge.x),T.copy(E.binormals[0]).multiplyScalar(ge.y),M.copy(w[0]).add(v).add(T),Be(M.x,M.y,M.z)):Be(ge.x,ge.y,0)}for(let ne=1;ne<=h;ne++)for(let ge=0;ge<B;ge++){const ve=d?K(R[ge],Ce[ge],be):R[ge];_?(v.copy(E.normals[ne]).multiplyScalar(ve.x),T.copy(E.binormals[ne]).multiplyScalar(ve.y),M.copy(w[ne]).add(v).add(T),Be(M.x,M.y,M.z)):Be(ve.x,ve.y,u/h*ne)}for(let ne=p-1;ne>=0;ne--){const ge=ne/p,ve=f*Math.cos(ge*Math.PI/2),Ae=m*Math.sin(ge*Math.PI/2)+x;for(let Me=0,Ze=H.length;Me<Ze;Me++){const Ue=K(H[Me],q[Me],Ae);Be(Ue.x,Ue.y,u+ve)}for(let Me=0,Ze=D.length;Me<Ze;Me++){const Ue=D[Me];ae=ie[Me];for(let ct=0,dt=Ue.length;ct<dt;ct++){const vt=K(Ue[ct],ae[ct],Ae);_?Be(vt.x,vt.y+w[h-1].y,w[h-1].x+ve):Be(vt.x,vt.y,u+ve)}}}Pe(),Oe();function Pe(){const ne=n.length/3;if(d){let ge=0,ve=B*ge;for(let Ae=0;Ae<J;Ae++){const Me=He[Ae];At(Me[2]+ve,Me[1]+ve,Me[0]+ve)}ge=h+p*2,ve=B*ge;for(let Ae=0;Ae<J;Ae++){const Me=He[Ae];At(Me[0]+ve,Me[1]+ve,Me[2]+ve)}}else{for(let ge=0;ge<J;ge++){const ve=He[ge];At(ve[2],ve[1],ve[0])}for(let ge=0;ge<J;ge++){const ve=He[ge];At(ve[0]+B*h,ve[1]+B*h,ve[2]+B*h)}}i.addGroup(ne,n.length/3-ne,0)}function Oe(){const ne=n.length/3;let ge=0;we(H,ge),ge+=H.length;for(let ve=0,Ae=D.length;ve<Ae;ve++){const Me=D[ve];we(Me,ge),ge+=Me.length}i.addGroup(ne,n.length/3-ne,1)}function we(ne,ge){let ve=ne.length;for(;--ve>=0;){const Ae=ve;let Me=ve-1;Me<0&&(Me=ne.length-1);for(let Ze=0,Ue=h+p*2;Ze<Ue;Ze++){const ct=B*Ze,dt=B*(Ze+1),vt=ge+Ae+ct,F=ge+Me+ct,Bt=ge+Me+dt,at=ge+Ae+dt;We(vt,F,Bt,at)}}}function Be(ne,ge,ve){l.push(ne),l.push(ge),l.push(ve)}function At(ne,ge,ve){it(ne),it(ge),it(ve);const Ae=n.length/3,Me=S.generateTopUV(i,n,Ae-3,Ae-2,Ae-1);lt(Me[0]),lt(Me[1]),lt(Me[2])}function We(ne,ge,ve,Ae){it(ne),it(ge),it(Ae),it(ge),it(ve),it(Ae);const Me=n.length/3,Ze=S.generateSideWallUV(i,n,Me-6,Me-3,Me-2,Me-1);lt(Ze[0]),lt(Ze[1]),lt(Ze[3]),lt(Ze[1]),lt(Ze[2]),lt(Ze[3])}function it(ne){n.push(l[ne*3+0]),n.push(l[ne*3+1]),n.push(l[ne*3+2])}function lt(ne){s.push(ne.x),s.push(ne.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return Rf(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,r=e.shapes.length;s<r;s++){const o=t[e.shapes[s]];i.push(o)}const n=e.options.extrudePath;return n!==void 0&&(e.options.extrudePath=new yr[n.type]().fromJSON(n)),new Pr(i,e.options)}}const Af={generateTopUV:function(a,e,t,i,n){const s=e[t*3],r=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[n*3],h=e[n*3+1];return[new re(s,r),new re(o,l),new re(c,h)]},generateSideWallUV:function(a,e,t,i,n,s){const r=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],h=e[i*3+1],u=e[i*3+2],d=e[n*3],f=e[n*3+1],m=e[n*3+2],x=e[s*3],p=e[s*3+1],g=e[s*3+2];return Math.abs(o-h)<Math.abs(r-c)?[new re(r,1-l),new re(c,1-u),new re(d,1-m),new re(x,1-g)]:[new re(o,1-l),new re(h,1-u),new re(f,1-m),new re(p,1-g)]}};function Rf(a,e,t){if(t.shapes=[],Array.isArray(a))for(let i=0,n=a.length;i<n;i++){const s=a[i];t.shapes.push(s.uuid)}else t.shapes.push(a.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Ir extends Ht{constructor(e=[new re(0,-.5),new re(.5,0),new re(0,.5)],t=12,i=0,n=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:n},t=Math.floor(t),n=st(n,0,Math.PI*2);const s=[],r=[],o=[],l=[],c=[],h=1/t,u=new C,d=new re,f=new C,m=new C,x=new C;let p=0,g=0;for(let S=0;S<=e.length-1;S++)switch(S){case 0:p=e[S+1].x-e[S].x,g=e[S+1].y-e[S].y,f.x=g*1,f.y=-p,f.z=g*0,x.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:x.normalize(),l.push(x.x,x.y,x.z);break;default:p=e[S+1].x-e[S].x,g=e[S+1].y-e[S].y,f.x=g*1,f.y=-p,f.z=g*0,m.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),l.push(f.x,f.y,f.z),x.copy(m)}for(let S=0;S<=t;S++){const w=i+S*h*n,_=Math.sin(w),E=Math.cos(w);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*_,u.y=e[T].y,u.z=e[T].x*E,r.push(u.x,u.y,u.z),d.x=S/t,d.y=T/(e.length-1),o.push(d.x,d.y);const v=l[3*T+0]*_,M=l[3*T+1],I=l[3*T+0]*E;c.push(v,M,I)}}for(let S=0;S<t;S++)for(let w=0;w<e.length-1;w++){const _=w+S*e.length,E=_,T=_+e.length,v=_+e.length+1,M=_+1;s.push(E,T,M),s.push(v,M,T)}this.setIndex(s),this.setAttribute("position",new ot(r,3)),this.setAttribute("uv",new ot(o,2)),this.setAttribute("normal",new ot(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ir(e.points,e.segments,e.phiStart,e.phiLength)}}class Ui extends Ht{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};const s=e/2,r=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,u=e/o,d=t/l,f=[],m=[],x=[],p=[];for(let g=0;g<h;g++){const S=g*d-r;for(let w=0;w<c;w++){const _=w*u-s;m.push(_,-S,0),x.push(0,0,1),p.push(w/o),p.push(1-g/l)}}for(let g=0;g<l;g++)for(let S=0;S<o;S++){const w=S+c*g,_=S+c*(g+1),E=S+1+c*(g+1),T=S+1+c*g;f.push(w,_,T),f.push(_,E,T)}this.setIndex(f),this.setAttribute("position",new ot(m,3)),this.setAttribute("normal",new ot(x,3)),this.setAttribute("uv",new ot(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ui(e.width,e.height,e.widthSegments,e.heightSegments)}}class Rs extends Ht{constructor(e=.5,t=1,i=32,n=1,s=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:r},i=Math.max(3,i),n=Math.max(1,n);const o=[],l=[],c=[],h=[];let u=e;const d=(t-e)/n,f=new C,m=new re;for(let x=0;x<=n;x++){for(let p=0;p<=i;p++){const g=s+p/i*r;f.x=u*Math.cos(g),f.y=u*Math.sin(g),l.push(f.x,f.y,f.z),c.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let x=0;x<n;x++){const p=x*(i+1);for(let g=0;g<i;g++){const S=g+p,w=S,_=S+i+1,E=S+i+2,T=S+1;o.push(w,_,T),o.push(_,E,T)}}this.setIndex(o),this.setAttribute("position",new ot(l,3)),this.setAttribute("normal",new ot(c,3)),this.setAttribute("uv",new ot(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rs(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class nn extends Ht{constructor(e=1,t=32,i=16,n=0,s=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:s,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(r+o,Math.PI);let c=0;const h=[],u=new C,d=new C,f=[],m=[],x=[],p=[];for(let g=0;g<=i;g++){const S=[],w=g/i,_=r+w*o,E=e*Math.cos(_),T=Math.sqrt(e*e-E*E);let v=0;g===0&&r===0?v=.5/t:g===i&&l===Math.PI&&(v=-.5/t);for(let M=0;M<=t;M++){const I=M/t,R=n+I*s;u.x=-T*Math.cos(R),u.y=E,u.z=T*Math.sin(R),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),p.push(I+v,1-w),S.push(c++)}h.push(S)}for(let g=0;g<i;g++)for(let S=0;S<t;S++){const w=h[g][S+1],_=h[g][S],E=h[g+1][S],T=h[g+1][S+1];(g!==0||r>0)&&f.push(w,_,T),(g!==i-1||l<Math.PI)&&f.push(_,E,T)}this.setIndex(f),this.setAttribute("position",new ot(m,3)),this.setAttribute("normal",new ot(x,3)),this.setAttribute("uv",new ot(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nn(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Zn extends Ht{constructor(e=1,t=.4,i=12,n=48,s=Math.PI*2,r=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:n,arc:s,thetaStart:r,thetaLength:o},i=Math.floor(i),n=Math.floor(n);const l=[],c=[],h=[],u=[],d=new C,f=new C,m=new C;for(let x=0;x<=i;x++){const p=r+x/i*o;for(let g=0;g<=n;g++){const S=g/n*s;f.x=(e+t*Math.cos(p))*Math.cos(S),f.y=(e+t*Math.cos(p))*Math.sin(S),f.z=t*Math.sin(p),c.push(f.x,f.y,f.z),d.x=e*Math.cos(S),d.y=e*Math.sin(S),m.subVectors(f,d).normalize(),h.push(m.x,m.y,m.z),u.push(g/n),u.push(x/i)}}for(let x=1;x<=i;x++)for(let p=1;p<=n;p++){const g=(n+1)*x+p-1,S=(n+1)*(x-1)+p-1,w=(n+1)*(x-1)+p,_=(n+1)*x+p;l.push(g,S,_),l.push(S,w,_)}this.setIndex(l),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zn(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}class Ul extends Ht{constructor(e=new Ll(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),t=64,i=1,n=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:n,closed:s};const r=e.computeFrenetFrames(t,s);this.tangents=r.tangents,this.normals=r.normals,this.binormals=r.binormals;const o=new C,l=new C,c=new re;let h=new C;const u=[],d=[],f=[],m=[];x(),this.setIndex(m),this.setAttribute("position",new ot(u,3)),this.setAttribute("normal",new ot(d,3)),this.setAttribute("uv",new ot(f,2));function x(){for(let w=0;w<t;w++)p(w);p(s===!1?t:0),S(),g()}function p(w){h=e.getPointAt(w/t,h);const _=r.normals[w],E=r.binormals[w];for(let T=0;T<=n;T++){const v=T/n*Math.PI*2,M=Math.sin(v),I=-Math.cos(v);l.x=I*_.x+M*E.x,l.y=I*_.y+M*E.y,l.z=I*_.z+M*E.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,u.push(o.x,o.y,o.z)}}function g(){for(let w=1;w<=t;w++)for(let _=1;_<=n;_++){const E=(n+1)*(w-1)+(_-1),T=(n+1)*w+(_-1),v=(n+1)*w+_,M=(n+1)*(w-1)+_;m.push(E,T,M),m.push(T,v,M)}}function S(){for(let w=0;w<=t;w++)for(let _=0;_<=n;_++)c.x=w/t,c.y=_/n,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Ul(new yr[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}function Cs(a){const e={};for(const t in a){e[t]={};for(const i in a[t]){const n=a[t][i];if(Cc(n))n.isRenderTargetTexture?($e("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone();else if(Array.isArray(n))if(Cc(n[0])){const s=[];for(let r=0,o=n.length;r<o;r++)s[r]=n[r].clone();e[t][i]=s}else e[t][i]=n.slice();else e[t][i]=n}}return e}function bi(a){const e={};for(let t=0;t<a.length;t++){const i=Cs(a[t]);for(const n in i)e[n]=i[n]}return e}function Cc(a){return a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)}function Cf(a){const e=[];for(let t=0;t<a.length;t++)e.push(a[t].clone());return e}function Kh(a){const e=a.getRenderTarget();return e===null?a.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:gt.workingColorSpace}const fa={clone:Cs,merge:bi};var Pf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,If=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ti extends jn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pf,this.fragmentShader=If,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Cs(e.uniforms),this.uniformsGroups=Cf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const n in this.uniforms){const r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:"m4",value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const n=e.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=t[n.value]||null;break;case"c":this.uniforms[i].value=new Ke().setHex(n.value);break;case"v2":this.uniforms[i].value=new re().fromArray(n.value);break;case"v3":this.uniforms[i].value=new C().fromArray(n.value);break;case"v4":this.uniforms[i].value=new Xt().fromArray(n.value);break;case"m3":this.uniforms[i].value=new et().fromArray(n.value);break;case"m4":this.uniforms[i].value=new Ct().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Zh extends Ti{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class nt extends jn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mr,this.normalScale=new re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Df extends jn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mr,this.normalScale=new re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=dl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Lf extends jn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Zd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Nf extends jn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Fl extends ft{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Uf extends Fl{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const co=new Ct,Pc=new C,Ic=new C;class Jh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new re(512,512),this.mapType=Ni,this.map=null,this.mapPass=null,this.matrix=new Ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ca,this._frameExtents=new re(1,1),this._viewportCount=1,this._viewports=[new Xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Pc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Pc),Ic.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ic),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,n){co.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(co,e.coordinateSystem,e.reversedDepth);const s=this._frameExtents,r=n?n.z/s.x:1,o=n?n.w/s.y:1,l=n?n.x/s.x:0,c=n?n.y/s.y:0;e.coordinateSystem===oa||e.reversedDepth?t.set(.5*r,0,0,.5*r+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*r,0,0,.5*r+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(co)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const $a=new C,qa=new Un,Zi=new C;class Qh extends ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ct,this.projectionMatrix=new Ct,this.projectionMatrixInverse=new Ct,this.coordinateSystem=Ki,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose($a,qa,Zi),Zi.x===1&&Zi.y===1&&Zi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose($a,qa,Zi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose($a,qa,Zi),Zi.x===1&&Zi.y===1&&Zi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose($a,qa,Zi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Tn=new C,Dc=new re,Lc=new re;class Oi extends Qh{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=la*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(_s*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return la*2*Math.atan(Math.tan(_s*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Tn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Tn.x,Tn.y).multiplyScalar(-e/Tn.z),Tn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Tn.x,Tn.y).multiplyScalar(-e/Tn.z)}getViewSize(e,t){return this.getViewBounds(e,Dc,Lc),t.subVectors(Lc,Dc)}setViewOffset(e,t,i,n,s,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(_s*.5*this.fov)/this.zoom,i=2*t,n=this.aspect*i,s=-.5*n;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;s+=r.offsetX*n/l,t-=r.offsetY*i/c,n*=r.width/l,i*=r.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Ff extends Jh{constructor(){super(new Oi(90,1,.5,500)),this.isPointLightShadow=!0}}class jh extends Fl{constructor(e,t,i=0,n=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new Ff}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ol extends Qh{constructor(e=-1,t=1,i=1,n=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let s=i-e,r=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,r=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Of extends Jh{constructor(){super(new Ol(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Nc extends Fl{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.target=new ft,this.shadow=new Of}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const ds=-90,us=1;class sl extends ft{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new Oi(ds,us,e,t);n.layers=this.layers,this.add(n);const s=new Oi(ds,us,e,t);s.layers=this.layers,this.add(s);const r=new Oi(ds,us,e,t);r.layers=this.layers,this.add(r);const o=new Oi(ds,us,e,t);o.layers=this.layers,this.add(o);const l=new Oi(ds,us,e,t);l.layers=this.layers,this.add(l);const c=new Oi(ds,us,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,n,s,r,o,l]=t;for(const c of t)this.remove(c);if(e===Ki)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===oa)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,r,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,2,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=x,e.setRenderTarget(i,5,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Bf extends Oi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}class kf{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=zf.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function zf(){this._document.hidden===!1&&this.reset()}const Uc=new Ct;class Gf{constructor(e,t,i=0,n=1/0){this.ray=new Cr(e,t),this.near=i,this.far=n,this.camera=null,this.layers=new Rl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):_t("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Uc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Uc),this}intersectObject(e,t=!0,i=[]){return al(e,this,i,t),i.sort(Fc),i}intersectObjects(e,t=!0,i=[]){for(let n=0,s=e.length;n<s;n++)al(e[n],this,i,t);return i.sort(Fc),i}}function Fc(a,e){return a.distance-e.distance}function al(a,e,t,i){let n=!0;if(a.layers.test(e.layers)&&a.raycast(e,t)===!1&&(n=!1),n===!0&&i===!0){const s=a.children;for(let r=0,o=s.length;r<o;r++)al(s[r],e,t,!0)}}class Oc{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=st(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(st(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Hf extends Fn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Bc(a,e,t,i){const n=Wf(i);switch(t){case bh:return a*e;case Ml:return a*e/n.components*n.byteLength;case yl:return a*e/n.components*n.byteLength;case Yn:return a*e*2/n.components*n.byteLength;case bl:return a*e*2/n.components*n.byteLength;case wh:return a*e*3/n.components*n.byteLength;case ji:return a*e*4/n.components*n.byteLength;case wl:return a*e*4/n.components*n.byteLength;case ar:case rr:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*8;case or:case lr:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case Ao:case Co:return Math.max(a,16)*Math.max(e,8)/4;case Eo:case Ro:return Math.max(a,8)*Math.max(e,8)/2;case Po:case Io:case Lo:case No:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*8;case Do:case fr:case Uo:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case Fo:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case Oo:return Math.floor((a+4)/5)*Math.floor((e+3)/4)*16;case Bo:return Math.floor((a+4)/5)*Math.floor((e+4)/5)*16;case ko:return Math.floor((a+5)/6)*Math.floor((e+4)/5)*16;case zo:return Math.floor((a+5)/6)*Math.floor((e+5)/6)*16;case Go:return Math.floor((a+7)/8)*Math.floor((e+4)/5)*16;case Ho:return Math.floor((a+7)/8)*Math.floor((e+5)/6)*16;case Wo:return Math.floor((a+7)/8)*Math.floor((e+7)/8)*16;case Vo:return Math.floor((a+9)/10)*Math.floor((e+4)/5)*16;case Xo:return Math.floor((a+9)/10)*Math.floor((e+5)/6)*16;case $o:return Math.floor((a+9)/10)*Math.floor((e+7)/8)*16;case qo:return Math.floor((a+9)/10)*Math.floor((e+9)/10)*16;case Yo:return Math.floor((a+11)/12)*Math.floor((e+9)/10)*16;case Ko:return Math.floor((a+11)/12)*Math.floor((e+11)/12)*16;case Zo:case Jo:case Qo:return Math.ceil(a/4)*Math.ceil(e/4)*16;case jo:case el:return Math.ceil(a/4)*Math.ceil(e/4)*8;case pr:case tl:return Math.ceil(a/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Wf(a){switch(a){case Ni:case _h:return{byteLength:1,components:1};case ra:case Sh:case Ci:return{byteLength:2,components:1};case _l:case Sl:return{byteLength:2,components:4};case tn:case xl:case Yi:return{byteLength:4,components:1};case Mh:case yh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${a}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:hl}}));typeof window<"u"&&(window.__THREE__?$e("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=hl);function ed(){let a=null,e=!1,t=null,i=null;function n(s,r){i=a.requestAnimationFrame(n),t(s,r)}return{start:function(){e!==!0&&t!==null&&a!==null&&(i=a.requestAnimationFrame(n),e=!0)},stop:function(){a!==null&&a.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){a=s}}}function Vf(a){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=a.createBuffer();a.bindBuffer(l,d),a.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=a.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=a.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=a.HALF_FLOAT:f=a.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=a.SHORT;else if(c instanceof Uint32Array)f=a.UNSIGNED_INT;else if(c instanceof Int32Array)f=a.INT;else if(c instanceof Int8Array)f=a.BYTE;else if(c instanceof Uint8Array)f=a.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=a.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(a.bindBuffer(c,o),u.length===0)a.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){const m=u[d],x=u[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){const x=u[f];a.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(a.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:s,update:r}}var Xf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$f=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,ep=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ip=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,np=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,sp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ap=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,rp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,op=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,dp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,up=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,fp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,pp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,mp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,gp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_p=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Mp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,yp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,bp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,wp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Tp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ep=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ap=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Rp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ip=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Dp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Lp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Np=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Up=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Fp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Op=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Bp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,zp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Gp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Xp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,$p=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,qp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Yp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,e0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,t0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,i0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,n0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,s0=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,a0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,r0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,o0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,l0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,c0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,h0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,d0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,u0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,f0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,p0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,m0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,g0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,v0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,x0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,S0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,M0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,y0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,b0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,w0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,T0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,E0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,A0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,R0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,C0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,P0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,I0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,D0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,L0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,N0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,U0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,F0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,O0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,B0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,k0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,G0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,H0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,W0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const V0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,X0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,q0=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Y0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,K0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,J0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Q0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,j0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,em=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,im=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,am=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,om=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,cm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,dm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,um=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,mm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,_m=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Mm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ym=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,rt={alphahash_fragment:Xf,alphahash_pars_fragment:$f,alphamap_fragment:qf,alphamap_pars_fragment:Yf,alphatest_fragment:Kf,alphatest_pars_fragment:Zf,aomap_fragment:Jf,aomap_pars_fragment:Qf,batching_pars_vertex:jf,batching_vertex:ep,begin_vertex:tp,beginnormal_vertex:ip,bsdfs:np,iridescence_fragment:sp,bumpmap_pars_fragment:ap,clipping_planes_fragment:rp,clipping_planes_pars_fragment:op,clipping_planes_pars_vertex:lp,clipping_planes_vertex:cp,color_fragment:hp,color_pars_fragment:dp,color_pars_vertex:up,color_vertex:fp,common:pp,defaultnormal_vertex:mp,displacementmap_pars_vertex:gp,displacementmap_vertex:vp,emissivemap_fragment:xp,emissivemap_pars_fragment:_p,colorspace_fragment:Sp,colorspace_pars_fragment:Mp,envmap_fragment:yp,envmap_common_pars_fragment:bp,envmap_pars_fragment:wp,envmap_pars_vertex:Tp,envmap_physical_pars_fragment:Fp,envmap_vertex:Ep,fog_vertex:Ap,fog_pars_vertex:Rp,fog_fragment:Cp,fog_pars_fragment:Pp,gradientmap_pars_fragment:Ip,lightmap_pars_fragment:Dp,lights_lambert_fragment:Lp,lights_lambert_pars_fragment:Np,lights_pars_begin:Up,lights_toon_fragment:Op,lights_toon_pars_fragment:Bp,lights_phong_fragment:kp,lights_phong_pars_fragment:zp,lights_physical_fragment:Gp,lights_physical_pars_fragment:Hp,lights_fragment_begin:Wp,lights_fragment_maps:Vp,lights_fragment_end:Xp,lightprobes_pars_fragment:$p,logdepthbuf_fragment:qp,logdepthbuf_pars_fragment:Yp,logdepthbuf_pars_vertex:Kp,logdepthbuf_vertex:Zp,map_fragment:Jp,map_pars_fragment:Qp,map_particle_fragment:jp,map_particle_pars_fragment:e0,metalnessmap_fragment:t0,metalnessmap_pars_fragment:i0,morphinstance_vertex:n0,morphcolor_vertex:s0,morphnormal_vertex:a0,morphtarget_pars_vertex:r0,morphtarget_vertex:o0,normal_fragment_begin:l0,normal_fragment_maps:c0,normal_pars_fragment:h0,normal_pars_vertex:d0,normal_vertex:u0,normalmap_pars_fragment:f0,clearcoat_normal_fragment_begin:p0,clearcoat_normal_fragment_maps:m0,clearcoat_pars_fragment:g0,iridescence_pars_fragment:v0,opaque_fragment:x0,packing:_0,premultiplied_alpha_fragment:S0,project_vertex:M0,dithering_fragment:y0,dithering_pars_fragment:b0,roughnessmap_fragment:w0,roughnessmap_pars_fragment:T0,shadowmap_pars_fragment:E0,shadowmap_pars_vertex:A0,shadowmap_vertex:R0,shadowmask_pars_fragment:C0,skinbase_vertex:P0,skinning_pars_vertex:I0,skinning_vertex:D0,skinnormal_vertex:L0,specularmap_fragment:N0,specularmap_pars_fragment:U0,tonemapping_fragment:F0,tonemapping_pars_fragment:O0,transmission_fragment:B0,transmission_pars_fragment:k0,uv_pars_fragment:z0,uv_pars_vertex:G0,uv_vertex:H0,worldpos_vertex:W0,background_vert:V0,background_frag:X0,backgroundCube_vert:$0,backgroundCube_frag:q0,cube_vert:Y0,cube_frag:K0,depth_vert:Z0,depth_frag:J0,distance_vert:Q0,distance_frag:j0,equirect_vert:em,equirect_frag:tm,linedashed_vert:im,linedashed_frag:nm,meshbasic_vert:sm,meshbasic_frag:am,meshlambert_vert:rm,meshlambert_frag:om,meshmatcap_vert:lm,meshmatcap_frag:cm,meshnormal_vert:hm,meshnormal_frag:dm,meshphong_vert:um,meshphong_frag:fm,meshphysical_vert:pm,meshphysical_frag:mm,meshtoon_vert:gm,meshtoon_frag:vm,points_vert:xm,points_frag:_m,shadow_vert:Sm,shadow_frag:Mm,sprite_vert:ym,sprite_frag:bm},Te={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new et}},envmap:{envMap:{value:null},envMapRotation:{value:new et},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new et},normalScale:{value:new re(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0},uvTransform:{value:new et}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new re(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}}},Qi={basic:{uniforms:bi([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:rt.meshbasic_vert,fragmentShader:rt.meshbasic_frag},lambert:{uniforms:bi([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new Ke(0)},envMapIntensity:{value:1}}]),vertexShader:rt.meshlambert_vert,fragmentShader:rt.meshlambert_frag},phong:{uniforms:bi([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:rt.meshphong_vert,fragmentShader:rt.meshphong_frag},standard:{uniforms:bi([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag},toon:{uniforms:bi([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new Ke(0)}}]),vertexShader:rt.meshtoon_vert,fragmentShader:rt.meshtoon_frag},matcap:{uniforms:bi([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:rt.meshmatcap_vert,fragmentShader:rt.meshmatcap_frag},points:{uniforms:bi([Te.points,Te.fog]),vertexShader:rt.points_vert,fragmentShader:rt.points_frag},dashed:{uniforms:bi([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:rt.linedashed_vert,fragmentShader:rt.linedashed_frag},depth:{uniforms:bi([Te.common,Te.displacementmap]),vertexShader:rt.depth_vert,fragmentShader:rt.depth_frag},normal:{uniforms:bi([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:rt.meshnormal_vert,fragmentShader:rt.meshnormal_frag},sprite:{uniforms:bi([Te.sprite,Te.fog]),vertexShader:rt.sprite_vert,fragmentShader:rt.sprite_frag},background:{uniforms:{uvTransform:{value:new et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:rt.background_vert,fragmentShader:rt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new et}},vertexShader:rt.backgroundCube_vert,fragmentShader:rt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:rt.cube_vert,fragmentShader:rt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:rt.equirect_vert,fragmentShader:rt.equirect_frag},distance:{uniforms:bi([Te.common,Te.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:rt.distance_vert,fragmentShader:rt.distance_frag},shadow:{uniforms:bi([Te.lights,Te.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:rt.shadow_vert,fragmentShader:rt.shadow_frag}};Qi.physical={uniforms:bi([Qi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new et},clearcoatNormalScale:{value:new re(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new et},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new et},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new et},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new et},transmissionSamplerSize:{value:new re},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new et},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new et},anisotropyVector:{value:new re},anisotropyMap:{value:null},anisotropyMapTransform:{value:new et}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag};const Ya={r:0,b:0,g:0},wm=new Ct,td=new et;td.set(-1,0,0,0,1,0,0,0,1);function Tm(a,e,t,i,n,s){const r=new Ke(0);let o=n===!0?0:1,l,c,h=null,u=0,d=null;function f(S){let w=S.isScene===!0?S.background:null;if(w&&w.isTexture){const _=S.backgroundBlurriness>0;w=e.get(w,_)}return w}function m(S){let w=!1;const _=f(S);_===null?p(r,o):_&&_.isColor&&(p(_,1),w=!0);const E=a.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,s):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(a.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),a.clear(a.autoClearColor,a.autoClearDepth,a.autoClearStencil))}function x(S,w){const _=f(w);_&&_.isCubeTexture?(c===void 0&&(c=new V(new Et(1,1,1),new Ti({name:"BackgroundCubeMaterial",uniforms:Cs(Qi.backgroundCube.uniforms),vertexShader:Qi.backgroundCube.vertexShader,fragmentShader:Qi.backgroundCube.fragmentShader,side:Ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,T,v){this.matrixWorld.copyPosition(v.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=_,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(wm.makeRotationFromEuler(w.backgroundRotation)).transpose(),_.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(td),c.material.toneMapped=gt.getTransfer(_.colorSpace)!==Tt,(h!==_||u!==_.version||d!==a.toneMapping)&&(c.material.needsUpdate=!0,h=_,u=_.version,d=a.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new V(new Ui(2,2),new Ti({name:"BackgroundMaterial",uniforms:Cs(Qi.background.uniforms),vertexShader:Qi.background.vertexShader,fragmentShader:Qi.background.fragmentShader,side:qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=gt.getTransfer(_.colorSpace)!==Tt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||u!==_.version||d!==a.toneMapping)&&(l.material.needsUpdate=!0,h=_,u=_.version,d=a.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function p(S,w){S.getRGB(Ya,Kh(a)),t.buffers.color.setClear(Ya.r,Ya.g,Ya.b,w,s)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(S,w=1){r.set(S),o=w,p(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,p(r,o)},render:m,addToRenderList:x,dispose:g}}function Em(a,e){const t=a.getParameter(a.MAX_VERTEX_ATTRIBS),i={},n=d(null);let s=n,r=!1;function o(D,O,W,N,H){let K=!1;const B=u(D,N,W,O);s!==B&&(s=B,c(s.object)),K=f(D,N,W,H),K&&m(D,N,W,H),H!==null&&e.update(H,a.ELEMENT_ARRAY_BUFFER),(K||r)&&(r=!1,_(D,O,W,N),H!==null&&a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return a.createVertexArray()}function c(D){return a.bindVertexArray(D)}function h(D){return a.deleteVertexArray(D)}function u(D,O,W,N){const H=N.wireframe===!0;let K=i[O.id];K===void 0&&(K={},i[O.id]=K);const B=D.isInstancedMesh===!0?D.id:0;let le=K[B];le===void 0&&(le={},K[B]=le);let q=le[W.id];q===void 0&&(q={},le[W.id]=q);let ie=q[H];return ie===void 0&&(ie=d(l()),q[H]=ie),ie}function d(D){const O=[],W=[],N=[];for(let H=0;H<t;H++)O[H]=0,W[H]=0,N[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:W,attributeDivisors:N,object:D,attributes:{},index:null}}function f(D,O,W,N){const H=s.attributes,K=O.attributes;let B=0;const le=W.getAttributes();for(const q in le)if(le[q].location>=0){const ae=H[q];let Ce=K[q];if(Ce===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(Ce=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(Ce=D.instanceColor)),ae===void 0||ae.attribute!==Ce||Ce&&ae.data!==Ce.data)return!0;B++}return s.attributesNum!==B||s.index!==N}function m(D,O,W,N){const H={},K=O.attributes;let B=0;const le=W.getAttributes();for(const q in le)if(le[q].location>=0){let ae=K[q];ae===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(ae=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(ae=D.instanceColor));const Ce={};Ce.attribute=ae,ae&&ae.data&&(Ce.data=ae.data),H[q]=Ce,B++}s.attributes=H,s.attributesNum=B,s.index=N}function x(){const D=s.newAttributes;for(let O=0,W=D.length;O<W;O++)D[O]=0}function p(D){g(D,0)}function g(D,O){const W=s.newAttributes,N=s.enabledAttributes,H=s.attributeDivisors;W[D]=1,N[D]===0&&(a.enableVertexAttribArray(D),N[D]=1),H[D]!==O&&(a.vertexAttribDivisor(D,O),H[D]=O)}function S(){const D=s.newAttributes,O=s.enabledAttributes;for(let W=0,N=O.length;W<N;W++)O[W]!==D[W]&&(a.disableVertexAttribArray(W),O[W]=0)}function w(D,O,W,N,H,K,B){B===!0?a.vertexAttribIPointer(D,O,W,H,K):a.vertexAttribPointer(D,O,W,N,H,K)}function _(D,O,W,N){x();const H=N.attributes,K=W.getAttributes(),B=O.defaultAttributeValues;for(const le in K){const q=K[le];if(q.location>=0){let ie=H[le];if(ie===void 0&&(le==="instanceMatrix"&&D.instanceMatrix&&(ie=D.instanceMatrix),le==="instanceColor"&&D.instanceColor&&(ie=D.instanceColor)),ie!==void 0){const ae=ie.normalized,Ce=ie.itemSize,He=e.get(ie);if(He===void 0)continue;const J=He.buffer,be=He.type,Pe=He.bytesPerElement,Oe=be===a.INT||be===a.UNSIGNED_INT||ie.gpuType===xl;if(ie.isInterleavedBufferAttribute){const we=ie.data,Be=we.isInterleavedBuffer===!0?we.stride:we.itemSize,At=ie.offset;if(we.isInstancedInterleavedBuffer||we.isInstancedBufferAttribute){for(let We=0;We<q.locationSize;We++)g(q.location+We,we.meshPerAttribute);D.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=we.meshPerAttribute*we.count)}else for(let We=0;We<q.locationSize;We++)p(q.location+We);a.bindBuffer(a.ARRAY_BUFFER,J);for(let We=0;We<q.locationSize;We++)w(q.location+We,Ce/q.locationSize,be,ae,Be*Pe,(At+Ce/q.locationSize*We)*Pe,Oe)}else{if(ie.isInstancedBufferAttribute){for(let we=0;we<q.locationSize;we++)g(q.location+we,ie.meshPerAttribute);D.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let we=0;we<q.locationSize;we++)p(q.location+we);a.bindBuffer(a.ARRAY_BUFFER,J);for(let we=0;we<q.locationSize;we++)w(q.location+we,Ce/q.locationSize,be,ae,Ce*Pe,Ce/q.locationSize*we*Pe,Oe)}}else if(B!==void 0){const ae=B[le];if(ae!==void 0)switch(ae.length){case 2:a.vertexAttrib2fv(q.location,ae);break;case 3:a.vertexAttrib3fv(q.location,ae);break;case 4:a.vertexAttrib4fv(q.location,ae);break;default:a.vertexAttrib1fv(q.location,ae)}}}}S()}function E(){I();for(const D in i){const O=i[D];for(const W in O){const N=O[W];for(const H in N){const K=N[H];for(const B in K)h(K[B].object),delete K[B];delete N[H]}}delete i[D]}}function T(D){if(i[D.id]===void 0)return;const O=i[D.id];for(const W in O){const N=O[W];for(const H in N){const K=N[H];for(const B in K)h(K[B].object),delete K[B];delete N[H]}}delete i[D.id]}function v(D){for(const O in i){const W=i[O];for(const N in W){const H=W[N];if(H[D.id]===void 0)continue;const K=H[D.id];for(const B in K)h(K[B].object),delete K[B];delete H[D.id]}}}function M(D){for(const O in i){const W=i[O],N=D.isInstancedMesh===!0?D.id:0,H=W[N];if(H!==void 0){for(const K in H){const B=H[K];for(const le in B)h(B[le].object),delete B[le];delete H[K]}delete W[N],Object.keys(W).length===0&&delete i[O]}}}function I(){R(),r=!0,s!==n&&(s=n,c(s.object))}function R(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:I,resetDefaultState:R,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfObject:M,releaseStatesOfProgram:v,initAttributes:x,enableAttribute:p,disableUnusedAttributes:S}}function Am(a,e,t){let i;function n(l){i=l}function s(l,c){a.drawArrays(i,l,c),t.update(c,i,1)}function r(l,c,h){h!==0&&(a.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,i,1)}this.setMode=n,this.render=s,this.renderInstances=r,this.renderMultiDraw=o}function Rm(a,e,t,i){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const v=e.get("EXT_texture_filter_anisotropic");n=a.getParameter(v.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(v){return!(v!==ji&&i.convert(v)!==a.getParameter(a.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(v){const M=v===Ci&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(v!==Ni&&v!==Yi&&!M&&i.convert(v)!==a.getParameter(a.IMPLEMENTATION_COLOR_READ_TYPE))}function l(v){if(v==="highp"){if(a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).precision>0)return"highp";v="mediump"}return v==="mediump"&&a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&($e("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&$e("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&$e("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const f=a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),m=a.getParameter(a.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=a.getParameter(a.MAX_TEXTURE_SIZE),p=a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE),g=a.getParameter(a.MAX_VERTEX_ATTRIBS),S=a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS),w=a.getParameter(a.MAX_VARYING_VECTORS),_=a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS),E=a.getParameter(a.MAX_SAMPLES),T=a.getParameter(a.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:S,maxVaryings:w,maxFragmentUniforms:_,maxSamples:E,samples:T}}function Cm(a){const e=this;let t=null,i=0,n=!1,s=!1;const r=new un,o=new et,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||n;return n=d,i=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const m=u.clippingPlanes,x=u.clipIntersection,p=u.clipShadows,g=a.get(u);if(!n||m===null||m.length===0||s&&!p)s?h(null):c();else{const S=s?0:i,w=S*4;let _=g.clippingState||null;l.value=_,_=h(m,d,w,f);for(let E=0;E!==w;++E)_[E]=t[E];g.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,d,f,m){const x=u!==null?u.length:0;let p=null;if(x!==0){if(p=l.value,m!==!0||p===null){const g=f+x*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(p===null||p.length<g)&&(p=new Float32Array(g));for(let w=0,_=f;w!==x;++w,_+=4)r.copy(u[w]).applyMatrix4(S,o),r.normal.toArray(p,_),p[_+3]=r.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}class Bl extends Pi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new Bh(n),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new Et(5,5,5),s=new Ti({name:"CubemapFromEquirect",uniforms:Cs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ei,blending:$n});s.uniforms.tEquirect.value=t;const r=new V(n,s),o=t.minFilter;return t.minFilter===Pn&&(t.minFilter=Ri),new sl(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,n=!0){const s=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,n);e.setRenderTarget(s)}}const kc=256,Pm=3,Im=20,id=256,nd=16,Dm=3,Lm=new C,Nm=new Ke;class pa{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new sl(1,10,null),this._boxMesh=new V(new Et(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,n=100,s={}){const{size:r=256,position:o=Lm}=s,l=this._renderer;this._setSize(r);const c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);const u=l.autoClear,d=l.autoClearColor,f=l.autoClearDepth,m=l.autoClearStencil,x=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,x===null&&(e.background=l.getClearColor(Nm));const p=new sl(i,n,h);return p.position.copy(o),p.update(l,e),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=f,l.autoClearStencil=m,e.background=x,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(kc,Ch(e))}_fromTexture(e,t){e.mapping===ws||e.mapping===sa?this._setSize(e.image.length===0?kc:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=zc(e,!1,!1),i=Math.log2(e)-Pm;for(let n=0;n<=i;n++)t.texture.mipmaps.push({width:e>>n,height:e>>n});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=zc(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const n=this._boxMesh,s=this._cubeCamera;n.material=i,s.renderTarget=e,s.activeMipmapLevel=t;const r=e.width>>t;e.viewport.set(0,0,r,r),s.update(this._renderer,n),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===ws||e.mapping===sa?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hc()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Gc()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=Um(),this._integrationMaterial=Fm());const t=this._cubeSize,i=e.texture.mipmaps.length-1,n=this._ggxMaterial.uniforms;n.envMap.value=this._sourceTarget.texture;const s=this._integrationMaterial.uniforms;s.envMap.value=this._sourceTarget.texture,s.sourceLod.value=Math.log2(t/nd);for(let r=0;r<=i;r++){const o=pa.lodToRoughness(r,i);if(r>i-Dm)s.roughness.value=o,this._renderCube(e,r,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(id*Math.pow(o,4)))+.5:0;n.roughness.value=o,n.lodBias.value=l,this._renderCube(e,r,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Om());const i=this._blurMaterial,n=i.uniforms,s=this._sourceTarget;n.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,n.envMap.value=s.texture,this._renderCube(e,0,i),n.envMap.value=e.texture,this._renderCube(s,0,i)}}function zc(a,e,t){return new Bl(a,{minFilter:Pn,generateMipmaps:e,type:Ci,colorSpace:gr,depthBuffer:t})}function ma(a,e,t){return new Ti({name:a,uniforms:e,vertexShader:rt.cube_vert,fragmentShader:t,side:Ei,blending:$n,depthTest:!1,depthWrite:!1})}function Um(){return ma("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${id}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Fm(){return ma("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:nd}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Om(){return ma("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Im}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Gc(){return ma("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Hc(){return ma("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Bm(a){let e=new WeakMap,t=new WeakMap,i=null;function n(d,f=!1){return d==null?null:f?r(d):s(d)}function s(d){if(d&&d.isTexture){const f=d.mapping;if(f===Nr||f===Ur)if(e.has(d)){const m=e.get(d).texture;return o(m,d.mapping)}else{const m=d.image;if(m&&m.height>0){const x=new Bl(m.height);return x.fromEquirectangularTexture(a,d),e.set(d,x),d.addEventListener("dispose",c),o(x.texture,d.mapping)}else return null}}return d}function r(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){const f=d.mapping,m=f===Nr||f===Ur,x=f===ws||f===sa;if(m||x){let p=t.get(d);const g=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return i===null&&(i=new pa(a)),p=m?i.fromEquirectangular(d,p):i.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),p.texture;if(p!==void 0)return p.texture;{const S=d.image;return m&&S&&S.height>0||x&&S&&l(S)?(i===null&&(i=new pa(a)),p=m?i.fromEquirectangular(d):i.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),d.addEventListener("dispose",h),p.texture):null}}}return d}function o(d,f){return f===Nr?d.mapping=ws:f===Ur&&(d.mapping=sa),d}function l(d){let f=0;const m=6;for(let x=0;x<m;x++)d[x]!==void 0&&f++;return f===m}function c(d){const f=d.target;f.removeEventListener("dispose",c);const m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:u}}function km(a){const e={};function t(i){if(e[i]!==void 0)return e[i];const n=a.getExtension(i);return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const n=t(i);return n===null&&cr("WebGLRenderer: "+i+" extension not supported."),n}}}function zm(a,e,t,i){const n={},s=new WeakMap,r=new FinalizationRegistry(m=>delete n[m]);function o(m){l(m.target)}function l(m){m.index!==null&&e.remove(m.index);for(const p in m.attributes)e.remove(m.attributes[p]);m.removeEventListener("dispose",o),delete n[m.id],r.unregister(m);const x=s.get(m);x&&(e.remove(x),s.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function c(m,x){return n[x.id]!==void 0||(x.addEventListener("dispose",o),n[x.id]=new WeakRef(x),r.register(x,x.id,x),t.memory.geometries++),x}function h(m){const x=m.attributes;for(const p in x)e.update(x[p],a.ARRAY_BUFFER)}function u(m){const x=m.index,p=m.attributes.position;let g=0;if(p===void 0)return;const S=x!==null?x.array.length:p.array.length/3-1,w=p.count>=65535?Fh:Uh,_=new w(Math.ceil(S/3)*6,1),E=_.array;if(x!==null){const v=x.array;g=x.version;for(let M=0,I=0;M<S;M+=3){const R=v[M+0],D=v[M+1],O=v[M+2];E[I++]=R,E[I++]=D,E[I++]=D,E[I++]=O,E[I++]=O,E[I++]=R}}else{g=p.version;for(let v=0,M=0;v<S;v+=3){const I=v+0,R=v+1,D=v+2;E[M++]=I,E[M++]=R,E[M++]=R,E[M++]=D,E[M++]=D,E[M++]=I}}_.version=g;const T=s.get(m);T&&e.remove(T),s.set(m,_)}function d(m){const x=s.get(m);if(x){const p=m.index;p!==null&&x.version<p.version&&u(m)}else u(m);return s.get(m)}function f(){for(const m in n){const x=n[m].deref();x!==void 0&&l(x)}}return{get:c,update:h,getWireframeAttribute:d,dispose:f}}function Gm(a,e,t){let i;function n(u){i=u}let s,r;function o(u){s=u.type,r=u.bytesPerElement}function l(u,d){a.drawElements(i,d,s,u*r),t.update(d,i,1)}function c(u,d,f){f!==0&&(a.drawElementsInstanced(i,d,s,u*r,f),t.update(d,i,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,u,0,f);let x=0;for(let p=0;p<f;p++)x+=d[p];t.update(x,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Hm(a){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,r,o){switch(t.calls++,r){case a.TRIANGLES:t.triangles+=o*(s/3);break;case a.LINES:t.lines+=o*(s/2);break;case a.LINE_STRIP:t.lines+=o*(s-1);break;case a.LINE_LOOP:t.lines+=o*s;break;case a.POINTS:t.points+=o*s;break;default:_t("WebGLInfo: Unknown draw mode:",r);break}}function n(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:n,update:i}}function Wm(a,e,t){const i=new WeakMap,n=new Xt;function s(r,o,l){const c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let R=function(){M.dispose(),i.delete(o),o.removeEventListener("dispose",R)};var f=R;d!==void 0&&d.texture.dispose();const m=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let _=0;m===!0&&(_=1),x===!0&&(_=2),p===!0&&(_=3);let E=o.attributes.position.count*_,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const v=new Float32Array(E*T*4*u),M=new Dh(v,E,T,u);M.type=Yi,M.needsUpdate=!0;const I=_*4;for(let D=0;D<u;D++){const O=g[D],W=S[D],N=w[D],H=E*T*4*D;for(let K=0;K<O.count;K++){const B=K*I;m===!0&&(n.fromBufferAttribute(O,K),v[H+B+0]=n.x,v[H+B+1]=n.y,v[H+B+2]=n.z,v[H+B+3]=0),x===!0&&(n.fromBufferAttribute(W,K),v[H+B+4]=n.x,v[H+B+5]=n.y,v[H+B+6]=n.z,v[H+B+7]=0),p===!0&&(n.fromBufferAttribute(N,K),v[H+B+8]=n.x,v[H+B+9]=n.y,v[H+B+10]=n.z,v[H+B+11]=N.itemSize===4?n.w:1)}}d={count:u,texture:M,size:new re(E,T)},i.set(o,d),o.addEventListener("dispose",R)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(a,"morphTexture",r.morphTexture,t);else{let m=0;for(let p=0;p<c.length;p++)m+=c[p];const x=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(a,"morphTargetBaseInfluence",x),l.getUniforms().setValue(a,"morphTargetInfluences",c)}l.getUniforms().setValue(a,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(a,"morphTargetsTextureSize",d.size)}return{update:s}}function Vm(a,e,t,i,n){let s=new WeakMap;function r(c){const h=n.render.frame,u=c.geometry,d=e.get(c,u);if(s.get(d)!==h&&(e.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(t.update(c.instanceMatrix,a.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,a.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return d}function o(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}const Xm={[ul]:"LINEAR_TONE_MAPPING",[fl]:"REINHARD_TONE_MAPPING",[pl]:"CINEON_TONE_MAPPING",[Rr]:"ACES_FILMIC_TONE_MAPPING",[gl]:"AGX_TONE_MAPPING",[vl]:"NEUTRAL_TONE_MAPPING",[ml]:"CUSTOM_TONE_MAPPING"};function $m(a,e,t,i,n,s){const r=new Pi(e,t,{type:a,depthBuffer:n,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new Ht;h.setAttribute("position",new ot([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new ot([0,2,0,0,2,0],2));const u=new Zh({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new V(h,u),f=new Ol(-1,1,1,-1,0,1);let m=null,x=null,p=!1,g,S=null,w=[],_=!1;this.setSize=function(E,T){r.setSize(E,T),o!==null&&o.setSize(E,T),l!==null&&l.setSize(E,T);for(let v=0;v<w.length;v++){const M=w[v];M.setSize&&M.setSize(E,T)}},this.setEffects=function(E){w=E,_=w.length>0&&w[0].isRenderPass===!0;const T=r.width,v=r.height;w.length>0&&o===null&&(o=new Pi(T,v,{type:Ci,depthBuffer:!1,stencilBuffer:!1}),l=new Pi(T,v,{type:Ci,depthBuffer:!1,stencilBuffer:!1}));const M=n===!0&&w.some(I=>I.needsDepthTexture===!0);M!==(r.depthTexture!==null)&&(M===!0&&c===null&&(c=new Es(T,v),s===!0&&(c.format=In,c.type=Ts)),r.dispose(),r.depthTexture=M?c:null,r.resolveDepthBuffer=M,r.storeMultisampledDepthBuffer=M);for(let I=0;I<w.length;I++){const R=w[I];R.setSize&&R.setSize(T,v),M&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(c)}},this.begin=function(E,T){if(p||E.toneMapping===gn&&w.length===0)return!1;if(S=T,T!==null){const v=T.width,M=T.height;(r.width!==v||r.height!==M)&&this.setSize(v,M)}return _===!1&&E.setRenderTarget(r),g=E.toneMapping,E.toneMapping=gn,!0},this.hasRenderPass=function(){return _},this.end=function(E,T){E.toneMapping=g,p=!0;let v=r,M=o;for(let I=0;I<w.length;I++){const R=w[I];R.enabled!==!1&&(R.render(E,M,v,T),R.needsSwap!==!1&&(v=M,M=M===o?l:o))}if(m!==E.outputColorSpace||x!==E.toneMapping){m=E.outputColorSpace,x=E.toneMapping,u.defines={},gt.getTransfer(m)===Tt&&(u.defines.SRGB_TRANSFER="");const I=Xm[x];I&&(u.defines[I]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=v.texture,E.setRenderTarget(S),E.render(d,f),S=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){r.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}const sd=new mi,ad=new Es(1,1),rd=new kh(1),od=new Dh,ld=new Cu,cd=new Bh,Wc=[],Vc=[],Xc=new Float32Array(16),$c=new Float32Array(9),qc=new Float32Array(4);function Ds(a,e,t){const i=a[0];if(i<=0||i>0)return a;const n=e*t;let s=Wc[n];if(s===void 0&&(s=new Float32Array(n),Wc[n]=s),e!==0){i.toArray(s,0);for(let r=1,o=0;r!==e;++r)o+=t,a[r].toArray(s,o)}return s}function ei(a,e){if(a.length!==e.length)return!1;for(let t=0,i=a.length;t<i;t++)if(a[t]!==e[t])return!1;return!0}function ti(a,e){for(let t=0,i=e.length;t<i;t++)a[t]=e[t]}function Dr(a,e){let t=Vc[e];t===void 0&&(t=new Int32Array(e),Vc[e]=t);for(let i=0;i!==e;++i)t[i]=a.allocateTextureUnit();return t}function qm(a,e){const t=this.cache;t[0]!==e&&(a.uniform1f(this.addr,e),t[0]=e)}function Ym(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ei(t,e))return;a.uniform2fv(this.addr,e),ti(t,e)}}function Km(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(a.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ei(t,e))return;a.uniform3fv(this.addr,e),ti(t,e)}}function Zm(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ei(t,e))return;a.uniform4fv(this.addr,e),ti(t,e)}}function Jm(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(ei(t,e))return;a.uniformMatrix2fv(this.addr,!1,e),ti(t,e)}else{if(ei(t,i))return;qc.set(i),a.uniformMatrix2fv(this.addr,!1,qc),ti(t,i)}}function Qm(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(ei(t,e))return;a.uniformMatrix3fv(this.addr,!1,e),ti(t,e)}else{if(ei(t,i))return;$c.set(i),a.uniformMatrix3fv(this.addr,!1,$c),ti(t,i)}}function jm(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(ei(t,e))return;a.uniformMatrix4fv(this.addr,!1,e),ti(t,e)}else{if(ei(t,i))return;Xc.set(i),a.uniformMatrix4fv(this.addr,!1,Xc),ti(t,i)}}function eg(a,e){const t=this.cache;t[0]!==e&&(a.uniform1i(this.addr,e),t[0]=e)}function tg(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ei(t,e))return;a.uniform2iv(this.addr,e),ti(t,e)}}function ig(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ei(t,e))return;a.uniform3iv(this.addr,e),ti(t,e)}}function ng(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ei(t,e))return;a.uniform4iv(this.addr,e),ti(t,e)}}function sg(a,e){const t=this.cache;t[0]!==e&&(a.uniform1ui(this.addr,e),t[0]=e)}function ag(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ei(t,e))return;a.uniform2uiv(this.addr,e),ti(t,e)}}function rg(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ei(t,e))return;a.uniform3uiv(this.addr,e),ti(t,e)}}function og(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ei(t,e))return;a.uniform4uiv(this.addr,e),ti(t,e)}}function Lr(a){return a.version===0&&(a.compareFunction=Ah,a.needsUpdate=!0),a}function lg(a,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n);let s;this.type===a.SAMPLER_2D_SHADOW?s=Lr(ad):s=sd,t.setTexture2D(e||s,n)}function cg(a,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||ld,n)}function hg(a,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n);let s;this.type===a.SAMPLER_CUBE_SHADOW?s=Lr(rd):s=cd,t.setTextureCube(e||s,n)}function dg(a,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||od,n)}function ug(a){switch(a){case 5126:return qm;case 35664:return Ym;case 35665:return Km;case 35666:return Zm;case 35674:return Jm;case 35675:return Qm;case 35676:return jm;case 5124:case 35670:return eg;case 35667:case 35671:return tg;case 35668:case 35672:return ig;case 35669:case 35673:return ng;case 5125:return sg;case 36294:return ag;case 36295:return rg;case 36296:return og;case 35678:case 36198:case 36298:case 36306:case 35682:return lg;case 35679:case 36299:case 36307:return cg;case 35680:case 36300:case 36308:case 36293:return hg;case 36289:case 36303:case 36311:case 36292:return dg}}function fg(a,e){a.uniform1fv(this.addr,e)}function pg(a,e){const t=Ds(e,this.size,2);a.uniform2fv(this.addr,t)}function mg(a,e){const t=Ds(e,this.size,3);a.uniform3fv(this.addr,t)}function gg(a,e){const t=Ds(e,this.size,4);a.uniform4fv(this.addr,t)}function vg(a,e){const t=Ds(e,this.size,4);a.uniformMatrix2fv(this.addr,!1,t)}function xg(a,e){const t=Ds(e,this.size,9);a.uniformMatrix3fv(this.addr,!1,t)}function _g(a,e){const t=Ds(e,this.size,16);a.uniformMatrix4fv(this.addr,!1,t)}function Sg(a,e){a.uniform1iv(this.addr,e)}function Mg(a,e){a.uniform2iv(this.addr,e)}function yg(a,e){a.uniform3iv(this.addr,e)}function bg(a,e){a.uniform4iv(this.addr,e)}function wg(a,e){a.uniform1uiv(this.addr,e)}function Tg(a,e){a.uniform2uiv(this.addr,e)}function Eg(a,e){a.uniform3uiv(this.addr,e)}function Ag(a,e){a.uniform4uiv(this.addr,e)}function Rg(a,e,t){const i=this.cache,n=e.length,s=Dr(t,n);ei(i,s)||(a.uniform1iv(this.addr,s),ti(i,s));let r;this.type===a.SAMPLER_2D_SHADOW?r=Lr(ad):r=sd;for(let o=0;o!==n;++o)t.setTexture2D(e[o]||r,s[o])}function Cg(a,e,t){const i=this.cache,n=e.length,s=Dr(t,n);ei(i,s)||(a.uniform1iv(this.addr,s),ti(i,s));for(let r=0;r!==n;++r)t.setTexture3D(e[r]||ld,s[r])}function Pg(a,e,t){const i=this.cache,n=e.length,s=Dr(t,n);ei(i,s)||(a.uniform1iv(this.addr,s),ti(i,s));let r;this.type===a.SAMPLER_CUBE_SHADOW?r=Lr(rd):r=cd;for(let o=0;o!==n;++o)t.setTextureCube(e[o]||r,s[o])}function Ig(a,e,t){const i=this.cache,n=e.length,s=Dr(t,n);ei(i,s)||(a.uniform1iv(this.addr,s),ti(i,s));for(let r=0;r!==n;++r)t.setTexture2DArray(e[r]||od,s[r])}function Dg(a){switch(a){case 5126:return fg;case 35664:return pg;case 35665:return mg;case 35666:return gg;case 35674:return vg;case 35675:return xg;case 35676:return _g;case 5124:case 35670:return Sg;case 35667:case 35671:return Mg;case 35668:case 35672:return yg;case 35669:case 35673:return bg;case 5125:return wg;case 36294:return Tg;case 36295:return Eg;case 36296:return Ag;case 35678:case 36198:case 36298:case 36306:case 35682:return Rg;case 35679:case 36299:case 36307:return Cg;case 35680:case 36300:case 36308:case 36293:return Pg;case 36289:case 36303:case 36311:case 36292:return Ig}}class Lg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=ug(t.type)}}class Ng{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Dg(t.type)}}class Ug{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const n=this.seq;for(let s=0,r=n.length;s!==r;++s){const o=n[s];o.setValue(e,t[o.id],i)}}}const ho=/(\w+)(\])?(\[|\.)?/g;function Yc(a,e){a.seq.push(e),a.map[e.id]=e}function Fg(a,e,t){const i=a.name,n=i.length;for(ho.lastIndex=0;;){const s=ho.exec(i),r=ho.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===n){Yc(t,c===void 0?new Lg(o,a,e):new Ng(o,a,e));break}else{let u=t.map[o];u===void 0&&(u=new Ug(o),Yc(t,u)),t=u}}}class hr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const o=e.getActiveUniform(t,r),l=e.getUniformLocation(t,o.name);Fg(o,l,this)}const n=[],s=[];for(const r of this.seq)r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW?n.push(r):s.push(r);n.length>0&&(this.seq=n.concat(s))}setValue(e,t,i,n){const s=this.map[t];s!==void 0&&s.setValue(e,i,n)}setOptional(e,t,i){const n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let s=0,r=t.length;s!==r;++s){const o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){const i=[];for(let n=0,s=e.length;n!==s;++n){const r=e[n];r.id in t&&i.push(r)}return i}}function Kc(a,e,t){const i=a.createShader(e);return a.shaderSource(i,t),a.compileShader(i),i}const Og=37297;let Bg=0;function kg(a,e){const t=a.split(`
`),i=[],n=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let r=n;r<s;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const Zc=new et;function zg(a){gt._getMatrix(Zc,gt.workingColorSpace,a);const e=`mat3( ${Zc.elements.map(t=>t.toFixed(4))} )`;switch(gt.getTransfer(a)){case vr:return[e,"LinearTransferOETF"];case Tt:return[e,"sRGBTransferOETF"];default:return $e("WebGLProgram: Unsupported color space: ",a),[e,"LinearTransferOETF"]}}function Jc(a,e,t){const i=a.getShaderParameter(e,a.COMPILE_STATUS),s=(a.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+kg(a.getShaderSource(e),o)}else return s}function Gg(a,e){const t=zg(e);return[`vec4 ${a}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const Hg={[ul]:"Linear",[fl]:"Reinhard",[pl]:"Cineon",[Rr]:"ACESFilmic",[gl]:"AgX",[vl]:"Neutral",[ml]:"Custom"};function Wg(a,e){const t=Hg[e];return t===void 0?($e("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+a+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+a+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ka=new C;function Vg(){gt.getLuminanceCoefficients(Ka);const a=Ka.x.toFixed(4),e=Ka.y.toFixed(4),t=Ka.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${a}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xg(a){return[a.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",a.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ks).join(`
`)}function $g(a){const e=[];for(const t in a){const i=a[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function qg(a,e){const t={},i=a.getProgramParameter(e,a.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const s=a.getActiveAttrib(e,n),r=s.name;let o=1;s.type===a.FLOAT_MAT2&&(o=2),s.type===a.FLOAT_MAT3&&(o=3),s.type===a.FLOAT_MAT4&&(o=4),t[r]={type:s.type,location:a.getAttribLocation(e,r),locationSize:o}}return t}function Ks(a){return a!==""}function Qc(a,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return a.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function jc(a,e){return a.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Yg=/^[ \t]*#include +<([\w\d./]+)>/gm;function rl(a){return a.replace(Yg,Kg)}function Kg(a,e){const t=rt[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return rl(t)}const Zg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function eh(a){return a.replace(Zg,Jg)}function Jg(a,e,t,i){let n="";for(let s=parseInt(e);s<parseInt(t);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function th(a){let e=`precision ${a.precision} float;
	precision ${a.precision} int;
	precision ${a.precision} sampler2D;
	precision ${a.precision} samplerCube;
	precision ${a.precision} sampler3D;
	precision ${a.precision} sampler2DArray;
	precision ${a.precision} sampler2DShadow;
	precision ${a.precision} samplerCubeShadow;
	precision ${a.precision} sampler2DArrayShadow;
	precision ${a.precision} isampler2D;
	precision ${a.precision} isampler3D;
	precision ${a.precision} isamplerCube;
	precision ${a.precision} isampler2DArray;
	precision ${a.precision} usampler2D;
	precision ${a.precision} usampler3D;
	precision ${a.precision} usamplerCube;
	precision ${a.precision} usampler2DArray;
	`;return a.precision==="highp"?e+=`
#define HIGH_PRECISION`:a.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:a.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Qg={[Zs]:"SHADOWMAP_TYPE_PCF",[qs]:"SHADOWMAP_TYPE_VSM"};function jg(a){return Qg[a.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const ev={[sa]:"ENVMAP_MODE_REFRACTION"};function tv(a){return a.envMap===!1?"ENVMAP_MODE_REFLECTION":ev[a.envMapMode]||"ENVMAP_MODE_REFLECTION"}const iv={[dl]:"ENVMAP_BLENDING_MULTIPLY",[qd]:"ENVMAP_BLENDING_MIX",[Yd]:"ENVMAP_BLENDING_ADD"};function nv(a){return a.envMap===!1?"ENVMAP_BLENDING_NONE":iv[a.combine]||"ENVMAP_BLENDING_NONE"}function sv(a,e,t,i){const n=a.getContext(),s=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=jg(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=tv(t),u=nv(t),d=Xg(t),f=$g(s),m=n.createProgram();let x,p,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(Ks).join(`
`),x.length>0&&(x+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(Ks).join(`
`),p.length>0&&(p+=`
`)):(x=[th(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ks).join(`
`),p=[th(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==gn?"#define TONE_MAPPING":"",t.toneMapping!==gn?rt.tonemapping_pars_fragment:"",t.toneMapping!==gn?Wg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",rt.colorspace_pars_fragment,Gg("linearToOutputTexel",t.outputColorSpace),Vg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ks).join(`
`)),r=rl(r),r=Qc(r,t),r=jc(r,t),o=rl(o),o=Qc(o,t),o=jc(o,t),r=eh(r),o=eh(o),t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,x=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,p=["#define varying in",t.glslVersion===Zl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Zl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=g+x+r,w=g+p+o,_=Kc(n,n.VERTEX_SHADER,S),E=Kc(n,n.FRAGMENT_SHADER,w);n.attachShader(m,_),n.attachShader(m,E),t.index0AttributeName!==void 0?n.bindAttribLocation(m,0,t.index0AttributeName):t.hasPositionAttribute===!0&&n.bindAttribLocation(m,0,"position"),n.linkProgram(m);function T(R){if(a.debug.checkShaderErrors){const D=n.getProgramInfoLog(m)||"",O=n.getShaderInfoLog(_)||"",W=n.getShaderInfoLog(E)||"",N=D.trim(),H=O.trim(),K=W.trim();let B=!0,le=!0;if(n.getProgramParameter(m,n.LINK_STATUS)===!1)if(B=!1,typeof a.debug.onShaderError=="function")a.debug.onShaderError(n,m,_,E);else{const q=Jc(n,_,"vertex"),ie=Jc(n,E,"fragment");_t("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(m,n.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+N+`
`+q+`
`+ie)}else N!==""?$e("WebGLProgram: Program Info Log:",N):(H===""||K==="")&&(le=!1);le&&(R.diagnostics={runnable:B,programLog:N,vertexShader:{log:H,prefix:x},fragmentShader:{log:K,prefix:p}})}n.deleteShader(_),n.deleteShader(E),v=new hr(n,m),M=qg(n,m)}let v;this.getUniforms=function(){return v===void 0&&T(this),v};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=n.getProgramParameter(m,Og)),I},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Bg++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=_,this.fragmentShader=E,this}let av=0;class rv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const n=this._getShaderCacheForMaterial(e);return n.has(t)===!1&&(n.add(t),t.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new ov(e),t.set(e,i)),i}}class ov{constructor(e){this.id=av++,this.code=e,this.usedTimes=0}}function lv(a){return a===Yn||a===fr||a===pr}function cv(a,e,t,i,n,s){const r=new Rl,o=new rv,l=new Set,c=[],h=new Map,u=i.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(v){return l.add(v),v===0?"uv":`uv${v}`}function m(v,M,I,R,D,O){const W=R.fog,N=D.geometry,H=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?R.environment:null,K=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,B=e.get(v.envMap||H,K),le=d[v.type];let q=i.precision;v.precision!==null&&(q=i.getMaxPrecision(v.precision),q!==v.precision&&$e("WebGLProgram.getParameters:",v.precision,"not supported, using",q,"instead."));const ie=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,ae=ie!==void 0?ie.length:0;let Ce=0;N.morphAttributes.position!==void 0&&(Ce=1),N.morphAttributes.normal!==void 0&&(Ce=2),N.morphAttributes.color!==void 0&&(Ce=3);let He,J,be,Pe;if(le){const Q=Qi[le];He=Q.vertexShader,J=Q.fragmentShader}else{He=v.vertexShader,J=v.fragmentShader;const Q=o.getVertexShaderStage(v),Re=o.getFragmentShaderStage(v);o.update(v,Q,Re),be=Q.id,Pe=Re.id}const Oe=a.getRenderTarget(),we=a.state.buffers.depth.getReversed(),Be=D.isInstancedMesh===!0,At=D.isBatchedMesh===!0,We=!!v.map,it=!!v.matcap,lt=!!B,ne=lt&&B.isPMREMTexture===!0,ge=!!v.aoMap,ve=!!v.lightMap,Ae=!!v.bumpMap&&v.wireframe===!1,Me=!!v.normalMap,Ze=!!v.displacementMap,Ue=!!v.emissiveMap,ct=!!v.metalnessMap,dt=!!v.roughnessMap,vt=v.anisotropy>0,F=v.clearcoat>0,Bt=v.diffuseRoughness>0,at=v.dispersion>0,Rt=v.retroreflectivity>0,_e=v.iridescence>0,Ft=v.sheen>0,Ge=v.transmission>0,qe=vt&&!!v.anisotropyMap,A=F&&!!v.clearcoatMap,y=F&&!!v.clearcoatNormalMap,k=F&&!!v.clearcoatRoughnessMap,se=Bt&&!!v.diffuseRoughnessMap,te=_e&&!!v.iridescenceMap,ue=_e&&!!v.iridescenceThicknessMap,xe=Ft&&!!v.sheenColorMap,Z=Ft&&!!v.sheenRoughnessMap,ee=!!v.specularMap,pe=!!v.specularColorMap,P=!!v.specularIntensityMap,j=Ge&&!!v.transmissionMap,Y=Ge&&!!v.thicknessMap,fe=!!v.gradientMap,de=!!v.alphaMap,me=v.alphaTest>0,De=!!v.alphaHash,je=!!v.extensions;let ce=gn;v.toneMapped&&(Oe===null||Oe.isXRRenderTarget===!0)&&(ce=a.toneMapping);const ze=ne?B.isCompressedCubeTexture?B.image[0].mipmaps:B.mipmaps:null,Je={shaderID:le,shaderType:v.type,shaderName:v.name,vertexShader:He,fragmentShader:J,defines:v.defines,customVertexShaderID:be,customFragmentShaderID:Pe,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:q,batching:At,batchingColor:At&&D._colorsTexture!==null,instancing:Be,instancingColor:Be&&D.instanceColor!==null,instancingMorph:Be&&D.morphTexture!==null,outputColorSpace:Oe===null?a.outputColorSpace:Oe.isXRRenderTarget===!0?Oe.texture.colorSpace:gt.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:We,matcap:it,envMap:lt,envMapMode:lt&&B.mapping,envMapPMREM:ne,envMapMaxLod:ne?ze.length-1:null,envMapSize:ne?ze[0].width:null,aoMap:ge,lightMap:ve,bumpMap:Ae,normalMap:Me,displacementMap:Ze,emissiveMap:Ue,normalMapObjectSpace:Me&&v.normalMapType===Jd,normalMapTangentSpace:Me&&v.normalMapType===mr,packedNormalMap:Me&&v.normalMapType===mr&&lv(v.normalMap.format),metalnessMap:ct,roughnessMap:dt,anisotropy:vt,anisotropyMap:qe,clearcoat:F,clearcoatMap:A,clearcoatNormalMap:y,clearcoatRoughnessMap:k,diffuseRoughness:Bt,diffuseRoughnessMap:se,dispersion:at,retroreflection:Rt,iridescence:_e,iridescenceMap:te,iridescenceThicknessMap:ue,sheen:Ft,sheenColorMap:xe,sheenRoughnessMap:Z,specularMap:ee,specularColorMap:pe,specularIntensityMap:P,transmission:Ge,transmissionMap:j,thicknessMap:Y,gradientMap:fe,opaque:v.transparent===!1&&v.blending===xs&&v.alphaToCoverage===!1,alphaMap:de,alphaTest:me,alphaHash:De,combine:v.combine,mapUv:We&&f(v.map.channel),aoMapUv:ge&&f(v.aoMap.channel),lightMapUv:ve&&f(v.lightMap.channel),bumpMapUv:Ae&&f(v.bumpMap.channel),normalMapUv:Me&&f(v.normalMap.channel),displacementMapUv:Ze&&f(v.displacementMap.channel),emissiveMapUv:Ue&&f(v.emissiveMap.channel),metalnessMapUv:ct&&f(v.metalnessMap.channel),roughnessMapUv:dt&&f(v.roughnessMap.channel),anisotropyMapUv:qe&&f(v.anisotropyMap.channel),clearcoatMapUv:A&&f(v.clearcoatMap.channel),clearcoatNormalMapUv:y&&f(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:k&&f(v.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:se&&f(v.diffuseRoughnessMap.channel),iridescenceMapUv:te&&f(v.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&f(v.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&f(v.sheenColorMap.channel),sheenRoughnessMapUv:Z&&f(v.sheenRoughnessMap.channel),specularMapUv:ee&&f(v.specularMap.channel),specularColorMapUv:pe&&f(v.specularColorMap.channel),specularIntensityMapUv:P&&f(v.specularIntensityMap.channel),transmissionMapUv:j&&f(v.transmissionMap.channel),thicknessMapUv:Y&&f(v.thicknessMap.channel),alphaMapUv:de&&f(v.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(Me||vt),vertexNormals:!!N.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!N.attributes.uv&&(We||de),fog:!!W,useFog:v.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||N.attributes.normal===void 0&&Me===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:we,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:N.attributes.position!==void 0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:Ce,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:O.filter(Q=>Q.texture!==null).length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:v.dithering,shadowMapEnabled:a.shadowMap.enabled&&I.length>0,shadowMapType:a.shadowMap.type,toneMapping:ce,decodeVideoTexture:We&&v.map.isVideoTexture===!0&&gt.getTransfer(v.map.colorSpace)===Tt,decodeVideoTextureEmissive:Ue&&v.emissiveMap.isVideoTexture===!0&&gt.getTransfer(v.emissiveMap.colorSpace)===Tt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Ot,flipSided:v.side===Ei,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:je&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(je&&v.extensions.multiDraw===!0||At)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Je.vertexUv1s=l.has(1),Je.vertexUv2s=l.has(2),Je.vertexUv3s=l.has(3),l.clear(),Je}function x(v){const M=[];if(v.shaderID?M.push(v.shaderID):(M.push(v.customVertexShaderID),M.push(v.customFragmentShaderID)),v.defines!==void 0)for(const I in v.defines)M.push(I),M.push(v.defines[I]);return v.isRawShaderMaterial===!1&&(p(M,v),g(M,v),M.push(a.outputColorSpace)),M.push(v.customProgramCacheKey),M.join()}function p(v,M){v.push(M.precision),v.push(M.outputColorSpace),v.push(M.envMapMode),v.push(M.envMapPMREM),v.push(M.envMapMaxLod),v.push(M.envMapSize),v.push(M.mapUv),v.push(M.alphaMapUv),v.push(M.lightMapUv),v.push(M.aoMapUv),v.push(M.bumpMapUv),v.push(M.normalMapUv),v.push(M.displacementMapUv),v.push(M.emissiveMapUv),v.push(M.metalnessMapUv),v.push(M.roughnessMapUv),v.push(M.anisotropyMapUv),v.push(M.clearcoatMapUv),v.push(M.clearcoatNormalMapUv),v.push(M.clearcoatRoughnessMapUv),v.push(M.diffuseRoughnessMapUv),v.push(M.iridescenceMapUv),v.push(M.iridescenceThicknessMapUv),v.push(M.sheenColorMapUv),v.push(M.sheenRoughnessMapUv),v.push(M.specularMapUv),v.push(M.specularColorMapUv),v.push(M.specularIntensityMapUv),v.push(M.transmissionMapUv),v.push(M.thicknessMapUv),v.push(M.combine),v.push(M.fogExp2),v.push(M.sizeAttenuation),v.push(M.morphTargetsCount),v.push(M.numSunLights),v.push(M.numDirLights),v.push(M.numPointLights),v.push(M.numSpotLights),v.push(M.numSpotLightMaps),v.push(M.numHemiLights),v.push(M.numRectAreaLights),v.push(M.numSunLightShadows),v.push(M.numDirLightShadows),v.push(M.numPointLightShadows),v.push(M.numSpotLightShadows),v.push(M.numSpotLightShadowsWithMaps),v.push(M.numLightProbes),v.push(M.numLightProbeGrids),v.push(M.shadowMapType),v.push(M.toneMapping),v.push(M.numClippingPlanes),v.push(M.numClipIntersection),v.push(M.depthPacking)}function g(v,M){r.disableAll(),M.instancing&&r.enable(0),M.instancingColor&&r.enable(1),M.instancingMorph&&r.enable(2),M.matcap&&r.enable(3),M.envMap&&r.enable(4),M.normalMapObjectSpace&&r.enable(5),M.normalMapTangentSpace&&r.enable(6),M.clearcoat&&r.enable(7),M.iridescence&&r.enable(8),M.alphaTest&&r.enable(9),M.vertexColors&&r.enable(10),M.vertexAlphas&&r.enable(11),M.vertexUv1s&&r.enable(12),M.vertexUv2s&&r.enable(13),M.vertexUv3s&&r.enable(14),M.vertexTangents&&r.enable(15),M.anisotropy&&r.enable(16),M.alphaHash&&r.enable(17),M.batching&&r.enable(18),M.dispersion&&r.enable(19),M.retroreflection&&r.enable(24),M.diffuseRoughness&&r.enable(25),M.batchingColor&&r.enable(20),M.gradientMap&&r.enable(21),M.packedNormalMap&&r.enable(22),M.vertexNormals&&r.enable(23),v.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reversedDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),M.numLightProbeGrids>0&&r.enable(22),M.hasPositionAttribute&&r.enable(23),v.push(r.mask)}function S(v){const M=d[v.type];let I;if(M){const R=Qi[M];I=fa.clone(R.uniforms)}else I=v.uniforms;return I}function w(v,M){let I=h.get(M);return I!==void 0?++I.usedTimes:(I=new sv(a,M,v,n),c.push(I),h.set(M,I)),I}function _(v){if(--v.usedTimes===0){const M=c.indexOf(v);c[M]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function E(v){o.remove(v)}function T(){o.dispose()}return{getParameters:m,getProgramCacheKey:x,getUniforms:S,acquireProgram:w,releaseProgram:_,releaseShaderCache:E,programs:c,dispose:T}}function hv(){let a=new WeakMap;function e(r){return a.has(r)}function t(r){let o=a.get(r);return o===void 0&&(o={},a.set(r,o)),o}function i(r){a.delete(r)}function n(r,o,l){a.get(r)[o]=l}function s(){a=new WeakMap}return{has:e,get:t,remove:i,update:n,dispose:s}}function dv(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.material.id!==e.material.id?a.material.id-e.material.id:a.materialVariant!==e.materialVariant?a.materialVariant-e.materialVariant:a.z!==e.z?a.z-e.z:a.id-e.id}function ih(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.z!==e.z?e.z-a.z:a.id-e.id}function nh(){const a=[];let e=0;const t=[],i=[],n=[];function s(){e=0,t.length=0,i.length=0,n.length=0}function r(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,m,x,p,g){let S=a[e];return S===void 0?(S={id:d.id,object:d,geometry:f,material:m,materialVariant:r(d),groupOrder:x,renderOrder:d.renderOrder,z:p,group:g},a[e]=S):(S.id=d.id,S.object=d,S.geometry=f,S.material=m,S.materialVariant=r(d),S.groupOrder=x,S.renderOrder=d.renderOrder,S.z=p,S.group=g),e++,S}function l(d,f,m,x,p,g,S){S.reversedDepth===!0&&(p=-p);const w=o(d,f,m,x,p,g);m.transmission>0?i.push(w):m.transparent===!0?n.push(w):t.push(w)}function c(d,f,m,x,p,g){const S=o(d,f,m,x,p,g);m.transmission>0?i.unshift(S):m.transparent===!0?n.unshift(S):t.unshift(S)}function h(d,f){t.length>1&&t.sort(d||dv),i.length>1&&i.sort(f||ih),n.length>1&&n.sort(f||ih)}function u(){for(let d=e,f=a.length;d<f;d++){const m=a[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:n,init:s,push:l,unshift:c,finish:u,sort:h}}function uv(){let a=new WeakMap;function e(i,n){const s=a.get(i);let r;return s===void 0?(r=new nh,a.set(i,[r])):n>=s.length?(r=new nh,s.push(r)):r=s[n],r}function t(){a=new WeakMap}return{get:e,dispose:t}}function fv(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new C,color:new Ke};break;case"SpotLight":t={position:new C,direction:new C,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new C,halfWidth:new C,halfHeight:new C};break}return a[e.id]=t,t}}}function pv(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re,shadowCameraNear:1,shadowCameraFar:1e3};break}return a[e.id]=t,t}}}let mv=0;function gv(a,e){return(e.castShadow?2:0)-(a.castShadow?2:0)+(e.map?1:0)-(a.map?1:0)}function vv(a){const e=new fv,t=pv(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new C);const n=new C,s=new Ct,r=new Ct;function o(c){let h=0,u=0,d=0;for(let O=0;O<9;O++)i.probe[O].set(0,0,0);let f=0,m=0,x=0,p=0,g=0,S=0,w=0,_=0,E=0,T=0,v=0,M=0,I=0,R=0;c.sort(gv);for(let O=0,W=c.length;O<W;O++){const N=c[O],H=N.color,K=N.intensity,B=N.distance;let le=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===Yn?le=N.shadow.map.texture:le=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)h+=H.r*K,u+=H.g*K,d+=H.b*K;else if(N.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(N.sh.coefficients[q],K);R++}else if(N.isSunLight){const q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){const ie=N.shadow,ae=t.get(N);ae.shadowIntensity=ie.intensity,ae.shadowBias=ie.bias,ae.shadowNormalBias=ie.normalBias,ae.shadowRadius=ie.radius,ae.shadowMapSize.copy(ie.mapSize).multiply(ie.getFrameExtents()),i.sunShadow[m]=ae,i.sunShadowMap[m]=le;const Ce=ie.getViewportCount();for(let He=0;He<Ce;He++)i.sunShadowMatrix[x+He]=ie.getMatrix(He),i.sunShadowCascade[x+He]=ie._cascadeData[He];x+=Ce,m++}i.sun[f]=q,f++}else if(N.isDirectionalLight){const q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){const ie=N.shadow,ae=t.get(N);ae.shadowIntensity=ie.intensity,ae.shadowBias=ie.bias,ae.shadowNormalBias=ie.normalBias,ae.shadowRadius=ie.radius,ae.shadowMapSize=ie.mapSize,i.directionalShadow[p]=ae,i.directionalShadowMap[p]=le,i.directionalShadowMatrix[p]=N.shadow.matrix,E++}i.directional[p]=q,p++}else if(N.isSpotLight){const q=e.get(N);q.position.setFromMatrixPosition(N.matrixWorld),q.color.copy(H).multiplyScalar(K),q.distance=B,q.coneCos=Math.cos(N.angle),q.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),q.decay=N.decay,i.spot[S]=q;const ie=N.shadow;if(N.map&&(i.spotLightMap[M]=N.map,M++,ie.updateMatrices(N),N.castShadow&&I++),i.spotLightMatrix[S]=ie.matrix,N.castShadow){const ae=t.get(N);ae.shadowIntensity=ie.intensity,ae.shadowBias=ie.bias,ae.shadowNormalBias=ie.normalBias,ae.shadowRadius=ie.radius,ae.shadowMapSize=ie.mapSize,i.spotShadow[S]=ae,i.spotShadowMap[S]=le,v++}S++}else if(N.isRectAreaLight){const q=e.get(N);q.color.copy(H).multiplyScalar(K),q.halfWidth.set(N.width*.5,0,0),q.halfHeight.set(0,N.height*.5,0),i.rectArea[w]=q,w++}else if(N.isPointLight){const q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),q.distance=N.distance,q.decay=N.decay,N.castShadow){const ie=N.shadow,ae=t.get(N);ae.shadowIntensity=ie.intensity,ae.shadowBias=ie.bias,ae.shadowNormalBias=ie.normalBias,ae.shadowRadius=ie.radius,ae.shadowMapSize=ie.mapSize,ae.shadowCameraNear=ie.camera.near,ae.shadowCameraFar=ie.camera.far,i.pointShadow[g]=ae,i.pointShadowMap[g]=le,i.pointShadowMatrix[g]=N.shadow.matrix,T++}i.point[g]=q,g++}else if(N.isHemisphereLight){const q=e.get(N);q.skyColor.copy(N.color).multiplyScalar(K),q.groundColor.copy(N.groundColor).multiplyScalar(K),i.hemi[_]=q,_++}}w>0&&(a.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Te.LTC_FLOAT_1,i.rectAreaLTC2=Te.LTC_FLOAT_2):(i.rectAreaLTC1=Te.LTC_HALF_1,i.rectAreaLTC2=Te.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const D=i.hash;(D.sunLength!==f||D.directionalLength!==p||D.pointLength!==g||D.spotLength!==S||D.rectAreaLength!==w||D.hemiLength!==_||D.numSunShadows!==m||D.numDirectionalShadows!==E||D.numPointShadows!==T||D.numSpotShadows!==v||D.numSpotMaps!==M||D.numLightProbes!==R)&&(i.sun.length=f,i.directional.length=p,i.spot.length=S,i.rectArea.length=w,i.point.length=g,i.hemi.length=_,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.directionalShadowMatrix.length=E,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=v,i.spotShadowMap.length=v,i.spotLightMatrix.length=v+M-I,i.spotLightMap.length=M,i.numSpotLightShadowsWithMaps=I,i.numLightProbes=R,D.sunLength=f,D.directionalLength=p,D.pointLength=g,D.spotLength=S,D.rectAreaLength=w,D.hemiLength=_,D.numSunShadows=m,D.numDirectionalShadows=E,D.numPointShadows=T,D.numSpotShadows=v,D.numSpotMaps=M,D.numLightProbes=R,i.version=mv++)}function l(c,h){let u=0,d=0,f=0,m=0,x=0,p=0;const g=h.matrixWorldInverse;for(let S=0,w=c.length;S<w;S++){const _=c[S];if(_.isSunLight){const E=i.sun[u];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(g),u++}else if(_.isDirectionalLight){const E=i.directional[d];E.direction.setFromMatrixPosition(_.matrixWorld),n.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(n),E.direction.transformDirection(g),d++}else if(_.isSpotLight){const E=i.spot[m];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(g),E.direction.setFromMatrixPosition(_.matrixWorld),n.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(n),E.direction.transformDirection(g),m++}else if(_.isRectAreaLight){const E=i.rectArea[x];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(g),r.identity(),s.copy(_.matrixWorld),s.premultiply(g),r.extractRotation(s),E.halfWidth.set(_.width*.5,0,0),E.halfHeight.set(0,_.height*.5,0),E.halfWidth.applyMatrix4(r),E.halfHeight.applyMatrix4(r),x++}else if(_.isPointLight){const E=i.point[f];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(g),f++}else if(_.isHemisphereLight){const E=i.hemi[p];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(g),p++}}}return{setup:o,setupView:l,state:i}}function sh(a){const e=new vv(a),t=[],i=[],n=[];function s(u){h.camera=u,t.length=0,i.length=0,n.length=0}function r(u){u.isLightProbeGrid?n.push(u):t.push(u)}function o(u){i.push(u)}function l(){e.setup(t),n.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function c(u){e.setupView(t,u)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:h,setupLights:l,setupLightsView:c,pushLight:r,pushShadow:o}}function xv(a){let e=new WeakMap;function t(n,s=0){const r=e.get(n);let o;return r===void 0?(o=new sh(a),e.set(n,[o])):s>=r.length?(o=new sh(a),r.push(o)):o=r[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const _v=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Sv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Mv=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],yv=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],ah=new Ct,Xs=new C,uo=new C;function bv(a,e,t){let i=new ca;const n=new re,s=new re,r=new Xt,o=new Lf,l=new Nf,c={},h=t.maxTextureSize,u={[qn]:Ei,[Ei]:qn,[Ot]:Ot},d=new Ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new re},radius:{value:4}},vertexShader:_v,fragmentShader:Sv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new Ht;m.setAttribute("position",new Ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new V(m,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Zs;let g=this.type;this.render=function(T,v,M){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;this.type===Rd&&($e("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Zs);const I=a.getRenderTarget(),R=a.getActiveCubeFace(),D=a.getActiveMipmapLevel(),O=a.state;O.setBlending($n),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const W=g!==this.type;W&&v.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(H=>H.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,H=T.length;N<H;N++){const K=T[N],B=K.shadow;if(B===void 0){$e("WebGLShadowMap:",K,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;n.copy(B.mapSize);const le=B.getFrameExtents();n.multiply(le),s.copy(B.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(s.x=Math.floor(h/le.x),n.x=s.x*le.x,B.mapSize.x=s.x),n.y>h&&(s.y=Math.floor(h/le.y),n.y=s.y*le.y,B.mapSize.y=s.y));const q=a.state.buffers.depth.getReversed();if(B.camera._reversedDepth=q,B.map===null||W===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===qs){if(K.isPointLight){$e("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Pi(n.x,n.y,{format:Yn,type:Ci,minFilter:Ri,magFilter:Ri,generateMipmaps:!1}),B.map.texture.name=K.name+".shadowMap",B.map.depthTexture=new Es(n.x,n.y,Yi),B.map.depthTexture.name=K.name+".shadowMapDepth",B.map.depthTexture.format=Nn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=ci,B.map.depthTexture.magFilter=ci}else K.isPointLight?(B.map=new Bl(n.x),B.map.depthTexture=new kh(n.x,tn)):(B.map=new Pi(n.x,n.y),B.map.depthTexture=new Es(n.x,n.y,tn)),B.map.depthTexture.name=K.name+".shadowMap",B.map.depthTexture.format=Nn,this.type===Zs?(B.map.depthTexture.compareFunction=q?Eh:Th,B.map.depthTexture.minFilter=Ri,B.map.depthTexture.magFilter=Ri):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=ci,B.map.depthTexture.magFilter=ci);B.camera.updateProjectionMatrix()}B.map.isWebGLCubeRenderTarget!==!0&&(B.map.width!==n.x||B.map.height!==n.y)&&B.map.setSize(n.x,n.y);const ie=B.map.isWebGLCubeRenderTarget?6:B.getViewportCount();K.isPointLight!==!0&&B.updateMatrices(K,M);const ae=(B.camera.layers.mask&4294967294)!==0?B.camera.layers:M.layers;for(let Ce=0;Ce<ie;Ce++){const He=B.getCamera(Ce);if(K.isPointLight){const J=B.camera,be=B.matrix,Pe=K.distance||J.far;Pe!==J.far&&(J.far=Pe,J.updateProjectionMatrix()),Xs.setFromMatrixPosition(K.matrixWorld),J.position.copy(Xs),uo.copy(J.position),uo.add(Mv[Ce]),J.up.copy(yv[Ce]),J.lookAt(uo),J.updateMatrixWorld(),be.makeTranslation(-Xs.x,-Xs.y,-Xs.z),ah.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),B._frustum.setFromProjectionMatrix(ah,J.coordinateSystem,J.reversedDepth)}if(B.map.isWebGLCubeRenderTarget)a.setRenderTarget(B.map,Ce),a.clear();else{Ce===0&&(a.setRenderTarget(B.map),a.clear());const J=B.getViewport(Ce);r.set(s.x*J.x,s.y*J.y,s.x*J.z,s.y*J.w),O.viewport(r)}i=B.getFrustum(Ce),_(v,M,He,K,ae,this.type)}B.isPointLightShadow!==!0&&this.type===qs&&S(B,M),B.needsUpdate=!1}g=this.type,p.needsUpdate=!1,a.setRenderTarget(I,R,D)};function S(T,v){const M=e.update(x);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new Pi(n.x,n.y,{format:Yn,type:Ci}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,a.setRenderTarget(T.mapPass),a.clear(),a.renderBufferDirect(v,null,M,d,x,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,a.setRenderTarget(T.map),a.clear(),a.renderBufferDirect(v,null,M,f,x,null)}function w(T,v,M,I){let R=null;const D=M.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)R=D;else if(R=M.isPointLight===!0?l:o,a.localClippingEnabled&&v.clipShadows===!0&&Array.isArray(v.clippingPlanes)&&v.clippingPlanes.length!==0||v.displacementMap&&v.displacementScale!==0||v.alphaMap&&v.alphaTest>0||v.map&&v.alphaTest>0||v.alphaToCoverage===!0){const O=R.uuid,W=v.uuid;let N=c[O];N===void 0&&(N={},c[O]=N);let H=N[W];H===void 0&&(H=R.clone(),N[W]=H,v.addEventListener("dispose",E)),R=H}if(R.visible=v.visible,R.wireframe=v.wireframe,I===qs?R.side=v.shadowSide!==null?v.shadowSide:v.side:R.side=v.shadowSide!==null?v.shadowSide:u[v.side],R.alphaMap=v.alphaMap,R.alphaTest=v.alphaToCoverage===!0?.5:v.alphaTest,R.map=v.map,R.clipShadows=v.clipShadows,R.clippingPlanes=v.clippingPlanes,R.clipIntersection=v.clipIntersection,R.displacementMap=v.displacementMap,R.displacementScale=v.displacementScale,R.displacementBias=v.displacementBias,R.wireframeLinewidth=v.wireframeLinewidth,R.linewidth=v.linewidth,M.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const O=a.properties.get(R);O.light=M}return R}function _(T,v,M,I,R,D){if(T.visible===!1)return;if(T.layers.test(R)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&D===qs)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,T.matrixWorld);const N=e.update(T),H=T.material;if(Array.isArray(H)){const K=N.groups;for(let B=0,le=K.length;B<le;B++){const q=K[B],ie=H[q.materialIndex];if(ie&&ie.visible){const ae=w(T,ie,I,D);T.onBeforeShadow(a,T,v,M,N,ae,q),a.renderBufferDirect(M,null,N,ae,T,q),T.onAfterShadow(a,T,v,M,N,ae,q)}}}else if(H.visible){const K=w(T,H,I,D);T.onBeforeShadow(a,T,v,M,N,K,null),a.renderBufferDirect(M,null,N,K,T,null),T.onAfterShadow(a,T,v,M,N,K,null)}}const W=T.children;for(let N=0,H=W.length;N<H;N++)_(W[N],v,M,I,R,D)}function E(T){T.target.removeEventListener("dispose",E);for(const M in c){const I=c[M],R=T.target.uuid;R in I&&(I[R].dispose(),delete I[R])}}}function wv(a,e){function t(){let P=!1;const j=new Xt;let Y=null;const fe=new Xt(0,0,0,0);return{setMask:function(de){Y!==de&&!P&&(a.colorMask(de,de,de,de),Y=de)},setLocked:function(de){P=de},setClear:function(de,me,De,je,ce){ce===!0&&(de*=je,me*=je,De*=je),j.set(de,me,De,je),fe.equals(j)===!1&&(a.clearColor(de,me,De,je),fe.copy(j))},reset:function(){P=!1,Y=null,fe.set(-1,0,0,0)}}}function i(){let P=!1,j=!1,Y=null,fe=null,de=null;return{setReversed:function(me){if(j!==me){const De=e.get("EXT_clip_control");me?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT),j=me;const je=de;de=null,this.setClear(je)}},getReversed:function(){return j},setTest:function(me){me?we(a.DEPTH_TEST):Be(a.DEPTH_TEST)},setMask:function(me){Y!==me&&!P&&(a.depthMask(me),Y=me)},setFunc:function(me){if(j&&(me=lu[me]),fe!==me){switch(me){case xo:a.depthFunc(a.NEVER);break;case _o:a.depthFunc(a.ALWAYS);break;case So:a.depthFunc(a.LESS);break;case na:a.depthFunc(a.LEQUAL);break;case Mo:a.depthFunc(a.EQUAL);break;case yo:a.depthFunc(a.GEQUAL);break;case bo:a.depthFunc(a.GREATER);break;case wo:a.depthFunc(a.NOTEQUAL);break;default:a.depthFunc(a.LEQUAL)}fe=me}},setLocked:function(me){P=me},setClear:function(me){de!==me&&(de=me,j&&(me=1-me),a.clearDepth(me))},reset:function(){P=!1,Y=null,fe=null,de=null,j=!1}}}function n(){let P=!1,j=null,Y=null,fe=null,de=null,me=null,De=null,je=null,ce=null;return{setTest:function(ze){P||(ze?we(a.STENCIL_TEST):Be(a.STENCIL_TEST))},setMask:function(ze){j!==ze&&!P&&(a.stencilMask(ze),j=ze)},setFunc:function(ze,Je,Q){(Y!==ze||fe!==Je||de!==Q)&&(a.stencilFunc(ze,Je,Q),Y=ze,fe=Je,de=Q)},setOp:function(ze,Je,Q){(me!==ze||De!==Je||je!==Q)&&(a.stencilOp(ze,Je,Q),me=ze,De=Je,je=Q)},setLocked:function(ze){P=ze},setClear:function(ze){ce!==ze&&(a.clearStencil(ze),ce=ze)},reset:function(){P=!1,j=null,Y=null,fe=null,de=null,me=null,De=null,je=null,ce=null}}}const s=new t,r=new i,o=new n;let l={};const c=new WeakMap;let h={},u={},d={},f=new WeakMap,m=[],x=null,p=!1,g=null,S=null,w=null,_=null,E=null,T=null,v=null,M=new Ke(0,0,0),I=0,R=!1,D=null,O=null,W=null,N=null,H=null;const K=a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,le=0;const q=a.getParameter(a.VERSION);q.indexOf("WebGL")!==-1?(le=parseFloat(/^WebGL (\d)/.exec(q)[1]),B=le>=1):q.indexOf("OpenGL ES")!==-1&&(le=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),B=le>=2);let ie=null,ae={};const Ce=a.getParameter(a.SCISSOR_BOX),He=a.getParameter(a.VIEWPORT),J=new Xt().fromArray(Ce),be=new Xt().fromArray(He);function Pe(P,j,Y,fe){const de=new Uint8Array(4),me=a.createTexture();a.bindTexture(P,me),a.texParameteri(P,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(P,a.TEXTURE_MAG_FILTER,a.NEAREST);for(let De=0;De<Y;De++)P===a.TEXTURE_3D||P===a.TEXTURE_2D_ARRAY?a.texImage3D(j,0,a.RGBA,1,1,fe,0,a.RGBA,a.UNSIGNED_BYTE,de):a.texImage2D(j+De,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,de);return me}const Oe={};Oe[a.TEXTURE_2D]=Pe(a.TEXTURE_2D,a.TEXTURE_2D,1),Oe[a.TEXTURE_CUBE_MAP]=Pe(a.TEXTURE_CUBE_MAP,a.TEXTURE_CUBE_MAP_POSITIVE_X,6),Oe[a.TEXTURE_2D_ARRAY]=Pe(a.TEXTURE_2D_ARRAY,a.TEXTURE_2D_ARRAY,1,1),Oe[a.TEXTURE_3D]=Pe(a.TEXTURE_3D,a.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),we(a.DEPTH_TEST),r.setFunc(na),Ae(!1),Me(ql),we(a.CULL_FACE),ge($n);function we(P){h[P]!==!0&&(a.enable(P),h[P]=!0)}function Be(P){h[P]!==!1&&(a.disable(P),h[P]=!1)}function At(P,j){return d[P]!==j?(a.bindFramebuffer(P,j),d[P]=j,P===a.DRAW_FRAMEBUFFER&&(d[a.FRAMEBUFFER]=j),P===a.FRAMEBUFFER&&(d[a.DRAW_FRAMEBUFFER]=j),!0):!1}function We(P,j){let Y=m,fe=!1;if(P){Y=f.get(j),Y===void 0&&(Y=[],f.set(j,Y));const de=P.textures;if(Y.length!==de.length||Y[0]!==a.COLOR_ATTACHMENT0){for(let me=0,De=de.length;me<De;me++)Y[me]=a.COLOR_ATTACHMENT0+me;Y.length=de.length,fe=!0}}else Y[0]!==a.BACK&&(Y[0]=a.BACK,fe=!0);fe&&a.drawBuffers(Y)}function it(P){return x!==P?(a.useProgram(P),x=P,!0):!1}const lt={[ms]:a.FUNC_ADD,[Pd]:a.FUNC_SUBTRACT,[Id]:a.FUNC_REVERSE_SUBTRACT};lt[Dd]=a.MIN,lt[Ld]=a.MAX;const ne={[Nd]:a.ZERO,[Ud]:a.ONE,[Fd]:a.SRC_COLOR,[gh]:a.SRC_ALPHA,[Hd]:a.SRC_ALPHA_SATURATE,[zd]:a.DST_COLOR,[Bd]:a.DST_ALPHA,[Od]:a.ONE_MINUS_SRC_COLOR,[vh]:a.ONE_MINUS_SRC_ALPHA,[Gd]:a.ONE_MINUS_DST_COLOR,[kd]:a.ONE_MINUS_DST_ALPHA,[Wd]:a.CONSTANT_COLOR,[Vd]:a.ONE_MINUS_CONSTANT_COLOR,[Xd]:a.CONSTANT_ALPHA,[$d]:a.ONE_MINUS_CONSTANT_ALPHA};function ge(P,j,Y,fe,de,me,De,je,ce,ze){if(P===$n){p===!0&&(Be(a.BLEND),p=!1);return}if(p===!1&&(we(a.BLEND),p=!0),P!==Cd){if(P!==g||ze!==R){if((S!==ms||E!==ms)&&(a.blendEquation(a.FUNC_ADD),S=ms,E=ms),ze)switch(P){case xs:a.blendFuncSeparate(a.ONE,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case en:a.blendFunc(a.ONE,a.ONE);break;case Yl:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case Kl:a.blendFuncSeparate(a.DST_COLOR,a.ONE_MINUS_SRC_ALPHA,a.ZERO,a.ONE);break;default:_t("WebGLState: Invalid blending: ",P);break}else switch(P){case xs:a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case en:a.blendFuncSeparate(a.SRC_ALPHA,a.ONE,a.ONE,a.ONE);break;case Yl:_t("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Kl:_t("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:_t("WebGLState: Invalid blending: ",P);break}w=null,_=null,T=null,v=null,M.set(0,0,0),I=0,g=P,R=ze}return}de=de||j,me=me||Y,De=De||fe,(j!==S||de!==E)&&(a.blendEquationSeparate(lt[j],lt[de]),S=j,E=de),(Y!==w||fe!==_||me!==T||De!==v)&&(a.blendFuncSeparate(ne[Y],ne[fe],ne[me],ne[De]),w=Y,_=fe,T=me,v=De),(je.equals(M)===!1||ce!==I)&&(a.blendColor(je.r,je.g,je.b,ce),M.copy(je),I=ce),g=P,R=!1}function ve(P,j){P.side===Ot?Be(a.CULL_FACE):we(a.CULL_FACE);let Y=P.side===Ei;j&&(Y=!Y),Ae(Y),P.blending===xs&&P.transparent===!1?ge($n):ge(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),r.setFunc(P.depthFunc),r.setTest(P.depthTest),r.setMask(P.depthWrite),s.setMask(P.colorWrite);const fe=P.stencilWrite;o.setTest(fe),fe&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),Ue(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?we(a.SAMPLE_ALPHA_TO_COVERAGE):Be(a.SAMPLE_ALPHA_TO_COVERAGE)}function Ae(P){D!==P&&(P?a.frontFace(a.CW):a.frontFace(a.CCW),D=P)}function Me(P){P!==Ed?(we(a.CULL_FACE),P!==O&&(P===ql?a.cullFace(a.BACK):P===Ad?a.cullFace(a.FRONT):a.cullFace(a.FRONT_AND_BACK))):Be(a.CULL_FACE),O=P}function Ze(P){P!==W&&(B&&a.lineWidth(P),W=P)}function Ue(P,j,Y){P?(we(a.POLYGON_OFFSET_FILL),(N!==j||H!==Y)&&(N=j,H=Y,r.getReversed()&&(j=-j,Y=-Y),a.polygonOffset(j,Y))):Be(a.POLYGON_OFFSET_FILL)}function ct(P){P?we(a.SCISSOR_TEST):Be(a.SCISSOR_TEST)}function dt(P){P===void 0&&(P=a.TEXTURE0+K-1),ie!==P&&(a.activeTexture(P),ie=P)}function vt(P,j,Y){Y===void 0&&(ie===null?Y=a.TEXTURE0+K-1:Y=ie);let fe=ae[Y];fe===void 0&&(fe={type:void 0,texture:void 0},ae[Y]=fe),(fe.type!==P||fe.texture!==j)&&(ie!==Y&&(a.activeTexture(Y),ie=Y),a.bindTexture(P,j||Oe[P]),fe.type=P,fe.texture=j)}function F(){const P=ae[ie];P!==void 0&&P.type!==void 0&&(a.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function Bt(){try{a.compressedTexImage2D(...arguments)}catch(P){_t("WebGLState:",P)}}function at(){try{a.compressedTexImage3D(...arguments)}catch(P){_t("WebGLState:",P)}}function Rt(){try{a.texSubImage2D(...arguments)}catch(P){_t("WebGLState:",P)}}function _e(){try{a.texSubImage3D(...arguments)}catch(P){_t("WebGLState:",P)}}function Ft(){try{a.compressedTexSubImage2D(...arguments)}catch(P){_t("WebGLState:",P)}}function Ge(){try{a.compressedTexSubImage3D(...arguments)}catch(P){_t("WebGLState:",P)}}function qe(){try{a.texStorage2D(...arguments)}catch(P){_t("WebGLState:",P)}}function A(){try{a.texStorage3D(...arguments)}catch(P){_t("WebGLState:",P)}}function y(){try{a.texImage2D(...arguments)}catch(P){_t("WebGLState:",P)}}function k(){try{a.texImage3D(...arguments)}catch(P){_t("WebGLState:",P)}}function se(P){return u[P]!==void 0?u[P]:a.getParameter(P)}function te(P,j){u[P]!==j&&(a.pixelStorei(P,j),u[P]=j)}function ue(P){J.equals(P)===!1&&(a.scissor(P.x,P.y,P.z,P.w),J.copy(P))}function xe(P){be.equals(P)===!1&&(a.viewport(P.x,P.y,P.z,P.w),be.copy(P))}function Z(P,j){let Y=c.get(j);Y===void 0&&(Y=new WeakMap,c.set(j,Y));let fe=Y.get(P);fe===void 0&&(fe=a.getUniformBlockIndex(j,P.name),a.uniformBlockBinding(j,fe,fe),Y.set(P,fe))}function ee(P,j,Y){const de=c.get(j).get(P);l[de]!==Y&&(a.bindBufferBase(a.UNIFORM_BUFFER,de,Y),l[de]=Y)}function pe(){a.disable(a.BLEND),a.disable(a.CULL_FACE),a.disable(a.DEPTH_TEST),a.disable(a.POLYGON_OFFSET_FILL),a.disable(a.SCISSOR_TEST),a.disable(a.STENCIL_TEST),a.disable(a.SAMPLE_ALPHA_TO_COVERAGE),a.blendEquation(a.FUNC_ADD),a.blendFunc(a.ONE,a.ZERO),a.blendFuncSeparate(a.ONE,a.ZERO,a.ONE,a.ZERO),a.blendColor(0,0,0,0),a.colorMask(!0,!0,!0,!0),a.clearColor(0,0,0,0),a.depthMask(!0),a.depthFunc(a.LESS),r.setReversed(!1),a.clearDepth(1),a.stencilMask(4294967295),a.stencilFunc(a.ALWAYS,0,4294967295),a.stencilOp(a.KEEP,a.KEEP,a.KEEP),a.clearStencil(0),a.cullFace(a.BACK),a.frontFace(a.CCW),a.polygonOffset(0,0),a.activeTexture(a.TEXTURE0),a.bindFramebuffer(a.FRAMEBUFFER,null),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),a.bindFramebuffer(a.READ_FRAMEBUFFER,null),a.useProgram(null),a.lineWidth(1),a.scissor(0,0,a.canvas.width,a.canvas.height),a.viewport(0,0,a.canvas.width,a.canvas.height),a.pixelStorei(a.PACK_ALIGNMENT,4),a.pixelStorei(a.UNPACK_ALIGNMENT,4),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,a.BROWSER_DEFAULT_WEBGL),a.pixelStorei(a.PACK_ROW_LENGTH,0),a.pixelStorei(a.PACK_SKIP_PIXELS,0),a.pixelStorei(a.PACK_SKIP_ROWS,0),a.pixelStorei(a.UNPACK_ROW_LENGTH,0),a.pixelStorei(a.UNPACK_IMAGE_HEIGHT,0),a.pixelStorei(a.UNPACK_SKIP_PIXELS,0),a.pixelStorei(a.UNPACK_SKIP_ROWS,0),a.pixelStorei(a.UNPACK_SKIP_IMAGES,0),h={},u={},ie=null,ae={},d={},l={},f=new WeakMap,m=[],x=null,p=!1,g=null,S=null,w=null,_=null,E=null,T=null,v=null,M=new Ke(0,0,0),I=0,R=!1,D=null,O=null,W=null,N=null,H=null,J.set(0,0,a.canvas.width,a.canvas.height),be.set(0,0,a.canvas.width,a.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:we,disable:Be,bindFramebuffer:At,drawBuffers:We,useProgram:it,setBlending:ge,setMaterial:ve,setFlipSided:Ae,setCullFace:Me,setLineWidth:Ze,setPolygonOffset:Ue,setScissorTest:ct,activeTexture:dt,bindTexture:vt,unbindTexture:F,compressedTexImage2D:Bt,compressedTexImage3D:at,texImage2D:y,texImage3D:k,pixelStorei:te,getParameter:se,updateUBOMapping:Z,uniformBlockBinding:ee,texStorage2D:qe,texStorage3D:A,texSubImage2D:Rt,texSubImage3D:_e,compressedTexSubImage2D:Ft,compressedTexSubImage3D:Ge,scissor:ue,viewport:xe,reset:pe}}function Tv(a,e,t,i,n,s,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new re,h=new WeakMap,u=new Set;let d;const f=new WeakMap,m=new Set,x=new FinalizationRegistry(A=>m.delete(A));let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,y){return p?new OffscreenCanvas(A,y):xr("canvas")}function S(A,y,k){let se=1;const te=qe(A);if((te.width>k||te.height>k)&&(se=k/Math.max(te.width,te.height)),se<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const ue=Math.floor(se*te.width),xe=Math.floor(se*te.height);d===void 0&&(d=g(ue,xe));const Z=y?g(ue,xe):d;return Z.width=ue,Z.height=xe,Z.getContext("2d").drawImage(A,0,0,ue,xe),$e("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ue+"x"+xe+")."),Z}else return"data"in A&&$e("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),A;return A}function w(A){return A.generateMipmaps}function _(A){a.generateMipmap(A)}function E(A){return A.isWebGLCubeRenderTarget?a.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?a.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?a.TEXTURE_2D_ARRAY:a.TEXTURE_2D}function T(A,y,k,se,te,ue=!1){if(A!==null){if(a[A]!==void 0)return a[A];$e("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let xe;se&&(xe=e.get("EXT_texture_norm16"),xe||$e("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=y;if(y===a.RED&&(k===a.FLOAT&&(Z=a.R32F),k===a.HALF_FLOAT&&(Z=a.R16F),k===a.UNSIGNED_BYTE&&(Z=a.R8),k===a.UNSIGNED_SHORT&&xe&&(Z=xe.R16_EXT),k===a.SHORT&&xe&&(Z=xe.R16_SNORM_EXT)),y===a.RED_INTEGER&&(k===a.UNSIGNED_BYTE&&(Z=a.R8UI),k===a.UNSIGNED_SHORT&&(Z=a.R16UI),k===a.UNSIGNED_INT&&(Z=a.R32UI),k===a.BYTE&&(Z=a.R8I),k===a.SHORT&&(Z=a.R16I),k===a.INT&&(Z=a.R32I)),y===a.RG&&(k===a.FLOAT&&(Z=a.RG32F),k===a.HALF_FLOAT&&(Z=a.RG16F),k===a.UNSIGNED_BYTE&&(Z=a.RG8),k===a.UNSIGNED_SHORT&&xe&&(Z=xe.RG16_EXT),k===a.SHORT&&xe&&(Z=xe.RG16_SNORM_EXT)),y===a.RG_INTEGER&&(k===a.UNSIGNED_BYTE&&(Z=a.RG8UI),k===a.UNSIGNED_SHORT&&(Z=a.RG16UI),k===a.UNSIGNED_INT&&(Z=a.RG32UI),k===a.BYTE&&(Z=a.RG8I),k===a.SHORT&&(Z=a.RG16I),k===a.INT&&(Z=a.RG32I)),y===a.RGB_INTEGER&&(k===a.UNSIGNED_BYTE&&(Z=a.RGB8UI),k===a.UNSIGNED_SHORT&&(Z=a.RGB16UI),k===a.UNSIGNED_INT&&(Z=a.RGB32UI),k===a.BYTE&&(Z=a.RGB8I),k===a.SHORT&&(Z=a.RGB16I),k===a.INT&&(Z=a.RGB32I)),y===a.RGBA_INTEGER&&(k===a.UNSIGNED_BYTE&&(Z=a.RGBA8UI),k===a.UNSIGNED_SHORT&&(Z=a.RGBA16UI),k===a.UNSIGNED_INT&&(Z=a.RGBA32UI),k===a.BYTE&&(Z=a.RGBA8I),k===a.SHORT&&(Z=a.RGBA16I),k===a.INT&&(Z=a.RGBA32I)),y===a.RGB&&(k===a.UNSIGNED_SHORT&&xe&&(Z=xe.RGB16_EXT),k===a.SHORT&&xe&&(Z=xe.RGB16_SNORM_EXT),k===a.UNSIGNED_INT_5_9_9_9_REV&&(Z=a.RGB9_E5),k===a.UNSIGNED_INT_10F_11F_11F_REV&&(Z=a.R11F_G11F_B10F)),y===a.RGBA){const ee=ue?vr:gt.getTransfer(te);k===a.FLOAT&&(Z=a.RGBA32F),k===a.HALF_FLOAT&&(Z=a.RGBA16F),k===a.UNSIGNED_BYTE&&(Z=ee===Tt?a.SRGB8_ALPHA8:a.RGBA8),k===a.UNSIGNED_SHORT&&xe&&(Z=xe.RGBA16_EXT),k===a.SHORT&&xe&&(Z=xe.RGBA16_SNORM_EXT),k===a.UNSIGNED_SHORT_4_4_4_4&&(Z=a.RGBA4),k===a.UNSIGNED_SHORT_5_5_5_1&&(Z=a.RGB5_A1)}return(Z===a.R16F||Z===a.R32F||Z===a.RG16F||Z===a.RG32F||Z===a.RGBA16F||Z===a.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function v(A,y){let k;return A?y===null||y===tn||y===Ts?k=a.DEPTH24_STENCIL8:y===Yi?k=a.DEPTH32F_STENCIL8:y===ra&&(k=a.DEPTH24_STENCIL8,$e("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===tn||y===Ts?k=a.DEPTH_COMPONENT24:y===Yi?k=a.DEPTH_COMPONENT32F:y===ra&&(k=a.DEPTH_COMPONENT16),k}function M(A,y){return w(A)===!0||A.isFramebufferTexture&&A.minFilter!==ci&&A.minFilter!==Ri?Math.log2(Math.max(y.width,y.height))+1:A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?y.mipmaps.length:1}function I(A){const y=new WeakRef(A);i.get(A).__ref=y,m.add(y),x.register(A,y,y)}function R(A){const y=i.get(A).__ref;y!==void 0&&(m.delete(y),x.unregister(y))}function D(A){W(A.target)}function O(A){N(A.target)}function W(A){A.removeEventListener("dispose",D),R(A),K(A),A.isVideoTexture&&h.delete(A),A.isHTMLTexture&&u.delete(A)}function N(A){A.removeEventListener("dispose",O),R(A),le(A)}function H(){for(const A of m){const y=A.deref();y!==void 0&&(y.isRenderTarget===!0?N(y):W(y))}m.clear(),u.clear()}function K(A){const y=i.get(A);if(y.__webglInit===void 0)return;const k=A.source,se=f.get(k);if(se){const te=se[y.__cacheKey];te.usedTimes--,te.usedTimes===0&&B(A),Object.keys(se).length===0&&f.delete(k)}i.remove(A)}function B(A){const y=i.get(A);a.deleteTexture(y.__webglTexture);const k=A.source,se=f.get(k);delete se[y.__cacheKey],r.memory.textures--}function le(A){const y=i.get(A);y.__depthDisposeCallback&&y.__depthDisposeCallback();const k=A.depthTexture;if(k&&k.renderTarget===A&&W(k),A.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(y.__webglFramebuffer[te]))for(let ue=0;ue<y.__webglFramebuffer[te].length;ue++)a.deleteFramebuffer(y.__webglFramebuffer[te][ue]);else a.deleteFramebuffer(y.__webglFramebuffer[te]);y.__webglDepthbuffer&&a.deleteRenderbuffer(y.__webglDepthbuffer[te])}else{if(Array.isArray(y.__webglFramebuffer))for(let te=0;te<y.__webglFramebuffer.length;te++)a.deleteFramebuffer(y.__webglFramebuffer[te]);else a.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&a.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&a.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let te=0;te<y.__webglColorRenderbuffer.length;te++)y.__webglColorRenderbuffer[te]&&a.deleteRenderbuffer(y.__webglColorRenderbuffer[te]);y.__webglDepthRenderbuffer&&a.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const se=A.textures;for(let te=0,ue=se.length;te<ue;te++){const xe=i.get(se[te]);xe.__webglTexture&&(a.deleteTexture(xe.__webglTexture),r.memory.textures--),i.remove(se[te])}i.remove(A)}let q=0;function ie(){q=0}function ae(){return q}function Ce(A){q=A}function He(){const A=q;return A>=n.maxTextures&&$e("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+n.maxTextures),q+=1,A}function J(A){const y=[];return y.push(A.wrapS),y.push(A.wrapT),y.push(A.wrapR||0),y.push(A.magFilter),y.push(A.minFilter),y.push(A.anisotropy),y.push(A.internalFormat),y.push(A.format),y.push(A.type),y.push(A.generateMipmaps),y.push(A.mipmapsAutoUpdate),y.push(A.premultiplyAlpha),y.push(A.flipY),y.push(A.unpackAlignment),y.push(A.colorSpace),y.join()}function be(A,y){const k=i.get(A);if(A.isVideoTexture&&Ft(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&k.__version!==A.version){const se=A.image;if(se===null)$e("WebGLRenderer: Texture marked for update but no image data found.");else if(se.complete===!1)$e("WebGLRenderer: Texture marked for update but image is incomplete");else{ve(k,A,y);return}}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(a.TEXTURE_2D,k.__webglTexture,a.TEXTURE0+y)}function Pe(A,y){const k=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){ve(k,A,y);return}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(a.TEXTURE_2D_ARRAY,k.__webglTexture,a.TEXTURE0+y)}function Oe(A,y){const k=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){ve(k,A,y);return}t.bindTexture(a.TEXTURE_3D,k.__webglTexture,a.TEXTURE0+y)}function we(A,y){const k=i.get(A);if(A.version>0&&k.__version!==A.version){Ae(k,A,y);return}t.bindTexture(a.TEXTURE_CUBE_MAP,k.__webglTexture,a.TEXTURE0+y)}const Be={[aa]:a.REPEAT,[pn]:a.CLAMP_TO_EDGE,[To]:a.MIRRORED_REPEAT},At={[ci]:a.NEAREST,[Kd]:a.NEAREST_MIPMAP_NEAREST,[Sa]:a.NEAREST_MIPMAP_LINEAR,[Ri]:a.LINEAR,[Fr]:a.LINEAR_MIPMAP_NEAREST,[Pn]:a.LINEAR_MIPMAP_LINEAR},We={[jd]:a.NEVER,[Ah]:a.ALWAYS,[eu]:a.LESS,[Th]:a.LEQUAL,[tu]:a.EQUAL,[Eh]:a.GEQUAL,[iu]:a.GREATER,[nu]:a.NOTEQUAL};function it(A,y){if(y.type===Yi&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Ri||y.magFilter===Fr||y.magFilter===Sa||y.magFilter===Pn||y.minFilter===Ri||y.minFilter===Fr||y.minFilter===Sa||y.minFilter===Pn)&&$e("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),a.texParameteri(A,a.TEXTURE_WRAP_S,Be[y.wrapS]),a.texParameteri(A,a.TEXTURE_WRAP_T,Be[y.wrapT]),(A===a.TEXTURE_3D||A===a.TEXTURE_2D_ARRAY)&&a.texParameteri(A,a.TEXTURE_WRAP_R,Be[y.wrapR]),a.texParameteri(A,a.TEXTURE_MAG_FILTER,At[y.magFilter]),a.texParameteri(A,a.TEXTURE_MIN_FILTER,At[y.minFilter]),y.compareFunction&&(a.texParameteri(A,a.TEXTURE_COMPARE_MODE,a.COMPARE_REF_TO_TEXTURE),a.texParameteri(A,a.TEXTURE_COMPARE_FUNC,We[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===ci||y.minFilter!==Sa&&y.minFilter!==Pn||y.type===Yi&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");a.texParameterf(A,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,n.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function lt(A,y){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,y.addEventListener("dispose",D),I(y));const se=y.source;let te=f.get(se);te===void 0&&(te={},f.set(se,te));const ue=J(y);if(ue!==A.__cacheKey){te[ue]===void 0&&(te[ue]={texture:a.createTexture(),usedTimes:0},r.memory.textures++,k=!0),te[ue].usedTimes++;const xe=te[A.__cacheKey];xe!==void 0&&(te[A.__cacheKey].usedTimes--,xe.usedTimes===0&&B(y)),A.__cacheKey=ue,A.__webglTexture=te[ue].texture}return k}function ne(A,y,k){return Math.floor(Math.floor(A/k)/y)}function ge(A,y,k,se){const ue=A.updateRanges;if(ue.length===0)t.texSubImage2D(a.TEXTURE_2D,0,0,0,y.width,y.height,k,se,y.data);else{ue.sort((P,j)=>P.start-j.start);let xe=0;for(let P=1;P<ue.length;P++){const j=ue[xe],Y=ue[P],fe=j.start+j.count,de=ne(Y.start,y.width,4),me=ne(j.start,y.width,4);Y.start<=fe+1&&de===me&&ne(Y.start+Y.count-1,y.width,4)===de?j.count=Math.max(j.count,Y.start+Y.count-j.start):(++xe,ue[xe]=Y)}ue.length=xe+1;const Z=t.getParameter(a.UNPACK_ROW_LENGTH),ee=t.getParameter(a.UNPACK_SKIP_PIXELS),pe=t.getParameter(a.UNPACK_SKIP_ROWS);t.pixelStorei(a.UNPACK_ROW_LENGTH,y.width);for(let P=0,j=ue.length;P<j;P++){const Y=ue[P],fe=Math.floor(Y.start/4),de=Math.ceil(Y.count/4),me=fe%y.width,De=Math.floor(fe/y.width),je=de,ce=1;t.pixelStorei(a.UNPACK_SKIP_PIXELS,me),t.pixelStorei(a.UNPACK_SKIP_ROWS,De),t.texSubImage2D(a.TEXTURE_2D,0,me,De,je,ce,k,se,y.data)}A.clearUpdateRanges(),t.pixelStorei(a.UNPACK_ROW_LENGTH,Z),t.pixelStorei(a.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(a.UNPACK_SKIP_ROWS,pe)}}function ve(A,y,k){let se=a.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(se=a.TEXTURE_2D_ARRAY),y.isData3DTexture&&(se=a.TEXTURE_3D);const te=lt(A,y),ue=y.source;t.bindTexture(se,A.__webglTexture,a.TEXTURE0+k);const xe=i.get(ue);if(ue.version!==xe.__version||te===!0){if(t.activeTexture(a.TEXTURE0+k),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){const ce=gt.getPrimaries(gt.workingColorSpace),ze=y.colorSpace===Rn?null:gt.getPrimaries(y.colorSpace),Je=y.colorSpace===Rn||ce===ze?a.NONE:a.BROWSER_DEFAULT_WEBGL;t.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je)}t.pixelStorei(a.UNPACK_ALIGNMENT,y.unpackAlignment);let ee=S(y.image,!1,n.maxTextureSize);ee=Ge(y,ee);const pe=s.convert(y.format,y.colorSpace),P=s.convert(y.type);let j=T(y.internalFormat,pe,P,y.normalized,y.colorSpace,y.isVideoTexture);it(se,y);let Y;const fe=y.mipmaps,de=y.isVideoTexture!==!0,me=xe.__version===void 0||te===!0,De=ue.dataReady,je=M(y,ee);if(y.isDepthTexture)j=v(y.format===In,y.type),me&&(de?t.texStorage2D(a.TEXTURE_2D,1,j,ee.width,ee.height):t.texImage2D(a.TEXTURE_2D,0,j,ee.width,ee.height,0,pe,P,null));else if(y.isDataTexture)if(fe.length>0){de&&me&&t.texStorage2D(a.TEXTURE_2D,je,j,fe[0].width,fe[0].height);for(let ce=0,ze=fe.length;ce<ze;ce++)Y=fe[ce],de?De&&t.texSubImage2D(a.TEXTURE_2D,ce,0,0,Y.width,Y.height,pe,P,Y.data):t.texImage2D(a.TEXTURE_2D,ce,j,Y.width,Y.height,0,pe,P,Y.data);y.generateMipmaps=!1}else de?(me&&t.texStorage2D(a.TEXTURE_2D,je,j,ee.width,ee.height),De&&ge(y,ee,pe,P)):t.texImage2D(a.TEXTURE_2D,0,j,ee.width,ee.height,0,pe,P,ee.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){de&&me&&t.texStorage3D(a.TEXTURE_2D_ARRAY,je,j,fe[0].width,fe[0].height,ee.depth);for(let ce=0,ze=fe.length;ce<ze;ce++)if(Y=fe[ce],y.format!==ji)if(pe!==null)if(de){if(De)if(y.layerUpdates.size>0){const Je=Bc(Y.width,Y.height,y.format,y.type);for(const Q of y.layerUpdates){const Re=Y.data.subarray(Q*Je/Y.data.BYTES_PER_ELEMENT,(Q+1)*Je/Y.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,ce,0,0,Q,Y.width,Y.height,1,pe,Re)}}else t.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,ce,0,0,0,Y.width,Y.height,ee.depth,pe,Y.data)}else t.compressedTexImage3D(a.TEXTURE_2D_ARRAY,ce,j,Y.width,Y.height,ee.depth,0,Y.data,0,0);else $e("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else de?De&&t.texSubImage3D(a.TEXTURE_2D_ARRAY,ce,0,0,0,Y.width,Y.height,ee.depth,pe,P,Y.data):t.texImage3D(a.TEXTURE_2D_ARRAY,ce,j,Y.width,Y.height,ee.depth,0,pe,P,Y.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{de&&me&&t.texStorage2D(a.TEXTURE_2D,je,j,fe[0].width,fe[0].height);for(let ce=0,ze=fe.length;ce<ze;ce++)Y=fe[ce],y.format!==ji?pe!==null?de?De&&t.compressedTexSubImage2D(a.TEXTURE_2D,ce,0,0,Y.width,Y.height,pe,Y.data):t.compressedTexImage2D(a.TEXTURE_2D,ce,j,Y.width,Y.height,0,Y.data):$e("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):de?De&&t.texSubImage2D(a.TEXTURE_2D,ce,0,0,Y.width,Y.height,pe,P,Y.data):t.texImage2D(a.TEXTURE_2D,ce,j,Y.width,Y.height,0,pe,P,Y.data)}else if(y.isDataArrayTexture)if(de){if(me&&t.texStorage3D(a.TEXTURE_2D_ARRAY,je,j,ee.width,ee.height,ee.depth),De)if(y.layerUpdates.size>0){const ce=Bc(ee.width,ee.height,y.format,y.type);for(const ze of y.layerUpdates){const Je=ee.data.subarray(ze*ce/ee.data.BYTES_PER_ELEMENT,(ze+1)*ce/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,ze,ee.width,ee.height,1,pe,P,Je)}y.clearLayerUpdates()}else t.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,pe,P,ee.data)}else t.texImage3D(a.TEXTURE_2D_ARRAY,0,j,ee.width,ee.height,ee.depth,0,pe,P,ee.data);else if(y.isData3DTexture)de?(me&&t.texStorage3D(a.TEXTURE_3D,je,j,ee.width,ee.height,ee.depth),De&&t.texSubImage3D(a.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,pe,P,ee.data)):t.texImage3D(a.TEXTURE_3D,0,j,ee.width,ee.height,ee.depth,0,pe,P,ee.data);else if(y.isFramebufferTexture){if(me)if(de)t.texStorage2D(a.TEXTURE_2D,je,j,ee.width,ee.height);else{let ce=ee.width,ze=ee.height;for(let Je=0;Je<je;Je++)t.texImage2D(a.TEXTURE_2D,Je,j,ce,ze,0,pe,P,null),ce>>=1,ze>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in a){const ce=a.canvas;if(ce.hasAttribute("layoutsubtree")||ce.setAttribute("layoutsubtree","true"),ee.parentNode!==ce){ce.appendChild(ee),u.add(y),ce.onpaint=ze=>{const Je=ze.changedElements;for(const Q of u)Je.includes(Q.image)&&(Q.needsUpdate=!0)},ce.requestPaint();return}if(a.texElementImage2D.length===3)a.texElementImage2D(a.TEXTURE_2D,a.RGBA8,ee);else{const Je=a.RGBA,Q=a.RGBA,Re=a.UNSIGNED_BYTE;a.texElementImage2D(a.TEXTURE_2D,0,Je,Q,Re,ee)}a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE)}}else if(fe.length>0){if(de&&me){const ce=qe(fe[0]);t.texStorage2D(a.TEXTURE_2D,je,j,ce.width,ce.height)}for(let ce=0,ze=fe.length;ce<ze;ce++)Y=fe[ce],de?De&&t.texSubImage2D(a.TEXTURE_2D,ce,0,0,pe,P,Y):t.texImage2D(a.TEXTURE_2D,ce,j,pe,P,Y);y.generateMipmaps=!1}else if(de){if(me){const ce=qe(ee);t.texStorage2D(a.TEXTURE_2D,je,j,ce.width,ce.height)}De&&t.texSubImage2D(a.TEXTURE_2D,0,0,0,pe,P,ee)}else t.texImage2D(a.TEXTURE_2D,0,j,pe,P,ee);w(y)&&y.mipmapsAutoUpdate===!0&&_(se),xe.__version=ue.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function Ae(A,y,k){if(y.image.length!==6)return;const se=lt(A,y),te=y.source;t.bindTexture(a.TEXTURE_CUBE_MAP,A.__webglTexture,a.TEXTURE0+k);const ue=i.get(te);if(te.version!==ue.__version||se===!0){t.activeTexture(a.TEXTURE0+k);const xe=gt.getPrimaries(gt.workingColorSpace),Z=y.colorSpace===Rn?null:gt.getPrimaries(y.colorSpace),ee=y.colorSpace===Rn||xe===Z?a.NONE:a.BROWSER_DEFAULT_WEBGL;t.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(a.UNPACK_ALIGNMENT,y.unpackAlignment),t.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);const pe=y.isCompressedTexture||y.image[0].isCompressedTexture,P=y.image[0]&&y.image[0].isDataTexture,j=[];for(let Q=0;Q<6;Q++)!pe&&!P?j[Q]=S(y.image[Q],!0,n.maxCubemapSize):j[Q]=P?y.image[Q].image:y.image[Q],j[Q]=Ge(y,j[Q]);const Y=j[0],fe=s.convert(y.format,y.colorSpace),de=s.convert(y.type);let me=T(y.internalFormat,fe,de,y.normalized,y.colorSpace);const De=y.isVideoTexture!==!0,je=ue.__version===void 0||se===!0,ce=te.dataReady;let ze=M(y,Y);it(a.TEXTURE_CUBE_MAP,y);let Je;if(y.isDepthTexture){if(me=v(y.format===In,y.type),je)if(De)t.texStorage2D(a.TEXTURE_CUBE_MAP,1,me,Y.width,Y.height);else for(let Q=0;Q<6;Q++)t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,me,Y.width,Y.height,0,fe,de,null)}else if(pe){De&&je&&t.texStorage2D(a.TEXTURE_CUBE_MAP,ze,me,Y.width,Y.height);for(let Q=0;Q<6;Q++){Je=j[Q].mipmaps;for(let Re=0;Re<Je.length;Re++){const ht=Je[Re];y.format!==ji?fe!==null?De?ce&&t.compressedTexSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,0,0,ht.width,ht.height,fe,ht.data):t.compressedTexImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,me,ht.width,ht.height,0,ht.data):$e("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):De?ce&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,0,0,ht.width,ht.height,fe,de,ht.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,me,ht.width,ht.height,0,fe,de,ht.data)}}}else{if(Je=y.mipmaps,De&&je){Je.length>0&&ze++;const Q=qe(j[0]);t.texStorage2D(a.TEXTURE_CUBE_MAP,ze,me,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(P){De?ce&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,j[Q].width,j[Q].height,fe,de,j[Q].data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,me,j[Q].width,j[Q].height,0,fe,de,j[Q].data);for(let Re=0;Re<Je.length;Re++){const Mt=Je[Re].image[Q].image;De?ce&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,0,0,Mt.width,Mt.height,fe,de,Mt.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,me,Mt.width,Mt.height,0,fe,de,Mt.data)}}else{De?ce&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,fe,de,j[Q]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,me,fe,de,j[Q]);for(let Re=0;Re<Je.length;Re++){const ht=Je[Re];De?ce&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,0,0,fe,de,ht.image[Q]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,me,fe,de,ht.image[Q])}}}w(y)&&y.mipmapsAutoUpdate===!0&&_(a.TEXTURE_CUBE_MAP),ue.__version=te.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function Me(A,y,k,se,te,ue){const xe=s.convert(k.format,k.colorSpace),Z=s.convert(k.type),ee=T(k.internalFormat,xe,Z,k.normalized,k.colorSpace),pe=i.get(y),P=i.get(k);if(P.__renderTarget=y,!pe.__hasExternalTextures){const j=Math.max(1,y.width>>ue),Y=Math.max(1,y.height>>ue);te===a.TEXTURE_3D||te===a.TEXTURE_2D_ARRAY?t.texImage3D(te,ue,ee,j,Y,y.depth,0,xe,Z,null):t.texImage2D(te,ue,ee,j,Y,0,xe,Z,null)}t.bindFramebuffer(a.FRAMEBUFFER,A),_e(y)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,se,te,P.__webglTexture,0,Rt(y)):(te===a.TEXTURE_2D||te>=a.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=a.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&a.framebufferTexture2D(a.FRAMEBUFFER,se,te,P.__webglTexture,ue),t.bindFramebuffer(a.FRAMEBUFFER,null)}function Ze(A,y,k){if(a.bindRenderbuffer(a.RENDERBUFFER,A),y.depthBuffer){const se=y.depthTexture,te=se&&se.isDepthTexture?se.type:null,ue=v(y.stencilBuffer,te),xe=y.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;_e(y)?o.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,Rt(y),ue,y.width,y.height):k?a.renderbufferStorageMultisample(a.RENDERBUFFER,Rt(y),ue,y.width,y.height):a.renderbufferStorage(a.RENDERBUFFER,ue,y.width,y.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,xe,a.RENDERBUFFER,A)}else{const se=y.textures;for(let te=0;te<se.length;te++){const ue=se[te],xe=s.convert(ue.format,ue.colorSpace),Z=s.convert(ue.type),ee=T(ue.internalFormat,xe,Z,ue.normalized,ue.colorSpace);_e(y)?o.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,Rt(y),ee,y.width,y.height):k?a.renderbufferStorageMultisample(a.RENDERBUFFER,Rt(y),ee,y.width,y.height):a.renderbufferStorage(a.RENDERBUFFER,ee,y.width,y.height)}}a.bindRenderbuffer(a.RENDERBUFFER,null)}function Ue(A,y,k){const se=y.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(a.FRAMEBUFFER,A),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const te=i.get(y.depthTexture);te.__renderTarget=y;const ue=se?y.depthTexture.image[0]:y.depthTexture.image;(!te.__webglTexture||ue.width!==y.width||ue.height!==y.height)&&(ue.width=y.width,ue.height=y.height,y.depthTexture.needsUpdate=!0),se?we(y.depthTexture,0):be(y.depthTexture,0);const xe=te.__webglTexture,Z=Rt(y),ee=se?a.TEXTURE_CUBE_MAP_POSITIVE_X+k:a.TEXTURE_2D,pe=y.depthTexture.format===In?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;if(y.depthTexture.format===Nn)_e(y)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,pe,ee,xe,0,Z):a.framebufferTexture2D(a.FRAMEBUFFER,pe,ee,xe,0);else if(y.depthTexture.format===In)_e(y)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,pe,ee,xe,0,Z):a.framebufferTexture2D(a.FRAMEBUFFER,pe,ee,xe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ct(A){const y=i.get(A),k=A.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==A.depthTexture){const se=A.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),se){const te=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,se.removeEventListener("dispose",te)};se.addEventListener("dispose",te),y.__depthDisposeCallback=te}y.__boundDepthTexture=se}if(A.depthTexture&&!y.__autoAllocateDepthBuffer)if(k)for(let se=0;se<6;se++)Ue(y.__webglFramebuffer[se],A,se);else A.texture.mipmaps.length>0?Ue(y.__webglFramebuffer[0],A,0):Ue(y.__webglFramebuffer,A,0);else if(k){y.__webglDepthbuffer=[];for(let se=0;se<6;se++)if(t.bindFramebuffer(a.FRAMEBUFFER,y.__webglFramebuffer[se]),y.__webglDepthbuffer[se]===void 0)y.__webglDepthbuffer[se]=a.createRenderbuffer(),Ze(y.__webglDepthbuffer[se],A,!1);else{const te=A.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,ue=y.__webglDepthbuffer[se];a.bindRenderbuffer(a.RENDERBUFFER,ue),a.framebufferRenderbuffer(a.FRAMEBUFFER,te,a.RENDERBUFFER,ue)}}else if(A.texture.mipmaps.length>0?t.bindFramebuffer(a.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(a.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=a.createRenderbuffer(),Ze(y.__webglDepthbuffer,A,!1);else{const te=A.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,ue=y.__webglDepthbuffer;a.bindRenderbuffer(a.RENDERBUFFER,ue),a.framebufferRenderbuffer(a.FRAMEBUFFER,te,a.RENDERBUFFER,ue)}t.bindFramebuffer(a.FRAMEBUFFER,null)}function dt(A,y,k){const se=i.get(A);y!==void 0&&Me(se.__webglFramebuffer,A,A.texture,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,0),k!==void 0&&ct(A)}function vt(A){const y=A.texture,k=i.get(A),se=i.get(y);A.addEventListener("dispose",O),I(A);const te=A.textures,ue=A.isWebGLCubeRenderTarget===!0,xe=te.length>1;if(xe||(se.__webglTexture===void 0&&(se.__webglTexture=a.createTexture()),se.__version=y.version,r.memory.textures++),ue){k.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(y.mipmaps.length>0){k.__webglFramebuffer[Z]=[];for(let ee=0;ee<y.mipmaps.length;ee++)k.__webglFramebuffer[Z][ee]=a.createFramebuffer()}else k.__webglFramebuffer[Z]=a.createFramebuffer()}else{if(y.mipmaps.length>0){k.__webglFramebuffer=[];for(let Z=0;Z<y.mipmaps.length;Z++)k.__webglFramebuffer[Z]=a.createFramebuffer()}else k.__webglFramebuffer=a.createFramebuffer();if(xe)for(let Z=0,ee=te.length;Z<ee;Z++){const pe=i.get(te[Z]);pe.__webglTexture===void 0&&(pe.__webglTexture=a.createTexture(),r.memory.textures++)}if(A.samples>0&&_e(A)===!1){k.__webglMultisampledFramebuffer=a.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(a.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Z=0;Z<te.length;Z++){const ee=te[Z];k.__webglColorRenderbuffer[Z]=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,k.__webglColorRenderbuffer[Z]);const pe=s.convert(ee.format,ee.colorSpace),P=s.convert(ee.type),j=T(ee.internalFormat,pe,P,ee.normalized,ee.colorSpace,A.isXRRenderTarget===!0),Y=Rt(A);a.renderbufferStorageMultisample(a.RENDERBUFFER,Y,j,A.width,A.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+Z,a.RENDERBUFFER,k.__webglColorRenderbuffer[Z])}a.bindRenderbuffer(a.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=a.createRenderbuffer(),Ze(k.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(a.FRAMEBUFFER,null)}}if(ue){t.bindTexture(a.TEXTURE_CUBE_MAP,se.__webglTexture),it(a.TEXTURE_CUBE_MAP,y);for(let Z=0;Z<6;Z++)if(y.mipmaps.length>0)for(let ee=0;ee<y.mipmaps.length;ee++)Me(k.__webglFramebuffer[Z][ee],A,y,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ee);else Me(k.__webglFramebuffer[Z],A,y,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);w(y)?_(a.TEXTURE_CUBE_MAP):y.mipmaps.length>0&&a.texParameteri(a.TEXTURE_CUBE_MAP,a.TEXTURE_MAX_LEVEL,y.mipmaps.length-1),t.unbindTexture()}else if(xe){for(let Z=0,ee=te.length;Z<ee;Z++){const pe=te[Z],P=i.get(pe);let j=a.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(j=A.isWebGL3DRenderTarget?a.TEXTURE_3D:a.TEXTURE_2D_ARRAY),t.bindTexture(j,P.__webglTexture),it(j,pe),Me(k.__webglFramebuffer,A,pe,a.COLOR_ATTACHMENT0+Z,j,0),w(pe)&&_(j)}t.unbindTexture()}else{let Z=a.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Z=A.isWebGL3DRenderTarget?a.TEXTURE_3D:a.TEXTURE_2D_ARRAY),t.bindTexture(Z,se.__webglTexture),it(Z,y),y.mipmaps.length>0)for(let ee=0;ee<y.mipmaps.length;ee++)Me(k.__webglFramebuffer[ee],A,y,a.COLOR_ATTACHMENT0,Z,ee);else Me(k.__webglFramebuffer,A,y,a.COLOR_ATTACHMENT0,Z,0);w(y)?_(Z):y.mipmaps.length>0&&a.texParameteri(Z,a.TEXTURE_MAX_LEVEL,y.mipmaps.length-1),t.unbindTexture()}A.depthBuffer&&ct(A)}function F(A){const y=A.textures;for(let k=0,se=y.length;k<se;k++){const te=y[k];if(w(te)&&te.mipmapsAutoUpdate===!0){const ue=E(A),xe=i.get(te).__webglTexture;t.bindTexture(ue,xe),_(ue),t.unbindTexture()}}}const Bt=[];function at(A){if(A.samples>0){if(_e(A)===!1){const y=A.textures,k=A.width,se=A.height;let te=a.COLOR_BUFFER_BIT;const ue=A.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,xe=i.get(A),Z=y.length>1;if(Z)for(let pe=0;pe<y.length;pe++)t.bindFramebuffer(a.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+pe,a.RENDERBUFFER,null),t.bindFramebuffer(a.FRAMEBUFFER,xe.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+pe,a.TEXTURE_2D,null,0);t.bindFramebuffer(a.READ_FRAMEBUFFER,xe.__webglMultisampledFramebuffer),A.texture.mipmaps.length>0?t.bindFramebuffer(a.DRAW_FRAMEBUFFER,xe.__webglFramebuffer[0]):t.bindFramebuffer(a.DRAW_FRAMEBUFFER,xe.__webglFramebuffer);for(let pe=0;pe<y.length;pe++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(te|=a.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(te|=a.STENCIL_BUFFER_BIT)),Z){a.framebufferRenderbuffer(a.READ_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.RENDERBUFFER,xe.__webglColorRenderbuffer[pe]);const P=i.get(y[pe]).__webglTexture;a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,P,0)}a.blitFramebuffer(0,0,k,se,0,0,k,se,te,a.NEAREST),l===!0&&(Bt.length=0,Bt.push(a.COLOR_ATTACHMENT0+pe),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&Bt.push(ue),a.invalidateFramebuffer(a.READ_FRAMEBUFFER,Bt))}if(t.bindFramebuffer(a.READ_FRAMEBUFFER,null),t.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),Z)for(let pe=0;pe<y.length;pe++){t.bindFramebuffer(a.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+pe,a.RENDERBUFFER,xe.__webglColorRenderbuffer[pe]);const P=i.get(y[pe]).__webglTexture;t.bindFramebuffer(a.FRAMEBUFFER,xe.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+pe,a.TEXTURE_2D,P,0)}t.bindFramebuffer(a.DRAW_FRAMEBUFFER,xe.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&l){const y=A.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,[y])}}}function Rt(A){return Math.min(n.maxSamples,A.samples)}function _e(A){const y=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Ft(A){const y=r.render.frame;h.get(A)!==y&&(h.set(A,y),A.update())}function Ge(A,y){const k=A.colorSpace,se=A.format,te=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||k!==gr&&k!==Rn&&(gt.getTransfer(k)===Tt?(se!==ji||te!==Ni)&&$e("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):_t("WebGLTextures: Unsupported texture color space:",k)),y}function qe(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=He,this.resetTextureUnits=ie,this.getTextureUnits=ae,this.setTextureUnits=Ce,this.setTexture2D=be,this.setTexture2DArray=Pe,this.setTexture3D=Oe,this.setTextureCube=we,this.rebindTextures=dt,this.setupRenderTarget=vt,this.updateRenderTargetMipmap=F,this.updateMultisampleRenderTarget=at,this.setupDepthRenderbuffer=ct,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=_e,this.dispose=H}function Ev(a,e){function t(i,n=Rn){let s;const r=gt.getTransfer(n);if(i===Ni)return a.UNSIGNED_BYTE;if(i===_l)return a.UNSIGNED_SHORT_4_4_4_4;if(i===Sl)return a.UNSIGNED_SHORT_5_5_5_1;if(i===Mh)return a.UNSIGNED_INT_5_9_9_9_REV;if(i===yh)return a.UNSIGNED_INT_10F_11F_11F_REV;if(i===_h)return a.BYTE;if(i===Sh)return a.SHORT;if(i===ra)return a.UNSIGNED_SHORT;if(i===xl)return a.INT;if(i===tn)return a.UNSIGNED_INT;if(i===Yi)return a.FLOAT;if(i===Ci)return a.HALF_FLOAT;if(i===bh)return a.ALPHA;if(i===wh)return a.RGB;if(i===ji)return a.RGBA;if(i===Nn)return a.DEPTH_COMPONENT;if(i===In)return a.DEPTH_STENCIL;if(i===Ml)return a.RED;if(i===yl)return a.RED_INTEGER;if(i===Yn)return a.RG;if(i===bl)return a.RG_INTEGER;if(i===wl)return a.RGBA_INTEGER;if(i===ar||i===rr||i===or||i===lr)if(r===Tt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ar)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===rr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===or)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===lr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ar)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===rr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===or)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===lr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Eo||i===Ao||i===Ro||i===Co)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Eo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ao)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ro)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Co)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Po||i===Io||i===Do||i===Lo||i===No||i===fr||i===Uo)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Po||i===Io)return r===Tt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Do)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Lo)return s.COMPRESSED_R11_EAC;if(i===No)return s.COMPRESSED_SIGNED_R11_EAC;if(i===fr)return s.COMPRESSED_RG11_EAC;if(i===Uo)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Fo||i===Oo||i===Bo||i===ko||i===zo||i===Go||i===Ho||i===Wo||i===Vo||i===Xo||i===$o||i===qo||i===Yo||i===Ko)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Fo)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Oo)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Bo)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ko)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===zo)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Go)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ho)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Wo)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Vo)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Xo)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===$o)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===qo)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Yo)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ko)return r===Tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Zo||i===Jo||i===Qo)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Zo)return r===Tt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Jo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Qo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===jo||i===el||i===pr||i===tl)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===jo)return s.COMPRESSED_RED_RGTC1_EXT;if(i===el)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===pr)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===tl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ts?a.UNSIGNED_INT_24_8:a[i]!==void 0?a[i]:null}return{convert:t}}const Av=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Rv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Cv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new zh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Ti({vertexShader:Av,fragmentShader:Rv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new V(new Ui(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Pv extends Fn{constructor(e,t){super();const i=this;let n=null,s=1,r=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null;const x=typeof XRWebGLBinding<"u",p=new Cv,g={},S=t.getContextAttributes();let w=null,_=null;const E=[],T=[],v=new re;let M=null,I=null;const R=new Oi;R.viewport=new Xt;const D=new Oi;D.viewport=new Xt;const O=[R,D],W=new Bf;let N=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let be=E[J];return be===void 0&&(be=new Wr,E[J]=be),be.getTargetRaySpace()},this.getControllerGrip=function(J){let be=E[J];return be===void 0&&(be=new Wr,E[J]=be),be.getGripSpace()},this.getHand=function(J){let be=E[J];return be===void 0&&(be=new Wr,E[J]=be),be.getHandSpace()};function K(J){const be=T.indexOf(J.inputSource);if(be===-1)return;const Pe=E[be];Pe!==void 0&&(Pe.update(J.inputSource,J.frame,c||r),Pe.dispatchEvent({type:J.type,data:J.inputSource}))}function B(){n.removeEventListener("select",K),n.removeEventListener("selectstart",K),n.removeEventListener("selectend",K),n.removeEventListener("squeeze",K),n.removeEventListener("squeezestart",K),n.removeEventListener("squeezeend",K),n.removeEventListener("end",B),n.removeEventListener("inputsourceschange",le);for(let J=0;J<E.length;J++){const be=T[J];be!==null&&(T[J]=null,E[J].disconnect(be))}N=null,H=null,p.reset();for(const J in g)delete g[J];if(e.setRenderTarget(w),f=null,d=null,u=null,n=null,_=null,He.stop(),i.isPresenting=!1,e.setPixelRatio(M),e.setSize(v.width,v.height,!1),I!==null){const J=I.camera;J.fov=I.fov,J.zoom=I.zoom,J.updateProjectionMatrix(),I=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,i.isPresenting===!0&&$e("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,i.isPresenting===!0&&$e("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(n,t)),u},this.getFrame=function(){return m},this.getSession=function(){return n},this.setSession=async function(J){if(n=J,n!==null){if(w=e.getRenderTarget(),n.addEventListener("select",K),n.addEventListener("selectstart",K),n.addEventListener("selectend",K),n.addEventListener("squeeze",K),n.addEventListener("squeezestart",K),n.addEventListener("squeezeend",K),n.addEventListener("end",B),n.addEventListener("inputsourceschange",le),S.xrCompatible!==!0&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(v),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Pe=null,Oe=null,we=null;S.depth&&(we=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Pe=S.stencil?In:Nn,Oe=S.stencil?Ts:tn);const Be={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(Be),n.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),_=new Pi(d.textureWidth,d.textureHeight,{format:ji,type:Ni,depthTexture:new Es(d.textureWidth,d.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,Pe),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const Pe={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(n,t,Pe),n.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new Pi(f.framebufferWidth,f.framebufferHeight,{format:ji,type:Ni,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await n.requestReferenceSpace(o),He.setContext(n),He.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function le(J){for(let be=0;be<J.removed.length;be++){const Pe=J.removed[be],Oe=T.indexOf(Pe);Oe>=0&&(T[Oe]=null,E[Oe].disconnect(Pe))}for(let be=0;be<J.added.length;be++){const Pe=J.added[be];let Oe=T.indexOf(Pe);if(Oe===-1){for(let Be=0;Be<E.length;Be++)if(Be>=T.length){T.push(Pe),Oe=Be;break}else if(T[Be]===null){T[Be]=Pe,Oe=Be;break}if(Oe===-1)break}const we=E[Oe];we&&we.connect(Pe)}}function q(J,be){be===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(be.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(n===null)return;let be=J.near,Pe=J.far;p.texture!==null&&(p.depthNear>0&&(be=p.depthNear),p.depthFar>0&&(Pe=p.depthFar)),W.near=D.near=R.near=be,W.far=D.far=R.far=Pe,(N!==W.near||H!==W.far)&&(n.updateRenderState({depthNear:W.near,depthFar:W.far}),N=W.near,H=W.far),W.layers.mask=J.layers.mask|6,R.layers.mask=W.layers.mask&-5,D.layers.mask=W.layers.mask&-3;const Oe=J.parent,we=W.cameras;q(W,Oe);for(let Be=0;Be<we.length;Be++)q(we[Be],Oe);W.projectionMatrix.copy(R.projectionMatrix),W.projectionMatrixInverse.copy(R.projectionMatrixInverse),I===null&&J.isPerspectiveCamera&&(I={camera:J,fov:J.fov,zoom:J.zoom}),ie(J,W,Oe)};function ie(J,be,Pe){Pe===null?J.matrix.copy(be.matrixWorld):(J.matrix.copy(Pe.matrixWorld),J.matrix.invert(),J.matrix.multiply(be.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(be.projectionMatrix),J.projectionMatrixInverse.copy(be.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=la*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(J){l=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(W)},this.getCameraTexture=function(J){return g[J]};let ae=null;function Ce(J,be){if(h=be.getViewerPose(c||r),m=be,h!==null){const Pe=h.views;f!==null&&(e.setRenderTargetFramebuffer(_,f.framebuffer),e.setRenderTarget(_));let Oe=!1;Pe.length!==W.cameras.length&&(W.cameras.length=0,Oe=!0);for(let We=0;We<Pe.length;We++){const it=Pe[We];let lt=null;if(f!==null)lt=f.getViewport(it);else{const ge=u.getViewSubImage(d,it);lt=ge.viewport,We===0&&(e.setRenderTargetTextures(_,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(_))}let ne=O[We];ne===void 0&&(ne=new Oi,ne.layers.enable(We),ne.viewport=new Xt,O[We]=ne),ne.matrix.fromArray(it.transform.matrix),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.projectionMatrix.fromArray(it.projectionMatrix),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert(),ne.viewport.set(lt.x,lt.y,lt.width,lt.height),We===0&&(W.matrix.copy(ne.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),Oe===!0&&W.cameras.push(ne)}const we=n.enabledFeatures;if(we&&we.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&x){u=i.getBinding();const We=u.getDepthInformation(Pe[0]);We&&We.isValid&&We.texture&&p.init(We,n.renderState)}if(we&&we.includes("camera-access")&&x){e.state.unbindTexture(),u=i.getBinding();for(let We=0;We<Pe.length;We++){const it=Pe[We].camera;if(it){let lt=g[it];lt||(lt=new zh,g[it]=lt);const ne=u.getCameraImage(it);lt.sourceTexture=ne}}}}for(let Pe=0;Pe<E.length;Pe++){const Oe=T[Pe],we=E[Pe];Oe!==null&&we!==void 0&&we.update(Oe,be,c||r)}ae&&ae(J,be),be.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:be}),m=null}const He=new ed;He.setAnimationLoop(Ce),this.setAnimationLoop=function(J){ae=J},this.dispose=function(){}}}const Iv=new Ct,hd=new et;hd.set(-1,0,0,0,1,0,0,0,1);function Dv(a,e){function t(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function i(p,g){g.color.getRGB(p.fogColor.value,Kh(a)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function n(p,g,S,w,_){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?s(p,g):g.isMeshLambertMaterial?(s(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(s(p,g),u(p,g)):g.isMeshPhongMaterial?(s(p,g),h(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(s(p,g),d(p,g),g.isMeshPhysicalMaterial&&f(p,g,_)):g.isMeshMatcapMaterial?(s(p,g),m(p,g)):g.isMeshDepthMaterial?s(p,g):g.isMeshDistanceMaterial?(s(p,g),x(p,g)):g.isMeshNormalMaterial?s(p,g):g.isLineBasicMaterial?(r(p,g),g.isLineDashedMaterial&&o(p,g)):g.isPointsMaterial?l(p,g,S,w):g.isSpriteMaterial?c(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,t(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===Ei&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,t(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===Ei&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,t(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,t(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);const S=e.get(g),w=S.envMap,_=S.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4(Iv.makeRotationFromEuler(_)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(hd),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,p.aoMapTransform))}function r(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform))}function o(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,S,w){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*S,p.scale.value=w*.5,g.map&&(p.map.value=g.map,t(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function c(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function h(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function u(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function d(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function f(p,g,S){p.ior.value=g.ior,g.diffuseRoughness>0&&(p.diffuseRoughness.value=g.diffuseRoughness,g.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=g.diffuseRoughnessMap,t(g.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Ei&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.retroreflectivity>0&&(p.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=g.iridescenceThicknessMaximum,g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function x(p,g){const S=e.get(g).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function Lv(a,e,t,i){let n={},s={};function r(S,w){const _=w.program;i.uniformBlockBinding(S,_,n[S.id])}function o(S,w){let _=n[S.id];_===void 0&&(m(S),_=l(S),n[S.id]=_,S.addEventListener("dispose",p));const E=w.program;i.updateUBOMapping(S,E);const T=e.render.frame;s[S.id]!==T&&(c(S),s[S.id]=T)}function l(S){const w=a.createBuffer(),_=S.__size,E=S.usage;return a.bindBuffer(a.UNIFORM_BUFFER,w),a.bufferData(a.UNIFORM_BUFFER,_,E),a.bindBuffer(a.UNIFORM_BUFFER,null),w}function c(S){const w=n[S.id],_=S.uniforms,E=S.__cache;a.bindBuffer(a.UNIFORM_BUFFER,w);for(let T=0,v=_.length;T<v;T++){const M=_[T];if(Array.isArray(M))for(let I=0,R=M.length;I<R;I++)h(M[I],T,I,E);else h(M,T,0,E)}a.bindBuffer(a.UNIFORM_BUFFER,null)}function h(S,w,_,E){if(d(S,w,_,E)===!0){const T=S.__offset,v=S.value;if(Array.isArray(v)){let M=0;for(let I=0;I<v.length;I++){const R=v[I],D=x(R,!0);u(R,S.__data,M),M+=D.storage/Float32Array.BYTES_PER_ELEMENT}}else u(v,S.__data,0);a.bufferSubData(a.UNIFORM_BUFFER,T,S.__data)}}function u(S,w,_){typeof S=="number"||typeof S=="boolean"?w[_]=S:S.isMatrix3?(w[_]=S.elements[0],w[_+1]=S.elements[1],w[_+2]=S.elements[2],w[_+3]=0,w[_+4]=S.elements[3],w[_+5]=S.elements[4],w[_+6]=S.elements[5],w[_+7]=0,w[_+8]=S.elements[6],w[_+9]=S.elements[7],w[_+10]=S.elements[8],w[_+11]=0):ArrayBuffer.isView(S)?w.set(S.subarray(0,w.length-_),_):S.toArray(w,_)}function d(S,w,_,E){const T=S.value,v=w+"_"+_;if(Array.isArray(T)){E[v]===void 0&&(E[v]=[]);const M=E[v];let I=!1;for(let R=0;R<T.length;R++)f(T[R],M,R)===!0&&(I=!0);return I}return f(T,E,v)}function f(S,w,_){if(w[_]===void 0)return typeof S=="number"||typeof S=="boolean"?w[_]=S:ArrayBuffer.isView(S)?w[_]=S.slice():w[_]=S.clone(),!0;{const E=w[_];if(typeof S=="number"||typeof S=="boolean"){if(E!==S)return w[_]=S,!0}else{if(ArrayBuffer.isView(S))return!0;if(E.equals(S)===!1)return E.copy(S),!0}}return!1}function m(S){const w=S.uniforms;let _=0;const E=16;for(let v=0,M=w.length;v<M;v++){const I=Array.isArray(w[v])?w[v]:[w[v]];for(let R=0,D=I.length;R<D;R++){const O=I[R],W=Array.isArray(O.value)?O.value:[O.value],N=Array.isArray(w[v])||Array.isArray(O.value);let H=_;for(let B=0,le=W.length;B<le;B++){const q=W[B],ie=x(q,N),ae=_%E,Ce=ae%ie.boundary,He=ae+Ce;_+=Ce,He!==0&&E-He<ie.storage&&(_+=E-He),B===0&&(H=_),_+=ie.storage}const K=O.type==="int"?Int32Array:O.type==="uint"?Uint32Array:Float32Array;O.__data=new K((_-H)/Float32Array.BYTES_PER_ELEMENT),O.__offset=H}}const T=_%E;return T>0&&(_+=E-T),S.__size=_,S.__cache={},this}function x(S,w){const _={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(_.boundary=4,_.storage=4):S.isVector2?(_.boundary=8,_.storage=8):S.isVector3||S.isColor?(_.boundary=16,_.storage=12):S.isVector4?(_.boundary=16,_.storage=16):S.isMatrix3?(_.boundary=16,_.storage=48):S.isMatrix4?(_.boundary=16,_.storage=64):S.isTexture?$e("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(_.boundary=16,_.storage=S.byteLength):$e("WebGLRenderer: Unsupported uniform value type.",S),w===!0&&(_.boundary=16,_.storage=Math.ceil(_.storage/16)*16),_}function p(S){const w=S.target;w.removeEventListener("dispose",p),a.deleteBuffer(n[w.id]),delete n[w.id],delete s[w.id]}function g(){for(const S in n)a.deleteBuffer(n[S]);n={},s={}}return{bind:r,update:o,dispose:g}}const Nv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ji=null;function Uv(){return Ji===null&&(Ji=new Oh(Nv,16,16,Yn,Ci),Ji.name="DFG_LUT",Ji.minFilter=Ri,Ji.magFilter=Ri,Ji.wrapS=pn,Ji.wrapT=pn,Ji.generateMipmaps=!1,Ji.needsUpdate=!0),Ji}class Fv{constructor(e={}){const{canvas:t=ru(),context:i=null,depth:n=!0,stencil:s=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Ni}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;const x=f,p=new Set([wl,bl,yl]),g=new Set([Ni,tn,ra,Ts,_l,Sl]),S=new Uint32Array(4),w=new Int32Array(4),_={textures:[],min:[],max:[],resolution:[]};let E=null,T=null;const v=[],M=[];let I=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=gn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let D=!1,O=null,W=null,N=null,H=null;this._outputColorSpace=li;let K=0,B=0,le=null,q=-1,ie=null;const ae=new Xt,Ce=new Xt;let He=null;const J=new Ke(0);let be=0,Pe=t.width,Oe=t.height,we=1,Be=null,At=null;const We=new Xt(0,0,Pe,Oe),it=new Xt(0,0,Pe,Oe);let lt=!1;const ne=new ca,ge=new Cl;let ve=!1,Ae=!1;const Me=new Ct,Ze=new C,Ue=new Xt,ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let dt=!1;function vt(){return le===null?we:1}let F=i;function Bt(b,U){return t.getContext(b,U)}let at,Rt,_e,Ft,Ge,qe,A,y,k,se,te,ue,xe,Z,ee,pe,P,j,Y,fe,de,me,De;try{const b={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${hl}`),t.addEventListener("webglcontextlost",ze,!1),t.addEventListener("webglcontextrestored",Je,!1),t.addEventListener("webglcontextcreationerror",Q,!1),F===null){const U="webgl2";if(F=Bt(U,b),F===null)throw Bt(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}je()}catch(b){throw t.removeEventListener("webglcontextlost",ze,!1),t.removeEventListener("webglcontextrestored",Je,!1),t.removeEventListener("webglcontextcreationerror",Q,!1),_t("WebGLRenderer: "+b.message),b}function je(){at=new km(F),at.init(),de=new Ev(F,at),Rt=new Rm(F,at,e,de),_e=new wv(F,at),Rt.reversedDepthBuffer&&d&&_e.buffers.depth.setReversed(!0),W=F.createFramebuffer(),N=F.createFramebuffer(),H=F.createFramebuffer(),Ft=new Hm(F),Ge=new hv,qe=new Tv(F,at,_e,Ge,Rt,de,Ft),A=new Bm(R),y=new Vf(F),me=new Em(F,y),k=new zm(F,y,Ft,me),se=new Vm(F,k,y,me,Ft),j=new Wm(F,Rt,qe),ee=new Cm(Ge),te=new cv(R,A,at,Rt,me,ee),ue=new Dv(R,Ge),xe=new uv,Z=new xv(at),P=new Tm(R,A,_e,se,m,l),pe=new bv(R,se,Rt),De=new Lv(F,Ft,Rt,_e),Y=new Am(F,at,Ft),fe=new Gm(F,at,Ft),Ft.programs=te.programs,R.capabilities=Rt,R.extensions=at,R.properties=Ge,R.renderLists=xe,R.shadowMap=pe,R.state=_e,R.info=Ft}x!==Ni&&(I=new $m(x,t.width,t.height,o,n,s));const ce=new Pv(R,F);this.xr=ce,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const b=at.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=at.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return we},this.setPixelRatio=function(b){b!==void 0&&(we=b,this.setSize(Pe,Oe,!1))},this.getSize=function(b){return b.set(Pe,Oe)},this.setSize=function(b,U,$=!0){if(ce.isPresenting){$e("WebGLRenderer: Can't change size while VR device is presenting.");return}Pe=b,Oe=U,t.width=Math.floor(b*we),t.height=Math.floor(U*we),$===!0&&(t.style.width=b+"px",t.style.height=U+"px"),I!==null&&I.setSize(t.width,t.height),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(Pe*we,Oe*we).floor()},this.setDrawingBufferSize=function(b,U,$){Pe=b,Oe=U,we=$,t.width=Math.floor(b*$),t.height=Math.floor(U*$),this.setViewport(0,0,b,U)},this.setEffects=function(b){if(x===Ni){_t("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let U=0;U<b.length;U++)if(b[U].isOutputPass===!0){$e("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(ae)},this.getViewport=function(b){return b.copy(We)},this.setViewport=function(b,U,$,z){b.isVector4?We.set(b.x,b.y,b.z,b.w):We.set(b,U,$,z),_e.viewport(ae.copy(We).multiplyScalar(vt()).round())},this.getScissor=function(b){return b.copy(it)},this.setScissor=function(b,U,$,z){b.isVector4?it.set(b.x,b.y,b.z,b.w):it.set(b,U,$,z),_e.scissor(Ce.copy(it).multiplyScalar(vt()).round())},this.getScissorTest=function(){return lt},this.setScissorTest=function(b){_e.setScissorTest(lt=b)},this.setOpaqueSort=function(b){Be=b},this.setTransparentSort=function(b){At=b},this.getClearColor=function(b){return b.copy(P.getClearColor())},this.setClearColor=function(){P.setClearColor(...arguments)},this.getClearAlpha=function(){return P.getClearAlpha()},this.setClearAlpha=function(){P.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,$=!0){let z=0;if(b){let G=!1;if(le!==null){const ye=le.texture.format;G=p.has(ye)}if(G){const ye=le.texture.type,Ie=g.has(ye),Se=P.getClearColor(),Ee=P.getClearAlpha(),Fe=Se.r,Qe=Se.g,pt=Se.b;Ie?(S[0]=Fe,S[1]=Qe,S[2]=pt,S[3]=Ee,F.clearBufferuiv(F.COLOR,0,S)):(w[0]=Fe,w[1]=Qe,w[2]=pt,w[3]=Ee,F.clearBufferiv(F.COLOR,0,w))}else z|=F.COLOR_BUFFER_BIT}U&&(z|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(z|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&F.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),O=b},this.dispose=function(){t.removeEventListener("webglcontextlost",ze,!1),t.removeEventListener("webglcontextrestored",Je,!1),t.removeEventListener("webglcontextcreationerror",Q,!1),P.dispose(),xe.dispose(),Z.dispose(),qe.dispose(),Ge.dispose(),A.dispose(),se.dispose(),k.dispose(),me.dispose(),De.dispose(),te.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",Ut),ce.removeEventListener("sessionend",kt),Yt.stop()};function ze(b){b.preventDefault(),Ql("WebGLRenderer: Context Lost."),D=!0}function Je(){Ql("WebGLRenderer: Context Restored."),D=!1;const b=Ft.autoReset,U=pe.enabled,$=pe.autoUpdate,z=pe.needsUpdate,G=pe.type;je(),Ft.autoReset=b,pe.enabled=U,pe.autoUpdate=$,pe.needsUpdate=z,pe.type=G}function Q(b){_t("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Re(b){const U=b.target;U.removeEventListener("dispose",Re),ht(U)}function ht(b){Mt(b),Ge.remove(b)}function Mt(b){const U=Ge.get(b).programs;U!==void 0&&(U.forEach(function($){te.releaseProgram($)}),b.isShaderMaterial&&te.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,$,z,G,ye){U===null&&(U=ct);const Ie=G.isMesh&&G.matrixWorld.determinantAffine()<0,Se=bd(b,U,$,z,G);_e.setMaterial(z,Ie);let Ee=$.index,Fe=1;if(z.wireframe===!0){if(Ee=k.getWireframeAttribute($),Ee===void 0)return;Fe=2}const Qe=$.drawRange,pt=$.attributes.position;let Le=Qe.start*Fe,mt=(Qe.start+Qe.count)*Fe;ye!==null&&(Le=Math.max(Le,ye.start*Fe),mt=Math.min(mt,(ye.start+ye.count)*Fe)),Ee!==null?(Le=Math.max(Le,0),mt=Math.min(mt,Ee.count)):pt!=null&&(Le=Math.max(Le,0),mt=Math.min(mt,pt.count));const Kt=mt-Le;if(Kt<0||Kt===1/0)return;me.setup(G,z,Se,$,Ee);let Nt,Dt=Y;if(Ee!==null&&(Nt=y.get(Ee),Dt=fe,Dt.setIndex(Nt)),G.isMesh)z.wireframe===!0?(_e.setLineWidth(z.wireframeLinewidth*vt()),Dt.setMode(F.LINES)):Dt.setMode(F.TRIANGLES);else if(G.isLine){let di=z.linewidth;di===void 0&&(di=1),_e.setLineWidth(di*vt()),G.isLineSegments?Dt.setMode(F.LINES):G.isLineLoop?Dt.setMode(F.LINE_LOOP):Dt.setMode(F.LINE_STRIP)}else G.isPoints?Dt.setMode(F.POINTS):G.isSprite&&Dt.setMode(F.TRIANGLES);if(G.isBatchedMesh)if(at.get("WEBGL_multi_draw"))Dt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const di=G._multiDrawStarts,Ne=G._multiDrawCounts,xi=G._multiDrawCount,bt=Ee?y.get(Ee).bytesPerElement:1,On=Ge.get(z).currentProgram.getUniforms();for(let ui=0;ui<xi;ui++)On.setValue(F,"_gl_DrawID",ui),Dt.render(di[ui]/bt,Ne[ui])}else if(G.isInstancedMesh)Dt.renderInstances(Le,Kt,G.count);else if($.isInstancedBufferGeometry){const di=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ne=Math.min($.instanceCount,di);Dt.renderInstances(Le,Kt,Ne)}else Dt.render(Le,Kt)};function yt(b,U,$,z){O!==null&&b.isNodeMaterial&&O.setObject(z,b),ve===!0&&ee.setState(b,$,!1),b.transparent===!0&&b.side===Ot&&b.forceSinglePass===!1?(b.side=Ei,b.needsUpdate=!0,Os(b,U,z),b.side=qn,b.needsUpdate=!0,Os(b,U,z),b.side=Ot):Os(b,U,z)}this.compile=function(b,U,$=null){$===null&&($=b),O!==null&&O.renderStart(b,U,$),T=Z.get($),T.init(U),M.push(T),$.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),b!==$&&b.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights(),O!==null&&O.updateLights(T.state.lightsArray),Ae=this.localClippingEnabled,ve=ee.init(this.clippingPlanes,Ae),ve===!0&&ee.setGlobalState(this.clippingPlanes,U),O!==null&&pe.render(T.state.shadowsArray,$,U);const z=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const ye=G.material;if(ye)if(Array.isArray(ye))for(let Ie=0;Ie<ye.length;Ie++){const Se=ye[Ie];yt(Se,$,U,G),z.add(Se)}else yt(ye,$,U,G),z.add(ye)}),T=M.pop(),O!==null&&O.renderEnd(),z},this.compileAsync=function(b,U,$=null){const z=this.compile(b,U,$);return new Promise(G=>{function ye(){if(z.forEach(function(Ie){const Ee=Ge.get(Ie).currentProgram;(Ee===void 0||Ee.isReady())&&z.delete(Ie)}),z.size===0){G(b);return}setTimeout(ye,10)}at.get("KHR_parallel_shader_compile")!==null?ye():setTimeout(ye,10)})};let ut=null;function It(b){ut&&ut(b)}function Ut(){Yt.stop()}function kt(){Yt.start()}const Yt=new ed;Yt.setAnimationLoop(It),typeof self<"u"&&Yt.setContext(self),this.setAnimationLoop=function(b){ut=b,ce.setAnimationLoop(b),b===null?Yt.stop():Yt.start()},ce.addEventListener("sessionstart",Ut),ce.addEventListener("sessionend",kt),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){_t("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;O!==null&&O.renderStart(b,U);const $=ce.enabled===!0&&ce.isPresenting===!0,z=I!==null&&(le===null||$)&&I.begin(R,le);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(U),U=ce.getCamera()),b.isScene===!0&&b.onBeforeRender(R,b,U,le),T=Z.get(b,M.length),T.init(U),T.state.textureUnits=qe.getTextureUnits(),M.push(T),Me.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera?ge.setFromArrayCamera(U):ne.setFromProjectionMatrix(Me,Ki,U.reversedDepth),Ae=this.localClippingEnabled,ve=ee.init(this.clippingPlanes,Ae),E=xe.get(b,v.length),E.init(),v.push(E),this.info.render.frame++,ce.enabled===!0&&ce.isPresenting===!0){const Ie=R.xr.getDepthSensingMesh();Ie!==null&&hi(Ie,U,-1/0,R.sortObjects)}hi(b,U,0,R.sortObjects),E.finish(),O!==null&&O.updateLights(T.state.lightsArray),R.sortObjects===!0&&E.sort(Be,At),dt=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,dt&&P.addToRenderList(E,b),this.info.autoReset===!0&&this.info.reset(),ve===!0&&ee.beginShadows();const G=T.state.shadowsArray;if(pe.render(G,b,U),ve===!0&&ee.endShadows(),(z&&I.hasRenderPass())===!1){const Ie=E.opaque,Se=E.transmissive;if(T.setupLights(),U.isArrayCamera){const Ee=U.cameras;if(Se.length>0)for(let Fe=0,Qe=Ee.length;Fe<Qe;Fe++){const pt=Ee[Fe];vi(Ie,Se,b,pt)}dt&&P.render(b);for(let Fe=0,Qe=Ee.length;Fe<Qe;Fe++){const pt=Ee[Fe];gi(E,b,pt,pt.viewport)}}else Se.length>0&&vi(Ie,Se,b,U),dt&&P.render(b),gi(E,b,U)}le!==null&&B===0&&(qe.updateMultisampleRenderTarget(le),qe.updateRenderTargetMipmap(le)),z&&I.end(R),b.isScene===!0&&b.onAfterRender(R,b,U),me.resetDefaultState(),q=-1,ie=null,M.pop(),M.length>0?(T=M[M.length-1],qe.setTextureUnits(T.state.textureUnits),ve===!0&&ee.setGlobalState(R.clippingPlanes,T.state.camera)):T=null,v.pop(),v.length>0?E=v[v.length-1]:E=null,O!==null&&O.renderEnd()};function hi(b,U,$,z){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)$=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)T.pushLight(b),b.castShadow&&T.pushShadow(b);else if(b.isSprite){const Ie=U.isArrayCamera?ge:ne;if(!b.frustumCulled||b.intersectsFrustum(Ie)){z&&Ue.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Me);const Se=se.update(b),Ee=b.material;Ee.visible&&E.push(b,Se,Ee,$,Ue.z,null,U)}}else if(b.isMesh||b.isLine||b.isPoints){const Ie=U.isArrayCamera?ge:ne;if(!b.frustumCulled||b.intersectsFrustum(Ie)){const Se=se.update(b),Ee=b.material;if(z&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ue.copy(b.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Ue.copy(Se.boundingSphere.center)),Ue.applyMatrix4(b.matrixWorld).applyMatrix4(Me)),Array.isArray(Ee)){const Fe=Se.groups;for(let Qe=0,pt=Fe.length;Qe<pt;Qe++){const Le=Fe[Qe],mt=Ee[Le.materialIndex];mt&&mt.visible&&E.push(b,Se,mt,$,Ue.z,Le,U)}}else Ee.visible&&E.push(b,Se,Ee,$,Ue.z,null,U)}}}const ye=b.children;for(let Ie=0,Se=ye.length;Ie<Se;Ie++)hi(ye[Ie],U,$,z)}function gi(b,U,$,z){const{opaque:G,transmissive:ye,transparent:Ie}=b;T.setupLightsView($),ve===!0&&ee.setGlobalState(R.clippingPlanes,$),z&&_e.viewport(ae.copy(z)),G.length>0&&xa(G,U,$),ye.length>0&&xa(ye,U,$),Ie.length>0&&xa(Ie,U,$),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function vi(b,U,$,z){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[z.id]===void 0){const Le=at.has("EXT_color_buffer_half_float")||at.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[z.id]=new Pi(1,1,{generateMipmaps:!0,type:Le?Ci:Ni,minFilter:Pn,samples:Math.max(4,Rt.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:gt.workingColorSpace})}const ye=T.state.transmissionRenderTarget[z.id],Ie=z.viewport||ae;ye.setSize(Ie.z*R.transmissionResolutionScale,Ie.w*R.transmissionResolutionScale);const Se=R.getRenderTarget(),Ee=R.getActiveCubeFace(),Fe=R.getActiveMipmapLevel();R.setRenderTarget(ye),R.getClearColor(J),be=R.getClearAlpha(),be<1&&R.setClearColor(16777215,.5),R.clear(),dt&&P.render($);const Qe=R.toneMapping;R.toneMapping=gn;const pt=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),T.setupLightsView(z),ve===!0&&ee.setGlobalState(R.clippingPlanes,z),xa(b,$,z),qe.updateMultisampleRenderTarget(ye),qe.updateRenderTargetMipmap(ye),at.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let mt=0,Kt=U.length;mt<Kt;mt++){const Nt=U[mt],{object:Dt,geometry:di,material:Ne,group:xi}=Nt;if(Ne.side===Ot&&Dt.layers.test(z.layers)){const bt=Ne.side;Ne.side=Ei,Ne.needsUpdate=!0,Gl(Dt,$,z,di,Ne,xi),Ne.side=bt,Ne.needsUpdate=!0,Le=!0}}Le===!0&&(qe.updateMultisampleRenderTarget(ye),qe.updateRenderTargetMipmap(ye))}R.setRenderTarget(Se,Ee,Fe),R.setClearColor(J,be),pt!==void 0&&(z.viewport=pt),R.toneMapping=Qe}function xa(b,U,$){const z=U.isScene===!0?U.overrideMaterial:null;for(let G=0,ye=b.length;G<ye;G++){const Ie=b[G],{object:Se,geometry:Ee,group:Fe}=Ie;let Qe=Ie.material;Qe.allowOverride===!0&&z!==null&&(Qe=z),Se.layers.test($.layers)&&Gl(Se,U,$,Ee,Qe,Fe)}}function Gl(b,U,$,z,G,ye){O!==null&&G.isNodeMaterial&&O.setObject(b,G),b.onBeforeRender(R,U,$,z,G,ye),b.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(R,U,$,z,b,ye),G.transparent===!0&&G.side===Ot&&G.forceSinglePass===!1?(G.side=Ei,G.needsUpdate=!0,R.renderBufferDirect($,U,z,G,b,ye),G.side=qn,G.needsUpdate=!0,R.renderBufferDirect($,U,z,G,b,ye),G.side=Ot):R.renderBufferDirect($,U,z,G,b,ye),b.onAfterRender(R,U,$,z,G,ye)}function Hl(b){let U=0;for(const $ of b)$.texture!==null&&U++;return U}function Os(b,U,$){U.isScene!==!0&&(U=ct);const z=Ge.get(b),G=T.state.lights,ye=T.state.shadowsArray,Ie=G.state.version,Se=te.getParameters(b,G.state,ye,U,$,T.state.lightProbeGridArray),Ee=te.getProgramCacheKey(Se);let Fe=z.programs;z.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?U.environment:null,z.fog=U.fog;const Qe=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;z.envMap=A.get(b.envMap||z.environment,Qe),z.envMapRotation=z.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Fe===void 0&&(b.addEventListener("dispose",Re),Fe=new Map,z.programs=Fe,z.programVariants=new Map);let pt=Fe.get(Ee);if(pt!==void 0){if(z.currentProgram===pt&&z.lightsStateVersion===Ie)return Vl(b,Se),pt}else Se.uniforms=te.getUniforms(b),O!==null&&b.isNodeMaterial&&O.build(b,$,Se),b.onBeforeCompile(Se,R),pt=te.acquireProgram(Se,Ee),Fe.set(Ee,pt),z.uniforms=Se.uniforms;const Le=z.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Le.clippingPlanes=ee.uniform),Vl(b,Se),z.needsLights=Td(b),z.lightsStateVersion=Ie,z.needsLights&&(Le.ambientLightColor.value=G.state.ambient,Le.lightProbe.value=G.state.probe,Le.sunLights.value=G.state.sun,Le.sunLightShadows.value=G.state.sunShadow,Le.directionalLights.value=G.state.directional,Le.directionalLightShadows.value=G.state.directionalShadow,Le.spotLights.value=G.state.spot,Le.spotLightShadows.value=G.state.spotShadow,Le.rectAreaLights.value=G.state.rectArea,Le.ltc_1.value=G.state.rectAreaLTC1,Le.ltc_2.value=G.state.rectAreaLTC2,Le.pointLights.value=G.state.point,Le.pointLightShadows.value=G.state.pointShadow,Le.hemisphereLights.value=G.state.hemi,Le.sunShadowMatrix.value=G.state.sunShadowMatrix,Le.sunShadowCascade.value=G.state.sunShadowCascade,Le.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Le.spotLightMatrix.value=G.state.spotLightMatrix,Le.spotLightMap.value=G.state.spotLightMap,Le.pointShadowMatrix.value=G.state.pointShadowMatrix),z.numLightProbeGrids=Hl(T.state.lightProbeGridArray),z.currentProgram=pt,z.uniformsList=null,pt}function yd(b,U,$,z,G){const ye=Ge.get(b),Ie=ye.currentProgram.id+","+z+","+G;let Se=ye.programVariants.get(Ie);return Se===void 0?(Se=Os(b,U,$),ye.programVariants.set(Ie,Se)):(ye.currentProgram=Se,ye.uniformsList=null,ye.outputColorSpace=z,ye.toneMapping=G),Se}function Wl(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=hr.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function Vl(b,U){const $=Ge.get(b);$.outputColorSpace=U.outputColorSpace,$.batching=U.batching,$.batchingColor=U.batchingColor,$.instancing=U.instancing,$.instancingColor=U.instancingColor,$.instancingMorph=U.instancingMorph,$.skinning=U.skinning,$.morphTargets=U.morphTargets,$.morphNormals=U.morphNormals,$.morphColors=U.morphColors,$.morphTargetsCount=U.morphTargetsCount,$.numClippingPlanes=U.numClippingPlanes,$.numIntersection=U.numClipIntersection,$.vertexAlphas=U.vertexAlphas,$.vertexTangents=U.vertexTangents,$.toneMapping=U.toneMapping}function bd(b,U,$,z,G){U.isScene!==!0&&(U=ct),qe.resetTextureUnits();const ye=U.fog,Ie=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?U.environment:null,Se=le===null?R.outputColorSpace:le.isXRRenderTarget===!0?le.texture.colorSpace:gt.workingColorSpace,Ee=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Fe=A.get(z.envMap||Ie,Ee),Qe=z.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pt=!!$.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Le=!!$.morphAttributes.position,mt=!!$.morphAttributes.normal,Kt=!!$.morphAttributes.color;let Nt=gn;z.toneMapped&&(le===null||le.isXRRenderTarget===!0)&&(Nt=R.toneMapping);const Dt=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,di=Dt!==void 0?Dt.length:0,Ne=Ge.get(z),xi=T.state.lights;if(ve===!0&&(Ae===!0||b!==ie)){const zt=b===ie&&z.id===q;ee.setState(z,b,zt)}let bt=!1,On=!1;z.version===Ne.__version?Ne.needsLights&&Ne.lightsStateVersion!==xi.state.version||G.isBatchedMesh&&Ne.batching===!1||!G.isBatchedMesh&&Ne.batching===!0||G.isBatchedMesh&&Ne.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Ne.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Ne.instancing===!1||!G.isInstancedMesh&&Ne.instancing===!0||G.isSkinnedMesh&&Ne.skinning===!1||!G.isSkinnedMesh&&Ne.skinning===!0||G.isInstancedMesh&&Ne.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ne.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ne.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ne.instancingMorph===!1&&G.morphTexture!==null||Ne.envMap!==Fe||z.fog===!0&&Ne.fog!==ye||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==ee.numPlanes||Ne.numIntersection!==ee.numIntersection)||Ne.vertexAlphas!==Qe||Ne.vertexTangents!==pt||Ne.morphTargets!==Le||Ne.morphNormals!==mt||Ne.morphColors!==Kt||Ne.morphTargetsCount!==di||Ne.numLightProbeGrids!==Hl(T.state.lightProbeGridArray)?bt=!0:(Ne.outputColorSpace!==Se||Ne.toneMapping!==Nt)&&(On=!0):(bt=!0,Ne.__version=z.version);let ui=Ne.currentProgram;(bt===!0||On===!0)&&(ui=On===!0?yd(z,U,G,Se,Nt):Os(z,U,G),O&&z.isNodeMaterial&&O.onUpdateProgram(z,ui,Ne));let _a=!1,Sn=!1,Bn=!1;const xt=ui.getUniforms(),ai=Ne.uniforms;if(_e.useProgram(ui.program)&&(_a=!0,Sn=!0,Bn=!0),z.id!==q&&(q=z.id,Sn=!0),_a||ie!==b){_e.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),xt.setValue(F,"projectionMatrix",b.projectionMatrix),xt.setValue(F,"viewMatrix",b.matrixWorldInverse);const ii=xt.map.cameraPosition;ii!==void 0&&ii.setValue(F,Ze.setFromMatrixPosition(b.matrixWorld)),Rt.logarithmicDepthBuffer&&xt.setValue(F,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&xt.setValue(F,"isOrthographic",b.isOrthographicCamera===!0),ie!==b&&(ie=b,Sn=!0,Bn=!0)}if(Ne.needsLights&&(xi.state.sunShadowMap.length>0&&xt.setValue(F,"sunShadowMap",xi.state.sunShadowMap,qe),xi.state.directionalShadowMap.length>0&&xt.setValue(F,"directionalShadowMap",xi.state.directionalShadowMap,qe),xi.state.spotShadowMap.length>0&&xt.setValue(F,"spotShadowMap",xi.state.spotShadowMap,qe),xi.state.pointShadowMap.length>0&&xt.setValue(F,"pointShadowMap",xi.state.pointShadowMap,qe)),G.isSkinnedMesh){xt.setOptional(F,G,"bindMatrix"),xt.setOptional(F,G,"bindMatrixInverse");const zt=G.skeleton;zt&&(zt.boneTexture===null&&zt.computeBoneTexture(),xt.setValue(F,"boneTexture",zt.boneTexture,qe))}G.isBatchedMesh&&(xt.setOptional(F,G,"batchingTexture"),xt.setValue(F,"batchingTexture",G._matricesTexture,qe),xt.setOptional(F,G,"batchingIdTexture"),xt.setValue(F,"batchingIdTexture",G._indirectTexture,qe),xt.setOptional(F,G,"batchingColorTexture"),G._colorsTexture!==null&&xt.setValue(F,"batchingColorTexture",G._colorsTexture,qe));const Hi=$.morphAttributes;if((Hi.position!==void 0||Hi.normal!==void 0||Hi.color!==void 0)&&j.update(G,$,ui),(Sn||Ne.receiveShadow!==G.receiveShadow)&&(Ne.receiveShadow=G.receiveShadow,xt.setValue(F,"receiveShadow",G.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&U.environment!==null&&(ai.envMapIntensity.value=U.environmentIntensity),ai.dfgLUT!==void 0&&(ai.dfgLUT.value=Uv()),Sn){if(xt.setValue(F,"toneMappingExposure",R.toneMappingExposure),Ne.needsLights&&wd(ai,Bn),ye&&z.fog===!0&&ue.refreshFogUniforms(ai,ye),ue.refreshMaterialUniforms(ai,z,we,Oe,T.state.transmissionRenderTarget[b.id]),Ne.needsLights&&Ne.numLightProbeGrids>0){const zt=_;let ii=0;for(const an of T.state.lightProbeGridArray)an.texture!==null&&(zt.textures[ii]=an.texture,zt.min[ii]=an.boundingBox.min,zt.max[ii]=an.boundingBox.max,zt.resolution[ii]=an.resolution,ii++);for(const an in zt)zt[an].length=ii;ai.probesSH.value=zt.textures,ai.probesMin.value=zt.min,ai.probesMax.value=zt.max,ai.probesResolution.value=zt.resolution}hr.upload(F,Wl(Ne),ai,qe)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(hr.upload(F,Wl(Ne),ai,qe),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&xt.setValue(F,"center",G.center),xt.setValue(F,"modelViewMatrix",G.modelViewMatrix),xt.setValue(F,"normalMatrix",G.normalMatrix),xt.setValue(F,"modelMatrix",G.matrixWorld),z.uniformsGroups!==void 0){const zt=z.uniformsGroups;for(let ii=0,an=zt.length;ii<an;ii++){const $l=zt[ii];De.update($l,ui),De.bind($l,ui)}}return ui}function wd(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.sunLights.needsUpdate=U,b.sunLightShadows.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function Td(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return K},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return le},this.setRenderTargetTextures=function(b,U,$){const z=Ge.get(b);z.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),Ge.get(b.texture).__webglTexture=U,Ge.get(b.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:$,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){const $=Ge.get(b);$.__webglFramebuffer=U,$.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,$=0){le=b,K=U,B=$;let z=null,G=!1,ye=!1;if(b){const Se=Ge.get(b);if(Se.__useDefaultFramebuffer!==void 0){_e.bindFramebuffer(F.FRAMEBUFFER,Se.__webglFramebuffer),ae.copy(b.viewport),Ce.copy(b.scissor),He=b.scissorTest,_e.viewport(ae),_e.scissor(Ce),_e.setScissorTest(He),q=-1;return}else if(Se.__webglFramebuffer===void 0)qe.setupRenderTarget(b);else if(Se.__hasExternalTextures)qe.rebindTextures(b,Ge.get(b.texture).__webglTexture,Ge.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Qe=b.depthTexture;if(Se.__boundDepthTexture!==Qe){if(Qe!==null&&Ge.has(Qe)&&(b.width!==Qe.image.width||b.height!==Qe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");qe.setupDepthRenderbuffer(b)}}const Ee=b.texture;(Ee.isData3DTexture||Ee.isDataArrayTexture||Ee.isCompressedArrayTexture)&&(ye=!0);const Fe=Ge.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Fe[U])?z=Fe[U][$]:z=Fe[U],G=!0):b.samples>0&&qe.useMultisampledRTT(b)===!1?z=Ge.get(b).__webglMultisampledFramebuffer:Array.isArray(Fe)?z=Fe[$]:z=Fe,ae.copy(b.viewport),Ce.copy(b.scissor),He=b.scissorTest}else ae.copy(We).multiplyScalar(we).floor(),Ce.copy(it).multiplyScalar(we).floor(),He=lt;if($!==0&&(z=W),_e.bindFramebuffer(F.FRAMEBUFFER,z)&&_e.drawBuffers(b,z),_e.viewport(ae),_e.scissor(Ce),_e.setScissorTest(He),G){const Se=Ge.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+U,Se.__webglTexture,$)}else if(ye){const Se=U;for(let Ee=0;Ee<b.textures.length;Ee++){const Fe=Ge.get(b.textures[Ee]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Ee,Fe.__webglTexture,$,Se)}}else if(b!==null&&$!==0){const Se=Ge.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Se.__webglTexture,$)}q=-1};function Xl(b){const U=Ge.get(b);return(U.__readFormat!==b.format||U.__readType!==b.type)&&(U.__readFormat=b.format,U.__readType=b.type,U.__formatReadable=Rt.textureFormatReadable(b.format),U.__typeReadable=Rt.textureTypeReadable(b.type)),U}this.readRenderTargetPixels=function(b,U,$,z,G,ye,Ie,Se=0){if(!(b&&b.isWebGLRenderTarget)){_t("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=Ge.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ee=Ee[Ie],Array.isArray(Ee)&&(Ee=Ee[0])),Ee){_e.bindFramebuffer(F.FRAMEBUFFER,Ee);try{const Fe=b.textures[Se],Qe=Fe.format,pt=Fe.type;b.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Se);const Le=Xl(Fe);if(Le.__formatReadable===!1){_t("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Le.__typeReadable===!1){_t("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-z&&$>=0&&$<=b.height-G&&F.readPixels(U,$,z,G,de.convert(Qe),de.convert(pt),ye)}finally{const Fe=le!==null?Ge.get(le).__webglFramebuffer:null;_e.bindFramebuffer(F.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(b,U,$,z,G,ye,Ie,Se=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=Ge.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ee=Ee[Ie],Array.isArray(Ee)&&(Ee=Ee[0])),Ee)if(U>=0&&U<=b.width-z&&$>=0&&$<=b.height-G){_e.bindFramebuffer(F.FRAMEBUFFER,Ee);const Fe=b.textures[Se],Qe=Fe.format,pt=Fe.type;b.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Se);const Le=Xl(Fe);if(Le.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Le.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const mt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,mt),F.bufferData(F.PIXEL_PACK_BUFFER,ye.byteLength,F.STREAM_READ),F.readPixels(U,$,z,G,de.convert(Qe),de.convert(pt),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);const Kt=le!==null?Ge.get(le).__webglFramebuffer:null;_e.bindFramebuffer(F.FRAMEBUFFER,Kt);const Nt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await ou(F,Nt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,mt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ye),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(mt),F.deleteSync(Nt),ye}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,$=0){const z=Math.pow(2,-$),G=Math.floor(b.image.width*z),ye=Math.floor(b.image.height*z),Ie=U!==null?U.x:0,Se=U!==null?U.y:0;qe.setTexture2D(b,0),F.copyTexSubImage2D(F.TEXTURE_2D,$,0,0,Ie,Se,G,ye),_e.unbindTexture()},this.copyTextureToTexture=function(b,U,$=null,z=null,G=0,ye=0){let Ie,Se,Ee,Fe,Qe,pt,Le,mt,Kt;const Nt=b.isCompressedTexture?b.mipmaps[ye]:b.image;if($!==null)Ie=$.max.x-$.min.x,Se=$.max.y-$.min.y,Ee=$.isBox3?$.max.z-$.min.z:1,Fe=$.min.x,Qe=$.min.y,pt=$.isBox3?$.min.z:0;else{const xt=Math.pow(2,-G);Ie=Math.floor(Nt.width*xt),Se=Math.floor(Nt.height*xt),b.isDataArrayTexture?Ee=Nt.depth:b.isData3DTexture?Ee=Math.floor(Nt.depth*xt):Ee=1,Fe=0,Qe=0,pt=0}z!==null?(Le=z.x,mt=z.y,Kt=z.z):(Le=0,mt=0,Kt=0);const Dt=de.convert(U.format),di=de.convert(U.type);let Ne;U.isData3DTexture?(qe.setTexture3D(U,0),Ne=F.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(qe.setTexture2DArray(U,0),Ne=F.TEXTURE_2D_ARRAY):(qe.setTexture2D(U,0),Ne=F.TEXTURE_2D),_e.activeTexture(F.TEXTURE0),_e.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,U.flipY),_e.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),_e.pixelStorei(F.UNPACK_ALIGNMENT,U.unpackAlignment);const xi=_e.getParameter(F.UNPACK_ROW_LENGTH),bt=_e.getParameter(F.UNPACK_IMAGE_HEIGHT),On=_e.getParameter(F.UNPACK_SKIP_PIXELS),ui=_e.getParameter(F.UNPACK_SKIP_ROWS),_a=_e.getParameter(F.UNPACK_SKIP_IMAGES);_e.pixelStorei(F.UNPACK_ROW_LENGTH,Nt.width),_e.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Nt.height),_e.pixelStorei(F.UNPACK_SKIP_PIXELS,Fe),_e.pixelStorei(F.UNPACK_SKIP_ROWS,Qe),_e.pixelStorei(F.UNPACK_SKIP_IMAGES,pt);const Sn=b.isDataArrayTexture||b.isData3DTexture,Bn=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){const xt=Ge.get(b),ai=Ge.get(U),Hi=Ge.get(xt.__renderTarget),zt=Ge.get(ai.__renderTarget);_e.bindFramebuffer(F.READ_FRAMEBUFFER,Hi.__webglFramebuffer),_e.bindFramebuffer(F.DRAW_FRAMEBUFFER,zt.__webglFramebuffer);for(let ii=0;ii<Ee;ii++)Sn&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ge.get(b).__webglTexture,G,pt+ii),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ge.get(U).__webglTexture,ye,Kt+ii)),F.blitFramebuffer(Fe,Qe,Fe+Ie,Qe+Se,Le,mt,Le+Ie,mt+Se,F.DEPTH_BUFFER_BIT,F.NEAREST);_e.bindFramebuffer(F.READ_FRAMEBUFFER,null),_e.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(G!==0||b.isRenderTargetTexture||Ge.has(b)){const xt=Ge.get(b),ai=Ge.get(U);_e.bindFramebuffer(F.READ_FRAMEBUFFER,N),_e.bindFramebuffer(F.DRAW_FRAMEBUFFER,H);for(let Hi=0;Hi<Ee;Hi++)Sn?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,xt.__webglTexture,G,pt+Hi):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,xt.__webglTexture,G),Bn?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ai.__webglTexture,ye,Kt+Hi):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ai.__webglTexture,ye),G!==0?F.blitFramebuffer(Fe,Qe,Fe+Ie,Qe+Se,Le,mt,Le+Ie,mt+Se,F.COLOR_BUFFER_BIT,F.NEAREST):Bn?F.copyTexSubImage3D(Ne,ye,Le,mt,Kt+Hi,Fe,Qe,Ie,Se):F.copyTexSubImage2D(Ne,ye,Le,mt,Fe,Qe,Ie,Se);_e.bindFramebuffer(F.READ_FRAMEBUFFER,null),_e.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Bn?b.isDataTexture||b.isData3DTexture?F.texSubImage3D(Ne,ye,Le,mt,Kt,Ie,Se,Ee,Dt,di,Nt.data):U.isCompressedArrayTexture?F.compressedTexSubImage3D(Ne,ye,Le,mt,Kt,Ie,Se,Ee,Dt,Nt.data):F.texSubImage3D(Ne,ye,Le,mt,Kt,Ie,Se,Ee,Dt,di,Nt):b.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ye,Le,mt,Ie,Se,Dt,di,Nt.data):b.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ye,Le,mt,Nt.width,Nt.height,Dt,Nt.data):F.texSubImage2D(F.TEXTURE_2D,ye,Le,mt,Ie,Se,Dt,di,Nt);_e.pixelStorei(F.UNPACK_ROW_LENGTH,xi),_e.pixelStorei(F.UNPACK_IMAGE_HEIGHT,bt),_e.pixelStorei(F.UNPACK_SKIP_PIXELS,On),_e.pixelStorei(F.UNPACK_SKIP_ROWS,ui),_e.pixelStorei(F.UNPACK_SKIP_IMAGES,_a),ye===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0&&F.generateMipmap(Ne),_e.unbindTexture()},this.initRenderTarget=function(b){Ge.get(b).__webglFramebuffer===void 0&&qe.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?qe.setTextureCube(b,0):b.isData3DTexture?qe.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?qe.setTexture2DArray(b,0):qe.setTexture2D(b,0),_e.unbindTexture()},this.resetState=function(){K=0,B=0,le=null,_e.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ki}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=gt._getDrawingBufferColorSpace(e),t.unpackColorSpace=gt._getUnpackColorSpace()}}const rh={type:"change"},kl={type:"start"},dd={type:"end"},Za=new Cr,oh=new un,Ov=Math.cos(70*oi.DEG2RAD),jt=new C,Ai=2*Math.PI,wt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},fo=1e-6;class Bv extends Hf{constructor(e,t=null){super(e,t),this.state=wt.NONE,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:mn.ROTATE,MIDDLE:mn.DOLLY,RIGHT:mn.PAN},this.touches={ONE:Cn.ROTATE,TWO:Cn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new Un,this._lastTargetPosition=new C,this._quat=new Un().setFromUnitVectors(e.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Oc,this._sphericalDelta=new Oc,this._scale=1,this._panOffset=new C,this._rotateStart=new re,this._rotateEnd=new re,this._rotateDelta=new re,this._panStart=new re,this._panEnd=new re,this._panDelta=new re,this._dollyStart=new re,this._dollyEnd=new re,this._dollyDelta=new re,this._dollyDirection=new C,this._mouse=new re,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=zv.bind(this),this._onPointerDown=kv.bind(this),this._onPointerUp=Gv.bind(this),this._onContextMenu=Yv.bind(this),this._onMouseWheel=Vv.bind(this),this._onKeyDown=Xv.bind(this),this._onTouchStart=$v.bind(this),this._onTouchMove=qv.bind(this),this._onMouseDown=Hv.bind(this),this._onMouseMove=Wv.bind(this),this._interceptControlDown=Kv.bind(this),this._interceptControlUp=Zv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=wt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(rh),this.update(),this.state=wt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;jt.copy(t).sub(this.target),jt.applyQuaternion(this._quat),this._spherical.setFromVector3(jt),this.autoRotate&&this.state===wt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,n=this.maxAzimuthAngle;isFinite(i)&&isFinite(n)&&(i<-Math.PI?i+=Ai:i>Math.PI&&(i-=Ai),n<-Math.PI?n+=Ai:n>Math.PI&&(n-=Ai),i<=n?this._spherical.theta=Math.max(i,Math.min(n,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+n)/2?Math.max(i,this._spherical.theta):Math.min(n,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const r=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=r!=this._spherical.radius}if(jt.setFromSpherical(this._spherical),jt.applyQuaternion(this._quatInverse),t.copy(this.target).add(jt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let r=null;if(this.object.isPerspectiveCamera){const o=jt.length();r=this._clampDistance(o*this._scale);const l=o-r;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const o=new C(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new C(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),r=jt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;r!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position):(Za.origin.copy(this.object.position),Za.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Za.direction))<Ov?this.object.lookAt(this.target):(oh.setFromNormalAndCoplanarPoint(this.object.up,this.target),Za.intersectPlane(oh,this.target))))}else if(this.object.isOrthographicCamera){const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),r!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>fo||8*(1-this._lastQuaternion.dot(this.object.quaternion))>fo||this._lastTargetPosition.distanceToSquared(this.target)>fo?(this.dispatchEvent(rh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Ai/60*this.autoRotateSpeed*e:Ai/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){jt.setFromMatrixColumn(t,0),jt.multiplyScalar(-e),this._panOffset.add(jt)}_panUp(e,t){this.screenSpacePanning===!0?jt.setFromMatrixColumn(t,1):(jt.setFromMatrixColumn(t,0),jt.crossVectors(this.object.up,jt)),jt.multiplyScalar(e),this._panOffset.add(jt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const n=this.object.position;jt.copy(n).sub(this.target);let s=jt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),n=e-i.left,s=t-i.top,r=i.width,o=i.height;this._mouse.x=n/r*2-1,this._mouse.y=-(s/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientY),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ai*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ai*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Ai*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Ai*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Ai*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Ai*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._rotateStart.set(i,n)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._panStart.set(i,n)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,n=e.pageY-t.y,s=Math.sqrt(i*i+n*n);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),n=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(n,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ai*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ai*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._panEnd.set(i,n)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,n=e.pageY-t.y,s=Math.sqrt(i*i+n*n);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const r=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(r,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new re,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function kv(a){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(a.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(a)&&(this._addPointer(a),a.pointerType==="touch"?this._onTouchStart(a):this._onMouseDown(a),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function zv(a){this.enabled!==!1&&(a.pointerType==="touch"?this._onTouchMove(a):this._onMouseMove(a))}function Gv(a){switch(this._removePointer(a),this._pointers.length){case 0:this.domElement.releasePointerCapture(a.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(dd),this.state=wt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Hv(a){let e;switch(a.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case mn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(a),this.state=wt.DOLLY;break;case mn.ROTATE:if(a.ctrlKey||a.metaKey||a.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(a),this.state=wt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(a),this.state=wt.ROTATE}break;case mn.PAN:if(a.ctrlKey||a.metaKey||a.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(a),this.state=wt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(a),this.state=wt.PAN}break;default:this.state=wt.NONE}this.state!==wt.NONE&&this.dispatchEvent(kl)}function Wv(a){switch(this.state){case wt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(a);break;case wt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(a);break;case wt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(a);break}}function Vv(a){this.enabled===!1||this.enableZoom===!1||this.state!==wt.NONE||(a.preventDefault(),this.dispatchEvent(kl),this._handleMouseWheel(this._customWheelEvent(a)),this.dispatchEvent(dd))}function Xv(a){this.enabled!==!1&&this._handleKeyDown(a)}function $v(a){switch(this._trackPointer(a),this._pointers.length){case 1:switch(this.touches.ONE){case Cn.ROTATE:if(this.enableRotate===!1){this.state=wt.NONE;break}this._handleTouchStartRotate(a),this.state=wt.TOUCH_ROTATE;break;case Cn.PAN:if(this.enablePan===!1){this.state=wt.NONE;break}this._handleTouchStartPan(a),this.state=wt.TOUCH_PAN;break;default:this.state=wt.NONE}break;case 2:switch(this.touches.TWO){case Cn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(a),this.state=wt.TOUCH_DOLLY_PAN;break;case Cn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(a),this.state=wt.TOUCH_DOLLY_ROTATE;break;default:this.state=wt.NONE}break;default:this.state=wt.NONE}this.state!==wt.NONE&&this.dispatchEvent(kl)}function qv(a){switch(this._trackPointer(a),this.state){case wt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(a),this.update();break;case wt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(a),this.update();break;case wt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(a),this.update();break;case wt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(a),this.update();break;default:this.state=wt.NONE}}function Yv(a){this.enabled!==!1&&a.preventDefault()}function Kv(a){a.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Zv(a){a.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class Jv extends Nh{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new Et;e.deleteAttribute("uv");const t=new nt({side:Ei}),i=new nt,n=new jh(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);const s=new V(e,t);s.position.set(-.757,13.219,.717),s.scale.set(31.713,28.305,28.591),this.add(s);const r=new Xu(e,i,6),o=new ft;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),r.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),r.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),r.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),r.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),r.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),r.setMatrixAt(5,o.matrix),this.add(r);const l=new V(e,fs(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new V(e,fs(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new V(e,fs(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const u=new V(e,fs(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const d=new V(e,fs(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);const f=new V(e,fs(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function fs(a){return new Df({color:0,emissive:16777215,emissiveIntensity:a})}const dr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Ls{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Qv=new Ol(-1,1,1,-1,0,1);class jv extends Ht{constructor(){super(),this.setAttribute("position",new ot([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ot([0,2,0,0,2,0],2))}}const ex=new jv;class zl{constructor(e){this._mesh=new V(ex,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Qv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class tx extends Ls{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Ti?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=fa.clone(e.uniforms),this.material=new Ti({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new zl(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class lh extends Ls{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const n=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),s.buffers.stencil.setFunc(n.ALWAYS,r,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(n.EQUAL,1,4294967295),s.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),s.buffers.stencil.setLocked(!0)}}class ix extends Ls{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class nx{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new re);this._width=i.width,this._height=i.height,t=new Pi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ci}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new tx(dr),this.copyPass.material.blending=$n,this.timer=new kf}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let n=0,s=this.passes.length;n<s;n++){const r=this.passes[n];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),r.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}lh!==void 0&&(r instanceof lh?i=!0:r instanceof ix&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new re);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,n)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class sx extends Ls{constructor(e,t,i=null,n=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Ke}render(e,t,i){const n=e.autoClear;e.autoClear=!1;let s,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=n}}const ax={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ke(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ps extends Ls{constructor(e,t=1,i,n){super(),this.strength=t,this.radius=i,this.threshold=n,this.resolution=e!==void 0?new re(e.x,e.y):new re(256,256),this.clearColor=new Ke(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new Pi(s,r,{type:Ci,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new Pi(s,r,{type:Ci,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new Pi(s,r,{type:Ci,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),s=Math.round(s/2),r=Math.round(r/2)}const o=ax;this.highPassUniforms=fa.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ti({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];s=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new re(1/s,1/r),s=Math.round(s/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=fa.clone(dr.uniforms),this.blendMaterial=new Ti({uniforms:this.copyUniforms,vertexShader:dr.vertexShader,fragmentShader:dr.fragmentShader,premultipliedAlpha:!0,blending:en,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ke,this._oldClearAlpha=1,this._basic=new Pt,this._fsQuad=new zl(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),n=Math.round(t/2);this.renderTargetBright.setSize(i,n);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,n),this.renderTargetsVertical[s].setSize(i,n),this.separableBlurMaterials[s].uniforms.invSize.value=new re(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(e,t,i,n,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Ps.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Ps.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(i*i))/i);const n=[],s=[];for(let r=1;r<e;r+=2){const o=t[r],l=r+1<e?t[r+1]:0,c=o+l;n.push((r*o+(r+1)*l)/c),s.push(c)}return new Ti({defines:{KERNEL_PAIRS:n.length},uniforms:{colorTexture:{value:null},invSize:{value:new re(.5,.5)},direction:{value:new re(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:n},gaussianWeights:{value:s}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Ti({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}Ps.BlurDirectionX=new re(1,0);Ps.BlurDirectionY=new re(0,1);const Ja={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class rx extends Ls{constructor(){super(),this.isOutputPass=!0,this.uniforms=fa.clone(Ja.uniforms),this.material=new Zh({name:Ja.name,uniforms:this.uniforms,vertexShader:Ja.vertexShader,fragmentShader:Ja.fragmentShader}),this._fsQuad=new zl(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},gt.getTransfer(this._outputColorSpace)===Tt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ul?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===fl?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===pl?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Rr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===gl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===vl?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ml&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class ox{constructor(){this.listeners=new Map}on(e,t){return this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),()=>this.off(e,t)}off(e,t){const i=this.listeners.get(e);i&&i.delete(t)}emit(e,t){const i=this.listeners.get(e);if(i)for(const n of i)n(t)}clear(){this.listeners.clear()}}const he=new ox;let Qa=null,$i=4;function $t(a=512){const e=document.createElement("canvas");return e.width=a,e.height=a,[e,e.getContext("2d")]}function ga(a){let e=a;return()=>(e=e*16807%2147483647,(e-1)/2147483646)}function qt(a,e,t){const i=new Ms(a);return i.wrapS=aa,i.wrapT=aa,e&&(i.colorSpace=li),i.anisotropy=Math.max(1,t),i.needsUpdate=!0,i}function po(a,e,t,i,n,s){const o=ga(i),[l,c]=$t(512),[h,u]=$t(512),[d,f]=$t(512);if(c.fillStyle=a,c.fillRect(0,0,512,512),u.fillStyle="#808080",u.fillRect(0,0,512,512),f.fillStyle="#b8b8b8",f.fillRect(0,0,512,512),s)for(let x=0;x<24;x++){const p=o()*512,g=o()*512,S=45+o()*85,w=30+o()*65;c.fillStyle=s[x%s.length],c.save(),c.translate(p,g),c.rotate(o()*Math.PI),c.beginPath(),c.ellipse(0,0,S,w,0,0,Math.PI*2),c.fill(),c.restore()}for(let x=0;x<4200;x++){const p=o()*512,g=o()*512,S=1+o()*4,w=1+o()*2,_=o()>.5;c.fillStyle=_?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.06)",c.fillRect(p,g,S,w),u.fillStyle=_?"rgba(105,105,105,0.22)":"rgba(150,150,150,0.22)",u.fillRect(p,g,S,w)}for(let x=0;x<16;x++){const p=o()*512,g=o()*512,S=18+o()*52,w=c.createRadialGradient(p,g,2,p,g,S);w.addColorStop(0,"rgba(18, 16, 14, 0.28)"),w.addColorStop(1,"rgba(18, 16, 14, 0)"),c.fillStyle=w,c.fillRect(p-S,g-S,S*2,S*2),f.fillStyle="rgba(65, 65, 65, 0.28)",f.beginPath(),f.arc(p,g,S*.6,0,Math.PI*2),f.fill()}const m=256;for(let x=0;x<512;x+=m)for(let p=0;p<512;p+=m){c.strokeStyle=e,c.lineWidth=4,c.strokeRect(p+2,x+2,m-4,m-4),u.strokeStyle="#2c2c2c",u.lineWidth=5,u.strokeRect(p+2,x+2,m-4,m-4),c.strokeStyle=t,c.lineWidth=1.5,c.strokeRect(p+6,x+6,m-12,m-12),f.strokeStyle="#555555",f.lineWidth=3,f.strokeRect(p+5,x+5,m-10,m-10);const g=[[14,14],[m-14,14],[14,m-14],[m-14,m-14],[m*.5,14],[m*.5,m-14],[14,m*.5],[m-14,m*.5]];for(const[S,w]of g){const _=p+S,E=x+w;c.fillStyle="rgba(0,0,0,0.45)",c.beginPath(),c.arc(_+1,E+1,4.5,0,Math.PI*2),c.fill(),c.fillStyle=t,c.beginPath(),c.arc(_,E,4,0,Math.PI*2),c.fill(),u.fillStyle="#ededed",u.beginPath(),u.arc(_,E,4.2,0,Math.PI*2),u.fill(),f.fillStyle="#404040",f.beginPath(),f.arc(_,E,4.2,0,Math.PI*2),f.fill()}}for(let x=0;x<18;x++){const p=o()*512,g=o()*512,S=o()*Math.PI*2,w=14+o()*34;c.strokeStyle=t,c.lineWidth=1.2,c.beginPath(),c.moveTo(p,g),c.lineTo(p+Math.cos(S)*w,g+Math.sin(S)*w),c.stroke(),u.strokeStyle="#454545",u.lineWidth=1.5,u.beginPath(),u.moveTo(p,g),u.lineTo(p+Math.cos(S)*w,g+Math.sin(S)*w),u.stroke(),f.strokeStyle="#383838",f.lineWidth=2,f.beginPath(),f.moveTo(p,g),f.lineTo(p+Math.cos(S)*w,g+Math.sin(S)*w),f.stroke()}return{map:qt(l,!0,n),bumpMap:qt(h,!1,n),roughnessMap:qt(d,!1,n)}}function lx(a){const t=ga(2026),[i,n]=$t(512),[s,r]=$t(512),[o,l]=$t(512);n.fillStyle="#b49d70",n.fillRect(0,0,512,512),r.fillStyle="#707070",r.fillRect(0,0,512,512),l.fillStyle="#ebebeb",l.fillRect(0,0,512,512);const c=8;for(let h=0;h<512;h+=c)for(let u=0;u<512;u+=c){const d=(u/c+h/c|0)%2===0,f=(t()-.5)*18,m=d?180+f:145+f;n.fillStyle=`rgb(${Math.round(m)}, ${Math.round(m*.85)}, ${Math.round(m*.6)})`,n.fillRect(u,h,c-1,c-1);const x=d?215+f:95+f,p=Math.max(20,Math.min(250,Math.round(x)));r.fillStyle=`rgb(${p},${p},${p})`,r.fillRect(u+1,h+1,c-2,c-2)}for(const h of[64,448])n.strokeStyle="#6f5c3e",n.lineWidth=3,n.setLineDash([12,6]),n.beginPath(),n.moveTo(0,h),n.lineTo(512,h),n.stroke(),n.setLineDash([]),r.strokeStyle="#252525",r.lineWidth=4,r.beginPath(),r.moveTo(0,h),r.lineTo(512,h),r.stroke();for(let h=0;h<20;h++){const u=t()*512,d=t()*512,f=24+t()*54,m=n.createRadialGradient(u,d,4,u,d,f);m.addColorStop(0,"rgba(65, 52, 34, 0.26)"),m.addColorStop(1,"rgba(65, 52, 34, 0)"),n.fillStyle=m,n.fillRect(u-f,d-f,f*2,f*2)}return{map:qt(i,!0,a),bumpMap:qt(s,!1,a),roughnessMap:qt(o,!1,a)}}function cx(a){const t=ga(3141),[i,n]=$t(512),[s,r]=$t(512),[o,l]=$t(512);n.fillStyle="#1b1d20",n.fillRect(0,0,512,512),r.fillStyle="#252525",r.fillRect(0,0,512,512),l.fillStyle="#c0c0c0",l.fillRect(0,0,512,512);const c=32;for(let h=0;h<512;h+=c)n.fillStyle="#333840",n.fillRect(18,h+4,476,c-10),n.fillStyle="#5a626e",n.fillRect(28,h+10,456,7),n.fillStyle="#101214",n.fillRect(512*.5-24,h+2,48,c-4),n.fillStyle="#4b525c",n.fillRect(4,h+6,14,c-12),n.fillRect(494,h+6,14,c-12),r.fillStyle="#a8a8a8",r.fillRect(18,h+4,476,c-10),r.fillStyle="#f2f2f2",r.fillRect(28,h+10,456,7),r.fillStyle="#141414",r.fillRect(512*.5-24,h+2,48,c-4),l.fillStyle="#505050",l.fillRect(28,h+10,456,7);for(let h=0;h<1400;h++)n.fillStyle=t()>.5?"rgba(90, 75, 55, 0.14)":"rgba(0,0,0,0.16)",n.fillRect(t()*512,t()*512,3,2);return{map:qt(i,!0,a),bumpMap:qt(s,!1,a),roughnessMap:qt(o,!1,a)}}function hx(a){const[t,i]=$t(512),[n,s]=$t(512),[r,o]=$t(512);i.fillStyle="#16181c",i.fillRect(0,0,512,512),s.fillStyle="#242424",s.fillRect(0,0,512,512),o.fillStyle="#dcdcdc",o.fillRect(0,0,512,512);const l=48;for(let c=-l;c<512+l;c+=l)i.fillStyle="#252930",i.beginPath(),i.moveTo(20,c),i.lineTo(512*.46,c+26),i.lineTo(512*.46,c+46),i.lineTo(20,c+20),i.closePath(),i.fill(),i.beginPath(),i.moveTo(492,c+l*.5),i.lineTo(512*.54,c+l*.5+26),i.lineTo(512*.54,c+l*.5+46),i.lineTo(492,c+l*.5+20),i.closePath(),i.fill(),s.fillStyle="#e6e6e6",s.beginPath(),s.moveTo(20,c),s.lineTo(512*.46,c+26),s.lineTo(512*.46,c+46),s.lineTo(20,c+20),s.closePath(),s.fill(),s.beginPath(),s.moveTo(492,c+l*.5),s.lineTo(512*.54,c+l*.5+26),s.lineTo(512*.54,c+l*.5+46),s.lineTo(492,c+l*.5+20),s.closePath(),s.fill(),o.fillStyle="#9a9a9a",o.fillRect(20,c,472,18);return i.fillStyle="rgba(110, 95, 70, 0.16)",i.fillRect(512*.46,0,512*.08,512),{map:qt(t,!0,a),bumpMap:qt(n,!1,a),roughnessMap:qt(r,!1,a)}}function dx(a){const t=ga(7711),[i,n]=$t(512),[s,r]=$t(512),[o,l]=$t(512);n.fillStyle="#6c7176",n.fillRect(0,0,512,512),r.fillStyle="#808080",r.fillRect(0,0,512,512),l.fillStyle="#e5e5e5",l.fillRect(0,0,512,512);for(let c=0;c<512;c+=128){n.strokeStyle="rgba(30, 33, 36, 0.45)",n.lineWidth=3,n.beginPath(),n.moveTo(0,c),n.lineTo(512,c),n.stroke(),r.strokeStyle="#383838",r.lineWidth=4,r.beginPath(),r.moveTo(0,c),r.lineTo(512,c),r.stroke();for(let h=64;h<512;h+=128)n.fillStyle="#3a3e42",n.beginPath(),n.arc(h,c+64,5,0,Math.PI*2),n.fill(),r.fillStyle="#181818",r.beginPath(),r.arc(h,c+64,6,0,Math.PI*2),r.fill()}for(let c=0;c<6e3;c++){const h=t()*512,u=t()*512,d=t()>.48;n.fillStyle=d?"rgba(25,25,25,0.12)":"rgba(220,220,215,0.1)",n.fillRect(h,u,2.5,2.5),r.fillStyle=d?"rgba(80,80,80,0.28)":"rgba(175,175,175,0.25)",r.fillRect(h,u,2,2)}for(let c=0;c<8;c++){let h=t()*512,u=t()*512;n.strokeStyle="rgba(25, 25, 28, 0.55)",n.lineWidth=1.4,r.strokeStyle="#202020",r.lineWidth=2,n.beginPath(),r.beginPath(),n.moveTo(h,u),r.moveTo(h,u);for(let d=0;d<6;d++)h+=(t()-.5)*40,u+=(t()-.5)*40,n.lineTo(h,u),r.lineTo(h,u);n.stroke(),r.stroke()}n.fillStyle="rgba(234, 179, 8, 0.72)",n.fillRect(0,476,512,24);for(let c=-32;c<544;c+=44)n.fillStyle="rgba(30, 34, 38, 0.85)",n.beginPath(),n.moveTo(c,476),n.lineTo(c+20,476),n.lineTo(c+6,500),n.lineTo(c-14,500),n.closePath(),n.fill();return{map:qt(i,!0,a),bumpMap:qt(s,!1,a),roughnessMap:qt(o,!1,a)}}function ux(a){const t=ga(9090),[i,n]=$t(512),[s,r]=$t(512),[o,l]=$t(512);n.fillStyle="#31363c",n.fillRect(0,0,512,512),r.fillStyle="#808080",r.fillRect(0,0,512,512),l.fillStyle="#c8c8c8",l.fillRect(0,0,512,512);for(let c=0;c<8500;c++){const h=t()*512,u=t()*512,d=t()>.5?"rgba(200,205,210,0.08)":"rgba(12,14,16,0.18)";n.fillStyle=d,n.fillRect(h,u,2,2),r.fillStyle=t()>.5?"rgba(180,180,180,0.3)":"rgba(65,65,65,0.3)",r.fillRect(h,u,2,2)}for(const c of[150,362])n.fillStyle="rgba(14, 16, 18, 0.32)",n.fillRect(c-24,0,48,512),l.fillStyle="#757575",l.fillRect(c-24,0,48,512);n.fillStyle="rgba(234, 179, 8, 0.68)";for(let c=16;c<512;c+=96)n.fillRect(512*.5-6,c,12,52);return{map:qt(i,!0,a),bumpMap:qt(s,!1,a),roughnessMap:qt(o,!1,a)}}function fx(a){const[t,i]=$t(512),[n,s]=$t(512),[r,o]=$t(512);i.fillStyle="#4b535e",i.fillRect(0,0,512,512),s.fillStyle="#505050",s.fillRect(0,0,512,512),o.fillStyle="#8e8e8e",o.fillRect(0,0,512,512);const l=32;for(let c=0;c<512;c+=l)for(let h=0;h<512;h+=l){const u=(h/l+c/l|0)%2===0,d=h+l*.5,f=c+l*.5,m=u?Math.PI/4:-Math.PI/4;for(const x of[{target:i,fill:"#7e8896",w:18,h:6},{target:s,fill:"#f0f0f0",w:19,h:7},{target:o,fill:"#353535",w:18,h:6}])x.target.save(),x.target.translate(d,f),x.target.rotate(m),x.target.fillStyle=x.fill,x.target.fillRect(-x.w*.5,-x.h*.5,x.w,x.h),x.target.restore()}return{map:qt(t,!0,a),bumpMap:qt(n,!1,a),roughnessMap:qt(r,!1,a)}}function ud(a=$i){return Qa||($i=Math.max(1,a),Qa={natoArmorPlate:po("#4b5320","#2b3112","#7e8562",101,$i),desertCarcPlate:po("#c2b280","#7e704c","#ded4b4",202,$i),opforCamoPlate:po("#3b4d3b","#1b241b","#6d796a",303,$i,["#283628","#4f5b3a","#1e211e"]),sandbagBurlap:lx($i),tankTracks:cx($i),offroadTire:hx($i),concreteBunker:dx($i),tacticalAsphalt:ux($i),diamondSteelPlate:fx($i)},Qa)}function Jt(a,e={}){const t=ud(),i=t[a]||t.natoArmorPlate,{repeat:n,...s}=e;let r=i.map,o=i.bumpMap,l=i.roughnessMap;return n&&(r=i.map.clone(),o=i.bumpMap.clone(),l=i.roughnessMap.clone(),r.repeat.set(n[0],n[1]),o.repeat.set(n[0],n[1]),l.repeat.set(n[0],n[1]),r.needsUpdate=!0,o.needsUpdate=!0,l.needsUpdate=!0),new nt({map:r,bumpMap:o,bumpScale:s.bumpScale??.04,roughnessMap:l,roughness:s.roughness??.72,metalness:s.metalness??.25,envMapIntensity:s.envMapIntensity??1.15,...s})}class ia{constructor(e,t=64,i=1024){this.factory=e,this.maxSize=i,this.free=[],this.active=[];for(let n=0;n<t;n++){const s=this.factory();s._pooledActive=!1,this.free.push(s)}}acquire(){let e;return this.free.length>0?e=this.free.pop():this.active.length<this.maxSize?e=this.factory():(e=this.active.shift(),e.onRelease&&e.onRelease()),e._pooledActive=!0,this.active.push(e),e}release(e){if(!e._pooledActive)return;e._pooledActive=!1,e.onRelease&&e.onRelease();const t=this.active.indexOf(e);if(t!==-1){const i=this.active.pop();t<this.active.length&&(this.active[t]=i)}this.free.push(e)}forEachActive(e){for(let t=this.active.length-1;t>=0;t--)e(this.active[t],t)}releaseAll(){for(;this.active.length>0;){const e=this.active.pop();e._pooledActive=!1,e.onRelease&&e.onRelease(),this.free.push(e)}}get activeCount(){return this.active.length}}const px=[{id:"first",label:"FIRST",short:"1ST",desc:"Alvo mais próximo da FOB"},{id:"last",label:"LAST",short:"LST",desc:"Alvo mais distante da FOB"},{id:"strongest",label:"STRONGEST",short:"STR",desc:"Maior HP atual"},{id:"weakest",label:"WEAKEST",short:"WEK",desc:"Menor HP atual"},{id:"air_first",label:"AIR PRIO",short:"AIR",desc:"Prioriza unidades aéreas"}],dn={a10:{id:"a10",hotkey:"Q",name:"A-10 WARTHOG",cost:200,cooldown:45,unlockCostWB:0,desc:"GAU-8 30mm Strafe (Arraste/R roda ângulo)"},hellfire:{id:"hellfire",hotkey:"E",name:"AGM-114 HELLFIRE",cost:150,cooldown:30,unlockCostWB:0,desc:"Ataque cirúrgico antitanque no cursor"},b52:{id:"b52",hotkey:"B",name:"B-52 CARPET BOMB",cost:350,cooldown:60,unlockCostWB:300,desc:"Bombardeio estratégico em tapete + fogo termobárico"}},Li={hesco:{id:"hesco",hotkey:"8",name:"Hesco Bastion",shortName:"HESCO",role:"MAZE",roleColor:"#94a3b8",cost:25,unlockCostWB:0,maxHp:900,isBarrier:!0,domain:"none",defaultPriority:"first",summary:"Barreira modular de solo (900 HP). Redireciona colunas terrestres pelo grid.",levels:[{level:1,name:"Barreira Hesco",range:0,minRange:0,fireRate:0,damage:0,damageType:"none",splashRadius:0,notes:"Bloqueia rota terrestre (validação A* anti-fechamento). 900 HP."}]},m2_bunker:{id:"m2_bunker",hotkey:"1",name:"M2 Browning .50 Cal",shortName:"M2 .50",role:"ANTI-INF",roleColor:"#eab308",cost:100,unlockCostWB:0,maxHp:450,domain:"both",defaultPriority:"first",projectileSpeed:980,turnRate:9.5,summary:"Supressão antipessoal e veículos leves com alta cadência cinética.",levels:[{level:1,name:"M2 Browning .50 Cal Bunker",range:180,minRange:0,fireRate:8,damage:12,damageType:"kinetic",armorPierce:0,splashRadius:0,notes:"8 tiros/s | Dano 12 Cinético."},{level:2,upgradeCost:150,name:"M134 Minigun 7.62mm",range:195,minRange:0,fireRate:16,damage:13,damageType:"kinetic",armorPierce:.1,splashRadius:0,notes:"+100% cadência (16 tiros/s) | Cortina de fogo rotativa."},{level:3,upgradeCost:250,name:"CROWS II Remote Weapon Station",range:225,minRange:0,fireRate:18,damage:18,damageType:"kinetic",armorPierce:.4,laserSight:!0,splashRadius:0,notes:"Mira laser estabilizada + perfuração leve (40%)."}]},bushmaster:{id:"bushmaster",hotkey:"2",name:"M242 Bushmaster 25mm",shortName:"25MM AP",role:"APDS / IFV",roleColor:"#f97316",cost:225,unlockCostWB:0,maxHp:600,domain:"both",defaultPriority:"strongest",projectileSpeed:880,turnRate:7,summary:"Canhão automático APDS. Destrói IFVs/APCs e perfura blindagem.",levels:[{level:1,name:"M242 Bushmaster 25mm",range:240,minRange:0,fireRate:2.5,damage:55,damageType:"apds",armorIgnore:.5,splashRadius:0,notes:"2.5 tiros/s | Dano 55 APDS | Ignora 50% da armadura."},{level:2,upgradeCost:275,name:"M919 Sabot Depleted Uranium",range:260,minRange:0,fireRate:2.8,damage:78,damageType:"apds",armorIgnore:.85,splashRadius:0,notes:"Munição Sabot DU | Ignora 85% da blindagem pesada."},{level:3,upgradeCost:420,name:"Bofors 40mm L/70 Autocannon",range:285,minRange:0,fireRate:3.2,damage:110,damageType:"apds",armorIgnore:.88,splashRadius:42,notes:"Canhão 40mm | Micro-área explosiva + fragmentação."}]},javelin:{id:"javelin",hotkey:"3",name:"TOW / FGM-148 Javelin",shortName:"JAVELIN",role:"ATGM / MBT",roleColor:"#ef4444",cost:350,unlockCostWB:180,maxHp:520,domain:"ground",defaultPriority:"strongest",projectileSpeed:420,turnRate:5.5,summary:"Bateria caça-tanques guiada Top-Attack. 200% de dano contra Blindagem Pesada.",levels:[{level:1,name:"BGM-71 TOW / Javelin Battery",range:340,minRange:0,fireRate:.4,damage:320,damageType:"heat",heavyMultiplier:2,tandemHeat:!1,salvoCount:1,splashRadius:28,notes:"Míssil guiado | 320 HEAT (200% em Blindagem Pesada)."},{level:2,upgradeCost:400,name:"Ogiva Tandem HEAT",range:370,minRange:0,fireRate:.45,damage:420,damageType:"heat",heavyMultiplier:2.15,tandemHeat:!0,salvoCount:1,splashRadius:34,notes:"Ogiva Tandem | Rompe e neutraliza blindagem reativa ERA."},{level:3,upgradeCost:650,name:"Dual Javelin Block I",range:400,minRange:0,fireRate:.5,damage:430,damageType:"heat",heavyMultiplier:2.25,tandemHeat:!0,salvoCount:2,splashRadius:38,notes:"Lançador duplo | Dispara 2 mísseis simultâneos."}]},phalanx:{id:"phalanx",hotkey:"4",name:"Phalanx CIWS 20mm",shortName:"CIWS",role:"AA / SWARM",roleColor:"#38bdf8",cost:400,unlockCostWB:0,maxHp:650,domain:"both",defaultPriority:"air_first",projectileSpeed:1120,turnRate:14,summary:"M61 Vulcan guiado por radar (20 tiros/s). Destruidor de enxames de drones.",levels:[{level:1,name:"Phalanx CIWS 20mm Vulcan",range:260,minRange:0,fireRate:20,damage:18,damageType:"aa",critChance:.1,splashRadius:0,notes:"20 tiros/s | Prioridade aérea automática."},{level:2,upgradeCost:350,name:"Radar Ku-Band Digital",range:338,minRange:0,fireRate:22,damage:22,damageType:"aa",critChance:.3,splashRadius:0,notes:"+30% alcance (338px) | Precisão crítica 30%."},{level:3,upgradeCost:600,name:"Centurion C-RAM HEIT-SD",range:360,minRange:0,fireRate:24,damage:28,damageType:"aa",critChance:.35,splashRadius:36,notes:"Munição HEIT-SD explosiva | Derrete drones e infantaria."}]},howitzer:{id:"howitzer",hotkey:"5",name:"M777 Howitzer 155mm",shortName:"155MM HE",role:"ARTY",roleColor:"#fb923c",cost:500,unlockCostWB:260,maxHp:580,domain:"ground",defaultPriority:"first",projectileSpeed:390,turnRate:3.8,summary:"Artilharia pesada em área (alcance morto: 120px). Apenas alvos terrestres.",levels:[{level:1,name:"M777 Howitzer 155mm",range:550,minRange:120,fireRate:.25,damage:240,damageType:"he",splashRadius:95,scatter:22,salvoCount:1,notes:"Raio HE 95px | Alcance mínimo morto 120px | Só terrestre."},{level:2,upgradeCost:550,name:"M982 Excalibur GPS-Guided",range:580,minRange:120,fireRate:.3,damage:340,damageType:"he",splashRadius:130,scatter:0,salvoCount:1,notes:"Precisão cirúrgica GPS | Raio 130px | +Dano AP."},{level:3,upgradeCost:950,name:"M142 HIMARS GMLRS Battery",range:640,minRange:120,fireRate:.28,damage:215,damageType:"he_rocket",splashRadius:115,scatter:36,salvoCount:6,notes:"Salva de 6 foguetes GMLRS com devastação massiva e tremor."}]},patriot:{id:"patriot",hotkey:"6",name:"MIM-104 Patriot PAC-3",shortName:"PATRIOT",role:"SAM / AA",roleColor:"#22d3ee",cost:650,unlockCostWB:320,maxHp:700,domain:"air",defaultPriority:"strongest",projectileSpeed:640,turnRate:8.5,summary:"Sistema SAM estratégico exclusivo antiaéreo. Nv2 revela Stealth globalmente.",levels:[{level:1,name:"MIM-104 Patriot PAC-3 SAM",range:600,minRange:0,fireRate:.5,damage:480,damageType:"aa_missile",multiTargets:1,globalStealthReveal:!1,splashRadius:34,notes:"Alcance 600px | 480 Anti-Air | Exclusivo aéreo."},{level:2,upgradeCost:500,name:"Radar AN/MPQ-65 AESA",range:650,minRange:0,fireRate:.6,damage:560,damageType:"aa_missile",multiTargets:1,globalStealthReveal:!0,splashRadius:40,notes:"AESA Global: Revela unidades furtivas (Stealth) em TODO o mapa!"},{level:3,upgradeCost:900,name:"Quad-Pack PAC-3 MSE",range:700,minRange:0,fireRate:.65,damage:580,damageType:"aa_missile",multiTargets:4,globalStealthReveal:!0,splashRadius:44,notes:"Engaja até 4 aeronaves simultaneamente por salva."}]},ew_crew:{id:"ew_crew",hotkey:"7",name:"AN/VLQ-12 CREW EW",shortName:"EW JAM",role:"SUPPORT",roleColor:"#a855f7",cost:300,unlockCostWB:200,maxHp:550,domain:"both",isSupportAura:!0,defaultPriority:"first",turnRate:4.5,summary:"Guerra Eletrônica: Slow, desativa ERA/APS/Stealth e amplifica dano recebido.",levels:[{level:1,name:"AN/VLQ-12 CREW Jammer",range:210,minRange:0,fireRate:0,damage:0,damageType:"ew",slowFactor:.35,damageAmp:.25,disablesActiveDefense:!0,empInterval:0,notes:"Slow 35% | Desativa ERA/APS/Stealth | +25% dano recebido."},{level:2,upgradeCost:250,name:"Jammer Direcional Avançado",range:245,minRange:0,fireRate:0,damage:0,damageType:"ew",slowFactor:.5,damageAmp:.35,disablesActiveDefense:!0,empInterval:0,notes:"Slow 50% | +35% dano recebido | Maior raio tático."},{level:3,upgradeCost:550,name:"EMP Tactical Pulse Array",range:270,minRange:0,fireRate:0,damage:45,damageType:"emp",slowFactor:.5,damageAmp:.4,disablesActiveDefense:!0,empInterval:10,empStunDuration:1.5,notes:"Pulso EMP a cada 10s: paralisa veículos mecanizados por 1.5s."}]},abrams_pit:{id:"abrams_pit",hotkey:"9",name:"Casamata M1A2 SEPv3 Abrams",shortName:"ABRAMS",role:"MBT BUNKER",roleColor:"#84cc16",cost:750,unlockCostWB:400,maxHp:1800,isTauntTank:!0,domain:"ground",defaultPriority:"strongest",projectileSpeed:1040,turnRate:5.8,summary:"Torre-Tanque (1.800 HP) que atrai fogo dos Chefes e dispara APFSDS 120mm L/55.",levels:[{level:1,name:"Casamata M1A2 SEPv3 Abrams 120mm",range:310,minRange:0,fireRate:.65,damage:460,damageType:"apds",armorIgnore:.9,heavyMultiplier:1.5,splashRadius:32,maxHp:1800,trophyCooldown:0,notes:"1.800 HP (Atrai Chefes) | Canhão 120mm APFSDS (ignora 90% armadura)."},{level:2,upgradeCost:600,name:"Abrams Chobham + Trophy APS",range:340,minRange:0,fireRate:.78,damage:640,damageType:"apds",armorIgnore:.94,heavyMultiplier:1.65,splashRadius:40,maxHp:2500,trophyCooldown:4.5,notes:"2.500 HP | Blindagem Chobham + Trophy APS (bloqueia 1 tiro a cada 4.5s)."},{level:3,upgradeCost:950,name:"XM360 140mm + Munição STAFF",range:375,minRange:0,fireRate:.92,damage:920,damageType:"apds",armorIgnore:.98,heavyMultiplier:1.85,splashRadius:58,maxHp:3400,trophyCooldown:3,notes:"3.400 HP | Canhão Experimental 140mm STAFF + Trophy APS rápido (3.0s)."}]},iron_dome:{id:"iron_dome",hotkey:"0",name:"Iron Dome Tamir & C-RAM",shortName:"IRON DOME",role:"C-RAM / REP",roleColor:"#2dd4bf",cost:550,unlockCostWB:350,maxHp:850,isIronDome:!0,domain:"both",defaultPriority:"air_first",projectileSpeed:760,turnRate:11,summary:"Intercepta mísseis/tiros dos Chefes (260px), protege contra EMP e repara torres (+25 HP/s).",levels:[{level:1,name:"Bateria Iron Dome Tamir C-RAM",range:260,minRange:0,fireRate:1.2,damage:140,damageType:"aa_missile",splashRadius:24,interceptCooldown:2,healPerSec:25,towerShieldReduction:.1,notes:"Intercepta ataques de Chefes (2.0s) | Regenera +25 HP/s em torres próximas."},{level:2,upgradeCost:480,name:"Radar EL/M-2084 Multi-Missão",range:300,minRange:0,fireRate:1.6,damage:195,damageType:"aa_missile",splashRadius:30,interceptCooldown:1,healPerSec:42,towerShieldReduction:.18,notes:"Intercepta 2x mais rápido (1.0s) | Regenera +42 HP/s | Bloqueia EMP."},{level:3,upgradeCost:820,name:"Domo Blindado + Nanorreparo",range:340,minRange:0,fireRate:2.2,damage:260,damageType:"aa_missile",splashRadius:36,interceptCooldown:.55,healPerSec:60,towerShieldReduction:.25,notes:"Nanorreparo +60 HP/s | Escudo -25% dano nas torres | Interceptação 0.55s."}]},helios_laser:{id:"helios_laser",hotkey:"-",name:"AN/SEQ-3 HELIOS Laser",shortName:"HELIOS",role:"DEW LASER",roleColor:"#38bdf8",cost:800,unlockCostWB:600,maxHp:750,isContinuousLaser:!0,domain:"both",defaultPriority:"strongest",projectileSpeed:2e3,turnRate:10.5,summary:"Feixe laser contínuo 3D que ignora APS/ERA e escala até +200% dano no mesmo alvo.",levels:[{level:1,name:"AN/SEQ-3 HELIOS 100kW",range:350,minRange:0,fireRate:10,damage:185,damageType:"laser",splashRadius:0,beamTargets:1,maxRampBonus:2,rampRate:.45,thermalVuln:0,notes:"185 DPS contínuo (até 555 DPS focado) | Ignora APS e ERA."},{level:2,upgradeCost:650,name:"Feixe Alta Frequência 300kW",range:385,minRange:0,fireRate:10,damage:265,damageType:"laser",splashRadius:0,beamTargets:1,maxRampBonus:2,rampRate:.55,thermalVuln:.3,notes:"265 DPS base (até 795 DPS) | Aplica +30% vulnerabilidade térmica."},{level:3,upgradeCost:1100,name:"Torreta Prisma Duplo Iron Beam",range:420,minRange:0,fireRate:10,damage:350,damageType:"laser",splashRadius:0,beamTargets:2,maxRampBonus:2,rampRate:.65,thermalVuln:.4,notes:"2 feixes simultâneos (350 DPS cada, até +200%) | +40% vuln. térmica."}]},tos1_mlrs:{id:"tos1_mlrs",hotkey:"=",name:"TOS-1A / M270 MLRS",shortName:"TOS-1A",role:"THERMOBARIC",roleColor:"#f97316",cost:700,unlockCostWB:500,maxHp:720,createsFireZone:!0,domain:"ground",defaultPriority:"first",projectileSpeed:420,turnRate:4.5,summary:"Salva termobárica que cria zonas de fogo 3D por 5s, derrete ERA e queima colunas.",levels:[{level:1,name:"TOS-1A Solntsepek 220mm",range:480,minRange:90,fireRate:.22,damage:145,damageType:"thermobaric",splashRadius:95,scatter:28,salvoCount:4,burnDps:75,burnDuration:5,notes:"4 foguetes termobáricos | Fogo no chão 5s (75 DPS) | Derrete ERA."},{level:2,upgradeCost:580,name:"Ogivas Termobáricas TBS-M3",range:520,minRange:90,fireRate:.25,damage:195,damageType:"thermobaric",splashRadius:110,scatter:24,salvoCount:6,burnDps:110,burnDuration:5,notes:"6 foguetes TBS-M3 | Fogo no chão 5s (110 DPS) | Raio 110px."},{level:3,upgradeCost:960,name:"Bateria Dupla M270A2 Precision",range:560,minRange:90,fireRate:.28,damage:250,damageType:"thermobaric",splashRadius:125,scatter:18,salvoCount:8,burnDps:155,burnDuration:6,notes:"8 foguetes de saturação | Zonas de fogo 6s (155 DPS) | Devastação total."}]}},ch=["m2_bunker","bushmaster","phalanx","javelin","howitzer","patriot","ew_crew","abrams_pit","iron_dome","helios_laser","tos1_mlrs","hesco"],En={infantry:{id:"infantry",name:"Spetsnaz / Fuzileiros",shortName:"INF",domain:"ground",armorClass:"light",armorLabel:"Leve",maxHp:90,speed:96,reward:15,wbReward:0,fobDamage:1,isMechanized:!1,hasEra:!1,hasAps:!1,isStealth:!1,radius:13},imv:{id:"imv",name:"GAZ Tigr / Humvee IMV",shortName:"IMV",domain:"ground",armorClass:"light",armorLabel:"Leve Mec.",maxHp:220,speed:136,reward:30,wbReward:0,fobDamage:1,isMechanized:!0,hasEra:!1,hasAps:!1,isStealth:!1,radius:17},ifv:{id:"ifv",name:"BTR-82A / BMP-3 IFV",shortName:"IFV",domain:"ground",armorClass:"medium",armorLabel:"Média (-35% Cin.)",maxHp:650,speed:74,reward:60,wbReward:1,fobDamage:2,isMechanized:!0,hasEra:!1,hasAps:!1,isStealth:!1,dismountCount:3,radius:20},drone_swarm:{id:"drone_swarm",name:"Shahed-136 / Lancet Drone",shortName:"DRONE",domain:"air",armorClass:"light",armorLabel:"Aéreo Leve",maxHp:140,speed:118,reward:25,wbReward:0,fobDamage:1,isMechanized:!0,hasEra:!1,hasAps:!1,isStealth:!1,radius:14},mbt:{id:"mbt",name:"T-90M Proryv / M1A2 MBT",shortName:"MBT",domain:"ground",armorClass:"heavy",armorLabel:"Pesada + ERA",maxHp:2400,speed:44,reward:150,wbReward:4,fobDamage:3,isMechanized:!0,hasEra:!0,hasAps:!1,isStealth:!1,radius:23},heli:{id:"heli",name:"Mil Mi-28 / Ka-52 Havoc",shortName:"HELI",domain:"air",armorClass:"medium",armorLabel:"Aéreo Blindado",maxHp:1500,speed:78,reward:130,wbReward:3,fobDamage:2,isMechanized:!0,hasEra:!1,hasAps:!1,isStealth:!1,radius:22},stealth:{id:"stealth",name:"Su-57 Felon / B-2 Stealth",shortName:"STEALTH",domain:"air",armorClass:"stealth",armorLabel:"Aéreo Furtivo",maxHp:2200,speed:112,reward:250,wbReward:6,fobDamage:3,isMechanized:!0,hasEra:!1,hasAps:!1,isStealth:!0,radius:22},boss:{id:"boss",name:"BMPT Terminator + Comando",shortName:"BOSS",domain:"ground",armorClass:"heavy",armorLabel:"Pesada + APS Arena",maxHp:9500,speed:34,reward:1e3,wbReward:60,fobDamage:8,isMechanized:!0,hasEra:!0,hasAps:!0,apsCooldown:4,isStealth:!1,isBoss:!0,isStageBoss:!0,radius:27,towerAttack:{interval:4.2,range:250,damage:145,splashRadius:35,targets:2,projectileKind:"boss_missile",preferAa:!1}},subboss_tos1:{id:"subboss_tos1",name:"TOS-1A Buratino (Sub-Chefe)",shortName:"SUB: TOS-1A",domain:"ground",armorClass:"heavy",armorLabel:"Sub-Chefe + ERA",maxHp:4200,speed:38,reward:320,wbReward:30,fobDamage:5,isMechanized:!0,hasEra:!0,hasAps:!1,isStealth:!1,isBoss:!0,isSubBoss:!0,radius:25,towerAttack:{interval:5,range:280,damage:120,splashRadius:55,burnDps:25,burnDuration:3,targets:1,projectileKind:"boss_rocket",preferAa:!1}},subboss_pantsir:{id:"subboss_pantsir",name:"Pantsir-S1M / 2K22 Tunguska (Sub-Chefe)",shortName:"SUB: PANTSIR",domain:"ground",armorClass:"medium",armorLabel:"Sub-Chefe + APS",maxHp:3800,speed:46,reward:300,wbReward:30,fobDamage:4,isMechanized:!0,hasEra:!1,hasAps:!0,apsCooldown:3.8,isStealth:!1,isBoss:!0,isSubBoss:!0,radius:24,towerAttack:{interval:3.5,range:220,damage:85,splashRadius:0,targets:1,projectileKind:"boss_autocannon",preferAa:!1}},subboss_ka50:{id:"subboss_ka50",name:'Kamov Ka-50 "Black Shark" (Sub-Chefe Aéreo)',shortName:"SUB: KA-50",domain:"air",armorClass:"medium",armorLabel:"Sub-Chefe Aéreo",maxHp:3500,speed:58,reward:340,wbReward:35,fobDamage:4,isMechanized:!0,hasEra:!1,hasAps:!1,isStealth:!1,isBoss:!0,isSubBoss:!0,radius:24,towerAttack:{interval:4.5,range:290,damage:140,splashRadius:30,targets:1,projectileKind:"boss_missile",preferAa:!0}},boss_koalitsiya:{id:"boss_koalitsiya",name:"2S35 Koalitsiya-SV 152mm Duplo",shortName:"BOSS: 2S35",domain:"ground",armorClass:"heavy",armorLabel:"Chefe + ERA",maxHp:9500,speed:30,reward:750,wbReward:65,fobDamage:8,isMechanized:!0,hasEra:!0,hasAps:!1,isStealth:!1,isBoss:!0,isStageBoss:!0,radius:27,towerAttack:{interval:5.2,range:350,damage:220,splashRadius:85,targets:1,projectileKind:"boss_shell",preferAa:!1}},boss_terminator:{id:"boss_terminator",name:"Coluna Comando BMPT-72 Terminator II",shortName:"BOSS: BMPT-72",domain:"ground",armorClass:"heavy",armorLabel:"Chefe + APS Arena",maxHp:12500,speed:33,reward:950,wbReward:80,fobDamage:10,isMechanized:!0,hasEra:!0,hasAps:!0,apsCooldown:4,isStealth:!1,isBoss:!0,isStageBoss:!0,radius:28,towerAttack:{interval:4,range:260,damage:155,splashRadius:35,targets:2,projectileKind:"boss_missile",preferAa:!1}},boss_tu160:{id:"boss_tu160",name:'Tupolev Tu-160 "White Swan" Bomber',shortName:"BOSS: TU-160",domain:"air",armorClass:"heavy",armorLabel:"Chefe Aéreo Pesado",maxHp:14e3,speed:44,reward:1100,wbReward:95,fobDamage:12,isMechanized:!0,hasEra:!1,hasAps:!1,isStealth:!1,isBoss:!0,isStageBoss:!0,radius:30,towerAttack:{interval:4.2,range:360,damage:195,splashRadius:50,targets:2,projectileKind:"boss_missile",preferAa:!0}},boss_armata:{id:"boss_armata",name:"T-14 Armata Comando + Guerra Eletrônica",shortName:"BOSS: T-14",domain:"ground",armorClass:"heavy",armorLabel:"Chefe + Afganit + EMP",maxHp:18e3,speed:35,reward:1350,wbReward:115,fobDamage:14,isMechanized:!0,hasEra:!0,hasAps:!0,apsCooldown:3.2,isStealth:!1,isBoss:!0,isStageBoss:!0,radius:29,towerAttack:{interval:4.5,range:310,damage:300,splashRadius:45,targets:1,projectileKind:"boss_shell",preferAa:!1,empPulseInterval:7.5,empPulseRange:250,empDisableDuration:2}},megaboss_scud_convoy:{id:"megaboss_scud_convoy",name:"MAZ-7917 Topol/Iskander-M Fortaleza Móvel",shortName:"MEGA: TOPOL-M",domain:"ground",armorClass:"heavy",armorLabel:"SUPREMO + APS + ESCOLTA",maxHp:32e3,speed:23,reward:2400,wbReward:220,fobDamage:20,isMechanized:!0,hasEra:!0,hasAps:!0,apsCooldown:3.5,isStealth:!1,isBoss:!0,isMegaBoss:!0,radius:34,thresholdSpawns:[{ratio:.5,type:"ifv",count:2},{ratio:.25,type:"ifv",count:2}],towerAttack:{interval:4.8,range:420,damage:280,splashRadius:95,targets:2,projectileKind:"boss_missile",preferAa:!1}},megaboss_object279:{id:"megaboss_object279",name:'Object 279 "Kotin" Super-Heavy Nuclear Tank',shortName:"MEGA: OBJ-279",domain:"ground",armorClass:"heavy",armorLabel:"SUPREMO 4-ESTEIRAS",maxHp:45e3,speed:25,reward:3200,wbReward:300,fobDamage:20,isMechanized:!0,hasEra:!0,hasAps:!0,apsCooldown:2.8,slowImmune:!0,isStealth:!1,isBoss:!0,isMegaBoss:!0,radius:34,towerAttack:{interval:3.8,range:340,damage:340,splashRadius:65,targets:2,projectileKind:"boss_shell",preferAa:!1}},megaboss_kirov_airship:{id:"megaboss_kirov_airship",name:'Fortaleza Aérea "Kirov / Antonov Command"',shortName:"MEGA: KIROV",domain:"air",armorClass:"heavy",armorLabel:"SUPREMO AÉREO + DRONES",maxHp:6e4,speed:21,reward:4500,wbReward:420,fobDamage:20,isMechanized:!0,hasEra:!1,hasAps:!0,apsCooldown:3,isStealth:!1,isBoss:!0,isMegaBoss:!0,radius:38,periodicSpawn:{interval:8,type:"drone_swarm",count:3},towerAttack:{interval:4,range:360,damage:260,splashRadius:90,targets:2,projectileKind:"boss_shell",preferAa:!1}}};function _i(a){const e=new Set,t=[],i=(n,s)=>{const r=`${n},${s}`;e.has(r)||(e.add(r),t.push([n,s]))};for(const n of a)for(let s=0;s<n.length-1;s++){let[r,o]=n[s];const[l,c]=n[s+1];for(i(r,o);r!==l;)r+=r<l?1:-1,i(r,o);for(;o!==c;)o+=o<c?1:-1,i(r,o)}return t}function Si(a,e,t,i,n=!1){const s=1+(a-1)*.35+(e-1)*.1;if(!n){const l={boss_koalitsiya:"2S35 Koalitsiya-SV 152mm Duplo",boss_terminator:"BMPT-72 Terminator II Comando",boss_tu160:'Tupolev Tu-160 "White Swan"',boss_armata:"T-14 Armata + Pulso EMP"},c={subboss_tos1:"TOS-1A Buratino Termobárico",subboss_pantsir:"Pantsir-S1M Blindado Antitorre",subboss_ka50:'Ka-50 "Black Shark" Ace Gunship'};return[{wave:1,title:"Vanguarda de Reconhecimento",brief:"Batedores Spetsnaz abrem a ofensiva. Posicione M2 .50 Cal e barreiras Hesco.",groups:[{type:"infantry",count:10+a*2,interval:.65,delay:.3}]},{wave:2,title:"Flanqueadores Motorizados",brief:"Infantaria apoiada por veículos GAZ Tigr IMV rápidos.",groups:[{type:"infantry",count:10,interval:.55,delay:.2},{type:"imv",count:4+e,interval:1.15,delay:3.5}]},{wave:3,title:"Coluna Mecanizada & Drones",brief:"Primeiros BTR-82A IFVs com enxame de drones Shahed-136.",groups:[{type:"ifv",count:2+a,interval:2.2,delay:.2},{type:"drone_swarm",count:7+e*2,interval:.55,delay:2.8}]},{wave:4,title:"Ponta de Lança Blindada",brief:"Tanques T-90M com ERA escoltados por veículos leves.",groups:[{type:"imv",count:8,interval:.85,delay:.2},{type:"mbt",count:2+a,interval:3.5,delay:2},{type:"ifv",count:3,interval:1.9,delay:3}]},{wave:5,title:`SUB-CHEFE: ${c[t]}`,brief:`ALERTA DE SUB-CHEFE! ${c[t]} ataca suas torres ativamente. Repare [R] ou use Iron Dome/Abrams!`,groups:[{type:"infantry",count:12,interval:.45,delay:.2},{type:"ifv",count:3,interval:1.8,delay:1.8},{type:t,count:1,interval:1,delay:4.5},{type:"drone_swarm",count:8,interval:.5,delay:6}]},{wave:6,title:"Ataque Aéreo Combinado",brief:"Helicópteros Havoc e enxames Shahed testam sua defesa antiaérea.",groups:[{type:"drone_swarm",count:12+a*2,interval:.4,delay:.2},{type:"heli",count:2+a,interval:2.4,delay:2},{type:"mbt",count:2,interval:3.2,delay:3.5}]},{wave:7,title:"Incursão Furtiva",brief:"Caças Stealth Su-57 entram no radar! Exigem Patriot Nv2 (AESA) ou Torre EW.",groups:[{type:"mbt",count:3+a,interval:2.8,delay:.2},{type:"stealth",count:2+Math.floor(e/2),interval:3.2,delay:3},{type:"ifv",count:5,interval:1.4,delay:1.5}]},{wave:8,title:"Tempestade Multi-Domínio",brief:"Saturação simultânea terrestre e aérea com blindados pesados.",groups:[{type:"ifv",count:6,interval:1.2,delay:.2},{type:"mbt",count:4+a,interval:2.2,delay:1.8},{type:"heli",count:4,interval:1.9,delay:2.8},{type:"drone_swarm",count:14,interval:.35,delay:4.5}]},{wave:9,title:"Guarda Avançada do Chefe",brief:"Unidades blindadas e furtivas preparam o avanço do Chefe de Fase.",groups:[{type:"mbt",count:5+a,interval:2,delay:.2},{type:"stealth",count:4,interval:2.2,delay:2},{type:"heli",count:4,interval:1.8,delay:3.2},{type:"infantry",count:18,interval:.32,delay:1}]},{wave:10,title:`CHEFE DE FASE: ${l[i]}`,brief:`ALERTA DE COMANDO! ${l[i]} dispara contra suas defesas. Use Iron Dome, Abrams e Suporte Aéreo!`,groups:[{type:"mbt",count:3+a,interval:2.5,delay:.2},{type:"drone_swarm",count:14,interval:.35,delay:1.5},{type:i,count:1,interval:1,delay:4.5},{type:"stealth",count:3,interval:2.4,delay:6.5}]}].map(h=>({...h,hpMult:s}))}const r={megaboss_scud_convoy:"MAZ-7917 Topol/Iskander-M + Fortaleza",megaboss_object279:'Object 279 "Kotin" Nuclear Tank',megaboss_kirov_airship:'Fortaleza Aérea "Kirov Command Carrier"'},o=a===1?"megaboss_scud_convoy":a===2?"megaboss_object279":"megaboss_kirov_airship";return[{wave:1,title:"Cerco à Fortaleza — Vanguarda",brief:"Comboio mecanizado de abertura em alta pressão.",groups:[{type:"infantry",count:16,interval:.4,delay:.2},{type:"imv",count:8,interval:.8,delay:1.8}]},{wave:2,title:"Ataque Mecanizado & Drones",brief:"BTR-82A IFVs apoiados por enxame de Shahed-136.",groups:[{type:"ifv",count:6,interval:1.5,delay:.2},{type:"drone_swarm",count:14,interval:.4,delay:1.5}]},{wave:3,title:"Divisão de Tanques Proryv",brief:"Tanques pesados T-90M + ERA avançam em formação cerrada.",groups:[{type:"mbt",count:5+a,interval:2.1,delay:.2},{type:"heli",count:4,interval:2,delay:2.5}]},{wave:4,title:"ESCOLTA ELITE 1: TOS-1A BURATINO",brief:"Sub-Chefe TOS-1A Buratino dispara foguetes termobáricos contra suas torres!",groups:[{type:"mbt",count:3,interval:2.4,delay:.2},{type:"subboss_tos1",count:1,interval:1,delay:3},{type:"ifv",count:5,interval:1.4,delay:4}]},{wave:5,title:"Tempestade Stealth & Havoc",brief:"Incursão aérea mista de Su-57 furtivos e helicópteros blindados.",groups:[{type:"stealth",count:5,interval:1.9,delay:.2},{type:"heli",count:5,interval:1.6,delay:1.5},{type:"drone_swarm",count:18,interval:.3,delay:2.5}]},{wave:6,title:"ESCOLTA ELITE 2: PANTSIR-S1M",brief:"Sub-Chefe Pantsir-S1M avança com APS ativo e canhões 30mm antitorre!",groups:[{type:"subboss_pantsir",count:1,interval:1,delay:2},{type:"mbt",count:5,interval:1.9,delay:.2},{type:"drone_swarm",count:16,interval:.32,delay:3.5}]},{wave:7,title:"Saturação de Armadura Pesada",brief:"Coluna massiva de T-90M, IFVs e caças furtivos.",groups:[{type:"mbt",count:6+a,interval:1.7,delay:.2},{type:"ifv",count:7,interval:1.2,delay:1},{type:"stealth",count:4,interval:2,delay:3}]},{wave:8,title:"ESCOLTA ELITE 3: KA-50 BLACK SHARK",brief:"Sub-Chefe Aéreo Ka-50 ataca suas baterias antiaéreas com mísseis Vikhr!",groups:[{type:"subboss_ka50",count:1,interval:1,delay:2},{type:"heli",count:5,interval:1.6,delay:.5},{type:"mbt",count:5,interval:2,delay:2.5},{type:"stealth",count:4,interval:2,delay:4}]},{wave:9,title:"Prelúdio do Juízo Final",brief:"Última barragem antes do Chefe Supremo. Repare suas torres e carregue suportes!",groups:[{type:"mbt",count:7,interval:1.6,delay:.2},{type:"drone_swarm",count:22,interval:.26,delay:1},{type:"stealth",count:5,interval:1.8,delay:2.5},{type:"heli",count:5,interval:1.5,delay:3.5}]},{wave:10,title:`CHEFE SUPREMO: ${r[o]}`,brief:`DEFCON 1! ${r[o]} escoltado por Sub-Chefes de elite! Proteja seu perímetro a todo custo!`,groups:[{type:"subboss_tos1",count:1,interval:1,delay:1},{type:"subboss_pantsir",count:1,interval:1,delay:3.5},{type:o,count:1,interval:1,delay:5.5},{type:"subboss_ka50",count:1,interval:1,delay:8},{type:"mbt",count:4,interval:2.2,delay:2}]}].map(l=>({...l,hpMult:s}))}const ol=[{worldId:1,name:"Mundo 1: Operação Tempestade do Deserto",region:"Oriente Médio",biome:"desert",description:"Terreno árido, dunas douradas, cânions rochosos e rodovias desérticas estratégicas.",skyColor:1446929,fogColor:1775378,sunColor:16771522,rimColor:3718648,stages:[{worldId:1,stageId:1,id:"1-1",title:"Desfiladeiro de Basra",subtitle:"Corredor duplo no deserto | Sub-Chefe: TOS-1A | Chefe: 2S35 Koalitsiya",startingBudget:750,clearBonusWB:60,isBossStage:!1,spawnPoints:[{col:0,row:3,id:"ALPHA"},{col:0,row:12,id:"BRAVO"}],fobPoint:{col:27,row:7},roadCells:_i([[[0,3],[7,3],[7,6],[14,6],[14,7],[27,7]],[[0,12],[6,12],[6,10],[14,10],[14,7]]]),rockCells:[[4,7],[4,8],[10,2],[10,3],[11,12],[11,13],[17,3],[17,4],[19,11],[19,12],[23,3],[23,4],[23,11],[23,12]],waves:Si(1,1,"subboss_tos1","boss_koalitsiya",!1)},{worldId:1,stageId:2,id:"1-2",title:"Refinaria Al-Faw",subtitle:"Rotas em zigue-zague | Sub-Chefe: Pantsir-S1M | Chefe: BMPT-72 Terminator",startingBudget:820,clearBonusWB:80,isBossStage:!1,spawnPoints:[{col:0,row:2,id:"ALPHA"},{col:0,row:13,id:"BRAVO"}],fobPoint:{col:27,row:8},roadCells:_i([[[0,2],[5,2],[5,6],[11,6],[11,3],[18,3],[18,8],[27,8]],[[0,13],[8,13],[8,10],[16,10],[16,13],[22,13],[22,8],[27,8]]]),rockCells:[[3,7],[3,8],[8,2],[8,3],[13,7],[13,8],[14,13],[14,14],[20,4],[20,5],[24,3],[24,4],[25,12],[25,13]],waves:Si(1,2,"subboss_pantsir","boss_terminator",!1)},{worldId:1,stageId:3,id:"1-3",title:"Vale do Eufrates",subtitle:"Três eixos de aproximação | Sub-Chefe: Ka-50 | Chefe: Tu-160 White Swan",startingBudget:880,clearBonusWB:100,isBossStage:!1,spawnPoints:[{col:0,row:2,id:"ALPHA"},{col:0,row:8,id:"BRAVO"},{col:0,row:13,id:"CHARLIE"}],fobPoint:{col:27,row:8},roadCells:_i([[[0,2],[9,2],[9,5],[17,5],[17,8],[27,8]],[[0,8],[13,8],[17,8]],[[0,13],[10,13],[10,11],[19,11],[19,8]]]),rockCells:[[5,4],[5,5],[6,10],[6,11],[13,2],[13,3],[14,13],[14,14],[21,3],[21,4],[22,12],[22,13]],waves:Si(1,3,"subboss_ka50","boss_tu160",!1)},{worldId:1,stageId:4,id:"1-4",title:"Cidadela de Palmira",subtitle:"Gargalo de cânions | Sub-Chefe: TOS-1A | Chefe: T-14 Armata EMP",startingBudget:950,clearBonusWB:120,isBossStage:!1,spawnPoints:[{col:0,row:4,id:"ALPHA"},{col:0,row:11,id:"BRAVO"}],fobPoint:{col:27,row:7},roadCells:_i([[[0,4],[7,4],[7,7],[15,7],[15,4],[21,4],[21,7],[27,7]],[[0,11],[7,11],[7,7],[15,7],[15,11],[21,11],[21,7]]]),rockCells:[[3,1],[4,1],[3,14],[4,14],[11,2],[11,3],[11,12],[11,13],[18,7],[18,8],[24,2],[24,3],[24,12],[24,13]],waves:Si(1,4,"subboss_tos1","boss_armata",!1)},{worldId:1,stageId:5,id:"1-5",title:"FORTALEZA FINAL: BASTIÃO SCUD",subtitle:"FASE CHEFE SUPREMO | Escolta: TOS-1A, Pantsir, Ka-50 | Mega Boss: MAZ-7917 Topol-M",startingBudget:1150,clearBonusWB:240,isBossStage:!0,spawnPoints:[{col:0,row:3,id:"ALPHA"},{col:0,row:12,id:"BRAVO"}],fobPoint:{col:27,row:7},roadCells:_i([[[0,3],[6,3],[6,5],[12,5],[12,2],[19,2],[19,7],[27,7]],[[0,12],[6,12],[6,10],[12,10],[12,13],[19,13],[19,7]]]),rockCells:[[3,7],[3,8],[9,7],[9,8],[15,6],[15,9],[22,3],[22,4],[22,11],[22,12],[24,10]],waves:Si(1,5,"subboss_tos1","megaboss_scud_convoy",!0)}]},{worldId:2,name:"Mundo 2: Fronteira Ártica Siberiana",region:"Ártico",biome:"arctic",description:"Neve profunda, gelo rachado, pinheiros nevados e iluminação polar glacial.",skyColor:726562,fogColor:990766,sunColor:14412542,rimColor:6809849,stages:[{worldId:2,stageId:1,id:"2-1",title:"Estação Polar Murmansk",subtitle:"Gelo costeiro | Sub-Chefe: Pantsir-S1M | Chefe: 2S35 Koalitsiya",startingBudget:850,clearBonusWB:90,isBossStage:!1,spawnPoints:[{col:0,row:4,id:"ALPHA"},{col:0,row:11,id:"BRAVO"}],fobPoint:{col:27,row:8},roadCells:_i([[[0,4],[8,4],[8,2],[16,2],[16,8],[27,8]],[[0,11],[9,11],[9,13],[19,13],[19,8]]]),rockCells:[[4,7],[4,8],[12,6],[12,7],[13,10],[13,11],[21,3],[21,4],[23,11],[23,12]],waves:Si(2,1,"subboss_pantsir","boss_koalitsiya",!1)},{worldId:2,stageId:2,id:"2-2",title:"Passo da Tundra Congelada",subtitle:"Cruzamento duplo | Sub-Chefe: Ka-50 | Chefe: BMPT-72 Terminator",startingBudget:920,clearBonusWB:110,isBossStage:!1,spawnPoints:[{col:0,row:2,id:"ALPHA"},{col:0,row:13,id:"BRAVO"}],fobPoint:{col:27,row:7},roadCells:_i([[[0,2],[6,2],[6,9],[14,9],[14,4],[22,4],[22,7],[27,7]],[[0,13],[9,13],[9,6],[18,6],[18,12],[24,12],[24,7]]]),rockCells:[[3,6],[3,7],[11,2],[11,3],[11,13],[11,14],[17,2],[17,3],[20,9],[20,10],[25,2],[25,3]],waves:Si(2,2,"subboss_ka50","boss_terminator",!1)},{worldId:2,stageId:3,id:"2-3",title:"Base Submarina Severodvinsk",subtitle:"Três frentes glaciais | Sub-Chefe: TOS-1A | Chefe: Tu-160 White Swan",startingBudget:980,clearBonusWB:130,isBossStage:!1,spawnPoints:[{col:0,row:2,id:"ALPHA"},{col:0,row:7,id:"BRAVO"},{col:0,row:13,id:"CHARLIE"}],fobPoint:{col:27,row:7},roadCells:_i([[[0,2],[7,2],[7,5],[16,5],[16,7],[27,7]],[[0,7],[11,7],[11,9],[21,9],[21,7]],[[0,13],[8,13],[8,11],[21,11],[21,7]]]),rockCells:[[4,4],[4,10],[12,2],[12,3],[14,13],[14,14],[19,3],[19,4],[24,3],[24,11]],waves:Si(2,3,"subboss_tos1","boss_tu160",!1)},{worldId:2,stageId:4,id:"2-4",title:"Geleira Novaya Zemlya",subtitle:"Anel central | Sub-Chefe: Pantsir-S1M | Chefe: T-14 Armata EMP",startingBudget:1050,clearBonusWB:155,isBossStage:!1,spawnPoints:[{col:0,row:3,id:"ALPHA"},{col:0,row:12,id:"BRAVO"}],fobPoint:{col:27,row:8},roadCells:_i([[[0,3],[5,3],[5,8],[13,8],[13,3],[20,3],[20,8],[27,8]],[[0,12],[5,12],[5,8],[13,8],[13,13],[20,13],[20,8]]]),rockCells:[[9,5],[9,10],[16,6],[16,10],[23,3],[23,12],[2,7],[2,8]],waves:Si(2,4,"subboss_pantsir","boss_armata",!1)},{worldId:2,stageId:5,id:"2-5",title:"FORTALEZA FINAL: BUNKER KOTIN",subtitle:"FASE CHEFE SUPREMO | Escolta: TOS-1A, Pantsir, Ka-50 | Mega Boss: Object 279 Nuclear",startingBudget:1250,clearBonusWB:300,isBossStage:!0,spawnPoints:[{col:0,row:2,id:"ALPHA"},{col:0,row:13,id:"BRAVO"}],fobPoint:{col:27,row:7},roadCells:_i([[[0,2],[7,2],[7,6],[14,6],[14,3],[21,3],[21,7],[27,7]],[[0,13],[7,13],[7,9],[14,9],[14,12],[21,12],[21,7]]]),rockCells:[[3,7],[3,8],[10,2],[10,13],[17,7],[17,8],[24,3],[24,4],[24,11],[24,12]],waves:Si(2,5,"subboss_pantsir","megaboss_object279",!0)}]},{worldId:3,name:"Mundo 3: Bastilha Industrial",region:"Leste Europeu",biome:"industrial",description:"Concreto urbano, ruínas siderúrgicas, trilhos ferroviários e asfalto escuro.",skyColor:790550,fogColor:1053982,sunColor:16639626,rimColor:16347926,stages:[{worldId:3,stageId:1,id:"3-1",title:"Pátio Ferroviário Donbas",subtitle:"Linhas paralelas | Sub-Chefe: Ka-50 | Chefe: 2S35 Koalitsiya",startingBudget:950,clearBonusWB:125,isBossStage:!1,spawnPoints:[{col:0,row:3,id:"ALPHA"},{col:0,row:12,id:"BRAVO"}],fobPoint:{col:27,row:8},roadCells:_i([[[0,3],[10,3],[10,6],[18,6],[18,8],[27,8]],[[0,12],[10,12],[10,10],[18,10],[18,8]]]),rockCells:[[5,6],[5,7],[5,8],[14,2],[14,3],[14,12],[14,13],[22,4],[22,5],[22,11],[22,12]],waves:Si(3,1,"subboss_ka50","boss_koalitsiya",!1)},{worldId:3,stageId:2,id:"3-2",title:"Siderúrgica Azovstal",subtitle:"Labirinto de concreto | Sub-Chefe: TOS-1A | Chefe: BMPT-72 Terminator",startingBudget:1020,clearBonusWB:150,isBossStage:!1,spawnPoints:[{col:0,row:2,id:"ALPHA"},{col:0,row:13,id:"BRAVO"}],fobPoint:{col:27,row:7},roadCells:_i([[[0,2],[5,2],[5,7],[12,7],[12,3],[19,3],[19,7],[27,7]],[[0,13],[8,13],[8,10],[15,10],[15,13],[23,13],[23,7]]]),rockCells:[[2,7],[2,8],[8,3],[8,4],[15,6],[15,7],[18,10],[18,11],[25,3],[25,11]],waves:Si(3,2,"subboss_tos1","boss_terminator",!1)},{worldId:3,stageId:3,id:"3-3",title:"Aeródromo Militar Engels",subtitle:"Três pistas de assalto | Sub-Chefe: Pantsir-S1M | Chefe: Tu-160 White Swan",startingBudget:1100,clearBonusWB:175,isBossStage:!1,spawnPoints:[{col:0,row:2,id:"ALPHA"},{col:0,row:8,id:"BRAVO"},{col:0,row:13,id:"CHARLIE"}],fobPoint:{col:27,row:8},roadCells:_i([[[0,2],[9,2],[9,5],[19,5],[19,8],[27,8]],[[0,8],[15,8],[19,8]],[[0,13],[9,13],[9,11],[19,11],[19,8]]]),rockCells:[[4,5],[4,10],[13,2],[13,3],[13,13],[13,14],[23,4],[23,12]],waves:Si(3,3,"subboss_pantsir","boss_tu160",!1)},{worldId:3,stageId:4,id:"3-4",title:"Complexo Nuclear Kursk",subtitle:"Setores fortificados | Sub-Chefe: Ka-50 | Chefe: T-14 Armata EMP",startingBudget:1180,clearBonusWB:210,isBossStage:!1,spawnPoints:[{col:0,row:4,id:"ALPHA"},{col:0,row:11,id:"BRAVO"}],fobPoint:{col:27,row:7},roadCells:_i([[[0,4],[6,4],[6,7],[13,7],[13,4],[21,4],[21,7],[27,7]],[[0,11],[6,11],[6,7],[13,7],[13,11],[21,11],[21,7]]]),rockCells:[[3,1],[3,14],[9,2],[9,13],[17,7],[17,8],[24,3],[24,12]],waves:Si(3,4,"subboss_ka50","boss_armata",!1)},{worldId:3,stageId:5,id:"3-5",title:"FORTALEZA FINAL: CIDADELA KIROV",subtitle:"CHEFE SUPREMO FINAL | Escolta: TOS-1A, Pantsir, Ka-50 | Mega Boss: Fortaleza Aérea Kirov",startingBudget:1350,clearBonusWB:400,isBossStage:!0,spawnPoints:[{col:0,row:2,id:"ALPHA"},{col:0,row:8,id:"BRAVO"},{col:0,row:13,id:"CHARLIE"}],fobPoint:{col:27,row:7},roadCells:_i([[[0,2],[7,2],[7,5],[14,5],[14,7],[27,7]],[[0,8],[7,8],[7,7],[14,7]],[[0,13],[7,13],[7,10],[14,10],[14,7]]]),rockCells:[[10,2],[10,13],[18,3],[18,4],[18,11],[18,12],[23,3],[23,12]],waves:Si(3,5,"subboss_ka50","megaboss_kirov_airship",!0)}]}];function br(a){return ol.find(e=>e.worldId===a)||ol[0]}function wr(a,e){const t=br(a);return t.stages.find(i=>i.stageId===e)||t.stages[0]}const mo="defcon_frontline_save_v3",hh="defcon_frontline_save_v3_bak",mx="defcon_frontline_save_v2",gx="defcon_frontline_save_v2_bak",vx="defcon_frontline_save_v1",$s="defcon_frontline_slot_",xx="DefconFrontlineDB",_x=1,An="saves",bs=3,Tr=5,fd=["m2_bunker","bushmaster","phalanx","hesco"],pd=["a10","hellfire"];function ur(){return{version:bs,warBonds:250,unlockedTowers:[...fd],unlockedSupports:[...pd],towerTech:{},completedStages:{},unlockedStages:["1-1"],selectedWorld:1,selectedStage:1,lastSavedAt:Date.now(),activeMission:null}}function ja(a){const e=typeof a=="number"&&Number.isFinite(a)?Math.floor(a):0;return Math.max(0,Math.min(Tr,e))}function Sx(a){if(!a||typeof a!="object")return null;const e=a;if(typeof e.defId!="string"||typeof e.col!="number"||typeof e.row!="number"||!Number.isInteger(e.col)||!Number.isInteger(e.row))return null;const t=typeof e.level=="number"&&Number.isFinite(e.level)?Math.max(1,Math.min(3,Math.floor(e.level))):1,i=typeof e.maxHp=="number"&&Number.isFinite(e.maxHp)&&e.maxHp>0?Math.round(e.maxHp):500,n=typeof e.hp=="number"&&Number.isFinite(e.hp)&&e.hp>0?Math.min(i,Math.round(e.hp)):i;return{defId:e.defId,col:e.col,row:e.row,level:t,hp:n,maxHp:i,effectiveCost:typeof e.effectiveCost=="number"&&Number.isFinite(e.effectiveCost)?Math.max(0,Math.round(e.effectiveCost)):100,totalInvested:typeof e.totalInvested=="number"&&Number.isFinite(e.totalInvested)?Math.max(0,Math.round(e.totalInvested)):100,priority:typeof e.priority=="string"?e.priority:"first",turretAngle:typeof e.turretAngle=="number"&&Number.isFinite(e.turretAngle)?e.turretAngle:Math.PI/2,totalDamage:typeof e.totalDamage=="number"&&Number.isFinite(e.totalDamage)?Math.max(0,e.totalDamage):0,kills:typeof e.kills=="number"&&Number.isFinite(e.kills)?Math.max(0,Math.floor(e.kills)):0}}function md(a){if(!a||typeof a!="object")return null;const e=a,t=typeof e.worldId=="number"?Math.floor(e.worldId):0,i=typeof e.stageId=="number"?Math.floor(e.stageId):0;if(t<1||t>3||i<1||i>5)return null;const n=Array.isArray(e.towers)?e.towers:[],s=[];for(const o of n){const l=Sx(o);l&&s.push(l)}const r=e.airSupportTimers&&typeof e.airSupportTimers=="object"?e.airSupportTimers:{};return{timestamp:typeof e.timestamp=="number"&&Number.isFinite(e.timestamp)?e.timestamp:Date.now(),worldId:t,stageId:i,budget:typeof e.budget=="number"&&Number.isFinite(e.budget)?Math.max(0,Math.floor(e.budget)):0,sessionWB:typeof e.sessionWB=="number"&&Number.isFinite(e.sessionWB)?Math.max(0,Math.floor(e.sessionWB)):0,fobMaxHp:typeof e.fobMaxHp=="number"&&Number.isFinite(e.fobMaxHp)&&e.fobMaxHp>0?Math.floor(e.fobMaxHp):20,fobHp:typeof e.fobHp=="number"&&Number.isFinite(e.fobHp)?Math.max(1,Math.floor(e.fobHp)):20,completedWave:typeof e.completedWave=="number"&&Number.isFinite(e.completedWave)?Math.max(0,Math.floor(e.completedWave)):0,totalWaves:typeof e.totalWaves=="number"&&Number.isFinite(e.totalWaves)?Math.max(1,Math.floor(e.totalWaves)):10,totalKills:typeof e.totalKills=="number"&&Number.isFinite(e.totalKills)?Math.max(0,Math.floor(e.totalKills)):0,totalDamage:typeof e.totalDamage=="number"&&Number.isFinite(e.totalDamage)?Math.max(0,e.totalDamage):0,airSupportTimers:{a10:typeof r.a10=="number"&&Number.isFinite(r.a10)?Math.max(0,r.a10):0,hellfire:typeof r.hellfire=="number"&&Number.isFinite(r.hellfire)?Math.max(0,r.hellfire):0,b52:typeof r.b52=="number"&&Number.isFinite(r.b52)?Math.max(0,r.b52):0},towers:s}}function Mx(a){const e=typeof a.version=="number"?Math.floor(a.version):1,t={...a};return e<2&&(t.selectedWorld=1,t.selectedStage=1),e<3&&(t.lastSavedAt=Date.now(),t.activeMission=null),t.version=bs,t}function ps(a){if(!a||typeof a!="object")return null;let e=a;const t=typeof e.version=="number"?Math.floor(e.version):1;if(t>bs)return null;t<bs&&(e=Mx(e));const i=ur(),n=new Set(fd);if(Array.isArray(e.unlockedTowers))for(const u of e.unlockedTowers)typeof u=="string"&&n.add(u);const s=new Set(pd);if(Array.isArray(e.unlockedSupports))for(const u of e.unlockedSupports)typeof u=="string"&&s.add(u);const r=new Set(["1-1"]);if(Array.isArray(e.unlockedStages))for(const u of e.unlockedStages)typeof u=="string"&&/^\d+-\d+$/.test(u)&&r.add(u);const o={};if(e.completedStages&&typeof e.completedStages=="object")for(const[u,d]of Object.entries(e.completedStages))/^\d+-\d+$/.test(u)&&typeof d=="number"&&Number.isFinite(d)&&d>0&&(o[u]=Math.floor(d));const l={};if(e.towerTech&&typeof e.towerTech=="object"){for(const[u,d]of Object.entries(e.towerTech))if(d&&typeof d=="object"){const f=d;l[u]={damage:ja(f.damage),fireRate:ja(f.fireRate),hp:ja(f.hp),cost:ja(f.cost)}}}const c=typeof e.selectedWorld=="number"&&e.selectedWorld>=1&&e.selectedWorld<=3?Math.floor(e.selectedWorld):i.selectedWorld,h=typeof e.selectedStage=="number"&&e.selectedStage>=1&&e.selectedStage<=5?Math.floor(e.selectedStage):i.selectedStage;return{version:bs,warBonds:typeof e.warBonds=="number"&&Number.isFinite(e.warBonds)?Math.max(0,Math.floor(e.warBonds)):i.warBonds,unlockedTowers:Array.from(n),unlockedSupports:Array.from(s),towerTech:l,completedStages:o,unlockedStages:Array.from(r),selectedWorld:c,selectedStage:h,lastSavedAt:typeof e.lastSavedAt=="number"&&Number.isFinite(e.lastSavedAt)?e.lastSavedAt:Date.now(),activeMission:md(e.activeMission)}}function er(a){return JSON.parse(JSON.stringify(a))}class yx{constructor(){this.dbPromise=null}open(){return typeof indexedDB>"u"?Promise.resolve(null):this.dbPromise?this.dbPromise:(this.dbPromise=new Promise(e=>{try{const t=indexedDB.open(xx,_x);t.onupgradeneeded=()=>{const i=t.result;i.objectStoreNames.contains(An)||i.createObjectStore(An)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null)}catch{e(null)}}),this.dbPromise)}async put(e,t){const i=await this.open();if(i)try{i.transaction(An,"readwrite").objectStore(An).put(t,e)}catch{}}async get(e){const t=await this.open();return t?new Promise(i=>{try{const s=t.transaction(An,"readonly").objectStore(An).get(e);s.onsuccess=()=>i(s.result??null),s.onerror=()=>i(null)}catch{i(null)}}):null}async remove(e){const t=await this.open();if(t)try{t.transaction(An,"readwrite").objectStore(An).delete(e)}catch{}}}class bx{constructor(){this.idb=new yx,this.hadLocalStorageSave=!1,this.state=this.load()}load(){if(typeof localStorage>"u")return ur();for(const e of[mo,hh,mx,gx,vx])try{const t=localStorage.getItem(e);if(!t)continue;const i=JSON.parse(t),n=ps(i);if(n)return this.hadLocalStorageSave=!0,n}catch{}return ur()}async syncFromIndexedDB(){for(const e of["primary","backup"]){const t=await this.idb.get(e);if(!t)continue;const i=ps(t);if(i&&(!this.hadLocalStorageSave||i.lastSavedAt>this.state.lastSavedAt))return this.state=i,this.writeLocalOnly(),!0}return!1}writeLocalOnly(){if(!(typeof localStorage>"u"))try{const e=localStorage.getItem(mo);e&&localStorage.setItem(hh,e),localStorage.setItem(mo,JSON.stringify(this.state))}catch{}}save(){this.state.lastSavedAt=Date.now(),this.writeLocalOnly(),this.idb.put("backup",er(this.state)),this.idb.put("primary",er(this.state))}getState(){return this.state}getLastSavedAt(){return this.state.lastSavedAt}getWarBonds(){return this.state.warBonds}addWarBonds(e){return!Number.isFinite(e)||e<=0?this.state.warBonds:(this.state.warBonds+=Math.floor(e),this.save(),this.state.warBonds)}isTowerUnlocked(e){return this.state.unlockedTowers.includes(e)}unlockTower(e,t){return this.isTowerUnlocked(e)?!0:this.state.warBonds<t?!1:(this.state.warBonds-=t,this.state.unlockedTowers.push(e),this.save(),!0)}isSupportUnlocked(e){return this.state.unlockedSupports.includes(e)}unlockSupport(e,t){return this.isSupportUnlocked(e)?!0:this.state.warBonds<t?!1:(this.state.warBonds-=t,this.state.unlockedSupports.push(e),this.save(),!0)}getTowerTech(e){const t=this.state.towerTech[e];return t||{damage:0,fireRate:0,hp:0,cost:0}}getUpgradeTechCost(e){return 40+e*35}upgradeTowerTech(e,t,i){if(!this.isTowerUnlocked(e))return!1;const n={...this.getTowerTech(e)},s=n[t];if(s>=Tr)return!1;const r=i??this.getUpgradeTechCost(s);return this.state.warBonds<r?!1:(this.state.warBonds-=r,n[t]=s+1,this.state.towerTech[e]=n,this.save(),!0)}getTechMultipliers(e){const t=this.getTowerTech(e);return{damageMult:1+.1*t.damage,fireRateMult:1+.08*t.fireRate,hpMult:1+.2*t.hp,costMult:1-.05*t.cost}}getStageKey(e,t){return`${e}-${t}`}isStageUnlocked(e,t){return this.state.unlockedStages.includes(this.getStageKey(e,t))}getStageWins(e,t){return this.state.completedStages[this.getStageKey(e,t)]||0}selectStage(e,t){return this.isStageUnlocked(e,t)?(this.state.selectedWorld=e,this.state.selectedStage=t,this.save(),!0):!1}markStageCompleted(e,t,i){const n=this.getStageKey(e,t);this.state.completedStages[n]=(this.state.completedStages[n]||0)+1,this.state.warBonds+=Math.max(0,Math.floor(i));let s=null;return t<5?s=this.getStageKey(e,t+1):e<3&&(s=this.getStageKey(e+1,1)),s&&!this.state.unlockedStages.includes(s)&&this.state.unlockedStages.push(s),this.state.activeMission=null,this.save(),s}unlockAllCampaign(){for(let e=1;e<=3;e++)for(let t=1;t<=5;t++){const i=this.getStageKey(e,t);this.state.unlockedStages.includes(i)||this.state.unlockedStages.push(i)}this.save()}saveActiveMission(e){this.state.activeMission=e?md(e):null,this.save()}getActiveMission(){return this.state.activeMission}clearActiveMission(){this.state.activeMission!==null&&(this.state.activeMission=null,this.save())}saveToSlot(e){const t=this.state.activeMission,i=t?`Fase ${t.worldId}-${t.stageId} • Onda ${t.completedWave}/${t.totalWaves} • ${t.towers.length} Torres • ${this.state.warBonds} WB$`:`Campanha • Fase ${this.state.selectedWorld}-${this.state.selectedStage} • ${this.state.warBonds} WB$`,n={slotId:e,savedAt:Date.now(),label:i,state:er(this.state)};if(typeof localStorage<"u")try{localStorage.setItem(`${$s}${e}`,JSON.stringify(n))}catch{}return this.idb.put(`slot_${e}`,n),n}loadFromSlot(e){if(typeof localStorage>"u")return!1;try{const t=localStorage.getItem(`${$s}${e}`);if(!t)return!1;const i=JSON.parse(t),n=ps(i?.state);return n?(this.state=n,this.save(),!0):!1}catch{return!1}}deleteSlot(e){if(typeof localStorage<"u")try{localStorage.removeItem(`${$s}${e}`)}catch{}this.idb.remove(`slot_${e}`)}listSlots(){const e=[];for(const t of[1,2,3]){let i=null;if(typeof localStorage<"u")try{const n=localStorage.getItem(`${$s}${t}`);if(n){const s=JSON.parse(n),r=ps(s?.state);r&&(i={slotId:t,savedAt:typeof s.savedAt=="number"?s.savedAt:r.lastSavedAt,label:typeof s.label=="string"?s.label:`Slot ${t}`,state:r})}}catch{i=null}e.push(i)}return e}exportSaveJson(){const e={app:"DEFCON_FRONTLINE",exportedAt:new Date().toISOString(),schemaVersion:bs,state:er(this.state),slots:this.listSlots()};return JSON.stringify(e,null,2)}importSaveJson(e){try{const t=JSON.parse(e);if(!t||typeof t!="object")return{ok:!1,error:"Arquivo JSON inválido."};const i=t,n=i.app==="DEFCON_FRONTLINE"?i.state:i,s=ps(n);if(!s)return{ok:!1,error:"Estrutura de save incompatível ou de versão mais recente."};if(this.state=s,this.save(),Array.isArray(i.slots))for(const r of i.slots){if(!r||typeof r!="object")continue;const o=r;if(o.slotId===1||o.slotId===2||o.slotId===3){const l=ps(o.state);if(l){const c={slotId:o.slotId,savedAt:typeof o.savedAt=="number"?o.savedAt:Date.now(),label:typeof o.label=="string"?o.label:`Slot ${o.slotId}`,state:l};typeof localStorage<"u"&&localStorage.setItem(`${$s}${o.slotId}`,JSON.stringify(c)),this.idb.put(`slot_${o.slotId}`,c)}}}return{ok:!0}}catch{return{ok:!1,error:"Falha ao ler arquivo JSON de save."}}}resetSave(){this.state=ur(),this.save()}}const Xe=new bx,Ve=28,St=16,tt=64,Ye={FREE:0,ROAD:1,ROCK:2,SPAWN:3,FOB:4,TOWER:5,BARRIER:6},dh=[{col:0,row:3,id:"ALPHA"},{col:0,row:12,id:"BRAVO"}],uh={col:27,row:7},tr=[{dc:1,dr:0},{dc:-1,dr:0},{dc:0,dr:1},{dc:0,dr:-1}];class wx{constructor(){this.totalCells=Ve*St,this.grid=Array.from({length:St},()=>new Uint8Array(Ve)),this.baseTerrain=Array.from({length:St},()=>new Uint8Array(Ve)),this.distField=Array.from({length:St},()=>new Float32Array(Ve)),this.flatGrid=new Uint8Array(this.totalCells),this.flatBase=new Uint8Array(this.totalCells),this.flatDist=new Float32Array(this.totalCells),this.gScore=new Float32Array(this.totalCells),this.fScore=new Float32Array(this.totalCells),this.cameFrom=new Int32Array(this.totalCells),this.closed=new Uint8Array(this.totalCells),this.inOpen=new Uint8Array(this.totalCells),this.openHeap=new Int32Array(this.totalCells),this.checkedMask=new Uint8Array(this.totalCells),this.bfsQueueIdx=new Int32Array(this.totalCells*2),this.bfsQueueDist=new Float32Array(this.totalCells*2),this.spawnPoints=dh.map(e=>({...e})),this.fobPoint={...uh},this.roadCells=[],this.rockCells=[],this.spawnPaths=new Map,this.loadStageLayout(wr(1,1))}loadStageLayout(e){this.spawnPoints=(e.spawnPoints||dh).map(t=>({...t})),this.fobPoint={...e.fobPoint||uh},this.roadCells=e.roadCells||[],this.rockCells=e.rockCells||[],this.reset()}reset(){for(let t=0;t<St;t++)this.grid[t].fill(Ye.FREE),this.baseTerrain[t].fill(Ye.FREE),this.distField[t].fill(1/0);this.flatGrid.fill(Ye.FREE),this.flatBase.fill(Ye.FREE),this.flatDist.fill(1/0);for(const[t,i]of this.roadCells){if(!this.inBounds(t,i))continue;this.baseTerrain[i][t]=Ye.ROAD,this.grid[i][t]=Ye.ROAD;const n=i*Ve+t;this.flatBase[n]=Ye.ROAD,this.flatGrid[n]=Ye.ROAD}for(const[t,i]of this.rockCells){if(!this.inBounds(t,i))continue;const n=i*Ve+t;this.flatBase[n]!==Ye.ROAD&&(this.baseTerrain[i][t]=Ye.ROCK,this.grid[i][t]=Ye.ROCK,this.flatBase[n]=Ye.ROCK,this.flatGrid[n]=Ye.ROCK)}for(const t of this.spawnPoints){this.baseTerrain[t.row][t.col]=Ye.SPAWN,this.grid[t.row][t.col]=Ye.SPAWN;const i=t.row*Ve+t.col;this.flatBase[i]=Ye.SPAWN,this.flatGrid[i]=Ye.SPAWN}const e=this.fobPoint.row*Ve+this.fobPoint.col;this.baseTerrain[this.fobPoint.row][this.fobPoint.col]=Ye.FOB,this.grid[this.fobPoint.row][this.fobPoint.col]=Ye.FOB,this.flatBase[e]=Ye.FOB,this.flatGrid[e]=Ye.FOB,this.recomputeNavigation()}inBounds(e,t){return e>=0&&e<Ve&&t>=0&&t<St}isPassable(e,t){if(e<0||e>=Ve||t<0||t>=St)return!1;const i=this.flatGrid[t*Ve+e];return i===Ye.FREE||i===Ye.ROAD||i===Ye.SPAWN||i===Ye.FOB}isBuildable(e,t){if(e<0||e>=Ve||t<0||t>=St)return!1;const i=this.flatGrid[t*Ve+e];return i===Ye.FREE||i===Ye.ROAD}tileCost(e,t){return this.flatBase[t*Ve+e]===Ye.ROAD?.96:1}canPlaceAt(e,t,i=[]){if(!this.isBuildable(e,t))return{ok:!1,reason:"Célula ocupada ou terreno intransponível."};const n=t*Ve+e,s=this.flatGrid[n];this.flatGrid[n]=Ye.BARRIER,this.grid[t][e]=Ye.BARRIER;let r=!0;const o=new Map;for(let l=0;l<this.spawnPoints.length;l++){const c=this.spawnPoints[l],h=this.findPath(c.col,c.row);if(!h){r=!1;break}o.set(c.id,h)}if(r&&i.length>0){this.checkedMask.fill(0);for(let l=0;l<i.length;l++){const c=i[l],h=Math.floor(c.x/tt),u=Math.floor(c.y/tt);if(h<0||h>=Ve||u<0||u>=St)continue;if(h===e&&u===t){r=!1;break}const d=u*Ve+h;if(this.checkedMask[d]===0&&(this.checkedMask[d]=1,!this.hasPathFast(h,u))){r=!1;break}}}return this.flatGrid[n]=s,this.grid[t][e]=s,r?{ok:!0,previewPaths:o}:{ok:!1,reason:"ROTA BLOQUEADA: Proibido fechar 100% do caminho até a FOB!",previewPaths:null}}placeStructure(e,t,i){const n=i?Ye.BARRIER:Ye.TOWER;this.grid[t][e]=n,this.flatGrid[t*Ve+e]=n,this.recomputeNavigation()}removeStructure(e,t){const i=this.baseTerrain[t][e];this.grid[t][e]=i,this.flatGrid[t*Ve+e]=i,this.recomputeNavigation()}recomputeNavigation(){this.computeDistanceField(),this.spawnPaths.clear();for(const e of this.spawnPoints){const t=this.findPath(e.col,e.row);t&&this.spawnPaths.set(e.id,t)}}computeDistanceField(){for(let n=0;n<St;n++)this.distField[n].fill(1/0);this.flatDist.fill(1/0);const e=this.fobPoint.row*Ve+this.fobPoint.col;this.flatDist[e]=0,this.distField[this.fobPoint.row][this.fobPoint.col]=0;let t=0,i=0;for(this.bfsQueueIdx[i]=e,this.bfsQueueDist[i]=0,i++;t<i;){const n=this.bfsQueueIdx[t],s=this.bfsQueueDist[t];if(t++,s>this.flatDist[n])continue;const r=n%Ve,o=n/Ve|0;for(let l=0;l<4;l++){const c=r+tr[l].dc,h=o+tr[l].dr;if(c<0||c>=Ve||h<0||h>=St)continue;const u=h*Ve+c,d=this.flatGrid[u];if(d!==Ye.FREE&&d!==Ye.ROAD&&d!==Ye.SPAWN&&d!==Ye.FOB)continue;const f=this.flatBase[u]===Ye.ROAD?.96:1,m=s+f;m<this.flatDist[u]&&(this.flatDist[u]=m,this.distField[h][c]=m,this.bfsQueueIdx[i]=u,this.bfsQueueDist[i]=m,i++)}}}hasPathFast(e,t){return this.runAStar(e,t)!==-1}findPath(e,t){const i=this.runAStar(e,t);return i===-1?null:this.reconstructPath(i)}runAStar(e,t){if(!this.isPassable(e,t))return-1;const i=this.gScore,n=this.fScore,s=this.cameFrom,r=this.closed,o=this.inOpen,l=this.openHeap,c=this.flatGrid,h=this.flatBase;i.fill(1/0),n.fill(1/0),s.fill(-1),r.fill(0),o.fill(0);const u=this.fobPoint.col,d=this.fobPoint.row,f=t*Ve+e,m=d*Ve+u;i[f]=0,n[f]=(Math.abs(e-u)+Math.abs(t-d))*.96;let x=0;for(l[x++]=f,o[f]=1;x>0;){const p=l[0];if(x--,x>0){const _=l[x];let E=0;const T=n[_];for(;;){const v=(E<<1)+1;if(v>=x)break;const M=v+1;let I=v;if(M<x&&n[l[M]]<n[l[v]]&&(I=M),T<=n[l[I]])break;l[E]=l[I],E=I}l[E]=_}if(p===m)return m;o[p]=0,r[p]=1;const g=p%Ve,S=p/Ve|0,w=i[p];for(let _=0;_<4;_++){const E=g+tr[_].dc,T=S+tr[_].dr;if(E<0||E>=Ve||T<0||T>=St)continue;const v=T*Ve+E;if(r[v])continue;const M=c[v];if(M!==Ye.FREE&&M!==Ye.ROAD&&M!==Ye.SPAWN&&M!==Ye.FOB)continue;const I=h[v]===Ye.ROAD?.96:1,R=w+I;if(R<i[v]){s[v]=p,i[v]=R;const D=R+(Math.abs(E-u)+Math.abs(T-d))*.96;if(n[v]=D,o[v]){let O=-1;for(let W=0;W<x;W++)if(l[W]===v){O=W;break}for(;O>0;){const W=O-1>>1;if(D>=n[l[W]])break;const N=l[W];l[W]=l[O],l[O]=N,O=W}}else{o[v]=1;let O=x++;for(;O>0;){const W=O-1>>1;if(D>=n[l[W]])break;l[O]=l[W],O=W}l[O]=v}}}}return-1}reconstructPath(e){const t=[],i=this.cameFrom;for(;e!==-1;){const n=e%Ve,s=e/Ve|0;t.push({col:n,row:s,x:n*tt+tt*.5,y:s*tt+tt*.5}),e=i[e]}return t.reverse(),t}getDistanceToFobPx(e,t){const i=Math.max(0,Math.min(Ve-1,Math.floor(e/tt))),n=Math.max(0,Math.min(St-1,Math.floor(t/tt))),s=this.flatDist[n*Ve+i];return Number.isFinite(s)?s*tt:Math.hypot((this.fobPoint.col+.5)*tt-e,(this.fobPoint.row+.5)*tt-t)}}function Tx(a,e,t,i={}){const{armorPierce:n=0,armorIgnore:s=0,heavyMultiplier:r=1,tandemHeat:o=!1,critChance:l=0,isMissile:c=!1,allowApsIntercept:h=!0}=i;if(h&&c&&t!=="laser"&&a.hasAps&&a.apsCooldownTimer<=0&&!a.ewDisabled)return a.apsCooldownTimer=a.apsMaxCooldown||4,{damage:0,apsIntercepted:!0,isRicochet:!1,isCrit:!1,eraBlocked:!1};let d=1,f=!1,m=!1,x=!1;const p=a.armorClass;if(t==="kinetic"||t==="aa"){if(p==="medium"){const S=.35*(1-n);d*=1-S}else if(p==="heavy"){const S=.75*(1-n);d*=1-S,n<.3&&(f=!0)}}else if(t==="apds"){if(p==="medium"){const S=.25*(1-s);d*=1-S}else if(p==="heavy"){const S=.75*(1-s);d*=1-S,r>1&&(d*=r)}}else t==="heat"?(p==="heavy"?d*=r:p==="medium"&&(d*=1.35),a.hasEra&&a.eraIntact&&!a.ewDisabled&&(o?a.eraIntact=!1:(d*=.6,a.eraIntact=!1,m=!0))):t==="thermobaric"?(a.hasEra&&a.eraIntact&&(a.eraIntact=!1),p==="heavy"||p==="light"?d*=1.35:p==="medium"&&(d*=1.25)):t==="laser"?d*=p==="heavy"?1.15:1:t==="he"||t==="he_rocket"?p==="light"?d*=1.15:p==="heavy"&&(d*=t==="he_rocket"?1.2:.85):t==="aa_missile"&&a.domain==="air"&&(d*=1.15);return l>0&&Math.random()<l&&(d*=1.6,x=!0),a.ewDamageAmp>0&&(d*=1+a.ewDamageAmp),a.thermalVuln>0&&(d*=1+a.thermalVuln),{damage:Math.max(1,Math.round(e*d)),apsIntercepted:!1,isRicochet:f,isCrit:x,eraBlocked:m}}class Ex{constructor(){this.ctx=null,this.master=null,this.noiseBuffer=null,this.muted=!1,this.volume=.45,this.lastPlayed=new Map}unlock(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=this.muted?0:this.volume,this.master.connect(this.ctx.destination),this.noiseBuffer=this.createNoiseBuffer(2)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}setMuted(e){this.muted=e,this.master&&this.ctx&&this.master.gain.setTargetAtTime(e?0:this.volume,this.ctx.currentTime,.02)}toggleMute(){return this.setMuted(!this.muted),this.muted}createNoiseBuffer(e){const t=this.ctx.sampleRate,i=Math.floor(t*e),n=this.ctx.createBuffer(1,i,t),s=n.getChannelData(0);for(let r=0;r<i;r++)s[r]=Math.random()*2-1;return n}canPlay(e,t){if(this.muted||!this.ctx||this.ctx.state!=="running")return!1;const i=performance.now(),n=this.lastPlayed.get(e)||0;return i-n<t?!1:(this.lastPlayed.set(e,i),!0)}playShot(e){if(!this.ctx)return;const t=this.ctx.currentTime;if(e==="mg50"){if(!this.canPlay("mg50",48))return;this.percussiveBurst(t,160,55,.065,.14,"sawtooth",1400)}else if(e==="ciws"){if(!this.canPlay("ciws",34))return;this.percussiveBurst(t,280,110,.038,.09,"square",2200)}else if(e==="autocannon"){if(!this.canPlay("autocannon",90))return;this.percussiveBurst(t,125,42,.12,.22,"sawtooth",950)}else if(e==="missile"){if(!this.canPlay("missile",110))return;this.noiseSweep(t,350,1900,.28,.18)}else if(e==="howitzer"){if(!this.canPlay("howitzer",180))return;this.percussiveBurst(t,82,24,.34,.38,"triangle",500),this.noiseSweep(t,450,140,.32,.24)}else if(e==="laser"){if(!this.canPlay("laser",140))return;const i=this.ctx.createOscillator(),n=this.ctx.createGain();i.type="sawtooth",i.frequency.setValueAtTime(640,t),i.frequency.linearRampToValueAtTime(780,t+.14),n.gain.setValueAtTime(.055,t),n.gain.exponentialRampToValueAtTime(.001,t+.16),i.connect(n),n.connect(this.master),i.start(t),i.stop(t+.17)}else if(e==="emp"){if(!this.canPlay("emp",300))return;const i=this.ctx.createOscillator(),n=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(920,t),i.frequency.exponentialRampToValueAtTime(65,t+.45),n.gain.setValueAtTime(.28,t),n.gain.exponentialRampToValueAtTime(.001,t+.46),i.connect(n),n.connect(this.master),i.start(t),i.stop(t+.48)}}playExplosion(e=1){if(!this.canPlay(e>1.2?"big_exp":"exp",e>1.2?90:55))return;const t=this.ctx.currentTime,i=Math.min(.85,.22+e*.18),n=Math.min(.45,.16+e*.1),s=this.ctx.createOscillator(),r=this.ctx.createGain();s.type="sine",s.frequency.setValueAtTime(95,t),s.frequency.exponentialRampToValueAtTime(22,t+i),r.gain.setValueAtTime(n,t),r.gain.exponentialRampToValueAtTime(.001,t+i),s.connect(r),r.connect(this.master),s.start(t),s.stop(t+i+.02),this.noiseSweep(t,700,110,i,n*.85)}playRicochet(){if(!this.canPlay("ricochet",65))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="triangle";const n=1750+Math.random()*650;t.frequency.setValueAtTime(n,e),t.frequency.exponentialRampToValueAtTime(n*1.55,e+.09),i.gain.setValueAtTime(.09,e),i.gain.exponentialRampToValueAtTime(.001,e+.1),t.connect(i),i.connect(this.master),t.start(e),t.stop(e+.11)}playApsIntercept(){if(!this.canPlay("aps",120))return;const e=this.ctx.currentTime;this.percussiveBurst(e,640,180,.09,.2,"square",2800)}playA10Brrrt(){if(!this.ctx||this.muted)return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createOscillator(),n=this.ctx.createBiquadFilter(),s=this.ctx.createGain();t.type="sawtooth",t.frequency.setValueAtTime(66,e),t.frequency.linearRampToValueAtTime(62,e+1.15),i.type="square",i.frequency.setValueAtTime(132,e),n.type="bandpass",n.frequency.setValueAtTime(420,e),n.Q.value=1.4,s.gain.setValueAtTime(.001,e),s.gain.linearRampToValueAtTime(.42,e+.06),s.gain.setValueAtTime(.4,e+.95),s.gain.exponentialRampToValueAtTime(.001,e+1.25),t.connect(n),i.connect(n),n.connect(s),s.connect(this.master),t.start(e),i.start(e),t.stop(e+1.28),i.stop(e+1.28),this.noiseSweep(e,2600,380,1.35,.28)}playHellfireStrike(){if(!this.ctx||this.muted)return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(1480,e),t.frequency.setValueAtTime(1960,e+.08),i.gain.setValueAtTime(.14,e),i.gain.exponentialRampToValueAtTime(.001,e+.2),t.connect(i),i.connect(this.master),t.start(e),t.stop(e+.21),this.noiseSweep(e+.05,3200,480,.45,.22)}playUi(e="click"){if(!this.ctx||this.muted)return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),n=this.ctx.createGain();e==="error"?(i.type="sawtooth",i.frequency.setValueAtTime(180,t),i.frequency.setValueAtTime(135,t+.07),n.gain.setValueAtTime(.12,t),n.gain.exponentialRampToValueAtTime(.001,t+.18),i.connect(n),n.connect(this.master),i.start(t),i.stop(t+.19)):e==="wave"?(i.type="triangle",i.frequency.setValueAtTime(520,t),i.frequency.setValueAtTime(780,t+.11),n.gain.setValueAtTime(.15,t),n.gain.exponentialRampToValueAtTime(.001,t+.3),i.connect(n),n.connect(this.master),i.start(t),i.stop(t+.32)):e==="repair"?(i.type="triangle",i.frequency.setValueAtTime(420,t),i.frequency.setValueAtTime(630,t+.06),n.gain.setValueAtTime(.11,t),n.gain.exponentialRampToValueAtTime(.001,t+.16),i.connect(n),n.connect(this.master),i.start(t),i.stop(t+.17)):e==="alert"?(i.type="sawtooth",i.frequency.setValueAtTime(880,t),i.frequency.setValueAtTime(660,t+.11),i.frequency.setValueAtTime(880,t+.22),n.gain.setValueAtTime(.14,t),n.gain.exponentialRampToValueAtTime(.001,t+.36),i.connect(n),n.connect(this.master),i.start(t),i.stop(t+.38)):e==="build"?(i.type="square",i.frequency.setValueAtTime(320,t),i.frequency.setValueAtTime(480,t+.04),n.gain.setValueAtTime(.08,t),n.gain.exponentialRampToValueAtTime(.001,t+.11),i.connect(n),n.connect(this.master),i.start(t),i.stop(t+.12)):(i.type="sine",i.frequency.setValueAtTime(840,t),n.gain.setValueAtTime(.06,t),n.gain.exponentialRampToValueAtTime(.001,t+.05),i.connect(n),n.connect(this.master),i.start(t),i.stop(t+.06))}percussiveBurst(e,t,i,n,s,r,o){const l=this.ctx.createOscillator(),c=this.ctx.createGain();if(l.type=r,l.frequency.setValueAtTime(t,e),l.frequency.exponentialRampToValueAtTime(i,e+n),c.gain.setValueAtTime(s,e),c.gain.exponentialRampToValueAtTime(.001,e+n),l.connect(c),c.connect(this.master),l.start(e),l.stop(e+n+.01),this.noiseBuffer){const h=this.ctx.createBufferSource();h.buffer=this.noiseBuffer;const u=this.ctx.createBiquadFilter();u.type="lowpass",u.frequency.setValueAtTime(o,e);const d=this.ctx.createGain();d.gain.setValueAtTime(s*.65,e),d.gain.exponentialRampToValueAtTime(.001,e+n),h.connect(u),u.connect(d),d.connect(this.master),h.start(e),h.stop(e+n+.01)}}noiseSweep(e,t,i,n,s){if(!this.noiseBuffer)return;const r=this.ctx.createBufferSource();r.buffer=this.noiseBuffer;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(t,e),o.frequency.exponentialRampToValueAtTime(Math.max(40,i),e+n),o.Q.value=.9;const l=this.ctx.createGain();l.gain.setValueAtTime(s,e),l.gain.exponentialRampToValueAtTime(.001,e+n),r.connect(o),o.connect(l),l.connect(this.master),r.start(e),r.stop(e+n+.02)}}const ke=new Ex,ri={gunmetal:2764084,steel:6583435,darkSteel:3883597,navalWhite:15067632,navalGray:6055795,brass:12950343,stealthGraphite:1975341,opticGreen:2293606,shtoraRed:16720418,radarCyan:2282478,amber:16096779,afterburner:16743168};let ir=null;const fh=new Map,ll=new Map;function Lt(a,e){const t=fh.get(a);if(t)return t;const i=e();return fh.set(a,i),i}function Ns(){return ir||(ir={olive:Jt("natoArmorPlate",{color:13950142,roughness:.68,metalness:.24,envMapIntensity:1.15,bumpScale:.035,repeat:[1.5,1.5]}),oliveDark:Jt("natoArmorPlate",{color:10134660,roughness:.72,metalness:.28,envMapIntensity:1.1,bumpScale:.035,repeat:[1.5,1.5]}),desertArmor:Jt("desertCarcPlate",{color:15591123,roughness:.74,metalness:.16,envMapIntensity:1.05,bumpScale:.03,repeat:[1.5,1.5]}),sandbag:Jt("sandbagBurlap",{roughness:.94,metalness:.02,bumpScale:.08,envMapIntensity:.65,repeat:[1.2,1.2]}),gunmetal:new nt({color:ri.gunmetal,roughness:.3,metalness:.88,envMapIntensity:1.35}),steel:new nt({color:8030619,roughness:.34,metalness:.84,envMapIntensity:1.3}),darkSteel:new nt({color:ri.darkSteel,roughness:.38,metalness:.8,envMapIntensity:1.25}),diamondPlate:Jt("diamondSteelPlate",{roughness:.42,metalness:.78,bumpScale:.055,envMapIntensity:1.25,repeat:[2,2]}),concrete:Jt("concreteBunker",{color:13685978,roughness:.9,metalness:.06,bumpScale:.045,envMapIntensity:.8,repeat:[1.5,1.5]}),concreteDark:Jt("concreteBunker",{color:9607328,roughness:.88,metalness:.1,bumpScale:.045,envMapIntensity:.85,repeat:[1.5,1.5]}),rusCamo:Jt("opforCamoPlate",{roughness:.7,metalness:.24,bumpScale:.035,envMapIntensity:1.1,repeat:[1.5,1.5]}),rusDark:Jt("opforCamoPlate",{color:10661794,roughness:.74,metalness:.28,bumpScale:.035,envMapIntensity:1.1,repeat:[1.5,1.5]}),blackShark:new nt({color:1711652,roughness:.42,metalness:.55,envMapIntensity:1.2}),tracks:Jt("tankTracks",{roughness:.62,metalness:.65,bumpScale:.075,envMapIntensity:1.1,repeat:[1,3.2]}),tire:Jt("offroadTire",{roughness:.86,metalness:.08,bumpScale:.07,envMapIntensity:.75,repeat:[2,1]}),navalWhite:new nt({color:ri.navalWhite,roughness:.28,metalness:.3,envMapIntensity:1.2}),navalGray:new nt({color:ri.navalGray,roughness:.42,metalness:.62,envMapIntensity:1.2}),copperAesa:new nt({color:14251782,emissive:4528643,emissiveIntensity:.45,roughness:.26,metalness:.85,envMapIntensity:1.35}),camoNet:new nt({color:5989169,roughness:.92,metalness:.05,side:Ot}),brass:new nt({color:ri.brass,roughness:.26,metalness:.9,envMapIntensity:1.35}),glass:new nt({color:726568,roughness:.08,metalness:.92,envMapIntensity:1.5}),sapphireOptic:new nt({color:959977,emissive:165063,emissiveIntensity:.85,roughness:.1,metalness:.9,envMapIntensity:1.5}),opticGreen:new nt({color:ri.opticGreen,emissive:ri.opticGreen,emissiveIntensity:2,roughness:.18}),shtoraRed:new nt({color:ri.shtoraRed,emissive:ri.shtoraRed,emissiveIntensity:2.5,roughness:.2}),radarCyan:new nt({color:ri.radarCyan,emissive:ri.radarCyan,emissiveIntensity:1.9,roughness:.2}),amberGlow:new nt({color:ri.amber,emissive:ri.amber,emissiveIntensity:1.9,roughness:.2}),afterburner:new nt({color:ri.afterburner,emissive:ri.afterburner,emissiveIntensity:3.1,roughness:.2}),ewCyan:new nt({color:3718648,emissive:959977,emissiveIntensity:1.6,transparent:!0,opacity:.45,roughness:.2,side:Ot}),empPurple:new nt({color:12616956,emissive:11032055,emissiveIntensity:2.2,roughness:.2}),rotorDisc:new nt({color:9741240,transparent:!0,opacity:.16,roughness:.5,depthWrite:!1,side:Ot}),muzzleFlashGold:new Pt({color:new Ke(2.4,1.75,.55),transparent:!0,opacity:.92,blending:en,depthWrite:!1}),muzzleFlashCyan:new Pt({color:new Ke(.55,1.95,2.5),transparent:!0,opacity:.92,blending:en,depthWrite:!1})},ir)}function Er(a,e=!0,t=!0){a.traverse(i=>{if(i.isMesh){const n=i;n.userData?.noShadow?(n.castShadow=!1,n.receiveShadow=!1):(n.castShadow=e,n.receiveShadow=t)}})}function L(a,e,t,i,n,s=0,r=0,o=0,l=0,c=0,h=0){const u=Lt(`box:${e}:${t}:${i}`,()=>new Et(e,t,i)),d=new V(u,n);return d.position.set(s,r,o),d.rotation.set(l,c,h),a.add(d),d}function X(a,e,t,i,n,s,r=0,o=0,l=0,c=0,h=0,u=0){const d=Lt(`cyl:${e}:${t}:${i}:${n}`,()=>new wi(e,t,i,n)),f=new V(d,s);return f.position.set(r,o,l),f.rotation.set(c,h,u),a.add(f),f}function Vt(a,e,t=.035,i=.035){const n=`se:${e}:${t}:${i}:${a.map(s=>`${s[0]},${s[1]}`).join(";")}`;return Lt(n,()=>{const s=new Nl;s.moveTo(a[0][0],a[0][1]);for(let o=1;o<a.length;o++)s.lineTo(a[o][0],a[o][1]);s.closePath();const r=new Pr(s,{depth:e,bevelEnabled:t>0&&i>0,bevelSegments:2,steps:1,bevelSize:t,bevelThickness:i});return r.translate(0,0,-e*.5),r.rotateY(-Math.PI*.5),r.computeVertexNormals(),r})}function Us(a,e,t=.03,i=.03){const n=`pe:${e}:${t}:${i}:${a.map(s=>`${s[0]},${s[1]}`).join(";")}`;return Lt(n,()=>{const s=new Nl;s.moveTo(a[0][0],-a[0][1]);for(let o=1;o<a.length;o++)s.lineTo(a[o][0],-a[o][1]);s.closePath();const r=new Pr(s,{depth:e,bevelEnabled:t>0&&i>0,bevelSegments:2,steps:1,bevelSize:t,bevelThickness:i});return r.rotateX(-Math.PI*.5),r.computeVertexNormals(),r})}function Qt(a,e=14){const t=`lz:${e}:${a.map(i=>`${i[0]},${i[1]}`).join(";")}`;return Lt(t,()=>{const i=a.map(([s,r])=>new re(Math.max(1e-4,s),r)),n=new Ir(i,e);return n.rotateX(Math.PI*.5),n.computeVertexNormals(),n})}function gd(a,e=18){const t=`ly:${e}:${a.map(i=>`${i[0]},${i[1]}`).join(";")}`;return Lt(t,()=>{const i=a.map(([s,r])=>new re(Math.max(1e-4,s),r)),n=new Ir(i,e);return n.computeVertexNormals(),n})}function va(a,e,t,i,n=.22,s=1){const r=Vt([[-.17,-.1],[.17,-.1],[.15,.1],[-.15,.1]],.54,.025,.025);for(let o=0;o<s;o++){const l=o%2===1?Math.PI/t:0;for(let c=0;c<t;c++){const h=c/t*Math.PI*2+l,u=new V(r,i);u.position.set(Math.sin(h)*e,n+o*.21,Math.cos(h)*e),u.rotation.y=h,u.rotation.z=(c%2===0?1:-1)*.04,a.add(u)}}}function Gi(a,e,t,i,n,s=.24,r=e.rusDark){const o=new oe;return o.position.set(t,i,n),a.add(o),X(o,i,i,s,16,e.tire,0,0,0,0,0,Math.PI/2),X(o,i*.56,i*.56,s+.02,12,r,0,0,0,0,0,Math.PI/2),X(o,i*.24,i*.28,s+.06,8,e.darkSteel,0,0,0,0,0,Math.PI/2),o}function Dn(a,e,t,i,n,s,r){const o=Qt([[t*.95,0],[t*.95,t*.7],[t*.55,t*1.45],[.001,t*1.9]],10),l=new V(o,r);return l.position.set(i,n,s),a.add(l),l}function si(a,e,t,i,n,s=1,r=!1){const o=new oe;o.position.set(t,i,n),o.visible=!1;const l=r?e.muzzleFlashCyan:e.muzzleFlashGold,c=Lt("mf_core",()=>new nn(.22,8,6)),h=Lt("mf_spike",()=>new qi(.14,.78,6)),u=new V(c,l);u.userData.noShadow=!0,o.add(u);const d=new V(h,l);d.rotation.x=Math.PI/2,d.position.z=.36,d.userData.noShadow=!0,o.add(d);const f=new V(h,l);return f.rotation.z=Math.PI/2,f.scale.set(.6,.75,.6),f.userData.noShadow=!0,o.add(f),o.scale.setScalar(s),a.add(o),o}function Ar(a,e=1){const t=new oe,i={root:t},n=Ns();return a==="hesco"?(Ax(t,n,e),Er(t,!0,!0),i):(a==="m2_bunker"?Rx(t,i,n,e):a==="bushmaster"?Cx(t,i,n,e):a==="javelin"?Px(t,i,n,e):a==="phalanx"?Ix(t,i,n,e):a==="howitzer"?Dx(t,i,n,e):a==="patriot"?Lx(t,i,n,e):a==="ew_crew"?Nx(t,i,n,e):a==="abrams_pit"?Ux(t,i,n,e):a==="iron_dome"?Fx(t,i,n,e):a==="helios_laser"?Ox(t,i,n,e):a==="tos1_mlrs"&&Bx(t,i,n,e),Er(t,!0,!0),i.ewRings&&i.ewRings.forEach(s=>{s.castShadow=!1,s.receiveShadow=!1}),i)}function Ax(a,e,t){L(a,3.35,.16,3.35,e.concreteDark,0,.08,0);const i=Us([[-.64,-.64],[.64,-.64],[.64,.64],[-.64,.64]],1.22,.03,.03),n=[[-.78,-.78],[.78,-.78],[-.78,.78],[.78,.78]];for(const[r,o]of n){const l=new V(i,e.sandbag);l.position.set(r,.16,o),a.add(l),L(a,1.18,.14,1.18,e.concrete,r,1.44,o);for(const c of[-.67,.67])for(const h of[-.67,.67])L(a,.06,1.38,.06,e.darkSteel,r+c,.82,o+h);L(a,1.38,.05,1.38,e.steel,r,.45,o),L(a,1.38,.05,1.38,e.steel,r,1.05,o)}va(a,1.65,12,e.sandbag,.24,t>=2?2:1);const s=Lt("hesco_coil",()=>new Zn(.28,.03,6,12));for(let r=-3;r<=3;r++){const o=new V(s,e.steel);o.position.set(r*.36,1.68,0),o.rotation.y=Math.PI*.35+r*.2,a.add(o)}}function Rx(a,e,t,i){X(a,1.62,1.74,.22,8,t.concrete,0,.11,0),X(a,1.04,1.1,.16,8,t.diamondPlate,0,.28,0),va(a,1.38,12,t.sandbag,.32,i>=2?3:2),i<3?(L(a,1.7,.06,.72,t.camoNet,0,1.35,-.82,-.22,0,0),X(a,.03,.03,1.15,6,t.oliveDark,-.82,.78,-1.05),X(a,.03,.03,1.15,6,t.oliveDark,.82,.78,-1.05)):(L(a,.62,.42,.48,t.oliveDark,-.68,.56,-.68),L(a,.48,.32,.36,t.brass,.68,.5,-.62));const n=new oe;if(n.position.set(0,.38,0),a.add(n),e.turretPivot=n,i===1){for(const h of[0,2.2,-2.2])L(n,.075,.68,.075,t.darkSteel,Math.sin(h)*.28,.3,Math.cos(h)*.28,Math.cos(h)*.42,0,-Math.sin(h)*.42);X(n,.14,.18,.36,8,t.gunmetal,0,.62,0);const s=Vt([[-.04,-.3],[.04,-.3],[.08,.32],[-.02,.32]],.92,.02,.02),r=new V(s,t.olive);r.position.set(0,.86,.36),n.add(r);const o=new oe;o.position.set(0,.88,.16),n.add(o),e.barrelPivot=o,L(o,.24,.24,.64,t.gunmetal,0,0,-.06),L(o,.22,.24,.3,t.oliveDark,-.28,-.05,.02),L(o,.16,.03,.18,t.brass,-.14,.04,.02,0,0,.35);const l=Qt([[.085,.22],[.085,.62],[.05,.64],[.05,1.38],[.065,1.4],[.042,1.48]]);o.add(new V(l,t.gunmetal));const c=new ft;c.position.set(0,0,1.52),o.add(c),e.muzzlePoint=c,e.muzzleFlashMesh=si(o,t,0,0,1.58,.75)}else if(i===2){X(n,.36,.48,.68,10,t.darkSteel,0,.34,0),L(n,.42,.32,.36,t.oliveDark,-.45,.24,-.2),X(n,.22,.22,.36,12,t.olive,.42,.46,-.12);const s=Lt("m134_chute",()=>{const l=new Ll(new C(.42,.56,-.08),new C(.32,.92,-.04),new C(.14,.96,.06));return new Ul(l,10,.055,8,!1)});n.add(new V(s,t.brass)),L(n,.95,.64,.08,t.olive,0,.94,.36,-.16,0,0),L(n,.3,.3,.56,t.gunmetal,0,.96,.02),X(n,.11,.11,.38,12,t.steel,0,1.15,-.02,Math.PI/2,0,0);const r=new oe;r.position.set(0,.96,.32),n.add(r),e.gatlingPivot=r;for(let l=0;l<6;l++){const c=l/6*Math.PI*2;X(r,.024,.024,1.18,6,t.steel,Math.cos(c)*.095,Math.sin(c)*.095,.58,Math.PI/2,0,0)}X(r,.135,.135,.08,12,t.brass,0,0,.55,Math.PI/2,0,0),X(r,.135,.135,.09,12,t.gunmetal,0,0,1.08,Math.PI/2,0,0);const o=new ft;o.position.set(0,.96,1.54),n.add(o),e.muzzlePoint=o,e.muzzleFlashMesh=si(n,t,0,.96,1.62,.85)}else{X(n,.44,.54,.42,8,t.desertArmor,0,.21,0);const s=Vt([[-.36,.4],[.34,.4],[.42,.95],[.14,1.12],[-.32,.96]],.16,.02,.02);for(const c of[-.4,.4]){const h=new V(s,t.desertArmor);h.position.set(c,0,0),n.add(h)}const r=new oe;r.position.set(0,.98,.08),n.add(r),e.barrelPivot=r,L(r,.3,.28,.68,t.gunmetal,0,0,0),L(r,.26,.34,.42,t.oliveDark,-.34,-.08,-.02),L(r,.28,.32,.46,t.darkSteel,.34,.06,.14),X(r,.085,.085,.06,12,t.sapphireOptic,.34,.1,.38,Math.PI/2,0,0),X(r,.055,.055,.06,10,t.opticGreen,.27,-.03,.38,Math.PI/2,0,0),X(r,.038,.038,.06,8,t.shtoraRed,.41,-.03,.38,Math.PI/2,0,0);const o=Qt([[.09,.34],[.09,.72],[.052,.74],[.052,1.54],[.072,1.56],[.066,1.66],[.035,1.68]]);r.add(new V(o,t.gunmetal));const l=new ft;l.position.set(0,0,1.72),r.add(l),e.muzzlePoint=l,e.muzzleFlashMesh=si(r,t,0,0,1.78,.85)}}function Cx(a,e,t,i){X(a,1.48,1.64,.24,8,t.concreteDark,0,.12,0),X(a,1.18,1.28,.18,8,t.diamondPlate,0,.32,0),X(a,.86,.96,.22,8,t.oliveDark,0,.5,0);const n=new oe;if(n.position.set(0,.62,0),a.add(n),e.turretPivot=n,i===1){const s=Vt([[-.95,0],[.85,0],[1.02,.28],[.52,.68],[-.78,.68],[-1.08,.32]],1.38,.04,.04);n.add(new V(s,t.olive)),L(n,.82,.2,.56,t.oliveDark,0,.38,-1.04);for(const c of[-.74,.74])X(n,.06,.06,.26,6,t.gunmetal,c,.42,.58,Math.PI/3,c>0?-.3:.3,0);L(n,.32,.28,.36,t.darkSteel,.44,.78,.26),L(n,.2,.14,.08,t.opticGreen,.44,.8,.46);const r=new oe;r.position.set(0,.36,.9),n.add(r),e.barrelPivot=r,L(r,.32,.28,.34,t.gunmetal,0,0,.05);const o=Qt([[.095,.16],[.095,.55],[.062,.58],[.062,1.38],[.085,1.4],[.075,1.56],[.045,1.58]]);r.add(new V(o,t.gunmetal));const l=new ft;l.position.set(0,0,1.62),r.add(l),e.muzzlePoint=l,e.muzzleFlashMesh=si(r,t,0,0,1.68,1)}else if(i===2){const s=Vt([[-1.08,0],[.92,0],[1.12,.32],[.56,.76],[-.88,.76],[-1.22,.35]],1.66,.045,.045);n.add(new V(s,t.olive));for(const c of[-.9,.9])for(let h=0;h<3;h++)L(n,.12,.34,.42,t.desertArmor,c,.36,.45-h*.48);L(n,1.34,.46,.72,t.oliveDark,0,.42,-1.16),X(n,.18,.18,.42,10,t.brass,-.42,.76,-1.12),X(n,.18,.18,.42,10,t.brass,.42,.76,-1.12),X(n,.08,.1,.45,8,t.steel,-.35,.98,.12),L(n,.36,.24,.28,t.darkSteel,-.35,1.24,.16),X(n,.075,.075,.06,10,t.opticGreen,-.35,1.24,.31,Math.PI/2,0,0);const r=new oe;r.position.set(0,.38,.96),n.add(r),e.barrelPivot=r,L(r,.64,.3,.36,t.gunmetal,0,0,.06);const o=Qt([[.085,.18],[.085,.6],[.055,.62],[.055,1.48],[.078,1.5],[.04,1.66]]);for(const c of[-.19,.19]){const h=new V(o,t.gunmetal);h.position.x=c,r.add(h)}const l=new ft;l.position.set(0,0,1.7),r.add(l),e.muzzlePoint=l,e.muzzleFlashMesh=si(r,t,0,0,1.75,1.15)}else{const s=Vt([[-1.24,0],[1.1,0],[1.32,.34],[.72,.84],[-.95,.84],[-1.36,.38]],1.86,.06,.06);n.add(new V(s,t.desertArmor)),L(n,.64,.44,.72,t.oliveDark,-.62,.4,.74,0,.42,0),L(n,.64,.44,.72,t.oliveDark,.62,.4,.74,0,-.42,0),L(n,1.52,.52,.78,t.darkSteel,0,.44,-1.24),X(n,.26,.3,.24,10,t.darkSteel,-.42,.96,-.1),L(n,.32,.26,.3,t.steel,-.42,1.2,-.06),L(n,.22,.14,.06,t.sapphireOptic,-.42,1.2,.1),L(n,.36,.3,.38,t.darkSteel,.46,.92,.25),L(n,.24,.16,.06,t.opticGreen,.46,.94,.45);const r=new oe;r.position.set(0,.42,1.04),n.add(r),e.barrelPivot=r,L(r,.48,.36,.42,t.gunmetal,0,0,.08);const o=Qt([[.14,.2],[.14,.85],[.095,.9],[.095,1.65],[.125,1.68],[.115,1.88],[.06,1.92]]);r.add(new V(o,t.gunmetal));const l=new ft;l.position.set(0,0,1.95),r.add(l),e.muzzlePoint=l,e.muzzleFlashMesh=si(r,t,0,0,2.02,1.25)}}function Px(a,e,t,i){X(a,1.54,1.68,.24,8,t.concreteDark,0,.12,0),X(a,1.05,1.15,.16,8,t.diamondPlate,0,.28,0),va(a,1.4,10,t.sandbag,.3,1);const n=new oe;if(n.position.set(0,.36,0),a.add(n),e.turretPivot=n,e.missileCaps=[],i===1){X(n,.28,.38,.55,8,t.darkSteel,0,.28,0),L(n,.88,.18,.42,t.steel,0,.62,0),L(n,.28,.28,.42,t.olive,-.52,.82,.12),X(n,.08,.08,.06,10,t.opticGreen,-.52,.82,.34,Math.PI/2,0,0);const s=new oe;s.position.set(0,.84,.05),s.rotation.x=-.34,n.add(s),e.barrelPivot=s;for(const o of[-.22,.22]){X(s,.16,.16,1.38,12,t.olive,o,0,.05,Math.PI/2,0,0),X(s,.19,.19,.12,12,t.darkSteel,o,0,.72,Math.PI/2,0,0);const l=Dn(s,t,.11,o,0,.62,t.amberGlow);e.missileCaps.push(l)}const r=new ft;r.position.set(0,0,.82),s.add(r),e.muzzlePoint=r,e.muzzleFlashMesh=si(s,t,0,0,.9,1)}else if(i===2){X(n,.56,.64,.45,8,t.desertArmor,0,.22,0);const s=Vt([[-.45,.45],[.42,.45],[.48,.92],[.1,1.24],[-.45,1.2]],.78,.03,.03);n.add(new V(s,t.desertArmor)),L(n,.64,.36,.06,t.glass,0,.98,.34,-.45,0,0),L(n,.28,.24,.28,t.darkSteel,0,.78,.62),X(n,.065,.065,.05,10,t.opticGreen,0,.78,.78,Math.PI/2,0,0);const r=new oe;r.position.set(0,1.02,.05),r.rotation.x=-.36,n.add(r),e.barrelPivot=r;for(const l of[-.68,.68]){L(r,.48,.48,1.48,t.oliveDark,l,0,.05);for(const c of[-.11,.11])for(const h of[-.11,.11]){X(r,.085,.085,1.54,8,t.gunmetal,l+c,h,.06,Math.PI/2,0,0);const u=Dn(r,t,.068,l+c,h,.76,t.navalWhite);e.missileCaps.push(u)}}const o=new ft;o.position.set(0,0,.92),r.add(o),e.muzzlePoint=o,e.muzzleFlashMesh=si(r,t,0,0,1,1.1)}else{const s=Vt([[-.78,.18],[.78,.18],[.92,.62],[.42,.98],[-.72,.98]],1.24,.04,.04);n.add(new V(s,t.desertArmor)),X(n,.42,.52,.28,8,t.darkSteel,0,1.12,-.1);for(let c=0;c<4;c++){const h=c/4*Math.PI*2;L(n,.34,.24,.06,t.copperAesa,Math.sin(h)*.42,1.12,-.1+Math.cos(h)*.42,0,h,0)}const r=new oe;r.position.set(0,1.32,-.1),L(r,.65,.14,.1,t.radarCyan,0,.08,0),n.add(r),e.radarPivots=[r],X(n,.18,.18,.28,12,t.darkSteel,0,.84,.86),X(n,.08,.08,.06,10,t.sapphireOptic,0,.84,1,Math.PI/2,0,0);const o=new oe;o.position.set(0,.84,.08),o.rotation.x=-.35,n.add(o),e.barrelPivot=o,L(o,.52,.52,1.5,t.olive,-.88,0,.08);for(const c of[-.12,.12])for(const h of[-.12,.12]){const u=Dn(o,t,.07,-.88+c,h,.78,t.navalWhite);e.missileCaps.push(u)}L(o,.56,.52,.22,t.steel,.86,0,-.05);for(const c of[-.14,.14])for(const h of[-.14,.14]){X(o,.095,.095,1.38,10,t.gunmetal,.86+c,h,.05,Math.PI/2,0,0);const u=Dn(o,t,.088,.86+c,h,.74,t.amberGlow);e.missileCaps.push(u)}const l=new ft;l.position.set(0,0,.94),o.add(l),e.muzzlePoint=l,e.muzzleFlashMesh=si(o,t,0,0,1.05,1.2)}}function Ix(a,e,t,i){if(X(a,1.54,1.66,.24,12,t.concreteDark,0,.12,0),X(a,1.32,1.38,.16,12,t.diamondPlate,0,.3,0),i>=3)for(const p of[.78,2.35,3.92,5.49])L(a,.28,.2,.92,t.oliveDark,Math.sin(p)*1.48,.2,Math.cos(p)*1.48,0,p,0),X(a,.22,.26,.12,8,t.steel,Math.sin(p)*1.85,.06,Math.cos(p)*1.85);const n=new oe;n.position.set(0,.38,0),a.add(n),e.turretPivot=n;const s=i===3?t.desertArmor:t.navalGray,r=i===3?t.desertArmor:t.navalWhite;X(n,.84,.94,.28,16,s,0,.14,0),L(n,.24,.96,.68,s,-.58,.68,0),L(n,.24,.96,.68,s,.58,.68,0),X(n,.44,.44,.56,16,i===3?t.oliveDark:t.navalWhite,0,.54,.04,0,0,Math.PI/2);const o=i>=2?1.08:1,l=gd([[.01,0],[.44*o,0],[.46*o,.72*o],[.41*o,.96*o],[.24*o,1.15*o],[.01,1.22*o]]),c=new V(l,r);c.position.set(0,.96,-.02),n.add(c),X(n,.465*o,.465*o,.09,20,t.steel,0,1.62,-.02),i>=2&&(L(n,.34,.16,.24,t.steel,.62,1.05,.22),L(n,.26,.38,.36,r,.74,1.22,.28),X(n,.09,.09,.06,12,t.opticGreen,.74,1.24,.47,Math.PI/2,0,0));const h=new oe;h.position.set(0,.9,.28),h.rotation.x=-.18,n.add(h),e.barrelPivot=h,L(h,.42,.38,.56,t.gunmetal,0,0,.06);const u=new oe;u.position.set(0,0,.3),h.add(u),e.gatlingPivot=u;const d=i>=2?1.48:1.25,f=i>=2?.026:.021,m=i>=2?.115:.095;for(let p=0;p<6;p++){const g=p/6*Math.PI*2;X(u,f,f,d,6,t.gunmetal,Math.cos(g)*m,Math.sin(g)*m,d*.5,Math.PI/2,0,0)}X(u,m+.04,m+.04,.07,14,t.steel,0,0,d*.45,Math.PI/2,0,0),X(u,m+.045,m+.045,.09,14,t.steel,0,0,d*.92,Math.PI/2,0,0),i>=3&&(L(n,.34,.44,.62,t.darkSteel,-.78,1.15,.15),X(n,.14,.16,.36,12,t.steel,-.78,1.15,.55,Math.PI/2,0,0),X(n,.1,.1,.06,12,t.radarCyan,-.78,1.15,.74,Math.PI/2,0,0));const x=new ft;x.position.set(0,0,d+.34),h.add(x),e.muzzlePoint=x,e.muzzleFlashMesh=si(h,t,0,0,d+.38,.9)}function Dx(a,e,t,i){if(i===1){X(a,1.66,1.8,.16,12,t.concreteDark,0,.08,0),va(a,1.54,10,t.sandbag,.2,1);const n=new oe;n.position.set(0,.2,0),a.add(n),e.turretPivot=n;for(const[l,c]of[[-.55,1.4],[.55,1.4],[-2.5,1.05],[2.5,1.05]])L(n,.16,.14,c,t.oliveDark,Math.sin(l)*(c*.58),.22,-Math.cos(l)*(c*.58),0,-l,0),L(n,.36,.22,.22,t.gunmetal,Math.sin(l)*(c*1.12),.12,-Math.cos(l)*(c*1.12),0,-l,0);X(n,.54,.62,.32,8,t.olive,0,.28,0),L(n,.18,.62,.45,t.oliveDark,-.34,.66,.04),L(n,.18,.62,.45,t.oliveDark,.34,.66,.04),L(n,1.1,.68,.1,t.olive,0,.72,.36,-.25,0,0);const s=new oe;s.position.set(0,.78,.12),s.rotation.x=-.68,n.add(s),e.barrelPivot=s,L(s,.38,.36,.82,t.darkSteel,0,0,-.2),X(s,.075,.075,.95,10,t.steel,-.16,.14,.25,Math.PI/2,0,0),X(s,.075,.075,.95,10,t.steel,.16,.14,.25,Math.PI/2,0,0);const r=Qt([[.145,.15],[.145,.95],[.105,.98],[.105,2.38],[.175,2.42],[.175,2.66],[.08,2.7]]);s.add(new V(r,t.gunmetal));const o=new ft;o.position.set(0,0,2.74),s.add(o),e.muzzlePoint=o,e.muzzleFlashMesh=si(s,t,0,0,2.85,1.65)}else if(i===2){L(a,2.45,.22,3.05,t.concreteDark,0,.11,0);for(const c of[-1.04,1.04]){L(a,.48,.44,2.95,t.tracks,c,.34,0);for(let h=0;h<5;h++)X(a,.2,.2,.5,10,t.steel,c,.26,1-h*.5,0,0,Math.PI/2)}L(a,1.72,.44,2.72,t.desertArmor,0,.46,0);for(const c of[-.68,.68])L(a,.28,.24,.42,t.gunmetal,c,.22,-1.52);const n=new oe;n.position.set(0,.72,-.15),a.add(n),e.turretPivot=n;const s=Vt([[-1.38,0],[.82,0],[.98,.38],[.54,.94],[-1.28,.94],[-1.44,.46]],1.88,.05,.05);n.add(new V(s,t.desertArmor));for(let c=-2;c<=2;c++)X(n,.06,.06,.42,8,t.brass,c*.22,1.02,-1.05,Math.PI/2,0,0);const r=new oe;r.position.set(0,.48,.84),r.rotation.x=-.62,n.add(r),e.barrelPivot=r,L(r,.5,.42,.54,t.desertArmor,0,0,.14);const o=Qt([[.16,.2],[.16,.72],[.11,.75],[.11,1.32],[.155,1.38],[.155,1.72],[.105,1.78],[.105,2.55],[.18,2.6],[.18,2.86],[.085,2.9]]);r.add(new V(o,t.gunmetal));const l=new ft;l.position.set(0,0,2.94),r.add(l),e.muzzlePoint=l,e.muzzleFlashMesh=si(r,t,0,0,3.05,1.8)}else{L(a,2.8,.14,3.65,t.concreteDark,0,.07,0);const n=new oe;n.position.set(0,.14,0),a.add(n),e.turretPivot=n,L(n,1.36,.34,3.2,t.darkSteel,0,.52,-.05);for(const l of[1.08,-.45,-1.25])Gi(n,t,-.84,.36,l,.32,t.desertArmor),Gi(n,t,.84,.36,l,.32,t.desertArmor);const s=Vt([[.54,.62],[1.56,.62],[1.62,1.15],[1.36,1.66],[.54,1.66]],1.66,.04,.04);n.add(new V(s,t.desertArmor)),L(n,1.36,.36,.08,t.glass,0,1.34,1.56,-.35,0,0),L(n,1.72,.1,1.9,t.diamondPlate,0,.72,-.62);const r=new oe;r.position.set(0,1.05,-.78),r.rotation.x=-.76,n.add(r),e.barrelPivot=r,e.missileCaps=[],L(r,1.24,.86,1.92,t.oliveDark,0,.4,.2);for(const l of[-.36,0,.36])for(const c of[.22,.58]){X(r,.14,.14,1.98,10,t.gunmetal,l,c,.22,Math.PI/2,0,0);const h=Dn(r,t,.115,l,c,1.22,t.navalWhite);e.missileCaps.push(h)}const o=new ft;o.position.set(0,.4,1.32),r.add(o),e.muzzlePoint=o,e.muzzleFlashMesh=si(r,t,0,.4,1.4,1.7)}}function Lx(a,e,t,i){L(a,3.25,.2,3.25,t.concreteDark,0,.1,0),L(a,2.65,.12,2.65,t.diamondPlate,0,.26,0);for(const f of[.78,2.35,3.92,5.49])L(a,.26,.2,1.02,t.oliveDark,Math.sin(f)*1.38,.2,Math.cos(f)*1.38,0,f,0),X(a,.22,.26,.12,8,t.steel,Math.sin(f)*1.76,.06,Math.cos(f)*1.76);L(a,.72,.56,.54,t.oliveDark,0,.58,-1.16),L(a,.22,.18,.08,t.amberGlow,0,.66,-1.44);const n=new oe;n.position.set(0,.34,0),a.add(n),e.turretPivot=n,e.missileCaps=[],X(n,.88,.96,.28,12,t.steel,0,.14,0),L(n,1.38,.3,1.66,t.desertArmor,0,.42,0);const s=new oe;s.position.set(0,.82,-.08),s.rotation.x=-.66,n.add(s);const r=i===1?2:4,o=i===3?3:2,l=.44,c=.44,h=-((r-1)*l)*.5,u=.18;for(let f=0;f<r;f++)for(let m=0;m<o;m++){const x=h+f*l,p=u+m*c;L(s,.38,.38,2.28,t.olive,x,p,.15),L(s,.4,.4,.14,t.darkSteel,x,p,1.26);const g=Dn(s,t,.125,x,p,1.24,i===3?t.radarCyan:t.navalWhite);e.missileCaps.push(g)}if(i>=2){const f=i===3?t.radarCyan:t.copperAesa,m=new oe;m.position.set(0,1.35,-.78),n.add(m),L(m,1.18,.96,.24,t.desertArmor,0,.26,0,-.38,0,0);const x=L(m,.96,.78,.08,f,0,.26,.14,-.38,0,0);if(e.aesaPanel=x,i===3){e.radarPivots=[];for(const p of[-.78,.78]){const g=new oe;g.position.set(p,1,-.72),X(g,.06,.08,.45,6,t.steel,0,.22,0),L(g,.34,.22,.08,t.radarCyan,0,.46,0),n.add(g),e.radarPivots.push(g)}}}const d=new ft;d.position.set(0,.55,1.48),s.add(d),e.muzzlePoint=d,e.muzzleFlashMesh=si(s,t,0,.55,1.56,1.4,!0)}function Nx(a,e,t,i){X(a,1.54,1.66,.22,8,t.concreteDark,0,.11,0),X(a,1.24,1.32,.16,8,t.diamondPlate,0,.28,0);const n=Vt([[-.78,.36],[.78,.36],[.78,1.08],[-.78,1.08]],1.56,.04,.04);a.add(new V(n,t.oliveDark)),L(a,1.1,.18,.1,t.radarCyan,0,.92,.82),L(a,.32,.28,.08,t.steel,-.58,.68,.82),X(a,.14,.24,1.55,6,t.steel,0,1.85,0);for(const r of[1.4,1.9,2.4])L(a,.62,.06,.62,t.darkSteel,0,r,0);if(e.radarPivots=[],i===1)for(let r=0;r<3;r++){const o=r/3*Math.PI*2,l=new oe;l.position.set(Math.sin(o)*.56,1.7+r*.35,Math.cos(o)*.56);const c=new V(gd([[.02,0],[.32,.08],[.44,.22]]),t.steel);c.rotation.x=Math.PI/2-.3,l.add(c),X(l,.03,.03,.36,6,t.radarCyan,0,.08,.22,Math.PI/2-.3,0,0),a.add(l),e.radarPivots.push(l)}else if(i===2){const r=new oe;r.position.set(0,2.15,0),a.add(r),e.turretPivot=r;for(let o=0;o<4;o++){const l=o/4*Math.PI*2,c=new oe;c.position.set(Math.sin(l)*.52,.15,Math.cos(l)*.52),c.rotation.y=l,L(c,.54,.42,.1,t.darkSteel,0,0,0,-.22,0,0),L(c,.44,.32,.06,t.copperAesa,0,0,.06,-.22,0,0),r.add(c),e.radarPivots.push(c)}for(const[o,l]of[[-.45,-.45],[.45,-.45],[-.45,.45],[.45,.45]])X(a,.025,.035,1.3,6,t.steel,o,2.25,l),X(a,.045,.045,.14,8,t.radarCyan,o,2.9,l)}else{X(a,.12,.18,1.95,10,t.copperAesa,0,2.35,0);for(let r=0;r<5;r++){const o=Lt(`ew_coil_${r}`,()=>new Zn(.28-r*.02,.035,8,16)),l=new V(o,t.radarCyan);l.rotation.x=Math.PI/2,l.position.y=1.9+r*.28,a.add(l)}X(a,.2,.06,.28,12,t.radarCyan,0,3.45,0);for(let r=0;r<4;r++){const o=r/4*Math.PI*2,l=new oe;l.position.set(Math.sin(o)*.72,1.85,Math.cos(o)*.72),l.rotation.y=o,L(l,.56,.42,.1,t.radarCyan,0,0,0,-.45,0,0),a.add(l),e.radarPivots.push(l)}}e.ewRings=[];const s=i>=2?2:1;for(let r=0;r<s;r++){const o=Lt(`ew_ring_${r}`,()=>new Zn(.95+r*.35,.045,8,28)),l=new V(o,t.ewCyan);l.rotation.x=Math.PI/2,l.position.y=1.85+r*.6,l.userData.noShadow=!0,a.add(l),e.ewRings.push(l)}}function Ux(a,e,t,i){L(a,3.65,.2,3.65,t.concreteDark,0,.1,0),L(a,3.2,.14,3.2,t.diamondPlate,0,.24,0),va(a,1.72,14,t.sandbag,.26,i>=2?2:1);const n=Vt([[-1.58,.3],[1.36,.3],[1.76,.56],[1.08,.84],[-1.56,.84]],1.74,.04,.04);a.add(new V(n,t.desertArmor));for(const d of[-1.02,1.02])L(a,.36,.42,3.15,t.tracks,d,.38,0),L(a,.14,.44,3.1,i>=2?t.oliveDark:t.desertArmor,d+(d<0?-.2:.2),.58,0);const s=new oe;s.position.set(0,.86,.05),a.add(s),e.turretPivot=s;const r=i>=3?t.oliveDark:t.desertArmor,o=Vt([[-1.38,0],[.72,0],[1.24,.32],[.74,.64],[-1.32,.64]],1.76,.05,.05);if(s.add(new V(o,r)),L(s,.68,.42,.66,t.desertArmor,-.58,.32,.92,0,.45,0),L(s,.68,.42,.66,t.desertArmor,.58,.32,.92,0,-.45,0),L(s,1.56,.48,.65,t.oliveDark,0,.34,-1.12),X(s,.18,.22,.28,10,t.darkSteel,-.45,.78,.22),L(s,.22,.16,.08,t.sapphireOptic,-.45,.82,.36),X(s,.14,.16,.2,8,t.gunmetal,.46,.74,.1),X(s,.025,.025,.58,6,t.gunmetal,.46,.82,.42,Math.PI/2,0,0),i>=2)for(const d of[-.96,.96])L(s,.14,.34,.52,t.darkSteel,d,.44,.05),L(s,.06,.26,.36,t.copperAesa,d+(d<0?-.08:.08),.44,.05),X(s,.09,.09,.32,8,t.radarCyan,d,.72,-.18,.4,0,d<0?.3:-.3);const l=new oe;l.position.set(0,.34,1.05),s.add(l),e.barrelPivot=l;const c=i>=3?1.24:1,h=Qt([[.14*c,0],[.14*c,.62],[.095*c,.66],[.095*c,1.42],[.145*c,1.48],[.145*c,1.92],[.088*c,1.98],[.088*c,2.88],[.12*c,2.94],[.072*c,2.98]]);l.add(new V(h,t.gunmetal));const u=new ft;u.position.set(0,0,3.02),l.add(u),e.muzzlePoint=u,e.muzzleFlashMesh=si(l,t,0,0,3.12,1.55)}function Fx(a,e,t,i){X(a,1.62,1.76,.22,10,t.concreteDark,0,.11,0),X(a,1.38,1.46,.16,10,t.diamondPlate,0,.28,0);const n=Lt("idome_ring",()=>new Zn(1.52,.05,8,28)),s=new V(n,t.radarCyan);s.rotation.x=Math.PI/2,s.position.y=.36,a.add(s),e.radarPivots=[];const r=new oe;r.position.set(0,.38,-.78),a.add(r),X(r,.22,.28,1.25,8,t.darkSteel,0,.62,0);const o=new oe;o.position.set(0,1.38,0),L(o,1.05,.72,.22,t.desertArmor,0,0,0,-.22,0,0),L(o,.88,.56,.08,i>=2?t.radarCyan:t.copperAesa,0,0,.12,-.22,0,0),r.add(o),e.radarPivots.push(o);const l=new oe;l.position.set(0,.38,.28),a.add(l),e.turretPivot=l,e.missileCaps=[],X(l,.76,.86,.24,12,t.steel,0,.12,0);const c=new oe;c.position.set(0,.68,0),c.rotation.x=-.82,l.add(c),L(c,1.48,.96,1.65,t.desertArmor,0,0,0);const h=i>=3?5:4,u=3;for(let f=0;f<h;f++)for(let m=0;m<u;m++){const x=-((h-1)*.28)*.5+f*.28,p=-.26+m*.26;X(c,.09,.09,1.72,8,t.gunmetal,x,p,.04,Math.PI/2,0,0);const g=Dn(c,t,.07,x,p,.9,t.radarCyan);e.missileCaps.push(g)}if(i>=2){e.ewRings=[];const f=Lt("idome_heal_ring",()=>new Zn(1.15,.04,8,28)),m=new V(f,t.ewCyan);m.rotation.x=Math.PI/2,m.position.y=1.65,m.userData.noShadow=!0,a.add(m),e.ewRings.push(m)}const d=new ft;d.position.set(0,.2,1.05),c.add(d),e.muzzlePoint=d,e.muzzleFlashMesh=si(c,t,0,.2,1.1,1.2,!0)}function Ox(a,e,t,i){X(a,1.58,1.72,.24,12,t.concreteDark,0,.12,0),X(a,1.28,1.38,.18,12,t.diamondPlate,0,.3,0);for(let l=0;l<4;l++){const c=l/4*Math.PI*2+Math.PI/4;L(a,.52,.44,.38,t.navalGray,Math.sin(c)*1.05,.58,Math.cos(c)*1.05,0,c,0),L(a,.38,.14,.1,t.radarCyan,Math.sin(c)*1.22,.66,Math.cos(c)*1.22,0,c,0)}const n=new oe;if(n.position.set(0,.42,0),a.add(n),e.turretPivot=n,X(n,.68,.78,.52,12,t.navalWhite,0,.26,0),L(n,1.18,.74,1.28,i>=2?t.navalWhite:t.navalGray,0,.84,-.05),i>=2)for(const l of[-.66,.66])for(let c=0;c<4;c++)L(n,.16,.52,.08,t.steel,l,.88,-.45+c*.28);const s=new oe;s.position.set(0,.94,.55),n.add(s),e.barrelPivot=s;const r=i>=3?[-.36,.36]:[0];for(const l of r)X(s,.32,.34,.62,14,t.darkSteel,l,0,.22,Math.PI/2,0,0),X(s,.24,.28,.22,14,t.steel,l,0,.56,Math.PI/2,0,0),X(s,.2,.2,.08,14,t.sapphireOptic,l,0,.68,Math.PI/2,0,0),X(s,.12,.12,.09,12,t.radarCyan,l,0,.7,Math.PI/2,0,0);const o=new ft;o.position.set(0,0,.75),s.add(o),e.muzzlePoint=o,e.muzzleFlashMesh=si(s,t,0,0,.78,1,!0)}function Bx(a,e,t,i){L(a,2.85,.18,3.45,t.concreteDark,0,.09,0);const n=new oe;n.position.set(0,.18,0),a.add(n),e.turretPivot=n;for(const l of[-1.06,1.06]){L(n,.48,.46,3.15,t.tracks,l,.32,0);for(let c=0;c<5;c++)X(n,.2,.2,.5,10,t.steel,l,.26,1.1-c*.55,0,0,Math.PI/2)}L(n,1.68,.52,2.85,t.oliveDark,0,.5,0),L(n,1.56,.56,.85,t.desertArmor,0,.92,.96),L(n,1.24,.22,.08,t.glass,0,1,1.38);const s=new oe;s.position.set(0,1.02,-.35),s.rotation.x=-.62,n.add(s),e.barrelPivot=s,e.missileCaps=[];const r=i>=3?[-.62,.62]:[0];for(const l of r){const c=i>=3?1.08:1.52;L(s,c,.96,1.98,t.olive,l,.42,.15),L(s,c+.08,1.02,.16,t.darkSteel,l,.42,1.08);const h=i>=3?4:6,u=4;for(let d=0;d<h;d++)for(let f=0;f<u;f++){const m=l-(h-1)*.22*.5+d*.22,x=.08+f*.22;X(s,.085,.085,2.02,8,t.gunmetal,m,x,.15,Math.PI/2,0,0);const p=Dn(s,t,.068,m,x,1.15,t.afterburner);e.missileCaps.push(p)}}const o=new ft;o.position.set(0,.45,1.25),s.add(o),e.muzzlePoint=o,e.muzzleFlashMesh=si(s,t,0,.45,1.35,1.6)}function vd(a){const e=new oe,t=new oe;e.add(t);const i=Ns(),n={root:e,hullGroup:t,hitMeshes:[]};a==="infantry"?kx(t,n,i):a==="imv"?zx(t,n,i):a==="ifv"?Gx(t,n,i):a==="drone_swarm"?Hx(t,n,i):a==="mbt"?Wx(t,n,i):a==="heli"?xd(t,n,i):a==="stealth"?Vx(t,n,i):a==="boss"||a==="boss_terminator"?Xx(t,n,i,a==="boss_terminator"?1.38:1.32):a==="subboss_tos1"?$x(t,n,i):a==="subboss_pantsir"?qx(t,n,i):a==="subboss_ka50"?Yx(t,n,i):a==="boss_koalitsiya"?Kx(t,n,i):a==="boss_tu160"?Zx(t,n,i):a==="boss_armata"?Jx(t,n,i):a==="megaboss_scud_convoy"?Qx(t,n,i):a==="megaboss_object279"?jx(t,n,i):a==="megaboss_kirov_airship"&&e_(t,n,i);const s=new Map,r=new Set([i.opticGreen,i.shtoraRed,i.radarCyan,i.amberGlow,i.afterburner,i.rotorDisc,i.empPurple]);t.traverse(l=>{if(l.isMesh){const c=l,h=c.material;if(h===i.rotorDisc||c.userData?.noShadow){c.castShadow=!1,c.receiveShadow=!1;return}if(c.castShadow=!0,c.receiveShadow=!0,a!=="stealth"&&h&&!r.has(h)){let u=s.get(h);u||(u=h.clone(),s.set(h,u)),c.material=u}n.hitMeshes.push(c)}});const o=new V(Lt("enemy_ew_ring",()=>new Rs(1.3,1.52,24)),new Pt({color:12616956,side:Ot,transparent:!0,opacity:.78}));return o.rotation.x=-Math.PI/2,o.position.y=.14,o.visible=!1,e.add(o),n.ewRing=o,n}function Fs(a,e,t=2.65,i=1.1){const n=new V(Lt(`aps_sphere_${t}`,()=>new nn(t,20,14)),new Pt({color:2282478,transparent:!0,opacity:.18,wireframe:!0}));n.position.y=i,n.userData.noShadow=!0,n.castShadow=!1,n.receiveShadow=!1,a.add(n),e.apsShield=n}function kx(a,e,t){const i=[[0,.56],[-.58,-.45],[.58,-.45]];e.legs=[];for(const[n,s]of i){const r=new oe;r.position.set(n,0,s);const o=L(r,.14,.42,.16,t.rusDark,-.1,.21,0),l=L(r,.14,.42,.16,t.rusDark,.1,.21,0);e.legs.push(o,l),L(r,.38,.44,.25,t.rusCamo,0,.62,0),L(r,.34,.32,.08,t.oliveDark,0,.64,.14),L(r,.3,.34,.16,t.darkSteel,0,.65,-.17),X(r,.14,.16,.22,10,t.oliveDark,0,.99,0),L(r,.22,.1,.1,t.gunmetal,0,.98,.11),X(r,.032,.032,.08,6,t.opticGreen,-.055,.99,.18,Math.PI/2,0,0),X(r,.032,.032,.08,6,t.opticGreen,.055,.99,.18,Math.PI/2,0,0),L(r,.065,.1,.56,t.gunmetal,.14,.64,.32),X(r,.022,.022,.26,6,t.darkSteel,.14,.65,.68,Math.PI/2,0,0),L(r,.045,.16,.07,t.rusDark,.14,.53,.34,-.25,0,0),L(r,.05,.06,.08,t.steel,.14,.72,.28),a.add(r)}}function zx(a,e,t){const i=Vt([[-1.32,.42],[1.36,.42],[1.42,.72],[.62,.86],[.32,1.24],[-1.24,1.24],[-1.36,.84]],1.36,.04,.04);a.add(new V(i,t.rusCamo)),L(a,1.12,.3,.06,t.glass,0,1.02,.49,-.68,0,0),L(a,.06,.24,.88,t.glass,-.71,1.02,-.18),L(a,.06,.24,.88,t.glass,.71,1.02,-.18),L(a,.92,.26,.08,t.darkSteel,0,.58,1.44),L(a,1.28,.18,.14,t.gunmetal,0,.44,1.48),L(a,.15,.1,.06,t.amberGlow,-.48,.6,1.44),L(a,.15,.1,.06,t.amberGlow,.48,.6,1.44),X(a,.3,.3,.18,12,t.tire,0,.78,-1.42,Math.PI/2,0,0),L(a,.22,.34,.14,t.oliveDark,-.46,.78,-1.4),e.wheels=[Gi(a,t,-.76,.36,.92,.24),Gi(a,t,.76,.36,.92,.24),Gi(a,t,-.76,.36,-.88,.24),Gi(a,t,.76,.36,-.88,.24)];const n=new oe;n.position.set(0,1.28,-.2),a.add(n),e.turretPivot=n,X(n,.32,.34,.14,12,t.darkSteel,0,.06,0),L(n,.56,.28,.06,t.rusDark,0,.24,.24,-.18,0,0),L(n,.14,.14,.42,t.gunmetal,0,.26,.14),X(n,.032,.036,.85,8,t.gunmetal,0,.28,.66,Math.PI/2,0,0)}function Gx(a,e,t){const i=Vt([[-1.78,.52],[-1.52,.34],[1.42,.34],[1.86,.68],[1.18,.98],[-1.68,.98],[-1.82,.76]],1.56,.045,.045);a.add(new V(i,t.rusCamo)),L(a,1.38,.12,1.15,t.rusDark,0,1.04,-1.02),L(a,1.1,.08,.34,t.oliveDark,0,.62,1.72,-.4,0,0),X(a,.16,.18,.24,10,t.darkSteel,-.45,.48,-1.86,Math.PI/2,0,0),X(a,.16,.18,.24,10,t.darkSteel,.45,.48,-1.86,Math.PI/2,0,0),L(a,.14,.1,.06,t.amberGlow,-.58,.78,1.74),L(a,.14,.1,.06,t.amberGlow,.58,.78,1.74),e.wheels=[];for(const r of[1.22,.42,-.42,-1.22])e.wheels.push(Gi(a,t,-.84,.34,r,.24),Gi(a,t,.84,.34,r,.24));const n=new oe;n.position.set(0,1.02,.26),a.add(n),e.turretPivot=n,X(n,.38,.56,.36,8,t.rusDark,0,.18,0),L(n,.22,.2,.22,t.darkSteel,.28,.34,.12),X(n,.065,.065,.05,8,t.opticGreen,.28,.34,.24,Math.PI/2,0,0);const s=Qt([[.065,.28],[.065,.62],[.04,.64],[.04,1.44],[.056,1.46],[.032,1.54]]);n.add(new V(s,t.gunmetal)),X(n,.018,.018,.65,6,t.steel,-.14,.22,.62,Math.PI/2,0,0)}function Hx(a,e,t){const i=new oe;i.position.y=3.85,a.add(i),e.rotors=[];const n=Us([[0,.92],[1.26,-.68],[.24,-.68],[0,-.54],[-.24,-.68],[-1.26,-.68]],.055,.02,.02),s=Qt([[.01,1.15],[.12,.85],[.15,.35],[.15,-.68],[.11,-.84],[.01,-.86]]),r=[[0,.14,.95,.72],[-1.25,-.12,-.82,.64],[1.25,.12,-.82,.64]];for(const[o,l,c,h]of r){const u=new oe;u.position.set(o,l,c),u.scale.setScalar(h),i.add(u),u.add(new V(s,t.desertArmor)),u.add(new V(n,t.desertArmor)),X(u,.055,.085,.18,8,t.darkSteel,0,0,1,Math.PI/2,0,0),L(u,.05,.36,.44,t.darkSteel,-1.2,.04,-.45),L(u,.05,.36,.44,t.darkSteel,1.2,.04,-.45),X(u,.045,.045,.05,8,t.shtoraRed,0,.14,-.65),X(u,.13,.1,.22,8,t.gunmetal,0,0,-.78,Math.PI/2,0,0);const d=new oe;d.position.set(0,0,-.94),L(d,.78,.09,.03,t.tire,0,0,0),u.add(d),e.rotors.push(d)}}function Wx(a,e,t){const i=Vt([[-1.72,.42],[1.36,.42],[1.92,.66],[1.22,.94],[-1.68,.94]],1.62,.04,.04);a.add(new V(i,t.rusCamo)),L(a,1.32,.1,.75,t.darkSteel,0,.98,-1.16);for(const l of[-.42,.42])X(a,.18,.18,.68,12,t.oliveDark,l,.72,-1.82,0,0,Math.PI/2);for(const l of[-1.02,1.02]){L(a,.46,.48,3.56,t.tracks,l,.32,0),L(a,.1,.4,3.48,t.rusDark,l+(l<0?-.24:.24),.56,0);for(let c=0;c<6;c++)X(a,.22,.22,.48,10,t.steel,l,.26,1.35-c*.54,0,0,Math.PI/2)}e.eraMeshes=[];for(let l=-2;l<=2;l++){const c=L(a,.28,.12,.28,t.olive,l*.3,.84,1.54,.38,0,0);e.eraMeshes.push(c)}for(const l of[-1.28,1.28])for(let c=0;c<4;c++){const h=L(a,.08,.28,.48,t.olive,l,.62,1.02-c*.66);e.eraMeshes.push(h)}const n=new oe;n.position.set(0,.96,.1),a.add(n),e.turretPivot=n;const s=Vt([[-1.08,0],[.72,0],[1.04,.22],[.64,.5],[-1.02,.5]],1.56,.05,.05);n.add(new V(s,t.rusCamo)),L(n,.58,.4,.6,t.rusDark,-.58,.24,.72,0,.46,0),L(n,.58,.4,.6,t.rusDark,.58,.24,.72,0,-.46,0),L(n,1.18,.38,.52,t.darkSteel,0,.3,-.92),X(n,.24,.26,.18,8,t.oliveDark,-.34,.58,-.14),X(n,.028,.028,.58,6,t.gunmetal,-.34,.7,.2,Math.PI/2,0,0),L(n,.18,.14,.12,t.shtoraRed,-.46,.3,.98),L(n,.18,.14,.12,t.shtoraRed,.46,.3,.98);const r=Qt([[.095,.62],[.095,1.48],[.145,1.54],[.145,1.96],[.085,2.02],[.085,2.98],[.11,3],[.07,3.04]]),o=new V(r,t.gunmetal);o.position.set(0,.24,0),n.add(o)}function xd(a,e,t,i=t.rusCamo,n=4.2){const s=new oe;s.position.y=n,a.add(s);const r=Vt([[-.95,-.34],[.95,-.34],[1.62,-.06],[.86,.44],[-.86,.46]],.84,.05,.05);s.add(new V(r,i)),L(s,.74,.36,.92,t.glass,0,.24,.74,.34,0,0),X(s,.18,.18,.24,10,t.darkSteel,0,-.26,1.38),X(s,.08,.08,.05,8,t.sapphireOptic,0,-.26,1.5,Math.PI/2,0,0),X(s,.038,.042,.85,6,t.gunmetal,.24,-.3,1.56,Math.PI/2,0,0),L(s,2.72,.12,.56,t.rusDark,0,.08,-.08);for(const d of[-1.08,-.7,.7,1.08])X(s,.13,.13,.64,10,t.gunmetal,d,-.1,-.06,Math.PI/2,0,0);for(const d of[-.46,.46])X(s,.22,.2,1.18,10,t.darkSteel,d,.36,-.22,Math.PI/2,0,0);L(s,.28,.32,1.78,i,0,.1,-1.78),L(s,.08,.84,.52,t.rusDark,0,.42,-2.56,-.28,0,0),L(s,1.24,.08,.34,t.rusDark,0,.16,-2.48),X(s,.1,.13,.62,8,t.steel,0,.6,0);const o=new oe;o.position.set(0,.88,0);const l=new oe;l.position.set(0,.68,0);const c=Lt("heli_blade",()=>new Et(.16,.025,2.05)),h=Lt("heli_blade2",()=>new Et(.16,.025,1.95));for(let d=0;d<3;d++){const f=d/3*Math.PI*2,m=new V(c,t.gunmetal);m.position.set(Math.sin(f)*1,0,Math.cos(f)*1),m.rotation.y=f,o.add(m);const x=f+Math.PI/3,p=new V(h,t.darkSteel);p.position.set(Math.sin(x)*.95,0,Math.cos(x)*.95),p.rotation.y=x,l.add(p)}s.add(o,l);const u=new V(Lt("heli_disc",()=>new ys(2.05,24)),t.rotorDisc);u.rotation.x=-Math.PI/2,u.position.set(0,.78,0),u.userData.noShadow=!0,s.add(u),e.rotors=[o,l]}function Vx(a,e,t){const i=new oe;i.position.y=4.6,a.add(i);const n=new nt({color:ri.stealthGraphite,roughness:.34,metalness:.66,envMapIntensity:1.35,transparent:!0,opacity:.34}),s=new nt({color:2831168,roughness:.42,metalness:.58,envMapIntensity:1.25,transparent:!0,opacity:.34}),r=new nt({color:1981023,emissive:959977,emissiveIntensity:.4,roughness:.1,metalness:.92,envMapIntensity:1.5,transparent:!0,opacity:.55}),o=t.afterburner.clone();o.transparent=!0,o.opacity=.65,e.stealthMaterials=[n,s,r,o];const l=Us([[0,2.02],[.36,1.15],[.64,.78],[2.05,-.58],[1.82,-1.08],[.72,-.84],[.52,-1.42],[-.52,-1.42],[-.72,-.84],[-1.82,-1.08],[-2.05,-.58],[-.64,.78],[-.36,1.15]],.13,.035,.035),c=new V(l,s);c.position.y=.02,i.add(c),L(i,.62,.26,2.85,n,0,.1,.2),L(i,.34,.24,.98,r,0,.28,.7,.12,0,0),L(i,.065,.64,.68,n,-.72,.36,-.96,-.22,0,.48),L(i,.065,.64,.68,n,.72,.36,-.96,-.22,0,-.48);const h=Lt("stealth_flame",()=>new qi(.13,.62,8));for(const u of[-.3,.3]){X(i,.16,.19,.45,10,n,u,.08,-1.38,Math.PI/2,0,0);const d=new V(h,o);d.rotation.x=-Math.PI/2,d.position.set(u,.08,-1.84),i.add(d)}}function Xx(a,e,t,i=1.32){const n=new oe;n.scale.setScalar(i),a.add(n);const s=Vt([[-1.82,.42],[1.46,.42],[2.05,.66],[1.24,.98],[-1.78,.98]],1.8,.05,.05);n.add(new V(s,t.rusDark)),L(n,2.02,.32,.24,t.gunmetal,0,.32,2.12,-.25,0,0);for(let c=-3;c<=3;c++)L(n,.04,.56,.06,t.steel,c*.24,.72,-1.94);L(n,1.66,.06,.08,t.steel,0,.96,-1.94),e.eraMeshes=[];for(const c of[-1.14,1.14]){L(n,.52,.54,3.78,t.tracks,c,.34,0),L(n,.12,.44,3.68,t.rusDark,c+(c<0?-.28:.28),.58,0);for(let h=0;h<6;h++)X(n,.25,.25,.54,10,t.steel,c,.28,1.42-h*.56,0,0,Math.PI/2);for(let h=0;h<5;h++){const u=L(n,.1,.32,.5,t.olive,c+(c<0?-.34:.34),.64,1.2-h*.62);e.eraMeshes.push(u)}}L(n,.32,.28,.58,t.darkSteel,-.82,.98,1.16),L(n,.32,.28,.58,t.darkSteel,.82,.98,1.16);const r=new oe;r.position.set(0,1,.05),n.add(r),e.turretPivot=r,L(r,1.26,.5,1.48,t.rusCamo,0,.25,0),L(r,.9,.44,.94,t.darkSteel,0,.68,-.08);const o=Qt([[.075,.22],[.075,.62],[.05,.64],[.05,1.72],[.07,1.74],[.04,1.88]]);for(const c of[-.22,.22]){const h=new V(o,t.gunmetal);h.position.set(c,.62,.18),r.add(h)}for(const c of[-.84,.84]){L(r,.28,.42,.22,t.steel,c*.78,.42,0);for(const h of[.26,.52])X(r,.11,.11,1.4,10,t.olive,c,h,.08,Math.PI/2,0,0),X(r,.08,.08,.06,8,t.shtoraRed,c,h,.8,Math.PI/2,0,0)}const l=new oe;l.position.set(0,.96,-.28),X(l,.09,.11,.34,8,t.steel,0,.16,0),L(l,.76,.18,.14,t.radarCyan,0,.38,0),r.add(l),e.rotors=[l],Fs(a,e,2.7,1.1)}function $x(a,e,t){const i=new oe;i.scale.setScalar(1.22),a.add(i),L(i,1.65,.52,3.45,t.rusDark,0,.58,0);for(const r of[-1.02,1.02]){L(i,.48,.52,3.55,t.tracks,r,.34,0);for(let o=0;o<6;o++)X(i,.22,.22,.5,10,t.steel,r,.26,1.35-o*.54,0,0,Math.PI/2)}e.eraMeshes=[];for(let r=-2;r<=2;r++)e.eraMeshes.push(L(i,.28,.14,.28,t.olive,r*.3,.86,1.56,.35,0,0));const n=new oe;n.position.set(0,.95,0),i.add(n),e.turretPivot=n,X(n,.72,.82,.22,12,t.darkSteel,0,.11,0);const s=new oe;s.position.set(0,.65,0),s.rotation.x=-.35,n.add(s),L(s,1.72,1.02,2.15,t.rusCamo,0,0,0);for(let r=0;r<6;r++)for(let o=0;o<4;o++){const l=-.62+r*.25,c=-.34+o*.22;X(s,.085,.085,2.2,8,t.gunmetal,l,c,.02,Math.PI/2,0,0),X(s,.06,.06,.06,8,t.afterburner,l,c,1.14,Math.PI/2,0,0)}}function qx(a,e,t){const i=new oe;i.scale.setScalar(1.2),a.add(i),L(i,1.62,.42,4.1,t.darkSteel,0,.56,0),L(i,1.68,.92,1.25,t.rusCamo,0,1.06,1.48),L(i,1.38,.32,.08,t.glass,0,1.18,2.12),e.wheels=[];for(const r of[1.55,.55,-.55,-1.55])e.wheels.push(Gi(i,t,-.92,.4,r,.28),Gi(i,t,.92,.4,r,.28));const n=new oe;n.position.set(0,.92,-.55),i.add(n),e.turretPivot=n,L(n,1.42,.72,1.65,t.rusDark,0,.36,0);for(const r of[-.46,.46])X(n,.055,.055,1.65,8,t.gunmetal,r,.45,1.1,Math.PI/2,0,0);for(const r of[-.95,.95]){L(n,.38,.78,1.72,t.oliveDark,r,.52,.08,-.22,0,0);for(let o=0;o<3;o++)X(n,.08,.08,.1,8,t.shtoraRed,r,.35+o*.22,.96,Math.PI/2,0,0)}const s=new oe;s.position.set(0,1.05,-.25),X(s,.12,.15,.35,8,t.steel,0,.12,0),L(s,1.1,.36,.14,t.radarCyan,0,.36,0),n.add(s),e.rotors=[s],Fs(a,e,2.7,1.2)}function Yx(a,e,t){const i=new oe;i.scale.setScalar(1.22),a.add(i),xd(i,e,t,t.blackShark,4.35)}function Kx(a,e,t){const i=new oe;i.scale.setScalar(1.34),a.add(i),L(i,1.85,.58,3.85,t.rusCamo,0,.62,0);for(const o of[-1.14,1.14]){L(i,.5,.52,3.9,t.tracks,o,.34,0);for(let l=0;l<7;l++)X(i,.23,.23,.52,10,t.steel,o,.28,1.5-l*.5,0,0,Math.PI/2)}e.eraMeshes=[];for(let o=-2;o<=2;o++)e.eraMeshes.push(L(i,.3,.14,.32,t.olive,o*.32,.92,1.75,.32,0,0));const n=new oe;n.position.set(0,.94,-.15),i.add(n),e.turretPivot=n;const s=Vt([[-1.55,0],[.95,0],[1.15,.42],[.65,1.02],[-1.45,1.02]],1.88,.05,.05);n.add(new V(s,t.rusDark));const r=Qt([[.14,.2],[.14,.9],[.1,.95],[.1,2.75],[.17,2.8],[.17,3.08],[.08,3.12]]);for(const o of[-.24,.24]){const l=new V(r,t.gunmetal);l.position.set(o,.52,.72),l.rotation.x=-.16,n.add(l)}}function Zx(a,e,t){const i=new oe;i.position.y=5,i.scale.setScalar(1.38),a.add(i);const n=Qt([[.01,4.2],[.24,3.1],[.42,1.8],[.48,0],[.44,-2.5],[.22,-3.7],[.01,-4]]);i.add(new V(n,t.navalWhite)),L(i,.52,.28,1.15,t.glass,0,.36,2.15,.14,0,0);const s=Us([[0,1.65],[.75,.95],[4.2,-1.65],[3.95,-2.25],[.85,-1.35],[0,-1.85],[-.85,-1.35],[-3.95,-2.25],[-4.2,-1.65],[-.75,.95]],.12,.03,.03);i.add(new V(s,t.navalWhite)),L(i,.12,1.45,1.1,t.navalWhite,0,.75,-3.15,-.36,0,0),L(i,2.3,.08,.75,t.navalWhite,0,1.28,-3.35);for(const r of[-1.05,-.62,.62,1.05])L(i,.34,.32,2.25,t.navalGray,r,-.14,-1.45),X(i,.14,.16,.52,8,t.afterburner,r,-.14,-2.75,Math.PI/2,0,0);e.rotors=[]}function Jx(a,e,t){const i=new oe;i.scale.setScalar(1.36),a.add(i);const n=Vt([[-1.95,.42],[1.52,.42],[2.12,.68],[1.35,.98],[-1.92,.98]],1.86,.04,.04);i.add(new V(n,t.rusCamo));for(const h of[-1.14,1.14]){L(i,.5,.5,3.95,t.tracks,h,.34,0);for(let u=0;u<7;u++)X(i,.23,.23,.52,10,t.steel,h,.28,1.54-u*.51,0,0,Math.PI/2)}e.eraMeshes=[];for(let h=-2;h<=2;h++)e.eraMeshes.push(L(i,.3,.14,.3,t.oliveDark,h*.34,.92,1.75,.36,0,0));const s=new oe;s.position.set(0,1,.08),i.add(s),e.turretPivot=s;const r=Vt([[-1.24,0],[.88,0],[1.32,.28],[.82,.68],[-1.18,.68]],1.52,.04,.04);s.add(new V(r,t.rusDark));for(const h of[-.88,.88])for(let u=0;u<4;u++)X(s,.085,.085,.38,8,t.darkSteel,h,.18,.55-u*.34,.45,0,h<0?.5:-.5);X(s,.08,.12,.85,8,t.steel,-.35,1.05,-.35),X(s,.18,.06,.28,10,t.empPurple,-.35,1.54,-.35);const o=Qt([[.12,.5],[.12,1.55],[.095,1.6],[.095,3.25],[.13,3.3],[.08,3.35]]),l=new V(o,t.gunmetal);l.position.set(0,.35,0),s.add(l);const c=new oe;c.position.set(.32,.9,-.15),L(c,.56,.18,.12,t.radarCyan,0,0,0),s.add(c),e.rotors=[c],Fs(a,e,2.85,1.15)}function Qx(a,e,t){const i=new oe;i.scale.setScalar(1.42),a.add(i),L(i,2.05,.52,5.8,t.darkSteel,0,.65,0),L(i,2.15,.36,5.4,t.rusCamo,0,1.02,0);for(const o of[-.72,.72])L(i,.68,.88,1.48,t.rusCamo,o,1.18,2.08),L(i,.52,.34,.08,t.glass,o,1.32,2.82);e.wheels=[];for(let o=0;o<8;o++){const l=2.38-o*.68;e.wheels.push(Gi(i,t,-1.12,.44,l,.3),Gi(i,t,1.12,.44,l,.3))}e.eraMeshes=[];for(const o of[-1.22,1.22])for(let l=0;l<6;l++)e.eraMeshes.push(L(i,.12,.34,.52,t.oliveDark,o,.96,1.8-l*.72));const n=new oe;n.position.set(0,1.55,-.35),n.rotation.x=-.32,i.add(n),X(n,.46,.48,4.4,14,t.olive,0,.35,0,Math.PI/2,0,0),X(n,.02,.44,.88,14,t.shtoraRed,0,.35,2.6,Math.PI/2,0,0);const s=new oe;s.position.set(0,1.4,1.4),i.add(s),e.turretPivot=s,X(s,.36,.44,.32,10,t.darkSteel,0,.15,0),X(s,.055,.055,1.15,8,t.gunmetal,-.14,.24,.55,Math.PI/2,0,0),X(s,.055,.055,1.15,8,t.gunmetal,.14,.24,.55,Math.PI/2,0,0);const r=new oe;r.position.set(0,.45,-.1),L(r,.85,.2,.12,t.radarCyan,0,0,0),s.add(r),e.rotors=[r],Fs(a,e,3.65,1.45)}function jx(a,e,t){const i=new oe;i.scale.setScalar(1.48),a.add(i);for(const h of[-1.25,-.52,.52,1.25]){L(i,.42,.46,3.85,t.tracks,h,.32,0);for(let u=0;u<6;u++)X(i,.19,.19,.44,8,t.steel,h,.26,1.45-u*.58,0,0,Math.PI/2)}const n=new V(Lt("obj279_hull",()=>new nn(1.85,20,12)),t.rusDark);n.scale.set(1.12,.36,1.38),n.position.set(0,.82,0),i.add(n),e.eraMeshes=[];for(let h=-3;h<=3;h++)e.eraMeshes.push(L(i,.28,.14,.28,t.olive,h*.32,.92,1.98,.35,0,0));const s=new oe;s.position.set(0,1.08,.08),i.add(s),e.turretPivot=s;const r=new V(Lt("obj279_turret",()=>new nn(1.12,16,12)),t.rusCamo);r.scale.set(1.06,.56,1.24),r.position.y=.24,s.add(r);for(const h of[-1.18,1.18])L(s,.38,.46,1.1,t.darkSteel,h,.34,0),X(s,.1,.1,.08,8,t.amberGlow,h,.34,.58,Math.PI/2,0,0);const o=Qt([[.15,.65],[.15,1.55],[.11,1.62],[.11,3.4],[.17,3.45],[.17,3.72],[.09,3.76]]),l=new V(o,t.gunmetal);l.position.set(0,.36,.1),s.add(l);const c=new oe;c.position.set(0,.92,-.2),L(c,.78,.18,.12,t.radarCyan,0,0,0),s.add(c),e.rotors=[c],Fs(a,e,3.35,1.2)}function e_(a,e,t){const i=new oe;i.position.y=5.4,i.scale.setScalar(1.45),a.add(i);const n=new V(Lt("kirov_hull",()=>new wi(1.18,1.18,5.2,16)),t.rusDark);n.rotation.x=Math.PI/2,n.scale.set(1.25,1,.92),i.add(n);const s=new V(Lt("kirov_nose",()=>new nn(1.18,16,12)),t.rusCamo);s.scale.set(1.25,.92,1.25),s.position.z=2.6,i.add(s);const r=new V(Lt("kirov_tail",()=>new qi(1.18,2.2,16)),t.rusCamo);r.rotation.x=-Math.PI/2,r.scale.set(1.25,1,.92),r.position.z=-3.7,i.add(r),L(i,1.12,.65,3.2,t.darkSteel,0,-1.18,.35),L(i,.88,.28,.45,t.shtoraRed,0,-1.16,1.98),L(i,.14,1.75,1.45,t.rusCamo,0,1.25,-2.55),L(i,3.25,.14,1.25,t.rusCamo,0,0,-2.55),e.rotors=[];const o=Lt("kirov_rotor",()=>new Et(1.55,.04,.2));for(const[l,c]of[[-2.05,1.35],[2.05,1.35],[-2.05,-1.35],[2.05,-1.35]]){L(i,1.15,.18,.45,t.steel,l*.68,.1,c),X(i,.92,.92,.28,14,t.darkSteel,l,.1,c);const h=new oe;h.position.set(l,.26,c);const u=new V(o,t.amberGlow),d=new V(o,t.amberGlow);d.rotation.y=Math.PI/2,h.add(u,d),i.add(h),e.rotors.push(h)}Fs(a,e,4.1,5.4)}function _d(){const a=new oe,e=Ns(),t=Qt([[.01,3.05],[.24,2.55],[.39,1.75],[.42,.45],[.36,-1.85],[.18,-2.55],[.01,-2.65]]);a.add(new V(t,e.navalGray)),X(a,.11,.11,.95,10,e.gunmetal,0,-.14,3.15,Math.PI/2,0,0),L(a,.42,.36,1.38,e.glass,0,.38,1.35,.1,0,0);const i=Us([[-3.3,.42],[3.3,.42],[3.18,-.62],[.45,-.56],[-.45,-.56],[-3.18,-.62]],.1,.025,.025),n=new V(i,e.navalGray);n.position.set(0,-.06,.18),a.add(n);for(const s of[-2.3,-1.5,1.5,2.3])L(a,.08,.16,.55,e.darkSteel,s,-.14,.15),X(a,.095,.095,.92,8,e.olive,s,-.26,.15,Math.PI/2,0,0);for(const s of[-.68,.68])X(a,.28,.26,1.58,12,e.darkSteel,s,.48,-1.15,Math.PI/2,0,0),X(a,.22,.22,.06,10,e.steel,s,.48,-.35,Math.PI/2,0,0),X(a,.2,.2,.14,10,e.afterburner,s,.48,-1.96,Math.PI/2,0,0);return L(a,2.48,.1,.62,e.navalGray,0,.14,-2.18),L(a,.1,.98,.68,e.darkSteel,-1.2,.46,-2.2),L(a,.1,.98,.68,e.darkSteel,1.2,.46,-2.2),Er(a,!0,!1),a}function Sd(){const a=new oe,e=Ns();a.scale.setScalar(1.35);const t=Qt([[.01,4.2],[.34,3.2],[.46,1.8],[.46,-2.4],[.24,-3.9],[.01,-4.15]]);a.add(new V(t,e.navalGray)),L(a,.56,.28,1.05,e.glass,0,.36,2.55,.12,0,0);const i=Us([[0,1.4],[1.1,.75],[5.4,-1.55],[5.1,-2.15],[.85,-.8],[0,-.95],[-.85,-.8],[-5.1,-2.15],[-5.4,-1.55],[-1.1,.75]],.11,.025,.025),n=new V(i,e.navalGray);n.position.set(0,.16,.25),a.add(n);for(const[s,r]of[[-1.95,.05],[-3.35,-.65],[1.95,.05],[3.35,-.65]])L(a,.48,.26,1.35,e.darkSteel,s,-.18,r),X(a,.12,.12,.15,8,e.afterburner,s-.12,-.18,r-.72,Math.PI/2,0,0),X(a,.12,.12,.15,8,e.afterburner,s+.12,-.18,r-.72,Math.PI/2,0,0);return L(a,.12,1.65,1.15,e.darkSteel,0,.92,-3.35,-.25,0,0),L(a,2.75,.09,.75,e.navalGray,0,.24,-3.5),Er(a,!0,!1),a}function fn(a){const e=new oe,t=Ns(),i=a.startsWith("boss_"),n=a==="hellfire"||a==="patriot"||i,s=a==="hellfire"?.155:i?.14:n?.115:.09,r=a==="hellfire"?1.48:i?1.25:n?1.15:.85,o=a==="patriot"?t.navalWhite:i?t.shtoraRed:a==="hellfire"?t.darkSteel:t.olive,l=Qt([[.001,r*.72],[s*.72,r*.56],[s,r*.42],[s,-r*.46],[s*.78,-r*.52]]);e.add(new V(l,o)),X(e,s*.35,s*.7,r*.14,8,a==="hellfire"||i?t.amberGlow:t.steel,0,0,r*.58,Math.PI/2,0,0),L(e,s*3.8,s*.35,r*.22,t.gunmetal,0,0,-r*.36),L(e,s*.35,s*3.8,r*.22,t.gunmetal,0,0,-r*.36);const c=Lt(`exhaust_${s}`,()=>new qi(s*.9,.36,8)),h=new V(c,t.afterburner);return h.rotation.x=-Math.PI/2,h.position.z=-r*.68,e.add(h),e}function t_(a){const e=ll.get(a);if(e)return e;const{root:t}=Ar(a,1),i=new Pt({color:2278750,transparent:!0,opacity:.45,depthWrite:!1}),n=new Pt({color:4906624,wireframe:!0,transparent:!0,opacity:.35}),s=[];t.traverse(o=>{o.isMesh&&s.push(o)});for(const o of s){if(o.castShadow=!1,o.receiveShadow=!1,o.userData?.noShadow){o.visible=!1;continue}o.material=i;const l=new V(o.geometry,n);l.scale.setScalar(1.01),o.add(l)}const r={root:t,setValid:o=>{i.color.setHex(o?2278750:15680580),n.color.setHex(o?8843180:16557477)}};return ll.set(a,r),r}function i_(a,e,t,i){Ns();const n=new oe;n.position.set(0,-100,0),a.add(n);const s=["m2_bunker","bushmaster","javelin","phalanx","howitzer","patriot","ew_crew","abrams_pit","iron_dome","helios_laser","tos1_mlrs","hesco"];for(const o of s){const l=t_(o);l.root.visible=!1,l.root.parent!==i&&i.add(l.root);const c=o==="hesco"?1:3;for(let h=1;h<=c;h++){const u=Ar(o,h);n.add(u.root)}}const r=["infantry","imv","ifv","drone_swarm","mbt","heli","stealth","boss","subboss_tos1","subboss_pantsir","subboss_ka50","boss_koalitsiya","boss_terminator","boss_tu160","boss_armata","megaboss_scud_convoy","megaboss_object279","megaboss_kirov_airship"];for(const o of r)n.add(vd(o).root);return n.add(_d()),n.add(Sd()),n.add(fn("javelin")),n.add(fn("patriot")),n.add(fn("hellfire")),n.add(fn("boss_missile")),t.compile(a,e),a.remove(n),ll}const _n=4,Wt=_n/tt,Bi=Ve*_n,ki=St*_n;function Mi(a){return a*Wt-Bi*.5}function yi(a){return a*Wt-ki*.5}function Xn(a,e){return{x:(a+.5)*_n-Bi*.5,z:(e+.5)*_n-ki*.5}}function Wn(a){return(a+Bi*.5)/Wt}function Vn(a){return(a+ki*.5)/Wt}function go(a,e){return{col:Math.floor((a+Bi*.5)/_n),row:Math.floor((e+ki*.5)/_n)}}function Md(a){return a<26?String.fromCharCode(65+a):"A"+String.fromCharCode(65+(a-26))}const cl={desert:{gradColors:["#9d8356","#ab8e5d","#866e47"],patchA:"rgba(196, 165, 108, 0.22)",patchB:"rgba(116, 94, 58, 0.18)",speckA:"rgba(232, 206, 152, 0.16)",speckB:"rgba(54, 42, 24, 0.18)",shoulderColor:"#7a6849",roadColor:"#3a3d42",laneColor:"rgba(234, 179, 8, 0.48)",plinthColor:6048306,rockPrimary:11963742,rockSecondary:9399107,foliageA:6123061,foliageB:7307072,scrub:8616774,trimColor:16096779},arctic:{gradColors:["#cbd5e1","#dce7f3","#b8cae0"],patchA:"rgba(248, 250, 252, 0.36)",patchB:"rgba(125, 165, 205, 0.24)",speckA:"rgba(255, 255, 255, 0.26)",speckB:"rgba(71, 104, 138, 0.18)",shoulderColor:"#7b92a8",roadColor:"#334155",laneColor:"rgba(125, 211, 252, 0.55)",plinthColor:3031897,rockPrimary:6583435,rockSecondary:9741240,foliageA:2508344,foliageB:14870768,scrub:13358561,trimColor:3718648},industrial:{gradColors:["#434952","#4c535d","#373c44"],patchA:"rgba(82, 88, 98, 0.24)",patchB:"rgba(24, 28, 34, 0.26)",speckA:"rgba(180, 188, 198, 0.12)",speckB:"rgba(15, 18, 22, 0.24)",shoulderColor:"#575e68",roadColor:"#1f242b",laneColor:"rgba(249, 115, 22, 0.5)",plinthColor:2238254,rockPrimary:7041664,rockSecondary:4937059,foliageA:4149052,foliageB:5395035,scrub:7877903,trimColor:16347926}};function n_(a,e){const t=cl[e],i=2240,n=1280,s=i/Ve,r=n/St,o=document.createElement("canvas");o.width=i,o.height=n;const l=o.getContext("2d"),c=document.createElement("canvas");c.width=i,c.height=n;const h=c.getContext("2d"),u=document.createElement("canvas");u.width=i,u.height=n;const d=u.getContext("2d"),f=l.createLinearGradient(0,0,i,n);f.addColorStop(0,t.gradColors[0]),f.addColorStop(.5,t.gradColors[1]),f.addColorStop(1,t.gradColors[2]),l.fillStyle=f,l.fillRect(0,0,i,n),h.fillStyle=e==="arctic"?"#b0b0b0":"#dcdcdc",h.fillRect(0,0,i,n),d.fillStyle="#7c7c7c",d.fillRect(0,0,i,n);let m=e==="desert"?1337:e==="arctic"?4242:7890;const x=()=>(m=m*16807%2147483647,(m-1)/2147483646);for(let _=0;_<520;_++){const E=x()*i,T=x()*n,v=18+x()*88,M=x()>.45;l.fillStyle=M?t.patchA:t.patchB,l.beginPath(),l.arc(E,T,v,0,Math.PI*2),l.fill(),d.fillStyle=M?"rgba(152, 152, 152, 0.14)":"rgba(96, 96, 96, 0.14)",d.beginPath(),d.arc(E,T,v*.72,0,Math.PI*2),d.fill()}if(e==="desert"){l.strokeStyle="rgba(220, 195, 145, 0.14)",l.lineWidth=3;for(let _=20;_<n;_+=38){l.beginPath();for(let E=0;E<=i;E+=64){const T=_+Math.sin(E*.012+_*.03)*8;E===0?l.moveTo(E,T):l.lineTo(E,T)}l.stroke()}}else if(e==="arctic"){l.strokeStyle="rgba(90, 145, 195, 0.38)",l.lineWidth=2,d.strokeStyle="#383838",d.lineWidth=3;for(let _=0;_<42;_++){let E=x()*i,T=x()*n;l.beginPath(),d.beginPath(),l.moveTo(E,T),d.moveTo(E,T);for(let v=0;v<6;v++)E+=(x()-.5)*90,T+=(x()-.5)*90,l.lineTo(E,T),d.lineTo(E,T);l.stroke(),d.stroke()}}else if(e==="industrial"){l.strokeStyle="rgba(20, 24, 30, 0.34)",l.lineWidth=2;for(let _=0;_<i;_+=s*2)l.strokeRect(_,0,s*2,n);for(const _ of[r*.45,n-r*.45]){l.fillStyle="rgba(30, 26, 22, 0.55)";for(let E=12;E<i;E+=22)l.fillRect(E,_-12,8,24);l.strokeStyle="#7c8591",l.lineWidth=3,l.beginPath(),l.moveTo(0,_-7),l.lineTo(i,_-7),l.moveTo(0,_+7),l.lineTo(i,_+7),l.stroke()}}for(let _=0;_<9500;_++){const E=x()*i,T=x()*n,v=1+x()*3.4,M=x()>.5;l.fillStyle=M?t.speckA:t.speckB,l.fillRect(E,T,v,v),d.fillStyle=M?"rgba(210, 210, 210, 0.2)":"rgba(65, 65, 65, 0.22)",d.fillRect(E,T,v,v)}l.strokeStyle=e==="arctic"?"rgba(51, 65, 85, 0.14)":"rgba(255, 255, 255, 0.08)",l.lineWidth=1,d.strokeStyle="rgba(40, 40, 40, 0.14)",d.lineWidth=1.5;for(let _=0;_<=Ve;_++){const E=_*s;l.beginPath(),l.moveTo(E,0),l.lineTo(E,n),l.stroke(),d.beginPath(),d.moveTo(E,0),d.lineTo(E,n),d.stroke()}for(let _=0;_<=St;_++){const E=_*r;l.beginPath(),l.moveTo(0,E),l.lineTo(i,E),l.stroke(),d.beginPath(),d.moveTo(0,E),d.lineTo(i,E),d.stroke()}const p=(_,E)=>{if(_<0||_>=Ve||E<0||E>=St)return!1;const T=a[E][_];return T===Ye.ROAD||T===Ye.SPAWN||T===Ye.FOB};for(let _=0;_<St;_++)for(let E=0;E<Ve;E++){if(!p(E,_))continue;const T=(E+.5)*s,v=(_+.5)*r,M=s*.72;l.fillStyle=t.shoulderColor,l.beginPath(),l.arc(T,v,M*.5,0,Math.PI*2),l.fill(),p(E+1,_)&&l.fillRect(T,v-M*.5,s,M),p(E,_+1)&&l.fillRect(T-M*.5,v,M,r),d.fillStyle="#989898",d.beginPath(),d.arc(T,v,M*.5,0,Math.PI*2),d.fill(),p(E+1,_)&&d.fillRect(T,v-M*.5,s,M),p(E,_+1)&&d.fillRect(T-M*.5,v,M,r)}for(let _=0;_<St;_++)for(let E=0;E<Ve;E++){if(!p(E,_))continue;const T=(E+.5)*s,v=(_+.5)*r,M=s*.56;l.fillStyle=t.roadColor,l.beginPath(),l.arc(T,v,M*.5,0,Math.PI*2),l.fill(),p(E+1,_)&&l.fillRect(T,v-M*.5,s,M),p(E,_+1)&&l.fillRect(T-M*.5,v,M,r),d.fillStyle="#828282",d.beginPath(),d.arc(T,v,M*.5,0,Math.PI*2),d.fill(),p(E+1,_)&&d.fillRect(T,v-M*.5,s,M),p(E,_+1)&&d.fillRect(T-M*.5,v,M,r),h.fillStyle="#949494",h.beginPath(),h.arc(T,v,M*.5,0,Math.PI*2),h.fill(),p(E+1,_)&&h.fillRect(T,v-M*.5,s,M),p(E,_+1)&&h.fillRect(T-M*.5,v,M,r);const I=s*.13;if(p(E+1,_)){l.strokeStyle="rgba(20, 22, 25, 0.35)",l.lineWidth=6;for(const R of[-I,I])l.beginPath(),l.moveTo(T,v+R),l.lineTo(T+s,v+R),l.stroke();l.strokeStyle=t.laneColor,l.lineWidth=2.2,l.setLineDash([10,10]),l.beginPath(),l.moveTo(T,v),l.lineTo(T+s,v),l.stroke(),l.setLineDash([])}if(p(E,_+1)){l.strokeStyle="rgba(20, 22, 25, 0.35)",l.lineWidth=6;for(const R of[-I,I])l.beginPath(),l.moveTo(T+R,v),l.lineTo(T+R,v+r),l.stroke();l.strokeStyle=t.laneColor,l.lineWidth=2.2,l.setLineDash([10,10]),l.beginPath(),l.moveTo(T,v),l.lineTo(T,v+r),l.stroke(),l.setLineDash([])}}for(let _=0;_<3600;_++){const E=x()*i,T=x()*n,v=x()>.5;l.fillStyle=v?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.08)",l.fillRect(E,T,2,2)}const g=new Ms(o);g.colorSpace=li,g.anisotropy=8;const S=new Ms(c),w=new Ms(u);return w.anisotropy=4,{map:g,roughnessMap:S,bumpMap:w}}function ph(a,e){const t=a.length,i=e?t*64:64,n=e?48:t*64,s=document.createElement("canvas");s.width=i,s.height=n;const r=s.getContext("2d");r.fillStyle="#141c24",r.fillRect(0,0,i,n),r.fillStyle="#7dd3fc",r.font="bold 22px Consolas, monospace",r.textAlign="center",r.textBaseline="middle";for(let l=0;l<t;l++)e?r.fillText(a[l],(l+.5)*64,24):r.fillText(a[l],32,(l+.5)*64);const o=new Ms(s);return o.colorSpace=li,o}function s_(a,e="desert",t=[{col:0,row:3,id:"ALPHA"},{col:0,row:12,id:"BRAVO"}],i={col:27,row:7}){const n=new oe,s=cl[e]||cl.desert,{map:r,roughnessMap:o,bumpMap:l}=n_(a,e),c=[r,o,l],h=[],u=[],d=Q=>(h.push(Q),Q),f=Q=>(u.push(Q),Q),m=d(new Ui(Bi,ki)),x=f(new nt({map:r,roughnessMap:o,bumpMap:l,bumpScale:.05,roughness:e==="arctic"?.65:.92,metalness:.04,envMapIntensity:e==="arctic"?.95:.75})),p=new V(m,x);p.rotation.x=-Math.PI/2,p.receiveShadow=!0,n.add(p);const g=new V(d(new Et(Bi+2.8,2.2,ki+2.8)),f(new nt({color:s.plinthColor,roughness:.94,metalness:.05})));g.position.set(0,-1.11,0),g.receiveShadow=!0,n.add(g);const S=new V(d(new Et(Bi+4.6,2,ki+4.6)),f(Jt("diamondSteelPlate",{color:4938862,roughness:.5,metalness:.72,bumpScale:.04,repeat:[22,13]})));S.position.set(0,-2.6,0),n.add(S);const w=new V(d(new Ui(460,460)),f(new nt({color:725272,roughness:.92,metalness:.15})));w.rotation.x=-Math.PI/2,w.position.y=-3.62,w.receiveShadow=!0,n.add(w);const _=d(new Ku(new Et(Bi+2.85,.14,ki+2.85))),E=new qu(_,f(new gs({color:s.trimColor,transparent:!0,opacity:.5})));E.position.set(0,.03,0),n.add(E);const T=Array.from({length:Ve},(Q,Re)=>Md(Re)),v=ph(T,!0);c.push(v);const M=new V(d(new Ui(Bi,1.15)),f(new Pt({map:v})));M.rotation.x=-Math.PI/2,M.position.set(0,.05,-ki*.5-.72),n.add(M);const I=Array.from({length:St},(Q,Re)=>String(Re+1).padStart(2,"0")),R=ph(I,!1);c.push(R);const D=new V(d(new Ui(1.15,ki)),f(new Pt({map:R})));D.rotation.x=-Math.PI/2,D.position.set(-Bi*.5-.72,.05,0),n.add(D);const O=f(Jt("concreteBunker",{color:13685978,roughness:.88,bumpScale:.05,repeat:[1.5,1.5]})),W=f(Jt("concreteBunker",{color:9146520,roughness:.88,bumpScale:.05,repeat:[1.5,1.5]})),N=f(Jt("tacticalAsphalt",{roughness:.84,metalness:.1,bumpScale:.04,repeat:[2,2]})),H=f(Jt("diamondSteelPlate",{roughness:.44,metalness:.78,bumpScale:.05,repeat:[2,2]})),K=f(Jt("natoArmorPlate",{color:13686970,roughness:.72,metalness:.22,bumpScale:.035})),B=f(Jt("sandbagBurlap",{roughness:.94,metalness:.02,bumpScale:.08})),le=f(new nt({color:ri.steel,roughness:.36,metalness:.82,envMapIntensity:1.25})),q=f(new nt({color:12131356,roughness:.55,metalness:.25})),ie=f(new nt({color:3718648,emissive:3718648,emissiveIntensity:2})),ae=f(new nt({color:16707722,emissive:16436245,emissiveIntensity:2.2})),Ce=d(new wi(.15,.15,.42,12)),He=d(new Et(.46,.28,.32)),J=d(new wi(.035,.05,1.35,6)),be=d(new Et(.05,.04,.34)),Pe=d(new Et(.14,.06,.16)),Oe=(Q,Re,ht,Mt,yt=!1)=>{const ut=new V(Ce,yt?q:K);ut.position.set(Re,ht+.21,Mt),ut.castShadow=!0,ut.receiveShadow=!0,Q.add(ut)},we=(Q,Re,ht,Mt,yt=0)=>{const ut=new V(He,K);ut.position.set(Re,ht+.14,Mt),ut.rotation.y=yt,ut.castShadow=!0,ut.receiveShadow=!0,Q.add(ut)},Be=(Q,Re,ht,Mt=0)=>{const yt=new oe;yt.position.set(Re,0,ht),yt.rotation.y=Mt;const ut=new V(J,le);ut.position.y=.675,ut.castShadow=!0,yt.add(ut);const It=new V(be,le);It.position.set(0,1.34,.14),yt.add(It);const Ut=new V(Pe,ae);Ut.position.set(0,1.31,.26),yt.add(Ut),Q.add(yt)},At=f(Jt("concreteBunker",{color:s.rockPrimary,roughness:e==="arctic"?.55:.9,metalness:e==="industrial"?.35:.06,bumpScale:.08,flatShading:!0})),We=f(Jt("concreteBunker",{color:s.rockSecondary,roughness:.88,metalness:e==="industrial"?.45:.05,bumpScale:.08,flatShading:!0})),it=f(new nt({color:4929057,roughness:.9})),lt=f(new nt({color:s.foliageA,roughness:.85,flatShading:!0})),ne=f(new nt({color:s.foliageB,roughness:.85,flatShading:!0})),ge=f(new nt({color:s.scrub,roughness:.9,flatShading:!0})),ve=d(new js(1.38,0)),Ae=d(new js(.68,0)),Me=d(new wi(.08,.13,.72,6)),Ze=d(new qi(.58,.95,7)),Ue=d(new qi(.45,.82,7)),ct=d(new qi(.28,.62,6)),dt=d(new js(.32,0)),vt=d(new Et(.26,2.2,.26));for(let Q=0;Q<St;Q++)for(let Re=0;Re<Ve;Re++){if(a[Q][Re]!==Ye.ROCK)continue;const{x:ht,z:Mt}=Xn(Re,Q),yt=new oe;if(yt.position.set(ht,0,Mt),e==="industrial"){const ut=new V(d(new Et(2.5,1.4,2.3)),We);ut.position.set(0,.7,0),ut.rotation.y=(Re+Q)%4*.25,ut.castShadow=!0,ut.receiveShadow=!0,yt.add(ut);const It=new V(d(new wi(.75,.85,2.1,10)),At);It.position.set(.4,1.05,-.35),It.castShadow=!0,It.receiveShadow=!0,yt.add(It);const Ut=new V(vt,ge);Ut.position.set(-.75,1.1,.6),Ut.rotation.set(.28,.4,-.22),Ut.castShadow=!0,yt.add(Ut)}else{const ut=new V(ve,At);ut.scale.set(1.22,.88,1.05),ut.position.set(0,.72,0),ut.rotation.set(.3,Re*1.1+Q,.2),ut.castShadow=!0,ut.receiveShadow=!0,yt.add(ut);for(let It=0;It<3;It++){const Ut=It*2.1+Re+Q,kt=new V(Ae,It%2===0?We:At);kt.position.set(Math.cos(Ut)*1.05,.36,Math.sin(Ut)*.95),kt.scale.set(1.1,.75,.95),kt.rotation.set(Ut,Ut*.7,0),kt.castShadow=!0,kt.receiveShadow=!0,yt.add(kt)}if(e==="arctic")for(let It=0;It<2;It++){const Ut=It*2.7+Q*.9+Re*.4,kt=new oe;kt.position.set(Math.cos(Ut)*1.18,0,Math.sin(Ut)*1.15);const Yt=new V(Me,it);Yt.position.y=.36,Yt.castShadow=!0,kt.add(Yt);const hi=new V(Ze,lt);hi.position.y=.92,hi.castShadow=!0,kt.add(hi);const gi=new V(Ue,ne);gi.position.y=1.38,gi.castShadow=!0,kt.add(gi);const vi=new V(ct,ne);vi.position.y=1.76,vi.castShadow=!0,kt.add(vi),yt.add(kt)}else{const It=new V(dt,ge);It.position.set(-1.05,.2,.88),It.scale.set(1.2,.7,1.1),It.castShadow=!0,yt.add(It)}}n.add(yt)}const F=f(new nt({color:15680580,emissive:10033947,emissiveIntensity:.9,roughness:.4})),Bt=f(new nt({color:16281969,emissive:15680580,emissiveIntensity:2})),at=d(new Et(3.82,.14,3.82)),Rt=d(new Rs(1.15,1.38,24)),_e=d(new Et(.18,.02,1.2)),Ft=d(new Et(.9,.02,.18)),Ge=d(new wi(.08,.1,.25,8)),qe=d(new nn(.11,8,8));for(const Q of t){const{x:Re,z:ht}=Xn(Q.col,Q.row),Mt=new oe;Mt.position.set(Re,0,ht);const yt=new V(at,N);yt.position.y=.07,yt.receiveShadow=!0,Mt.add(yt);const ut=new V(Rt,f(new Pt({color:15680580,side:Ot})));ut.rotation.x=-Math.PI/2,ut.position.y=.15,Mt.add(ut);const It=new V(_e,F);It.position.set(-.42,.15,0);const Ut=new V(_e,F);Ut.position.set(.42,.15,0);const kt=new V(Ft,F);kt.position.set(0,.15,0),Mt.add(It,Ut,kt);for(const[Yt,hi]of[[-1.68,-1.68],[1.68,-1.68],[-1.68,1.68],[1.68,1.68]]){const gi=new V(Ge,O);gi.position.set(Yt,.2,hi),Mt.add(gi);const vi=new V(qe,Bt);vi.position.set(Yt,.36,hi),Mt.add(vi)}Oe(Mt,-1.52,.14,-1.16,!0),Oe(Mt,-1.24,.14,-1.48,!1),we(Mt,-1.42,.14,1.32,.25),Be(Mt,-1.72,1.72,Math.PI*.75),n.add(Mt)}const A=(Q,Re)=>Q>=0&&Q<Ve&&Re>=0&&Re<St&&a[Re][Q]===Ye.ROAD,y=d(new Et(.42,.22,.26));for(let Q=0;Q<St;Q++)for(let Re=0;Re<Ve;Re++){if(a[Q][Re]!==Ye.ROAD)continue;const ht=A(Re,Q-1),Mt=A(Re,Q+1),yt=A(Re-1,Q),ut=A(Re+1,Q);if(!((ht||Mt)&&(yt||ut)&&!(ht&&Mt)&&!(yt&&ut)))continue;const{x:Ut,z:kt}=Xn(Re,Q),Yt=yt?1.56:-1.56,hi=ht?1.56:-1.56;for(let gi=0;gi<3;gi++){const vi=new V(y,B);vi.position.set(Ut+Yt*(1-gi*.14),.11+(gi===2?.18:0),kt+hi*(1-(2-gi)*.14)),vi.rotation.y=(Yt*hi>0?-1:1)*(Math.PI/4),vi.castShadow=!0,vi.receiveShadow=!0,n.add(vi)}(Re+Q)%2===0?Be(n,Ut+Yt,kt+hi,Math.atan2(-Yt,-hi)):Oe(n,Ut+Yt,0,kt+hi,!1)}const k=Xn(i.col,i.row),se=new oe;se.position.set(k.x,0,k.z);const te=new V(d(new Et(3.92,.18,4.65)),W);te.position.y=.09,te.receiveShadow=!0,se.add(te);const ue=new V(d(new Et(2.12,1.25,2.2)),O);ue.position.set(.35,.72,-.35),ue.castShadow=!0,ue.receiveShadow=!0,se.add(ue);const xe=new V(d(new Et(2.34,.22,2.42)),H);xe.position.set(.35,1.42,-.35),xe.castShadow=!0,xe.receiveShadow=!0,se.add(xe);const Z=new V(d(new Et(.1,.16,1.42)),ie);Z.position.set(-.72,1.02,-.35),se.add(Z);const ee=d(new Et(.38,.24,.56));for(let Q=0;Q<2;Q++)for(let Re=-3;Re<=3;Re++){const ht=new V(ee,B);ht.position.set(-1.55,.28+Q*.22,Re*.58+(Q%2===1?.14:0)),ht.castShadow=!0,ht.receiveShadow=!0,se.add(ht)}const pe=new V(d(new Et(1.35,.72,1.45)),K);pe.position.set(.55,.52,1.38),pe.castShadow=!0,pe.receiveShadow=!0,se.add(pe);const P=new V(d(new qi(1.06,.55,4)),K);P.rotation.y=Math.PI/4,P.position.set(.55,1.15,1.38),P.castShadow=!0,se.add(P),we(se,-.85,.18,1.48,.2),Oe(se,-.45,.18,1.75,!1),Oe(se,-.78,.18,1.88,!0),Be(se,-1.65,-1.95,Math.PI*.25),Be(se,-1.65,1.95,Math.PI*.75);const j=new oe;j.position.set(.35,1.54,-.35);const Y=new V(d(new wi(.08,.11,1.1,8)),le);Y.position.y=.55,j.add(Y);const fe=new oe;fe.position.y=1.15;const de=new V(d(new wi(.55,.14,.22,12)),f(new nt({color:14870768,roughness:.35,metalness:.4})));de.rotation.x=Math.PI/3,fe.add(de);const me=new V(d(new wi(.03,.03,.42,6)),ie);me.rotation.x=Math.PI/3,me.position.set(0,.16,.22),fe.add(me),j.add(fe),se.add(j);const De=new oe;De.position.set(-.45,1.56,.45);const je=new V(d(new wi(.14,.18,.32,8)),le);je.rotation.x=Math.PI/2-.25,De.add(je);const ce=d(new qi(1.4,8.5,16,1,!0));ce.translate(0,-4.25,0),ce.rotateX(Math.PI/2-.18);const ze=f(new Pt({color:12248829,transparent:!0,opacity:.08,side:Ot,depthWrite:!1,blending:en})),Je=new V(ce,ze);return Je.position.z=.15,De.add(Je),se.add(De),n.add(se),{group:n,groundPlane:p,update:(Q,Re)=>{fe.rotation.y+=Re*1.4,De.rotation.y=Math.PI+Math.sin(Q*.75)*.75;const ht=.8+Math.sin(Q*5)*.6;Bt.emissiveIntensity=1.2+ht},dispose:()=>{for(const Q of c)Q.dispose();for(const Q of h)Q.dispose();for(const Q of u)Q.dispose()}}}const a_=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,r_=`
  uniform vec3 uColor;
  uniform float uProgress;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float d = length(p);
    float ringCenter = mix(0.15, 0.92, uProgress);
    float ringWidth = mix(0.22, 0.08, uProgress);
    float band = 1.0 - smoothstep(0.0, ringWidth, abs(d - ringCenter));
    float outerCut = 1.0 - smoothstep(0.95, 1.0, d);
    float alpha = band * outerCut * uOpacity * (1.0 - uProgress);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor * 1.6, alpha);
  }
`;function o_(){const a=document.createElement("canvas");a.width=128,a.height=128;const e=a.getContext("2d"),t=e.createRadialGradient(64,64,6,64,64,60);t.addColorStop(0,"rgba(12, 10, 8, 0.92)"),t.addColorStop(.45,"rgba(28, 24, 20, 0.72)"),t.addColorStop(.75,"rgba(55, 48, 38, 0.35)"),t.addColorStop(1,"rgba(0, 0, 0, 0)"),e.fillStyle=t,e.fillRect(0,0,128,128);const i=new Ms(a);return i.colorSpace=li,i}class l_{constructor(e){this.sphereGeo=new nn(.45,8,6),this.debrisGeo=new Et(.22,.14,.32),this.planeGeo=new Ui(2,2),this.craterGeo=new Ui(2.6,2.6),this.craterTex=o_(),this.scene=e,this.particlePool=new ia(()=>{const t=new Pt({color:16777215,transparent:!0,opacity:1,depthWrite:!1}),i=new V(this.sphereGeo,t);return i.visible=!1,this.scene.add(i),{mesh:i,kind:"fire",x:0,y:0,z:0,vx:0,vy:0,vz:0,rxVel:0,ryVel:0,rzVel:0,gravity:0,bounce:0,life:0,maxLife:1,startScale:1,endScale:.1,startOpacity:1,drag:.95,onRelease:()=>{i.visible=!1}}},260,950),this.craterPool=new ia(()=>{const t=new Pt({map:this.craterTex,transparent:!0,opacity:.8,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1}),i=new V(this.craterGeo,t);return i.rotation.x=-Math.PI/2,i.position.y=.03,i.visible=!1,this.scene.add(i),{mesh:i,life:0,maxLife:14,onRelease:()=>{i.visible=!1}}},30,90)}acquireStandard(e,t,i,n){const s=this.particlePool.acquire();s.kind=e,s.mesh.geometry=t,s.mesh.material instanceof Pt||(s.mesh.material.dispose(),s.mesh.material=new Pt({transparent:!0,depthWrite:!1}));const r=s.mesh.material;return r.color.setHex(i),r.blending=n?en:xs,r.depthWrite=e==="debris",s.mesh.rotation.set(0,0,0),s.mesh.visible=!0,s}spawnShockwave(e,t,i,n,s){const r=this.particlePool.acquire();r.kind="shockwave",r.mesh.geometry=this.planeGeo,r.mesh.material instanceof Ti?(r.mesh.material.uniforms.uColor.value.setHex(s),r.mesh.material.uniforms.uProgress.value=0,r.mesh.material.uniforms.uOpacity.value=.9):(r.mesh.material.dispose(),r.mesh.material=new Ti({vertexShader:a_,fragmentShader:r_,uniforms:{uColor:{value:new Ke(s)},uProgress:{value:0},uOpacity:{value:.9}},transparent:!0,depthWrite:!1,blending:en,side:Ot})),r.x=e,r.y=Math.max(.08,t),r.z=i,r.vx=0,r.vy=0,r.vz=0,r.gravity=0,r.bounce=0,r.rxVel=0,r.ryVel=0,r.rzVel=0,r.drag=1,r.life=.34,r.maxLife=.34,r.startScale=n*.95,r.endScale=n*1.15,r.startOpacity=.9,r.mesh.rotation.set(-Math.PI/2,0,0),r.mesh.position.set(r.x,r.y,r.z),r.mesh.scale.setScalar(r.startScale),r.mesh.visible=!0}spawnSparks(e,t,i,n,s){for(let r=0;r<n;r++){const o=this.acquireStandard("spark",this.sphereGeo,s,!0),l=Math.random()*Math.PI*2,c=4+Math.random()*9;o.x=e,o.y=t,o.z=i,o.vx=Math.cos(l)*c,o.vy=2.5+Math.random()*5.5,o.vz=Math.sin(l)*c,o.gravity=-18,o.bounce=.3,o.drag=.94,o.life=.18+Math.random()*.16,o.maxLife=o.life,o.startScale=.25+Math.random()*.2,o.endScale=.03,o.startOpacity=1,o.mesh.position.set(e,t,i)}}spawnSmokePuff(e,t,i,n=3356994,s=.55){const r=this.acquireStandard("smoke",this.sphereGeo,n,!1);r.x=e+(Math.random()-.5)*.3,r.y=t+(Math.random()-.5)*.2,r.z=i+(Math.random()-.5)*.3,r.vx=(Math.random()-.5)*1.2,r.vy=1.6+Math.random()*2.2,r.vz=(Math.random()-.5)*1.2,r.gravity=.4,r.bounce=0,r.drag=.96,r.life=.6+Math.random()*.35,r.maxLife=r.life,r.startScale=s,r.endScale=s*2.6,r.startOpacity=.58,r.mesh.position.set(r.x,r.y,r.z)}spawnDebris(e,t,i,n,s=1){for(let r=0;r<n;r++){const o=r%2===0?2764084:5590333,l=this.acquireStandard("debris",this.debrisGeo,o,!1),c=Math.random()*Math.PI*2,h=(3.5+Math.random()*8.5)*s;l.x=e,l.y=Math.max(.25,t),l.z=i,l.vx=Math.cos(c)*h,l.vy=(5.5+Math.random()*8.5)*Math.min(1.4,s),l.vz=Math.sin(c)*h,l.rxVel=(Math.random()-.5)*14,l.ryVel=(Math.random()-.5)*14,l.rzVel=(Math.random()-.5)*14,l.gravity=-24,l.bounce=.42,l.drag=.985,l.life=.9+Math.random()*.6,l.maxLife=l.life,l.startScale=(.7+Math.random()*.7)*Math.min(1.5,s),l.endScale=l.startScale*.55,l.startOpacity=1,l.mesh.position.set(l.x,l.y,l.z)}}spawnExplosion(e,t,i,n=1,s=16347926,r=!0){this.spawnShockwave(e,Math.max(.08,t*.2),i,2.8*n,s);const o=this.acquireStandard("fire",this.sphereGeo,16707722,!0);o.x=e,o.y=Math.max(.35,t),o.z=i,o.vx=0,o.vy=.6,o.vz=0,o.gravity=0,o.drag=1,o.life=.24,o.maxLife=.24,o.startScale=.6*n,o.endScale=2.6*n,o.startOpacity=.95,o.mesh.position.set(o.x,o.y,o.z);const l=Math.min(10,Math.round(5*n));for(let h=0;h<l;h++){const u=this.acquireStandard("fire",this.sphereGeo,h%2===0?s:16436245,!0),d=Math.random()*Math.PI*2,f=(1.5+Math.random()*4.5)*n;u.x=e+Math.cos(d)*.3,u.y=Math.max(.3,t),u.z=i+Math.sin(d)*.3,u.vx=Math.cos(d)*f,u.vy=1.8+Math.random()*3.5,u.vz=Math.sin(d)*f,u.gravity=-4,u.bounce=0,u.drag=.92,u.life=.26+Math.random()*.2,u.maxLife=u.life,u.startScale=(.8+Math.random()*.6)*n,u.endScale=.12,u.startOpacity=.92,u.mesh.position.set(u.x,u.y,u.z)}const c=Math.min(8,Math.round(3+n*2.5));for(let h=0;h<c;h++)this.spawnSmokePuff(e+(Math.random()-.5)*n,Math.max(.4,t),i+(Math.random()-.5)*n,h%2===0?2237996:3883080,.75*n);r&&this.spawnDebris(e,Math.max(.3,t),i,Math.min(12,Math.round(5*n)),n)}spawnCrater(e,t,i=1){const n=this.craterPool.acquire();n.life=n.maxLife,n.mesh.position.set(e,.03,t),n.mesh.rotation.z=Math.random()*Math.PI*2,n.mesh.scale.setScalar(Math.min(2.2,.85*i)),n.mesh.material.opacity=.78,n.mesh.visible=!0}update(e){this.particlePool.forEachActive(t=>{const i=t;if(i.life-=e,i.life<=0){this.particlePool.release(i);return}const n=1-i.life/i.maxLife;if(i.kind==="shockwave"){const r=i.mesh.material;r.uniforms.uProgress.value=n;const o=oi.lerp(i.startScale,i.endScale,n);i.mesh.scale.setScalar(o);return}i.vy+=i.gravity*e,i.x+=i.vx*e,i.y+=i.vy*e,i.z+=i.vz*e,i.y<.08&&i.vy<0&&(i.y=.08,i.bounce>0?(i.vy=-i.vy*i.bounce,i.vx*=.7,i.vz*=.7):i.vy=0);const s=Math.pow(i.drag,e*60);i.vx*=s,i.vz*=s,i.kind==="debris"&&(i.mesh.rotation.x+=i.rxVel*e,i.mesh.rotation.y+=i.ryVel*e,i.mesh.rotation.z+=i.rzVel*e),i.mesh.position.set(i.x,i.y,i.z),i.mesh.scale.setScalar(oi.lerp(i.startScale,i.endScale,n)),i.mesh.material.opacity=i.startOpacity*(1-n)}),this.craterPool.forEachActive(t=>{const i=t;if(i.life-=e,i.life<=0){this.craterPool.release(i);return}i.mesh.material.opacity=.72*Math.min(1,i.life/4)})}releaseAll(){this.particlePool.releaseAll(),this.craterPool.releaseAll()}}const nr=Ve*tt,sr=St*tt;function vo(a,e,t){let i=(e-a+Math.PI)%(Math.PI*2)-Math.PI;return i<-Math.PI&&(i+=Math.PI*2),Math.abs(i)<=t?e:a+Math.sign(i)*t}function c_(a,e){let t=(a-e+Math.PI)%(Math.PI*2)-Math.PI;return t<-Math.PI&&(t+=Math.PI*2),Math.abs(t)}function h_(a){return a==="drone_swarm"?3.5:a==="heli"||a==="subboss_ka50"?4.25:a==="stealth"||a==="boss_tu160"?4.8:a==="megaboss_kirov_airship"?5.4:.65}class d_{constructor(e){this.flashLights=[],this.flashLightCursor=0,this.flashLightTimers=[0,0],this.raycaster=new Gf,this.pointerNdc=new re,this.hoverWorld=new C,this.keysDown=new Set,this.pathfinder=new wx,this.towers=[],this.towerGrid=[],this.currentWorldId=1,this.currentStageId=1,this.stageConfig=null,this.worldConfig=null,this.budget=750,this.sessionWB=0,this.fobHp=20,this.fobMaxHp=20,this.currentWave=0,this.totalWaves=10,this.waveActive=!1,this.wavePrepTimer=0,this.inIntermission=!1,this.spawnQueue=[],this.waveElapsed=0,this.timeScale=1,this.lastNonZeroSpeed=1,this.gameOver=!1,this.victory=!1,this.totalKills=0,this.totalDamage=0,this.airSupport={a10:{cost:dn.a10.cost,cooldown:dn.a10.cooldown,timer:0},hellfire:{cost:dn.hellfire.cost,cooldown:dn.hellfire.cooldown,timer:0},b52:{cost:dn.b52.cost,cooldown:dn.b52.cooldown,timer:0}},this.activeTool=null,this.strafeAngle=0,this.strafeDragStart=null,this.selectedTower=null,this.hoveredEnemy=null,this.hoverTile={col:-1,row:-1},this.lastCanPlace=null,this.lastTowerAttackWarnTime=-10,this.trauma=0,this.hitStopTimer=0,this.elapsedReal=0,this.hasGlobalAesa=!1,this.nextEnemyId=1,this.activeFlyovers=[],this.pendingShots=[],this.bossProjectiles=[],this.fireZones=[],this.routeLinesGroup=new oe,this.previewRouteGroup=new oe,this.selectedRingGroup=new oe,this.ghostGroup=new oe,this.ghostModels=new Map,this.supportReticleGroup=new oe,this.stealthLockGroup=new oe,this.bulletGeo=new Et(.1,.1,1.35),this.bulletMat=new Pt({color:16707722}),this.sabotMat=new Pt({color:16486972}),this.bossBulletMat=new Pt({color:16726843}),this.shellGeo=new nn(.18,8,6),this.shellMat=new nt({color:16096779,emissive:14251782,emissiveIntensity:1.8}),this.bossShellMat=new nt({color:15680580,emissive:14427686,emissiveIntensity:2.2}),this.laserBeamGeo=new wi(.11,.11,1,8,1,!1),this.laserBeamMat=new Pt({color:new Ke(.6,2.2,2.8),transparent:!0,opacity:.9,blending:en,depthWrite:!1}),this.fireZoneGeo=new ys(1,28),this.fireZoneMat=new Pt({color:16347926,transparent:!0,opacity:.32,side:Ot,depthWrite:!1,blending:en}),this.ewPulseGeo=new Rs(.92,1,48),this.rafId=0,this.lastFrameTime=performance.now(),this.hudSyncAccum=0,this.autosaveAccum=0,this.unsubs=[],this.baseCameraOffset=new C,this.pointerDownPos=null,this.shiftHeld=!1,this.loop=n=>{this.rafId=requestAnimationFrame(this.loop);const s=(n-this.lastFrameTime)/1e3;this.lastFrameTime=n;const r=Math.min(.05,Math.max(0,s));this.elapsedReal+=r;for(let l=0;l<this.flashLights.length;l++)this.flashLightTimers[l]>0&&(this.flashLightTimers[l]-=r,this.flashLightTimers[l]<=0&&(this.flashLights[l].intensity=0));if(this.updateCameraPan(r),this.controls.update(),this.diorama&&this.diorama.update(this.elapsedReal,r),this.hitStopTimer>0){this.hitStopTimer-=r,this.updateCameraShake(r),this.composer.render();return}const o=this.gameOver?0:r*this.timeScale;if(o>0){for(const l of["a10","hellfire","b52"])this.airSupport[l].timer>0&&(this.airSupport[l].timer=Math.max(0,this.airSupport[l].timer-o));this.updateWaveState(o),this.updateEwFields(o),this.updateFireZones(o),this.updateEnemies(o),this.updatePendingShots(o),this.updateTowers(o),this.updateProjectiles(o),this.updateBossProjectiles(o),this.updateFlyovers(o),this.effects.update(o),this.updateFloatingTexts(o)}this.updateInteractiveOverlays(),this.updateProjectedDomBars(),this.updateCameraShake(r),this.composer.render(),this.hudSyncAccum+=r,this.hudSyncAccum>=.1&&(this.hudSyncAccum=0,this.emitFullHudSync(),this.selectedTower&&he.emit("hud:selectedTower",this.serializeTower(this.selectedTower))),this.autosaveAccum+=r,this.autosaveAccum>=10&&(this.autosaveAccum=0,this.saveCurrentMissionSnapshot())},this.container=e,this.overlayEl=document.createElement("div"),this.overlayEl.className="world-overlay",this.container.parentElement?.appendChild(this.overlayEl);const t=Xe.getState(),i=Xe.getActiveMission();this.currentWorldId=i?i.worldId:t.selectedWorld,this.currentStageId=i?i.stageId:t.selectedStage,this.initThree(),this.initSimulation(),this.initPools(),this.initOverlays(),this.initInput(),this.bindBusCommands(),this.bindPersistenceLifecycle(),this.loadStage(this.currentWorldId,this.currentStageId,!0,i),this.ghostModels=i_(this.scene,this.camera,this.renderer,this.ghostGroup),i?(this.pushRadio(`💾 AUTOSAVE RESTAURADO: Fase ${i.worldId}-${i.stageId} (Onda ${i.completedWave}/${i.totalWaves}, ${i.towers.length} torres).`,"good"),he.emit("hud:alert",{level:"warn",text:`💾 OPERAÇÃO RESTAURADA DO AUTOSAVE (Fase ${i.worldId}-${i.stageId}, Onda ${i.completedWave}/${i.totalWaves})`})):this.pushRadio("C4ISR 3D ONLINE (28x16). Botão direito/WASD move câmera | Scroll zoom | [R] repara torre.","info"),Xe.syncFromIndexedDB().then(n=>{if(n&&this.towers.length===0&&this.currentWave===0&&!this.gameOver){const s=Xe.getState(),r=Xe.getActiveMission(),o=r?r.worldId:s.selectedWorld,l=r?r.stageId:s.selectedStage;this.loadStage(o,l,!0,r),he.emit("cmd:techUpdated"),he.emit("hud:slotsUpdated"),this.pushRadio("💾 Progresso sincronizado do backup IndexedDB!","good")}}),this.lastFrameTime=performance.now(),this.loop(this.lastFrameTime)}initThree(){const e=this.container.clientWidth||1e3,t=this.container.clientHeight||640;this.scene=new Nh,this.scene.background=new Ke(1446929),this.scene.fog=new _r(1775378,.0038),this.camera=new Oi(42,e/t,.5,520),this.camera.position.set(0,62,74),this.renderer=new Fv({antialias:!0,powerPreference:"high-performance"}),this.renderer.setSize(e,t),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Zs,this.renderer.toneMapping=Rr,this.renderer.toneMappingExposure=1.08,this.renderer.outputColorSpace=li,this.container.appendChild(this.renderer.domElement),ud(this.renderer.capabilities.getMaxAnisotropy());const i=new pa(this.renderer);i.compileEquirectangularShader(),this.scene.environment=i.fromScene(new Jv,.04).texture,this.scene.environmentIntensity=1.15,i.dispose();const n=new Uf(9155286,6048310,.9);this.scene.add(n),this.sunLight=new Nc(16771522,2.55),this.sunLight.position.set(45,68,38),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.set(2048,2048),this.sunLight.shadow.camera.near=10,this.sunLight.shadow.camera.far=200,this.sunLight.shadow.camera.left=-66,this.sunLight.shadow.camera.right=66,this.sunLight.shadow.camera.top=48,this.sunLight.shadow.camera.bottom=-48,this.sunLight.shadow.bias=-4e-4,this.sunLight.shadow.normalBias=.02,this.scene.add(this.sunLight),this.rimLight=new Nc(6333946,.85),this.rimLight.position.set(-48,32,-40),this.scene.add(this.rimLight);for(let r=0;r<2;r++){const o=new jh(16758605,0,14,2);o.castShadow=!1,o.position.set(0,-50,0),this.scene.add(o),this.flashLights.push(o)}this.controls=new Bv(this.camera,this.renderer.domElement),this.controls.target.set(0,0,0),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=24,this.controls.maxDistance=210,this.controls.minPolarAngle=Math.PI*.14,this.controls.maxPolarAngle=Math.PI*.43,this.controls.screenSpacePanning=!1,this.controls.mouseButtons={LEFT:mn.ROTATE,MIDDLE:mn.DOLLY,RIGHT:mn.PAN},this.controls.touches={ONE:Cn.ROTATE,TWO:Cn.DOLLY_PAN},this.resetCameraView(),this.composer=new nx(this.renderer),this.composer.addPass(new sx(this.scene,this.camera));const s=new Ps(new re(e,t),.45,.35,.82);this.composer.addPass(s),this.composer.addPass(new rx),this.effects=new l_(this.scene),this.scene.add(this.routeLinesGroup),this.scene.add(this.previewRouteGroup),this.scene.add(this.selectedRingGroup),this.scene.add(this.ghostGroup),this.scene.add(this.supportReticleGroup),this.scene.add(this.stealthLockGroup),this.resizeObserver=new ResizeObserver(()=>this.onResize()),this.resizeObserver.observe(this.container)}triggerFlashLight(e,t,i,n,s=5,r=.07){const o=this.flashLightCursor;this.flashLightCursor=(this.flashLightCursor+1)%this.flashLights.length;const l=this.flashLights[o];l.color.setHex(n),l.position.set(e,t,i),l.intensity=s,this.flashLightTimers[o]=r}applyResponsiveCameraFov(e,t){const i=e/Math.max(1,t);i<1?this.camera.fov=Math.min(68,Math.max(42,Math.round(52/Math.max(.55,i)))):i<1.35?this.camera.fov=48:this.camera.fov=42,this.camera.aspect=i,this.camera.updateProjectionMatrix()}resetCameraView(){const e=this.container.clientWidth||window.innerWidth||1e3,t=this.container.clientHeight||window.innerHeight||640,i=e/Math.max(1,t);this.controls.target.set(0,0,0),i<1?this.camera.position.set(0,78,92):this.camera.position.set(0,62,74),this.applyResponsiveCameraFov(e,t),this.controls.update()}onResize(){const e=this.container.clientWidth,t=this.container.clientHeight;e<=0||t<=0||(this.applyResponsiveCameraFov(e,t),this.renderer.setSize(e,t),this.composer.setSize(e,t))}initSimulation(){this.towerGrid=Array.from({length:St},()=>new Array(Ve).fill(null)),this.towers=[]}initOverlays(){this.ghostTileHighlight=new V(new Ui(_n*.94,_n*.94),new Pt({color:2278750,transparent:!0,opacity:.25,side:Ot,depthWrite:!1})),this.ghostTileHighlight.rotation.x=-Math.PI/2,this.ghostTileHighlight.position.y=.05,this.ghostGroup.add(this.ghostTileHighlight),this.ghostRangeRing=this.createCircleLoop(64,2278750,.85),this.ghostRangeRing.position.y=.09,this.ghostGroup.add(this.ghostRangeRing),this.ghostMinRangeRing=this.createCircleLoop(48,15680580,.8),this.ghostMinRangeRing.position.y=.09,this.ghostGroup.add(this.ghostMinRangeRing),this.ghostGroup.visible=!1}createCircleLoop(e,t,i){const n=[];for(let r=0;r<e;r++){const o=r/e*Math.PI*2;n.push(new C(Math.cos(o),0,Math.sin(o)))}const s=new Ht().setFromPoints(n);return new Yu(s,new gs({color:t,transparent:!0,opacity:i}))}initPools(){this.enemyPool=new ia(()=>{const e=document.createElement("div");e.className="unit-hp-bar hidden";const t=document.createElement("span");t.className="unit-hp-label";const i=document.createElement("div");i.className="unit-hp-track";const n=document.createElement("div");n.className="unit-hp-fill";const s=document.createElement("span");s.className="unit-status-dot hidden",i.appendChild(n),e.append(t,i,s),this.overlayEl.appendChild(e);const r={id:0,type:"infantry",domain:"ground",armorClass:"light",x:0,y:0,wx:0,wy:0,wz:0,angle:0,hp:100,maxHp:100,speed:90,reward:15,wbReward:0,fobDamage:1,isMechanized:!1,hasEra:!1,eraIntact:!1,hasAps:!1,apsCooldownTimer:0,apsMaxCooldown:4,isStealth:!1,stealthRevealed:!1,isBoss:!1,isSubBoss:!1,isStageBoss:!1,isMegaBoss:!1,slowImmune:!1,dismountCount:0,radius:14,path:null,pathIndex:0,distToFob:9999,ewSlow:0,ewDamageAmp:0,thermalVuln:0,ewDisabled:!1,stunTimer:0,hitFlashTimer:0,walkPhase:Math.random()*6.28,towerAttackTimer:2,empPulseTimer:5,periodicSpawnTimer:8,triggeredThresholds:new Set,rig:null,hpEl:e,hpFillEl:n,hpDotEl:s,hpLabelEl:t,onRelease:()=>{r.rig&&(this.scene.remove(r.rig.root),r.rig=null),e.classList.add("hidden")}};return r},64,360),this.projectilePool=new ia(()=>{const e=new V(this.bulletGeo,this.bulletMat);e.visible=!1,this.scene.add(e);const t={kind:"bullet",mesh:e,wx:0,wy:0,wz:0,prevWx:0,prevWy:0,prevWz:0,x:0,y:0,vx:0,vy:0,vz:0,speed:800,targetEnemy:null,targetId:0,targetX:0,targetY:0,startWx:0,startWy:0,startWz:0,targetWx:0,targetWy:0,targetWz:0,damage:10,damageType:"kinetic",armorPierce:0,armorIgnore:0,heavyMultiplier:1,tandemHeat:!1,critChance:0,splashRadius:0,burnDps:0,burnDuration:0,isMissile:!1,isTopAttack:!1,isArtillery:!1,flightTime:0,totalFlightTime:1,sourceTower:null,smokeTimer:0,life:3,onRelease:()=>{t.mesh!==e&&(this.scene.remove(t.mesh),t.mesh=e),e.visible=!1}};return t},160,750),this.textPool=new ia(()=>{const e=document.createElement("div");return e.className="combat-float-text hidden",this.overlayEl.appendChild(e),{el:e,wx:0,wy:0,wz:0,life:0,maxLife:.9,onRelease:()=>{e.classList.add("hidden")}}},40,180)}initInput(){const e=this.renderer.domElement;e.addEventListener("contextmenu",i=>i.preventDefault());const t=i=>{if(!this.diorama)return!1;const n=e.getBoundingClientRect();this.pointerNdc.x=(i.clientX-n.left)/n.width*2-1,this.pointerNdc.y=-((i.clientY-n.top)/n.height)*2+1,this.raycaster.setFromCamera(this.pointerNdc,this.camera);const s=this.raycaster.intersectObject(this.diorama.groundPlane,!1);return s.length>0?(this.hoverWorld.copy(s[0].point),!0):!1};e.addEventListener("pointermove",i=>{if(!t(i))return;const{col:n,row:s}=go(this.hoverWorld.x,this.hoverWorld.z);(n!==this.hoverTile.col||s!==this.hoverTile.row)&&(this.hoverTile.col=n,this.hoverTile.row=s,this.evaluatePlacementPreview(),he.emit("cursor:move",{col:n,row:s,x:Math.round(Wn(this.hoverWorld.x)),y:Math.round(Vn(this.hoverWorld.z))}));const r=Wn(this.hoverWorld.x),o=Vn(this.hoverWorld.z);let l=null,c=34;if(this.enemyPool.forEachActive(h=>{const u=h;if(u.isStealth&&!u.stealthRevealed)return;const d=Math.hypot(u.x-r,u.y-o);d<c&&(c=d,l=u)}),this.hoveredEnemy=l,this.strafeDragStart){const h=r-this.strafeDragStart.x,u=o-this.strafeDragStart.y;Math.hypot(h,u)>14&&(this.strafeAngle=Math.atan2(u,h))}}),e.addEventListener("pointerdown",i=>{if(ke.unlock(),this.pointerDownPos={x:i.clientX,y:i.clientY,button:i.button},!t(i))return;const{col:n,row:s}=go(this.hoverWorld.x,this.hoverWorld.z);(n!==this.hoverTile.col||s!==this.hoverTile.row)&&(this.hoverTile.col=n,this.hoverTile.row=s,this.evaluatePlacementPreview()),i.button===0&&this.activeTool?.kind==="support"&&this.activeTool.supportId==="a10"&&(this.strafeDragStart={x:Wn(this.hoverWorld.x),y:Vn(this.hoverWorld.z)})}),e.addEventListener("pointerup",i=>{if(!this.pointerDownPos)return;const n=Math.hypot(i.clientX-this.pointerDownPos.x,i.clientY-this.pointerDownPos.y),s=this.pointerDownPos.button;if(this.pointerDownPos=null,!t(i)){this.strafeDragStart=null;return}const r=Wn(this.hoverWorld.x),o=Vn(this.hoverWorld.z),{col:l,row:c}=go(this.hoverWorld.x,this.hoverWorld.z);if(s===0&&this.strafeDragStart&&this.activeTool?.kind==="support"&&this.activeTool.supportId==="a10"){const u=this.strafeDragStart.x,d=this.strafeDragStart.y,f=r-u,m=o-d;Math.hypot(f,m)>14&&(this.strafeAngle=Math.atan2(m,f)),this.strafeDragStart=null,this.gameOver||this.executeA10Strafe(u,d,this.strafeAngle);return}const h=i.pointerType==="touch"?18:8;if(!(n>h)){if(s===2){this.activeTool?this.cancelActiveTool():this.selectedTower&&this.selectTower(null);return}if(!(s!==0||this.gameOver)){if(this.activeTool?.kind==="support"){if(this.activeTool.supportId==="hellfire"){this.executeHellfireStrike(r,o);return}if(this.activeTool.supportId==="b52"){this.executeB52CarpetBomb(r,o);return}}if(this.activeTool?.kind==="build"){this.tryPlaceTower(l,c,this.activeTool.towerId);return}this.pathfinder.inBounds(l,c)&&this.towerGrid[c][l]?(this.selectTower(this.towerGrid[c][l]),he.emit("hud:openMobileInspector"),ke.playUi("click")):this.selectTower(null)}}}),e.addEventListener("wheel",i=>{this.activeTool?.kind==="support"&&this.activeTool.supportId==="a10"&&(i.preventDefault(),i.stopPropagation(),this.strafeAngle+=i.deltaY>0?.25:-.25)},{passive:!1,capture:!0}),this.onKeyDown=i=>{i.key==="Shift"&&(this.shiftHeld=!0);const n=i.key.toLowerCase();if(this.keysDown.add(n),i.key==="Escape")this.cancelActiveTool(),this.selectTower(null);else if(i.key===" ")i.preventDefault(),this.togglePause();else if(n==="r")this.activeTool?.kind==="support"&&this.activeTool.supportId==="a10"?this.strafeAngle+=Math.PI/4:this.selectedTower&&this.repairSelectedTower();else if(n==="q")this.selectAirSupport("a10");else if(n==="e")this.selectAirSupport("hellfire");else if(n==="b")this.selectAirSupport("b52");else{const s=Object.values(Li).find(r=>r.hotkey===i.key);s&&this.selectBuildTool(s.id)}},this.onKeyUp=i=>{i.key==="Shift"&&(this.shiftHeld=!1),this.keysDown.delete(i.key.toLowerCase())},window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp)}bindPersistenceLifecycle(){this.onBeforeUnload=()=>{!this.gameOver&&(this.towers.length>0||this.currentWave>0)&&this.saveCurrentMissionSnapshot(!0)},this.onVisibilityChange=()=>{document.visibilityState==="hidden"&&!this.gameOver&&(this.towers.length>0||this.currentWave>0)&&this.saveCurrentMissionSnapshot(!0)},window.addEventListener("beforeunload",this.onBeforeUnload),window.addEventListener("pagehide",this.onBeforeUnload),document.addEventListener("visibilitychange",this.onVisibilityChange)}bindBusCommands(){this.unsubs=[he.on("cmd:selectBuild",e=>this.selectBuildTool(e)),he.on("cmd:selectSupport",e=>this.selectAirSupport(e)),he.on("cmd:cancelTool",()=>this.cancelActiveTool()),he.on("cmd:startWave",()=>this.startNextWave(!0)),he.on("cmd:setSpeed",e=>this.setSpeed(e)),he.on("cmd:upgradeTower",()=>this.upgradeSelectedTower()),he.on("cmd:repairTower",()=>this.repairSelectedTower()),he.on("cmd:sellTower",()=>this.sellSelectedTower()),he.on("cmd:setPriority",e=>this.setSelectedTowerPriority(e)),he.on("cmd:restart",()=>{Xe.clearActiveMission(),this.loadStage(this.currentWorldId,this.currentStageId,!1,null)}),he.on("cmd:loadStage",({worldId:e,stageId:t})=>{Xe.clearActiveMission(),Xe.selectStage(e,t),this.loadStage(e,t,!1,null)}),he.on("cmd:forceSave",()=>{this.saveCurrentMissionSnapshot(!0),ke.playUi("click"),this.spawnFloatingText(0,4.5,-18,"💾 JOGO SALVO!","#4ade80"),this.pushRadio("💾 Estado atual da operação salvo com segurança.","good")}),he.on("cmd:saveSlot",e=>{this.gameOver||this.saveCurrentMissionSnapshot(!0),Xe.saveToSlot(e),ke.playUi("build"),he.emit("hud:slotsUpdated"),this.pushRadio(`💾 Operação gravada no SLOT ${e}.`,"good")}),he.on("cmd:loadSlot",e=>{if(!Xe.loadFromSlot(e)){ke.playUi("error");return}const t=Xe.getState(),i=Xe.getActiveMission(),n=i?i.worldId:t.selectedWorld,s=i?i.stageId:t.selectedStage;this.loadStage(n,s,!1,i),ke.playUi("wave"),he.emit("cmd:techUpdated"),he.emit("hud:slotsUpdated"),this.pushRadio(`💾 Save do SLOT ${e} carregado com sucesso!`,"good")}),he.on("cmd:deleteSlot",e=>{Xe.deleteSlot(e),ke.playUi("click"),he.emit("hud:slotsUpdated")}),he.on("cmd:importSave",e=>{const t=Xe.importSaveJson(e);if(!t.ok){ke.playUi("error"),this.pushRadio(`Erro ao importar save: ${t.error}`,"alert");return}const i=Xe.getState(),n=Xe.getActiveMission(),s=n?n.worldId:i.selectedWorld,r=n?n.stageId:i.selectedStage;this.loadStage(s,r,!1,n),ke.playUi("wave"),he.emit("cmd:techUpdated"),he.emit("hud:slotsUpdated"),this.pushRadio("📤 Backup de save importado e restaurado com sucesso!","good")}),he.on("cmd:techUpdated",()=>{this.emitFullHudSync()}),he.on("cmd:resetCamera",()=>{this.resetCameraView()}),he.on("cmd:rotateStrafe",()=>{this.strafeAngle+=Math.PI/4,ke.playUi("click")}),he.on("cmd:toggleMute",()=>{const e=ke.toggleMute();he.emit("hud:mute",e)})]}saveCurrentMissionSnapshot(e=!1){if(this.gameOver||!e&&this.towers.length===0&&this.currentWave===0)return;const t=this.waveActive?Math.max(0,this.currentWave-1):this.currentWave,i=this.towers.map(s=>({defId:s.defId,col:s.col,row:s.row,level:s.level,hp:Math.ceil(s.hp),maxHp:s.maxHp,effectiveCost:s.effectiveCost,totalInvested:s.totalInvested,priority:s.priority,turretAngle:s.turretAngle,totalDamage:Math.round(s.totalDamage),kills:s.kills})),n={timestamp:Date.now(),worldId:this.currentWorldId,stageId:this.currentStageId,budget:Math.floor(this.budget),sessionWB:Math.floor(this.sessionWB),fobHp:Math.floor(this.fobHp),fobMaxHp:Math.floor(this.fobMaxHp),completedWave:t,totalWaves:this.totalWaves,totalKills:this.totalKills,totalDamage:Math.round(this.totalDamage),airSupportTimers:{a10:Math.max(0,Number(this.airSupport.a10.timer.toFixed(1))),hellfire:Math.max(0,Number(this.airSupport.hellfire.timer.toFixed(1))),b52:Math.max(0,Number(this.airSupport.b52.timer.toFixed(1)))},towers:i};Xe.saveActiveMission(n),he.emit("hud:autosaved",{timestamp:n.timestamp})}restoreMissionFromSnapshot(e){this.budget=e.budget,this.sessionWB=e.sessionWB,this.fobMaxHp=e.fobMaxHp||20,this.fobHp=Math.min(this.fobMaxHp,Math.max(1,e.fobHp)),this.currentWave=Math.min(this.totalWaves,Math.max(0,e.completedWave)),this.waveActive=!1,this.inIntermission=!1,this.wavePrepTimer=0,this.totalKills=e.totalKills||0,this.totalDamage=e.totalDamage||0,this.airSupport.a10.timer=e.airSupportTimers?.a10||0,this.airSupport.hellfire.timer=e.airSupportTimers?.hellfire||0,this.airSupport.b52.timer=e.airSupportTimers?.b52||0;for(const t of e.towers)Li[t.defId]&&this.pathfinder.isBuildable(t.col,t.row)&&this.spawnTowerOnGrid({col:t.col,row:t.row,towerId:t.defId,level:t.level,hp:t.hp,maxHp:t.maxHp,effectiveCost:t.effectiveCost,totalInvested:t.totalInvested,priority:t.priority,turretAngle:t.turretAngle,totalDamage:t.totalDamage,kills:t.kills});this.refreshGlobalBuffs(),this.rebuildActiveRouteLines()}loadStage(e,t,i=!1,n=null){this.currentWorldId=e,this.currentStageId=t,this.worldConfig=br(e),this.stageConfig=wr(e,t),this.enemyPool.releaseAll(),this.projectilePool.releaseAll(),this.textPool.releaseAll(),this.effects.releaseAll();for(const s of this.towers)this.cleanupTowerVisuals(s);for(const s of this.bossProjectiles)this.scene.remove(s.mesh);for(const s of this.fireZones)this.scene.remove(s.mesh);for(const s of this.activeFlyovers)this.scene.remove(s.jet);this.bossProjectiles=[],this.fireZones=[],this.activeFlyovers=[],this.pendingShots=[],this.towers=[],this.towerGrid=Array.from({length:St},()=>new Array(Ve).fill(null)),this.pathfinder.loadStageLayout(this.stageConfig),this.diorama&&(this.scene.remove(this.diorama.group),this.diorama.dispose()),this.diorama=s_(this.pathfinder.baseTerrain,this.worldConfig.biome,this.stageConfig.spawnPoints,this.stageConfig.fobPoint),this.scene.add(this.diorama.group),this.scene.background=new Ke(this.worldConfig.skyColor),this.scene.fog=new _r(this.worldConfig.fogColor,.0038),this.sunLight.color.setHex(this.worldConfig.sunColor),this.rimLight.color.setHex(this.worldConfig.rimColor),this.budget=this.stageConfig.startingBudget||750,this.sessionWB=0,this.fobHp=20,this.fobMaxHp=20,this.currentWave=0,this.totalWaves=this.stageConfig.waves.length,this.waveActive=!1,this.wavePrepTimer=0,this.inIntermission=!1,this.spawnQueue=[],this.waveElapsed=0,this.timeScale=1,this.lastNonZeroSpeed=1,this.gameOver=!1,this.victory=!1,this.totalKills=0,this.totalDamage=0,this.hasGlobalAesa=!1,this.airSupport.a10.timer=0,this.airSupport.hellfire.timer=0,this.airSupport.b52.timer=0,n&&n.worldId===e&&n.stageId===t&&this.restoreMissionFromSnapshot(n),this.cancelActiveTool(),this.selectTower(null),this.rebuildActiveRouteLines(),this.emitFullHudSync(),!i&&!n&&this.pushRadio(`OPERAÇÃO INICIADA: ${this.worldConfig.name} — Fase ${this.stageConfig.id}: ${this.stageConfig.title}.`,"good")}getEffectiveTowerCost(e){const t=Li[e];if(!t)return 9999;const i=Xe.getTechMultipliers(e);return Math.max(10,Math.round(t.cost*i.costMult))}getEffectiveTowerMaxHp(e,t){const i=Li[e];if(!i)return 500;const n=i.levels[t-1],s=n?.maxHp||i.maxHp||500,r=n?.maxHp?1:1+(t-1)*.35,o=Xe.getTechMultipliers(e);return Math.round(s*r*o.hpMult)}getEffectiveSpec(e){const t=e.def.levels[e.level-1],i=Xe.getTechMultipliers(e.defId);return{...t,damage:Math.round((t.damage||0)*i.damageMult),fireRate:(t.fireRate||0)*i.fireRateMult,burnDps:t.burnDps?Math.round(t.burnDps*i.damageMult):0}}selectBuildTool(e){if(ke.unlock(),!Xe.isTowerUnlocked(e)){const t=Li[e];this.pushRadio(`${t?.name||e} bloqueada! Abra "MAPA DE MUNDOS & ARSENAL" para desbloquear com WB$.`,"warn"),ke.playUi("error"),he.emit("hud:openArsenal");return}if(this.activeTool?.kind==="build"&&this.activeTool.towerId===e){this.cancelActiveTool();return}this.activeTool={kind:"build",towerId:e},this.controls.enableRotate=!0,this.selectTower(null),this.evaluatePlacementPreview(),ke.playUi("click"),he.emit("hud:tool",this.activeTool)}selectAirSupport(e){if(ke.unlock(),!Xe.isSupportUnlocked(e)){const i=dn[e];this.pushRadio(`${i?.name||e} bloqueado! Desbloqueie no Arsenal com WB$.`,"warn"),ke.playUi("error"),he.emit("hud:openArsenal");return}const t=this.airSupport[e];if(t){if(t.timer>0){this.pushRadio(`Suporte aéreo em recarga (${Math.ceil(t.timer)}s).`,"warn"),ke.playUi("error");return}if(this.budget<t.cost){this.pushRadio(`Orçamento insuficiente ($${t.cost} necessário).`,"warn"),ke.playUi("error");return}this.activeTool={kind:"support",supportId:e},this.controls.enableRotate=e!=="a10",this.selectTower(null),ke.playUi("click"),he.emit("hud:tool",this.activeTool)}}cancelActiveTool(){this.activeTool=null,this.strafeDragStart=null,this.lastCanPlace=null,this.controls.enableRotate=!0,this.ghostGroup.visible=!1,this.clearGroup(this.previewRouteGroup),this.clearGroup(this.supportReticleGroup),he.emit("hud:tool",null)}selectTower(e){this.selectedTower=e,e&&(this.activeTool=null,this.controls.enableRotate=!0,this.ghostGroup.visible=!1,this.clearGroup(this.previewRouteGroup),this.clearGroup(this.supportReticleGroup),he.emit("hud:tool",null)),this.rebuildSelectedTowerOverlay(),he.emit("hud:selectedTower",this.serializeTower(e))}evaluatePlacementPreview(){if(this.activeTool?.kind!=="build"){this.lastCanPlace=null,this.clearGroup(this.previewRouteGroup);return}const{col:e,row:t}=this.hoverTile;if(!this.pathfinder.inBounds(e,t)){this.lastCanPlace=null,this.clearGroup(this.previewRouteGroup);return}const i=this.enemyPool.active.filter(n=>n.domain==="ground");this.lastCanPlace=this.pathfinder.canPlaceAt(e,t,i),this.rebuildPreviewRouteLines()}spawnTowerOnGrid(e){const{col:t,row:i,towerId:n,level:s}=e,r=Li[n];this.pathfinder.placeStructure(t,i,!!r.isBarrier);const o=t*tt+tt*.5,l=i*tt+tt*.5,{x:c,z:h}=Xn(t,i),u=Ar(n,s);u.root.position.set(c,0,h),this.scene.add(u.root);const d=document.createElement("div");d.className="tower-hp-bar hidden";const f=document.createElement("span");f.className="tower-hp-label",f.textContent=r.shortName;const m=document.createElement("div");m.className="tower-hp-track";const x=document.createElement("div");x.className="tower-hp-fill",m.appendChild(x),d.append(f,m),this.overlayEl.appendChild(d);const p={id:`${n}_${Date.now()}_${Math.random()}`,defId:n,def:r,col:t,row:i,x:o,y:l,wx:c,wz:h,level:s,effectiveCost:e.effectiveCost,totalInvested:e.totalInvested,hp:Math.min(e.maxHp,e.hp),maxHp:e.maxHp,priority:e.priority,turretAngle:e.turretAngle,cooldownTimer:0,empTimer:0,empDisabledTimer:0,burnTimer:0,burnDps:0,smokeTimer:0,trophyTimer:0,interceptTimer:0,laserTargetId:0,laserFocusTime:0,laserTickAccum:0,laserBeams:[],muzzleFlashTimer:0,totalDamage:e.totalDamage,kills:e.kills,recoil:0,rig:u,hpEl:d,hpFillEl:x,hpLabelEl:f};if(u.turretPivot&&(u.turretPivot.rotation.y=p.turretAngle),n==="ew_crew"||n==="iron_dome"){const g=new V(this.ewPulseGeo,new Pt({color:n==="iron_dome"?3003583:11032055,side:Ot,transparent:!0,opacity:.35,depthWrite:!1}));g.rotation.x=-Math.PI/2,g.position.set(c,.1,h),this.scene.add(g),p.ewPulseMesh=g}return this.towers.push(p),this.towerGrid[i][t]=p,p}tryPlaceTower(e,t,i){const n=Li[i];if(!n||!Xe.isTowerUnlocked(i))return;const s=this.getEffectiveTowerCost(i);if(this.budget<s){this.pushRadio(`Orçamento insuficiente para ${n.shortName} ($${s}).`,"warn"),ke.playUi("error");return}const r=this.enemyPool.active.filter(h=>h.domain==="ground"),o=this.pathfinder.canPlaceAt(e,t,r);if(!o.ok){this.pushRadio(o.reason,"alert");const{x:h,z:u}=Xn(e,t);this.spawnFloatingText(h,2.2,u,"ROTA BLOQUEADA!","#ef4444"),ke.playUi("error");return}this.budget-=s;const l=this.getEffectiveTowerMaxHp(i,1),c=this.spawnTowerOnGrid({col:e,row:t,towerId:i,level:1,hp:l,maxHp:l,effectiveCost:s,totalInvested:s,priority:n.defaultPriority,turretAngle:Math.PI/2,totalDamage:0,kills:0});this.refreshGlobalBuffs(),this.rerouteActiveGroundEnemies(),this.rebuildActiveRouteLines(),this.evaluatePlacementPreview(),this.saveCurrentMissionSnapshot(),ke.playUi("build"),this.spawnFloatingText(c.wx,2.5,c.wz,`-$${s}`,"#facc15"),this.emitFullHudSync(),!n.isBarrier&&!this.shiftHeld&&(this.cancelActiveTool(),this.selectTower(c))}upgradeSelectedTower(){const e=this.selectedTower;if(!e||e.def.isBarrier)return;const t=e.def.levels[e.level];if(!t)return;if(this.budget<t.upgradeCost){this.pushRadio(`Falta orçamento para upgrade ($${t.upgradeCost}).`,"warn"),ke.playUi("error");return}const i=e.maxHp>0?e.hp/e.maxHp:1;this.budget-=t.upgradeCost,e.totalInvested+=t.upgradeCost,e.level+=1,e.maxHp=this.getEffectiveTowerMaxHp(e.defId,e.level),e.hp=Math.min(e.maxHp,Math.round(e.maxHp*Math.max(i,.55)+150)),this.scene.remove(e.rig.root),e.laserLine&&(this.scene.remove(e.laserLine),e.laserLine=void 0);for(const n of e.laserBeams)this.scene.remove(n);e.laserBeams=[],e.rig=Ar(e.defId,e.level),e.rig.root.position.set(e.wx,0,e.wz),e.rig.turretPivot&&(e.rig.turretPivot.rotation.y=e.turretAngle),this.scene.add(e.rig.root),this.refreshGlobalBuffs(),this.rebuildSelectedTowerOverlay(),this.saveCurrentMissionSnapshot(),ke.playUi("build"),this.spawnFloatingText(e.wx,3.2,e.wz,`UPGRADE NV${e.level}!`,"#38bdf8"),this.pushRadio(`${e.def.shortName} promovida para ${t.name}.`,"info"),he.emit("hud:selectedTower",this.serializeTower(e)),this.emitFullHudSync()}getRepairCost(e){if(!e||e.hp>=e.maxHp)return 0;const t=(e.maxHp-e.hp)/e.maxHp;return Math.max(10,Math.ceil(t*e.effectiveCost*.5))}repairSelectedTower(){const e=this.selectedTower;if(!e)return;if(e.hp>=e.maxHp){this.pushRadio(`${e.def.shortName} já está com integridade máxima.`,"info");return}const t=this.getRepairCost(e);if(this.budget<t){this.pushRadio(`Orçamento insuficiente para reparar ($${t} necessário).`,"warn"),ke.playUi("error");return}this.budget-=t,e.hp=e.maxHp,e.burnTimer=0,this.saveCurrentMissionSnapshot(),ke.playUi("repair"),this.effects.spawnSparks(e.wx,1.4,e.wz,6,3718648),this.spawnFloatingText(e.wx,2.8,e.wz,`REPARADO -$${t}`,"#38bdf8"),he.emit("hud:selectedTower",this.serializeTower(e)),this.emitFullHudSync()}sellSelectedTower(){const e=this.selectedTower;if(!e)return;const t=Math.floor(e.totalInvested*.75*Math.max(.4,e.hp/e.maxHp));this.budget+=t,this.removeTowerFromMap(e),this.saveCurrentMissionSnapshot(!0),ke.playUi("click"),this.spawnFloatingText(e.wx,2.4,e.wz,`+$${t}`,"#4ade80"),this.selectTower(null),this.emitFullHudSync()}cleanupTowerVisuals(e){this.scene.remove(e.rig.root),e.laserLine&&this.scene.remove(e.laserLine);for(const t of e.laserBeams)this.scene.remove(t);e.ewPulseMesh&&this.scene.remove(e.ewPulseMesh),e.hpEl.remove()}removeTowerFromMap(e){this.towerGrid[e.row][e.col]=null,this.towers=this.towers.filter(t=>t!==e),this.cleanupTowerVisuals(e),this.pathfinder.removeStructure(e.col,e.row),this.refreshGlobalBuffs(),this.rerouteActiveGroundEnemies(),this.rebuildActiveRouteLines(),this.selectedTower===e&&this.selectTower(null)}setSelectedTowerPriority(e){const t=this.selectedTower;!t||t.def.isBarrier||(t.priority=e,this.saveCurrentMissionSnapshot(),ke.playUi("click"),he.emit("hud:selectedTower",this.serializeTower(t)))}refreshGlobalBuffs(){this.hasGlobalAesa=this.towers.some(e=>e.defId==="patriot"&&e.def.levels[e.level-1].globalStealthReveal)}rerouteActiveGroundEnemies(){this.enemyPool.forEachActive(e=>{const t=e;if(t.domain!=="ground")return;const i=Math.max(0,Math.min(Ve-1,Math.floor(t.x/tt))),n=Math.max(0,Math.min(St-1,Math.floor(t.y/tt))),s=this.pathfinder.findPath(i,n);s&&s.length>0&&(t.path=s,t.pathIndex=s.length>1?1:0)})}setSpeed(e){e===0?this.timeScale=0:(this.timeScale=e,this.lastNonZeroSpeed=e),ke.playUi("click"),he.emit("hud:speed",this.timeScale)}togglePause(){this.setSpeed(this.timeScale===0?this.lastNonZeroSpeed:0)}startNextWave(e=!1){if(this.gameOver||this.victory||this.waveActive&&(this.spawnQueue.length>0||this.currentWave>=this.totalWaves)||this.currentWave>=this.totalWaves)return;if(e&&(this.inIntermission||this.waveActive&&this.spawnQueue.length===0)){const r=Math.round(25+Math.max(0,this.wavePrepTimer)*2.5);this.budget+=r,this.spawnFloatingText(0,4.5,-24,`BÔNUS ANTECIPADO +$${r}`,"#4ade80"),this.pushRadio(`Onda chamada antecipadamente! Bônus tático: +$${r}.`,"good")}this.currentWave+=1,this.inIntermission=!1,this.wavePrepTimer=0,this.waveActive=!0,this.waveElapsed=0;const t=this.stageConfig.waves[this.currentWave-1],i=this.pathfinder.spawnPoints,n=[];for(const r of t.groups)for(let o=0;o<r.count;o++)n.push({time:r.delay+o*r.interval,type:r.type,spawnIdx:o%i.length});n.sort((r,o)=>r.time-o.time),this.spawnQueue.push(...n),ke.playUi("wave");const s=t.groups.some(r=>En[r.type]?.isBoss);this.pushRadio(`ONDA ${this.currentWave}/${this.totalWaves}: ${t.title} — ${t.brief}`,s?"alert":"info"),this.saveCurrentMissionSnapshot(!0),this.emitFullHudSync()}spawnEnemy(e,t,i=null){const n=En[e];if(!n)return null;const r=this.stageConfig.waves[Math.max(0,this.currentWave-1)]?.hpMult||1,o=this.enemyPool.acquire();o.id=this.nextEnemyId++,o.type=e,o.domain=n.domain,o.armorClass=n.armorClass,o.maxHp=Math.round(n.maxHp*r),o.hp=o.maxHp,o.speed=n.speed,o.reward=n.reward,o.wbReward=n.wbReward||0,o.fobDamage=n.fobDamage,o.isMechanized=n.isMechanized,o.hasEra=n.hasEra,o.eraIntact=n.hasEra,o.hasAps=n.hasAps,o.apsCooldownTimer=0,o.apsMaxCooldown=n.apsCooldown||4,o.isStealth=n.isStealth,o.stealthRevealed=!1,o.isBoss=!!n.isBoss,o.isSubBoss=!!n.isSubBoss,o.isStageBoss=!!n.isStageBoss,o.isMegaBoss=!!n.isMegaBoss,o.slowImmune=!!n.slowImmune,o.dismountCount=n.dismountCount||0,o.radius=n.radius,o.ewSlow=0,o.ewDamageAmp=0,o.thermalVuln=0,o.ewDisabled=!1,o.stunTimer=0,o.hitFlashTimer=0,o.walkPhase=Math.random()*Math.PI*2,o.towerAttackTimer=n.towerAttack?Math.min(2,n.towerAttack.interval*.5):999,o.empPulseTimer=n.towerAttack?.empPulseInterval||999,o.periodicSpawnTimer=n.periodicSpawn?.interval||999,o.triggeredThresholds.clear();const l=this.pathfinder.spawnPoints[t%this.pathfinder.spawnPoints.length];if(i?(o.x=i.x,o.y=i.y):(o.x=l.col*tt+tt*.5,o.y=l.row*tt+tt*.5+(n.domain==="air"?(Math.random()-.5)*44:0)),o.rig=vd(e),this.scene.add(o.rig.root),n.domain==="ground"){const c=Math.max(0,Math.min(Ve-1,Math.floor(o.x/tt))),h=Math.max(0,Math.min(St-1,Math.floor(o.y/tt)));let u=this.pathfinder.findPath(c,h);!u&&i&&i.fallbackCol!==void 0&&(u=this.pathfinder.findPath(i.fallbackCol,i.fallbackRow),o.x=i.fallbackCol*tt+tt*.5,o.y=i.fallbackRow*tt+tt*.5),o.path=u||this.pathfinder.spawnPaths.get(l.id)||null,o.pathIndex=o.path&&o.path.length>1?1:0,o.distToFob=this.pathfinder.getDistanceToFobPx(o.x,o.y),o.angle=Math.PI/2,o.wy=0}else{o.path=null;const c=(this.pathfinder.fobPoint.col+.5)*tt,h=(this.pathfinder.fobPoint.row+.5)*tt;o.angle=Math.atan2(c-o.x,h-o.y),o.distToFob=Math.hypot(c-o.x,h-o.y),o.wy=h_(e)}return o.wx=Mi(o.x),o.wz=yi(o.y),o.rig.root.position.set(o.wx,0,o.wz),o.rig.hullGroup.rotation.y=o.angle,o.hpLabelEl.textContent=n.shortName,o.hpEl.classList.toggle("boss",o.isBoss),this.updateEnemyHealthBar(o),o.isMegaBoss?(ke.playUi("alert"),he.emit("hud:alert",{level:"mega",text:`🚨 ALERTA MÁXIMO: CHEFE SUPREMO NO SETOR (${n.name})!`})):o.isStageBoss?(ke.playUi("alert"),he.emit("hud:alert",{level:"boss",text:`🚨 ALERTA DE COMANDO: CHEFE DE FASE DETECTADO (${n.name})!`})):o.isSubBoss&&(ke.playUi("alert"),he.emit("hud:alert",{level:"subboss",text:`⚠️ ALERTA: SUB-CHEFE DETECTADO (${n.name})!`})),o}updateEnemyHealthBar(e){const t=Math.max(0,Math.min(1,e.hp/e.maxHp));e.hpFillEl.style.width=`${t*100}%`,e.hpFillEl.style.background=t>.55?"#22c55e":t>.25?"#f59e0b":"#ef4444",e.ewDisabled?(e.hpDotEl.style.background="#c084fc",e.hpDotEl.classList.remove("hidden")):e.hasAps&&e.apsCooldownTimer<=0?(e.hpDotEl.style.background="#22d3ee",e.hpDotEl.classList.remove("hidden")):e.hasEra&&e.eraIntact?(e.hpDotEl.style.background="#f97316",e.hpDotEl.classList.remove("hidden")):e.hpDotEl.classList.add("hidden")}executeA10Strafe(e,t,i){const n=this.airSupport.a10;if(this.budget<n.cost||n.timer>0)return;this.budget-=n.cost,n.timer=n.cooldown,this.cancelActiveTool();const s=Math.cos(i),r=Math.sin(i),o=460,l=e-s*(o*.5),c=t-r*(o*.5),h=e+s*(o*.5),u=t+r*(o*.5),d=_d(),f=l-s*620,m=c-r*620,x=Math.atan2(s,r);d.position.set(Mi(f),9.5,yi(m)),d.rotation.y=x,this.scene.add(d),this.activeFlyovers.push({kind:"a10",jet:d,x:f,y:m,dirX:s,dirY:r,yaw:x,speed:860,strafeStartX:l,strafeStartY:c,strafeEndX:h,strafeEndY:u,progress:0,burstTimer:0,startedSound:!1,totalDist:o+1240}),this.pushRadio("WARTHOG 1-1 EM APROXIMAÇÃO — GAU-8 30MM STRAFE RUN!","good"),this.emitFullHudSync()}executeHellfireStrike(e,t){const i=this.airSupport.hellfire;if(this.budget<i.cost||i.timer>0)return;this.budget-=i.cost,i.timer=i.cooldown,this.cancelActiveTool(),ke.playHellfireStrike();const n=this.projectilePool.acquire();n.kind="hellfire";const s=fn("hellfire");this.scene.add(s),n.mesh=s;const r=Mi(e),o=yi(t);n.startWx=r-18,n.startWy=32,n.startWz=o-24,n.wx=n.startWx,n.wy=n.startWy,n.wz=n.startWz,n.prevWx=n.wx,n.prevWy=n.wy,n.prevWz=n.wz,n.targetWx=r,n.targetWy=.2,n.targetWz=o,n.targetX=e,n.targetY=t,n.targetEnemy=null,n.targetId=0,n.damage=1050,n.damageType="heat",n.heavyMultiplier=1.75,n.tandemHeat=!0,n.splashRadius=115,n.burnDps=0,n.burnDuration=0,n.isMissile=!1,n.isTopAttack=!1,n.isArtillery=!0,n.flightTime=0,n.totalFlightTime=.44,n.sourceTower=null,n.smokeTimer=0,n.life=2,s.position.set(n.wx,n.wy,n.wz),s.lookAt(n.targetWx,n.targetWy,n.targetWz),this.pushRadio("REAPER 2-1: Míssil AGM-114 Hellfire lançado no designador laser!","good"),this.emitFullHudSync()}executeB52CarpetBomb(e,t){const i=this.airSupport.b52;if(this.budget<i.cost||i.timer>0)return;this.budget-=i.cost,i.timer=i.cooldown,this.cancelActiveTool();const n=1,s=0,r=760,o=e-r*.5,l=e+r*.5,c=o-580,h=Sd(),u=Math.PI/2;h.position.set(Mi(c),12.5,yi(t)),h.rotation.y=u,this.scene.add(h),this.activeFlyovers.push({kind:"b52",jet:h,x:c,y:t,dirX:n,dirY:s,yaw:u,speed:520,strafeStartX:o,strafeStartY:t,strafeEndX:l,strafeEndY:t,progress:0,burstTimer:0,startedSound:!1,totalDist:r+1160}),this.pushRadio("STRATOFORTRESS B-52 EM ROTA DE BOMBARDEIO EM TAPETE!","good"),this.emitFullHudSync()}updateCameraPan(e){let t=0,i=0;if((this.keysDown.has("w")||this.keysDown.has("arrowup"))&&(t+=1),(this.keysDown.has("s")||this.keysDown.has("arrowdown"))&&(t-=1),(this.keysDown.has("d")||this.keysDown.has("arrowright"))&&(i+=1),(this.keysDown.has("a")||this.keysDown.has("arrowleft"))&&(i-=1),t===0&&i===0)return;const n=46*e,s=new C;this.camera.getWorldDirection(s),s.y=0,s.normalize();const r=new C().crossVectors(s,new C(0,1,0)).normalize(),o=new C().addScaledVector(s,t*n).addScaledVector(r,i*n),l=this.controls.target.clone().add(o);l.x=oi.clamp(l.x,-Bi*.55,Bi*.55),l.z=oi.clamp(l.z,-ki*.55,ki*.55);const c=l.clone().sub(this.controls.target);this.controls.target.copy(l),this.camera.position.add(c)}updateWaveState(e){if(this.waveActive){for(this.waveElapsed+=e;this.spawnQueue.length>0&&this.spawnQueue[0].time<=this.waveElapsed;){const t=this.spawnQueue.shift();this.spawnEnemy(t.type,t.spawnIdx)}this.spawnQueue.length===0&&this.enemyPool.activeCount===0&&this.onWaveCleared()}else this.inIntermission&&this.currentWave<this.totalWaves&&(this.wavePrepTimer-=e,this.wavePrepTimer<=0&&this.startNextWave(!1))}onWaveCleared(){if(this.waveActive=!1,this.currentWave>=this.totalWaves){this.victory=!0,this.gameOver=!0;const t=this.stageConfig.clearBonusWB||60;this.sessionWB+=t;const i=Xe.markStageCompleted(this.currentWorldId,this.currentStageId,t);this.pushRadio(`VITÓRIA TOTAL! Fase ${this.stageConfig.id} concluída (+${t} WB$).`,"good"),he.emit("hud:gameover",{victory:!0,wave:this.currentWave,totalWaves:this.totalWaves,kills:this.totalKills,damage:this.totalDamage,wbEarned:this.sessionWB,newlyUnlocked:i,worldId:this.currentWorldId,stageId:this.currentStageId}),this.emitFullHudSync();return}const e=Math.min(180,Math.floor(this.budget*.05));e>0?(this.budget+=e,this.spawnFloatingText(0,4,-18,`JUROS +5%: +$${e}`,"#38bdf8"),this.pushRadio(`Onda ${this.currentWave} neutralizada! Juros táticos (+5%): +$${e}.`,"good")):this.pushRadio(`Onda ${this.currentWave} neutralizada! Prepare ou repare suas defesas.`,"good"),this.inIntermission=!0,this.wavePrepTimer=14,this.saveCurrentMissionSnapshot(!0),this.emitFullHudSync()}updateEwFields(e){this.enemyPool.forEachActive(t=>{const i=t;i.ewSlow=0,i.ewDamageAmp=0,i.ewDisabled=!1,i.stealthRevealed=this.hasGlobalAesa});for(const t of this.towers){if(t.defId!=="ew_crew"||t.empDisabledTimer>0)continue;const i=this.getEffectiveSpec(t);if(t.rig.radarPivots&&t.rig.radarPivots.forEach((s,r)=>{s.rotation.y+=e*(2.4+r*.7)}),t.rig.turretPivot&&(t.rig.turretPivot.rotation.y+=e*.8),t.rig.ewRings&&t.rig.ewRings.forEach((s,r)=>{const o=(this.elapsedReal*1.4+r*.5)%1;s.scale.setScalar(.75+o*1.35)}),t.ewPulseMesh){const s=i.range*Wt,r=this.elapsedReal*.75%1;t.ewPulseMesh.scale.setScalar(Math.max(.05,r*s)),t.ewPulseMesh.material.opacity=.42*(1-r)}let n=!1;i.empInterval>0&&(t.empTimer+=e,t.empTimer>=i.empInterval&&(t.empTimer=0,n=!0,ke.playShot("emp"),this.effects.spawnShockwave(t.wx,.25,t.wz,i.range*Wt,12616956))),this.enemyPool.forEachActive(s=>{const r=s;Math.hypot(r.x-t.x,r.y-t.y)<=i.range&&(r.slowImmune||(r.ewSlow=Math.max(r.ewSlow,i.slowFactor)),r.ewDamageAmp=Math.max(r.ewDamageAmp,i.damageAmp),r.ewDisabled=!0,r.stealthRevealed=!0,n&&r.isMechanized&&(r.stunTimer=Math.max(r.stunTimer,i.empStunDuration),this.applyDamageToEnemy(r,i.damage,"emp",t,{allowApsIntercept:!1}),this.spawnFloatingText(r.wx,2.5,r.wz,"EMP STUN!","#e879f9")))})}}spawnFireZone(e,t,i,n,s){if(this.fireZones.length>=28){const c=this.fireZones.shift();this.scene.remove(c.mesh)}const r=Mi(e),o=yi(t),l=new V(this.fireZoneGeo,this.fireZoneMat);l.rotation.x=-Math.PI/2,l.position.set(r,.07,o),l.scale.setScalar(i*Wt),this.scene.add(l),this.fireZones.push({x:e,y:t,wx:r,wz:o,radius:i,dps:n,life:s,maxLife:s,tickAccum:0,smokeAccum:0,mesh:l})}updateFireZones(e){for(let t=this.fireZones.length-1;t>=0;t--){const i=this.fireZones[t];if(i.life-=e,i.life<=0){this.scene.remove(i.mesh),this.fireZones.splice(t,1);continue}const n=.88+Math.sin(this.elapsedReal*9+t)*.12;if(i.mesh.scale.setScalar(i.radius*Wt*n),i.smokeAccum+=e,i.smokeAccum>=.18){i.smokeAccum=0;const s=Math.random()*Math.PI*2,r=Math.random()*i.radius*Wt*.65;this.effects.spawnSmokePuff(i.wx+Math.cos(s)*r,.25,i.wz+Math.sin(s)*r,16347926,.45)}if(i.tickAccum+=e,i.tickAccum>=.25){const s=i.tickAccum;i.tickAccum=0;const r=i.radius*i.radius;this.enemyPool.forEachActive(o=>{const l=o;if(l.domain!=="ground")return;(l.x-i.x)**2+(l.y-i.y)**2<=r&&(l.eraIntact=!1,this.applyDamageToEnemy(l,i.dps*s,"thermobaric",null,{allowApsIntercept:!1}))})}}}updateEnemies(e){const t=(this.pathfinder.fobPoint.col+.5)*tt,i=(this.pathfinder.fobPoint.row+.5)*tt;this.clearGroup(this.stealthLockGroup),this.enemyPool.forEachActive(n=>{const s=n,r=En[s.type];if(s.apsCooldownTimer>0&&(s.apsCooldownTimer=Math.max(0,s.apsCooldownTimer-e)),s.hitFlashTimer>0&&(s.hitFlashTimer-=e,s.hitFlashTimer<=0&&s.rig&&s.rig.hitMeshes.forEach(l=>{const c=l.material;c&&c._origEmissive!==void 0&&c.emissive.setHex(c._origEmissive)})),s.rig){if(s.rig.ewRing&&(s.rig.ewRing.visible=s.ewDisabled),s.rig.apsShield&&(s.rig.apsShield.visible=s.hasAps&&s.apsCooldownTimer<=0&&!s.ewDisabled,s.rig.apsShield.rotation.y+=e*1.2),s.rig.eraMeshes&&s.hasEra&&s.rig.eraMeshes.forEach(l=>l.visible=s.eraIntact),s.isStealth&&s.rig.stealthMaterials){const l=s.stealthRevealed?.96:.3;if(s.rig.stealthMaterials.forEach(c=>c.opacity=l),s.stealthRevealed){const c=this.createCircleLoop(4,2282478,.85);c.position.set(s.wx,s.wy,s.wz),c.rotation.y=Math.PI/4+this.elapsedReal*2,c.scale.setScalar(2.4),this.stealthLockGroup.add(c)}}if(s.rig.rotors)if(s.type==="heli"||s.type==="subboss_ka50")s.rig.rotors[0].rotation.y+=e*24,s.rig.rotors[1]&&(s.rig.rotors[1].rotation.y-=e*24);else if(s.type==="drone_swarm")for(const l of s.rig.rotors)l.rotation.z+=e*34;else if(s.type==="megaboss_kirov_airship")for(const l of s.rig.rotors)l.rotation.y+=e*18;else s.isBoss&&!s.ewDisabled&&s.rig.rotors[0]&&(s.rig.rotors[0].rotation.y+=e*5)}if(s.stunTimer>0){s.stunTimer-=e,this.updateEnemyHealthBar(s);return}if(r?.periodicSpawn&&s.rig&&(s.periodicSpawnTimer-=e,s.periodicSpawnTimer<=0)){s.periodicSpawnTimer=r.periodicSpawn.interval,this.spawnFloatingText(s.wx,s.wy+3,s.wz,"DRONES LANÇADOS!","#facc15");const l=Math.max(0,Math.min(Ve-1,Math.floor(s.x/tt))),c=Math.max(0,Math.min(St-1,Math.floor(s.y/tt)));for(let h=0;h<r.periodicSpawn.count;h++)this.spawnEnemy(r.periodicSpawn.type,0,{x:Math.max(16,Math.min(nr-16,s.x+(Math.random()-.5)*42)),y:Math.max(16,Math.min(sr-16,s.y+(Math.random()-.5)*42)),fallbackCol:l,fallbackRow:c})}if(r?.towerAttack&&this.towers.length>0){const l=r.towerAttack;if(s.towerAttackTimer-=e,s.towerAttackTimer<=0){const c=this.findTowerTargetsForBoss(s,l.range,l.targets||1,!!l.preferAa);if(c.length>0){s.towerAttackTimer=l.interval;const h=c[0];if(s.rig?.turretPivot){const u=Math.atan2(h.x-s.x,h.y-s.y)-s.angle;s.rig.turretPivot.rotation.y=u}for(const u of c)this.spawnBossProjectile(s,u,l);this.elapsedReal-this.lastTowerAttackWarnTime>6.5&&(this.lastTowerAttackWarnTime=this.elapsedReal,he.emit("hud:alert",{level:"warn",text:`⚠️ ALERTA DE DEFESA: ${r.shortName} está atacando ${h.def.shortName}!`}))}else s.towerAttackTimer=.6}l.empPulseInterval&&(s.empPulseTimer-=e,s.empPulseTimer<=0&&(s.empPulseTimer=l.empPulseInterval,this.triggerBossEmpPulse(s,l.empPulseRange||250,l.empDisableDuration||2)))}const o=s.speed*(1-s.ewSlow);if(s.domain==="ground"&&s.rig?.wheels)for(const l of s.rig.wheels)l.rotation.x+=e*o*.14;if(s.domain==="ground"){if(!s.path||s.pathIndex>=s.path.length){const l=Math.max(0,Math.min(Ve-1,Math.floor(s.x/tt))),c=Math.max(0,Math.min(St-1,Math.floor(s.y/tt)));s.path=this.pathfinder.findPath(l,c),s.pathIndex=s.path&&s.path.length>1?1:0}if(s.path&&s.pathIndex<s.path.length){const l=s.path[s.pathIndex],c=l.x-s.x,h=l.y-s.y,u=Math.hypot(c,h);if(u<=o*e+2)s.x=l.x,s.y=l.y,s.pathIndex+=1;else{const d=Math.atan2(c,h);s.angle=vo(s.angle,d,10*e),s.x+=c/u*o*e,s.y+=h/u*o*e}}s.distToFob=this.pathfinder.getDistanceToFobPx(s.x,s.y)}else{const l=t-s.x,c=i-s.y,h=Math.hypot(l,c);if(h>1){const u=Math.atan2(l,c);s.angle=vo(s.angle,u,5*e),s.x+=l/h*o*e,s.y+=c/h*o*e}s.distToFob=h}if(s.wx=Mi(s.x),s.wz=yi(s.y),s.rig&&(s.rig.root.position.set(s.wx,0,s.wz),s.rig.hullGroup.rotation.y=s.angle,s.rig.turretPivot&&!r?.towerAttack&&(s.rig.turretPivot.rotation.y=Math.sin(this.elapsedReal*1.4+s.id)*.25),s.rig.legs&&s.rig.legs.length>0)){s.walkPhase+=e*o*.16;for(let l=0;l<s.rig.legs.length;l+=2){const c=Math.sin(s.walkPhase+l)*.55;s.rig.legs[l].rotation.x=c,s.rig.legs[l+1]&&(s.rig.legs[l+1].rotation.x=-c)}}this.updateEnemyHealthBar(s),Math.hypot(t-s.x,i-s.y)<22&&this.onEnemyBreachFob(s)})}findTowerTargetsForBoss(e,t,i,n){const s=t*t,r=[];for(const o of this.towers){const l=(o.x-e.x)**2+(o.y-e.y)**2;if(l>s)continue;let c=l;o.def.isTauntTank?c-=1e8:n&&(o.def.domain==="air"||o.def.domain==="both")?c-=1e6:o.def.isBarrier&&(c+=1e7),r.push({tower:o,score:c})}return r.sort((o,l)=>o.score-l.score),r.slice(0,i).map(o=>o.tower)}triggerBossEmpPulse(e,t,i){ke.playShot("emp"),this.effects.spawnShockwave(e.wx,.4,e.wz,t*Wt,11032055),this.spawnFloatingText(e.wx,3.4,e.wz,"PULSO EMP HOSTIL!","#c084fc");for(const n of this.towers){if(n.def.isBarrier||Math.hypot(n.x-e.x,n.y-e.y)>t)continue;this.towers.some(o=>o!==n&&o.empDisabledTimer<=0&&(o.def.isIronDome||o.defId==="ew_crew")&&Math.hypot(o.x-n.x,o.y-n.y)<=o.def.levels[o.level-1].range)?this.spawnFloatingText(n.wx,2.5,n.wz,"EMP BLOQUEADO!","#2dd4bf"):(n.empDisabledTimer=Math.max(n.empDisabledTimer,i),this.spawnFloatingText(n.wx,2.5,n.wz,"EMP DESATIVADA!","#c084fc"))}}spawnBossProjectile(e,t,i){const n=e.wx,s=Math.max(1.4,e.wy+.8),r=e.wz,o=t.wx,l=1,c=t.wz;let h;i.projectileKind==="boss_autocannon"?(h=new V(this.bulletGeo,this.bossBulletMat),h.scale.set(1.6,1.6,1.5)):i.projectileKind==="boss_shell"?(h=new V(this.shellGeo,this.bossShellMat),h.scale.setScalar(1.35)):h=fn("boss_missile"),h.position.set(n,s,r),this.scene.add(h),ke.playShot(i.projectileKind==="boss_autocannon"?"autocannon":"missile"),this.effects.spawnSparks(n,s,r,3,15680580);const u=Math.hypot(t.x-e.x,t.y-e.y),d=i.projectileKind==="boss_autocannon"?620:340;this.bossProjectiles.push({kind:i.projectileKind,mesh:h,wx:n,wy:s,wz:r,startWx:n,startWy:s,startWz:r,targetWx:o,targetWy:l,targetWz:c,targetTower:t,targetX:t.x,targetY:t.y,damage:i.damage,splashRadius:i.splashRadius||0,burnDps:i.burnDps||0,burnDuration:i.burnDuration||0,flightTime:0,totalFlightTime:Math.max(.32,u/d),smokeTimer:0,alive:!0})}updateBossProjectiles(e){for(let t=this.bossProjectiles.length-1;t>=0;t--){const i=this.bossProjectiles[t];if(!i.alive){this.scene.remove(i.mesh),this.bossProjectiles.splice(t,1);continue}i.flightTime+=e;const n=Math.min(1,i.flightTime/i.totalFlightTime),s=i.wx,r=i.wy,o=i.wz,l=i.kind==="boss_autocannon"?.5:5.5;if(i.wx=oi.lerp(i.startWx,i.targetWx,n),i.wz=oi.lerp(i.startWz,i.targetWz,n),i.wy=oi.lerp(i.startWy,i.targetWy,n)+Math.sin(n*Math.PI)*l,i.mesh.position.set(i.wx,i.wy,i.wz),i.mesh.lookAt(i.wx+(i.wx-s)+1e-4,i.wy+(i.wy-r),i.wz+(i.wz-o)),i.kind!=="boss_autocannon"&&(i.smokeTimer+=e,i.smokeTimer>=.03&&(i.smokeTimer=0,this.effects.spawnSmokePuff(i.wx,i.wy,i.wz,16557477,.4))),n>.25&&n<.92&&this.tryInterceptBossProjectile(i)){i.alive=!1,this.scene.remove(i.mesh),this.bossProjectiles.splice(t,1);continue}n>=1&&(this.detonateBossProjectile(i),i.alive=!1,this.scene.remove(i.mesh),this.bossProjectiles.splice(t,1))}}tryInterceptBossProjectile(e){const t=Wn(e.wx),i=Vn(e.wz);for(const s of this.towers){if(!s.def.isIronDome||s.empDisabledTimer>0||s.interceptTimer>0)continue;const r=this.getEffectiveSpec(s),o=Math.hypot(e.targetX-s.x,e.targetY-s.y),l=Math.hypot(t-s.x,i-s.y);if(o<=r.range||l<=r.range)return s.interceptTimer=r.interceptCooldown,s.muzzleFlashTimer=.08,ke.playApsIntercept(),this.effects.spawnExplosion(e.wx,e.wy,e.wz,.65,3003583,!1),this.spawnFloatingText(e.wx,e.wy+1.5,e.wz,"IRON DOME INTERCEPT!","#2dd4bf"),!0}const n=e.targetTower;if(n&&n.hp>0&&n.defId==="abrams_pit"&&n.empDisabledTimer<=0){const s=n.def.levels[n.level-1];if(s.trophyCooldown>0&&n.trophyTimer<=0&&Math.hypot(t-n.x,i-n.y)<=65)return n.trophyTimer=s.trophyCooldown,ke.playApsIntercept(),this.effects.spawnShockwave(n.wx,1.2,n.wz,2.2,8702998),this.spawnFloatingText(n.wx,2.8,n.wz,"TROPHY APS!","#a3e635"),!0}return!1}detonateBossProjectile(e){if(this.effects.spawnExplosion(e.targetWx,.9,e.targetWz,e.splashRadius>40?1.15:.7,15680580,!0),ke.playExplosion(e.splashRadius>40?.9:.55),e.splashRadius>0){const t=e.splashRadius*e.splashRadius,i=[...this.towers];for(const n of i){const s=(n.x-e.targetX)**2+(n.y-e.targetY)**2;if(s<=t){const r=Math.sqrt(s),o=n===e.targetTower?1:Math.max(.45,1-r/e.splashRadius*.55);this.damageTower(n,e.damage*o,e.burnDps,e.burnDuration)}}}else this.towers.includes(e.targetTower)&&this.damageTower(e.targetTower,e.damage,e.burnDps,e.burnDuration)}damageTower(e,t,i=0,n=0){if(!this.towers.includes(e)||e.hp<=0)return;let s=0;for(const o of this.towers){if(!o.def.isIronDome||o.empDisabledTimer>0)continue;const l=o.def.levels[o.level-1];l.towerShieldReduction>0&&Math.hypot(o.x-e.x,o.y-e.y)<=l.range&&(s=Math.max(s,l.towerShieldReduction))}const r=Math.max(1,Math.round(t*(1-s)));e.hp-=r,i>0&&n>0&&(e.burnDps=Math.max(e.burnDps,i),e.burnTimer=Math.max(e.burnTimer,n)),Math.random()<.75&&this.spawnFloatingText(e.wx,2.6,e.wz,`-${r} HP`,"#fb923c"),e.hp<=0?(e.hp=0,this.effects.spawnExplosion(e.wx,1,e.wz,1.65,15680580,!0),this.effects.spawnCrater(e.wx,e.wz,1.2),ke.playExplosion(1.35),this.addTrauma(.42),this.triggerFlashLight(e.wx,2.2,e.wz,16739115,6,.14),this.pushRadio(`🚨 DEFESA DESTRUÍDA! ${e.def.name} caiu em combate!`,"alert"),this.spawnFloatingText(e.wx,3,e.wz,"TORRE DESTRUÍDA!","#ef4444"),this.removeTowerFromMap(e),this.saveCurrentMissionSnapshot(!0)):this.selectedTower===e&&he.emit("hud:selectedTower",this.serializeTower(e))}onEnemyBreachFob(e){this.fobHp=Math.max(0,this.fobHp-e.fobDamage),this.addTrauma(.38),ke.playExplosion(1.1),this.spawnFloatingText(e.wx,2.5,e.wz,`-${e.fobDamage} FOB!`,"#ef4444"),this.pushRadio(`FOB ATINGIDA por ${e.type.toUpperCase()} (-${e.fobDamage} Integridade)!`,"alert"),this.enemyPool.release(e),this.fobHp<=0&&!this.gameOver&&(this.gameOver=!0,this.victory=!1,Xe.clearActiveMission(),this.pushRadio("FOB DESTRUÍDA! Linha de defesa rompida.","alert"),he.emit("hud:gameover",{victory:!1,wave:this.currentWave,totalWaves:this.totalWaves,kills:this.totalKills,damage:this.totalDamage,wbEarned:this.sessionWB,newlyUnlocked:null,worldId:this.currentWorldId,stageId:this.currentStageId})),this.emitFullHudSync()}updatePendingShots(e){for(let t=this.pendingShots.length-1;t>=0;t--){const i=this.pendingShots[t];if(i.delay-=e,i.delay<=0&&(this.pendingShots.splice(t,1),i.tower&&this.towers.includes(i.tower))){let n=i.target&&i.target._pooledActive&&i.target.id===i.targetId?i.target:null;n||(n=this.findTargetsInRange(i.tower,i.spec)[0]||null),n?this.fireTowerProjectile(i.tower,n,i.spec,i.offsetAngle||0):this.fireTowerProjectile(i.tower,{x:i.fallbackX,y:i.fallbackY,id:0,wy:.5},i.spec,i.offsetAngle||0)}}}updateTowers(e){for(const t of this.towers){if(t.burnTimer>0){t.burnTimer-=e;const l=t.burnDps*e;if(t.hp-=l,t.hp<=0){this.damageTower(t,1);continue}}if(t.hp<t.maxHp*.4&&(t.smokeTimer-=e,t.smokeTimer<=0&&(t.smokeTimer=.28,this.effects.spawnSmokePuff(t.wx,1.35,t.wz,2237996,.55))),t.empDisabledTimer>0){t.empDisabledTimer=Math.max(0,t.empDisabledTimer-e);for(const l of t.laserBeams)l.visible=!1;t.laserLine&&(t.laserLine.visible=!1),t.rig.muzzleFlashMesh&&(t.rig.muzzleFlashMesh.visible=!1);continue}const i=this.getEffectiveSpec(t);if(t.trophyTimer=Math.max(0,t.trophyTimer-e),t.interceptTimer=Math.max(0,t.interceptTimer-e),t.def.isIronDome){if(t.rig.radarPivots&&t.rig.radarPivots.forEach(l=>l.rotation.y+=e*3),t.rig.ewRings&&t.rig.ewRings.forEach(l=>{const c=this.elapsedReal*1.2%1;l.scale.setScalar(.85+c*.45)}),t.ewPulseMesh){const l=i.range*Wt,c=this.elapsedReal*.65%1;t.ewPulseMesh.scale.setScalar(Math.max(.05,c*l)),t.ewPulseMesh.material.opacity=.3*(1-c)}if(i.healPerSec>0)for(const l of this.towers)l.hp<l.maxHp&&Math.hypot(l.x-t.x,l.y-t.y)<=i.range&&(l.hp=Math.min(l.maxHp,l.hp+i.healPerSec*e))}if(t.def.isBarrier||t.def.isSupportAura)continue;if(t.cooldownTimer=Math.max(0,t.cooldownTimer-e),t.recoil=Math.max(0,t.recoil-e*1.4),t.muzzleFlashTimer>0?(t.muzzleFlashTimer-=e,t.rig.muzzleFlashMesh&&(t.rig.muzzleFlashMesh.visible=t.muzzleFlashTimer>0,t.muzzleFlashTimer>0&&(t.rig.muzzleFlashMesh.rotation.z+=e*45))):t.rig.muzzleFlashMesh&&t.rig.muzzleFlashMesh.visible&&(t.rig.muzzleFlashMesh.visible=!1),t.rig.missileCaps&&i.fireRate>0){const l=t.cooldownTimer<1/i.fireRate-.35;t.rig.missileCaps.forEach(c=>c.visible=l)}t.rig.barrelPivot&&(t.rig.barrelPivot._baseZ===void 0&&(t.rig.barrelPivot._baseZ=t.rig.barrelPivot.position.z),t.rig.barrelPivot.position.z=t.rig.barrelPivot._baseZ-t.recoil);const n=this.findTargetsInRange(t,i);if(n.length===0){t.laserLine&&(t.laserLine.visible=!1);for(const l of t.laserBeams)l.visible=!1;t.laserTargetId=0,t.laserFocusTime=0;continue}t.rig.gatlingPivot&&(t.rig.gatlingPivot.rotation.z+=e*28);const s=n[0],r=Math.atan2(s.x-t.x,s.y-t.y);if(t.turretAngle=vo(t.turretAngle,r,(t.def.turnRate||8)*e),t.rig.turretPivot&&(t.rig.turretPivot.rotation.y=t.turretAngle),i.laserSight&&t.rig.muzzlePoint){const l=new C;t.rig.muzzlePoint.getWorldPosition(l);const c=new C(s.wx,s.wy+.6,s.wz);if(t.laserLine){const h=t.laserLine.geometry.getAttribute("position");h.setXYZ(0,l.x,l.y,l.z),h.setXYZ(1,c.x,c.y,c.z),h.needsUpdate=!0}else{const h=new Ht().setFromPoints([l,c]);t.laserLine=new Qs(h,new gs({color:15680580,transparent:!0,opacity:.72})),this.scene.add(t.laserLine)}t.laserLine.visible=!0}else t.laserLine&&(t.laserLine.visible=!1);const o=c_(r,t.turretAngle);if(t.def.isContinuousLaser){this.updateHeliosLaserTower(t,i,n,e,o<.55);continue}t.cooldownTimer<=0&&o<.45&&(t.cooldownTimer=1/i.fireRate,this.triggerTowerAttack(t,i,n))}}updateHeliosLaserTower(e,t,i,n,s){if(!s){for(const h of e.laserBeams)h.visible=!1;e.laserFocusTime=0;return}const r=i[0];e.laserTargetId===r.id?e.laserFocusTime+=n:(e.laserTargetId=r.id,e.laserFocusTime=0);const o=1+Math.min(t.maxRampBonus||2,e.laserFocusTime*(t.rampRate||.45)),l=Math.min(t.beamTargets||1,i.length),c=this.getTowerMuzzleWorld(e);for(;e.laserBeams.length<l;){const h=new V(this.laserBeamGeo,this.laserBeamMat);this.scene.add(h),e.laserBeams.push(h)}for(let h=0;h<e.laserBeams.length;h++){const u=e.laserBeams[h];if(h>=l){u.visible=!1;continue}const d=i[h],f=new C(d.wx,d.wy+.7,d.wz),m=c.distanceTo(f);u.position.copy(c).lerp(f,.5),u.lookAt(f),u.rotateX(Math.PI/2);const x=h===0?.75+o*.45:.85;u.scale.set(x,m,x),u.visible=!0,t.thermalVuln>0&&(d.thermalVuln=Math.max(d.thermalVuln,t.thermalVuln))}if(ke.playShot("laser"),e.laserTickAccum+=n,e.laserTickAccum>=.1){const h=e.laserTickAccum;e.laserTickAccum=0;for(let u=0;u<l;u++){const d=i[u],f=u===0?o:1,m=t.damage*f*h;this.applyDamageToEnemy(d,m,"laser",e,{allowApsIntercept:!1}),this.effects.spawnSparks(d.wx,d.wy+.7,d.wz,1,3718648)}}}findTargetsInRange(e,t){const i=[],n=t.range*t.range,s=(t.minRange||0)*(t.minRange||0);this.enemyPool.forEachActive(o=>{const l=o;if(l.isStealth&&!l.stealthRevealed||e.def.domain==="ground"&&l.domain!=="ground"||e.def.domain==="air"&&l.domain!=="air")return;const c=l.x-e.x,h=l.y-e.y,u=c*c+h*h;u<=n&&u>=s&&i.push(l)});const r=e.priority;return i.sort((o,l)=>r==="air_first"?o.domain!==l.domain?o.domain==="air"?-1:1:o.distToFob-l.distToFob:r==="last"?l.distToFob-o.distToFob:r==="strongest"?l.hp-o.hp||o.distToFob-l.distToFob:r==="weakest"&&o.hp-l.hp||o.distToFob-l.distToFob),i}getTowerMuzzleWorld(e){if(e.rig.muzzlePoint){const t=new C;return e.rig.muzzlePoint.getWorldPosition(t),t}return new C(e.wx+Math.sin(e.turretAngle)*1.4,1.3,e.wz+Math.cos(e.turretAngle)*1.4)}triggerTowerAttack(e,t,i){const n=i[0],s=this.getTowerMuzzleWorld(e);if(e.defId==="m2_bunker")e.recoil=.16,e.muzzleFlashTimer=.045,ke.playShot(e.level>=2?"ciws":"mg50"),this.effects.spawnSparks(s.x,s.y,s.z,2,16707722),this.fireTowerProjectile(e,n,t,0);else if(e.defId==="bushmaster")e.recoil=.28,e.muzzleFlashTimer=.065,ke.playShot("autocannon"),this.effects.spawnSparks(s.x,s.y,s.z,3,16486972),this.fireTowerProjectile(e,n,t,0);else if(e.defId==="abrams_pit")e.recoil=.44,e.muzzleFlashTimer=.11,ke.playShot("howitzer"),this.addTrauma(.16),this.triggerFlashLight(s.x,s.y,s.z,16755021,5.5,.08),this.effects.spawnExplosion(s.x,s.y,s.z,.5,16436245,!1),this.fireTowerProjectile(e,n,t,0);else if(e.defId==="javelin"){e.recoil=.18,e.muzzleFlashTimer=.08,ke.playShot("missile"),this.effects.spawnSmokePuff(s.x,s.y,s.z,13358561,.7);const r=t.salvoCount||1;for(let o=0;o<r;o++){const l=i[o%i.length],c=r===2?o===0?-.18:.18:0;this.fireTowerProjectile(e,l,t,c)}}else if(e.defId==="phalanx")e.recoil=.1,e.muzzleFlashTimer=.04,ke.playShot("ciws"),this.effects.spawnSparks(s.x,s.y,s.z,1,8246268),this.fireTowerProjectile(e,n,t,(Math.random()-.5)*.06);else if(e.defId==="howitzer"||e.defId==="tos1_mlrs"){e.recoil=.42,e.muzzleFlashTimer=.12,ke.playShot(e.defId==="tos1_mlrs"?"missile":"howitzer"),this.addTrauma(e.level===3?.32:.2),this.triggerFlashLight(s.x,s.y,s.z,16743202,6,.1),this.effects.spawnExplosion(s.x,s.y,s.z,.55,16347926,!1);const r=t.salvoCount||1;for(let o=0;o<r;o++)if(o===0)this.fireTowerProjectile(e,n,t,0);else{const l=i[o%i.length];this.pendingShots.push({delay:o*.085,tower:e,target:l,targetId:l.id,fallbackX:l.x,fallbackY:l.y,spec:t,offsetAngle:(Math.random()-.5)*.16})}}else if(e.defId==="patriot"||e.defId==="iron_dome"){e.recoil=.16,e.muzzleFlashTimer=.09,ke.playShot("missile"),this.effects.spawnSmokePuff(s.x,s.y,s.z,14870768,.75);const r=t.multiTargets||1;for(let o=0;o<Math.min(r,i.length);o++)this.fireTowerProjectile(e,i[o],t,(o-1)*.14)}}fireTowerProjectile(e,t,i,n=0){const s=this.projectilePool.acquire(),r=this.getTowerMuzzleWorld(e),o=e.turretAngle+n;if(s.wx=r.x,s.wy=r.y,s.wz=r.z,s.prevWx=r.x,s.prevWy=r.y,s.prevWz=r.z,s.startWx=r.x,s.startWy=r.y,s.startWz=r.z,s.x=Wn(r.x),s.y=Vn(r.z),s.sourceTower=e,s.damage=i.damage,s.damageType=i.damageType,s.armorPierce=i.armorPierce||0,s.armorIgnore=i.armorIgnore||0,s.heavyMultiplier=i.heavyMultiplier||1,s.tandemHeat=!!i.tandemHeat,s.critChance=i.critChance||0,s.splashRadius=i.splashRadius||0,s.burnDps=i.burnDps||0,s.burnDuration=i.burnDuration||0,s.speed=e.def.projectileSpeed||800,s.smokeTimer=0,s.flightTime=0,e.defId==="javelin"){s.kind="missile",s.isMissile=!0,s.isTopAttack=!0,s.isArtillery=!1,s.targetEnemy=t&&t.id?t:null,s.targetId=t?t.id:0,s.targetX=t?t.x:s.x+Math.sin(o)*180,s.targetY=t?t.y:s.y+Math.cos(o)*180,s.targetWx=Mi(s.targetX),s.targetWy=.7,s.targetWz=yi(s.targetY);const l=Math.hypot(s.targetX-s.x,s.targetY-s.y);s.totalFlightTime=Math.max(.45,l/s.speed),s.life=s.totalFlightTime+.5;const c=fn("javelin");this.scene.add(c),s.mesh=c,c.position.set(s.wx,s.wy,s.wz)}else if(e.defId==="patriot"||e.defId==="iron_dome"){s.kind="sam",s.isMissile=!0,s.isTopAttack=!1,s.isArtillery=!1,s.targetEnemy=t&&t.id?t:null,s.targetId=t?t.id:0,s.targetX=t?t.x:s.x+Math.sin(o)*200,s.targetY=t?t.y:s.y+Math.cos(o)*200,s.targetWx=Mi(s.targetX),s.targetWy=t?.wy||1.2,s.targetWz=yi(s.targetY);const l=s.speed*Wt;s.vx=Math.sin(o)*l*.75,s.vy=l*.65,s.vz=Math.cos(o)*l*.75,s.life=3.5;const c=fn("patriot");this.scene.add(c),s.mesh=c,c.position.set(s.wx,s.wy,s.wz)}else if(e.defId==="howitzer"||e.defId==="tos1_mlrs"){s.kind=i.damageType==="he_rocket"||i.damageType==="thermobaric"?"rocket":"shell",s.isMissile=s.kind==="rocket",s.isTopAttack=!1,s.isArtillery=!0,s.targetEnemy=null,s.targetId=0;const l=i.scatter||0,c=Math.random()*Math.PI*2,h=Math.random()*l,u=(t?t.x:s.x+Math.sin(o)*260)+Math.cos(c)*h,d=(t?t.y:s.y+Math.cos(o)*260)+Math.sin(c)*h;s.targetX=Math.max(16,Math.min(nr-16,u)),s.targetY=Math.max(16,Math.min(sr-16,d)),s.targetWx=Mi(s.targetX),s.targetWy=.2,s.targetWz=yi(s.targetY);const f=Math.hypot(s.targetX-s.x,s.targetY-s.y);if(s.totalFlightTime=Math.max(.45,f/s.speed),s.life=s.totalFlightTime+.15,s.kind==="rocket"){const m=fn("rocket");this.scene.add(m),s.mesh=m}else{const m=new V(this.shellGeo,this.shellMat);this.scene.add(m),s.mesh=m}s.mesh.position.set(s.wx,s.wy,s.wz)}else{s.kind=e.defId==="bushmaster"||e.defId==="abrams_pit"?"sabot":"bullet",s.isMissile=!1,s.isTopAttack=!1,s.isArtillery=!1,s.targetEnemy=t&&t.id?t:null,s.targetId=t?t.id:0;const l=t?Mi(t.x):r.x+Math.sin(o)*14,c=t&&t.wy||.7,h=t?yi(t.y):r.z+Math.cos(o)*14,u=new C(l-r.x,c-r.y,h-r.z).normalize();n!==0&&u.applyAxisAngle(new C(0,1,0),n).normalize();const d=s.speed*Wt;s.vx=u.x*d,s.vy=u.y*d,s.vz=u.z*d,s.life=1.2;const f=s.mesh;f.material=s.kind==="sabot"?this.sabotMat:this.bulletMat;const m=e.defId==="abrams_pit"?2.2:s.kind==="sabot"?1.5:1;f.scale.set(m,m,s.kind==="sabot"?1.6:1),f.position.copy(r),f.lookAt(r.x+s.vx,r.y+s.vy,r.z+s.vz),f.visible=!0}}updateProjectiles(e){this.projectilePool.forEachActive(t=>{const i=t;if(i.prevWx=i.wx,i.prevWy=i.wy,i.prevWz=i.wz,i.life-=e,i.life<=0){this.projectilePool.release(i);return}if(i.isArtillery){i.flightTime+=e;const s=Math.min(1,i.flightTime/i.totalFlightTime),r=Math.sin(s*Math.PI),o=i.kind==="hellfire"?0:9.5;i.wx=oi.lerp(i.startWx,i.targetWx,s),i.wz=oi.lerp(i.startWz,i.targetWz,s),i.wy=oi.lerp(i.startWy,i.targetWy,s)+r*o,i.mesh.position.set(i.wx,i.wy,i.wz),i.mesh.lookAt(i.wx+(i.wx-i.prevWx)+1e-4,i.wy+(i.wy-i.prevWy),i.wz+(i.wz-i.prevWz)),(i.kind==="rocket"||i.kind==="hellfire")&&(i.smokeTimer+=e,i.smokeTimer>=.024&&(i.smokeTimer=0,this.effects.spawnSmokePuff(i.wx,i.wy,i.wz,i.kind==="hellfire"?16628340:14412542,.45))),s>=1&&(this.detonateSplash(i),this.projectilePool.release(i));return}if(i.isTopAttack){i.targetEnemy&&i.targetEnemy._pooledActive&&i.targetEnemy.id===i.targetId&&(i.targetX=i.targetEnemy.x,i.targetY=i.targetEnemy.y,i.targetWx=i.targetEnemy.wx,i.targetWy=i.targetEnemy.wy+.7,i.targetWz=i.targetEnemy.wz),i.flightTime+=e;const s=Math.min(1,i.flightTime/i.totalFlightTime),r=Math.sin(Math.pow(s,.75)*Math.PI);i.wx=oi.lerp(i.startWx,i.targetWx,s),i.wz=oi.lerp(i.startWz,i.targetWz,s),i.wy=oi.lerp(i.startWy,i.targetWy,s)+r*7.8,i.mesh.position.set(i.wx,i.wy,i.wz),i.mesh.lookAt(i.wx+(i.wx-i.prevWx)+1e-4,i.wy+(i.wy-i.prevWy),i.wz+(i.wz-i.prevWz)),i.smokeTimer+=e,i.smokeTimer>=.024&&(i.smokeTimer=0,this.effects.spawnSmokePuff(i.wx,i.wy,i.wz,14870768,.42)),s>=1&&(i.targetEnemy&&i.targetEnemy._pooledActive&&i.targetEnemy.id===i.targetId?this.impactSingleEnemy(i,i.targetEnemy):this.detonateSplash(i),this.projectilePool.release(i));return}if(i.isMissile){i.targetEnemy&&i.targetEnemy._pooledActive&&i.targetEnemy.id===i.targetId&&(i.targetX=i.targetEnemy.x,i.targetY=i.targetEnemy.y,i.targetWx=i.targetEnemy.wx,i.targetWy=i.targetEnemy.wy,i.targetWz=i.targetEnemy.wz);const s=new C(i.targetWx-i.wx,i.targetWy-i.wy,i.targetWz-i.wz),r=s.length(),o=i.speed*Wt;if(r>.01){s.normalize();const l=new C(i.vx,i.vy,i.vz).normalize();l.lerp(s,Math.min(1,10*e)).normalize(),i.vx=l.x*o,i.vy=l.y*o,i.vz=l.z*o}i.wx+=i.vx*e,i.wy+=i.vy*e,i.wz+=i.vz*e,i.mesh.position.set(i.wx,i.wy,i.wz),i.mesh.lookAt(i.wx+i.vx,i.wy+i.vy,i.wz+i.vz),i.smokeTimer+=e,i.smokeTimer>=.022&&(i.smokeTimer=0,this.effects.spawnSmokePuff(i.wx,i.wy,i.wz,14870768,.45)),r<=1.25&&(i.targetEnemy&&i.targetEnemy._pooledActive&&i.targetEnemy.id===i.targetId?this.impactSingleEnemy(i,i.targetEnemy):this.detonateSplash(i),this.projectilePool.release(i));return}i.wx+=i.vx*e,i.wy+=i.vy*e,i.wz+=i.vz*e,i.x=Wn(i.wx),i.y=Vn(i.wz),i.mesh.position.set(i.wx,i.wy,i.wz);let n=null;this.enemyPool.forEachActive(s=>{if(n)return;const r=s;if(r.isStealth&&!r.stealthRevealed||i.sourceTower&&(i.sourceTower.def.domain==="ground"&&r.domain!=="ground"||i.sourceTower.def.domain==="air"&&r.domain!=="air"))return;Math.hypot(r.x-i.x,r.y-i.y)<=r.radius+7&&(n=r)}),n&&(this.impactSingleEnemy(i,n),this.projectilePool.release(i))})}impactSingleEnemy(e,t){const i=this.applyDamageToEnemy(t,e.damage,e.damageType,e.sourceTower,{armorPierce:e.armorPierce,armorIgnore:e.armorIgnore,heavyMultiplier:e.heavyMultiplier,tandemHeat:e.tandemHeat,critChance:e.critChance,isMissile:e.isMissile});if(i.apsIntercepted){this.effects.spawnShockwave(t.wx,1,t.wz,2.5,2282478),this.spawnFloatingText(t.wx,3,t.wz,"APS INTERCEPT!","#22d3ee"),ke.playApsIntercept();return}e.splashRadius>0?this.detonateSplash(e,t):i.isRicochet?(ke.playRicochet(),this.effects.spawnSparks(e.wx,e.wy,e.wz,5,16498468),Math.random()<.35&&this.spawnFloatingText(t.wx,2.4,t.wz,"RICOCHET","#fbbf24")):e.isMissile?(this.effects.spawnExplosion(e.wx,e.wy,e.wz,1,16347926,!0),ke.playExplosion(.95),this.addTrauma(.18)):this.effects.spawnSparks(e.wx,e.wy,e.wz,3,i.isCrit?3718648:16707722)}detonateSplash(e,t=null){const i=e.splashRadius>=90||e.kind==="hellfire",n=Math.max(.75,e.splashRadius/72);this.effects.spawnExplosion(e.targetWx,Math.max(.4,e.targetWy),e.targetWz,n,e.kind==="hellfire"?15680580:16347926,!0),e.targetWy<1.5&&this.effects.spawnCrater(e.targetWx,e.targetWz,n),e.burnDps>0&&e.burnDuration>0&&this.spawnFireZone(e.targetX,e.targetY,e.splashRadius,e.burnDps,e.burnDuration),ke.playExplosion(n),e.kind==="hellfire"?(this.addTrauma(.55),this.hitStopTimer=.032):i&&this.addTrauma(e.kind==="rocket"?.32:.24);const s=e.splashRadius*e.splashRadius;this.enemyPool.forEachActive(r=>{const o=r;if(o===t||e.kind!=="hellfire"&&e.damageType!=="aa_missile"&&e.damageType!=="aa"&&o.domain==="air")return;const l=(o.x-e.targetX)**2+(o.y-e.targetY)**2;if(l<=s){const c=Math.sqrt(l),h=e.kind==="hellfire"?1:Math.max(.45,1-c/e.splashRadius*.55);this.applyDamageToEnemy(o,e.damage*h,e.damageType,e.sourceTower,{armorPierce:e.armorPierce,armorIgnore:e.armorIgnore,heavyMultiplier:e.heavyMultiplier,tandemHeat:e.tandemHeat,critChance:e.critChance,isMissile:e.isMissile,allowApsIntercept:e.kind!=="hellfire"})}})}applyDamageToEnemy(e,t,i,n,s={}){if(!e||!e._pooledActive)return{damage:0};const r=Tx(e,t,i,s);if(r.apsIntercepted||r.damage<=0)return r;e.hp-=r.damage,e.hitFlashTimer=.07,e.rig&&e.rig.hitMeshes.forEach(l=>{const c=l.material;c&&c.emissive&&(c._origEmissive===void 0&&(c._origEmissive=c.emissive.getHex()),c.emissive.setHex(6710886))}),this.totalDamage+=r.damage,n&&(n.totalDamage+=r.damage),r.eraBlocked?this.spawnFloatingText(e.wx,e.wy+2.4,e.wz,"ERA BLOCK (-40%)","#fb923c"):r.isCrit&&this.spawnFloatingText(e.wx,e.wy+2.2,e.wz,`CRIT ${r.damage}`,"#38bdf8");const o=En[e.type];if(e.hp>0&&o?.thresholdSpawns){const l=e.hp/e.maxHp;for(let c=0;c<o.thresholdSpawns.length;c++){const h=o.thresholdSpawns[c];if(l<=h.ratio&&!e.triggeredThresholds.has(c)){e.triggeredThresholds.add(c),this.spawnFloatingText(e.wx,3.6,e.wz,"ESCOLTA LIBERADA!","#facc15");const u=Math.max(0,Math.min(Ve-1,Math.floor(e.x/tt))),d=Math.max(0,Math.min(St-1,Math.floor(e.y/tt)));for(let f=0;f<h.count;f++)this.spawnEnemy(h.type,0,{x:Math.max(16,Math.min(nr-16,e.x+(Math.random()-.5)*32)),y:Math.max(16,Math.min(sr-16,e.y+(Math.random()-.5)*32)),fallbackCol:u,fallbackRow:d})}}}return e.hp<=0?this.killEnemy(e,n):this.updateEnemyHealthBar(e),r}killEnemy(e,t){if(!e._pooledActive)return;this.totalKills+=1,this.budget+=e.reward,e.wbReward>0&&(this.sessionWB+=e.wbReward,Xe.addWarBonds(e.wbReward)),t&&(t.kills+=1);const i=e.wbReward>0?`+$${e.reward} | +${e.wbReward} WB$`:`+$${e.reward}`;this.spawnFloatingText(e.wx,e.wy+1.8,e.wz,i,e.wbReward>0?"#facc15":"#4ade80"),e.isBoss?(this.effects.spawnExplosion(e.wx,1.2,e.wz,2.35,15680580,!0),this.effects.spawnCrater(e.wx,e.wz,1.6),ke.playExplosion(1.8),this.addTrauma(.75),this.hitStopTimer=.045,this.triggerFlashLight(e.wx,3,e.wz,16743202,8,.18),this.pushRadio(`ALVO PRIORITÁRIO DESTRUÍDO! ${e.type.toUpperCase()} abatido (+$${e.reward} / +${e.wbReward} WB$)!`,"good")):e.armorClass==="heavy"||e.domain==="air"?(this.effects.spawnExplosion(e.wx,Math.max(.6,e.wy),e.wz,1.15,16347926,!0),e.domain==="ground"&&this.effects.spawnCrater(e.wx,e.wz,.9),ke.playExplosion(1),this.addTrauma(.16)):this.effects.spawnExplosion(e.wx,.5,e.wz,.55,16347926,!0);const n=e.x,s=e.y,r=e.wx,o=e.wz,l=e.dismountCount||0;if(this.enemyPool.release(e),l>0){const c=Math.max(0,Math.min(Ve-1,Math.floor(n/tt))),h=Math.max(0,Math.min(St-1,Math.floor(s/tt)));this.spawnFloatingText(r,2.8,o,"INFANTARIA DESEMBARCOU!","#facc15");for(let u=0;u<l;u++){const d=n+(Math.random()-.5)*26,f=s+(Math.random()-.5)*26;this.spawnEnemy("infantry",0,{x:Math.max(16,Math.min(nr-16,d)),y:Math.max(16,Math.min(sr-16,f)),fallbackCol:c,fallbackRow:h})}}}updateFlyovers(e){for(let t=this.activeFlyovers.length-1;t>=0;t--){const i=this.activeFlyovers[t],n=i.speed*e;i.x+=i.dirX*n,i.y+=i.dirY*n,i.progress+=n;const s=Mi(i.x),r=yi(i.y);if(i.jet.position.set(s,i.kind==="b52"?12.5:9.5,r),i.kind==="a10"){if(i.progress>=380&&i.progress<=i.totalDist-380)for(i.startedSound||(i.startedSound=!0,ke.playA10Brrrt()),this.addTrauma(.14),i.burstTimer+=e;i.burstTimer>=.028;){i.burstTimer-=.028;const o=Math.min(1,(i.progress-380)/(i.totalDist-760)),l=oi.lerp(i.strafeStartX,i.strafeEndX,o)+(Math.random()-.5)*52,c=oi.lerp(i.strafeStartY,i.strafeEndY,o)+(Math.random()-.5)*52,h=Mi(l),u=yi(c),d=this.projectilePool.acquire();d.kind="bullet",d.isMissile=!1,d.isTopAttack=!1,d.isArtillery=!1;const f=new C(h-s,-9.2,u-r).normalize();d.wx=s+Math.sin(i.yaw)*2.5,d.wy=9.2,d.wz=r+Math.cos(i.yaw)*2.5,d.vx=f.x*110,d.vy=f.y*110,d.vz=f.z*110,d.life=.1,d.damage=0;const m=d.mesh;m.material=this.bulletMat,m.scale.set(1.8,1.8,2.8),m.position.set(d.wx,d.wy,d.wz),m.lookAt(h,.2,u),m.visible=!0,this.effects.spawnExplosion(h,.35,u,.65,16347926,!0),this.enemyPool.forEachActive(x=>{const p=x;Math.hypot(p.x-l,p.y-c)<=58&&this.applyDamageToEnemy(p,105,"apds",null,{armorIgnore:.72,allowApsIntercept:!1})})}}else if(i.kind==="b52"&&i.progress>=460&&i.progress<=i.totalDist-460)for(this.addTrauma(.18),i.burstTimer+=e;i.burstTimer>=.12;){i.burstTimer-=.12;const o=Math.min(1,(i.progress-460)/(i.totalDist-920)),l=oi.lerp(i.strafeStartX,i.strafeEndX,o)+(Math.random()-.5)*40,c=i.strafeStartY+(Math.random()-.5)*110,h=Mi(l),u=yi(c);this.effects.spawnExplosion(h,.4,u,1.35,16347926,!0),this.effects.spawnCrater(h,u,1.1),this.spawnFireZone(l,c,82,95,4.5),ke.playExplosion(1.1),this.enemyPool.forEachActive(d=>{const f=d;Math.hypot(f.x-l,f.y-c)<=110&&this.applyDamageToEnemy(f,520,"thermobaric",null,{allowApsIntercept:!1})})}i.progress>=i.totalDist&&(this.scene.remove(i.jet),this.activeFlyovers.splice(t,1))}}spawnFloatingText(e,t,i,n,s="#ffffff"){const r=this.textPool.acquire();r.wx=e,r.wy=t,r.wz=i,r.life=r.maxLife,r.el.textContent=n,r.el.style.color=s,r.el.classList.remove("hidden")}updateFloatingTexts(e){this.textPool.forEachActive(t=>{const i=t;if(i.life-=e,i.life<=0){this.textPool.release(i);return}i.wy+=e*1.9,i.el.style.opacity=String(Math.min(1,i.life/i.maxLife*1.4))})}updateProjectedDomBars(){const e=this.container.clientWidth,t=this.container.clientHeight;if(e<=0||t<=0)return;const i=new C;this.enemyPool.forEachActive(n=>{const s=n;if(!(s.hp<s.maxHp||s.isBoss||s===this.hoveredEnemy)||s.isStealth&&!s.stealthRevealed){s.hpEl.classList.add("hidden");return}if(i.set(s.wx,s.wy+(s.isBoss?3.5:2.1),s.wz).project(this.camera),i.z>1){s.hpEl.classList.add("hidden");return}const o=(i.x*.5+.5)*e,l=(-i.y*.5+.5)*t;s.hpEl.classList.remove("hidden"),s.hpEl.style.transform=`translate3d(${o}px, ${l}px, 0) translate(-50%, -100%)`});for(const n of this.towers){if(!(n.hp<n.maxHp||n.empDisabledTimer>0||n===this.selectedTower)){n.hpEl.classList.add("hidden");continue}if(i.set(n.wx,2.75,n.wz).project(this.camera),i.z>1){n.hpEl.classList.add("hidden");continue}const r=Math.max(0,Math.min(1,n.hp/n.maxHp));n.hpFillEl.style.width=`${r*100}%`,n.hpFillEl.style.background=n.empDisabledTimer>0?"#c084fc":r>.4?"#38bdf8":r>.2?"#fb923c":"#ef4444",n.hpLabelEl.textContent=n.empDisabledTimer>0?"EMP OFF":`${Math.ceil(n.hp)}`;const o=(i.x*.5+.5)*e,l=(-i.y*.5+.5)*t;n.hpEl.classList.remove("hidden"),n.hpEl.style.transform=`translate3d(${o}px, ${l}px, 0) translate(-50%, -100%)`}this.textPool.forEachActive(n=>{const s=n;if(i.set(s.wx,s.wy,s.wz).project(this.camera),i.z>1){s.el.classList.add("hidden");return}const r=(i.x*.5+.5)*e,o=(-i.y*.5+.5)*t;s.el.classList.remove("hidden"),s.el.style.transform=`translate3d(${r}px, ${o}px, 0) translate(-50%, -50%)`})}clearGroup(e){for(;e.children.length>0;){const t=e.children[0];e.remove(t),t.geometry&&t.geometry.dispose()}}buildPathLine(e,t,i,n){if(!e||e.length<2)return null;const s=e.map(o=>new C(Mi(o.x),n,yi(o.y))),r=new Ht().setFromPoints(s);return new Qs(r,new gs({color:t,transparent:!0,opacity:i}))}rebuildActiveRouteLines(){this.clearGroup(this.routeLinesGroup);for(const e of this.pathfinder.spawnPoints){const t=this.pathfinder.spawnPaths.get(e.id);if(t){const i=this.buildPathLine(t,15680580,.35,.08);i&&this.routeLinesGroup.add(i)}}}rebuildPreviewRouteLines(){if(this.clearGroup(this.previewRouteGroup),this.lastCanPlace?.previewPaths)for(const[,e]of this.lastCanPlace.previewPaths){const t=this.buildPathLine(e,3718648,.85,.14);t&&this.previewRouteGroup.add(t)}}rebuildSelectedTowerOverlay(){if(this.clearGroup(this.selectedRingGroup),!this.selectedTower)return;const e=this.selectedTower,t=e.def.levels[e.level-1],i=new V(new Rs(1.75,1.98,4),new Pt({color:16436245,side:Ot}));if(i.rotation.x=-Math.PI/2,i.rotation.z=Math.PI/4,i.position.set(e.wx,.08,e.wz),this.selectedRingGroup.add(i),!e.def.isBarrier&&t.range>0){const n=t.range*Wt,s=this.createCircleLoop(72,3718648,.85);s.scale.setScalar(n),s.position.set(e.wx,.11,e.wz),this.selectedRingGroup.add(s);const r=new V(new ys(n,64),new Pt({color:3718648,transparent:!0,opacity:.07,side:Ot,depthWrite:!1}));if(r.rotation.x=-Math.PI/2,r.position.set(e.wx,.06,e.wz),this.selectedRingGroup.add(r),t.minRange>0){const o=t.minRange*Wt,l=this.createCircleLoop(48,15680580,.78);l.scale.setScalar(o),l.position.set(e.wx,.11,e.wz),this.selectedRingGroup.add(l)}}}updateInteractiveOverlays(){if(this.activeTool?.kind==="build"){const{col:e,row:t}=this.hoverTile;if(this.pathfinder.inBounds(e,t)){const n=Li[this.activeTool.towerId].levels[0],s=this.getEffectiveTowerCost(this.activeTool.towerId),{x:r,z:o}=Xn(e,t),l=!!(this.lastCanPlace?.ok&&this.budget>=s);this.ghostGroup.visible=!0,this.ghostGroup.position.set(r,0,o),this.ghostTileHighlight.material.color.setHex(l?2278750:15680580);for(const[c,h]of this.ghostModels){const u=c===this.activeTool.towerId;h.root.visible=u,u&&h.setValid(l)}if(n.range>0){const c=n.range*Wt;this.ghostRangeRing.visible=!0,this.ghostRangeRing.scale.setScalar(c),this.ghostRangeRing.material.color.setHex(l?2278750:15680580),n.minRange>0?(this.ghostMinRangeRing.visible=!0,this.ghostMinRangeRing.scale.setScalar(n.minRange*Wt)):this.ghostMinRangeRing.visible=!1}else this.ghostRangeRing.visible=!1,this.ghostMinRangeRing.visible=!1}else this.ghostGroup.visible=!1}else this.ghostGroup.visible=!1;if(this.clearGroup(this.supportReticleGroup),this.activeTool?.kind==="support"){const e=this.strafeDragStart?Mi(this.strafeDragStart.x):this.hoverWorld.x,t=this.strafeDragStart?yi(this.strafeDragStart.y):this.hoverWorld.z;if(this.activeTool.supportId==="a10"){const i=230*Wt,n=Math.cos(this.strafeAngle)*i,s=Math.sin(this.strafeAngle)*i,r=new V(new Ui(i*2,3.2),new Pt({color:16436245,transparent:!0,opacity:.28,side:Ot,depthWrite:!1}));r.rotation.x=-Math.PI/2,r.rotation.z=-this.strafeAngle,r.position.set(e,.12,t),this.supportReticleGroup.add(r);const o=new Ht().setFromPoints([new C(e-n,.18,t-s),new C(e+n,.18,t+s)]);this.supportReticleGroup.add(new Qs(o,new gs({color:16436245})))}else if(this.activeTool.supportId==="hellfire"){const i=115*Wt,n=this.createCircleLoop(48,15680580,.92);n.scale.setScalar(i),n.position.set(e,.14,t),this.supportReticleGroup.add(n);const s=new V(new ys(i,48),new Pt({color:15680580,transparent:!0,opacity:.18,side:Ot,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.set(e,.1,t),this.supportReticleGroup.add(s)}else if(this.activeTool.supportId==="b52"){const i=new V(new Ui(760*Wt,110*Wt),new Pt({color:16347926,transparent:!0,opacity:.24,side:Ot,depthWrite:!1}));i.rotation.x=-Math.PI/2,i.position.set(e,.12,t),this.supportReticleGroup.add(i)}}}addTrauma(e){this.trauma=Math.min(1,this.trauma+e)}updateCameraShake(e){if(this.trauma>0){this.trauma=Math.max(0,this.trauma-e*1.85);const t=this.trauma*this.trauma*.75;this.baseCameraOffset.set((Math.random()*2-1)*t,(Math.random()*2-1)*t*.6,(Math.random()*2-1)*t),this.camera.position.add(this.baseCameraOffset),this.controls.update(),this.camera.position.sub(this.baseCameraOffset)}}serializeTower(e){if(!e)return null;const t=this.getEffectiveSpec(e),i=e.def.levels[e.level]||null;return{id:e.id,defId:e.defId,name:t.name,shortName:e.def.shortName,role:e.def.role,level:e.level,maxLevel:e.def.levels.length,hp:Math.ceil(e.hp),maxHp:e.maxHp,repairCost:this.getRepairCost(e),empDisabled:e.empDisabledTimer>0,isBarrier:!!e.def.isBarrier,isSupportAura:!!e.def.isSupportAura,domain:e.def.domain,range:t.range,minRange:t.minRange||0,fireRate:t.fireRate,damage:t.damage,notes:t.notes,priority:e.priority,totalDamage:e.totalDamage,kills:e.kills,sellRefund:Math.floor(e.totalInvested*.75*Math.max(.4,e.hp/e.maxHp)),nextUpgrade:i?{name:i.name,cost:i.upgradeCost,notes:i.notes}:null}}emitFullHudSync(){const e=this.currentWave,t=this.stageConfig.waves[e]||null,i=!this.gameOver&&this.currentWave<this.totalWaves&&(!this.waveActive||this.spawnQueue.length===0);he.emit("hud:state",{budget:this.budget,warBonds:Xe.getWarBonds(),worldId:this.currentWorldId,stageId:this.currentStageId,stageTitle:this.stageConfig.title,fobHp:this.fobHp,fobMaxHp:this.fobMaxHp,currentWave:this.currentWave,totalWaves:this.totalWaves,waveActive:this.waveActive,inIntermission:this.inIntermission,wavePrepTimer:Math.ceil(this.wavePrepTimer),canCallEarly:i,earlyBonus:this.currentWave===0?0:Math.round(25+Math.max(0,this.wavePrepTimer)*2.5),timeScale:this.timeScale,activeEnemies:this.enemyPool.activeCount,totalKills:this.totalKills,hasGlobalAesa:this.hasGlobalAesa,airSupport:{a10:{...this.airSupport.a10},hellfire:{...this.airSupport.hellfire},b52:{...this.airSupport.b52}},nextWave:t?{wave:t.wave,title:t.title,brief:t.brief,units:t.groups.map(n=>({type:n.type,count:n.count,shortName:En[n.type].shortName,armorLabel:En[n.type].armorLabel,domain:En[n.type].domain,isBoss:!!En[n.type].isBoss}))}:null})}pushRadio(e,t="info"){he.emit("hud:radio",{text:e,level:t,wave:this.currentWave})}destroy(){!this.gameOver&&(this.towers.length>0||this.currentWave>0)&&this.saveCurrentMissionSnapshot(!0),cancelAnimationFrame(this.rafId),this.resizeObserver.disconnect(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("beforeunload",this.onBeforeUnload),window.removeEventListener("pagehide",this.onBeforeUnload),document.removeEventListener("visibilitychange",this.onVisibilityChange);for(const e of this.unsubs)e();this.diorama&&this.diorama.dispose(),this.controls.dispose(),this.renderer.dispose(),this.overlayEl.remove()}}const mh={m2_bunker:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16h18M5 16l2-5h6l2 5M13 11h8M15 8v3M7 16v3M17 16v3"/></svg>',bushmaster:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="9" height="6" rx="1"/><path d="M13 12h9M3 18h14M6 10l2-3h4l1 3"/></svg>',javelin:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18h16M7 18l5-10 4 2-5 8M15 6l4-2-1 4"/></svg>',phalanx:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 19h8M9 19v-7a3 3 0 0 1 6 0v7M15 11h6M15 13h6"/></svg>',howitzer:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 18h14M6 18l3-5 10-7 1.5 2-9 7M12 18l4-3"/></svg>',patriot:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19h16M6 19v-3h12v3M8 14l9-9 2 2-9 9M5 9l4 4"/></svg>',ew_crew:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20V8M8 20h8M9 15h6M12 8a3 3 0 1 0 0-4M7 10a6 6 0 0 1 0-6M17 10a6 6 0 0 0 0-6"/></svg>',abrams_pit:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="13" width="15" height="6" rx="2"/><path d="M6 13l2-4h6l2 4M14 10h8"/></svg>',iron_dome:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 18h18M5 18a7 7 0 0 1 14 0M12 5v4M8 7l2 3M16 7l-2 3"/></svg>',helios_laser:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="14" r="4"/><path d="M4 19h10M13 12l8-6M13 14h9"/></svg>',tos1_mlrs:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="14" width="17" height="5" rx="1"/><path d="M6 14l4-7h7l-2 7M11 9l6-4"/></svg>',hesco:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="8" height="10"/><rect x="13" y="8" width="8" height="10"/><path d="M3 13h18M4 6c2-2 4 2 6 0s4 2 6 0 4 2 5 0"/></svg>'},u_=[{key:"damage",label:"DANO",bonus:"+10%/nv"},{key:"fireRate",label:"CADÊNCIA",bonus:"+8%/nv"},{key:"hp",label:"BLINDAGEM",bonus:"+20%/nv"},{key:"cost",label:"CUSTO",bonus:"-5%/nv"}];class f_{constructor(){this.latestState=null,this.activeTool=null,this.selectedTower=null,this.alertTimeout=null;const e=Xe.getState();this.modalWorldId=e.selectedWorld,this.modalStageId=e.selectedStage,this.activeTab="worlds",this.el={missionLabel:document.getElementById("hud-mission-label"),budget:document.getElementById("hud-budget"),wb:document.getElementById("hud-wb"),fob:document.getElementById("hud-fob"),wave:document.getElementById("hud-wave"),enemies:document.getElementById("hud-enemies"),kills:document.getElementById("hud-kills"),aesa:document.getElementById("hud-aesa"),coord:document.getElementById("hud-coord"),btnInstallPwa:document.getElementById("btn-install-pwa"),btnSaveMenu:document.getElementById("btn-save-menu"),btnCampaign:document.getElementById("btn-campaign"),btnWave:document.getElementById("btn-wave"),btnResetCam:document.getElementById("btn-reset-cam"),btnToggleSidebar:document.getElementById("btn-toggle-sidebar"),btnCloseSidebar:document.getElementById("btn-close-sidebar"),tacticalSidebar:document.getElementById("tactical-sidebar"),sidebarBackdrop:document.getElementById("sidebar-backdrop"),inspectorPanel:document.getElementById("inspector-panel"),btnMute:document.getElementById("btn-mute"),btnHelp:document.getElementById("btn-help"),btnCloseHelp:document.getElementById("btn-close-help"),helpModal:document.getElementById("help-modal"),radarAlert:document.getElementById("radar-alert-banner"),goModal:document.getElementById("gameover-modal"),goBadge:document.getElementById("go-badge"),goTitle:document.getElementById("go-title"),goDesc:document.getElementById("go-desc"),goWave:document.getElementById("go-wave"),goKills:document.getElementById("go-kills"),goWb:document.getElementById("go-wb"),btnRestart:document.getElementById("btn-restart"),btnGoCampaign:document.getElementById("btn-go-campaign"),btnNextStage:document.getElementById("btn-next-stage"),toolBanner:document.getElementById("tool-banner"),toolBannerText:document.getElementById("tool-banner-text"),btnRotateA10:document.getElementById("btn-rotate-a10"),btnCancelTool:document.getElementById("btn-cancel-tool"),nextWaveNum:document.getElementById("next-wave-num"),nextWaveTitle:document.getElementById("next-wave-title"),nextWaveBrief:document.getElementById("next-wave-brief"),nextWaveUnits:document.getElementById("next-wave-units"),inspLevel:document.getElementById("insp-level"),inspEmpty:document.getElementById("inspector-empty"),inspBody:document.getElementById("inspector-body"),inspName:document.getElementById("insp-name"),inspRole:document.getElementById("insp-role"),inspTotalDmg:document.getElementById("insp-total-dmg"),inspKills:document.getElementById("insp-kills"),inspHpText:document.getElementById("insp-hp-text"),inspHpFill:document.getElementById("insp-hp-fill"),inspSpecs:document.getElementById("insp-specs"),prioSection:document.getElementById("prio-section"),prioGrid:document.getElementById("prio-grid"),btnRepair:document.getElementById("btn-repair"),btnUpgrade:document.getElementById("btn-upgrade"),btnUpgradeTitle:document.getElementById("btn-upgrade-title"),btnUpgradeDesc:document.getElementById("btn-upgrade-desc"),btnSell:document.getElementById("btn-sell"),radioLog:document.getElementById("radio-log"),arsenalGrid:document.getElementById("arsenal-grid"),btnA10:document.getElementById("btn-a10"),btnHellfire:document.getElementById("btn-hellfire"),btnB52:document.getElementById("btn-b52"),costB52:document.getElementById("cost-b52"),cdA10:document.getElementById("cd-a10"),cdHellfire:document.getElementById("cd-hellfire"),cdB52:document.getElementById("cd-b52"),txtCdA10:document.getElementById("txt-cd-a10"),txtCdHellfire:document.getElementById("txt-cd-hellfire"),txtCdB52:document.getElementById("txt-cd-b52"),campModal:document.getElementById("campaign-modal"),campWbBalance:document.getElementById("camp-wb-balance"),btnCloseCampaign:document.getElementById("btn-close-campaign"),tabWorlds:document.getElementById("tab-worlds"),tabArsenal:document.getElementById("tab-arsenal"),tabSave:document.getElementById("tab-save"),worldsSelector:document.getElementById("worlds-selector"),worldDescBar:document.getElementById("world-desc-bar"),stagesGrid:document.getElementById("stages-grid"),shopSupportGrid:document.getElementById("shop-support-grid"),shopTowersGrid:document.getElementById("shop-towers-grid"),btnUnlockAllStages:document.getElementById("btn-unlock-all-stages"),btnGrantWb:document.getElementById("btn-grant-wb"),btnLaunchStage:document.getElementById("btn-launch-stage"),autosaveStatusText:document.getElementById("autosave-status-text"),btnForceSave:document.getElementById("btn-force-save"),btnResetMission:document.getElementById("btn-reset-mission"),saveSlotsGrid:document.getElementById("save-slots-grid"),btnExportSave:document.getElementById("btn-export-save"),btnImportSave:document.getElementById("btn-import-save"),inputImportSave:document.getElementById("input-import-save"),btnModalInstallPwa:document.getElementById("btn-modal-install-pwa"),pwaInstallHint:document.getElementById("pwa-install-hint")},this.deferredInstallPrompt=null,this.buildArsenalCards(),this.buildPriorityButtons(),this.bindDomEvents(),this.bindBusEvents()}getEffectiveCost(e){const t=Li[e],i=Xe.getTechMultipliers(e);return Math.max(10,Math.round(t.cost*i.costMult))}buildArsenalCards(){this.el.arsenalGrid.innerHTML="",this.buildCards=new Map;for(const e of ch){const t=Li[e],i=t.levels[0],n=document.createElement("button");n.className="build-card",n.title=`${t.name} — ${t.summary} (${i.notes})`,n.innerHTML=`
        <div class="bc-top">
          <span class="hotkey">${t.hotkey}</span>
          <span class="bc-icon" style="color:${t.roleColor}">${mh[e]||""}</span>
          <span class="bc-role" style="color:${t.roleColor}">${t.role}</span>
        </div>
        <div class="bc-name">${t.name}</div>
        <div class="bc-bottom">
          <span class="bc-cost">$${t.cost}</span>
          <span class="bc-stat">${i.range>0?`${i.range}m`:"OBST"}</span>
        </div>
      `,n.addEventListener("click",()=>he.emit("cmd:selectBuild",e)),this.el.arsenalGrid.appendChild(n),this.buildCards.set(e,n)}this.refreshArsenalCardUnlockState()}refreshArsenalCardUnlockState(){for(const[e,t]of this.buildCards){const i=Li[e],n=Xe.isTowerUnlocked(e),s=t.querySelector(".bc-cost"),r=t.querySelector(".bc-stat");if(t.classList.toggle("locked",!n),!n)s.textContent=`🔒 ${i.unlockCostWB} WB$`,s.style.color="#facc15",r.textContent="ARSENAL";else{const o=this.getEffectiveCost(e);s.textContent=`$${o}`,s.style.color="";const l=i.levels[0];r.textContent=l.range>0?`${l.range}m`:"OBST"}}}buildPriorityButtons(){this.el.prioGrid.innerHTML="",this.prioButtons=new Map;for(const e of px){const t=document.createElement("button");t.className="btn-prio",t.textContent=e.short,t.title=e.desc,t.addEventListener("click",()=>he.emit("cmd:setPriority",e.id)),this.el.prioGrid.appendChild(t),this.prioButtons.set(e.id,t)}}bindDomEvents(){document.querySelectorAll(".btn-speed").forEach(t=>{t.addEventListener("click",()=>{he.emit("cmd:setSpeed",Number(t.dataset.speed))})}),this.el.btnSaveMenu?.addEventListener("click",()=>this.openCampaignModal("save")),this.el.btnCampaign.addEventListener("click",()=>this.openCampaignModal("worlds")),this.el.btnCloseCampaign.addEventListener("click",()=>this.closeCampaignModal()),document.querySelectorAll(".camp-tab").forEach(t=>{t.addEventListener("click",()=>{this.switchCampaignTab(t.dataset.tab)})}),this.el.btnUnlockAllStages.addEventListener("click",()=>{Xe.unlockAllCampaign(),this.renderCampaignModal()}),this.el.btnGrantWb.addEventListener("click",()=>{Xe.addWarBonds(1e3),this.renderCampaignModal(),he.emit("cmd:techUpdated")}),this.el.btnLaunchStage.addEventListener("click",()=>{this.closeCampaignModal(),this.el.goModal.classList.add("hidden"),this.el.radioLog.innerHTML="",he.emit("cmd:loadStage",{worldId:this.modalWorldId,stageId:this.modalStageId})}),this.el.btnForceSave?.addEventListener("click",()=>{he.emit("cmd:forceSave")}),this.el.btnResetMission?.addEventListener("click",()=>{this.closeCampaignModal(),this.el.goModal.classList.add("hidden"),this.el.radioLog.innerHTML="",he.emit("cmd:restart")}),this.el.btnExportSave?.addEventListener("click",()=>{const t=Xe.exportSaveJson(),i=new Blob([t],{type:"application/json"}),n=URL.createObjectURL(i),s=document.createElement("a");s.href=n,s.download=`defcon-frontline-save-${new Date().toISOString().slice(0,10)}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(n),this.showRadarAlert({level:"info",text:"BACKUP .JSON EXPORTADO COM SUCESSO!"})}),this.el.btnImportSave?.addEventListener("click",()=>{this.el.inputImportSave?.click()}),this.el.inputImportSave?.addEventListener("change",t=>{const i=t.target.files?.[0];if(!i)return;const n=new FileReader;n.onload=()=>{const s=typeof n.result=="string"?n.result:"";s&&he.emit("cmd:importSave",s),t.target.value=""},n.readAsText(i)}),this.el.btnWave.addEventListener("click",()=>he.emit("cmd:startWave")),this.el.btnResetCam?.addEventListener("click",()=>he.emit("cmd:resetCamera")),this.el.btnToggleSidebar?.addEventListener("click",()=>{const t=this.el.tacticalSidebar?.classList.contains("sidebar-open");this.setMobileSidebarOpen(!t)}),this.el.btnCloseSidebar?.addEventListener("click",t=>{t.stopPropagation(),this.setMobileSidebarOpen(!1)}),this.el.sidebarBackdrop?.addEventListener("click",()=>{this.setMobileSidebarOpen(!1)}),this.el.btnRotateA10?.addEventListener("click",t=>{t.stopPropagation(),he.emit("cmd:rotateStrafe")}),this.el.btnCancelTool?.addEventListener("click",t=>{t.stopPropagation(),he.emit("cmd:cancelTool")});const e=async()=>{if(this.deferredInstallPrompt){this.deferredInstallPrompt.prompt();try{(await this.deferredInstallPrompt.userChoice)?.outcome==="accepted"&&(this.deferredInstallPrompt=null,this.el.btnInstallPwa?.classList.add("hidden"),this.showRadarAlert({level:"info",text:"APP DEFCON: FRONTLINE INSTALADO NO DISPOSITIVO!"}))}catch{}return}this.openCampaignModal("save"),this.showRadarAlert({level:"info",text:'No Android Chrome use Menu (⋮) → "Instalar app". No iPhone use Compartilhar → "Adicionar à Tela de Início".'})};this.el.btnInstallPwa?.addEventListener("click",e),this.el.btnModalInstallPwa?.addEventListener("click",e),window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),this.deferredInstallPrompt=t,this.el.btnInstallPwa?.classList.remove("hidden"),this.el.pwaInstallHint&&(this.el.pwaInstallHint.textContent='Dispositivo compatível detectado! Toque em "📲 INSTALAR APP (PWA)" para instalar na tela inicial com modo offline.')}),window.addEventListener("appinstalled",()=>{this.deferredInstallPrompt=null,this.el.btnInstallPwa?.classList.add("hidden"),this.el.pwaInstallHint&&(this.el.pwaInstallHint.textContent="Aplicativo já instalado neste dispositivo. Autosave offline ativo.")}),this.el.btnRepair.addEventListener("click",()=>he.emit("cmd:repairTower")),this.el.btnUpgrade.addEventListener("click",()=>he.emit("cmd:upgradeTower")),this.el.btnSell.addEventListener("click",()=>he.emit("cmd:sellTower")),this.el.btnA10.addEventListener("click",()=>he.emit("cmd:selectSupport","a10")),this.el.btnHellfire.addEventListener("click",()=>he.emit("cmd:selectSupport","hellfire")),this.el.btnB52.addEventListener("click",()=>he.emit("cmd:selectSupport","b52")),this.el.btnMute.addEventListener("click",()=>he.emit("cmd:toggleMute")),this.el.btnHelp.addEventListener("click",()=>{this.el.helpModal.classList.remove("hidden")}),this.el.btnCloseHelp.addEventListener("click",()=>{this.el.helpModal.classList.add("hidden")}),this.el.btnRestart.addEventListener("click",()=>{this.el.goModal.classList.add("hidden"),this.el.radioLog.innerHTML="",he.emit("cmd:restart")}),this.el.btnGoCampaign.addEventListener("click",()=>{this.el.goModal.classList.add("hidden"),this.openCampaignModal("worlds")}),this.el.btnNextStage.addEventListener("click",()=>{this.el.goModal.classList.add("hidden"),this.el.radioLog.innerHTML="";const t=this.getNextStageIds(this.latestState?.worldId||1,this.latestState?.stageId||1);t&&(this.modalWorldId=t.worldId,this.modalStageId=t.stageId,he.emit("cmd:loadStage",t))})}getNextStageIds(e,t){return t<5?{worldId:e,stageId:t+1}:e<3?{worldId:e+1,stageId:1}:null}bindBusEvents(){he.on("hud:state",e=>this.renderState(e)),he.on("hud:speed",e=>this.renderSpeed(e)),he.on("hud:tool",e=>this.renderActiveTool(e)),he.on("hud:selectedTower",e=>this.renderInspector(e)),he.on("hud:openMobileInspector",()=>{window.innerWidth<=1024&&(this.setMobileSidebarOpen(!0),this.el.inspectorPanel?.scrollIntoView({behavior:"smooth",block:"nearest"}))}),he.on("hud:radio",e=>this.appendRadio(e)),he.on("hud:alert",e=>this.showRadarAlert(e)),he.on("hud:openArsenal",()=>this.openCampaignModal("arsenal")),he.on("hud:autosaved",({timestamp:e}={})=>{if(this.el.btnSaveMenu){const i=new Date(e||Date.now()).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});this.el.btnSaveMenu.textContent=`💾 SALVO ${i}`,this.el.btnSaveMenu.classList.add("saved-flash"),this.saveFlashTimeout&&clearTimeout(this.saveFlashTimeout),this.saveFlashTimeout=setTimeout(()=>{this.el.btnSaveMenu?.classList.remove("saved-flash")},1200)}!this.el.campModal.classList.contains("hidden")&&this.activeTab==="save"&&this.renderSaveTab()}),he.on("hud:slotsUpdated",()=>{!this.el.campModal.classList.contains("hidden")&&this.activeTab==="save"&&this.renderSaveTab()}),he.on("hud:mute",e=>{this.el.btnMute.textContent=e?"🔇":"🔊"}),he.on("cursor:move",({col:e,row:t})=>{if(e>=0&&e<28&&t>=0&&t<16){const i=Md(e),n=String(t+1).padStart(2,"0");this.el.coord.textContent=`GRID ${i}-${n}`}}),he.on("hud:gameover",e=>this.showGameOver(e))}showRadarAlert({level:e,text:t}){this.el.radarAlert.textContent=t,this.el.radarAlert.className=`radar-alert ${e||"warn"}`,this.alertTimeout&&clearTimeout(this.alertTimeout),this.alertTimeout=setTimeout(()=>{this.el.radarAlert.classList.add("hidden")},4500)}openCampaignModal(e="worlds"){const t=Xe.getState();this.modalWorldId=this.latestState?.worldId||t.selectedWorld,this.modalStageId=this.latestState?.stageId||t.selectedStage,this.el.campModal.classList.remove("hidden"),this.switchCampaignTab(e)}closeCampaignModal(){this.el.campModal.classList.add("hidden")}switchCampaignTab(e){this.activeTab=e,document.querySelectorAll(".camp-tab").forEach(t=>{t.classList.toggle("active",t.dataset.tab===e)}),this.el.tabWorlds.classList.toggle("hidden",e!=="worlds"),this.el.tabArsenal.classList.toggle("hidden",e!=="arsenal"),this.el.tabSave?.classList.toggle("hidden",e!=="save"),this.renderCampaignModal()}renderCampaignModal(){const e=Xe.getWarBonds();this.el.campWbBalance.textContent=`${e.toLocaleString()} WB$`,this.el.wb.textContent=`${e.toLocaleString()} WB$`,this.el.worldsSelector.innerHTML="";for(const s of ol){const r=document.createElement("button");r.className=`world-btn ${s.worldId===this.modalWorldId?"active":""}`,r.innerHTML=`
        <span class="wb-tag">${s.region.toUpperCase()}</span>
        <strong>${s.name}</strong>
      `,r.addEventListener("click",()=>{this.modalWorldId=s.worldId,Xe.isStageUnlocked(this.modalWorldId,this.modalStageId)||(this.modalStageId=1),this.renderCampaignModal()}),this.el.worldsSelector.appendChild(r)}const t=br(this.modalWorldId);this.el.worldDescBar.textContent=t.description,this.el.stagesGrid.innerHTML="";for(const s of t.stages){const r=Xe.isStageUnlocked(s.worldId,s.stageId),o=Xe.getStageWins(s.worldId,s.stageId),l=s.worldId===this.modalWorldId&&s.stageId===this.modalStageId,c=document.createElement("button");c.className=`stage-card ${l?"selected":""} ${r?"":"locked"} ${s.isBossStage?"boss-stage":""}`,c.disabled=!r;const h=r?o>0?`★ ${o}x CONCLUÍDA (REJOGAR)`:s.isBossStage?"💀 CHEFE SUPREMO":"DISPONÍVEL":"🔒 BLOQUEADA";c.innerHTML=`
        <div class="st-top">
          <span class="st-id">FASE ${s.id}</span>
          <span class="st-status ${o>0?"won":""}">${h}</span>
        </div>
        <div class="st-title">${s.title}</div>
        <div class="st-sub">${s.subtitle}</div>
        <div class="st-meta">
          <span>Base: $${s.startingBudget}</span>
          <span class="st-wb">Recompensa: +${s.clearBonusWB} WB$</span>
        </div>
      `,r&&c.addEventListener("click",()=>{this.modalStageId=s.stageId,this.renderCampaignModal()}),this.el.stagesGrid.appendChild(c)}const i=wr(this.modalWorldId,this.modalStageId),n=Xe.isStageUnlocked(this.modalWorldId,this.modalStageId);this.el.btnLaunchStage.disabled=!n,this.el.btnLaunchStage.textContent=`🚀 INICIAR OPERAÇÃO (${i.id}: ${i.title})`,this.el.shopSupportGrid.innerHTML="";for(const s of Object.values(dn)){const r=Xe.isSupportUnlocked(s.id),o=document.createElement("div");if(o.className=`shop-card ${r?"unlocked":"locked"}`,o.innerHTML=`
        <div class="sc-head">
          <strong>[${s.hotkey}] ${s.name}</strong>
          <span class="sc-cost">${r?"✅ DESBLOQUEADO":`🔒 ${s.unlockCostWB} WB$`}</span>
        </div>
        <div class="sc-desc">${s.desc} (Uso em combate: $${s.cost})</div>
      `,!r){const l=document.createElement("button");l.className="btn-buy-wb",l.disabled=e<s.unlockCostWB,l.textContent=`DESBLOQUEAR (${s.unlockCostWB} WB$)`,l.addEventListener("click",()=>{Xe.unlockSupport(s.id,s.unlockCostWB)&&(this.renderCampaignModal(),he.emit("cmd:techUpdated"))}),o.appendChild(l)}this.el.shopSupportGrid.appendChild(o)}this.el.shopTowersGrid.innerHTML="";for(const s of ch){const r=Li[s],o=Xe.isTowerUnlocked(s),l=Xe.getTowerTech(s),c=this.getEffectiveCost(s),h=document.createElement("div");if(h.className=`shop-tower-card ${o?"unlocked":"locked"}`,h.innerHTML=`
        <div class="stc-head">
          <span class="stc-icon" style="color:${r.roleColor}">${mh[s]||""}</span>
          <div>
            <div class="stc-name">[${r.hotkey}] ${r.name}</div>
            <div class="stc-role" style="color:${r.roleColor}">${r.role} | Custo Fase: $${c} | HP Base: ${r.maxHp}</div>
          </div>
          <span class="stc-badge">${o?"LIBERADA":`🔒 ${r.unlockCostWB} WB$`}</span>
        </div>
        <div class="stc-desc">${r.summary}</div>
      `,o){const u=document.createElement("div");u.className="tech-grid";for(const d of u_){if(r.isBarrier&&(d.key==="damage"||d.key==="fireRate"))continue;const f=l[d.key],m=f>=Tr,x=Xe.getUpgradeTechCost(f),p=document.createElement("div");p.className="tech-row",p.innerHTML=`
            <span class="tech-label">${d.label} <small>(${d.bonus})</small></span>
            <span class="tech-pips">${"■".repeat(f)}${"□".repeat(Tr-f)}</span>
          `;const g=document.createElement("button");g.className="btn-tech-up",g.disabled=m||e<x,g.textContent=m?"MAX":`+1 (${x} WB$)`,g.addEventListener("click",()=>{Xe.upgradeTowerTech(s,d.key,x)&&(this.refreshArsenalCardUnlockState(),this.renderCampaignModal(),he.emit("cmd:techUpdated"))}),p.appendChild(g),u.appendChild(p)}h.appendChild(u)}else{const u=document.createElement("button");u.className="btn-buy-wb",u.disabled=e<r.unlockCostWB,u.textContent=`DESBLOQUEAR ARMA (${r.unlockCostWB} WB$)`,u.addEventListener("click",()=>{Xe.unlockTower(s,r.unlockCostWB)&&(this.refreshArsenalCardUnlockState(),this.renderCampaignModal(),he.emit("cmd:techUpdated"))}),h.appendChild(u)}this.el.shopTowersGrid.appendChild(h)}this.renderSaveTab()}formatTimestamp(e){return!e||!Number.isFinite(e)?"Nunca":new Date(e).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}renderSaveTab(){if(!this.el.tabSave)return;const e=Xe.getActiveMission(),t=Xe.getLastSavedAt();if(this.el.autosaveStatusText)if(e){const n=br(e.worldId),s=wr(e.worldId,e.stageId);this.el.autosaveStatusText.textContent=`Missão em andamento salva: Mundo ${e.worldId} (${n.name}) • Fase ${e.worldId}-${e.stageId} (${s.title}) | Onda ${e.completedWave}/${e.totalWaves} • ${e.towers.length} defesa(s) • $${e.budget} • Último backup: ${this.formatTimestamp(t)}`}else this.el.autosaveStatusText.textContent=`Campanha e Arsenal salvos em ${this.formatTimestamp(t)} (localStorage + IndexedDB). Inicie ou construa em uma fase para salvar o snapshot tático.`;if(!this.el.saveSlotsGrid)return;const i=Xe.listSlots();this.el.saveSlotsGrid.innerHTML="";for(let n=0;n<3;n+=1){const s=n+1,r=i[n],o=document.createElement("div");o.className=`save-slot-card ${r?"occupied":""}`;const l=document.createElement("div");l.className="slot-header";const c=document.createElement("span");c.className="slot-id",c.textContent=`SLOT 0${s}`;const h=document.createElement("span");h.className="slot-time",h.textContent=r?this.formatTimestamp(r.savedAt):"VAZIO",l.append(c,h);const u=document.createElement("div");if(u.className=`slot-summary ${r?"":"empty"}`,r){const p=Object.keys(r.state.completedStages||{}).length,g=r.state.activeMission,S=g?`Fase ${g.worldId}-${g.stageId} (Onda ${g.completedWave}/${g.totalWaves}, ${g.towers.length} torres)`:`Campanha Fases concluídas: ${p}/15`;u.textContent=`${r.label||S} — ${r.state.warBonds} WB$`}else u.textContent="Slot disponível. Salve aqui sua campanha completa + posição atual das torres.";const d=document.createElement("div");d.className="slot-actions";const f=document.createElement("button");f.className="btn-slot-save",f.textContent=r?"SOBRESCREVER":"SALVAR AQUI",f.addEventListener("click",()=>{he.emit("cmd:saveSlot",s)});const m=document.createElement("button");m.className="btn-slot-load",m.textContent="CARREGAR",m.disabled=!r,m.addEventListener("click",()=>{this.closeCampaignModal(),this.el.goModal.classList.add("hidden"),this.el.radioLog.innerHTML="",he.emit("cmd:loadSlot",s)});const x=document.createElement("button");x.className="btn-slot-del",x.textContent="✕",x.title="Apagar este slot",x.disabled=!r,x.addEventListener("click",()=>{he.emit("cmd:deleteSlot",s)}),d.append(f,m,x),o.append(l,u,d),this.el.saveSlotsGrid.appendChild(o)}}renderState(e){if(this.latestState=e,this.el.missionLabel.textContent=`MUNDO ${e.worldId} // FASE ${e.worldId}-${e.stageId}: ${e.stageTitle||""}`,this.el.budget.textContent=`$${e.budget}`,this.el.wb.textContent=`${(e.warBonds??Xe.getWarBonds()).toLocaleString()} WB$`,this.el.fob.textContent=`${e.fobHp} / ${e.fobMaxHp}`,this.el.fob.className=`metric-value ${e.fobHp<=5?"text-red":e.fobHp<=11?"text-amber":"text-cyan"}`,this.el.wave.textContent=`${e.currentWave} / ${e.totalWaves}`,this.el.enemies.textContent=`${e.activeEnemies}`,this.el.kills.textContent=`${e.totalKills}`,e.hasGlobalAesa?(this.el.aesa.textContent="AESA ONLINE",this.el.aesa.classList.add("online")):(this.el.aesa.textContent="AESA OFF",this.el.aesa.classList.remove("online")),this.renderSpeed(e.timeScale),e.currentWave===0)this.el.btnWave.disabled=!1,this.el.btnWave.textContent="INICIAR ONDA 1";else if(e.currentWave>=e.totalWaves)this.el.btnWave.disabled=!0,this.el.btnWave.textContent=e.waveActive?"ONDA FINAL EM CURSO":"OPERAÇÃO CONCLUÍDA";else if(e.canCallEarly){this.el.btnWave.disabled=!1;const t=e.inIntermission?` (${e.wavePrepTimer}s)`:"";this.el.btnWave.textContent=`CHAMAR ONDA ${e.currentWave+1}${t} +$${e.earlyBonus}`}else this.el.btnWave.disabled=!0,this.el.btnWave.textContent=`ONDA ${e.currentWave} EM COMBATE`;if(e.nextWave){this.el.nextWaveNum.textContent=`ONDA ${e.nextWave.wave}`,this.el.nextWaveTitle.textContent=e.nextWave.title,this.el.nextWaveBrief.textContent=e.nextWave.brief,this.el.nextWaveUnits.innerHTML="";for(const t of e.nextWave.units){const i=document.createElement("span");let n="unit-pill";t.isBoss?n+=" boss":t.type==="stealth"?n+=" stealth":t.type==="mbt"?n+=" heavy":t.domain==="air"&&(n+=" air"),i.className=n,i.textContent=`${t.count}x ${t.shortName} (${t.armorLabel})`,this.el.nextWaveUnits.appendChild(i)}}else this.el.nextWaveNum.textContent="FINAL",this.el.nextWaveTitle.textContent="Onda Final em Combate",this.el.nextWaveBrief.textContent="Elimine todas as forças hostis para vencer a fase!",this.el.nextWaveUnits.innerHTML="";this.refreshArsenalCardUnlockState();for(const[t,i]of this.buildCards){const n=Xe.isTowerUnlocked(t),s=this.getEffectiveCost(t);i.classList.toggle("unaffordable",n&&e.budget<s)}this.renderSupportButton("a10",e.airSupport.a10,e.budget,this.el.btnA10,this.el.cdA10,this.el.txtCdA10),this.renderSupportButton("hellfire",e.airSupport.hellfire,e.budget,this.el.btnHellfire,this.el.cdHellfire,this.el.txtCdHellfire),this.renderSupportButton("b52",e.airSupport.b52,e.budget,this.el.btnB52,this.el.cdB52,this.el.txtCdB52),this.selectedTower&&this.selectedTower.nextUpgrade&&(this.el.btnUpgrade.disabled=e.budget<this.selectedTower.nextUpgrade.cost)}renderSupportButton(e,t,i,n,s,r){if(!Xe.isSupportUnlocked(e)){const h=dn[e];s.style.width="0%",r.textContent=`🔒 ${h.unlockCostWB} WB$`,r.style.color="#facc15",n.disabled=!1,n.classList.add("locked");return}n.classList.remove("locked"),e==="b52"&&(this.el.costB52.textContent=`$${t.cost}`);const l=t.timer<=0,c=l?100:Math.max(0,Math.min(100,(t.cooldown-t.timer)/t.cooldown*100));s.style.width=`${c}%`,s.style.background=l?"#4ade80":"#facc15",r.textContent=l?i>=t.cost?"PRONTO PARA EMPREGO":`FALTA $${t.cost}`:`RECARGA: ${Math.ceil(t.timer)}s`,r.style.color=l&&i>=t.cost?"#4ade80":"#facc15",n.disabled=!l||i<t.cost}renderSpeed(e){document.querySelectorAll(".btn-speed").forEach(t=>{t.classList.toggle("active",Number(t.dataset.speed)===e)})}renderActiveTool(e){this.activeTool=e;for(const[n,s]of this.buildCards)s.classList.toggle("selected",e?.kind==="build"&&e.towerId===n);if(this.el.btnA10.classList.toggle("selected",e?.kind==="support"&&e.supportId==="a10"),this.el.btnHellfire.classList.toggle("selected",e?.kind==="support"&&e.supportId==="hellfire"),this.el.btnB52.classList.toggle("selected",e?.kind==="support"&&e.supportId==="b52"),!e){this.el.toolBanner.classList.add("hidden"),this.el.btnRotateA10?.classList.add("hidden");return}this.setMobileSidebarOpen(!1),this.el.toolBanner.classList.remove("hidden");const t=this.el.toolBannerText||this.el.toolBanner,i=e.kind==="support"&&e.supportId==="a10";if(this.el.btnRotateA10?.classList.toggle("hidden",!i),e.kind==="build"){const n=Li[e.towerId],s=this.getEffectiveCost(e.towerId);t.textContent=`CONSTRUÇÃO: ${n.name} ($${s}) — Toque no grid para posicionar`}else i?t.textContent="A-10 WARTHOG: Toque ou arraste no alvo para definir ataque":e.supportId==="b52"?t.textContent="B-52 STRATOFORTRESS: Toque na rota para bombardeio em tapete":t.textContent="DRONE HELLFIRE: Toque no alvo para disparar míssil"}setMobileSidebarOpen(e){const t=!!e&&window.innerWidth<=1024;this.el.tacticalSidebar?.classList.toggle("sidebar-open",t),this.el.sidebarBackdrop?.classList.toggle("hidden",!t)}renderInspector(e){if(this.selectedTower=e,!e){this.el.inspLevel.textContent="NENHUMA",this.el.inspEmpty.classList.remove("hidden"),this.el.inspBody.classList.add("hidden");return}this.el.inspEmpty.classList.add("hidden"),this.el.inspBody.classList.remove("hidden"),this.el.inspLevel.textContent=`NV ${e.level} / ${e.maxLevel}`,this.el.inspName.textContent=e.name,this.el.inspRole.textContent=`${e.role} // ${e.domain==="air"?"EXCLUSIVO AÉREO":e.domain==="ground"?"EXCLUSIVO TERRA":e.domain==="both"?"TERRA + AR":"OBSTÁCULO"}${e.empDisabled?" [EMP OFF]":""}`,this.el.inspTotalDmg.textContent=Math.round(e.totalDamage).toLocaleString(),this.el.inspKills.textContent=e.kills;const t=e.maxHp>0?Math.max(0,Math.min(100,e.hp/e.maxHp*100)):100;this.el.inspHpText.textContent=`${e.hp} / ${e.maxHp}`,this.el.inspHpFill.style.width=`${t}%`,this.el.inspHpFill.style.background=t>40?"#38bdf8":t>20?"#fb923c":"#ef4444";const i=e.hp<e.maxHp;if(this.el.btnRepair.disabled=!i||(this.latestState?this.latestState.budget<e.repairCost:!1),this.el.btnRepair.textContent=i?`🔧 REPARAR DEFESA ($${e.repairCost}) [R]`:"✅ INTEGRIDADE 100%",e.isBarrier)this.el.inspSpecs.textContent=e.notes,this.el.prioSection.classList.add("hidden");else{this.el.inspSpecs.innerHTML=`
        Alcance: <strong>${e.range}m</strong>${e.minRange>0?` (Min ${e.minRange}m)`:""} |
        Cadência: <strong>${e.fireRate>0?`${e.fireRate.toFixed(1)}/s`:"Contínuo"}</strong> |
        Dano: <strong>${e.damage}</strong><br/>
        <span>${e.notes}</span>
      `,this.el.prioSection.classList.toggle("hidden",e.isSupportAura);for(const[n,s]of this.prioButtons){s.classList.toggle("active",e.priority===n);const r=n==="air_first"&&e.domain==="ground"||e.domain==="air"&&n==="air_first";s.disabled=r}}e.nextUpgrade?(this.el.btnUpgrade.disabled=this.latestState?this.latestState.budget<e.nextUpgrade.cost:!1,this.el.btnUpgradeTitle.textContent=`UPGRADE NV${e.level+1}: ${e.nextUpgrade.name} ($${e.nextUpgrade.cost})`,this.el.btnUpgradeDesc.textContent=e.nextUpgrade.notes):(this.el.btnUpgrade.disabled=!0,this.el.btnUpgradeTitle.textContent="NÍVEL MÁXIMO ATINGIDO",this.el.btnUpgradeDesc.textContent="Armamento operando em capacidade plena."),this.el.btnSell.textContent=`VENDER TORRE (+$${e.sellRefund})`}appendRadio({text:e,level:t,wave:i}){const n=document.createElement("div");for(n.className=`radio-line ${t||"info"}`,n.textContent=`[W${String(i).padStart(2,"0")}] ${e}`,this.el.radioLog.prepend(n);this.el.radioLog.children.length>24;)this.el.radioLog.removeChild(this.el.radioLog.lastChild)}showGameOver({victory:e,wave:t,totalWaves:i,kills:n,wbEarned:s,worldId:r,stageId:o}){this.el.goModal.classList.remove("hidden"),this.el.goBadge.textContent=e?`FASE ${r}-${o} CONCLUÍDA`:"FOB PERDIDA // DEFCON 1",this.el.goTitle.textContent=e?"VITÓRIA TÁTICA TOTAL":"DERROTA NA LINHA DE FRENTE",this.el.goTitle.style.color=e?"#4ade80":"#f87171",this.el.goDesc.textContent=e?`Todas as ${i} ondas hostis foram neutralizadas. Rejogue para farmar mais War Bonds (WB$) ou avance para a próxima fase!`:"As forças hostis romperam o perímetro. Rejogue fases anteriores para aprimorar seu Arsenal com War Bonds (WB$)!",this.el.goWave.textContent=`${t} / ${i}`,this.el.goKills.textContent=`${n}`,this.el.goWb.textContent=`+${s||0} WB$`;const l=e&&this.getNextStageIds(r,o)!==null;this.el.btnNextStage.classList.toggle("hidden",!l)}}new f_;const p_=document.getElementById("game-container");window.__DEFCON_GAME__=new d_(p_);"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(()=>{})});
