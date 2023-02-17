const config = {
	globalSetup: "<rootDir>/tests/setup.js",
	globalTeardown: "<rootDir>/tests/teardown.js",
	transform: {
		"^.+\\.(js|jsx)$": "babel-jest",
	},
};

export default config;
