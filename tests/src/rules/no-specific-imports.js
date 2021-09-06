import { test } from '../utils';

import { RuleTester } from 'eslint';

const ruleTester = new RuleTester();
const rule = require('rules/no-specific-imports');

ruleTester.run('no-specific-imports', rule, {
  valid: [
    test({
      code: 'import "lodash"',
    }),

    test({
      code: 'import _ from "lodash"',
    }),

    test({
      code: 'import { foo } from "lodash"',
    }),

    test({
      code: 'import * as _ from "lodash"',
    }),

    test({
      code: 'import { foo } from "lodash"',
      options: [{
        'modules': [
          {
            'name': 'lodash',
            'imports': [
              'default',
              'bar',
            ],
          },
        ],
      }],
    }),

    test({
      code: 'import { foo as bar } from "lodash"',
      options: [{
        'modules': [
          {
            'name': 'lodash',
            'imports': [
              'default',
              'bar',
            ],
          },
        ],
      }],
    }),

    test({
      code: 'import type { bar } from "lodash"',
      parser: require.resolve('babel-eslint'),
      options: [{
        'modules': [
          {
            'name': 'lodash',
            'imports': [
              'default',
              'bar',
            ],
          },
        ],
      }],
    }),

    test({
      code: 'import type lodash from "lodash"',
      parser: require.resolve('babel-eslint'),
      options: [{
        'modules': [
          {
            'name': 'lodash',
            'imports': [
              'default',
              'bar',
            ],
          },
        ],
      }],
    }),
  ],
  invalid: [
    test({
      code: 'import { bar } from "lodash"',
      errors: ['Disable import bar from "lodash"'],
      options: [{
        'modules': [
          {
            'name': 'lodash',
            'imports': [
              'default',
              'bar',
            ],
          },
        ],
      }],
    }),

    test({
      code: 'import { bar as foo } from "lodash"',
      errors: ['Disable import bar from "lodash"'],
      options: [{
        'modules': [
          {
            'name': 'lodash',
            'imports': [
              'default',
              'bar',
            ],
          },
        ],
      }],
    }),

    test({
      code: 'import { foo, bar } from "lodash"',
      errors: ['Disable import bar from "lodash"'],
      options: [{
        'modules': [
          {
            'name': 'lodash',
            'imports': [
              'default',
              'bar',
            ],
          },
        ],
      }],
    }),

    test({
      code: 'import _ from "lodash"',
      errors: ['Disable import default from "lodash"'],
      options: [{
        'modules': [
          {
            'name': 'lodash',
            'imports': [
              'default',
              'bar',
            ],
          },
        ],
      }],
    }),

    test({
      code: 'import * as _ from "lodash"',
      errors: ['Disable import * from "lodash"'],
      options: [{
        'modules': [
          {
            'name': 'lodash',
            'imports': [
              'default',
              'bar',
            ],
          },
        ],
      }],
    }),
  ],
});
