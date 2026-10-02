// Audio preferences belong to this installation, independently of careers or releases.
const KEY='clubline-audio-settings';
export const TRACKS=[['menu-hip-hop','Touchline'],['menu-french-electro','Floodlights'],['menu-fuzzy-rock','Away End'],['menu-arcade','Kickoff 90'],['menu-big-beat','Turnstile Funk'],['menu-indie','Saturday Radio'],['menu-synth-pop','Last Minute Winner']];
let prefs={musicMuted:false,effectsMuted:false,track:1,playlist:TRACKS.map((_,i)=>i),mode:'repeat'};
function readPrefs(stored){
 if(!stored)return;
 prefs.musicMuted=stored.musicMuted===true;prefs.effectsMuted=stored.effectsMuted===true;
 prefs.track=Number.isInteger(stored.track)&&stored.track>=0&&stored.track<TRACKS.length?stored.track:1;
 prefs.playlist=Array.isArray(stored.playlist)?[...new Set(stored.playlist.filter(i=>Number.isInteger(i)&&i>=0&&i<TRACKS.length))]:TRACKS.map((_,i)=>i);
 prefs.mode=['repeat','playlist','shuffle'].includes(stored.mode)?stored.mode:'repeat';
 if(prefs.musicMuted)prefs.playlist=[];
 if(!prefs.playlist.length)prefs.musicMuted=true;
 else if(!prefs.playlist.includes(prefs.track))prefs.track=prefs.playlist[0];
}
try{readPrefs(JSON.parse(localStorage.getItem(KEY)||'null'))}catch{}
const music=new Audio(),effect=new Audio();music.preload='none';music.loop=true;effect.preload='none';music.volume=.22;effect.volume=.65;
let unlocked=false,request=0,musicLoaded=-1,lastEffect='';
const src=name=>new URL(`./assets/audio/${name}.mp3`,import.meta.url).href;
function publish(){syncAudioControls();window.dispatchEvent(new CustomEvent('clubline-audio-change',{detail:audioState()}))}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(prefs))}catch{}publish()}
export function audioState(){return {...prefs,playlist:[...prefs.playlist],unlocked,playing:!music.paused,lastEffect}}
async function playMusic(){
 if(!unlocked||prefs.musicMuted||document.hidden)return;
 const token=++request;
 music.loop=prefs.mode==='repeat'||prefs.playlist.length<2;
 if(musicLoaded!==prefs.track){music.pause();music.src=src(TRACKS[prefs.track][0]);musicLoaded=prefs.track;}
 try{await music.play();if(token!==request)return;if(prefs.musicMuted||document.hidden)music.pause()}catch{ /* Wait for a later user gesture if playback is blocked. */ }
 publish();
}
export function unlockAudio(){unlocked=true;playMusic();publish()}
export function setAudioSetting(key,value){if(!['musicMuted','effectsMuted'].includes(key))return;prefs[key]=!!value;if(key==='musicMuted'){++request;if(prefs.musicMuted){prefs.playlist=[];music.pause()}else{if(!prefs.playlist.length)prefs.playlist=TRACKS.map((_,i)=>i);unlockAudio()}}else if(prefs.effectsMuted)effect.pause();persist()}
export function selectTrack(index){index=Number(index);if(!Number.isInteger(index)||index<0||index>=TRACKS.length)return;prefs.track=index;if(!prefs.playlist.includes(index))prefs.playlist.push(index);prefs.musicMuted=false;persist();if(unlocked)playMusic()}
export function changeTrack(){const list=prefs.playlist.length?prefs.playlist:TRACKS.map((_,i)=>i);selectTrack(list[(list.indexOf(prefs.track)+1)%list.length])}
function setPlaylist(index,checked){if(checked){prefs.playlist=[...new Set([...prefs.playlist,index])];prefs.musicMuted=false}else prefs.playlist=prefs.playlist.filter(i=>i!==index);if(!prefs.playlist.length){prefs.musicMuted=true;++request;music.pause()}else if(!prefs.playlist.includes(prefs.track))prefs.track=prefs.playlist[0];persist();unlockAudio()}
music.addEventListener('ended',()=>{if(prefs.musicMuted)return;if(prefs.mode==='shuffle'&&prefs.playlist.length>1){const choices=prefs.playlist.filter(i=>i!==prefs.track);selectTrack(choices[Math.floor(Math.random()*choices.length)])}else if(prefs.mode==='playlist')changeTrack();else{music.currentTime=0;playMusic()}});
function playEffect(name){
 if(!unlocked||prefs.effectsMuted||document.hidden)return;
 lastEffect=name;effect.pause();effect.src=src(name);effect.currentTime=0;effect.play().catch(()=>{});publish();
}
export const playGoal=homeTeamScored=>playEffect(homeTeamScored?'crowd-cheer':'crowd-boo');
export const playAdvance=()=>playEffect('advance-tick');

