import { getWorkingEmployees } from './availability'

const EXCLUDED_FROM_ZONES = [
    'BELEN ANCHATUÑA',
    'ISMAEL MOLINA',
    'MICHAEL CUSME',
    'ALEX AMAGUA',
    'FRANCISCO CORDOVA',
    'MIGUEL BENALCAZAR',
]

const ZONE_DEFINITIONS = [
    {
        id: 'zone1',
        name: 'Zona 1',
        locations: [
            'M-Urb',
            'Jordan',
            'Futbol',
        ],
    },
    {
        id: 'zone2',
        name: 'Zona 2',
        locations: [
            'M-Trainn',
            'M-Shoes',
            'M-Runn',
            'Campaña',
        ],
    },
    {
        id: 'zone3',
        name: 'Zona 3',
        locations: [
            'W-Runn',
            'W-Trainn (frente a W-Shoes)',
            'W-Shoes',
        ],
    },
    {
        id: 'zone4',
        name: 'Zona 4',
        locations: [
            'W-Trainn (junto a W-Urb)',
            'W-Urb',
        ],
    },
    {
        id: 'accessories',
        name: 'Acc/Espejos',
        locations: [
            'M-Acc',
            'W-Acc',
            'Panel-Acc',
            'Espejos',
        ],
    },
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

const MAX_PEOPLE_PER_ZONE = 2

const EARLY_START_MINUTES = 10 * 60
const LATE_START_MINUTES = 10 * 60 + 30

function normalizeName(name) {
    return String(name || '')
        .trim()
        .toUpperCase()
}

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

function isExcludedFromZones(employee) {
    return EXCLUDED_FROM_ZONES.includes(
        normalizeName(employee.name)
    )
}

function isKatherin(employee) {
    return (
        normalizeName(employee.name) ===
        'KATHERIN RODRIGUEZ'
    )
}

function isAccessoriesBackupCandidate(employee) {
    const name =
        normalizeName(employee.name)

    return [
        'ALEX AMAGUA',
        'FRANCISCO CORDOVA',
        'MIGUEL BENALCAZAR',
    ].includes(name)
}

function isEarlyEmployee(employee, day) {
    const start =
        employee.schedule?.[day]?.start

    const minutes =
        timeToMinutes(start)

    if (minutes === null) {
        return false
    }

    return (
        minutes >= 7 * 60 &&
        minutes <= EARLY_START_MINUTES
    )
}

function isLateEmployee(employee, day) {
    const start =
        employee.schedule?.[day]?.start

    const minutes =
        timeToMinutes(start)

    if (minutes === null) {
        return false
    }

    return minutes >= LATE_START_MINUTES
}

/**
 * Obtiene todos los colaboradores
 * que trabajan ese día y pueden
 * participar en las zonas.
 */
export function getZoneWorkingCandidates(
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
        (employee) =>
            !isExcludedFromZones(
                employee
            )
    )
}

/**
 * Candidatos prioritarios para
 * Zonas 2 y 3.
 *
 * Personas que ingresan entre
 * 07:00 y 10:00.
 */
export function getPriorityZoneCandidates(
    employees,
    day
) {
    const candidates =
        getZoneWorkingCandidates(
            employees,
            day
        )

    return candidates.filter(
        (employee) =>
            isEarlyEmployee(
                employee,
                day
            )
    )
}

/**
 * Candidatos normales para
 * Zonas 1 y 4.
 *
 * Ingreso desde las 10:30.
 *
 * Katherin queda fuera porque
 * tiene prioridad para Acc/Espejos.
 */
export function getStandardZoneCandidates(
    employees,
    day
) {
    const candidates =
        getZoneWorkingCandidates(
            employees,
            day
        )

    return candidates.filter(
        (employee) =>
            !isKatherin(employee) &&
            isLateEmployee(
                employee,
                day
            )
    )
}

/**
 * Candidatos para Acc/Espejos.
 *
 * Katherin tiene prioridad absoluta.
 *
 * Si Katherin no trabaja:
 * Alex / Francisco / Miguel.
 */
export function getAccessoriesCandidates(
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

    const katherin =
        workingEmployees.find(
            (employee) =>
                isKatherin(employee)
        )

    if (katherin) {
        return [katherin]
    }

    return workingEmployees.filter(
        (employee) =>
            isAccessoriesBackupCandidate(
                employee
            )
    )
}

/**
 * Crea una asignación de zona.
 */
