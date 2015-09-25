;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory(root);
    }
}(window, function(exports) {

    // Create the defaults once
    const pluginName = 'smartSelect';

    let defaults = {
        toggleButton: false,
        wrapperClass: 'ms-parent',
        textStandard: 'Placeholder',
        textCountSelected: '%d Selected',
        textAllSelected  : 'All selected',
        textSelectAll    : 'Select all',
        textUnselectAll  : 'Unselect all'
    };

    // The actual plugin constructor
    class SmartSelect {
        constructor(element, new_options) {

            // querySelector if string
            this.el = typeof element == 'string' ?
                document.querySelector( element ) : element;

            this.container = '';
            this.button = '';
            this.dropdown = '';

            this.changeListener = true;
            this.selectedValue = [];

            this.options = this._helperExtend(defaults, new_options);
            this._defaults = {
                multiple: false
            };

            // check if multiple or not
            this._defaults.multiple = !!this.el.hasAttribute('multiple');

            // convert selected values as array
            this._resetSelectedValue();

            // build button and element
            this._buildElement();

            // define change events
            this._defineEvents();

            // listen on origin change and rebuild element
            this._listener('bind');

            // load select
            this._syncOption();
        }

        /**
         * _buildElement() construct the basic markup for the custom select
         *
         **/
        _buildElement() {

            this.container = document.createElement('div');
            this.container.className = this.options.wrapperClass;

            this.button = document.createElement('button');
            this.button.className = 'ms-choice';

            this.button.appendChild(document.createElement('span'));
            this.button.appendChild(document.createElement('div'));

            this.dropdown = document.createElement('div');
            //this is needed because js let you only know inline defined css properties
            this.dropdown.style.display = 'none';
            this.dropdown.className = `ms-drop${this._defaults.multiple ? ' multiple' : ''}`;

            // append
            this.container.appendChild(this.button);
            this.container.appendChild(this.dropdown);
            this.el.parentNode.insertBefore(this.container, this.el.nextSibling);
            //this.el.insertAdjacentElement('afterend', this.container); doesn't work on FF

            // hide element
            this.el.style.display = 'none';
        }

        /**
         * _defineEvents() define all events
         *
         **/
        _defineEvents() {
            // listen on origin change and rebuild element
            this.selectChange = () => {
                if (this.changeListener) {
                    this._syncOption();
                }
            };

            // button
            this.buttonClick = () => {
                this._toggleList();
            };

            // close if clicked outside
            this.windowClose = (e) => {
                var div = this.button.querySelector('div');
                // trigger only if specific dropdown is open and event target is not present in container
                if (div.classList.contains('open') &&
                    e.target.tagName != 'HTML' &&
                    !this.container.contains(e.target)
                ) {
                    this._toggleList(false);
                }
            };

            this.dropdownClick = (e) => {
                // If it was a list item and not select toggler
                if(e.target &&
                    e.target.nodeName == "LI" &&
                    !e.target.classList.contains("select-toggle")
                ) {
                    // single / multiple select
                    this._updateSelected(e.target.getAttribute("data-value"));
                }

                // if single close drowdown
                if (!this._defaults.multiple) {
                    this._toggleList(false);
                }
            };

            this.togglerClick = () => {
                // select or unselect all items
                this._toggleAll();
            };
        }

        /**
         * _setSelectedValue() set the current selected value
         * for the multi select toggle value
         *
         **/
        _setSelectedValue(val) {
            if (this._defaults.multiple) {
                var position = this.selectedValue.indexOf(val);
                if (position != -1) {
                    this.selectedValue.splice(position, 1);
                } else {
                    this.selectedValue.push(val);
                }
            } else {
                this.selectedValue[0] = val;
            }
        }

        /**
         * _resetSelectedValue() make sure the selected values are empty
         * for the multi select empty the array
         *
         **/
        _resetSelectedValue() {
            this.selectedValue = [];
        }

        /**
         * _updateNativeSelect() sync native select
         *
         **/
        _updateNativeSelect() {
            var options = this.el.querySelectorAll('option');
            for (var i = 0; i < options.length; i++) {
                if (this.selectedValue.indexOf(options[i].value) != -1) {
                    options[i].selected = true;
                } else {
                    options[i].selected = false;
                }
            }
        }

        /**
         * _syncOption() sync the original select with the custom one and rebind events
         *
         **/
        _syncOption() {
            let html = '<ul>';
            if (this._defaults.multiple && this.options.toggler) {
                html += `
                <li class="select-toggle" data-translate-toggle="${this.options.textUnselectAll}">
                    ${this.options.textSelectAll}
                </li>`;
            }
            this._resetSelectedValue();

            var options = this.el.querySelectorAll('option');
            for (var i = 0; i < options.length; i++) {
                var selected = '';
                var option = options[i];
                if (option.selected) {
                    this._setSelectedValue(option.value);
                    selected = 'selected';
                }
                html += `
                <li class="${selected} item" data-value="${option.value}">
                    ${option.text}
                </li>`;
            }
            html += '</ul>';

            // reset all select items
            for (i = 0; i < this.el.options.length; i++) {
                this.el.options[i].selected = false;
            }

            this._updateNativeSelect();

            // insert into dropdown
            this.dropdown.innerHTML = html;

            if (this._defaults.multiple && this.options.toggler) {
                this.toggler = this.dropdown.querySelector('li.select-toggle');
            }

            // set label
            this._setLabel();

            // bind event
            this._event('unbind');
            this._event('bind');
        }

        /**
         * _bindListener() on changes to the original select sync the custom one
         *
         **/
        _listener(type='bind') {
            this._helperAddEvent(type, 'change', this.el, this.selectChange);
            this._helperAddEvent(type, 'click', this.button, this.buttonClick);
            this._helperAddEvent(type, 'click', window, this.windowClose);
        }

        _setLabel() {
            // first item
            var label = this.el.options[0].text;

            // check if there is an empty value item and use it as default
            for (var i = 0; i < this.el.options.length; i++) {
                if (this.el.options[i].value === "") {
                    label = this.el.options[i].text;
                }
            }

            if (this._defaults.multiple) {
                // on init set item
                label = this.options.textStandard;

                var items = this.dropdown.querySelectorAll('li:not(.select-toggle)');
                if (this.options.toggler) {
                    this._setToggleLabel('off');
                }

                if (this.selectedValue.length >= 2 && this.selectedValue.length < items.length) {
                    label = this.options.textCountSelected.replace('%d', this.selectedValue.length);
                } else if (this.selectedValue.length === items.length) {
                    label = this.options.textAllSelected;
                    // toggle label
                    if (this.options.toggler) {
                        this._setToggleLabel('on');
                    }
                } else if (this.selectedValue.length === 1) {
                    label = this.el.querySelector('option[value="' + this.selectedValue[0] + '"]').text;
                }
            } else {
                if (this.selectedValue.length === 1) {
                    for (i = 0; i < this.el.options.length; i++) {
                        if (this.el.options[i].value === this.selectedValue[0]) {
                            label = this.el.options[i].text;
                        }
                    }
                } else if (this.selectedValue[0] === 0) {
                    for (i = 0; i < this.el.options.length; i++) {
                        if (this.el.options[i].value === "0") {
                            label = this.el.options[i].text;
                        }
                    }
                }
            }

            this.button.querySelector('span').innerHTML = label;
        }

        _setToggleLabel(action='on') {
            if (action === 'on') {
                if (this.toggler.classList.contains('all')) {
                    return;
                }
            } else {
                if (!this.toggler.classList.contains('all')) {
                    return;
                }
            }

            // toggle class
            this.toggler.classList.toggle('all', action === 'on');
            var text = this.toggler.textContent;
            this.toggler.textContent = this.toggler.getAttribute('data-translate-toggle');
            this.toggler.setAttribute('data-translate-toggle', text);
        }

        _event(action='bind') {
            if (action === 'unbind') {
                // items
                this._helperAddEvent('unbind', 'click', this.dropdown, this.dropdownClick);

                // items toggler
                if (this._defaults.multiple && this.options.toggler) {
                    this._helperAddEvent('unbind', 'click', this.toggler, this.togglerClick);
                }
            } else {
                // items
                this._helperAddEvent('bind', 'click', this.dropdown, this.dropdownClick);

                // items toggler
                if (this._defaults.multiple && this.options.toggler) {
                    this._helperAddEvent('bind', 'click', this.toggler, this.togglerClick);
                }
            }
        }

        _toggleAll() {
            if (this.toggler.classList.contains('all')) {
                // empty array
                this._resetSelectedValue();

                // set value to original select
                this._updateNativeSelect();

                // unselect all list items
                var items = this.dropdown.querySelectorAll('li:not(.select-toggle)');
                for (var i = 0; i < items.length; i++) {
                    items[i].classList.remove('selected');
                }

                // toggle label
                this._setToggleLabel('off');
            } else {
                var collection = [];
                // select all option
                var options = this.el.querySelectorAll('option');
                for (var i = 0; i < this.el.options.length; i++) {
                    collection.push(options[i].value);
                }
                this.selectedValue = collection;

                // set value to original select
                this._updateNativeSelect();

                // select all list items
                var items = this.dropdown.querySelectorAll('li:not(.select-toggle)');
                for (var i = 0; i < items.length; i++) {
                    items[i].classList.add('selected');
                }

                // toggle label
                this._setToggleLabel('on');
            }

            // change button label
            this._setLabel();

            // avoid infinitive loop
            this.changeListener = false;

            // trigger change
            var event = document.createEvent('HTMLEvents');
            event.initEvent('change', true, true);
            this.el.dispatchEvent(event);

            // end avoid infinitive loop
            this.changeListener = true;
        }

        _toggleList(state) {
            // close all choice button class except this one
            var buttons = document.querySelectorAll('button.ms-choice');
            for (var i = 0; i < buttons.length; i++) {
                if (this.button != buttons[i]) {
                    buttons[i].classList.remove('open');
                }
            }

            // close all drop downs except current one
            var dropdowns = document.querySelectorAll('.ms-drop');
            for (i = 0; i < dropdowns.length; i++) {
                if (this.dropdown != dropdowns[i]) {
                    dropdowns[i].style.display = "none";
                }
            }

            // if nothing defined, toggle choice button class and dropdown display status
            if (typeof state === 'undefined') {
                // toggle choice button class
                this.button.querySelector('div').classList.toggle('open');
                this.dropdown.style.display = (this.dropdown.style.display != 'none' ? 'none' : 'block' );
            } else {
                // set choice button class depending on the status
                this.button.querySelector('div').classList.toggle('open', state);

                // change display status of dropdown depending on the status
                this.dropdown.style.display = (state ? 'block' : 'none' );
            }
        }

        _updateSelected(value) {
            // add value to selected values
            this._setSelectedValue(value);

            // set value to original select
            this._updateNativeSelect();

            // change button label
            this._setLabel();

            if (this._defaults.multiple) {
                // toggle specific one
                this.dropdown.querySelector(`li[data-value="${value}"]`).classList.toggle('selected');
            } else {
                // remove specific one
                this.dropdown.querySelector('li.selected').classList.remove('selected');

                // select specific one
                this.dropdown.querySelector(`li[data-value="${value}"]`).classList.add('selected');
            }

            // avoid infinitive loop
            this.changeListener = false;

            // trigger change
            var e = document.createEvent('HTMLEvents');
            e.initEvent('change', true, true);
            this.el.dispatchEvent(e);

            // end avoid infinitive loop
            this.changeListener = true;
        }

        _helperExtend(origin, obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    origin[i] = obj[i];
                }
            }
            return origin;
        }

        _helperAddEvent(type, evnt, elem, func) {
            if (elem.addEventListener) { // W3C DOM
                if (type === 'bind') {
                    elem.addEventListener(evnt, func);
                } else {
                    elem.removeEventListener(evnt,func);
                }
            } else if (elem.attachEvent) { // IE DOM
                if (type === 'bind') {
                    elem.attachEvent("on"+evnt, func);
                } else {
                    elem.detachEvent("on"+evnt, func);
                }
            } else { // No much to do
                elem[evnt] = func;
            }
        }

        refresh() {
            this._syncOption();
        }

        destroy() {
            this._listener('unbind');
            this.container.outerHTML = '';
            delete this.container;
            this.el.style.display = 'block';
        }
    }

    // convert to a jquery plugin
    if (window.jQuery) {
        $.fn[pluginName] = function (options) {
            var args = arguments;

            if (options === undefined || typeof options === 'object') {
                return this.each(function () {
                    if (!$.data(this, 'plugin_' + pluginName)) {
                        $.data(this, 'plugin_' + pluginName, new SmartSelect(this, options));
                    }
                });
            } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
                var returns;

                this.each(function () {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (typeof instance[options] === 'function') {
                        returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                    if (options === 'destroy') {
                        $.data(this, 'plugin_' + pluginName, null);
                    }
                });
                return returns !== undefined ? returns : this;
            }
        };
    }

    exports.SmartSelect = SmartSelect;
}));
