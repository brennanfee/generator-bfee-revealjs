'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-bfee-revealjs:app', () => {
    beforeAll(() => {
        return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
            projectName: 'project-name',
            projectDescription: 'Project description',
            projectHomepage: 'https://test.com',
            name: 'test-name',
            title: 'Test Title',
            description: 'Some description.',
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
            'serve.sh',
            'serve-windows.ps1',
            'styles.css'
        ]);
    });
});
