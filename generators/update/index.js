'use strict';
const Generator = require('yeoman-generator');
const cheerio = require('cheerio');
var dir = require('node-dir');
var path = require('path');

module.exports = class extends Generator {
    end() {
        let indexFile = this.destinationPath('index.html');

        this.fs.copy(indexFile, indexFile, {
            process: function(content) {
                let $ = cheerio.load(content);

                let ul = $('#presentation-list');
                ul.empty();

                let files = dir.files(this.destinationPath('presentations'), {
                    sync: true
                });

                files.forEach(
                    function(file) {
                        if (path.basename(file) !== 'index.html') return;

                        let fileDir = path.basename(path.dirname(file));
                        let child$ = cheerio.load(this.fs.read(file));

                        let title = child$('title').text();
                        let description = child$("meta[name='description']").attr(
                            'content'
                        );

                        ul.append(
                            `<li><a href="/presentations/${fileDir}/#/">${title}</a><p>${description}</p></li>`
                        );
                    }.bind(this)
                );

                return $.html();
            }.bind(this)
        });
    }
};
