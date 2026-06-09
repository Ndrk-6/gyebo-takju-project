const regionData = {
  '청송': { img: 'images/mkgl_sagubae.png', t: '청송',  r: [5,2,2,5] },
  '단양': { img: 'images/mkgl_kongmak.png', t: '소백산', r: [3,4,4,4] },
  '지평': { img: 'images/mkgl_jipyeong.png', t: '지평',  r: [3,3,5,5] },
  '공주': { img: 'images/mkgl_wangbam.png', t: '공주',  r: [4,4,3,4] },
  '고흥': { img: 'images/mkgl_yuja.png', t: '고흥',   r: [5,2,2,5] },
  '오미자': { img: 'images/mkgl_omija.png', t: '오미자', r: [5,2,2,5] },
  '구름': { img: 'images/mkgl_gureum.png', t: '구름',  r: [4,4,5,3] },
  '해창': { img: 'images/mkgl_haechang.png', t: '해창',  r: [4,5,5,3] },
  '해남': { img: 'images/mkgl_haenam.png', t: '해남',  r: [4,4,4,4] },
};

const vScroll       = document.getElementById('v-scroll');
const detailSection = document.getElementById('detail-section');
const mapSection    = document.getElementById('map-section');

function fitMapSection() {
  const mapWrap = document.getElementById('map-wrap');
  if (!mapWrap) return;
  const needed = mapWrap.offsetTop + mapWrap.offsetHeight + 60;
  mapSection.style.height = Math.max(window.innerHeight, needed) + 'px';
}

// 지도 이미지 로드 후 섹션 높이 조정
const mapImg = document.querySelector('#map-wrap .map-img');
if (mapImg) {
  if (mapImg.complete) fitMapSection();
  else mapImg.addEventListener('load', fitMapSection);
}
window.addEventListener('resize', fitMapSection);

// 진입 시 지도(섹션2)를 즉시 표시
vScroll.scrollTop = mapSection.offsetTop;
window.addEventListener('load', () => {
  fitMapSection();
  vScroll.scrollTop = mapSection.offsetTop;
});

let detailReady = false;

// 위로 스크롤 차단 (detail 비어있을 때)
vScroll.addEventListener('wheel', (e) => {
  if (!detailReady && e.deltaY < 0) e.preventDefault();
}, { passive: false });

let touchStartY = 0;
vScroll.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
vScroll.addEventListener('touchmove', (e) => {
  if (!detailReady && e.touches[0].clientY > touchStartY) e.preventDefault();
}, { passive: false });

function makeRatingGrid(ratings) {
  return ratings.map((filled, rowIdx) => {
    const cups = Array.from({length: 5}, (_, i) => {
      const isFull = i < filled;
      const delay = (rowIdx * 5 + i) * 80 + 1300;
      return `<img src="map/${isFull ? '풀잔' : '빈잔'}.svg" style="width:8.5vw; height:auto; opacity:0; animation:mapFadeIn 0.4s ease ${delay}ms forwards;" alt="">`;
    }).join('');
    return `<div style="display:flex; gap:1.1vw;">${cups}</div>`;
  }).join('');
}

function goDetail(key) {
  detailReady = true;
  const spine = document.getElementById('map-spine');
  const topbar = document.getElementById('map-topbar');
  [spine, topbar].forEach(el => { if (el) { el.style.animation = 'none'; el.style.opacity = '0'; } });
  const data = regionData[key];
  const imgSrc = data ? data.img : '';
  const t = data ? data.t : '';
  const ratings = data ? data.r : [0,0,0,0];
  detailSection.innerHTML = `
    <div style="width:100%; display:flex; flex-direction:column; align-items:center; padding-bottom:10vh;">
      <img src="map/spine_map.svg" style="width:100%; height:auto; display:block;" alt="">
      <div style="width:100%; display:flex; align-items:center; justify-content:space-between; padding:30px 16px 12px;">
        <img src="map/hamb.svg" style="height:auto; cursor:pointer; -webkit-tap-highlight-color:transparent;" onclick="openTab()" alt="">
        <a href="main_page.html" style="display:contents;"><img src="images/logo_first.svg" style="width:13%; height:auto; transform:translateX(-8px);" alt=""></a>
        <img src="map/icon_map.svg" style="height:auto; cursor:pointer; -webkit-tap-highlight-color:transparent;" onclick="vScroll.scrollTo({top: mapSection.offsetTop, behavior:'smooth'})" alt="">
      </div>
      ${t ? `<img src="map/${t}_t1.svg" style="width:58%; height:auto; opacity:0; animation:mapFadeIn 0.5s ease 100ms forwards;" alt="">` : ''}
      ${imgSrc ? `<img src="${imgSrc}" style="width:17%; height:auto; margin-top:8px; opacity:0; animation:mapFadeIn 0.5s ease 500ms forwards;" alt="">` : ''}
      ${t ? `<img src="map/${t}_t2.svg" style="width:62%; height:auto; margin-top:8px; opacity:0; animation:mapFadeIn 0.5s ease 900ms forwards;" alt="">` : ''}
      <div style="align-self:flex-start; padding-left:15%; margin-top:6vh; display:flex; align-items:flex-start; gap:1.3vw;">
        <img src="map/평가.svg" style="width:12.5vw; height:auto; opacity:0; animation:mapFadeIn 0.5s ease 1200ms forwards;" alt="">
        <div style="display:flex; flex-direction:column; justify-content:space-between; height:36.1vw; padding:1.3vw 0 1.6vw; box-sizing:border-box;">
          ${makeRatingGrid(ratings)}
        </div>
      </div>
    </div>
  `;
  detailSection.scrollTop = 0;
  vScroll.scrollTo({ top: 0, behavior: 'smooth' });
}

