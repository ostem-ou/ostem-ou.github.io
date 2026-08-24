// Pulls team + event content from published Google Sheet CSVs
// (configured in assets/data/sheet-config.js) and renders it into
// the page. If a URL is blank, unreachable, or empty, the page's
// existing static markup is left alone — that markup is both the
// offline fallback and the example content.
(function () {
  var PETALS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  var PETAL_HEX = {
    red: '#971F29', orange: '#C47024', yellow: '#EBC038',
    green: '#32693B', blue: '#316892', purple: '#7B4489',
  };

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  // Handles quoted fields, embedded commas, escaped quotes ("").
  function parseCSV(text) {
    var rows = [], row = [], field = '', inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i], next = text[i + 1];
      if (inQuotes) {
        if (c === '"' && next === '"') { field += '"'; i++; }
        else if (c === '"') { inQuotes = false; }
        else { field += c; }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field); field = '';
      } else if (c === '\r') {
        // skip
      } else if (c === '\n') {
        row.push(field); rows.push(row); row = []; field = '';
      } else {
        field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (c) { return c.trim() !== ''; }); });
  }

  function rowsToObjects(rows) {
    if (!rows.length) return [];
    var headers = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).map(function (r) {
      var obj = {};
      headers.forEach(function (h, i) { obj[h] = (r[i] || '').trim(); });
      return obj;
    });
  }

  function fetchSheet(url) {
    if (!url) return Promise.resolve(null);
    return fetch(url, { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.text() : null; })
      .then(function (text) {
        if (!text) return null;
        var objs = rowsToObjects(parseCSV(text));
        return objs.length ? objs : null;
      })
      .catch(function () { return null; });
  }

  var ICON_LINKEDIN = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.5V23h-4.5V8.25zM8.25 8.25h4.32v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V23h-4.5v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V23h-4.5V8.25z"/></svg>';
  var ICON_EMAIL = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 4h20v16H2V4zm2 2v.01L12 12l8-5.99V6H4zm16 2.24-7.4 5.55a1 1 0 0 1-1.2 0L4 8.24V18h16V8.24z"/></svg>';

  function avatarHTML(name, photo, bg) {
    if (photo) {
      return '<div class="officer-avatar"><img src="assets/images/team/' + esc(photo) + '" alt="" loading="lazy"></div>';
    }
    return '<div class="officer-avatar" style="background:' + bg + '">' + esc(initials(name)) + '</div>';
  }

  function officerCardHTML(o, i) {
    var petal = PETALS.indexOf((o.petal || '').toLowerCase()) !== -1 ? o.petal.toLowerCase() : PETALS[i % PETALS.length];
    var linkedin = o.linkedin ? '<a href="' + esc(o.linkedin) + '" target="_blank" rel="noopener" aria-label="' + esc(o.name) + ' on LinkedIn">' + ICON_LINKEDIN + '</a>' : '';
    var email = o.email ? '<a href="mailto:' + esc(o.email) + '" aria-label="Email ' + esc(o.name) + '">' + ICON_EMAIL + '</a>' : '';
    return (
      '<article class="officer-card petal-left-' + petal + '">' +
        avatarHTML(o.name, o.photo, PETAL_HEX[petal]) +
        '<div class="name">' + esc(o.name || 'TBD') + '</div>' +
        '<div class="role">' + esc(o.role || '') + '</div>' +
        '<div class="pronouns">' + esc(o.pronouns || '') + '</div>' +
        (o.bio ? '<p class="bio">' + esc(o.bio) + '</p>' : '') +
        ((linkedin || email) ? '<div class="officer-links">' + linkedin + email + '</div>' : '') +
      '</article>'
    );
  }

  function advisorCardHTML(a) {
    var avatar = a.photo
      ? '<div class="avatar"><img src="assets/images/team/' + esc(a.photo) + '" alt="" loading="lazy"></div>'
      : '<div class="avatar">' + esc(initials(a.name)) + '</div>';
    var roleLine = [a.role || 'Faculty Advisor', a.department].filter(Boolean).join(' · ');
    return (
      '<div class="advisor-card">' +
        avatar +
        '<div>' +
          '<div class="name" style="font-family:var(--font-display);font-weight:600;font-size:1.2rem;color:var(--ink)">' + esc(a.name || 'TBD') + '</div>' +
          '<div class="role" style="color:var(--crimson);font-weight:600;margin-bottom:10px">' + esc(roleLine) + '</div>' +
          (a.bio ? '<p>' + esc(a.bio) + '</p>' : '') +
        '</div>' +
      '</div>'
    );
  }

  function renderTeam() {
    var grid = document.getElementById('officer-grid');
    var advisorSlot = document.getElementById('advisor-slot');
    if (!grid && !advisorSlot) return;
    var url = window.OSTEM_CONFIG && window.OSTEM_CONFIG.teamCsvUrl;
    fetchSheet(url).then(function (data) {
      if (!data) return;
      var officers = data.filter(function (r) { return (r.type || 'officer').toLowerCase() !== 'advisor'; });
      var advisors = data.filter(function (r) { return (r.type || '').toLowerCase() === 'advisor'; });
      if (grid && officers.length) grid.innerHTML = officers.map(officerCardHTML).join('');
      if (advisorSlot && advisors.length) advisorSlot.innerHTML = advisorCardHTML(advisors[0]);
    });
  }

  function eventCardHTML(e, isPast) {
    var d = e.date ? new Date(e.date + 'T00:00:00') : null;
    var dateLabel = d && !isNaN(d)
      ? d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + (e.time ? ' · ' + esc(e.time) : '')
      : esc(e.date || '');
    var link = e.link_url
      ? '<a class="btn btn-secondary btn-sm" href="' + esc(e.link_url) + '">' + esc(e.link_label || (isPast ? 'See recap' : 'Learn more')) + '</a>'
      : '';
    return (
      '<article class="event-card' + (isPast ? ' is-past' : '') + '">' +
        '<span class="event-date">' + dateLabel + '</span>' +
        '<h3>' + esc(e.title || 'TBD') + '</h3>' +
        (e.location ? '<p class="event-meta">' + esc(e.location) + '</p>' : '') +
        (e.description ? '<p>' + esc(e.description) + '</p>' : '') +
        link +
      '</article>'
    );
  }

  function renderEvents() {
    var upcomingEl = document.getElementById('upcoming-events');
    var pastEl = document.getElementById('past-events');
    var homeEl = document.getElementById('home-upcoming-events');
    if (!upcomingEl && !pastEl && !homeEl) return;
    var url = window.OSTEM_CONFIG && window.OSTEM_CONFIG.eventsCsvUrl;
    fetchSheet(url).then(function (data) {
      if (!data) return;
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var withDates = data.map(function (e) {
        var d = e.date ? new Date(e.date + 'T00:00:00') : null;
        return { row: e, date: d && !isNaN(d) ? d : null };
      }).filter(function (x) { return x.date; });
      var upcoming = withDates.filter(function (x) { return x.date >= today; })
        .sort(function (a, b) { return a.date - b.date; })
        .map(function (x) { return x.row; });
      var past = withDates.filter(function (x) { return x.date < today; })
        .sort(function (a, b) { return b.date - a.date; })
        .map(function (x) { return x.row; });
      if (upcomingEl && upcoming.length) upcomingEl.innerHTML = upcoming.map(function (e) { return eventCardHTML(e, false); }).join('');
      if (pastEl && past.length) pastEl.innerHTML = past.map(function (e) { return eventCardHTML(e, true); }).join('');
      if (homeEl && upcoming.length) homeEl.innerHTML = upcoming.slice(0, 3).map(function (e) { return eventCardHTML(e, false); }).join('');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderTeam();
    renderEvents();
  });
})();
