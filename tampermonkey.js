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

    const url = `https://raw.githubusercontent.com/Senhoreuu/modTools/main/script.js?token=GHSAT0AAAAAACLUEJ67QKFRL2WQL4HUVJE4ZOLYCVQ&v=${Date.now()}`;

    fetch(url)
        .then(response => response.text())
        .then(script => {
            const scriptElement = document.createElement('script');
            scriptElement.innerHTML = script;
            document.body.appendChild(scriptElement);
        });
})();