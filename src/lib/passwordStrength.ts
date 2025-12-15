export function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Very weak", "Weak", "Okay", "Strong", "Very strong"];

  return {
    score,
    label: labels[score],
    isStrongEnough: score >= 3,
  };
}
