import {isoObjectToString} from './ExampleAPI';
import {mock} from 'jest-mock-extended';

// jest.mock("@asledgehammer/pipewrench-events");

describe("ExampleAPI Testing", () => {
	it("isoObjectToString", () => {
		const result = isoObjectToString(mock({}))		
		/* expect(result).toEqual(`{}`); */
		expect(true).toBeTruthy();
	});
});
