export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function getRandomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function getSkillCode(skillName: string) {
  return skillName.toLowerCase().replace(/ /g, "-");
}
