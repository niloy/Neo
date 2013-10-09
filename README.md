**Not production ready***

### Getting Started

* Goto Neo folder and run `node tools/server.js` to start a local web server on port 8888
* Open `http://localhost:8888/index.html?v=helloWorld` in your browser

The most beautiful *Hello World* you will ever see!

Open `src/user/helloWorld.js`, edit, save and refresh browser.

### Building Website

Run `tools/webBuild.sh` to build a multiple pages website. Check `build/web`
for the output. This folder is self contained and and supposed to directly put
on your deployment site. The *html* files can be opened directly in the browser
without a webserver.

Run `tools/webAppBuild.sh` to build a single page website. Check `build/webApp`
for the output. This folder is self contained and and supposed to directly put
on your deployment site. `index.html` can be opened directly in the browser
without a webserver.

### Running Tests
You will need [PhantomJS](http://phantomjs.org/) installed and globally
available to run the tests.
Run `tools/runTesh.sh` to run the tests. Snapshots can be viewed in the
`build/test` folder.

### Finding your way
`src/assets/` contains image, audio, video, font etc
`src/core/` contains core css and js files that are important for the framework
`src/test/` contains all the test views for various components
`src/user/` contains all user created views
`tools/` contains all supporting executables

### Creating a new page(view)

Create `src/user/myView.js`. Now, you need to create a new class inside the file.
By convention, the class name would be `MyView`. The class would be inheriting
from `UIComponent`. `UIComponent` is the base class for all UI components in the
framework. All classes are found in the namespace `Neo.Classes`. The code
would be this:

```js
(function() {
  "use strict";

  Neo.Classes.MyView = Neo.Classes.UIComponent.extend({
    init: function(config) {
      Neo.Classes.UIComponent.call(this, config);
    },

    buildDOM: function() {
      var div = document.createElement("div");
      div.textContent = "---- My View ---";
      return div;
    }
  });
}());
```

You can use the traditional approach of inheritance in JS to extend from UIComponent.
But using the `extend` makes it easier.

`init` is the constructor which is making a call to the constructor of UIComponent.
This is a necessary step, a lot happens there.

`buildDOM` is automatically called and whatever you return from this function
will get appended in the DOM at the right place.

Now, open `src/user/packages.json`. This is where we list the dependencies of the
view. Our view is inheriting from `UIComponent`, so clearly thats a dependency.
Add the following entry in the *packages.json* file.

```js
  "myView": {
    "files": ["user/myView.js"],
    "requires": ["UIComponent"]
  }
```

This basically tells the framework that `user/myView.js` is the file that code
for the view. And also load all the required files for `UIComponent` since we
are depending on it.

Save your work and load `http://localhost:8888/index.html?v=myView`.

### Explore some basic building block components
Goto `src/core` and checkout code of some basic building block components like
`label`, `button`, `image`. The code is small enough to fit in your screen.

### Explore a slighty complex component
Checkout the calculator component `http://localhost:8888/index.html?v=calculator`.
The code is at `src/user/calculator.js`. This code makes use of *events* which
is a cool way to perform interaction between components.

### The Philosophy
One of the basic differences from other frameworks is that there is no templating.
Everything is created from JS and the DOM api. Everything is neatly contained
in Classes. And the frameworks makes heavy use of Object oriented concepts. If
you feel that this concept does/will not work, similar approach is taken by
*WebInspector* which the the debugging UI for Webkit. CSS is still used in
the traditional way.

> The framework does **not** intend to mirror a JS counterpart for every HTML
> tag out there. Thats counter productive. Instead, components are high level
> classes that may internally generate many different HTML tags. For example
> the `Image` component may either generate `img` tag or a `div` depending on
> the required functionality and the configuration passed to it.

Every UI component thats visible on the page inherits from the base class
`UIComponent`. This gives every components some basic common features like
`hide` and `show`. Every component then also exposes some well defined APIs
that makes it easier to control it. For example, a *Table* component would
provide *insertRows* and *deleteRows*. Its upto the *Table* component to
internally manage the detailed implementation like manipulating the DOM and the
event handlers.

The simple basic components can be put together to create a view(a single webpage).
Example would be the *calculator* view. The interesting thing is a complex
view like *calculator* is still a component. And therefore, can be embedded
in another view like any other component. The framework really makes no
distinction between a *component* and *view*, all are just *classes*.
