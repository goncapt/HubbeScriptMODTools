class ModTool {
    constructor() {
        this.loadInitialData();
        this.events = new Map();
    }

    loadInitialData() {
        this.roomName = '';
        this.roomsVisiteds = this.loadStorageItem('roomsVisiteds', []);
        this.cota = this.loadStorageItem('roomsId', [], true);
        this.lastCota = parseInt(localStorage.getItem('lastCota')) || 0;
        this.startedCota = localStorage.getItem('startedCota') === 'true';
        this.eventsHeld = parseInt(localStorage.getItem('eventsHeld')) || 1;
        this.modEventsHeld = this.roomsVisiteds.length || 1;
    }

    loadStorageItem(itemName, defaultValue, isIdList = false) {
        const storedValue = localStorage.getItem(itemName);
        return storedValue ? (isIdList ? this.convertRoomsId(storedValue) : JSON.parse(storedValue)) : defaultValue;
    }

    convertRoomsId(roomsId) {
        return roomsId.split(',').map(id => id.trim()).filter(id => id);
    }

    init() {
        this.observeMutations();
        this.createLayout();
        setTimeout(() => this.registerEvents(), 1000);
    }

    observeMutations() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => mutation.addedNodes.forEach(node => this.handleMutation(node)));
        });
        observer.observe(document.querySelector('#root'), {childList: true, subtree: true});
    }

    handleMutation(node) {
        const execFunction = this.events.get(`.${node.className}`) || this.events.get(`#${node.id}`);
        if (execFunction) execFunction(node);
    }

    createLayout() {
        const customDiv = $('<div id="custom-layout"></div>')[0];
        document.body.appendChild(customDiv);

        this.injectCustomLayout();
        this.injectStyles();
    }

    injectCustomLayout() {
        $('#custom-layout').html(`
          <div class="main-container">
            <div class="tw-flex tw-justify-between tw-items-center tw-w-full tw-font-bold">
                <span class="tw-flex tw-items-center">
                    <img src="https://i.imgur.com/RBmd5uc.png" class="tw-mr-2">
                    Ferramenta da Moderação
                </span>
                <div class="closeButton tw-flex">
                    <div class="minimize-container" id="minimize_mod_tools">
                        <i class="fas fa-window-minimize minimize"></i>
                    </div>
                    <div class="close-container" id="close_mod_tools">
                        <i class="fa-solid fa-square-xmark close"></i>
                    </div>
                </div>
            </div>

              <hr class="tw-my-[5px] tw-w-full tw-border-t-[1px] tw-border-b-[1px] tw-border-t-[rgba(0,0,0,0.1)] tw-border-b-[rgba(50,50,50,1)]">

            <div class="container_buttons">
                <div class="container_button">
                    <label class="cb-txt">Iniciar Cota</label>
                    <button class="btn_send" id="start_cota">Enviar</button>
                </div>

                <div class="container_button">
                    <label class="cb-txt">Fechar Cota</label>
                    <button class="btn_send" id="close_cota">Enviar</button>
                </div>

                <div class="container_button">
                    <label class="cb-txt">Chamar EV</label>
                    <button class="btn_send" id="summon_cota">Enviar</button>
                </div>

                <div class="container_button">
                    <label class="cb-txt">Kikar Todos os Usuários</label>
                    <button class="btn_send" id="roomkick">Enviar</button>
                </div>

                 <div class="container_button">
                    <label class="cb-txt">Mutar o Quarto</label>
                    <button class="btn_send" id="roommute">Enviar</button>
                </div>
                
                <div class="container_button">
                    <label class="cb-txt">Cota Automática</label>
                    <label class="switch" id="enable_automatic_cota"><input type="checkbox"><span class="slider"></span></label>
                </div>
                
                <div class="container_button cota_automatic">
                    <label class="cb-txt">Iniciar Cota Automática</label>
                    <button class="btn_send" id="automatic_cota">Enviar</button>
                </div>
                
                <div class="container_button">
                    <label class="cb-txt cota_automatic">Pegar ID do quarto atual</label>
                    <button class="btn_send cota_automatic" id="get_room_id">Enviar</button>
                </div>
                
                <div class="container_inputs">
                    <label class="label_info" for="nameInput">Digite seu nome (MOD):</label>
                    <input type="text" id="nameInput" class="input_info" value="${localStorage.getItem('modName') || ''}">
                    
                    <label class="label_info cota_automatic" for="roomsId">Digite os IDs dos quartos (separe por vírgula):</label>
                    <input type="text" id="roomsId" class="input_info cota_automatic" value="${localStorage.getItem('roomsId') || ''}">
                    
                   <label for="cotas_done" class="label_info cota_automatic">Contagem dos seus Eventos</label>
                   <input type="number" id="cotas_done" class="input_info cota_automatic" value="${this.modEventsHeld}">
                    
                   <label for="indexCota" class="label_info cota_automatic">Contagem dos Eventos em Geral</label>
                   <input type="number" id="indexCota" class="input_info cota_automatic" value="${this.eventsHeld}">
                </div>

                <div class="container_button">
                    <label class="cb-txt" id="events_quantity">Quantidade de Eventos já realizados: ${this.roomsVisiteds.length}</label>
                    <button class="btn_send" id="clear">Limpar</button>
                </div>
            </div>
        </div>
    `);
    }

    injectStyles() {
        const style = (`
            <style>
                .cb-txt {
                    width: 150px;
                    margin-top: 6px;
                }
    
                .cb-p {
                    font-size: 8px;
                    margin-top: 3px;
                    color: #515057;
                }
    
                .main-container {
                    font-weight: 700;
                    position: absolute;
                    top: 15vh;
                    left: 8%;
                    font-size: 10px;
                    font-family: Verdana;
                    font-style: normal;
                    line-height: normal;
                    color: #fff;
                    width: 250px;
                    height: auto;
                    overflow: hidden;
                    border-radius: 3px;
                    background: rgba(28,30,34,.95);
                    box-shadow: 0 3px rgba(255,255,255,.05) inset, 0 -3px rgba(0,0,0,.25) inset;
                    display: inline-flex;
                    padding: 10px 7px;
                    flex-direction: column;
                }
    
                .container_buttons {
                    /*text-align: center;*/
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    align-items: center;
                    font-size: 10px;
                    width: 100%;
                }
    
                .container_button {
                    display: flex;
                    flex-direction: column;
                    flex-direction: row;
                    gap: 15px;
                }
    
                .btn_send {
                    background: #1ecb2f;
                    background-image: -webkit-linear-gradient(top, #1ecb2f, 1dc32d);
                    background-image: -moz-linear-gradient(top, #1ecb2f, 1dc32d);
                    background-image: -ms-linear-gradient(top, #1ecb2f, 1dc32d);
                    background-image: -o-linear-gradient(top, #1ecb2f, 1dc32d);
                    background-image: linear-gradient(to bottom, #1ecb2f, 1dc32d);
                    -webkit-border-radius: 3;
                    -moz-border-radius: 3;
                    border-radius: 3px;
                    font-family: Arial;
                    color: #ffffff;
                    font-size: 10px;
                    padding: 5px;
                    border: solid #21b930 2px;
                    text-decoration: none;
                }
                
                .icon-mod_tools {
                    background: url('https://i.imgur.com/RBmd5uc.png') no-repeat;
                    width: 20px;
                    height: 22px;
                }
                
                .modal_content {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    pointer-events: auto;
                }
                
                .container_inputs {
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                    gap: 5px;
                    margin-top: 8px;
                }
    
                .input_info {
                    width: fit-content;
                    align-self: center;
                    padding: 5px;
                    border-radius: 3px;
                    border: 1px solid #05ff0d;
                    background-color: #fff;
                    color: #000;
                }
            </style>`
        );

        $('head').append(style);
    }

    registerEvents() {
        this.events.set('.w-100 h-100', () => {
            this.events.delete('.w-100 h-100');
            this.createElementDraggable('main-container');
        });

        this.events.set('.d-flex flex-column gap-2 align-items-center justify-content-center', (node) => {
            setTimeout(() => {
                const element = $(node).find('.d-flex.flex-column.gap-1')[0];
                const roomInfo = $(element).children().first()[0];
                if (roomInfo && roomInfo.innerText.startsWith('[E')) {
                    this.roomName = roomInfo.innerText;
                }
            }, 1000);
        });

        this.events.set('.d-flex gap-2 nitro-room-tools-container room-widget-open', () => {
            const nitroRoomTools = $('.nitro-room-tools')[0];
            if (nitroRoomTools.querySelector('.icon-mod_tools')) {
                return;
            }
            const element = $('<div class="cursor-pointer icon icon-mod_tools" title="Ferramenta da Moderação"></div>')[0];
            nitroRoomTools.append(element);
            element.addEventListener('click', () => {
                $('#custom-layout').show();
            });
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        $('#minimize_mod_tools').on('click', () => {
            const element = $('.main-container')[0];
            if (element.style.height === '40px') {
                element.style.height = 'auto';
                element.style.width = '250px';
            } else {
                element.style.height = '50px';
                element.style.width = '35px';
            }
        });

        $('#nameInput').on('change', (event) => {
            localStorage.setItem('modName', event.target.value);
        });

        $('#start_cota').on('click', this.digitarNoChatInput.bind(this));
        $('#close_cota').on('click', this.digitarcloseNoChatInput.bind(this));
        $('#automatic_cota').on('click', this.comecarCotaAutomaticaInput.bind(this));
        $('#summon_cota').on('click', this.digitarEVNoChatInput.bind(this));
        $('#roomkick').on('click', this.digitarRoomKickNoChatInput.bind(this));
        $('#roommute').on('click', this.digitarRoomMuteNoChatInput.bind(this));
        $('#close_mod_tools').on('click', this.closeModTools.bind(this));
        $('#get_room_id').on('click', this.getRoomId.bind(this));
        $('#clear').on('click', this.clearEvents.bind(this));
        $('#enable_automatic_cota').on('click', this.enableAutomaticCota.bind(this));

        $('#roomsId').on('change', (event) => this.updateRoomsId(event).bind(this));
        $('#indexCota').on('change', (event) => this.updateEventsHeld(event));
        $('#cotas_done').on('change', (event) => this.updateModEventsHeld(event));

        $('.cota_automatic').hide();

        $('.tw-mr-2').on('click', () => {
            const element = $('.main-container')[0];
            element.style.height = 'auto';
            element.style.width = '250px';
        });
    }

    alert(message) {
        // Custom alert implementation.
    }

    createElementDraggable(classElement) {
        const draggableDiv = document.querySelector('.' + classElement);
        let offsetX, offsetY, isDragging = false;

        draggableDiv.addEventListener('mousedown', (e) => {
            if (e.target.matches('input') || e.target.closest('input')) {
                return;
            }

            isDragging = true;
            offsetX = e.clientX - draggableDiv.getBoundingClientRect().left;
            offsetY = e.clientY - draggableDiv.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;

                draggableDiv.style.left = `${x}px`;
                draggableDiv.style.top = `${y}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    dispatchEnterEvent(element) {
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
        });

        element.dispatchEvent(event);
    }

    typeInChatInput(text) {
        const chatInput = $('.chat-input')[0];

        if (chatInput) {
            chatInput.value = text;

            chatInput.dispatchEvent(new Event('input'));

            this.dispatchEnterEvent(chatInput);

            chatInput.value = '';

            if (text.startsWith(':')) {
                if (text === ':ev')
                    modTool.alert('Todos foram chamados para o quarto.');

                if (modTool.roomName && !modTool.roomsVisiteds.includes(modTool.roomName)) {
                    modTool.roomsVisiteds.push(modTool.roomName);

                    $('#events_quantity').text(`Quantidade de Eventos já realizados: ${modTool.roomsVisiteds.length}`);

                    localStorage.setItem('roomsVisiteds', modTool.roomsVisiteds.join(','));
                }
            }
        } else {
            throw new Error('Chat input not found!');
        }
    }

    digitarNoChatInput() {
        this.typeInChatInput(':iniciarcota');

        this.alert('Cota iniciada.');

        this.startedCota = true;
    }

    digitarRoomKickNoChatInput() {
        this.typeInChatInput(':roomkick amo voces');

        this.alert('Todos foram kikados do quarto.');
    }

    digitarRoomMuteNoChatInput() {
        this.typeInChatInput(':roommute');
    }

    digitarcloseNoChatInput() {
        if (this.startedCota) {
            this.typeInChatInput(':fecharcota');
            this.alert('Cota finalizada');
        }

        this.startedCota = false;

        this.showEventsVisiteds();
    }

    digitarEVNoChatInput() {
        this.typeInChatInput(':ev');

        setTimeout(() => {
            if (!this.startedCota) {
                return;
            }

            this.typeInChatInput('eae como ces ta, bora para mais um evento do hubbe?');

            setTimeout(() => {
                if (!this.startedCota) {
                    return;
                }

                this.typeInChatInput('alguma questao amigos? bem facil esse ev aq');
            }, 3000);

            setTimeout(() => {
                if (!this.startedCota) {
                    return;
                }

                this.typeInChatInput('começando o evento amigos');
            }, 9000);
        }, 1000);
    }

    comecarCotaAutomaticaInput() {
        digitarRoomKickNoChatInput.bind(this)();

        const modName = $('#nameInput').val();

        if (!modName) {
            this.alert('Digite seu nome de MOD no campo de texto!');
            return;
        }

        if (this.lastCota === this.cota.length) {
            this.lastCota = 0;
            this.alert('Cota esgotada!');
            this.digitarcloseNoChatInput.bind(this)();
            return;
        }

        this.typeInChatInput(`:enviaruser ${modName} ${this.cota[this.lastCota++]}`);

        setTimeout(() => {
            this.typeInChatInput(':desativar enable');
        }, 100);

        setTimeout(() => {
            this.typeInChatInput(':ev');
        }, 1000);
    }

    closeModTools() {
        $('#custom-layout').hide();
    }

    closeAllTabsFromRoomId() {
        $('.nitro-card-header-close').click();
    }

    getRoomId() {
        this.clickOnElement($('div[class="cursor-pointer icon icon-cog"]')[0]);

        setTimeout(() => {
            this.clickOnElement($('svg[class="cursor-pointer fa-icon"]')[0]);

            setTimeout(() => {
                const roomId = $('input[class="form-control form-control-sm"]').val().replace('https://hubbe.biz/room/', '');

                if (!roomId) {
                    this.closeAllTabsFromRoomId();
                    this.alert('ID do quarto não encontrado!');
                    return;
                }

                if (this.cota.includes(roomId)) {
                    this.closeAllTabsFromRoomId();
                    this.alert('Quarto já adicionado!');
                    return;
                }

                this.cota.push(roomId);

                localStorage.setItem('roomsId', this.cota.join(','));

                $('#roomsId').val(this.cota.join(','));

                this.closeAllTabsFromRoomId();
            }, 100);
        }, 100);
    }

    clickOnElement(element) {
        if (element) {
            element.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
        }
    }

    clearEvents() {
        this.roomsVisiteds = [];
        this.eventsHeld = 0;
        this.modEventsHeld = 0;
        this.lastCota = 0;

        localStorage.removeItem('eventsHeld');
        localStorage.removeItem('roomsVisiteds');
        localStorage.removeItem('lastCota');

        $('#events_quantity').text(`Quantidade de Eventos já realizados: ${this.roomsVisiteds.length}`);
        $('#cotas_done').val(0);
        $('#indexCota').val(0);
    }

    enableAutomaticCota() {
        setTimeout(() => {
            const slider = $('#enable_automatic_cota').find('.slider')[0];
            const enabled = window
                .getComputedStyle(slider)
                .getPropertyValue('background-color')
                .replace('rgb(', '')
                .replace(')', '')
                .split(', ')[0] > 100;

            if (enabled) {
                $('.cota_automatic').show();
            } else {
                $('.cota_automatic').hide();
            }
        }, 50);
    }

    updateEventsHeld(event) {
        this.eventsHeld = parseInt(event.target.value);
        localStorage.setItem('eventsHeld', this.eventsHeld);

        $('#indexCota').val(this.eventsHeld);

        $('#events_quantity').text(`Quantidade de Eventos já realizados: ${this.roomsVisiteds.length}`);
    }

    updateModEventsHeld(event) {
        this.modEventsHeld = parseInt(event.target.value);
        localStorage.setItem('modEventsHeld', this.modEventsHeld);

        $('#cotas_done').val(this.modEventsHeld);

        $('#events_quantity').text(`Quantidade de Eventos já realizados: ${this.roomsVisiteds.length}`);
    }

    updateRoomsId(event) {
        this.cota = this.convertRoomsId(event.target.value);
        localStorage.setItem('roomsId', event.target.value);
        this.lastCota = 0;
        localStorage.setItem('lastCota', this.lastCota);
    }

    showEventsVisiteds() {
        const eventsVisiteds = this.roomsVisiteds.map((room, index) => {
            return `
            <tr>
                <td>${index + 1}º</td>
                <td>${room}</td>
            </tr>
        `;
        });

        const table = `
        <table>
            <tr>
                <th>Ordem</th>
                <th>Evento</th>
            </tr>
            ${eventsVisiteds.join('')}
        </table>
    `;

        const modal = `
        <div class="main-container modal_events" style="left: 587px; top: 131px;">
            <div class="tw-flex tw-justify-between tw-items-center tw-w-full tw-font-bold">
                <span class="tw-flex tw-items-center">
                    <img src="https://i.imgur.com/RBmd5uc.png" class="tw-mr-2">
                    Eventos Realizados
                </span>
                
                <div class="closeButton tw-flex">
                    <div class="close-container" id="modal_close">
                        <i class="fa-solid fa-square-xmark close"></i>
                    </div>
                </div>
            </div>
            
            <hr class="tw-my-[5px] tw-w-full tw-border-t-[1px] tw-border-b-[1px] tw-border-t-[rgba(0,0,0,0.1)] tw-border-b-[rgba(50,50,50,1)]">
           
            <div class="modal_content">
                ${table}
            </div>
            
            <div class="container_buttons" style="margin-top: 10px;">
                <div class="container_button" style="width: 100%;">
                    <button class="btn_send" id="copy">Copiar Cota</button>
                </div>
            </div>
        </div>
    `;

        $('#custom-layout').append(modal);

        $('#modal_close').click(() => {
            $('.modal_events').remove();
        });

        $('#copy').click(() => {
            if (!this.modEventsHeld || this.modEventsHeld < 1) {
                this.modEventsHeld = 1;
            }

            if (!this.eventsHeld || this.eventsHeld < 1) {
                this.eventsHeld = 1;
            }

            const text = this.roomsVisiteds
                .map((room) => `${this.modEventsHeld < 10 ? '0' : ''}${this.modEventsHeld++}.${this.eventsHeld < 10 ? '0' : ''}${this.eventsHeld++} ${room}\n**Finalizado**`)
                .join('\n');

            navigator.clipboard.writeText(text).then(() => {
                this.alert('Cota copiada!');
            });

            localStorage.setItem('eventsHeld', this.eventsHeld);

            $('#indexCota').val(this.eventsHeld);
            $('#cotas_done').val(this.modEventsHeld);
        });

        this.createElementDraggable('modal_events');
    }
}

(function () {
    const modTool = new ModTool();
    modTool.init();
})();