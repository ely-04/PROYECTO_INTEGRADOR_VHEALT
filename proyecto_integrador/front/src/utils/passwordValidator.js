/**
 * Validación recursiva de contraseña (frontend) — espejo de passwordValidator.cjs
 */

export const PASSWORD_RULES = [
  { id: 'minLength', message: 'Mínimo 8 caracteres', test: (p) => p.length >= 8 },
  { id: 'uppercase', message: 'Al menos una mayúscula', test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', message: 'Al menos una minúscula', test: (p) => /[a-z]/.test(p) },
  { id: 'digit', message: 'Al menos un número', test: (p) => /\d/.test(p) },
  { id: 'special', message: 'Al menos un carácter especial', test: (p) => /[^A-Za-z0-9]/.test(p) },
  { id: 'noSpaces', message: 'Sin espacios', test: (p) => !/\s/.test(p) },
];

export function validateRulesRecursive(password, rules, index = 0, results = []) {
  if (index >= rules.length) {
    return results;
  }
  const rule = rules[index];
  return validateRulesRecursive(password, rules, index + 1, [
    ...results,
    { id: rule.id, message: rule.message, passed: rule.test(password) },
  ]);
}

export function hasSequentialRun(password, startIndex = 0, minSeq = 3) {
  if (startIndex > password.length - minSeq) return false;
  const slice = password.slice(startIndex, startIndex + minSeq);
  const codes = [...slice].map((c) => c.charCodeAt(0));
  let ascending = true;
  let descending = true;
  for (let i = 1; i < codes.length; i += 1) {
    if (codes[i] !== codes[i - 1] + 1) ascending = false;
    if (codes[i] !== codes[i - 1] - 1) descending = false;
  }
  if (ascending || descending) return true;
  return hasSequentialRun(password, startIndex + 1, minSeq);
}

export function validateSecurePassword(password) {
  const pwd = String(password || '');
  const ruleResults = validateRulesRecursive(pwd, PASSWORD_RULES);
  const sequential = pwd.length > 0 && hasSequentialRun(pwd);
  const allRules = sequential
    ? [
        ...ruleResults,
        {
          id: 'noSequential',
          message: 'Sin secuencias consecutivas (123, abc)',
          passed: false,
        },
      ]
    : ruleResults;

  const passed = allRules.filter((r) => r.passed).length;
  const total = allRules.length;
  const valid = allRules.every((r) => r.passed);

  return { valid, rules: allRules, score: passed, maxScore: total };
}

export function passwordStrengthLabel(score, maxScore) {
  const ratio = score / maxScore;
  if (ratio === 0) return { label: 'Sin evaluar', color: 'bg-stone-200' };
  if (ratio < 0.5) return { label: 'Débil', color: 'bg-red-400' };
  if (ratio < 0.85) return { label: 'Media', color: 'bg-amber-400' };
  if (ratio < 1) return { label: 'Casi lista', color: 'bg-emerald-300' };
  return { label: 'Segura', color: 'bg-[#2d5a27]' };
}
