import fs from "fs-extra";
import TypeDoc from "typedoc";

await genLocalDocs();

// Copy the desired files to the docs app.
const sourceFile = "docs/classes/WitnessClient.md";
const destFile =
	"../../apps/docs/src/pages/api-reference/typescript/WitnessClient.md";
const contents = await fs.readFile(sourceFile, "utf8");
const cleanedContents = await cleanContents(contents);
await fs.writeFile(destFile, cleanedContents);

// Generate the docs in this package's "docs" directory.
async function genLocalDocs() {
	const app = await TypeDoc.Application.bootstrapWithPlugins({
		plugin: ["typedoc-plugin-markdown"],
		entryPoints: ["src/index.ts"],
	});
	const project = await app.convert();
	if (!project) {
		throw new Error("Failed to convert");
	}
	await app.generateDocs(project, "docs");
}

async function cleanContents(input: string) {
	// Remove crosslinks as the URL structure doesn't match the folder structure.
	// Here's an example:
	// Source string: [@witnessco/client](../README.md)
	// Replacement string: @witnessco/client
	const output = input.replaceAll(/\[([^\]]+)\]\(\.[^\)]+\)/g, "$1");
	return output;
}