function createZoneAssignment(
    employee,
    day,
    zone,
    reason
) {
    const schedule =
        employee.schedule?.[day]

    return {
        employeeId: employee.id,
        employeeName: employee.name,
        day,

        zoneId: zone.id,
        zoneName: zone.name,

        locations: [
            ...zone.locations,
        ],

        start:
            schedule?.start || null,

        end:
            schedule?.end || null,

        reason,
    }
}

/**
 * Asigna Acc/Espejos.
 */
function assignAccessories(
    employees,
    day,
    previousAssignments = []
) {
    const candidates =
        getAccessoriesCandidates(
            employees,
            day
        )

    if (candidates.length === 0) {
        return null
    }

    /*
     * Katherin tiene prioridad absoluta.
     */
    const katherin =
        candidates.find(
            (employee) =>
                isKatherin(employee)
        )

    if (katherin) {
        const zone =
            ZONE_DEFINITIONS.find(
                (item) =>
                    item.id ===
                    'accessories'
            )

        return createZoneAssignment(
            katherin,
            day,
            zone,
            'Candidata principal para Acc/Espejos'
        )
    }

    /*
     * Si Katherin está libre,
     * se utiliza uno de los candidatos
     * alternativos.
     */
    const previousBackupIds =
        new Set(
            previousAssignments
                .filter(
                    (assignment) =>
                        assignment.zoneId ===
                        'accessories'
                )
                .map(
                    (assignment) =>
                        assignment.employeeId
                )
        )

    const neverUsed =
        candidates.filter(
            (employee) =>
                !previousBackupIds.has(
                    employee.id
                )
        )

    const pool =
        neverUsed.length > 0
            ? neverUsed
            : candidates

    const selected =
        shuffle(pool)[0]

    const zone =
        ZONE_DEFINITIONS.find(
            (item) =>
                item.id ===
                'accessories'
        )

    return createZoneAssignment(
        selected,
        day,
        zone,
        'Candidata alternativa por descanso de Katherin'
    )
}

/**
 * Agrega una persona a una zona.
 */
function addAssignment(
    assignments,
    assignedIds,
    employee,
    day,
    zone,
    reason
) {
    if (!employee || !zone) {
        return
    }

    assignments.push(
        createZoneAssignment(
            employee,
            day,
            zone,
            reason
        )
    )

    assignedIds.add(
        employee.id
    )
}

/**
 * Obtiene una persona disponible
 * para repetir en caso excepcional.
 *
 * Se utiliza únicamente cuando
 * existen menos de 4 candidatos
 * para cubrir las cuatro zonas.
 */
function selectRepeatEmployee(
    candidates,
    zoneAssignments
) {
    if (
        !Array.isArray(candidates) ||
        candidates.length === 0
    ) {
        return null
    }

    /*
     * Contamos cuántas veces ha sido
     * utilizada cada persona.
     *
     * Elegimos primero a quien tenga
     * menos asignaciones.
     */
    const usage = new Map()

    candidates.forEach(
        (employee) => {
            usage.set(
                employee.id,
                0
            )
        }
    )

    zoneAssignments.forEach(
        (assignment) => {
            if (
                usage.has(
                    assignment.employeeId
                )
            ) {
                usage.set(
                    assignment.employeeId,
                    usage.get(
                        assignment.employeeId
                    ) + 1
                )
            }
        }
    )

    const minimumUsage =
        Math.min(
            ...usage.values()
        )

    const leastUsed =
        candidates.filter(
            (employee) =>
                usage.get(
                    employee.id
                ) === minimumUsage
        )

    return shuffle(
        leastUsed
    )[0] || null
}

/**
 * Genera las zonas de un día.
 */
