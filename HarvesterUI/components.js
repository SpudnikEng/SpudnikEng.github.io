class ComponentFactory {
    static create(config) {
        switch (config.type) {
            case 'ChainControl':
                return new ChainControl(config);
            case 'RollerControl':
                return new RollerControl(config);
            case 'Header':
                return new HeaderControl(config);
            case 'ShakerControl':
                return new ShakerControl(config);
            case 'Group':
                return new GroupControl(config);
            case 'SpeedControl':
                return new SpeedControl(config);
            case 'HeightControl':
                return new HeightControl(config);
            case 'DisplayValue':
                return new DisplayValue(config);
            case 'ToggleButton':
                return new ToggleButton(config);
            case 'ModeButton':
                return new ModeButton(config);
            default:
                console.warn(`Unknown component type: ${config.type}`);
                return null;
        }
    }
}

class BaseComponent {
    constructor(config) {
        this.config = config;
        this.element = document.createElement('div'); // Default to div for absolute layout
        if (config.x !== undefined && config.y !== undefined) {
            this.element.style.position = 'absolute';
            this.element.style.left = config.x + 'px';
            this.element.style.top = config.y + 'px';
        }
    }

    render() {
        return this.element;
    }
}

class SpeedControl extends BaseComponent {
    constructor(config) {
        super(config);
        this.element.className = "speed-control-panel";
        this.element.style.background = "#ccc";
        this.element.style.padding = "10px";
        this.element.style.borderRadius = "10px";
        this.element.style.width = "200px";
        this.element.style.textAlign = "center";
    }