// No per-render audio nodes: navigation, minute updates and goals preserve playback.
window.addEventListener('click',event=>{if(event.target.closest('[data-audio-setting],[data-audio-track],[data-audio-mode],[data-playlist-track]'))return;unlockAudio()});
window.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key))unlockAudio()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){++request;music.pause();effect.pause()}else playMusic()});
window.addEventListener('storage',event=>{if(event.key!==KEY)return;try{readPrefs(JSON.parse(event.newValue));++request;if(prefs.musicMuted)music.pause();if(prefs.effectsMuted)effect.pause();playMusic();publish()}catch{}});
export function audioControls(compact=false){return `<div class="audio-controls ${compact?'compact':''}" data-audio-controls>${compact?`<div class="audio-toggle-row"><button class="btn slim" data-action="audio-music" aria-pressed="${prefs.musicMuted}" data-audio-music-label>${prefs.musicMuted?'Music off':'Music on'}</button><button class="btn slim" data-action="audio-effects" aria-pressed="${prefs.effectsMuted}" data-audio-effects-label>${prefs.effectsMuted?'FX off':'FX on'}</button><button class="btn slim" data-action="title-options">Options</button></div>`:`<h3>Sound and music</h3><div class="audio-toggle-row"><label><input type="checkbox" data-audio-setting="musicMuted" ${prefs.musicMuted?'checked':''}> Music off</label><label><input type="checkbox" data-audio-setting="effectsMuted" ${prefs.effectsMuted?'checked':''}> FX off</label></div><label class="field">Playback<select data-audio-mode><option value="repeat">Repeat selected track</option><option value="playlist">Play selected playlist in order</option><option value="shuffle">Shuffle selected playlist</option></select></label><label class="audio-track-picker">Selected track<select data-audio-track>${TRACKS.map(([id,label],i)=>`<option value="${i}" ${prefs.track===i?'selected':''}>${label}</option>`).join('')}</select></label><div class="playlist-list">${TRACKS.map(([id,label],i)=>`<label><input type="checkbox" data-playlist-track="${i}" ${prefs.playlist.includes(i)?'checked':''}> ${label}</label>`).join('')}</div><div class="audio-play-row"><span data-audio-track-label>Track: ${TRACKS[prefs.track][1]}</span><button class="btn slim" data-action="audio-play">Play music</button><button class="btn slim" data-action="audio-track-change">Change track →</button></div><p>Music off clears the playlist. Tick a track to enable music. Playback and FX choices are saved for this device, including across updates and new careers.</p>`}</div>`}
export function syncAudioControls(){document.querySelectorAll('[data-audio-controls]').forEach(box=>{for(const key of ['musicMuted','effectsMuted']){const input=box.querySelector(`[data-audio-setting="${key}"]`);if(input)input.checked=prefs[key]}const picker=box.querySelector('[data-audio-track]');if(picker)picker.value=String(prefs.track);for(const kind of ['music','effects']){const button=box.querySelector(`[data-audio-${kind}-label]`);if(button){button.textContent=`${kind==='music'?'Music':'FX'} ${prefs[kind+'Muted']?'off':'on'}`;button.setAttribute('aria-pressed',String(prefs[kind+'Muted']))}}const label=box.querySelector('[data-audio-track-label]');if(label)label.textContent='Track: '+TRACKS[prefs.track][1];const mode=box.querySelector('[data-audio-mode]');if(mode)mode.value=prefs.mode;box.querySelectorAll('[data-playlist-track]').forEach(el=>el.checked=prefs.playlist.includes(Number(el.dataset.playlistTrack)));const play=box.querySelector('[data-action="audio-play"]');if(play)play.hidden=prefs.musicMuted||!music.paused})}
export function handleAudioAction(el){switch(el.dataset.action){case 'audio-music':setAudioSetting('musicMuted',!prefs.musicMuted);return true;case 'audio-effects':setAudioSetting('effectsMuted',!prefs.effectsMuted);return true;case 'audio-play':if(prefs.musicMuted)setAudioSetting('musicMuted',false);else unlockAudio();return true;case 'audio-track-change':changeTrack();return true;default:return false}}
export function handleAudioChange(el){if(el.hasAttribute('data-playlist-track')){setPlaylist(Number(el.dataset.playlistTrack),el.checked);return true}if(el.hasAttribute('data-audio-mode')){prefs.mode=el.value;persist();playMusic();return true}if(el.dataset.audioSetting){setAudioSetting(el.dataset.audioSetting,el.checked);unlockAudio();return true}if(el.hasAttribute('data-audio-track')){selectTrack(el.value);unlockAudio();return true}return false}
