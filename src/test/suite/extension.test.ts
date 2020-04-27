import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {createTestFileName, createFileContent} from '../../test-file-maker';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Test - createTestFileName()', () => {
		let testFiles = new Map();
		testFiles.set("hi.go", "hi_test.go");
		testFiles.set("hi.test.go", "hi.test_test.go");
		testFiles.set("hi_exe.go", "hi_exe_test.go");

		for (const [entry, expected] of testFiles) {
			assert.equal(createTestFileName(vscode.Uri.file(entry)).fsPath, vscode.Uri.file(expected).fsPath);
		}
	});

	test('Test - createTestFileName() errors', () => {
		let testFiles = new Map();
		testFiles.clear();
		testFiles.set("hi.exe", 'File must be of the extention ".go"');
		testFiles.set("hi_test.go", 'Cannot create test file from file ending in "_test.go"');
		testFiles.set("hi_go", 'File must be of the extention ".go"');

		for (const [entry, expected] of testFiles) {
			assert.throws(() => createTestFileName(vscode.Uri.file(entry)), Error, expected);
		}
	});

	test('Test - createFileContent()', () => {
		const file_content = 'package main\n\nimport ("package")\n\nfunc PublicFunction() {}\n\nfunc privateFunction() {}\n\nfunc (s *struct)OtherFunction() {}\n\nfunc PublicFunctionTwo() {}\n';

		const got = createFileContent(file_content);

		const expected = 'package main\n\nimport ("testing")\n\nfunc TestPublicFunction(t *testing.T) {\n}\n\nfunc TestOtherFunction(t *testing.T) {\n}\n\nfunc TestPublicFunctionTwo(t *testing.T) {\n}\n';

		assert.equal(got, expected);
	});
});
