const EASE = 'cubic-bezier(0.4,0,0.2,1)';

const panels = [
  { el: document.getElementById('ep1'), t1: document.getElementById('t1p1'), t2: document.getElementById('t2p1') },
  { el: document.getElementById('ep2'), t1: document.getElementById('t1p2'), t2: document.getElementById('t2p2') },
  { el: document.getElementById('ep3'), t1: document.getElementById('t1p3'), t2: document.getElementById('t2p3') },
  { el: document.getElementById('ep4'), t1: document.getElementById('t1p4'), t2: document.getElementById('t2p4') },
];

let cur = 0, busy = false;

panels.forEach((p, i) => {
  p.el.style.transform = i === 0 ? 'translateX(0%)' : 'translateX(100%)';
});

const timers = new WeakMap();

function clearElTimers(el) {
  const ids = timers.get(el);
  if (ids) ids.forEach(clearTimeout);
  timers.set(el, []);
}

function addElTimer(el, id) {
  if (!timers.has(el)) timers.set(el, []);
  timers.get(el).push(id);
}

function fadeIn(t1, t2) {
  [t1, t2].forEach(el => {
    clearElTimers(el);
    el.classList.remove('fadein', 'fadeout');
    el.style.opacity = '0';
  });
  addElTimer(t1, setTimeout(() => { t1.classList.add('fadein'); t1.style.opacity = ''; }, 300));
  addElTimer(t2, setTimeout(() => { t2.classList.add('fadein'); t2.style.opacity = ''; }, 1000));
}

function fadeOut(t1, t2) {
  [t1, t2].forEach(el => {
    clearElTimers(el);
    el.classList.remove('fadein');
    el.classList.add('fadeout');
    addElTimer(el, setTimeout(() => { el.classList.remove('fadeout'); el.style.opacity = '0'; }, 500));
  });
}

fadeIn(panels[0].t1, panels[0].t2);

function switchPanel(dir) {
  const next = cur + dir;
  if (next < 0 || next >= panels.length || busy) return false;
  busy = true;

  const from = panels[cur], to = panels[next];
  fadeOut(from.t1, from.t2);

  to.el.style.transition = 'none';
  to.el.style.transform = dir > 0 ? 'translateX(100%)' : 'translateX(-100%)';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const t = `transform 0.45s ${EASE}`;
    from.el.style.transition = t;
    to.el.style.transition = t;
    from.el.style.transform = dir > 0 ? 'translateX(-100%)' : 'translateX(100%)';
    to.el.style.transform = 'translateX(0%)';
    fadeIn(to.t1, to.t2);
    cur = next;
    setTimeout(() => { busy = false; }, 450);
  }));
  return true;
}

// 휠
document.addEventListener('wheel', (e) => {
  const dir = e.deltaY > 0 ? 1 : -1;
  if ((dir === 1 && cur < panels.length - 1) || (dir === -1 && cur > 0)) {
    e.preventDefault();
    switchPanel(dir);
  }
}, { passive: false });

// 터치
let tY = 0;
document.addEventListener('touchstart', e => { tY = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', e => {
  const dy = tY - e.changedTouches[0].clientY;
  if (Math.abs(dy) < 30) return;
  const dir = dy > 0 ? 1 : -1;
  if ((dir === 1 && cur < panels.length - 1) || (dir === -1 && cur > 0)) {
    switchPanel(dir);
  }
}, { passive: true });

function openTab()  { document.getElementById('tab-overlay').classList.add('open');    }
function closeTab() { document.getElementById('tab-overlay').classList.remove('open'); }
