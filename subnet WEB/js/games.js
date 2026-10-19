/**
 * Subnet Master - Interactive Game Modes
 * Subnet Slicer (VLSM), Speed Subnetter, Binary Matrix, and University Exam Arena.
 */

const SubnetGames = (() => {
  // Shared Player Stats
  let playerStats = {
    xp: 0,
    level: 1,
    highScore: 0,
    solvedChallenges: 0,
    badges: []
  };

  // Load saved stats
  try {
    const saved = localStorage.getItem('subnet_master_stats');
    if (saved) {
      playerStats = Object.assign(playerStats, JSON.parse(saved));
    }
  } catch (e) {}

  function saveStats() {
    try {
      localStorage.setItem('subnet_master_stats', JSON.stringify(playerStats));
    } catch (e) {}
    updateStatsUI();
  }

  function addXP(amount) {
    playerStats.xp += amount;
    const oldLevel = playerStats.level;
    playerStats.level = Math.floor(playerStats.xp / 100) + 1;
    saveStats();

    if (playerStats.level > oldLevel) {
      SoundFX.levelUp();
      showNotification(`🎉 ${t('levelLabel')}: ${getLevelRank(playerStats.level)}!`);
    } else {
      showNotification(t('xpEarned', { xp: amount }));
    }
  }

  function getLevelRank(lvl) {
    if (lvl <= 2) return t('rankBeginner');
    if (lvl <= 4) return t('rankApprentice');
    if (lvl <= 7) return t('rankProfessional');
    if (lvl <= 10) return t('rankMaster');
    return t('rankArchitect');
  }

  function updateStatsUI() {
    const xpEl = document.getElementById('playerXpDisplay');
    const lvlEl = document.getElementById('playerLevelDisplay');
    const rankEl = document.getElementById('playerRankBadge');
    const fillEl = document.getElementById('playerXpProgressFill');
    if (xpEl) xpEl.textContent = playerStats.xp;
    if (lvlEl) lvlEl.textContent = playerStats.level;
    if (rankEl) rankEl.textContent = getLevelRank(playerStats.level);
    if (fillEl) {
      const currentLevelProgress = Math.max(5, playerStats.xp % 100);
      fillEl.style.width = `${currentLevelProgress}%`;
    }
  }

  function showNotification(msg) {
    const toast = document.getElementById('gameToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /* ==========================================================================
     GAME 1: IP DETECTIVE & NETWORK TROUBLESHOOTER (REPLACING SUBNET SLICER)
     ========================================================================== */
  const detectiveCases = [
    {
      id: 1,
      badgeKu: "🚨 کەیسی ١ / ٤",
      badgeEn: "🚨 Case 1 / 4",
      difficultyKu: "ئاست: سەرەتایی",
      difficultyEn: "Difficulty: Easy",
      titleKu: "پچڕانی تۆڕ لە تاقیگەی کۆلێژی زانست",
      titleEn: "Network Outage at College of Science Lab",
      descKu: "ئەرکی تۆ: ئامێرە پچڕاوەکان بپشکنە، کێشەی ڕێکخستنی ئایپی، ماسک یان گەیتوەی دیاری بکە و تۆڕەکە چاکبکەوە!",
      descEn: "Mission: Inspect offline devices, identify IP/mask/gateway configuration bugs, and restore network connectivity!",
      networkIp: "192.168.1.0",
      cidr: 24,
      gateway: "192.168.1.1",
      mask: "255.255.255.0",
      broadcast: "192.168.1.255",
      devices: [
        {
          id: "sci_pc1",
          nameKu: "کۆمپیوتەری سەرپەرشتیار (PC-Admin)",
          nameEn: "Supervisor PC (PC-Admin)",
          icon: "fa-desktop",
          type: "desktop",
          ip: "192.168.1.10",
          mask: "255.255.255.0",
          gateway: "192.168.1.1",
          isFaulty: false,
          faultField: null,
          pingStatus: "Reply from 192.168.1.1: bytes=32 time=1.2ms (Online)"
        },
        {
          id: "sci_pc2",
          nameKu: "کۆمپیوتەری خوێندکار (PC-Lab-03)",
          nameEn: "Student Station (PC-Lab-03)",
          icon: "fa-desktop",
          type: "desktop",
          ip: "192.168.1.255",
          mask: "255.255.255.0",
          gateway: "192.168.1.1",
          isFaulty: true,
          faultField: "ip",
          errorSnippetKu: "پەیوەندی نییە: ناونیشانی برۆدکاست بۆ هۆست نابێت",
          errorSnippetEn: "Connection Failed: Broadcast address cannot be assigned to a host",
          rootCauses: [
            { id: "rc_bcast", textKu: "ئایپی دراوە بە ناونیشانی برۆدکاست (192.168.1.255) کە بۆ هۆست ناشێت", textEn: "IP is set to the Broadcast Address (192.168.1.255), invalid for hosts", isCorrect: true },
            { id: "rc_gw", textKu: "دەروازەی سەرەکی (Gateway) لە سەبنێتێکی ترە", textEn: "Default Gateway is in an outside subnet", isCorrect: false },
            { id: "rc_dup", textKu: "ئایپی دووبارەیە لەگەڵ ئامێری چاپکەرەکە", textEn: "IP address conflict with the printer", isCorrect: false }
          ],
          fixes: [
            { id: "fx_ip", textKu: "ئایپی بگۆڕە بۆ 192.168.1.25 (لە مەودای هۆستە کارپێکراوەکان)", textEn: "Change IP to 192.168.1.25 (valid usable host IP)", isCorrect: true, newIp: "192.168.1.25" },
            { id: "fx_mask", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.255.0.0", textEn: "Change Subnet Mask to 255.255.0.0", isCorrect: false },
            { id: "fx_gw", textKu: "دەروازەی سەرەکی بگۆڕە بۆ 192.168.1.255", textEn: "Change Gateway to 192.168.1.255", isCorrect: false }
          ],
          pingStatus: "Destination Host Unreachable (Cannot transmit on broadcast IP)"
        },
        {
          id: "sci_pc3",
          nameKu: "لاپتۆپی مامۆستا (Faculty-Laptop)",
          nameEn: "Faculty Laptop (Faculty-07)",
          icon: "fa-laptop",
          type: "laptop",
          ip: "192.168.1.45",
          mask: "255.255.255.0",
          gateway: "192.168.2.1",
          isFaulty: true,
          faultField: "gateway",
          errorSnippetKu: "پەیوەندی پچڕاوە: دەروازەی سەرەکی لە سەبنێتی 192.168.2.0 دایە",
          errorSnippetEn: "Connection Timed Out: Gateway is located on 192.168.2.0 subnet",
          rootCauses: [
            { id: "rc_gw_out", textKu: "دەروازەی سەرەکی (Gateway) لە دەرەوەی ئەم سەبنێتەیە (192.168.2.1)", textEn: "Default Gateway is outside this subnet (192.168.2.1 instead of 192.168.1.1)", isCorrect: true },
            { id: "rc_net_id", textKu: "ئایپی دراوە بە ناونیشانی سەرەتای تۆڕ (Network ID)", textEn: "IP is set to Network ID address", isCorrect: false },
            { id: "rc_mask", textKu: "سەبنێت ماسک کەمترە لە پێویستی تۆڕەکە", textEn: "Subnet mask does not match class requirements", isCorrect: false }
          ],
          fixes: [
            { id: "fx_gw_fix", textKu: "دەروازەی سەرەکی (Gateway) چاکبکەوە بۆ 192.168.1.1", textEn: "Change Default Gateway to 192.168.1.1", isCorrect: true, newGateway: "192.168.1.1" },
            { id: "fx_ip_wrong", textKu: "ئایپی ئامێرەکە بگۆڕە بۆ 192.168.2.45", textEn: "Change device IP to 192.168.2.45", isCorrect: false },
            { id: "fx_mask_wrong", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.255.255.128", textEn: "Change Mask to 255.255.255.128", isCorrect: false }
          ],
          pingStatus: "Request timed out. Default gateway 192.168.2.1 unreachable from 192.168.1.0/24"
        },
        {
          id: "sci_print",
          nameKu: "چاپکەری لەیزەری تاقیگە (Lab-Printer)",
          nameEn: "Department Laser Printer",
          icon: "fa-print",
          type: "printer",
          ip: "192.168.1.50",
          mask: "255.255.255.0",
          gateway: "192.168.1.1",
          isFaulty: false,
          faultField: null,
          pingStatus: "Reply from 192.168.1.1: bytes=32 time=2.1ms (Online)"
        }
      ]
    },
    {
      id: 2,
      badgeKu: "🚨 کەیسی ٢ / ٤",
      badgeEn: "🚨 Case 2 / 4",
      difficultyKu: "ئاست: مامناوەند",
      difficultyEn: "Difficulty: Medium",
      titleKu: "تۆڕی بەشی ئەندازیاری سۆفتوێر (VLSM /26)",
      titleEn: "Software Engineering Subnet Incident (VLSM /26)",
      descKu: "ئەم سەبنێتە بریتییە لە 172.16.20.0/26 (مەودای کارپێکراو: .1 تاوەکو .62). کێشەی هۆستەکان بدۆزەرەوە!",
      descEn: "This subnet is 172.16.20.0/26 (usable: .1 to .62). Find and resolve the host configuration issues!",
      networkIp: "172.16.20.0",
      cidr: 26,
      gateway: "172.16.20.1",
      mask: "255.255.255.192",
      broadcast: "172.16.20.63",
      devices: [
        {
          id: "eng_server",
          nameKu: "سێرڤەری گەشەپێدان (Dev-Server)",
          nameEn: "Development Server (Dev-Server)",
          icon: "fa-server",
          type: "server",
          ip: "172.16.20.0",
          mask: "255.255.255.192",
          gateway: "172.16.20.1",
          isFaulty: true,
          faultField: "ip",
          errorSnippetKu: "هەڵەی تۆڕ: ناونیشانی سەرەتای سەبنێت (Network ID) دراوە بە سێرڤەر",
          errorSnippetEn: "Network Error: Network ID address (172.16.20.0) assigned to host",
          rootCauses: [
            { id: "rc_net_id", textKu: "ئایپی دراوە بە ناونیشانی دەستپێکی تۆڕەکە (Network ID) کە بۆ هۆست ناکرێت", textEn: "IP is set to the Network ID address (172.16.20.0), which cannot be used by a host", isCorrect: true },
            { id: "rc_gw", textKu: "دەروازەی سەرەکی بوونی نییە", textEn: "Gateway does not exist", isCorrect: false },
            { id: "rc_dns", textKu: "سێرڤەری DNS لەکارکەوتووە", textEn: "DNS server is down", isCorrect: false }
          ],
          fixes: [
            { id: "fx_net_ip", textKu: "ئایپی سێرڤەرەکە بگۆڕە بۆ 172.16.20.2 (یەکەم ئایپی ئازادی هۆست)", textEn: "Change server IP to 172.16.20.2 (valid usable host IP)", isCorrect: true, newIp: "172.16.20.2" },
            { id: "fx_bcast", textKu: "ئایپی بگۆڕە بۆ 172.16.20.63", textEn: "Change IP to 172.16.20.63", isCorrect: false },
            { id: "fx_mask", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.255.255.0", textEn: "Change Mask to 255.255.255.0", isCorrect: false }
          ],
          pingStatus: "Network unreachable. Host cannot listen on Network ID address"
        },
        {
          id: "eng_pc1",
          nameKu: "کۆمپیوتەری کۆدینگی ١ (Workstation-A)",
          nameEn: "Coding Station (Workstation-A)",
          icon: "fa-desktop",
          type: "desktop",
          ip: "172.16.20.15",
          mask: "255.255.255.192",
          gateway: "172.16.20.1",
          isFaulty: true,
          faultField: "ip",
          errorSnippetKu: "ناکۆکی ئایپی: ئەم ئایپییە دووبارەیە و لەگەڵ Workstation-B پێکدادەکەوێت!",
          errorSnippetEn: "IP Conflict: Duplicate IP detected with Workstation-B!",
          rootCauses: [
            { id: "rc_dup_ip", textKu: "ناکۆکی ئایپی (IP Conflict): دوو ئامێر هەمان ئایپی (172.16.20.15)یان وەرگرتووە", textEn: "IP Conflict: Two devices have the identical IP (172.16.20.15)", isCorrect: true },
            { id: "rc_gw_bad", textKu: "دەروازەی سەرەکی هەڵەیە", textEn: "Gateway IP is invalid", isCorrect: false },
            { id: "rc_mask_bad", textKu: "سەبنێت ماسکەکە زۆر گەورەیە", textEn: "Subnet mask is too wide", isCorrect: false }
          ],
          fixes: [
            { id: "fx_dup_fix", textKu: "ئایپی ئامێرەکە بگۆڕە بۆ 172.16.20.16 (ئایپی تایبەت و بێ ناکۆکی)", textEn: "Change device IP to 172.16.20.16 (unique non-conflicting IP)", isCorrect: true, newIp: "172.16.20.16" },
            { id: "fx_dup_wrong", textKu: "ئایپی بگۆڕە بۆ 172.16.20.0", textEn: "Change IP to 172.16.20.0", isCorrect: false },
            { id: "fx_gw_wrong", textKu: "گەیتوەی بگۆڕە بۆ 172.16.20.15", textEn: "Change Gateway to 172.16.20.15", isCorrect: false }
          ],
          pingStatus: "IP collision detected with MAC 00:1A:2B:3C:4D:5E. Packet dropped."
        },
        {
          id: "eng_pc2",
          nameKu: "کۆمپیوتەری کۆدینگی ٢ (Workstation-B)",
          nameEn: "Coding Station (Workstation-B)",
          icon: "fa-desktop",
          type: "desktop",
          ip: "172.16.20.15",
          mask: "255.255.255.192",
          gateway: "172.16.20.1",
          isFaulty: false,
          faultField: null,
          pingStatus: "Reply from 172.16.20.1: bytes=32 time=0.8ms (Online)"
        },
        {
          id: "eng_build",
          nameKu: "سێرڤەری پرۆژەکان (CI/CD Build-Node)",
          nameEn: "CI/CD Build Runner",
          icon: "fa-microchip",
          type: "server",
          ip: "172.16.20.40",
          mask: "255.255.255.0",
          gateway: "172.16.20.1",
          isFaulty: true,
          faultField: "mask",
          errorSnippetKu: "ئاڵۆزی ماسک: ماسکی /24 دانراوە لە کاتێکدا تۆڕی تاقیگە /26ە",
          errorSnippetEn: "Mask Mismatch: Device has /24 mask instead of subnet /26",
          rootCauses: [
            { id: "rc_mask_mis", textKu: "سەبنێت ماسکەکە (255.255.255.0) نادروستە و دەبێت 255.255.255.192 بێت (/26)", textEn: "Subnet mask (255.255.255.0) is incorrect and must match /26 (255.255.255.192)", isCorrect: true },
            { id: "rc_ip_out", textKu: "ئایپی لە دەرەوەی مەودای ڕێگەپێدراوە", textEn: "IP is out of permitted range", isCorrect: false },
            { id: "rc_gw_out", textKu: "دەروازەی سەرەکی هەڵەیە", textEn: "Gateway is invalid", isCorrect: false }
          ],
          fixes: [
            { id: "fx_mask_fix", textKu: "سەبنێت ماسک ڕاستبکەرەوە بۆ 255.255.255.192 (/26)", textEn: "Correct Subnet Mask to 255.255.255.192 (/26)", isCorrect: true, newMask: "255.255.255.192" },
            { id: "fx_mask_bad", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.0.0.0", textEn: "Change Mask to 255.0.0.0", isCorrect: false },
            { id: "fx_ip_bad", textKu: "ئایپی بگۆڕە بۆ 172.16.20.63", textEn: "Change IP to 172.16.20.63", isCorrect: false }
          ],
          pingStatus: "Asymmetric routing fault. Subnet mask mismatch causes dropped replies."
        }
      ]
    },
    {
      id: 3,
      badgeKu: "🚨 کەیسی ٣ / ٤",
      badgeEn: "🚨 Case 3 / 4",
      difficultyKu: "ئاست: پێشکەوتوو",
      difficultyEn: "Difficulty: Advanced",
      titleKu: "داتاسەنتەری زانکۆ و نەخۆشخانەی فێرکاری (/22)",
      titleEn: "Campus Hospital & Data Center Network (/22)",
      descKu: "تۆڕی سەرەکی بریتییە لە 10.50.8.0/22 (مەودا: 10.50.8.1 تاوەکو 10.50.11.254، برۆدکاست: 10.50.11.255).",
      descEn: "Core Subnet: 10.50.8.0/22 (usable: 10.50.8.1 to 10.50.11.254, broadcast: 10.50.11.255).",
      networkIp: "10.50.8.0",
      cidr: 22,
      gateway: "10.50.8.1",
      mask: "255.255.252.0",
      broadcast: "10.50.11.255",
      devices: [
        {
          id: "hosp_db",
          nameKu: "داتابەیسی نەخۆشخانە (Core-Database)",
          nameEn: "Hospital Core Database",
          icon: "fa-database",
          type: "server",
          ip: "10.50.8.10",
          mask: "255.255.252.0",
          gateway: "10.50.8.1",
          isFaulty: false,
          faultField: null,
          pingStatus: "Reply from 10.50.8.1: bytes=32 time=0.4ms (Online)"
        },
        {
          id: "hosp_mri",
          nameKu: "ئامێری پشکنینی MRI (MRI-Scanner)",
          nameEn: "MRI Scanner Workstation",
          icon: "fa-x-ray",
          type: "device",
          ip: "10.50.11.255",
          mask: "255.255.252.0",
          gateway: "10.50.8.1",
          isFaulty: true,
          faultField: "ip",
          errorSnippetKu: "پەیوەندی نییە: 10.50.11.255 بریتییە لە ناونیشانی برۆدکاستی سەبنێتی /22",
          errorSnippetEn: "Connection Failed: 10.50.11.255 is the broadcast address of this /22 subnet",
          rootCauses: [
            { id: "rc_bcast_22", textKu: "ناونیشانی برۆدکاستی سەبنێتی /22 (10.50.11.255) دراوە بە ئامێرەکە", textEn: "Assigned the /22 Broadcast Address (10.50.11.255) to a host device", isCorrect: true },
            { id: "rc_gw_bad", textKu: "دەروازەی سەرەکی هەڵەیە", textEn: "Gateway is unreachable", isCorrect: false },
            { id: "rc_mask_bad", textKu: "سەبنێت ماسکەکە هەڵەیە", textEn: "Subnet mask is faulty", isCorrect: false }
          ],
          fixes: [
            { id: "fx_mri_ip", textKu: "ئایپی ئامێرەکە بگۆڕە بۆ 10.50.8.55 (ئایپی کارپێکراو)", textEn: "Change device IP to 10.50.8.55 (valid usable host IP)", isCorrect: true, newIp: "10.50.8.55" },
            { id: "fx_mri_mask", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.255.255.0", textEn: "Change Mask to 255.255.255.0", isCorrect: false },
            { id: "fx_mri_gw", textKu: "دەروازە بگۆڕە بۆ 10.50.11.255", textEn: "Change Gateway to 10.50.11.255", isCorrect: false }
          ],
          pingStatus: "Cannot ping broadcast address. Packet transmission prohibited."
        },
        {
          id: "hosp_doc",
          nameKu: "کۆمپیوتەری پزیشک (Doctor-Station)",
          nameEn: "Physician Terminal",
          icon: "fa-user-doctor",
          type: "desktop",
          ip: "10.50.12.15",
          mask: "255.255.252.0",
          gateway: "10.50.8.1",
          isFaulty: true,
          faultField: "ip",
          errorSnippetKu: "لە دەرەوەی تۆڕ: ئایپی 10.50.12.15 لە دەرەوەی مەودای سەبنێتی /22 یە!",
          errorSnippetEn: "Out of Bounds: IP 10.50.12.15 is beyond the /22 subnet boundary (max: 10.50.11.254)",
          rootCauses: [
            { id: "rc_out_bounds", textKu: "ئایپی لە دەرەوەی مەودای سەبنێتی /22 یە (10.50.8.0 - 10.50.11.255)", textEn: "IP is outside the /22 subnet boundary (valid range: 10.50.8.1 - 10.50.11.254)", isCorrect: true },
            { id: "rc_dup", textKu: "ناکۆکی ئایپی دووبارە لەگەڵ داتابەیس", textEn: "IP conflict with database", isCorrect: false },
            { id: "rc_bcast", textKu: "ئایپی ناونیشانی برۆدکاستە", textEn: "IP is a broadcast address", isCorrect: false }
          ],
          fixes: [
            { id: "fx_doc_ip", textKu: "ئایپی ئامێرەکە بگۆڕە بۆ 10.50.9.15 (لە نێو سنووری سەبنێتی /22)", textEn: "Change IP to 10.50.9.15 (inside valid /22 subnet range)", isCorrect: true, newIp: "10.50.9.15" },
            { id: "fx_doc_mask", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.255.0.0", textEn: "Change Mask to 255.255.0.0", isCorrect: false },
            { id: "fx_doc_gw", textKu: "دەروازەی سەرەکی بگۆڕە بۆ 10.50.12.1", textEn: "Change Gateway to 10.50.12.1", isCorrect: false }
          ],
          pingStatus: "Destination network unreachable. IP 10.50.12.15 belongs to next subnet."
        },
        {
          id: "hosp_tele",
          nameKu: "ئامێری نەشتەرگەری ڤیدیۆیی (Telemedicine-Rig)",
          nameEn: "Telemedicine Video Unit",
          icon: "fa-video",
          type: "device",
          ip: "10.50.10.80",
          mask: "255.255.252.0",
          gateway: "10.50.8.0",
          isFaulty: true,
          faultField: "gateway",
          errorSnippetKu: "گەیتوەی نادروست: 10.50.8.0 بریتییە لە Network ID و نابێت بە گەیتوەی!",
          errorSnippetEn: "Invalid Gateway: 10.50.8.0 is the Network ID, cannot route packets!",
          rootCauses: [
            { id: "rc_gw_netid", textKu: "دەروازەی سەرەکی کراوە بە ناونیشانی سەرەتای تۆڕ (Network ID) کە ئامێر ناتوانێت پێیدا تێپەڕێت", textEn: "Default Gateway is set to the Network ID address (10.50.8.0), which cannot be a router interface", isCorrect: true },
            { id: "rc_ip_bad", textKu: "ئایپی ئامێرەکە لە دەرەوەی مەودایە", textEn: "Device IP is invalid", isCorrect: false },
            { id: "rc_mask_bad", textKu: "سەبنێت ماسکەکە ناڕێکە", textEn: "Subnet mask is corrupted", isCorrect: false }
          ],
          fixes: [
            { id: "fx_gw_correct", textKu: "دەروازەی سەرەکی چاکبکەوە بۆ 10.50.8.1 (ئایپی ڕاوتەری تاقیگە)", textEn: "Change Default Gateway to 10.50.8.1 (campus router IP)", isCorrect: true, newGateway: "10.50.8.1" },
            { id: "fx_gw_bad2", textKu: "دەروازەی سەرەکی بگۆڕە بۆ 10.50.11.255", textEn: "Change Gateway to 10.50.11.255", isCorrect: false },
            { id: "fx_ip_bad2", textKu: "ئایپی ئامێرەکە بگۆڕە بۆ 10.50.8.0", textEn: "Change IP to 10.50.8.0", isCorrect: false }
          ],
          pingStatus: "Default gateway 10.50.8.0 is a non-routable network identifier. ARP failed."
        }
      ]
    },
    {
      id: 4,
      badgeKu: "🚨 کەیسی ٤ / ٤",
      badgeEn: "🚨 Case 4 / 4",
      difficultyKu: "ئاست: شارەزا",
      difficultyEn: "Difficulty: Expert",
      titleKu: "تۆڕی هەوری تاقیکردنەوەکانی زانکۆ (/28)",
      titleEn: "Campus Cloud Exam Arena Network (/28)",
      descKu: "سەبنێت: 192.168.100.16/28 (مەودا: 192.168.100.17 تاوەکو .30، برۆدکاست: .31، ماسک: 255.255.255.240).",
      descEn: "Subnet: 192.168.100.16/28 (usable: .17 to .30, broadcast: .31, mask: 255.255.255.240).",
      networkIp: "192.168.100.16",
      cidr: 28,
      gateway: "192.168.100.17",
      mask: "255.255.255.240",
      broadcast: "192.168.100.31",
      devices: [
        {
          id: "ex_ctrl",
          nameKu: "کۆنتڕۆڵکەری تاقیکردنەوە (Exam-Controller)",
          nameEn: "Exam Controller Node",
          icon: "fa-shield-halved",
          type: "server",
          ip: "192.168.100.18",
          mask: "255.255.255.248",
          gateway: "192.168.100.17",
          isFaulty: true,
          faultField: "mask",
          errorSnippetKu: "ئاڵۆزی ماسک: ماسکی /29 دانراوە (255.255.255.248) کە ئامێرەکە لە تۆڕەکە جیا دەکاتەوە",
          errorSnippetEn: "Mask Mismatch: Configured with /29 (255.255.255.248) instead of /28",
          rootCauses: [
            { id: "rc_mask_29", textKu: "سەبنێت ماسک /29 یە (255.255.255.248) و دەبێت /28 بێت (255.255.255.240)", textEn: "Subnet mask is /29 (255.255.255.248) instead of /28 (255.255.255.240)", isCorrect: true },
            { id: "rc_gw_bad", textKu: "دەروازەی سەرەکی هەڵەیە", textEn: "Default gateway is wrong", isCorrect: false },
            { id: "rc_ip_bad", textKu: "ئایپی ناونیشانی برۆدکاستە", textEn: "IP is broadcast address", isCorrect: false }
          ],
          fixes: [
            { id: "fx_mask_28", textKu: "سەبنێت ماسک چاکبکەوە بۆ 255.255.255.240 (/28)", textEn: "Correct Subnet Mask to 255.255.255.240 (/28)", isCorrect: true, newMask: "255.255.255.240" },
            { id: "fx_mask_wrong", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.255.255.0", textEn: "Change Mask to 255.255.255.0", isCorrect: false },
            { id: "fx_ip_wrong", textKu: "ئایپی بگۆڕە بۆ 192.168.100.31", textEn: "Change IP to 192.168.100.31", isCorrect: false }
          ],
          pingStatus: "Subnet mask restriction (/29) isolates host from exam gateway."
        },
        {
          id: "ex_portal",
          nameKu: "پۆرتاڵی خوێندکاران (Student-Portal)",
          nameEn: "Student Exam Portal",
          icon: "fa-graduation-cap",
          type: "server",
          ip: "192.168.100.31",
          mask: "255.255.255.240",
          gateway: "192.168.100.17",
          isFaulty: true,
          faultField: "ip",
          errorSnippetKu: "برۆدکاست: ئایپی 192.168.100.31 بریتییە لە ناونیشانی برۆدکاستی سەبنێتی /28",
          errorSnippetEn: "Broadcast Error: 192.168.100.31 is the broadcast address of this /28 subnet",
          rootCauses: [
            { id: "rc_bcast_28", textKu: "ئایپی دراوە بە ناونیشانی برۆدکاستی ئەم بلۆکەی /28 (192.168.100.31)", textEn: "IP is set to the /28 Broadcast Address (192.168.100.31)", isCorrect: true },
            { id: "rc_gw_out", textKu: "دەروازەی سەرەکی لە سەبنێتێکی ترە", textEn: "Gateway is outside subnet", isCorrect: false },
            { id: "rc_dup", textKu: "ئایپی دووبارەیە لەگەڵ ئامێری تاقیکردنەوە", textEn: "IP conflict detected", isCorrect: false }
          ],
          fixes: [
            { id: "fx_portal_ip", textKu: "ئایپی بگۆڕە بۆ 192.168.100.25 (لە مەودای هۆستە کارپێکراوەکان)", textEn: "Change IP to 192.168.100.25 (valid usable host IP)", isCorrect: true, newIp: "192.168.100.25" },
            { id: "fx_portal_mask", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.255.255.252", textEn: "Change Mask to 255.255.255.252", isCorrect: false },
            { id: "fx_portal_gw", textKu: "دەروازە بگۆڕە بۆ 192.168.100.31", textEn: "Change Gateway to 192.168.100.31", isCorrect: false }
          ],
          pingStatus: "Host cannot bind to broadcast IP 192.168.100.31. Error: EADDRNOTAVAIL."
        },
        {
          id: "ex_storage",
          nameKu: "سێرڤەری مەلەفی تاقیکردنەوە (Exam-Storage)",
          nameEn: "Archival Exam Storage",
          icon: "fa-hard-drive",
          type: "server",
          ip: "192.168.100.20",
          mask: "255.255.255.240",
          gateway: "192.168.100.17",
          isFaulty: false,
          faultField: null,
          pingStatus: "Reply from 192.168.100.17: bytes=32 time=0.9ms (Online)"
        },
        {
          id: "ex_proctor",
          nameKu: "لاپتۆپی چاودێری هۆڵ (Proctor-Laptop)",
          nameEn: "Proctor Monitoring Laptop",
          icon: "fa-laptop",
          type: "laptop",
          ip: "192.168.100.28",
          mask: "255.255.255.240",
          gateway: "192.168.100.1",
          isFaulty: true,
          faultField: "gateway",
          errorSnippetKu: "گەیتوەی هەڵە: 192.168.100.1 لە سەبنێتی یەکەمدایە نەک سەبنێتی .16/28",
          errorSnippetEn: "Wrong Gateway: 192.168.100.1 is in a different /28 subnet",
          rootCauses: [
            { id: "rc_proctor_gw", textKu: "دەروازەی سەرەکی (192.168.100.1) لە دەرەوەی ئەم بلۆکەیە (192.168.100.16/28)", textEn: "Default Gateway (192.168.100.1) is in a different /28 block", isCorrect: true },
            { id: "rc_proctor_net", textKu: "ئایپی ناونیشانی سەرەتای تۆڕە", textEn: "IP is the network address", isCorrect: false },
            { id: "rc_proctor_mask", textKu: "سەبنێت ماسکەکە زۆر گەورەیە", textEn: "Mask is too broad", isCorrect: false }
          ],
          fixes: [
            { id: "fx_proctor_gw", textKu: "دەروازەی سەرەکی بگۆڕە بۆ 192.168.100.17 (گەیتوەی ئەم سەبنێتە)", textEn: "Change Default Gateway to 192.168.100.17 (valid subnet gateway)", isCorrect: true, newGateway: "192.168.100.17" },
            { id: "fx_proctor_ip", textKu: "ئایپی ئامێرەکە بگۆڕە بۆ 192.168.100.1", textEn: "Change IP to 192.168.100.1", isCorrect: false },
            { id: "fx_proctor_mask", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.255.255.0", textEn: "Change Mask to 255.255.255.0", isCorrect: false }
          ],
          pingStatus: "Destination Host Unreachable. Gateway 192.168.100.1 not on local /28 link."
        }
      ]
    }
  ];

  let currentDetectiveCaseIndex = 0;
  let activeDetectiveCase = null;
  let activeSelectedDeviceId = null;
  let selectedRootCauseId = null;
  let selectedFixId = null;
  let deviceRepairedMap = {}; // deviceId -> boolean

  function generateRandomDetectiveCase() {
    const cidrList = [24, 25, 26, 27, 28];
    const pickedCidr = cidrList[Math.floor(Math.random() * cidrList.length)];
    const thirdOctet = Math.floor(Math.random() * 200) + 1;
    const blockSize = Math.pow(2, 32 - pickedCidr);
    const numSubnets = 256 / blockSize;
    const subnetIdx = Math.floor(Math.random() * numSubnets);
    const startHost = subnetIdx * blockSize;
    const baseIp = `192.168.${thirdOctet}.${startHost}`;
    const gatewayIp = `192.168.${thirdOctet}.${startHost + 1}`;
    const broadcastIp = `192.168.${thirdOctet}.${startHost + blockSize - 1}`;
    const maskStr = SubnetEngine.cidrToMask(pickedCidr);

    const dev1 = {
      id: "rnd_dev1",
      nameKu: "سێرڤەری تاقیگە (Lab-Server)",
      nameEn: "Lab Core Server",
      icon: "fa-server",
      type: "server",
      ip: `192.168.${thirdOctet}.${startHost + 2}`,
      mask: maskStr,
      gateway: gatewayIp,
      isFaulty: false,
      faultField: null,
      pingStatus: `Reply from ${gatewayIp}: bytes=32 time=0.9ms (Online)`
    };
    const dev2 = {
      id: "rnd_dev2",
      nameKu: "کۆمپیوتەری خوێندکار (Student-PC)",
      nameEn: "Student Station (PC-01)",
      icon: "fa-desktop",
      type: "desktop",
      ip: broadcastIp,
      mask: maskStr,
      gateway: gatewayIp,
      isFaulty: true,
      faultField: "ip",
      errorSnippetKu: `هەڵە: ناونیشانی برۆدکاست (${broadcastIp}) دراوە بە کۆمپیوتەر!`,
      errorSnippetEn: `Error: Broadcast address (${broadcastIp}) assigned to host!`,
      rootCauses: [
        { id: "rc_rnd_bcast", textKu: `ئایپی دراوە بە ناونیشانی برۆدکاست (${broadcastIp}) کە بۆ هۆست ناشێت`, textEn: `IP is set to the Broadcast Address (${broadcastIp})`, isCorrect: true },
        { id: "rc_rnd_gw", textKu: "گەیتوەی لە دەرەوەی ئەم سەبنێتەیە", textEn: "Gateway is outside this subnet", isCorrect: false },
        { id: "rc_rnd_dup", textKu: "ناکۆکی ئایپی دووبارە", textEn: "IP address conflict", isCorrect: false }
      ],
      fixes: [
        { id: "fx_rnd_ip", textKu: `ئایپی بگۆڕە بۆ 192.168.${thirdOctet}.${startHost + 5} (لە مەودای ڕێگەپێدراو)`, textEn: `Change IP to 192.168.${thirdOctet}.${startHost + 5}`, isCorrect: true, newIp: `192.168.${thirdOctet}.${startHost + 5}` },
        { id: "fx_rnd_mask", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.255.0.0", textEn: "Change Mask to 255.255.0.0", isCorrect: false },
        { id: "fx_rnd_gw", textKu: `گەیتوەی بگۆڕە بۆ ${broadcastIp}`, textEn: `Change Gateway to ${broadcastIp}`, isCorrect: false }
      ],
      pingStatus: "Destination Host Unreachable (Broadcast IP assigned to host)"
    };
    const dev3 = {
      id: "rnd_dev3",
      nameKu: "لاپتۆپی مامۆستا (Faculty-Laptop)",
      nameEn: "Faculty Laptop",
      icon: "fa-laptop",
      type: "laptop",
      ip: `192.168.${thirdOctet}.${startHost + 3}`,
      mask: maskStr,
      gateway: `192.168.${thirdOctet + 1}.1`,
      isFaulty: true,
      faultField: "gateway",
      errorSnippetKu: `گەیتوەی (192.168.${thirdOctet + 1}.1) لە تۆڕێکی ترە و نادۆزرێتەوە`,
      errorSnippetEn: "Gateway is on a different subnet and unreachable",
      rootCauses: [
        { id: "rc_rnd_gw_out", textKu: `گەیتوەی (192.168.${thirdOctet + 1}.1) لە سەبنێتێکی ترە`, textEn: `Default Gateway (192.168.${thirdOctet + 1}.1) is on another subnet`, isCorrect: true },
        { id: "rc_rnd_netid", textKu: "ئایپی ناونیشانی سەرەتای تۆڕە", textEn: "IP is Network Address", isCorrect: false },
        { id: "rc_rnd_mask", textKu: "سەبنێت ماسک هەڵەیە", textEn: "Subnet mask mismatch", isCorrect: false }
      ],
      fixes: [
        { id: "fx_rnd_gw_fix", textKu: `گەیتوەی بگۆڕە بۆ ${gatewayIp} (گەیتوەی دروست)`, textEn: `Change Gateway to ${gatewayIp}`, isCorrect: true, newGateway: gatewayIp },
        { id: "fx_rnd_ip_bad", textKu: `ئایپی بگۆڕە بۆ 192.168.${thirdOctet + 1}.50`, textEn: `Change IP to 192.168.${thirdOctet + 1}.50`, isCorrect: false },
        { id: "fx_rnd_mask_bad", textKu: "سەبنێت ماسک بگۆڕە بۆ 255.255.255.0", textEn: "Change Mask to 255.255.255.0", isCorrect: false }
      ],
      pingStatus: "Request timed out. Gateway not on local subnet."
    };
    const dev4 = {
      id: "rnd_dev4",
      nameKu: "چاپکەری تاقیگە (Network-Printer)",
      nameEn: "Campus Network Printer",
      icon: "fa-print",
      type: "printer",
      ip: `192.168.${thirdOctet}.${startHost + 4}`,
      mask: maskStr,
      gateway: gatewayIp,
      isFaulty: false,
      faultField: null,
      pingStatus: `Reply from ${gatewayIp}: bytes=32 time=1.8ms (Online)`
    };

    return {
      id: "random_" + Date.now(),
      badgeKu: "🎲 کەیسی هەڕەمەکی",
      badgeEn: "🎲 Random Incident",
      difficultyKu: `ئاست: /${pickedCidr}`,
      difficultyEn: `Level: /${pickedCidr}`,
      titleKu: `کەیسی هەڕەمەکی لە تۆڕی ${baseIp}/${pickedCidr}`,
      titleEn: `Procedural Incident on ${baseIp}/${pickedCidr}`,
      descKu: "کێشەی ئامێرە پچڕاوەکان لەم سەبنێتە هەڕەمەکییەدا بدۆزەرەوە و چاکیان بکەوە!",
      descEn: "Diagnose and fix broken devices in this procedurally generated subnet!",
      networkIp: baseIp,
      cidr: pickedCidr,
      gateway: gatewayIp,
      mask: maskStr,
      broadcast: broadcastIp,
      devices: [dev1, dev2, dev3, dev4]
    };
  }

  function cloneCase(c) {
    return JSON.parse(JSON.stringify(c));
  }

  function initDetectiveGame() {
    if (!activeDetectiveCase) {
      activeDetectiveCase = cloneCase(detectiveCases[currentDetectiveCaseIndex]);
      deviceRepairedMap = {};
    }
    renderDetectiveCase();
  }

  function renderDetectiveCase() {
    const c = activeDetectiveCase;
    if (!c) return;

    const isKu = getCurrentLang() === 'ku';

    // Header updates
    const badgeEl = document.getElementById('detectiveCaseBadge');
    if (badgeEl) badgeEl.textContent = isKu ? c.badgeKu : c.badgeEn;

    const diffEl = document.getElementById('detectiveDifficultyBadge');
    if (diffEl) diffEl.textContent = isKu ? c.difficultyKu : c.difficultyEn;

    const titleEl = document.getElementById('detectiveCaseTitle');
    if (titleEl) titleEl.textContent = isKu ? c.titleKu : c.titleEn;

    const descEl = document.getElementById('detectiveCaseDesc');
    if (descEl) descEl.textContent = isKu ? c.descKu : c.descEn;

    // Subnet Specs
    const specNet = document.getElementById('specNetwork');
    if (specNet) specNet.textContent = `${c.networkIp}/${c.cidr}`;

    const specMask = document.getElementById('specMask');
    if (specMask) specMask.textContent = c.mask;

    const specGw = document.getElementById('specGateway');
    if (specGw) specGw.textContent = c.gateway;

    const specBcast = document.getElementById('specBroadcast');
    if (specBcast) specBcast.textContent = c.broadcast;

    // Render Devices Grid
    const devicesListEl = document.getElementById('detectiveDevicesList');
    if (devicesListEl) {
      devicesListEl.innerHTML = '';
      c.devices.forEach(dev => {
        const isRepaired = !!deviceRepairedMap[dev.id];
        const isOnline = !dev.isFaulty || isRepaired;
        const isSelected = activeSelectedDeviceId === dev.id;

        const card = document.createElement('div');
        card.className = `detective-device-card ${isOnline ? 'healthy' : 'faulty'} ${isSelected ? 'selected' : ''}`;
        card.id = `card_${dev.id}`;
        card.addEventListener('click', (e) => {
          // If not clicking button specifically, trigger inspection
          if (!e.target.closest('button')) {
            inspectDevice(dev.id);
          }
        });

        const name = isKu ? dev.nameKu : dev.nameEn;
        const statusLabel = isOnline
          ? (isKu ? 'ئۆنلاین و چالاک' : 'Online & Healthy')
          : (isKu ? 'پچڕاوە / هەڵەی تۆڕ' : 'Offline / Fault Detected');

        const pingText = isOnline
          ? dev.pingStatus
          : (isKu ? (dev.errorSnippetKu || 'پەیوەندی پچڕاوە') : (dev.errorSnippetEn || 'Connection timed out'));

        card.innerHTML = `
          <div>
            <div class="device-card-top">
              <div class="device-badge-row">
                <div class="device-type-icon">
                  <i class="fa-solid ${dev.icon}"></i>
                </div>
                <div>
                  <div class="device-name">${name}</div>
                  <span style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">${dev.type}</span>
                </div>
              </div>
              <div class="device-status-led ${isOnline ? 'online' : 'offline'}">
                <i class="fa-solid ${isOnline ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
                <span>${statusLabel}</span>
              </div>
            </div>

            <div class="device-config-list">
              <div class="config-row">
                <span class="config-key">IP:</span>
                <span class="config-val ${(!isOnline && dev.faultField === 'ip') ? 'has-error' : ''}">${dev.ip}</span>
              </div>
              <div class="config-row">
                <span class="config-key">Mask:</span>
                <span class="config-val ${(!isOnline && dev.faultField === 'mask') ? 'has-error' : ''}">${dev.mask}</span>
              </div>
              <div class="config-row">
                <span class="config-key">Gateway:</span>
                <span class="config-val ${(!isOnline && dev.faultField === 'gateway') ? 'has-error' : ''}">${dev.gateway}</span>
              </div>
            </div>

            <div class="device-ping-snippet ${isOnline ? 'success' : 'error'}">
              <i class="fa-solid ${isOnline ? 'fa-circle-notch fa-spin' : 'fa-circle-xmark'}"></i>
              <span>${pingText}</span>
            </div>
          </div>

          <div>
            ${!isOnline ? `
              <button class="cyber-btn primary-glow device-action-btn" onclick="SubnetGames.inspectDevice('${dev.id}')">
                <i class="fa-solid fa-magnifying-glass"></i> ${t('btnInspect')}
              </button>
            ` : `
              <button class="cyber-btn device-action-btn" style="background: rgba(16, 185, 129, 0.15); border-color: #10b981; color: #34d399; cursor: default;" disabled>
                <i class="fa-solid fa-check"></i> ${t('deviceStatusOnline')}
              </button>
            `}
          </div>
        `;

        devicesListEl.appendChild(card);
      });
    }

    // Health calculation
    const total = c.devices.length;
    const onlineCount = c.devices.filter(d => !d.isFaulty || deviceRepairedMap[d.id]).length;
    const pct = Math.round((onlineCount / total) * 100);

    const healthFill = document.getElementById('detectiveHealthFill');
    if (healthFill) healthFill.style.width = `${pct}%`;

    const healthText = document.getElementById('detectiveHealthText');
    if (healthText) {
      if (pct === 100) {
        healthText.textContent = isKu ? `١٠٠٪ تەندروست - تۆڕەکە بە تەواوی ئۆنلاینە! (${total}/${total})` : `100% Operational - All systems online! (${total}/${total})`;
        healthText.style.color = '#34d399';
      } else {
        healthText.textContent = isKu ? `${pct}٪ تەندروست (${onlineCount} لە ${total} ئامێر ئۆنلاینن)` : `${pct}% Health (${onlineCount} of ${total} devices online)`;
        healthText.style.color = pct < 60 ? '#f87171' : '#f59e0b';
      }
    }

    // Check if case is completed
    const victoryBanner = document.getElementById('detectiveVictoryBanner');
    const nextBtn = document.getElementById('slicerNextLvlBtn');
    const consoleEl = document.getElementById('detectiveConsole');

    if (pct === 100) {
      if (consoleEl) consoleEl.style.display = 'none';
      if (victoryBanner) {
        victoryBanner.style.display = 'block';
        victoryBanner.innerHTML = `
          <div class="detective-victory-card">
            <div style="font-size: 2.8rem; margin-bottom: 0.6rem;">🏆</div>
            <h3 style="font-size: 1.6rem; color: #34d399; margin-bottom: 0.5rem;">
              ${t('allDevicesRestored')}
            </h3>
            <p style="color: var(--text-secondary); max-width: 580px; margin: 0 auto 1.4rem;">
              ${isKu 
                ? 'وەک ئەندازیارێکی لێهاتووی زانکۆ توانیت هەموو هەڵەکانی ئایپی، سەبنێت ماسک و دەروازەکان بدۆزیتەوە و تۆڕەکە بخەیتەوە کار!' 
                : 'Excellent troubleshooting! You detected all IP conflicts, broadcast bugs, and gateway mismatches, restoring the campus network!'}
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="cyber-btn primary-glow" style="background: #10b981; font-size: 1.05rem; padding: 0.8rem 1.8rem;" onclick="SubnetGames.handleNextSlicerLevel()">
                <i class="fa-solid fa-forward-step"></i> ${t('nextCase')}
              </button>
              <button class="cyber-btn" onclick="SubnetGames.handleRandomDetectiveCase()">
                <i class="fa-solid fa-shuffle"></i> ${t('randomCase')}
              </button>
            </div>
          </div>
        `;
      }
      if (nextBtn) nextBtn.style.display = 'inline-flex';
    } else {
      if (victoryBanner) victoryBanner.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }
  }

  function inspectDevice(deviceId) {
    if (!activeDetectiveCase) return;
    const dev = activeDetectiveCase.devices.find(d => d.id === deviceId);
    if (!dev) return;

    activeSelectedDeviceId = deviceId;
    selectedRootCauseId = null;
    selectedFixId = null;

    if (window.SoundFX) SoundFX.scan();

    // Re-render devices to apply .selected outline
    renderDetectiveCase();

    const consoleEl = document.getElementById('detectiveConsole');
    if (!consoleEl) return;

    if (!dev.isFaulty || deviceRepairedMap[dev.id]) {
      consoleEl.style.display = 'none';
      return;
    }

    consoleEl.style.display = 'block';

    const isKu = getCurrentLang() === 'ku';
    const devName = isKu ? dev.nameKu : dev.nameEn;

    consoleEl.innerHTML = `
      <div class="console-header">
        <div style="display: flex; align-items: center; gap: 0.8rem;">
          <div class="device-type-icon" style="background: rgba(56, 189, 248, 0.15); border-color: var(--accent-cyan);">
            <i class="fa-solid ${dev.icon}"></i>
          </div>
          <div>
            <h3 style="font-size: 1.15rem; margin: 0; color: #ffffff;">
              <i class="fa-solid fa-terminal" style="color: var(--accent-cyan); margin-left: 6px;"></i>
              ${isKu ? 'پشکنەری هۆست:' : 'Host Inspector:'} ${devName}
            </h3>
            <span style="font-size: 0.8rem; color: var(--accent-cyan); font-family: var(--font-mono);">
              IP: ${dev.ip} | Mask: ${dev.mask} | GW: ${dev.gateway}
            </span>
          </div>
        </div>
        <button class="cyber-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="document.getElementById('detectiveConsole').style.display='none';">
          <i class="fa-solid fa-xmark"></i> ${isKu ? 'داخستن' : 'Close'}
        </button>
      </div>

      <!-- Steps Grid -->
      <div class="console-steps-grid">
        <!-- Step 1: Root Cause -->
        <div class="console-step-box">
          <div class="step-label">
            <span class="cyber-badge-glow" style="padding: 2px 8px; font-size: 0.74rem;">١</span>
            <span>${t('faultIdentified')}</span>
          </div>
          <div class="choice-options-group" id="rootCausesGroup">
            ${dev.rootCauses.map(rc => `
              <button class="choice-btn" data-rc-id="${rc.id}" onclick="SubnetGames.selectRootCause('${rc.id}')">
                <i class="fa-regular fa-circle" id="icon_rc_${rc.id}"></i>
                <span>${isKu ? rc.textKu : rc.textEn}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Step 2: Fix Action -->
        <div class="console-step-box">
          <div class="step-label">
            <span class="cyber-badge-glow" style="padding: 2px 8px; font-size: 0.74rem; background: rgba(56, 189, 248, 0.2); border-color: var(--accent-cyan); color: var(--accent-cyan);">٢</span>
            <span>${isKu ? 'چاکسازی و کۆنفگی نوێ هەڵبژێرە:' : 'Select Corrective Action:'}</span>
          </div>
          <div class="choice-options-group" id="fixesGroup">
            ${dev.fixes.map(fx => `
              <button class="choice-btn" data-fx-id="${fx.id}" onclick="SubnetGames.selectFixAction('${fx.id}')">
                <i class="fa-regular fa-circle" id="icon_fx_${fx.id}"></i>
                <span>${isKu ? fx.textKu : fx.textEn}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Terminal Output Screen -->
      <div class="console-terminal" id="detectiveTerminal">
[DIAGNOSTIC SCANNER v4.2]
Target Device: ${devName} (NIC: eth0)
Configured: IP=${dev.ip} Netmask=${dev.mask} Gateway=${dev.gateway}
Ping Test to Gateway (${activeDetectiveCase.gateway}):
>>> ${dev.pingStatus}
Ready. Select root cause & corrective configuration, then click Apply Fix.
      </div>

      <!-- Action Button -->
      <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
        <button class="cyber-btn primary-glow" id="btnApplyDetectiveFix" style="font-size: 0.98rem; padding: 0.75rem 1.8rem;" onclick="SubnetGames.applyDeviceFix()">
          <i class="fa-solid fa-wrench"></i> <span>${t('applyFix')}</span>
        </button>
      </div>
    `;

    consoleEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function selectRootCause(rcId) {
    selectedRootCauseId = rcId;
    if (window.SoundFX) SoundFX.click();

    const group = document.getElementById('rootCausesGroup');
    if (group) {
      group.querySelectorAll('.choice-btn').forEach(btn => {
        const isMatch = btn.dataset.rcId === rcId;
        btn.classList.toggle('selected', isMatch);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isMatch ? 'fa-solid fa-circle-dot' : 'fa-regular fa-circle';
        }
      });
    }
  }

  function selectFixAction(fxId) {
    selectedFixId = fxId;
    if (window.SoundFX) SoundFX.click();

    const group = document.getElementById('fixesGroup');
    if (group) {
      group.querySelectorAll('.choice-btn').forEach(btn => {
        const isMatch = btn.dataset.fxId === fxId;
        btn.classList.toggle('selected', isMatch);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isMatch ? 'fa-solid fa-circle-dot' : 'fa-regular fa-circle';
        }
      });
    }
  }

  function applyDeviceFix() {
    if (!activeDetectiveCase || !activeSelectedDeviceId) return;
    const dev = activeDetectiveCase.devices.find(d => d.id === activeSelectedDeviceId);
    if (!dev) return;

    const terminal = document.getElementById('detectiveTerminal');
    const isKu = getCurrentLang() === 'ku';

    if (!selectedRootCauseId || !selectedFixId) {
      if (terminal) {
        terminal.innerHTML = `
<span class="term-error">⚠️ [ERROR]: ${isKu ? 'تکایە هەردوو هەنگاوەکە دیاری بکە (هۆکاری کێشە + چاکسازییەکە) پێش پشکنین!' : 'Please select both the Root Cause and Corrective Fix before applying!'}</span>
        `;
      }
      if (window.SoundFX) SoundFX.wrong();
      return;
    }

    const chosenRc = dev.rootCauses.find(r => r.id === selectedRootCauseId);
    const chosenFx = dev.fixes.find(f => f.id === selectedFixId);

    const isRcCorrect = chosenRc && chosenRc.isCorrect;
    const isFxCorrect = chosenFx && chosenFx.isCorrect;

    if (isRcCorrect && isFxCorrect) {
      // SUCCESS!
      if (window.SoundFX) {
        SoundFX.ping();
        setTimeout(() => SoundFX.correct(), 320);
      }

      // Apply changes to device
      if (chosenFx.newIp) dev.ip = chosenFx.newIp;
      if (chosenFx.newMask) dev.mask = chosenFx.newMask;
      if (chosenFx.newGateway) dev.gateway = chosenFx.newGateway;
      dev.pingStatus = `Reply from ${activeDetectiveCase.gateway}: bytes=32 time=1.1ms (Online)`;

      deviceRepairedMap[dev.id] = true;
      addXP(50);

      if (terminal) {
        terminal.innerHTML = `
<span class="term-success">[PATCH APPLIED SUCCESSFULLY]</span>
Applying new network parameters to ${isKu ? dev.nameKu : dev.nameEn}...
Sending 4 ICMP ECHO requests to default gateway ${activeDetectiveCase.gateway}:
  64 bytes from ${activeDetectiveCase.gateway}: icmp_seq=1 ttl=64 time=1.2 ms
  64 bytes from ${activeDetectiveCase.gateway}: icmp_seq=2 ttl=64 time=0.9 ms
  64 bytes from ${activeDetectiveCase.gateway}: icmp_seq=3 ttl=64 time=1.0 ms
  64 bytes from ${activeDetectiveCase.gateway}: icmp_seq=4 ttl=64 time=1.1 ms
--- ${activeDetectiveCase.gateway} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
<span class="term-success">STATUS: CONNECTION RESTORED! Host is 100% ONLINE (+50 XP) 🚀</span>
        `;
      }

      // Refresh devices grid after short delay to show updated status
      setTimeout(() => {
        renderDetectiveCase();
      }, 700);

    } else {
      // WRONG!
      if (window.SoundFX) SoundFX.wrong();

      let reason = "";
      if (!isRcCorrect && !isFxCorrect) {
        reason = isKu ? "هۆکاری سەرەکی و چاکسازییەکە هەردووکیان نادروستن." : "Both root cause and fix action are incorrect.";
      } else if (!isRcCorrect) {
        reason = isKu ? "هۆکاری دەستنیشانکراو نادروستە بۆ ئەم کێشەیە." : "The diagnosed root cause does not match this network fault.";
      } else {
        reason = isKu ? "چاکسازییە هەڵبژێردراوەکە هەڵەیە و تۆڕەکە ناکاتەوە ئۆنلاین." : "The corrective action failed to solve the subnet constraint.";
      }

      if (terminal) {
        terminal.innerHTML = `
<span class="term-error">[PING TEST FAILED ❌]</span>
Applying proposed parameters...
Sending ICMP ECHO requests to ${activeDetectiveCase.gateway}...
From ${dev.ip} icmp_seq=1 Destination Host Unreachable.
From ${dev.ip} icmp_seq=2 Request timed out.
--- Packet loss: 100% ---
<span class="term-error">DIAGNOSTIC FAILURE: ${reason}</span>
${isKu ? 'ڕێنمایی: یاساکانی سنووری سەبنێت و ناونیشانی برۆدکاست و هۆست بپشکنە!' : 'Hint: Verify subnet boundaries, usable host ranges, and broadcast address!'}
        `;
      }
    }
  }

  function handleNextDetectiveCase() {
    currentDetectiveCaseIndex = (currentDetectiveCaseIndex + 1) % detectiveCases.length;
    activeDetectiveCase = cloneCase(detectiveCases[currentDetectiveCaseIndex]);
    activeSelectedDeviceId = null;
    deviceRepairedMap = {};
    if (window.SoundFX) SoundFX.click();
    renderDetectiveCase();
  }

  function handleResetDetectiveCase() {
    if (activeDetectiveCase && activeDetectiveCase.id && String(activeDetectiveCase.id).startsWith('random_')) {
      activeDetectiveCase = generateRandomDetectiveCase();
    } else {
      activeDetectiveCase = cloneCase(detectiveCases[currentDetectiveCaseIndex]);
    }
    activeSelectedDeviceId = null;
    deviceRepairedMap = {};
    if (window.SoundFX) SoundFX.click();
    renderDetectiveCase();
  }

  function handleRandomDetectiveCase() {
    activeDetectiveCase = generateRandomDetectiveCase();
    activeSelectedDeviceId = null;
    deviceRepairedMap = {};
    if (window.SoundFX) SoundFX.scan();
    renderDetectiveCase();
  }

  /* ==========================================================================
     GAME 2: SPEED SUBNETTER (TIME ATTACK)
     ========================================================================== */
  let speedGameTimer = null;
  let speedSecondsLeft = 60;
  let speedScore = 0;
  let speedStreak = 0;
  let currentSpeedProblem = null;
  let isSpeedPlaying = false;

  function startSpeedGame() {
    isSpeedPlaying = true;
    speedScore = 0;
    speedStreak = 0;
    speedSecondsLeft = 60;
    updateSpeedHeader();

    const startBtn = document.getElementById('speedStartBtn');
    const playArea = document.getElementById('speedPlayArea');
    const gameOverArea = document.getElementById('speedGameOverArea');

    if (startBtn) startBtn.style.display = 'none';
    if (gameOverArea) gameOverArea.style.display = 'none';
    if (playArea) playArea.style.display = 'block';

    SoundFX.click();
    nextSpeedQuestion();

    clearInterval(speedGameTimer);
    speedGameTimer = setInterval(() => {
      speedSecondsLeft--;
      updateSpeedHeader();
      if (speedSecondsLeft <= 0) {
        endSpeedGame();
      }
    }, 1000);
  }

  function updateSpeedHeader() {
    const timeEl = document.getElementById('speedTimerDisplay');
    const scoreEl = document.getElementById('speedScoreDisplay');
    const streakEl = document.getElementById('speedStreakDisplay');
    if (timeEl) timeEl.textContent = `${speedSecondsLeft}s`;
    if (scoreEl) scoreEl.textContent = speedScore;
    if (streakEl) streakEl.textContent = `x${Math.max(1, Math.floor(speedStreak / 2) + 1)}`;
  }

  function shuffleSpeedArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Simple & Easy Speed Subnet Question Pool (Derived strictly from Chapter 6)
  const simpleSpeedQuestionGenerators = [
    // 1. Usable hosts by CIDR (Chapter 6: Slides 7, 9, 10, 12)
    () => {
      const presets = [
        { cidr: 24, hosts: "254", dist: ["256", "126", "510"] },
        { cidr: 25, hosts: "126", dist: ["128", "62", "254"] },
        { cidr: 26, hosts: "62", dist: ["64", "30", "126"] },
        { cidr: 27, hosts: "30", dist: ["32", "14", "62"] },
        { cidr: 28, hosts: "14", dist: ["16", "6", "30"] },
        { cidr: 29, hosts: "6", dist: ["8", "14", "2"] },
        { cidr: 30, hosts: "2", dist: ["4", "6", "1"] }
      ];
      const p = presets[Math.floor(Math.random() * presets.length)];
      return {
        display: `/${p.cidr}`,
        promptTextKu: `ژمارەی هۆستی بەکارهێنراو لە /${p.cidr} بدۆزەرەوە (2^h - 2):`,
        promptTextEn: `Number of Usable Hosts in /${p.cidr} (2^h - 2):`,
        correctAnswer: p.hosts,
        options: shuffleSpeedArray([p.hosts, ...p.dist])
      };
    },
    // 2. Subnet mask from prefix (Chapter 6: Slides 7, 9, 10)
    () => {
      const presets = [
        { cidr: 24, mask: "255.255.255.0", dist: ["255.255.0.0", "255.255.255.128", "255.255.255.192"] },
        { cidr: 25, mask: "255.255.255.128", dist: ["255.255.255.0", "255.255.255.192", "255.255.255.224"] },
        { cidr: 26, mask: "255.255.255.192", dist: ["255.255.255.128", "255.255.255.224", "255.255.255.240"] },
        { cidr: 27, mask: "255.255.255.224", dist: ["255.255.255.192", "255.255.255.240", "255.255.255.248"] },
        { cidr: 28, mask: "255.255.255.240", dist: ["255.255.255.224", "255.255.255.248", "255.255.255.192"] },
        { cidr: 30, mask: "255.255.255.252", dist: ["255.255.255.248", "255.255.255.240", "255.255.255.224"] }
      ];
      const p = presets[Math.floor(Math.random() * presets.length)];
      return {
        display: `/${p.cidr}`,
        promptTextKu: `ماسکی سەبنێت (Subnet Mask) بۆ پێشگری /${p.cidr} کامەیە؟`,
        promptTextEn: `Subnet Mask for prefix /${p.cidr}:`,
        correctAnswer: p.mask,
        options: shuffleSpeedArray([p.mask, ...p.dist])
      };
    },
    // 3. Prefix from subnet mask
    () => {
      const presets = [
        { mask: "255.255.255.0", cidr: "/24", dist: ["/25", "/16", "/26"] },
        { mask: "255.255.255.128", cidr: "/25", dist: ["/24", "/26", "/27"] },
        { mask: "255.255.255.192", cidr: "/26", dist: ["/25", "/27", "/28"] },
        { mask: "255.255.255.224", cidr: "/27", dist: ["/26", "/28", "/25"] },
        { mask: "255.255.255.240", cidr: "/28", dist: ["/27", "/29", "/26"] },
        { mask: "255.255.255.252", cidr: "/30", dist: ["/29", "/28", "/27"] }
      ];
      const p = presets[Math.floor(Math.random() * presets.length)];
      return {
        display: p.mask,
        promptTextKu: `پێشگری کورتکراوە (CIDR) بۆ ماسکی ${p.mask} کامەیە؟`,
        promptTextEn: `CIDR Prefix for Subnet Mask ${p.mask}:`,
        correctAnswer: p.cidr,
        options: shuffleSpeedArray([p.cidr, ...p.dist])
      };
    },
    // 4. Number of subnets from borrowed bits (Slide 7-12)
    () => {
      const presets = [
        { bits: 1, prefix: "/25", subnets: "2", dist: ["4", "8", "1"] },
        { bits: 2, prefix: "/26", subnets: "4", dist: ["2", "8", "16"] },
        { bits: 3, prefix: "/27", subnets: "8", dist: ["4", "16", "6"] },
        { bits: 4, prefix: "/28", subnets: "16", dist: ["8", "32", "4"] }
      ];
      const p = presets[Math.floor(Math.random() * presets.length)];
      return {
        display: `قەرزکردنی ${p.bits} بیت (${p.prefix})`,
        promptTextKu: `قەرزکردنی ${p.bits} بیت لە هۆست (2^n) چەند سەبنێت دروست دەکات؟`,
        promptTextEn: `Borrowing ${p.bits} bit(s) from host portion (2^n) creates how many subnets?`,
        correctAnswer: p.subnets,
        options: shuffleSpeedArray([p.subnets, ...p.dist])
      };
    },
    // 5. Broadcast address for well-known subnets (Slide 3 & 7-11)
    () => {
      const presets = [
        { net: "192.168.1.0/24", bcast: "192.168.1.255", dist: ["192.168.1.254", "192.168.1.0", "192.168.2.255"] },
        { net: "10.0.0.0/24", bcast: "10.0.0.255", dist: ["10.0.0.254", "10.0.0.0", "10.0.1.255"] },
        { net: "192.168.1.0/25", bcast: "192.168.1.127", dist: ["192.168.1.255", "192.168.1.128", "192.168.1.63"] },
        { net: "192.168.1.128/25", bcast: "192.168.1.255", dist: ["192.168.1.127", "192.168.1.128", "192.168.1.254"] },
        { net: "192.168.1.0/26", bcast: "192.168.1.63", dist: ["192.168.1.64", "192.168.1.127", "192.168.1.255"] },
        { net: "192.168.1.64/26", bcast: "192.168.1.127", dist: ["192.168.1.63", "192.168.1.128", "192.168.1.191"] },
        { net: "192.168.1.128/26", bcast: "192.168.1.191", dist: ["192.168.1.127", "192.168.1.192", "192.168.1.255"] },
        { net: "192.168.1.192/26", bcast: "192.168.1.255", dist: ["192.168.1.191", "192.168.1.192", "192.168.1.254"] },
        { net: "192.168.1.0/27", bcast: "192.168.1.31", dist: ["192.168.1.32", "192.168.1.63", "192.168.1.255"] },
        { net: "192.168.1.32/27", bcast: "192.168.1.63", dist: ["192.168.1.31", "192.168.1.64", "192.168.1.95"] }
      ];
      const p = presets[Math.floor(Math.random() * presets.length)];
      return {
        display: p.net,
        promptTextKu: `ناونیشانی پەخش (Broadcast Address) بۆ ئەم تۆڕە بدۆزەرەوە:`,
        promptTextEn: `Identify the Broadcast Address for:`,
        correctAnswer: p.bcast,
        options: shuffleSpeedArray([p.bcast, ...p.dist])
      };
    },
    // 6. First usable host (Slide 3 & 7-11)
    () => {
      const presets = [
        { net: "192.168.1.0/24", first: "192.168.1.1", dist: ["192.168.1.0", "192.168.1.2", "192.168.1.254"] },
        { net: "10.0.0.0/24", first: "10.0.0.1", dist: ["10.0.0.0", "10.0.0.2", "10.0.0.254"] },
        { net: "192.168.1.128/25", first: "192.168.1.129", dist: ["192.168.1.128", "192.168.1.130", "192.168.1.254"] },
        { net: "192.168.1.64/26", first: "192.168.1.65", dist: ["192.168.1.64", "192.168.1.66", "192.168.1.126"] },
        { net: "192.168.1.32/27", first: "192.168.1.33", dist: ["192.168.1.32", "192.168.1.34", "192.168.1.62"] }
      ];
      const p = presets[Math.floor(Math.random() * presets.length)];
      return {
        display: p.net,
        promptTextKu: `یەکەم هۆستی کارپێکراو (First Usable Host):`,
        promptTextEn: `Identify the First Usable Host for:`,
        correctAnswer: p.first,
        options: shuffleSpeedArray([p.first, ...p.dist])
      };
    },
    // 7. Core Subnet Rules & Formulas (Slide 5, 7, 12)
    () => {
      const presets = [
        {
          display: "Formula: Usable Hosts",
          promptTextKu: "یاسای دۆزینەوەی ژمارەی هۆستی بەکارهێنراو لە هەر سەبنێتێکدا:",
          promptTextEn: "Formula for usable hosts in any subnet:",
          correct: "2^h - 2",
          dist: ["2^h", "2^n", "256 - n"]
        },
        {
          display: "Formula: Number of Subnets",
          promptTextKu: "یاسای دۆزینەوەی ژمارەی سەبنێتە دروستکراوەکان بەپێی بیتە قەرزکراوەکان (n):",
          promptTextEn: "Formula for number of created subnets from borrowed bits (n):",
          correct: "2^n",
          dist: ["2^n - 2", "2^h - 2", "32 - n"]
        },
        {
          display: "IPv4 Architecture",
          promptTextKu: "کۆی ژمارەی بیتەکان لە ناونیشانێکی ستانداردی IPv4 دا چەندە؟",
          promptTextEn: "Total number of bits in a standard IPv4 address:",
          correct: "32 bits",
          dist: ["24 bits", "64 bits", "128 bits"]
        },
        {
          display: "Router-to-Router Link",
          promptTextKu: "بەستنەوەی نێوان دوو ڕاوتەر پێویستی بە چەند ئایپی بەکارهێنراوە (Slide 5)؟",
          promptTextEn: "Point-to-point connection between routers needs how many usable IPs?",
          correct: "2 usable IPs (/30)",
          dist: ["4 usable IPs", "6 usable IPs", "1 usable IP"]
        }
      ];
      const p = presets[Math.floor(Math.random() * presets.length)];
      return {
        display: p.display,
        promptTextKu: p.promptTextKu,
        promptTextEn: p.promptTextEn,
        correctAnswer: p.correct,
        options: shuffleSpeedArray([p.correct, ...p.dist])
      };
    }
  ];

  function nextSpeedQuestion() {
    const generator = simpleSpeedQuestionGenerators[Math.floor(Math.random() * simpleSpeedQuestionGenerators.length)];
    currentSpeedProblem = generator();
    renderSpeedQuestionUI();
  }

  function renderSpeedQuestionUI() {
    const prob = currentSpeedProblem;
    if (!prob) return;

    const targetIpEl = document.getElementById('speedTargetIp');
    const promptEl = document.getElementById('speedPromptText');
    const optionsGridEl = document.getElementById('speedOptionsGrid');

    if (targetIpEl) targetIpEl.textContent = prob.display || `${prob.ip} /${prob.cidr}`;
    if (promptEl) promptEl.textContent = getCurrentLang() === 'ku' ? prob.promptTextKu : prob.promptTextEn;

    if (optionsGridEl) {
      optionsGridEl.innerHTML = '';
      prob.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'cyber-btn speed-opt-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleSpeedAnswer(opt, btn));
        optionsGridEl.appendChild(btn);
      });
    }
  }

  function handleSpeedAnswer(selected, btnEl) {
    if (!isSpeedPlaying) return;
    const isCorrect = selected === currentSpeedProblem.correctAnswer;

    if (isCorrect) {
      SoundFX.correct();
      speedStreak++;
      const mult = Math.max(1, Math.floor(speedStreak / 2) + 1);
      const earned = 20 * mult;
      speedScore += earned;
      speedSecondsLeft = Math.min(90, speedSecondsLeft + 2); // bonus seconds
      btnEl.classList.add('btn-correct');
      addXP(10 * mult);
    } else {
      SoundFX.wrong();
      speedStreak = 0;
      speedSecondsLeft = Math.max(0, speedSecondsLeft - 4); // penalty
      btnEl.classList.add('btn-wrong');
    }

    updateSpeedHeader();
    setTimeout(() => {
      if (isSpeedPlaying) nextSpeedQuestion();
    }, 280);
  }

  function handleSpeedPass() {
    if (!isSpeedPlaying) return;
    SoundFX.wrong();
    speedStreak = 0;
    speedSecondsLeft = Math.max(0, speedSecondsLeft - 5);
    updateSpeedHeader();
    nextSpeedQuestion();
  }

  function endSpeedGame() {
    isSpeedPlaying = false;
    clearInterval(speedGameTimer);
    SoundFX.levelUp();

    if (speedScore > playerStats.highScore) {
      playerStats.highScore = speedScore;
      saveStats();
    }

    const playArea = document.getElementById('speedPlayArea');
    const gameOverArea = document.getElementById('speedGameOverArea');
    const finalScoreEl = document.getElementById('speedFinalScore');
    const bestScoreEl = document.getElementById('speedBestScore');

    if (playArea) playArea.style.display = 'none';
    if (gameOverArea) gameOverArea.style.display = 'block';
    if (finalScoreEl) finalScoreEl.textContent = speedScore;
    if (bestScoreEl) bestScoreEl.textContent = playerStats.highScore;
  }

  /* ==========================================================================
     GAME 3: BINARY MATRIX (BIT FLIPPER)
     ========================================================================== */
  let binaryBits = Array(32).fill(0);
  let targetBinaryCidr = 26;

  function initBinaryMatrix() {
    newBinaryChallenge();
  }

  function newBinaryChallenge() {
    // Generate a random CIDR between 16 and 30
    targetBinaryCidr = Math.floor(Math.random() * 15) + 16;
    // Default bits can be /24
    binaryBits = Array(32).fill(0);
    for (let i = 0; i < 24; i++) binaryBits[i] = 1;

    renderBinaryMatrix();
  }

  function toggleBit(index) {
    binaryBits[index] = binaryBits[index] === 1 ? 0 : 1;
    SoundFX.bitToggle(binaryBits[index] === 1);
    renderBinaryMatrix(false);
  }

  function renderBinaryMatrix(fullRerender = true) {
    const targetEl = document.getElementById('binaryTargetCidr');
    const matrixContainer = document.getElementById('binaryOctetContainer');
    const currentMaskEl = document.getElementById('binaryCurrentMask');
    const netBitsEl = document.getElementById('binaryNetBitsCount');
    const hostBitsEl = document.getElementById('binaryHostBitsCount');
    const usableHostsEl = document.getElementById('binaryUsableHosts');
    const statusMsgEl = document.getElementById('binaryStatusMsg');

    if (targetEl) targetEl.textContent = `/${targetBinaryCidr}`;

    // Count 1s and 0s
    const onesCount = binaryBits.filter(b => b === 1).length;
    const zerosCount = 32 - onesCount;

    // Check if continuous
    let isContinuous = true;
    let foundZero = false;
    for (let i = 0; i < 32; i++) {
      if (binaryBits[i] === 0) foundZero = true;
      if (foundZero && binaryBits[i] === 1) {
        isContinuous = false;
        break;
      }
    }

    // Convert bits to mask IP
    const octets = [];
    for (let i = 0; i < 4; i++) {
      const slice = binaryBits.slice(i * 8, (i + 1) * 8).join('');
      octets.push(parseInt(slice, 2));
    }
    const maskStr = octets.join('.');

    if (currentMaskEl) currentMaskEl.textContent = maskStr;
    if (netBitsEl) netBitsEl.textContent = onesCount;
    if (hostBitsEl) hostBitsEl.textContent = zerosCount;
    if (usableHostsEl) {
      usableHostsEl.textContent = zerosCount >= 2 ? (Math.pow(2, zerosCount) - 2).toLocaleString() : (zerosCount === 1 ? '2' : '1');
    }

    if (matrixContainer && fullRerender) {
      matrixContainer.innerHTML = '';
      for (let octet = 0; octet < 4; octet++) {
        const octetBox = document.createElement('div');
        octetBox.className = 'binary-octet-box';

        const label = document.createElement('div');
        label.className = 'octet-label';
        label.textContent = `${getCurrentLang() === 'ku' ? 'ئۆکتێتی' : 'Octet'} ${octet + 1} (${octets[octet]})`;
        // Bit weights row (128, 64, 32, 16, 8, 4, 2, 1)
        const weights = [128, 64, 32, 16, 8, 4, 2, 1];
        const weightsRow = document.createElement('div');
        weightsRow.className = 'bit-weights-row';
        weights.forEach(w => {
          const wSpan = document.createElement('span');
          wSpan.className = 'bit-weight-val';
          wSpan.textContent = w;
          weightsRow.appendChild(wSpan);
        });
        octetBox.appendChild(weightsRow);

        const bitsRow = document.createElement('div');
        bitsRow.className = 'bits-row';

        for (let bit = 0; bit < 8; bit++) {
          const bitIndex = octet * 8 + bit;
          const bitVal = binaryBits[bitIndex];
          const bitBtn = document.createElement('button');
          bitBtn.className = `bit-cell ${bitVal === 1 ? 'is-one' : 'is-zero'}`;
          bitBtn.textContent = bitVal;
          bitBtn.dataset.index = bitIndex;
          bitBtn.addEventListener('click', () => {
            toggleBit(bitIndex);
          });
          bitsRow.appendChild(bitBtn);
        }

        octetBox.appendChild(bitsRow);
        matrixContainer.appendChild(octetBox);
      }
    } else if (matrixContainer) {
      // Just update classes and texts
      matrixContainer.querySelectorAll('.bit-cell').forEach(cell => {
        const idx = parseInt(cell.dataset.index, 10);
        const val = binaryBits[idx];
        cell.className = `bit-cell ${val === 1 ? 'is-one' : 'is-zero'}`;
        cell.textContent = val;
      });
      matrixContainer.querySelectorAll('.octet-label').forEach((lbl, oct) => {
        lbl.textContent = `${getCurrentLang() === 'ku' ? 'ئۆکتێتی' : 'Octet'} ${oct + 1} (${octets[oct]})`;
      });
    }

    if (statusMsgEl) {
      if (!isContinuous) {
        statusMsgEl.innerHTML = `<span class="text-danger">⚠️ ${t('binaryHint')}</span>`;
      } else if (onesCount === targetBinaryCidr) {
        statusMsgEl.innerHTML = `<span class="text-success">✅ ${t('binarySuccess')}</span>`;
      } else {
        statusMsgEl.innerHTML = `<span class="text-muted">${getCurrentLang() === 'ku' 
          ? `پێویستە ژمارەی بیتەکانی ١ بگاتە ${targetBinaryCidr} (ئێستا: ${onesCount})`
          : `Target network prefix needs ${targetBinaryCidr} continuous 1s (currently: ${onesCount})`}</span>`;
      }
    }
  }

  function handleCheckBinary() {
    const onesCount = binaryBits.filter(b => b === 1).length;
    let isContinuous = true;
    let foundZero = false;
    for (let i = 0; i < 32; i++) {
      if (binaryBits[i] === 0) foundZero = true;
      if (foundZero && binaryBits[i] === 1) {
        isContinuous = false;
        break;
      }
    }

    if (isContinuous && onesCount === targetBinaryCidr) {
      SoundFX.correct();
      addXP(75);
      showNotification(`🎉 ${t('binarySuccess')}`);
      setTimeout(() => {
        newBinaryChallenge();
      }, 1200);
    } else {
      SoundFX.wrong();
    }
  }

  /* ==========================================================================
     GAME 4: UNIVERSITY EXAM ARENA (تاقیکردنەوەی زانکۆ)
     ========================================================================== */
  const universityQuestions = [
    // Chapter 6: Subnetting & Address Types (Slides 1-17)
    {
      id: 1,
      chapterKu: "بەشی ٦: دابەشکردنی تۆڕ (Subnetting)",
      chapterEn: "Chapter 6: Subnetting & Address Types",
      qKu: "لە بلۆکی 10.0.0.0/24 دا، ناونیشانی پەخش (Broadcast Address) بریتییە لە چی؟",
      qEn: "In the network block 10.0.0.0/24, what is the Broadcast Address?",
      options: ["10.0.0.255", "10.0.0.0", "10.0.0.1", "10.0.0.254"],
      answer: "10.0.0.255",
      explKu: "بەپێی سلایدی ۳: ناونیشانی تۆڕ بریتییە لە 10.0.0.0 (هەموو بیتەکانی هۆست سفڕن)، یەکەم هۆست 10.0.0.1 ە، و ناونیشانی برۆدکاست بریتییە لە 10.0.0.255 (هەموو بیتەکانی هۆست یەکن).",
      explEn: "According to Slide 3: Network address is 10.0.0.0 (all host bits 0), first host is 10.0.0.1, and broadcast address is 10.0.0.255 (all host bits 1)."
    },
    {
      id: 2,
      chapterKu: "بەشی ٦: دابەشکردنی تۆڕ (Subnetting)",
      chapterEn: "Chapter 6: Subnetting (Example 1)",
      qKu: "کاتێک تۆڕی 192.168.1.0/24 دابەش دەکرێت بۆ دوو سەبنێت، هەر سەبنێتێک چەند هۆستی بەکارهێنراو (Usable Hosts) دابین دەکات؟",
      qEn: "When dividing 192.168.1.0/24 into two subnets, how many usable hosts does each subnet provide?",
      options: ["126", "128", "254", "62"],
      answer: "126",
      explKu: "سلایدی ۷ ڕوونیدەکاتەوە: بۆ ۲ سەبنێت ۱ بیت لە هۆست وەردەگیرێت، کەواتە 7 بیت بۆ هۆست دەمێنێتەوە. ژمارەی هۆستی بەکارهێنراو = 2^7 - 2 = 128 - 2 = 126 هۆست.",
      explEn: "Slide 7: Borrowing 1 bit leaves 7 host bits. Usable hosts per subnet = 2^7 - 2 = 128 - 2 = 126 usable hosts."
    },
    {
      id: 3,
      chapterKu: "بەشی ٦: دابەشکردنی تۆڕ (Subnetting)",
      chapterEn: "Chapter 6: Subnetting (Example 1)",
      qKu: "لە دابەشکردنی 192.168.1.0/24 بۆ دوو سەبنێت (/25)، ناونیشانی تۆڕ و برۆدکاستی سەبنێتی دووەم کامەیە؟",
      qEn: "When dividing 192.168.1.0/24 into two /25 subnets, what are the Network and Broadcast addresses of the second subnet?",
      optionsKu: [
        "تۆڕ: 192.168.1.128/25 | برۆدکاست: 192.168.1.255/25",
        "تۆڕ: 192.168.1.0/25 | برۆدکاست: 192.168.1.127/25",
        "تۆڕ: 192.168.1.64/25 | برۆدکاست: 192.168.1.128/25",
        "تۆڕ: 192.168.1.128/25 | برۆدکاست: 192.168.1.191/25"
      ],
      optionsEn: [
        "Net: 192.168.1.128/25 | Broadcast: 192.168.1.255/25",
        "Net: 192.168.1.0/25 | Broadcast: 192.168.1.127/25",
        "Net: 192.168.1.64/25 | Broadcast: 192.168.1.128/25",
        "Net: 192.168.1.128/25 | Broadcast: 192.168.1.191/25"
      ],
      answerKu: "تۆڕ: 192.168.1.128/25 | برۆدکاست: 192.168.1.255/25",
      answerEn: "Net: 192.168.1.128/25 | Broadcast: 192.168.1.255/25",
      explKu: "بەپێی سلایدی ۸: سەبنێتی یەکەم بریتییە لە 192.168.1.0/25 (برۆدکاست: .127) و سەبنێتی دووەم بریتییە لە 192.168.1.128/25 (برۆدکاست: .255).",
      explEn: "Slide 8: Subnet 1 is 192.168.1.0/25 (Broadcast: .127) and Subnet 2 is 192.168.1.128/25 (Broadcast: .255)."
    },
    {
      id: 4,
      chapterKu: "بەشی ٦: دابەشکردنی تۆڕ (Subnetting)",
      chapterEn: "Chapter 6: Subnetting (Example 2)",
      qKu: "بۆ دابەشکردنی بلۆکی 192.168.1.0/24 بۆ 4 سەبنێت، پێویستە چەند بیت لە بەشی هۆست قەرز بکرێت و ماسکی سەبنێت چەند دەبێت؟",
      qEn: "To divide 192.168.1.0/24 into 4 subnets, how many bits must be deducted and what is the new subnet mask?",
      optionsKu: [
        "2 بیت (ماسک دەبێتە 2+24 = /26 واتە 255.255.255.192)",
        "1 بیت (ماسک دەبێتە 1+24 = /25 واتە 255.255.255.128)",
        "3 بیت (ماسک دەبێتە 3+24 = /27 واتە 255.255.255.224)",
        "4 بیت (ماسک دەبێتە 4+24 = /28 واتە 255.255.255.240)"
      ],
      optionsEn: [
        "2 bits (Mask becomes 2+24 = /26 -> 255.255.255.192)",
        "1 bit (Mask becomes 1+24 = /25 -> 255.255.255.128)",
        "3 bits (Mask becomes 3+24 = /27 -> 255.255.255.224)",
        "4 bits (Mask becomes 4+24 = /28 -> 255.255.255.240)"
      ],
      answerKu: "2 بیت (ماسک دەبێتە 2+24 = /26 واتە 255.255.255.192)",
      answerEn: "2 bits (Mask becomes 2+24 = /26 -> 255.255.255.192)",
      explKu: "بەپێی سلایدی ۹: دوو بیت چوار بەهای جیاواز دەدات (00, 01, 10, 11)، ماسکی نوێ دەبێتە 2 + 24 = 26 (255.255.255.192).",
      explEn: "Slide 9: Two binary bits have 4 values (00, 01, 10, 11). New subnet mask = 2 + 24 = 26 (255.255.255.192)."
    },
    {
      id: 5,
      chapterKu: "بەشی ٦: دابەشکردنی تۆڕ (Subnetting)",
      chapterEn: "Chapter 6: Subnetting (Example 3)",
      qKu: "لە دابەشکردنی تۆڕی 192.168.1.0/24 بۆ 8 سەبنێت (/27)، ناونیشانی تۆڕی سەبنێتی شەشەم (Sixth subnet) کامەیە؟",
      qEn: "In dividing 192.168.1.0/24 into eight subnets (/27), what is the Network Address of the 6th subnet?",
      options: ["192.168.1.160/27", "192.168.1.128/27", "192.168.1.192/27", "192.168.1.96/27"],
      answer: "192.168.1.160/27",
      explKu: "بەپێی سلایدی ۱۱: سەبنێتەکان بە 32 باز دەدەن (0, 32, 64, 96, 128, 160). سەبنێتی شەشەم دەکاتە 192.168.1.160/27 (برۆدکاست: 192.168.1.191).",
      explEn: "Slide 11: Subnets step by 32 (.0, .32, .64, .96, .128, .160). The 6th subnet is 192.168.1.160/27 (Broadcast: .191)."
    },
    {
      id: 6,
      chapterKu: "بەشی ٦: دابەشکردنی سەبنێت (Subnet a subnet)",
      chapterEn: "Chapter 6: Subnet a Subnet",
      qKu: "ئەگەر سەبنێتی 192.168.1.128/26 دووبارە دابەش بکرێت بۆ دوو سەبنێت، سەبنێت ماسکی نوێ و بلۆکەکان دەبنە چی؟",
      qEn: "If subnet 192.168.1.128/26 is further divided into two subnets, what is the new mask and resulting subnets?",
      optionsKu: [
        "ماسک دەبێتە /27: سەبنێتی یەکەم .128/27 و سەبنێتی دووەم .160/27",
        "ماسک دەبێتە /28: سەبنێتی یەکەم .128/28 و سەبنێتی دووەم .144/28",
        "ماسک دەبێتە /26: سەبنێتی یەکەم .0/26 و سەبنێتی دووەم .64/26",
        "ماسک دەبێتە /25: سەبنێتی یەکەم .0/25 و سەبنێتی دووەم .128/25"
      ],
      optionsEn: [
        "Mask becomes /27: 1st subnet .128/27 and 2nd subnet .160/27",
        "Mask becomes /28: 1st subnet .128/28 and 2nd subnet .144/28",
        "Mask becomes /26: 1st subnet .0/26 and 2nd subnet .64/26",
        "Mask becomes /25: 1st subnet .0/25 and 2nd subnet .128/25"
      ],
      answerKu: "ماسک دەبێتە /27: سەبنێتی یەکەم .128/27 و سەبنێتی دووەم .160/27",
      answerEn: "Mask becomes /27: 1st subnet .128/27 and 2nd subnet .160/27",
      explKu: "بەپێی سلایدی ۱۳ و ۱۴: کاتێک یەک بیت لە 6 بیتەکەی هۆست دەبڕین، ماسک دەبێتە 26+1=27. یەکەم دەبێتە 192.168.1.128/27 و دووەم دەبێتە 192.168.1.160/27.",
      explEn: "Slides 13 & 14: Deducting 1 bit from the 6 host bits gives 26+1=27. Subnet 1 is 192.168.1.128/27 and Subnet 2 is 192.168.1.160/27."
    },

    // Chapter 7: Cisco CLI & IOS Modes (Slides 18-28)
    {
      id: 7,
      chapterKu: "بەشی ٧: سیستەمی IOS و فەرمانەکانی سیسکۆ",
      chapterEn: "Chapter 7: Cisco CLI & IOS Modes",
      qKu: "فایلی startup-configuration لە چ بیرگەیەکدا هەڵدەگیرێت و کاتی داگیرساندن بۆ کوێ کۆپی دەکرێت؟",
      qEn: "In which router memory is the startup-configuration stored, and where is it copied at startup?",
      optionsKu: [
        "لە NVRAM پاشەکەوتە و بۆ ناو RAM کۆپی دەکرێت",
        "لە Flash پاشەکەوتە و بۆ ناو ROM کۆپی دەکرێت",
        "لە RAM پاشەکەوتە و بۆ ناو NVRAM کۆپی دەکرێت",
        "لە ROM پاشەکەوتە و بۆ ناو Flash کۆپی دەکرێت"
      ],
      optionsEn: [
        "Stored in NVRAM and copied to RAM at startup",
        "Stored in Flash and copied to ROM",
        "Stored in RAM and copied to NVRAM",
        "Stored in ROM and copied to Flash"
      ],
      answerKu: "لە NVRAM پاشەکەوتە و بۆ ناو RAM کۆپی دەکرێت",
      answerEn: "Stored in NVRAM and copied to RAM at startup",
      explKu: "سلایدی ۱۹ ڕوونیدەکاتەوە: At startup, startup-configuration is copied from NVRAM to RAM and executed as running-configuration.",
      explEn: "Slide 19: Startup configuration is preserved in NVRAM and loaded into RAM on startup as the active running-configuration."
    },
    {
      id: 8,
      chapterKu: "بەشی ٧: سیستەمی IOS و فەرمانەکانی سیسکۆ",
      chapterEn: "Chapter 7: Cisco IOS Hierarchical Modes",
      qKu: "پڕۆمتی Router(config-if)# ئاماژەیە بۆ چ دۆخێکی کۆنفیگکردن لە سیسکۆدا؟",
      qEn: "What configuration mode does the prompt Router(config-if)# represent in Cisco IOS?",
      options: [
        "Interface Configuration Mode",
        "User EXEC Mode",
        "Privileged EXEC Mode",
        "Global Configuration Mode"
      ],
      answer: "Interface Configuration Mode",
      explKu: "بەپێی سلایدی ۲۰ و ۲٤: دۆخەکان بریتین لە: User EXEC (Router>), Privileged EXEC (Router#), Global Config (Router(config)#), و Interface Mode (Router(config-if)#).",
      explEn: "Slides 20 & 24: Router> is User EXEC, Router# is Privileged EXEC, Router(config)# is Global Config, and Router(config-if)# is Interface mode."
    },
    {
      id: 9,
      chapterKu: "بەشی ٧: سیستەمی IOS و فەرمانەکانی سیسکۆ",
      chapterEn: "Chapter 7: Interface Verification & Commands",
      qKu: "لە ڕاوتەری سیسکۆدا بە شێوەی دیفۆڵت سەرجەم ئینتەرفەیسەکان کوژاوەنەتەوە (Down)، کام فەرمان بۆ هەڵکردنیان بەکاردێت؟",
      qEn: "On Cisco routers, all interfaces are down by default. Which command turns them on?",
      options: ["no shutdown", "enable", "start-interface", "ip up"],
      answer: "no shutdown",
      explKu: "بەپێی سلایدی ۲٦ و ۳۱: By default all serial and Ethernet interfaces are down. To enable an interface use the 'no shutdown' command.",
      explEn: "Slides 26 & 31: All router interfaces are administratively shutdown by default; 'no shutdown' must be issued to bring them up."
    },

    // Chapter 8: Static Routing (Slides 29-44)
    {
      id: 10,
      chapterKu: "بەشی ٨: ڕێڕەوی ستاتیک (Static Routing)",
      chapterEn: "Chapter 8: Static Routing (Serial Links)",
      qKu: "لە بەستنەوەی کێبڵی زنجیرەیی (Serial Link) لە تاقیگەدا، کام لای کێبڵەکە پێویستی بە فەرمانی clock rate 64000 هەیە؟",
      qEn: "In a lab serial link, which side requires configuring clock rate 64000?",
      optionsKu: [
        "لایەنەی DCE (Data Circuit-terminating Equipment)",
        "لایەنەی DTE (Data Terminal Equipment)",
        "هەردوو سەرەکەی کێبڵەکە",
        "هیچ لایەکیان پێویستی بە کڵۆک ڕەیت نییە"
      ],
      optionsEn: [
        "DCE side (Data Circuit-terminating Equipment)",
        "DTE side (Data Terminal Equipment)",
        "Both ends of the serial cable",
        "Neither side requires clock rate"
      ],
      answerKu: "لایەنەی DCE (Data Circuit-terminating Equipment)",
      answerEn: "DCE side (Data Circuit-terminating Equipment)",
      explKu: "سلایدی ۳۲، ۳۳ و ۸۰ دەڵێت: One side of a serial connection must be considered a DCE. This requires placing a clocking signal – use the clock rate command.",
      explEn: "Slides 32, 33 & 80: The DCE cable end provides the synchronization clocking signal using clock rate 64000."
    },
    {
      id: 11,
      chapterKu: "بەشی ٨: ڕێڕەوی ستاتیک (Static Routing)",
      chapterEn: "Chapter 8: Static Routes Configuration",
      qKu: "فەرمانی دروستی ستاتیک ڕاوت بۆ گەیشتن بە تۆڕی 172.16.1.0/24 لە ڕێگەی ئینتەرفەیسی دەرچوونی Serial 0/0/0 کامەیە؟",
      qEn: "Which is the correct command for configuring a static route to 172.16.1.0/24 via exit interface Serial 0/0/0?",
      options: [
        "R1(config)#ip route 172.16.1.0 255.255.255.0 Serial 0/0/0",
        "R1(config)#ip route 172.16.1.1 255.255.255.0 Serial 0/0/0",
        "R1#ip route 172.16.1.0 255.255.255.0 Serial 0/0/0",
        "R1(config-if)#ip route 172.16.1.0 255.255.255.0"
      ],
      answer: "R1(config)#ip route 172.16.1.0 255.255.255.0 Serial 0/0/0",
      explKu: "بەپێی سلایدی ۳٥: داڕشتەی فەرمانەکە بریتییە لە: Router(config)# ip route network-address subnet-mask {exit-interface | ip-address}.",
      explEn: "Slide 35: The syntax is Router(config)# ip route network-address subnet-mask {exit-interface | ip-address}."
    },
    {
      id: 12,
      chapterKu: "بەشی ٨: ڕێڕەوی ستاتیک (Static Routing)",
      chapterEn: "Chapter 8: Modifying Static Routes",
      qKu: "ئەگەر ستاتیک ڕاوتێکی تۆمارکراو هەڵە بێت، چۆن دەستکاری دەکرێت بەپێی یاسای سیسکۆ؟",
      qEn: "How can an existing incorrect static route be modified according to Cisco IOS rules?",
      optionsKu: [
        "ڕاستەوخۆ دەستکاری ناکرێت، دەبێت بە دانانی no لە پێش فەرمانەکە بسڕدرێتەوە و سەرلەنوێ بنووسرێتەوە",
        "بە فەرمانی edit ip route چاک دەکرێت",
        "بە داخڵکردنی ڕاوتە نوێیەکە، ڕاوتەرەکە خۆی کۆنەکە دەسڕێتەوە",
        "پێویستە تەواوی ڕاوتەرەکە ڕیستارت بکرێتەوە"
      ],
      optionsEn: [
        "Cannot be modified in-place; must be deleted by placing 'no' before the command, then rewritten",
        "Modified directly using 'edit ip route'",
        "Overwritten automatically when typing a new route",
        "Requires restarting the entire router"
      ],
      answerKu: "ڕاستەوخۆ دەستکاری ناکرێت، دەبێت بە دانانی no لە پێش فەرمانەکە بسڕدرێتەوە و سەرلەنوێ بنووسرێتەوە",
      answerEn: "Cannot be modified in-place; must be deleted by placing 'no' before the command, then rewritten",
      explKu: "سلایدی ٤۲ جەخت دەکاتەوە: Existing static routes cannot be modified. The old static route must be deleted by placing 'no' in front of ip route, then rewritten.",
      explEn: "Slide 42: Existing static routes cannot be modified in-place; they must be removed with 'no ip route ...' and rewritten."
    },
    {
      id: 13,
      chapterKu: "بەشی ٨: ڕێڕەوی ستاتیک (Static Routing)",
      chapterEn: "Chapter 8: Default Static Route",
      qKu: "فەرمانی دروستی دانانی ڕێگای دیفۆڵت (Default Static Route) لە ڕاوتەردا کامەیە؟",
      qEn: "What is the correct command to configure a default static route?",
      options: [
        "Router(config)#ip route 0.0.0.0 0.0.0.0 [exit-interface | ip-address]",
        "Router(config)#ip route 255.255.255.255 255.255.255.255 [exit-interface]",
        "Router(config)#default-route 0.0.0.0",
        "Router#ip route any any"
      ],
      answer: "Router(config)#ip route 0.0.0.0 0.0.0.0 [exit-interface | ip-address]",
      explKu: "بەپێی سلایدی ٤٤: لە ڕێگای دیفۆڵتدا destination IP address و subnet mask هەردووکیان هەمووی سفڕن (0.0.0.0 0.0.0.0) کە لەگەڵ هەموو پاکێتێک دەگونجێت.",
      explEn: "Slide 44: A default route matches all packets using quad-zero destination and mask: Router(config)#ip route 0.0.0.0 0.0.0.0 [exit-interface | ip-address]."
    },

    // Chapter 9: Dynamic Routing Protocols (Slides 45-65)
    {
      id: 14,
      chapterKu: "بەشی ٩: ناساندنی پڕۆتۆکۆڵە داینامیکییەکان",
      chapterEn: "Chapter 9: Classful vs Classless Protocols",
      qKu: "کام گرووپ لە پڕۆتۆکۆڵە داینامیکییەکان بە Classful پۆلێن دەکرێن و لە کاتی ئەپدەیتدا سەبنێت ماسک نانێرن؟",
      qEn: "Which group of routing protocols are Classful and do NOT send subnet masks in updates?",
      options: [
        "RIPv1 و IGRP",
        "RIPv2 و OSPF",
        "EIGRP و BGP",
        "OSPF و IS-IS"
      ],
      answer: "RIPv1 و IGRP",
      explKu: "سلایدی ٥٦: Classful routing protocols do NOT send subnet mask in routing updates. ئەمانەش بریتین لە RIPv1 و IGRP. بە پێچەوانەوە RIPv2, EIGRP, OSPF بریتین لە Classless.",
      explEn: "Slide 56: RIPv1 and IGRP are classful and do not transmit subnet masks, unlike classless protocols (RIPv2, EIGRP, OSPF)."
    },
    {
      id: 15,
      chapterKu: "بەشی ٩: ناساندنی پڕۆتۆکۆڵە داینامیکییەکان",
      chapterEn: "Chapter 9: Network Convergence",
      qKu: "چەمکی تەبایی و سەقامگیری (Convergence) لە تۆڕەکاندا بە چ مانایەک دێت؟",
      qEn: "What does network 'Convergence' mean?",
      optionsKu: [
        "کاتێک خشتەی ڕاوتینگی هەموو ڕاوتەرەکان دەگاتە دۆخی تەبایی و هاوتایی زانیارییەکان (Consistency)",
        "کاتێک هەموو ڕاوتەرەکان بەیەک کات هێڵەکەیان دەپچڕێت",
        "کاتێک خێرایی ناردنی داتا دەگاتە ئەوپەڕی توانا",
        "کاتێک پڕۆتۆکۆڵی داینامیک دەگۆڕدرێت بۆ ستاتیک"
      ],
      optionsEn: [
        "When all routers' routing tables are in a state of consistency",
        "When all routers lose connection simultaneously",
        "When bandwidth speed reaches maximum capacity",
        "When dynamic routing is converted to static"
      ],
      answerKu: "کاتێک خشتەی ڕاوتینگی هەموو ڕاوتەرەکان دەگاتە دۆخی تەبایی و هاوتایی زانیارییەکان (Consistency)",
      answerEn: "When all routers' routing tables are in a state of consistency",
      explKu: "بەپێی سلایدی ٥۷ و ۷۳: Convergence is defined as when all routers' routing tables are at a state of consistency.",
      explEn: "Slides 57 & 73: Convergence occurs when all routers share consistent, complete, and up-to-date routing information."
    },
    {
      id: 16,
      chapterKu: "بەشی ٩: ناساندنی پڕۆتۆکۆڵە داینامیکییەکان",
      chapterEn: "Chapter 9: Administrative Distance (AD)",
      qKu: "بەپێی پلەبەندی متمانەی ڕێگاکان (Administrative Distance)، بەهای AD بۆ ڕێگای ستاتیک و ڕێگای بەستراو (Connected) چەندە؟",
      qEn: "According to the Administrative Distance hierarchy, what are the AD values for Connected and Static routes?",
      options: [
        "Connected = 0 | Static = 1",
        "Connected = 1 | Static = 0",
        "Connected = 90 | Static = 110",
        "Connected = 110 | Static = 120"
      ],
      answer: "Connected = 0 | Static = 1",
      explKu: "سلایدی ٦۳ و ٦٤ ڕوونیدەکاتەوە: ڕێگای ڕاستەوخۆ بەستراو (Connected) خاوەنی AD=0 ە و ڕێگای ستاتیک (Static) خاوەنی AD=1 ە. ژمارەی کەمتر واتە متمانەی زیاتر.",
      explEn: "Slides 63 & 64: Directly connected routes have AD=0, and Static routes have AD=1. Lower values have higher preference."
    },

    // Chapter 10: Distance Vector Protocols & RIP (Slides 66-79)
    {
      id: 17,
      chapterKu: "بەشی ١٠: پڕۆتۆکۆڵەکانی Distance Vector و RIP",
      chapterEn: "Chapter 10: Distance Vector Protocols & RIP",
      qKu: "پڕۆتۆکۆڵی RIP بۆ دیاریکردنی باشترین ڕێگا چ جۆرە مەتریکێک (Metric) بەکاردێنێت، و کاتی ناردنی ئەپدەیتە خولییەکانی چەند چرکەیە؟",
      qEn: "What metric does RIP use to select best paths, and what is its periodic update timer?",
      optionsKu: [
        "مەتریک: Hop count | کاتی ئەپدەیت: 30 چرکە",
        "مەتریک: Bandwidth | کاتی ئەپدەیت: 5 چرکە",
        "مەتریک: Delay | کاتی ئەپدەیت: 60 چرکە",
        "مەتریک: Cost | کاتی ئەپدەیت: 180 چرکە"
      ],
      optionsEn: [
        "Metric: Hop count | Periodic Update: 30 seconds",
        "Metric: Bandwidth | Periodic Update: 5 seconds",
        "Metric: Delay | Periodic Update: 60 seconds",
        "Metric: Cost | Periodic Update: 180 seconds"
      ],
      answerKu: "مەتریک: Hop count | کاتی ئەپدەیت: 30 چرکە",
      answerEn: "Metric: Hop count | Periodic Update: 30 seconds",
      explKu: "بەپێی سلایدی ٦۰ و ۷٥: RIP مەتریکی Hop Count بەکاردێنێت و Update timer ی ۳۰ چرکەیە.",
      explEn: "Slides 60 & 75: RIP uses Hop Count as its metric and broadcasts periodic routing updates every 30 seconds."
    },

    // Chapter 11: EIGRP (Slides 80-99)
    {
      id: 18,
      chapterKu: "بەشی ١١: پڕۆتۆکۆڵی EIGRP",
      chapterEn: "Chapter 11: EIGRP Features & Timers",
      qKu: "ئەپدەیتەکانی پڕۆتۆکۆڵی EIGRP لە چ کاتێکدا دەنێردرێن و چۆن وەسف دەکرێن؟",
      qEn: "When are EIGRP routing updates sent, and how are they characterized?",
      optionsKu: [
        "تەنها لە کاتی گۆڕانکاری (Triggered) بە شێوەی بەشەکی (Partial) و سنوردار (Bounded)",
        "هەر ۳۰ چرکە بە شێوەی خولی بۆ هەموو ڕاوتەرەکان دەنێردرێت",
        "تەنها کاتێک ڕاوتەری دراوسێ نامەی Hello نەنێرێت",
        "بە شێوەی هەمیشەیی خشتەی ڕاوتینگ بە تەواوی پەخش دەکرێتەوە"
      ],
      optionsEn: [
        "Triggered by topology changes: Partial and Bounded (sent only to affected devices)",
        "Periodic full table updates sent every 30 seconds",
        "Only when a neighbor stops sending Hello packets",
        "Constantly re-broadcasting entire routing tables"
      ],
      answerKu: "تەنها لە کاتی گۆڕانکاری (Triggered) بە شێوەی بەشەکی (Partial) و سنوردار (Bounded)",
      answerEn: "Triggered by topology changes: Partial and Bounded (sent only to affected devices)",
      explKu: "سلایدی ۷٦ و ۹۱: EIGRP updates are Partial (only changed info), Triggered by topology changes (non-periodic), and Bounded (sent only to impacted devices).",
      explEn: "Slides 76 & 91: EIGRP uses non-periodic bounded partial updates triggered strictly by topology events."
    },

    // Chapter 12: Link-State & OSPF (Slides 100-114)
    {
      id: 19,
      chapterKu: "بەشی ١٢: پڕۆتۆکۆڵی Link-State و OSPF",
      chapterEn: "Chapter 12: Link-State & OSPF",
      qKu: "پڕۆتۆکۆڵی OSPF لەسەر چ ئەلگۆریتمێک کاردەکات و چۆن تێچووی (Cost) ڕێگاکان دەپێوێت؟",
      qEn: "What algorithm does OSPF run, and how is its route Cost metric computed?",
      optionsKu: [
        "ئەلگۆریتمی Dijkstra (Shortest Path First) | تێچوو = 10^8 / bandwidth",
        "ئەلگۆریتمی Bellman-Ford | تێچوو = ژمارەی بازدانەکان (Hop Count)",
        "ئەلگۆریتمی DUAL | تێچوو = Bandwidth + Delay",
        "ئەلگۆریتمی Spanning Tree | تێچوو = درێژی کێبڵەکە"
      ],
      optionsEn: [
        "Dijkstra's SPF Algorithm | Cost = 10^8 / bandwidth",
        "Bellman-Ford Algorithm | Cost = Hop Count",
        "DUAL Algorithm | Cost = Bandwidth + Delay",
        "Spanning Tree Algorithm | Cost = Cable length"
      ],
      answerKu: "ئەلگۆریتمی Dijkstra (Shortest Path First) | تێچوو = 10^8 / bandwidth",
      answerEn: "Dijkstra's SPF Algorithm | Cost = 10^8 / bandwidth",
      explKu: "بەپێی سلایدی ۱۰۱، ۱۰۲ و ۱۱۱: OSPF لەسەر ئەلگۆریتمی Dijkstra (SPF) بنیاتنراوە و مەتریکەکەی بریتییە لە Cost بە هاوکێشەی: 10^8 / bandwidth.",
      explEn: "Slides 101, 102 & 111: OSPF uses Dijkstra's Shortest Path First (SPF) algorithm and accumulates interface Cost = 10^8 / bandwidth."
    },
    {
      id: 20,
      chapterKu: "بەشی ١٢: پڕۆتۆکۆڵی Link-State و OSPF",
      chapterEn: "Chapter 12: OSPF Wildcard Mask",
      qKu: "لە کۆنفیگکردنی فەرمانی network لە پڕۆتۆکۆڵی OSPF دا بۆ تۆڕی 192.168.1.0/24، ویڵدکارد ماسک (Wildcard Mask) چۆن دیاری دەکرێت؟",
      qEn: "In configuring the OSPF network command for 192.168.1.0/24, what is the Wildcard Mask?",
      options: [
        "0.0.0.255 (پێچەوانەی سەبنێت ماسک: 255.255.255.255 - 255.255.255.0)",
        "255.255.255.0",
        "255.255.0.0",
        "0.0.255.255"
      ],
      answer: "0.0.0.255 (پێچەوانەی سەبنێت ماسک: 255.255.255.255 - 255.255.255.0)",
      explKu: "سلایدی ۸٤ و ۱۱۰: لە OSPF پێویستە wildcard mask بنووسرێت کە بریتییە لە inverse (پێچەوانەی) سەبنێت ماسک، واتە بۆ 255.255.255.0 دەبێتە 0.0.0.255.",
      explEn: "Slides 84 & 110: OSPF network configuration requires a wildcard mask, which is the bitwise inverse of the subnet mask (0.0.0.255 for /24)."
    }
  ];

  let currentQuizIndex = 0;
  let quizAnswered = false;

  function initQuizArena() {
    currentQuizIndex = 0;
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    quizAnswered = false;
    const q = universityQuestions[currentQuizIndex];
    if (!q) return;

    const isKu = getCurrentLang() === 'ku';
    const chapterTagEl = document.getElementById('quizChapterTag');
    const counterEl = document.getElementById('quizCounter');
    const textEl = document.getElementById('quizQuestionText');
    const optionsGridEl = document.getElementById('quizOptionsGrid');
    const explBoxEl = document.getElementById('quizExplanationBox');
    const nextBtn = document.getElementById('quizNextBtn');

    if (chapterTagEl) {
      chapterTagEl.style.display = 'inline-flex';
      chapterTagEl.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> ${isKu ? (q.chapterKu || 'بەشی زانکۆ') : (q.chapterEn || 'University Chapter')}`;
    }

    if (counterEl) {
      counterEl.textContent = `${t('questionNumber')} ${currentQuizIndex + 1} / ${universityQuestions.length}`;
    }

    if (textEl) {
      textEl.textContent = isKu ? q.qKu : q.qEn;
    }

    if (explBoxEl) explBoxEl.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';

    const currentOptions = isKu ? (q.optionsKu || q.options) : (q.optionsEn || q.options);
    const currentAnswer = isKu ? (q.answerKu || q.answer) : (q.answerEn || q.answer);

    if (optionsGridEl) {
      optionsGridEl.innerHTML = '';
      currentOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'cyber-btn quiz-option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleQuizOption(opt, btn, q, currentAnswer));
        optionsGridEl.appendChild(btn);
      });
    }
  }

  function handleQuizOption(selected, btnEl, q, currentAnswer) {
    if (quizAnswered) return;
    quizAnswered = true;

    const isCorrect = selected === currentAnswer;
    const explBoxEl = document.getElementById('quizExplanationBox');
    const explTextEl = document.getElementById('quizExplanationText');
    const nextBtn = document.getElementById('quizNextBtn');

    if (isCorrect) {
      SoundFX.correct();
      btnEl.classList.add('btn-correct');
      addXP(50);
    } else {
      SoundFX.wrong();
      btnEl.classList.add('btn-wrong');
      // Highlight correct one
      const allBtns = document.querySelectorAll('.quiz-option-btn');
      allBtns.forEach(b => {
        if (b.textContent === currentAnswer) b.classList.add('btn-correct');
      });
    }

    if (explBoxEl && explTextEl) {
      explTextEl.textContent = getCurrentLang() === 'ku' ? q.explKu : q.explEn;
      explBoxEl.style.display = 'block';
    }
    if (nextBtn) nextBtn.style.display = 'inline-block';
  }

  function handleNextQuizQuestion() {
    currentQuizIndex++;
    if (currentQuizIndex >= universityQuestions.length) {
      // Completed all
      SoundFX.levelUp();
      addXP(100);
      const textEl = document.getElementById('quizQuestionText');
      const optionsGridEl = document.getElementById('quizOptionsGrid');
      const nextBtn = document.getElementById('quizNextBtn');
      if (textEl) textEl.innerHTML = `🎉 <strong>${t('quizCompleted')}</strong><br>${t('quizReviewMsg')}`;
      if (optionsGridEl) {
        optionsGridEl.innerHTML = `
          <button class="cyber-btn primary-glow" onclick="SubnetGames.initQuizArena()">
            🔄 ${t('playAgain')}
          </button>
        `;
      }
      if (nextBtn) nextBtn.style.display = 'none';
    } else {
      renderQuizQuestion();
      SoundFX.click();
    }
  }

  // Aliases for backward compatibility
  const initSubnetSlicer = initDetectiveGame;
  const handleVerifySlicer = applyDeviceFix;
  const handleNextSlicerLevel = handleNextDetectiveCase;
  const handleResetSlicer = handleResetDetectiveCase;

  return {
    initDetectiveGame,
    inspectDevice,
    selectRootCause,
    selectFixAction,
    applyDeviceFix,
    handleNextDetectiveCase,
    handleResetDetectiveCase,
    handleRandomDetectiveCase,
    initSubnetSlicer,
    handleVerifySlicer,
    handleNextSlicerLevel,
    handleResetSlicer,
    startSpeedGame,
    handleSpeedPass,
    initBinaryMatrix,
    newBinaryChallenge,
    handleCheckBinary,
    initQuizArena,
    handleNextQuizQuestion,
    updateStatsUI,
    getPlayerStats: () => playerStats
  };
})();

if (typeof window !== 'undefined') {
  window.SubnetGames = SubnetGames;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SubnetGames;
}
