import katex from 'katex';
import conceptArt from './assets/concept-art.webp';
import { AudioManager } from './audio';
import { ACHIEVEMENTS, ACHIEVEMENT_BY_ID, INTRO_SLIDES, ROOMS, SPIRIT_BY_ID } from './content';
import { GameStore, formatTime } from './gameStore';
import { QUESTION_BY_ID, QUESTIONS } from './questions';
import { createVisualGame } from './VisualScene';
import { FEAR, MAX_SCORE, TOTAL_TIME_SECONDS, type GameState, type Question, type RoomDefinition } from './types';

type ModalKind = 'warning'|'confirm'|'intro'|'room-intro'|'puzzle'|'solution'|'spirit'|'transition'|'pause'|'settings'|'how'|'map'|'achievements'|'credits'|'ending'|null;
interface Hotspot { label:string; key:string; secondary?:boolean; action:()=>void }

const html = String.raw;
const esc = (value:string) => value.replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch] ?? ch));
const math = (latex:string, display=true) => katex.renderToString(latex,{displayMode:display,throwOnError:false,strict:'ignore'});
const byId = <T extends HTMLElement>(id:string):T => {
  const el=document.getElementById(id);
  if(!el) throw new Error(`Missing #${id}`);
  return el as T;
};
const hexRgb=(hex:string)=>[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];

export class App {
  private store = new GameStore();
  private state:GameState = this.store.snapshot;
  private audio = new AudioManager(this.state.settings);
  private screen:'menu'|'playing'|'ending'='menu';
  private modalKind:ModalKind=null;
  private timerPaused=true;
  private activeQuestion:Question|null=null;
  private selectedChoice:string|null=null;
  private hotspots:Hotspot[]=[];
  private focusedHotspot=0;
  private introIndex=0;

  constructor(private root:HTMLElement){
    this.mount();
    createVisualGame('phaser-container');
    this.store.subscribe(state=>{
      this.state=state;
      this.applySettings();
      if(this.screen==='playing') this.renderGame();
      if(state.completed && state.ending && this.modalKind!=='ending') this.showEnding();
    });
    this.bindGlobal();
    this.showMainMenu();
    this.showWarning();
    window.setInterval(()=>{
      if(this.screen==='playing' && !this.timerPaused && !this.state.completed && document.visibilityState==='visible') this.store.tick(1);
    },1000);
  }

  private mount(){
    this.root.innerHTML=html`
      <main id="shell">
        <section id="menu-screen" style="--title-art:url('${conceptArt}')"></section>
        <section id="game-screen" class="hidden">
          <header class="hud">
            <div class="hud-title"><div id="hud-room-number" class="eyebrow"></div><h1 id="hud-room-name"></h1></div>
            <div class="hud-stat"><span>Score</span><strong id="hud-score">0</strong></div>
            <div class="hud-stat timer"><span>Time</span><strong id="hud-time">30:00</strong></div>
            <div class="hud-stat"><span>Spirits</span><strong id="hud-spirits">0/4</strong></div>
            <button id="hud-pause" class="hud-action pause" type="button">Pause <span class="key">Esc</span></button>
          </header>
          <div class="game-main">
            <div class="stage-column">
              <div class="stage-shell">
                <div id="phaser-container"></div>
                <div class="stage-effects"></div>
                <div id="entity-overlay" class="entity-overlay"></div>
                <div class="scene-label"><small id="scene-count"></small><h2 id="scene-name"></h2></div>
                <button id="nav-left" class="nav-arrow left" type="button" aria-label="Previous viewpoint">‹</button>
                <button id="nav-right" class="nav-arrow right" type="button" aria-label="Next viewpoint">›</button>
                <div id="hotspots" class="hotspots"></div>
              </div>
            </div>
            <aside id="side-panel" class="side-panel"></aside>
          </div>
          <footer class="game-footer">
            <span><b class="key">A</b><b class="key">D</b> Move</span><span><b class="key">E</b> Interact</span><span><b class="key">Tab</b> Select</span><span><b class="key">M</b> Map</span><span><b class="key">F</b> Fullscreen</span>
          </footer>
        </section>
        <section id="modal-root" role="dialog" aria-modal="true"></section>
        <div id="toast-root" aria-live="assertive"></div>
      </main>`;
    byId<HTMLButtonElement>('nav-left').addEventListener('click',()=>this.moveNode(-1));
    byId<HTMLButtonElement>('nav-right').addEventListener('click',()=>this.moveNode(1));
    byId<HTMLButtonElement>('hud-pause').addEventListener('click',()=>this.showPause());
  }

  private bindGlobal(){
    document.addEventListener('keydown',event=>this.handleKey(event));
    window.addEventListener('beforeunload',()=>void 0);
  }

