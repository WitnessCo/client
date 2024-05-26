import * as fs from "fs-extra";
import * as TypeDoc from "typedoc";

await genLocalDocs();

// Copy the desired files to the docs app.
const sourceFile = "docsTmp/classes/WitnessClient.md";
const destFile = "docs/WitnessClient.md";
const contents = await fs.readFile(sourceFile, "utf8");
const cleanedContents = await cleanContents(contents);
await fs.ensureFile(destFile);
await fs.writeFile(destFile, cleanedContents);

// Generate the docs in this package's "docs" directory.
async function genLocalDocs() {
	const app = await TypeDoc.Application.bootstrapWithPlugins({
		plugin: ["typedoc-plugin-markdown"],
		entryPoints: ["src/index.ts"],
		excludeInternal: true,
	});
	const project = await app.convert();
	if (!project) {
		throw new Error("Failed to convert");
	}
	await app.generateDocs(project, "docsTmp");
}

async function cleanContents(input: string) {
	// Remove crosslinks as the URL structure doesn't match the folder structure.
	// Here's an example:
	// Source string: [@witnessco/client](../README.md)
	// Replacement string: @witnessco/client
	let output = input.replaceAll(/\[([^\]]+)\]\(\.[^\)]+\)/g, "$1");
	// Replace "\`0x$\{string}\`" with "`Hash`".
	output = output.replaceAll(/\\`0x\$\\\{string\}\\`/g, "`Hash`");
	return output;
}
