'use strict';
const Generator = require('yeoman-generator');
const _ = require('lodash');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);

        this.option('folderName', {
            type: String,
            required: false,
            desc: 'Presentation folder name'
        });
    }

    initializing() {
        this.props = {};
        this.props = _.merge(this.props, this.options);
    }

    prompting() {
        const prompts = [
            {
                name: 'folderName',
                message: 'The presentation folder name:',
                when: !this.props.folderName,
                filter: _.kebabCase,
                validate(str) {
                    return str.length > 0;
                }
            }
        ];

        return this.prompt(prompts).then(props => {
            this.props = _.merge(this.props, props);
        });
    }

    writing() {
        const destinationRoot = this.destinationPath(
            `presentations/${this.props.folderName}`
        );

        if (fs.existsSync(destinationRoot)) {
            let stat = fs.statSync(destinationRoot);
            if (stat.isDirectory()) {
                fs.removeSync(destinationRoot);
            } else {
                this.log(chalk.red(`'${this.props.folderName}' is not a directory.`));
            }
        } else {
            this.log(chalk.red(`Folder '${this.props.folderName}' does not exist.`));
        }
    }

    default() {
        // update the root index.html file
        this.composeWith(require.resolve('../update'), {});
    }
};
