let inTest = false;
export function setInTest() {
  inTest = true;
}

export function runningInTest() {
  return inTest;
}
