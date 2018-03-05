'use strict';
const Generator = require('yeoman-generator');
const path = require('path');
const _ = require('lodash');
const extend = _.merge;

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);

        this.option('generateInto', {
            type: String,
            required: false,
            defaults: '',
            desc: 'Relocate the location of the generated files.'
        });
    }

    initializing() {
        this.props = {};
    }

    prompting() {
        const prompts = [
            {
                name: 'name',
                message: 'Your project name (folder and/or repo):',
                default: _.kebabCase(path.basename(process.cwd())),
                filter: _.kebabCase,
                validate(str) {
                    return str.length > 0;
                }
            },
            {
                name: 'title',
                message: 'Your presentation title:',
                default: 'Presentation Title'
            }
        ];

        return this.prompt(prompts).then(props => {
            this.props = extend(this.props, props);
        });
    }

    writing() {
        // Copy the verbatum files
        const files = [
            'Caddyfile',
            'serve-freebsd.sh',
            'serve-linux.sh',
            'serve-mac.sh',
            'serve-openbsd.sh',
            'serve-windows.cmd',
            'styles.css',
            'caddy/version.txt',
            'caddy/freebsd/caddy',
            'caddy/linux/caddy',
            'caddy/mac/caddy',
            'caddy/openbsd/caddy',
            'caddy/windows/caddy.exe',
            'plugin/multiplex/client.js',
            'plugin/multiplex/index.js',
            'plugin/multiplex/master.js',
            'plugin/multiplex/package.json',
            'plugin/notes/notes.html',
            'plugin/notes/notes.js',
            'plugin/notes-server/client.js',
            'plugin/notes-server/index.js',
            'plugin/notes-server/notes.html'
        ];

        for (let file of files) {
            this.fs.copy(
                this.templatePath(file),
                this.destinationPath(this.options.generateInto, file)
            );
        }

        // index.html is templated
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath(this.options.generateInto, 'index.html'),
            {
                projectName: this.props.name,
                safeProjectName: _.camelCase(this.props.name),
                presentationTitle: this.props.title,
                description: this.config.get('description')
                //authorName: pkg.author.name,
            }
        );

        // Readme is templated
        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath(this.options.generateInto, 'README.md'),
            {
                projectName: this.props.name,
                safeProjectName: _.camelCase(this.props.name),
                presentationTitle: this.props.title,
                description: this.config.get('description')
            }
        );

        this.fs.append(
            this.destinationPath(this.options.generateInto, '.gitattributes'),
            '\ncaddy binary\n*.exe binary\n'
        );

        // Debugging
        this.fs.writeJSON(
            this.destinationPath(this.options.generateInto, 'props.json'),
            this.props
        );

        this.fs.writeJSON(
            this.destinationPath(this.options.generateInto, 'options.json'),
            this.options
        );
    }

    default() {
        this.composeWith(require.resolve('generator-bfee-blankrepo/generators/app'), {
            name: this.props.name,
            includeReadme: false
        });
    }

    install() {
        //this.installDependencies({ bower: false });
    }

    end() {
        //this.fs.delete(this.destinationPath(this.options.generateInto, '.yo-rc.json'));
    }
};
