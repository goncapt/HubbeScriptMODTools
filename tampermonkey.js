// ==UserScript==
// @name         Ferramenta da MODeração
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ferramenta de automatização para MODeradores do Hubbe.biz!
// @author       Gon & Senhoreu
// @match        https://hubbe.biz/jogardev
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    const url = `https://raw.githubusercontent.com/goncapt/HubbeScriptMODTools/main/script.js?v=${Date.now()}`;

    fetch(url)
        .then(response => response.text())
        .then(script => {
            const scriptElement = document.createElement('script');
            scriptElement.innerHTML = script;
            document.body.appendChild(scriptElement);
        });
})();