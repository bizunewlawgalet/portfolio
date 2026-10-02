

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Theme Switcher (Dark/Light)
  const themeBtn = document.getElementById("theme-toggle");
  const setTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
    themeBtn.textContent = t === "light" ? "" : "";
  };
  setTheme(localStorage.getItem("theme") || "dark");
  themeBtn.onclick = () =>
    setTheme(
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark",
    );

  // 2. Mobile Navigation Toggle
  const navMenu = document.getElementById("nav-links");
  document.getElementById("menu-btn").onclick = () =>
    navMenu.classList.toggle("open");
  navMenu
    .querySelectorAll("a")
    .forEach((a) => (a.onclick = () => navMenu.classList.remove("open")));

  // 3. Typing Animation in Hero
  const roles = [
    "3rd-Year CS Student",
    "Web Developer",
    "Java & C++ Enthusiast",
    "Hardware/Software Tech",
  ];
  let rIdx = 0,
    cIdx = 0,
    isDel = false;
  const roleEl = document.getElementById("typing-role");
  (function type() {
    roleEl.textContent = roles[rIdx].substring(0, isDel ? --cIdx : ++cIdx);
    let speed = isDel ? 40 : 80;
    if (!isDel && cIdx === roles[rIdx].length) {
      speed = 1800;
      isDel = true;
    } else if (isDel && cIdx === 0) {
      isDel = false;
      rIdx = (rIdx + 1) % roles.length;
      speed = 400;
    }
    setTimeout(type, speed);
  })();

  // 4. Skills Filtering
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.onclick = () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      document.querySelectorAll(".skill-item").forEach((item) => {
        item.style.display =
          cat === "all" || item.dataset.category.includes(cat)
            ? "block"
            : "none";
      });
    };
  });

  
  // 5. Interactive Modal (Gebeta Mancala & Project Details)
  const modal = document.getElementById("modal");
  const mTitle = document.getElementById("modal-title");
  const mBody = document.getElementById("modal-body");
  document.getElementById("modal-close").onclick = () =>
    modal.classList.remove("open");
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove("open");
  };

  const projectData = {
    gebeta: {
      title: "Gebeta Game (Mancala Strategy)",
      body: `
        <p>Interactive Ethiopian Gebeta board game. Select a pit to sow seeds counter-clockwise!</p>
        <div style="display:flex;justify-content:space-between;font-weight:700;margin:10px 0;">
          <span>Player 2 (Top)</span><span id="g-status" style="color:var(--cyan)">P1 Turn</span><span>Player 1 (Bottom)</span>
        </div>
        <div class="gebeta-board">
          <div class="gebeta-row" id="row-p2"></div>
          <div class="gebeta-row" id="row-p1"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>P1 Score: <b id="p1-s" style="color:var(--cyan)">0</b> | P2 Score: <b id="p2-s" style="color:#ffd54f">0</b></div>
          <button class="btn btn-outline btn-sm" id="g-reset">Restart</button>
        </div>`,
    },
    library: {
      title: "Library Management System",
      body: "<p>Built with <b>Java & C++</b> using OOP and data structures. Manages book cataloging, ISBN lookup, student borrowing/return records, and search indexing.</p>",
    },
    restaurant: {
      title: "Smart Restaurant System",
      body: "<p>A dynamic web management system streamlining digital menu selection, table occupancy status, kitchen order routing, and instant billing generation.</p>",
    },
    web: {
      title: "Web & Algorithm Projects",
      body: "<p>Collection of responsive web applications, interactive algorithm visualizers (Sorting & Binary Trees), and front-end utility tools built with HTML, CSS, and JS.</p>",
    },
  };

  document.querySelectorAll("[data-proj]").forEach((btn) => {
    btn.onclick = () => {
      const p = projectData[btn.dataset.proj];
      if (!p) return;
      mTitle.textContent = p.title;
      mBody.innerHTML = p.body;
      modal.classList.add("open");
      if (btn.dataset.proj === "gebeta") runGebeta();
    };
  });

  function runGebeta() {
    let pits = Array(12).fill(4),
      p1 = 0,
      p2 = 0,
      turn = 1,
      over = false;
    const render = () => {
      const r1 = document.getElementById("row-p1"),
        r2 = document.getElementById("row-p2");
      if (!r1 || !r2) return;
      r1.innerHTML = "";
      r2.innerHTML = "";
      for (let i = 11; i >= 6; i--)
        r2.innerHTML += `<div class="gebeta-pit" data-idx="${i}">${pits[i]}</div>`;
      for (let i = 0; i <= 5; i++)
        r1.innerHTML += `<div class="gebeta-pit" data-idx="${i}">${pits[i]}</div>`;
      document.getElementById("p1-s").textContent = p1;
      document.getElementById("p2-s").textContent = p2;
      modal
        .querySelectorAll(".gebeta-pit")
        .forEach((p) => (p.onclick = () => move(+p.dataset.idx)));
    };
    const move = (idx) => {
      if (
        over ||
        (turn === 1 && (idx < 0 || idx > 5)) ||
        (turn === 2 && (idx < 6 || idx > 11)) ||
        pits[idx] === 0
      )
        return;
      let hand = pits[idx];
      pits[idx] = 0;
      let curr = idx;
      while (hand > 0) {
        curr = (curr + 1) % 12;
        pits[curr]++;
        hand--;
      }
      if (pits[curr] === 4) {
        if (turn === 1) p1 += 4;
        else p2 += 4;
        pits[curr] = 0;
      } else turn = turn === 1 ? 2 : 1;
      const s1 = pits.slice(0, 6).reduce((a, b) => a + b, 0),
        s2 = pits.slice(6, 12).reduce((a, b) => a + b, 0);
      if (!s1 || !s2) {
        over = true;
        p1 += s1;
        p2 += s2;
        pits.fill(0);
      }
      const statusEl = document.getElementById("g-status");
      if (statusEl)
        statusEl.textContent = over
          ? p1 > p2
            ? "P1 Won!"
            : p2 > p1
              ? "P2 Won!"
              : "Tie!"
          : `P${turn} Turn`;
      render();
    };
    const reset = document.getElementById("g-reset");
    if (reset) reset.onclick = runGebeta;
    render();
  }

  // 6. Contact Form Validation
  const form = document.getElementById("contact-form");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const n = document.getElementById("f-name").value.trim();
      const em = document.getElementById("f-email").value.trim();
      const msg = document.getElementById("f-msg").value.trim();
      const res = document.getElementById("form-res");
      if (!n || !em || !msg) {
        res.textContent = "Please complete all fields.";
        res.style.color = "#ef4444";
        return;
      }
      res.textContent = `Thank you, ${n}! Your message has been sent.`;
      res.style.color = "var(--cyan)";
      form.reset();
    };
  }

  // 7. Scroll & Back to Top
  const backBtn = document.getElementById("back-top");
  window.onscroll = () => {
    backBtn.classList.toggle("show", window.scrollY > 300);
  };
  backBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
});
