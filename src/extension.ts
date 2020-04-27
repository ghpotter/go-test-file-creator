import * as vscode from 'vscode';
import {createTestFile, createTestFileAll, createTestFileShortcut, createTestFileAllShortcut} from './test-file-maker';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "go-test-file-creator" is now active!');
	
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.goTestFileCreator', (uri:vscode.Uri) => {
			try {
				createTestFile(uri);
			} catch (err) {
				vscode.window.showErrorMessage("Go Test File Creator: Error creating file");
				console.error(err);
			}
		}),

		vscode.commands.registerCommand('extension.goTestFileCreatorShortcut', () => {
			try {
				createTestFileShortcut();
			} catch (err) {
				vscode.window.showErrorMessage("Go Test File Creator Shortcut: Error creating file");
				console.error(err);
			}
		}),

		vscode.commands.registerCommand('extension.goTestFileCreatorAll', (uri:vscode.Uri) => {
			try {
				createTestFileAll(uri);
			} catch (err) {
				vscode.window.showErrorMessage("Go Test File Creator All: Error creating files");
				console.error(err);
			}
		}),

		vscode.commands.registerCommand('extension.goTestFileCreatorAllShortcut', () => {
			try {
				createTestFileAllShortcut();
			} catch (err) {
				vscode.window.showErrorMessage("Go Test File Creator All Shortcut: Error creating files");
				console.error(err);
			}
		})
	);
}
