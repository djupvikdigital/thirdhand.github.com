#RichSelect form control

RichSelect is a custom form widget. It mostly works as a regular HTML `select` element, except
that you can also delete its value, and you can use a “rich option” consisting of another
form widget. This allows for a kind of combo box functionality.

The example code should for the most part be self-explanatory. The actual form value is always
stored in the form element with the class `valstore`. The rich option is shown when the
`option` with class `richopt` is chosen, showing the corresponding element with the same class.
Note that the current code only supports one such option.

You create the custom widget by passing a jQuery selector to the `$.richopt()` function. The
function supports two other optional arguments, the first being an options object. Two options
may be set:

1. `imagePath` sets the path where the images are placed (defaults to the empty string)
2. `removeVal` where you can provide a callback function to be called when the value is deleted

The third argument of the `$.richopt()` function is a callback function which if provided will
be called after each `RichSelect` object is created, the callback function is provided the
`RichSelect` object as its first and only argument. An array with all the `RichSelect` objects is
also found under `$.richselect.selects`.

RichSelect is Copyright © 2011 Reidar Djupvik and MIT licensed. See the file LICENSE or
<http://www.opensource.org/licenses/mit-license.php> for full license text. 