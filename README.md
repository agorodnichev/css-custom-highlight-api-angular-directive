# Highlighter

## CSS Custom Highlight API

There is a [CSS Custom Highlight API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API) which allows you to apply styles to text nodes. The most popular usage example is search functionality when you do have a search input field and some text which you want to highlight based on search text. Historically the only way to achieve that was modifying the DOM tree by using innerHTML property. Obviously the biggest drawback of this approach is that you need to modify DOM. With Highlight API there is no DOM modification taking place.

## Description

This is an example of Angular Directive(s) which adopts CSS Custom Highlight API.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