  private handleKey(event:KeyboardEvent){
    const key=event.key.toLowerCase();
    const target=event.target;
    const typing=target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
    if(key==='f'&&!typing){event.preventDefault();this.toggleFullscreen();return;}
    if(this.modalKind){
      if(this.modalKind==='puzzle'){
        if(/^[1-4]$/.test(key) && this.activeQuestion?.kind==='choice'){
          const option=this.activeQuestion.options?.[Number(key)-1]; if(option){event.preventDefault();this.selectChoice(option.id);} return;
        }
        if(key==='h'&&!typing){event.preventDefault();this.useHint();return;}
        if(event.key==='Enter'){event.preventDefault();this.submitPuzzle();return;}
        if(key==='escape'){event.preventDefault();this.closeModal();return;}
      }else if(key==='escape' && !['warning','ending'].includes(this.modalKind)){event.preventDefault();this.closeModal();return;}
      return;
    }
    if(this.screen!=='playing') return;
    if(['a','arrowleft','s','arrowdown'].includes(key)){event.preventDefault();this.moveNode(-1);}
    else if(['d','arrowright'].includes(key)){event.preventDefault();this.moveNode(1);}
    else if(['e','enter','w','arrowup'].includes(key)){event.preventDefault();this.activateHotspot();}
    else if(key==='tab'){event.preventDefault();this.cycleHotspot(event.shiftKey?-1:1);}
    else if(key==='m'){event.preventDefault();this.showMap();}
    else if(key==='escape'||key==='p'){event.preventDefault();this.showPause();}
  }

  private showMainMenu(){
    this.screen='menu'; this.timerPaused=true; this.audio.stopAmbient();
    byId('game-screen').classList.add('hidden');
    const menu=byId('menu-screen'); menu.classList.remove('hidden');
    const canContinue=this.state.started;
    menu.innerHTML=html`<div class="menu-content">
      <div class="menu-kicker">A calculus-based horror escape game</div>
      <h1 class="game-title"><span class="main">INFINITE LOOP</span><span class="sub">NO ESCAPE</span></h1>
      <p class="menu-tagline">Five rooms. Seventeen calculus trials. Thirty active minutes. Solve the school’s equations, rescue the trapped spirits, and decide whether escape means leaving alone.</p>
      <div class="menu-actions">
        <button class="menu-button" data-action="new" type="button">Start new game</button>
        <button class="menu-button" data-action="continue" type="button" ${canContinue?'':'disabled'}>${this.state.completed?'View last result':'Continue'}</button>
        <button class="menu-button" data-action="how" type="button">How to play</button>
        <button class="menu-button" data-action="achievements" type="button">Achievements</button>
        <button class="menu-button" data-action="settings" type="button">Settings</button>
        <button class="menu-button" data-action="credits" type="button">Project credits</button>
      </div><div class="menu-footer">Keyboard + mouse · Autosave · GitHub Pages · Version 1.0</div>
    </div>`;
    menu.querySelector<HTMLButtonElement>('[data-action=new]')?.addEventListener('click',()=>this.requestNewGame());
    menu.querySelector<HTMLButtonElement>('[data-action=continue]')?.addEventListener('click',()=>this.continueGame());
    menu.querySelector<HTMLButtonElement>('[data-action=how]')?.addEventListener('click',()=>this.showHow());
    menu.querySelector<HTMLButtonElement>('[data-action=achievements]')?.addEventListener('click',()=>this.showAchievements());
    menu.querySelector<HTMLButtonElement>('[data-action=settings]')?.addEventListener('click',()=>this.showSettings());
    menu.querySelector<HTMLButtonElement>('[data-action=credits]')?.addEventListener('click',()=>this.showCredits());
    window.dispatchEvent(new CustomEvent('visual-room',{detail:{roomIndex:0,nodeIndex:0}}));
  }

  private showWarning(){
    this.setModal('warning',html`<article class="modal narrow warning"><div class="warning-icon">⚠</div><div class="eyebrow">Content warning</div><h2>Before You Enter</h2><p class="lead">This game contains mild psychological horror, eerie school environments, supernatural figures, countdown pressure, and optional flashing/glitch effects. It contains no gore.</p><p>Reduced motion, high contrast, larger text, and volume controls are available in Settings.</p><div class="modal-actions"><button id="warning-continue" class="ui-button primary" type="button" autofocus>Continue</button></div></article>`,true);
    byId<HTMLButtonElement>('warning-continue').addEventListener('click',()=>this.closeModal(false));
  }

  private requestNewGame(){
    if(!this.state.started){void this.startNewGame();return;}
    this.setModal('confirm',html`<article class="modal narrow"><div class="eyebrow">Overwrite checkpoint?</div><h2>Begin a new loop</h2><p>Your existing autosave will be replaced. Settings will remain.</p><div class="modal-actions"><button id="confirm-new" class="ui-button danger" type="button">Erase save and begin</button><button id="confirm-cancel" class="ui-button ghost" type="button">Cancel</button></div></article>`,true);
    byId<HTMLButtonElement>('confirm-new').addEventListener('click',()=>void this.startNewGame());
    byId<HTMLButtonElement>('confirm-cancel').addEventListener('click',()=>this.closeModal(false));
  }

