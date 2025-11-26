const Engine = {
    config: null,

    init: async function () {
        try {
            // Check for config override in URL
            const urlParams = new URLSearchParams(window.location.search);
            const configName = urlParams.get('config') || 'config.json';

            const response = await fetch(`./${configName}`);
            this.config = await response.json();
            this.renderApp();
            this.initDataLayer();
        } catch (error) {
            console.error("Failed to load config:", error);
            document.body.innerHTML = "<h1>Error loading configuration</h1>";
        }
    },

    renderApp: function () {
        // Bind Metadata
        if (this.config.serialNumber) {
            const snEl = document.querySelector('#header-sn span');
            if (snEl) snEl.innerText = this.config.serialNumber;
        }
        if (this.config.version) {
            const verEl = document.getElementById('header-version');
            if (verEl) verEl.innerText = `Version ${this.config.version}`;
        }

        // Render Tabs
        const tabList = document.querySelector('.tab-list');
        const panelsContainer = document.querySelector('.panels');

        tabList.innerHTML = '';
        panelsContainer.innerHTML = '';

        this.config.tabs.forEach((tab, index) => {
            // Create Tab Label
            const label = document.createElement('label');
            label.className = 'tab';
            label.htmlFor = `tab-${tab.id}`;
            label.id = `tab-${tab.id}-label`;
            label.setAttribute('role', 'tab');
            label.setAttribute('aria-controls', `panel-${tab.id}`);
            label.innerHTML = `<span class="tab-text">${tab.label}</span><img alt="" class="tab-icon" src="${tab.icon}"/>`;
            tabList.appendChild(label);

            // Create Radio Input
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'tabs';
            radio.id = `tab-${tab.id}`;
            radio.className = 'vh';
            if (index === 0) radio.checked = true;

            tabList.parentNode.insertBefore(radio, tabList);

            // Create Panel
            const panel = document.createElement('article');
            panel.id = `panel-${tab.id}`;
            panel.className = 'panel';
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', `tab-${tab.id}-label`);

            if (tab.layout === 'list') {
                this.renderListLayout(panel, tab.components);
            } else if (tab.layout === 'custom-home') {
                panel.innerHTML = `
                    <div class="image-button-container">
                        ${tab.backgroundImage ? `<img alt="Top View" class="top-view-image" src="${tab.backgroundImage}"/>` : ''}
                        <!-- Dynamic overlay buttons could be added here based on config -->
                    </div>`;
            } else if (tab.layout === 'absolute') {
                this.renderAbsoluteLayout(panel, tab);
            } else {
                panel.innerHTML = `<h2>${tab.label}</h2><p>Placeholder for ${tab.label}</p>`;
            }

            panelsContainer.appendChild(panel);
        });
    },

    renderListLayout: function (container, components) {
        const wrapper = document.createElement('div');
        wrapper.className = 'controlL1 cell-padding-small';

        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        components.forEach(compConfig => {
            const component = ComponentFactory.create(compConfig);
            if (component) {
                tbody.appendChild(component.render());
            }
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);
        container.appendChild(wrapper);
    },

    renderAbsoluteLayout: function (container, tabConfig) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        // wrapper.style.background = '#333'; // Optional background color

        if (tabConfig.backgroundImage) {
            const img = document.createElement('img');
            img.src = tabConfig.backgroundImage;
            img.style.position = 'absolute';
            img.style.top = '50%';
            img.style.left = '50%';
            img.style.transform = 'translate(-50%, -50%)';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            wrapper.appendChild(img);
        }

        tabConfig.components.forEach(compConfig => {
            const component = ComponentFactory.create(compConfig);
            if (component) {
                wrapper.appendChild(component.render());
            }
        });

        container.appendChild(wrapper);
    },

    // Event Bus
    emit: function (event, data) {
        console.log(`Event: ${event}`, data);
        if (event === 'command') {
            this.handleCommand(data);
        } else if (event === 'bump') {
            this.handleBump(data);
        }
    },

    handleCommand: function (data) {
        // Toggle button state visually for now
        const btn = document.getElementById(data.id);
        if (btn) {
            // For auto/manual toggles, we might need to toggle the other button off
            // This logic should ideally be in the component or a more sophisticated state manager
            // For prototype:
            if (data.cmd === 'auto' || data.cmd === 'manual') {
                // Find siblings and untoggle? 
                // Simple toggle for now
            }
            btn.classList.toggle('button-active');
        }
        // TODO: Send to WebSocket
    },

    handleBump: function (data) {
        // Find input
        let input = document.getElementById(data.id + "Fixed");
        if (!input) input = document.getElementById(data.id);

        if (input) {
            let val = parseInt(input.value) || 0;
            const step = data.step || 10;
            val += (data.dir === 'up' ? step : -step);
            input.value = val;
        } else {
            // For inset-container divs (like in HeightControl)
            let div = document.getElementById(data.id);
            if (div) {
                let val = parseInt(div.innerText) || 0;
                const step = data.step || 1;
                val += (data.dir === 'up' ? step : -step);
                div.innerText = val;
            }
        }
    },

    initDataLayer: function () {
        console.log("Initializing Data Layer...");
        // Mock incoming data
        setInterval(() => {
            if (this.config) {
                this.config.tabs.forEach(tab => {
                    tab.components.forEach(comp => {
                        // Handle nested components (Groups)
                        const comps = comp.type === 'Group' ? comp.components : [comp];

                        comps.forEach(c => {
                            if (c.bindings && c.bindings.actual) {
                                const el = document.getElementById(c.bindings.actual);
                                if (el) {
                                    el.innerText = Math.floor(Math.random() * 50 + 200) + " FPM";
                                }
                            }
                        });
                    });
                });
            }
        }, 2000);
    }
};

// Start the engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Engine.init();
});