export function generateZoneAssignments(
    employees,
    day,
    previousAssignments = []
) {
    if (
        !Array.isArray(employees) ||
        employees.length === 0
    ) {
        return {
            assignments: [],
            zones: {},
        }
    }

    const assignments = []

    /*
     * assignedIds se utiliza para evitar
     * repetir personas cuando existen
     * suficientes colaboradores.
     */
    const assignedIds = new Set()

    /*
     * ========================================
     * ACC / ESPEJOS
     * ========================================
     */

    const accessoriesAssignment =
        assignAccessories(
            employees,
            day,
            previousAssignments
        )

    if (accessoriesAssignment) {
        assignments.push(
            accessoriesAssignment
        )

        /*
         * Acc/Espejos no participa
         * en las cuatro zonas principales.
         */
        assignedIds.add(
            accessoriesAssignment.employeeId
        )
    }

    /*
     * ========================================
     * CANDIDATOS PARA LAS 4 ZONAS
     * ========================================
     */

    const allZoneCandidates =
        getZoneWorkingCandidates(
            employees,
            day
        )

    /*
     * Quitamos a Katherin si trabaja,
     * porque ya está destinada a Acc/Espejos.
     */
    const candidatesForMainZones =
        allZoneCandidates.filter(
            (employee) =>
                !isKatherin(employee)
        )

    /*
     * ========================================
     * CASO EXCEPCIONAL
     * MENOS DE 4 COLABORADORES
     * ========================================
     *
     * Si hay menos de cuatro personas
     * disponibles para las zonas principales,
     * permitimos repetir.
     */
    const exceptionalRepeatMode =
        candidatesForMainZones.length < 4

    /*
     * ========================================
     * ZONAS 2 Y 3
     * ========================================
     */

    const priorityCandidates =
        getPriorityZoneCandidates(
            employees,
            day
        ).filter(
            (employee) =>
                !isKatherin(employee)
        )

    let availablePriority =
        priorityCandidates.filter(
            (employee) =>
                !assignedIds.has(
                    employee.id
                )
        )

    const zone2 =
        ZONE_DEFINITIONS.find(
            (zone) =>
                zone.id === 'zone2'
        )

    const zone3 =
        ZONE_DEFINITIONS.find(
            (zone) =>
                zone.id === 'zone3'
        )

    /*
     * Si solamente existe un candidato
     * prioritario, puede cubrir ambas
     * zonas.
     */
    if (
        availablePriority.length === 1
    ) {
        const employee =
            availablePriority[0]

        addAssignment(
            assignments,
            assignedIds,
            employee,
            day,
            zone2,
            'Único candidato para zonas prioritarias'
        )

        /*
         * En modo normal una persona
         * puede cubrir ambas cuando
         * no existe otra alternativa.
         */
        addAssignment(
            assignments,
            assignedIds,
            employee,
            day,
            zone3,
            'Único candidato para zonas prioritarias'
        )
    } else {
        availablePriority =
            shuffle(
                availablePriority
            )

        const selectedPriority =
            availablePriority.slice(
                0,
                2
            )

        if (
            selectedPriority[0]
        ) {
            addAssignment(
                assignments,
                assignedIds,
                selectedPriority[0],
                day,
                zone2,
                'Prioridad por horario de ingreso'
            )
        }

        if (
            selectedPriority[1]
        ) {
            addAssignment(
                assignments,
                assignedIds,
                selectedPriority[1],
                day,
                zone3,
                'Prioridad por horario de ingreso'
            )
        }
    }

    /*
     * ========================================
     * ZONAS 1 Y 4
     * ========================================
     */

    const standardCandidates =
        getStandardZoneCandidates(
            employees,
            day
        ).filter(
            (employee) =>
                !isKatherin(employee)
        )

    const availableStandard =
        standardCandidates.filter(
            (employee) =>
                !assignedIds.has(
                    employee.id
                )
        )

    const zone1 =
        ZONE_DEFINITIONS.find(
            (zone) =>
                zone.id === 'zone1'
        )

    const zone4 =
        ZONE_DEFINITIONS.find(
            (zone) =>
                zone.id === 'zone4'
        )

    const shuffledStandard =
        shuffle(
            availableStandard
        )

    /*
     * Zona 1.
     */
    if (
        shuffledStandard[0]
    ) {
        addAssignment(
            assignments,
            assignedIds,
            shuffledStandard[0],
            day,
            zone1,
            'Selección entre candidatos disponibles'
        )
    }

    /*
     * Zona 4.
     */
    if (
        shuffledStandard[1]
    ) {
        addAssignment(
            assignments,
            assignedIds,
            shuffledStandard[1],
            day,
            zone4,
            'Selección entre candidatos disponibles'
        )
    }

    /*
     * ========================================
     * COMPLETAR ZONAS VACÍAS
     * ========================================
     *
     * Aquí aplicamos la nueva regla:
     *
     * Ninguna de las zonas 1-4 puede
     * quedarse con cero personas.
     */

    const mainZoneIds = [
        'zone1',
        'zone2',
        'zone3',
        'zone4',
    ]

    /*
     * Revisamos cuántas personas tiene
     * actualmente cada zona.
     */
    const getZoneCount = (zoneId) =>
        assignments.filter(
            (assignment) =>
                assignment.zoneId ===
                zoneId
        ).length

    /*
     * ========================================
     * MODO NORMAL
     * ========================================
     *
     * Si tenemos suficientes personas,
     * buscamos cubrir zonas vacías
     * sin repetir.
     */

    for (
        const zoneId of mainZoneIds
    ) {
        if (
            getZoneCount(zoneId) > 0
        ) {
            continue
        }

        const zone =
            ZONE_DEFINITIONS.find(
                (item) =>
                    item.id ===
                    zoneId
            )

        /*
         * Primero buscamos personas
         * que todavía no tengan zona.
         */
        const available =
            candidatesForMainZones.filter(
                (employee) =>
                    !assignedIds.has(
                        employee.id
                    )
            )

        if (
            available.length > 0
        ) {
            const selected =
                shuffle(
                    available
                )[0]

            addAssignment(
                assignments,
                assignedIds,
                selected,
                day,
                zone,
                'Cobertura mínima de zona'
            )

            continue
        }

        /*
         * ====================================
         * EXCEPCIÓN
         * ====================================
         *
         * Si hay menos de cuatro personas,
         * permitimos repetir.
         */
        if (
            exceptionalRepeatMode
        ) {
            const selected =
                selectRepeatEmployee(
                    candidatesForMainZones,
                    assignments.filter(
                        (assignment) =>
                            mainZoneIds.includes(
                                assignment.zoneId
                            )
                    )
                )

            if (selected) {
                assignments.push(
                    createZoneAssignment(
                        selected,
                        day,
                        zone,
                        'Repetición excepcional para cubrir zona'
                    )
                )
            }
        }
    }

    /*
     * ========================================
     * EXCESO DE CANDIDATOS
     * ========================================
     *
     * Si todavía existen personas sin
     * asignación, podemos llenar zonas
     * hasta máximo 2.
     */

    const remainingEmployees =
        candidatesForMainZones.filter(
            (employee) =>
                !assignedIds.has(
                    employee.id
                )
        )

    const overflow =
        shuffle(
            remainingEmployees
        )

    for (
        const employee of overflow
    ) {
        /*
         * Buscar primero una zona con
         * menos de 2 personas.
         */
        const zoneWithCapacity =
            mainZoneIds.find(
                (zoneId) =>
                    getZoneCount(
                        zoneId
                    ) <
                    MAX_PEOPLE_PER_ZONE
            )

        if (
            !zoneWithCapacity
        ) {
            break
        }

        const zone =
            ZONE_DEFINITIONS.find(
                (item) =>
                    item.id ===
                    zoneWithCapacity
            )

        addAssignment(
            assignments,
            assignedIds,
            employee,
            day,
            zone,
            'Asignación por disponibilidad'
        )
    }

    /*
     * ========================================
     * SEGUNDA VERIFICACIÓN
     * ========================================
     *
     * Por seguridad volvemos a comprobar
     * que ninguna zona quede vacía.
     */
    for (
        const zoneId of mainZoneIds
    ) {
        if (
            getZoneCount(zoneId) !== 0
        ) {
            continue
        }

        const zone =
            ZONE_DEFINITIONS.find(
                (item) =>
                    item.id ===
                    zoneId
            )

        const selected =
            selectRepeatEmployee(
                candidatesForMainZones,
                assignments.filter(
                    (assignment) =>
                        mainZoneIds.includes(
                            assignment.zoneId
                        )
                )
            )

        if (selected) {
            assignments.push(
                createZoneAssignment(
                    selected,
                    day,
                    zone,
                    'Repetición excepcional para garantizar cobertura mínima'
                )
            )
        }
    }

    /*
     * ========================================
     * RESULTADO AGRUPADO
     * ========================================
     */

    const zones = {
        zone1: assignments.filter(
            (assignment) =>
                assignment.zoneId ===
                'zone1'
        ),

        zone2: assignments.filter(
            (assignment) =>
                assignment.zoneId ===
                'zone2'
        ),

        zone3: assignments.filter(
            (assignment) =>
                assignment.zoneId ===
                'zone3'
        ),

        zone4: assignments.filter(
            (assignment) =>
                assignment.zoneId ===
                'zone4'
        ),

        accessories:
            assignments.filter(
                (assignment) =>
                    assignment.zoneId ===
                    'accessories'
            ),
    }

    return {
        assignments,
        zones,
    }
}

/**
 * Genera las zonas de toda la semana.
 */
export function generateWeeklyZoneAssignments(
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

    DAYS.forEach(
        (day) => {
            const result =
                generateZoneAssignments(
                    employees,
                    day,
                    assignments
                )

            byDay[day] =
                result

            assignments.push(
                ...result.assignments
            )
        }
    )

    return {
        assignments,
        byDay,
    }
}

/**
 * Devuelve la definición
 * de las zonas.
 */
export function getZoneDefinitions() {
    return ZONE_DEFINITIONS
}

export { DAYS }