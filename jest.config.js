module.exports = {
	preset: 'ts-jest',
	roots: [
		'<rootDir>/src'
	],
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
	moduleFileExtensions: [
		'ts',
		'tsx',
		'js',
		'jsx',
		'json',
		'node'
	],
	setupFilesAfterEnv: ['<rootDir>/enzyme.config'],
};