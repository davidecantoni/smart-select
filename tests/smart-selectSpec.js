describe("Smart select test suite", function() {

    beforeAll(function() {
        $('body').html(HTML5_SKELETON).append(style);

        this.country = $('.country');
        this.countrySelect = new SmartSelect('select.country', options);

        this.food = $('.food');
        this.foodSelect = new SmartSelect('select.food', options);

        this.names = $('.names');
        this.namesSelect = new SmartSelect('select.names', options);

        this.cars = $('.cars');
        this.carsSelect = new SmartSelect('select.cars', options);

        this.numbers = $('.numbers');
        this.numbersSelect = new SmartSelect('select.numbers', options);
    });

    afterAll(function() {
        /*this.countrySelect.destroy();
        this.foodSelect.destroy();
        this.namesSelect.destroy();
        this.carsSelect.destroy();*/
    });

    describe("Country select with numbers as values", function() {
        it('should select value', function () {

            // display the drop-down
            this.country.next('.ms-parent').find('button').get(0).dispatchEvent(event);

            // check the initial value
            expect(this.country.next('.ms-parent').find('button span').text()).toBe('Switzerland');

            // display the drop-down
            this.country.next('.ms-parent').find('button').get(0).dispatchEvent(event);

            // select India as a country
            this.country.next('.ms-parent').find('.ms-drop li[data-value=2]').get(0).dispatchEvent(event);

            // select should has India as a country
            expect(this.country.next('.ms-parent').find('button').text()).toBe('India');
        });

        it('should select value with 0', function () {

            // check the initial value
            expect(this.country.next('.ms-parent').find('button').text()).toBe('India');

            // display the drop-down
            this.country.next('.ms-parent').find('button').get(0).dispatchEvent(event);

            // select India as a country
            this.country.next('.ms-parent').find('.ms-drop li[data-value=0]').get(0).dispatchEvent(event);

            // select should has India as a country
            expect(this.country.next('.ms-parent').find('button').text()).toBe('Switzerland');
        });

        it('should close drop-down if action taken outside the scope', function () {
            // drop-down hidden
            expect(this.country.next('.ms-parent').find('.ms-drop').is(':visible')).toBe(false);

            // display the drop-down
            this.country.next('.ms-parent').find('button').get(0).dispatchEvent(event);

            // drop-down should be visible
            expect(this.country.next('.ms-parent').find('.ms-drop').is(':visible')).toBe(true);

            // click outside the scope
            $('body').get(0).dispatchEvent(event);

            // drop-down should be hidden
            expect(this.country.next('.ms-parent').find('.ms-drop').is(':visible')).toBe(false);
        });
    });

    describe("Food select with numbers as values and an empty value", function() {
        it('should select empty value', function () {

            // check the initial value
            expect(this.food.next('.ms-parent').find('button').text()).toBe('Salad');

            // display the drop-down
            this.food.next('.ms-parent').find('button').get(0).dispatchEvent(event);

            // select India as a country
            this.food.next('.ms-parent').find('.ms-drop li[data-value=""]').get(0).dispatchEvent(event);

            // select should has India as a country
            expect(this.food.next('.ms-parent').find('button').text()).toBe('Tuna');
        });
    });

    describe("Name multi-select with string as values", function() {
        it('should select multiple values', function () {

            // check the initial value
            expect(this.names.next('.ms-parent').find('button').text()).toBe('2 Selected');

            // display the drop-down
            this.names.next('.ms-parent').find('button').get(0).dispatchEvent(event);

            // select multiple items
            this.names.next('.ms-parent').find('.ms-drop li[data-value=marc]').get(0).dispatchEvent(event);
            this.names.next('.ms-parent').find('.ms-drop li[data-value=fred]').get(0).dispatchEvent(event);

            // 4 items should be selected now
            expect(this.names.next('.ms-parent').find('button').text()).toBe('4 Selected');
        });

        it('should toggle (show) multiple values', function () {

            // display the drop-down
            this.names.next('.ms-parent').find('button').get(0).dispatchEvent(event);

            // select multiple items
            this.names.next('.ms-parent').find('.ms-drop li.select-toggle').get(0).dispatchEvent(event);

            // 4 items should be selected now
            expect(this.names.next('.ms-parent').find('button').text()).toBe(options.label.allSelected);
            // all li should be selected
            expect(this.names.next('.ms-parent').find('.ms-drop li.selected').length).toBe(5);
            // all select label has to become unselect all
            expect(this.names.next('.ms-parent').find('.ms-drop li.select-toggle').text()).toBe(options.label.unselectAll);
        });

        it('should toggle (hide) multiple values', function () {

            // display the drop-down
            this.names.next('.ms-parent').find('button').get(0).dispatchEvent(event);

            // select multiple items
            this.names.next('.ms-parent').find('.ms-drop li.select-toggle').get(0).dispatchEvent(event);

            // 4 items should be selected now
            expect(this.names.next('.ms-parent').find('button').text()).toBe(options.label.standard);
        });
    });

    describe("Cars multi-select with string as values", function() {
        it('should change multiple values', function () {
            // 1 items should be selected now
            expect(this.cars.next('.ms-parent').find('button').text()).toBe('Porsche');

            // display the drop-down
            this.cars.next('.ms-parent').find('button').get(0).dispatchEvent(event);

            // select multiple items
            this.cars.next('.ms-parent').find('.ms-drop li[data-value=""]').get(0).dispatchEvent(event);

            // 2 items should be selected now
            expect(this.cars.next('.ms-parent').find('button').text()).toBe('2 Selected');
        });
    });

    describe("Numbers multi-select with string as values", function() {
        it('should change multiple values', function () {
            // 2 items should be selected now
            expect(this.numbers.next('.ms-parent').find('button').text()).toBe('2 Selected');

            // display the drop-down
            this.numbers.next('.ms-parent').find('button').get(0).dispatchEvent(event);

            // // select multiple items
            this.numbers.next('.ms-parent').find('.ms-drop li[data-value="1"]').get(0).dispatchEvent(event);
            // // select multiple items
            this.numbers.next('.ms-parent').find('.ms-drop li[data-value="4"]').get(0).dispatchEvent(event);

            // // 2 items should be selected now
            expect(this.numbers.next('.ms-parent').find('button').text()).toBe('2 Selected');
        });
    });

    describe("Public methods", function() {
        it("should refresh select", function() {
            this.countrySelect.refresh();
        });

        it("should destroy select", function() {
            expect(this.country.next('.ms-parent').length).toBe(1);
            //this wont work because we force the default element to be visible for demonstration
            //expect(this.country.is(':visible')).toBe(false);

            this.countrySelect.destroy();
            expect(this.country.next('.ms-parent').length).toBe(0);
            expect(this.country.is(':visible')).toBe(true);
        });
    });
});