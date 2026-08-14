import { getWorkingEmployees } from './availability'

const LUNCH_TIMES = [
    {
        id: '12:30',
        shift: 1,
        start: '12:30',
        end: '13:30',
    },
    {
        id: '13:30',
        shift: 2,
        start: '13:30',
        end: '14:30',
    },
    {
        id: '14:30',
        shift: 3,
        start: '14:30',
        end: '15:30',
    },
    {
        id: '15:30',
        shift: 4,
        start: '15:30',
        end: '16:30',
    },
]

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
 * Determina el turno de almuerzo según
 * la hora de entrada del colaborador.
 *
 * Reglas:
 *
 * 07:00 - 10:30 → Turno 1 → 12:30
 * 11:00 - 12:30 → Turno 2 → 13:30
 * 13:00 - 13:30 → Turno 3 → 14:30
 * 14:00 en adelante → Turno 4 → 15:30
 *
 * Si la hora no pertenece a ninguno de estos
 * rangos, devuelve null.
 */
export function getLunchShiftByStartTime(startTime) {
    const minutes = timeToMinutes(startTime)

    if (minutes === null) {
        return null
    }

    // 07:00 - 10:30
    if (
        minutes >= 7 * 60 &&
        minutes <= 10 * 60 + 30
    ) {
        return 1
    }

    // 11:00 - 12:30
    if (
        minutes >= 11 * 60 &&
        minutes <= 12 * 60 + 30
    ) {
        return 2
    }

    // 13:00 - 13:30
    if (
        minutes >= 13 * 60 &&
        minutes <= 13 * 60 + 30
    ) {
        return 3
    }

    // 14:00 en adelante
    if (minutes >= 14 * 60) {
        return 4
    }

    return null
}

/**
 * Obtiene todos los colaboradores que:
 *
 * 1. Trabajan el día seleccionado.
 * 2. No están excluidos.
 * 3. Tienen una hora de entrada válida
 *    para alguno de los turnos de almuerzo.
 */
export function getLunchCandidates(
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
                normalizeName(employee.name)

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

            const lunchShift =
                getLunchShiftByStartTime(
                    schedule.start
                )

            return lunchShift !== null
        }
    )
}

/**
 * Obtiene únicamente los candidatos
 * pertenecientes a un turno específico.
 *
 * Ejemplo:
 *
 * shift = 1
 * → personas que ingresan 07:00 - 10:30
 *
 * shift = 2
 * → personas que ingresan 11:00 - 12:30
 */
export function getCandidatesForShift(
    employees,
    day,
    shift
) {
    const candidates =
        getLunchCandidates(
            employees,
            day
        )

    return candidates.filter(
        (employee) => {
            const schedule =
                employee.schedule?.[day]

            const employeeShift =
                getLunchShiftByStartTime(
                    schedule?.start
                )

            return employeeShift === shift
        }
    )
}

/**
 * Obtiene los candidatos correspondientes
 * a un horario específico de almuerzo.
 *
 * 12:30 → turno 1
 * 13:30 → turno 2
 * 14:30 → turno 3
 * 15:30 → turno 4
 */
export function getCandidatesForLunchTime(
    employees,
    day,
    lunchTime
) {
    if (!lunchTime) {
        return []
    }

    const shift = lunchTime.shift

    return getCandidatesForShift(
        employees,
        day,
        shift
    )
}

/**
 * Devuelve los cuatro horarios
 * disponibles para almuerzo.
 */
export function getLunchTimes() {
    return LUNCH_TIMES
}