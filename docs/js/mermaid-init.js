/* Auto-init Mermaid on pages that include ```mermaid code fences */
document$.subscribe(() => {
  if (window.mermaid) {
    // mermaid.initialize({ startOnLoad: true, securityLevel: "strict" });
    mermaid.initialize({ startOnLoad: true, securityLevel: "loose" });
    mermaid.init();
  }
});
