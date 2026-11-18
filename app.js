// ================= Creative Express · animações =================
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = Array.from({ length: 14 }, (_, i) => String(i + 1).padStart(2, "0"));
const NICHO = { "01": "MODA", "02": "JOIAS", "03": "VAREJO", "04": "APP", "05": "APP", "06": "FITNESS", "07": "PLANTAS", "08": "MOTION", "09": "CLÍNICA", "10": "IA", "11": "BELEZA", "12": "APP", "13": "VAREJO", "14": "AVATAR IA" };
const movimentoReduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- menu ----------
$(".menu-abre").addEventListener("click", () => $("#menu").classList.toggle("aberto"));
$$(".menu-links a").forEach((a) => a.addEventListener("click", () => $("#menu").classList.remove("aberto")));

// ---------- vídeos sob demanda (só tocam quando aparecem) ----------
const obsVideo = new IntersectionObserver((ents) => {
  ents.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    } else v.pause();
  });
}, { rootMargin: "200px" });
const vigiaVideo = (v) => { v.muted = true; v.loop = true; v.playsInline = true; obsVideo.observe(v); };
$$("video[data-src]").forEach(vigiaVideo);

function tile(n, comVideo) {
  const d = document.createElement("div");
  d.className = "tile";
  if (comVideo) {
    const v = document.createElement("video");
    v.dataset.src = `assets/port/${n}.mp4`;
    v.poster = `assets/port/${n}.jpg`;
    v.preload = "none";
    d.appendChild(v);
    vigiaVideo(v);
  } else {
    const i = new Image();
    i.src = `assets/port/${n}.jpg`; i.loading = "lazy"; i.alt = "";
    d.appendChild(i);
  }
  return d;
}

// ---------- parede de criativos (hero) ----------
(() => {
  const parede = $("#parede");
  const larg = innerWidth;
  const nCol = larg < 700 ? 4 : 7;
  for (let c = 0; c < nCol; c++) {
    const col = document.createElement("div");
    col.className = "coluna" + (c % 2 ? " desce" : "");
    col.style.setProperty("--dur", 50 + ((c * 13) % 25) + "s");
    const lista = [];
    for (let k = 0; k < 4; k++) lista.push(PORT[(c * 3 + k * 5) % PORT.length]);
    const video = larg < 700 ? c === 2 : c >= 3 && c <= 5;
    [...lista, ...lista].forEach((n) => col.appendChild(tile(n, video)));
    parede.appendChild(col);
  }
})();

// ---------- máquina de escrever ----------
(async () => {
  const el = $("#digita");
  const palavras = ["criativos", "anúncios", "Reels", "copy", "UGC", "motion", "VSL"];
  let i = 0;
  while (true) {
    const p = palavras[i++ % palavras.length];
    for (let k = 1; k <= p.length; k++) { el.textContent = p.slice(0, k); await dorme(85); }
    await dorme(1800);
    for (let k = p.length; k >= 0; k--) { el.textContent = p.slice(0, k); await dorme(40); }
    await dorme(250);
  }
})();

// ---------- faixa de números ----------
(() => {
  const itens = [["<24h", "PRAZO DE ENTREGA"], ["R$35", "POR CRIATIVO"], ["ZERO", "MENSALIDADE"], ["3x", "AJUSTES INCLUSOS"], ["1 MIN", "POR CRIATIVO"], ["9:16", "4:5 · 1:1"], ["1080p", "ALTA QUALIDADE"], ["100%", "FEITO POR EDITORES"], ["R$0", "EM FERRAMENTAS"], ["+SFX", "TRILHA E EFEITOS"]];
  const f = $("#faixa");
  const html = itens.map(([a, b]) => `<div class="faixa-item"><b>${a}</b><small>${b}</small></div>`).join("");
  f.innerHTML = html + html;
})();

// ---------- revelar ao rolar ----------
const obsRevela = new IntersectionObserver((ents) => {
  ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obsRevela.unobserve(e.target); } });
}, { threshold: 0.18 });
$$(".revela, .passos").forEach((el) => obsRevela.observe(el));

