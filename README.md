# dirscanner

## Usage

```
node ./src/index.js [?dir] [?output file path]
```

`dir` - dir to scan. Default - current dir

## Example

### Run:

```
node ./src/index.js
```

### Output:

```
dirscanner 183.87KB:
	.eslintrc 1.36KB
	.gitignore 28B
	.vscode 517B:
		launch.json 517B
	package-lock.json 178.27KB
	package.json 500B
	src 3.22KB:
		helpers.js 1000B
		index.js 774B
		main.js 1.49KB
```
