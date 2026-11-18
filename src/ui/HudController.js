import { bus } from '../core/EventBus.js';
import {
  TOWER_DEFINITIONS,
  TOWER_BUILD_ORDER,
  TOWER_CATEGORIES,
  TARGET_PRIORITIES,
  AIR_SUPPORT_DEFINITIONS
} from '../data/towers.js';
import { WORLDS, getWorldConfig, getStageConfig } from '../data/worlds.js';
import { saveManager, MAX_TECH_LEVEL } from '../systems/SaveManager.ts';
import { getDamageTypeMeta } from '../systems/DamageSystem.js';
import { multiplayer, MAX_DECK_SIZE, MAX_PLAYERS } from '../systems/MultiplayerManager.ts';
import { formatColLabel } from '../three/TerrainDiorama3D.ts';

const TOWER_ICONS = {
  ballista: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18L20 6M6 6c4 3 8 7 12 12M12 4v16"/></svg>`,
  m2_bunker: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16h18M5 16l2-5h6l2 5M13 11h8M15 8v3M7 16v3M17 16v3"/></svg>`,
  bushmaster: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="9" height="6" rx="1"/><path d="M13 12h9M3 18h14M6 10l2-3h4l1 3"/></svg>`,
  sniper_tower: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="2"/></svg>`,
  cryo_tower: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/></svg>`,
  tesla_tower: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>`,
  toxic_tower: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/></svg>`,
  flamethrower: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3c2 3 5 5 5 10a5 5 0 1 1-10 0c0-3 2-5 3-7 0 2 2 3 2-3z"/></svg>`,
  railgun: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10h14M3 14h14M17 9l4 3-4 3M5 7v10"/></svg>`,
  harpoon_tower: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20L19 5M14 5h5v5M7 13l4 4"/></svg>`,
  minefield: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="5"/><path d="M12 5v3M6 8l2 2M18 8l-2 2M4 15h3M17 15h3"/></svg>`,
  eng_workshop: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5 2-2.5z"/></svg>`,
  energy_extractor: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12,3 20,8 20,16 12,21 4,16 4,8"/><circle cx="12" cy="12" r="3"/></svg>`,
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
    this.selectedEnemy = null;
    this.activeCategory = 'all';
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
      towersCount: document.getElementById('hud-towers-count'),
      aesa: document.getElementById('hud-aesa'),
      coord: document.getElementById('hud-coord'),
      btnInstallPwa: document.getElementById('btn-install-pwa'),
      btnSaveMenu: document.getElementById('btn-save-menu'),
      btnCoop: document.getElementById('btn-coop'),
      btnCampaignCoop: document.getElementById('btn-campaign-coop'),
      btnCampaign: document.getElementById('btn-campaign'),
      btnRepairAll: document.getElementById('btn-repair-all'),
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
      inspOwnerBadge: document.getElementById('insp-owner-badge'),
      inspName: document.getElementById('insp-name'),
      inspRole: document.getElementById('insp-role'),
      inspTotalDmg: document.getElementById('insp-total-dmg'),
      inspKills: document.getElementById('insp-kills'),
      inspHpText: document.getElementById('insp-hp-text'),
      inspHpFill: document.getElementById('insp-hp-fill'),
      inspShieldBox: document.getElementById('insp-shield-box'),
      inspShieldText: document.getElementById('insp-shield-text'),
      inspShieldFill: document.getElementById('insp-shield-fill'),
      inspSpecs: document.getElementById('insp-specs'),
      prioSection: document.getElementById('prio-section'),
      prioGrid: document.getElementById('prio-grid'),
      specChooser: document.getElementById('spec-chooser'),
      btnRepair: document.getElementById('btn-repair'),
      btnUpgrade: document.getElementById('btn-upgrade'),
      btnUpgradeTitle: document.getElementById('btn-upgrade-title'),
      btnUpgradeDesc: document.getElementById('btn-upgrade-desc'),
      btnSell: document.getElementById('btn-sell'),
      enemyInspPanel: document.getElementById('enemy-inspector-panel'),
      btnCloseEnemyInsp: document.getElementById('btn-close-enemy-insp'),
      enemyInspBody: document.getElementById('enemy-insp-body'),
      bossHudBar: document.getElementById('boss-hud-bar'),
      bossHudName: document.getElementById('boss-hud-name'),
      bossHudWeapon: document.getElementById('boss-hud-weapon'),
      bossHudFill: document.getElementById('boss-hud-fill'),
      bossHudHpText: document.getElementById('boss-hud-hp-text'),
      radioLog: document.getElementById('radio-log'),
      arsenalFilters: document.getElementById('arsenal-filters'),
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
      btnForceUpdatePwa: document.getElementById('btn-force-update-pwa'),
      pwaInstallHint: document.getElementById('pwa-install-hint'),
      coopSquadHud: document.getElementById('coop-squad-hud'),
      coopHudRoom: document.getElementById('coop-hud-room'),
      coopHudVotes: document.getElementById('coop-hud-votes'),
      coopRosterList: document.getElementById('coop-roster-list'),
      tacticalPingBar: document.getElementById('tactical-ping-bar'),
      coopModal: document.getElementById('coop-modal'),
      btnCloseCoop: document.getElementById('btn-close-coop'),
      coopStatusBadge: document.getElementById('coop-status-badge'),
      coopCallsignInput: document.getElementById('coop-callsign-input'),
      coopConnectControls: document.getElementById('coop-connect-controls'),
      btnCoopHost: document.getElementById('btn-coop-host'),
      coopJoinCode: document.getElementById('coop-join-code'),
      btnCoopJoin: document.getElementById('btn-coop-join'),
      coopActiveControls: document.getElementById('coop-active-controls'),
      coopRoomCode: document.getElementById('coop-room-code'),
      btnCoopCopy: document.getElementById('btn-coop-copy'),
      btnCoopTestTab: document.getElementById('btn-coop-test-tab'),
      btnCoopLeave: document.getElementById('btn-coop-leave'),
      coopSlotsGrid: document.getElementById('coop-slots-grid'),
      coopDeckCount: document.getElementById('coop-deck-count'),
      coopDeckGrid: document.getElementById('coop-deck-grid'),
      coopStageSelect: document.getElementById('coop-stage-select'),
      btnCoopReady: document.getElementById('btn-coop-ready'),
      btnCoopStart: document.getElementById('btn-coop-start'),
      coopTurnUrl: document.getElementById('coop-turn-url'),
      coopTurnUser: document.getElementById('coop-turn-user'),
      coopTurnPass: document.getElementById('coop-turn-pass'),
      btnCoopSaveTurn: document.getElementById('btn-coop-save-turn')
    };

    this.deferredInstallPrompt = null;
    this.buildArsenalCards();
    this.buildPriorityButtons();
    this.initCoopStageSelect();
    this.bindDomEvents();
    this.bindBusEvents();
    this.checkUrlCoopAutoJoin();
  }

  getEffectiveCost(towerId) {
    const def = TOWER_DEFINITIONS[towerId];
    const mults = saveManager.getTechMultipliers(towerId);
    return Math.max(10, Math.round(def.cost * mults.costMult));
  }

  buildArsenalCards() {
    if (this.el.arsenalFilters) {
      this.el.arsenalFilters.innerHTML = '';
      for (const cat of TOWER_CATEGORIES) {
        const fBtn = document.createElement('button');
        fBtn.className = `btn-filter-cat ${cat.id === this.activeCategory ? 'active' : ''}`;
        fBtn.dataset.category = cat.id;
        fBtn.textContent = cat.label;
        fBtn.addEventListener('click', () => {
          this.activeCategory = cat.id;
          this.applyArsenalCategoryFilter();
        });
        this.el.arsenalFilters.appendChild(fBtn);
      }
    }

    this.el.arsenalGrid.innerHTML = '';
    this.buildCards = new Map();

    for (const id of TOWER_BUILD_ORDER) {
      const def = TOWER_DEFINITIONS[id];
      const spec = def.levels[0];
      const btn = document.createElement('button');
      btn.className = 'build-card';
      btn.dataset.category = def.category || 'physical';
      btn.title = `${def.name} — ${def.summary} (${spec.notes})`;
      btn.innerHTML = `
        <div class="bc-top">
          <span class="hotkey">${def.hotkey || '·'}</span>
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
    this.applyArsenalCategoryFilter();
  }

  applyArsenalCategoryFilter() {
    if (this.el.arsenalFilters) {
      this.el.arsenalFilters.querySelectorAll('.btn-filter-cat').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.category === this.activeCategory);
      });
    }
    const coopDeck = multiplayer.isActive() ? new Set(multiplayer.getLoadout()) : null;
    for (const [id, btn] of this.buildCards) {
      const def = TOWER_DEFINITIONS[id];
      const inDeck = !coopDeck || coopDeck.has(id);
      const matchCat = this.activeCategory === 'all' || (def.category || 'physical') === this.activeCategory;
      btn.classList.toggle('hidden', !inDeck || !matchCat);
    }
  }

  initCoopStageSelect() {
    if (!this.el.coopStageSelect) return;
    this.el.coopStageSelect.innerHTML = '';
    for (const w of WORLDS) {
      for (const st of w.stages) {
        const opt = document.createElement('option');
        opt.value = `${st.worldId}-${st.stageId}`;
        opt.textContent = `${st.id}: ${st.title} (${w.region})`;
        this.el.coopStageSelect.appendChild(opt);
      }
    }
    if (this.el.coopCallsignInput) {
      this.el.coopCallsignInput.value = multiplayer.getCallsign();
    }
  }

  async checkUrlCoopAutoJoin() {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('join');
      if (code) {
        const allowPeerJs = params.get('transport') !== 'local';
        this.openCoopModal();
        if (this.el.coopJoinCode) this.el.coopJoinCode.value = code.toUpperCase();
        await this.handleJoinCoop(code, { allowPeerJs });
      }
    } catch {
      // Ignore invalid URL query parsing
    }
  }

  openCoopModal() {
    this.el.coopModal?.classList.remove('hidden');
    const ice = multiplayer.getCustomIceConfig?.();
    if (ice) {
      if (this.el.coopTurnUrl) this.el.coopTurnUrl.value = ice.urls || '';
      if (this.el.coopTurnUser) this.el.coopTurnUser.value = ice.username || '';
      if (this.el.coopTurnPass) this.el.coopTurnPass.value = ice.credential || '';
    }
    this.renderCoopLobby(multiplayer.getLobbyState());
  }

  closeCoopModal() {
    this.el.coopModal?.classList.add('hidden');
  }

  async handleJoinCoop(rawCode, opts = {}) {
    const code = String(rawCode || '').trim();
    if (!code) {
      this.showRadarAlert({ level: 'warn', text: 'Digite o código da sala Co-op (ex: DFC-7K9P).' });
      return;
    }
    if (this.el.coopStatusBadge) {
      this.el.coopStatusBadge.textContent = 'CONECTANDO...';
    }
    const res = await multiplayer.joinRoom(code, {
      timeoutMs: 7000,
      allowPeerJs: opts.allowPeerJs ?? true
    });
    if (!res.ok) {
      this.showRadarAlert({ level: 'alert', text: res.error || 'Falha ao conectar na sala Co-op.' });
      this.renderCoopLobby(multiplayer.getLobbyState());
    } else {
      this.showRadarAlert({ level: 'good', text: `Conectado ao Esquadrão ${multiplayer.getRoomCode()}!` });
      this.renderCoopLobby(res.lobby || multiplayer.getLobbyState());
      this.applyArsenalCategoryFilter();
    }
  }

  renderCoopLobby(lobby) {
    if (!this.el.coopModal) return;
    const isActive = Boolean(lobby?.active);
    const players = lobby?.players || [];
    const me = players.find((p) => p.peerId === multiplayer.localPeerId);

    if (this.el.btnCoop) {
      this.el.btnCoop.classList.toggle('online', isActive);
      this.el.btnCoop.textContent = isActive
        ? `🌐 CO-OP (${players.filter((p) => p.connected).length}/${MAX_PLAYERS})`
        : '🌐 CO-OP SQUAD (1-4P)';
    }

    if (this.el.coopStatusBadge) {
      this.el.coopStatusBadge.textContent = lobby?.statusText || 'SINGLEPLAYER';
    }
    this.el.coopConnectControls?.classList.toggle('hidden', isActive);
    this.el.coopActiveControls?.classList.toggle('hidden', !isActive);
    if (this.el.coopRoomCode) {
      this.el.coopRoomCode.textContent = lobby?.roomCode || 'DFC-XXXX';
    }

    if (this.el.coopStageSelect && isActive) {
      this.el.coopStageSelect.value = `${lobby.selectedWorld}-${lobby.selectedStage}`;
      this.el.coopStageSelect.disabled = !multiplayer.isHost();
    } else if (this.el.coopStageSelect) {
      this.el.coopStageSelect.disabled = false;
    }

    if (this.el.btnCoopReady) {
      this.el.btnCoopReady.disabled = !isActive || multiplayer.isHost();
      const ready = Boolean(me?.ready);
      this.el.btnCoopReady.textContent = ready ? '✅ PRONTO' : '⬜ MARCAR PRONTO';
    }
    if (this.el.btnCoopStart) {
      this.el.btnCoopStart.disabled = !isActive || !multiplayer.isHost();
      this.el.btnCoopStart.textContent = lobby?.inMatch
        ? `🔄 REINICIAR MISSÃO (${lobby.selectedWorld}-${lobby.selectedStage})`
        : '🚀 INICIAR MISSÃO CO-OP';
    }

    // 4 Commander Slot Cards
    if (this.el.coopSlotsGrid) {
      this.el.coopSlotsGrid.innerHTML = '';
      for (let i = 0; i < MAX_PLAYERS; i++) {
        const p = players.find((item) => item.slotIndex === i);
        const card = document.createElement('div');
        if (!p) {
          card.className = 'coop-slot-card empty';
          card.innerHTML = `<strong>SLOT P${i + 1} VAGO</strong><span>Aguardando comandante...</span>`;
        } else {
          card.className = 'coop-slot-card';
          card.style.borderTopColor = p.color;
          const chips = (p.loadout || [])
            .map((tid) => `<span class="coop-deck-chip">${TOWER_DEFINITIONS[tid]?.shortName || tid}</span>`)
            .join('');
          const statusLabel = p.isHost
            ? 'HOST'
            : p.status === 'RECONNECTING'
              ? '<span class="coop-reconnecting-tag">⏳ RECONECTANDO (20s)...</span>'
              : p.connected
                ? 'ONLINE'
                : 'OFF';
          const canKick = Boolean(lobby?.isHost && !lobby?.inMatch && i > 0);
          card.innerHTML = `
            <div class="coop-slot-top">
              <span style="color:${p.color}">P${i + 1} • ${p.callsign}</span>
              <span>${statusLabel}</span>
            </div>
            <div class="coop-slot-status">
              <span>${p.ready ? '✅ PRONTO' : '⏳ EQUIPANDO'}</span>
              <span>${p.pingMs || 0} ms</span>
              ${canKick ? `<button type="button" class="btn-kick-slot" data-kick-peer="${p.peerId}">[EXPULSAR]</button>` : ''}
            </div>
            <div class="coop-slot-deck">${chips}</div>
          `;
          if (canKick) {
            card.querySelector('[data-kick-peer]')?.addEventListener('click', () => {
              multiplayer.kickPlayer(p.peerId);
            });
          }
        }
        this.el.coopSlotsGrid.appendChild(card);
      }
    }

    // 6-Tower Tactical Deck Selector
    const myDeck = multiplayer.getLoadout();
    if (this.el.coopDeckCount) {
      this.el.coopDeckCount.textContent = `${myDeck.length} / ${MAX_DECK_SIZE} TORRES`;
    }
    if (this.el.coopDeckGrid) {
      this.el.coopDeckGrid.innerHTML = '';
      for (const id of TOWER_BUILD_ORDER) {
        const def = TOWER_DEFINITIONS[id];
        const unlocked = saveManager.isTowerUnlocked(id);
        const inDeck = myDeck.includes(id);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `coop-deck-btn ${inDeck ? 'selected' : ''}`;
        btn.disabled = !unlocked || (!inDeck && myDeck.length >= MAX_DECK_SIZE);
        btn.title = def.summary;
        btn.innerHTML = `<span>${inDeck ? '✔ ' : ''}${def.shortName}</span><small>${unlocked ? `$${def.cost}` : '🔒'}</small>`;
        btn.addEventListener('click', () => {
          const cur = multiplayer.getLoadout();
          if (cur.includes(id)) {
            if (cur.length > 1) {
              multiplayer.setLoadout(cur.filter((x) => x !== id));
              this.applyArsenalCategoryFilter();
            }
          } else if (cur.length < MAX_DECK_SIZE) {
            multiplayer.setLoadout([...cur, id]);
            this.applyArsenalCategoryFilter();
          }
        });
        this.el.coopDeckGrid.appendChild(btn);
      }
    }
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
    this.el.btnForceUpdatePwa?.addEventListener('click', async () => {
      bus.emit('cmd:forceSave');
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
      } catch {
        // Ignore cache/SW cleanup errors and still force network reload
      }
      const url = new URL(window.location.href);
      url.searchParams.set('v', String(Date.now()));
      window.location.replace(url.toString());
    });

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

    this.el.btnRepairAll?.addEventListener('click', () => bus.emit('cmd:repairAllTowers'));
    this.el.btnCloseEnemyInsp?.addEventListener('click', () => {
      this.selectedEnemy = null;
      this.el.enemyInspPanel?.classList.add('hidden');
    });
    this.el.btnRepair.addEventListener('click', () => bus.emit('cmd:repairTower'));
    this.el.btnUpgrade.addEventListener('click', () => bus.emit('cmd:upgradeTower'));
    this.el.btnSell.addEventListener('click', () => bus.emit('cmd:sellTower'));
    this.el.btnA10.addEventListener('click', () => bus.emit('cmd:selectSupport', 'a10'));
    this.el.btnHellfire.addEventListener('click', () => bus.emit('cmd:selectSupport', 'hellfire'));
    this.el.btnB52.addEventListener('click', () => bus.emit('cmd:selectSupport', 'b52'));
    this.el.btnMute.addEventListener('click', () => bus.emit('cmd:toggleMute'));

    this.el.tacticalPingBar?.querySelectorAll('.btn-ping').forEach((btn) => {
      btn.addEventListener('click', () => {
        bus.emit('cmd:armPing', btn.dataset.ping);
      });
    });

    this.el.btnCoop?.addEventListener('click', () => this.openCoopModal());
    this.el.btnCampaignCoop?.addEventListener('click', () => {
      this.closeCampaignModal();
      this.openCoopModal();
    });
    this.el.btnCloseCoop?.addEventListener('click', () => this.closeCoopModal());
    this.el.coopCallsignInput?.addEventListener('change', (e) => {
      multiplayer.setCallsign(e.target.value);
    });
    this.el.btnCoopHost?.addEventListener('click', () => {
      multiplayer.setCallsign(this.el.coopCallsignInput?.value || multiplayer.getCallsign());
      const [wId, sId] = (this.el.coopStageSelect?.value || '1-1').split('-').map(Number);
      multiplayer.createRoom(wId || 1, sId || 1, this.latestState?.budget || 750);
      this.applyArsenalCategoryFilter();
      this.showRadarAlert({ level: 'good', text: `Sala Co-op criada: ${multiplayer.getRoomCode()}` });
    });
    this.el.btnCoopJoin?.addEventListener('click', () => {
      multiplayer.setCallsign(this.el.coopCallsignInput?.value || multiplayer.getCallsign());
      void this.handleJoinCoop(this.el.coopJoinCode?.value);
    });
    this.el.btnCoopCopy?.addEventListener('click', () => {
      const code = multiplayer.getRoomCode();
      if (code && navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(code);
      }
      this.showRadarAlert({ level: 'info', text: `Código ${code} copiado para a área de transferência!` });
    });
    this.el.btnCoopTestTab?.addEventListener('click', () => {
      const code = multiplayer.getRoomCode();
      if (!code) return;
      const sep = window.location.search ? '&' : '?';
      window.open(`${window.location.href.split('#')[0]}${sep}join=${encodeURIComponent(code)}&transport=local`, '_blank');
    });
    this.el.btnCoopSaveTurn?.addEventListener('click', () => {
      const urls = String(this.el.coopTurnUrl?.value || '').trim();
      const username = String(this.el.coopTurnUser?.value || '').trim();
      const credential = String(this.el.coopTurnPass?.value || '').trim();
      if (!urls) {
        multiplayer.setCustomIceConfig(null);
        this.showRadarAlert({ level: 'info', text: 'STUN/TURN personalizado limpo. Usando STUN Google padrão.' });
        return;
      }
      multiplayer.setCustomIceConfig({ urls, username: username || undefined, credential: credential || undefined });
      this.showRadarAlert({ level: 'good', text: 'Servidor STUN/TURN salvo para novas conexões P2P!' });
    });
    this.el.btnCoopLeave?.addEventListener('click', () => {
      multiplayer.leaveRoom(true);
      this.applyArsenalCategoryFilter();
    });
    this.el.coopStageSelect?.addEventListener('change', (e) => {
      const [wId, sId] = String(e.target.value || '1-1').split('-').map(Number);
      multiplayer.selectStage(wId || 1, sId || 1);
    });
    this.el.btnCoopReady?.addEventListener('click', () => {
      const me = multiplayer.getLocalPlayer();
      multiplayer.setReady(!me?.ready);
    });
    this.el.btnCoopStart?.addEventListener('click', () => {
      if (!multiplayer.isHost()) return;
      const [wId, sId] = (this.el.coopStageSelect?.value || '1-1').split('-').map(Number);
      this.closeCoopModal();
      bus.emit('cmd:coopStartMatch', { worldId: wId || 1, stageId: sId || 1 });
    });

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
    if (worldId < 4) return { worldId: worldId + 1, stageId: 1 };
    return null;
  }

  bindBusEvents() {
    bus.on('hud:state', (state) => this.renderState(state));
    bus.on('hud:speed', (speed) => this.renderSpeed(speed));
    bus.on('hud:tool', (tool) => this.renderActiveTool(tool));
    bus.on('hud:selectedTower', (tower) => this.renderInspector(tower));
    bus.on('hud:selectedEnemy', (enemy) => this.renderEnemyInspector(enemy));
    bus.on('coop:lobbyState', (lobby) => {
      this.renderCoopLobby(lobby);
      this.applyArsenalCategoryFilter();
    });
    bus.on('coop:hostSignalLost', ({ lost } = {}) => {
      if (lost) {
        const msg = '⚠️ SINAL DO HOST PERDIDO — TENTANDO RECONEXÃO...';
        this.showRadarAlert({ level: 'alert', text: msg });
        this.appendRadio({ text: msg, level: 'alert', wave: this.latestState?.currentWave || 0 });
      } else {
        const msg = '🟢 SINAL DO HOST RESTABELECIDO — SIMULAÇÃO SINCRONIZADA!';
        this.showRadarAlert({ level: 'good', text: msg });
        this.appendRadio({ text: msg, level: 'good', wave: this.latestState?.currentWave || 0 });
      }
    });
    bus.on('hud:pingArmed', (pingType) => {
      this.el.tacticalPingBar?.querySelectorAll('.btn-ping').forEach((btn) => {
        btn.classList.toggle('active', Boolean(pingType && btn.dataset.ping === pingType));
      });
      if (pingType) {
        this.el.toolBanner?.classList.remove('hidden');
        this.el.btnRotateA10?.classList.add('hidden');
        if (this.el.toolBannerText) {
          this.el.toolBannerText.textContent = `PING TÁTICO [${pingType}]: Clique no mapa 3D para marcar localização (Botão direito cancela)`;
        }
      } else if (!this.activeTool) {
        this.el.toolBanner?.classList.add('hidden');
      }
    });
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
        ${st.difficulty ? `<div class="st-diff">Dificuldade: ${st.difficulty}</div>` : ''}
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
          : `Campanha Fases concluídas: ${completedCount}/20`;
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
    if (this.el.towersCount) {
      this.el.towersCount.textContent = `${s.towerCount ?? 0} / ${s.maxTowers ?? 30}`;
    }

    if (s.hasGlobalAesa) {
      this.el.aesa.textContent = 'AESA ONLINE';
      this.el.aesa.classList.add('online');
    } else {
      this.el.aesa.textContent = 'AESA OFF';
      this.el.aesa.classList.remove('online');
    }

    this.renderSpeed(s.timeScale);

    const activeSquadCount =
      s.coopPlayers?.filter((p) => p.connected || p.status === 'RECONNECTING').length || 0;
    const voteCount = (s.waveVotes || []).length;
    const voteClock = voteCount > 0 && s.waveVoteTimer > 0 ? ` • ${s.waveVoteTimer}s` : '';
    const voteSuffix =
      s.coopActive && activeSquadCount > 1
        ? ` [${voteCount}/${s.requiredVotes || 2}${voteClock}]`
        : '';

    if (s.currentWave === 0) {
      this.el.btnWave.disabled = false;
      this.el.btnWave.textContent = `INICIAR ONDA 1${voteSuffix}`;
    } else if (s.currentWave >= s.totalWaves) {
      this.el.btnWave.disabled = true;
      this.el.btnWave.textContent = s.waveActive ? 'ONDA FINAL EM CURSO' : 'OPERAÇÃO CONCLUÍDA';
    } else if (s.canCallEarly) {
      this.el.btnWave.disabled = false;
      const timerTxt = s.inIntermission ? ` (${s.wavePrepTimer}s)` : '';
      this.el.btnWave.textContent = `CHAMAR ONDA ${s.currentWave + 1}${timerTxt}${voteSuffix} +$${s.earlyBonus}`;
    } else {
      this.el.btnWave.disabled = true;
      this.el.btnWave.textContent = `ONDA ${s.currentWave} EM COMBATE`;
    }

    if (this.el.coopSquadHud) {
      this.el.coopSquadHud.classList.toggle('hidden', !s.coopActive);
      if (s.coopActive && this.el.coopRosterList) {
        const lobbyState = multiplayer.getLobbyState();
        const hasReconnecting = (s.coopPlayers || []).some((p) => p.status === 'RECONNECTING');
        const hostLost = multiplayer.isHostSignalLost?.() || lobbyState.hostSignalLost;
        const syncBadge = hostLost
          ? '<span class="coop-sync-badge warn">⚠️ SINAL HOST PERDIDO</span>'
          : hasReconnecting
            ? '<span class="coop-sync-badge reconnecting">⏳ RECONECTANDO</span>'
            : '<span class="coop-sync-badge">● SYNC OK</span>';
        if (this.el.coopHudRoom) {
          this.el.coopHudRoom.innerHTML = `ESQUADRÃO ${s.coopRoomCode || ''} ${syncBadge}`;
        }
        if (this.el.coopHudVotes) {
          const cnt = s.coopPlayers?.filter((p) => p.connected).length || 1;
          this.el.coopHudVotes.textContent =
            cnt > 1
              ? `VOTOS: ${voteCount}/${s.requiredVotes || 2}${voteClock}`
              : '1P';
        }
        this.el.coopRosterList.innerHTML = '';
        for (const p of s.coopPlayers || []) {
          const row = document.createElement('div');
          row.className = 'coop-roster-row';
          row.style.borderLeftColor = p.color;
          const isMe = p.peerId === multiplayer.localPeerId;
          const statusTag = p.status === 'RECONNECTING' ? ' • ⏳ RECONECTANDO (20s)' : '';
          row.innerHTML = `
            <div class="coop-roster-info">
              <span class="coop-roster-name" style="color:${p.color}">${p.callsign}${isMe ? ' (VOCÊ)' : ''}</span>
              <span class="coop-roster-meta">$${Math.floor(p.budget)} • 🗼${p.towerCount}/${p.maxTowers} • ${p.pingMs || 0}ms${statusTag}</span>
            </div>
          `;
          if (!isMe && p.connected) {
            for (const amount of [100, 250]) {
              const sendBtn = document.createElement('button');
              sendBtn.type = 'button';
              sendBtn.className = 'btn-donate-cash btn-donate-chip';
              sendBtn.dataset.donatePeer = p.peerId;
              sendBtn.dataset.donateAmount = String(amount);
              sendBtn.textContent = `+$${amount}`;
              sendBtn.disabled = s.budget < amount;
              sendBtn.title = `Enviar $${amount} do seu orçamento para ${p.callsign}`;
              sendBtn.addEventListener('click', () => {
                bus.emit('cmd:donateCash', { toPlayerId: p.peerId, amount });
              });
              row.appendChild(sendBtn);
            }
          }
          this.el.coopRosterList.appendChild(row);
        }
      }
    }

    if (s.nextWave) {
      this.el.nextWaveNum.textContent = `ONDA ${s.nextWave.wave}`;
      this.el.nextWaveTitle.textContent = s.nextWave.title;
      this.el.nextWaveBrief.textContent = s.nextWave.brief;
      this.el.nextWaveUnits.innerHTML = '';
      for (const u of s.nextWave.units) {
        const pill = document.createElement('button');
        pill.type = 'button';
        let cls = 'unit-pill clickable';
        if (u.isBoss) cls += ' boss';
        else if (u.type === 'stealth' || u.type === 'cacador_furtivo') cls += ' stealth';
        else if (u.type === 'mbt' || u.type === 'brutamontes' || u.type === 'escudeiro') cls += ' heavy';
        else if (u.domain === 'air') cls += ' air';
        pill.className = cls;
        pill.title = 'Clique para inspecionar armas e resistências';
        pill.textContent = `${u.count}x ${u.shortName} (${u.armorLabel})`;
        pill.addEventListener('click', () => bus.emit('cmd:inspectEnemy', u.type));
        this.el.nextWaveUnits.appendChild(pill);
      }
    } else {
      this.el.nextWaveNum.textContent = 'FINAL';
      this.el.nextWaveTitle.textContent = 'Onda Final em Combate';
      this.el.nextWaveBrief.textContent = 'Elimine todas as forças hostis para vencer a fase!';
      this.el.nextWaveUnits.innerHTML = '';
    }

    if (this.el.btnRepairAll) {
      const damagedCount = s.damagedTowerCount || 0;
      const repCost = s.repairAllCost || 0;
      this.el.btnRepairAll.classList.toggle('hidden', damagedCount === 0);
      if (damagedCount > 0) {
        this.el.btnRepairAll.textContent = `🔧 REPARAR TUDO (${damagedCount}) $${repCost}`;
        this.el.btnRepairAll.disabled = s.budget < repCost;
      }
    }

    if (this.el.bossHudBar) {
      if (s.activeBoss) {
        const b = s.activeBoss;
        const pct = b.maxHp > 0 ? Math.max(0, Math.min(100, (b.hp / b.maxHp) * 100)) : 0;
        this.el.bossHudBar.classList.remove('hidden');
        this.el.bossHudName.textContent = `💀 ${b.name}`;
        this.el.bossHudWeapon.textContent = b.weaponName ? `Arma: ${b.weaponName}` : '';
        this.el.bossHudFill.style.width = `${pct}%`;
        this.el.bossHudHpText.textContent =
          b.maxShield > 0 && b.shield > 0
            ? `HP ${b.hp.toLocaleString()} / ${b.maxHp.toLocaleString()} | ESCUDO ${b.shield.toLocaleString()}`
            : `HP ${b.hp.toLocaleString()} / ${b.maxHp.toLocaleString()}`;
      } else {
        this.el.bossHudBar.classList.add('hidden');
      }
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
    if (this.el.specChooser && !this.el.specChooser.classList.contains('hidden')) {
      this.el.specChooser.querySelectorAll('.spec-card-btn').forEach((btn) => {
        const c = Number(btn.dataset.cost || 0);
        btn.disabled = s.budget < c;
      });
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
    if (this.el.inspOwnerBadge) {
      if (tower.ownerName) {
        this.el.inspOwnerBadge.classList.remove('hidden');
        this.el.inspOwnerBadge.textContent = `COMANDANTE: ${tower.ownerName}`;
        this.el.inspOwnerBadge.style.color = tower.ownerColor || '#38bdf8';
      } else {
        this.el.inspOwnerBadge.classList.add('hidden');
      }
    }
    const specSuffix = tower.specialization ? ` // SPEC ${tower.specialization}` : '';
    this.el.inspLevel.textContent = `NV ${tower.level} / ${tower.maxLevel}${specSuffix}`;
    this.el.inspName.textContent = tower.name;

    const tags = [];
    if (tower.empDisabled) tags.push('[EMP OFF]');
    if (tower.fogDebuff) tags.push('[NEBLINA -22% ALC]');
    if (tower.burning) tags.push('[EM CHAMAS]');
    if (tower.corroded) tags.push('[CORROÍDA]');
    if (tower.chilled) tags.push('[RESFRIADA]');

    this.el.inspRole.textContent = `${tower.role} // ${
      tower.domain === 'air' ? 'EXCLUSIVO AÉREO' : tower.domain === 'ground' ? 'EXCLUSIVO TERRA' : tower.domain === 'both' ? 'TERRA + AR' : 'OBSTÁCULO'
    }${tags.length ? ' ' + tags.join(' ') : ''}`;
    this.el.inspTotalDmg.textContent = Math.round(tower.totalDamage).toLocaleString();
    this.el.inspKills.textContent = tower.kills;

    const hpPct = tower.maxHp > 0 ? Math.max(0, Math.min(100, (tower.hp / tower.maxHp) * 100)) : 100;
    this.el.inspHpText.textContent = `${tower.hp} / ${tower.maxHp}`;
    this.el.inspHpFill.style.width = `${hpPct}%`;
    this.el.inspHpFill.style.background = hpPct > 40 ? '#38bdf8' : hpPct > 20 ? '#fb923c' : '#ef4444';

    if (this.el.inspShieldBox) {
      if (tower.maxShield > 0) {
        this.el.inspShieldBox.classList.remove('hidden');
        this.el.inspShieldText.textContent = `${tower.shield} / ${tower.maxShield}`;
        const shPct = Math.max(0, Math.min(100, (tower.shield / tower.maxShield) * 100));
        this.el.inspShieldFill.style.width = `${shPct}%`;
      } else {
        this.el.inspShieldBox.classList.add('hidden');
      }
    }

    const needsRepair = tower.hp < tower.maxHp || tower.burning || tower.corroded || tower.chilled;
    this.el.btnRepair.disabled = !needsRepair || (this.latestState ? this.latestState.budget < tower.repairCost : false);
    this.el.btnRepair.textContent = needsRepair
      ? `🔧 REPARAR DEFESA ($${tower.repairCost}) [R]`
      : '✅ INTEGRIDADE 100%';

    const dmgMeta = getDamageTypeMeta(tower.damageType);
    if (tower.isBarrier) {
      this.el.inspSpecs.textContent = tower.notes;
      this.el.prioSection.classList.add('hidden');
    } else {
      this.el.inspSpecs.innerHTML = `
        Tipo: <strong style="color:${dmgMeta.color}">${dmgMeta.label}</strong> |
        Alcance: <strong>${tower.range}m</strong>${tower.minRange > 0 ? ` (Mín ${tower.minRange}m)` : ''}<br/>
        Cadência: <strong>${tower.fireRate > 0 ? `${tower.fireRate.toFixed(1)}/s` : 'Contínuo'}</strong> |
        Dano: <strong>${tower.damage}</strong><br/>
        <span>${tower.notes}</span>
        ${tower.specPros ? `<br/><small style="color:#86efac">+ ${tower.specPros}</small>` : ''}
        ${tower.specCons ? `<br/><small style="color:#fca5a5">- ${tower.specCons}</small>` : ''}
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

    const canModify = tower.canModify !== false;
    const upOpt = tower.upgradeOptions;
    if (upOpt && upOpt.kind === 'specialize' && this.el.specChooser) {
      this.el.btnUpgrade.classList.add('hidden');
      this.el.specChooser.classList.remove('hidden');
      this.el.specChooser.innerHTML = '';
      for (const bKey of ['A', 'B']) {
        const br = upOpt.branches[bKey];
        if (!br) continue;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `spec-card-btn ${bKey === 'B' ? 'branch-b' : ''}`;
        btn.dataset.cost = String(br.cost);
        btn.disabled = !canModify || (this.latestState ? this.latestState.budget < br.cost : false);
        btn.innerHTML = `
          <div class="spec-card-head">
            <span>ESPECIALIZAÇÃO ${bKey}: ${br.name}</span>
            <span>$${br.cost}</span>
          </div>
          <div class="spec-card-pros">+ ${br.pros}</div>
          <div class="spec-card-cons">- ${br.cons}</div>
        `;
        btn.addEventListener('click', () => bus.emit('cmd:specializeTower', bKey));
        this.el.specChooser.appendChild(btn);
      }
    } else {
      this.el.btnUpgrade.classList.remove('hidden');
      this.el.specChooser?.classList.add('hidden');
      if (!canModify) {
        this.el.btnUpgrade.disabled = true;
        this.el.btnUpgradeTitle.textContent = `TORRE DE ${tower.ownerName || 'ALIADO'}`;
        this.el.btnUpgradeDesc.textContent = 'Apenas o dono pode aprimorar/vender. Você pode reparar [R]!';
      } else if (tower.nextUpgrade) {
        this.el.btnUpgrade.disabled = this.latestState ? this.latestState.budget < tower.nextUpgrade.cost : false;
        this.el.btnUpgradeTitle.textContent = `UPGRADE NV${tower.level + 1}: ${tower.nextUpgrade.name} ($${tower.nextUpgrade.cost})`;
        this.el.btnUpgradeDesc.textContent = tower.nextUpgrade.notes;
      } else {
        this.el.btnUpgrade.disabled = true;
        this.el.btnUpgradeTitle.textContent = tower.specialization
          ? `ESPECIALIZAÇÃO ${tower.specialization} MÁXIMA`
          : 'NÍVEL MÁXIMO ATINGIDO';
        this.el.btnUpgradeDesc.textContent = 'Armamento operando em capacidade plena.';
      }
    }

    for (const [, btn] of this.prioButtons) {
      if (!canModify) btn.disabled = true;
    }

    this.el.btnSell.disabled = !canModify;
    this.el.btnSell.textContent = canModify
      ? `VENDER TORRE (+$${tower.sellRefund})`
      : 'TORRE ALIADA (BLOQUEADO)';
  }

  renderEnemyInspector(enemy) {
    this.selectedEnemy = enemy;
    if (!this.el.enemyInspPanel || !this.el.enemyInspBody) return;
    if (!enemy) {
      this.el.enemyInspPanel.classList.add('hidden');
      return;
    }

    this.el.enemyInspPanel.classList.remove('hidden');
    const atk = enemy.towerAttack;
    const resEntries = Object.entries(enemy.resistances || {}).filter(([, val]) => Math.abs(val - 1.0) >= 0.08);
    const resHtml = resEntries
      .map(([typeKey, val]) => {
        const meta = getDamageTypeMeta(typeKey);
        const pct = Math.round(val * 100);
        const cls = val > 1.0 ? 'weak' : 'resist';
        return `<span class="res-tag ${cls}">${meta.short} ${pct}%</span>`;
      })
      .join('');

    const atkDmgMeta = atk ? getDamageTypeMeta(atk.damageType) : null;
    this.el.enemyInspBody.innerHTML = `
      <div class="insp-name">${enemy.name}</div>
      <div class="insp-role">${enemy.isPreview ? 'INTEL DE ONDA' : 'ALVO EM COMBATE'} // ${enemy.domain === 'air' ? 'AÉREO' : 'TERRESTRE'} (${(enemy.armorClass || 'light').toUpperCase()})</div>
      <div class="insp-specs">
        HP: <strong>${enemy.hp} / ${enemy.maxHp}</strong>
        ${enemy.maxShield > 0 ? ` | Escudo: <strong style="color:#22d3ee">${enemy.shield} / ${enemy.maxShield}</strong>` : ''}<br/>
        Vel: <strong>${enemy.speed}</strong> | Recompensa: <strong style="color:#4ade80">+$${enemy.reward}</strong> | FOB: <strong>-${enemy.fobDamage}</strong>
        ${enemy.isStealth ? ' | <strong style="color:#38bdf8">FURTIVO</strong>' : ''}
        ${enemy.isBurrowed ? ' | <strong style="color:#f59e0b">SUBTERRÂNEO</strong>' : ''}<br/>
        ${
          atk
            ? `Arma: <strong>${atk.weaponName || enemy.weaponName}</strong> (${atk.damage} <span style="color:${atkDmgMeta?.color}">${atkDmgMeta?.short}</span>, Alc ${atk.range}m, ${atk.interval}s)<br/>`
            : ''
        }
        <span>${enemy.roleSummary || ''}</span>
      </div>
      ${resHtml ? `<div class="enemy-res-grid">${resHtml}</div>` : ''}
    `;
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

  showGameOver({ victory, wave, totalWaves, kills, wbEarned, worldId, stageId, coopBonusPercent = 0 }) {
    this.el.goModal.classList.remove('hidden');
    this.el.goBadge.textContent = victory ? `FASE ${worldId}-${stageId} CONCLUÍDA` : 'FOB PERDIDA // DEFCON 1';
    this.el.goTitle.textContent = victory ? 'VITÓRIA TÁTICA TOTAL' : 'DERROTA NA LINHA DE FRENTE';
    this.el.goTitle.style.color = victory ? '#4ade80' : '#f87171';
    this.el.goDesc.textContent = victory
      ? `Todas as ${totalWaves} ondas hostis foram neutralizadas.${coopBonusPercent > 0 ? ` Bônus de Esquadrão Co-op (+${coopBonusPercent}% WB$) concedido!` : ''} Rejogue para farmar mais War Bonds (WB$) ou avance para a próxima fase!`
      : 'As forças hostis romperam o perímetro. Rejogue fases anteriores para aprimorar seu Arsenal com War Bonds (WB$)!';
    this.el.goWave.textContent = `${wave} / ${totalWaves}`;
    this.el.goKills.textContent = `${kills}`;
    this.el.goWb.textContent = `+${wbEarned || 0} WB$`;

    const hasNext = victory && this.getNextStageIds(worldId, stageId) !== null;
    this.el.btnNextStage.classList.toggle('hidden', !hasNext);
  }
}
