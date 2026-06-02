// ════════════════════════════════════════════
// 上博青铜馆学习网站 — 主逻辑
// ════════════════════════════════════════════

var appState = {
  data: null,
  activePeriodId: null,
  activeDynastyId: null,
  activeCategory: '全部',
  activeArtifactId: null,
  editMode: false
};

// ── 数据加载 ──────────────────────────────

function loadData() {
  var stored = localStorage.getItem('sbm_bronze_data');
  if (stored) {
    try {
      appState.data = JSON.parse(stored);
      return;
    } catch (e) {
      console.warn('localStorage 数据损坏，回退到默认数据');
    }
  }
  appState.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData() {
  appState.data.lastModified = new Date().toISOString();
  localStorage.setItem('sbm_bronze_data', JSON.stringify(appState.data));
}

// ── 初始化 ──────────────────────────────

function init() {
  loadData();
  renderTopNavPeriods();
  renderTimeline();

  // 选中第一个有文物的 dynasty
  var firstActive = findFirstDynastyWithArtifacts();
  if (firstActive) {
    navigateToDynasty(firstActive.periodId, firstActive.dynastyId);
  } else {
    var p = appState.data.periods[0];
    var d = p.dynasties[0];
    navigateToDynasty(p.id, d.id);
  }
}

function findFirstDynastyWithArtifacts() {
  for (var i = 0; i < appState.data.periods.length; i++) {
    var p = appState.data.periods[i];
    for (var j = 0; j < p.dynasties.length; j++) {
      var d = p.dynasties[j];
      if (d.artifacts && d.artifacts.length > 0) {
        return { periodId: p.id, dynastyId: d.id };
      }
    }
  }
  return null;
}

// ── 顶部时期导航 ──────────────────────────

function renderTopNavPeriods() {
  var nav = document.getElementById('periodNav');
  nav.innerHTML = '';
  appState.data.periods.forEach(function(p) {
    var btn = document.createElement('button');
    btn.className = 'period-nav-btn';
    btn.textContent = p.name;
    btn.dataset.periodId = p.id;
    btn.onclick = function() {
      var firstDynasty = p.dynasties[0];
      if (firstDynasty) navigateToDynasty(p.id, firstDynasty.id);
    };
    nav.appendChild(btn);
  });
}

function updateTopNavActive(periodId) {
  document.querySelectorAll('.period-nav-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.periodId === periodId);
  });
}

// ── 时间轴渲染 ──────────────────────────

function renderTimeline() {
  var container = document.getElementById('timelineContent');
  container.innerHTML = '';

  appState.data.periods.forEach(function(period) {
    var periodEl = document.createElement('div');
    periodEl.className = 'timeline-period';
    periodEl.id = 'tl-period-' + period.id;

    var color = getPeriodColor(period.id);

    // 时期切换按钮
    var toggle = document.createElement('div');
    toggle.className = 'period-toggle';
    toggle.innerHTML =
      '<span class="period-diamond" style="background:' + color + '"></span>' +
      '<span class="period-name">' + period.name + '</span>' +
      '<span class="period-caret">▾</span>';
    toggle.onclick = function() {
      toggle.classList.toggle('collapsed');
      dynastiesEl.classList.toggle('collapsed');
    };

    // 朝代列表
    var dynastiesEl = document.createElement('div');
    dynastiesEl.className = 'timeline-dynasties';
    var totalH = 0;

    period.dynasties.forEach(function(dynasty) {
      var count = dynasty.artifacts ? dynasty.artifacts.length : 0;
      var item = document.createElement('div');
      item.className = 'dynasty-item';
      item.id = 'tl-dynasty-' + dynasty.id;
      item.dataset.periodId = period.id;
      item.dataset.dynastyId = dynasty.id;
      item.innerHTML =
        '<span class="dynasty-name">' + dynasty.name + '</span>' +
        '<span class="dynasty-year">' + dynasty.yearRange + '</span>' +
        (count > 0 ? '<span class="dynasty-count">' + count + ' 件文物</span>' : '');
      item.onclick = function() {
        navigateToDynasty(period.id, dynasty.id);
      };
      dynastiesEl.appendChild(item);
      totalH += count > 0 ? 74 : 58;
    });

    dynastiesEl.style.maxHeight = totalH + 'px';

    periodEl.appendChild(toggle);
    periodEl.appendChild(dynastiesEl);
    container.appendChild(periodEl);
  });
}