    render() {
        const { label, options, bindings } = this.config;
        this.element.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <button class="ter-button" onclick="Engine.emit('command', {cmd: 'prev', id: '${bindings.prev}'})">Prev</button>
                <span style="font-weight:bold;">${options[0]}</span>
                <button class="ter-button" onclick="Engine.emit('command', {cmd: 'next', id: '${bindings.next}'})">Next</button>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; align-items: center;">
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <button class="ter-button b-textOnly" onclick="Engine.emit('bump', {id: '${bindings.value}', dir: 'up', step: 5})">+5</button>
                    <button class="ter-button b-textOnly" onclick="Engine.emit('bump', {id: '${bindings.value}', dir: 'dn', step: 5})">-5</button>
                </div>
                <div style="font-size: 30px; font-weight: bold;" id="${bindings.value}">0</div>
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <button class="ter-button b-textOnly" onclick="Engine.emit('bump', {id: '${bindings.value}', dir: 'up', step: 1})">+1</button>
                    <button class="ter-button b-textOnly" onclick="Engine.emit('bump', {id: '${bindings.value}', dir: 'dn', step: 1})">-1</button>
                </div>
            </div>
        `;
        return this.element;
    }
}

class HeightControl extends BaseComponent {
    constructor(config) {
        super(config);
        this.element.style.textAlign = "center";
        this.element.style.color = "white";
    }

    render() {
        const { label, bindings } = this.config;
        this.element.innerHTML = `
            <div style="font-size: 20px; margin-bottom: 5px;">${label}</div>
            <div style="display:flex; gap: 10px;">
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <button class="ter-button arrowUp" onclick="Engine.emit('bump', {id: '${bindings.leftVal}', dir: 'up'})"></button>
                    <span>left</span>
                    <div class="inset-container" style="background:white; color:black; font-size:25px; width:60px;" id="${bindings.leftVal}">0</div>
                    <button class="ter-button arrowDown" onclick="Engine.emit('bump', {id: '${bindings.leftVal}', dir: 'dn'})"></button>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <button class="ter-button arrowUp" onclick="Engine.emit('bump', {id: '${bindings.rightVal}', dir: 'up'})"></button>
                    <span>right</span>
                    <div class="inset-container" style="background:white; color:black; font-size:25px; width:60px;" id="${bindings.rightVal}">0</div>
                    <button class="ter-button arrowDown" onclick="Engine.emit('bump', {id: '${bindings.rightVal}', dir: 'dn'})"></button>
                </div>
            </div>
        `;
        return this.element;
    }
}

class DisplayValue extends BaseComponent {
    constructor(config) {
        super(config);
        if (config.style) this.element.style.cssText += config.style;
        if (config.width) this.element.style.width = config.width + 'px';
        if (config.height) this.element.style.height = config.height + 'px';
    }

    render() {
        const { label, id, value, action } = this.config;
        let content = label;
        if (action) {
            content += `<button class="ter-button" onclick="Engine.emit('command', {cmd: 'action', id: '${action.id}'})">${action.label}</button>`;
        }
        this.element.innerHTML = content;
        this.element.id = id; // For updates
        return this.element;
    }
}

class ToggleButton extends BaseComponent {
    constructor(config) {
        super(config);
    }
    render() {
        const { label, id, width, height, icon } = this.config;
        this.element.innerHTML = `
            <button id="${id}" class="ter-button" style="width:${width}px; height:${height}px; display:flex; flex-direction:column; align-items:center; justify-content:center;" onclick="Engine.emit('command', {cmd: 'toggle', id: '${id}'})">
                ${icon ? `<img src="${icon}" style="width:32px; height:32px;"/>` : ''}
                <span>${label}</span>
            </button>
        `;
        return this.element;
    }
}

class ModeButton extends BaseComponent {
    constructor(config) {
        super(config);
    }
    render() {
        const { label, id, icon, color, active } = this.config;
        const bg = color === 'green' ? '#4D9920' : '#eee';
        this.element.innerHTML = `
            <button id="${id}" class="ter-button ${active ? 'button-active' : ''}" style="width:80px; height:80px; background-color:${bg};" onclick="Engine.emit('command', {cmd: 'mode', id: '${id}'})">
                ${icon ? `<img src="${icon}" style="width:40px; height:40px; margin-bottom:5px;"/>` : ''}
                <div>${label}</div>
            </button>
        `;
        return this.element;
    }
}

class GroupControl extends BaseComponent {
    constructor(config) {
        super(config);
        if (config.layout === 'horizontal') {
            this.element.style.display = 'flex';
            this.element.style.gap = (config.gap || 0) + 'px';
        }
    }

    render() {
        this.config.components.forEach(childConfig => {
            const child = ComponentFactory.create(childConfig);
            if (child) {
                this.element.appendChild(child.render());
            }
        });
        return this.element;
    }
}

class ShakerControl extends BaseComponent {
    constructor(config) {
        super(config);
        // Shakers are typically a TD in the original layout
        this.element = document.createElement('td');
        this.element.className = "cell-border-bottom centerText cell-padding-small";
        this.element.style.padding = "0 10px";
    }

    render() {
        const { id, label, bindings, defaults } = this.config;
        // Note: The original had a specific layout for shakers.
        this.element.innerHTML = `
            <h3 class="addSpaceBelow">${label}</h3>
            <button class="ter-button ter b-textOnly" onclick="Engine.emit('bump', {id: '${bindings.setpoint}', dir: 'dn', step: 5})">-5</button>
            <div class="inpPercent"><input class="spInput" id="${bindings.setpoint}" type="number" value="${defaults.value || 0}"/></div>
            <button class="ter-button ter b-textOnly" onclick="Engine.emit('bump', {id: '${bindings.setpoint}', dir: 'up', step: 5})">+5</button><br/>
            <button class="b-auto ter-button ter button-active ${bindings.autoCmd}" onclick="Engine.emit('command', {cmd: 'auto', id: '${bindings.autoCmd}'})">Auto</button>
            <button class="ter-button ter" id="${bindings.manualCmd}" onclick="Engine.emit('command', {cmd: 'manual', id: '${bindings.manualCmd}'})">Manual</button>
        `;
        return this.element;
    }
}

class HeaderControl extends BaseComponent {
    constructor(config) {
        super(config);
        this.element = document.createElement('tr');
    }

    render() {
        this.element.innerHTML = `
            <th class="controlHead" colspan="5">
                <h2>${this.config.label}</h2>
            </th>
        `;
        return this.element;
    }
}

class ChainControl extends BaseComponent {
    constructor(config) {
        super(config);
        this.element = document.createElement('tr');
    }

    render() {
        const { id, label, bindings, defaults } = this.config;

        this.element.innerHTML = `
            <td class="largeFont chains-row-padding cell-border-bottom">
                ${label}
            </td>
            <td class="cell-border-bottom">
                <button class="ter-button ter b-bumpDown" onclick="Engine.emit('bump', {id: '${bindings.setpoint}', dir: 'dn'})"></button>
                <div class="inpPercent speedGround hide">
                    <input class="spInput" id="${bindings.setpoint}Ground" type="number" value="${defaults.ground || 0}"/>
                </div>
                <div class="inpChain speedFixed">
                    <input class="spInput" id="${bindings.setpoint}Fixed" type="number" value="${defaults.fixed || 0}"/>
                </div>
                <button class="ter-button ter b-bumpUp" onclick="Engine.emit('bump', {id: '${bindings.setpoint}', dir: 'up'})"></button>
            </td>
            <td class="mediumFont rightText cell-border-bottom chains-speed">
                <span id="${bindings.actual}">FPM</span>
            </td>
            <td class="mediumFont rightText cell-border-bottom chains-psi hide">
                <span id="${bindings.pressure}">PSI</span>
            </td>
            <td class="centerText cell-border-bottom chains-override">
                <button class="ter-button ter icon counterClockwise button-left" onclick="Engine.emit('command', {cmd: 'rev', id: '${bindings.revCmd}'})">Rev</button>
                <button class="ter-button ter icon clockwise button-right button-rev" id="${bindings.fwdCmd}" onclick="Engine.emit('command', {cmd: 'fwd', id: '${bindings.fwdCmd}'})">Fwd</button>
            </td>
        `;
        return this.element;
    }
}

class RollerControl extends BaseComponent {
    constructor(config) {
        super(config);
        this.element = document.createElement('tr');
    }

    render() {
        const { id, label, bindings, defaults } = this.config;

        this.element.innerHTML = `
            <td class="largeFont chains-row-padding cell-border-bottom">${label}</td>
            <td class="cell-border-bottom">
                <button class="ter-button ter b-bumpDown" onclick="Engine.emit('bump', {id: '${bindings.setpoint}', dir: 'dn'})"></button>
                <div class="inpChain"><input class="spInput" id="${bindings.setpoint}" type="number" value="${defaults.fixed || 0}"/></div>
                <button class="ter-button ter b-bumpUp" onclick="Engine.emit('bump', {id: '${bindings.setpoint}', dir: 'up'})"></button>
            </td>
            <td class="mediumFont rightText cell-border-bottom chains-speed">
                <span id="${bindings.actual}">FPM</span>
            </td>
            <td class="mediumFont rightText cell-border-bottom chains-psi hide">
                <span id="${bindings.pressure}">PSI</span>
            </td>
            <td class="centerText cell-border-bottom chains-override">
                <button class="ter-button ter icon counterClockwise button-left" onclick="Engine.emit('command', {cmd: 'rev', id: '${bindings.revCmd}'})">Rev</button>
                <button class="ter-button ter icon clockwise button-right button-rev" id="${bindings.fwdCmd}" onclick="Engine.emit('command', {cmd: 'fwd', id: '${bindings.fwdCmd}'})">Fwd</button>
            </td>
        `;
        return this.element;
    }
}