  private async startNewGame(){
    await this.audio.unlock(); this.store.startNewGame(); this.state=this.store.snapshot;
    byId('menu-screen').classList.add('hidden'); this.screen='playing'; this.introIndex=0; this.showIntro();
  }

  private async continueGame(){
    await this.audio.unlock(); byId('menu-screen').classList.add('hidden');
    if(this.state.completed){this.showEnding();return;}
    this.screen='playing'; this.enterRoom(false); this.toast('Checkpoint restored',`Room ${this.state.roomIndex+1} · ${formatTime(this.state.timeRemainingSeconds)} remaining`);
  }

  private showIntro(){
    const slide=INTRO_SLIDES[this.introIndex];
    this.setModal('intro',html`<article class="intro-art"><img src="${conceptArt}" alt="Abandoned-school concept artwork"><div class="intro-copy"><div class="eyebrow">${esc(slide.eyebrow)}</div><h1>${esc(slide.title)}</h1><p class="lead">${esc(slide.body)}</p><div class="intro-progress">${INTRO_SLIDES.map((_,i)=>`<span class="${i<=this.introIndex?'active':''}"></span>`).join('')}</div><div class="modal-actions"><button id="intro-next" class="ui-button primary" type="button">${this.introIndex===INTRO_SLIDES.length-1?'Enter Room 1':'Continue'}</button><button id="intro-skip" class="ui-button ghost" type="button">Skip introduction</button></div></div></article>`,true);
    byId<HTMLButtonElement>('intro-next').addEventListener('click',()=>{if(this.introIndex<INTRO_SLIDES.length-1){this.introIndex++;this.showIntro();}else{this.closeModal(false);this.enterRoom(true);}});
    byId<HTMLButtonElement>('intro-skip').addEventListener('click',()=>{this.closeModal(false);this.enterRoom(true);});
  }

  private enterRoom(showIntro:boolean){
    this.screen='playing'; byId('menu-screen').classList.add('hidden'); byId('game-screen').classList.remove('hidden');
    const max=this.store.maxUnlockedNode(); if(this.state.nodeIndex>max)this.store.setNode(max);
    this.audio.startAmbient(this.state.roomIndex); this.renderGame();
    window.dispatchEvent(new CustomEvent('visual-room',{detail:{roomIndex:this.state.roomIndex,nodeIndex:this.state.nodeIndex}}));
    if(showIntro)this.showRoomIntro(); else this.timerPaused=false;
  }

  private showRoomIntro(){
    const room=ROOMS[this.state.roomIndex];
    this.setModal('room-intro',html`<article class="modal narrow"><div class="eyebrow">Room ${room.id} of 5 · ${esc(room.lessons)}</div><h2>${esc(room.name)}</h2><div class="room-lines">${room.entryNarration.map(line=>`<div class="room-line">${esc(line)}</div>`).join('')}</div><p><strong>Objective:</strong> ${esc(room.objective)}</p><div class="modal-actions"><button id="room-begin" class="ui-button primary" type="button">Begin room</button><button id="room-map" class="ui-button ghost" type="button">View map</button></div></article>`,true);
    byId<HTMLButtonElement>('room-begin').addEventListener('click',()=>this.closeModal());
    byId<HTMLButtonElement>('room-map').addEventListener('click',()=>this.showMap());
  }

  private renderGame(){
    if(this.screen!=='playing')return;
    const room=ROOMS[this.state.roomIndex];
    const [r,g,b]=hexRgb(room.accent); const shell=byId('shell'); shell.style.setProperty('--accent',room.accent);shell.style.setProperty('--accent-rgb',`${r},${g},${b}`);
    byId('hud-room-number').textContent=`Room ${room.id} of 5`;
    byId('hud-room-name').textContent=room.name;
    byId('hud-score').textContent=this.state.score.toLocaleString();
    byId('hud-time').textContent=formatTime(this.state.timeRemainingSeconds);
    byId('hud-spirits').textContent=`${this.state.spiritsRescued.length}/4`;
    const timerPanel=byId('hud-time').parentElement; timerPanel?.classList.toggle('urgent',this.state.timeRemainingSeconds<=300);
    byId('entity-overlay').style.setProperty('--fear-opacity',String(Math.max(0,Math.min(.82,(this.state.fear-10)/110))));
    const max=this.store.maxUnlockedNode(); const node=Math.min(this.state.nodeIndex,max);
    if(node!==this.state.nodeIndex){this.store.setNode(node);return;}
    byId('scene-count').textContent=`Viewpoint ${node+1} of ${room.nodeLabels.length}`;
    byId('scene-name').textContent=room.nodeLabels[node]??'The Exit';
    byId<HTMLButtonElement>('nav-left').disabled=node<=0;
    byId<HTMLButtonElement>('nav-right').disabled=node>=max;
    window.dispatchEvent(new CustomEvent('visual-node',{detail:{nodeIndex:node}}));
    this.buildHotspots(); this.renderSidePanel();
  }