function updateTimelineActive(periodId, dynastyId) {
  document.querySelectorAll('.dynasty-item').forEach(function(el) {
    el.classList.toggle('active',
      el.dataset.periodId === periodId && el.dataset.dynastyId === dynastyId);
  });
}

// ── 导航 ──────────────────────────────

function navigateToDynasty(periodId, dynastyId) {
  appState.activePeriodId = periodId;
  appState.activeDynastyId = dynastyId;
  appState.activeCategory = '全部';
  appState.activeArtifactId = null;

  updateTimelineActive(periodId, dynastyId);
  updateTopNavActive(periodId);
  closeDrawer();

  var period = getPeriodById(periodId);
  var dynasty = getDynastyById(periodId, dynastyId);
  if (!period || !dynasty) return;

  renderDynastyHeader(period, dynasty);
  renderCategoryFilter(dynasty);
  renderArtifacts(dynasty, '全部');
}

// ── 朝代标题 ──────────────────────────

function renderDynastyHeader(period, dynasty) {
  var el = document.getElementById('dynastyHeader');
  var color = getPeriodColor(period.id);
  el.innerHTML =
    '<div class="dynasty-title">' +
      dynasty.name +
      '<span class="dynasty-title-year">' + dynasty.yearRange + '</span>' +
      '<span class="dynasty-period-tag" style="background:' + color + '">' + period.name + '</span>' +
    '</div>';
}

// ── 分类筛选 ──────────────────────────

function renderCategoryFilter(dynasty) {
  var el = document.getElementById('categoryFilter');
  el.innerHTML = '';
  if (!dynasty.artifacts || dynasty.artifacts.length === 0) return;

  var cats = {};
  dynasty.artifacts.forEach(function(a) {
    cats[a.category] = (cats[a.category] || 0) + 1;
  });

  var all = ['全部'].concat(Object.keys(cats));
  all.forEach(function(cat) {
    var btn = document.createElement('button');
    btn.className = 'cat-btn' + (cat === appState.activeCategory ? ' active' : '');
    var count = cat === '全部' ? dynasty.artifacts.length : cats[cat];
    btn.innerHTML = cat + '<span class="cat-count">(' + count + ')</span>';
    btn.onclick = function() {
      appState.activeCategory = cat;
      document.querySelectorAll('.cat-btn').forEach(function(b) {
        b.classList.toggle('active', b === btn);
      });
      renderArtifacts(dynasty, cat);
    };
    el.appendChild(btn);
  });
}

// ── 文物卡片网格 ──────────────────────────

function renderArtifacts(dynasty, category) {
  var grid = document.getElementById('artifactGrid');
  grid.innerHTML = '';

  var artifacts = dynasty.artifacts || [];
  var filtered = category === '全部'
    ? artifacts
    : artifacts.filter(function(a) { return a.category === category; });

  if (artifacts.length === 0) {
    var empty = document.createElement('div');
    empty.className = 'dynasty-empty';
    empty.style.gridColumn = '1 / -1';
    empty.innerHTML =
      '<span class="dynasty-empty-icon">◯</span>' +
      '<div>暂无文物数据</div>' +
      (appState.editMode
        ? '<div style="margin-top:6px;font-size:12px">点击下方"+ 新增文物"添加第一件</div>'
        : '<div style="margin-top:6px;font-size:12px">可开启编辑模式添加文物</div>');
    grid.appendChild(empty);
  } else {
    filtered.forEach(function(artifact, idx) {
      var card = createArtifactCard(artifact, idx * 30);
      grid.appendChild(card);
    });
  }

  // 编辑模式：新增按钮
  if (appState.editMode) {
    var addBtn = document.createElement('button');
    addBtn.className = 'add-artifact-btn';
    addBtn.innerHTML = '<span class="add-icon">+</span><span>新增文物</span>';
    addBtn.onclick = function() {
      openEditModal(null, appState.activePeriodId, appState.activeDynastyId);
    };
    grid.appendChild(addBtn);
  }
}

