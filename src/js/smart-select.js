/*
 *  Smart select plugin - v0.1.1 - 2015-09-11
 *  https://github.com/davidecantoni/smart-select
 *  Copyright (c) 2015 Davide Cantoni
 *
 */

;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery || window.Zepto);
    }
}(function($) {

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

            //this.el  = element;
            this.$el = this.$el = $(element);

            this.$container = '';
            this.$button = '';
            this.$dropdown = '';

            this.changeListener = true;
            this.selectedValue = '';

            this.options = $.extend(true, {}, defaults, new_options);
            this._defaults = {
                multiple: false
            };
            //this._name = pluginName;

            // check if multiple or not
            this._defaults.multiple = !!this.$el.attr('multiple');

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
            this.$container = $(`<div class="${this.options.wrapperClass}"></div>`);
            this.$button    = $(`<button type="button" class="ms-choice"><span></span><div></div></button>`);
            this.$dropdown  = $(`<div class="ms-drop ${this._defaults.multiple ? 'multiple' : ''}"></div>`);

            // append
            this.$container.append(this.$button).append(this.$dropdown);
            this.$el.after(this.$container);

            // hide element
            this.$el.hide();
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

            this.$el.find('option').each((i, elm) => {
                var selected = '';
                var $option = $(elm);
                if ($option.is(':selected')) {
                    this._setSelectedValue($option.val());
                    selected = 'selected';
                }
                html += `
                <li class="${selected}" data-value="${$option.val()}">
                    ${$option.text()}
                </li>`;
            });
            html += '</ul>';

            // reset all select items
            this.$el.find('option:selected').attr('selected', null);
            this.$el.val(this.selectedValue);

            // insert into dropdown
            this.$dropdown.html(html);

            if (this._defaults.multiple && this.options.toggler) {
                this.$toggler = this.$dropdown.find('li.select-toggle');
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
            this.$el.on('change', () => {
                if (this.changeListener) {
                    this._syncOption();
                }
            });

            // button
            this.$button.on('click', () => {
                this._toggleList();
            });

            // close if clicked outside
            $(window).click((e) => {
                if (this.$button.find('>div').hasClass('open')) {
                    if ($(e.target)[0] === this.$button[0] ||
                        $(e.target).parents('.ms-choice')[0] === this.$button[0]) {
                    } else if ($(e.target)[0] === this.$dropdown[0] ||
                        $(e.target).parents('.ms-drop')[0] === this.$dropdown[0]) {
                    } else {
                        this._toggleList(false);
                    }
                }
            });
        }

        _setLabel() {
            // first item
            var label = this.$el.find('option:first').text();

            // check if there is an empty value item and use it as default
            var $emptyValueItem = this.$el.find('option[value=""]');
            if ($emptyValueItem.length) {
                label = $emptyValueItem.text();
            }

            if (this._defaults.multiple) {
                // on init set item
                label = this.options.textStandard;

                var items = this.$dropdown.find('li:not(.select-toggle)');
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
                    label = this.$el.find('option[value="' + this.selectedValue + '"]').text();
                } else if (this.selectedValue === 0) {
                    label = this.$el.find('option[value="0"]').text();
                }
            }

            this.$button.find('span').text(label);
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
            this.$dropdown.find('li:not(.select-toggle)').off('click').on('click', function() {
                // single / multiple select
                self._updateSelected($(this).data('value'));

                // if single close drowdown
                if (!self._defaults.multiple) {
                    self._toggleList(false);
                }
            });

            // items toggler
            if (this._defaults.multiple && this.options.toggler) {
                this.$toggler.off('click').on('click', () => {
                    // select or unselect all items
                    this._toggleAll();
                });
            }
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
            $(document).find('.ms-choice > div').not(this.$button.find('> div')).toggleClass('open', false);

            // close all dropdown exept current one
            $(document).find('.ms-drop').not(this.$dropdown).toggle(false);

            // toggle choice button class
            this.$button.find('>div').toggleClass('open', state);

            // toggle dropdown
            this.$dropdown.toggle(state);
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

        refresh() {
            this._syncOption();
        }

        destroy() {
            this.$container.remove();
            this.$el.show();
        }
    }

    // convert to a jquery plugin
    $.fn[pluginName] = function (options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
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
}));
