export const onGameStart = {
	addListener: jest.fn(callback => {
		callback();
	})
};

export const everyOneMinute = {
	addListener: jest.fn()
};

export const onCreatePlayer = {
	addListener: jest.fn()
};

export const onGameBoot = {
	addListener: jest.fn()
};
