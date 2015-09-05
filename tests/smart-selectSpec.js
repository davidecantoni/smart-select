describe("Smart select test suite", function() {

    beforeAll(function() {
        /*var native = new smartSelect('<select><option value="">empty</option><option value="1">Name</option></select>', {
            startItem: 2,
            animSpeed: 200,
            animInterval: 5000,
            autoStart: true,
            thumbs: true,
            prevButton: "gallery-navigation-prev",
            nextButton: "gallery-navigation-next"
        });
        console.log(native.run());*/

        const HTML5_SKELETON = `
            <div>
                <h2>Country select with numbers as values</h2>
                <select class="country">
                    <option value="0" selected>Switzerland</option>
                    <option value="1">United Arabic Emirates</option>
                    <option value="2">India</option>
                    <option value="3">Brazil</option>
                </select>

                <h2>Food select with numbers as values and an empty value</h2>
                <select class="food">
                    <option value="">Tuna</option>
                    <option value="1">Cheese</option>
                    <option value="2">Meat</option>
                    <option value="3" selected>Salad</option>
                </select>

                <h2>Name multi-select with string as values</h2>
                <select class="names" multiple>
                    <option value="dave" selected>Dave</option>
                    <option value="marc">Marc</option>
                    <option value="tommy" selected>Tommy</option>
                    <option value="fred">Fred</option>
                    <option value="hans">Hans</option>
                </select>

                <h2>Cars multi-select with string as values</h2>
                <select class="cars" multiple>
                    <option value="porsche" selected>Porsche</option>
                    <option value="ferrari">Ferrari</option>
                    <option value="lamborgini">Lamborgini</option>
                    <option value="">Lotus</option>
                </select>
            </div>`;

        $('body').append(HTML5_SKELETON);

        this.options = {
            label: {
                standard      : 'Placeholder',
                countSelected : 'Selected',
                allSelected   : 'All selected',
                selectAll     : 'Select all',
                unselectAll   : 'Unselect all'
            },
            toggler: true
        };

        $('select').smartSelect(this.options);

        this.country = $('.country');
        this.food    = $('.food');
        this.names   = $('.names');
        this.cars    = $('.cars');
    });

    afterAll(function() {
        $('select').smartSelect('destroy');
    });


    describe("Country select with numbers as values", function() {
        it('should select value', function () {

            // display the drop-down
            this.country.next('.ms-parent').find('button').click();

            // check the initial value
            expect(this.country.next('.ms-parent').find('button').text()).toBe('Switzerland');

            // display the drop-down
            this.country.next('.ms-parent').find('button').click();

            // select India as a country
            this.country.next('.ms-parent').find('.ms-drop li[data-value=2]').click();

            // select should has India as a country
            expect(this.country.next('.ms-parent').find('button').text()).toBe('India');
        });

        it('should select value with 0', function () {

            // check the initial value
            expect(this.country.next('.ms-parent').find('button').text()).toBe('India');

            // display the drop-down
            this.country.next('.ms-parent').find('button').click();

            // select India as a country
            this.country.next('.ms-parent').find('.ms-drop li[data-value=0]').click();

            // select should has India as a country
            expect(this.country.next('.ms-parent').find('button').text()).toBe('Switzerland');
        });

        it('should close drop-down if action taken outside the scope', function () {
            // drop-down hidden
            expect(this.country.next('.ms-parent').find('.ms-drop').is(':visible')).toBe(false);

            // display the drop-down
            this.country.next('.ms-parent').find('button').click();

            // drop-down should be visible
            expect(this.country.next('.ms-parent').find('.ms-drop').is(':visible')).toBe(true);

            // click outside the scope
            $(window).click();

            // drop-down should be hidden
            expect(this.country.next('.ms-parent').find('.ms-drop').is(':visible')).toBe(false);
        });
    });


    describe("Food select with numbers as values and an empty value", function() {
        it('should select empty value', function () {

            // check the initial value
            expect(this.food.next('.ms-parent').find('button').text()).toBe('Salad');

            // display the drop-down
            this.food.next('.ms-parent').find('button').click();

            // select India as a country
            this.food.next('.ms-parent').find('.ms-drop li[data-value=""]').click();

            // select should has India as a country
            expect(this.food.next('.ms-parent').find('button').text()).toBe('Tuna');
        });
    });


    describe("Name multi-select with string as values", function() {
        it('should select multiple values', function () {

            // check the initial value
            expect(this.names.next('.ms-parent').find('button').text()).toBe('2 Selected');

            // display the drop-down
            this.names.next('.ms-parent').find('button').click();

            // select multiple items
            this.names.next('.ms-parent').find('.ms-drop li[data-value=marc]').click();
            this.names.next('.ms-parent').find('.ms-drop li[data-value=fred]').click();

            // 4 items should be selected now
            expect(this.names.next('.ms-parent').find('button').text()).toBe('4 Selected');
        });

        it('should toggle (show) multiple values', function () {

            // display the drop-down
            this.names.next('.ms-parent').find('button').click();

            // select multiple items
            this.names.next('.ms-parent').find('.ms-drop li.select-toggle').click();

            // 4 items should be selected now
            expect(this.names.next('.ms-parent').find('button').text()).toBe(this.options.label.allSelected);
        });

        it('should toggle (hide) multiple values', function () {

            // display the drop-down
            this.names.next('.ms-parent').find('button').click();

            // select multiple items
            this.names.next('.ms-parent').find('.ms-drop li.select-toggle').click();

            // 4 items should be selected now
            expect(this.names.next('.ms-parent').find('button').text()).toBe(this.options.label.standard);
        });
    });

    describe("Cars multi-select with string as values", function() {
        it('should change multiple values', function () {
            // 1 items should be selected now
            expect(this.cars.next('.ms-parent').find('button').text()).toBe('Porsche');

            // display the drop-down
            this.cars.next('.ms-parent').find('button').click();

            // select multiple items
            console.log( this.cars.next('.ms-parent').find('.ms-drop li[data-value=""]')[0].innerHTML);
            this.cars.next('.ms-parent').find('.ms-drop li[data-value=""]').click();

            // 2 items should be selected now
            expect(this.cars.next('.ms-parent').find('button').text()).toBe('2 Selected');
        });
    });
});
