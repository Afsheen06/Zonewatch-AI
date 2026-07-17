import type { Config } from "jest";

const config: Config = {
    testEnvironment: "jsdom",
    preset: "ts-jest",
    globals: {
        "ts-jest": {
            tsconfig: {
                jsx: "react-jsx",
            },
        },
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
        "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
        "^next/link$": "<rootDir>/__mocks__/nextLink.tsx",
        "^next/navigation$": "<rootDir>/__mocks__/nextNavigation.ts",
        "^next/font/(.*)$": "<rootDir>/__mocks__/nextFont.ts",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    transformIgnorePatterns: ["node_modules/(?!(next)/)"],
};

export default config;
