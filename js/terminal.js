(function () {
  const output = document.getElementById('terminalOutput');
  const input = document.getElementById('terminalInput');
  if (!output || !input) return;

  const C = window.CONFIG || {};

  const commands = {
    help() {
      return [
        "Available commands:",
        "  help      — show this message",
        "  about     — who am I",
        "  skills    — list skills",
        "  projects  — list projects",
        "  contact   — contact info",
        "  clear     — clear terminal"
      ].join('\n');
    },
    about() { return (C.about && C.about.text) || "No about info."; },
    skills() {
      const s = (C.skills || []).map(x => `  • ${x.name} — ${x.desc}`).join('\n');
      return "Skills:\n" + (s || "  (none)");
    },
    projects() {
      const list = document.querySelectorAll('.project-card .project-title');
      if (!list.length) return "No projects loaded.";
      return "Projects:\n" + Array.from(list).map(t => `  • ${t.textContent}`).join('\n');
    },
    contact() {
      const s = C.socials || {};
      return [
        `  email     : ${s.email || '-'}`,
        `  github    : ${s.github || '-'}`,
        `  discord   : ${s.discord || '-'}`,
        `  instagram : ${s.instagram || '-'}`,
        `  linkedin  : ${s.linkedin || '-'}`
      ].join('\n');
    }
  };

  function print(text, cls = 'out') {
    const div = document.createElement('div');
    div.className = 'term-line ' + cls;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function printCmd(cmd) {
    const div = document.createElement('div');
    div.className = 'term-line cmd';
    div.innerHTML = `<span style="color:#22d3ee">user@portfolio:~$</span> ${escapeHtml(cmd)}`;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    printCmd(cmd);
    const [name, ...args] = cmd.split(/\s+/);
    const key = name.toLowerCase();
    if (key === 'clear') { output.innerHTML = ''; return; }
    if (commands[key]) print(commands[key](args));
    else print(`command not found: ${key}. Type 'help'.`, 'err');
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
  });

  output.parentElement.addEventListener('click', () => input.focus());

  print("Welcome to my portfolio terminal.", 'ok');
  print("Type 'help' to see available commands.");
  print("");
  printCmd("whoami");
  print("developer");
  print("");
})();