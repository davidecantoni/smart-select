/*
 *  Smart select plugin - v0.1.1 - 2015-09-11
 *  https://github.com/davidecantoni/smart-select
 *  Copyright (c) 2015 Davide Cantoni
 *
 */

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
    class Plugin {
        constructor(element, new_options) {

            this.el = element;

            this.container = '';
            this.button = '';
            this.dropdown = '';

            this.changeListener = true;
            this.selectedValue = '';

            this.options = this._extend(defaults, new_options);
            this._defaults = {
                multiple: false
            };

            // check if multiple or not
            this._defaults.multiple = !!this.el.hasAttribute('multiple');

            // convert selected values as array
            this._resetSelectedValue();

            // build button and element
            this._buildElement();

            // load select
            this._syncOption();

            // listen on origin change and rebuild element
            this._bindListener();
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
            this.dropdown.className = `ms-drop${this._defaults.multiple ? ' multiple' : ''}`;

            // append
            this.container.appendChild(this.button);
            this.container.appendChild(this.dropdown);
            this.el.insertAdjacentElement('afterend', this.container);

            // hide element
            this.el.style.display = 'none';
        }

        /**
         * _setSelectedValue() set the current selected value
         * for the multi select toggle value
         *
         **/
        _setSelectedValue(val) {
            if (this._defaults.multiple) {
                var position = this.selectedValue.indexOf(val);
                if (position >= 0) {
                    this.selectedValue.splice(position, 1);
                } else {
                    this.selectedValue.push(val);
                }
            } else {
                this.selectedValue = val;
            }
        }

        /**
         * _resetSelectedValue() make sure the selected values are empty
         * for the multi select empty the array
         *
         **/
        _resetSelectedValue() {
            if (this._defaults.multiple) {
                this.selectedValue = [];
            } else {
                this.selectedValue = '';
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
                <li class="select-toggle" data-value="" data-translate-toggle="${this.options.textUnselectAll}">
                    ${this.options.textSelectAll}
                </li>`;
            }
            this._resetSelectedValue();

            var options = this.el.querySelectorAll('option');
            var i;
            for (i = 0; i < options.length; i++) {
                var selected = '';
                var option = options[i];
                if (option.selected) {
                    this._setSelectedValue(option.value);
                    selected = 'selected';
                }
                html += `
                <li class="${selected}" data-value="${option.value}">
                    ${option.text}
                </li>`;
            }
            html += '</ul>';

            // reset all select items
            var i;
            for (i = 0; i < this.el.options.length; i++) {
                this.el.options[i].selected = false;
            }
            this.el.value = this.selectedValue;


            // insert into dropdown
            this.dropdown.innerHTML = html;

            if (this._defaults.multiple && this.options.toggler) {
                this.toggler = this.dropdown.find('li.select-toggle');
            }

            // set label
            this._setLabel();

            // bind event
            this._bindEvent();
        }

        /**
         * _bindListener() on changes to the original select sync the custom one
         *
         **/
        _bindListener() {

            // listen on origin change and rebuild element
            this.el.addEventListener('click', () => {
                if (this.changeListener) {
                    this._syncOption();
                }
            });

            // button
            this.button.addEventListener('click', () => {
                this._toggleList();
            });

            // close if clicked outside
            /*document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
                var div = this.button.querySelector('div');
                if (div && div.classList.contains('open')) {
                    if ($(e.target)[0] === this.button[0] ||
                        $(e.target).parents('.ms-choice')[0] === this.button[0]) {
                    } else if ($(e.target)[0] === this.dropdown[0] ||
                        $(e.target).parents('.ms-drop')[0] === this.dropdown[0]) {
                    } else {
                        this._toggleList(false);
                    }
                }
            });*/
        }

        _setLabel() {
            // first item
            var label = this.el.options[0].text;

            // check if there is an empty value item and use it as default
            var i = 0;
            for (i = 0; i < this.el.options.length; i++) {
                if (this.el.options[i].value === "") {
                    label = this.el.options[i].text;
                }
            }

            if (this._defaults.multiple) {
                // on init set item
                label = this.options.textStandard;

                var items = this.dropdown.querySelectorAll('li:not(.select-toggle)');
                if (this.options.toggler) {
                    this._setToggleLabel(false);
                }

                if (this.selectedValue.length >= 2 && this.selectedValue.length < items.length) {
                    label = this.options.textCountSelected.replace('%d', this.selectedValue.length);
                } else if (this.selectedValue.length === items.length) {
                    label = this.options.textAllSelected;
                    // toggle label
                    if (this.options.toggler) {
                        this._setToggleLabel(true);
                    }
                } else if (this.selectedValue.length === 1) {
                    label = this.$el.find('option[value="' + this.selectedValue[0] + '"]').text();
                }
            } else {
                if (this.selectedValue) {
                    var i = 0;
                    for (i = 0; i < this.el.options.length; i++) {
                        if (this.el.options[i].value === this.selectedValue) {
                            label = this.el.options[i].text;
                        }
                    }
                } else if (this.selectedValue === 0) {
                    var i = 0;
                    for (i = 0; i < this.el.options.length; i++) {
                        if (this.el.options[i].value === "0") {
                            label = this.el.options[i].text;
                        }
                    }
                }
            }

            this.button.querySelector('span').innerHTML = label;
        }

        _setToggleLabel(status) {
            if (status) {
                if (this.$toggler.hasClass('selected')) {
                    return;
                }
            } else {
                if (!this.$toggler.hasClass('selected')) {
                    return;
                }
            }

            // toggle class
            this.$toggler.toggleClass('selected', status);
            var text = this.$toggler.text();
            this.$toggler.text(this.$toggler.data('translate-toggle'));
            this.$toggler.data('translate-toggle', text);
        }

        _bindEvent() {
            var self = this;

            // items
            // TODO: convert to arrow funtions
            //this.dropdown.removeEventListener('click', null);
            console.log($('.country').next('.ms-parent').find('.ms-drop').click());

            this.dropdown.addEventListener('click', function(e) {
                console.log(e);
                if(e.target && e.target.nodeName == "LI") {
                    // List item found!  Output the ID!
                    console.log("List item ", e.target.id.replace("post-"), " was clicked!");
                }

                //:not(.select-toggle)
                /*// single / multiple select
                self._updateSelected($(this).data('value'));

                // if single close drowdown
                if (!self._defaults.multiple) {
                    self._toggleList(false);
                }*/
            });

            // items toggler
            /*if (this._defaults.multiple && this.options.toggler) {
                this.$toggler.off('click').on('click', () => {
                    // select or unselect all items
                    this._toggleAll();
                });
            }*/
        }

        _toggleAll() {
            if (this.$toggler.hasClass('selected')) {
                // empty array
                this._resetSelectedValue();

                // set value to original select
                this.$el.val([]);

                // unselect all list items
                this.$dropdown.find('li:not(.select-toggle)').removeClass('selected');

                // toggle label
                this._setToggleLabel(false);
            } else {
                var collection = [];
                // select all option
                // TODO arrow function
                this.$el.find('option').each(function () {
                    collection.push($(this).val());
                });

                this.selectedValue = collection;

                // set value to original select
                this.$el.val(this.selectedValue);

                // select all list items
                this.$dropdown.find('li:not(.select-toggle)').addClass('selected');

                // toggle label
                this._setToggleLabel(true);
            }

            // change button label
            this._setLabel();

            // avoid infinitive loop
            this.changeListener = false;

            // trigger change
            this.$el.change();

            // end avoid infinitive loop
            this.changeListener = true;
        }

        _toggleList(state) {
            // close all choice button class exept this one
            var i = 0;
            var buttons = document.querySelectorAll('button.ms-choice');
            console.log(this.button.isSameNode(buttons[i]));
            for (i = 0; i < buttons.length; i++) {
                if (!this.button.isSameNode(buttons[i])) {
                    buttons[i].classList.toggle('open');
                }
            }

            // close all drop downs except current one
            var i = 0;
            var dropdowns = document.querySelectorAll('.ms-drop');
            console.log(this.dropdown.isSameNode(dropdowns[i]));
            for (i = 0; i < dropdowns.length; i++) {
                if (!this.dropdown.isSameNode(dropdowns[i])) {
                    dropdowns[i].classList.toggle('open');
                }
            }

            // toggle choice button class
            this.button.querySelector('div').classList.toggle('open');

            // toggle dropdown
            if (state) {
                this.dropdown.classList.remove('open');
            } else {
                this.dropdown.classList.add('open');
            }
        }

        _updateSelected(value) {
            // add value to selected values
            this._setSelectedValue(value);

            // set value to original select
            this.$el.val(this.selectedValue);

            // change button label
            this._setLabel();

            if (this._defaults.multiple) {
                // toggle specific one
                this.$dropdown.find(`li[data-value="${value}"]`).toggleClass('selected');
            } else {
                // remove specific one
                this.$dropdown.find('li.selected').removeClass('selected');

                // select specific one
                this.$dropdown.find(`li[data-value="${value}"]`).addClass('selected');
            }

            // avoid infinitive loop
            this.changeListener = false;

            // trigger change
            this.$el.change();

            // end avoid infinitive loop
            this.changeListener = true;
        }

        _extend(origin, obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    origin[i] = obj[i];
                }
            }
            return origin;
        }

        refresh() {
            this._syncOption();
        }

        destroy() {
            this.$container.remove();
            this.$el.show();
        }
    }

    // convert to a jquery plugin
    var smartSelect = function (selector, options) {
        if (typeof (selector) === 'object') {
            //Ok, create a new instance
            return new Plugin(selector);

        } else if (typeof (selector) === 'string') {
            //select the target element with query selector
            var targetElement = document.querySelectorAll(selector);

            if (targetElement && targetElement.length > 1) {
                var i;
                for (i = 0; i < targetElement.length; i++) {
                    return new Plugin(targetElement[i], options);
                }
            } else if (targetElement) {
                return new Plugin(targetElement, options);
            } else {
                throw new Error('There is no element with given selector.');
            }
        } else {
            return new Plugin(document.body, options);
        }
    };

    exports.smartSelect = smartSelect;
    return smartSelect;


    /*window[pluginName] = function (selector, options) {
        var args = arguments;
        var elements = document.querySelectorAll(selector);
        console.log(selector);
        console.log(elements.length);

        console.log(document.querySelectorAll('select'));

        if (options === undefined || typeof options === 'object') {

            /!*forEach(elements, function (index, value) {
                console.log(index, value); // passes index + value back!
            });*!/
            /!*
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });*!/
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            /!*var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;*!/
        }
    };*/
}));