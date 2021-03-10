import * as vscode from "vscode"

const luaenumDoc = require("./data/enums").luaenumDoc
const luaenumArray = require("./enumcompletion").luaenumArray

const eventsDoc = require("./data/events").eventsDoc
const getEventHover = require("./eventhover").getEventHover

export function activate(context: vscode.ExtensionContext) {
	console.log("loaded ketho.wow-api")
	setLuaLibrary(true)

	const completion = vscode.languages.registerCompletionItemProvider(
		"lua",
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let linePrefix = document.lineAt(position).text.substr(0, position.character)
				let lastWord = linePrefix.split(/[^\w\.]/).slice(-1)[0]
				// complete Lua Enums only for "LE_*" to avoid polluting global completion
				if (lastWord.startsWith("LE_")) {
					return luaenumArray
				}
			}
		},
		"_"
	)

	const hover = vscode.languages.registerHoverProvider(
		"lua",
		{
			provideHover(document: vscode.TextDocument, position: vscode.Position) {
				const range = document.getWordRangeAtPosition(position)
				if (range) {
					const word = document.getText(range)
					// show event payload
					if (eventsDoc[word])
						return getEventHover(word)
					// show lua enum value
					else if (luaenumDoc[word]) {
						const el = luaenumDoc[word]
						let md = new vscode.MarkdownString("```\ninteger = "+el+"\n```")
						let item = new vscode.Hover(md)
						return item
					}
				}
			}
		}
	)

	context.subscriptions.push(completion, hover)
}

function setLuaLibrary(enable: boolean) {
	let extension = vscode.extensions.getExtension("ketho.wow-api")
	let path = extension?.extensionPath+"\\EmmyLua"

	let luaConfig = vscode.workspace.getConfiguration("Lua")
	let library: string[] | undefined = luaConfig.get("workspace.library")
	if (library) {
		// remove any older release versions of our extension path
		for (let i = library.length-1; i >= 0; i--) {
			const el = library[i]
			if (el.indexOf("ketho.wow-api") > -1 && el.indexOf(path) == -1)
				library.splice(i, 1)
		}
		// add or remove path
		const index = library.indexOf(path)
		if (enable) {
			if (index == -1)
				library.push(path)
		}
		else {
			if (index > -1)
				library.splice(index, 1)
		}
		luaConfig.update("workspace.library", library, true)
		// I don't really think showing the emmylua itself in the display context is useful
		luaConfig.update("completion.displayContext", 0, true)
	}
}
