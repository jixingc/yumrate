// ════════════════════════════════════════════
// 上博青铜馆学习网站 — 编辑功能
// ════════════════════════════════════════════

// ── Supabase 图片上传 ──────────────────────
var _supabase = null;
function getSupabase() {
  if (!_supabase && window.supabase) {
    _supabase = window.supabase.createClient(
      'https://grynbfymudhbilcknwdv.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyeW5iZnltdWRoYmlsY2tud2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzY4MTEsImV4cCI6MjA5MjUxMjgxMX0.tfDk4jVVgzd7Bj6jFtZaqDM4VaIsJlP9KCvjJ0VQlf4'
    );
  }
  return _supabase;
}

function uploadLocalImage(input) {
  var file = input.files[0];
  if (!file) return;

  var sb = getSupabase();
  if (!sb) {
    alert('图片服务暂不可用，请粘贴图片网址代替。');
    return;
  }

  var label = document.getElementById('uploadBtnLabel');
  label.textContent = '上传中…';

  // 用 Canvas 压缩图片（长边 ≤ 1200px）
  var img = new Image();
  var reader = new FileReader();
  reader.onload = function(e) {
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var maxSide = 1200;
      var w = img.width, h = img.height;
      if (w > maxSide || h > maxSide) {
        if (w > h) { h = Math.round(h * maxSide / w); w = maxSide; }
        else { w = Math.round(w * maxSide / h); h = maxSide; }
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);

      canvas.toBlob(function(blob) {
        var fileName = 'museum_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6) + '.jpg';
        sb.storage.from('images').upload(fileName, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        }).then(function(result) {
          if (result.error) {
            alert('上传失败：' + result.error.message);
            label.textContent = '⬆ 上传本地图片';
            return;
          }
          var pub = sb.storage.from('images').getPublicUrl(fileName);
          var url = pub.data.publicUrl;
          document.getElementById('f_imageUrl').value = url;
          previewImage(url);
          label.textContent = '✓ 上传成功';
          setTimeout(function() { label.textContent = '⬆ 上传本地图片'; }, 2000);
          input.value = '';
        });
      }, 'image/jpeg', 0.85);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── 编辑模式开关 ──────────────────────────

function toggleEditMode() {
  appState.editMode = !appState.editMode;

  var btn = document.getElementById('editToggle');
  var banner = document.getElementById('editBanner');

  if (appState.editMode) {
    document.body.classList.add('edit-active');
    btn.classList.add('active');
    btn.innerHTML = '<span class="edit-icon">✎</span> 退出编辑';
    banner.classList.remove('hidden');
  } else {
    document.body.classList.remove('edit-active');
    btn.classList.remove('active');
    btn.innerHTML = '<span class="edit-icon">✎</span> 编辑模式';
    banner.classList.add('hidden');
  }

  // 重新渲染当前朝代（显示/隐藏编辑按钮）
  var dynasty = getDynastyById(appState.activePeriodId, appState.activeDynastyId);
  if (dynasty) {
    renderArtifacts(dynasty, appState.activeCategory);
  }
}

// ── 编辑模态框 ──────────────────────────

function openEditModal(artifactId, periodId, dynastyId) {
  var modal = document.getElementById('editModal');
  var titleEl = document.getElementById('modalTitle');

  document.getElementById('f_periodId').value = periodId;
  document.getElementById('f_dynastyId').value = dynastyId;

  if (artifactId) {
    // 编辑已有文物
    titleEl.textContent = '编辑文物';
    var artifact = getArtifactById(periodId, dynastyId, artifactId);
    if (!artifact) return;

    document.getElementById('f_id').value = artifact.id;
    document.getElementById('f_name').value = artifact.name || '';
    document.getElementById('f_category').value = artifact.category || '';
    document.getElementById('f_imageUrl').value = artifact.imageUrl || '';
    document.getElementById('f_usage').value = artifact.usage || '';
    document.getElementById('f_exactDate').value = artifact.exactDate || '';
    document.getElementById('f_dimensions').value = artifact.dimensions || '';
    document.getElementById('f_excavationSite').value = artifact.excavationSite || '';
    document.getElementById('f_intro').value = artifact.intro || '';
    document.getElementById('f_highlights').value = (artifact.highlights || []).join('\n');
    document.getElementById('f_isHighlight').checked = !!artifact.isHighlight;
    document.getElementById('f_tags').value = (artifact.tags || []).join(',');
    document.getElementById('f_notes').value = artifact.notes || '';

    previewImage(artifact.imageUrl || '');
  } else {
    // 新增文物
    titleEl.textContent = '新增文物';
    document.getElementById('editForm').reset();
    document.getElementById('f_id').value = '';
    previewImage('');
  }

  modal.classList.remove('hidden');
  setTimeout(function() { modal.classList.add('open'); }, 10);
}

function closeEditModal() {
  var modal = document.getElementById('editModal');
  modal.classList.remove('open');
  setTimeout(function() { modal.classList.add('hidden'); }, 200);
}

// ── 保存文物 ──────────────────────────

function saveArtifact(event) {
  event.preventDefault();

  var periodId = document.getElementById('f_periodId').value;
  var dynastyId = document.getElementById('f_dynastyId').value;
  var artifactId = document.getElementById('f_id').value;

  var highlightsRaw = document.getElementById('f_highlights').value;
  var highlights = highlightsRaw
    .split('\n')
    .map(function(s) { return s.trim(); })
    .filter(function(s) { return s.length > 0; });

  var tagsRaw = document.getElementById('f_tags').value;
  var tags = tagsRaw
    .split(',')
    .map(function(s) { return s.trim(); })
    .filter(function(s) { return s.length > 0; });

  var artifactData = {
    name: document.getElementById('f_name').value.trim(),
    category: document.getElementById('f_category').value,
    imageUrl: document.getElementById('f_imageUrl').value.trim(),
    usage: document.getElementById('f_usage').value.trim(),
    exactDate: document.getElementById('f_exactDate').value.trim(),
    dimensions: document.getElementById('f_dimensions').value.trim(),
    excavationSite: document.getElementById('f_excavationSite').value.trim(),
    intro: document.getElementById('f_intro').value.trim(),
    highlights: highlights,
    isHighlight: document.getElementById('f_isHighlight').checked,
    tags: tags,
    notes: document.getElementById('f_notes').value.trim()
  };

  var dynasty = getDynastyById(periodId, dynastyId);
  if (!dynasty) return;

  if (artifactId) {
    // 更新已有
    var idx = dynasty.artifacts.findIndex(function(a) { return a.id === artifactId; });
    if (idx !== -1) {
      artifactData.id = artifactId;
      dynasty.artifacts[idx] = artifactData;
    }
  } else {
    // 新增
    artifactData.id = generateId();
    if (!dynasty.artifacts) dynasty.artifacts = [];
    dynasty.artifacts.push(artifactData);
  }

  saveData();
  closeEditModal();

  // 刷新当前视图
  renderCategoryFilter(dynasty);
  renderArtifacts(dynasty, appState.activeCategory);
}

// ── 删除文物 ──────────────────────────

function confirmDeleteArtifact(artifactId, periodId, dynastyId) {
  var artifact = getArtifactById(periodId, dynastyId, artifactId);
  if (!artifact) return;

  openConfirm(
    '删除文物',
    '确定要删除《' + artifact.name + '》吗？此操作不可撤销。',
    function() {
      var dynasty = getDynastyById(periodId, dynastyId);
      if (!dynasty) return;
      dynasty.artifacts = dynasty.artifacts.filter(function(a) { return a.id !== artifactId; });
      saveData();
      // 关闭抽屉（如果打开的就是这件）
      if (appState.activeArtifactId === artifactId) closeDrawer();
      renderCategoryFilter(dynasty);
      renderArtifacts(dynasty, appState.activeCategory);
    }
  );
}

// ── 通用确认对话框 ──────────────────────────

var _confirmCallback = null;

function openConfirm(title, message, onOk) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMessage').textContent = message;
  _confirmCallback = onOk;

  var dialog = document.getElementById('confirmDialog');
  dialog.classList.remove('hidden');
  setTimeout(function() { dialog.classList.add('open'); }, 10);

  document.getElementById('confirmOkBtn').onclick = function() {
    closeConfirm();
    if (_confirmCallback) _confirmCallback();
  };
}

