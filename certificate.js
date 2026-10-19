/**
 * Subnet Master - University Certificate Generator
 * Generates and prints an authentic, high-res Kurdish / English academic certificate.
 */

const SubnetCertificate = (() => {
  function init() {
    const printBtn = document.getElementById('certPrintBtn');
    const nameInput = document.getElementById('certStudentNameInput');

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        SoundFX.click();
        window.print();
      });
    }

    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        const displayEl = document.getElementById('certRecipientName');
        if (displayEl) {
          displayEl.textContent = val || (getCurrentLang() === 'ku' ? 'ناوی فێرخواز لێرە دەردەکەوێت' : 'Student Name Here');
        }
      });
    }

    updateCertificateDetails();
  }

  function updateCertificateDetails() {
    const dateEl = document.getElementById('certIssuedDate');
    const scoreEl = document.getElementById('certScoreBadge');

    if (dateEl) {
      const now = new Date();
      const formatted = now.toLocaleDateString(getCurrentLang() === 'ku' ? 'ar-IQ' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      dateEl.textContent = `${t('certIssuedDate')} ${formatted}`;
    }

    if (scoreEl) {
      const stats = SubnetGames.getPlayerStats();
      scoreEl.textContent = `XP: ${stats.xp} | ${t('levelLabel')}: ${stats.level}`;
    }
  }

  return {
    init,
    updateCertificateDetails
  };
})();

if (typeof window !== 'undefined') {
  window.SubnetCertificate = SubnetCertificate;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SubnetCertificate;
}