// quando um elemento entra na tela pela 1ª vez, roda uma função
function aoAparecer(el, fn, limiar = 0.3) {
  const o = new IntersectionObserver((ents) => { if (ents[0].isIntersecting) { o.disconnect(); fn(); } }, { threshold: limiar });
  o.observe(el);
}

// contador
$$("[data-conta]").forEach((el) => aoAparecer(el, () => {
  const alvo = +el.dataset.conta, t0 = performance.now();
  const passo = (t) => { const p = Math.min(1, (t - t0) / 1800); el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(passo); };
  requestAnimationFrame(passo);
}));

// ---------- roteiro sendo escrito ----------
aoAparecer($("#docLinhas"), async () => {
  const el = $("#docLinhas");
  const linhas = [
    ['<span class="rot">[GANCHO]</span> ', "Para de rolar: ", "<mark>isso muda suas vendas.</mark>"],
    ['<span class="rot">[DOR]</span> ', "Anúncio sem graça ", "não para o dedo."],
    ['<span class="rot">[VIRADA]</span> ', "Criativo pensado ", "pra vender."],
    ['<span class="rot">[CTA]</span> ', "Toca no botão ", "<mark>e garante o seu.</mark>"],
  ];
  while (true) {
    el.innerHTML = "";
    for (const [tag, a, b] of linhas) {
      const p = document.createElement("div");
      el.appendChild(p);
      const txt = a + b.replace(/<[^>]+>/g, "");
      for (let k = 1; k <= txt.length; k++) {
        const vis = txt.slice(0, k);
        const marcado = b.startsWith("<mark>") && k > a.length ? a + "<mark>" + vis.slice(a.length) + "</mark>" : vis;
        p.innerHTML = tag + marcado + '<span class="cur"></span>';
        await dorme(32);
      }
      p.innerHTML = tag + a + b;
      await dorme(260);
    }
    el.lastChild.innerHTML += '<span class="cur"></span>';
    await dorme(3200);
  }
});

// ---------- terminal de render ----------
aoAparecer($("#term"), async () => {
  const el = $("#term");
  const linhas = [
    '<span class="az">$</span> render --formato 9:16',
    '<span class="vd">→</span> copy: aprovada <span class="vd">✓</span>',
    '<span class="vd">→</span> legenda: dinâmica <span class="vd">✓</span>',
    '<span class="vd">→</span> trilha: 128 bpm <span class="vd">✓</span>',
    '<span class="vd">→</span> sfx: 14 efeitos <span class="vd">✓</span>',
    '<span class="vd">→</span> status: <span class="vd">entregue</span> █',
  ];
  while (true) {
    el.innerHTML = "";
    for (const l of linhas) { const d = document.createElement("div"); d.innerHTML = l; d.style.opacity = 0; el.appendChild(d); await dorme(60); d.style.transition = "opacity .3s"; d.style.opacity = 1; await dorme(650); }
    await dorme(2600);
  }
});

// ---------- abas do pacote ----------
(() => {
  const botoes = $$("#abas button"), itens = $$("#painel .painel-item");
  let atual = 0, timer;
  const mini = $$("#pedidoMini .mini-li");
  let miniTimer;
  function animaMini() { clearTimeout(miniTimer); mini.forEach((m) => m.classList.remove("ok")); let k = 0; const f = () => { if (k < mini.length) { mini[k++].classList.add("ok"); miniTimer = setTimeout(f, 650); } }; miniTimer = setTimeout(f, 400); }
  function mostra(i) {
    atual = i;
    botoes.forEach((b, k) => b.classList.toggle("ativa", k === i));
    // reinicia a barrinha de progresso
    const b = botoes[i]; b.classList.remove("ativa"); void b.offsetWidth; b.classList.add("ativa");
    itens.forEach((it, k) => it.classList.toggle("ativo", k === i));
    if (i === 0) animaMini();
    clearTimeout(timer);
    timer = setTimeout(() => mostra((atual + 1) % botoes.length), 6000);
  }
  botoes.forEach((b, k) => b.addEventListener("click", () => mostra(k)));
  aoAparecer($("#painel"), () => mostra(0), 0.2);
})();