  private buildHotspots(){
    const room=ROOMS[this.state.roomIndex]; const node=this.state.nodeIndex; const hotspots:Hotspot[]=[];
    if(node<room.questionIds.length){
      const q=QUESTION_BY_ID[room.questionIds[node]]; const solved=this.state.solvedQuestionIds.includes(q.id);
      hotspots.push({label:solved?`Review: ${q.title}`:`Examine: ${q.title}`,key:'E',action:()=>solved?this.showSolution(q,[],true):this.showPuzzle(q)});
    }else if(room.id<5){
      const spirit=room.spiritId?SPIRIT_BY_ID[room.spiritId]:undefined;
      if(spirit)hotspots.push({label:`Speak to ${spirit.name}`,key:'E',action:()=>this.showSpirit(room)});
    }else hotspots.push({label:'Open the exit',key:'E',action:()=>this.finishRoom()});
    this.hotspots=hotspots; this.focusedHotspot=Math.min(this.focusedHotspot,Math.max(0,hotspots.length-1));
    const layer=byId('hotspots');layer.innerHTML=hotspots.map((spot,i)=>`<button class="hotspot ${spot.secondary?'secondary':''} ${i===this.focusedHotspot?'focused':''}" data-i="${i}" type="button">${esc(spot.label)} <span class="key">${esc(spot.key)}</span></button>`).join('');
    layer.querySelectorAll<HTMLButtonElement>('[data-i]').forEach(button=>{
      button.addEventListener('click',()=>{this.focusedHotspot=Number(button.dataset.i);this.activateHotspot();});
      button.addEventListener('mouseenter',()=>{this.focusedHotspot=Number(button.dataset.i);this.renderHotspotFocus();});
    });
  }

  private renderHotspotFocus(){byId('hotspots').querySelectorAll('.hotspot').forEach((el,i)=>el.classList.toggle('focused',i===this.focusedHotspot));}
  private cycleHotspot(direction:number){if(!this.hotspots.length)return;this.focusedHotspot=(this.focusedHotspot+direction+this.hotspots.length)%this.hotspots.length;this.renderHotspotFocus();}
  private activateHotspot(){const spot=this.hotspots[this.focusedHotspot];if(!spot)return;this.audio.click();spot.action();}
  private moveNode(direction:number){if(this.screen!=='playing'||this.modalKind)return;const max=this.store.maxUnlockedNode();const next=Math.max(0,Math.min(max,this.state.nodeIndex+direction));if(next===this.state.nodeIndex)return;this.focusedHotspot=0;this.store.setNode(next);this.audio.click();}

  private renderSidePanel(){
    const room=ROOMS[this.state.roomIndex]; const solved=room.questionIds.filter(id=>this.state.solvedQuestionIds.includes(id)).length;
    byId('side-panel').innerHTML=html`<div class="eyebrow">Current area</div><h3>${esc(room.name)}</h3>
      <div class="side-section"><h4>Objective</h4><p>${esc(room.objective)}</p></div>
      <div class="side-section"><h4>Required trials</h4><div class="progress-dots">${room.questionIds.map((id,i)=>`<span class="progress-dot ${this.state.solvedQuestionIds.includes(id)?'solved':''} ${i===this.state.nodeIndex?'current':''}">${i+1}</span>`).join('')}</div></div>
      <div class="side-section"><h4>Entity pressure · ${Math.round(this.state.fear)}%</h4><div class="fear-track"><div class="fear-fill" style="width:${this.state.fear}%"></div></div></div>
      <div class="side-section"><h4>Run statistics</h4><div class="stat-grid"><div class="stat-card"><span>Solved</span><strong>${this.state.solvedQuestionIds.length}/17</strong></div><div class="stat-card"><span>Hints</span><strong>${this.state.hintUsedIds.length}</strong></div><div class="stat-card"><span>Room progress</span><strong>${solved}/${room.questionIds.length}</strong></div><div class="stat-card"><span>Max score</span><strong>${MAX_SCORE.toLocaleString()}</strong></div></div><button id="side-map" class="side-button" type="button">Room map <span class="key">M</span></button><button id="side-settings" class="side-button" type="button">Settings</button></div>`;
    byId<HTMLButtonElement>('side-map').addEventListener('click',()=>this.showMap());byId<HTMLButtonElement>('side-settings').addEventListener('click',()=>this.showSettings());
  }

