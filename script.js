window.addEventListener('load', ()=>{
  const loader = document.getElementById('loader');
  setTimeout(()=>{
    loader.classList.add('loader-hidden');
  }, 1000);
});

const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach((entry, i)=>{
    if(entry.isIntersecting){
      setTimeout(()=> entry.target.classList.add('is-visible'), i * 90);
      io.unobserve(entry.target);
    }
  });
}, { threshold:.15 });
revealEls.forEach(el=> io.observe(el));

document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('click', (e)=>{
    e.stopPropagation();
    const wasOpen = card.classList.contains('is-open');

    document.querySelectorAll('.card').forEach(c=>{
      c.classList.remove('is-open');
    });

    if(!wasOpen){
      const grid = card.closest('.card-grid');
      const gridRect = grid.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const shift = gridRect.left - cardRect.left;

      const inner = card.querySelector('.card-inner');
      inner.style.transform = 'none';

      card.style.setProperty('--card-h', cardRect.height + 'px');
      card.style.setProperty('--card-w', gridRect.width + 'px');
      card.style.setProperty('--card-shift', shift + 'px');

      card.classList.add('is-open');
    }
  });
});

document.addEventListener('click', (e)=>{
  if(!e.target.closest('.card.is-open')){
    document.querySelectorAll('.card.is-open').forEach(c=> c.classList.remove('is-open'));
  }
});

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if(!prefersReduced){
  document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    if(card.closest('.card').classList.contains('is-open')) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 16;
    const rotateY = (x - 0.5) * 16;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  });
});
}

const formations = {
  "433":{
    por:{x:8,y:50}, li:{x:30,y:16}, dfc1:{x:25,y:38}, dfc2:{x:25,y:62}, ld:{x:30,y:84},
    mi:{x:53,y:22}, mco:{x:58,y:50}, md:{x:53,y:78},
    ei:{x:85,y:18}, dc:{x:92,y:50}, ed:{x:85,y:82}
  },
  "442":{
    por:{x:8,y:50}, li:{x:30,y:16}, dfc1:{x:25,y:38}, dfc2:{x:25,y:62}, ld:{x:30,y:84},
    ei:{x:55,y:14}, mi:{x:58,y:38}, mco:{x:58,y:62}, md:{x:55,y:86},
    dc:{x:92,y:38}, ed:{x:92,y:62}
  },
  "352":{
    por:{x:8,y:50},
    dfc1:{x:21,y:28}, mco:{x:17,y:50}, dfc2:{x:21,y:72},
    li:{x:53,y:14}, mi:{x:58,y:38}, md:{x:58,y:62}, ld:{x:53,y:86},
    ei:{x:90,y:22}, dc:{x:92,y:50}, ed:{x:90,y:78}
  }
};

const formationBtns = document.querySelectorAll('.formation-btn');
formationBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    formationBtns.forEach(b=> b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const layout = formations[btn.dataset.formation];
    document.querySelectorAll('.player-dot').forEach(dot=>{
      const role = dot.dataset.role;
      if(layout[role]){
        dot.style.setProperty('--x', layout[role].x + '%');
        dot.style.setProperty('--y', layout[role].y + '%');
      }
    });
  });
});

window.addEventListener('beforeunload', ()=>{
  sessionStorage.setItem('scrollPos', window.scrollY);
});

window.addEventListener('load', ()=>{
  const savedPos = sessionStorage.getItem('scrollPos');
  if(savedPos !== null){
    setTimeout(()=>{
      window.scrollTo(0, parseInt(savedPos));
    }, 0);
  }
});