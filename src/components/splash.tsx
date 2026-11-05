import { site } from "@/content/site";

/**
 * First-open splash: the name types out on a white screen, then fades.
 *
 * It is plain HTML plus a tiny inline script that runs while the page is
 * still being parsed, before anything is painted. It plays on every open
 * of the site; when a page is opened from a link on the site itself the
 * script removes it before paint, so the white screen never flashes. It
 * lives in the root layout, so moving between pages never shows it again.
 */
export function Splash() {
  const script = `(function () {
  var el = document.getElementById("splash");
  if (!el) return;
  // Play on every open of the site. Skip it only when this page was opened
  // from a link on the site itself (e.g. a project opened in a new tab), so
  // it never interrupts someone already browsing.
  var internal = false;
  try { internal = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
  if (internal) { el.remove(); return; }
  el.style.display = "flex";
  var name = ${JSON.stringify(site.name)};
  var text = document.getElementById("splash-text");
  // Staged exit: hold, fade the name, then fade the white while the artwork
  // behind it starts to come into focus (it listens for "splash:reveal").
  var done = function () {
    setTimeout(function () { el.classList.add("splash-text-out"); }, 450);
    setTimeout(function () {
      el.classList.add("splash-out");
      window.__splashRevealed = true;
      window.dispatchEvent(new Event("splash:reveal"));
    }, 750);
    setTimeout(function () { el.remove(); }, 2000);
  };
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    text.textContent = name;
    setTimeout(done, 400);
    return;
  }
  var i = 0;
  var type = function () {
    i++;
    text.textContent = name.slice(0, i);
    if (i < name.length) setTimeout(type, name.charAt(i) === " " ? 110 : 42 + Math.random() * 46);
    else done();
  };
  setTimeout(type, 260);
})();`;

  const html =
    // The invisible full name reserves the width, so typed letters grow from a
    // fixed left edge instead of re-centring on every keystroke.
    '<div id="splash" aria-hidden="true"><span class="splash-line"><span class="splash-ghost">' +
    site.name.replace(/&/g, "&amp;").replace(/</g, "&lt;") +
    '</span><span class="splash-typed"><span id="splash-text"></span></span></span></div>' +
    `<script>${script}</script>`;

  // Rendered as raw HTML so the inline script runs during parsing and React
  // leaves the node alone if the script removes it.
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
