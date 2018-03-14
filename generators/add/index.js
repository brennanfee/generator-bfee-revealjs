'use strict';
const Generator = require('yeoman-generator');
const _ = require('lodash');
const parseAuthor = require('parse-author');

const revealVersion = '3.6.0';

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);

        this.option('folderName', {
            type: String,
            required: false,
            desc: 'Presentation folder name'
        });

        this.option('title', {
            type: String,
            required: false,
            desc: 'Presentation title'
        });

        this.option('description', {
            type: String,
            required: false,
            desc: 'Presentation description'
        });

        this.option('authorName', {
            type: String,
            required: false,
            desc: 'authorName'
        });

        this.option('authorEmail', {
            type: String,
            required: false,
            desc: 'authorEmail'
        });

        this.option('authorUrl', {
            type: String,
            required: false,
            desc: 'authorUrl'
        });

        this.option('license', {
            type: String,
            required: false,
            desc: 'license'
        });

        this.option('revealTheme', {
            type: String,
            required: false,
            desc: 'The reveal theme to use for your presentation.'
        });

        this.option('skipUpdate', {
            type: Boolean,
            required: false,
            default: false,
            desc: 'Skip the update of the root index.html'
        });
    }

    _appendPeriodIfNeeded(str) {
        if (str && !_.endsWith(str, '.')) {
            return str + '.';
        } else {
            return str;
        }
    }

    initializing() {
        // Read the package.json (if it exists) to collect some of the values
        const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

        // Read the values from the package.json if they already have one
        this.props = {
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

        this.options.description = this._appendPeriodIfNeeded(this.options.description);

        this.props = _.merge(this.props, this.options);
    }

    _askFor() {
        const prompts = [
            {
                name: 'folderName',
                message: 'Your presentation name (folder name for presentation):',
                when: !this.props.folderName,
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
                message: 'Presentation description:',
                when: !this.props.description,
                filter: this._appendPeriodIfNeeded
            },
            {
                name: 'revealTheme',
                message: 'Reveal theme:',
                default: 'blood',
                when: !this.props.revealTheme
            },
            {
                name: 'authorName',
                message: "Author's Name:",
                when: !this.props.authorName
            }
        ];

        return this.prompt(prompts).then(props => {
            this.props = _.merge(this.props, props);
        });
    }

    prompting() {
        return this._askFor();
    }

    _writeNewPresentation() {
        const destinationRoot = this.destinationPath(
            `presentations/${this.props.folderName}`
        );

        this.fs.copy(this.templatePath('styles.css'), `${destinationRoot}/styles.css`);
        this.fs.copyTpl(
            this.templatePath('custom-js.js'),
            `${destinationRoot}/custom-js.js`,
            {
                revealVersion: revealVersion
            }
        );

        // index.html
        this.fs.copyTpl(
            this.templatePath('index.html'),
            `${destinationRoot}/index.html`,
            {
                folderName: this.props.folderName,
                safeFolderName: _.camelCase(this.props.folderName),
                title: this.props.title,
                description: this.props.description,
                authorName: this.props.authorName,
                authorEmail: this.props.authorEmail || '',
                authorUrl: this.props.authorUrl || '',
                license: this.props.license || '',
                revealTheme: this.props.revealTheme,
                revealVersion: revealVersion
            }
        );

        // slides.md
        this.fs.copyTpl(this.templatePath('slides.md'), `${destinationRoot}/slides.md`, {
            folderName: this.props.folderName,
            safeFolderName: _.camelCase(this.props.folderName),
            title: this.props.title,
            description: this.props.description,
            authorName: this.props.authorName,
            authorEmail: this.props.authorEmail || '',
            authorUrl: this.props.authorUrl || '',
            license: this.props.license || ''
        });

        // Readme
        let authorLink = '';
        if (this.props.authorName) {
            if (this.props.authorUrl) {
                authorLink = `[${this.props.authorName}](${this.props.authorUrl})`;
            } else {
                authorLink = this.props.authorName;
            }
        }

        this.fs.copyTpl(this.templatePath('README.md'), `${destinationRoot}/README.md`, {
            folderName: this.props.folderName,
            safeFolderName: _.camelCase(this.props.folderName),
            title: this.props.title,
            description: this.props.description,
            authorLink: authorLink,
            license: this.props.license || '',
            copyrightYear: new Date().getFullYear()
        });
    }

    writing() {
        this._writeNewPresentation();
    }

    default() {
        if (!this.options.skipUpdate) {
            // update the root index.html file
            this.composeWith(require.resolve('../update'), {});
        }
    }
};
