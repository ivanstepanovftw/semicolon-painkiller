import * as vscode from 'vscode';
import { Selection, Range, Position } from 'vscode';


function cursorEnd(inSelectionMode: boolean) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	var newSelections: Selection[] = [];

	editor.selections.forEach(selection => {
		const line = editor.document.lineAt(selection.active.line);
		const lineLastCharacter = line.range.end.character;
		const lineEOLSemicolon = line.text.search(/[\s;]+$/);
		
		if (selection.active.character !== lineEOLSemicolon && lineEOLSemicolon !== -1) {
			const position = new Position(selection.active.line, lineEOLSemicolon);
			newSelections.push(new Selection(inSelectionMode ? selection.anchor : position, position));	
		} else {
			const position = new Position(selection.active.line, lineLastCharacter);
			newSelections.push(new Selection(inSelectionMode ? selection.anchor : position, position));
		}
	});

	editor.selections = newSelections;
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('better-end-key.cursorEnd', function () {
		cursorEnd(false);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('better-end-key.cursorEndSelect', function () {
		cursorEnd(true);
	}));
}

export function deactivate() {}
