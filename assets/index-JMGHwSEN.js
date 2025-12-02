const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Home-C2rJIz0P.js","assets/TaskCard-sLMCe87l.js","assets/TaskEditModal-BHXB4Oq6.js","assets/NeonButton-DWD2bhQA.js","assets/ConfirmModal-BsncAfHd.js","assets/taskFilters-03Vb9Oq6.js","assets/idb-Dob3nYDb.js","assets/Projetos-BYYhdWss.js","assets/Estudos-BXEAwbZo.js","assets/Rotina-BtRuiNiy.js"])))=>i.map(i=>d[i]);
import{o as gh}from"./idb-Dob3nYDb.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();const _h="modulepreload",yh=function(r){return"/demandas-pro/"+r},da={},En=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),u=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=Promise.allSettled(t.map(h=>{if(h=yh(h),h in da)return;da[h]=!0;const d=h.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${m}`))return;const _=document.createElement("link");if(_.rel=d?"stylesheet":_h,d||(_.as="script"),_.crossOrigin="",_.href=h,u&&_.setAttribute("nonce",u),document.head.appendChild(_),d)return new Promise((A,P)=>{_.addEventListener("load",A),_.addEventListener("error",()=>P(new Error(`Unable to preload CSS for ${h}`)))})}))}function o(a){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=a,window.dispatchEvent(u),!u.defaultPrevented)throw a}return s.then(a=>{for(const u of a||[])u.status==="rejected"&&o(u.reason);return e().catch(o)})},Eh={};class Th{constructor(e,t="app"){this.routes=e,this.container=document.getElementById(t),this.currentView=null,this.basePath=this.detectBasePath(),this.currentPath=this.normalizePath(window.location.pathname),this.subscribers=[],this.init()}detectBasePath(){if(typeof import.meta<"u"&&Eh){const n="/demandas-pro/";return n.endsWith("/")?n:n+"/"}const e=window.location.pathname;if(e.startsWith("/demandas-pro/"))return"/demandas-pro/";const t=e.split("/").filter(n=>n);if(t.length>0){const n=t[0];if(!["","projetos","estudos","rotina","terapeutico"].includes(n)&&e.startsWith("/"+n+"/"))return"/"+n+"/"}return"/"}normalizePath(e){return e?!this.basePath||this.basePath==="/"?e===""?"/":e:e.startsWith(this.basePath)?e.slice(this.basePath.length-1)||"/":e===this.basePath.slice(0,-1)?"/":e||"/":"/"}init(){window.addEventListener("popstate",e=>{const t=this.normalizePath(window.location.pathname);this.handleRoute(t,!1),this.notifySubscribers(t)}),document.addEventListener("click",e=>{const t=e.target.closest("a[data-route]");if(t){e.preventDefault();const n=t.getAttribute("data-route")||t.getAttribute("href");this.navigate(n)}}),this.handleRoute(this.currentPath||"/",!1)}navigate(e,t=!0){const n=this.normalizePath(e),s=this.basePath&&this.basePath!=="/"?this.basePath.slice(0,-1)+n:n;t&&window.history.pushState({},"",s),this.handleRoute(n,t),this.notifySubscribers(n)}notifySubscribers(e){this.subscribers&&this.subscribers.forEach(t=>{try{t(e)}catch(n){console.error("Erro ao notificar subscriber:",n)}})}onRouteChange(e){return this.subscribers||(this.subscribers=[]),this.subscribers.push(e),()=>{this.subscribers=this.subscribers.filter(t=>t!==e)}}async handleRoute(e,t=!0){e=this.normalizePath(e),e=e===""?"/":e;const n=this.findRoute(e);if(!n)if(console.warn(`Rota não encontrada: ${e}`),e==="/"||e===""){e="/";const s=this.findRoute("/");if(s)n=s;else{console.error("Rota raiz não encontrada");return}}else{this.navigate("/",!1);return}this.currentPath=e;try{const s=await n.component(),o=s.default||s;this.currentView&&this.currentView.destroy&&this.currentView.destroy();let a=null;if(typeof o=="function"){const u=o();u&&typeof u.render=="function"?(this.render(u.render()),u.mount&&(a=u.mount())):this.render(u)}else o&&typeof o.render=="function"?(this.render(o.render()),o.mount&&(a=o.mount())):this.render(o);this.currentView=a||o,this.updateActiveLinks(e)}catch(s){console.error(`Erro ao carregar rota ${e}:`,s)}}findRoute(e){if(this.routes[e])return{path:e,component:this.routes[e]};for(const[t,n]of Object.entries(this.routes))if(this.pathToRegex(t).test(e))return{path:t,component:n,params:this.extractParams(t,e)};return null}pathToRegex(e){const t=e.replace(/\//g,"\\/").replace(/:(\w+)/g,"([^/]+)");return new RegExp(`^${t}$`)}extractParams(e,t){const n={},s=e.split("/"),o=t.split("/");return s.forEach((a,u)=>{if(a.startsWith(":")){const h=a.slice(1);n[h]=o[u]}}),n}render(e){if(!this.container){console.error("Container não encontrado");return}typeof e=="string"?this.container.innerHTML=e:e&&typeof e=="object"&&e.nodeType&&(this.container.innerHTML="",this.container.appendChild(e))}updateActiveLinks(e){document.querySelectorAll("[data-route], a[href]").forEach(t=>{(t.getAttribute("data-route")||t.getAttribute("href"))===e?t.classList.add("active"):t.classList.remove("active")})}getCurrentPath(){return this.currentPath}}const vh={"/":()=>En(()=>import("./Home-C2rJIz0P.js"),__vite__mapDeps([0,1,2,3,4,5,6])).then(r=>r.default),"/projetos":()=>En(()=>import("./Projetos-BYYhdWss.js"),__vite__mapDeps([7,1,2,3,4,6])).then(r=>r.default),"/estudos":()=>En(()=>import("./Estudos-BXEAwbZo.js"),__vite__mapDeps([8,3,6])).then(r=>r.default),"/rotina":()=>En(()=>import("./Rotina-BtRuiNiy.js"),__vite__mapDeps([9,1,5,4,6])).then(r=>r.default),"/terapeutico":()=>En(()=>import("./Terapeutico-CvI2XKrm.js"),[]).then(r=>r.default)};let jt=null;function wh(r="app"){return jt=new Th(vh,r),jt}class Ih{constructor(){this.isOpen=!1,this.isMobile=window.innerWidth<1024,this.init()}init(){this.createSidebar(),this.setupEventListeners(),this.handleResize()}createSidebar(){const e=document.createElement("aside");e.className="sidebar",e.id="sidebar",e.innerHTML=`
      <!-- Logo Area -->
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="sidebar-logo-icon-wrapper">
            <div class="sidebar-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div class="sidebar-logo-glow"></div>
          </div>
          <div class="sidebar-logo-text">
            <h1 class="sidebar-logo-title">Gerenciador</h1>
            <p class="sidebar-logo-subtitle">Pedro</p>
          </div>
        </div>
        <button class="sidebar-close" aria-label="Fechar menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Divider -->
      <div class="sidebar-divider"></div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <a href="/" data-route="/" class="sidebar-link active">
          <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="sidebar-link-text">Home</span>
        </a>
        <a href="/projetos" data-route="/projetos" class="sidebar-link">
          <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span class="sidebar-link-text">Projetos</span>
        </a>
        <a href="/estudos" data-route="/estudos" class="sidebar-link">
          <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span class="sidebar-link-text">Estudos</span>
        </a>
        <a href="/rotina" data-route="/rotina" class="sidebar-link">
          <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span class="sidebar-link-text">Minha Rotina</span>
        </a>
        <a href="/terapeutico" data-route="/terapeutico" class="sidebar-link">
          <svg class="sidebar-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <span class="sidebar-link-text">Espaço Terapêutico</span>
        </a>
      </nav>

      <!-- Footer Actions -->
      <div class="sidebar-footer">
        <div class="sidebar-footer-content">
          <button class="sidebar-footer-button" data-action="settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
            </svg>
            <span>Configurações</span>
          </button>
          <button class="sidebar-footer-button sidebar-footer-button-danger" data-action="logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sair</span>
          </button>
        </div>
      </div>
    `;const t=document.createElement("div");t.className="sidebar-overlay",t.id="sidebar-overlay",document.body.appendChild(t),document.body.appendChild(e);const n=e.querySelector(".sidebar-close");n&&n.addEventListener("click",()=>this.close()),t.addEventListener("click",()=>this.close()),e.querySelectorAll(".sidebar-link").forEach(a=>{a.addEventListener("click",u=>{u.preventDefault();const h=a.getAttribute("data-route");h&&jt&&(jt.navigate(h),this.isMobile&&this.close())})});const s=e.querySelector('[data-action="settings"]'),o=e.querySelector('[data-action="logout"]');s&&s.addEventListener("click",()=>{console.log("Settings clicked")}),o&&o.addEventListener("click",()=>{console.log("Logout clicked")})}setupEventListeners(){window.addEventListener("resize",()=>this.handleResize()),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.close()})}handleResize(){const e=this.isMobile;this.isMobile=window.innerWidth<1024,e!==this.isMobile&&(this.isMobile?this.close():this.open())}open(){this.isOpen=!0;const e=document.getElementById("sidebar"),t=document.getElementById("sidebar-overlay");e&&e.classList.add("open"),t&&this.isMobile&&t.classList.add("active"),document.body.style.overflow=this.isMobile?"hidden":""}close(){this.isOpen=!1;const e=document.getElementById("sidebar"),t=document.getElementById("sidebar-overlay");e&&e.classList.remove("open"),t&&t.classList.remove("active"),document.body.style.overflow=""}toggle(){this.isOpen?this.close():this.open()}updateActiveRoute(e){document.querySelectorAll(".sidebar-link").forEach(n=>{n.getAttribute("data-route")===e?n.classList.add("active"):n.classList.remove("active")})}}class Sr{constructor(e=[]){this.items=e}static create(e){return new Sr(e).render()}static fromRoute(e){const t=[{label:"Home",path:"/"}],n={"/projetos":"Projetos","/estudos":"Estudos","/rotina":"Minha Rotina","/terapeutico":"Espaço Terapêutico"};return e&&e!=="/"&&e.split("/").filter(Boolean).forEach(o=>{const a="/"+o,u=n[a]||o.charAt(0).toUpperCase()+o.slice(1);t.push({label:u,path:a})}),new Sr(t)}render(){const t=window.innerWidth<768?[this.items[this.items.length-1]]:this.items,n=document.createElement("nav");n.className="breadcrumb",n.setAttribute("aria-label","Breadcrumb");const s=document.createElement("ol");return s.className="breadcrumb-list",t.forEach((o,a)=>{const u=document.createElement("li");u.className="breadcrumb-item";const h=a===t.length-1;if(h){u.setAttribute("aria-current","page");const d=document.createElement("span");d.className="breadcrumb-current",d.textContent=o.label,u.appendChild(d)}else{const d=document.createElement("a");d.href=o.path,d.setAttribute("data-route",o.path),d.className="breadcrumb-link",d.textContent=o.label,d.addEventListener("click",m=>{m.preventDefault(),jt&&o.path&&jt.navigate(o.path)}),u.appendChild(d)}if(!h){const d=document.createElement("span");d.className="breadcrumb-separator",d.setAttribute("aria-hidden","true"),d.textContent="›",u.appendChild(d)}s.appendChild(u)}),n.appendChild(s),n}}const Ah=()=>{};var fa={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qc=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},bh=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const o=r[t++];e[n++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=r[t++],a=r[t++],u=r[t++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|u&63)-65536;e[n++]=String.fromCharCode(55296+(h>>10)),e[n++]=String.fromCharCode(56320+(h&1023))}else{const o=r[t++],a=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return e.join("")},$c={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const o=r[s],a=s+1<r.length,u=a?r[s+1]:0,h=s+2<r.length,d=h?r[s+2]:0,m=o>>2,_=(o&3)<<4|u>>4;let A=(u&15)<<2|d>>6,P=d&63;h||(P=64,a||(A=64)),n.push(t[m],t[_],t[A],t[P])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(qc(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):bh(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const o=t[r.charAt(s++)],u=s<r.length?t[r.charAt(s)]:0;++s;const d=s<r.length?t[r.charAt(s)]:64;++s;const _=s<r.length?t[r.charAt(s)]:64;if(++s,o==null||u==null||d==null||_==null)throw new Rh;const A=o<<2|u>>4;if(n.push(A),d!==64){const P=u<<4&240|d>>2;if(n.push(P),_!==64){const k=d<<6&192|_;n.push(k)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Rh extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Sh=function(r){const e=qc(r);return $c.encodeByteArray(e,!0)},jc=function(r){return Sh(r).replace(/\./g,"")},zc=function(r){try{return $c.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ph(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ch=()=>Ph().__FIREBASE_DEFAULTS__,Vh=()=>{if(typeof process>"u"||typeof fa>"u")return;const r=fa.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Dh=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&zc(r[1]);return e&&JSON.parse(e)},Gc=()=>{try{return Ah()||Ch()||Vh()||Dh()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Nh=r=>{var e;return(e=Gc())==null?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ti(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function De(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function kh(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(De())}function Oh(){var e;const r=(e=Gc())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Lh(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Mh(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function xh(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Fh(){return!Oh()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Uh(){try{return typeof indexedDB=="object"}catch{return!1}}function Bh(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var o;e(((o=s.error)==null?void 0:o.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qh="FirebaseError";class dt extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=qh,Object.setPrototypeOf(this,dt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,qn.prototype.create)}}class qn{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,o=this.errors[e],a=o?$h(o,n):"Error",u=`${this.serviceName}: ${a} (${s}).`;return new dt(s,u,n)}}function $h(r,e){return r.replace(jh,(t,n)=>{const s=e[n];return s!=null?String(s):`<${n}?>`})}const jh=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hc(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function zh(r,e){const t=new Gh(r,e);return t.subscribe.bind(t)}class Gh{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");Hh(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=Ls),s.error===void 0&&(s.error=Ls),s.complete===void 0&&(s.complete=Ls);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Hh(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Ls(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ye(r){return r&&r._delegate?r._delegate:r}class zt{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var B;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(B||(B={}));const Wh={debug:B.DEBUG,verbose:B.VERBOSE,info:B.INFO,warn:B.WARN,error:B.ERROR,silent:B.SILENT},Kh=B.INFO,Qh={[B.DEBUG]:"log",[B.VERBOSE]:"log",[B.INFO]:"info",[B.WARN]:"warn",[B.ERROR]:"error"},Xh=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=Qh[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class vi{constructor(e){this.name=e,this._logLevel=Kh,this._logHandler=Xh,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in B))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Wh[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,B.DEBUG,...e),this._logHandler(this,B.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,B.VERBOSE,...e),this._logHandler(this,B.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,B.INFO,...e),this._logHandler(this,B.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,B.WARN,...e),this._logHandler(this,B.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,B.ERROR,...e),this._logHandler(this,B.ERROR,...e)}}const Yh=(r,e)=>e.some(t=>r instanceof t);let ma,pa;function Jh(){return ma||(ma=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Zh(){return pa||(pa=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Wc=new WeakMap,Ys=new WeakMap,Kc=new WeakMap,Ms=new WeakMap,wi=new WeakMap;function ed(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",o),r.removeEventListener("error",a)},o=()=>{t(nt(r.result)),s()},a=()=>{n(r.error),s()};r.addEventListener("success",o),r.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Wc.set(t,r)}).catch(()=>{}),wi.set(e,r),e}function td(r){if(Ys.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",o),r.removeEventListener("error",a),r.removeEventListener("abort",a)},o=()=>{t(),s()},a=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",o),r.addEventListener("error",a),r.addEventListener("abort",a)});Ys.set(r,e)}let Js={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Ys.get(r);if(e==="objectStoreNames")return r.objectStoreNames||Kc.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return nt(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function nd(r){Js=r(Js)}function rd(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(xs(this),e,...t);return Kc.set(n,e.sort?e.sort():[e]),nt(n)}:Zh().includes(r)?function(...e){return r.apply(xs(this),e),nt(Wc.get(this))}:function(...e){return nt(r.apply(xs(this),e))}}function sd(r){return typeof r=="function"?rd(r):(r instanceof IDBTransaction&&td(r),Yh(r,Jh())?new Proxy(r,Js):r)}function nt(r){if(r instanceof IDBRequest)return ed(r);if(Ms.has(r))return Ms.get(r);const e=sd(r);return e!==r&&(Ms.set(r,e),wi.set(e,r)),e}const xs=r=>wi.get(r);function id(r,e,{blocked:t,upgrade:n,blocking:s,terminated:o}={}){const a=indexedDB.open(r,e),u=nt(a);return n&&a.addEventListener("upgradeneeded",h=>{n(nt(a.result),h.oldVersion,h.newVersion,nt(a.transaction),h)}),t&&a.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),u.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),u}const od=["get","getKey","getAll","getAllKeys","count"],ad=["put","add","delete","clear"],Fs=new Map;function ga(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Fs.get(e))return Fs.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=ad.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||od.includes(t)))return;const o=async function(a,...u){const h=this.transaction(a,s?"readwrite":"readonly");let d=h.store;return n&&(d=d.index(u.shift())),(await Promise.all([d[t](...u),s&&h.done]))[0]};return Fs.set(e,o),o}nd(r=>({...r,get:(e,t,n)=>ga(e,t)||r.get(e,t,n),has:(e,t)=>!!ga(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cd{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(ud(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function ud(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Zs="@firebase/app",_a="0.14.6";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const je=new vi("@firebase/app"),ld="@firebase/app-compat",hd="@firebase/analytics-compat",dd="@firebase/analytics",fd="@firebase/app-check-compat",md="@firebase/app-check",pd="@firebase/auth",gd="@firebase/auth-compat",_d="@firebase/database",yd="@firebase/data-connect",Ed="@firebase/database-compat",Td="@firebase/functions",vd="@firebase/functions-compat",wd="@firebase/installations",Id="@firebase/installations-compat",Ad="@firebase/messaging",bd="@firebase/messaging-compat",Rd="@firebase/performance",Sd="@firebase/performance-compat",Pd="@firebase/remote-config",Cd="@firebase/remote-config-compat",Vd="@firebase/storage",Dd="@firebase/storage-compat",Nd="@firebase/firestore",kd="@firebase/ai",Od="@firebase/firestore-compat",Ld="firebase",Md="12.6.0",xd={[Zs]:"fire-core",[ld]:"fire-core-compat",[dd]:"fire-analytics",[hd]:"fire-analytics-compat",[md]:"fire-app-check",[fd]:"fire-app-check-compat",[pd]:"fire-auth",[gd]:"fire-auth-compat",[_d]:"fire-rtdb",[yd]:"fire-data-connect",[Ed]:"fire-rtdb-compat",[Td]:"fire-fn",[vd]:"fire-fn-compat",[wd]:"fire-iid",[Id]:"fire-iid-compat",[Ad]:"fire-fcm",[bd]:"fire-fcm-compat",[Rd]:"fire-perf",[Sd]:"fire-perf-compat",[Pd]:"fire-rc",[Cd]:"fire-rc-compat",[Vd]:"fire-gcs",[Dd]:"fire-gcs-compat",[Nd]:"fire-fst",[Od]:"fire-fst-compat",[kd]:"fire-vertex","fire-js":"fire-js",[Ld]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fd=new Map,Ud=new Map,ya=new Map;function Ea(r,e){try{r.container.addComponent(e)}catch(t){je.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Gt(r){const e=r.name;if(ya.has(e))return je.debug(`There were multiple attempts to register component ${e}.`),!1;ya.set(e,r);for(const t of Fd.values())Ea(t,r);for(const t of Ud.values())Ea(t,r);return!0}function vt(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bd={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ii=new qn("app","Firebase",Bd);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jr=Md;function rt(r,e,t){let n=xd[r]??r;t&&(n+=`-${t}`);const s=n.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const a=[`Unable to register library "${n}" with version "${e}":`];s&&a.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),je.warn(a.join(" "));return}Gt(new zt(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qd="firebase-heartbeat-database",$d=1,Dn="firebase-heartbeat-store";let Us=null;function Qc(){return Us||(Us=id(qd,$d,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(Dn)}catch(t){console.warn(t)}}}}).catch(r=>{throw Ii.create("idb-open",{originalErrorMessage:r.message})})),Us}async function jd(r){try{const t=(await Qc()).transaction(Dn),n=await t.objectStore(Dn).get(Xc(r));return await t.done,n}catch(e){if(e instanceof dt)je.warn(e.message);else{const t=Ii.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});je.warn(t.message)}}}async function Ta(r,e){try{const n=(await Qc()).transaction(Dn,"readwrite");await n.objectStore(Dn).put(e,Xc(r)),await n.done}catch(t){if(t instanceof dt)je.warn(t.message);else{const n=Ii.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});je.warn(n.message)}}}function Xc(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zd=1024,Gd=30;class Hd{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Kd(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=va();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats.length>Gd){const a=Qd(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){je.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=va(),{heartbeatsToSend:n,unsentEntries:s}=Wd(this._heartbeatsCache.heartbeats),o=jc(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return je.warn(t),""}}}function va(){return new Date().toISOString().substring(0,10)}function Wd(r,e=zd){const t=[];let n=r.slice();for(const s of r){const o=t.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),wa(t)>e){o.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),wa(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class Kd{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Uh()?Bh().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await jd(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Ta(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Ta(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function wa(r){return jc(JSON.stringify({version:2,heartbeats:r})).length}function Qd(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xd(r){Gt(new zt("platform-logger",e=>new cd(e),"PRIVATE")),Gt(new zt("heartbeat",e=>new Hd(e),"PRIVATE")),rt(Zs,_a,r),rt(Zs,_a,"esm2020"),rt("fire-js","")}Xd("");var Yd="firebase",Jd="12.6.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */rt(Yd,Jd,"app");var Ia=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var st,Yc;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,p){function y(){}y.prototype=p.prototype,T.F=p.prototype,T.prototype=new y,T.prototype.constructor=T,T.D=function(v,E,I){for(var g=Array(arguments.length-2),ve=2;ve<arguments.length;ve++)g[ve-2]=arguments[ve];return p.prototype[E].apply(v,g)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(n,t),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,p,y){y||(y=0);const v=Array(16);if(typeof p=="string")for(var E=0;E<16;++E)v[E]=p.charCodeAt(y++)|p.charCodeAt(y++)<<8|p.charCodeAt(y++)<<16|p.charCodeAt(y++)<<24;else for(E=0;E<16;++E)v[E]=p[y++]|p[y++]<<8|p[y++]<<16|p[y++]<<24;p=T.g[0],y=T.g[1],E=T.g[2];let I=T.g[3],g;g=p+(I^y&(E^I))+v[0]+3614090360&4294967295,p=y+(g<<7&4294967295|g>>>25),g=I+(E^p&(y^E))+v[1]+3905402710&4294967295,I=p+(g<<12&4294967295|g>>>20),g=E+(y^I&(p^y))+v[2]+606105819&4294967295,E=I+(g<<17&4294967295|g>>>15),g=y+(p^E&(I^p))+v[3]+3250441966&4294967295,y=E+(g<<22&4294967295|g>>>10),g=p+(I^y&(E^I))+v[4]+4118548399&4294967295,p=y+(g<<7&4294967295|g>>>25),g=I+(E^p&(y^E))+v[5]+1200080426&4294967295,I=p+(g<<12&4294967295|g>>>20),g=E+(y^I&(p^y))+v[6]+2821735955&4294967295,E=I+(g<<17&4294967295|g>>>15),g=y+(p^E&(I^p))+v[7]+4249261313&4294967295,y=E+(g<<22&4294967295|g>>>10),g=p+(I^y&(E^I))+v[8]+1770035416&4294967295,p=y+(g<<7&4294967295|g>>>25),g=I+(E^p&(y^E))+v[9]+2336552879&4294967295,I=p+(g<<12&4294967295|g>>>20),g=E+(y^I&(p^y))+v[10]+4294925233&4294967295,E=I+(g<<17&4294967295|g>>>15),g=y+(p^E&(I^p))+v[11]+2304563134&4294967295,y=E+(g<<22&4294967295|g>>>10),g=p+(I^y&(E^I))+v[12]+1804603682&4294967295,p=y+(g<<7&4294967295|g>>>25),g=I+(E^p&(y^E))+v[13]+4254626195&4294967295,I=p+(g<<12&4294967295|g>>>20),g=E+(y^I&(p^y))+v[14]+2792965006&4294967295,E=I+(g<<17&4294967295|g>>>15),g=y+(p^E&(I^p))+v[15]+1236535329&4294967295,y=E+(g<<22&4294967295|g>>>10),g=p+(E^I&(y^E))+v[1]+4129170786&4294967295,p=y+(g<<5&4294967295|g>>>27),g=I+(y^E&(p^y))+v[6]+3225465664&4294967295,I=p+(g<<9&4294967295|g>>>23),g=E+(p^y&(I^p))+v[11]+643717713&4294967295,E=I+(g<<14&4294967295|g>>>18),g=y+(I^p&(E^I))+v[0]+3921069994&4294967295,y=E+(g<<20&4294967295|g>>>12),g=p+(E^I&(y^E))+v[5]+3593408605&4294967295,p=y+(g<<5&4294967295|g>>>27),g=I+(y^E&(p^y))+v[10]+38016083&4294967295,I=p+(g<<9&4294967295|g>>>23),g=E+(p^y&(I^p))+v[15]+3634488961&4294967295,E=I+(g<<14&4294967295|g>>>18),g=y+(I^p&(E^I))+v[4]+3889429448&4294967295,y=E+(g<<20&4294967295|g>>>12),g=p+(E^I&(y^E))+v[9]+568446438&4294967295,p=y+(g<<5&4294967295|g>>>27),g=I+(y^E&(p^y))+v[14]+3275163606&4294967295,I=p+(g<<9&4294967295|g>>>23),g=E+(p^y&(I^p))+v[3]+4107603335&4294967295,E=I+(g<<14&4294967295|g>>>18),g=y+(I^p&(E^I))+v[8]+1163531501&4294967295,y=E+(g<<20&4294967295|g>>>12),g=p+(E^I&(y^E))+v[13]+2850285829&4294967295,p=y+(g<<5&4294967295|g>>>27),g=I+(y^E&(p^y))+v[2]+4243563512&4294967295,I=p+(g<<9&4294967295|g>>>23),g=E+(p^y&(I^p))+v[7]+1735328473&4294967295,E=I+(g<<14&4294967295|g>>>18),g=y+(I^p&(E^I))+v[12]+2368359562&4294967295,y=E+(g<<20&4294967295|g>>>12),g=p+(y^E^I)+v[5]+4294588738&4294967295,p=y+(g<<4&4294967295|g>>>28),g=I+(p^y^E)+v[8]+2272392833&4294967295,I=p+(g<<11&4294967295|g>>>21),g=E+(I^p^y)+v[11]+1839030562&4294967295,E=I+(g<<16&4294967295|g>>>16),g=y+(E^I^p)+v[14]+4259657740&4294967295,y=E+(g<<23&4294967295|g>>>9),g=p+(y^E^I)+v[1]+2763975236&4294967295,p=y+(g<<4&4294967295|g>>>28),g=I+(p^y^E)+v[4]+1272893353&4294967295,I=p+(g<<11&4294967295|g>>>21),g=E+(I^p^y)+v[7]+4139469664&4294967295,E=I+(g<<16&4294967295|g>>>16),g=y+(E^I^p)+v[10]+3200236656&4294967295,y=E+(g<<23&4294967295|g>>>9),g=p+(y^E^I)+v[13]+681279174&4294967295,p=y+(g<<4&4294967295|g>>>28),g=I+(p^y^E)+v[0]+3936430074&4294967295,I=p+(g<<11&4294967295|g>>>21),g=E+(I^p^y)+v[3]+3572445317&4294967295,E=I+(g<<16&4294967295|g>>>16),g=y+(E^I^p)+v[6]+76029189&4294967295,y=E+(g<<23&4294967295|g>>>9),g=p+(y^E^I)+v[9]+3654602809&4294967295,p=y+(g<<4&4294967295|g>>>28),g=I+(p^y^E)+v[12]+3873151461&4294967295,I=p+(g<<11&4294967295|g>>>21),g=E+(I^p^y)+v[15]+530742520&4294967295,E=I+(g<<16&4294967295|g>>>16),g=y+(E^I^p)+v[2]+3299628645&4294967295,y=E+(g<<23&4294967295|g>>>9),g=p+(E^(y|~I))+v[0]+4096336452&4294967295,p=y+(g<<6&4294967295|g>>>26),g=I+(y^(p|~E))+v[7]+1126891415&4294967295,I=p+(g<<10&4294967295|g>>>22),g=E+(p^(I|~y))+v[14]+2878612391&4294967295,E=I+(g<<15&4294967295|g>>>17),g=y+(I^(E|~p))+v[5]+4237533241&4294967295,y=E+(g<<21&4294967295|g>>>11),g=p+(E^(y|~I))+v[12]+1700485571&4294967295,p=y+(g<<6&4294967295|g>>>26),g=I+(y^(p|~E))+v[3]+2399980690&4294967295,I=p+(g<<10&4294967295|g>>>22),g=E+(p^(I|~y))+v[10]+4293915773&4294967295,E=I+(g<<15&4294967295|g>>>17),g=y+(I^(E|~p))+v[1]+2240044497&4294967295,y=E+(g<<21&4294967295|g>>>11),g=p+(E^(y|~I))+v[8]+1873313359&4294967295,p=y+(g<<6&4294967295|g>>>26),g=I+(y^(p|~E))+v[15]+4264355552&4294967295,I=p+(g<<10&4294967295|g>>>22),g=E+(p^(I|~y))+v[6]+2734768916&4294967295,E=I+(g<<15&4294967295|g>>>17),g=y+(I^(E|~p))+v[13]+1309151649&4294967295,y=E+(g<<21&4294967295|g>>>11),g=p+(E^(y|~I))+v[4]+4149444226&4294967295,p=y+(g<<6&4294967295|g>>>26),g=I+(y^(p|~E))+v[11]+3174756917&4294967295,I=p+(g<<10&4294967295|g>>>22),g=E+(p^(I|~y))+v[2]+718787259&4294967295,E=I+(g<<15&4294967295|g>>>17),g=y+(I^(E|~p))+v[9]+3951481745&4294967295,T.g[0]=T.g[0]+p&4294967295,T.g[1]=T.g[1]+(E+(g<<21&4294967295|g>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+I&4294967295}n.prototype.v=function(T,p){p===void 0&&(p=T.length);const y=p-this.blockSize,v=this.C;let E=this.h,I=0;for(;I<p;){if(E==0)for(;I<=y;)s(this,T,I),I+=this.blockSize;if(typeof T=="string"){for(;I<p;)if(v[E++]=T.charCodeAt(I++),E==this.blockSize){s(this,v),E=0;break}}else for(;I<p;)if(v[E++]=T[I++],E==this.blockSize){s(this,v),E=0;break}}this.h=E,this.o+=p},n.prototype.A=function(){var T=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);T[0]=128;for(var p=1;p<T.length-8;++p)T[p]=0;p=this.o*8;for(var y=T.length-8;y<T.length;++y)T[y]=p&255,p/=256;for(this.v(T),T=Array(16),p=0,y=0;y<4;++y)for(let v=0;v<32;v+=8)T[p++]=this.g[y]>>>v&255;return T};function o(T,p){var y=u;return Object.prototype.hasOwnProperty.call(y,T)?y[T]:y[T]=p(T)}function a(T,p){this.h=p;const y=[];let v=!0;for(let E=T.length-1;E>=0;E--){const I=T[E]|0;v&&I==p||(y[E]=I,v=!1)}this.g=y}var u={};function h(T){return-128<=T&&T<128?o(T,function(p){return new a([p|0],p<0?-1:0)}):new a([T|0],T<0?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return _;if(T<0)return D(d(-T));const p=[];let y=1;for(let v=0;T>=y;v++)p[v]=T/y|0,y*=4294967296;return new a(p,0)}function m(T,p){if(T.length==0)throw Error("number format error: empty string");if(p=p||10,p<2||36<p)throw Error("radix out of range: "+p);if(T.charAt(0)=="-")return D(m(T.substring(1),p));if(T.indexOf("-")>=0)throw Error('number format error: interior "-" character');const y=d(Math.pow(p,8));let v=_;for(let I=0;I<T.length;I+=8){var E=Math.min(8,T.length-I);const g=parseInt(T.substring(I,I+E),p);E<8?(E=d(Math.pow(p,E)),v=v.j(E).add(d(g))):(v=v.j(y),v=v.add(d(g)))}return v}var _=h(0),A=h(1),P=h(16777216);r=a.prototype,r.m=function(){if(O(this))return-D(this).m();let T=0,p=1;for(let y=0;y<this.g.length;y++){const v=this.i(y);T+=(v>=0?v:4294967296+v)*p,p*=4294967296}return T},r.toString=function(T){if(T=T||10,T<2||36<T)throw Error("radix out of range: "+T);if(k(this))return"0";if(O(this))return"-"+D(this).toString(T);const p=d(Math.pow(T,6));var y=this;let v="";for(;;){const E=me(y,p).g;y=z(y,E.j(p));let I=((y.g.length>0?y.g[0]:y.h)>>>0).toString(T);if(y=E,k(y))return I+v;for(;I.length<6;)I="0"+I;v=I+v}},r.i=function(T){return T<0?0:T<this.g.length?this.g[T]:this.h};function k(T){if(T.h!=0)return!1;for(let p=0;p<T.g.length;p++)if(T.g[p]!=0)return!1;return!0}function O(T){return T.h==-1}r.l=function(T){return T=z(this,T),O(T)?-1:k(T)?0:1};function D(T){const p=T.g.length,y=[];for(let v=0;v<p;v++)y[v]=~T.g[v];return new a(y,~T.h).add(A)}r.abs=function(){return O(this)?D(this):this},r.add=function(T){const p=Math.max(this.g.length,T.g.length),y=[];let v=0;for(let E=0;E<=p;E++){let I=v+(this.i(E)&65535)+(T.i(E)&65535),g=(I>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);v=g>>>16,I&=65535,g&=65535,y[E]=g<<16|I}return new a(y,y[y.length-1]&-2147483648?-1:0)};function z(T,p){return T.add(D(p))}r.j=function(T){if(k(this)||k(T))return _;if(O(this))return O(T)?D(this).j(D(T)):D(D(this).j(T));if(O(T))return D(this.j(D(T)));if(this.l(P)<0&&T.l(P)<0)return d(this.m()*T.m());const p=this.g.length+T.g.length,y=[];for(var v=0;v<2*p;v++)y[v]=0;for(v=0;v<this.g.length;v++)for(let E=0;E<T.g.length;E++){const I=this.i(v)>>>16,g=this.i(v)&65535,ve=T.i(E)>>>16,pt=T.i(E)&65535;y[2*v+2*E]+=g*pt,H(y,2*v+2*E),y[2*v+2*E+1]+=I*pt,H(y,2*v+2*E+1),y[2*v+2*E+1]+=g*ve,H(y,2*v+2*E+1),y[2*v+2*E+2]+=I*ve,H(y,2*v+2*E+2)}for(T=0;T<p;T++)y[T]=y[2*T+1]<<16|y[2*T];for(T=p;T<2*p;T++)y[T]=0;return new a(y,0)};function H(T,p){for(;(T[p]&65535)!=T[p];)T[p+1]+=T[p]>>>16,T[p]&=65535,p++}function X(T,p){this.g=T,this.h=p}function me(T,p){if(k(p))throw Error("division by zero");if(k(T))return new X(_,_);if(O(T))return p=me(D(T),p),new X(D(p.g),D(p.h));if(O(p))return p=me(T,D(p)),new X(D(p.g),p.h);if(T.g.length>30){if(O(T)||O(p))throw Error("slowDivide_ only works with positive integers.");for(var y=A,v=p;v.l(T)<=0;)y=Re(y),v=Re(v);var E=oe(y,1),I=oe(v,1);for(v=oe(v,2),y=oe(y,2);!k(v);){var g=I.add(v);g.l(T)<=0&&(E=E.add(y),I=g),v=oe(v,1),y=oe(y,1)}return p=z(T,E.j(p)),new X(E,p)}for(E=_;T.l(p)>=0;){for(y=Math.max(1,Math.floor(T.m()/p.m())),v=Math.ceil(Math.log(y)/Math.LN2),v=v<=48?1:Math.pow(2,v-48),I=d(y),g=I.j(p);O(g)||g.l(T)>0;)y-=v,I=d(y),g=I.j(p);k(I)&&(I=A),E=E.add(I),T=z(T,g)}return new X(E,T)}r.B=function(T){return me(this,T).h},r.and=function(T){const p=Math.max(this.g.length,T.g.length),y=[];for(let v=0;v<p;v++)y[v]=this.i(v)&T.i(v);return new a(y,this.h&T.h)},r.or=function(T){const p=Math.max(this.g.length,T.g.length),y=[];for(let v=0;v<p;v++)y[v]=this.i(v)|T.i(v);return new a(y,this.h|T.h)},r.xor=function(T){const p=Math.max(this.g.length,T.g.length),y=[];for(let v=0;v<p;v++)y[v]=this.i(v)^T.i(v);return new a(y,this.h^T.h)};function Re(T){const p=T.g.length+1,y=[];for(let v=0;v<p;v++)y[v]=T.i(v)<<1|T.i(v-1)>>>31;return new a(y,T.h)}function oe(T,p){const y=p>>5;p%=32;const v=T.g.length-y,E=[];for(let I=0;I<v;I++)E[I]=p>0?T.i(I+y)>>>p|T.i(I+y+1)<<32-p:T.i(I+y);return new a(E,T.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,Yc=n,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=m,st=a}).apply(typeof Ia<"u"?Ia:typeof self<"u"?self:typeof window<"u"?window:{});var dr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Jc,vn,Zc,Er,ei,eu,tu,nu;(function(){var r,e=Object.defineProperty;function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof dr=="object"&&dr];for(var c=0;c<i.length;++c){var l=i[c];if(l&&l.Math==Math)return l}throw Error("Cannot find global object")}var n=t(this);function s(i,c){if(c)e:{var l=n;i=i.split(".");for(var f=0;f<i.length-1;f++){var w=i[f];if(!(w in l))break e;l=l[w]}i=i[i.length-1],f=l[i],c=c(f),c!=f&&c!=null&&e(l,i,{configurable:!0,writable:!0,value:c})}}s("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(i){return i||function(c){var l=[],f;for(f in c)Object.prototype.hasOwnProperty.call(c,f)&&l.push([f,c[f]]);return l}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function u(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function h(i,c,l){return i.call.apply(i.bind,arguments)}function d(i,c,l){return d=h,d.apply(null,arguments)}function m(i,c){var l=Array.prototype.slice.call(arguments,1);return function(){var f=l.slice();return f.push.apply(f,arguments),i.apply(this,f)}}function _(i,c){function l(){}l.prototype=c.prototype,i.Z=c.prototype,i.prototype=new l,i.prototype.constructor=i,i.Ob=function(f,w,b){for(var C=Array(arguments.length-2),U=2;U<arguments.length;U++)C[U-2]=arguments[U];return c.prototype[w].apply(f,C)}}var A=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function P(i){const c=i.length;if(c>0){const l=Array(c);for(let f=0;f<c;f++)l[f]=i[f];return l}return[]}function k(i,c){for(let f=1;f<arguments.length;f++){const w=arguments[f];var l=typeof w;if(l=l!="object"?l:w?Array.isArray(w)?"array":l:"null",l=="array"||l=="object"&&typeof w.length=="number"){l=i.length||0;const b=w.length||0;i.length=l+b;for(let C=0;C<b;C++)i[l+C]=w[C]}else i.push(w)}}class O{constructor(c,l){this.i=c,this.j=l,this.h=0,this.g=null}get(){let c;return this.h>0?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function D(i){a.setTimeout(()=>{throw i},0)}function z(){var i=T;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class H{constructor(){this.h=this.g=null}add(c,l){const f=X.get();f.set(c,l),this.h?this.h.next=f:this.g=f,this.h=f}}var X=new O(()=>new me,i=>i.reset());class me{constructor(){this.next=this.g=this.h=null}set(c,l){this.h=c,this.g=l,this.next=null}reset(){this.next=this.g=this.h=null}}let Re,oe=!1,T=new H,p=()=>{const i=Promise.resolve(void 0);Re=()=>{i.then(y)}};function y(){for(var i;i=z();){try{i.h.call(i.g)}catch(l){D(l)}var c=X;c.j(i),c.h<100&&(c.h++,i.next=c.g,c.g=i)}oe=!1}function v(){this.u=this.u,this.C=this.C}v.prototype.u=!1,v.prototype.dispose=function(){this.u||(this.u=!0,this.N())},v.prototype[Symbol.dispose]=function(){this.dispose()},v.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function E(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}E.prototype.h=function(){this.defaultPrevented=!0};var I=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const l=()=>{};a.addEventListener("test",l,c),a.removeEventListener("test",l,c)}catch{}return i}();function g(i){return/^[\s\xa0]*$/.test(i)}function ve(i,c){E.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,c)}_(ve,E),ve.prototype.init=function(i,c){const l=this.type=i.type,f=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget,c||(l=="mouseover"?c=i.fromElement:l=="mouseout"&&(c=i.toElement)),this.relatedTarget=c,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&ve.Z.h.call(this)},ve.prototype.h=function(){ve.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var pt="closure_listenable_"+(Math.random()*1e6|0),Fl=0;function Ul(i,c,l,f,w){this.listener=i,this.proxy=null,this.src=c,this.type=l,this.capture=!!f,this.ha=w,this.key=++Fl,this.da=this.fa=!1}function Yn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Jn(i,c,l){for(const f in i)c.call(l,i[f],f,i)}function Bl(i,c){for(const l in i)c.call(void 0,i[l],l,i)}function lo(i){const c={};for(const l in i)c[l]=i[l];return c}const ho="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function fo(i,c){let l,f;for(let w=1;w<arguments.length;w++){f=arguments[w];for(l in f)i[l]=f[l];for(let b=0;b<ho.length;b++)l=ho[b],Object.prototype.hasOwnProperty.call(f,l)&&(i[l]=f[l])}}function Zn(i){this.src=i,this.g={},this.h=0}Zn.prototype.add=function(i,c,l,f,w){const b=i.toString();i=this.g[b],i||(i=this.g[b]=[],this.h++);const C=ds(i,c,f,w);return C>-1?(c=i[C],l||(c.fa=!1)):(c=new Ul(c,this.src,b,!!f,w),c.fa=l,i.push(c)),c};function hs(i,c){const l=c.type;if(l in i.g){var f=i.g[l],w=Array.prototype.indexOf.call(f,c,void 0),b;(b=w>=0)&&Array.prototype.splice.call(f,w,1),b&&(Yn(c),i.g[l].length==0&&(delete i.g[l],i.h--))}}function ds(i,c,l,f){for(let w=0;w<i.length;++w){const b=i[w];if(!b.da&&b.listener==c&&b.capture==!!l&&b.ha==f)return w}return-1}var fs="closure_lm_"+(Math.random()*1e6|0),ms={};function mo(i,c,l,f,w){if(Array.isArray(c)){for(let b=0;b<c.length;b++)mo(i,c[b],l,f,w);return null}return l=_o(l),i&&i[pt]?i.J(c,l,u(f)?!!f.capture:!1,w):ql(i,c,l,!1,f,w)}function ql(i,c,l,f,w,b){if(!c)throw Error("Invalid event type");const C=u(w)?!!w.capture:!!w;let U=gs(i);if(U||(i[fs]=U=new Zn(i)),l=U.add(c,l,f,C,b),l.proxy)return l;if(f=$l(),l.proxy=f,f.src=i,f.listener=l,i.addEventListener)I||(w=C),w===void 0&&(w=!1),i.addEventListener(c.toString(),f,w);else if(i.attachEvent)i.attachEvent(go(c.toString()),f);else if(i.addListener&&i.removeListener)i.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return l}function $l(){function i(l){return c.call(i.src,i.listener,l)}const c=jl;return i}function po(i,c,l,f,w){if(Array.isArray(c))for(var b=0;b<c.length;b++)po(i,c[b],l,f,w);else f=u(f)?!!f.capture:!!f,l=_o(l),i&&i[pt]?(i=i.i,b=String(c).toString(),b in i.g&&(c=i.g[b],l=ds(c,l,f,w),l>-1&&(Yn(c[l]),Array.prototype.splice.call(c,l,1),c.length==0&&(delete i.g[b],i.h--)))):i&&(i=gs(i))&&(c=i.g[c.toString()],i=-1,c&&(i=ds(c,l,f,w)),(l=i>-1?c[i]:null)&&ps(l))}function ps(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[pt])hs(c.i,i);else{var l=i.type,f=i.proxy;c.removeEventListener?c.removeEventListener(l,f,i.capture):c.detachEvent?c.detachEvent(go(l),f):c.addListener&&c.removeListener&&c.removeListener(f),(l=gs(c))?(hs(l,i),l.h==0&&(l.src=null,c[fs]=null)):Yn(i)}}}function go(i){return i in ms?ms[i]:ms[i]="on"+i}function jl(i,c){if(i.da)i=!0;else{c=new ve(c,this);const l=i.listener,f=i.ha||i.src;i.fa&&ps(i),i=l.call(f,c)}return i}function gs(i){return i=i[fs],i instanceof Zn?i:null}var _s="__closure_events_fn_"+(Math.random()*1e9>>>0);function _o(i){return typeof i=="function"?i:(i[_s]||(i[_s]=function(c){return i.handleEvent(c)}),i[_s])}function pe(){v.call(this),this.i=new Zn(this),this.M=this,this.G=null}_(pe,v),pe.prototype[pt]=!0,pe.prototype.removeEventListener=function(i,c,l,f){po(this,i,c,l,f)};function Ee(i,c){var l,f=i.G;if(f)for(l=[];f;f=f.G)l.push(f);if(i=i.M,f=c.type||c,typeof c=="string")c=new E(c,i);else if(c instanceof E)c.target=c.target||i;else{var w=c;c=new E(f,i),fo(c,w)}w=!0;let b,C;if(l)for(C=l.length-1;C>=0;C--)b=c.g=l[C],w=er(b,f,!0,c)&&w;if(b=c.g=i,w=er(b,f,!0,c)&&w,w=er(b,f,!1,c)&&w,l)for(C=0;C<l.length;C++)b=c.g=l[C],w=er(b,f,!1,c)&&w}pe.prototype.N=function(){if(pe.Z.N.call(this),this.i){var i=this.i;for(const c in i.g){const l=i.g[c];for(let f=0;f<l.length;f++)Yn(l[f]);delete i.g[c],i.h--}}this.G=null},pe.prototype.J=function(i,c,l,f){return this.i.add(String(i),c,!1,l,f)},pe.prototype.K=function(i,c,l,f){return this.i.add(String(i),c,!0,l,f)};function er(i,c,l,f){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();let w=!0;for(let b=0;b<c.length;++b){const C=c[b];if(C&&!C.da&&C.capture==l){const U=C.listener,ae=C.ha||C.src;C.fa&&hs(i.i,C),w=U.call(ae,f)!==!1&&w}}return w&&!f.defaultPrevented}function zl(i,c){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=d(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(c)>2147483647?-1:a.setTimeout(i,c||0)}function yo(i){i.g=zl(()=>{i.g=null,i.i&&(i.i=!1,yo(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class Gl extends v{constructor(c,l){super(),this.m=c,this.l=l,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:yo(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function nn(i){v.call(this),this.h=i,this.g={}}_(nn,v);var Eo=[];function To(i){Jn(i.g,function(c,l){this.g.hasOwnProperty(l)&&ps(c)},i),i.g={}}nn.prototype.N=function(){nn.Z.N.call(this),To(this)},nn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ys=a.JSON.stringify,Hl=a.JSON.parse,Wl=class{stringify(i){return a.JSON.stringify(i,void 0)}parse(i){return a.JSON.parse(i,void 0)}};function vo(){}function wo(){}var rn={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Es(){E.call(this,"d")}_(Es,E);function Ts(){E.call(this,"c")}_(Ts,E);var gt={},Io=null;function tr(){return Io=Io||new pe}gt.Ia="serverreachability";function Ao(i){E.call(this,gt.Ia,i)}_(Ao,E);function sn(i){const c=tr();Ee(c,new Ao(c))}gt.STAT_EVENT="statevent";function bo(i,c){E.call(this,gt.STAT_EVENT,i),this.stat=c}_(bo,E);function Te(i){const c=tr();Ee(c,new bo(c,i))}gt.Ja="timingevent";function Ro(i,c){E.call(this,gt.Ja,i),this.size=c}_(Ro,E);function on(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){i()},c)}function an(){this.g=!0}an.prototype.ua=function(){this.g=!1};function Kl(i,c,l,f,w,b){i.info(function(){if(i.g)if(b){var C="",U=b.split("&");for(let K=0;K<U.length;K++){var ae=U[K].split("=");if(ae.length>1){const ue=ae[0];ae=ae[1];const Oe=ue.split("_");C=Oe.length>=2&&Oe[1]=="type"?C+(ue+"="+ae+"&"):C+(ue+"=redacted&")}}}else C=null;else C=b;return"XMLHTTP REQ ("+f+") [attempt "+w+"]: "+c+`
