import{r as o,a as I}from"../react-DHBI0EtI.js";import{d as E,e as f,k as T,c as x,b as p,g as a}from"../@babel/runtime-bjg2LrFx.js";import{A as B,B as U,C as M,a as Q,b as q,c as D,E as W,d as G,e as H,f as J,I as K,g as V,L as X,h as Y,i as Z,j as ee,M as ne,P as re,Q as oe,R as te,S as ae,k as ie,U as le}from"./icons-svg-COzDYt5I.js";import{c as ce}from"../classnames-C9FZUsQl.js";import{g as se,b as ue}from"./colors-Dib51zE1.js";import{g as fe,a as de,b as me}from"../rc-util-DJfO4RUt.js";var k=o.createContext({});function Ce(n){return n.replace(/-(.)/g,function(e,r){return r.toUpperCase()})}function ve(n,e){me(n,"[@ant-design/icons] ".concat(e))}function h(n){return E(n)==="object"&&typeof n.name=="string"&&typeof n.theme=="string"&&(E(n.icon)==="object"||typeof n.icon=="function")}function b(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Object.keys(n).reduce(function(e,r){var i=n[r];switch(r){case"class":e.className=i,delete e.class;break;default:delete e[r],e[Ce(r)]=i}return e},{})}function w(n,e,r){return r?I.createElement(n.tag,f(f({key:e},b(n.attrs)),r),(n.children||[]).map(function(i,l){return w(i,"".concat(e,"-").concat(n.tag,"-").concat(l))})):I.createElement(n.tag,f({key:e},b(n.attrs)),(n.children||[]).map(function(i,l){return w(i,"".concat(e,"-").concat(n.tag,"-").concat(l))}))}function S(n){return se(n)[0]}function L(n){return n?Array.isArray(n)?n:[n]:[]}var ge=`
.anticon {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin::before,
.anticon-spin {
  display: inline-block;
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`,ye=function(e){var r=o.useContext(k),i=r.csp,l=r.prefixCls,u=r.layer,c=ge;l&&(c=c.replace(/anticon/g,l)),u&&(c="@layer ".concat(u,` {
`).concat(c,`
}`)),o.useEffect(function(){var d=e.current,v=fe(d);de(c,"@ant-design-icons",{prepend:!u,csp:i,attachTo:v})},[])},Re=["icon","className","onClick","style","primaryColor","secondaryColor"],g={primaryColor:"#333",secondaryColor:"#E6E6E6",calculated:!1};function Oe(n){var e=n.primaryColor,r=n.secondaryColor;g.primaryColor=e,g.secondaryColor=r||S(e),g.calculated=!!r}function we(){return f({},g)}var C=function(e){var r=e.icon,i=e.className,l=e.onClick,u=e.style,c=e.primaryColor,d=e.secondaryColor,v=T(e,Re),y=o.useRef(),m=g;if(c&&(m={primaryColor:c,secondaryColor:d||S(c)}),ye(y),ve(h(r),"icon should be icon definiton, but got ".concat(r)),!h(r))return null;var s=r;return s&&typeof s.icon=="function"&&(s=f(f({},s),{},{icon:s.icon(m.primaryColor,m.secondaryColor)})),w(s.icon,"svg-".concat(s.name),f(f({className:i,onClick:l,style:u,"data-icon":s.name,width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"},v),{},{ref:y}))};C.displayName="IconReact";C.getTwoToneColors=we;C.setTwoToneColors=Oe;function N(n){var e=L(n),r=x(e,2),i=r[0],l=r[1];return C.setTwoToneColors({primaryColor:i,secondaryColor:l})}function $e(){var n=C.getTwoToneColors();return n.calculated?[n.primaryColor,n.secondaryColor]:n.primaryColor}var Ie=["className","icon","spin","rotate","tabIndex","onClick","twoToneColor"];N(ue.primary);var t=o.forwardRef(function(n,e){var r=n.className,i=n.icon,l=n.spin,u=n.rotate,c=n.tabIndex,d=n.onClick,v=n.twoToneColor,y=T(n,Ie),m=o.useContext(k),s=m.prefixCls,R=s===void 0?"anticon":s,_=m.rootClassName,F=ce(_,R,p(p({},"".concat(R,"-").concat(i.name),!!i.name),"".concat(R,"-spin"),!!l||i.name==="loading"),r),O=c;O===void 0&&d&&(O=-1);var A=u?{msTransform:"rotate(".concat(u,"deg)"),transform:"rotate(".concat(u,"deg)")}:void 0,j=L(v),$=x(j,2),z=$[0],P=$[1];return o.createElement("span",a({role:"img","aria-label":i.name},y,{ref:e,tabIndex:O,onClick:d,className:F}),o.createElement(C,{icon:i,primaryColor:z,secondaryColor:P,style:A}))});t.displayName="AntdIcon";t.getTwoToneColor=$e;t.setTwoToneColor=N;var Ee=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:B}))},Ye=o.forwardRef(Ee),pe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:U}))},Ze=o.forwardRef(pe),he=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:M}))},en=o.forwardRef(he),be=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:Q}))},nn=o.forwardRef(be),Te=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:q}))},rn=o.forwardRef(Te),xe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:D}))},on=o.forwardRef(xe),ke=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:W}))},tn=o.forwardRef(ke),Se=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:G}))},an=o.forwardRef(Se),Le=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:H}))},ln=o.forwardRef(Le),Ne=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:J}))},cn=o.forwardRef(Ne),_e=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:K}))},sn=o.forwardRef(_e),Fe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:V}))},un=o.forwardRef(Fe),Ae=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:X}))},fn=o.forwardRef(Ae),je=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:Y}))},dn=o.forwardRef(je),ze=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:Z}))},mn=o.forwardRef(ze),Pe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ee}))},Cn=o.forwardRef(Pe),Be=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ne}))},vn=o.forwardRef(Be),Ue=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:re}))},gn=o.forwardRef(Ue),Me=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:oe}))},yn=o.forwardRef(Me),Qe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:te}))},Rn=o.forwardRef(Qe),qe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ae}))},On=o.forwardRef(qe),De=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ie}))},wn=o.forwardRef(De),We=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:le}))},$n=o.forwardRef(We);export{k as I,an as R,rn as a,sn as b,en as c,on as d,dn as e,Ze as f,fn as g,Rn as h,tn as i,gn as j,yn as k,cn as l,ln as m,On as n,nn as o,Ye as p,$n as q,mn as r,vn as s,un as t,wn as u,Cn as v};
