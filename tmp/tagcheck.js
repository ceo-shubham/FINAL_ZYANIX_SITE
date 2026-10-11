const fs = require('fs');
const pages = ['index.html', 'services.html', 'about.html', 'projects.html', 'insights.html', 'contact.html'];
const tags = ['html', 'head', 'body', 'header', 'nav', 'main', 'section', 'article', 'footer', 'form', 'label', 'ul', 'li', 'blockquote', 'button', 'h1', 'h2', 'h3', 'select', 'textarea', 'svg', 'a', 'div', 'span', 'strong', 'em', 'i', 'b', 'p', 'title', 'script', 'style', 'link', 'meta', 'path', 'defs', 'textPath', 'text'];
let fail = 0;
const void_ = new Set(['link', 'meta', 'path', 'input']);
for (const page of pages) {
  const src = fs.readFileSync(page, 'utf8');
  for (const t of tags) {
    const open = (src.match(new RegExp('<' + t + '(\\s|>)', 'g')) || []).length;
    const close = (src.match(new RegExp('</' + t + '>', 'g')) || []).length;
    if (void_.has(t)) continue;
    if (open !== close) { console.log(page + ': <' + t + '> open=' + open + ' close=' + close); fail = 1; }
  }
  if (!src.includes('</html>') || !src.includes('viewport')) { console.log(page + ': missing document basics'); fail = 1; }
}
console.log(fail ? 'TAG ISSUES FOUND' : 'ALL PAGES STRUCTURALLY BALANCED');