`+l+`
`+C})}function Ql(i,c,l,f,w,b,C){i.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+w+"]: "+c+`
`+l+`
`+b+" "+C})}function Dt(i,c,l,f){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+Yl(i,l)+(f?" "+f:"")})}function Xl(i,c){i.info(function(){return"TIMEOUT: "+c})}an.prototype.info=function(){};function Yl(i,c){if(!i.g)return c;if(!c)return null;try{const b=JSON.parse(c);if(b){for(i=0;i<b.length;i++)if(Array.isArray(b[i])){var l=b[i];if(!(l.length<2)){var f=l[1];if(Array.isArray(f)&&!(f.length<1)){var w=f[0];if(w!="noop"&&w!="stop"&&w!="close")for(let C=1;C<f.length;C++)f[C]=""}}}}return ys(b)}catch{return c}}var nr={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},So={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Po;function vs(){}_(vs,vo),vs.prototype.g=function(){return new XMLHttpRequest},Po=new vs;function cn(i){return encodeURIComponent(String(i))}function Jl(i){var c=1;i=i.split(":");const l=[];for(;c>0&&i.length;)l.push(i.shift()),c--;return i.length&&l.push(i.join(":")),l}function Ke(i,c,l,f){this.j=i,this.i=c,this.l=l,this.S=f||1,this.V=new nn(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Co}function Co(){this.i=null,this.g="",this.h=!1}var Vo={},ws={};function Is(i,c,l){i.M=1,i.A=sr(ke(c)),i.u=l,i.R=!0,Do(i,null)}function Do(i,c){i.F=Date.now(),rr(i),i.B=ke(i.A);var l=i.B,f=i.S;Array.isArray(f)||(f=[String(f)]),zo(l.i,"t",f),i.C=0,l=i.j.L,i.h=new Co,i.g=ca(i.j,l?c:null,!i.u),i.P>0&&(i.O=new Gl(d(i.Y,i,i.g),i.P)),c=i.V,l=i.g,f=i.ba;var w="readystatechange";Array.isArray(w)||(w&&(Eo[0]=w.toString()),w=Eo);for(let b=0;b<w.length;b++){const C=mo(l,w[b],f||c.handleEvent,!1,c.h||c);if(!C)break;c.g[C.key]=C}c=i.J?lo(i.J):{},i.u?(i.v||(i.v="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,c)):(i.v="GET",i.g.ea(i.B,i.v,null,c)),sn(),Kl(i.i,i.v,i.B,i.l,i.S,i.u)}Ke.prototype.ba=function(i){i=i.target;const c=this.O;c&&Ye(i)==3?c.j():this.Y(i)},Ke.prototype.Y=function(i){try{if(i==this.g)e:{const U=Ye(this.g),ae=this.g.ya(),K=this.g.ca();if(!(U<3)&&(U!=3||this.g&&(this.h.h||this.g.la()||Yo(this.g)))){this.K||U!=4||ae==7||(ae==8||K<=0?sn(3):sn(2)),As(this);var c=this.g.ca();this.X=c;var l=Zl(this);if(this.o=c==200,Ql(this.i,this.v,this.B,this.l,this.S,U,c),this.o){if(this.U&&!this.L){t:{if(this.g){var f,w=this.g;if((f=w.g?w.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!g(f)){var b=f;break t}}b=null}if(i=b)Dt(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,bs(this,i);else{this.o=!1,this.m=3,Te(12),_t(this),un(this);break e}}if(this.R){i=!0;let ue;for(;!this.K&&this.C<l.length;)if(ue=eh(this,l),ue==ws){U==4&&(this.m=4,Te(14),i=!1),Dt(this.i,this.l,null,"[Incomplete Response]");break}else if(ue==Vo){this.m=4,Te(15),Dt(this.i,this.l,l,"[Invalid Chunk]"),i=!1;break}else Dt(this.i,this.l,ue,null),bs(this,ue);if(No(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),U!=4||l.length!=0||this.h.h||(this.m=1,Te(16),i=!1),this.o=this.o&&i,!i)Dt(this.i,this.l,l,"[Invalid Chunked Response]"),_t(this),un(this);else if(l.length>0&&!this.W){this.W=!0;var C=this.j;C.g==this&&C.aa&&!C.P&&(C.j.info("Great, no buffering proxy detected. Bytes received: "+l.length),ks(C),C.P=!0,Te(11))}}else Dt(this.i,this.l,l,null),bs(this,l);U==4&&_t(this),this.o&&!this.K&&(U==4?sa(this.j,this):(this.o=!1,rr(this)))}else mh(this.g),c==400&&l.indexOf("Unknown SID")>0?(this.m=3,Te(12)):(this.m=0,Te(13)),_t(this),un(this)}}}catch{}finally{}};function Zl(i){if(!No(i))return i.g.la();const c=Yo(i.g);if(c==="")return"";let l="";const f=c.length,w=Ye(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return _t(i),un(i),"";i.h.i=new a.TextDecoder}for(let b=0;b<f;b++)i.h.h=!0,l+=i.h.i.decode(c[b],{stream:!(w&&b==f-1)});return c.length=0,i.h.g+=l,i.C=0,i.h.g}function No(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function eh(i,c){var l=i.C,f=c.indexOf(`
`,l);return f==-1?ws:(l=Number(c.substring(l,f)),isNaN(l)?Vo:(f+=1,f+l>c.length?ws:(c=c.slice(f,f+l),i.C=f+l,c)))}Ke.prototype.cancel=function(){this.K=!0,_t(this)};function rr(i){i.T=Date.now()+i.H,ko(i,i.H)}function ko(i,c){if(i.D!=null)throw Error("WatchDog timer not null");i.D=on(d(i.aa,i),c)}function As(i){i.D&&(a.clearTimeout(i.D),i.D=null)}Ke.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?(Xl(this.i,this.B),this.M!=2&&(sn(),Te(17)),_t(this),this.m=2,un(this)):ko(this,this.T-i)};function un(i){i.j.I==0||i.K||sa(i.j,i)}function _t(i){As(i);var c=i.O;c&&typeof c.dispose=="function"&&c.dispose(),i.O=null,To(i.V),i.g&&(c=i.g,i.g=null,c.abort(),c.dispose())}function bs(i,c){try{var l=i.j;if(l.I!=0&&(l.g==i||Rs(l.h,i))){if(!i.L&&Rs(l.h,i)&&l.I==3){try{var f=l.Ba.g.parse(c)}catch{f=null}if(Array.isArray(f)&&f.length==3){var w=f;if(w[0]==0){e:if(!l.v){if(l.g)if(l.g.F+3e3<i.F)ur(l),ar(l);else break e;Ns(l),Te(18)}}else l.xa=w[1],0<l.xa-l.K&&w[2]<37500&&l.F&&l.A==0&&!l.C&&(l.C=on(d(l.Va,l),6e3));Mo(l.h)<=1&&l.ta&&(l.ta=void 0)}else Et(l,11)}else if((i.L||l.g==i)&&ur(l),!g(c))for(w=l.Ba.g.parse(c),c=0;c<w.length;c++){let K=w[c];const ue=K[0];if(!(ue<=l.K))if(l.K=ue,K=K[1],l.I==2)if(K[0]=="c"){l.M=K[1],l.ba=K[2];const Oe=K[3];Oe!=null&&(l.ka=Oe,l.j.info("VER="+l.ka));const Tt=K[4];Tt!=null&&(l.za=Tt,l.j.info("SVER="+l.za));const Je=K[5];Je!=null&&typeof Je=="number"&&Je>0&&(f=1.5*Je,l.O=f,l.j.info("backChannelRequestTimeoutMs_="+f)),f=l;const Ze=i.g;if(Ze){const hr=Ze.g?Ze.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(hr){var b=f.h;b.g||hr.indexOf("spdy")==-1&&hr.indexOf("quic")==-1&&hr.indexOf("h2")==-1||(b.j=b.l,b.g=new Set,b.h&&(Ss(b,b.h),b.h=null))}if(f.G){const Os=Ze.g?Ze.g.getResponseHeader("X-HTTP-Session-Id"):null;Os&&(f.wa=Os,Y(f.J,f.G,Os))}}l.I=3,l.l&&l.l.ra(),l.aa&&(l.T=Date.now()-i.F,l.j.info("Handshake RTT: "+l.T+"ms")),f=l;var C=i;if(f.na=aa(f,f.L?f.ba:null,f.W),C.L){xo(f.h,C);var U=C,ae=f.O;ae&&(U.H=ae),U.D&&(As(U),rr(U)),f.g=C}else na(f);l.i.length>0&&cr(l)}else K[0]!="stop"&&K[0]!="close"||Et(l,7);else l.I==3&&(K[0]=="stop"||K[0]=="close"?K[0]=="stop"?Et(l,7):Ds(l):K[0]!="noop"&&l.l&&l.l.qa(K),l.A=0)}}sn(4)}catch{}}var th=class{constructor(i,c){this.g=i,this.map=c}};function Oo(i){this.l=i||10,a.PerformanceNavigationTiming?(i=a.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Lo(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function Mo(i){return i.h?1:i.g?i.g.size:0}function Rs(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function Ss(i,c){i.g?i.g.add(c):i.h=c}function xo(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}Oo.prototype.cancel=function(){if(this.i=Fo(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Fo(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const l of i.g.values())c=c.concat(l.G);return c}return P(i.i)}var Uo=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function nh(i,c){if(i){i=i.split("&");for(let l=0;l<i.length;l++){const f=i[l].indexOf("=");let w,b=null;f>=0?(w=i[l].substring(0,f),b=i[l].substring(f+1)):w=i[l],c(w,b?decodeURIComponent(b.replace(/\+/g," ")):"")}}}function Qe(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let c;i instanceof Qe?(this.l=i.l,ln(this,i.j),this.o=i.o,this.g=i.g,hn(this,i.u),this.h=i.h,Ps(this,Go(i.i)),this.m=i.m):i&&(c=String(i).match(Uo))?(this.l=!1,ln(this,c[1]||"",!0),this.o=dn(c[2]||""),this.g=dn(c[3]||"",!0),hn(this,c[4]),this.h=dn(c[5]||"",!0),Ps(this,c[6]||"",!0),this.m=dn(c[7]||"")):(this.l=!1,this.i=new mn(null,this.l))}Qe.prototype.toString=function(){const i=[];var c=this.j;c&&i.push(fn(c,Bo,!0),":");var l=this.g;return(l||c=="file")&&(i.push("//"),(c=this.o)&&i.push(fn(c,Bo,!0),"@"),i.push(cn(l).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l=this.u,l!=null&&i.push(":",String(l))),(l=this.h)&&(this.g&&l.charAt(0)!="/"&&i.push("/"),i.push(fn(l,l.charAt(0)=="/"?ih:sh,!0))),(l=this.i.toString())&&i.push("?",l),(l=this.m)&&i.push("#",fn(l,ah)),i.join("")},Qe.prototype.resolve=function(i){const c=ke(this);let l=!!i.j;l?ln(c,i.j):l=!!i.o,l?c.o=i.o:l=!!i.g,l?c.g=i.g:l=i.u!=null;var f=i.h;if(l)hn(c,i.u);else if(l=!!i.h){if(f.charAt(0)!="/")if(this.g&&!this.h)f="/"+f;else{var w=c.h.lastIndexOf("/");w!=-1&&(f=c.h.slice(0,w+1)+f)}if(w=f,w==".."||w==".")f="";else if(w.indexOf("./")!=-1||w.indexOf("/.")!=-1){f=w.lastIndexOf("/",0)==0,w=w.split("/");const b=[];for(let C=0;C<w.length;){const U=w[C++];U=="."?f&&C==w.length&&b.push(""):U==".."?((b.length>1||b.length==1&&b[0]!="")&&b.pop(),f&&C==w.length&&b.push("")):(b.push(U),f=!0)}f=b.join("/")}else f=w}return l?c.h=f:l=i.i.toString()!=="",l?Ps(c,Go(i.i)):l=!!i.m,l&&(c.m=i.m),c};function ke(i){return new Qe(i)}function ln(i,c,l){i.j=l?dn(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function hn(i,c){if(c){if(c=Number(c),isNaN(c)||c<0)throw Error("Bad port number "+c);i.u=c}else i.u=null}function Ps(i,c,l){c instanceof mn?(i.i=c,ch(i.i,i.l)):(l||(c=fn(c,oh)),i.i=new mn(c,i.l))}function Y(i,c,l){i.i.set(c,l)}function sr(i){return Y(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function dn(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function fn(i,c,l){return typeof i=="string"?(i=encodeURI(i).replace(c,rh),l&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function rh(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Bo=/[#\/\?@]/g,sh=/[#\?:]/g,ih=/[#\?]/g,oh=/[#\?@]/g,ah=/#/g;function mn(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function yt(i){i.g||(i.g=new Map,i.h=0,i.i&&nh(i.i,function(c,l){i.add(decodeURIComponent(c.replace(/\+/g," ")),l)}))}r=mn.prototype,r.add=function(i,c){yt(this),this.i=null,i=Nt(this,i);let l=this.g.get(i);return l||this.g.set(i,l=[]),l.push(c),this.h+=1,this};function qo(i,c){yt(i),c=Nt(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function $o(i,c){return yt(i),c=Nt(i,c),i.g.has(c)}r.forEach=function(i,c){yt(this),this.g.forEach(function(l,f){l.forEach(function(w){i.call(c,w,f,this)},this)},this)};function jo(i,c){yt(i);let l=[];if(typeof c=="string")$o(i,c)&&(l=l.concat(i.g.get(Nt(i,c))));else for(i=Array.from(i.g.values()),c=0;c<i.length;c++)l=l.concat(i[c]);return l}r.set=function(i,c){return yt(this),this.i=null,i=Nt(this,i),$o(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},r.get=function(i,c){return i?(i=jo(this,i),i.length>0?String(i[0]):c):c};function zo(i,c,l){qo(i,c),l.length>0&&(i.i=null,i.g.set(Nt(i,c),P(l)),i.h+=l.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(let f=0;f<c.length;f++){var l=c[f];const w=cn(l);l=jo(this,l);for(let b=0;b<l.length;b++){let C=w;l[b]!==""&&(C+="="+cn(l[b])),i.push(C)}}return this.i=i.join("&")};function Go(i){const c=new mn;return c.i=i.i,i.g&&(c.g=new Map(i.g),c.h=i.h),c}function Nt(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function ch(i,c){c&&!i.j&&(yt(i),i.i=null,i.g.forEach(function(l,f){const w=f.toLowerCase();f!=w&&(qo(this,f),zo(this,w,l))},i)),i.j=c}function uh(i,c){const l=new an;if(a.Image){const f=new Image;f.onload=m(Xe,l,"TestLoadImage: loaded",!0,c,f),f.onerror=m(Xe,l,"TestLoadImage: error",!1,c,f),f.onabort=m(Xe,l,"TestLoadImage: abort",!1,c,f),f.ontimeout=m(Xe,l,"TestLoadImage: timeout",!1,c,f),a.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=i}else c(!1)}function lh(i,c){const l=new an,f=new AbortController,w=setTimeout(()=>{f.abort(),Xe(l,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:f.signal}).then(b=>{clearTimeout(w),b.ok?Xe(l,"TestPingServer: ok",!0,c):Xe(l,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(w),Xe(l,"TestPingServer: error",!1,c)})}function Xe(i,c,l,f,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),f(l)}catch{}}function hh(){this.g=new Wl}function Cs(i){this.i=i.Sb||null,this.h=i.ab||!1}_(Cs,vo),Cs.prototype.g=function(){return new ir(this.i,this.h)};function ir(i,c){pe.call(this),this.H=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}_(ir,pe),r=ir.prototype,r.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=c,this.readyState=1,gn(this)},r.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const c={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(c.body=i),(this.H||a).fetch(new Request(this.D,c)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,pn(this)),this.readyState=0},r.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,gn(this)),this.g&&(this.readyState=3,gn(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Ho(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function Ho(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}r.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.B.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?pn(this):gn(this),this.readyState==3&&Ho(this)}},r.Oa=function(i){this.g&&(this.response=this.responseText=i,pn(this))},r.Na=function(i){this.g&&(this.response=i,pn(this))},r.ga=function(){this.g&&pn(this)};function pn(i){i.readyState=4,i.l=null,i.j=null,i.B=null,gn(i)}r.setRequestHeader=function(i,c){this.A.append(i,c)},r.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var l=c.next();!l.done;)l=l.value,i.push(l[0]+": "+l[1]),l=c.next();return i.join(`\r
`)};function gn(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(ir.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Wo(i){let c="";return Jn(i,function(l,f){c+=f,c+=":",c+=l,c+=`\r
`}),c}function Vs(i,c,l){e:{for(f in l){var f=!1;break e}f=!0}f||(l=Wo(l),typeof i=="string"?l!=null&&cn(l):Y(i,c,l))}function ee(i){pe.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}_(ee,pe);var dh=/^https?$/i,fh=["POST","PUT"];r=ee.prototype,r.Fa=function(i){this.H=i},r.ea=function(i,c,l,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Po.g(),this.g.onreadystatechange=A(d(this.Ca,this));try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(b){Ko(this,b);return}if(i=l||"",l=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var w in f)l.set(w,f[w]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const b of f.keys())l.set(b,f.get(b));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(l.keys()).find(b=>b.toLowerCase()=="content-type"),w=a.FormData&&i instanceof a.FormData,!(Array.prototype.indexOf.call(fh,c,void 0)>=0)||f||w||l.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[b,C]of l)this.g.setRequestHeader(b,C);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(b){Ko(this,b)}};function Ko(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.o=5,Qo(i),or(i)}function Qo(i){i.A||(i.A=!0,Ee(i,"complete"),Ee(i,"error"))}r.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,Ee(this,"complete"),Ee(this,"abort"),or(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),or(this,!0)),ee.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?Xo(this):this.Xa())},r.Xa=function(){Xo(this)};function Xo(i){if(i.h&&typeof o<"u"){if(i.v&&Ye(i)==4)setTimeout(i.Ca.bind(i),0);else if(Ee(i,"readystatechange"),Ye(i)==4){i.h=!1;try{const b=i.ca();e:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var l;if(!(l=c)){var f;if(f=b===0){let C=String(i.D).match(Uo)[1]||null;!C&&a.self&&a.self.location&&(C=a.self.location.protocol.slice(0,-1)),f=!dh.test(C?C.toLowerCase():"")}l=f}if(l)Ee(i,"complete"),Ee(i,"success");else{i.o=6;try{var w=Ye(i)>2?i.g.statusText:""}catch{w=""}i.l=w+" ["+i.ca()+"]",Qo(i)}}finally{or(i)}}}}function or(i,c){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const l=i.g;i.g=null,c||Ee(i,"ready");try{l.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function Ye(i){return i.g?i.g.readyState:0}r.ca=function(){try{return Ye(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),Hl(c)}};function Yo(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function mh(i){const c={};i=(i.g&&Ye(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<i.length;f++){if(g(i[f]))continue;var l=Jl(i[f]);const w=l[0];if(l=l[1],typeof l!="string")continue;l=l.trim();const b=c[w]||[];c[w]=b,b.push(l)}Bl(c,function(f){return f.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function _n(i,c,l){return l&&l.internalChannelParams&&l.internalChannelParams[i]||c}function Jo(i){this.za=0,this.i=[],this.j=new an,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=_n("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=_n("baseRetryDelayMs",5e3,i),this.Za=_n("retryDelaySeedMs",1e4,i),this.Ta=_n("forwardChannelMaxRetries",2,i),this.va=_n("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new Oo(i&&i.concurrentRequestLimit),this.Ba=new hh,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Jo.prototype,r.ka=8,r.I=1,r.connect=function(i,c,l,f){Te(0),this.W=i,this.H=c||{},l&&f!==void 0&&(this.H.OSID=l,this.H.OAID=f),this.F=this.X,this.J=aa(this,null,this.W),cr(this)};function Ds(i){if(Zo(i),i.I==3){var c=i.V++,l=ke(i.J);if(Y(l,"SID",i.M),Y(l,"RID",c),Y(l,"TYPE","terminate"),yn(i,l),c=new Ke(i,i.j,c),c.M=2,c.A=sr(ke(l)),l=!1,a.navigator&&a.navigator.sendBeacon)try{l=a.navigator.sendBeacon(c.A.toString(),"")}catch{}!l&&a.Image&&(new Image().src=c.A,l=!0),l||(c.g=ca(c.j,null),c.g.ea(c.A)),c.F=Date.now(),rr(c)}oa(i)}function ar(i){i.g&&(ks(i),i.g.cancel(),i.g=null)}function Zo(i){ar(i),i.v&&(a.clearTimeout(i.v),i.v=null),ur(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&a.clearTimeout(i.m),i.m=null)}function cr(i){if(!Lo(i.h)&&!i.m){i.m=!0;var c=i.Ea;Re||p(),oe||(Re(),oe=!0),T.add(c,i),i.D=0}}function ph(i,c){return Mo(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=c.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=on(d(i.Ea,i,c),ia(i,i.D)),i.D++,!0)}r.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const w=new Ke(this,this.j,i);let b=this.o;if(this.U&&(b?(b=lo(b),fo(b,this.U)):b=this.U),this.u!==null||this.R||(w.J=b,b=null),this.S)e:{for(var c=0,l=0;l<this.i.length;l++){t:{var f=this.i[l];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(c+=f,c>4096){c=l;break e}if(c===4096||l===this.i.length-1){c=l+1;break e}}c=1e3}else c=1e3;c=ta(this,w,c),l=ke(this.J),Y(l,"RID",i),Y(l,"CVER",22),this.G&&Y(l,"X-HTTP-Session-Id",this.G),yn(this,l),b&&(this.R?c="headers="+cn(Wo(b))+"&"+c:this.u&&Vs(l,this.u,b)),Ss(this.h,w),this.Ra&&Y(l,"TYPE","init"),this.S?(Y(l,"$req",c),Y(l,"SID","null"),w.U=!0,Is(w,l,null)):Is(w,l,c),this.I=2}}else this.I==3&&(i?ea(this,i):this.i.length==0||Lo(this.h)||ea(this))};function ea(i,c){var l;c?l=c.l:l=i.V++;const f=ke(i.J);Y(f,"SID",i.M),Y(f,"RID",l),Y(f,"AID",i.K),yn(i,f),i.u&&i.o&&Vs(f,i.u,i.o),l=new Ke(i,i.j,l,i.D+1),i.u===null&&(l.J=i.o),c&&(i.i=c.G.concat(i.i)),c=ta(i,l,1e3),l.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),Ss(i.h,l),Is(l,f,c)}function yn(i,c){i.H&&Jn(i.H,function(l,f){Y(c,f,l)}),i.l&&Jn({},function(l,f){Y(c,f,l)})}function ta(i,c,l){l=Math.min(i.i.length,l);const f=i.l?d(i.l.Ka,i.l,i):null;e:{var w=i.i;let U=-1;for(;;){const ae=["count="+l];U==-1?l>0?(U=w[0].g,ae.push("ofs="+U)):U=0:ae.push("ofs="+U);let K=!0;for(let ue=0;ue<l;ue++){var b=w[ue].g;const Oe=w[ue].map;if(b-=U,b<0)U=Math.max(0,w[ue].g-100),K=!1;else try{b="req"+b+"_"||"";try{var C=Oe instanceof Map?Oe:Object.entries(Oe);for(const[Tt,Je]of C){let Ze=Je;u(Je)&&(Ze=ys(Je)),ae.push(b+Tt+"="+encodeURIComponent(Ze))}}catch(Tt){throw ae.push(b+"type="+encodeURIComponent("_badmap")),Tt}}catch{f&&f(Oe)}}if(K){C=ae.join("&");break e}}C=void 0}return i=i.i.splice(0,l),c.G=i,C}function na(i){if(!i.g&&!i.v){i.Y=1;var c=i.Da;Re||p(),oe||(Re(),oe=!0),T.add(c,i),i.A=0}}function Ns(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=on(d(i.Da,i),ia(i,i.A)),i.A++,!0)}r.Da=function(){if(this.v=null,ra(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=on(d(this.Wa,this),i)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Te(10),ar(this),ra(this))};function ks(i){i.B!=null&&(a.clearTimeout(i.B),i.B=null)}function ra(i){i.g=new Ke(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var c=ke(i.na);Y(c,"RID","rpc"),Y(c,"SID",i.M),Y(c,"AID",i.K),Y(c,"CI",i.F?"0":"1"),!i.F&&i.ia&&Y(c,"TO",i.ia),Y(c,"TYPE","xmlhttp"),yn(i,c),i.u&&i.o&&Vs(c,i.u,i.o),i.O&&(i.g.H=i.O);var l=i.g;i=i.ba,l.M=1,l.A=sr(ke(c)),l.u=null,l.R=!0,Do(l,i)}r.Va=function(){this.C!=null&&(this.C=null,ar(this),Ns(this),Te(19))};function ur(i){i.C!=null&&(a.clearTimeout(i.C),i.C=null)}function sa(i,c){var l=null;if(i.g==c){ur(i),ks(i),i.g=null;var f=2}else if(Rs(i.h,c))l=c.G,xo(i.h,c),f=1;else return;if(i.I!=0){if(c.o)if(f==1){l=c.u?c.u.length:0,c=Date.now()-c.F;var w=i.D;f=tr(),Ee(f,new Ro(f,l)),cr(i)}else na(i);else if(w=c.m,w==3||w==0&&c.X>0||!(f==1&&ph(i,c)||f==2&&Ns(i)))switch(l&&l.length>0&&(c=i.h,c.i=c.i.concat(l)),w){case 1:Et(i,5);break;case 4:Et(i,10);break;case 3:Et(i,6);break;default:Et(i,2)}}}function ia(i,c){let l=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(l*=2),l*c}function Et(i,c){if(i.j.info("Error code "+c),c==2){var l=d(i.bb,i),f=i.Ua;const w=!f;f=new Qe(f||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||ln(f,"https"),sr(f),w?uh(f.toString(),l):lh(f.toString(),l)}else Te(2);i.I=0,i.l&&i.l.pa(c),oa(i),Zo(i)}r.bb=function(i){i?(this.j.info("Successfully pinged google.com"),Te(2)):(this.j.info("Failed to ping google.com"),Te(1))};function oa(i){if(i.I=0,i.ja=[],i.l){const c=Fo(i.h);(c.length!=0||i.i.length!=0)&&(k(i.ja,c),k(i.ja,i.i),i.h.i.length=0,P(i.i),i.i.length=0),i.l.oa()}}function aa(i,c,l){var f=l instanceof Qe?ke(l):new Qe(l);if(f.g!="")c&&(f.g=c+"."+f.g),hn(f,f.u);else{var w=a.location;f=w.protocol,c=c?c+"."+w.hostname:w.hostname,w=+w.port;const b=new Qe(null);f&&ln(b,f),c&&(b.g=c),w&&hn(b,w),l&&(b.h=l),f=b}return l=i.G,c=i.wa,l&&c&&Y(f,l,c),Y(f,"VER",i.ka),yn(i,f),f}function ca(i,c,l){if(c&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Aa&&!i.ma?new ee(new Cs({ab:l})):new ee(i.ma),c.Fa(i.L),c}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function ua(){}r=ua.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function lr(){}lr.prototype.g=function(i,c){return new Se(i,c)};function Se(i,c){pe.call(this),this.g=new Jo(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.sa&&(i?i["X-WebChannel-Client-Profile"]=c.sa:i={"X-WebChannel-Client-Profile":c.sa}),this.g.U=i,(i=c&&c.Qb)&&!g(i)&&(this.g.u=i),this.A=c&&c.supportsCrossDomainXhr||!1,this.v=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!g(c)&&(this.g.G=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new kt(this)}_(Se,pe),Se.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Se.prototype.close=function(){Ds(this.g)},Se.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var l={};l.__data__=i,i=l}else this.v&&(l={},l.__data__=ys(i),i=l);c.i.push(new th(c.Ya++,i)),c.I==3&&cr(c)},Se.prototype.N=function(){this.g.l=null,delete this.j,Ds(this.g),delete this.g,Se.Z.N.call(this)};function la(i){Es.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){e:{for(const l in c){i=l;break e}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}_(la,Es);function ha(){Ts.call(this),this.status=1}_(ha,Ts);function kt(i){this.g=i}_(kt,ua),kt.prototype.ra=function(){Ee(this.g,"a")},kt.prototype.qa=function(i){Ee(this.g,new la(i))},kt.prototype.pa=function(i){Ee(this.g,new ha)},kt.prototype.oa=function(){Ee(this.g,"b")},lr.prototype.createWebChannel=lr.prototype.g,Se.prototype.send=Se.prototype.o,Se.prototype.open=Se.prototype.m,Se.prototype.close=Se.prototype.close,nu=function(){return new lr},tu=function(){return tr()},eu=gt,ei={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},nr.NO_ERROR=0,nr.TIMEOUT=8,nr.HTTP_ERROR=6,Er=nr,So.COMPLETE="complete",Zc=So,wo.EventType=rn,rn.OPEN="a",rn.CLOSE="b",rn.ERROR="c",rn.MESSAGE="d",pe.prototype.listen=pe.prototype.J,vn=wo,ee.prototype.listenOnce=ee.prototype.K,ee.prototype.getLastError=ee.prototype.Ha,ee.prototype.getLastErrorCode=ee.prototype.ya,ee.prototype.getStatus=ee.prototype.ca,ee.prototype.getResponseJson=ee.prototype.La,ee.prototype.getResponseText=ee.prototype.la,ee.prototype.send=ee.prototype.ea,ee.prototype.setWithCredentials=ee.prototype.Fa,Jc=ee}).apply(typeof dr<"u"?dr:typeof self<"u"?self:typeof window<"u"?window:{});const Aa="@firebase/firestore",ba="4.9.2";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}we.UNAUTHENTICATED=new we(null),we.GOOGLE_CREDENTIALS=new we("google-credentials-uid"),we.FIRST_PARTY=new we("first-party-uid"),we.MOCK_USER=new we("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yt="12.3.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const St=new vi("@firebase/firestore");function Lt(){return St.logLevel}function N(r,...e){if(St.logLevel<=B.DEBUG){const t=e.map(Ai);St.debug(`Firestore (${Yt}): ${r}`,...t)}}function ze(r,...e){if(St.logLevel<=B.ERROR){const t=e.map(Ai);St.error(`Firestore (${Yt}): ${r}`,...t)}}function Nn(r,...e){if(St.logLevel<=B.WARN){const t=e.map(Ai);St.warn(`Firestore (${Yt}): ${r}`,...t)}}function Ai(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,ru(r,n,t)}function ru(r,e,t){let n=`FIRESTORE (${Yt}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw ze(n),new Error(n)}function W(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||ru(e,s,n)}function F(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class V extends dt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class ef{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(we.UNAUTHENTICATED))}shutdown(){}}class tf{constructor(e){this.t=e,this.currentUser=we.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){W(this.o===void 0,42304);let n=this.i;const s=h=>this.i!==n?(n=this.i,t(h)):Promise.resolve();let o=new $e;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new $e,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;e.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},u=h=>{N("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>u(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?u(h):(N("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new $e)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(n=>this.i!==e?(N("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(W(typeof n.accessToken=="string",31837,{l:n}),new Zd(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return W(e===null||typeof e=="string",2055,{h:e}),new we(e)}}class nf{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=we.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class rf{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new nf(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(we.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Ra{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class sf{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,vt(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){W(this.o===void 0,3512);const n=o=>{o.error!=null&&N("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.m;return this.m=o.token,N("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable(()=>n(o))};const s=o=>{N("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?s(o):N("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new Ra(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(W(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Ra(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function of(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=of(40);for(let o=0;o<s.length;++o)n.length<20&&s[o]<t&&(n+=e.charAt(s[o]%62))}return n}}function q(r,e){return r<e?-1:r>e?1:0}function ti(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),o=e.charAt(n);if(s!==o)return Bs(s)===Bs(o)?q(s,o):Bs(s)?1:-1}return q(r.length,e.length)}const af=55296,cf=57343;function Bs(r){const e=r.charCodeAt(0);return e>=af&&e<=cf}function Ht(r,e,t){return r.length===e.length&&r.every((n,s)=>t(n,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sa="__name__";class Le{constructor(e,t,n){t===void 0?t=0:t>e.length&&M(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&M(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return Le.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Le?e.forEach(n=>{t.push(n)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const o=Le.compareSegments(e.get(s),t.get(s));if(o!==0)return o}return q(e.length,t.length)}static compareSegments(e,t){const n=Le.isNumericId(e),s=Le.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?Le.extractNumericId(e).compare(Le.extractNumericId(t)):ti(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return st.fromString(e.substring(4,e.length-2))}}class Q extends Le{construct(e,t,n){return new Q(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new V(R.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(s=>s.length>0))}return new Q(t)}static emptyPath(){return new Q([])}}const uf=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class de extends Le{construct(e,t,n){return new de(e,t,n)}static isValidIdentifier(e){return uf.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),de.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Sa}static keyField(){return new de([Sa])}static fromServerFormat(e){const t=[];let n="",s=0;const o=()=>{if(n.length===0)throw new V(R.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let a=!1;for(;s<e.length;){const u=e[s];if(u==="\\"){if(s+1===e.length)throw new V(R.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const h=e[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new V(R.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=h,s+=2}else u==="`"?(a=!a,s++):u!=="."||a?(n+=u,s++):(o(),s++)}if(o(),a)throw new V(R.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new de(t)}static emptyPath(){return new de([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.path=e}static fromPath(e){return new L(Q.fromString(e))}static fromName(e){return new L(Q.fromString(e).popFirst(5))}static empty(){return new L(Q.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Q.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Q.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new L(new Q(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function su(r,e,t){if(!t)throw new V(R.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function lf(r,e,t,n){if(e===!0&&n===!0)throw new V(R.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Pa(r){if(!L.isDocumentKey(r))throw new V(R.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Ca(r){if(L.isDocumentKey(r))throw new V(R.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function iu(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function zr(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":M(12329,{type:typeof r})}function Ce(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new V(R.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=zr(r);throw new V(R.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function hf(r,e){if(e<=0)throw new V(R.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ie(r,e){const t={typeString:r};return e&&(t.value=e),t}function $n(r,e){if(!iu(r))throw new V(R.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,o="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const a=r[n];if(s&&typeof a!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(o!==void 0&&a!==o.value){t=`Expected '${n}' field to equal '${o.value}'`;break}}if(t)throw new V(R.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Va=-62135596800,Da=1e6;class J{static now(){return J.fromMillis(Date.now())}static fromDate(e){return J.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Da);return new J(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new V(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new V(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Va)throw new V(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new V(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Da}_compareTo(e){return this.seconds===e.seconds?q(this.nanoseconds,e.nanoseconds):q(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:J._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if($n(e,J._jsonSchema))return new J(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Va;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}J._jsonSchemaVersion="firestore/timestamp/1.0",J._jsonSchema={type:ie("string",J._jsonSchemaVersion),seconds:ie("number"),nanoseconds:ie("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x{static fromTimestamp(e){return new x(e)}static min(){return new x(new J(0,0))}static max(){return new x(new J(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kn=-1;function df(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=x.fromTimestamp(n===1e9?new J(t+1,0):new J(t,n));return new ot(s,L.empty(),e)}function ff(r){return new ot(r.readTime,r.key,kn)}class ot{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new ot(x.min(),L.empty(),kn)}static max(){return new ot(x.max(),L.empty(),kn)}}function mf(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=L.comparator(r.documentKey,e.documentKey),t!==0?t:q(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pf="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class gf{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jt(r){if(r.code!==R.FAILED_PRECONDITION||r.message!==pf)throw r;N("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&M(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new S((n,s)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(n,s)},this.catchCallback=o=>{this.wrapFailure(t,o).next(n,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof S?t:S.resolve(t)}catch(t){return S.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):S.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):S.reject(t)}static resolve(e){return new S((t,n)=>{t(e)})}static reject(e){return new S((t,n)=>{n(e)})}static waitFor(e){return new S((t,n)=>{let s=0,o=0,a=!1;e.forEach(u=>{++s,u.next(()=>{++o,a&&o===s&&t()},h=>n(h))}),a=!0,o===s&&t()})}static or(e){let t=S.resolve(!1);for(const n of e)t=t.next(s=>s?S.resolve(s):n());return t}static forEach(e,t){const n=[];return e.forEach((s,o)=>{n.push(t.call(this,s,o))}),this.waitFor(n)}static mapArray(e,t){return new S((n,s)=>{const o=e.length,a=new Array(o);let u=0;for(let h=0;h<o;h++){const d=h;t(e[d]).next(m=>{a[d]=m,++u,u===o&&n(a)},m=>s(m))}})}static doWhile(e,t){return new S((n,s)=>{const o=()=>{e()===!0?t().next(()=>{o()},s):n()};o()})}}function _f(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Zt(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gr{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>t.writeSequenceNumber(n))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Gr.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ri=-1;function Hr(r){return r==null}function Pr(r){return r===0&&1/r==-1/0}function yf(r){return typeof r=="number"&&Number.isInteger(r)&&!Pr(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ou="";function Ef(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Na(e)),e=Tf(r.get(t),e);return Na(e)}function Tf(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const o=r.charAt(s);switch(o){case"\0":t+="";break;case ou:t+="";break;default:t+=o}}return t}function Na(r){return r+ou+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ka(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function ft(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function au(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z{constructor(e,t){this.comparator=e,this.root=t||he.EMPTY}insert(e,t){return new Z(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,he.BLACK,null,null))}remove(e){return new Z(this.comparator,this.root.remove(e,this.comparator).copy(null,null,he.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new fr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new fr(this.root,e,this.comparator,!1)}getReverseIterator(){return new fr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new fr(this.root,e,this.comparator,!0)}}class fr{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?n(e.key,t):1,t&&s&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class he{constructor(e,t,n,s,o){this.key=e,this.value=t,this.color=n??he.RED,this.left=s??he.EMPTY,this.right=o??he.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,o){return new he(e??this.key,t??this.value,n??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const o=n(e,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(e,t,n),null):o===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return he.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return he.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,he.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,he.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw M(43730,{key:this.key,value:this.value});if(this.right.isRed())throw M(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw M(27949);return e+(this.isRed()?0:1)}}he.EMPTY=null,he.RED=!0,he.BLACK=!1;he.EMPTY=new class{constructor(){this.size=0}get key(){throw M(57766)}get value(){throw M(16141)}get color(){throw M(16727)}get left(){throw M(29726)}get right(){throw M(36894)}copy(e,t,n,s,o){return this}insert(e,t,n){return new he(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e){this.comparator=e,this.data=new Z(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Oa(this.data.getIterator())}getIteratorFrom(e){return new Oa(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(n=>{t=t.add(n)}),t}isEqual(e){if(!(e instanceof ce)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=n.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new ce(this.comparator);return t.data=e,t}}class Oa{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e){this.fields=e,e.sort(de.comparator)}static empty(){return new Pe([])}unionWith(e){let t=new ce(de.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Pe(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Ht(this.fields,e.fields,(t,n)=>t.isEqual(n))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new cu("Invalid base64 string: "+o):o}}(e);return new fe(t)}static fromUint8Array(e){const t=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(e);return new fe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return q(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}fe.EMPTY_BYTE_STRING=new fe("");const vf=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function at(r){if(W(!!r,39018),typeof r=="string"){let e=0;const t=vf.exec(r);if(W(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:ne(r.seconds),nanos:ne(r.nanos)}}function ne(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function ct(r){return typeof r=="string"?fe.fromBase64String(r):fe.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uu="server_timestamp",lu="__type__",hu="__previous_value__",du="__local_write_time__";function Si(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[lu])==null?void 0:n.stringValue)===uu}function Wr(r){const e=r.mapValue.fields[hu];return Si(e)?Wr(e):e}function On(r){const e=at(r.mapValue.fields[du].timestampValue);return new J(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wf{constructor(e,t,n,s,o,a,u,h,d,m){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=h,this.useFetchStreams=d,this.isUsingEmulator=m}}const ni="(default)";class Ln{constructor(e,t){this.projectId=e,this.database=t||ni}static empty(){return new Ln("","")}get isDefaultDatabase(){return this.database===ni}isEqual(e){return e instanceof Ln&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fu="__type__",If="__max__",mr={mapValue:{}},mu="__vector__",Cr="value";function ut(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Si(r)?4:bf(r)?9007199254740991:Af(r)?10:11:M(28295,{value:r})}function qe(r,e){if(r===e)return!0;const t=ut(r);if(t!==ut(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return On(r).isEqual(On(e));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=at(s.timestampValue),u=at(o.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos}(r,e);case 5:return r.stringValue===e.stringValue;case 6:return function(s,o){return ct(s.bytesValue).isEqual(ct(o.bytesValue))}(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return function(s,o){return ne(s.geoPointValue.latitude)===ne(o.geoPointValue.latitude)&&ne(s.geoPointValue.longitude)===ne(o.geoPointValue.longitude)}(r,e);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return ne(s.integerValue)===ne(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=ne(s.doubleValue),u=ne(o.doubleValue);return a===u?Pr(a)===Pr(u):isNaN(a)&&isNaN(u)}return!1}(r,e);case 9:return Ht(r.arrayValue.values||[],e.arrayValue.values||[],qe);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},u=o.mapValue.fields||{};if(ka(a)!==ka(u))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(u[h]===void 0||!qe(a[h],u[h])))return!1;return!0}(r,e);default:return M(52216,{left:r})}}function Mn(r,e){return(r.values||[]).find(t=>qe(t,e))!==void 0}function Wt(r,e){if(r===e)return 0;const t=ut(r),n=ut(e);if(t!==n)return q(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return q(r.booleanValue,e.booleanValue);case 2:return function(o,a){const u=ne(o.integerValue||o.doubleValue),h=ne(a.integerValue||a.doubleValue);return u<h?-1:u>h?1:u===h?0:isNaN(u)?isNaN(h)?0:-1:1}(r,e);case 3:return La(r.timestampValue,e.timestampValue);case 4:return La(On(r),On(e));case 5:return ti(r.stringValue,e.stringValue);case 6:return function(o,a){const u=ct(o),h=ct(a);return u.compareTo(h)}(r.bytesValue,e.bytesValue);case 7:return function(o,a){const u=o.split("/"),h=a.split("/");for(let d=0;d<u.length&&d<h.length;d++){const m=q(u[d],h[d]);if(m!==0)return m}return q(u.length,h.length)}(r.referenceValue,e.referenceValue);case 8:return function(o,a){const u=q(ne(o.latitude),ne(a.latitude));return u!==0?u:q(ne(o.longitude),ne(a.longitude))}(r.geoPointValue,e.geoPointValue);case 9:return Ma(r.arrayValue,e.arrayValue);case 10:return function(o,a){var A,P,k,O;const u=o.fields||{},h=a.fields||{},d=(A=u[Cr])==null?void 0:A.arrayValue,m=(P=h[Cr])==null?void 0:P.arrayValue,_=q(((k=d==null?void 0:d.values)==null?void 0:k.length)||0,((O=m==null?void 0:m.values)==null?void 0:O.length)||0);return _!==0?_:Ma(d,m)}(r.mapValue,e.mapValue);case 11:return function(o,a){if(o===mr.mapValue&&a===mr.mapValue)return 0;if(o===mr.mapValue)return 1;if(a===mr.mapValue)return-1;const u=o.fields||{},h=Object.keys(u),d=a.fields||{},m=Object.keys(d);h.sort(),m.sort();for(let _=0;_<h.length&&_<m.length;++_){const A=ti(h[_],m[_]);if(A!==0)return A;const P=Wt(u[h[_]],d[m[_]]);if(P!==0)return P}return q(h.length,m.length)}(r.mapValue,e.mapValue);default:throw M(23264,{he:t})}}function La(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return q(r,e);const t=at(r),n=at(e),s=q(t.seconds,n.seconds);return s!==0?s:q(t.nanos,n.nanos)}function Ma(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const o=Wt(t[s],n[s]);if(o)return o}return q(t.length,n.length)}function Kt(r){return ri(r)}function ri(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(t){const n=at(t);return`time(${n.seconds},${n.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(t){return ct(t).toBase64()}(r.bytesValue):"referenceValue"in r?function(t){return L.fromName(t).toString()}(r.referenceValue):"geoPointValue"in r?function(t){return`geo(${t.latitude},${t.longitude})`}(r.geoPointValue):"arrayValue"in r?function(t){let n="[",s=!0;for(const o of t.values||[])s?s=!1:n+=",",n+=ri(o);return n+"]"}(r.arrayValue):"mapValue"in r?function(t){const n=Object.keys(t.fields||{}).sort();let s="{",o=!0;for(const a of n)o?o=!1:s+=",",s+=`${a}:${ri(t.fields[a])}`;return s+"}"}(r.mapValue):M(61005,{value:r})}function Tr(r){switch(ut(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Wr(r);return e?16+Tr(e):16;case 5:return 2*r.stringValue.length;case 6:return ct(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return function(n){return(n.values||[]).reduce((s,o)=>s+Tr(o),0)}(r.arrayValue);case 10:case 11:return function(n){let s=0;return ft(n.fields,(o,a)=>{s+=o.length+Tr(a)}),s}(r.mapValue);default:throw M(13486,{value:r})}}function xa(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function si(r){return!!r&&"integerValue"in r}function Pi(r){return!!r&&"arrayValue"in r}function Fa(r){return!!r&&"nullValue"in r}function Ua(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function vr(r){return!!r&&"mapValue"in r}function Af(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[fu])==null?void 0:n.stringValue)===mu}function bn(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return ft(r.mapValue.fields,(t,n)=>e.mapValue.fields[t]=bn(n)),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=bn(r.arrayValue.values[t]);return e}return{...r}}function bf(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===If}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ae{constructor(e){this.value=e}static empty(){return new Ae({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!vr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=bn(t)}setAll(e){let t=de.emptyPath(),n={},s=[];e.forEach((a,u)=>{if(!t.isImmediateParentOf(u)){const h=this.getFieldsMap(t);this.applyChanges(h,n,s),n={},s=[],t=u.popLast()}a?n[u.lastSegment()]=bn(a):s.push(u.lastSegment())});const o=this.getFieldsMap(t);this.applyChanges(o,n,s)}delete(e){const t=this.field(e.popLast());vr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return qe(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];vr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){ft(t,(s,o)=>e[s]=o);for(const s of n)delete e[s]}clone(){return new Ae(bn(this.value))}}function pu(r){const e=[];return ft(r.fields,(t,n)=>{const s=new de([t]);if(vr(n)){const o=pu(n.mapValue).fields;if(o.length===0)e.push(s);else for(const a of o)e.push(s.child(a))}else e.push(s)}),new Pe(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(e,t,n,s,o,a,u){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=o,this.data=a,this.documentState=u}static newInvalidDocument(e){return new _e(e,0,x.min(),x.min(),x.min(),Ae.empty(),0)}static newFoundDocument(e,t,n,s){return new _e(e,1,t,x.min(),n,s,0)}static newNoDocument(e,t){return new _e(e,2,t,x.min(),x.min(),Ae.empty(),0)}static newUnknownDocument(e,t){return new _e(e,3,t,x.min(),x.min(),Ae.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(x.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ae.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ae.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=x.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof _e&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new _e(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vr{constructor(e,t){this.position=e,this.inclusive=t}}function Ba(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const o=e[s],a=r.position[s];if(o.field.isKeyField()?n=L.comparator(L.fromName(a.referenceValue),t.key):n=Wt(a,t.data.field(o.field)),o.dir==="desc"&&(n*=-1),n!==0)break}return n}function qa(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!qe(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e,t="asc"){this.field=e,this.dir=t}}function Rf(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{}class se extends gu{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new Pf(e,t,n):t==="array-contains"?new Df(e,n):t==="in"?new Nf(e,n):t==="not-in"?new kf(e,n):t==="array-contains-any"?new Of(e,n):new se(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new Cf(e,n):new Vf(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Wt(t,this.value)):t!==null&&ut(this.value)===ut(t)&&this.matchesComparison(Wt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return M(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ne extends gu{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new Ne(e,t)}matches(e){return _u(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function _u(r){return r.op==="and"}function yu(r){return Sf(r)&&_u(r)}function Sf(r){for(const e of r.filters)if(e instanceof Ne)return!1;return!0}function ii(r){if(r instanceof se)return r.field.canonicalString()+r.op.toString()+Kt(r.value);if(yu(r))return r.filters.map(e=>ii(e)).join(",");{const e=r.filters.map(t=>ii(t)).join(",");return`${r.op}(${e})`}}function Eu(r,e){return r instanceof se?function(n,s){return s instanceof se&&n.op===s.op&&n.field.isEqual(s.field)&&qe(n.value,s.value)}(r,e):r instanceof Ne?function(n,s){return s instanceof Ne&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce((o,a,u)=>o&&Eu(a,s.filters[u]),!0):!1}(r,e):void M(19439)}function Tu(r){return r instanceof se?function(t){return`${t.field.canonicalString()} ${t.op} ${Kt(t.value)}`}(r):r instanceof Ne?function(t){return t.op.toString()+" {"+t.getFilters().map(Tu).join(" ,")+"}"}(r):"Filter"}class Pf extends se{constructor(e,t,n){super(e,t,n),this.key=L.fromName(n.referenceValue)}matches(e){const t=L.comparator(e.key,this.key);return this.matchesComparison(t)}}class Cf extends se{constructor(e,t){super(e,"in",t),this.keys=vu("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Vf extends se{constructor(e,t){super(e,"not-in",t),this.keys=vu("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function vu(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map(n=>L.fromName(n.referenceValue))}class Df extends se{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Pi(t)&&Mn(t.arrayValue,this.value)}}class Nf extends se{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Mn(this.value.arrayValue,t)}}class kf extends se{constructor(e,t){super(e,"not-in",t)}matches(e){if(Mn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Mn(this.value.arrayValue,t)}}class Of extends se{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Pi(t)||!t.arrayValue.values)&&t.arrayValue.values.some(n=>Mn(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lf{constructor(e,t=null,n=[],s=[],o=null,a=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=o,this.startAt=a,this.endAt=u,this.Te=null}}function $a(r,e=null,t=[],n=[],s=null,o=null,a=null){return new Lf(r,e,t,n,s,o,a)}function Ci(r){const e=F(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(n=>ii(n)).join(","),t+="|ob:",t+=e.orderBy.map(n=>function(o){return o.field.canonicalString()+o.dir}(n)).join(","),Hr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(n=>Kt(n)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(n=>Kt(n)).join(",")),e.Te=t}return e.Te}function Vi(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!Rf(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Eu(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!qa(r.startAt,e.startAt)&&qa(r.endAt,e.endAt)}function oi(r){return L.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en{constructor(e,t=null,n=[],s=[],o=null,a="F",u=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=o,this.limitType=a,this.startAt=u,this.endAt=h,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function Mf(r,e,t,n,s,o,a,u){return new en(r,e,t,n,s,o,a,u)}function Kr(r){return new en(r)}function ja(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function wu(r){return r.collectionGroup!==null}function Rn(r){const e=F(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const o of e.explicitOrderBy)e.Ie.push(o),t.add(o.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new ce(de.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(d=>{d.isInequality()&&(u=u.add(d.field))})}),u})(e).forEach(o=>{t.has(o.canonicalString())||o.isKeyField()||e.Ie.push(new xn(o,n))}),t.has(de.keyField().canonicalString())||e.Ie.push(new xn(de.keyField(),n))}return e.Ie}function xe(r){const e=F(r);return e.Ee||(e.Ee=xf(e,Rn(r))),e.Ee}function xf(r,e){if(r.limitType==="F")return $a(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new xn(s.field,o)});const t=r.endAt?new Vr(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Vr(r.startAt.position,r.startAt.inclusive):null;return $a(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function ai(r,e){const t=r.filters.concat([e]);return new en(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function Dr(r,e,t){return new en(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Qr(r,e){return Vi(xe(r),xe(e))&&r.limitType===e.limitType}function Iu(r){return`${Ci(xe(r))}|lt:${r.limitType}`}function Mt(r){return`Query(target=${function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(s=>Tu(s)).join(", ")}]`),Hr(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(s=>Kt(s)).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(s=>Kt(s)).join(",")),`Target(${n})`}(xe(r))}; limitType=${r.limitType})`}function Xr(r,e){return e.isFoundDocument()&&function(n,s){const o=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(o):L.isDocumentKey(n.path)?n.path.isEqual(o):n.path.isImmediateParentOf(o)}(r,e)&&function(n,s){for(const o of Rn(n))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(r,e)&&function(n,s){for(const o of n.filters)if(!o.matches(s))return!1;return!0}(r,e)&&function(n,s){return!(n.startAt&&!function(a,u,h){const d=Ba(a,u,h);return a.inclusive?d<=0:d<0}(n.startAt,Rn(n),s)||n.endAt&&!function(a,u,h){const d=Ba(a,u,h);return a.inclusive?d>=0:d>0}(n.endAt,Rn(n),s))}(r,e)}function Ff(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Au(r){return(e,t)=>{let n=!1;for(const s of Rn(r)){const o=Uf(s,e,t);if(o!==0)return o;n=n||s.field.isKeyField()}return 0}}function Uf(r,e,t){const n=r.field.isKeyField()?L.comparator(e.key,t.key):function(o,a,u){const h=a.data.field(o),d=u.data.field(o);return h!==null&&d!==null?Wt(h,d):M(42886)}(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return M(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,o]of n)if(this.equalsFn(s,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return void(s[o]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){ft(this.inner,(t,n)=>{for(const[s,o]of n)e(s,o)})}isEmpty(){return au(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bf=new Z(L.comparator);function Ge(){return Bf}const bu=new Z(L.comparator);function wn(...r){let e=bu;for(const t of r)e=e.insert(t.key,t);return e}function Ru(r){let e=bu;return r.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function It(){return Sn()}function Su(){return Sn()}function Sn(){return new Ct(r=>r.toString(),(r,e)=>r.isEqual(e))}const qf=new Z(L.comparator),$f=new ce(L.comparator);function $(...r){let e=$f;for(const t of r)e=e.add(t);return e}const jf=new ce(q);function zf(){return jf}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Di(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Pr(e)?"-0":e}}function Pu(r){return{integerValue:""+r}}function Gf(r,e){return yf(e)?Pu(e):Di(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{constructor(){this._=void 0}}function Hf(r,e,t){return r instanceof Fn?function(s,o){const a={fields:{[lu]:{stringValue:uu},[du]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&Si(o)&&(o=Wr(o)),o&&(a.fields[hu]=o),{mapValue:a}}(t,e):r instanceof Un?Vu(r,e):r instanceof Bn?Du(r,e):function(s,o){const a=Cu(s,o),u=za(a)+za(s.Ae);return si(a)&&si(s.Ae)?Pu(u):Di(s.serializer,u)}(r,e)}function Wf(r,e,t){return r instanceof Un?Vu(r,e):r instanceof Bn?Du(r,e):t}function Cu(r,e){return r instanceof Nr?function(n){return si(n)||function(o){return!!o&&"doubleValue"in o}(n)}(e)?e:{integerValue:0}:null}class Fn extends Yr{}class Un extends Yr{constructor(e){super(),this.elements=e}}function Vu(r,e){const t=Nu(e);for(const n of r.elements)t.some(s=>qe(s,n))||t.push(n);return{arrayValue:{values:t}}}class Bn extends Yr{constructor(e){super(),this.elements=e}}function Du(r,e){let t=Nu(e);for(const n of r.elements)t=t.filter(s=>!qe(s,n));return{arrayValue:{values:t}}}class Nr extends Yr{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function za(r){return ne(r.integerValue||r.doubleValue)}function Nu(r){return Pi(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kf{constructor(e,t){this.field=e,this.transform=t}}function Qf(r,e){return r.field.isEqual(e.field)&&function(n,s){return n instanceof Un&&s instanceof Un||n instanceof Bn&&s instanceof Bn?Ht(n.elements,s.elements,qe):n instanceof Nr&&s instanceof Nr?qe(n.Ae,s.Ae):n instanceof Fn&&s instanceof Fn}(r.transform,e.transform)}class Xf{constructor(e,t){this.version=e,this.transformResults=t}}class be{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new be}static exists(e){return new be(void 0,e)}static updateTime(e){return new be(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function wr(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Jr{}function ku(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new Zr(r.key,be.none()):new jn(r.key,r.data,be.none());{const t=r.data,n=Ae.empty();let s=new ce(de.comparator);for(let o of e.fields)if(!s.has(o)){let a=t.field(o);a===null&&o.length>1&&(o=o.popLast(),a=t.field(o)),a===null?n.delete(o):n.set(o,a),s=s.add(o)}return new mt(r.key,n,new Pe(s.toArray()),be.none())}}function Yf(r,e,t){r instanceof jn?function(s,o,a){const u=s.value.clone(),h=Ha(s.fieldTransforms,o,a.transformResults);u.setAll(h),o.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(r,e,t):r instanceof mt?function(s,o,a){if(!wr(s.precondition,o))return void o.convertToUnknownDocument(a.version);const u=Ha(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(Ou(s)),h.setAll(u),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(r,e,t):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Pn(r,e,t,n){return r instanceof jn?function(o,a,u,h){if(!wr(o.precondition,a))return u;const d=o.value.clone(),m=Wa(o.fieldTransforms,h,a);return d.setAll(m),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(r,e,t,n):r instanceof mt?function(o,a,u,h){if(!wr(o.precondition,a))return u;const d=Wa(o.fieldTransforms,h,a),m=a.data;return m.setAll(Ou(o)),m.setAll(d),a.convertToFoundDocument(a.version,m).setHasLocalMutations(),u===null?null:u.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(_=>_.field))}(r,e,t,n):function(o,a,u){return wr(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u}(r,e,t)}function Jf(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),o=Cu(n.transform,s||null);o!=null&&(t===null&&(t=Ae.empty()),t.set(n.field,o))}return t||null}function Ga(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&Ht(n,s,(o,a)=>Qf(o,a))}(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class jn extends Jr{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class mt extends Jr{constructor(e,t,n,s,o=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function Ou(r){const e=new Map;return r.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}}),e}function Ha(r,e,t){const n=new Map;W(r.length===t.length,32656,{Re:t.length,Ve:r.length});for(let s=0;s<t.length;s++){const o=r[s],a=o.transform,u=e.data.field(o.field);n.set(o.field,Wf(a,u,t[s]))}return n}function Wa(r,e,t){const n=new Map;for(const s of r){const o=s.transform,a=t.data.field(s.field);n.set(s.field,Hf(o,a,e))}return n}class Zr extends Jr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Zf extends Jr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class em{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(e.key)&&Yf(o,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Pn(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Pn(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Su();return this.mutations.forEach(s=>{const o=e.get(s.key),a=o.overlayedDocument;let u=this.applyToLocalView(a,o.mutatedFields);u=t.has(s.key)?null:u;const h=ku(a,u);h!==null&&n.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(x.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),$())}isEqual(e){return this.batchId===e.batchId&&Ht(this.mutations,e.mutations,(t,n)=>Ga(t,n))&&Ht(this.baseMutations,e.baseMutations,(t,n)=>Ga(t,n))}}class Ni{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){W(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let s=function(){return qf}();const o=e.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,n[a].version);return new Ni(e,t,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tm{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nm{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var re,j;function rm(r){switch(r){case R.OK:return M(64938);case R.CANCELLED:case R.UNKNOWN:case R.DEADLINE_EXCEEDED:case R.RESOURCE_EXHAUSTED:case R.INTERNAL:case R.UNAVAILABLE:case R.UNAUTHENTICATED:return!1;case R.INVALID_ARGUMENT:case R.NOT_FOUND:case R.ALREADY_EXISTS:case R.PERMISSION_DENIED:case R.FAILED_PRECONDITION:case R.ABORTED:case R.OUT_OF_RANGE:case R.UNIMPLEMENTED:case R.DATA_LOSS:return!0;default:return M(15467,{code:r})}}function Lu(r){if(r===void 0)return ze("GRPC error has no .code"),R.UNKNOWN;switch(r){case re.OK:return R.OK;case re.CANCELLED:return R.CANCELLED;case re.UNKNOWN:return R.UNKNOWN;case re.DEADLINE_EXCEEDED:return R.DEADLINE_EXCEEDED;case re.RESOURCE_EXHAUSTED:return R.RESOURCE_EXHAUSTED;case re.INTERNAL:return R.INTERNAL;case re.UNAVAILABLE:return R.UNAVAILABLE;case re.UNAUTHENTICATED:return R.UNAUTHENTICATED;case re.INVALID_ARGUMENT:return R.INVALID_ARGUMENT;case re.NOT_FOUND:return R.NOT_FOUND;case re.ALREADY_EXISTS:return R.ALREADY_EXISTS;case re.PERMISSION_DENIED:return R.PERMISSION_DENIED;case re.FAILED_PRECONDITION:return R.FAILED_PRECONDITION;case re.ABORTED:return R.ABORTED;case re.OUT_OF_RANGE:return R.OUT_OF_RANGE;case re.UNIMPLEMENTED:return R.UNIMPLEMENTED;case re.DATA_LOSS:return R.DATA_LOSS;default:return M(39323,{code:r})}}(j=re||(re={}))[j.OK=0]="OK",j[j.CANCELLED=1]="CANCELLED",j[j.UNKNOWN=2]="UNKNOWN",j[j.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",j[j.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",j[j.NOT_FOUND=5]="NOT_FOUND",j[j.ALREADY_EXISTS=6]="ALREADY_EXISTS",j[j.PERMISSION_DENIED=7]="PERMISSION_DENIED",j[j.UNAUTHENTICATED=16]="UNAUTHENTICATED",j[j.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",j[j.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",j[j.ABORTED=10]="ABORTED",j[j.OUT_OF_RANGE=11]="OUT_OF_RANGE",j[j.UNIMPLEMENTED=12]="UNIMPLEMENTED",j[j.INTERNAL=13]="INTERNAL",j[j.UNAVAILABLE=14]="UNAVAILABLE",j[j.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sm(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const im=new st([4294967295,4294967295],0);function Ka(r){const e=sm().encode(r),t=new Yc;return t.update(e),new Uint8Array(t.digest())}function Qa(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new st([t,n],0),new st([s,o],0)]}class ki{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new In(`Invalid padding: ${t}`);if(n<0)throw new In(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new In(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new In(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=st.fromNumber(this.ge)}ye(e,t,n){let s=e.add(t.multiply(st.fromNumber(n)));return s.compare(im)===1&&(s=new st([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=Ka(e),[n,s]=Qa(t);for(let o=0;o<this.hashCount;o++){const a=this.ye(n,s,o);if(!this.we(a))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),a=new ki(o,s,t);return n.forEach(u=>a.insert(u)),a}insert(e){if(this.ge===0)return;const t=Ka(e),[n,s]=Qa(t);for(let o=0;o<this.hashCount;o++){const a=this.ye(n,s,o);this.Se(a)}}Se(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class In extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class es{constructor(e,t,n,s,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,zn.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new es(x.min(),s,new Z(q),Ge(),$())}}class zn{constructor(e,t,n,s,o){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new zn(n,t,$(),$(),$())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ir{constructor(e,t,n,s){this.be=e,this.removedTargetIds=t,this.key=n,this.De=s}}class Mu{constructor(e,t){this.targetId=e,this.Ce=t}}class xu{constructor(e,t,n=fe.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class Xa{constructor(){this.ve=0,this.Fe=Ya(),this.Me=fe.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=$(),t=$(),n=$();return this.Fe.forEach((s,o)=>{switch(o){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:M(38017,{changeType:o})}}),new zn(this.Me,this.xe,e,t,n)}qe(){this.Oe=!1,this.Fe=Ya()}Qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){this.ve-=1,W(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class om{constructor(e){this.Ge=e,this.ze=new Map,this.je=Ge(),this.Je=pr(),this.He=pr(),this.Ye=new Z(q)}Ze(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Xe(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,t=>{const n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.Ke(),n.Ne||n.qe(),n.Le(e.resumeToken);break;case 2:n.Ke(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.We(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:M(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach((n,s)=>{this.rt(s)&&t(s)})}st(e){const t=e.targetId,n=e.Ce.count,s=this.ot(t);if(s){const o=s.target;if(oi(o))if(n===0){const a=new L(o.path);this.et(t,a,_e.newNoDocument(a,x.min()))}else W(n===1,20013,{expectedCount:n});else{const a=this._t(t);if(a!==n){const u=this.ut(e),h=u?this.ct(u,e,a):1;if(h!==0){this.it(t);const d=h===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(t,d)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:o=0}=t;let a,u;try{a=ct(n).toUint8Array()}catch(h){if(h instanceof cu)return Nn("Decoding the base64 bloom filter in existence filter failed ("+h.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw h}try{u=new ki(a,s,o)}catch(h){return Nn(h instanceof In?"BloomFilter error: ":"Applying bloom filter failed: ",h),null}return u.ge===0?null:u}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let s=0;return n.forEach(o=>{const a=this.Ge.ht(),u=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;e.mightContain(u)||(this.et(t,o,null),s++)}),s}Tt(e){const t=new Map;this.ze.forEach((o,a)=>{const u=this.ot(a);if(u){if(o.current&&oi(u.target)){const h=new L(u.target.path);this.It(h).has(a)||this.Et(a,h)||this.et(a,h,_e.newNoDocument(h,e))}o.Be&&(t.set(a,o.ke()),o.qe())}});let n=$();this.He.forEach((o,a)=>{let u=!0;a.forEachWhile(h=>{const d=this.ot(h);return!d||d.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)}),u&&(n=n.add(o))}),this.je.forEach((o,a)=>a.setReadTime(e));const s=new es(e,t,this.Ye,this.je,n);return this.je=Ge(),this.Je=pr(),this.He=pr(),this.Ye=new Z(q),s}Xe(e,t){if(!this.rt(e))return;const n=this.Et(e,t.key)?2:0;this.nt(e).Qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.dt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;const s=this.nt(e);this.Et(e,t)?s.Qe(t,1):s.$e(t),this.He=this.He.insert(t,this.dt(t).delete(e)),this.He=this.He.insert(t,this.dt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let t=this.ze.get(e);return t||(t=new Xa,this.ze.set(e,t)),t}dt(e){let t=this.He.get(e);return t||(t=new ce(q),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new ce(q),this.Je=this.Je.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||N("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new Xa),this.Ge.getRemoteKeysForTarget(e).forEach(t=>{this.et(e,t,null)})}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function pr(){return new Z(L.comparator)}function Ya(){return new Z(L.comparator)}const am={asc:"ASCENDING",desc:"DESCENDING"},cm={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},um={and:"AND",or:"OR"};class lm{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ci(r,e){return r.useProto3Json||Hr(e)?e:{value:e}}function kr(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Fu(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function hm(r,e){return kr(r,e.toTimestamp())}function Fe(r){return W(!!r,49232),x.fromTimestamp(function(t){const n=at(t);return new J(n.seconds,n.nanos)}(r))}function Oi(r,e){return ui(r,e).canonicalString()}function ui(r,e){const t=function(s){return new Q(["projects",s.projectId,"databases",s.database])}(r).child("documents");return e===void 0?t:t.child(e)}function Uu(r){const e=Q.fromString(r);return W(zu(e),10190,{key:e.toString()}),e}function li(r,e){return Oi(r.databaseId,e.path)}function qs(r,e){const t=Uu(e);if(t.get(1)!==r.databaseId.projectId)throw new V(R.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new V(R.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new L(qu(t))}function Bu(r,e){return Oi(r.databaseId,e)}function dm(r){const e=Uu(r);return e.length===4?Q.emptyPath():qu(e)}function hi(r){return new Q(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function qu(r){return W(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Ja(r,e,t){return{name:li(r,e),fields:t.value.mapValue.fields}}function fm(r,e){let t;if("targetChange"in e){e.targetChange;const n=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:M(39313,{state:d})}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],o=function(d,m){return d.useProto3Json?(W(m===void 0||typeof m=="string",58123),fe.fromBase64String(m||"")):(W(m===void 0||m instanceof Buffer||m instanceof Uint8Array,16193),fe.fromUint8Array(m||new Uint8Array))}(r,e.targetChange.resumeToken),a=e.targetChange.cause,u=a&&function(d){const m=d.code===void 0?R.UNKNOWN:Lu(d.code);return new V(m,d.message||"")}(a);t=new xu(n,s,o,u||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=qs(r,n.document.name),o=Fe(n.document.updateTime),a=n.document.createTime?Fe(n.document.createTime):x.min(),u=new Ae({mapValue:{fields:n.document.fields}}),h=_e.newFoundDocument(s,o,a,u),d=n.targetIds||[],m=n.removedTargetIds||[];t=new Ir(d,m,h.key,h)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=qs(r,n.document),o=n.readTime?Fe(n.readTime):x.min(),a=_e.newNoDocument(s,o),u=n.removedTargetIds||[];t=new Ir([],u,a.key,a)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=qs(r,n.document),o=n.removedTargetIds||[];t=new Ir([],o,s,null)}else{if(!("filter"in e))return M(11601,{Rt:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:o}=n,a=new nm(s,o),u=n.targetId;t=new Mu(u,a)}}return t}function mm(r,e){let t;if(e instanceof jn)t={update:Ja(r,e.key,e.value)};else if(e instanceof Zr)t={delete:li(r,e.key)};else if(e instanceof mt)t={update:Ja(r,e.key,e.data),updateMask:Im(e.fieldMask)};else{if(!(e instanceof Zf))return M(16599,{Vt:e.type});t={verify:li(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(n=>function(o,a){const u=a.transform;if(u instanceof Fn)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof Un)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof Bn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof Nr)return{fieldPath:a.field.canonicalString(),increment:u.Ae};throw M(20930,{transform:a.transform})}(0,n))),e.precondition.isNone||(t.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:hm(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:M(27497)}(r,e.precondition)),t}function pm(r,e){return r&&r.length>0?(W(e!==void 0,14353),r.map(t=>function(s,o){let a=s.updateTime?Fe(s.updateTime):Fe(o);return a.isEqual(x.min())&&(a=Fe(o)),new Xf(a,s.transformResults||[])}(t,e))):[]}function gm(r,e){return{documents:[Bu(r,e.path)]}}function _m(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Bu(r,s);const o=function(d){if(d.length!==0)return ju(Ne.create(d,"and"))}(e.filters);o&&(t.structuredQuery.where=o);const a=function(d){if(d.length!==0)return d.map(m=>function(A){return{field:xt(A.field),direction:Tm(A.dir)}}(m))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const u=ci(r,e.limit);return u!==null&&(t.structuredQuery.limit=u),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{ft:t,parent:s}}function ym(r){let e=dm(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){W(n===1,65062);const m=t.from[0];m.allDescendants?s=m.collectionId:e=e.child(m.collectionId)}let o=[];t.where&&(o=function(_){const A=$u(_);return A instanceof Ne&&yu(A)?A.getFilters():[A]}(t.where));let a=[];t.orderBy&&(a=function(_){return _.map(A=>function(k){return new xn(Ft(k.field),function(D){switch(D){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(k.direction))}(A))}(t.orderBy));let u=null;t.limit&&(u=function(_){let A;return A=typeof _=="object"?_.value:_,Hr(A)?null:A}(t.limit));let h=null;t.startAt&&(h=function(_){const A=!!_.before,P=_.values||[];return new Vr(P,A)}(t.startAt));let d=null;return t.endAt&&(d=function(_){const A=!_.before,P=_.values||[];return new Vr(P,A)}(t.endAt)),Mf(e,s,a,o,u,"F",h,d)}function Em(r,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M(28987,{purpose:s})}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function $u(r){return r.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Ft(t.unaryFilter.field);return se.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Ft(t.unaryFilter.field);return se.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=Ft(t.unaryFilter.field);return se.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Ft(t.unaryFilter.field);return se.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return M(61313);default:return M(60726)}}(r):r.fieldFilter!==void 0?function(t){return se.create(Ft(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return M(58110);default:return M(50506)}}(t.fieldFilter.op),t.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(t){return Ne.create(t.compositeFilter.filters.map(n=>$u(n)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return M(1026)}}(t.compositeFilter.op))}(r):M(30097,{filter:r})}function Tm(r){return am[r]}function vm(r){return cm[r]}function wm(r){return um[r]}function xt(r){return{fieldPath:r.canonicalString()}}function Ft(r){return de.fromServerFormat(r.fieldPath)}function ju(r){return r instanceof se?function(t){if(t.op==="=="){if(Ua(t.value))return{unaryFilter:{field:xt(t.field),op:"IS_NAN"}};if(Fa(t.value))return{unaryFilter:{field:xt(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Ua(t.value))return{unaryFilter:{field:xt(t.field),op:"IS_NOT_NAN"}};if(Fa(t.value))return{unaryFilter:{field:xt(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:xt(t.field),op:vm(t.op),value:t.value}}}(r):r instanceof Ne?function(t){const n=t.getFilters().map(s=>ju(s));return n.length===1?n[0]:{compositeFilter:{op:wm(t.op),filters:n}}}(r):M(54877,{filter:r})}function Im(r){const e=[];return r.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function zu(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e,t,n,s,o=x.min(),a=x.min(),u=fe.EMPTY_BYTE_STRING,h=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=u,this.expectedCount=h}withSequenceNumber(e){return new tt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new tt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new tt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new tt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Am{constructor(e){this.yt=e}}function bm(r){const e=ym({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Dr(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rm{constructor(){this.Cn=new Sm}addToCollectionParentIndex(e,t){return this.Cn.add(t),S.resolve()}getCollectionParents(e,t){return S.resolve(this.Cn.getEntries(t))}addFieldIndex(e,t){return S.resolve()}deleteFieldIndex(e,t){return S.resolve()}deleteAllFieldIndexes(e){return S.resolve()}createTargetIndexes(e,t){return S.resolve()}getDocumentsMatchingTarget(e,t){return S.resolve(null)}getIndexType(e,t){return S.resolve(0)}getFieldIndexes(e,t){return S.resolve([])}getNextCollectionGroupToUpdate(e){return S.resolve(null)}getMinOffset(e,t){return S.resolve(ot.min())}getMinOffsetFromCollectionGroup(e,t){return S.resolve(ot.min())}updateCollectionGroup(e,t,n){return S.resolve()}updateIndexEntries(e,t){return S.resolve()}}class Sm{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new ce(Q.comparator),o=!s.has(n);return this.index[t]=s.add(n),o}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new ce(Q.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Za={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Gu=41943040;class Ie{static withCacheSize(e){return new Ie(e,Ie.DEFAULT_COLLECTION_PERCENTILE,Ie.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ie.DEFAULT_COLLECTION_PERCENTILE=10,Ie.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ie.DEFAULT=new Ie(Gu,Ie.DEFAULT_COLLECTION_PERCENTILE,Ie.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ie.DISABLED=new Ie(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new Qt(0)}static cr(){return new Qt(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ec="LruGarbageCollector",Pm=1048576;function tc([r,e],[t,n]){const s=q(r,t);return s===0?q(e,n):s}class Cm{constructor(e){this.Ir=e,this.buffer=new ce(tc),this.Er=0}dr(){return++this.Er}Ar(e){const t=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();tc(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Vm{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(e){N(ec,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Zt(t)?N(ec,"Ignoring IndexedDB error during garbage collection: ",t):await Jt(t)}await this.Vr(3e5)})}}class Dm{constructor(e,t){this.mr=e,this.params=t}calculateTargetCount(e,t){return this.mr.gr(e).next(n=>Math.floor(t/100*n))}nthSequenceNumber(e,t){if(t===0)return S.resolve(Gr.ce);const n=new Cm(t);return this.mr.forEachTarget(e,s=>n.Ar(s.sequenceNumber)).next(()=>this.mr.pr(e,s=>n.Ar(s))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.mr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.mr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(N("LruGarbageCollector","Garbage collection skipped; disabled"),S.resolve(Za)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(N("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Za):this.yr(e,t))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,t){let n,s,o,a,u,h,d;const m=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(_=>(_>this.params.maximumSequenceNumbersToCollect?(N("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${_}`),s=this.params.maximumSequenceNumbersToCollect):s=_,a=Date.now(),this.nthSequenceNumber(e,s))).next(_=>(n=_,u=Date.now(),this.removeTargets(e,n,t))).next(_=>(o=_,h=Date.now(),this.removeOrphanedDocuments(e,n))).next(_=>(d=Date.now(),Lt()<=B.DEBUG&&N("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-m}ms
	Determined least recently used ${s} in `+(u-a)+`ms
	Removed ${o} targets in `+(h-u)+`ms
	Removed ${_} documents in `+(d-h)+`ms
Total Duration: ${d-m}ms`),S.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:o,documentsRemoved:_})))}}function Nm(r,e){return new Dm(r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class km{constructor(){this.changes=new Ct(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,_e.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?S.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Om{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(n=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(n!==null&&Pn(n.mutation,s,Pe.empty(),J.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.getLocalViewOfDocuments(e,n,$()).next(()=>n))}getLocalViewOfDocuments(e,t,n=$()){const s=It();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,n).next(o=>{let a=wn();return o.forEach((u,h)=>{a=a.insert(u,h.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const n=It();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,$()))}populateOverlays(e,t,n){const s=[];return n.forEach(o=>{t.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(e,s).next(o=>{o.forEach((a,u)=>{t.set(a,u)})})}computeViews(e,t,n,s){let o=Ge();const a=Sn(),u=function(){return Sn()}();return t.forEach((h,d)=>{const m=n.get(d.key);s.has(d.key)&&(m===void 0||m.mutation instanceof mt)?o=o.insert(d.key,d):m!==void 0?(a.set(d.key,m.mutation.getFieldMask()),Pn(m.mutation,d,m.mutation.getFieldMask(),J.now())):a.set(d.key,Pe.empty())}),this.recalculateAndSaveOverlays(e,o).next(h=>(h.forEach((d,m)=>a.set(d,m)),t.forEach((d,m)=>u.set(d,new Om(m,a.get(d)??null))),u))}recalculateAndSaveOverlays(e,t){const n=Sn();let s=new Z((a,u)=>a-u),o=$();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const u of a)u.keys().forEach(h=>{const d=t.get(h);if(d===null)return;let m=n.get(h)||Pe.empty();m=u.applyToLocalView(d,m),n.set(h,m);const _=(s.get(u.batchId)||$()).add(h);s=s.insert(u.batchId,_)})}).next(()=>{const a=[],u=s.getReverseIterator();for(;u.hasNext();){const h=u.getNext(),d=h.key,m=h.value,_=Su();m.forEach(A=>{if(!o.has(A)){const P=ku(t.get(A),n.get(A));P!==null&&_.set(A,P),o=o.add(A)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,_))}return S.waitFor(a)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.recalculateAndSaveOverlays(e,n))}getDocumentsMatchingQuery(e,t,n,s){return function(a){return L.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):wu(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-o.size):S.resolve(It());let u=kn,h=o;return a.next(d=>S.forEach(d,(m,_)=>(u<_.largestBatchId&&(u=_.largestBatchId),o.get(m)?S.resolve():this.remoteDocumentCache.getEntry(e,m).next(A=>{h=h.insert(m,A)}))).next(()=>this.populateOverlays(e,d,o)).next(()=>this.computeViews(e,h,d,$())).next(m=>({batchId:u,changes:Ru(m)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new L(t)).next(n=>{let s=wn();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const o=t.collectionGroup;let a=wn();return this.indexManager.getCollectionParents(e,o).next(u=>S.forEach(u,h=>{const d=function(_,A){return new en(A,null,_.explicitOrderBy.slice(),_.filters.slice(),_.limit,_.limitType,_.startAt,_.endAt)}(t,h.child(o));return this.getDocumentsMatchingCollectionQuery(e,d,n,s).next(m=>{m.forEach((_,A)=>{a=a.insert(_,A)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,n,s){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,o,s))).next(a=>{o.forEach((h,d)=>{const m=d.getKey();a.get(m)===null&&(a=a.insert(m,_e.newInvalidDocument(m)))});let u=wn();return a.forEach((h,d)=>{const m=o.get(h);m!==void 0&&Pn(m.mutation,d,Pe.empty(),J.now()),Xr(t,d)&&(u=u.insert(h,d))}),u})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mm{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,t){return S.resolve(this.Lr.get(t))}saveBundleMetadata(e,t){return this.Lr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:Fe(s.createTime)}}(t)),S.resolve()}getNamedQuery(e,t){return S.resolve(this.kr.get(t))}saveNamedQuery(e,t){return this.kr.set(t.name,function(s){return{name:s.name,query:bm(s.bundledQuery),readTime:Fe(s.readTime)}}(t)),S.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xm{constructor(){this.overlays=new Z(L.comparator),this.qr=new Map}getOverlay(e,t){return S.resolve(this.overlays.get(t))}getOverlays(e,t){const n=It();return S.forEach(t,s=>this.getOverlay(e,s).next(o=>{o!==null&&n.set(s,o)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((s,o)=>{this.St(e,t,o)}),S.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.qr.get(n);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.qr.delete(n)),S.resolve()}getOverlaysForCollection(e,t,n){const s=It(),o=t.length+1,a=new L(t.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const h=u.getNext().value,d=h.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===o&&h.largestBatchId>n&&s.set(h.getKey(),h)}return S.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let o=new Z((d,m)=>d-m);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>n){let m=o.get(d.largestBatchId);m===null&&(m=It(),o=o.insert(d.largestBatchId,m)),m.set(d.getKey(),d)}}const u=It(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((d,m)=>u.set(d,m)),!(u.size()>=s)););return S.resolve(u)}St(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const a=this.qr.get(s.largestBatchId).delete(n.key);this.qr.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(n.key,new tm(t,n));let o=this.qr.get(t);o===void 0&&(o=$(),this.qr.set(t,o)),this.qr.set(t,o.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fm{constructor(){this.sessionToken=fe.EMPTY_BYTE_STRING}getSessionToken(e){return S.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,S.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Li{constructor(){this.Qr=new ce(le.$r),this.Ur=new ce(le.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,t){const n=new le(e,t);this.Qr=this.Qr.add(n),this.Ur=this.Ur.add(n)}Wr(e,t){e.forEach(n=>this.addReference(n,t))}removeReference(e,t){this.Gr(new le(e,t))}zr(e,t){e.forEach(n=>this.removeReference(n,t))}jr(e){const t=new L(new Q([])),n=new le(t,e),s=new le(t,e+1),o=[];return this.Ur.forEachInRange([n,s],a=>{this.Gr(a),o.push(a.key)}),o}Jr(){this.Qr.forEach(e=>this.Gr(e))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){const t=new L(new Q([])),n=new le(t,e),s=new le(t,e+1);let o=$();return this.Ur.forEachInRange([n,s],a=>{o=o.add(a.key)}),o}containsKey(e){const t=new le(e,0),n=this.Qr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class le{constructor(e,t){this.key=e,this.Yr=t}static $r(e,t){return L.comparator(e.key,t.key)||q(e.Yr,t.Yr)}static Kr(e,t){return q(e.Yr,t.Yr)||L.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.tr=1,this.Zr=new ce(le.$r)}checkEmpty(e){return S.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const o=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new em(o,t,n,s);this.mutationQueue.push(a);for(const u of s)this.Zr=this.Zr.add(new le(u.key,o)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return S.resolve(a)}lookupMutationBatch(e,t){return S.resolve(this.Xr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.ei(n),o=s<0?0:s;return S.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return S.resolve(this.mutationQueue.length===0?Ri:this.tr-1)}getAllMutationBatches(e){return S.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new le(t,0),s=new le(t,Number.POSITIVE_INFINITY),o=[];return this.Zr.forEachInRange([n,s],a=>{const u=this.Xr(a.Yr);o.push(u)}),S.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new ce(q);return t.forEach(s=>{const o=new le(s,0),a=new le(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([o,a],u=>{n=n.add(u.Yr)})}),S.resolve(this.ti(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let o=n;L.isDocumentKey(o)||(o=o.child(""));const a=new le(new L(o),0);let u=new ce(q);return this.Zr.forEachWhile(h=>{const d=h.key.path;return!!n.isPrefixOf(d)&&(d.length===s&&(u=u.add(h.Yr)),!0)},a),S.resolve(this.ti(u))}ti(e){const t=[];return e.forEach(n=>{const s=this.Xr(n);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){W(this.ni(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Zr;return S.forEach(t.mutations,s=>{const o=new le(s.key,t.batchId);return n=n.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.Zr=n})}ir(e){}containsKey(e,t){const n=new le(t,0),s=this.Zr.firstAfterOrEqual(n);return S.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,S.resolve()}ni(e,t){return this.ei(e)}ei(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Xr(e){const t=this.ei(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bm{constructor(e){this.ri=e,this.docs=function(){return new Z(L.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),o=s?s.size:0,a=this.ri(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return S.resolve(n?n.document.mutableCopy():_e.newInvalidDocument(t))}getEntries(e,t){let n=Ge();return t.forEach(s=>{const o=this.docs.get(s);n=n.insert(s,o?o.document.mutableCopy():_e.newInvalidDocument(s))}),S.resolve(n)}getDocumentsMatchingQuery(e,t,n,s){let o=Ge();const a=t.path,u=new L(a.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(u);for(;h.hasNext();){const{key:d,value:{document:m}}=h.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||mf(ff(m),n)<=0||(s.has(m.key)||Xr(t,m))&&(o=o.insert(m.key,m.mutableCopy()))}return S.resolve(o)}getAllFromCollectionGroup(e,t,n,s){M(9500)}ii(e,t){return S.forEach(this.docs,n=>t(n))}newChangeBuffer(e){return new qm(this)}getSize(e){return S.resolve(this.size)}}class qm extends km{constructor(e){super(),this.Nr=e}applyChanges(e){const t=[];return this.changes.forEach((n,s)=>{s.isValidDocument()?t.push(this.Nr.addEntry(e,s)):this.Nr.removeEntry(n)}),S.waitFor(t)}getFromCache(e,t){return this.Nr.getEntry(e,t)}getAllFromCache(e,t){return this.Nr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $m{constructor(e){this.persistence=e,this.si=new Ct(t=>Ci(t),Vi),this.lastRemoteSnapshotVersion=x.min(),this.highestTargetId=0,this.oi=0,this._i=new Li,this.targetCount=0,this.ai=Qt.ur()}forEachTarget(e,t){return this.si.forEach((n,s)=>t(s)),S.resolve()}getLastRemoteSnapshotVersion(e){return S.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return S.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),S.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.oi&&(this.oi=t),S.resolve()}Pr(e){this.si.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.ai=new Qt(t),this.highestTargetId=t),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,t){return this.Pr(t),this.targetCount+=1,S.resolve()}updateTargetData(e,t){return this.Pr(t),S.resolve()}removeTargetData(e,t){return this.si.delete(t.target),this._i.jr(t.targetId),this.targetCount-=1,S.resolve()}removeTargets(e,t,n){let s=0;const o=[];return this.si.forEach((a,u)=>{u.sequenceNumber<=t&&n.get(u.targetId)===null&&(this.si.delete(a),o.push(this.removeMatchingKeysForTargetId(e,u.targetId)),s++)}),S.waitFor(o).next(()=>s)}getTargetCount(e){return S.resolve(this.targetCount)}getTargetData(e,t){const n=this.si.get(t)||null;return S.resolve(n)}addMatchingKeys(e,t,n){return this._i.Wr(t,n),S.resolve()}removeMatchingKeys(e,t,n){this._i.zr(t,n);const s=this.persistence.referenceDelegate,o=[];return s&&t.forEach(a=>{o.push(s.markPotentiallyOrphaned(e,a))}),S.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this._i.jr(t),S.resolve()}getMatchingKeysForTargetId(e,t){const n=this._i.Hr(t);return S.resolve(n)}containsKey(e,t){return S.resolve(this._i.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hu{constructor(e,t){this.ui={},this.overlays={},this.ci=new Gr(0),this.li=!1,this.li=!0,this.hi=new Fm,this.referenceDelegate=e(this),this.Pi=new $m(this),this.indexManager=new Rm,this.remoteDocumentCache=function(s){return new Bm(s)}(n=>this.referenceDelegate.Ti(n)),this.serializer=new Am(t),this.Ii=new Mm(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new xm,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ui[e.toKey()];return n||(n=new Um(t,this.referenceDelegate),this.ui[e.toKey()]=n),n}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,t,n){N("MemoryPersistence","Starting transaction:",e);const s=new jm(this.ci.next());return this.referenceDelegate.Ei(),n(s).next(o=>this.referenceDelegate.di(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Ai(e,t){return S.or(Object.values(this.ui).map(n=>()=>n.containsKey(e,t)))}}class jm extends gf{constructor(e){super(),this.currentSequenceNumber=e}}class Mi{constructor(e){this.persistence=e,this.Ri=new Li,this.Vi=null}static mi(e){return new Mi(e)}get fi(){if(this.Vi)return this.Vi;throw M(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.fi.delete(n.toString()),S.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.fi.add(n.toString()),S.resolve()}markPotentiallyOrphaned(e,t){return this.fi.add(t.toString()),S.resolve()}removeTarget(e,t){this.Ri.jr(t.targetId).forEach(s=>this.fi.add(s.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(o=>this.fi.add(o.toString()))}).next(()=>n.removeTargetData(e,t))}Ei(){this.Vi=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return S.forEach(this.fi,n=>{const s=L.fromPath(n);return this.gi(e,s).next(o=>{o||t.removeEntry(s,x.min())})}).next(()=>(this.Vi=null,t.apply(e)))}updateLimboDocument(e,t){return this.gi(e,t).next(n=>{n?this.fi.delete(t.toString()):this.fi.add(t.toString())})}Ti(e){return 0}gi(e,t){return S.or([()=>S.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ai(e,t)])}}class Or{constructor(e,t){this.persistence=e,this.pi=new Ct(n=>Ef(n.path),(n,s)=>n.isEqual(s)),this.garbageCollector=Nm(this,t)}static mi(e,t){return new Or(e,t)}Ei(){}di(e){return S.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}gr(e){const t=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next(n=>t.next(s=>n+s))}wr(e){let t=0;return this.pr(e,n=>{t++}).next(()=>t)}pr(e,t){return S.forEach(this.pi,(n,s)=>this.br(e,n,s).next(o=>o?S.resolve():t(s)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),o=s.newChangeBuffer();return s.ii(e,a=>this.br(e,a,t).next(u=>{u||(n++,o.removeEntry(a,x.min()))})).next(()=>o.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.pi.set(t,e.currentSequenceNumber),S.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),S.resolve()}removeReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),S.resolve()}updateLimboDocument(e,t){return this.pi.set(t,e.currentSequenceNumber),S.resolve()}Ti(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Tr(e.data.value)),t}br(e,t,n){return S.or([()=>this.persistence.Ai(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.pi.get(t);return S.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xi{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Es=n,this.ds=s}static As(e,t){let n=$(),s=$();for(const o of t.docChanges)switch(o.type){case 0:n=n.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new xi(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zm{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gm{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=function(){return Fh()?8:_f(De())>0?6:4}()}initialize(e,t){this.ps=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,s){const o={result:null};return this.ys(e,t).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.ws(e,t,s,n).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new zm;return this.Ss(e,t,a).next(u=>{if(o.result=u,this.Vs)return this.bs(e,t,a,u.size)})}).next(()=>o.result)}bs(e,t,n,s){return n.documentReadCount<this.fs?(Lt()<=B.DEBUG&&N("QueryEngine","SDK will not create cache indexes for query:",Mt(t),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),S.resolve()):(Lt()<=B.DEBUG&&N("QueryEngine","Query:",Mt(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.gs*s?(Lt()<=B.DEBUG&&N("QueryEngine","The SDK decides to create cache indexes for query:",Mt(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,xe(t))):S.resolve())}ys(e,t){if(ja(t))return S.resolve(null);let n=xe(t);return this.indexManager.getIndexType(e,n).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=Dr(t,null,"F"),n=xe(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(o=>{const a=$(...o);return this.ps.getDocuments(e,a).next(u=>this.indexManager.getMinOffset(e,n).next(h=>{const d=this.Ds(t,u);return this.Cs(t,d,a,h.readTime)?this.ys(e,Dr(t,null,"F")):this.vs(e,d,t,h)}))})))}ws(e,t,n,s){return ja(t)||s.isEqual(x.min())?S.resolve(null):this.ps.getDocuments(e,n).next(o=>{const a=this.Ds(t,o);return this.Cs(t,a,n,s)?S.resolve(null):(Lt()<=B.DEBUG&&N("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Mt(t)),this.vs(e,a,t,df(s,kn)).next(u=>u))})}Ds(e,t){let n=new ce(Au(e));return t.forEach((s,o)=>{Xr(e,o)&&(n=n.add(o))}),n}Cs(e,t,n,s){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Ss(e,t,n){return Lt()<=B.DEBUG&&N("QueryEngine","Using full collection scan to execute query:",Mt(t)),this.ps.getDocumentsMatchingQuery(e,t,ot.min(),n)}vs(e,t,n,s){return this.ps.getDocumentsMatchingQuery(e,n,s).next(o=>(t.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fi="LocalStore",Hm=3e8;class Wm{constructor(e,t,n,s){this.persistence=e,this.Fs=t,this.serializer=s,this.Ms=new Z(q),this.xs=new Ct(o=>Ci(o),Vi),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(n)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Lm(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Ms))}}function Km(r,e,t,n){return new Wm(r,e,t,n)}async function Wu(r,e){const t=F(r);return await t.persistence.runTransaction("Handle user change","readonly",n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next(o=>(s=o,t.Bs(e),t.mutationQueue.getAllMutationBatches(n))).next(o=>{const a=[],u=[];let h=$();for(const d of s){a.push(d.batchId);for(const m of d.mutations)h=h.add(m.key)}for(const d of o){u.push(d.batchId);for(const m of d.mutations)h=h.add(m.key)}return t.localDocuments.getDocuments(n,h).next(d=>({Ls:d,removedBatchIds:a,addedBatchIds:u}))})})}function Qm(r,e){const t=F(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const s=e.batch.keys(),o=t.Ns.newChangeBuffer({trackRemovals:!0});return function(u,h,d,m){const _=d.batch,A=_.keys();let P=S.resolve();return A.forEach(k=>{P=P.next(()=>m.getEntry(h,k)).next(O=>{const D=d.docVersions.get(k);W(D!==null,48541),O.version.compareTo(D)<0&&(_.applyToRemoteDocument(O,d),O.isValidDocument()&&(O.setReadTime(d.commitVersion),m.addEntry(O)))})}),P.next(()=>u.mutationQueue.removeMutationBatch(h,_))}(t,n,e,o).next(()=>o.apply(n)).next(()=>t.mutationQueue.performConsistencyCheck(n)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(u){let h=$();for(let d=0;d<u.mutationResults.length;++d)u.mutationResults[d].transformResults.length>0&&(h=h.add(u.batch.mutations[d].key));return h}(e))).next(()=>t.localDocuments.getDocuments(n,s))})}function Ku(r){const e=F(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Pi.getLastRemoteSnapshotVersion(t))}function Xm(r,e){const t=F(r),n=e.snapshotVersion;let s=t.Ms;return t.persistence.runTransaction("Apply remote event","readwrite-primary",o=>{const a=t.Ns.newChangeBuffer({trackRemovals:!0});s=t.Ms;const u=[];e.targetChanges.forEach((m,_)=>{const A=s.get(_);if(!A)return;u.push(t.Pi.removeMatchingKeys(o,m.removedDocuments,_).next(()=>t.Pi.addMatchingKeys(o,m.addedDocuments,_)));let P=A.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(_)!==null?P=P.withResumeToken(fe.EMPTY_BYTE_STRING,x.min()).withLastLimboFreeSnapshotVersion(x.min()):m.resumeToken.approximateByteSize()>0&&(P=P.withResumeToken(m.resumeToken,n)),s=s.insert(_,P),function(O,D,z){return O.resumeToken.approximateByteSize()===0||D.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=Hm?!0:z.addedDocuments.size+z.modifiedDocuments.size+z.removedDocuments.size>0}(A,P,m)&&u.push(t.Pi.updateTargetData(o,P))});let h=Ge(),d=$();if(e.documentUpdates.forEach(m=>{e.resolvedLimboDocuments.has(m)&&u.push(t.persistence.referenceDelegate.updateLimboDocument(o,m))}),u.push(Ym(o,a,e.documentUpdates).next(m=>{h=m.ks,d=m.qs})),!n.isEqual(x.min())){const m=t.Pi.getLastRemoteSnapshotVersion(o).next(_=>t.Pi.setTargetsMetadata(o,o.currentSequenceNumber,n));u.push(m)}return S.waitFor(u).next(()=>a.apply(o)).next(()=>t.localDocuments.getLocalViewOfDocuments(o,h,d)).next(()=>h)}).then(o=>(t.Ms=s,o))}function Ym(r,e,t){let n=$(),s=$();return t.forEach(o=>n=n.add(o)),e.getEntries(r,n).next(o=>{let a=Ge();return t.forEach((u,h)=>{const d=o.get(u);h.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(u)),h.isNoDocument()&&h.version.isEqual(x.min())?(e.removeEntry(u,h.readTime),a=a.insert(u,h)):!d.isValidDocument()||h.version.compareTo(d.version)>0||h.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(h),a=a.insert(u,h)):N(Fi,"Ignoring outdated watch update for ",u,". Current version:",d.version," Watch version:",h.version)}),{ks:a,qs:s}})}function Jm(r,e){const t=F(r);return t.persistence.runTransaction("Get next mutation batch","readonly",n=>(e===void 0&&(e=Ri),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e)))}function Zm(r,e){const t=F(r);return t.persistence.runTransaction("Allocate target","readwrite",n=>{let s;return t.Pi.getTargetData(n,e).next(o=>o?(s=o,S.resolve(s)):t.Pi.allocateTargetId(n).next(a=>(s=new tt(e,a,"TargetPurposeListen",n.currentSequenceNumber),t.Pi.addTargetData(n,s).next(()=>s))))}).then(n=>{const s=t.Ms.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Ms=t.Ms.insert(n.targetId,n),t.xs.set(e,n.targetId)),n})}async function di(r,e,t){const n=F(r),s=n.Ms.get(e),o=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",o,a=>n.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!Zt(a))throw a;N(Fi,`Failed to update sequence numbers for target ${e}: ${a}`)}n.Ms=n.Ms.remove(e),n.xs.delete(s.target)}function nc(r,e,t){const n=F(r);let s=x.min(),o=$();return n.persistence.runTransaction("Execute query","readwrite",a=>function(h,d,m){const _=F(h),A=_.xs.get(m);return A!==void 0?S.resolve(_.Ms.get(A)):_.Pi.getTargetData(d,m)}(n,a,xe(e)).next(u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,n.Pi.getMatchingKeysForTargetId(a,u.targetId).next(h=>{o=h})}).next(()=>n.Fs.getDocumentsMatchingQuery(a,e,t?s:x.min(),t?o:$())).next(u=>(ep(n,Ff(e),u),{documents:u,Qs:o})))}function ep(r,e,t){let n=r.Os.get(e)||x.min();t.forEach((s,o)=>{o.readTime.compareTo(n)>0&&(n=o.readTime)}),r.Os.set(e,n)}class rc{constructor(){this.activeTargetIds=zf()}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class tp{constructor(){this.Mo=new rc,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Mo.zs(e),this.xo[e]||"not-current"}updateQueryState(e,t,n){this.xo[e]=t}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new rc,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class np{Oo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sc="ConnectivityMonitor";class ic{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){N(sc,"Network connectivity changed: AVAILABLE");for(const e of this.qo)e(0)}ko(){N(sc,"Network connectivity changed: UNAVAILABLE");for(const e of this.qo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let gr=null;function fi(){return gr===null?gr=function(){return 268435456+Math.round(2147483648*Math.random())}():gr++,"0x"+gr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $s="RestConnection",rp={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class sp{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=t+"://"+e.host,this.Ko=`projects/${n}/databases/${s}`,this.Wo=this.databaseId.database===ni?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Go(e,t,n,s,o){const a=fi(),u=this.zo(e,t.toUriEncodedString());N($s,`Sending RPC '${e}' ${a}:`,u,n);const h={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(h,s,o);const{host:d}=new URL(u),m=Ti(d);return this.Jo(e,u,h,n,m).then(_=>(N($s,`Received RPC '${e}' ${a}: `,_),_),_=>{throw Nn($s,`RPC '${e}' ${a} failed with error: `,_,"url: ",u,"request:",n),_})}Ho(e,t,n,s,o,a){return this.Go(e,t,n,s,o)}jo(e,t,n){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Yt}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((s,o)=>e[o]=s),n&&n.headers.forEach((s,o)=>e[o]=s)}zo(e,t){const n=rp[e];return`${this.Uo}/v1/${t}:${n}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ip{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ge="WebChannelConnection";class op extends sp{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,t,n,s,o){const a=fi();return new Promise((u,h)=>{const d=new Jc;d.setWithCredentials(!0),d.listenOnce(Zc.COMPLETE,()=>{try{switch(d.getLastErrorCode()){case Er.NO_ERROR:const _=d.getResponseJson();N(ge,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(_)),u(_);break;case Er.TIMEOUT:N(ge,`RPC '${e}' ${a} timed out`),h(new V(R.DEADLINE_EXCEEDED,"Request time out"));break;case Er.HTTP_ERROR:const A=d.getStatus();if(N(ge,`RPC '${e}' ${a} failed with status:`,A,"response text:",d.getResponseText()),A>0){let P=d.getResponseJson();Array.isArray(P)&&(P=P[0]);const k=P==null?void 0:P.error;if(k&&k.status&&k.message){const O=function(z){const H=z.toLowerCase().replace(/_/g,"-");return Object.values(R).indexOf(H)>=0?H:R.UNKNOWN}(k.status);h(new V(O,k.message))}else h(new V(R.UNKNOWN,"Server responded with status "+d.getStatus()))}else h(new V(R.UNAVAILABLE,"Connection failed."));break;default:M(9055,{l_:e,streamId:a,h_:d.getLastErrorCode(),P_:d.getLastError()})}}finally{N(ge,`RPC '${e}' ${a} completed.`)}});const m=JSON.stringify(s);N(ge,`RPC '${e}' ${a} sending request:`,s),d.send(t,"POST",m,n,15)})}T_(e,t,n){const s=fi(),o=[this.Uo,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=nu(),u=tu(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(h.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(h.useFetchStreams=!0),this.jo(h.initMessageHeaders,t,n),h.encodeInitMessageHeaders=!0;const m=o.join("");N(ge,`Creating RPC '${e}' stream ${s}: ${m}`,h);const _=a.createWebChannel(m,h);this.I_(_);let A=!1,P=!1;const k=new ip({Yo:D=>{P?N(ge,`Not sending because RPC '${e}' stream ${s} is closed:`,D):(A||(N(ge,`Opening RPC '${e}' stream ${s} transport.`),_.open(),A=!0),N(ge,`RPC '${e}' stream ${s} sending:`,D),_.send(D))},Zo:()=>_.close()}),O=(D,z,H)=>{D.listen(z,X=>{try{H(X)}catch(me){setTimeout(()=>{throw me},0)}})};return O(_,vn.EventType.OPEN,()=>{P||(N(ge,`RPC '${e}' stream ${s} transport opened.`),k.o_())}),O(_,vn.EventType.CLOSE,()=>{P||(P=!0,N(ge,`RPC '${e}' stream ${s} transport closed`),k.a_(),this.E_(_))}),O(_,vn.EventType.ERROR,D=>{P||(P=!0,Nn(ge,`RPC '${e}' stream ${s} transport errored. Name:`,D.name,"Message:",D.message),k.a_(new V(R.UNAVAILABLE,"The operation could not be completed")))}),O(_,vn.EventType.MESSAGE,D=>{var z;if(!P){const H=D.data[0];W(!!H,16349);const X=H,me=(X==null?void 0:X.error)||((z=X[0])==null?void 0:z.error);if(me){N(ge,`RPC '${e}' stream ${s} received error:`,me);const Re=me.status;let oe=function(y){const v=re[y];if(v!==void 0)return Lu(v)}(Re),T=me.message;oe===void 0&&(oe=R.INTERNAL,T="Unknown error status: "+Re+" with message "+me.message),P=!0,k.a_(new V(oe,T)),_.close()}else N(ge,`RPC '${e}' stream ${s} received:`,H),k.u_(H)}}),O(u,eu.STAT_EVENT,D=>{D.stat===ei.PROXY?N(ge,`RPC '${e}' stream ${s} detected buffering proxy`):D.stat===ei.NOPROXY&&N(ge,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{k.__()},0),k}terminate(){this.c_.forEach(e=>e.close()),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter(t=>t===e)}}function js(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ts(r){return new lm(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qu{constructor(e,t,n=1e3,s=1.5,o=6e4){this.Mi=e,this.timerId=t,this.d_=n,this.A_=s,this.R_=o,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const t=Math.floor(this.V_+this.y_()),n=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-n);s>0&&N("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,()=>(this.f_=Date.now(),e())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oc="PersistentStream";class Xu{constructor(e,t,n,s,o,a,u,h){this.Mi=e,this.S_=n,this.b_=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=h,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Qu(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===R.RESOURCE_EXHAUSTED?(ze(t.toString()),ze("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===R.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(t)}K_(){}auth(){this.state=1;const e=this.W_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,s])=>{this.D_===t&&this.G_(n,s)},n=>{e(()=>{const s=new V(R.UNKNOWN,"Fetching auth token failed: "+n.message);return this.z_(s)})})}G_(e,t){const n=this.W_(this.D_);this.stream=this.j_(e,t),this.stream.Xo(()=>{n(()=>this.listener.Xo())}),this.stream.t_(()=>{n(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(s=>{n(()=>this.z_(s))}),this.stream.onMessage(s=>{n(()=>++this.F_==1?this.J_(s):this.onNext(s))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return N(oc,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Mi.enqueueAndForget(()=>this.D_===e?t():(N(oc,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class ap extends Xu{constructor(e,t,n,s,o,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,a),this.serializer=o}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=fm(this.serializer,e),n=function(o){if(!("targetChange"in o))return x.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?x.min():a.readTime?Fe(a.readTime):x.min()}(e);return this.listener.H_(t,n)}Y_(e){const t={};t.database=hi(this.serializer),t.addTarget=function(o,a){let u;const h=a.target;if(u=oi(h)?{documents:gm(o,h)}:{query:_m(o,h).ft},u.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){u.resumeToken=Fu(o,a.resumeToken);const d=ci(o,a.expectedCount);d!==null&&(u.expectedCount=d)}else if(a.snapshotVersion.compareTo(x.min())>0){u.readTime=kr(o,a.snapshotVersion.toTimestamp());const d=ci(o,a.expectedCount);d!==null&&(u.expectedCount=d)}return u}(this.serializer,e);const n=Em(this.serializer,e);n&&(t.labels=n),this.q_(t)}Z_(e){const t={};t.database=hi(this.serializer),t.removeTarget=e,this.q_(t)}}class cp extends Xu{constructor(e,t,n,s,o,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,a),this.serializer=o}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return W(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,W(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){W(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=pm(e.writeResults,e.commitTime),n=Fe(e.commitTime);return this.listener.na(n,t)}ra(){const e={};e.database=hi(this.serializer),this.q_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map(n=>mm(this.serializer,n))};this.q_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class up{}class lp extends up{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new V(R.FAILED_PRECONDITION,"The client has already been terminated.")}Go(e,t,n,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Go(e,ui(t,n),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===R.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new V(R.UNKNOWN,o.toString())})}Ho(e,t,n,s,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,u])=>this.connection.Ho(e,ui(t,n),s,a,u,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===R.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new V(R.UNKNOWN,a.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class hp{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(ze(t),this.aa=!1):N("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pt="RemoteStore";class dp{constructor(e,t,n,s,o){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=o,this.Aa.Oo(a=>{n.enqueueAndForget(async()=>{Vt(this)&&(N(Pt,"Restarting streams for network reachability change."),await async function(h){const d=F(h);d.Ea.add(4),await Gn(d),d.Ra.set("Unknown"),d.Ea.delete(4),await ns(d)}(this))})}),this.Ra=new hp(n,s)}}async function ns(r){if(Vt(r))for(const e of r.da)await e(!0)}async function Gn(r){for(const e of r.da)await e(!1)}function Yu(r,e){const t=F(r);t.Ia.has(e.targetId)||(t.Ia.set(e.targetId,e),$i(t)?qi(t):tn(t).O_()&&Bi(t,e))}function Ui(r,e){const t=F(r),n=tn(t);t.Ia.delete(e),n.O_()&&Ju(t,e),t.Ia.size===0&&(n.O_()?n.L_():Vt(t)&&t.Ra.set("Unknown"))}function Bi(r,e){if(r.Va.Ue(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(x.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}tn(r).Y_(e)}function Ju(r,e){r.Va.Ue(e),tn(r).Z_(e)}function qi(r){r.Va=new om({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),At:e=>r.Ia.get(e)||null,ht:()=>r.datastore.serializer.databaseId}),tn(r).start(),r.Ra.ua()}function $i(r){return Vt(r)&&!tn(r).x_()&&r.Ia.size>0}function Vt(r){return F(r).Ea.size===0}function Zu(r){r.Va=void 0}async function fp(r){r.Ra.set("Online")}async function mp(r){r.Ia.forEach((e,t)=>{Bi(r,e)})}async function pp(r,e){Zu(r),$i(r)?(r.Ra.ha(e),qi(r)):r.Ra.set("Unknown")}async function gp(r,e,t){if(r.Ra.set("Online"),e instanceof xu&&e.state===2&&e.cause)try{await async function(s,o){const a=o.cause;for(const u of o.targetIds)s.Ia.has(u)&&(await s.remoteSyncer.rejectListen(u,a),s.Ia.delete(u),s.Va.removeTarget(u))}(r,e)}catch(n){N(Pt,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Lr(r,n)}else if(e instanceof Ir?r.Va.Ze(e):e instanceof Mu?r.Va.st(e):r.Va.tt(e),!t.isEqual(x.min()))try{const n=await Ku(r.localStore);t.compareTo(n)>=0&&await function(o,a){const u=o.Va.Tt(a);return u.targetChanges.forEach((h,d)=>{if(h.resumeToken.approximateByteSize()>0){const m=o.Ia.get(d);m&&o.Ia.set(d,m.withResumeToken(h.resumeToken,a))}}),u.targetMismatches.forEach((h,d)=>{const m=o.Ia.get(h);if(!m)return;o.Ia.set(h,m.withResumeToken(fe.EMPTY_BYTE_STRING,m.snapshotVersion)),Ju(o,h);const _=new tt(m.target,h,d,m.sequenceNumber);Bi(o,_)}),o.remoteSyncer.applyRemoteEvent(u)}(r,t)}catch(n){N(Pt,"Failed to raise snapshot:",n),await Lr(r,n)}}async function Lr(r,e,t){if(!Zt(e))throw e;r.Ea.add(1),await Gn(r),r.Ra.set("Offline"),t||(t=()=>Ku(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{N(Pt,"Retrying IndexedDB access"),await t(),r.Ea.delete(1),await ns(r)})}function el(r,e){return e().catch(t=>Lr(r,t,e))}async function rs(r){const e=F(r),t=lt(e);let n=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:Ri;for(;_p(e);)try{const s=await Jm(e.localStore,n);if(s===null){e.Ta.length===0&&t.L_();break}n=s.batchId,yp(e,s)}catch(s){await Lr(e,s)}tl(e)&&nl(e)}function _p(r){return Vt(r)&&r.Ta.length<10}function yp(r,e){r.Ta.push(e);const t=lt(r);t.O_()&&t.X_&&t.ea(e.mutations)}function tl(r){return Vt(r)&&!lt(r).x_()&&r.Ta.length>0}function nl(r){lt(r).start()}async function Ep(r){lt(r).ra()}async function Tp(r){const e=lt(r);for(const t of r.Ta)e.ea(t.mutations)}async function vp(r,e,t){const n=r.Ta.shift(),s=Ni.from(n,e,t);await el(r,()=>r.remoteSyncer.applySuccessfulWrite(s)),await rs(r)}async function wp(r,e){e&&lt(r).X_&&await async function(n,s){if(function(a){return rm(a)&&a!==R.ABORTED}(s.code)){const o=n.Ta.shift();lt(n).B_(),await el(n,()=>n.remoteSyncer.rejectFailedWrite(o.batchId,s)),await rs(n)}}(r,e),tl(r)&&nl(r)}async function ac(r,e){const t=F(r);t.asyncQueue.verifyOperationInProgress(),N(Pt,"RemoteStore received new credentials");const n=Vt(t);t.Ea.add(3),await Gn(t),n&&t.Ra.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ea.delete(3),await ns(t)}async function Ip(r,e){const t=F(r);e?(t.Ea.delete(2),await ns(t)):e||(t.Ea.add(2),await Gn(t),t.Ra.set("Unknown"))}function tn(r){return r.ma||(r.ma=function(t,n,s){const o=F(t);return o.sa(),new ap(n,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(r.datastore,r.asyncQueue,{Xo:fp.bind(null,r),t_:mp.bind(null,r),r_:pp.bind(null,r),H_:gp.bind(null,r)}),r.da.push(async e=>{e?(r.ma.B_(),$i(r)?qi(r):r.Ra.set("Unknown")):(await r.ma.stop(),Zu(r))})),r.ma}function lt(r){return r.fa||(r.fa=function(t,n,s){const o=F(t);return o.sa(),new cp(n,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(r.datastore,r.asyncQueue,{Xo:()=>Promise.resolve(),t_:Ep.bind(null,r),r_:wp.bind(null,r),ta:Tp.bind(null,r),na:vp.bind(null,r)}),r.da.push(async e=>{e?(r.fa.B_(),await rs(r)):(await r.fa.stop(),r.Ta.length>0&&(N(Pt,`Stopping write stream with ${r.Ta.length} pending writes`),r.Ta=[]))})),r.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ji{constructor(e,t,n,s,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=o,this.deferred=new $e,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,o){const a=Date.now()+n,u=new ji(e,t,a,s,o);return u.start(n),u}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new V(R.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function zi(r,e){if(ze("AsyncQueue",`${e}: ${r}`),Zt(r))return new V(R.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{static emptySet(e){return new Bt(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||L.comparator(t.key,n.key):(t,n)=>L.comparator(t.key,n.key),this.keyedMap=wn(),this.sortedSet=new Z(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Bt)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=n.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Bt;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cc{constructor(){this.ga=new Z(L.comparator)}track(e){const t=e.doc.key,n=this.ga.get(t);n?e.type!==0&&n.type===3?this.ga=this.ga.insert(t,e):e.type===3&&n.type!==1?this.ga=this.ga.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.ga=this.ga.remove(t):e.type===1&&n.type===2?this.ga=this.ga.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):M(63341,{Rt:e,pa:n}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal((t,n)=>{e.push(n)}),e}}class Xt{constructor(e,t,n,s,o,a,u,h,d){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=u,this.excludesMetadataChanges=h,this.hasCachedResults=d}static fromInitialDocuments(e,t,n,s,o){const a=[];return t.forEach(u=>{a.push({type:0,doc:u})}),new Xt(e,t,Bt.emptySet(t),a,n,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Qr(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ap{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(e=>e.Da())}}class bp{constructor(){this.queries=uc(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(t,n){const s=F(t),o=s.queries;s.queries=uc(),o.forEach((a,u)=>{for(const h of u.Sa)h.onError(n)})})(this,new V(R.ABORTED,"Firestore shutting down"))}}function uc(){return new Ct(r=>Iu(r),Qr)}async function Gi(r,e){const t=F(r);let n=3;const s=e.query;let o=t.queries.get(s);o?!o.ba()&&e.Da()&&(n=2):(o=new Ap,n=e.Da()?0:1);try{switch(n){case 0:o.wa=await t.onListen(s,!0);break;case 1:o.wa=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const u=zi(a,`Initialization of query '${Mt(e.query)}' failed`);return void e.onError(u)}t.queries.set(s,o),o.Sa.push(e),e.va(t.onlineState),o.wa&&e.Fa(o.wa)&&Wi(t)}async function Hi(r,e){const t=F(r),n=e.query;let s=3;const o=t.queries.get(n);if(o){const a=o.Sa.indexOf(e);a>=0&&(o.Sa.splice(a,1),o.Sa.length===0?s=e.Da()?0:1:!o.ba()&&e.Da()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function Rp(r,e){const t=F(r);let n=!1;for(const s of e){const o=s.query,a=t.queries.get(o);if(a){for(const u of a.Sa)u.Fa(s)&&(n=!0);a.wa=s}}n&&Wi(t)}function Sp(r,e,t){const n=F(r),s=n.queries.get(e);if(s)for(const o of s.Sa)o.onError(t);n.queries.delete(e)}function Wi(r){r.Ca.forEach(e=>{e.next()})}var mi,lc;(lc=mi||(mi={})).Ma="default",lc.Cache="cache";class Ki{constructor(e,t,n){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new Xt(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;const n=t!=="Offline";return(!this.options.qa||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}ka(e){e=Xt.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==mi.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(e){this.key=e}}class sl{constructor(e){this.key=e}}class Pp{constructor(e,t){this.query=e,this.Ya=t,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=$(),this.mutatedKeys=$(),this.eu=Au(e),this.tu=new Bt(this.eu)}get nu(){return this.Ya}ru(e,t){const n=t?t.iu:new cc,s=t?t.tu:this.tu;let o=t?t.mutatedKeys:this.mutatedKeys,a=s,u=!1;const h=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((m,_)=>{const A=s.get(m),P=Xr(this.query,_)?_:null,k=!!A&&this.mutatedKeys.has(A.key),O=!!P&&(P.hasLocalMutations||this.mutatedKeys.has(P.key)&&P.hasCommittedMutations);let D=!1;A&&P?A.data.isEqual(P.data)?k!==O&&(n.track({type:3,doc:P}),D=!0):this.su(A,P)||(n.track({type:2,doc:P}),D=!0,(h&&this.eu(P,h)>0||d&&this.eu(P,d)<0)&&(u=!0)):!A&&P?(n.track({type:0,doc:P}),D=!0):A&&!P&&(n.track({type:1,doc:A}),D=!0,(h||d)&&(u=!0)),D&&(P?(a=a.add(P),o=O?o.add(m):o.delete(m)):(a=a.delete(m),o=o.delete(m)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const m=this.query.limitType==="F"?a.last():a.first();a=a.delete(m.key),o=o.delete(m.key),n.track({type:1,doc:m})}return{tu:a,iu:n,Cs:u,mutatedKeys:o}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const o=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const a=e.iu.ya();a.sort((m,_)=>function(P,k){const O=D=>{switch(D){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M(20277,{Rt:D})}};return O(P)-O(k)}(m.type,_.type)||this.eu(m.doc,_.doc)),this.ou(n),s=s??!1;const u=t&&!s?this._u():[],h=this.Xa.size===0&&this.current&&!s?1:0,d=h!==this.Za;return this.Za=h,a.length!==0||d?{snapshot:new Xt(this.query,e.tu,o,a,e.mutatedKeys,h===0,d,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:u}:{au:u}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new cc,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(t=>this.Ya=this.Ya.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ya=this.Ya.delete(t)),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Xa;this.Xa=$(),this.tu.forEach(n=>{this.uu(n.key)&&(this.Xa=this.Xa.add(n.key))});const t=[];return e.forEach(n=>{this.Xa.has(n)||t.push(new sl(n))}),this.Xa.forEach(n=>{e.has(n)||t.push(new rl(n))}),t}cu(e){this.Ya=e.Qs,this.Xa=$();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return Xt.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const Qi="SyncEngine";class Cp{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Vp{constructor(e){this.key=e,this.hu=!1}}class Dp{constructor(e,t,n,s,o,a){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Pu={},this.Tu=new Ct(u=>Iu(u),Qr),this.Iu=new Map,this.Eu=new Set,this.du=new Z(L.comparator),this.Au=new Map,this.Ru=new Li,this.Vu={},this.mu=new Map,this.fu=Qt.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function Np(r,e,t=!0){const n=ll(r);let s;const o=n.Tu.get(e);return o?(n.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.lu()):s=await il(n,e,t,!0),s}async function kp(r,e){const t=ll(r);await il(t,e,!0,!1)}async function il(r,e,t,n){const s=await Zm(r.localStore,xe(e)),o=s.targetId,a=r.sharedClientState.addLocalQueryTarget(o,t);let u;return n&&(u=await Op(r,e,o,a==="current",s.resumeToken)),r.isPrimaryClient&&t&&Yu(r.remoteStore,s),u}async function Op(r,e,t,n,s){r.pu=(_,A,P)=>async function(O,D,z,H){let X=D.view.ru(z);X.Cs&&(X=await nc(O.localStore,D.query,!1).then(({documents:T})=>D.view.ru(T,X)));const me=H&&H.targetChanges.get(D.targetId),Re=H&&H.targetMismatches.get(D.targetId)!=null,oe=D.view.applyChanges(X,O.isPrimaryClient,me,Re);return dc(O,D.targetId,oe.au),oe.snapshot}(r,_,A,P);const o=await nc(r.localStore,e,!0),a=new Pp(e,o.Qs),u=a.ru(o.documents),h=zn.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),d=a.applyChanges(u,r.isPrimaryClient,h);dc(r,t,d.au);const m=new Cp(e,t,a);return r.Tu.set(e,m),r.Iu.has(t)?r.Iu.get(t).push(e):r.Iu.set(t,[e]),d.snapshot}async function Lp(r,e,t){const n=F(r),s=n.Tu.get(e),o=n.Iu.get(s.targetId);if(o.length>1)return n.Iu.set(s.targetId,o.filter(a=>!Qr(a,e))),void n.Tu.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await di(n.localStore,s.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(s.targetId),t&&Ui(n.remoteStore,s.targetId),pi(n,s.targetId)}).catch(Jt)):(pi(n,s.targetId),await di(n.localStore,s.targetId,!0))}async function Mp(r,e){const t=F(r),n=t.Tu.get(e),s=t.Iu.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),Ui(t.remoteStore,n.targetId))}async function xp(r,e,t){const n=zp(r);try{const s=await function(a,u){const h=F(a),d=J.now(),m=u.reduce((P,k)=>P.add(k.key),$());let _,A;return h.persistence.runTransaction("Locally write mutations","readwrite",P=>{let k=Ge(),O=$();return h.Ns.getEntries(P,m).next(D=>{k=D,k.forEach((z,H)=>{H.isValidDocument()||(O=O.add(z))})}).next(()=>h.localDocuments.getOverlayedDocuments(P,k)).next(D=>{_=D;const z=[];for(const H of u){const X=Jf(H,_.get(H.key).overlayedDocument);X!=null&&z.push(new mt(H.key,X,pu(X.value.mapValue),be.exists(!0)))}return h.mutationQueue.addMutationBatch(P,d,z,u)}).next(D=>{A=D;const z=D.applyToLocalDocumentSet(_,O);return h.documentOverlayCache.saveOverlays(P,D.batchId,z)})}).then(()=>({batchId:A.batchId,changes:Ru(_)}))}(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),function(a,u,h){let d=a.Vu[a.currentUser.toKey()];d||(d=new Z(q)),d=d.insert(u,h),a.Vu[a.currentUser.toKey()]=d}(n,s.batchId,t),await Hn(n,s.changes),await rs(n.remoteStore)}catch(s){const o=zi(s,"Failed to persist write");t.reject(o)}}async function ol(r,e){const t=F(r);try{const n=await Xm(t.localStore,e);e.targetChanges.forEach((s,o)=>{const a=t.Au.get(o);a&&(W(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.hu=!0:s.modifiedDocuments.size>0?W(a.hu,14607):s.removedDocuments.size>0&&(W(a.hu,42227),a.hu=!1))}),await Hn(t,n,e)}catch(n){await Jt(n)}}function hc(r,e,t){const n=F(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Tu.forEach((o,a)=>{const u=a.view.va(e);u.snapshot&&s.push(u.snapshot)}),function(a,u){const h=F(a);h.onlineState=u;let d=!1;h.queries.forEach((m,_)=>{for(const A of _.Sa)A.va(u)&&(d=!0)}),d&&Wi(h)}(n.eventManager,e),s.length&&n.Pu.H_(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function Fp(r,e,t){const n=F(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.Au.get(e),o=s&&s.key;if(o){let a=new Z(L.comparator);a=a.insert(o,_e.newNoDocument(o,x.min()));const u=$().add(o),h=new es(x.min(),new Map,new Z(q),a,u);await ol(n,h),n.du=n.du.remove(o),n.Au.delete(e),Xi(n)}else await di(n.localStore,e,!1).then(()=>pi(n,e,t)).catch(Jt)}async function Up(r,e){const t=F(r),n=e.batch.batchId;try{const s=await Qm(t.localStore,e);cl(t,n,null),al(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Hn(t,s)}catch(s){await Jt(s)}}async function Bp(r,e,t){const n=F(r);try{const s=await function(a,u){const h=F(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let m;return h.mutationQueue.lookupMutationBatch(d,u).next(_=>(W(_!==null,37113),m=_.keys(),h.mutationQueue.removeMutationBatch(d,_))).next(()=>h.mutationQueue.performConsistencyCheck(d)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(d,m,u)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,m)).next(()=>h.localDocuments.getDocuments(d,m))})}(n.localStore,e);cl(n,e,t),al(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Hn(n,s)}catch(s){await Jt(s)}}function al(r,e){(r.mu.get(e)||[]).forEach(t=>{t.resolve()}),r.mu.delete(e)}function cl(r,e,t){const n=F(r);let s=n.Vu[n.currentUser.toKey()];if(s){const o=s.get(e);o&&(t?o.reject(t):o.resolve(),s=s.remove(e)),n.Vu[n.currentUser.toKey()]=s}}function pi(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Iu.get(e))r.Tu.delete(n),t&&r.Pu.yu(n,t);r.Iu.delete(e),r.isPrimaryClient&&r.Ru.jr(e).forEach(n=>{r.Ru.containsKey(n)||ul(r,n)})}function ul(r,e){r.Eu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(Ui(r.remoteStore,t),r.du=r.du.remove(e),r.Au.delete(t),Xi(r))}function dc(r,e,t){for(const n of t)n instanceof rl?(r.Ru.addReference(n.key,e),qp(r,n)):n instanceof sl?(N(Qi,"Document no longer in limbo: "+n.key),r.Ru.removeReference(n.key,e),r.Ru.containsKey(n.key)||ul(r,n.key)):M(19791,{wu:n})}function qp(r,e){const t=e.key,n=t.path.canonicalString();r.du.get(t)||r.Eu.has(n)||(N(Qi,"New document in limbo: "+t),r.Eu.add(n),Xi(r))}function Xi(r){for(;r.Eu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Eu.values().next().value;r.Eu.delete(e);const t=new L(Q.fromString(e)),n=r.fu.next();r.Au.set(n,new Vp(t)),r.du=r.du.insert(t,n),Yu(r.remoteStore,new tt(xe(Kr(t.path)),n,"TargetPurposeLimboResolution",Gr.ce))}}async function Hn(r,e,t){const n=F(r),s=[],o=[],a=[];n.Tu.isEmpty()||(n.Tu.forEach((u,h)=>{a.push(n.pu(h,e,t).then(d=>{var m;if((d||t)&&n.isPrimaryClient){const _=d?!d.fromCache:(m=t==null?void 0:t.targetChanges.get(h.targetId))==null?void 0:m.current;n.sharedClientState.updateQueryState(h.targetId,_?"current":"not-current")}if(d){s.push(d);const _=xi.As(h.targetId,d);o.push(_)}}))}),await Promise.all(a),n.Pu.H_(s),await async function(h,d){const m=F(h);try{await m.persistence.runTransaction("notifyLocalViewChanges","readwrite",_=>S.forEach(d,A=>S.forEach(A.Es,P=>m.persistence.referenceDelegate.addReference(_,A.targetId,P)).next(()=>S.forEach(A.ds,P=>m.persistence.referenceDelegate.removeReference(_,A.targetId,P)))))}catch(_){if(!Zt(_))throw _;N(Fi,"Failed to update sequence numbers: "+_)}for(const _ of d){const A=_.targetId;if(!_.fromCache){const P=m.Ms.get(A),k=P.snapshotVersion,O=P.withLastLimboFreeSnapshotVersion(k);m.Ms=m.Ms.insert(A,O)}}}(n.localStore,o))}async function $p(r,e){const t=F(r);if(!t.currentUser.isEqual(e)){N(Qi,"User change. New user:",e.toKey());const n=await Wu(t.localStore,e);t.currentUser=e,function(o,a){o.mu.forEach(u=>{u.forEach(h=>{h.reject(new V(R.CANCELLED,a))})}),o.mu.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Hn(t,n.Ls)}}function jp(r,e){const t=F(r),n=t.Au.get(e);if(n&&n.hu)return $().add(n.key);{let s=$();const o=t.Iu.get(e);if(!o)return s;for(const a of o){const u=t.Tu.get(a);s=s.unionWith(u.view.nu)}return s}}function ll(r){const e=F(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=ol.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=jp.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Fp.bind(null,e),e.Pu.H_=Rp.bind(null,e.eventManager),e.Pu.yu=Sp.bind(null,e.eventManager),e}function zp(r){const e=F(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Up.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Bp.bind(null,e),e}class Mr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ts(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return Km(this.persistence,new Gm,e.initialUser,this.serializer)}Cu(e){return new Hu(Mi.mi,this.serializer)}Du(e){return new tp}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Mr.provider={build:()=>new Mr};class Gp extends Mr{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){W(this.persistence.referenceDelegate instanceof Or,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Vm(n,e.asyncQueue,t)}Cu(e){const t=this.cacheSizeBytes!==void 0?Ie.withCacheSize(this.cacheSizeBytes):Ie.DEFAULT;return new Hu(n=>Or.mi(n,t),this.serializer)}}class gi{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>hc(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=$p.bind(null,this.syncEngine),await Ip(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new bp}()}createDatastore(e){const t=ts(e.databaseInfo.databaseId),n=function(o){return new op(o)}(e.databaseInfo);return function(o,a,u,h){return new lp(o,a,u,h)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(n,s,o,a,u){return new dp(n,s,o,a,u)}(this.localStore,this.datastore,e.asyncQueue,t=>hc(this.syncEngine,t,0),function(){return ic.v()?new ic:new np}())}createSyncEngine(e,t){return function(s,o,a,u,h,d,m){const _=new Dp(s,o,a,u,h,d);return m&&(_.gu=!0),_}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const o=F(s);N(Pt,"RemoteStore shutting down."),o.Ea.add(5),await Gn(o),o.Aa.shutdown(),o.Ra.set("Unknown")}(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}gi.provider={build:()=>new gi};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yi{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):ze("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ht="FirestoreClient";class Hp{constructor(e,t,n,s,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=s,this.user=we.UNAUTHENTICATED,this.clientId=bi.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(n,async a=>{N(ht,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(n,a=>(N(ht,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new $e;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=zi(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function zs(r,e){r.asyncQueue.verifyOperationInProgress(),N(ht,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener(async s=>{n.isEqual(s)||(await Wu(e.localStore,s),n=s)}),e.persistence.setDatabaseDeletedListener(()=>r.terminate()),r._offlineComponents=e}async function fc(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Wp(r);N(ht,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener(n=>ac(e.remoteStore,n)),r.setAppCheckTokenChangeListener((n,s)=>ac(e.remoteStore,s)),r._onlineComponents=e}async function Wp(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){N(ht,"Using user provided OfflineComponentProvider");try{await zs(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===R.FAILED_PRECONDITION||s.code===R.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;Nn("Error using user provided cache. Falling back to memory cache: "+t),await zs(r,new Mr)}}else N(ht,"Using default OfflineComponentProvider"),await zs(r,new Gp(void 0));return r._offlineComponents}async function hl(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(N(ht,"Using user provided OnlineComponentProvider"),await fc(r,r._uninitializedComponentsProvider._online)):(N(ht,"Using default OnlineComponentProvider"),await fc(r,new gi))),r._onlineComponents}function Kp(r){return hl(r).then(e=>e.syncEngine)}async function xr(r){const e=await hl(r),t=e.eventManager;return t.onListen=Np.bind(null,e.syncEngine),t.onUnlisten=Lp.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=kp.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Mp.bind(null,e.syncEngine),t}function Qp(r,e,t={}){const n=new $e;return r.asyncQueue.enqueueAndForget(async()=>function(o,a,u,h,d){const m=new Yi({next:A=>{m.Nu(),a.enqueueAndForget(()=>Hi(o,_));const P=A.docs.has(u);!P&&A.fromCache?d.reject(new V(R.UNAVAILABLE,"Failed to get document because the client is offline.")):P&&A.fromCache&&h&&h.source==="server"?d.reject(new V(R.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(A)},error:A=>d.reject(A)}),_=new Ki(Kr(u.path),m,{includeMetadataChanges:!0,qa:!0});return Gi(o,_)}(await xr(r),r.asyncQueue,e,t,n)),n.promise}function Xp(r,e,t={}){const n=new $e;return r.asyncQueue.enqueueAndForget(async()=>function(o,a,u,h,d){const m=new Yi({next:A=>{m.Nu(),a.enqueueAndForget(()=>Hi(o,_)),A.fromCache&&h.source==="server"?d.reject(new V(R.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(A)},error:A=>d.reject(A)}),_=new Ki(u,m,{includeMetadataChanges:!0,qa:!0});return Gi(o,_)}(await xr(r),r.asyncQueue,e,t,n)),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dl(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mc=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yp="firestore.googleapis.com",pc=!0;class gc{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new V(R.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Yp,this.ssl=pc}else this.host=e.host,this.ssl=e.ssl??pc;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Gu;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Pm)throw new V(R.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}lf("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=dl(e.experimentalLongPollingOptions??{}),function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new V(R.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new V(R.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new V(R.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(n,s){return n.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ji{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new gc({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new V(R.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new V(R.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new gc(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new ef;switch(n.type){case"firstParty":return new rf(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new V(R.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const n=mc.get(t);n&&(N("ComponentProvider","Removing Datastore"),mc.delete(t),n.terminate())}(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new We(this.firestore,e,this._query)}}class te{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new it(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new te(this.firestore,e,this._key)}toJSON(){return{type:te._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if($n(t,te._jsonSchema))return new te(e,n||null,new L(Q.fromString(t.referencePath)))}}te._jsonSchemaVersion="firestore/documentReference/1.0",te._jsonSchema={type:ie("string",te._jsonSchemaVersion),referencePath:ie("string")};class it extends We{constructor(e,t,n){super(e,t,Kr(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new te(this.firestore,null,new L(e))}withConverter(e){return new it(this.firestore,e,this._path)}}function _c(r,e,...t){if(r=ye(r),su("collection","path",e),r instanceof Ji){const n=Q.fromString(e,...t);return Ca(n),new it(r,null,n)}{if(!(r instanceof te||r instanceof it))throw new V(R.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Q.fromString(e,...t));return Ca(n),new it(r.firestore,null,n)}}function yc(r,e,...t){if(r=ye(r),arguments.length===1&&(e=bi.newId()),su("doc","path",e),r instanceof Ji){const n=Q.fromString(e,...t);return Pa(n),new te(r,null,new L(n))}{if(!(r instanceof te||r instanceof it))throw new V(R.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Q.fromString(e,...t));return Pa(n),new te(r.firestore,r instanceof it?r.converter:null,new L(n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ec="AsyncQueue";class Tc{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Qu(this,"async_queue_retry"),this._c=()=>{const n=js();n&&N(Ec,"Visibility state changed to "+n.visibilityState),this.M_.w_()},this.ac=e;const t=js();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=js();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new $e;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Xu.push(e),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!Zt(e))throw e;N(Ec,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(n=>{throw this.nc=n,this.rc=!1,ze("INTERNAL UNHANDLED ERROR: ",vc(n)),n}).then(n=>(this.rc=!1,n))));return this.ac=t,t}enqueueAfterDelay(e,t,n){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const s=ji.createAndSchedule(this,e,t,n,o=>this.hc(o));return this.tc.push(s),s}uc(){this.nc&&M(47125,{Pc:vc(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((t,n)=>t.targetTimeMs-n.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()})}dc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function vc(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wc(r){return function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const o of n)if(o in s&&typeof s[o]=="function")return!0;return!1}(r,["next","error","complete"])}class He extends Ji{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new Tc,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Tc(e),this._firestoreClient=void 0,await e}}}function Wn(r){if(r._terminated)throw new V(R.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Jp(r),r._firestoreClient}function Jp(r){var n,s,o;const e=r._freezeSettings(),t=function(u,h,d,m){return new wf(u,h,d,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,dl(m.experimentalLongPollingOptions),m.useFetchStreams,m.isUsingEmulator)}(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,e);r._componentsProvider||(s=e.localCache)!=null&&s._offlineComponentProvider&&((o=e.localCache)!=null&&o._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new Hp(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&function(u){const h=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(h),_online:h}}(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ve(fe.fromBase64String(e))}catch(t){throw new V(R.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ve(fe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Ve._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if($n(e,Ve._jsonSchema))return Ve.fromBase64String(e.bytes)}}Ve._jsonSchemaVersion="firestore/bytes/1.0",Ve._jsonSchema={type:ie("string",Ve._jsonSchemaVersion),bytes:ie("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new V(R.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new de(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new V(R.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new V(R.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return q(this._lat,e._lat)||q(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ue._jsonSchemaVersion}}static fromJSON(e){if($n(e,Ue._jsonSchema))return new Ue(e.latitude,e.longitude)}}Ue._jsonSchemaVersion="firestore/geoPoint/1.0",Ue._jsonSchema={type:ie("string",Ue._jsonSchemaVersion),latitude:ie("number"),longitude:ie("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(n,s){if(n.length!==s.length)return!1;for(let o=0;o<n.length;++o)if(n[o]!==s[o])return!1;return!0}(this._values,e._values)}toJSON(){return{type:Be._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if($n(e,Be._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new Be(e.vectorValues);throw new V(R.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Be._jsonSchemaVersion="firestore/vectorValue/1.0",Be._jsonSchema={type:ie("string",Be._jsonSchemaVersion),vectorValues:ie("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zp=/^__.*__$/;class eg{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new mt(e,this.data,this.fieldMask,t,this.fieldTransforms):new jn(e,this.data,t,this.fieldTransforms)}}class fl{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new mt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function ml(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M(40011,{Ac:r})}}class Zi{constructor(e,t,n,s,o,a){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,o===void 0&&this.Rc(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(e){return new Zi({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.Vc({path:t,fc:!1});return n.gc(e),n}yc(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.Vc({path:t,fc:!1});return n.Rc(),n}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return Fr(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(e.length===0)throw this.Sc("Document fields must not be empty");if(ml(this.Ac)&&Zp.test(e))throw this.Sc('Document fields cannot begin and end with "__"')}}class tg{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||ts(e)}Cc(e,t,n,s=!1){return new Zi({Ac:e,methodName:t,Dc:n,path:de.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function is(r){const e=r._freezeSettings(),t=ts(r._databaseId);return new tg(r._databaseId,!!e.ignoreUndefinedProperties,t)}function pl(r,e,t,n,s,o={}){const a=r.Cc(o.merge||o.mergeFields?2:0,e,t,s);to("Data must be an object, but it was:",a,n);const u=yl(n,a);let h,d;if(o.merge)h=new Pe(a.fieldMask),d=a.fieldTransforms;else if(o.mergeFields){const m=[];for(const _ of o.mergeFields){const A=_i(e,_,t);if(!a.contains(A))throw new V(R.INVALID_ARGUMENT,`Field '${A}' is specified in your field mask but missing from your input data.`);Tl(m,A)||m.push(A)}h=new Pe(m),d=a.fieldTransforms.filter(_=>h.covers(_.field))}else h=null,d=a.fieldTransforms;return new eg(new Ae(u),h,d)}class os extends ss{_toFieldTransform(e){if(e.Ac!==2)throw e.Ac===1?e.Sc(`${this._methodName}() can only appear at the top level of your update data`):e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof os}}class eo extends ss{_toFieldTransform(e){return new Kf(e.path,new Fn)}isEqual(e){return e instanceof eo}}function gl(r,e,t,n){const s=r.Cc(1,e,t);to("Data must be an object, but it was:",s,n);const o=[],a=Ae.empty();ft(n,(h,d)=>{const m=no(e,h,t);d=ye(d);const _=s.yc(m);if(d instanceof os)o.push(m);else{const A=Qn(d,_);A!=null&&(o.push(m),a.set(m,A))}});const u=new Pe(o);return new fl(a,u,s.fieldTransforms)}function _l(r,e,t,n,s,o){const a=r.Cc(1,e,t),u=[_i(e,n,t)],h=[s];if(o.length%2!=0)throw new V(R.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let A=0;A<o.length;A+=2)u.push(_i(e,o[A])),h.push(o[A+1]);const d=[],m=Ae.empty();for(let A=u.length-1;A>=0;--A)if(!Tl(d,u[A])){const P=u[A];let k=h[A];k=ye(k);const O=a.yc(P);if(k instanceof os)d.push(P);else{const D=Qn(k,O);D!=null&&(d.push(P),m.set(P,D))}}const _=new Pe(d);return new fl(m,_,a.fieldTransforms)}function ng(r,e,t,n=!1){return Qn(t,r.Cc(n?4:3,e))}function Qn(r,e){if(El(r=ye(r)))return to("Unsupported field value:",e,r),yl(r,e);if(r instanceof ss)return function(n,s){if(!ml(s.Ac))throw s.Sc(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${n._methodName}() is not currently supported inside arrays`);const o=n._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.fc&&e.Ac!==4)throw e.Sc("Nested arrays are not supported");return function(n,s){const o=[];let a=0;for(const u of n){let h=Qn(u,s.wc(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(r,e)}return function(n,s){if((n=ye(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Gf(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const o=J.fromDate(n);return{timestampValue:kr(s.serializer,o)}}if(n instanceof J){const o=new J(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:kr(s.serializer,o)}}if(n instanceof Ue)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Ve)return{bytesValue:Fu(s.serializer,n._byteString)};if(n instanceof te){const o=s.databaseId,a=n.firestore._databaseId;if(!a.isEqual(o))throw s.Sc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Oi(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof Be)return function(a,u){return{mapValue:{fields:{[fu]:{stringValue:mu},[Cr]:{arrayValue:{values:a.toArray().map(d=>{if(typeof d!="number")throw u.Sc("VectorValues must only contain numeric values.");return Di(u.serializer,d)})}}}}}}(n,s);throw s.Sc(`Unsupported field value: ${zr(n)}`)}(r,e)}function yl(r,e){const t={};return au(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ft(r,(n,s)=>{const o=Qn(s,e.mc(n));o!=null&&(t[n]=o)}),{mapValue:{fields:t}}}function El(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof J||r instanceof Ue||r instanceof Ve||r instanceof te||r instanceof ss||r instanceof Be)}function to(r,e,t){if(!El(t)||!iu(t)){const n=zr(t);throw n==="an object"?e.Sc(r+" a custom object"):e.Sc(r+" "+n)}}function _i(r,e,t){if((e=ye(e))instanceof Kn)return e._internalPath;if(typeof e=="string")return no(r,e);throw Fr("Field path arguments must be of type string or ",r,!1,void 0,t)}const rg=new RegExp("[~\\*/\\[\\]]");function no(r,e,t){if(e.search(rg)>=0)throw Fr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Kn(...e.split("."))._internalPath}catch{throw Fr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Fr(r,e,t,n,s){const o=n&&!n.isEmpty(),a=s!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${n}`),a&&(h+=` in document ${s}`),h+=")"),new V(R.INVALID_ARGUMENT,u+r+h)}function Tl(r,e){return r.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vl{constructor(e,t,n,s,o){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new te(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new sg(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(as("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class sg extends vl{data(){return super.data()}}function as(r,e){return typeof e=="string"?no(r,e):e instanceof Kn?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wl(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new V(R.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class ro{}class so extends ro{}function Ot(r,e,...t){let n=[];e instanceof ro&&n.push(e),n=n.concat(t),function(o){const a=o.filter(h=>h instanceof io).length,u=o.filter(h=>h instanceof cs).length;if(a>1||a>0&&u>0)throw new V(R.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const s of n)r=s._apply(r);return r}class cs extends so{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new cs(e,t,n)}_apply(e){const t=this._parse(e);return Il(e._query,t),new We(e.firestore,e.converter,ai(e._query,t))}_parse(e){const t=is(e.firestore);return function(o,a,u,h,d,m,_){let A;if(d.isKeyField()){if(m==="array-contains"||m==="array-contains-any")throw new V(R.INVALID_ARGUMENT,`Invalid Query. You can't perform '${m}' queries on documentId().`);if(m==="in"||m==="not-in"){bc(_,m);const k=[];for(const O of _)k.push(Ac(h,o,O));A={arrayValue:{values:k}}}else A=Ac(h,o,_)}else m!=="in"&&m!=="not-in"&&m!=="array-contains-any"||bc(_,m),A=ng(u,a,_,m==="in"||m==="not-in");return se.create(d,m,A)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Ic(r,e,t){const n=e,s=as("where",r);return cs._create(s,n,t)}class io extends ro{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new io(e,t)}_parse(e){const t=this._queryConstraints.map(n=>n._parse(e)).filter(n=>n.getFilters().length>0);return t.length===1?t[0]:Ne.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(s,o){let a=s;const u=o.getFlattenedFilters();for(const h of u)Il(a,h),a=ai(a,h)}(e._query,t),new We(e.firestore,e.converter,ai(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class oo extends so{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new oo(e,t)}_apply(e){const t=function(s,o,a){if(s.startAt!==null)throw new V(R.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new V(R.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new xn(o,a)}(e._query,this._field,this._direction);return new We(e.firestore,e.converter,function(s,o){const a=s.explicitOrderBy.concat([o]);return new en(s.path,s.collectionGroup,a,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(e._query,t))}}function ig(r,e="asc"){const t=e,n=as("orderBy",r);return oo._create(n,t)}class ao extends so{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new ao(e,t,n)}_apply(e){return new We(e.firestore,e.converter,Dr(e._query,this._limit,this._limitType))}}function og(r){return hf("limit",r),ao._create("limit",r,"F")}function Ac(r,e,t){if(typeof(t=ye(t))=="string"){if(t==="")throw new V(R.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!wu(e)&&t.indexOf("/")!==-1)throw new V(R.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(Q.fromString(t));if(!L.isDocumentKey(n))throw new V(R.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return xa(r,new L(n))}if(t instanceof te)return xa(r,t._key);throw new V(R.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${zr(t)}.`)}function bc(r,e){if(!Array.isArray(r)||r.length===0)throw new V(R.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Il(r,e){const t=function(s,o){for(const a of s)for(const u of a.getFlattenedFilters())if(o.indexOf(u.op)>=0)return u.op;return null}(r.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new V(R.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new V(R.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class ag{convertValue(e,t="none"){switch(ut(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ne(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(ct(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw M(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return ft(e,(s,o)=>{n[s]=this.convertValue(o,t)}),n}convertVectorValue(e){var n,s,o;const t=(o=(s=(n=e.fields)==null?void 0:n[Cr].arrayValue)==null?void 0:s.values)==null?void 0:o.map(a=>ne(a.doubleValue));return new Be(t)}convertGeoPoint(e){return new Ue(ne(e.latitude),ne(e.longitude))}convertArray(e,t){return(e.values||[]).map(n=>this.convertValue(n,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Wr(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(On(e));default:return null}}convertTimestamp(e){const t=at(e);return new J(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Q.fromString(e);W(zu(n),9688,{name:e});const s=new Ln(n.get(1),n.get(3)),o=new L(n.popFirst(5));return s.isEqual(t)||ze(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Al(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class An{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class bt extends vl{constructor(e,t,n,s,o,a){super(e,t,n,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ar(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(as("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new V(R.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=bt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}bt._jsonSchemaVersion="firestore/documentSnapshot/1.0",bt._jsonSchema={type:ie("string",bt._jsonSchemaVersion),bundleSource:ie("string","DocumentSnapshot"),bundleName:ie("string"),bundle:ie("string")};class Ar extends bt{data(e={}){return super.data(e)}}class Rt{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new An(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new Ar(this._firestore,this._userDataWriter,n.key,n,new An(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new V(R.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(u=>{const h=new Ar(s._firestore,s._userDataWriter,u.doc.key,u.doc,new An(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:h,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(u=>o||u.type!==3).map(u=>{const h=new Ar(s._firestore,s._userDataWriter,u.doc.key,u.doc,new An(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,m=-1;return u.type!==0&&(d=a.indexOf(u.doc.key),a=a.delete(u.doc.key)),u.type!==1&&(a=a.add(u.doc),m=a.indexOf(u.doc.key)),{type:cg(u.type),doc:h,oldIndex:d,newIndex:m}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new V(R.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Rt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=bi.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach(o=>{o._document!==null&&(t.push(o._document),n.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),s.push(o.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function cg(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M(61501,{type:r})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ug(r){r=Ce(r,te);const e=Ce(r.firestore,He);return Qp(Wn(e),r._key).then(t=>bl(e,r,t))}Rt._jsonSchemaVersion="firestore/querySnapshot/1.0",Rt._jsonSchema={type:ie("string",Rt._jsonSchemaVersion),bundleSource:ie("string","QuerySnapshot"),bundleName:ie("string"),bundle:ie("string")};class co extends ag{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ve(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new te(this.firestore,null,t)}}function lg(r){r=Ce(r,We);const e=Ce(r.firestore,He),t=Wn(e),n=new co(e);return wl(r._query),Xp(t,r._query).then(s=>new Rt(e,n,r,s))}function hg(r,e,t){r=Ce(r,te);const n=Ce(r.firestore,He),s=Al(r.converter,e,t);return us(n,[pl(is(n),"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,be.none())])}function dg(r,e,t,...n){r=Ce(r,te);const s=Ce(r.firestore,He),o=is(s);let a;return a=typeof(e=ye(e))=="string"||e instanceof Kn?_l(o,"updateDoc",r._key,e,t,n):gl(o,"updateDoc",r._key,e),us(s,[a.toMutation(r._key,be.exists(!0))])}function fg(r){return us(Ce(r.firestore,He),[new Zr(r._key,be.none())])}function Rc(r,...e){var h,d,m;r=ye(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||wc(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(wc(e[n])){const _=e[n];e[n]=(h=_.next)==null?void 0:h.bind(_),e[n+1]=(d=_.error)==null?void 0:d.bind(_),e[n+2]=(m=_.complete)==null?void 0:m.bind(_)}let o,a,u;if(r instanceof te)a=Ce(r.firestore,He),u=Kr(r._key.path),o={next:_=>{e[n]&&e[n](bl(a,r,_))},error:e[n+1],complete:e[n+2]};else{const _=Ce(r,We);a=Ce(_.firestore,He),u=_._query;const A=new co(a);o={next:P=>{e[n]&&e[n](new Rt(a,A,_,P))},error:e[n+1],complete:e[n+2]},wl(r._query)}return function(A,P,k,O){const D=new Yi(O),z=new Ki(P,D,k);return A.asyncQueue.enqueueAndForget(async()=>Gi(await xr(A),z)),()=>{D.Nu(),A.asyncQueue.enqueueAndForget(async()=>Hi(await xr(A),z))}}(Wn(a),u,s,o)}function us(r,e){return function(n,s){const o=new $e;return n.asyncQueue.enqueueAndForget(async()=>xp(await Kp(n),s,o)),o.promise}(Wn(r),e)}function bl(r,e,t){const n=t.docs.get(e._key),s=new co(r);return new bt(r,s,e._key,n,new An(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mg{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=is(e)}set(e,t,n){this._verifyNotCommitted();const s=Gs(e,this._firestore),o=Al(s.converter,t,n),a=pl(this._dataReader,"WriteBatch.set",s._key,o,s.converter!==null,n);return this._mutations.push(a.toMutation(s._key,be.none())),this}update(e,t,n,...s){this._verifyNotCommitted();const o=Gs(e,this._firestore);let a;return a=typeof(t=ye(t))=="string"||t instanceof Kn?_l(this._dataReader,"WriteBatch.update",o._key,t,n,s):gl(this._dataReader,"WriteBatch.update",o._key,t),this._mutations.push(a.toMutation(o._key,be.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Gs(e,this._firestore);return this._mutations=this._mutations.concat(new Zr(t._key,be.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new V(R.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Gs(r,e){if((r=ye(r)).firestore!==e)throw new V(R.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}function Hs(){return new eo("serverTimestamp")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sc(r){return Wn(r=Ce(r,He)),new mg(r,e=>us(r,e))}(function(e,t=!0){(function(s){Yt=s})(jr),Gt(new zt("firestore",(n,{instanceIdentifier:s,options:o})=>{const a=n.getProvider("app").getImmediate(),u=new He(new tf(n.getProvider("auth-internal")),new sf(a,n.getProvider("app-check-internal")),function(d,m){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new V(R.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ln(d.options.projectId,m)}(a,s),a);return o={useFetchStreams:t,...o},u._setSettings(o),u},"PUBLIC").setMultipleInstances(!0)),rt(Aa,ba,e),rt(Aa,ba,"esm2020")})();function Rl(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const pg=Rl,Sl=new qn("auth","Firebase",Rl());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ur=new vi("@firebase/auth");function gg(r,...e){Ur.logLevel<=B.WARN&&Ur.warn(`Auth (${jr}): ${r}`,...e)}function br(r,...e){Ur.logLevel<=B.ERROR&&Ur.error(`Auth (${jr}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pc(r,...e){throw uo(r,...e)}function Pl(r,...e){return uo(r,...e)}function Cl(r,e,t){const n={...pg(),[e]:t};return new qn("auth","Firebase",n).create(e,{appName:r.name})}function Rr(r){return Cl(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function uo(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return Sl.create(r,...e)}function G(r,e,...t){if(!r)throw uo(e,...t)}function Cn(r){const e="INTERNAL ASSERTION FAILED: "+r;throw br(e),new Error(e)}function Br(r,e){r||Cn(e)}function _g(){return Cc()==="http:"||Cc()==="https:"}function Cc(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yg(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(_g()||Mh()||"connection"in navigator)?navigator.onLine:!0}function Eg(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn{constructor(e,t){this.shortDelay=e,this.longDelay=t,Br(t>e,"Short delay should be less than long delay!"),this.isMobile=kh()||xh()}get(){return yg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tg(r,e){Br(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vl{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Cn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Cn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Cn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vg={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wg=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Ig=new Xn(3e4,6e4);function Dl(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function ls(r,e,t,n,s={}){return Nl(r,s,async()=>{let o={},a={};n&&(e==="GET"?a=n:o={body:JSON.stringify(n)});const u=Hc({key:r.config.apiKey,...a}).slice(1),h=await r._getAdditionalHeaders();h["Content-Type"]="application/json",r.languageCode&&(h["X-Firebase-Locale"]=r.languageCode);const d={method:e,headers:h,...o};return Lh()||(d.referrerPolicy="no-referrer"),r.emulatorConfig&&Ti(r.emulatorConfig.host)&&(d.credentials="include"),Vl.fetch()(await kl(r,r.config.apiHost,t,u),d)})}async function Nl(r,e,t){r._canInitEmulator=!1;const n={...vg,...e};try{const s=new Ag(r),o=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await o.json();if("needConfirmation"in a)throw _r(r,"account-exists-with-different-credential",a);if(o.ok&&!("errorMessage"in a))return a;{const u=o.ok?a.errorMessage:a.error.message,[h,d]=u.split(" : ");if(h==="FEDERATED_USER_ID_ALREADY_LINKED")throw _r(r,"credential-already-in-use",a);if(h==="EMAIL_EXISTS")throw _r(r,"email-already-in-use",a);if(h==="USER_DISABLED")throw _r(r,"user-disabled",a);const m=n[h]||h.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Cl(r,m,d);Pc(r,m)}}catch(s){if(s instanceof dt)throw s;Pc(r,"network-request-failed",{message:String(s)})}}async function kl(r,e,t,n){const s=`${e}${t}?${n}`,o=r,a=o.config.emulator?Tg(r.config,s):`${r.config.apiScheme}://${s}`;return wg.includes(t)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(a).toString():a}class Ag{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(Pl(this.auth,"network-request-failed")),Ig.get())})}}function _r(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const s=Pl(r,e,n);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bg(r,e){return ls(r,"POST","/v1/accounts:delete",e)}async function qr(r,e){return ls(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vn(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Rg(r,e=!1){const t=ye(r),n=await t.getIdToken(e),s=Ol(n);G(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const o=typeof s.firebase=="object"?s.firebase:void 0,a=o==null?void 0:o.sign_in_provider;return{claims:s,token:n,authTime:Vn(Ws(s.auth_time)),issuedAtTime:Vn(Ws(s.iat)),expirationTime:Vn(Ws(s.exp)),signInProvider:a||null,signInSecondFactor:(o==null?void 0:o.sign_in_second_factor)||null}}function Ws(r){return Number(r)*1e3}function Ol(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return br("JWT malformed, contained fewer than 3 sections"),null;try{const s=zc(t);return s?JSON.parse(s):(br("Failed to decode base64 JWT payload"),null)}catch(s){return br("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Vc(r){const e=Ol(r);return G(e,"internal-error"),G(typeof e.exp<"u","internal-error"),G(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yi(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof dt&&Sg(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function Sg({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pg{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const n=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ei{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Vn(this.lastLoginAt),this.creationTime=Vn(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $r(r){var _;const e=r.auth,t=await r.getIdToken(),n=await yi(r,qr(e,{idToken:t}));G(n==null?void 0:n.users.length,e,"internal-error");const s=n.users[0];r._notifyReloadListener(s);const o=(_=s.providerUserInfo)!=null&&_.length?Ll(s.providerUserInfo):[],a=Vg(r.providerData,o),u=r.isAnonymous,h=!(r.email&&s.passwordHash)&&!(a!=null&&a.length),d=u?h:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Ei(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(r,m)}async function Cg(r){const e=ye(r);await $r(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Vg(r,e){return[...r.filter(n=>!e.some(s=>s.providerId===n.providerId)),...e]}function Ll(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dg(r,e){const t=await Nl(r,{},async()=>{const n=Hc({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:o}=r.config,a=await kl(r,s,"/v1/token",`key=${o}`),u=await r._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const h={method:"POST",headers:u,body:n};return r.emulatorConfig&&Ti(r.emulatorConfig.host)&&(h.credentials="include"),Vl.fetch()(a,h)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Ng(r,e){return ls(r,"POST","/v2/accounts:revokeToken",Dl(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){G(e.idToken,"internal-error"),G(typeof e.idToken<"u","internal-error"),G(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Vc(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){G(e.length!==0,"internal-error");const t=Vc(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(G(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:s,expiresIn:o}=await Dg(e,t);this.updateTokensAndExpiration(n,s,Number(o))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:s,expirationTime:o}=t,a=new qt;return n&&(G(typeof n=="string","internal-error",{appName:e}),a.refreshToken=n),s&&(G(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),o&&(G(typeof o=="number","internal-error",{appName:e}),a.expirationTime=o),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new qt,this.toJSON())}_performRefresh(){return Cn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function et(r,e){G(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Me{constructor({uid:e,auth:t,stsTokenManager:n,...s}){this.providerId="firebase",this.proactiveRefresh=new Pg(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Ei(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await yi(this,this.stsTokenManager.getToken(this.auth,e));return G(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Rg(this,e)}reload(){return Cg(this)}_assign(e){this!==e&&(G(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Me({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){G(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await $r(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(vt(this.auth.app))return Promise.reject(Rr(this.auth));const e=await this.getIdToken();return await yi(this,bg(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,s=t.email??void 0,o=t.phoneNumber??void 0,a=t.photoURL??void 0,u=t.tenantId??void 0,h=t._redirectEventId??void 0,d=t.createdAt??void 0,m=t.lastLoginAt??void 0,{uid:_,emailVerified:A,isAnonymous:P,providerData:k,stsTokenManager:O}=t;G(_&&O,e,"internal-error");const D=qt.fromJSON(this.name,O);G(typeof _=="string",e,"internal-error"),et(n,e.name),et(s,e.name),G(typeof A=="boolean",e,"internal-error"),G(typeof P=="boolean",e,"internal-error"),et(o,e.name),et(a,e.name),et(u,e.name),et(h,e.name),et(d,e.name),et(m,e.name);const z=new Me({uid:_,auth:e,email:s,emailVerified:A,displayName:n,isAnonymous:P,photoURL:a,phoneNumber:o,tenantId:u,stsTokenManager:D,createdAt:d,lastLoginAt:m});return k&&Array.isArray(k)&&(z.providerData=k.map(H=>({...H}))),h&&(z._redirectEventId=h),z}static async _fromIdTokenResponse(e,t,n=!1){const s=new qt;s.updateFromServerResponse(t);const o=new Me({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:n});return await $r(o),o}static async _fromGetAccountInfoResponse(e,t,n){const s=t.users[0];G(s.localId!==void 0,"internal-error");const o=s.providerUserInfo!==void 0?Ll(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(o!=null&&o.length),u=new qt;u.updateFromIdToken(n);const h=new Me({uid:s.localId,auth:e,stsTokenManager:u,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new Ei(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(o!=null&&o.length)};return Object.assign(h,d),h}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dc=new Map;function At(r){Br(r instanceof Function,"Expected a class definition");let e=Dc.get(r);return e?(Br(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Dc.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ml{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Ml.type="NONE";const Nc=Ml;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ks(r,e,t){return`firebase:${r}:${e}:${t}`}class $t{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:s,name:o}=this.auth;this.fullUserKey=Ks(this.userKey,s.apiKey,o),this.fullPersistenceKey=Ks("persistence",s.apiKey,o),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await qr(this.auth,{idToken:e}).catch(()=>{});return t?Me._fromGetAccountInfoResponse(this.auth,t,e):null}return Me._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new $t(At(Nc),e,n);const s=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let o=s[0]||At(Nc);const a=Ks(n,e.config.apiKey,e.name);let u=null;for(const d of t)try{const m=await d._get(a);if(m){let _;if(typeof m=="string"){const A=await qr(e,{idToken:m}).catch(()=>{});if(!A)break;_=await Me._fromGetAccountInfoResponse(e,A,m)}else _=Me._fromJSON(e,m);d!==o&&(u=_),o=d;break}}catch{}const h=s.filter(d=>d._shouldAllowMigration);return!o._shouldAllowMigration||!h.length?new $t(o,e,n):(o=h[0],u&&await o._set(a,u.toJSON()),await Promise.all(t.map(async d=>{if(d!==o)try{await d._remove(a)}catch{}})),new $t(o,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kc(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Mg(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(kg(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Fg(e))return"Blackberry";if(Ug(e))return"Webos";if(Og(e))return"Safari";if((e.includes("chrome/")||Lg(e))&&!e.includes("edge/"))return"Chrome";if(xg(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function kg(r=De()){return/firefox\//i.test(r)}function Og(r=De()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Lg(r=De()){return/crios\//i.test(r)}function Mg(r=De()){return/iemobile/i.test(r)}function xg(r=De()){return/android/i.test(r)}function Fg(r=De()){return/blackberry/i.test(r)}function Ug(r=De()){return/webos/i.test(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xl(r,e=[]){let t;switch(r){case"Browser":t=kc(De());break;case"Worker":t=`${kc(De())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${jr}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bg{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=o=>new Promise((a,u)=>{try{const h=e(o);a(h)}catch(h){u(h)}});n.onAbort=t,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qg(r,e={}){return ls(r,"GET","/v2/passwordPolicy",Dl(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $g=6;class jg{constructor(e){var n;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??$g,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((n=e.allowedNonAlphanumericCharacters)==null?void 0:n.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let s=0;s<e.length;s++)n=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,s,o){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zg{constructor(e,t,n,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Oc(this),this.idTokenSubscription=new Oc(this),this.beforeStateQueue=new Bg(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Sl,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=At(t)),this._initializationPromise=this.queue(async()=>{var n,s,o;if(!this._deleted&&(this.persistenceManager=await $t.create(this,e),(n=this._resolvePersistenceManagerAvailable)==null||n.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((o=this.currentUser)==null?void 0:o.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await qr(this,{idToken:e}),n=await Me._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var o;if(vt(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(u,u))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let n=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(o=this.redirectUser)==null?void 0:o._redirectEventId,u=n==null?void 0:n._redirectEventId,h=await this.tryRedirectSignIn(e);(!a||a===u)&&(h!=null&&h.user)&&(n=h.user,s=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(n)}catch(a){n=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return G(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await $r(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Eg()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(vt(this.app))return Promise.reject(Rr(this));const t=e?ye(e):null;return t&&G(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&G(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return vt(this.app)?Promise.reject(Rr(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return vt(this.app)?Promise.reject(Rr(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(At(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await qg(this),t=new jg(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new qn("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await Ng(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&At(e)||this._popupRedirectResolver;G(t,this,"argument-error"),this.redirectPersistenceManager=await $t.create(this,[At(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)==null?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,s){if(this._deleted)return()=>{};const o=typeof t=="function"?t:t.next.bind(t);let a=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(G(u,this,"internal-error"),u.then(()=>{a||o(this.currentUser)}),typeof t=="function"){const h=e.addObserver(t,n,s);return()=>{a=!0,h()}}else{const h=e.addObserver(t);return()=>{a=!0,h()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return G(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=xl(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const n=await this._getAppCheckToken();return n&&(e["X-Firebase-AppCheck"]=n),e}async _getAppCheckToken(){var t;if(vt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&gg(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Gg(r){return ye(r)}class Oc{constructor(e){this.auth=e,this.observer=null,this.addObserver=zh(t=>this.observer=t)}get next(){return G(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}function Hg(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(At);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}new Xn(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Xn(2e3,1e4);/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Xn(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Xn(5e3,15e3);var Lc="@firebase/auth",Mc="1.11.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wg{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){G(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kg(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Qg(r){Gt(new zt("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:a,authDomain:u}=n.options;G(a&&!a.includes(":"),"invalid-api-key",{appName:n.name});const h={apiKey:a,authDomain:u,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:xl(r)},d=new zg(n,s,o,h);return Hg(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Gt(new zt("auth-internal",e=>{const t=Gg(e.getProvider("auth").getImmediate());return(n=>new Wg(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),rt(Lc,Mc,Kg(r)),rt(Lc,Mc,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xg=5*60;Nh("authIdTokenMaxAge");Qg("Browser");let Yg=null;console.warn("⚠️ Firebase não configurado. Sistema funcionará apenas localmente."),console.warn("   Configure as variáveis de ambiente VITE_FIREBASE_* para habilitar sincronização.");const yr="default";class Jg{constructor(){this.db=Yg,this.listeners=new Map,this.available=!1,this.db?(this.available=!0,console.log("✅ Firebase Service disponível")):console.warn("⚠️ Firebase Service não disponível - modo offline apenas")}isAvailable(){return this.available&&this.db!==null}_getCollectionPath(e){if(!this.isAvailable())return null;const t=this._normalizePathSegment(e);return t?_c(this.db,"users",yr,t):(console.warn("⚠️ Nome de coleção inválido para Firebase:",e),null)}_getDocRef(e,t){if(!this.isAvailable())return null;const n=this._normalizePathSegment(e),s=this._normalizePathSegment(t);return!n||!s?(console.warn("⚠️ Referência inválida para Firebase:",{collectionName:e,docId:t}),null):yc(this.db,"users",yr,n,s)}_normalizePathSegment(e){if(e==null)return null;if(typeof e=="string"){const t=e.trim();return t.length>0?t:null}if(typeof e=="number"||typeof e=="bigint")return String(e);if(typeof e=="object"&&typeof e.toString=="function"){const t=e.toString().trim();return t.length>0?t:null}return null}async getDocument(e,t){var n,s;if(!this.isAvailable())return null;try{const o=this._getDocRef(e,t),a=await ug(o);return a.exists()?{id:a.id,...a.data()}:null}catch(o){if(o.code==="unavailable"||(n=o.message)!=null&&n.includes("offline")||(s=o.message)!=null&&s.includes("Failed to get document because the client is offline"))return null;throw console.error(`Erro ao buscar documento ${e}/${t}:`,o),o}}async getCollection(e,t=[],n=null,s="asc",o=null){var a,u;if(!this.isAvailable())return[];try{const h=this._getCollectionPath(e);if(!h)return[];let d=Ot(h);t.forEach(A=>{d=Ot(d,Ic(A.field,A.operator,A.value))}),n&&(d=Ot(d,ig(n,s))),o&&(d=Ot(d,og(o)));const m=await lg(d),_=[];return m.forEach(A=>{_.push({id:A.id,...A.data()})}),_}catch(h){if(h.code==="unavailable"||(a=h.message)!=null&&a.includes("offline")||(u=h.message)!=null&&u.includes("Failed to get document because the client is offline"))return[];throw console.error(`Erro ao buscar coleção ${e}:`,h),h}}async setDocument(e,t,n,s=!0){if(!this.isAvailable())return t||null;try{const o=this._getDocRef(e,t||this._generateId()),a={...n,_lastModified:Hs(),_userId:yr};return await hg(o,a,{merge:s}),o.id}catch(o){throw console.error(`Erro ao salvar documento ${e}/${t}:`,o),o}}async updateDocument(e,t,n){if(!this.isAvailable())return t||null;try{const s=this._getDocRef(e,t),o={...n,_lastModified:Hs()};return await dg(s,o),t}catch(s){throw console.error(`Erro ao atualizar documento ${e}/${t}:`,s),s}}async deleteDocument(e,t){if(this.isAvailable())try{const n=this._getDocRef(e,t);await fg(n)}catch(n){throw console.error(`Erro ao deletar documento ${e}/${t}:`,n),n}}async batchWrite(e){if(!(!this.isAvailable()||!e||e.length===0))try{const t=Sc(this.db),n=500;for(let s=0;s<e.length;s+=n){const o=e.slice(s,s+n),a=Sc(this.db);o.forEach(u=>{const h=this._getDocRef(u.collection,u.docId||this._generateId()),d={...u.data,_lastModified:Hs(),_userId:yr};switch(u.type){case"SET":a.set(h,d,{merge:u.merge!==!1});break;case"UPDATE":a.update(h,d);break;case"DELETE":a.delete(h);break;default:console.warn(`Tipo de operação desconhecido: ${u.type}`)}}),await a.commit()}}catch(t){throw console.error("Erro ao executar batch write:",t),t}}subscribeToDocument(e,t,n){if(!this.isAvailable())return()=>{};try{const s=this._getDocRef(e,t),o=`${e}/${t}`,a=Rc(s,u=>{u.exists()?n({id:u.id,...u.data()}):n(null)},u=>{console.error(`Erro no listener de documento ${e}/${t}:`,u)});return this.listeners.set(o,a),()=>{a(),this.listeners.delete(o)}}catch(s){return console.error(`Erro ao inscrever-se em documento ${e}/${t}:`,s),()=>{}}}subscribeToCollection(e,t,n=[]){if(!this.isAvailable())return()=>{};try{const s=this._getCollectionPath(e);if(!s)return()=>{};let o=Ot(s);n.forEach(h=>{o=Ot(o,Ic(h.field,h.operator,h.value))});const a=`collection/${e}`,u=Rc(o,h=>{const d=[];h.forEach(m=>{d.push({id:m.id,...m.data()})}),t(d)},h=>{console.error(`Erro no listener de coleção ${e}:`,h)});return this.listeners.set(a,u),()=>{u(),this.listeners.delete(a)}}catch(s){return console.error(`Erro ao inscrever-se em coleção ${e}:`,s),()=>{}}}unsubscribeAll(){this.listeners.forEach(e=>{try{e()}catch(t){console.error("Erro ao cancelar listener:",t)}}),this.listeners.clear()}_generateId(){if(!this.isAvailable())return Date.now().toString(36)+Math.random().toString(36).substr(2);const e=_c(this.db,"_temp");return yc(e).id}}const Tn=new Jg,Zg="gerenciador-pedro-cache",e_=1,wt="app-data";async function t_(){return gh(Zg,e_,{upgrade(r){r.objectStoreNames.contains(wt)||r.createObjectStore(wt)}})}class n_{constructor(){this.db=null,this.initialized=!1}async init(){if(!this.initialized)try{this.db=await t_(),this.initialized=!0,console.log("✅ Cache IndexedDB inicializado")}catch(e){console.error("❌ Erro ao inicializar cache:",e)}}async set(e,t){if(this.initialized||await this.init(),!this.db)return!1;try{return await this.db.put(wt,t,e),!0}catch(n){return console.error(`Erro ao salvar no cache (${e}):`,n),!1}}async get(e){if(this.initialized||await this.init(),!this.db)return null;try{return await this.db.get(wt,e)||null}catch(t){return console.error(`Erro ao recuperar do cache (${e}):`,t),null}}async remove(e){if(this.initialized||await this.init(),!this.db)return!1;try{return await this.db.delete(wt,e),!0}catch(t){return console.error(`Erro ao remover do cache (${e}):`,t),!1}}async clear(){if(this.initialized||await this.init(),!this.db)return!1;try{return await this.db.clear(wt),!0}catch(e){return console.error("Erro ao limpar cache:",e),!1}}async has(e){return await this.get(e)!==null}async getAllKeys(){if(this.initialized||await this.init(),!this.db)return[];try{return await this.db.getAllKeys(wt)}catch(e){return console.error("Erro ao obter chaves do cache:",e),[]}}}const Qs=new n_,xc="firebase-sync-queue",Fc=3,Uc=5e3;class r_{constructor(){this.queue=[],this.isOnline=navigator.onLine,this.syncInProgress=!1,this.listeners=[],this.retryTimeout=null,this._init()}async _init(){await Qs.init(),await this.loadQueue(),this._setupOnlineOfflineListeners()}_setupOnlineOfflineListeners(){window.addEventListener("online",()=>{console.log("🌐 Conexão restaurada"),this.handleOnline()}),window.addEventListener("offline",()=>{console.log("📴 Conexão perdida"),this.handleOffline()})}getOnlineStatus(){return this.isOnline&&Tn.isAvailable()}async loadQueue(){try{const e=await Qs.get(xc);e&&Array.isArray(e)&&(this.queue=e,console.log(`📦 Fila carregada: ${this.queue.length} operações pendentes`))}catch(e){console.error("Erro ao carregar fila de sincronização:",e),this.queue=[]}}async saveQueue(){try{await Qs.set(xc,this.queue)}catch(e){console.error("Erro ao salvar fila de sincronização:",e)}}async addToQueue(e){const t={id:this._generateId(),type:e.type,collection:e.collection,docId:e.docId,data:e.data,timestamp:new Date().toISOString(),retries:0,status:"PENDING"};this.queue.push(t),await this.saveQueue(),this.getOnlineStatus()&&!this.syncInProgress&&this.sync().catch(n=>{console.error("Erro ao sincronizar após adicionar à fila:",n)}),this.notifyListeners()}async sync(){if(!Tn.isAvailable()||!this.getOnlineStatus()){Tn.isAvailable()||console.warn("⚠️ Sync pausado: serviço Firebase indisponível"),this.getOnlineStatus()||console.log("📴 Sync aguardando conexão...");return}if(this.syncInProgress){console.log("⏳ Sincronização já em progresso...");return}if(this.queue.length===0){console.log("✅ Fila vazia - nada para sincronizar"),this.notifyListeners();return}this.syncInProgress=!0,this.notifyListeners();const t=Math.min(this.queue.length,10);console.log(`🔄 Sincronizando lote: ${t}/${this.queue.length} operações`);const n=[...this.queue.slice(0,10)],s=[],o=[];for(const u of n)try{await this._executeOperation(u),s.push(u.id)}catch(h){console.error(`Erro ao sincronizar operação ${u.id}:`,h),u.retries++,u.retries>=Fc?(u.status="FAILED",o.push(u.id)):u.status="RETRYING"}s.length>0&&(this.queue=this.queue.filter(u=>!s.includes(u.id))),o.length>0&&(this.queue=this.queue.filter(u=>!o.includes(u.id))),await this.saveQueue(),this.syncInProgress=!1;const a=s.length;if(a>0&&(console.log(`✅ Lote sincronizado: ${a} operações`),this.notifyListeners({synced:a})),o.length>0&&(console.warn(`⚠️ ${o.length} operações falharam após ${Fc} tentativas`),this.notifyListeners({failed:o.length})),this.queue.length>0){console.log(`⏳ Restam ${this.queue.length} operações.`);const u=this.getOnlineStatus()?250:Uc;this._scheduleRetry(u)}else console.log("🎉 Todas as operações foram sincronizadas")}async _executeOperation(e){switch(e.type){case"CREATE":case"UPDATE":await Tn.setDocument(e.collection,e.docId,e.data,e.type==="UPDATE");break;case"DELETE":await Tn.deleteDocument(e.collection,e.docId);break;default:throw new Error(`Tipo de operação desconhecido: ${e.type}`)}}_scheduleRetry(e=Uc){this.retryTimeout&&clearTimeout(this.retryTimeout),this.retryTimeout=setTimeout(()=>{this.queue.length!==0&&(this.getOnlineStatus()?this.sync().catch(t=>{console.error("Erro no retry de sincronização:",t)}):console.log("⏳ Aguardando voltar online para continuar sincronização"))},Math.max(0,e))}async handleOnline(){this.isOnline=!0,this.notifyListeners(),this.queue.length>0&&!this.syncInProgress&&(console.log("🔄 Tentando sincronizar operações pendentes..."),await this.sync())}handleOffline(){this.isOnline=!1,this.notifyListeners(),this.retryTimeout&&(clearTimeout(this.retryTimeout),this.retryTimeout=null)}hasPendingOperations(){return this.queue.length>0}getPendingCount(){return this.queue.length}subscribe(e){return this.listeners.push(e),e(this._getStatus()),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}_getStatus(){return{isOnline:this.getOnlineStatus(),hasPending:this.hasPendingOperations(),pendingCount:this.getPendingCount(),syncing:this.syncInProgress}}notifyListeners(e={}){const t={...this._getStatus(),...e};this.listeners.forEach(n=>{try{n(t)}catch(s){console.error("Erro ao notificar listener:",s)}})}async clearQueue(){this.queue=[],await this.saveQueue(),this.notifyListeners()}_generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}}const Ut=new r_;class s_{constructor(){this.toasts=[],this.container=null,this.init()}init(){this.container=document.createElement("div"),this.container.className="toast-container",this.container.id="toast-container",document.body.appendChild(this.container)}show(e,t={}){const{type:n="info",duration:s=5e3,action:o=null,actionLabel:a="Desfazer"}=t,u=document.createElement("div");return u.className=`toast toast-${n}`,u.innerHTML=`
      <span class="toast-message">${this.escapeHtml(e)}</span>
      ${o?`<button class="toast-action" data-action-id="${this.toasts.length}">${this.escapeHtml(a)}</button>`:""}
      <button class="toast-close" aria-label="Fechar">×</button>
    `,this.container.appendChild(u),setTimeout(()=>{u.classList.add("toast-show")},10),o&&u.querySelector(".toast-action").addEventListener("click",()=>{o(),this.hide(u)}),u.querySelector(".toast-close").addEventListener("click",()=>{this.hide(u)}),s>0&&setTimeout(()=>{this.hide(u)},s),this.toasts.push({element:u,action:o}),u}hide(e){e&&(e.classList.remove("toast-show"),e.classList.add("toast-hide"),setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e),this.toasts=this.toasts.filter(t=>t.element!==e)},300))}success(e,t={}){return this.show(e,{...t,type:"success"})}error(e,t={}){return this.show(e,{...t,type:"error"})}info(e,t={}){return this.show(e,{...t,type:"info"})}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}}const Xs=new s_;class i_{constructor(){this.lastSyncedCount=0,this.notificationDebounce=null,this.DEBOUNCE_DELAY=2e3,this.isSubscribed=!1}start(){this.isSubscribed||(Ut.subscribe(e=>{this._handleSyncStatus(e)}),this.isSubscribed=!0,console.log("✅ Notificações de sincronização ativadas"))}stop(){this.notificationDebounce&&(clearTimeout(this.notificationDebounce),this.notificationDebounce=null),this.isSubscribed=!1}_handleSyncStatus(e){e.synced&&e.synced>0&&this._notifySyncComplete(e.synced),e.isOnline&&e.hasPending&&e.pendingCount>0&&(e.syncing||setTimeout(()=>{const t={isOnline:Ut.getOnlineStatus(),hasPending:Ut.hasPendingOperations(),pendingCount:Ut.getPendingCount()};t.hasPending&&this._notifyPendingSync(t.pendingCount)},1e3)),!e.isOnline&&e.hasPending&&this._notifyOffline(e.pendingCount)}_notifySyncComplete(e){this.notificationDebounce&&clearTimeout(this.notificationDebounce),this.notificationDebounce=setTimeout(()=>{const t=e===1?"Dado sincronizado com sucesso!":`${e} dados sincronizados com sucesso!`;Xs.success(t,{duration:3e3}),this.lastSyncedCount=e},this.DEBOUNCE_DELAY)}_notifyPendingSync(e){const t=e===1?"1 operação pendente será sincronizada...":`${e} operações pendentes serão sincronizadas...`;Xs.info(t,{duration:2e3})}_notifyOffline(e){const t=e===1?"1 operação será sincronizada quando voltar online":`${e} operações serão sincronizadas quando voltar online`;Xs.info(t,{duration:3e3})}}const o_=new i_;class a_{constructor(){this.container=null,this.status={isOnline:navigator.onLine,hasPending:!1,pendingCount:0,syncing:!1},this.unsubscribe=null,this.lastSyncedAt=null,this.manualSyncInFlight=!1,this.elements={}}mount(){this.container||(this.container=document.createElement("aside"),this.container.className="sync-status-widget hidden",this.container.innerHTML=`
            <div class="sync-status-card">
                <div class="sync-status-header">
                    <span class="sync-status-dot"></span>
                    <div class="sync-status-titles">
                        <strong class="sync-status-title">Sincronização</strong>
                        <span class="sync-status-subtitle">Monitorando backend</span>
                    </div>
                    <span class="sync-status-count badge badge-warning">0</span>
                </div>
                <div class="sync-status-message">Sincronizado</div>
                <div class="sync-status-footer">
                    <span class="sync-status-meta">Última atualização: --</span>
                    <button class="sync-status-action btn btn-outline">Sincronizar agora</button>
                </div>
            </div>
        `,document.body.appendChild(this.container),this.elements={dot:this.container.querySelector(".sync-status-dot"),subtitle:this.container.querySelector(".sync-status-subtitle"),count:this.container.querySelector(".sync-status-count"),message:this.container.querySelector(".sync-status-message"),meta:this.container.querySelector(".sync-status-meta"),action:this.container.querySelector(".sync-status-action")},this.elements.action.addEventListener("click",()=>this.handleManualSync()),this.unsubscribe=Ut.subscribe(e=>{e.synced&&e.synced>0&&(this.lastSyncedAt=new Date),this.status=e,this.updateUI()}),this.updateUI())}updateUI(){if(!this.container)return;const{isOnline:e,pendingCount:t,syncing:n}=this.status,s=!e||t>0||n||this.manualSyncInFlight;this.container.classList.toggle("hidden",!s),this.elements.dot.classList.toggle("offline",!e),this.elements.dot.classList.toggle("syncing",n||this.manualSyncInFlight),this.elements.subtitle.textContent=this.getSubtitleText(),this.elements.count.textContent=t.toString(),this.elements.count.classList.toggle("visible",t>0),this.elements.message.textContent=this.getStatusMessage(),this.lastSyncedAt?this.elements.meta.textContent=`Última atualização: ${this.formatTime(this.lastSyncedAt)}`:e?this.elements.meta.textContent="Aguardando primeira sincronização...":this.elements.meta.textContent="Sem conexão";const o=!e||t===0||n||this.manualSyncInFlight;this.elements.action.disabled=o,this.elements.action.textContent=this.manualSyncInFlight?"Sincronizando...":"Sincronizar agora"}getSubtitleText(){return this.status.isOnline?this.status.syncing||this.manualSyncInFlight?"Sincronizando dados":this.status.pendingCount>0?"Pendências detectadas":"Tudo em dia":"Modo offline"}getStatusMessage(){const{isOnline:e,pendingCount:t,syncing:n}=this.status;return e?this.manualSyncInFlight?"Forçando sincronização...":n?t>0?`Sincronizando ${t} pendências...`:"Sincronizando dados...":t>0?`${t} alterações serão sincronizadas assim que possível.`:"Sincronização concluída. Tudo pronto!":t>0?`${t} pendências aguardando conexão`:"Sem conexão. Continuaremos tentando em segundo plano."}async handleManualSync(){if(!(!this.status.isOnline||this.manualSyncInFlight)){this.manualSyncInFlight=!0,this.updateUI();try{await Ut.sync()}catch(e){console.error("Erro ao forçar sincronização manual:",e)}finally{this.manualSyncInFlight=!1,this.updateUI()}}}formatTime(e){try{return e.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}catch{return e.toISOString()}}destroy(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null),this.container&&document.body.contains(this.container)&&document.body.removeChild(this.container),this.container=null}}const c_={BASE_URL:"/demandas-pro/",DEV:!1,MODE:"production",PROD:!0,SSR:!1};function u_(){console.group("🔍 Verificando Variáveis de Ambiente Firebase");const r=["VITE_FIREBASE_API_KEY","VITE_FIREBASE_AUTH_DOMAIN","VITE_FIREBASE_PROJECT_ID","VITE_FIREBASE_STORAGE_BUCKET","VITE_FIREBASE_MESSAGING_SENDER_ID","VITE_FIREBASE_APP_ID"];let e=!0;const t={};return r.forEach(n=>{const s=c_[n],o=!!s&&typeof s=="string"&&s.trim()!=="";if(o||(e=!1),t[n]={present:o,value:o&&s?s.length>20?s.substring(0,20)+"...":s:void 0,length:s&&typeof s=="string"?s.length:0},o&&s){const a=s.length>20?s.substring(0,20)+"...":s;console.log(`✅ ${n}: ${a} (${s.length} chars)`)}else console.log(`❌ ${n}: NÃO ENCONTRADO ou VAZIO`)}),console.groupEnd(),e?(console.log("✅ Todas as variáveis estão presentes e preenchidas!"),console.log("💡 Se ainda vê erro, verifique se os valores estão corretos.")):(console.error("❌ Algumas variáveis estão faltando ou vazias!"),console.log("📝 Verifique:"),console.log("1. Arquivo .env.local existe na raiz do projeto?"),console.log("2. Nomes das variáveis começam com VITE_?"),console.log("3. Todos os valores estão preenchidos (não vazios)?"),console.log("4. Servidor foi reiniciado após criar/editar .env.local?"),console.log(`
💡 Formato correto do .env.local:`),console.log("   VITE_FIREBASE_API_KEY=valor"),console.log("   VITE_FIREBASE_AUTH_DOMAIN=valor"),console.log("   ... (sem espaços, sem aspas)")),t}try{typeof window<"u"&&(window.checkFirebaseEnv=u_)}catch{}function l_(){if(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"){"serviceWorker"in navigator&&navigator.serviceWorker.getRegistrations().then(e=>{e.forEach(t=>{t.unregister().then(()=>{console.log("[SW] Service Worker desabilitado em desenvolvimento")})})});return}"serviceWorker"in navigator&&navigator.serviceWorker.register("/service-worker.js").then(t=>{console.log("[SW] Registered:",t.scope),setInterval(()=>{t.update()},6e4),t.addEventListener("updatefound",()=>{const n=t.installing;n.addEventListener("statechange",()=>{n.state==="installed"&&navigator.serviceWorker.controller&&confirm("Nova versão disponível! Atualizar agora?")&&t.waiting&&(t.waiting.postMessage({type:"SKIP_WAITING"}),window.location.reload())})})}).catch(t=>{console.error("[SW] Registration failed:",t)})}function h_(){const r=document.createElement("div");r.id="offline-indicator",r.className="offline-indicator hidden",r.innerHTML="📴 Sem conexão",document.body.appendChild(r);const e=document.createElement("style");e.textContent=`
        .offline-indicator {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ef4444;
            color: white;
            text-align: center;
            padding: 12px;
            font-weight: 600;
            z-index: 9999;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        }
        
        .offline-indicator.show {
            transform: translateY(0);
        }
        
        .offline-indicator.hidden {
            display: none;
        }
    `,document.head.appendChild(e),window.addEventListener("online",()=>{r.classList.remove("show"),r.textContent="✅ Conectado",setTimeout(()=>r.classList.add("hidden"),2e3)}),window.addEventListener("offline",()=>{r.classList.add("show"),r.classList.remove("hidden"),r.textContent="📴 Sem conexão"}),navigator.onLine||r.classList.add("show")}function Bc(){l_(),h_(),o_.start(),new a_().mount();const e=wh("app"),t=new Ih;d_(t);function n(o){t.updateActiveRoute(o),s(o)}function s(o){const a=document.getElementById("breadcrumb-container");if(a){const u=Sr.fromRoute(o);a.innerHTML="",a.appendChild(u.render())}}e.onRouteChange(n),s(e.getCurrentPath())}function d_(r){const e=document.createElement("header");e.className="app-header",e.innerHTML=`
    <div class="app-header-content">
      <button class="menu-hamburguer" id="menu-hamburguer" aria-label="Abrir menu">
        <span class="menu-hamburguer-line"></span>
        <span class="menu-hamburguer-line"></span>
        <span class="menu-hamburguer-line"></span>
      </button>
      <h1 class="app-header-title">🎯 Gerenciador Pedro</h1>
    </div>
    <nav id="breadcrumb-container" class="app-breadcrumb"></nav>
  `,document.body.insertBefore(e,document.body.firstChild);const t=document.getElementById("menu-hamburguer");t&&t.addEventListener("click",()=>{r.toggle()})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Bc):Bc();export{En as _,Tn as a,Ut as b,Qs as f,Xs as t};
//# sourceMappingURL=index-JMGHwSEN.js.map
