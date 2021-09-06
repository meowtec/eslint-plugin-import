/**
 * @fileOverview Forbids a module from importing itself
 * @author Berton Zhu
 */

import flat from 'array.prototype.flat';
import moduleVisitor from 'eslint-module-utils/moduleVisitor';
import docsUrl from '../docsUrl';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disable use specific imports',
      recommended: true,
      url: docsUrl('no-self-import'),
    },

    schema: [
      {
        'type': 'object',
        'properties': {
          'modules': {
            'type': 'array',
            'items': {
              'type': 'object',
              'additionalProperties': false,
              'properties': {
                'name': {
                  'type': 'string',
                },
                'imports': {
                  'type': 'array',
                  'items': {
                    'type': 'string',
                  },
                },
              },
            },
          },
        },
        'additionalProperties': false,
      },
    ],
  },
  create(context) {
    return moduleVisitor((source, node) => {
      if (node.importKind === 'type') return;

      const modules = (context.options[0] || {}).modules || [];
      const disabledImports = new Set(flat(
        modules
          .filter(mod => mod.name === source.value)
          .map(mod => mod.imports),
      ));
      if (disabledImports.size === 0) return;

      const getSpecifierName = specifier => {
        switch (specifier.type) {
        case 'ImportNamespaceSpecifier':
          return '*';
        case 'ImportDefaultSpecifier':
          return 'default';
        default:
          return specifier.imported.name;
        }
      };

      const unexpectedSpecifiers = node.specifiers.filter(specifier => {
        if (specifier.importKind === 'type') return false;
        const importedName = getSpecifierName(specifier);
        return importedName === '*' || disabledImports.has(importedName);
      });

      unexpectedSpecifiers.forEach(specifier => {
        context.report(
          specifier,
          `Disable import ${getSpecifierName(specifier)} from "${source.value}"`,
        );
      });
    }, { commonjs: true });
  },
};