  private showPuzzle(question:Question){
    this.activeQuestion=question;this.selectedChoice=null;const hintUsed=this.state.hintUsedIds.includes(question.id);const attempts=this.state.attempts[question.id]??0;
    this.setModal('puzzle',html`<article class="modal wide"><div class="puzzle-head"><div><div class="eyebrow">Lesson ${question.lesson} · ${esc(question.concept)}</div><h2>${esc(question.title)}</h2></div><div class="puzzle-count">Question ${QUESTIONS.findIndex(q=>q.id===question.id)+1}/17<br>Attempts: <span id="attempt-count">${attempts}</span></div></div><p class="lead">${esc(question.prompt)}</p><div class="math-display">${math(question.latex)}</div><form id="puzzle-form">
      ${question.kind==='number'?'<input id="answer-input" class="numeric-input" type="text" inputmode="decimal" autocomplete="off" placeholder="Number, decimal, or fraction" autofocus>':`<div class="choice-grid">${question.options?.map((option,i)=>`<button class="choice" data-choice="${option.id}" type="button"><span class="choice-index">${i+1}</span>${option.latex?math(option.latex,false):esc(option.label)}</button>`).join('')}</div>`}
      <div id="puzzle-feedback" class="feedback"></div><div id="hint-box" class="${hintUsed?'hint-box':'hidden'}">${hintUsed?`<strong>Hint:</strong> ${esc(question.hint)}`:''}</div><div class="modal-actions"><button class="ui-button primary" data-action="submit" type="submit">Submit answer <span class="key">Enter</span></button><button id="hint-button" class="ui-button gold" type="button">${hintUsed?'Show hint again':'Use hint (−50)'}</button><button id="puzzle-close" class="ui-button ghost" type="button">Step away</button></div></form></article>`,false);
    byId<HTMLFormElement>('puzzle-form').addEventListener('submit',event=>{event.preventDefault();this.submitPuzzle();});
    byId<HTMLButtonElement>('hint-button').addEventListener('click',()=>this.useHint());byId<HTMLButtonElement>('puzzle-close').addEventListener('click',()=>this.closeModal());
    document.querySelectorAll<HTMLButtonElement>('[data-choice]').forEach(button=>button.addEventListener('click',()=>this.selectChoice(button.dataset.choice??'')));
  }

  private selectChoice(id:string){this.selectedChoice=id;document.querySelectorAll<HTMLElement>('[data-choice]').forEach(el=>el.classList.toggle('selected',el.dataset.choice===id));}

  private submitPuzzle(){
    const q=this.activeQuestion;if(!q||this.modalKind!=='puzzle')return;const raw=q.kind==='choice'?(this.selectedChoice??''):byId<HTMLInputElement>('answer-input').value;const result=this.store.submitAnswer(q.id,raw);const feedback=byId('puzzle-feedback');
    if(!result.valid){feedback.textContent=result.message??'Enter an answer first.';return;}
    byId('attempt-count').textContent=String(this.store.snapshot.attempts[q.id]??0);
    if(!result.correct){feedback.textContent=`${q.environmentFailure} ${result.scoreDelta} points.`;this.audio.wrong();window.dispatchEvent(new Event('visual-wrong'));byId('shell').classList.add('glitch');setTimeout(()=>byId('shell').classList.remove('glitch'),450);if(result.captured)this.toast('The Entity captured you',`Pressure reset to ${FEAR.CAPTURE_RESET}%. One minute was removed.`);return;}
    this.audio.correct();window.dispatchEvent(new Event('visual-correct'));const chips=[`Correct answer +100`,...(result.firstAttempt?['First-attempt bonus +50']:[])];this.showSolution(q,chips,false);
  }

  private useHint(){
    const q=this.activeQuestion;if(!q||this.modalKind!=='puzzle')return;const result=this.store.useHint(q.id);const box=byId('hint-box');box.className='hint-box';box.innerHTML=`<strong>Hint:</strong> ${esc(q.hint)}`;byId<HTMLButtonElement>('hint-button').textContent='Hint displayed';if(result.applied)this.toast('Hint used',`${result.scoreDelta} points. The hint is now permanently available.`);
  }

  private showSolution(q:Question,chips:string[],review:boolean){
    this.activeQuestion=null;this.setModal('solution',html`<article class="modal wide"><div class="eyebrow">${review?'Solution review':'Correct · timer paused while you review'}</div><h2>${esc(q.environmentSuccess)}</h2>${chips.length?`<div class="score-chips">${chips.map(c=>`<span class="score-chip">${esc(c)}</span>`).join('')}<span class="score-chip">Score ${this.store.snapshot.score.toLocaleString()}</span></div>`:''}<div class="math-display">${math(q.latex)}</div><div class="solution-steps">${q.solutionSteps.map((step,i)=>`<div class="solution-step"><div class="step-no">${i+1}</div><div>${math(step,false)}</div></div>`).join('')}</div><div class="solution-conclusion">${esc(q.explanation)}</div><div class="modal-actions"><button id="solution-close" class="ui-button primary" type="button">${review?'Return':'Continue'}</button></div></article>`,true);
    byId<HTMLButtonElement>('solution-close').addEventListener('click',()=>{this.closeModal();if(!review){this.store.setNode(this.store.maxUnlockedNode());const room=ROOMS[this.state.roomIndex];if(this.store.maxUnlockedNode()===room.questionIds.length)this.toast('Room trials complete',room.id<5?'The trapped spirit is waiting at the exit.':'All five exam seals are broken.');}});
  }

