// Mirrors the production app's lightweight advisor-code sign-in. In the demo any
// code is accepted; history is filtered by the code used to sign in.
const ADVISOR_CODE_KEY = "attach-demo:advisor-code";

let memoryCode: string | null = null;

export function getAdvisorCode(): string | null {
  try {
    return sessionStorage.getItem(ADVISOR_CODE_KEY) ?? memoryCode;
  } catch {
    return memoryCode;
  }
}

export function setAdvisorCode(code: string): void {
  memoryCode = code;
  try {
    sessionStorage.setItem(ADVISOR_CODE_KEY, code);
  } catch {
    // Keep the in-memory value only.
  }
}

export function clearAdvisorCode(): void {
  memoryCode = null;
  try {
    sessionStorage.removeItem(ADVISOR_CODE_KEY);
  } catch {
    // Nothing stored.
  }
}

export function isAuthenticated(): boolean {
  return getAdvisorCode() !== null;
}
