// Jednostavno spremište u memoriji za Nonce-ove
// UPOZORENJE: Ovo radi samo dok je server aktivan. Za produkciju koristite Redis ili bazu.
export const nonces = new Map<string, string>();