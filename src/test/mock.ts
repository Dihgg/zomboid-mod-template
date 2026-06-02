globalThis.print = jest.fn();

const statValue = (name: string) => ({ __brand: "CharacterStatValue", name } as unknown);
(globalThis as unknown as { CharacterStat: Record<string, unknown> }).CharacterStat = {
	ANGER: statValue("ANGER"),
	BOREDOM: statValue("BOREDOM"),
	DISCOMFORT: statValue("DISCOMFORT"),
	ENDURANCE: statValue("ENDURANCE"),
	FATIGUE: statValue("FATIGUE"),
	FITNESS: statValue("FITNESS"),
	FOOD_SICKNESS: statValue("FOOD_SICKNESS"),
	HUNGER: statValue("HUNGER"),
	IDLENESS: statValue("IDLENESS"),
	INTOXICATION: statValue("INTOXICATION"),
	MORALE: statValue("MORALE"),
	NICOTINE_WITHDRAWAL: statValue("NICOTINE_WITHDRAWAL"),
	PAIN: statValue("PAIN"),
	PANIC: statValue("PANIC"),
	POISON: statValue("POISON"),
	SANITY: statValue("SANITY"),
	SICKNESS: statValue("SICKNESS"),
	STRESS: statValue("STRESS"),
	TEMPERATURE: statValue("TEMPERATURE"),
	THIRST: statValue("THIRST"),
	UNHAPPINESS: statValue("UNHAPPINESS"),
	WETNESS: statValue("WETNESS"),
	ZOMBIE_FEVER: statValue("ZOMBIE_FEVER"),
	ZOMBIE_INFECTION: statValue("ZOMBIE_INFECTION")
};