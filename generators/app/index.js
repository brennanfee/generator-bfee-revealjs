'use strict';
const Generator = require('yeoman-generator');
const _ = require('lodash');
const parseAuthor = require('parse-author');
const gitConfig = require('git-config');
const githubUsername = require('github-username');
const path = require('path');

const licenses = [
    { name: 'Apache 2.0', value: 'Apache-2.0' },
    { name: 'MIT', value: 'MIT' },
    { name: 'Mozilla Public License 2.0', value: 'MPL-2.0' },
    { name: 'BSD 2-Clause (FreeBSD) License', value: 'BSD-2-Clause-FreeBSD' },
    { name: 'BSD 3-Clause (NewBSD) License', value: 'BSD-3-Clause' },
    { name: 'Internet Systems Consortium (ISC) License', value: 'ISC' },
    { name: 'GNU AGPL 3.0', value: 'AGPL-3.0' },
    { name: 'GNU GPL 3.0', value: 'GPL-3.0' },
    { name: 'GNU LGPL 3.0', value: 'LGPL-3.0' },
    { name: 'Unlicense', value: 'unlicense' },
    { name: 'No License (Copyrighted)', value: 'UNLICENSED' }
];

module.exports = class extends Generator {
    _appendPeriodIfNeeded(str) {
        if (str && !_.endsWith(str, '.')) {
            return str + '.';
        } else {
            return str;
        }
    }

    initializing() {
        this.gitConfig = gitConfig.sync();
        this.gitConfig.user = this.gitConfig.user || {};

        // In case they already did an "npm init" read the package.json file for values
        const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

        // Read the values from the package.json if they already have one
        this.props = {
            projectName: _.kebabCase(pkg.name),
            projectDescription: this._appendPeriodIfNeeded(pkg.description),
            version: pkg.version,
            projectHomepage: pkg.homepage,
            license: pkg.license
        };

        if (_.isObject(pkg.author)) {
            this.props.authorName = pkg.author.name;
            this.props.authorEmail = pkg.author.email;
            this.props.authorUrl = pkg.author.url;
        } else if (_.isString(pkg.author)) {
            const info = parseAuthor(pkg.author);
            this.props.authorName = info.name;
            this.props.authorEmail = info.email;
            this.props.authorUrl = info.url;
        }

        this.props.copyrightYear = new Date().getFullYear();
    }

    _askFor() {
        const prompts = [
            {
                name: 'projectName',
                message: 'Your project name (repo name or folder name):',
                default: _.kebabCase(path.basename(process.cwd())),
                when: !this.props.projectName,
                filter: _.kebabCase,
                validate(str) {
                    return str.length > 0;
                }
            },
            {
                name: 'projectDescription',
                message: 'Project description:',
                when: !this.props.projectDescription,
                filter: this._appendPeriodIfNeeded
            },
            {
                name: 'projectHomepage',
                message: 'Project homepage url:',
                when: !this.props.projectHomepage
            },
            {
                name: 'name',
                message: 'Your presentation name (folder name for first presentation):',
                when: !this.props.name,
                filter: _.kebabCase,
                validate(str) {
                    return str.length > 0;
                }
            },
            {
                name: 'title',
                message: 'Your presentation title:',
                when: !this.props.title,
                validate(str) {
                    return str.length > 0;
                }
            },
            {
                name: 'description',
                message: 'Project description:',
                when: !this.props.description,
                filter: this._appendPeriodIfNeeded
            },
            {
                name: 'authorName',
                message: "Author's Name:",
                when: !this.props.authorName,
                default: this.gitConfig.user.name || this.user.git.name(),
                store: true
            },
            {
                name: 'authorEmail',
                message: "Author's Email:",
                when: !this.props.authorEmail,
                default: this.gitConfig.user.email || this.user.git.email(),
                store: true
            },
            {
                name: 'authorUrl',
                message: "Author's Homepage:",
                when: !this.props.authorUrl,
                store: true
            }
        ];

        return this.prompt(prompts).then(props => {
            this.props = _.merge(this.props, props);
        });
    }

    _askForGithubAccount() {
        return githubUsername(this.props.authorEmail)
            .then(username => username, () => '')
            .then(username => {
                return this.prompt({
                    name: 'githubAccount',
                    message: 'GitHub username or organization:',
                    default: username
                }).then(prompt => {
                    this.props.githubAccount = prompt.githubAccount;
                });
            });
    }

    _askForLicense() {
        const prompts = [
            {
                type: 'list',
                name: 'license',
                message: 'Which license do you want to use?',
                default: 'MIT',
                when:
                    !this.props.license ||
                    licenses.find(x => x.value === this.props.license) === undefined,
                choices: licenses
            }
        ];

        return this.prompt(prompts).then(props => {
            this.props = _.merge(this.props, props);
        });
    }

    prompting() {
        return this._askFor()
            .then(this._askForGithubAccount.bind(this))
            .then(this._askForLicense.bind(this));
    }

    _writePackageJson() {
        const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

        let pkg = _.merge(
            {
                name: this.props.name,
                version: this.props.version || '0.1.0',
                description: this.props.projectDescription,
                homepage: this.props.projectHomepage,
                author: {
                    name: this.props.authorName,
                    email: this.props.authorEmail,
                    url: this.props.authorUrl
                },
                keywords: [],
                devDependencies: {
                    'cross-os': '^1.2.2'
                },
                dependencies: {},
                scripts: {
                    add: 'yo bfee-revealjs:add',
                    start: 'cross-os serve',
                    serve: 'cross-os serve'
                },
                'cross-os': {
                    serve: {
                        freebsd: './serve.sh',
                        openbsd: './serve.sh',
                        darwin: './serve.sh',
                        linux: './serve.sh',
                        win32: 'serve-windows.cmd'
                    }
                }
            },
            currentPkg
        );

        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }

    _writeLicenseFile() {
        const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

        // License file
        const filename = `${this.props.license}.txt`;
        let author = this.props.authorName.trim();
        if (this.props.authorEmail) {
            author += ` <${this.props.authorEmail.trim()}>`;
        }
        if (this.props.authorUrl) {
            author += ` (${this.props.authorUrl.trim()})`;
        }

        this.fs.copyTpl(
            this.templatePath(`licenses/${filename}`),
            this.destinationPath('LICENSE'),
            {
                year: this.props.copyrightYear,
                author: author
            }
        );

        // Package
        pkg.license = this.props.license;

        // We don't want users to publish their module to NPM if they copyrighted
        // their content.
        if (this.props.license === 'UNLICENSED') {
            delete pkg.license;
            pkg.private = true;
        }

        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }

    _writeRootFiles() {
        this.fs.copy(this.templatePath('root-files/**/*'), this.destinationRoot());
    }

    _writeTemplates() {
        // index.html
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('index.html'),
            {
                projectName: this.props.projectName,
                safeProjectName: _.camelCase(this.props.projectName),
                projectDescription: this.props.projectDescription,
                presentationName: this.props.name,
                safePresentationName: _.camelCase(this.props.name),
                presentationTitle: this.props.title,
                description: this.props.description,
                authorName: this.props.authorName,
                authorEmail: this.props.authorEmail,
                authorUrl: this.props.authorUrl,
                license: this.props.license
            }
        );

        // Readme
        let authorLink = '';
        if (this.props.authorName) {
            if (this.props.authorUrl) {
                authorLink = `[${this.props.authorName}](${this.props.authorUrl})`;
            } else {
                authorLink = this.props.authorName;
            }
        }

        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            {
                projectName: this.props.projectName,
                safeProjectName: _.camelCase(this.props.projectName),
                projectDescription: this.props.projectDescription,
                projectHomepage: this.props.projectHomepage,
                authorLink: authorLink,
                license: this.props.license,
                copyrightYear: this.props.copyrightYear
            }
        );
    }

    _writePresentationsTemplates() {
        this.fs.copy(
            this.templatePath('../../add/templates/styles.css'),
            this.destinationPath('template/styles.css')
        );

        this.fs.copy(
            this.templatePath('../../add/templates/custom-js.js'),
            this.destinationPath('template/custom-js.js')
        );

        this.fs.copyTpl(
            this.templatePath('../../add/templates/index.html'),
            this.destinationPath('template/template.html'),
            {
                folderName: '',
                safeFolderName: '',
                title: 'Title',
                description: '',
                authorName: this.props.authorName,
                authorEmail: this.props.authorEmail || '',
                authorUrl: this.props.authorUrl || '',
                license: this.props.license || ''
            }
        );
    }

    writing() {
        this._writePackageJson();
        this._writeLicenseFile();
        this._writeRootFiles();
        this._writeTemplates();
        this._writePresentationsTemplates();
    }

    default() {
        this.composeWith(require.resolve('../git'), {
            name: this.props.projectName,
            githubAccount: this.props.githubAccount
        });

        this.composeWith(require.resolve('../add'), {
            folderName: this.props.name,
            title: this.props.title,
            description: this.props.description,
            authorName: this.props.authorName,
            authorEmail: this.props.authorEmail,
            authorUrl: this.props.authorUrl,
            license: this.props.license
        });
    }

    end() {
        this.fs.delete(this.destinationPath('.yo-rc.json'));
        this.installDependencies({ bower: false });
    }
};
