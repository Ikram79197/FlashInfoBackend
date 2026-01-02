import{r as o,a as I}from"../react-DHBI0EtI.js";import{d as p,e as f,k as h,c as x,b as E,g as a}from"../@babel/runtime-bjg2LrFx.js";import{A as B,B as U,C as M,a as Q,b as q,E as D,c as W,d as G,e as H,I as J,f as K,L as V,g as X,h as Y,i as Z,M as ee,P as ne,Q as re,R as oe,S as te,j as ae,U as ie}from"./icons-svg-jdGhBIRC.js";import{c as le}from"../classnames-C9FZUsQl.js";import{g as ce,b as se}from"./colors-Dib51zE1.js";import{g as ue,a as fe,b as de}from"../rc-util-DJfO4RUt.js";var k=o.createContext({});function me(n){return n.replace(/-(.)/g,function(e,r){return r.toUpperCase()})}function Ce(n,e){de(n,"[@ant-design/icons] ".concat(e))}function b(n){return p(n)==="object"&&typeof n.name=="string"&&typeof n.theme=="string"&&(p(n.icon)==="object"||typeof n.icon=="function")}function T(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Object.keys(n).reduce(function(e,r){var i=n[r];switch(r){case"class":e.className=i,delete e.class;break;default:delete e[r],e[me(r)]=i}return e},{})}function w(n,e,r){return r?I.createElement(n.tag,f(f({key:e},T(n.attrs)),r),(n.children||[]).map(function(i,l){return w(i,"".concat(e,"-").concat(n.tag,"-").concat(l))})):I.createElement(n.tag,f({key:e},T(n.attrs)),(n.children||[]).map(function(i,l){return w(i,"".concat(e,"-").concat(n.tag,"-").concat(l))}))}function S(n){return ce(n)[0]}function L(n){return n?Array.isArray(n)?n:[n]:[]}var ve=`
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
`,ge=function(e){var r=o.useContext(k),i=r.csp,l=r.prefixCls,u=r.layer,c=ve;l&&(c=c.replace(/anticon/g,l)),u&&(c="@layer ".concat(u,` {
`).concat(c,`
}`)),o.useEffect(function(){var d=e.current,v=ue(d);fe(c,"@ant-design-icons",{prepend:!u,csp:i,attachTo:v})},[])},ye=["icon","className","onClick","style","primaryColor","secondaryColor"],g={primaryColor:"#333",secondaryColor:"#E6E6E6",calculated:!1};function Re(n){var e=n.primaryColor,r=n.secondaryColor;g.primaryColor=e,g.secondaryColor=r||S(e),g.calculated=!!r}function Oe(){return f({},g)}var C=function(e){var r=e.icon,i=e.className,l=e.onClick,u=e.style,c=e.primaryColor,d=e.secondaryColor,v=h(e,ye),y=o.useRef(),m=g;if(c&&(m={primaryColor:c,secondaryColor:d||S(c)}),ge(y),Ce(b(r),"icon should be icon definiton, but got ".concat(r)),!b(r))return null;var s=r;return s&&typeof s.icon=="function"&&(s=f(f({},s),{},{icon:s.icon(m.primaryColor,m.secondaryColor)})),w(s.icon,"svg-".concat(s.name),f(f({className:i,onClick:l,style:u,"data-icon":s.name,width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"},v),{},{ref:y}))};C.displayName="IconReact";C.getTwoToneColors=Oe;C.setTwoToneColors=Re;function N(n){var e=L(n),r=x(e,2),i=r[0],l=r[1];return C.setTwoToneColors({primaryColor:i,secondaryColor:l})}function we(){var n=C.getTwoToneColors();return n.calculated?[n.primaryColor,n.secondaryColor]:n.primaryColor}var $e=["className","icon","spin","rotate","tabIndex","onClick","twoToneColor"];N(se.primary);var t=o.forwardRef(function(n,e){var r=n.className,i=n.icon,l=n.spin,u=n.rotate,c=n.tabIndex,d=n.onClick,v=n.twoToneColor,y=h(n,$e),m=o.useContext(k),s=m.prefixCls,R=s===void 0?"anticon":s,_=m.rootClassName,F=le(_,R,E(E({},"".concat(R,"-").concat(i.name),!!i.name),"".concat(R,"-spin"),!!l||i.name==="loading"),r),O=c;O===void 0&&d&&(O=-1);var A=u?{msTransform:"rotate(".concat(u,"deg)"),transform:"rotate(".concat(u,"deg)")}:void 0,j=L(v),$=x(j,2),z=$[0],P=$[1];return o.createElement("span",a({role:"img","aria-label":i.name},y,{ref:e,tabIndex:O,onClick:d,className:F}),o.createElement(C,{icon:i,primaryColor:z,secondaryColor:P,style:A}))});t.displayName="AntdIcon";t.getTwoToneColor=we;t.setTwoToneColor=N;var Ie=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:B}))},Ve=o.forwardRef(Ie),pe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:U}))},Xe=o.forwardRef(pe),Ee=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:M}))},Ye=o.forwardRef(Ee),be=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:Q}))},Ze=o.forwardRef(be),Te=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:q}))},en=o.forwardRef(Te),he=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:D}))},nn=o.forwardRef(he),xe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:W}))},rn=o.forwardRef(xe),ke=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:G}))},on=o.forwardRef(ke),Se=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:H}))},tn=o.forwardRef(Se),Le=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:J}))},an=o.forwardRef(Le),Ne=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:K}))},ln=o.forwardRef(Ne),_e=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:V}))},cn=o.forwardRef(_e),Fe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:X}))},sn=o.forwardRef(Fe),Ae=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:Y}))},un=o.forwardRef(Ae),je=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:Z}))},fn=o.forwardRef(je),ze=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ee}))},dn=o.forwardRef(ze),Pe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ne}))},mn=o.forwardRef(Pe),Be=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:re}))},Cn=o.forwardRef(Be),Ue=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:oe}))},vn=o.forwardRef(Ue),Me=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:te}))},gn=o.forwardRef(Me),Qe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ae}))},yn=o.forwardRef(Qe),qe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ie}))},Rn=o.forwardRef(qe);export{k as I,rn as R,Ze as a,an as b,Ye as c,en as d,sn as e,Xe as f,cn as g,vn as h,nn as i,mn as j,Cn as k,tn as l,on as m,gn as n,Ve as o,Rn as p,un as q,dn as r,ln as s,yn as t,fn as u};
