# Smart select plugin

Smart select is a ES6 based plugin which will beautifies native selects.
As we know, native selects are looking different in the various browsers:

The plugin acts on top of native selects and keep them async.

You can bind your events on the native select, smart select will take care and trigger them.
It makes especially sense to use the plugin in connection with mobile where you wanna use the default selects
and on desktop where you wanna make use of the nice looking selects from smart select.
Without device specific logic in the javscript code.

The plugin is written in ES6 and transpile to the current version of javascript (es5) that it will will run all browsers.
The module supports ES6 modules, AMD modules and global out of the box.

## Install

Download package


## How does it works
The plugin will hide the native selects and replace them by appending nicer ones that you can style.
Like this your selects will look the same doesn't matter which browser they use.


## How to use

Insert javascript in your page:

```html
<!-- jquery -->
<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script> 

<!-- smart select -->
<script src="dist/js/smart-select.min.js"></script> 

<select class="cars" multiple>
    <option value="porsche" selected>Porsche</option>
    <option value="ferrari">Ferrari</option>
    <option value="lamborgini">Lamborgini</option>
    <option value="">Lotus</option>
</select>
```

Initialize the plugin

```js
<script type="text/javascript">
    // make sure dom is ready
    $(document).ready(function() {
        // initialize all select elements
        $('select').smartSelect(params);
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
$('select[multiselect]').smartSelect({
    toggleButton: true,
    textSelectAll: "- ALL -"
});
```



#### Public methods

Smart select plugin offers two public methods:

| Function        | Description |
| --------------- | ----------- |
| `refresh`       | Re-do calculations based on the original select. Useful if you modify the native select with DOM manipulation and wanna update the plugin. |
| `destroy`       | Remove plugin and display native select |


Once you have initialised smart select on a select element you can access the above mentioned methods like this: 

```javascript
$('select[multiselect]').smartSelect('refresh');
```



## Changelog

#### v0.1.0 2015-09-11
Initial release