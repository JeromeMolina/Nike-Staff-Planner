import {
    getLunchCandidates,
    getCandidatesForLunchTime,
    getLunchTimes,
    getLunchShiftByStartTime,
} from './lunchCandidates'

const MAX_FIRST_SHIFT = 3
const MAX_SECOND_SHIFT_WITH_PENDING = 3
const MAX_SECOND_SHIFT_WITHOUT_PENDING = 2

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
 * Mezcla aleatoriamente un grupo de colaboradores.
 *
 * Se utiliza únicamente cuando existen
 * colaboradores con la misma hora de ingreso
 * y debemos resolver un empate.
 */
function shuffle(array) {
    const result = [...array]

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {
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
 * Ordena colaboradores por hora de entrada.
 *
 * Los que ingresan más temprano tienen
 * mayor prioridad.
 *
 * Cuando dos o más tienen exactamente
 * la misma hora, el orden entre ellos
 * es aleatorio.
 */
function sortByPriority(employees, day) {
    const groups = {}

    employees.forEach((employee) => {
        const start =
            employee.schedule?.[day]?.start

        const minutes =
            timeToMinutes(start)

        const key =
            minutes === null
                ? 'unknown'
                : String(minutes)

        if (!groups[key]) {
            groups[key] = []
        }

        groups[key].push(employee)
    })

    const validGroups = Object.entries(
        groups
    )
        .filter(
            ([key]) =>
                key !== 'unknown'
        )
        .sort(
            ([a], [b]) =>
                Number(a) - Number(b)
        )

    const unknownGroup =
        groups.unknown || []

    const result = []

    validGroups.forEach(
        ([, group]) => {
            result.push(
                ...shuffle(group)
            )
        }
    )

    result.push(
        ...shuffle(unknownGroup)
    )

    return result
}

/**
 * Selecciona colaboradores respetando:
 *
 * 1. Hora de ingreso más temprana.
 * 2. Capacidad máxima.
 * 3. Aleatoriedad únicamente
 *    en casos de empate.
 *
 * Ejemplo:
 *
 * 08:00
 * 09:30
 * 10:00
 * 10:00
 * 10:00
 *
 * Capacidad 3:
 *
 * 08:00 ✓
 * 09:30 ✓
 * 10:00 → uno aleatorio ✓
 */
function selectWithPriority(
    employees,
    day,
    capacity
) {
    if (
        !employees ||
        employees.length === 0
    ) {
        return {
            selected: [],
            pending: [],
        }
    }

    const ordered =
        sortByPriority(
            employees,
            day
        )

    if (
        ordered.length <= capacity
    ) {
        return {
            selected: ordered,
            pending: [],
        }
    }

    const selected = []
    const pending = []

    let index = 0

    while (
        selected.length < capacity &&
        index < ordered.length
    ) {
        const current =
            ordered[index]

        const currentStart =
            current.schedule?.[day]?.start

        const currentMinutes =
            timeToMinutes(
                currentStart
            )

        /*
         * Buscamos todos los colaboradores
         * que tienen exactamente la misma
         * hora de entrada.
         */
        const sameTimeGroup = []

        let groupIndex = index

        while (
            groupIndex <
            ordered.length
        ) {
            const employee =
                ordered[groupIndex]

            const employeeStart =
                employee.schedule?.[
                    day
                ]?.start

            const employeeMinutes =
                timeToMinutes(
                    employeeStart
                )

            if (
                employeeMinutes !==
                currentMinutes
            ) {
                break
            }

            sameTimeGroup.push(
                employee
            )

            groupIndex++
        }

        const availableSlots =
            capacity -
            selected.length

        /*
         * Si todo el grupo cabe,
         * entra completo.
         */
        if (
            sameTimeGroup.length <=
            availableSlots
        ) {
            selected.push(
                ...sameTimeGroup
            )
        } else {
            /*
             * Si no cabe todo el grupo,
             * hacemos sorteo únicamente
             * entre los empatados.
             */
            const randomized =
                shuffle(
                    sameTimeGroup
                )

            selected.push(
                ...randomized.slice(
                    0,
                    availableSlots
                )
            )

            pending.push(
                ...randomized.slice(
                    availableSlots
                )
            )
        }

        index = groupIndex
    }

    /*
     * Todo lo que todavía no haya sido
     * seleccionado queda pendiente.
     */
    while (
        index < ordered.length
    ) {
        pending.push(
            ordered[index]
        )

        index++
    }

    return {
        selected,
        pending,
    }
}

/**
 * Crea una asignación individual.
 */
function createAssignment(
    employee,
    day,
    lunchTime,
    reason
) {
    const schedule =
        employee.schedule?.[day]

    return {
        employeeId: employee.id,
        employeeName: employee.name,
        day,
        start: schedule?.start || null,
        end: schedule?.end || null,
        lunchStart: lunchTime.start,
        lunchEnd: lunchTime.end,
        lunchTimeId: lunchTime.id,
        lunchShift: lunchTime.shift,
        reason,
    }
}

/**
 * MOTOR PRINCIPAL DE ASIGNACIÓN
 *
 * Reglas:
 *
 * TURNO 1
 * Máximo 3.
 *
 * TURNO 2
 * Con pendientes → máximo 3.
 * Sin pendientes → máximo 2.
 *
 * TURNO 3
 * Sin máximo.
 *
 * TURNO 4
 * Sin máximo.
 */
export function generateLunchAssignments(
    employees,
    day
) {
    if (
        !employees ||
        !Array.isArray(employees) ||
        employees.length === 0
    ) {
        return {
            assignments: [],
            pending: [],
            summary: {
                shift1: 0,
                shift2: 0,
                shift3: 0,
                shift4: 0,
            },
        }
    }

    const lunchTimes =
        getLunchTimes()

    /*
     * ========================================
     * OBTENER CANDIDATOS
     * ========================================
     */

    const allCandidates =
        getLunchCandidates(
            employees,
            day
        )

    /*
     * Evita cualquier duplicado.
     */
    const candidateMap =
        new Map()

    allCandidates.forEach(
        (employee) => {
            candidateMap.set(
                employee.id,
                employee
            )
        }
    )

    /*
     * ========================================
     * SEPARAR CANDIDATOS POR TURNO
     * ========================================
     */

    const candidatesByShift = {
        1: [],
        2: [],
        3: [],
        4: [],
    }

    candidateMap.forEach(
        (employee) => {
            const schedule =
                employee.schedule?.[
                    day
                ]

            const shift =
                getLunchShiftByStartTime(
                    schedule?.start
                )

            if (
                shift &&
                candidatesByShift[
                    shift
                ]
            ) {
                candidatesByShift[
                    shift
                ].push(employee)
            }
        }
    )

    /*
     * ========================================
     * RESULTADOS
     * ========================================
     */

    const assignments = []

    let pending = []

    const assignedIds =
        new Set()

    /*
     * ========================================
     * TURNO 1
     * 12:30 - 13:30
     * MÁXIMO 3
     * ========================================
     */

    const firstShift =
        candidatesByShift[1]

    const firstResult =
        selectWithPriority(
            firstShift,
            day,
            MAX_FIRST_SHIFT
        )

    const firstLunchTime =
        lunchTimes.find(
            (time) =>
                time.shift === 1
        )

    firstResult.selected.forEach(
        (employee) => {
            assignments.push(
                createAssignment(
                    employee,
                    day,
                    firstLunchTime,
                    'Prioridad por hora de ingreso'
                )
            )

            assignedIds.add(
                employee.id
            )
        }
    )

    pending = [
        ...firstResult.pending,
    ]

    /*
     * ========================================
     * TURNO 2
     * 13:30 - 14:30
     * ========================================
     */

    const secondShift =
        candidatesByShift[2]

    const secondLunchTime =
        lunchTimes.find(
            (time) =>
                time.shift === 2
        )

    /*
     * Pendientes del turno 1
     * tienen prioridad absoluta.
     */
    const pendingFromFirst =
        pending.filter(
            (employee) =>
                !assignedIds.has(
                    employee.id
                )
        )

    const ownSecondCandidates =
        secondShift.filter(
            (employee) =>
                !assignedIds.has(
                    employee.id
                )
        )

    let secondSelected = []
    let secondPending = []

    if (
        pendingFromFirst.length >
        0
    ) {
        /*
         * Hay pendientes:
         *
         * máximo 3 personas TOTAL.
         */

        const pendingPriority =
            sortByPriority(
                pendingFromFirst,
                day
            )

        const pendingSlots =
            Math.min(
                MAX_SECOND_SHIFT_WITH_PENDING,
                pendingPriority.length
            )

        const selectedPending =
            pendingPriority.slice(
                0,
                pendingSlots
            )

        const remainingSlots =
            MAX_SECOND_SHIFT_WITH_PENDING -
            selectedPending.length

        /*
         * Los pendientes que no
         * alcanzaron siguen avanzando.
         */
        const pendingNotSelected =
            pendingPriority.slice(
                pendingSlots
            )

        secondSelected.push(
            ...selectedPending
        )

        /*
         * Completar los espacios
         * restantes con candidatos
         * propios del turno 2.
         */
        if (
            remainingSlots > 0
        ) {
            const ownResult =
                selectWithPriority(
                    ownSecondCandidates,
                    day,
                    remainingSlots
                )

            secondSelected.push(
                ...ownResult.selected
            )

            secondPending.push(
                ...ownResult.pending
            )
        } else {
            secondPending.push(
                ...ownSecondCandidates
            )
        }

        secondPending.push(
            ...pendingNotSelected
        )
    } else {
        /*
         * NO hay pendientes.
         *
         * En este caso solamente
         * pueden entrar máximo 2
         * candidatos propios.
         */

        const ownResult =
            selectWithPriority(
                ownSecondCandidates,
                day,
                MAX_SECOND_SHIFT_WITHOUT_PENDING
            )

        secondSelected.push(
            ...ownResult.selected
        )

        secondPending.push(
            ...ownResult.pending
        )
    }

    secondSelected.forEach(
        (employee) => {
            assignments.push(
                createAssignment(
                    employee,
                    day,
                    secondLunchTime,
                    pendingFromFirst.includes(
                        employee
                    )
                        ? 'Pendiente del turno anterior'
                        : 'Prioridad por hora de ingreso'
                )
            )

            assignedIds.add(
                employee.id
            )
        }
    )

    /*
     * ========================================
     * PENDIENTES HACIA TURNO 3
     * ========================================
     */

    pending = [
        ...secondPending.filter(
            (employee) =>
                !assignedIds.has(
                    employee.id
                )
        ),
    ]

    /*
     * ========================================
     * TURNO 3
     * 14:30 - 15:30
     * SIN MÁXIMO
     * ========================================
     */

    const thirdShift =
        candidatesByShift[3].filter(
            (employee) =>
                !assignedIds.has(
                    employee.id
                )
        )

    const thirdLunchTime =
        lunchTimes.find(
            (time) =>
                time.shift === 3
        )

    /*
     * Primero van los pendientes.
     */
    const thirdEmployees = [
        ...pending,
        ...thirdShift,
    ]

    thirdEmployees.forEach(
        (employee) => {
            if (
                assignedIds.has(
                    employee.id
                )
            ) {
                return
            }

            const wasPending =
                pending.some(
                    (pendingEmployee) =>
                        pendingEmployee.id ===
                        employee.id
                )

            assignments.push(
                createAssignment(
                    employee,
                    day,
                    thirdLunchTime,
                    wasPending
                        ? 'Pendiente del turno anterior'
                        : 'Asignación directa por turno'
                )
            )

            assignedIds.add(
                employee.id
            )
        }
    )

    /*
     * ========================================
     * TURNO 4
     * 15:30 - 16:30
     * SIN MÁXIMO
     * ========================================
     */

    const fourthShift =
        candidatesByShift[4].filter(
            (employee) =>
                !assignedIds.has(
                    employee.id
                )
        )

    const fourthLunchTime =
        lunchTimes.find(
            (time) =>
                time.shift === 4
        )

    /*
     * Cualquier pendiente restante
     * pasa al cuarto turno.
     */
    const fourthEmployees = [
        ...pending.filter(
            (employee) =>
                !assignedIds.has(
                    employee.id
                )
        ),
        ...fourthShift,
    ]

    fourthEmployees.forEach(
        (employee) => {
            if (
                assignedIds.has(
                    employee.id
                )
            ) {
                return
            }

            const wasPending =
                pending.some(
                    (pendingEmployee) =>
                        pendingEmployee.id ===
                        employee.id
                )

            assignments.push(
                createAssignment(
                    employee,
                    day,
                    fourthLunchTime,
                    wasPending
                        ? 'Pendiente del turno anterior'
                        : 'Asignación directa por turno'
                )
            )

            assignedIds.add(
                employee.id
            )
        }
    )

    /*
     * ========================================
     * PENDIENTES FINALES
     * ========================================
     */

    const finalPending =
        allCandidates.filter(
            (employee) =>
                !assignedIds.has(
                    employee.id
                )
        )

    /*
     * ========================================
     * RESUMEN
     * ========================================
     */

    const summary = {
        shift1: assignments.filter(
            (assignment) =>
                assignment.lunchShift === 1
        ).length,

        shift2: assignments.filter(
            (assignment) =>
                assignment.lunchShift === 2
        ).length,

        shift3: assignments.filter(
            (assignment) =>
                assignment.lunchShift === 3
        ).length,

        shift4: assignments.filter(
            (assignment) =>
                assignment.lunchShift === 4
        ).length,
    }

    return {
        assignments,
        pending: finalPending,
        summary,
    }
}

/**
 * Agrupa las asignaciones por horario
 * para facilitar su visualización.
 */
export function groupAssignmentsByLunchTime(
    assignments
) {
    const groups = {
        1: [],
        2: [],
        3: [],
        4: [],
    }

    assignments.forEach(
        (assignment) => {
            if (
                groups[
                    assignment.lunchShift
                ]
            ) {
                groups[
                    assignment.lunchShift
                ].push(
                    assignment
                )
            }
        }
    )

    return groups
}