// ---------- legenda karaokê ----------
(async () => {
  const el = $("#karaoke");
  const frases = [["ISSO", "AQUI", "MUDA", "TUDO"], ["COMPRA", "HOJE", "COM", "DESCONTO"], ["CORRE", "QUE", "ACABA!"]];
  let f = 0;
  while (true) {
    const fr = frases[f++ % frases.length];
    el.innerHTML = fr.map((w) => `<span>${w}</span>`).join(" ");
    const sp = $$("span", el);
    for (const s of sp) { sp.forEach((x) => x.classList.remove("on")); s.classList.add("on"); await dorme(380); }
    await dorme(500);
  }
})();

// ---------- passo 2: material chegando ----------
aoAparecer($("#passosGrade"), async () => {
  const itens = $$(".hub-item");
  while (true) {
    itens.forEach((it) => { it.classList.remove("ok"); $(".st", it).textContent = "PREENCHENDO…"; });
    await dorme(1500);
    for (const it of itens) { await dorme(900); it.classList.add("ok"); $(".st", it).textContent = $(".st", it).dataset.st; }
    await dorme(3500);
  }
}, 0.2);

// calendário
(() => {
  const g = $("#calGrade");
  const dias = ["D", "S", "T", "Q", "Q", "S", "S"];
  let h = dias.map((d) => `<span class="cinza">${d}</span>`).join("");
  const inicio = new Date(2026, 10, 1).getDay();
  for (let i = 0; i < inicio; i++) h += "<span></span>";
  for (let d = 1; d <= 30; d++) {
    const ds = (inicio + d - 1) % 7;
    h += `<span class="${d === 18 ? "hoje" : ds === 0 || ds === 6 ? "fds" : ""}">${d}</span>`;
  }
  g.innerHTML = h;
})();

// ---------- editor ----------
(() => {
  const s = $("#onda");
  let r = "";
  for (let i = 0; i < 100; i++) { const a = 3 + Math.abs(Math.sin(i * 0.7) * 9 + Math.sin(i * 0.23) * 7) ; r += `<rect x="${i * 4}" y="${12 - a / 2}" width="2.4" height="${a}" rx="1"/>`; }
  s.innerHTML = r;
  aoAparecer($("#feito"), async () => {
    const li = $$("#feito li");
    while (true) {
      li.forEach((l) => l.classList.remove("ok"));
      for (const l of li) { await dorme(800); l.classList.add("ok"); }
      await dorme(3500);
    }
  });
})();

// ---------- anel 3D do portfólio ----------
(() => {
  const anel = $("#anel");
  const lista = PORT.slice(0, 12);
  const N = lista.length;
  const R = innerWidth < 700 ? 330 : 520;
  lista.forEach((n, i) => {
    const c = document.createElement("div");
    c.className = "anel-card";
    c.style.transform = `rotateY(${(360 / N) * i}deg) translateZ(${R}px)`;
    const v = document.createElement("video");
    v.dataset.src = `assets/port/${n}.mp4`; v.poster = `assets/port/${n}.jpg`; v.preload = "none";
    c.appendChild(v); vigiaVideo(v);
    const tag = document.createElement("small"); tag.textContent = NICHO[n]; c.appendChild(tag);
    anel.appendChild(c);
  });
  let ang = 0, girando = true, volta;
  anel.style.transition = "none";
  function quadro() {
    if (girando && !movimentoReduzido) { ang -= 0.08; anel.style.transform = `rotateX(-6deg) rotateY(${ang}deg)`; }
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);
  $$("#nichos button").forEach((b) => b.addEventListener("click", () => {
    $$("#nichos button").forEach((x) => x.classList.toggle("ativo", x === b));
    const alvo = -(360 / N) * +b.dataset.alvo;
    // menor caminho até o alvo
    let d = ((alvo - ang) % 360 + 540) % 360 - 180;
    ang += d;
    girando = false;
    anel.style.transition = "transform 1.2s cubic-bezier(.3,.8,.2,1)";
    anel.style.transform = `rotateX(-6deg) rotateY(${ang}deg)`;
    clearTimeout(volta);
    volta = setTimeout(() => { anel.style.transition = "none"; girando = true; }, 5000);
  }));
})();

