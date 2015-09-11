## Smart select plugin

Smart select is a ES6 based plugin which will beautifies native selects.
As we know, native selects are looking different in the various browsers:

The plugin acts on top of native selects and keep them async.

You can bind your events on the native select, smart select will take care and trigger them.
It makes especially sense to use the plugin in connection with mobile where you wanna use the default selects
and on desktop where you wanna make use of the nice looking selects from smart select.
Without device specific logic in the javscript code.

The plugin is written in ES6 and transpile to the current version of javascript (es5) that it will will run all browsers.
The module supports ES6 modules, AMD modules and global out of the box.

### Install

Download package


### How does it works


Insert javascript in your page:

```
<!-- jquery -->
<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script> 

<!-- smart select -->
<script src="dist/js/smart-select.min.js"></script> 
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


#### Params


```json
{
    "label": {
        "standard"      : "Placeholder",
        "countSelected" : "Selected",
        "allSelected"   : "All selected",
        "selectAll"     : "Select all",
        "unselectAll"   : "Unselect all"
    },
    "toggler": true
} 
```