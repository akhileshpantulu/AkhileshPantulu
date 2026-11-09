import { site } from "@/content/site";

/**
 * Opening splash: the name in black on a white screen for a couple of
 * seconds, then a staged fade into the site.
 *
 * It is plain HTML plus a tiny inline script that runs while the page is
 * still being parsed, before anything is painted. It plays on every open
 * of the site; when a page is opened from a link on the site itself the
 * script removes it before paint, so the white screen never flashes. It
 * lives in the root layout, so moving between pages never shows it again.
 */
const HOLD_MS = 2000; // how long the name stays on screen before fading

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
  // Staged exit: hold, fade the name, then fade the white while the artwork
  // behind it comes into focus (it listens for "splash:reveal").
  setTimeout(function () { el.classList.add("splash-text-out"); }, ${HOLD_MS});
  setTimeout(function () {
    el.classList.add("splash-out");
    window.__splashRevealed = true;
    window.dispatchEvent(new Event("splash:reveal"));
  }, ${HOLD_MS + 300});
  setTimeout(function () { el.remove(); }, ${HOLD_MS + 1550});
})();`;

  const name = site.name.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const html = `<div id="splash" aria-hidden="true"><span class="splash-line">${name}</span></div><script>${script}</script>`;

  // Rendered as raw HTML so the inline script runs during parsing and React
  // leaves the node alone if the script removes it.
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
