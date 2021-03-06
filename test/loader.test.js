import path from 'path';

import nodeSass from 'node-sass';
import dartSass from 'sass';
import Fiber from 'fibers';

import {
  compile,
  getCodeFromBundle,
  getCodeFromSass,
  getCompiler,
  getErrors,
  getImplementationByName,
  getTestId,
  getWarnings,
} from './helpers';

const implementations = [nodeSass, dartSass];
const syntaxStyles = ['scss', 'sass'];

jest.setTimeout(30000);

describe('loader', () => {
  beforeEach(() => {
    // The `sass` (`Dart Sass`) package modify the `Function` prototype, but the `jest` lose a prototype
    Object.setPrototypeOf(Fiber, Function.prototype);
  });

  implementations.forEach((implementation) => {
    const [implementationName] = implementation.info.split('\t');

    syntaxStyles.forEach((syntax) => {
      it(`should work (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('language', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      // See https://github.com/webpack-contrib/sass-loader/issues/21
      it(`should work with an empty file (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('empty', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should output an understandable error (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('error', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);

        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should output an understandable error when the problem in "@import" (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('error-import', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);

        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should output an understandable error when a file could not be found (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('error-file-not-found', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);

        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should throw an error with a explicit file and a file does not exist (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('error-file-not-found-2', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);

        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work with difference "@import" at-rules (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('imports', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      // Test for issue: https://github.com/webpack-contrib/sass-loader/issues/32
      it(`should work with multiple "@import" at-rules (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('multiple-imports', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      // Test for issue: https://github.com/webpack-contrib/sass-loader/issues/73
      it(`should work with "@import" at-rules from other language style (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-other-style', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work when "@import" at-rules from scoped npm packages (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-from-npm-org-pkg', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work when "@import" at-rules with extensions (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-with-extension', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work when "@import" at-rules starting with "_" (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-with-underscore', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work when "@import" at-rules without extensions and do not start with "_" (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId(
          'import-without-extension-and-underscore',
          syntax
        );
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work with multiple "@import" at-rules without quotes (${implementationName}) (${syntax})`, async () => {
        if (syntax === 'scss') {
          return;
        }

        const testId = getTestId('import-without-quotes', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and use the "sass" field (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-sass-field', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and use the "style" field (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-style-field', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and use the "main" field (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-main-field', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and use the "main" field when the "main" value is not in the "mainFields" resolve option (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-main-field', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, {
          loader: { options, resolve: { mainFields: [] } },
        });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and use the "main" field when the "main" value already in the "mainFields" resolve option (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-main-field', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, {
          loader: { options, resolve: { mainFields: ['main', '...'] } },
        });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and use the "custom-sass" field (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-custom-sass-field', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, {
          loader: { options, resolve: { mainFields: ['custom-sass', '...'] } },
        });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and use the "index" file in package (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-index', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and use the "index" file in package when the "index" value is not in the "mainFiles" resolve option (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-index', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, {
          loader: { options, resolve: { mainFiles: [] } },
        });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and use the "index" file in package when the "index" value already in the "mainFiles" resolve option (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-index', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, {
          loader: { options, resolve: { mainFiles: ['index', '...'] } },
        });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and use the "_index" file in package (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-_index', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work with an alias (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-alias', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, {
          resolve: {
            alias: {
              'path-to-alias': path.resolve(
                __dirname,
                syntax,
                'another',
                `alias.${syntax}`
              ),
              '@sass': path.resolve(
                __dirname,
                'sass',
                'directory-6',
                'file',
                '_index.sass'
              ),
              '@scss': path.resolve(
                __dirname,
                'scss',
                'directory-6',
                'file',
                `_index.scss`
              ),
              '@path-to-scss-dir': path.resolve(__dirname, 'scss'),
              '@path-to-sass-dir': path.resolve(__dirname, 'sass'),
              '@/path-to-scss-dir': path.resolve(__dirname, 'scss'),
              '@/path-to-sass-dir': path.resolve(__dirname, 'sass'),
            },
          },
          loader: { options },
        });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      // Legacy support for CSS imports with node-sass
      // See discussion https://github.com/webpack-contrib/sass-loader/pull/573/files?#r199109203
      it(`should work and ignore all css "@import" at-rules (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('import-css', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work with the "bootstrap-sass" package, directly import (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('bootstrap-sass', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work with the "bootstrap-sass" package, import as a package (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('bootstrap-sass-package', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work with the "bootstrap" package, import as a package (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('bootstrap', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work with the "foundation-sites" package, import as a package (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('foundation-sites', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
          sassOptions: {
            includePaths: ['node_modules/foundation-sites/scss'],
          },
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work with the "foundation-sites" package, adjusting CSS output (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId(
          'foundation-sites-adjusting-css-output',
          syntax
        );
        const options = {
          implementation: getImplementationByName(implementationName),
          sassOptions: {
            includePaths: ['node_modules/foundation-sites/scss'],
          },
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should work and output the "compressed" outputStyle when "mode" is production (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('language', syntax);
        const options = {
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, {
          mode: 'production',
          loader: { options },
        });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(
          testId,
          Object.assign({}, options, {
            sassOptions: {
              outputStyle: 'compressed',
            },
          })
        );

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      it(`should watch firstly in the "includePaths" values (${implementationName}) (${syntax})`, async () => {
        const testId = getTestId('prefer-include-paths', syntax);
        const options = {
          sassOptions: {
            includePaths: [
              path.resolve(
                `./test/node_modules/package-with-style-field-and-css/${syntax}`
              ),
            ],
          },
          implementation: getImplementationByName(implementationName),
        };
        const compiler = getCompiler(testId, { loader: { options } });
        const stats = await compile(compiler);
        const codeFromBundle = getCodeFromBundle(stats, compiler);
        const codeFromSass = getCodeFromSass(testId, options);

        expect(codeFromBundle.css).toBe(codeFromSass.css);
        expect(codeFromBundle.css).toMatchSnapshot('css');
        expect(getWarnings(stats)).toMatchSnapshot('warnings');
        expect(getErrors(stats)).toMatchSnapshot('errors');
      });

      if (implementation === dartSass) {
        it(`should output an understandable error with a problem in "@use" (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('error-use', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);

          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should output an understandable error when a file could not be found using "@use" rule (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('error-file-not-found-use', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);

          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should throw an error with a explicit file and a file does not exist using "@use" rule (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('error-file-not-found-use-2', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);

          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work with different "@use" at-rules (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('uses', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work with "@use" at-rules from other language style (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-other-style', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" at-rules from scoped npm packages (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-from-npm-org-pkg', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" at-rules with extensions (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-with-extension', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" at-rules starting with "_" (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-with-underscore', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" at-rules without extensions and do not start with "_" (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId(
            'use-without-extension-and-underscore',
            syntax
          );
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" and use the "sass" field (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-sass-field', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" and use the "style" field (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-style-field', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" and use the "main" field (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-main-field', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" and use the "main" field when the "main" value is not in the "mainFields" resolve option (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-main-field', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, {
            loader: { options, resolve: { mainFields: [] } },
          });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" and use the "main" field when the "main" value already in the "mainFields" resolve option (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-main-field', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, {
            loader: { options, resolve: { mainFields: ['main', '...'] } },
          });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" and use the "custom-sass" field (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-custom-sass-field', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, {
            loader: {
              options,
              resolve: { mainFields: ['custom-sass', '...'] },
            },
          });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" and use the "index" file in package (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-index', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" and use the "index" file in package when the "index" value is not in the "mainFiles" resolve option (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-index', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, {
            loader: { options, resolve: { mainFiles: [] } },
          });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" and use the "index" file in package when the "index" value already in the "mainFiles" resolve option (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-index', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, {
            loader: { options, resolve: { mainFiles: ['index', '...'] } },
          });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use"and use the "_index" file in package (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-_index', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" with an alias (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-alias', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, {
            resolve: {
              alias: {
                'path-to-alias': path.resolve(
                  __dirname,
                  syntax,
                  'another',
                  `alias.${syntax}`
                ),
                '@sass': path.resolve(
                  __dirname,
                  'sass',
                  'directory-6',
                  'file',
                  '_index.sass'
                ),
                '@scss': path.resolve(
                  __dirname,
                  'scss',
                  'directory-6',
                  'file',
                  `_index.scss`
                ),
                '@path-to-scss-dir': path.resolve(__dirname, 'scss'),
                '@path-to-sass-dir': path.resolve(__dirname, 'sass'),
                '@/path-to-scss-dir': path.resolve(__dirname, 'scss'),
                '@/path-to-sass-dir': path.resolve(__dirname, 'sass'),
              },
            },
            loader: { options },
          });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" with the "bootstrap-sass" package, directly import (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-bootstrap-sass', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" with the "bootstrap-sass" package, import as a package (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-bootstrap-sass-package', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });

        it(`should work when "@use" with the "bootstrap" package, import as a package (${implementationName}) (${syntax})`, async () => {
          const testId = getTestId('use-bootstrap', syntax);
          const options = {
            implementation: getImplementationByName(implementationName),
          };
          const compiler = getCompiler(testId, { loader: { options } });
          const stats = await compile(compiler);
          const codeFromBundle = getCodeFromBundle(stats, compiler);
          const codeFromSass = getCodeFromSass(testId, options);

          expect(codeFromBundle.css).toBe(codeFromSass.css);
          expect(codeFromBundle.css).toMatchSnapshot('css');
          expect(getWarnings(stats)).toMatchSnapshot('warnings');
          expect(getErrors(stats)).toMatchSnapshot('errors');
        });
      }
    });
  });
});
