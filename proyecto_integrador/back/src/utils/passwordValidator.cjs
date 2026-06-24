/**
 * Validación recursiva de contraseñas seguras — V-HEALT
 *
 * RECURSIVIDAD: se recorre la lista de reglas y sub-cadenas mediante funciones
 * que se invocan a sí mismas con un índice incrementado (caso base: fin de lista).
 */

const PASSWORD_RULES = [
  {
    id: 'minLength',
    message: 'Mínimo 8 caracteres',
    test: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    message: 'Al menos una letra mayúscula (A-Z)',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    message: 'Al menos una letra minúscula (a-z)',
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: 'digit',
    message: 'Al menos un número (0-9)',
    test: (password) => /\d/.test(password),
  },
  {
    id: 'special',
    message: 'Al menos un carácter especial (!@#$%^&*...)',
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
  {
    id: 'noSpaces',
    message: 'Sin espacios en blanco',
    test: (password) => !/\s/.test(password),
  },
];

/**
 * Recorre recursivamente PASSWORD_RULES acumulando reglas fallidas.
 * Caso base: index >= rules.length → retorna resultado.
 */
function validateRulesRecursive(password, rules, index = 0, failures = []) {
  if (index >= rules.length) {
    return {
      valid: failures.length === 0,
      failures,
      score: rules.length - failures.length,
      maxScore: rules.length,
    };
  }

  const rule = rules[index];
  const nextFailures = rule.test(password) ? failures : [...failures, rule.message];

  return validateRulesRecursive(password, rules, index + 1, nextFailures);
}

/**
 * Detecta secuencias consecutivas (123, abc) mediante recursión.
 * Caso base: no hay ventana suficiente para minSeq caracteres.
 */
function hasSequentialRun(password, startIndex = 0, minSeq = 3) {
  if (startIndex > password.length - minSeq) {
    return false;
  }

  const slice = password.slice(startIndex, startIndex + minSeq);
  const codes = [...slice].map((c) => c.charCodeAt(0));

  let ascending = true;
  let descending = true;
  for (let i = 1; i < codes.length; i += 1) {
    if (codes[i] !== codes[i - 1] + 1) ascending = false;
    if (codes[i] !== codes[i - 1] - 1) descending = false;
  }

  if (ascending || descending) {
    return true;
  }

  return hasSequentialRun(password, startIndex + 1, minSeq);
}

/**
 * Valida contraseña completa (reglas + anti-secuencias).
 */
function validateSecurePassword(password) {
  const pwd = String(password || '');
  const base = validateRulesRecursive(pwd, PASSWORD_RULES);

  if (hasSequentialRun(pwd)) {
    return {
      valid: false,
      failures: [...base.failures, 'Evita secuencias consecutivas (ej. 123, abc)'],
      score: base.score,
      maxScore: base.maxScore + 1,
    };
  }

  return base;
}

module.exports = {
  PASSWORD_RULES,
  validateRulesRecursive,
  hasSequentialRun,
  validateSecurePassword,
};