function createArtifactCard(artifact, delay) {
  var card = document.createElement('div');
  card.className = 'artifact-card' + (artifact.id === appState.activeArtifactId ? ' active-card' : '');
  card.style.animationDelay = delay + 'ms';

  // 星标
  if (artifact.isHighlight) {
    card.innerHTML += '<span class="highlight-star">⭐</span>';
  }

  // 编辑操作按钮（编辑模式）
  card.innerHTML +=
    '<div class="card-edit-actions">' +
      '<button class="card-action-btn card-edit-btn" title="编辑" onclick="event.stopPropagation();openEditModal(\'' + artifact.id + '\',\'' + appState.activePeriodId + '\',\'' + appState.activeDynastyId + '\')">✎</button>' +
      '<button class="card-action-btn card-delete-btn" title="删除" onclick="event.stopPropagation();confirmDeleteArtifact(\'' + artifact.id + '\',\'' + appState.activePeriodId + '\',\'' + appState.activeDynastyId + '\')">✕</button>' +
    '</div>';

  // 图片
  if (artifact.imageUrl) {
    card.innerHTML +=
      '<img class="card-image" src="' + escHtml(artifact.imageUrl) + '" alt="' + escHtml(artifact.name) + '" ' +
      'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
      '<div class="card-image-placeholder" style="display:none">' +
        '<span class="placeholder-icon">⊕</span>' +
        '<span class="placeholder-cat">' + escHtml(artifact.category) + '</span>' +
      '</div>';
  } else {
    card.innerHTML +=
      '<div class="card-image-placeholder">' +
        '<span class="placeholder-icon">⊕</span>' +
        '<span class="placeholder-cat">' + escHtml(artifact.category) + '</span>' +
      '</div>';
  }

  // 内容
  card.innerHTML +=
    '<div class="card-body">' +
      '<div class="card-meta">' +
        '<div class="card-name">' + escHtml(artifact.name) + '</div>' +
        '<span class="card-cat-tag">' + escHtml(artifact.category) + '</span>' +
      '</div>' +
      '<div class="card-date">' + escHtml(artifact.exactDate || '') + '</div>' +
      '<div class="card-intro">' + escHtml(artifact.intro || '') + '</div>' +
    '</div>';

  card.onclick = function() {
    openDrawer(artifact);
  };

  return card;
}

// ── 详情抽屉 ──────────────────────────

function openDrawer(artifact) {
  appState.activeArtifactId = artifact.id;

  var modal = document.getElementById('detailModal');
  var content = document.getElementById('drawerContent');

  content.innerHTML = buildDrawerHTML(artifact);

  modal.classList.remove('hidden');
  setTimeout(function() { modal.classList.add('open'); }, 10);
}