  private showSpirit(room:RoomDefinition){const spirit=room.spiritId?SPIRIT_BY_ID[room.spiritId]:undefined;if(!spirit)return;this.setModal('spirit',html`<article class="modal narrow"><div class="eyebrow">A trapped spirit · ${esc(spirit.epithet)}</div><h2>${esc(spirit.name)}</h2><div class="spirit-layout"><div class="spirit-shape"></div><p class="lead">“${esc(spirit.message)}”</p></div><p>Rescuing the spirit is optional for progression, but every spirit is required for Soul Saver and the True Escape ending.</p><div class="modal-actions"><button id="spirit-rescue" class="ui-button primary" type="button">Rescue ${esc(spirit.name)}</button><button id="spirit-leave" class="ui-button danger" type="button">Leave and continue</button></div></article>`,true);
    byId<HTMLButtonElement>('spirit-rescue').addEventListener('click',()=>{this.store.resolveSpirit(spirit.id,true);this.toast('Spirit rescued',`${spirit.name} will follow you to the Final Exam.`);this.finishRoom();});
    byId<HTMLButtonElement>('spirit-leave').addEventListener('click',()=>{this.store.resolveSpirit(spirit.id,false);this.finishRoom();});
  }

  private finishRoom(){
    const previous=ROOMS[this.state.roomIndex];const result=this.store.completeCurrentRoom();if(!result.completed){this.toast('Exit sealed','Solve every required question first.');return;}this.audio.transition();if(result.final)return;
    const next=ROOMS[this.store.snapshot.roomIndex];this.setModal('transition',html`<article class="modal narrow"><div class="eyebrow">Room ${previous.id} complete · +250 points</div><h2>The way to ${esc(next.name)} opens.</h2><p>Score: <strong>${this.store.snapshot.score.toLocaleString()}</strong> · Time: <strong>${formatTime(this.store.snapshot.timeRemainingSeconds)}</strong> · Pressure: <strong>${Math.round(this.store.snapshot.fear)}%</strong></p><div class="modal-actions"><button id="transition-next" class="ui-button primary" type="button">Enter next room</button></div></article>`,true);
    byId<HTMLButtonElement>('transition-next').addEventListener('click',()=>{this.closeModal(false);this.enterRoom(true);});
  }

  private showPause(){
    this.setModal('pause',html`<article class="modal narrow"><div class="eyebrow">Game paused · autosave active</div><h2>The loop is waiting.</h2><p>Room ${this.state.roomIndex+1} · ${formatTime(this.state.timeRemainingSeconds)} remaining · Score ${this.state.score.toLocaleString()}</p><div class="modal-actions"><button id="pause-resume" class="ui-button primary" type="button">Resume</button><button id="pause-map" class="ui-button ghost" type="button">Map</button><button id="pause-settings" class="ui-button ghost" type="button">Settings</button><button id="pause-how" class="ui-button ghost" type="button">How to play</button><button id="pause-menu" class="ui-button danger" type="button">Save and return to menu</button></div></article>`,true);
    byId<HTMLButtonElement>('pause-resume').addEventListener('click',()=>this.closeModal());byId<HTMLButtonElement>('pause-map').addEventListener('click',()=>this.showMap());byId<HTMLButtonElement>('pause-settings').addEventListener('click',()=>this.showSettings());byId<HTMLButtonElement>('pause-how').addEventListener('click',()=>this.showHow());byId<HTMLButtonElement>('pause-menu').addEventListener('click',()=>{this.closeModal(false);this.showMainMenu();});
  }

  private showHow(){
    this.setModal('how',html`<article class="modal wide"><div class="eyebrow">Controls and rules</div><h2>How to survive the loop</h2><div class="card-grid">
      <div class="info-card"><div class="icon">A/D</div><h4>Move</h4><p>Cycle through unlocked viewpoints. Mouse users can click the edge arrows.</p></div><div class="info-card"><div class="icon">E</div><h4>Interact</h4><p>Open puzzle stations, spirits, and exits.</p></div><div class="info-card"><div class="icon">1–4</div><h4>Choose</h4><p>Select a multiple-choice answer. Enter submits. Numeric answers accept fractions.</p></div><div class="info-card"><div class="icon">H</div><h4>Hint</h4><p>A hint costs 50 points. Wrong answers cost 25 and raise Entity pressure.</p></div><div class="info-card"><div class="icon">M</div><h4>Map</h4><p>Review every room’s full name, lesson range, and progress.</p></div><div class="info-card"><div class="icon">Esc</div><h4>Pause</h4><p>The timer pauses in menus, room introductions, and full solutions—not while solving.</p></div></div><p><strong>Maximum score:</strong> ${MAX_SCORE.toLocaleString()}. <strong>True Escape:</strong> rescue all spirits and finish at ${FEAR.TRUE_ENDING_MAX}% pressure or lower.</p><div class="modal-actions"><button id="how-close" class="ui-button primary" type="button">Return</button></div></article>`,true);
    byId<HTMLButtonElement>('how-close').addEventListener('click',()=>this.closeModal(this.screen==='playing'));
  }

