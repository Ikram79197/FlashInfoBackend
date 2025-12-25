import{r as o,a as $}from"../react-DHBI0EtI.js";import{d as p,e as f,k as h,c as x,b as E,g as a}from"../@babel/runtime-bjg2LrFx.js";import{B as A,C as U,a as M,b as Q,E as q,c as D,d as W,e as G,I as H,f as J,L as K,g as V,h as X,i as Y,M as Z,P as ee,Q as ne,R as re,S as oe,j as te,U as ae}from"./icons-svg-Dywg6pqi.js";import{c as ie}from"../classnames-C9FZUsQl.js";import{g as le,b as ce}from"./colors-Dib51zE1.js";import{g as se,a as ue,b as fe}from"../rc-util-CR6zMcjk.js";var k=o.createContext({});function de(n){return n.replace(/-(.)/g,function(e,r){return r.toUpperCase()})}function me(n,e){fe(n,"[@ant-design/icons] ".concat(e))}function b(n){return p(n)==="object"&&typeof n.name=="string"&&typeof n.theme=="string"&&(p(n.icon)==="object"||typeof n.icon=="function")}function T(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Object.keys(n).reduce(function(e,r){var i=n[r];switch(r){case"class":e.className=i,delete e.class;break;default:delete e[r],e[de(r)]=i}return e},{})}function w(n,e,r){return r?$.createElement(n.tag,f(f({key:e},T(n.attrs)),r),(n.children||[]).map(function(i,l){return w(i,"".concat(e,"-").concat(n.tag,"-").concat(l))})):$.createElement(n.tag,f({key:e},T(n.attrs)),(n.children||[]).map(function(i,l){return w(i,"".concat(e,"-").concat(n.tag,"-").concat(l))}))}function S(n){return le(n)[0]}function L(n){return n?Array.isArray(n)?n:[n]:[]}var Ce=`
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
`,ve=function(e){var r=o.useContext(k),i=r.csp,l=r.prefixCls,u=r.layer,c=Ce;l&&(c=c.replace(/anticon/g,l)),u&&(c="@layer ".concat(u,` {
`).concat(c,`
}`)),o.useEffect(function(){var d=e.current,v=se(d);ue(c,"@ant-design-icons",{prepend:!u,csp:i,attachTo:v})},[])},ge=["icon","className","onClick","style","primaryColor","secondaryColor"],g={primaryColor:"#333",secondaryColor:"#E6E6E6",calculated:!1};function ye(n){var e=n.primaryColor,r=n.secondaryColor;g.primaryColor=e,g.secondaryColor=r||S(e),g.calculated=!!r}function Re(){return f({},g)}var C=function(e){var r=e.icon,i=e.className,l=e.onClick,u=e.style,c=e.primaryColor,d=e.secondaryColor,v=h(e,ge),y=o.useRef(),m=g;if(c&&(m={primaryColor:c,secondaryColor:d||S(c)}),ve(y),me(b(r),"icon should be icon definiton, but got ".concat(r)),!b(r))return null;var s=r;return s&&typeof s.icon=="function"&&(s=f(f({},s),{},{icon:s.icon(m.primaryColor,m.secondaryColor)})),w(s.icon,"svg-".concat(s.name),f(f({className:i,onClick:l,style:u,"data-icon":s.name,width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"},v),{},{ref:y}))};C.displayName="IconReact";C.getTwoToneColors=Re;C.setTwoToneColors=ye;function N(n){var e=L(n),r=x(e,2),i=r[0],l=r[1];return C.setTwoToneColors({primaryColor:i,secondaryColor:l})}function Oe(){var n=C.getTwoToneColors();return n.calculated?[n.primaryColor,n.secondaryColor]:n.primaryColor}var we=["className","icon","spin","rotate","tabIndex","onClick","twoToneColor"];N(ce.primary);var t=o.forwardRef(function(n,e){var r=n.className,i=n.icon,l=n.spin,u=n.rotate,c=n.tabIndex,d=n.onClick,v=n.twoToneColor,y=h(n,we),m=o.useContext(k),s=m.prefixCls,R=s===void 0?"anticon":s,_=m.rootClassName,F=ie(_,R,E(E({},"".concat(R,"-").concat(i.name),!!i.name),"".concat(R,"-spin"),!!l||i.name==="loading"),r),O=c;O===void 0&&d&&(O=-1);var j=u?{msTransform:"rotate(".concat(u,"deg)"),transform:"rotate(".concat(u,"deg)")}:void 0,z=L(v),I=x(z,2),P=I[0],B=I[1];return o.createElement("span",a({role:"img","aria-label":i.name},y,{ref:e,tabIndex:O,onClick:d,className:F}),o.createElement(C,{icon:i,primaryColor:P,secondaryColor:B,style:j}))});t.displayName="AntdIcon";t.getTwoToneColor=Oe;t.setTwoToneColor=N;var Ie=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:A}))},Je=o.forwardRef(Ie),$e=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:U}))},Ke=o.forwardRef($e),pe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:M}))},Ve=o.forwardRef(pe),Ee=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:Q}))},Xe=o.forwardRef(Ee),be=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:q}))},Ye=o.forwardRef(be),Te=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:D}))},Ze=o.forwardRef(Te),he=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:W}))},en=o.forwardRef(he),xe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:G}))},nn=o.forwardRef(xe),ke=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:H}))},rn=o.forwardRef(ke),Se=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:J}))},on=o.forwardRef(Se),Le=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:K}))},tn=o.forwardRef(Le),Ne=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:V}))},an=o.forwardRef(Ne),_e=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:X}))},ln=o.forwardRef(_e),Fe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:Y}))},cn=o.forwardRef(Fe),je=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:Z}))},sn=o.forwardRef(je),ze=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ee}))},un=o.forwardRef(ze),Pe=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ne}))},fn=o.forwardRef(Pe),Be=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:re}))},dn=o.forwardRef(Be),Ae=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:oe}))},mn=o.forwardRef(Ae),Ue=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:te}))},Cn=o.forwardRef(Ue),Me=function(e,r){return o.createElement(t,a({},e,{ref:r,icon:ae}))},vn=o.forwardRef(Me);export{k as I,Ze as R,Ve as a,rn as b,Ke as c,Xe as d,an as e,Je as f,tn as g,dn as h,Ye as i,un as j,fn as k,nn as l,en as m,mn as n,vn as o,ln as p,sn as q,on as r,Cn as s,cn as t};
