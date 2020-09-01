# Frontend code review

## Disclaimer

### What is it?

List of the typical issues and recommendations in the develop branch

Issues was found during static code analysis tools with extended rule set. To detect founded issues automatically in project was added the corresponding rule set. For triggered rules was collected and commented all unique issue types.

Described issues and recommendations should not be fixed mandatory(in any way), and does not guarantee the success. This is additional information for decision making process.

The most useful part is in the code analysis tools configuration
* package.json:
	```json
	"scripts": {
		"lint:spell": "cspell -c ./.cspell.json ./**/*.*",
		"lint:es": "eslint -c ./.eslintrc.js --ext '.ts, .tsx' ./src",
	//...	
	"devDependencies": {
		"@typescript-eslint/eslint-plugin": "^3.10.1",
		"@typescript-eslint/parser": "^3.10.1",
		"eslint": "^7.7.0",
		"eslint-config-standard": "^14.1.1",
		"eslint-import-resolver-typescript": "^2.2.1",
		"eslint-loader": "^4.0.2",
		"eslint-plugin-import": "^2.22.0",
		"eslint-plugin-node": "^11.1.0",
		"eslint-plugin-promise": "^4.2.1",
		"eslint-plugin-react": "^7.20.6",
		"eslint-plugin-standard": "^4.0.1",
	```
* `.cspell-dict-exclude.txt`
* `.cspell.json`
* `.eslintrc.js`
* `tsconfig.eslint.json`
* `.vscode\settings.json`
```json
	{
	"eslint.alwaysShowStatus": true,
	"eslint.options": {
		"preferGlobal": false,
		"configFile": ".eslintrc.js"
	},
	"eslint.lintTask.options": "--resolve-plugins-relative-to ./ -p tsconfig.eslint.json .",
	"eslint.codeAction.showDocumentation": {
		"enable": true
	},
	"eslint.validate": [
			"javascript",
			"typescript",
			"typescriptreact",
			"javascriptreact"
	],
	"cSpell.customWorkspaceDictionaries": [
		".cspell-dict-exclude.txt"
	],
	"sonarlint.ls.javaHome": "/etc/alternatives/jre/",
		"sonarlint.connectedMode.connections.sonarqube": [
			{
			"serverUrl": "https://sonar.epam.com",
			"token": ""
			}
		],
		"sonarlint.connectedMode.project": {
			"projectKey": ""
	},
	"sonarlint.disableTelemetry": true,
	}
```

The full issues list is in the `log` folder: cspell.log, eslint.log, tslint.log

### What is it for?

* to introduce team with issues, collect feedback, discuss the typical issues and issues resolving methods
* find additional info in similar project or communities for issues, that cannot be approved by all team members
* make a task list and calculate estimation time to resolve that tasks
* mark approved issue types(eslint rules) as `error` or `warn` in the `.eslintrc.js`, doesn't approved as `warn` or `off`:
	* rules, that can be resolved in short time mark as `error`
	* rules, that require long time to resolve mark as `warn`
	* after resolving all detected by single rule issues mark as `error`. 
	* Add to build script [eslint --fix](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) command. For that you can make separate `.eslintrc.fix.js` only with rules in `error` state

## Common recommendations

