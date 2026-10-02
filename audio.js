// Audio preferences belong to this installation, independently of careers or releases.
const KEY='clubline-audio-settings';
export const TRACKS=[['menu-hip-hop','Hip-hop'],['menu-french-electro','French electro'],['menu-fuzzy-rock','Fuzzy rock']];
let prefs={musicMuted:false,effectsMuted:false,track:0};
try{const stored=JSON.parse(localStorage.getItem(KEY)||'null');if(stored){prefs.musicMuted=stored.musicMuted===true;prefs.effectsMuted=stored.effectsMuted===true;prefs.track=Number.isInteger(stored.track)&&stored.track>=0&&stored.track<TRACKS.length?stored.track:0}}catch{}
const music=new Audio(),effect=new Audio();music.preload='none';effect.preload='none';music.volume=.22;effect.volume=.65;
let unlocked=false,request=0,musicLoaded=-1,lastEffect='';
const src=name=>new URL(`./assets/audio/${name}.mp3`,import.meta.url).href;
function publish(){syncAudioControls();window.dispatchEvent(new CustomEvent('clubline-audio-change',{detail:audioState()}))}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(prefs))}catch{}publish()}
export function audioState(){return {...prefs,unlocked,playing:!music.paused,lastEffect}}
async function playMusic(){
 if(!unlocked||prefs.musicMuted||document.hidden)return;
 const token=++request;
 if(musicLoaded!==prefs.track){music.pause();music.src=src(TRACKS[prefs.track][0]);musicLoaded=prefs.track;}
 try{await music.play();if(token!==request)return;if(prefs.musicMuted||document.hidden)music.pause()}catch{ /* Wait for a later user gesture if playback is blocked. */ }
 publish();
}
export function unlockAudio(){unlocked=true;playMusic();publish()}
export function setAudioSetting(key,value){if(!['musicMuted','effectsMuted'].includes(key))return;prefs[key]=!!value;if(key==='musicMuted'){++request;if(prefs.musicMuted)music.pause();else unlockAudio()}else if(prefs.effectsMuted)effect.pause();persist()}
export function selectTrack(index){index=Number(index);if(!Number.isInteger(index)||index<0||index>=TRACKS.length)return;prefs.track=index;persist();if(unlocked)playMusic()}
export function skipTrack(){selectTrack((prefs.track+1)%TRACKS.length)}
function playEffect(name){
 if(!unlocked||prefs.effectsMuted||document.hidden)return;
 lastEffect=name;effect.pause();effect.src=src(name);effect.currentTime=0;effect.play().catch(()=>{});publish();
}
export const playGoal=homeTeamScored=>playEffect(homeTeamScored?'crowd-cheer':'crowd-boo');
export const playAdvance=()=>playEffect('advance-tick');
music.addEventListener('ended',skipTrack);
// No per-render audio nodes: navigation, minute updates and goals preserve playback.
window.addEventListener('click',event=>{if(event.target.closest('[data-audio-setting],[data-audio-track]'))return;unlockAudio()});
window.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key))unlockAudio()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){++request;music.pause();effect.pause()}else playMusic()});
window.addEventListener('storage',event=>{if(event.key!==KEY)return;try{const value=JSON.parse(event.newValue);if(!value)return;prefs.musicMuted=value.musicMuted===true;prefs.effectsMuted=value.effectsMuted===true;if(Number.isInteger(value.track)&&value.track>=0&&value.track<3)prefs.track=value.track;++request;if(prefs.musicMuted)music.pause();if(prefs.effectsMuted)effect.pause();playMusic();publish()}catch{}});
export function audioControls(compact=false){return `<div class="audio-controls ${compact?'compact':''}" data-audio-controls><h3>${compact?'Audio':'Sound and music'}</h3>${compact?`<div class="audio-toggle-row"><button class="btn slim" data-action="audio-music" aria-pressed="${prefs.musicMuted}" data-audio-music-label>${prefs.musicMuted?'Music off':'Music on'}</button><button class="btn slim" data-action="audio-effects" aria-pressed="${prefs.effectsMuted}" data-audio-effects-label>${prefs.effectsMuted?'Effects off':'Effects on'}</button></div>`:`<div class="audio-toggle-row"><label><input type="checkbox" data-audio-setting="musicMuted" ${prefs.musicMuted?'checked':''}> Mute music</label><label><input type="checkbox" data-audio-setting="effectsMuted" ${prefs.effectsMuted?'checked':''}> Mute effects</label></div><label class="audio-track-picker">Music track<select data-audio-track>${TRACKS.map(([id,label],i)=>`<option value="${i}" ${prefs.track===i?'selected':''}>${label}</option>`).join('')}</select></label>`}<div class="audio-play-row"><span data-audio-track-label>Track: ${TRACKS[prefs.track][1]}</span><button class="btn slim" data-action="audio-play">Play music</button><button class="btn slim" data-action="audio-skip">Skip track →</button></div>${compact?'':`<p>All three tracks play in rotation and repeat, including during matches. Mute choices are saved for this device across updates and new careers.</p>`}</div>`}
export function syncAudioControls(){document.querySelectorAll('[data-audio-controls]').forEach(box=>{for(const key of ['musicMuted','effectsMuted']){const input=box.querySelector(`[data-audio-setting="${key}"]`);if(input)input.checked=prefs[key]}const picker=box.querySelector('[data-audio-track]');if(picker)picker.value=String(prefs.track);for(const kind of ['music','effects']){const button=box.querySelector(`[data-audio-${kind}-label]`);if(button){button.textContent=`${kind==='music'?'Music':'Effects'} ${prefs[kind+'Muted']?'off':'on'}`;button.setAttribute('aria-pressed',String(prefs[kind+'Muted']))}}box.querySelector('[data-audio-track-label]').textContent='Track: '+TRACKS[prefs.track][1];const play=box.querySelector('[data-action="audio-play"]');play.hidden=prefs.musicMuted||!music.paused})}
export function handleAudioAction(el){switch(el.dataset.action){case 'audio-music':setAudioSetting('musicMuted',!prefs.musicMuted);return true;case 'audio-effects':setAudioSetting('effectsMuted',!prefs.effectsMuted);return true;case 'audio-play':if(prefs.musicMuted)setAudioSetting('musicMuted',false);else unlockAudio();return true;case 'audio-skip':skipTrack();return true;default:return false}}
export function handleAudioChange(el){if(el.dataset.audioSetting){setAudioSetting(el.dataset.audioSetting,el.checked);unlockAudio();return true}if(el.hasAttribute('data-audio-track')){selectTrack(el.value);unlockAudio();return true}return false}
