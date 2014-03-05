# Button

Inherits from _UIComponent_.

The Button component is intended to used anywhere a generic simple button is
required.

## Constructor arguments

`text` - The text to be displayed on the button. If you want to display blank
text, then explicitly pass the empty string.

`type` - Default = `button`. This can be `submit` if the button is part of a
form. If the button is part of a form, pressing enter on a _Textfield_ will cause
the form to submit. Also, disabling the button would cause the form to not get
submitted.

```js
{
  name: "Button",
  text: "Hello World"
}
```

## Methods

`text` - _Getter_ Gets the current text.

`text` - _Setter_ Sets the current text.
