var d=Object.defineProperty;var s=Object.getOwnPropertySymbols;var r=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable;var a=(o,e,t)=>e in o?d(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,n=(o,e)=>{for(var t in e||(e={}))r.call(e,t)&&a(o,t,e[t]);if(s)for(var t of s(e))u.call(e,t)&&a(o,t,e[t]);return o};class h{constructor(e={}){this.config=n({default:!1,cookie:"cead",attr:"data-cead",srcAttr:"data-src",link:"#cead",cookies:[]},e),this.el=document.querySelector(".cead"),this.focus=!1,this.init()}init(){this.getCookie(this.config.cookie)||this.el.setAttribute("data-show","true"),this.ready(),document.onreadystatechange=()=>{document.readyState==="interactive"&&this.ready()};const t=document.querySelector(".cead__btn--accept");t&&t.addEventListener("click",()=>this.accept());const i=document.querySelector(".cead__btn--decline");i&&i.addEventListener("click",()=>this.decline()),this.links()}ready(){const e=this.getCookie(this.config.cookie),t=this.config.default?e!=="false":e==="true";t&&this.activate(),window.dispatchEvent(new CustomEvent("cead:ready",{detail:{status:t}}))}accept(){this.el.removeAttribute("data-show"),this.focus&&this.focus.focus(),this.setCookie(!0),this.activate(),window.dispatchEvent(new CustomEvent("cead:change",{detail:{status:!0}}))}decline(){this.el.removeAttribute("data-show"),this.focus&&this.focus.focus(),this.setCookie(!1),this.deactivate(),window.dispatchEvent(new CustomEvent("cead:change",{detail:{status:!1}}))}getCookie(e){var t;return((t=document.cookie.match("(^|;)\\s*"+e+"\\s*=\\s*([^;]+)"))==null?void 0:t.pop())||""}activate(){const e=document.querySelectorAll(`[${this.config.attr}]`);for(let t of e)if(!t.hasAttribute("src")&&!t.hasAttribute(this.config.srcAttr)){const i=t.cloneNode(!0);i.setAttribute("type","text/javascript"),t.after(i),t.remove()}else t.setAttribute("src",t.getAttribute(this.config.srcAttr))}deactivate(){var t;const e=document.cookie.split(";");for(let i of e){const c=((t=i.match("\\s*(.*?)\\s*=.*"))==null?void 0:t[1])||"none";this.config.cookies.includes(c)&&(document.cookie=c+"=; path=/; domain="+document.domain+"; Expires=Thu, 01 Jan 1970 00:00:01 GMT;",document.cookie=c+"=; path=/; domain=."+document.domain+"; Expires=Thu, 01 Jan 1970 00:00:01 GMT;")}}setCookie(e){let t=new Date;t.setFullYear(t.getFullYear()+1),document.cookie=`${this.config.cookie}=${e}; path=/; domain=.${document.domain}; Expires=${t.toUTCString()}; SameSite=Lax`}links(){document.querySelectorAll(`a[href="${this.config.link}"]`).forEach(t=>{t.addEventListener("click",i=>{i.preventDefault(),this.focus=document.activeel,this.el.setAttribute("data-show","true"),this.el.focus()})})}}export default h;
