const HTML5_SKELETON = `
<div class="content">
    <h1>Smart select - demo</h1>

    <div class="select-block">
        <span class="info">Country select with numbers as values</span>
        <select class="country">
            <option value="0" selected>Switzerland</option>
            <option value="1">United Arabic Emirates</option>
            <option value="2">India</option>
            <option value="3">Brazil</option>
        </select>
    </div>

    <div class="select-block">
        <span class="info">Food select with numbers as values and an empty value</span>
        <select class="food">
            <option value="">Tuna</option>
            <option value="1">Cheese</option>
            <option value="2">Meat</option>
            <option value="3" selected>Salad</option>
        </select>
    </div>

    <div class="select-block">
        <span class="info">Name multi-select with string as values</span>
        <select class="names" multiple>
            <option value="dave" selected>Dave</option>
            <option value="marc">Marc</option>
            <option value="tommy" selected>Tommy</option>
            <option value="fred">Fred</option>
            <option value="hans">Hans</option>
        </select>
    </div>

    <div class="select-block">
        <span class="info">Cars multi-select with string as values and an empty value</span>
        <select class="cars" multiple>
            <option value="porsche" selected>Porsche</option>
            <option value="ferrari">Ferrari</option>
            <option value="lamborghini">Lamborghini</option>
            <option value="">Audi</option>
        </select>
    </div>
</div>`;

const style = `
<link rel="stylesheet" href="/base/node_modules/normalize.css/normalize.css" />
<link rel="stylesheet" href="/base/helper/main.css" />
<link rel="stylesheet" href="/base/dist/css/smart-select.css" />`;

const options = {
    "label": {
        "standard"      : "Placeholder",
        "countSelected" : "Selected",
        "allSelected"   : "All selected",
        "selectAll"     : "Select all",
        "unselectAll"   : "Unselect all"
    },
    "toggler": true
};


// jquery click event doesnt work on addEventListener
let event = document.createEvent('HTMLEvents');
event.initEvent('click', true, true);
