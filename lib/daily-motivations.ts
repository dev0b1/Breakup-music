// Fallback list of up to 20 daily motivation lines used when external generation fails
export const DAILY_MOTIVATIONS: string[] = [
  "They didn't lose you. You upgraded.",
  "Your ex is a lesson, not a life sentence. Move up, not back.",
  "Glow-up season: you were born ready.",
  "Plot twist: you were always the prize.",
  "Their loss, literally everyone else's gain.",
  "Main character energy only — next chapter loading.",
  "You're not healing, you're leveling up.",
  "They left? Good. More room for your upgrade.",
  "Unbothered. Moisturized. In your lane. Flourishing.",
  "You dodged a bullet. Now dodge their apology text.",
  "From heartbroken to heartbreaker energy — spin that narrative.",
  "You're the plot twist they didn't see coming.",
  "Keep the receipts, but spend the glow-up.",
  "Less drama, more champagne — celebrate the upgrade.",
  "You're busy building an empire; exes are background noise.",
  "Confidence is the best revenge — wear it daily.",
  "They were a practice run; now you headline.",
  "Smile louder. Dance harder. Flourish further.",
  "You are the vibe, not the victim.",
  "New day, new you — make it iconic."
];

export function getFallbackMotivation(dayNumber: number = 1): string {
  // Choose deterministically by dayNumber but fall back to random if needed
  const index = ((dayNumber - 1) % DAILY_MOTIVATIONS.length + DAILY_MOTIVATIONS.length) % DAILY_MOTIVATIONS.length;
  return DAILY_MOTIVATIONS[index];
}
