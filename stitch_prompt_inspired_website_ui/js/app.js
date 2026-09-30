/**
 * Civic Waste Portal Main Application Controller
 * Handles routing, views, interactive forms, AI scan simulation,
 * live tracking, rewards redemption, admin console, and modals.
 */

// Toast notification utility
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconName = 'check_circle';
  let iconColor = 'text-primary-fixed';
  if (type === 'error') {
    iconName = 'error';
    iconColor = 'text-status-critical';
  } else if (type === 'warning') {
    iconName = 'warning';
    iconColor = 'text-alert-amber';
  } else if (type === 'info') {
    iconName = 'info';
    iconColor = 'text-status-progress';
  }

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-[22px]">${iconName}</span>
    <div class="flex-1 text-sm font-medium leading-tight">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-secondary-fixed-dim hover:text-white">
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Router & View Management
function navigateTo(viewId, params = {}) {
  // Hide all view sections
  const views = document.querySelectorAll('.app-view');
  views.forEach(v => v.classList.add('hidden'));

  // Target view
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const homeView = document.getElementById('view-home');
    if (homeView) homeView.classList.remove('hidden');
    viewId = 'home';
  }

  // Update hash
  if (window.location.hash.replace('#', '') !== viewId) {
    window.location.hash = viewId;
  }

  // Update active nav links
  document.querySelectorAll('[data-path]').forEach(link => {
    const path = link.getAttribute('data-path');
    if (path === viewId) {
      link.classList.add('active', 'text-primary', 'font-bold');
      link.classList.remove('text-on-surface-variant');
    } else {
      link.classList.remove('active', 'text-primary', 'font-bold');
      link.classList.add('text-on-surface-variant');
    }
  });

  // Mobile bottom bar active highlight
  document.querySelectorAll('[data-mobile-path]').forEach(btn => {
    const path = btn.getAttribute('data-mobile-path');
    if (path === viewId) {
      btn.classList.add('text-primary');
      btn.classList.remove('text-on-surface-variant');
    } else {
      btn.classList.remove('text-primary');
      btn.classList.add('text-on-surface-variant');
    }
  });

  // Lifecycle hooks per view
  if (viewId === 'home') {
    setTimeout(() => {
      initHomeRadarMap();
      if (homeMap) homeMap.invalidateSize();
    }, 150);
  } else if (viewId === 'report-waste') {
    setTimeout(() => {
      initReportLocationMap();
      if (reportMap) reportMap.invalidateSize();
    }, 150);
  } else if (viewId === 'track-complaint') {
    const ticketId = params.id || (window.wasteStore.complaints[0] ? window.wasteStore.complaints[0].id : null);
    renderTrackingView(ticketId);
    setTimeout(() => {
      if (trackMap) trackMap.invalidateSize();
    }, 150);
  } else if (viewId === 'green-karma-rewards') {
    renderRewardsView();
  } else if (viewId === 'admin-portal' || viewId === 'admin-dashboard') {
    renderAdminConsole();
  } else if (viewId === 'awareness-guide') {
    renderAwarenessGuide();
  } else if (viewId === 'login') {
    initLoginView(params.role || 'citizen');
  }
}

// Handle initial route on page load
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const parts = hash.split('?');
    const view = parts[0];
    const params = {};
    if (parts[1]) {
      new URLSearchParams(parts[1]).forEach((val, key) => params[key] = val);
    }
    navigateTo(view, params);
  } else {
    navigateTo('home');
  }
});

