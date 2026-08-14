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

function timeToMinutes(time) {
    if (!time) {
        return null
    }

    const [hours, minutes] = String(time)
        .split(':')
        .map(Number)

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes)
    ) {
        return null
    }

    return hours * 60 + minutes
}

/**
 * Determina si una hora de ingreso
 * permite realizar Limpieza.
 *
 * Regla:
 *
 * 07:00 - 10:00 → NO candidato
 * 10:30 en adelante → candidato
 *
 * Cualquier horario intermedio que no
 * esté definido explícitamente queda
 * fuera.
 */
export function isValidCleaningStartTime(
    startTime
) {
    const minutes =
        timeToMinutes(startTime)

    if (minutes === null) {
        return false
    }

    /*
     * Desde las 10:30 en adelante
     * puede realizar Limpieza.
     */
    return minutes >= 10 * 60 + 30
}

/**
 * Obtiene los colaboradores candidatos
 * para Limpieza en un día.
 *
 * Reglas:
 *
 * 1. Deben estar trabajando.
 * 2. No deben estar excluidos.
 * 3. Deben ingresar desde las 10:30.
 */
export function getCleaningCandidates(
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

            /*
             * Exclusiones permanentes.
             */
            if (
                EXCLUDED_EMPLOYEES.includes(
                    normalizedName
                )
            ) {
                return false
            }

            const schedule =
                employee.schedule?.[day]

            if (!schedule?.start) {
                return false
            }

            /*
             * Validación de hora
             * de ingreso.
             */
            return isValidCleaningStartTime(
                schedule.start
            )
        }
    )
}

/**
 * Verifica si un colaborador
 * está excluido permanentemente
 * de Limpieza.
 */
export function isExcludedFromCleaning(
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
 * Devuelve la lista de colaboradores
 * excluidos de Limpieza.
 */
export function getCleaningExcludedEmployees() {
    return [...EXCLUDED_EMPLOYEES]
}