  private showMap(){
    this.setModal('map',html`<article class="modal wide"><div class="eyebrow">Meridian Senior High · node map</div><h2>The five-room loop</h2><div class="card-grid">${ROOMS.map((room,index)=>{const complete=this.state.completedRooms.includes(room.id);const current=index===this.state.roomIndex;const solved=room.questionIds.filter(id=>this.state.solvedQuestionIds.includes(id)).length;return `<div class="info-card ${complete||current?'':'locked'}"><div class="icon">${complete?'✓':current?'●':room.id}</div><h4>Room ${room.id}: ${esc(room.name)}</h4><p>${esc(room.lessons)}<br>${solved}/${room.questionIds.length} trials solved${complete?' · Complete':current?' · Current':''}</p></div>`;}).join('')}</div><p>Only sequentially unlocked viewpoints are available. Previously solved stations remain reviewable.</p><div class="modal-actions"><button id="map-close" class="ui-button primary" type="button">Return</button></div></article>`,true);
    byId<HTMLButtonElement>('map-close').addEventListener('click',()=>this.closeModal(this.screen==='playing'));
  }

  private showAchievements(){
    this.setModal('achievements',html`<article class="modal wide"><div class="eyebrow">Seven achievement badges</div><h2>Achievements</h2><div class="card-grid">${ACHIEVEMENTS.map(a=>{const unlocked=this.state.achievements.includes(a.id);return `<div class="info-card ${unlocked?'':'locked'}"><div class="icon">${unlocked?esc(a.icon):'◇'}</div><h4>${esc(a.name)}</h4><p>${esc(a.description)}</p></div>`;}).join('')}</div><div class="modal-actions"><button id="ach-close" class="ui-button primary" type="button">Return</button></div></article>`,true);
    byId<HTMLButtonElement>('ach-close').addEventListener('click',()=>this.closeModal(this.screen==='playing'));
  }

  private showSettings(){
    const s=this.state.settings;this.setModal('settings',html`<article class="modal narrow"><div class="eyebrow">Accessibility and audio</div><h2>Settings</h2><div class="setting-row"><div><strong>Master volume</strong><br><small>Procedural ambience and effects</small></div><input id="setting-volume" type="range" min="0" max="1" step=".05" value="${s.masterVolume}"></div><div class="setting-row"><div><strong>Reduced motion</strong><br><small>Removes camera drift, shake, and pulses</small></div><label class="toggle"><input id="setting-motion" type="checkbox" ${s.reducedMotion?'checked':''}> Reduce motion</label></div><div class="setting-row"><div><strong>High contrast</strong><br><small>Strengthens interface borders and text</small></div><label class="toggle"><input id="setting-contrast" type="checkbox" ${s.highContrast?'checked':''}> High contrast</label></div><div class="setting-row"><div><strong>Larger text</strong><br><small>Increases non-equation interface text</small></div><label class="toggle"><input id="setting-text" type="checkbox" ${s.largerText?'checked':''}> Larger text</label></div><div class="modal-actions"><button id="settings-apply" class="ui-button primary" type="button">Apply settings</button><button id="settings-full" class="ui-button ghost" type="button">Toggle fullscreen</button><button id="settings-clear" class="ui-button danger" type="button">Clear autosave</button></div></article>`,true);
    byId<HTMLButtonElement>('settings-apply').addEventListener('click',()=>{this.store.updateSettings({masterVolume:Number(byId<HTMLInputElement>('setting-volume').value),reducedMotion:byId<HTMLInputElement>('setting-motion').checked,highContrast:byId<HTMLInputElement>('setting-contrast').checked,largerText:byId<HTMLInputElement>('setting-text').checked});this.closeModal(this.screen==='playing');this.toast('Settings applied','Accessibility and audio preferences were saved.');});
    byId<HTMLButtonElement>('settings-full').addEventListener('click',()=>this.toggleFullscreen());
    byId<HTMLButtonElement>('settings-clear').addEventListener('click',()=>{this.store.clearSave();this.toast('Autosave cleared','Start a new game from the main menu.');byId<HTMLButtonElement>('settings-clear').disabled=true;});
  }

  private showCredits(){
    this.setModal('credits',html`<article class="modal wide"><div class="eyebrow">Group 6 · STEM11-G · Basic Calculus</div><h2>Project Credits</h2><img src="${conceptArt}" alt="Visual development board" style="width:100%;max-height:420px;object-fit:cover;border:1px solid rgba(255,255,255,.16)"><p>The visual development board established the palette, Entity silhouette, abandoned-school atmosphere, and interface hierarchy. Runtime backgrounds were rebuilt as lightweight original SVG/canvas scenes for consistency and GitHub Pages performance.</p><div class="card-grid"><div class="info-card"><h4>Banal, Elyssa Mae</h4><p>Project lead · roadmap, coordination, final decisions</p></div><div class="info-card"><h4>Causo, Staccie Norrainne</h4><p>Game writer · lore, worldbuilding, dialogue</p></div><div class="info-card"><h4>De Veyra, Jaden Arabella</h4><p>Game developer · implementation, effects, deployment</p></div><div class="info-card"><h4>Esperanza, Princess Johnna</h4><p>Game designer · mechanics, difficulty, pacing</p></div><div class="info-card"><h4>Guino, Sophia Francesca</h4><p>Creative director · palette, art style, music, aesthetics</p></div><div class="info-card"><h4>Production stack</h4><p>Phaser 4.2.1 · TypeScript · Vite · KaTeX · LocalStorage · GitHub Pages</p></div></div><p>Subject teacher: <strong>Dr. Susan A. Roces</strong>. All critical equations are live KaTeX rather than text embedded in images.</p><div class="modal-actions"><button id="credits-close" class="ui-button primary" type="button">Return</button></div></article>`,true);
    byId<HTMLButtonElement>('credits-close').addEventListener('click',()=>this.closeModal(this.screen==='playing'));
  }