// Update Header Profile & Badges
function updateHeaderProfile() {
  const user = window.wasteStore.user;
  const balanceEl = document.getElementById('headerKarmaBalance');
  if (balanceEl) balanceEl.textContent = (user.karmaBalance || 0).toLocaleString();

  const userBtn = document.getElementById('headerUserBtn');
  const dropdownInfo = document.getElementById('dropdownUserProfileInfo');

  if (userBtn) {
    if (user && user.isLoggedIn) {
      const isAdmin = user.role === 'admin';
      const initial = (user.name || 'U').charAt(0);
      userBtn.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full ${isAdmin ? 'bg-alert-amber text-civic-navy-dark border border-amber-300' : 'bg-primary text-on-primary'} flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            ${isAdmin ? '<span class="material-symbols-outlined text-[18px]">shield_person</span>' : initial}
          </div>
          <div class="hidden sm:flex flex-col text-left leading-tight">
            <div class="flex items-center gap-1">
              <span class="font-bold text-xs text-civic-navy-dark truncate max-w-[110px]">${user.name}</span>
              <span class="px-1.5 py-0.2 rounded ${isAdmin ? 'bg-alert-amber-soft text-alert-amber font-extrabold' : 'bg-status-resolved-soft text-status-resolved font-bold'} text-[9px] uppercase">${isAdmin ? 'Officer' : 'Citizen'}</span>
            </div>
            <span class="text-[10px] text-on-surface-variant truncate max-w-[120px]">${isAdmin ? (user.designation || 'Zonal Officer') : (user.ward || 'Ward 28')}</span>
          </div>
          <span class="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
        </div>
      `;
    } else {
      userBtn.innerHTML = `
        <span class="material-symbols-outlined text-[18px]">login</span>
        <span class="font-bold text-xs">Sign In / Login</span>
      `;
    }
  }

  // Populate Dropdown Profile Info if container exists
  if (dropdownInfo) {
    if (user && user.isLoggedIn) {
      const isAdmin = user.role === 'admin';
      dropdownInfo.innerHTML = `
        <div class="flex items-center gap-3 pb-2 border-b border-surface-border">
          <div class="w-10 h-10 rounded-full ${isAdmin ? 'bg-alert-amber text-civic-navy-dark border border-amber-300' : 'bg-primary text-on-primary'} flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            ${isAdmin ? '<span class="material-symbols-outlined text-[22px]">shield_person</span>' : (user.name || 'U').charAt(0)}
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-bold text-sm text-civic-navy-dark truncate">${user.name}</span>
            <span class="text-[11px] text-on-surface-variant truncate">${isAdmin ? user.email : user.phone}</span>
            <span class="inline-block mt-0.5 px-2 py-0.5 rounded-full ${isAdmin ? 'bg-alert-amber-soft text-alert-amber' : 'bg-status-resolved-soft text-status-resolved'} text-[10px] font-bold self-start">
              ${isAdmin ? '🏛️ ULB Officer • ' + (user.zone || 'Zone 04') : '🌱 Citizen • ' + (user.ward || 'Ward 28')}
            </span>
          </div>
        </div>
      `;
    } else {
      dropdownInfo.innerHTML = `
        <div class="text-center py-2">
          <p class="text-xs text-on-surface-variant font-medium">You are browsing as Guest</p>
          <button onclick="navigateTo('login'); closeProfileDropdown();" class="mt-2 w-full py-2 bg-primary hover:bg-primary-container text-white rounded-lg font-bold text-xs">
            Sign In as Citizen or Admin
          </button>
        </div>
      `;
    }
  }

  // Update Free Pickup Quota in pickup page
  const quotaEl = document.getElementById('quotaBadge');
  if (quotaEl) {
    quotaEl.textContent = `${user.freePickupsRemaining || 0} of 2 Free`;
  }
}

// ================= AI VISION PREVIEW SCANNER =================
function handleImageSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    runAiScanSimulation(e.target.result);
  };
  reader.readAsDataURL(file);
}

function runAiScanSimulation(imageSrc) {
  const previewImg = document.getElementById('aiPreviewImage');
  const aiBox = document.getElementById('aiPreviewBox');
  const laser = document.getElementById('aiScanLaser');
  const statusLabel = document.getElementById('aiScanStatusLabel');
  const confLabel = document.getElementById('aiConfidenceScore');
  const detectedCategory = document.getElementById('aiDetectedCategory');
  const volumeTag = document.getElementById('aiVolumeTag');
  const decayTag = document.getElementById('aiDecayTag');

  if (previewImg) previewImg.src = imageSrc;
  if (aiBox) aiBox.classList.remove('hidden');
  if (laser) laser.classList.remove('hidden');

  if (statusLabel) statusLabel.innerHTML = `
    <span class="material-symbols-outlined text-[16px] animate-spin">sync</span>
    <span>Analyzing Geo-Spatial &amp; Volumetric Waste Vectors...</span>
  `;

  setTimeout(() => {
    if (laser) laser.classList.add('hidden');
    if (statusLabel) statusLabel.innerHTML = `
      <span class="material-symbols-outlined text-[16px] text-status-resolved">psychology</span>
      <span class="text-status-resolved font-bold">AI Vision Scan Complete (Verified)</span>
    `;
    if (confLabel) confLabel.textContent = "Confidence: 96.8%";
    if (detectedCategory) detectedCategory.textContent = "Detected: Overflowing Public Bin & Spillover";
    if (volumeTag) volumeTag.textContent = "Volume: High (~2.4 m³)";
    if (decayTag) decayTag.textContent = "Organic Decay Risk: Moderate";

    showToast("AI Vision Scan Complete: Overflowing Bin Identified (96.8% Confidence)", "info");
  }, 1200);
}

function pickSampleImage(type) {
  let sampleUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuADdUw6ZLKowCGVxMj0mLFHf1vjVq5V6M_dXw5gL0rGIn5WY1o2b8HDcqURN0-Qk22pqprSr822ZLDstKNpk9RwtYYnu4i7FEgAjTTiRoPgy0FZnsmwFMOG-bLzM6rXX_9rag_SMd3NVtr_FEkDT-VPc7IDZGFRU9xopnFlvLwvecJoRnLPA_Frh-56EfdwPSn4--LfTPklLE5RbBKE2k8PFHifwb5bavxmYefXXk3SehG55pPOBM-r";
  if (type === 'market') {
    sampleUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDHr2G2k-86qIiXLMqBpWxAroFmYNHE09M5vwze30olj6sExdAu0pxF4by19ojGbN7c6jbLIlmmR9SGp1ek7aKH9zd_cBRukHMRasbfnN3_csvGdWtgUz5btgpAgAvUnXCSgkxMoewNJcIO8rO773nYSXpX33Yw7igTAOYXRNf0OVLVu7Z9tz7ECEG5KKfYU3x4hP4SdiAQdpoCKeOX-vbnx_4pWcXWN2Fd0Vs3H5Sw3BeUM-Z7sIK6";
  }
  runAiScanSimulation(sampleUrl);
}

// GPS Location recalibration
function refreshGeoLocation() {
  const locDisplay = document.getElementById('reportWardDisplay');
  const locBadge = document.getElementById('gpsAccuracyBadge');
  if (locDisplay) {
    locDisplay.innerHTML = `<span class="animate-pulse">Locking GPS satellites...</span>`;
  }
  setTimeout(() => {
    const lat = 28.6139;
    const lng = 77.2090;
    if (locDisplay) {
      locDisplay.innerHTML = `<span class="material-symbols-outlined text-primary text-[18px]">location_on</span> Sector 14, Main Avenue, Urban Ward 28, New Delhi (28.6139° N, 77.2090° E)`;
    }
    if (locBadge) {
      locBadge.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-status-resolved animate-ping"></span> GPS Accuracy: ±2.4 meters (Lock Verified)`;
    }
    if (reportMap && reportMarker) {
      reportMarker.setLatLng([lat, lng]);
      if (reportAccuracyCircle) reportAccuracyCircle.setLatLng([lat, lng]);
      reportMap.flyTo([lat, lng], 15, { duration: 1.2 });
    }
    showToast("GPS Recalibrated: High Precision Satellite Fix (Ward 28)", "success");
  }, 900);
}

// ================= INTERACTIVE LEAFLET MAPS =================
let homeMap = null;
let reportMap = null;
let trackMap = null;
let reportMarker = null;
let reportAccuracyCircle = null;

