import * as vscode from 'vscode';
import {readFileSync, statSync, readdir} from 'fs';

// Creates and writes information for a new file
export function createTestFile(fileName: vscode.Uri) {
	const testFileName = createTestFileName(fileName);
	if (fileExists(testFileName)) {
		vscode.window.showErrorMessage(testFileName.fsPath + ' already exists.');
		throw new Error('Test file already exists.');
	}
	const testFileContent = readFile(fileName);
	writeTestFile(testFileName, testFileContent);
	vscode.window.showInformationMessage('Created: ' + testFileName.fsPath);
}

// Runs createTestFile over all files in the directory
export function createTestFileAll(uri: vscode.Uri) {
    readdir(uri.fsPath, (err, files) => {
        if (err) {
            return err;
		}
        files.forEach((file) => {
			try {
				createTestFile(vscode.Uri.file(uri.fsPath + '/' + file));
			} catch {
				//This goes through each file in the directory so we'll ignore each error.
			}
        });
    });
}

export function createTestFileShortcut() {
	const fileUri = vscode.window.activeTextEditor?.document.uri;
	if (fileUri) {
		createTestFile(fileUri);
	} else {
		throw new Error('Cannot determine file to make a test file from');
	}
}

export function createTestFileAllShortcut() {
	const fileName = vscode.window.activeTextEditor?.document.fileName;
	if (fileName) {
		const fileUri = vscode.Uri.file(fileName.substr(0, fileName.lastIndexOf('\\')));
		createTestFileAll(fileUri);
	} else {
		throw new Error('Cannot determine file to make a test files from');
	}
}

function fileExists(path: vscode.Uri) {
	try {
		const _ = statSync(path.fsPath);
		return true;
	} catch (err) {
		if (err.code === 'ENOENT') {
			return false;
		}
		throw err;
	}
}

// Creates a file name from the selected file replacing '.go' with '_test.go'
export function createTestFileName(fileNameUri: vscode.Uri) {
	const fileName = fileNameUri.fsPath;
	const indexOfLastDot = fileName.lastIndexOf('.');
	const ext = fileName.substr(indexOfLastDot + 1);
	if (indexOfLastDot < 0 || ext !== 'go') {
		throw new Error ('File must be of the extention ".go"');
	}

	const testCheck = fileName.substr(fileName.length - 8);
	if (testCheck === '_test.go') {
		throw new Error('Cannot create test file from file ending in "_test.go"');
	}

	return vscode.Uri.file(fileName.substr(0, indexOfLastDot) + '_test.go');
}

function readFile(baseFileUri: vscode.Uri) {
	const fileText = readFileSync(baseFileUri.fsPath, 'utf8');
	return createFileContent(fileText);
}

// Creates a buffer with informatinon from the selected file
export function createFileContent(fileText: string) {
	let output = '';
	let splitfileText = fileText.split('\n');
	splitfileText.forEach(line => {
		if (line.startsWith("package")) {
			output += line;
			output += '\n\n';
			output += 'import ("testing")';
			output += '\n';
		} else if (line.startsWith("func")) {
			if (line.charAt(5).match(/[A-Z]/)) {
				const functionName = line.substring(5, line.indexOf('('));
				output += '\nfunc Test' + functionName + '(t *testing.T) {\n}\n';
			} else if(line.charAt(5) === '(') {
				let functionName = line.substring(line.indexOf(')') + 1);
				functionName = functionName.substring(0, functionName.indexOf('('));
				output += '\nfunc Test' + functionName + '(t *testing.T) {\n}\n';
			}
		} 
	});

	return output;
}

// Writes the information to a file
function writeTestFile(testFileName: vscode.Uri, fileContents: string) {
	try {
		const contents = Buffer.from(fileContents, 'utf-8'); 
		vscode.workspace.fs.writeFile(testFileName, contents);
	}
	catch (err) {
		vscode.window.showErrorMessage("File not created");
		console.error(err);
	}
}
