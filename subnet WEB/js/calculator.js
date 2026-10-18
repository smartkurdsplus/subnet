/**
 * Subnet Master - Visual Subnet Calculator & Inspector
 * Provides instant calculations, binary visual bit breakdown, and subnet division table.
 */

const SubnetCalculator = (() => {
  function init() {
    const calcBtn = document.getElementById('calcSubmitBtn');
    const ipInput = document.getElementById('calcIpInput');
    const cidrSelect = document.getElementById('calcCidrSelect');

    if (calcBtn) {
      calcBtn.addEventListener('click', () => {
        SoundFX.click();
        performCalculation();
      });
    }

    if (ipInput) {
      ipInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          SoundFX.click();
          performCalculation();
        }
      });
    }

    if (cidrSelect) {
      cidrSelect.addEventListener('change', () => {
        SoundFX.bitToggle(true);
        performCalculation();
      });
    }

    // Run initial calculation with default IP
    performCalculation();
  }

  function performCalculation() {
    const ipInput = document.getElementById('calcIpInput');
    const cidrSelect = document.getElementById('calcCidrSelect');

    const ip = (ipInput ? ipInput.value.trim() : '') || '192.168.10.68';
    const cidr = parseInt(cidrSelect ? cidrSelect.value : 26, 10) || 26;

    if (!SubnetEngine.isValidIp(ip)) {
      alert(getCurrentLang() === 'ku' ? 'تکایە ناونیشانی ئایپی بە شێوەیەکی دروست بنووسە (بۆ نموونە: 192.168.1.1)' : 'Please enter a valid IPv4 address (e.g. 192.168.1.1)');
      return;
    }

    const netAddress = SubnetEngine.getNetworkAddress(ip, cidr);
    const bcastAddress = SubnetEngine.getBroadcastAddress(ip, cidr);
    const range = SubnetEngine.getUsableRange(ip, cidr);
    const mask = SubnetEngine.cidrToMask(cidr);
    const wildcard = SubnetEngine.getWildcardMask(cidr);
    const totalHosts = SubnetEngine.getTotalHosts(cidr);
    const usableHosts = SubnetEngine.getUsableHosts(cidr);
    const ipClass = SubnetEngine.getIpClass(ip);
    const isPriv = SubnetEngine.isPrivate(ip);
    const magic = SubnetEngine.getMagicNumberInfo(cidr);

    // Update Summary UI
    setVal('resNetAddress', netAddress);
    setVal('resBroadcast', bcastAddress);
    setVal('resFirstUsable', range.first);
    setVal('resLastUsable', range.last);
    setVal('resMask', mask);
    setVal('resWildcard', wildcard);
    setVal('resTotalHosts', totalHosts.toLocaleString());
    setVal('resUsableHosts', usableHosts.toLocaleString());
    setVal('resClass', `${ipClass} (${isPriv ? t('privateIp') : t('publicIp')})`);
    setVal('resMagicNumber', `${magic.magicNumber} (${getCurrentLang() === 'ku' ? 'ئۆکتێتی' : 'Octet'} ${magic.interestingOctet})`);

    // Render Binary Visualization
    renderBinaryInspector(ip, cidr);

    // Render Subnet Division Map
    renderSubnetDivisionMap(ip, cidr);
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderBinaryInspector(ip, cidr) {
    const container = document.getElementById('calcBinaryContainer');
    if (!container) return;

    const ipBinOctets = SubnetEngine.toBinaryOctets(ip);
    const maskBinOctets = SubnetEngine.toBinaryOctets(SubnetEngine.cidrToMask(cidr));
    const netBinOctets = SubnetEngine.toBinaryOctets(SubnetEngine.getNetworkAddress(ip, cidr));

    let html = `
      <div class="binary-display-wrapper">
        <div class="binary-row">
          <div class="binary-row-title">${t('ipBinary')} (${ip})</div>
          <div class="binary-octets-flex">
            ${ipBinOctets.map((oct, i) => `<span class="oct-block">${oct}</span>`).join('<span class="oct-dot">.</span>')}
          </div>
        </div>

        <div class="binary-row">
          <div class="binary-row-title">${t('maskBinary')} (/${cidr})</div>
          <div class="binary-octets-flex">
            ${renderColorCodedMaskOctets(cidr)}
          </div>
        </div>

        <div class="binary-op-separator">
          <span>AND (Bitwise Logic)</span>
        </div>

        <div class="binary-row">
          <div class="binary-row-title">${t('andResult')}</div>
          <div class="binary-octets-flex result-octets">
            ${netBinOctets.map((oct, i) => `<span class="oct-block net-res">${oct}</span>`).join('<span class="oct-dot">.</span>')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  function renderColorCodedMaskOctets(cidr) {
    let html = '';
    let bitCounter = 0;
    for (let oct = 0; oct < 4; oct++) {
      let octHtml = '<span class="oct-block">';
      for (let b = 0; b < 8; b++) {
        if (bitCounter < cidr) {
          octHtml += `<span class="bit-net" title="Network bit">1</span>`;
        } else {
          octHtml += `<span class="bit-host" title="Host bit">0</span>`;
        }
        bitCounter++;
      }
      octHtml += '</span>';
      if (oct < 3) octHtml += '<span class="oct-dot">.</span>';
      html += octHtml;
    }
    return html;
  }

  function renderSubnetDivisionMap(ip, cidr) {
    const tbody = document.getElementById('calcSubnetsTableBody');
    if (!tbody) return;

    // Show siblings under parent block
    // E.g., if /26, show all /26 subnets in the /24 parent, or if /28, show all in /24
    let parentCidr = Math.max(16, cidr - 3);
    if (cidr >= 24) parentCidr = 24;
    else if (cidr >= 16) parentCidr = 16;
    else parentCidr = 8;

    const parentNet = SubnetEngine.getNetworkAddress(ip, parentCidr);
    const subnetsData = SubnetEngine.generateSubnetsList(parentNet, parentCidr, cidr, 32);

    tbody.innerHTML = '';
    subnetsData.generated.forEach((s) => {
      const isCurrentSubnet = s.network === SubnetEngine.getNetworkAddress(ip, cidr);
      const tr = document.createElement('tr');
      if (isCurrentSubnet) tr.className = 'active-subnet-row';

      tr.innerHTML = `
        <td><span class="sub-idx">${s.index}</span></td>
        <td><code class="cyber-code">${s.network}/${s.cidr} ${isCurrentSubnet ? '⭐' : ''}</code></td>
        <td><code>${s.firstUsable} - ${s.lastUsable}</code></td>
        <td><code>${s.broadcast}</code></td>
        <td><span class="badge-tag">${s.usableHosts.toLocaleString()}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  return {
    init,
    performCalculation
  };
})();

if (typeof window !== 'undefined') {
  window.SubnetCalculator = SubnetCalculator;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SubnetCalculator;
}