function initHomeRadarMap() {
  const container = document.getElementById('homeRadarMap');
  if (!container) return;

  if (typeof L === 'undefined') {
    setTimeout(initHomeRadarMap, 200);
    return;
  }

  if (homeMap) {
    setTimeout(() => {
      if (homeMap) homeMap.invalidateSize();
    }, 100);
    return;
  }

  if (container._leaflet_id) {
    delete container._leaflet_id;
  }

  try {
    homeMap = L.map('homeRadarMap', {
      center: [28.6515, 77.1910],
      zoom: 14,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(homeMap);

    // Complaint 1: #SBM-2026-9812 (In Progress)
    const pin1Html = `
      <div class="map-badge-marker" style="background:#0A1B2C;">
        <span class="w-2 h-2 rounded-full bg-status-progress animate-ping"></span>
        #SBM-2026-9812 (In Progress)
      </div>
    `;
    const icon1 = L.divIcon({ html: pin1Html, className: '', iconSize: [180, 28], iconAnchor: [90, 14] });
    const marker1 = L.marker([28.6535, 77.1960], { icon: icon1 }).addTo(homeMap);
    marker1.bindPopup(`
      <div class="text-xs">
        <div class="font-bold text-sm text-civic-navy-dark">#SBM-2026-9812</div>
        <p class="text-on-surface-variant my-1">Overflowing Public Bin &amp; Spillover near Community Park</p>
        <span class="inline-block px-2 py-0.5 rounded-full bg-status-progress-soft text-status-progress font-bold text-[10px]">Van DL-1VC-8402 en route (ETA 14 mins)</span>
        <button onclick="navigateTo('track-complaint', {id: 'SBM-2026-9812'})" class="mt-2.5 w-full py-1.5 px-3 bg-primary text-white rounded-lg font-bold text-xs hover:bg-primary-container transition-all">
          Track Live Status &rarr;
        </button>
      </div>
    `);

    // Complaint 2: #SBM-2026-9799 (Resolved)
    const pin2Html = `
      <div class="map-badge-marker" style="background:#15803D;">
        <span class="material-symbols-outlined text-[13px]">check</span>
        #SBM-2026-9799 (Resolved)
      </div>
    `;
    const icon2 = L.divIcon({ html: pin2Html, className: '', iconSize: [160, 28], iconAnchor: [80, 14] });
    const marker2 = L.marker([28.6475, 77.1845], { icon: icon2 }).addTo(homeMap);
    marker2.bindPopup(`
      <div class="text-xs">
        <div class="font-bold text-sm text-status-resolved">#SBM-2026-9799 (Cleaned)</div>
        <p class="text-on-surface-variant my-1">Kailash Market Gate 2 • Verified Cleaned</p>
        <span class="inline-block px-2 py-0.5 rounded-full bg-status-resolved-soft text-status-resolved font-bold text-[10px]">AI Photo Verified Resolution (+25 Pts)</span>
      </div>
    `);

    // Complaint 3: #SBM-2026-9804 (Pending / Triage)
    const pin3Html = `
      <div class="map-badge-marker" style="background:#D97706;">
        <span class="w-2 h-2 rounded-full bg-white"></span>
        #SBM-2026-9804 (Pending)
      </div>
    `;
    const icon3 = L.divIcon({ html: pin3Html, className: '', iconSize: [150, 28], iconAnchor: [75, 14] });
    const marker3 = L.marker([28.6580, 77.1810], { icon: icon3 }).addTo(homeMap);
    marker3.bindPopup(`
      <div class="text-xs">
        <div class="font-bold text-sm text-alert-amber">#SBM-2026-9804 (Pending Triage)</div>
        <p class="text-on-surface-variant my-1">C&amp;D Debris on Ring Road Footway</p>
        <span class="inline-block px-2 py-0.5 rounded-full bg-alert-amber-soft text-alert-amber font-bold text-[10px]">High Severity • Assigned Loader Van</span>
      </div>
    `);

    // Vehicle Pin: DL-1VC-8402 (EV Tipper)
    const vehicleHtml = `
      <div class="map-vehicle-marker" title="DL-1VC-8402 (EV Tipper)">
        <span class="material-symbols-outlined text-[20px]">local_shipping</span>
      </div>
    `;
    const vehicleIcon = L.divIcon({ html: vehicleHtml, className: '', iconSize: [36, 36], iconAnchor: [18, 18] });
    const vehicleMarker = L.marker([28.6548, 77.1925], { icon: vehicleIcon }).addTo(homeMap);
    vehicleMarker.bindPopup(`
      <div class="text-xs">
        <div class="font-bold text-sm text-civic-navy-dark">EV Tipper Truck DL-1VC-8402</div>
        <div class="text-on-surface-variant my-1">Driver: Ramesh Kumar • Battery: 82%</div>
        <span class="text-status-progress font-bold">Speed: 24 km/h • Routing to #SBM-2026-9812</span>
      </div>
    `);

    // Density circles
    L.circle([28.6475, 77.1845], { radius: 250, color: '#15803D', fillColor: '#dcfce7', fillOpacity: 0.3 }).addTo(homeMap);
    L.circle([28.6535, 77.1960], { radius: 250, color: '#D97706', fillColor: '#fef3c7', fillOpacity: 0.3 }).addTo(homeMap);
    L.circle([28.6580, 77.1810], { radius: 220, color: '#DC2626', fillColor: '#fee2e2', fillOpacity: 0.35 }).addTo(homeMap);

    // Initial resize calculation
    setTimeout(() => {
      if (homeMap) homeMap.invalidateSize();
    }, 250);

  } catch (e) {
    console.warn("Leaflet home map init error", e);
  }
}

function resetHomeMap() {
  if (homeMap) {
    homeMap.setView([28.6515, 77.1910], 14, { animate: true });
    homeMap.invalidateSize();
    showToast("Map view recentered on Ward 28, Karol Bagh", "info");
  } else {
    initHomeRadarMap();
  }
}

function initReportLocationMap() {
  const container = document.getElementById('reportLocationMap');
  if (!container) return;

  if (typeof L === 'undefined') {
    setTimeout(initReportLocationMap, 200);
    return;
  }

  if (reportMap) {
    setTimeout(() => {
      if (reportMap) reportMap.invalidateSize();
    }, 100);
    return;
  }

  if (container._leaflet_id) {
    delete container._leaflet_id;
  }

  try {
    const lat = 28.6139;
    const lng = 77.2090;

    reportMap = L.map('reportLocationMap', {
      center: [lat, lng],
      zoom: 15,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(reportMap);

    const pinHtml = `
      <div class="map-badge-marker" style="background:#15803D;">
        <span class="material-symbols-outlined text-[14px]">pin_drop</span>
        Pinned Location (Drag to Move)
      </div>
    `;
    const pinIcon = L.divIcon({ html: pinHtml, className: '', iconSize: [180, 28], iconAnchor: [90, 14] });

    reportMarker = L.marker([lat, lng], { draggable: true, icon: pinIcon }).addTo(reportMap);
    reportAccuracyCircle = L.circle([lat, lng], { radius: 30, color: '#15803D', fillColor: '#dcfce7', fillOpacity: 0.35 }).addTo(reportMap);

    function updateMarkerPos(newLat, newLng) {
      reportMarker.setLatLng([newLat, newLng]);
      if (reportAccuracyCircle) reportAccuracyCircle.setLatLng([newLat, newLng]);
      const disp = document.getElementById('reportWardDisplay');
      if (disp) {
        disp.innerHTML = `<span class="material-symbols-outlined text-primary text-[18px]">location_on</span> Ward 28 Pin: ${newLat.toFixed(4)}° N, ${newLng.toFixed(4)}° E (Updated)`;
      }
      showToast(`Location updated: ${newLat.toFixed(4)}° N, ${newLng.toFixed(4)}° E`, 'info', 2000);
    }

    reportMarker.on('dragend', function(e) {
      const pos = e.target.getLatLng();
      updateMarkerPos(pos.lat, pos.lng);
    });

    reportMap.on('click', function(e) {
      updateMarkerPos(e.latlng.lat, e.latlng.lng);
    });

    setTimeout(() => {
      if (reportMap) reportMap.invalidateSize();
    }, 250);

  } catch (e) {
    console.warn("Leaflet report map init error", e);
  }
}

function initTrackVehicleMap(complaint) {
  const container = document.getElementById('trackVehicleMap');
  if (!container) return;

  if (typeof L === 'undefined') {
    setTimeout(() => initTrackVehicleMap(complaint), 200);
    return;
  }

  const comp = complaint || window.wasteStore.complaints[0];
  if (!comp) return;

  const hotLat = comp.latitude || 28.6139;
  const hotLng = comp.longitude || 77.2090;
  const truckLat = hotLat + 0.009;
  const truckLng = hotLng + 0.007;

  try {
    if (trackMap) {
      try {
        trackMap.remove();
      } catch (err) {}
      trackMap = null;
    }

    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    trackMap = L.map('trackVehicleMap', {
      center: [(hotLat + truckLat) / 2, (hotLng + truckLng) / 2],
      zoom: 14,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(trackMap);

    // Hotspot marker
    const isResolved = comp.status === 'resolved';
    const hotHtml = `
      <div class="map-badge-marker" style="background:${isResolved ? '#15803D' : '#DC2626'};">
        <span class="material-symbols-outlined text-[13px]">${isResolved ? 'check' : 'warning'}</span>
        #${comp.id} ${isResolved ? 'Cleaned' : 'Hotspot'}
      </div>
    `;
    const hotIcon = L.divIcon({ html: hotHtml, className: '', iconSize: [160, 28], iconAnchor: [80, 14] });
    L.marker([hotLat, hotLng], { icon: hotIcon }).addTo(trackMap).bindPopup(`<b>${comp.title}</b><br/>${comp.ward}`);

    // Vehicle marker
    const truckHtml = `
      <div class="map-vehicle-marker" title="${comp.assignedVehicle}">
        <span class="material-symbols-outlined text-[18px]">local_shipping</span>
      </div>
    `;
    const truckIcon = L.divIcon({ html: truckHtml, className: '', iconSize: [36, 36], iconAnchor: [18, 18] });
    L.marker([truckLat, truckLng], { icon: truckIcon }).addTo(trackMap).bindPopup(`<b>${comp.assignedVehicle}</b><br/>Driver: ${comp.assignedDriver}<br/>ETA: ${comp.driverEta}`);

    // Polyline route
    const routeCoords = [
      [truckLat, truckLng],
      [(hotLat + truckLat) / 2 + 0.001, (hotLng + truckLng) / 2],
      [hotLat, hotLng]
    ];
    const poly = L.polyline(routeCoords, { color: '#0284C7', weight: 4, dashArray: '6, 8' }).addTo(trackMap);
    trackMap.fitBounds(poly.getBounds(), { padding: [25, 25] });

    setTimeout(() => {
      if (trackMap) trackMap.invalidateSize();
    }, 250);

  } catch (e) {
    console.warn("Leaflet track map init error", e);
  }
}

// ================= FORM SUBMISSIONS =================
function handleReportSubmit(e) {
  if (e) e.preventDefault();

  const categoryInput = document.querySelector('input[name="reportWasteCat"]:checked');
  const category = categoryInput ? categoryInput.value : "Overflowing Public Bin";
  const desc = document.getElementById('reportDescription') ? document.getElementById('reportDescription').value : "";
  const landmark = document.getElementById('reportLandmark') ? document.getElementById('reportLandmark').value : "Near Community Park";
  const previewImg = document.getElementById('aiPreviewImage');
  const photoUrl = previewImg ? previewImg.src : null;

  const newTicket = window.wasteStore.addComplaint({
    category: category,
    title: `${category} near ${landmark}`,
    ward: `Sector 14, ${landmark}, Urban Ward 28, New Delhi`,
    severity: "High",
    photoUrl: photoUrl
  });

  // Show Success Modal
  const modal = document.getElementById('reportSuccessModal');
  const ticketIdEl = document.getElementById('successTicketId');
  if (ticketIdEl) ticketIdEl.textContent = `#${newTicket.id}`;
  if (modal) modal.classList.remove('hidden');

  showToast(`Grievance #${newTicket.id} Logged! +25 Green Karma awarded to your civic wallet`, "success");
  updateHeaderProfile();
}

function handlePickupSubmit(e) {
  if (e) e.preventDefault();

  const catInput = document.querySelector('input[name="waste_category"]:checked');
  const category = catInput ? (catInput.value === 'ewaste' ? 'E-Waste' : catInput.value === 'bulky' ? 'Bulky Furniture' : 'C&D Debris') : 'E-Waste';
  const slotInput = document.querySelector('input[name="pickup_slot"]:checked');
  const slot = slotInput ? slotInput.value : "Tomorrow Morning (09:00 AM - 12:00 PM)";
  const address = document.getElementById('pickupAddress') ? document.getElementById('pickupAddress').value : "Flat 402, Block B, Sector 14";
  const items = document.getElementById('pickupItemsDesc') ? document.getElementById('pickupItemsDesc').value : "Household recyclable materials";

  const newPickup = window.wasteStore.addPickup({
    category: category,
    slot: slot,
    address: address,
    items: items
  });

  // Show Pickup Receipt Modal
  const receiptModal = document.getElementById('pickupReceiptModal');
  const refEl = document.getElementById('receiptRefId');
  const catEl = document.getElementById('receiptCategory');
  const slotEl = document.getElementById('receiptSlot');
  const addrEl = document.getElementById('receiptAddress');

  if (refEl) refEl.textContent = `#${newPickup.id}`;
  if (catEl) catEl.textContent = newPickup.category;
  if (slotEl) slotEl.textContent = newPickup.slot;
  if (addrEl) addrEl.textContent = newPickup.address;

  if (receiptModal) receiptModal.classList.remove('hidden');

  showToast(`Doorstep Pickup #${newPickup.id} Scheduled! +35 Green Karma awarded.`, "success");
  updateHeaderProfile();
}

// ================= COMPLAINT TRACKING =================
function renderTrackingView(ticketId) {
  let complaint = window.wasteStore.getComplaint(ticketId);
  if (!complaint) {
    complaint = window.wasteStore.complaints[0];
  }
  if (!complaint) return;

  const ticketInput = document.getElementById('trackingSearchInput');
  if (ticketInput) ticketInput.value = `#${complaint.id}`;

  const headerTicketId = document.getElementById('trackTicketBadge');
  if (headerTicketId) headerTicketId.textContent = `#${complaint.id}`;

  const titleEl = document.getElementById('trackTitle');
  if (titleEl) titleEl.textContent = complaint.title;

  const locEl = document.getElementById('trackLocation');
  if (locEl) locEl.textContent = complaint.ward;

  const timeEl = document.getElementById('trackLoggedTime');
  if (timeEl) timeEl.textContent = `Logged: ${complaint.loggedAt}`;

  const categoryEl = document.getElementById('trackCategory');
  if (categoryEl) categoryEl.textContent = `Category: ${complaint.category}`;

  const slaDeadline = document.getElementById('trackSlaDeadline');
  if (slaDeadline) slaDeadline.textContent = complaint.slaDeadline;

  const slaRemaining = document.getElementById('trackSlaRemaining');
  if (slaRemaining) slaRemaining.textContent = complaint.slaRemaining;

  const statusPill = document.getElementById('trackStatusPill');
  if (statusPill) {
    statusPill.textContent = complaint.statusLabel;
    if (complaint.status === 'resolved') {
      statusPill.className = "inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-status-resolved-soft text-status-resolved font-label-md text-label-md";
    } else if (complaint.status === 'in_progress') {
      statusPill.className = "inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-status-progress-soft text-status-progress font-label-md text-label-md";
    } else {
      statusPill.className = "inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-alert-amber-soft text-alert-amber font-label-md text-label-md";
    }
  }

  // Driver and vehicle info
  const vehicleEl = document.getElementById('trackVehicleNo');
  if (vehicleEl) vehicleEl.textContent = complaint.assignedVehicle;

  const driverEl = document.getElementById('trackDriverName');
  if (driverEl) driverEl.textContent = complaint.assignedDriver;

  const etaEl = document.getElementById('trackEta');
  if (etaEl) etaEl.textContent = complaint.driverEta;

  // Before & After images
  const beforeImg = document.getElementById('trackBeforeImg');
  if (beforeImg && complaint.beforeImage) beforeImg.src = complaint.beforeImage;

  const afterImg = document.getElementById('trackAfterImg');
  const afterBox = document.getElementById('trackAfterBox');
  if (afterImg && complaint.afterImage) {
    afterImg.src = complaint.afterImage;
    if (afterBox) afterBox.classList.remove('hidden');
  } else if (afterBox && complaint.status !== 'resolved') {
    afterBox.classList.add('hidden');
  }

  // Render 4-step Timeline Stepper
  const stepperContainer = document.getElementById('trackTimelineStepper');
  if (stepperContainer && complaint.history) {
    stepperContainer.innerHTML = '';
    complaint.history.forEach((h, index) => {
      const isLast = index === complaint.history.length - 1;
      const stepHtml = `
        <div class="relative flex items-start gap-space-md">
          <div class="relative z-10 w-8 h-8 rounded-full ${h.done ? 'bg-status-resolved text-on-primary' : 'bg-surface-container text-on-surface-variant'} flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-[18px]">${h.done ? 'check' : 'hourglass_empty'}</span>
          </div>
          <div class="flex-1 ${h.done ? 'bg-surface-container-low' : 'bg-surface-canvas'} rounded-lg p-space-md flex flex-col gap-space-xs">
            <div class="flex flex-wrap items-center justify-between gap-1">
              <span class="font-title-md text-title-md ${h.done ? 'text-status-resolved' : 'text-on-surface-variant'} font-bold">
                ${index + 1}. ${h.title}
              </span>
              <span class="font-label-sm text-label-sm text-secondary">${h.time}</span>
            </div>
            <p class="font-body-md text-body-md text-civic-navy-dark">${h.desc}</p>
            ${h.badge ? `
              <div class="flex items-center gap-space-sm mt-space-xs font-label-sm text-label-sm text-secondary">
                <span class="inline-flex items-center gap-1 bg-surface-card px-space-xs py-0.5 rounded text-primary font-medium">
                  <span class="material-symbols-outlined text-[14px]">info</span> ${h.badge}
                </span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
      stepperContainer.insertAdjacentHTML('beforeend', stepHtml);
    });
  }

  // Render Recent Complaint Chips
  const chipsContainer = document.getElementById('recentTicketChips');
  if (chipsContainer) {
    chipsContainer.innerHTML = '';
    window.wasteStore.complaints.slice(0, 4).forEach(c => {
      const active = c.id === complaint.id;
      const chip = document.createElement('button');
      chip.className = `px-3 py-1 rounded-full text-xs font-medium transition-all ${
        active 
          ? 'bg-primary text-on-primary font-bold shadow-sm' 
          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
      }`;
      chip.textContent = `#${c.id} (${c.statusLabel})`;
      chip.onclick = () => renderTrackingView(c.id);
      chipsContainer.appendChild(chip);
    });
  }

  // Initialize / update live GPS Vehicle & Hotspot Telemetry Map
  setTimeout(() => {
    initTrackVehicleMap(complaint);
    if (trackMap) trackMap.invalidateSize();
  }, 100);
}

function handleTrackingSearch(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('trackingSearchInput');
  if (!input) return;
  const q = input.value.trim();
  const found = window.wasteStore.getComplaint(q);
  if (found) {
    renderTrackingView(found.id);
    showToast(`Loaded Grievance #${found.id}`, 'info');
  } else {
    showToast(`No complaint found matching "${q}". Showing latest active ticket.`, 'warning');
    renderTrackingView(window.wasteStore.complaints[0].id);
  }
}

function escalateCurrentComplaint() {
  const ticketInput = document.getElementById('trackingSearchInput');
  const complaint = window.wasteStore.getComplaint(ticketInput ? ticketInput.value : null);
  if (!complaint) return;

  const modal = document.getElementById('escalateModal');
  if (modal) modal.classList.remove('hidden');
}

function submitEscalation(reason) {
  const ticketInput = document.getElementById('trackingSearchInput');
  const complaint = window.wasteStore.getComplaint(ticketInput ? ticketInput.value : null);
  if (complaint) {
    window.wasteStore.escalateComplaint(complaint.id, reason);
    renderTrackingView(complaint.id);
    document.getElementById('escalateModal').classList.add('hidden');
    showToast(`Grievance #${complaint.id} escalated to Zonal Commissioner! Priority status: Critical Hotspot.`, 'warning', 5000);
  }
}

// ================= GREEN KARMA REWARDS =================
function renderRewardsView() {
  const user = window.wasteStore.user;

  // Balance & Stats
  const balEl = document.getElementById('karmaBalanceMain');
  if (balEl) balEl.textContent = user.karmaBalance.toLocaleString();

  const tierProgress = document.getElementById('karmaTierProgress');
  const pct = Math.min(100, (user.karmaBalance / 2000) * 100);
  if (tierProgress) tierProgress.style.width = `${pct}%`;

  const tierProgressLabel = document.getElementById('karmaTierProgressLabel');
  if (tierProgressLabel) tierProgressLabel.textContent = `${user.karmaBalance.toLocaleString()} / 2,000 Points (${pct.toFixed(1)}%)`;

  const reportsCount = document.getElementById('userReportsCount');
  if (reportsCount) reportsCount.textContent = user.reportsFiled;

  const resolvedCount = document.getElementById('userResolvedCount');
  if (resolvedCount) resolvedCount.textContent = `${user.reportsResolved} Resolved (${Math.round((user.reportsResolved/user.reportsFiled)*100)}%)`;

  // Render Passbook Ledger
  renderPassbookLedger('all');
}

function renderPassbookLedger(filter = 'all') {
  const ledgerContainer = document.getElementById('passbookTableBody');
  if (!ledgerContainer) return;

  ledgerContainer.innerHTML = '';
  const entries = window.wasteStore.passbook.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  if (entries.length === 0) {
    ledgerContainer.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-on-surface-variant">No transaction history for this filter.</td></tr>`;
    return;
  }

  entries.forEach(item => {
    const isCredit = item.type === 'credit';
    const row = `
      <tr class="border-b border-surface-border/50 hover:bg-surface-canvas/80 transition-colors">
        <td class="py-3 px-4">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full ${isCredit ? 'bg-status-resolved-soft text-status-resolved' : 'bg-status-critical-soft text-status-critical'} flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[18px]">${isCredit ? 'add' : 'remove'}</span>
            </span>
            <div class="flex flex-col">
              <span class="font-bold text-civic-navy-dark text-sm">${item.title}</span>
              <span class="text-xs text-on-surface-variant">${item.desc}</span>
            </div>
          </div>
        </td>
        <td class="py-3 px-4 font-mono text-xs text-secondary-fixed-dim">${item.ref}</td>
        <td class="py-3 px-4 text-xs text-on-surface-variant">${item.date}</td>
        <td class="py-3 px-4 text-right">
          <span class="font-bold font-mono ${isCredit ? 'text-status-resolved' : 'text-status-critical'}">
            ${isCredit ? '+' : ''}${item.amount} pts
          </span>
        </td>
      </tr>
    `;
    ledgerContainer.insertAdjacentHTML('beforeend', row);
  });
}

function triggerRedeem(rewardId, pointsCost, rewardTitle) {
  const result = window.wasteStore.redeemReward(rewardId, pointsCost, rewardTitle);
  if (result.success) {
    const modal = document.getElementById('voucherModal');
    const codeEl = document.getElementById('voucherCode');
    const titleEl = document.getElementById('voucherTitle');
    const descEl = document.getElementById('voucherDesc');

    if (codeEl) codeEl.textContent = result.voucherCode;
    if (titleEl) titleEl.textContent = rewardTitle;
    if (descEl) descEl.textContent = `Successfully deducted ${pointsCost} points. Show this voucher or QR code to the municipal counter or partner app.`;
    if (modal) modal.classList.remove('hidden');

    showToast(`Redeemed ${rewardTitle}! Code: ${result.voucherCode}`, 'success');
    renderRewardsView();
    updateHeaderProfile();
  } else {
    showToast(result.message, 'error');
  }
}

// ================= WASTE AWARENESS GUIDE =================
function renderAwarenessGuide() {
  const searchInput = document.getElementById('wasteSearchInput');
  if (searchInput && !searchInput.dataset.initialized) {
    searchInput.dataset.initialized = "true";
    searchInput.addEventListener('input', (e) => {
      searchWasteItem(e.target.value);
    });
  }
}

function searchWasteItem(query) {
  const box = document.getElementById('searchResultsBox');
  const msg = document.getElementById('searchMessage');
  if (!query || !query.trim()) {
    if (box) box.classList.add('hidden');
    return;
  }

  const q = query.trim().toLowerCase();
  const matches = window.WASTE_ITEMS_DB.filter(item => item.name.toLowerCase().includes(q));

  if (!box || !msg) return;
  box.classList.remove('hidden');

  if (matches.length > 0) {
    const first = matches[0];
    let binBg = "bg-status-resolved-soft text-segregation-wet border-segregation-wet";
    if (first.bin === 'blue') {
      binBg = "bg-status-progress-soft text-segregation-dry border-segregation-dry";
    } else if (first.bin === 'hazardous') {
      binBg = "bg-status-critical-soft text-segregation-hazardous border-segregation-hazardous";
    }

    msg.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full border p-4 rounded-xl ${binBg}">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-[28px] mt-0.5">${first.icon}</span>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-base text-civic-navy-dark">${first.name}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/80 shadow-sm">${first.binLabel}</span>
            </div>
            <p class="text-sm mt-1 text-civic-navy-dark/90">${first.tip}</p>
          </div>
        </div>
        <button onclick="document.getElementById('wasteSearchInput').value=''; searchWasteItem('');" class="self-end sm:self-center px-3 py-1 bg-white/90 rounded text-xs font-bold text-civic-navy-dark hover:bg-white shadow-sm">
          Clear
        </button>
      </div>
    `;
  } else {
    msg.innerHTML = `
      <div class="p-4 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-between w-full">
        <span>No direct match found for "<strong>${query}</strong>". For general recyclables use Blue Bin, food leftovers Green Bin, and chemicals/e-waste Red Bin.</span>
        <button onclick="document.getElementById('wasteSearchInput').value=''; searchWasteItem('');" class="px-3 py-1 bg-surface-card rounded text-xs font-bold">Clear</button>
      </div>
    `;
  }
}

function applyQuickFilter(itemText) {
  const input = document.getElementById('wasteSearchInput');
  if (input) {
    input.value = itemText;
    searchWasteItem(itemText);
  }
}

// ================= MUNICIPAL ADMIN COMMAND CONSOLE =================
function renderAdminConsole() {
  const user = window.wasteStore.user;
  const officerBar = document.getElementById('adminOfficerBarProfile');
  if (officerBar) {
    if (window.wasteStore.isAdmin()) {
      officerBar.innerHTML = `
        <div class="text-right">
          <span class="text-xs font-bold text-white block">${user.name}</span>
          <span class="text-[10px] text-primary-fixed">Verified Joint Commissioner</span>
        </div>
        <div class="w-9 h-9 rounded-lg bg-alert-amber text-civic-navy-dark font-bold flex items-center justify-center text-xs shadow-sm border border-amber-300">
          RK
        </div>
      `;
    } else {
      officerBar.innerHTML = `
        <div class="text-right">
          <span class="text-xs font-bold text-amber-300 block">Citizen View Mode</span>
          <span class="text-[10px] text-secondary-fixed-dim">${user.name}</span>
        </div>
        <button onclick="quickLoginAdmin()" class="px-3 py-1.5 rounded-lg bg-alert-amber hover:bg-amber-400 text-civic-navy-dark font-bold text-xs flex items-center gap-1 shadow-sm transition-all">
          <span class="material-symbols-outlined text-[16px]">verified_user</span>
          <span>Switch to Officer Mode</span>
        </button>
      `;
    }
  }

  const triageTableBody = document.getElementById('adminTriageTableBody');
  if (!triageTableBody) return;

  triageTableBody.innerHTML = '';
  window.wasteStore.complaints.forEach(comp => {
    let statusClass = "bg-alert-amber-soft text-alert-amber";
    if (comp.status === 'in_progress') statusClass = "bg-status-progress-soft text-status-progress";
    if (comp.status === 'resolved') statusClass = "bg-status-resolved-soft text-status-resolved";

    const tr = `
      <tr class="border-b border-surface-border/50 hover:bg-surface-canvas transition-colors">
        <td class="py-3 px-4 font-mono font-bold text-xs text-civic-navy-dark">#${comp.id}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-xs text-civic-navy-dark">${comp.title}</div>
          <div class="text-[11px] text-on-surface-variant truncate max-w-xs">${comp.ward}</div>
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${statusClass}">${comp.statusLabel}</span>
        </td>
        <td class="py-3 px-4 text-xs font-mono text-on-surface-variant">${comp.assignedVehicle}</td>
        <td class="py-3 px-4 text-xs text-on-surface-variant">${comp.slaRemaining}</td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1">
            ${comp.status !== 'resolved' ? `
              <button onclick="adminResolveComplaint('${comp.id}')" class="px-2.5 py-1 rounded bg-status-resolved text-on-primary text-xs font-bold hover:bg-primary-container shadow-sm flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">task_alt</span> Resolve
              </button>
            ` : `
              <span class="text-xs text-status-resolved font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">verified</span> Closed
              </span>
            `}
            <button onclick="adminDispatchCrew('${comp.id}')" class="p-1 rounded bg-surface-container hover:bg-surface-container-high text-civic-navy-dark text-xs" title="Dispatch/Reroute Crew">
              <span class="material-symbols-outlined text-[16px]">local_shipping</span>
            </button>
          </div>
        </td>
      </tr>
    `;
    triageTableBody.insertAdjacentHTML('beforeend', tr);
  });

  // Render Fleet Table
  const fleetTableBody = document.getElementById('adminFleetTableBody');
  if (fleetTableBody) {
    fleetTableBody.innerHTML = '';
    window.wasteStore.fleet.forEach(f => {
      const tr = `
        <tr class="border-b border-surface-border/50 hover:bg-surface-canvas transition-colors">
          <td class="py-2.5 px-3 font-mono font-bold text-xs">${f.id}</td>
          <td class="py-2.5 px-3 text-xs">${f.type}</td>
          <td class="py-2.5 px-3 text-xs">
            <span class="font-bold text-civic-navy-dark">${f.driver}</span>
            <span class="text-[10px] text-on-surface-variant block">${f.phone}</span>
          </td>
          <td class="py-2.5 px-3 text-xs">
            <div class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px] text-status-resolved">battery_charging_full</span>
              <span>${f.battery}</span>
            </div>
          </td>
          <td class="py-2.5 px-3 text-xs">
            <div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div class="bg-primary h-1.5 rounded-full" style="width: ${f.capacity}%;"></div>
            </div>
            <span class="text-[10px] text-on-surface-variant">${f.capacity}% full</span>
          </td>
          <td class="py-2.5 px-3 text-xs">
            <span class="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-medium text-[11px]">${f.status}</span>
          </td>
        </tr>
      `;
      fleetTableBody.insertAdjacentHTML('beforeend', tr);
    });
  }
}

function adminResolveComplaint(id) {
  window.wasteStore.updateComplaintStatus(id, 'resolved', 4);
  renderAdminConsole();
  showToast(`Grievance #${id} marked as Cleaned & AI-Verified. Citizen notified!`, 'success');
}

function adminDispatchCrew(id) {
  const vehicles = window.wasteStore.fleet;
  const v = vehicles[0];
  window.wasteStore.updateComplaintStatus(id, 'in_progress', 2, {
    vehicle: `${v.id} (${v.type})`,
    driver: v.driver,
    phone: v.phone
  });
  renderAdminConsole();
  showToast(`Dispatched ${v.type} (${v.id}, Driver: ${v.driver}) to grievance #${id}!`, 'info');
}

// ================= LANGUAGE SELECTION & BILINGUAL SUPPORT =================
function openLanguageModal() {
  const modal = document.getElementById('languageModal');
  if (modal) modal.classList.remove('hidden');
}

function closeLanguageModal() {
  const modal = document.getElementById('languageModal');
  if (modal) modal.classList.add('hidden');
}

function setPortalLanguage(lang) {
  window.i18n.setLang(lang);
  window.wasteStore.setLanguage(lang);
  closeLanguageModal();
  showToast(lang === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है।' : 'Language changed to English.', 'info');
}

// ================= CITIZEN & ADMIN LOGIN CONTROLLERS =================
let otpTimerInterval = null;

function openLoginModal() {
  navigateTo('login');
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.add('hidden');
}

function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const phone = document.getElementById('loginPhone') ? document.getElementById('loginPhone').value : '9876543210';
  window.wasteStore.loginCitizen({ name: "Aarav Sharma", phone: phone, ward: "Ward 28 - Central Karol Bagh" });
  closeLoginModal();
  updateHeaderProfile();
  showToast("Welcome back, Aarav Sharma! (Ward 28)", "success");
}

function initLoginView(initialRole = 'citizen') {
  switchLoginRole(initialRole);
  
  const user = window.wasteStore.user;
  const phoneInput = document.getElementById('citizenPhoneInput');
  if (phoneInput && user && user.phone) {
    phoneInput.value = user.phone;
  }
}

function switchLoginRole(role) {
  const citizenBtn = document.getElementById('roleTabCitizenBtn');
  const adminBtn = document.getElementById('roleTabAdminBtn');
  const citizenPanel = document.getElementById('loginCitizenPanel');
  const adminPanel = document.getElementById('loginAdminPanel');

  if (role === 'admin') {
    if (adminBtn) adminBtn.className = "role-tab-btn active-admin py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all";
    if (citizenBtn) citizenBtn.className = "role-tab-btn py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-on-surface-variant hover:text-civic-navy-dark transition-all";
    if (adminPanel) adminPanel.classList.remove('hidden');
    if (citizenPanel) citizenPanel.classList.add('hidden');
  } else {
    if (citizenBtn) citizenBtn.className = "role-tab-btn active-citizen py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all";
    if (adminBtn) adminBtn.className = "role-tab-btn py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-on-surface-variant hover:text-civic-navy-dark transition-all";
    if (citizenPanel) citizenPanel.classList.remove('hidden');
    if (adminPanel) adminPanel.classList.add('hidden');
  }
}

function handleSendOtp() {
  const phoneInput = document.getElementById('citizenPhoneInput');
  const phoneVal = phoneInput ? phoneInput.value.trim() : '9876543210';
  
  if (!phoneVal || phoneVal.length < 10) {
    showToast("Please enter a valid 10-digit mobile number.", "warning");
    return;
  }

  const btn = document.getElementById('btnRequestOtp');
  const timerNotice = document.getElementById('otpTimerNotice');
  const timerSec = document.getElementById('otpTimerSec');
  const otpStatus = document.getElementById('otpStatusNotice');

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Dispatched...";
  }

  showToast(`SMS OTP 123456 dispatched via National Gateway to +91 ${phoneVal}`, "info", 4000);

  if (otpStatus) {
    otpStatus.innerHTML = `<span class="material-symbols-outlined text-[14px] text-status-resolved">mark_email_read</span> SMS Sent! Enter code <strong>123456</strong>`;
  }

  // Start 30s countdown
  let countdown = 30;
  if (otpTimerInterval) clearInterval(otpTimerInterval);
  if (timerNotice) timerNotice.classList.remove('hidden');

  otpTimerInterval = setInterval(() => {
    countdown--;
    if (timerSec) timerSec.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(otpTimerInterval);
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Resend OTP";
      }
      if (timerNotice) timerNotice.textContent = "Didn't receive? Click Resend.";
    }
  }, 1000);

  // Focus OTP box and fill demo code
  const otpInput = document.getElementById('citizenOtpInput');
  if (otpInput) {
    otpInput.focus();
    otpInput.value = "123456";
  }
}

function autofillDemoOtp() {
  const otpInput = document.getElementById('citizenOtpInput');
  if (otpInput) {
    otpInput.value = "123456";
    showToast("Demo OTP 123456 auto-filled.", "info");
    otpInput.focus();
  }
}

function handleCitizenLoginSubmit(e) {
  if (e) e.preventDefault();
  const phoneInput = document.getElementById('citizenPhoneInput');
  const otpInput = document.getElementById('citizenOtpInput');
  const phone = phoneInput ? phoneInput.value.trim() : '9876543210';
  const otp = otpInput ? otpInput.value.trim() : '123456';

  if (!phone || phone.length < 10) {
    showToast("Please enter a valid 10-digit mobile number.", "warning");
    return;
  }

  if (!otp || otp.length < 4) {
    showToast("Please enter the verification OTP (Demo: 123456).", "warning");
    return;
  }

  window.wasteStore.loginCitizen({
    phone: phone,
    name: "Aarav Sharma",
    ward: "Ward 28 - Central Karol Bagh"
  });

  updateHeaderProfile();
  showToast("Citizen Authentication Verified! Welcome back, Aarav Sharma.", "success");
  navigateTo('home');
}

function handleAdminLoginSubmit(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('adminEmailInput');
  const empIdInput = document.getElementById('adminEmpIdInput');
  const ulbSelect = document.getElementById('adminUlbSelect');

  const email = emailInput ? emailInput.value.trim() : 'rajesh.ias@delhi.gov.in';
  const empId = empIdInput ? empIdInput.value.trim() : 'MCD-ADM-2024-09';
  const ulb = ulbSelect ? ulbSelect.value : 'North Delhi Municipal Corporation (North DMC)';

  window.wasteStore.loginAdmin({
    email: email,
    employeeId: empId,
    ulb: ulb,
    name: "Rajesh Kumar, IAS",
    designation: "Joint Commissioner (Solid Waste)"
  });

  updateHeaderProfile();
  showToast("Executive Officer Access Authorized! Welcome, Rajesh Kumar, IAS.", "success");
  navigateTo('admin-portal');
}

function quickLoginCitizen() {
  window.wasteStore.loginCitizen({
    name: "Aarav Sharma",
    phone: "9876543210",
    ward: "Ward 28 - Central Karol Bagh"
  });
  updateHeaderProfile();
  showToast("Logged in as Citizen Aarav Sharma (Ward 28)", "success");
  navigateTo('home');
}

function quickLoginAdmin() {
  window.wasteStore.loginAdmin({
    name: "Rajesh Kumar, IAS",
    employeeId: "MCD-ADM-2024-09",
    designation: "Joint Commissioner (Solid Waste)",
    ulb: "North Delhi Municipal Corporation (North DMC)"
  });
  updateHeaderProfile();
  showToast("Authorized as Joint Commissioner Rajesh Kumar, IAS (North DMC)", "success");
  navigateTo('admin-portal');
}

function handleLogout() {
  window.wasteStore.logout();
  closeProfileDropdown();
  updateHeaderProfile();
  showToast("Signed out of Pavitra Vasudha portal successfully.", "info");
  navigateTo('home');
}

function handleHeaderUserBtnClick() {
  const user = window.wasteStore.user;
  if (user && user.isLoggedIn) {
    toggleProfileDropdown();
  } else {
    navigateTo('login');
  }
}

function toggleProfileDropdown() {
  const dropdown = document.getElementById('userProfileDropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
    updateHeaderProfile();
  }
}

function closeProfileDropdown() {
  const dropdown = document.getElementById('userProfileDropdown');
  if (dropdown) {
    dropdown.classList.add('hidden');
  }
}

// Close profile dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('userProfileDropdown');
  const userBtn = document.getElementById('headerUserBtn');
  if (dropdown && !dropdown.classList.contains('hidden')) {
    if (userBtn && !userBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  }
});

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved language
  window.i18n.applyTranslations();
  updateHeaderProfile();

  // Initialize router
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash);

  // Initialize home map immediately on boot if on home
  if (!hash || hash === 'home') {
    setTimeout(() => {
      initHomeRadarMap();
      if (homeMap) homeMap.invalidateSize();
    }, 200);
  }

  // Subscribe store changes to update UI automatically
  window.wasteStore.subscribe(() => {
    updateHeaderProfile();
  });
});

// Window resize listener to keep Leaflet viewport updated
window.addEventListener('resize', () => {
  if (homeMap) homeMap.invalidateSize();
  if (reportMap) reportMap.invalidateSize();
  if (trackMap) trackMap.invalidateSize();
});
