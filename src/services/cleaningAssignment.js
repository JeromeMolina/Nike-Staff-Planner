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
 * Convierte una hora HH:MM
 * a minutos.
 */
function timeToMinutes(time) {
    if (!time) {
        return null
    }

    const [hours, minutes] =
        String(time)
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
 * Mezcla aleatoriamente un arreglo.
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
 * Determina si un colaborador está excluido.
 */
function isExcluded(employee) {
    return EXCLUDED_EMPLOYEES.includes(
        normalizeName(employee.name)
    )
}

/**
 * Determina si la hora de ingreso
 * permite realizar limpieza.
 *
 * Regla:
 *
 * 07:00 - 10:00 → NO puede
 * 10:30 en adelante → SÍ puede
 */
function isEligibleStartTime(startTime) {
    const minutes =
        timeToMinutes(startTime)

    if (minutes === null) {
        return false
    }

    return minutes >= 10 * 60 + 30
}

/**
 * Obtiene candidatos de limpieza.
 *
 * Reglas:
 *
 * 1. Debe trabajar ese día.
 * 2. No puede ser Belen, Ismael o Michael.
 * 3. Debe ingresar desde las 10:30.
 */
export function getCleaningCandidates(
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

            if (!schedule?.start) {
                return false
            }

            return isEligibleStartTime(
                schedule.start
            )
        }
    )
}

/**
 * Selecciona una persona para limpieza.
 *
 * Se intenta evitar a las personas que
 * ya realizaron limpieza anteriormente
 * durante la semana.
 *
 * Si todos ya realizaron limpieza,
 * se permite repetir.
 */
export function selectCleaningEmployee(
    candidates,
    previousAssignments = [],
    excludedIds = []
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

    const available =
        candidates.filter(
            (employee) =>
                !excludedIds.includes(
                    employee.id
                )
        )

    if (available.length === 0) {
        return null
    }

    const neverSelected =
        available.filter(
            (employee) =>
                !previousIds.has(
                    employee.id
                )
        )

    const pool =
        neverSelected.length > 0
            ? neverSelected
            : available

    const randomized =
        shuffle(pool)

    return randomized[0] || null
}

/**
 * Crea una asignación de limpieza.
 */
export function createCleaningAssignment(
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
        activity: 'LIMPIEZA',
        reason,
    }
}

/**
 * Genera la limpieza de un día.
 *
 * excludedIds permite evitar que la persona
 * seleccionada para A15 sea seleccionada
 * también para limpieza ese mismo día.
 */
export function generateCleaningAssignment(
    employees,
    day,
    previousAssignments = [],
    excludedIds = []
) {
    const candidates =
        getCleaningCandidates(
            employees,
            day
        )

    const selected =
        selectCleaningEmployee(
            candidates,
            previousAssignments,
            excludedIds
        )

    if (!selected) {
        return {
            assignment: null,
            candidates,
        }
    }

    return {
        assignment:
            createCleaningAssignment(
                selected,
                day
            ),
        candidates,
    }
}

/**
 * Genera limpieza para toda la semana.
 *
 * La función recibe opcionalmente las
 * asignaciones de A15 para garantizar
 * que una misma persona no haga ambas
 * actividades el mismo día.
 */
export function generateWeeklyCleaningAssignments(
    employees,
    a15Assignments = []
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
        /*
         * Buscar quién hizo A15 ese día.
         */
        const a15Assignment =
            a15Assignments.find(
                (assignment) =>
                    assignment.day === day
            )

        const excludedIds =
            a15Assignment
                ? [a15Assignment.employeeId]
                : []

        const result =
            generateCleaningAssignment(
                employees,
                day,
                assignments,
                excludedIds
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