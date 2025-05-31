import { ISUIElement } from "@asledgehammer/pipewrench/client";
import { mock } from "jest-mock-extended";

/* jest.mock('@asledgehammer/pipewrench/client', () => ({
	__esModule: true,
	ISUIElement : ({
		initialise: jest.fn(),
		instantiate: jest.fn(),
		addToUIManager: jest.fn(),
		setVisible: jest.fn(),
		render: jest.fn()
	})
})); */
global.print = jest.fn()

jest.mock('@asledgehammer/pipewrench/client', () => ({
	__esModule: true,
	ISUIElement : class {
		constructor() {
			return mock<ISUIElement>()
		}
	}
}));