1. **Cover all code units(files, modules, functions, etc) with tests. Collaboration is very hard without unit testing, especially with external teams.**
1. Use unit test code coverage calculation tools
1. Exclude(comment with TODO or disable) fake tests to reduce testing time
1. Add into README file real data calculation conditions: hardware(CPU, RAM, STORAGE), OS architecture(32/64/...) and version, browser version, input and output data size and type, expectable overall calculation time in described conditions(1Tb animal pictures data for the 1 hour using win10x64/Chrome 84/core i7x4/8GB ram)
1. Use human readable naming instead of single chars: value, item, prop, stream, result, thread, error
1. Prefer to format code into less length size lines, more often use newlines to reduce merge conflicts
1. COmma and math/logic operators place in the end of line to make easier work in the [column selection mode](https://marketplace.visualstudio.com/items?1.temName=erikphansen.vscode-toggle-column-selection)
    * https://eslint.org/docs/rules/object-property-newline
    * https://eslint.org/docs/rules/operator-linebreak
    * https://eslint.org/docs/rules/one-var

## cspell(the text)

Severity: low

Issues in: `spell.log`
Exclude words dictionary: `.cspell-dict-exclude.txt`
Check by: `npm run lint:spell`

1. Use direct web links. Indirect reference can became broken due to overtime limitations. Broken direct links much easier to detect
	* line: `frontend/src/serviceWorker.ts:77`
	* pointed: https://bit.ly/CRA-PWA
	* redirects to: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app
	* seen `This file has moved here`: https://github.com/facebook/create-react-app/blob/master/packages/cra-template/template/README.md
1. Use spell check in IDE
	* https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker
	* https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-russian

## Stylelint(css)

Severity: low

Nothing important

## ESLint

Issues in: `eslint.log`
Check by: `npm run lint:es`

### React

Severity: moderate

Framework related issues

1. Configure [eslint rule plugin](https://github.com/yannickcr/eslint-plugin-react#configuration)
1. Component definition is missing display name
	* rule: [react/display-name](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/display-name.md)
	* line: `src/components/addDataset/AddDataset.tsx:105`
	* example: 
	```tsx
		component: (navProps: any) => (
			<UploadFiles {...navProps} files={files} setFiles={setFiles} />
		)
	```
1. 'onClose' is missing in props validation
	* rule: [react/prop-types](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md)
	* line: `src/components/addDataset/AddDataset.tsx:187`
	* example: `<Button type="button" color="primary" onClick={props.onClose}>`

### Data types

Severity: moderate

Covering code with data types reduce issues count at the code editing(in IDE) stage and improve code understanding by humans. Also that allow to mitigate absent unit tests issues

1. Use an `interface` instead of a `type`
	* rule: [@typescript-eslint/consistent-type-definitions](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/consistent-type-definitions.md) [issue](https://github.com/typescript-eslint/typescript-eslint/issues/433)
	* line: `src/components/gallery/ImageGallery/TaskForm.tsx:20`
	* example:
	```tsx
		export type FormData = {
		taskName: string;
		user: string | number;
		currentDatasetId: string | number;
		filesInTask: number;
		countOfTasks: number;
		};
	```
1. Don't use `Function` as a type. The `Function` type accepts any function-like value. It provides no type safety when calling the function, which can be a common source of bugs. It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`. If you are expecting the function to accept certain arguments, you should explicitly define the function shape 
	* rule: [@typescript-eslint/ban-types](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md#default-options)
	* line: `frontend/src/components/addDataset/uploadImages/UploadFiles.tsx:11`
	* example: `setFiles: Function;`
1. Don't use `Object` as a type. The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`. - If you want a type meaning "any object", you probably want `Record<string, unknown>` instead. - If you want a type meaning "any value", you probably want `unknown` instead. The `object` type is currently hard to use ([see this issue](https://github.com/microsoft/TypeScript/issues/21732)).
	* rule: [@typescript-eslint/ban-types](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md#default-options)
	* line: `frontend/src/components/tasksStatuses/TasksStatuses.tsx:46`
	* example: `const updateSearchState = (newSearchProps: Object) => {`
1. Don't use `{}` as a type. `{}` actually means "any non-nullish value".
- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.
- If you want a type meaning "any value", you probably want `unknown` instead
	* rule: [@typescript-eslint/ban-types](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md#default-options)
	* line: `frontend/src/routerconfig.tsx:34`
	* example: `export const TabsContent: FC<{}> = () => (`
1. Missing return type on function 
	* rule: [@typescript-eslint/explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/explicit-function-return-type.md)
	* line: `src/components/tasksStatuses/TaskActions.tsx:61`
	* example: `onClick={() => setOpenCreateTaskDialog(true)}`
1. Unexpected any. Specify a different type 
	* rule: [@typescript-eslint/no-explicit-any](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/no-explicit-any.md)
	* line: `src/components/addDataset/AddDataset.tsx:105`
	* example: `component: (navProps: any) => (`
1. Argument should be typed with a non-any type
	* rule: [@typescript-eslint/explicit-module-boundary-types](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md)
	* line: `src/api/gallery.api.ts:4`
	* example: `export const getMediaAssetsRequest = ({ datasetId }: any) => {`
1. Missing return type on function
	* rule: [@typescript-eslint/explicit-module-boundary-types](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md)
	* line: `src/api/data.api.ts:4`
	* example: `export const getBucketsRequest = async () => {`
1. Unexpected use of undefined
	* rule: [no-undefined](https://eslint.org/docs/rules/no-undefined)
	* line: `src/components/tasksStatuses/TasksStatuses.tsx:38`
	* example: `sortOrder: undefined,`

## Naming and code style guide

Severity: low

Naming is very subjectively. That requires advanced communicating and compromise finding skills. However, approved naming conventions gives solid code reading/understanding speed improvement and significantly reduce code changing "loops" risk during refactoring.

1. use the `camelCase` naming notation.
	* rule: use `npm run lint:spell`
	* line: `frontend/src/serviceWorker.ts:69`
	* example: `installingWorker.onstatechange = () => {`
	* fix: `installingWorker.onStateChange = () => {`
1. Object property is better written in dot notation
	* rule: [dot-notation](https://eslint.org/docs/rules/dot-notation)
	* line: `src/store/labelingTask/index.ts:26`
	* example: `return headers['location'];`
1. Identifier is not in camel case
	* rule: [camelcase](https://eslint.org/docs/rules/camelcase)
	* line: `src/models/dataset.ts:6`
	* example: `preview_image: string;`
1. Interface name `FormContainerProps` must have one of the following prefixes: I  @typescript-eslint/naming-convention
	* rule: [@typescript-eslint/naming-convention](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/naming-convention.md#enforce-that-interface-names-do-not-begin-with-an-i)
	* line: `src/components/addDataset/uploadImages/UploadFiles.tsx:9`
	* example: `interface UploadFilesProps {`
1. Type Alias name must have one of the following prefixes: T
	* rule: [@typescript-eslint/naming-convention](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/naming-convention.md)
	* line: `src/components/addDataset/utils.tsx:30`
	* example: `export type FormData = {`
1. variable name must be in UPPER_CASE 
	* rule: [@typescript-eslint/naming-convention](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/naming-convention.md#enforce-that-all-const-variables-are-in-upper_case)
	* line: `frontend/src/routerconfig.tsx:44`
	* example: `const TabsContent`
1. use [git](https://www.git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_core_autocrlf) convert LF<-->CRLF instead of prettier. Moreover, this configured in `.gitattributes`
	* rule: [endOfLine](https://prettier.io/docs/en/options.html#end-of-line)
	* line: `frontend/.prettierrc.js:4`
	* example: `endOfLine: 'lf',`
	* fix: `$ git config --global core.autocrlf input`
1. Expected blank line after variable declarations; Expected newline before return statement
	* rule: [newline-after-var](https://eslint.org/docs/rules/newline-after-var)
	* rule: [newline-before-return](https://eslint.org/docs/rules/newline-before-return)
	* rule: [function-paren-newline](https://eslint.org/docs/rules/function-paren-newline)
	* line: `src/store/data/index.ts:24`
	* example: 
	```tsx
		export const getLabelingToolUsers = createAsyncThunk('fetchUsers', async () => {
			const response = await getLabelingToolUsersRequest();
			return response.data;
		});
	```
	* fix:
		```tsx
		export const getLabelingToolUsers = createAsyncThunk(
			'fetchUsers', 
			async () => {
				const response = await getLabelingToolUsersRequest();

				return response.data;
			});
	```
1. Expected { after 'if' condition.
	* rule: sonarlint [typescript:S121](https://rules.sonarsource.com/typescript/RSPEC-121) 
	* rule: eslint [curly](https://eslint.org/docs/rules/curly)
	* line: `/home/bsk/doc/coding/model_garden/frontend/src/api/media.api.ts:9`
	* example: `if (path) formData.append('path', path);`

## Syntax

Severity: moderate

1. Variable is defined but never used
	* rule: [no-unused-vars](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/no-unused-vars.md)
	* line: `src/components/addDataset/AddDataset.tsx:31`
	* example: `interface TabPanelProps {`
1. Missing radix parameter ParseInt()
	* rule: [radix](https://eslint.org/docs/rules/radix)
	* line: `src/components/tasksStatuses/createTaskDialog/CreateTaskDialog.tsx:164`
	* example: `const calculatedValue = filesCount / parseInt(value);`
1. Unexpected empty arrow function
	* [@typescript-eslint/no-empty-function](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/no-empty-function.md)
	* `frontend/src/components/addDataset/AddDataset.tsx:80`
	* `.catch(() => {});`
1. Useless constructor. In this case you can make class `abstract` or replace it by the interface
	* rule: [no-useless-constructor](https://eslint.org/docs/rules/no-useless-constructor)
	* line: `src/models/labelingToolUser.ts:1`
	* example: `constructor(public full_name: string, public id: string, public email: string) {}`
1. variable is already declared in the upper scope
	* rule: [no-shadow](https://eslint.org/docs/rules/no-shadow)
	* line: `src/components/tasksStatuses/TaskActions.tsx:31`
	* example: 
	```tsx
		import { setOpenCreateTaskDialog } from '../../store/labelingTask';
		//...
		const {
			setOpenConformationDialog, // <--
			setOpenCreateTaskDialog,
			archiveLabelingTask,
			retryLabelingTask
		} = props;

	```
1. imported multiple times
	* rule: [import/no-duplicates](https://github.com/benmosher/eslint-plugin-import/blob/v2.22.0/docs/rules/no-duplicates.md)
	* line: `src/components/tasksStatuses/TasksStatuses.tsx:7`
	* example: 
	```tsx
		import { getLabelingTasks } from '../../store/tasksStatuses';
		// ...
		import { setSelectedRowKeys } from '../../store/tasksStatuses';
	```
	* fix:
	```tsx
		import { getLabelingTasks, setSelectedRowKeys } from '../../store/tasksStatuses';
	```
1. variable is defined but never used. Unused variables, especially in `import` declarations, can slowdown code reading, review and execution.
	* rule: [@typescript-eslint/no-unused-vars](https://github.com/typescript-eslint/typescript-eslint/blob/v3.10.1/packages/eslint-plugin/docs/rules/no-unused-vars.md)
	* line: `src/components/gallery/ImageGallery/TaskForm.tsx:56`
	* example: 
	```tsx
		.catch((e: any) => {
			setCheckList([]);
		});
	```
1. Arrow function used ambiguously with a conditional expression 
	* rule: [no-confusing-arrow](https://eslint.org/docs/rules/no-confusing-arrow)
	* line: `src/components/gallery/DatasetView/DatasetGrid.tsx:96`
	* example: 
	```tsx
		data.datasets.filter((dataset) =>
			searchTerm
				? dataset.path.toLowerCase().includes(searchTerm.toLowerCase())
				: true
	```
1. Unexpected console statement. Better to use logging class or service to prepare cloud/remote logging service integration and don't forgot to remove debug code from MR/PR.
	* rule: [no-console](https://eslint.org/docs/rules/no-consoleno-console)
	* line: `src/serviceWorker.ts:47`
	* example: `console.log(`
	* fix: 
	```ts
	logger.log({
		data: {someVar: someVar},
		do: 'Parse and handle unexpected someVar value'
	})
	```
1. Unnecessary return statement. Function should return `null` instead of `undefined` or should be marked as `:void`
	* rule: [no-useless-return](https://eslint.org/docs/rules/no-useless-return)
	* line: `src/components/tasksStatuses/createTaskDialog/CreateTaskDialog.tsx:157`
	* example: 
	```tsx
		if (!isNum.test(value) && value !== '') {
			return;
		} else {
	```

## Sonar

Severity: moderate

Works better than ESLint, use more wide [rule set](https://rules.sonarsource.com/) for much more language count. Included in EngX best practices and IT Security quality gates. You can use corporate [sonar Qube](sonar.epam.com) and IDE plugin [sonarlint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)

1. Expected an assignment or function call and instead saw an expression. Confusing IIFE usage.
	* rule: [typescript:S905](https://rules.sonarsource.com/typescript/RSPEC-905)
	* line: `/home/bsk/doc/coding/model_garden/frontend/src/components/shared/dropzone/DropZone.tsx:26`
	* example: `onDrop?.(acceptedFiles);`
1. Refactor this function to reduce its Cognitive Complexity from 26 to the 15 allowed.
	* rule: sonar [typescript:S3776](https://rules.sonarsource.com/typescript/RSPEC-3776)
	* rule: eslint ["complexity": ["warn", { "max": 10 }]](https://eslint.org/docs/rules/complexity)
	* line: `/home/bsk/doc/coding/model_garden/frontend/src/components/tasksStatuses/createTaskDialog/CreateTaskDialog.tsx:156`
	* line: `src/serviceWorker.ts:60`
	* example(!formatted): 
	```tsx
	const validateNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
		//...1
		if (!isNum.test(value) && value !== '') {
			//...2
		} else {
			if (isNum.test(value) && Number(value) > filesCount) {
				//...3
			}
			if (name === 'filesInTask' && counter.countOfTasks === '0') {
				//...4
				setCounter((counter) => ({
					...counter,
					countOfTasks:// !!! duplicate
						calculatedValueString !== Infinity
						? //...5
				}));
			} else if (name === 'countOfTasks' && counter.filesInTask === '0') {
				//...6
				setCounter((counter) => ({
					...counter,
					filesInTask:// !!! duplicate
						calculatedValueString !== Infinity
						? //...7
				}));
			} else {
				//...8
			}
		}
	};
	```
	* fix: reduce code complexity using:
		* splitting to less size files and grouping it in folders
		* splitting into smart(logic) and dumb(UI) files, for example: `*.component.ts` (UI), `*.service.ts` (logic), `*.gateway.ts` (API)
1. Either remove this import or add it as a dependency. Missed in package.json.
	* rule: sonarlint [typescript:S4328](https://rules.sonarsource.com/typescript/RSPEC-4328)
	* line: `/home/bsk/doc/coding/model_garden/frontend/src/components/tasksStatuses/GetColumnSearchProps.tsx:2`
	* example: `import { SearchOutlined } from '@ant-design/icons';`
1. Remove this useless assignment to variable
	* rule: [typescript:S1854](https://rules.sonarsource.com/typescript/RSPEC-1854)
	* line: `/home/bsk/doc/coding/model_garden/frontend/src/store/gallery/index.ts:24`
	* example: 
	```tsx
	let state = getState() as any;//1
    if (!state.data.datasets.length) {
      await dispatch(getDatasets(bucketId));
      state = getState() as any;//2
    }
	```
1. This is the default value for this type parameter, so it can be omitted.
	* rule: [typescript:S4157](https://rules.sonarsource.com/typescript/RSPEC4157)
	* line: `/home/bsk/doc/coding/model_garden/frontend/src/routerconfig.tsx:34`
	* example: `: FC<{}>`

## Async code

Severity: high

The most complicated to fix and search issues type, that can cause memory leaks and data loss.
You can request knowledge transfer from more experienced project teams with huge `Promise` codebase.

1. Each then() should return a value or throw
	* rule: [promise/always-return](https://github.com/xjamundx/eslint-plugin-promise/blob/HEAD/docs/rules/always-return.md)
	* line: `src/components/gallery/ImageGallery/TaskForm.tsx:51`
	* example: 
	```tsx
		dispatch(createLabelingTask(formData))
			.then(unwrapResult)
			.then(() => {
				setCheckList([]);
			})
			.catch((e: any) => {
				setCheckList([]);
			});
	```
1. Prefer await to then()
	* rule: [promise/prefer-await-to-then](https://github.com/xjamundx/eslint-plugin-promise/blob/development/rules/prefer-await-to-then.js)
	* line: `src/components/gallery/ImageGallery/TaskForm.tsx:51`
	* example: 
	```tsx
	dispatch(createLabelingTask(formData))
      .then(unwrapResult)
      .then(() => {
        setCheckList([]);
      })
      .catch((e: any) => {
        setCheckList([]);
      });
	```
1. Expected catch() or return; Each then() should return a value or throw
	* rule: [promise/catch-or-return](https://github.com/xjamundx/eslint-plugin-promise/blob/v4.0.1/rules/catch-or-return.js)
	* rule: [promise/always-return](https://github.com/xjamundx/eslint-plugin-promise/blob/v4.0.1/rules/always-return.js)
	* line: `src/components/tasksStatuses/createTaskDialog/CreateTaskDialog.tsx:102`
	* example: 
	```tsx
		createLabelingTask(data)
		.then(unwrapResult)
		.then(() => {
			resetForm();
			clearUnsignedImagesCount();
		});
	```
1. "Promise" is not defined
	* rule: [promise/no-native](https://github.com/xjamundx/eslint-plugin-promise/blob/v4.0.1/rules/no-native.js)
	* line: `src/store/data/index.ts:31`
	* example: `const [bucketsResponse, usersResponse] = await Promise.allSettled([`
1. Avoid nesting promises. That requires several `catch` blocks and slowdown code testing/refactoring
	* rule: [promise/no-nesting](https://github.com/xjamundx/eslint-plugin-promise/blob/v4.0.1/rules/no-nesting.js)
	* line: `src/serviceWorker.ts:115`
	* example: 
	```tsx
	fetch(swUrl, {headers: { 'Service-Worker': 'script' }})
		.then((response) => { // !!! 1 !!!
			// ...
			if (
				// ...
			) {
				navigator.serviceWorker.ready.then((registration) => {// !!! 2 !!!
					registration.unregister().then(() => {// !!! 3 !!!
						// ...
					});
				});
			} else {
				// ...
			}
		}).catch(() => {
			// ...
		});
	```
	* fix: split into [several functions](https://philipwalton.com/articles/untangling-deeply-nested-promise-chains/) with correct naming, catching and commenting. Look to the  [rxjs](https://rxjs.dev/)
