# Presentation

Welcome to the "<%= projectName %>".
<% if (projectDescription) { %>
## Description

<%= projectDescription %><% } %>

## Overview Of This Repository

This repsitory houses a simple structure for creating, managing, and presenting multiple HTML-based presentations.  The system used to create and present your slides is the excellent [Reveal.js](https://revealjs.com) JavaScript library.  For details on it please see the link provided.

This repository and its base structure were created by a [Yeoman](https://yeoman.io) generator that I have written myself.  You can find it here: [generator-bfee-revealjs](https://github.com/brennanfee/generator-bfee-revealjs).  For details on its use and creating your own similarly configured repository, please see the documentation on the generator.

### Forking

While it is possible to fork this repository and than manually edit the [presentations](presentations) folder, using the [Yeoman](https://yeoman.io) generator is preferred.  Given that [Yeoman](https://yeoman.io) is a [NodeJs](https://nodejs.org) tool that, along with [NPM](https://www.npmjs.com), are required.  The generator provides tools to add new presentations, remove existing ones, and keep the root `index.html` file in sync.

## Presenting

Generally there are two ways available for actually presenting these slides.  Using a web host (this is specifically designed to work with [Gihub Pages](https://pages.github.com) but other options work just as well).

The second option is to use the provided [Caddy](https://caddyserver.com) to host your presentation locally and point your browser at [http://localhost:8080](http://localhost:8080).  To make that convienient you simply need to run the serve.sh (on Linux, BSDs, or Macs) or serve-windows.ps1 on Windows.

### Speaker Notes

Once your presentation is hosted (or running locally) you can use the "speaker notes" feature of RevealJs.  Simply press the `S` key once you open your presentation and a second browser window will open to display the speaker notes.

## Special Thanks

I want to personally thank those indivdiuals who have contributed to Reveal.js and to the Caddy Server open source projects.  The two combined together here make a very simple HTML-based presentation framework that is feature rich and yet still simple to use (assuming you know and are comfortable with HTML).  All true credit for this framework should go to them, I merely wrapped it up into a re-usable system.

<% if (license) { %>
## License

<%= license %> © <%= copyrightYear %> <% if (authorLink) { %><%= authorLink %><% } %><% } %>
