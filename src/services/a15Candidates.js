import { getWorkingEmployees } from './availability'

const EXCLUDED_EMPLOYEES = [
    'BELEN ANCHATUÑA',
    'ISMAEL MOLINA',
    'MICHAEL CUSME',
]

function normalizeName(name) {
    return String(name || '')
        .trim()
        .toUpperCase()
}

/**
 * Obtiene los colaboradores candidatos
 * para realizar A15 en un día determinado.
 *
 * Reglas:
 *
 * 1. Deben estar trabajando ese día.
 * 2. No pueden estar dentro de los excluidos.
 * 3. No existe prioridad por hora de ingreso.
 */
export function getA15Candidates(
    employees,
    day
) {
    if (
        !employees ||
        !Array.isArray(employees)
    ) {
        return []
    }

    const workingEmployees =
        getWorkingEmployees(
            employees,
            day
        )

    return workingEmployees.filter(
        (employee) => {
            const normalizedName =
                normalizeName(
                    employee.name
                )

            return !EXCLUDED_EMPLOYEES.includes(
                normalizedName
            )
        }
    )
}

/**
 * Verifica si un colaborador está excluido
 * del proceso de A15.
 */
export function isExcludedFromA15(
    employee
) {
    if (!employee) {
        return true
    }

    const normalizedName =
        normalizeName(
            employee.name
        )

    return EXCLUDED_EMPLOYEES.includes(
        normalizedName
    )
}

/**
 * Devuelve la lista de personas excluidas
 * del proceso de A15.
 */
export function getA15ExcludedEmployees() {
    return [...EXCLUDED_EMPLOYEES]
}