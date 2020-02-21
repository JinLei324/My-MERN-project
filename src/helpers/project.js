export const SERVICE_FEE = 5
export const PROCESS_FEE1 = 2.9
export const PROCESS_FEE2 = 0.3

export function REAL_AMOUNT(amount) {
	if (Number(amount) === 0) return 0
	return (Number(amount) * (100 + SERVICE_FEE + PROCESS_FEE1) / 100 + PROCESS_FEE2).toFixed(2)
}

export function DONATE_AMOUNT(amount) {
	if (Number(amount) === 0) return 0
	return ((Number(amount) - PROCESS_FEE2) * 100 / (100 + SERVICE_FEE + PROCESS_FEE1)).toFixed(2)
}

export function SERVICE_AMOUNT(amount) {
	if (Number(amount) === 0) return 0
	return (Number(amount) * SERVICE_FEE / 100).toFixed(2)
}

export function PROCESS_AMOUNT(amount) {
	if (Number(amount) === 0) return 0
	return ((Number(amount) * PROCESS_FEE1 / 100) + PROCESS_FEE2).toFixed(2)
}