function goRegion(name) {
  const popup = document.getElementById('popup-' + name);
  if (popup) {
    const isShown = popup.classList.contains('show');
    document.querySelectorAll('.event-popup').forEach(p => p.classList.remove('show'));
    if (!isShown) popup.classList.add('show');
  } else if (regionData[name]) {
    goDetail(name);
  }
}

function openTab()  { document.getElementById('tab-overlay').classList.add('open'); }
function closeTab() { document.getElementById('tab-overlay').classList.remove('open'); }

// ── 버튼 위치 조정 모드 (개발용) ─────────────────────────────
// URL에 ?edit 붙이면 활성화: map_page.html?edit
if (location.search.includes('edit')) {
  window.addEventListener('load', () => {
    const wrap = document.getElementById('map-wrap');
    document.querySelectorAll('.region-btn, .region-wrap, .region-hit').forEach(el => {
      el.style.cursor = 'grab';
      let startX, startY, origLeft, origTop;
      el.addEventListener('pointerdown', e => {
        e.stopPropagation();
        el.setPointerCapture(e.pointerId);
        el.style.cursor = 'grabbing';
        startX = e.clientX; startY = e.clientY;
        origLeft = parseFloat(el.style.left) || 0;
        origTop  = parseFloat(el.style.top)  || 0;
      });
      el.addEventListener('pointermove', e => {
        if (e.buttons !== 1) return;
        const dx = (e.clientX - startX) / wrap.offsetWidth  * 100;
        const dy = (e.clientY - startY) / wrap.offsetHeight * 100;
        el.style.left = (origLeft + dx) + '%';
        el.style.top  = (origTop  + dy) + '%';
      });
      el.addEventListener('pointerup', e => {
        el.style.cursor = 'grab';
        console.log(`${el.alt || el.className}: left:${parseFloat(el.style.left).toFixed(1)}%; top:${parseFloat(el.style.top).toFixed(1)}%`);
      });
    });
    console.log('🗺 버튼 위치 편집 모드 ON — 드래그 후 콘솔에서 좌표 확인');
  });
}

// 햄버거: 지도 섹션이 보일 때만 표시
function updateHamburger() {
  const show = vScroll.scrollTop > window.innerHeight * 0.5;
  const ham = document.getElementById('hamburger');
  ham.style.opacity = show ? '1' : '0';
  ham.style.pointerEvents = show ? 'auto' : 'none';
}
vScroll.addEventListener('scroll', updateHamburger, { passive: true });
updateHamburger();

// 지도 섹션 진입 시 애니메이션 재초기화
function resetMapAnims() {
  const headerTargets = detailReady ? [] : [
    document.getElementById('map-spine'),
    document.getElementById('map-topbar'),
  ];
  const targets = [
    ...headerTargets,
    document.getElementById('txt1'),
    document.getElementById('txt2'),
    document.getElementById('txt3'),
    document.querySelector('#map-wrap .map-img'),
    ...document.querySelectorAll('.region-btn, .region-wrap, .region-hit'),
  ].filter(Boolean);

  targets.forEach(el => { el.style.animation = 'none'; el.style.opacity = '0'; });
  void document.getElementById('map-section').offsetWidth;
  targets.forEach(el => { el.style.animation = ''; el.style.opacity = ''; });
  if (detailReady) {
    [document.getElementById('map-spine'), document.getElementById('map-topbar')]
      .forEach(el => { if (el) { el.style.animation = 'none'; el.style.opacity = '0'; } });
  }
  document.querySelectorAll('.event-popup').forEach(p => p.classList.remove('show'));
}

let mapInitialized = false;
const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!mapInitialized) { mapInitialized = true; return; }
      if (!detailReady) resetMapAnims();
    }
  });
}, { threshold: 0.6, root: vScroll });
mapObserver.observe(document.getElementById('map-section'));
