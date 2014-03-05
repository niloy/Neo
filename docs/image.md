# Image

Inherits from _UIComponent_.

The Image component is intended to be used for rendering images. Internally, the
`<img>` tag is generated.

## Constructor arguments

`src` - _Optional_ The URL of the image to be displayed. If this property is not
provided, an empty _png_ image with _1x1_ dimension is displayed.

`alt` - _Optional_ The alternate text of the image.

```js
{
  name: "Image",
  src: "example.png"
}
```

## Methods

`src` - _Getter_ Gets the current URL of the image.

`src` - _Setter_ Sets the current URL of the image.

`alt` - _Getter_ Gets the current alternate text.

`alt` - _Setter_ Sets the current alternate text.
