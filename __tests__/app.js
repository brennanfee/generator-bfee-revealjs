'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-bfee-revealjs:app', () => {
    beforeAll(() => {
        return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
            name: 'test-name',
            title: 'Test Title',
            description: 'Some description.',
            homepage: 'https://test.com',
            authorName: 'Some Author',
            authorEmail: 'author@test.com',
            authorUrl: 'https://author.com',
            githubAccount: 'someauthor',
            license: 'MIT'
        });
    });

    it('creates files', () => {
        assert.file([
            '.editorconfig',
            '.gitattributes',
            '.gitignore',
            'Caddyfile',
            'index.html',
            'LICENSE',
            'package.json',
            'README.md',
            'serve-freebsd.sh',
            'serve-linux.sh',
            'serve-mac.sh',
            'serve-openbsd.sh',
            'serve-windows.cmd',
            'styles.css'
        ]);
    });
});
