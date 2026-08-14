import { getWorkingEmployees } from './availability'

const EXCLUDED_EMPLOYEES = [
    'BELEN ANCHATUÑA',
    'ISMAEL MOLINA',
    'MICHAEL CUSME',
]

const DAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
]

function normalizeName(name) {
    return String(name || '')
        .trim()
        .toUpperCase()
}

/**
 * Mezcla aleatoriamente un arreglo.
 *
 * Se utiliza cuando no existe una prioridad
 * determinada entre candidatos.
 */
function shuffle(array) {
    const result = [...array]

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(
            Math.random() * (i + 1)
        )

        ;[result[i], result[j]] = [
            result[j],
            result[i],
        ]
    }

    return result
}

/**
 * Verifica si un colaborador está excluido
 * del A15.
 */
function isExcluded(employee) {
    return EXCLUDED_EMPLOYEES.includes(
        normalizeName(employee.name)
    )
}

/**
 * Obtiene candidatos de A15 para un día.
 *
 * Reglas:
 *
 * - Debe trabajar ese día.
 * - No puede ser Belen, Ismael o Michael.
 * - No existe prioridad por hora.
 */
export function getA15Candidates(
    employees,
    day
) {
    if (
        !Array.isArray(employees) ||
        employees.length === 0
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
            if (isExcluded(employee)) {
                return false
            }

            const schedule =
                employee.schedule?.[day]

            return Boolean(schedule)
        }
    )
}

/**
 * Selecciona una persona para A15.
 *
 * Se intenta evitar personas que ya hayan
 * realizado A15 anteriormente durante
 * la semana.
 *
 * Si todavía existen candidatos que nunca
 * han realizado A15, se selecciona uno
 * únicamente entre ellos.
 *
 * Si todos ya realizaron A15,
 * se vuelve a utilizar alguno de ellos
 * aleatoriamente.
 */
export function selectA15Employee(
    candidates,
    previousAssignments = []
) {
    if (
        !Array.isArray(candidates) ||
        candidates.length === 0
    ) {
        return null
    }

    const previousIds = new Set(
        previousAssignments.map(
            (assignment) =>
                assignment.employeeId
        )
    )

    const neverSelected =
        candidates.filter(
            (employee) =>
                !previousIds.has(
                    employee.id
                )
        )

    const pool =
        neverSelected.length > 0
            ? neverSelected
            : candidates

    const randomized = shuffle(pool)

    return randomized[0] || null
}

/**
 * Crea una asignación A15.
 */
export function createA15Assignment(
    employee,
    day,
    reason = 'Selección aleatoria'
) {
    if (!employee) {
        return null
    }

    const schedule =
        employee.schedule?.[day]

    return {
        employeeId: employee.id,
        employeeName: employee.name,
        day,
        start: schedule?.start || null,
        end: schedule?.end || null,
        activity: 'A15',
        reason,
    }
}

/**
 * Genera A15 para un día específico.
 */
export function generateA15Assignment(
    employees,
    day,
    previousAssignments = [],
    excludedIds = []
) {
    const candidates =
        getA15Candidates(
            employees,
            day
        )

    const availableCandidates =
        candidates.filter(
            (employee) =>
                !excludedIds.includes(
                    employee.id
                )
        )

    const selected =
        selectA15Employee(
            availableCandidates,
            previousAssignments
        )

    if (!selected) {
        return {
            assignment: null,
            candidates,
        }
    }

    return {
        assignment:
            createA15Assignment(
                selected,
                day
            ),
        candidates,
    }
}

/**
 * Genera A15 para toda la semana.
 *
 * Se procesa día por día para intentar
 * distribuir la actividad entre diferentes
 * colaboradores.
 */
export function generateWeeklyA15Assignments(
    employees
) {
    if (
        !Array.isArray(employees) ||
        employees.length === 0
    ) {
        return {
            assignments: [],
            byDay: {},
        }
    }

    const assignments = []
    const byDay = {}

    DAYS.forEach((day) => {
        const result =
            generateA15Assignment(
                employees,
                day,
                assignments
            )

        if (result.assignment) {
            assignments.push(
                result.assignment
            )

            byDay[day] =
                result.assignment
        } else {
            byDay[day] = null
        }
    })

    return {
        assignments,
        byDay,
    }
}

export { DAYS }