  private showEnding(){
    if(!this.state.ending)return;this.screen='ending';this.timerPaused=true;this.audio.stopAmbient();const ending=this.state.ending;const trueEnd=ending==='true-escape';const lost=ending==='lost-soul';const title=trueEnd?'TRUE ESCAPE':lost?'LOST SOUL':'HOLLOW ESCAPE';const body=trueEnd?'Mara, Tomas, Celeste, and Ilya stand beside you. Their recovered names complete the missing condition. The Entity collapses into chalk dust, and the doors open to sunrise.':lost?'The final bell rings. An empty examination desk gains your name, but the latest checkpoint remains stored in the browser.':'The exit opens, but unanswered voices remain inside. Outside, your shadow moves half a second too late. The loop has found a way to leave with you.';
    this.setModal('ending',html`<article class="modal wide"><div class="eyebrow">${lost?'Failure ending':'Game complete'}</div><h1 class="ending ${trueEnd?'true':lost?'fail':'bad'}">${title}</h1><p class="lead">${esc(body)}</p><div class="results"><div class="result"><span>Final score</span><strong>${this.state.score.toLocaleString()} / ${MAX_SCORE.toLocaleString()}</strong></div><div class="result"><span>Time used</span><strong>${formatTime(this.state.elapsedSeconds)}</strong></div><div class="result"><span>Spirits saved</span><strong>${this.state.spiritsRescued.length}/4</strong></div></div>${!lost?`<div class="card-grid">${ACHIEVEMENTS.map(a=>`<div class="info-card ${this.state.achievements.includes(a.id)?'':'locked'}"><div class="icon">${this.state.achievements.includes(a.id)?esc(a.icon):'◇'}</div><h4>${esc(a.name)}</h4><p>${esc(a.description)}</p></div>`).join('')}</div>`:''}<div class="modal-actions">${lost?'<button id="ending-retry" class="ui-button primary" type="button">Resume checkpoint (5:00)</button>':'<button id="ending-ach" class="ui-button gold" type="button">View achievements</button>'}<button id="ending-menu" class="ui-button ghost" type="button">Main menu</button><button id="ending-new" class="ui-button danger" type="button">Start new game</button></div></article>`,true);
    if(lost)byId<HTMLButtonElement>('ending-retry').addEventListener('click',()=>{this.store.resumeAfterFailure();this.screen='playing';this.closeModal(false);this.enterRoom(false);this.toast('Checkpoint resumed','Five active minutes restored.');});else byId<HTMLButtonElement>('ending-ach').addEventListener('click',()=>this.showAchievements());
    byId<HTMLButtonElement>('ending-menu').addEventListener('click',()=>{this.closeModal(false);this.showMainMenu();});byId<HTMLButtonElement>('ending-new').addEventListener('click',()=>void this.startNewGame());
  }

  private applySettings(){
    const shell=byId('shell');shell.classList.toggle('reduced-motion',this.state.settings.reducedMotion);shell.classList.toggle('high-contrast',this.state.settings.highContrast);shell.classList.toggle('larger-text',this.state.settings.largerText);this.audio.update(this.state.settings);window.dispatchEvent(new CustomEvent('visual-settings',{detail:{reducedMotion:this.state.settings.reducedMotion}}));
  }

  private setModal(kind:ModalKind,content:string,pauseTimer:boolean){this.modalKind=kind;this.timerPaused=pauseTimer;const root=byId('modal-root');root.innerHTML=content;root.classList.add('open');setTimeout(()=>root.querySelector<HTMLElement>('[autofocus],input,button')?.focus(),0);}
  private closeModal(resume=true){const root=byId('modal-root');root.classList.remove('open');root.innerHTML='';this.modalKind=null;this.activeQuestion=null;this.selectedChoice=null;if(this.screen==='playing'&&resume)this.timerPaused=false;if(this.screen!=='playing')this.timerPaused=true;}
  private toast(title:string,message:string){const root=byId('toast-root');const el=document.createElement('div');el.className='toast';el.innerHTML=`<strong>${esc(title)}</strong><span>${esc(message)}</span>`;root.appendChild(el);setTimeout(()=>el.remove(),4200);}
  private toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen().catch(()=>this.toast('Fullscreen unavailable','The browser blocked the request.'));else document.exitFullscreen().catch(()=>void 0);}
}
