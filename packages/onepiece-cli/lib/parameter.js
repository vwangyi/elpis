/**
 * 解析参数
 */

import { program } from 'commander';
import { version } from './parameter.version.js';
import { template } from './parameter.template.js';
import { create } from './parameter.create.js';
import { onepiece } from './parameter.onepiece.js';

onepiece(program);
version(program);
template(program);
create(program);
program.parse(process.argv); // process.argv[2]
