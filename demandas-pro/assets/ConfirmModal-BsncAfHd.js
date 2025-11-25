class i{constructor(){this.modal=null,this.resolve=null,this.init()}init(){document.getElementById("confirm-modal")?this.modal=document.getElementById("confirm-modal"):(this.modal=document.createElement("div"),this.modal.id="confirm-modal",this.modal.className="confirm-modal",this.modal.style.display="none",document.body.appendChild(this.modal)),this.render(),this.setupEventListeners()}render(){this.modal.querySelector(".confirm-modal-content")||(this.modal.innerHTML=`
                <div class="confirm-modal-overlay"></div>
                <div class="confirm-modal-content">
                    <div class="confirm-modal-header">
                        <h3 class="confirm-modal-title">Confirmar ação</h3>
                    </div>
                    <div class="confirm-modal-body">
                        <p class="confirm-modal-message" id="confirm-message"></p>
                    </div>
                    <div class="confirm-modal-footer">
                        <button class="btn btn-secondary" id="confirm-cancel">Cancelar</button>
                        <button class="btn btn-primary" id="confirm-ok">OK</button>
                    </div>
                </div>
            `)}setupEventListeners(){this._clickHandler&&this.modal.removeEventListener("click",this._clickHandler),this._keyDownHandler&&document.removeEventListener("keydown",this._keyDownHandler);const o=e=>{this.modal.style.display="none",this.resolve&&(this.resolve(e),this.resolve=null)};this._clickHandler=e=>{const t=e.target;if(t.classList.contains("confirm-modal-overlay")){o(!1);return}if(t.id==="confirm-cancel"||t.closest("#confirm-cancel")){e.preventDefault(),e.stopPropagation(),o(!1);return}if(t.id==="confirm-ok"||t.closest("#confirm-ok")){e.preventDefault(),e.stopPropagation(),o(!0);return}},this.modal.addEventListener("click",this._clickHandler),this._keyDownHandler=e=>{e.key==="Escape"&&this.modal.style.display!=="none"&&o(!1)},document.addEventListener("keydown",this._keyDownHandler)}show(o){const e=this.modal.querySelector("#confirm-message");return e&&(e.textContent=o),this.modal.style.display="flex",new Promise(t=>{this.resolve=t})}}const s=new i;async function l(n){return await s.show(n)}export{i as ConfirmModal,l as confirmAction,s as confirmModal};
//# sourceMappingURL=ConfirmModal-BsncAfHd.js.map
