# Form

Inherits from _UIComponent_.

The Form component marks virtual boundary in a page inside which input fields
are considered to be related with each other. Internally, the `<form>` tag is
generated. One of the benefits of using form is that it enables submitting the
form by pressing the enter key on a textfield. Also, disabling a submit button
on a form prevents the form from being submitted.

## Config parameters

`component` - The component to be embedded inside the form. Use _Layout_ to
embed multiple components inside the form.

```js
{
  name: "Form",
  component: {
    name: "Layout",
    items: [{
      name: "Textfield",
      fieldname: "searchText"
    }, {
      name: "Button",
      type: "submit",
      text: "Search"
    }]
  },
  listeners: {
    submit: function() {
      // ...
    }
  }
}
```

## Methods

No Methods

## Events

Any event triggered by `<form>`. Most notably the `submit` event which is
triggered when the form is submitted.