// ---------- esteira de criativos ----------
(() => {
  const e = $("#esteira");
  [...PORT, ...PORT].forEach((n) => e.appendChild(tile(n, true)));
})();

// ---------- estrelas ----------
(() => {
  const cv = $("#estrelas"), cx = cv.getContext("2d");
  let pts = [];
  function ajusta() {
    cv.width = cv.offsetWidth * devicePixelRatio; cv.height = cv.offsetHeight * devicePixelRatio;
    pts = Array.from({ length: Math.round((cv.width * cv.height) / 9000 / devicePixelRatio) }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 1.3 + 0.3, f: Math.random() * 6, v: Math.random() * 0.15 + 0.03 }));
  }
  ajusta(); addEventListener("resize", ajusta);
  let vis = false;
  new IntersectionObserver((e) => (vis = e[0].isIntersecting)).observe(cv);
  function des(t) {
    if (vis) {
      cx.clearRect(0, 0, cv.width, cv.height);
      for (const p of pts) {
        p.y -= p.v; if (p.y < 0) p.y = cv.height;
        const a = 0.35 + 0.65 * Math.abs(Math.sin(t / 900 + p.f));
        cx.fillStyle = `rgba(46,227,137,${a * 0.8})`;
        cx.beginPath(); cx.arc(p.x, p.y, p.r * devicePixelRatio, 0, 7); cx.fill();
      }
    }
    requestAnimationFrame(des);
  }
  requestAnimationFrame(des);
})();

// ---------- celular no feed ----------
(() => {
  const ordem = ["01", "04", "11", "09", "02", "06", "07", "14"];
  const legenda = { "01": "Criativo · Moda streetwear", "04": "Criativo · App", "11": "Criativo · Beleza", "09": "Criativo · Clínica", "02": "Criativo · Joias", "06": "Criativo · Fitness", "07": "Criativo · Plantas", "14": "Criativo · Avatar IA" };
  const v = $("#celVideo"), pontos = $("#celPontos"), leg = $("#celLegenda");
  pontos.innerHTML = ordem.map(() => "<i></i>").join("");
  let i = 0, timer, ativo = false;
  function mostra(k) {
    i = (k + ordem.length) % ordem.length;
    const n = ordem[i];
    v.poster = `assets/port/${n}.jpg`; v.src = `assets/port/${n}.mp4`; v.play().catch(() => {});
    leg.textContent = legenda[n];
    $$("i", pontos).forEach((p, j) => { p.className = j < i ? "foi" : j === i ? "on" : ""; });
    clearTimeout(timer); timer = setTimeout(() => mostra(i + 1), 7000);
  }
  v.muted = true; v.playsInline = true; v.loop = true;
  $("#cel").addEventListener("click", () => mostra(i + 1));
  new IntersectionObserver((e) => {
    if (e[0].isIntersecting && !ativo) { ativo = true; mostra(i); }
    else if (!e[0].isIntersecting && ativo) { ativo = false; clearTimeout(timer); v.pause(); }
  }, { threshold: 0.2 }).observe($("#cel"));
})();

// ---------- menu mais escuro ao rolar ----------
const ajustaMenu = () => $("#menu").classList.toggle("rolou", scrollY > 40);
addEventListener("scroll", ajustaMenu, { passive: true });
ajustaMenu();

// ================= PASSO A PASSO DO PEDIDO =================
// Número do WhatsApp que recebe os pedidos (só números, com 55 + DDD). Ex.: "5511912345678"
const WHATSAPP = "";
// Link do checkout de R$35, se um dia tiver (abre junto com o WhatsApp).
const CHECKOUT_URL = "";

