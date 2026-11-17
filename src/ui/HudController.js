import { bus } from '../core/EventBus.js';
import {
  TOWER_DEFINITIONS,
  TOWER_BUILD_ORDER,
  TARGET_PRIORITIES,
  AIR_SUPPORT_DEFINITIONS
} from '../data/towers.js';
import { WORLDS, getWorldConfig, getStageConfig } from '../data/worlds.js';
import { saveManager, MAX_TECH_LEVEL } from '../systems/SaveManager.ts';
import { formatColLabel } from '../three/TerrainDiorama3D.ts';

const TOWER_ICONS = {
  m2_bunker: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16h18M5 16l2-5h6l2 5M13 11h8M15 8v3M7 16v3M17 16v3"/></svg>`,
  bushmaster: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="9" height="6" rx="1"/><path d="M13 12h9M3 18h14M6 10l2-3h4l1 3"/></svg>`,
  javelin: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18h16M7 18l5-10 4 2-5 8M15 6l4-2-1 4"/></svg>`,
  phalanx: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 19h8M9 19v-7a3 3 0 0 1 6 0v7M15 11h6M15 13h6"/></svg>`,
  howitzer: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 18h14M6 18l3-5 10-7 1.5 2-9 7M12 18l4-3"/></svg>`,
  patriot: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19h16M6 19v-3h12v3M8 14l9-9 2 2-9 9M5 9l4 4"/></svg>`,
  ew_crew: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20V8M8 20h8M9 15h6M12 8a3 3 0 1 0 0-4M7 10a6 6 0 0 1 0-6M17 10a6 6 0 0 0 0-6"/></svg>`,
  abrams_pit: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="13" width="15" height="6" rx="2"/><path d="M6 13l2-4h6l2 4M14 10h8"/></svg>`,
  iron_dome: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 18h18M5 18a7 7 0 0 1 14 0M12 5v4M8 7l2 3M16 7l-2 3"/></svg>`,
  helios_laser: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="14" r="4"/><path d="M4 19h10M13 12l8-6M13 14h9"/></svg>`,
  tos1_mlrs: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="14" width="17" height="5" rx="1"/><path d="M6 14l4-7h7l-2 7M11 9l6-4"/></svg>`,
  hesco: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="8" height="10"/><rect x="13" y="8" width="8" height="10"/><path d="M3 13h18M4 6c2-2 4 2 6 0s4 2 6 0 4 2 5 0"/></svg>`
};

const TECH_STAT_META = [
  { key: 'damage', label: 'DANO', bonus: '+10%/nv' },
  { key: 'fireRate', label: 'CADÊNCIA', bonus: '+8%/nv' },
  { key: 'hp', label: 'BLINDAGEM', bonus: '+20%/nv' },
  { key: 'cost', label: 'CUSTO', bonus: '-5%/nv' }
];

export class HudController {
  constructor() {
    this.latestState = null;
    this.activeTool = null;
    this.selectedTower = null;
    this.alertTimeout = null;

    const saved = saveManager.getState();
    this.modalWorldId = saved.selectedWorld;
    this.modalStageId = saved.selectedStage;
    this.activeTab = 'worlds';

    this.el = {
      missionLabel: document.getElementById('hud-mission-label'),
      budget: document.getElementById('hud-budget'),
      wb: document.getElementById('hud-wb'),
      fob: document.getElementById('hud-fob'),
      wave: document.getElementById('hud-wave'),
      enemies: document.getElementById('hud-enemies'),
      kills: document.getElementById('hud-kills'),
      aesa: document.getElementById('hud-aesa'),
      coord: document.getElementById('hud-coord'),
      btnInstallPwa: document.getElementById('btn-install-pwa'),
      btnSaveMenu: document.getElementById('btn-save-menu'),
      btnCampaign: document.getElementById('btn-campaign'),
      btnWave: document.getElementById('btn-wave'),
      btnResetCam: document.getElementById('btn-reset-cam'),
      btnToggleSidebar: document.getElementById('btn-toggle-sidebar'),
      btnCloseSidebar: document.getElementById('btn-close-sidebar'),
      tacticalSidebar: document.getElementById('tactical-sidebar'),
      sidebarBackdrop: document.getElementById('sidebar-backdrop'),
      inspectorPanel: document.getElementById('inspector-panel'),
      btnMute: document.getElementById('btn-mute'),
      btnHelp: document.getElementById('btn-help'),
      btnCloseHelp: document.getElementById('btn-close-help'),
      helpModal: document.getElementById('help-modal'),
      radarAlert: document.getElementById('radar-alert-banner'),
      goModal: document.getElementById('gameover-modal'),
      goBadge: document.getElementById('go-badge'),
      goTitle: document.getElementById('go-title'),
      goDesc: document.getElementById('go-desc'),
      goWave: document.getElementById('go-wave'),
      goKills: document.getElementById('go-kills'),
      goWb: document.getElementById('go-wb'),
      btnRestart: document.getElementById('btn-restart'),
      btnGoCampaign: document.getElementById('btn-go-campaign'),
      btnNextStage: document.getElementById('btn-next-stage'),
      toolBanner: document.getElementById('tool-banner'),
      toolBannerText: document.getElementById('tool-banner-text'),
      btnRotateA10: document.getElementById('btn-rotate-a10'),
      btnCancelTool: document.getElementById('btn-cancel-tool'),
      nextWaveNum: document.getElementById('next-wave-num'),
      nextWaveTitle: document.getElementById('next-wave-title'),
      nextWaveBrief: document.getElementById('next-wave-brief'),
      nextWaveUnits: document.getElementById('next-wave-units'),
      inspLevel: document.getElementById('insp-level'),
      inspEmpty: document.getElementById('inspector-empty'),
      inspBody: document.getElementById('inspector-body'),
      inspName: document.getElementById('insp-name'),
      inspRole: document.getElementById('insp-role'),
      inspTotalDmg: document.getElementById('insp-total-dmg'),
      inspKills: document.getElementById('insp-kills'),
      inspHpText: document.getElementById('insp-hp-text'),
      inspHpFill: document.getElementById('insp-hp-fill'),
      inspSpecs: document.getElementById('insp-specs'),
      prioSection: document.getElementById('prio-section'),
      prioGrid: document.getElementById('prio-grid'),
      btnRepair: document.getElementById('btn-repair'),
      btnUpgrade: document.getElementById('btn-upgrade'),
      btnUpgradeTitle: document.getElementById('btn-upgrade-title'),
      btnUpgradeDesc: document.getElementById('btn-upgrade-desc'),
      btnSell: document.getElementById('btn-sell'),
      radioLog: document.getElementById('radio-log'),
      arsenalGrid: document.getElementById('arsenal-grid'),
      btnA10: document.getElementById('btn-a10'),
      btnHellfire: document.getElementById('btn-hellfire'),
      btnB52: document.getElementById('btn-b52'),
      costB52: document.getElementById('cost-b52'),
      cdA10: document.getElementById('cd-a10'),
      cdHellfire: document.getElementById('cd-hellfire'),
      cdB52: document.getElementById('cd-b52'),
      txtCdA10: document.getElementById('txt-cd-a10'),
      txtCdHellfire: document.getElementById('txt-cd-hellfire'),
      txtCdB52: document.getElementById('txt-cd-b52'),
      campModal: document.getElementById('campaign-modal'),
      campWbBalance: document.getElementById('camp-wb-balance'),
      btnCloseCampaign: document.getElementById('btn-close-campaign'),
      tabWorlds: document.getElementById('tab-worlds'),
      tabArsenal: document.getElementById('tab-arsenal'),
      tabSave: document.getElementById('tab-save'),
      worldsSelector: document.getElementById('worlds-selector'),
      worldDescBar: document.getElementById('world-desc-bar'),
      stagesGrid: document.getElementById('stages-grid'),
      shopSupportGrid: document.getElementById('shop-support-grid'),
      shopTowersGrid: document.getElementById('shop-towers-grid'),
      btnUnlockAllStages: document.getElementById('btn-unlock-all-stages'),
      btnGrantWb: document.getElementById('btn-grant-wb'),
      btnLaunchStage: document.getElementById('btn-launch-stage'),
      autosaveStatusText: document.getElementById('autosave-status-text'),
      btnForceSave: document.getElementById('btn-force-save'),
      btnResetMission: document.getElementById('btn-reset-mission'),
      saveSlotsGrid: document.getElementById('save-slots-grid'),
      btnExportSave: document.getElementById('btn-export-save'),
      btnImportSave: document.getElementById('btn-import-save'),
      inputImportSave: document.getElementById('input-import-save'),
      btnModalInstallPwa: document.getElementById('btn-modal-install-pwa'),
      pwaInstallHint: document.getElementById('pwa-install-hint')
    };

    this.deferredInstallPrompt = null;
    this.buildArsenalCards();
    this.buildPriorityButtons();
    this.bindDomEvents();
    this.bindBusEvents();
  }

  getEffectiveCost(towerId) {
    const def = TOWER_DEFINITIONS[towerId];
    const mults = saveManager.getTechMultipliers(towerId);
    return Math.max(10, Math.round(def.cost * mults.costMult));
  }

  buildArsenalCards() {
    this.el.arsenalGrid.innerHTML = '';
    this.buildCards = new Map();

    for (const id of TOWER_BUILD_ORDER) {
      const def = TOWER_DEFINITIONS[id];
      const spec = def.levels[0];
      const btn = document.createElement('button');
      btn.className = 'build-card';
      btn.title = `${def.name} — ${def.summary} (${spec.notes})`;
      btn.innerHTML = `
        <div class="bc-top">
          <span class="hotkey">${def.hotkey}</span>
          <span class="bc-icon" style="color:${def.roleColor}">${TOWER_ICONS[id] || ''}</span>
          <span class="bc-role" style="color:${def.roleColor}">${def.role}</span>
        </div>
        <div class="bc-name">${def.name}</div>
        <div class="bc-bottom">
          <span class="bc-cost">$${def.cost}</span>
          <span class="bc-stat">${spec.range > 0 ? `${spec.range}m` : 'OBST'}</span>
        </div>
      `;
      btn.addEventListener('click', () => bus.emit('cmd:selectBuild', id));
      this.el.arsenalGrid.appendChild(btn);
      this.buildCards.set(id, btn);
    }
    this.refreshArsenalCardUnlockState();
  }

  refreshArsenalCardUnlockState() {
    for (const [id, btn] of this.buildCards) {
      const def = TOWER_DEFINITIONS[id];
      const unlocked = saveManager.isTowerUnlocked(id);
      const costEl = btn.querySelector('.bc-cost');
      const statEl = btn.querySelector('.bc-stat');
      btn.classList.toggle('locked', !unlocked);
      if (!unlocked) {
        costEl.textContent = `🔒 ${def.unlockCostWB} WB$`;
        costEl.style.color = '#facc15';
        statEl.textContent = 'ARSENAL';
      } else {
        const effCost = this.getEffectiveCost(id);
        costEl.textContent = `$${effCost}`;
        costEl.style.color = '';
        const spec = def.levels[0];
        statEl.textContent = spec.range > 0 ? `${spec.range}m` : 'OBST';
      }
    }
  }

  buildPriorityButtons() {
    this.el.prioGrid.innerHTML = '';
    this.prioButtons = new Map();
    for (const p of TARGET_PRIORITIES) {
      const btn = document.createElement('button');
      btn.className = 'btn-prio';
      btn.textContent = p.short;
      btn.title = p.desc;
      btn.addEventListener('click', () => bus.emit('cmd:setPriority', p.id));
      this.el.prioGrid.appendChild(btn);
      this.prioButtons.set(p.id, btn);
    }
  }

  bindDomEvents() {
    document.querySelectorAll('.btn-speed').forEach((btn) => {
      btn.addEventListener('click', () => {
        bus.emit('cmd:setSpeed', Number(btn.dataset.speed));
      });
    });

    this.el.btnSaveMenu?.addEventListener('click', () => this.openCampaignModal('save'));
    this.el.btnCampaign.addEventListener('click', () => this.openCampaignModal('worlds'));
    this.el.btnCloseCampaign.addEventListener('click', () => this.closeCampaignModal());

    document.querySelectorAll('.camp-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        this.switchCampaignTab(tabBtn.dataset.tab);
      });
    });

    this.el.btnUnlockAllStages.addEventListener('click', () => {
      saveManager.unlockAllCampaign();
      this.renderCampaignModal();
    });

    this.el.btnGrantWb.addEventListener('click', () => {
      saveManager.addWarBonds(1000);
      this.renderCampaignModal();
      bus.emit('cmd:techUpdated');
    });

    this.el.btnLaunchStage.addEventListener('click', () => {
      this.closeCampaignModal();
      this.el.goModal.classList.add('hidden');
      this.el.radioLog.innerHTML = '';
      bus.emit('cmd:loadStage', { worldId: this.modalWorldId, stageId: this.modalStageId });
    });

    this.el.btnForceSave?.addEventListener('click', () => {
      bus.emit('cmd:forceSave');
    });

    this.el.btnResetMission?.addEventListener('click', () => {
      this.closeCampaignModal();
      this.el.goModal.classList.add('hidden');
      this.el.radioLog.innerHTML = '';
      bus.emit('cmd:restart');
    });

    this.el.btnExportSave?.addEventListener('click', () => {
      const json = saveManager.exportSaveJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `defcon-frontline-save-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.showRadarAlert({ level: 'info', text: 'BACKUP .JSON EXPORTADO COM SUCESSO!' });
    });

    this.el.btnImportSave?.addEventListener('click', () => {
      this.el.inputImportSave?.click();
    });

    this.el.inputImportSave?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === 'string' ? reader.result : '';
        if (text) {
          bus.emit('cmd:importSave', text);
        }
        e.target.value = '';
      };
      reader.readAsText(file);
    });

    this.el.btnWave.addEventListener('click', () => bus.emit('cmd:startWave'));
    this.el.btnResetCam?.addEventListener('click', () => bus.emit('cmd:resetCamera'));
    this.el.btnToggleSidebar?.addEventListener('click', () => {
      const isOpen = this.el.tacticalSidebar?.classList.contains('sidebar-open');
      this.setMobileSidebarOpen(!isOpen);
    });
    this.el.btnCloseSidebar?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setMobileSidebarOpen(false);
    });
    this.el.sidebarBackdrop?.addEventListener('click', () => {
      this.setMobileSidebarOpen(false);
    });
    this.el.btnRotateA10?.addEventListener('click', (e) => {
      e.stopPropagation();
      bus.emit('cmd:rotateStrafe');
    });
    this.el.btnCancelTool?.addEventListener('click', (e) => {
      e.stopPropagation();
      bus.emit('cmd:cancelTool');
    });

    const triggerInstallPrompt = async () => {
      if (this.deferredInstallPrompt) {
        this.deferredInstallPrompt.prompt();
        try {
          const choice = await this.deferredInstallPrompt.userChoice;
          if (choice?.outcome === 'accepted') {
            this.deferredInstallPrompt = null;
            this.el.btnInstallPwa?.classList.add('hidden');
            this.showRadarAlert({ level: 'info', text: 'APP DEFCON: FRONTLINE INSTALADO NO DISPOSITIVO!' });
          }
        } catch {
          // Ignore prompt dismissal errors
        }
        return;
      }
      this.openCampaignModal('save');
      this.showRadarAlert({
        level: 'info',
        text: 'No Android Chrome use Menu (⋮) → "Instalar app". No iPhone use Compartilhar → "Adicionar à Tela de Início".'
      });
    };

    this.el.btnInstallPwa?.addEventListener('click', triggerInstallPrompt);
    this.el.btnModalInstallPwa?.addEventListener('click', triggerInstallPrompt);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      this.el.btnInstallPwa?.classList.remove('hidden');
      if (this.el.pwaInstallHint) {
        this.el.pwaInstallHint.textContent =
          'Dispositivo compatível detectado! Toque em "📲 INSTALAR APP (PWA)" para instalar na tela inicial com modo offline.';
      }
    });

    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      this.el.btnInstallPwa?.classList.add('hidden');
      if (this.el.pwaInstallHint) {
        this.el.pwaInstallHint.textContent = 'Aplicativo já instalado neste dispositivo. Autosave offline ativo.';
      }
    });

    this.el.btnRepair.addEventListener('click', () => bus.emit('cmd:repairTower'));
    this.el.btnUpgrade.addEventListener('click', () => bus.emit('cmd:upgradeTower'));
    this.el.btnSell.addEventListener('click', () => bus.emit('cmd:sellTower'));
    this.el.btnA10.addEventListener('click', () => bus.emit('cmd:selectSupport', 'a10'));
    this.el.btnHellfire.addEventListener('click', () => bus.emit('cmd:selectSupport', 'hellfire'));
    this.el.btnB52.addEventListener('click', () => bus.emit('cmd:selectSupport', 'b52'));
    this.el.btnMute.addEventListener('click', () => bus.emit('cmd:toggleMute'));

    this.el.btnHelp.addEventListener('click', () => {
      this.el.helpModal.classList.remove('hidden');
    });
    this.el.btnCloseHelp.addEventListener('click', () => {
      this.el.helpModal.classList.add('hidden');
    });
    this.el.btnRestart.addEventListener('click', () => {
      this.el.goModal.classList.add('hidden');
      this.el.radioLog.innerHTML = '';
      bus.emit('cmd:restart');
    });
    this.el.btnGoCampaign.addEventListener('click', () => {
      this.el.goModal.classList.add('hidden');
      this.openCampaignModal('worlds');
    });
    this.el.btnNextStage.addEventListener('click', () => {
      this.el.goModal.classList.add('hidden');
      this.el.radioLog.innerHTML = '';
      const next = this.getNextStageIds(
        this.latestState?.worldId || 1,
        this.latestState?.stageId || 1
      );
      if (next) {
        this.modalWorldId = next.worldId;
        this.modalStageId = next.stageId;
        bus.emit('cmd:loadStage', next);
      }
    });
  }

  getNextStageIds(worldId, stageId) {
    if (stageId < 5) return { worldId, stageId: stageId + 1 };
    if (worldId < 3) return { worldId: worldId + 1, stageId: 1 };
    return null;
  }

  bindBusEvents() {
    bus.on('hud:state', (state) => this.renderState(state));
    bus.on('hud:speed', (speed) => this.renderSpeed(speed));
    bus.on('hud:tool', (tool) => this.renderActiveTool(tool));
    bus.on('hud:selectedTower', (tower) => this.renderInspector(tower));
    bus.on('hud:openMobileInspector', () => {
      if (window.innerWidth <= 1024) {
        this.setMobileSidebarOpen(true);
        this.el.inspectorPanel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
    bus.on('hud:radio', (msg) => this.appendRadio(msg));
    bus.on('hud:alert', (alert) => this.showRadarAlert(alert));
    bus.on('hud:openArsenal', () => this.openCampaignModal('arsenal'));
    bus.on('hud:autosaved', ({ timestamp } = {}) => {
      if (this.el.btnSaveMenu) {
        const dt = new Date(timestamp || Date.now());
        const hhmm = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        this.el.btnSaveMenu.textContent = `💾 SALVO ${hhmm}`;
        this.el.btnSaveMenu.classList.add('saved-flash');
        if (this.saveFlashTimeout) clearTimeout(this.saveFlashTimeout);
        this.saveFlashTimeout = setTimeout(() => {
          this.el.btnSaveMenu?.classList.remove('saved-flash');
        }, 1200);
      }
      if (!this.el.campModal.classList.contains('hidden') && this.activeTab === 'save') {
        this.renderSaveTab();
      }
    });
    bus.on('hud:slotsUpdated', () => {
      if (!this.el.campModal.classList.contains('hidden') && this.activeTab === 'save') {
        this.renderSaveTab();
      }
    });
    bus.on('hud:mute', (muted) => {
      this.el.btnMute.textContent = muted ? '🔇' : '🔊';
    });
    bus.on('cursor:move', ({ col, row }) => {
      if (col >= 0 && col < 28 && row >= 0 && row < 16) {
        const ch = formatColLabel(col);
        const r = String(row + 1).padStart(2, '0');
        this.el.coord.textContent = `GRID ${ch}-${r}`;
      }
    });
    bus.on('hud:gameover', (res) => this.showGameOver(res));
  }

  showRadarAlert({ level, text }) {
    this.el.radarAlert.textContent = text;
    this.el.radarAlert.className = `radar-alert ${level || 'warn'}`;
    if (this.alertTimeout) clearTimeout(this.alertTimeout);
    this.alertTimeout = setTimeout(() => {
      this.el.radarAlert.classList.add('hidden');
    }, 4500);
  }

  openCampaignModal(tab = 'worlds') {
    const saved = saveManager.getState();
    this.modalWorldId = this.latestState?.worldId || saved.selectedWorld;
    this.modalStageId = this.latestState?.stageId || saved.selectedStage;
    this.el.campModal.classList.remove('hidden');
    this.switchCampaignTab(tab);
  }

  closeCampaignModal() {
    this.el.campModal.classList.add('hidden');
  }

  switchCampaignTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.camp-tab').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    this.el.tabWorlds.classList.toggle('hidden', tab !== 'worlds');
    this.el.tabArsenal.classList.toggle('hidden', tab !== 'arsenal');
    this.el.tabSave?.classList.toggle('hidden', tab !== 'save');
    this.renderCampaignModal();
  }

  renderCampaignModal() {
    const wb = saveManager.getWarBonds();
    this.el.campWbBalance.textContent = `${wb.toLocaleString()} WB$`;
    this.el.wb.textContent = `${wb.toLocaleString()} WB$`;

    // World tabs
    this.el.worldsSelector.innerHTML = '';
    for (const w of WORLDS) {
      const btn = document.createElement('button');
      btn.className = `world-btn ${w.worldId === this.modalWorldId ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="wb-tag">${w.region.toUpperCase()}</span>
        <strong>${w.name}</strong>
      `;
      btn.addEventListener('click', () => {
        this.modalWorldId = w.worldId;
        if (!saveManager.isStageUnlocked(this.modalWorldId, this.modalStageId)) {
          this.modalStageId = 1;
        }
        this.renderCampaignModal();
      });
      this.el.worldsSelector.appendChild(btn);
    }

    const activeWorld = getWorldConfig(this.modalWorldId);
    this.el.worldDescBar.textContent = activeWorld.description;

    // Stage cards (1..4 + Stage 5 Boss)
    this.el.stagesGrid.innerHTML = '';
    for (const st of activeWorld.stages) {
      const unlocked = saveManager.isStageUnlocked(st.worldId, st.stageId);
      const wins = saveManager.getStageWins(st.worldId, st.stageId);
      const selected = st.worldId === this.modalWorldId && st.stageId === this.modalStageId;

      const card = document.createElement('button');
      card.className = `stage-card ${selected ? 'selected' : ''} ${!unlocked ? 'locked' : ''} ${st.isBossStage ? 'boss-stage' : ''}`;
      card.disabled = !unlocked;
      const badgeText = !unlocked
        ? '🔒 BLOQUEADA'
        : wins > 0
          ? `★ ${wins}x CONCLUÍDA (REJOGAR)`
          : st.isBossStage
            ? '💀 CHEFE SUPREMO'
            : 'DISPONÍVEL';
      card.innerHTML = `
        <div class="st-top">
          <span class="st-id">FASE ${st.id}</span>
          <span class="st-status ${wins > 0 ? 'won' : ''}">${badgeText}</span>
        </div>
        <div class="st-title">${st.title}</div>
        <div class="st-sub">${st.subtitle}</div>
        <div class="st-meta">
          <span>Base: $${st.startingBudget}</span>
          <span class="st-wb">Recompensa: +${st.clearBonusWB} WB$</span>
        </div>
      `;
      if (unlocked) {
        card.addEventListener('click', () => {
          this.modalStageId = st.stageId;
          this.renderCampaignModal();
        });
      }
      this.el.stagesGrid.appendChild(card);
    }

    const selStage = getStageConfig(this.modalWorldId, this.modalStageId);
    const canLaunch = saveManager.isStageUnlocked(this.modalWorldId, this.modalStageId);
    this.el.btnLaunchStage.disabled = !canLaunch;
    this.el.btnLaunchStage.textContent = `🚀 INICIAR OPERAÇÃO (${selStage.id}: ${selStage.title})`;

    // Tab 2: Air Supports + 12 Towers Tech Tree
    this.el.shopSupportGrid.innerHTML = '';
    for (const sup of Object.values(AIR_SUPPORT_DEFINITIONS)) {
      const unlocked = saveManager.isSupportUnlocked(sup.id);
      const div = document.createElement('div');
      div.className = `shop-card ${unlocked ? 'unlocked' : 'locked'}`;
      div.innerHTML = `
        <div class="sc-head">
          <strong>[${sup.hotkey}] ${sup.name}</strong>
          <span class="sc-cost">${unlocked ? '✅ DESBLOQUEADO' : `🔒 ${sup.unlockCostWB} WB$`}</span>
        </div>
        <div class="sc-desc">${sup.desc} (Uso em combate: $${sup.cost})</div>
      `;
      if (!unlocked) {
        const buyBtn = document.createElement('button');
        buyBtn.className = 'btn-buy-wb';
        buyBtn.disabled = wb < sup.unlockCostWB;
        buyBtn.textContent = `DESBLOQUEAR (${sup.unlockCostWB} WB$)`;
        buyBtn.addEventListener('click', () => {
          if (saveManager.unlockSupport(sup.id, sup.unlockCostWB)) {
            this.renderCampaignModal();
            bus.emit('cmd:techUpdated');
          }
        });
        div.appendChild(buyBtn);
      }
      this.el.shopSupportGrid.appendChild(div);
    }

    this.el.shopTowersGrid.innerHTML = '';
    for (const id of TOWER_BUILD_ORDER) {
      const def = TOWER_DEFINITIONS[id];
      const unlocked = saveManager.isTowerUnlocked(id);
      const tech = saveManager.getTowerTech(id);
      const effCost = this.getEffectiveCost(id);

      const card = document.createElement('div');
      card.className = `shop-tower-card ${unlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="stc-head">
          <span class="stc-icon" style="color:${def.roleColor}">${TOWER_ICONS[id] || ''}</span>
          <div>
            <div class="stc-name">[${def.hotkey}] ${def.name}</div>
            <div class="stc-role" style="color:${def.roleColor}">${def.role} | Custo Fase: $${effCost} | HP Base: ${def.maxHp}</div>
          </div>
          <span class="stc-badge">${unlocked ? 'LIBERADA' : `🔒 ${def.unlockCostWB} WB$`}</span>
        </div>
        <div class="stc-desc">${def.summary}</div>
      `;

      if (!unlocked) {
        const unlockBtn = document.createElement('button');
        unlockBtn.className = 'btn-buy-wb';
        unlockBtn.disabled = wb < def.unlockCostWB;
        unlockBtn.textContent = `DESBLOQUEAR ARMA (${def.unlockCostWB} WB$)`;
        unlockBtn.addEventListener('click', () => {
          if (saveManager.unlockTower(id, def.unlockCostWB)) {
            this.refreshArsenalCardUnlockState();
            this.renderCampaignModal();
            bus.emit('cmd:techUpdated');
          }
        });
        card.appendChild(unlockBtn);
      } else {
        const techGrid = document.createElement('div');
        techGrid.className = 'tech-grid';
        for (const stat of TECH_STAT_META) {
          if (def.isBarrier && (stat.key === 'damage' || stat.key === 'fireRate')) continue;
          const lv = tech[stat.key];
          const isMax = lv >= MAX_TECH_LEVEL;
          const upCost = saveManager.getUpgradeTechCost(lv);

          const row = document.createElement('div');
          row.className = 'tech-row';
          row.innerHTML = `
            <span class="tech-label">${stat.label} <small>(${stat.bonus})</small></span>
            <span class="tech-pips">${'■'.repeat(lv)}${'□'.repeat(MAX_TECH_LEVEL - lv)}</span>
          `;
          const btn = document.createElement('button');
          btn.className = 'btn-tech-up';
          btn.disabled = isMax || wb < upCost;
          btn.textContent = isMax ? 'MAX' : `+1 (${upCost} WB$)`;
          btn.addEventListener('click', () => {
            if (saveManager.upgradeTowerTech(id, stat.key, upCost)) {
              this.refreshArsenalCardUnlockState();
              this.renderCampaignModal();
              bus.emit('cmd:techUpdated');
            }
          });
          row.appendChild(btn);
          techGrid.appendChild(row);
        }
        card.appendChild(techGrid);
      }

      this.el.shopTowersGrid.appendChild(card);
    }

    this.renderSaveTab();
  }

  formatTimestamp(ts) {
    if (!ts || !Number.isFinite(ts)) return 'Nunca';
    return new Date(ts).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  renderSaveTab() {
    if (!this.el.tabSave) return;

    const active = saveManager.getActiveMission();
    const lastSavedAt = saveManager.getLastSavedAt();
    if (this.el.autosaveStatusText) {
      if (active) {
        const w = getWorldConfig(active.worldId);
        const st = getStageConfig(active.worldId, active.stageId);
        this.el.autosaveStatusText.textContent =
          `Missão em andamento salva: Mundo ${active.worldId} (${w.name}) • Fase ${active.worldId}-${active.stageId} (${st.title}) | ` +
          `Onda ${active.completedWave}/${active.totalWaves} • ${active.towers.length} defesa(s) • $${active.budget} • ` +
          `Último backup: ${this.formatTimestamp(lastSavedAt)}`;
      } else {
        this.el.autosaveStatusText.textContent =
          `Campanha e Arsenal salvos em ${this.formatTimestamp(lastSavedAt)} (localStorage + IndexedDB). Inicie ou construa em uma fase para salvar o snapshot tático.`;
      }
    }

    if (!this.el.saveSlotsGrid) return;
    const slots = saveManager.listSlots();
    this.el.saveSlotsGrid.innerHTML = '';

    for (let idx = 0; idx < 3; idx += 1) {
      const slotId = /** @type {1|2|3} */ (idx + 1);
      const slot = slots[idx];

      const card = document.createElement('div');
      card.className = `save-slot-card ${slot ? 'occupied' : ''}`;

      const header = document.createElement('div');
      header.className = 'slot-header';
      const titleEl = document.createElement('span');
      titleEl.className = 'slot-id';
      titleEl.textContent = `SLOT 0${slotId}`;
      const timeEl = document.createElement('span');
      timeEl.className = 'slot-time';
      timeEl.textContent = slot ? this.formatTimestamp(slot.savedAt) : 'VAZIO';
      header.append(titleEl, timeEl);

      const summary = document.createElement('div');
      summary.className = `slot-summary ${slot ? '' : 'empty'}`;
      if (slot) {
        const completedCount = Object.keys(slot.state.completedStages || {}).length;
        const m = slot.state.activeMission;
        const missionTxt = m
          ? `Fase ${m.worldId}-${m.stageId} (Onda ${m.completedWave}/${m.totalWaves}, ${m.towers.length} torres)`
          : `Campanha Fases concluídas: ${completedCount}/15`;
        summary.textContent = `${slot.label || missionTxt} — ${slot.state.warBonds} WB$`;
      } else {
        summary.textContent = 'Slot disponível. Salve aqui sua campanha completa + posição atual das torres.';
      }

      const actions = document.createElement('div');
      actions.className = 'slot-actions';

      const saveBtn = document.createElement('button');
      saveBtn.className = 'btn-slot-save';
      saveBtn.textContent = slot ? 'SOBRESCREVER' : 'SALVAR AQUI';
      saveBtn.addEventListener('click', () => {
        bus.emit('cmd:saveSlot', slotId);
      });

      const loadBtn = document.createElement('button');
      loadBtn.className = 'btn-slot-load';
      loadBtn.textContent = 'CARREGAR';
      loadBtn.disabled = !slot;
      loadBtn.addEventListener('click', () => {
        this.closeCampaignModal();
        this.el.goModal.classList.add('hidden');
        this.el.radioLog.innerHTML = '';
        bus.emit('cmd:loadSlot', slotId);
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-slot-del';
      delBtn.textContent = '✕';
      delBtn.title = 'Apagar este slot';
      delBtn.disabled = !slot;
      delBtn.addEventListener('click', () => {
        bus.emit('cmd:deleteSlot', slotId);
      });

      actions.append(saveBtn, loadBtn, delBtn);
      card.append(header, summary, actions);
      this.el.saveSlotsGrid.appendChild(card);
    }
  }

  renderState(s) {
    this.latestState = s;
    this.el.missionLabel.textContent = `MUNDO ${s.worldId} // FASE ${s.worldId}-${s.stageId}: ${s.stageTitle || ''}`;
    this.el.budget.textContent = `$${s.budget}`;
    this.el.wb.textContent = `${(s.warBonds ?? saveManager.getWarBonds()).toLocaleString()} WB$`;
    this.el.fob.textContent = `${s.fobHp} / ${s.fobMaxHp}`;
    this.el.fob.className = `metric-value ${
      s.fobHp <= 5 ? 'text-red' : s.fobHp <= 11 ? 'text-amber' : 'text-cyan'
    }`;
    this.el.wave.textContent = `${s.currentWave} / ${s.totalWaves}`;
    this.el.enemies.textContent = `${s.activeEnemies}`;
    this.el.kills.textContent = `${s.totalKills}`;

    if (s.hasGlobalAesa) {
      this.el.aesa.textContent = 'AESA ONLINE';
      this.el.aesa.classList.add('online');
    } else {
      this.el.aesa.textContent = 'AESA OFF';
      this.el.aesa.classList.remove('online');
    }

    this.renderSpeed(s.timeScale);

    if (s.currentWave === 0) {
      this.el.btnWave.disabled = false;
      this.el.btnWave.textContent = 'INICIAR ONDA 1';
    } else if (s.currentWave >= s.totalWaves) {
      this.el.btnWave.disabled = true;
      this.el.btnWave.textContent = s.waveActive ? 'ONDA FINAL EM CURSO' : 'OPERAÇÃO CONCLUÍDA';
    } else if (s.canCallEarly) {
      this.el.btnWave.disabled = false;
      const timerTxt = s.inIntermission ? ` (${s.wavePrepTimer}s)` : '';
      this.el.btnWave.textContent = `CHAMAR ONDA ${s.currentWave + 1}${timerTxt} +$${s.earlyBonus}`;
    } else {
      this.el.btnWave.disabled = true;
      this.el.btnWave.textContent = `ONDA ${s.currentWave} EM COMBATE`;
    }

    if (s.nextWave) {
      this.el.nextWaveNum.textContent = `ONDA ${s.nextWave.wave}`;
      this.el.nextWaveTitle.textContent = s.nextWave.title;
      this.el.nextWaveBrief.textContent = s.nextWave.brief;
      this.el.nextWaveUnits.innerHTML = '';
      for (const u of s.nextWave.units) {
        const pill = document.createElement('span');
        let cls = 'unit-pill';
        if (u.isBoss) cls += ' boss';
        else if (u.type === 'stealth') cls += ' stealth';
        else if (u.type === 'mbt') cls += ' heavy';
        else if (u.domain === 'air') cls += ' air';
        pill.className = cls;
        pill.textContent = `${u.count}x ${u.shortName} (${u.armorLabel})`;
        this.el.nextWaveUnits.appendChild(pill);
      }
    } else {
      this.el.nextWaveNum.textContent = 'FINAL';
      this.el.nextWaveTitle.textContent = 'Onda Final em Combate';
      this.el.nextWaveBrief.textContent = 'Elimine todas as forças hostis para vencer a fase!';
      this.el.nextWaveUnits.innerHTML = '';
    }

    this.refreshArsenalCardUnlockState();
    for (const [id, btn] of this.buildCards) {
      const unlocked = saveManager.isTowerUnlocked(id);
      const effCost = this.getEffectiveCost(id);
      btn.classList.toggle('unaffordable', unlocked && s.budget < effCost);
    }

    this.renderSupportButton('a10', s.airSupport.a10, s.budget, this.el.btnA10, this.el.cdA10, this.el.txtCdA10);
    this.renderSupportButton('hellfire', s.airSupport.hellfire, s.budget, this.el.btnHellfire, this.el.cdHellfire, this.el.txtCdHellfire);
    this.renderSupportButton('b52', s.airSupport.b52, s.budget, this.el.btnB52, this.el.cdB52, this.el.txtCdB52);

    if (this.selectedTower && this.selectedTower.nextUpgrade) {
      this.el.btnUpgrade.disabled = s.budget < this.selectedTower.nextUpgrade.cost;
    }
  }

  renderSupportButton(id, sup, budget, btn, fill, txt) {
    const unlocked = saveManager.isSupportUnlocked(id);
    if (!unlocked) {
      const def = AIR_SUPPORT_DEFINITIONS[id];
      fill.style.width = '0%';
      txt.textContent = `🔒 ${def.unlockCostWB} WB$`;
      txt.style.color = '#facc15';
      btn.disabled = false;
      btn.classList.add('locked');
      return;
    }
    btn.classList.remove('locked');
    if (id === 'b52') {
      this.el.costB52.textContent = `$${sup.cost}`;
    }

    const ready = sup.timer <= 0;
    const pct = ready ? 100 : Math.max(0, Math.min(100, ((sup.cooldown - sup.timer) / sup.cooldown) * 100));
    fill.style.width = `${pct}%`;
    fill.style.background = ready ? '#4ade80' : '#facc15';
    txt.textContent = ready
      ? budget >= sup.cost
        ? 'PRONTO PARA EMPREGO'
        : `FALTA $${sup.cost}`
      : `RECARGA: ${Math.ceil(sup.timer)}s`;
    txt.style.color = ready && budget >= sup.cost ? '#4ade80' : '#facc15';
    btn.disabled = !ready || budget < sup.cost;
  }

  renderSpeed(speed) {
    document.querySelectorAll('.btn-speed').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.speed) === speed);
    });
  }

  renderActiveTool(tool) {
    this.activeTool = tool;
    for (const [id, btn] of this.buildCards) {
      btn.classList.toggle('selected', tool?.kind === 'build' && tool.towerId === id);
    }
    this.el.btnA10.classList.toggle('selected', tool?.kind === 'support' && tool.supportId === 'a10');
    this.el.btnHellfire.classList.toggle('selected', tool?.kind === 'support' && tool.supportId === 'hellfire');
    this.el.btnB52.classList.toggle('selected', tool?.kind === 'support' && tool.supportId === 'b52');

    if (!tool) {
      this.el.toolBanner.classList.add('hidden');
      this.el.btnRotateA10?.classList.add('hidden');
      return;
    }
    this.setMobileSidebarOpen(false);
    this.el.toolBanner.classList.remove('hidden');
    const targetTextEl = this.el.toolBannerText || this.el.toolBanner;
    const isA10 = tool.kind === 'support' && tool.supportId === 'a10';
    this.el.btnRotateA10?.classList.toggle('hidden', !isA10);

    if (tool.kind === 'build') {
      const def = TOWER_DEFINITIONS[tool.towerId];
      const effCost = this.getEffectiveCost(tool.towerId);
      targetTextEl.textContent = `CONSTRUÇÃO: ${def.name} ($${effCost}) — Toque no grid para posicionar`;
    } else if (isA10) {
      targetTextEl.textContent = 'A-10 WARTHOG: Toque ou arraste no alvo para definir ataque';
    } else if (tool.supportId === 'b52') {
      targetTextEl.textContent = 'B-52 STRATOFORTRESS: Toque na rota para bombardeio em tapete';
    } else {
      targetTextEl.textContent = 'DRONE HELLFIRE: Toque no alvo para disparar míssil';
    }
  }

  setMobileSidebarOpen(open) {
    const shouldOpen = Boolean(open) && window.innerWidth <= 1024;
    this.el.tacticalSidebar?.classList.toggle('sidebar-open', shouldOpen);
    this.el.sidebarBackdrop?.classList.toggle('hidden', !shouldOpen);
  }

  renderInspector(tower) {
    this.selectedTower = tower;
    if (!tower) {
      this.el.inspLevel.textContent = 'NENHUMA';
      this.el.inspEmpty.classList.remove('hidden');
      this.el.inspBody.classList.add('hidden');
      return;
    }

    this.el.inspEmpty.classList.add('hidden');
    this.el.inspBody.classList.remove('hidden');
    this.el.inspLevel.textContent = `NV ${tower.level} / ${tower.maxLevel}`;
    this.el.inspName.textContent = tower.name;
    this.el.inspRole.textContent = `${tower.role} // ${
      tower.domain === 'air' ? 'EXCLUSIVO AÉREO' : tower.domain === 'ground' ? 'EXCLUSIVO TERRA' : tower.domain === 'both' ? 'TERRA + AR' : 'OBSTÁCULO'
    }${tower.empDisabled ? ' [EMP OFF]' : ''}`;
    this.el.inspTotalDmg.textContent = Math.round(tower.totalDamage).toLocaleString();
    this.el.inspKills.textContent = tower.kills;

    const hpPct = tower.maxHp > 0 ? Math.max(0, Math.min(100, (tower.hp / tower.maxHp) * 100)) : 100;
    this.el.inspHpText.textContent = `${tower.hp} / ${tower.maxHp}`;
    this.el.inspHpFill.style.width = `${hpPct}%`;
    this.el.inspHpFill.style.background = hpPct > 40 ? '#38bdf8' : hpPct > 20 ? '#fb923c' : '#ef4444';

    const needsRepair = tower.hp < tower.maxHp;
    this.el.btnRepair.disabled = !needsRepair || (this.latestState ? this.latestState.budget < tower.repairCost : false);
    this.el.btnRepair.textContent = needsRepair
      ? `🔧 REPARAR DEFESA ($${tower.repairCost}) [R]`
      : '✅ INTEGRIDADE 100%';

    if (tower.isBarrier) {
      this.el.inspSpecs.textContent = tower.notes;
      this.el.prioSection.classList.add('hidden');
    } else {
      this.el.inspSpecs.innerHTML = `
        Alcance: <strong>${tower.range}m</strong>${tower.minRange > 0 ? ` (Min ${tower.minRange}m)` : ''} |
        Cadência: <strong>${tower.fireRate > 0 ? `${tower.fireRate.toFixed(1)}/s` : 'Contínuo'}</strong> |
        Dano: <strong>${tower.damage}</strong><br/>
        <span>${tower.notes}</span>
      `;
      this.el.prioSection.classList.toggle('hidden', tower.isSupportAura);
      for (const [prioId, btn] of this.prioButtons) {
        btn.classList.toggle('active', tower.priority === prioId);
        const disallowed =
          (prioId === 'air_first' && tower.domain === 'ground') ||
          (tower.domain === 'air' && prioId === 'air_first');
        btn.disabled = disallowed;
      }
    }

    if (tower.nextUpgrade) {
      this.el.btnUpgrade.disabled = this.latestState ? this.latestState.budget < tower.nextUpgrade.cost : false;
      this.el.btnUpgradeTitle.textContent = `UPGRADE NV${tower.level + 1}: ${tower.nextUpgrade.name} ($${tower.nextUpgrade.cost})`;
      this.el.btnUpgradeDesc.textContent = tower.nextUpgrade.notes;
    } else {
      this.el.btnUpgrade.disabled = true;
      this.el.btnUpgradeTitle.textContent = 'NÍVEL MÁXIMO ATINGIDO';
      this.el.btnUpgradeDesc.textContent = 'Armamento operando em capacidade plena.';
    }

    this.el.btnSell.textContent = `VENDER TORRE (+$${tower.sellRefund})`;
  }

  appendRadio({ text, level, wave }) {
    const line = document.createElement('div');
    line.className = `radio-line ${level || 'info'}`;
    line.textContent = `[W${String(wave).padStart(2, '0')}] ${text}`;
    this.el.radioLog.prepend(line);
    while (this.el.radioLog.children.length > 24) {
      this.el.radioLog.removeChild(this.el.radioLog.lastChild);
    }
  }

  showGameOver({ victory, wave, totalWaves, kills, wbEarned, worldId, stageId }) {
    this.el.goModal.classList.remove('hidden');
    this.el.goBadge.textContent = victory ? `FASE ${worldId}-${stageId} CONCLUÍDA` : 'FOB PERDIDA // DEFCON 1';
    this.el.goTitle.textContent = victory ? 'VITÓRIA TÁTICA TOTAL' : 'DERROTA NA LINHA DE FRENTE';
    this.el.goTitle.style.color = victory ? '#4ade80' : '#f87171';
    this.el.goDesc.textContent = victory
      ? `Todas as ${totalWaves} ondas hostis foram neutralizadas. Rejogue para farmar mais War Bonds (WB$) ou avance para a próxima fase!`
      : 'As forças hostis romperam o perímetro. Rejogue fases anteriores para aprimorar seu Arsenal com War Bonds (WB$)!';
    this.el.goWave.textContent = `${wave} / ${totalWaves}`;
    this.el.goKills.textContent = `${kills}`;
    this.el.goWb.textContent = `+${wbEarned || 0} WB$`;

    const hasNext = victory && this.getNextStageIds(worldId, stageId) !== null;
    this.el.btnNextStage.classList.toggle('hidden', !hasNext);
  }
}