function closeConfirm() {
  var dialog = document.getElementById('confirmDialog');
  dialog.classList.remove('open');
  setTimeout(function() { dialog.classList.add('hidden'); }, 200);
  _confirmCallback = null;
}

// ── 图片预览 ──────────────────────────

function previewImage(url) {
  var thumb = document.getElementById('imagePreview');
  if (url && url.trim()) {
    thumb.innerHTML = '<img src="' + escHtml(url) + '" alt="预览" ' +
      'onerror="this.parentElement.innerHTML=\'<span class=\\"preview-fail\\">加载失败</span>\'">';
  } else {
    thumb.innerHTML = '';
  }
}

// ── 导出 JSON ──────────────────────────

function exportData() {
  var json = JSON.stringify(appState.data, null, 2);
  var blob = new Blob([json], { type: 'application/json' });
  var url = URL.createObjectURL(blob);

  var today = new Date().toISOString().slice(0, 10);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'sbm_bronze_' + today + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── 导入 JSON ──────────────────────────

function importData(input) {
  var file = input.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(e) {
    var text = e.target.result;
    var parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      alert('JSON 解析失败，请检查文件格式。\n' + err.message);
      input.value = '';
      return;
    }

    if (!parsed.periods || !Array.isArray(parsed.periods)) {
      alert('文件格式不正确：缺少 periods 字段。');
      input.value = '';
      return;
    }

    openConfirm(
      '导入数据',
      '将用导入的数据覆盖当前所有内容，确定继续吗？',
      function() {
        appState.data = parsed;
        saveData();
        input.value = '';
        location.reload();
      }
    );

    // 用户取消时也清空 input
    var origClose = closeConfirm;
    document.querySelector('#confirmDialog .btn-secondary').onclick = function() {
      origClose();
      input.value = '';
    };
  };
  reader.readAsText(file, 'UTF-8');
}

// ── 恢复默认 ──────────────────────────

function resetToDefault() {
  openConfirm(
    '恢复默认数据',
    '将清空所有本地修改，恢复到内置默认数据。确定继续吗？',
    function() {
      localStorage.removeItem('sbm_bronze_data');
      location.reload();
    }
  );
}