(() => {
  const pd = $("#pedido"), form = $("#pdForm");
  const etapas = $$(".pd-etapa", pd), trilha = $$("#pdTrilha li"), barra = $("#pdBarra");
  const seguir = $("#pdSeguir"), voltar = $("#pdVoltar"), aviso = $("#pdAviso");
  const outroCaixa = $("#pdOutroCaixa"), brutoCaixa = $("#pdBrutoCaixa"), iaCaixa = $("#pdIaCaixa");
  let passo = 0, arquivos = [], ultimoFoco = null;

  const valor = (nome) => (form.querySelector(`input[name="${nome}"]:checked`) || {}).value || "";
  const txt = (id) => $("#" + id).value.trim();
  const nicho = () => (valor("nicho") === "Outro" ? txt("pdOutro") : valor("nicho"));

  // o que falta em cada passo (vazio = pode seguir)
  function falta(i) {
    if (i === 0) {
      if (!valor("nicho")) return "Escolha o nicho do seu criativo.";
      if (valor("nicho") === "Outro" && txt("pdOutro").length < 2) return "Escreva qual é o seu nicho.";
    }
    if (i === 1) {
      const m = valor("material");
      if (!m) return "Diga se você tem material bruto ou se quer com personagem de IA.";
      if (m === "ia" && txt("pdPersonagem").length < 10) return "Descreva como você quer o personagem.";
    }
    if (i === 3) {
      if (txt("pdNome").length < 2) return "Escreva seu nome.";
      if (txt("pdZap").replace(/\D/g, "").length < 10) return "Coloque seu WhatsApp com DDD. É por ele que o criativo chega.";
      if (txt("pdEmail") && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(txt("pdEmail"))) return "Confira o e-mail ou deixe em branco.";
    }
    return "";
  }

  function atualiza() {
    outroCaixa.hidden = valor("nicho") !== "Outro";
    brutoCaixa.hidden = valor("material") !== "bruto";
    iaCaixa.hidden = valor("material") !== "ia";
    seguir.classList.toggle("parado", !!falta(passo));
    if (aviso.textContent && !aviso.classList.contains("ok") && !falta(passo)) aviso.textContent = "";
    guarda();
  }

  function vai(i) {
    passo = i;
    etapas.forEach((e, k) => e.classList.toggle("ativa", k === i));
    trilha.forEach((t, k) => { t.classList.toggle("on", k === i); t.classList.toggle("feito", k < i); });
    const N = etapas.length - 1; // a última é a tela de "pedido pronto"
    barra.style.width = (Math.min(i + 1, N) / N) * 100 + "%";
    pd.classList.toggle("pd-pronto", i === N);
    voltar.disabled = i === 0;
    const final = i === etapas.length - 2;
    seguir.innerHTML = final ? 'FINALIZAR CRIATIVO · R$35 <span class="seta">›</span>' : 'CONTINUAR <span class="seta">›</span>';
    aviso.textContent = ""; aviso.classList.remove("ok");
    if (final) montaResumo();
    $(".pd-corpo", pd).scrollTop = 0;
    atualiza();
  }

  function montaResumo() {
    const m = valor("material");
    const material = m === "bruto"
      ? "Vídeos e fotos meus (mando no WhatsApp)" + (txt("pdLinkBruto") ? ` · pasta: ${txt("pdLinkBruto")}` : "")
      : `Personagem de IA: ${txt("pdPersonagem")}`;
    const linhas = [["NICHO", nicho(), 0], ["MATERIAL", material, 1], ["COPY", (txt("pdCopy") || "Nosso redator cria do zero") + (txt("pdLink") ? ` · ${txt("pdLink")}` : ""), 2]];
    const r = $("#pdResumo");
    r.innerHTML = "";
    linhas.forEach(([t, v, k]) => {
      const d = document.createElement("div");
      d.innerHTML = `<dt>${t}</dt><dd></dd><button type="button">Editar</button>`;
      $("dd", d).textContent = v;
      $("button", d).addEventListener("click", () => vai(k));
      r.appendChild(d);
    });
  }

  seguir.addEventListener("click", () => {
    const f = falta(passo);
    if (f) { aviso.classList.remove("ok"); aviso.textContent = f; return; }
    if (passo < etapas.length - 2) return vai(passo + 1);
    finaliza();
  });
  voltar.addEventListener("click", () => passo > 0 && vai(passo - 1));
  form.addEventListener("input", atualiza);
  form.addEventListener("change", atualiza);
  form.addEventListener("submit", (e) => e.preventDefault());


  // rascunho salvo neste navegador
  const CHAVE = "criativo-express-pedido";
  function guarda() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ nicho: valor("nicho"), outro: txt("pdOutro"), material: valor("material"), link: txt("pdLinkBruto"), personagem: txt("pdPersonagem"), copy: txt("pdCopy"), pagina: txt("pdLink"), pagamento: valor("pagamento"), nome: txt("pdNome"), zap: txt("pdZap"), email: txt("pdEmail") }));
    } catch {}
  }
  try {
    const r = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (r) {
      const marca = (nome, v) => { const el = form.querySelector(`input[name="${nome}"][value="${v}"]`); if (el) el.checked = true; };
      marca("nicho", r.nicho); marca("material", r.material); marca("pagamento", r.pagamento);
      $("#pdOutro").value = r.outro || ""; $("#pdLinkBruto").value = r.link || ""; $("#pdPersonagem").value = r.personagem || "";
      $("#pdCopy").value = r.copy || ""; $("#pdLink").value = r.pagina || "";
      $("#pdNome").value = r.nome || ""; $("#pdZap").value = r.zap || ""; $("#pdEmail").value = r.email || "";
    }
  } catch {}

  function mensagem() {
    const m = valor("material");
    const linhas = [
      "Olá! Quero fechar meu criativo de R$35 (até 1 min).",
      "",
      `*Nome:* ${txt("pdNome")}`,
      `*WhatsApp:* ${txt("pdZap")}`,
      txt("pdEmail") ? `*E-mail:* ${txt("pdEmail")}` : "",
      `*Nicho:* ${nicho()}`,
      m === "bruto" ? `*Material:* tenho vídeos e fotos, vou mandar aqui${txt("pdLinkBruto") ? ` (pasta: ${txt("pdLinkBruto")})` : ""}` : `*Material:* personagem de IA. ${txt("pdPersonagem")}`,
      `*Copy:* ${txt("pdCopy") || "pode criar do zero"}`,
      txt("pdLink") ? `*Link do produto:* ${txt("pdLink")}` : "",
      `*Pagamento:* ${valor("pagamento")}`,
    ];
    return linhas.filter((l, k) => l || k === 1).join("\n");
  }

  function finaliza() {
    guarda();
    const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem())}`;
    $("#pdZapLink").href = link;
    $("#pdLembrete").hidden = valor("material") !== "bruto";
    vai(etapas.length - 1);
    if (CHECKOUT_URL) { const a = document.createElement("a"); a.href = CHECKOUT_URL; a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove(); }
  }
  $("#pdRever").addEventListener("click", () => vai(etapas.length - 2));

  // abrir e fechar
  function abre(e) {
    if (e) e.preventDefault();
    ultimoFoco = document.activeElement;
    pd.hidden = false;
    document.body.classList.add("pd-aberto");
    $("#menu").classList.remove("aberto");
    vai(0);
    setTimeout(() => $(".pd-fechar", pd).focus(), 50);
  }
  function fecha() {
    pd.hidden = true;
    document.body.classList.remove("pd-aberto");
    if (location.hash === "#pedido") history.replaceState(null, "", location.pathname + location.search);
    if (ultimoFoco) ultimoFoco.focus();
  }
  $$('a[href="#pedido"]').forEach((a) => a.addEventListener("click", abre));
  $$("[data-fecha]", pd).forEach((b) => b.addEventListener("click", fecha));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !pd.hidden) fecha(); });
  if (location.hash === "#pedido") abre();
})();
