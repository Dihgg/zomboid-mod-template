
import { ISUIElement } from "@asledgehammer/pipewrench/client";
import { TSUIRedSquare } from "./TSUIRedSquare";
// import { mock } from "jest-mock-extended";

//jest.mock("@asledgehammer/pipewrench/client");

describe.only("TSUIRedSquare", () => {
	//jest.spyOn(ISUIElementSpy.ISUIElement, '')
	it("should instantiate", () => {
		console.log('aa', ISUIElement.mock);
		
		const spy = jest.spyOn(ISUIElement.prototype, 'drawRect');
		const element = new TSUIRedSquare(0,0,0,0);
		element.drawRedSquare();
		expect(spy).toHaveBeenCalled();
	});
})