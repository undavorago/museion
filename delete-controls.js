/* Quick delete controls for personal curricula and records. */
(() => {
  'use strict';
  const root = document.getElementById('app');
  if (!root) return;
  function addButton(host, id, label, title) {
    if (!host || !id || host.querySelector(':scope > .quick-delete')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quick-delete';
    button.dataset.action = 'delete';
    button.dataset.id = id;
    button.setAttribute('aria-label', 'Удалить ' + label + (title ? ': ' + title : ''));
    button.title = 'Удалить ' + label;
    button.innerHTML = '<span aria-hidden="true">×</span> Удалить';
    host.appendChild(button);
  }
  function enhance() {
    root.querySelectorAll('.program-group[id^="program-"]').forEach(group => {
      const id = group.id.slice('program-'.length);
      if (id !== 'unassigned') addButton(group.querySelector('.program-actions'), id, 'программу', group.querySelector('.program-ribbon h2')?.textContent);
    });
    root.querySelectorAll('.lectures-list[id^="course-"]').forEach(group => {
      addButton(group.querySelector('.curriculum-controls'), group.id.slice('course-'.length), 'курс', group.querySelector('.course-intro h2')?.textContent);
    });
    root.querySelectorAll('.lecture-row').forEach(row => {
      const id = row.querySelector('[data-action="toggle-lesson"]')?.dataset.id
        || row.querySelector('[data-open]')?.dataset.open;
      let host = row.querySelector('.lecture-actions');
      if (!host && id) {
        host = document.createElement('div');
        host.className = 'lecture-actions';
        row.appendChild(host);
      }
      addButton(host, id, 'занятие', row.querySelector('h3')?.textContent);
    });
    root.querySelectorAll('.poster').forEach(card => {
      addButton(card, card.querySelector('[data-course-focus]')?.dataset.courseFocus, 'курс', card.querySelector('h3')?.textContent);
    });
    root.querySelectorAll('button.sheet[data-open]').forEach(card => {
      if (card.parentElement?.classList.contains('delete-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'delete-wrap';
      card.parentNode.insertBefore(wrap, card);
      wrap.appendChild(card);
      addButton(wrap, card.dataset.open, 'запись', card.querySelector('h3')?.textContent);
    });
  }
  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; enhance(); });
  }).observe(root, { childList: true, subtree: true });
  enhance();
})();
