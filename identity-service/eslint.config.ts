import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js },
		extends: ["js/recommended"],
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		languageOptions: { globals: globals.browser },
	},
	tseslint.configs.recommended,
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "warn",

			"@typescript-eslint/member-naming": [
				"warn",
				{
					private: "^_",
					protected: "^_",
				},
			],

			"@typescript-eslint/naming-convention": [
				"warn",
				{
					selector: "method",
					modifiers: ["private"],
					format: ["camelCase"],
					leadingUnderscore: "require",
				},
				{
					selector: "method",
					modifiers: ["protected"],
					format: ["camelCase"],
					leadingUnderscore: "require",
				},
			],
		},
	},
]);