function buildDrawerHTML(artifact) {
  var html = '';

  // 标题栏
  html +=
    '<div class="drawer-header">' +
      '<div class="drawer-title-block">' +
        '<div class="drawer-name">' + escHtml(artifact.name) + (artifact.isHighlight ? ' <span style="color:var(--color-highlight)">⭐</span>' : '') + '</div>' +
        '<div class="drawer-meta">' +
          '<span class="drawer-tag cat-tag">' + escHtml(artifact.category) + '</span>' +
          '<span class="drawer-tag">' + escHtml(artifact.exactDate || '') + '</span>' +
        '</div>' +
      '</div>' +
      '<button class="drawer-close" onclick="closeDrawer()">✕</button>' +
    '</div>';

  // 图片
  if (artifact.imageUrl) {
    html +=
      '<img class="drawer-image" src="' + escHtml(artifact.imageUrl) + '" alt="' + escHtml(artifact.name) + '" ' +
      'onerror="this.outerHTML=\'<div class=\\"drawer-image-placeholder\\">⊕</div>\'">';
  } else {
    html += '<div class="drawer-image-placeholder">⊕</div>';
  }

  // 基础信息
  html +=
    '<div class="drawer-section">' +
      '<div class="drawer-section-title">基础信息</div>' +
      '<table class="info-table">' +
        infoRow('用途', artifact.usage) +
        infoRow('尺寸', artifact.dimensions) +
        infoRow('出土地', artifact.excavationSite) +
        infoRow('年代', artifact.exactDate) +
      '</table>' +
    '</div>';

  // 科普介绍
  if (artifact.intro) {
    html +=
      '<div class="drawer-section">' +
        '<div class="drawer-section-title">科普介绍</div>' +
        '<div class="drawer-intro">' + escHtml(artifact.intro) + '</div>' +
      '</div>';
  }

  // 亮点
  if (artifact.highlights && artifact.highlights.length > 0) {
    html +=
      '<div class="drawer-section">' +
        '<div class="drawer-section-title">亮点 · 冷知识</div>' +
        '<ul class="highlights-list">';
    artifact.highlights.forEach(function(h) {
      html +=
        '<li><span class="highlight-dot">✦</span><span>' + escHtml(h) + '</span></li>';
    });
    html += '</ul></div>';
  }

  // 标签
  if (artifact.tags && artifact.tags.length > 0) {
    html +=
      '<div class="drawer-section">' +
        '<div class="drawer-section-title">标签</div>' +
        '<div class="drawer-tags">';
    artifact.tags.forEach(function(t) {
      html += '<span class="drawer-artifact-tag">' + escHtml(t) + '</span>';
    });
    html += '</div></div>';
  }

  // 编辑备注（仅编辑模式）
  if (appState.editMode && artifact.notes) {
    html +=
      '<div class="drawer-section">' +
        '<div class="drawer-notes-label">✎ 编辑笔记</div>' +
        '<div class="drawer-notes">' + escHtml(artifact.notes) + '</div>' +
      '</div>';
  }

  return html;
}

function infoRow(label, value) {
  if (!value) return '';
  return '<tr><td>' + label + '</td><td>' + escHtml(value) + '</td></tr>';
}

function closeDrawer() {
  appState.activeArtifactId = null;
  var modal = document.getElementById('detailModal');
  modal.classList.remove('open');
  setTimeout(function() { modal.classList.add('hidden'); }, 200);
}

// ── 工具函数 ──────────────────────────

function getPeriodById(periodId) {
  return appState.data.periods.find(function(p) { return p.id === periodId; });
}

function getDynastyById(periodId, dynastyId) {
  var p = getPeriodById(periodId);
  if (!p) return null;
  return p.dynasties.find(function(d) { return d.id === dynastyId; });
}

function getArtifactById(periodId, dynastyId, artifactId) {
  var d = getDynastyById(periodId, dynastyId);
  if (!d) return null;
  return d.artifacts.find(function(a) { return a.id === artifactId; });
}

function getPeriodColor(periodId) {
  var map = {
    sprout: '#8B7355',
    growth: '#A0845C',
    peak: '#B8860B',
    transition: '#4A7A6A',
    second_peak: '#5C7A9E',
    fusion: '#7A6E8A',
    revival: '#8E7A6B',
    dian: '#3A7060'
  };
  return map[periodId] || '#666';
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateId(name) {
  return 'artifact_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
}

// ── 启动 ──────────────────────────────
window.addEventListener('DOMContentLoaded', init);
