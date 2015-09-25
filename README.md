# Smart select plugin

![Demo](http://i.imgur.com/8E6m5NQ.gif)

> For demo purpose the native selects on the top are visible.

Smart select is a ES6 based plugin which beautifies native selects.
As we know, native selects are looking different in various browsers:
Even with the usage of CSS you are limited to display them equals everywhere.

The plugin acts on top of native selects and keeps them async.

You can attach events on the native select, smart select will take over and trigger them as if the user interact with them directly.
It makes sense to use the plugin in connection with RWD where you wanna switch between native selects for mobile 
and smart select for desktop users without having device specific logic in the javascript code.

The plugin is written in ES6 and transpiled to the current version of javascript (es5) that will run all browsers.
The module types supported are global, AMD and CommonJS and ES6 if you use the src file.




## Install

### Install using bower

```bash
bower install smart-select
```

### Clone the repo...

```bash
git clone https://github.com/davidecantoni/smart-select.git
cd smart-select
```




## How does it works

The plugin will hide the native selects and replace them by appending html elements that you can style.
Your selects will look the same everywhere.




## How to use

#### native javascript

Insert javascript in your page:

```html
<!-- smart select -->
<script src="dist/js/smart-select.min.js"></script> 

<select class="cars" multiple>
    <option value="porsche" selected>Porsche</option>
    <option value="ferrari">Ferrari</option>
    <option value="lamborghini">Lamborghini</option>
    <option value="audi">Audi</option>
</select>
```

Initialize the plugin

```js
<script type="text/javascript">
    // make sure dom is ready
    window.addEventListener("load", function() {
        // initialize all select elements
        var carInstance = SmartSelect('select.cars', this.options);
    });
</script> 
```

#### with jquery

Insert javascript in your page:

```html
<!-- jquery -->
<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script> 

<!-- smart select -->
<script src="dist/js/smart-select.min.js"></script> 

<select class="cars" multiple>
    <option value="porsche" selected>Porsche</option>
    <option value="ferrari">Ferrari</option>
    <option value="lamborghini">Lamborghini</option>
    <option value="audi">Audi</option>
</select>
```

Initialize the plugin

```js
<script type="text/javascript">
    // make sure dom is ready
    $(document).ready(function() {
        // initialize all select elements
        $('select.cars').smartSelect(options);
    });
</script> 
```

#### Configuration options

Smart select comes with a few options you can change to suit your needs.

| Option                 | Values                | Default          | Description |
| ---------------------- | --------------------- | ---------------- | ----------- |
| `wrapperClass`         | `string`              | `ms-parent`      | Class name that will be added to the smart select wrapper |
| `toggleButton`         | `true` or `false`     | `false`          | This will only work on selects with multiple attribute and will prepend a "Select all" toggleButton to your options |
| `textStandard`         | `string`              | `Placeholder`    | Button text if nothing is pre-selected (with multiple attribute only) |
| `textCountSelected`    | `string`              | `%d Selected`    | Button text to display the number of selected elements, %d will be replaced by the number (with multiple attribute only) |
| `textAllSelected`      | `string`              | `All selected`   | Button text if all elements are selected (with multiple attribute only) |
| `textSelectAll`        | `string`              | `Select all`     | Additional button inside to toggle all items (with multiple attribute only) |
| `textUnselectAll`      | `string`              | `Unselect all`   | Additional button inside to toggle all items (with multiple attribute only) |

Example usage:

```javascript
SmartSelect('select.cars', {
   toggleButton: true,
   textSelectAll: "- ALL -"
});

// or with jQuery 
$('select[multiple]').smartSelect({
    toggleButton: true,
    textSelectAll: "- ALL -"
});
```

#### Public methods

Smart select plugin has two public methods:

| Function        | Description |
| --------------- | ----------- |
| `refresh`       | Re-do calculations based on the original select. Useful if you manipulate the native select in the DOM and wanna async the smart select. |
| `destroy`       | Remove plugin and display native select |

Once you have initialised smart select on a select element you can access the above mentioned methods like this: 

```javascript
carInstance.refresh();

// or with jQuery 
$('select[multiple]').smartSelect('refresh');
```




## Changelog

#### v0.2.0 2015-09-25
Drop jQuery dependency

#### v0.1.0 2015-09-11
Initial release