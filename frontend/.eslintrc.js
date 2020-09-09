module.exports = {
	root: true,
	extends: [
		'standard',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		// 'plugin:promise/recommended'
	],
	env: {
		browser: true,
		node: true
	},
	parser: '@typescript-eslint/parser', // https://github.com/typescript-eslint/typescript-eslint#readme
	parserOptions: {
		// https://www.npmjs.com/package/@typescript-eslint/parser
		project: ['./tsconfig.eslint.json'],
		ecmaFeatures: {
			tsx: true,
			jsx: true
		}
	},
	settings: { // https://github.com/yannickcr/eslint-plugin-react#configuration
		react: {
			import: {
				// https://www.npmjs.com/package/eslint-plugin-import
				extensions: [
					'.js',
					// '.jsx',
				],
				parsers: {
					'@typescript-eslint/parser': [
						'.ts',
						// '.tsx',
					],
				},
				// ignore: '.(scss|less|css)$',
				// 'core-modules': [ 'node' ],
			},
			createClass: 'createReactClass', // Regex for Component Factory to use,
			// default to "createReactClass"
			pragma: 'React', // Pragma to use, default to "React"
			//fragment: 'React.Fragment', // Fragment to use, default to "React.Fragment"
			version: '16.9', // React version. "detect" automatically picks the version you have installed.
			// You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
			// default to latest and warns if missing
			// It will default to "detect" in the future
			// flowVersion: '0.53' // Flow version
		},
		propWrapperFunctions: [
			// The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
			// 'forbidExtraProps',
			// { property: 'freeze', object: 'Object' },
			// { property: 'myFavoriteWrapper' }
		],
		linkComponents: [
			// Components used as alternatives to <a> for linking, eg. <Link to={ url } />
			'Hyperlink',
			{ name: 'Link', linkAttribute: 'to' }
		]
	},
	plugins: [
		'@typescript-eslint',
		// 'eslint-plugin-import',
		'import',
		'eslint-plugin-node',
		// 'eslint-plugin-promise',
		'eslint-plugin-standard',
		'react'
	],
	rules: {
		// off
		'linebreak-style': 'off',
		semi: 'off',
		'no-tabs': 'off',
		'indent': 'off',
		'quotes': 'off',
		'max-len': 'off',
		'comma-dangle':'off',
		'quote-props': 'off',
		'no-trailing-spaces':'off',
		'key-spacing':'off',
		'spaced-comment': 'off',
		'prefer-const': 'off',
		'space-before-function-paren': 'off',
		// async
		// 'promise/catch-or-return': 'error',
		// 'promise/always-return': 'error',
		// 'promise/no-native': 'error',
		// 'promise/no-nesting': 'error',
		// 'promise/prefer-await-to-then': 'error',
		// "promise/no-return-wrap":"error",
		// "promise/param-names":"error",
		// "promise/no-promise-in-callback":"error",
		// "promise/no-callback-in-promise":"error",
		// "promise/avoid-new":"error",
		// "promise/no-new-statics":"error",
		// "promise/no-return-in-finally":"error",
		// "promise/valid-params":"error",
		// "promise/prefer-await-to-callbacks":"error",
		'require-await': 'error',
		'@typescript-eslint/require-await': 'error',
		'no-return-await': 'error',
		// 'no-async-promise-executor': 'error',
		// '@typescript-eslint/promise-function-async': 'error',
		'no-await-in-loop': 'error',
		// 'prefer-promise-reject-errors': 'error',
		// react
		'react/display-name': 'warn',
		'react/prop-types': 0,
		// other
		'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
		'@typescript-eslint/ban-types': 'warn',
		"complexity": ["warn", { "max": 10 }], // https://eslint.org/docs/rules/complexity
		'radix': "off",
		'curly': ['warn', 'all'], // Expected { after 'if' condition
		'no-unused-vars': 'warn',
		'no-unused-labels': 'warn',
		'no-unused-expressions': 'warn',
		'no-undefined': 'warn',
		'object-property-newline': 'warn', // https://eslint.org/docs/rules/object-property-newline
		'one-var': 'warn',
		'no-mixed-operators': 'warn',
		'object-curly-newline': 'warn', // https://eslint.org/docs/rules/object-curly-newline
		'newline-after-var': 0, // https://eslint.org/docs/rules/newline-after-var
		'newline-before-return': 0, // https://eslint.org/docs/rules/newline-before-return
		// 'function-paren-newline': ['warn', { minItems: 2 }], // https://eslint.org/docs/rules/function-paren-newline
		'function-call-argument-newline': ['warn', 'consistent'], // https://eslint.org/docs/rules/function-call-argument-newline
		// 'prettier/prettier': 'warn', // https://github.com/prettier/eslint-plugin-prettier
		'no-confusing-arrow': 'warn',
		'import/no-duplicates': 'warn',
		'no-useless-constructor': 'warn',
		'@typescript-eslint/no-empty-function': 0,
		'no-shadow': 'warn',
		'@typescript-eslint/consistent-type-definitions': 'warn',
		'@typescript-eslint/consistent-type-assertions': 'warn',
		'no-useless-return': 'warn',
		'no-console': 'warn',
		'dot-notation': 'warn',
		'@typescript-eslint/explicit-function-return-type': 0,
		'@typescript-eslint/explicit-module-boundary-types': 'warn',
		'@typescript-eslint/no-explicit-any': 0,
		'camelcase': 0,
		'no-self-assign': 'warn',
		'@typescript-eslint/naming-convention': [
			// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md#enforce-that-interface-names-do-not-begin-with-an-i
			'warn',
			{
				selector: 'interface',
				format: ['PascalCase'],
				prefix: ['I']
			},
			{
				selector: 'typeAlias',
				format: ['PascalCase'],
				prefix: ['T']
			},
		]
	}
};
