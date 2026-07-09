import React from 'react';

export const Header = () => {
  return (
    <div className="header">
      <div className="lang-container">
        <div className="lang-selector">
          <button className="lang-toggle" id="langToggle">
            <span className="lang-flag" id="langFlag">🇬🇧</span>
            <span id="langCode">EN</span>
          </button>
          <div className="lang-dropdown" id="langDropdown" style={{ display: 'none' }}>
            <button className="lang-option" data-lang="en"><span className="lang-flag">🇬🇧</span><span>English</span></button>
            <button className="lang-option" data-lang="es"><span className="lang-flag">🇪🇸</span><span>Español</span></button>
            <button className="lang-option" data-lang="fr"><span className="lang-flag">🇫🇷</span><span>Français</span></button>
            <button className="lang-option" data-lang="it"><span className="lang-flag">🇮🇹</span><span>Italiano</span></button>
            <button className="lang-option" data-lang="de"><span className="lang-flag">🇩🇪</span><span>Deutsch</span></button>
            <button className="lang-option" data-lang="pt"><span className="lang-flag">🇵🇹</span><span>Português</span></button>
            <button className="lang-option" data-lang="zh"><span className="lang-flag">🇨🇳</span><span>简体中文</span></button>
          </div>
        </div>
        <div className="lang-overlay" id="langOverlay" style={{ display: 'none' }}></div>
      </div>
      <h1 id="headerTitle">Bubble Breathing</h1>
      <div id="progressBar">
        <div id="progressFill"></div>
      </div>
      <button className="theme-toggle-btn" id="themeToggleBtn" title="Change theme">🌙</button>
      <button className="finish-btn hidden" id="finishBtn">Finish</button>
    </div>
  );
};
