import { useEffect, useState } from 'react'

import {
    CalendarDays,
    Sparkles,
    CheckCircle2,
    Utensils,
    ClipboardList,
    MapPin,
} from 'lucide-react'

import {
    generateWeeklyA15Assignments,
} from '../services/a15Assignment'

import {
    generateWeeklyCleaningAssignments,
} from '../services/cleaningAssignment'

import {
    generateWeeklyZoneAssignments,
} from '../services/zoneAssignment'

import {
    generateLunchAssignments,
} from '../services/lunchAssignment'

import ActivityPreview from './ActivityPreview'
import ZonePreview from './ZonePreview'


const DAYS = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' },
]


function PlanningPreview({
    employees,
    generateTrigger,
    onPlanningGenerated,
}) {

    /* =========================================
       ESTADO
    ========================================= */

    const [
        planningGenerated,
        setPlanningGenerated
    ] = useState(false)

    const [
        a15Assignments,
        setA15Assignments
    ] = useState([])

    const [
        cleaningAssignments,
        setCleaningAssignments
    ] = useState([])

    const [
        zoneAssignments,
        setZoneAssignments
    ] = useState({})

    const [
        lunchAssignments,
        setLunchAssignments
    ] = useState({})


    /* =========================================
       LIMPIAR PLANIFICACIÓN
       CUANDO CAMBIA EL HORARIO
    ========================================= */

    useEffect(() => {

        setPlanningGenerated(false)

        setA15Assignments([])

        setCleaningAssignments([])

        setZoneAssignments({})

        setLunchAssignments({})

    }, [employees])


    /* =========================================
       GENERAR PLANIFICACIÓN COMPLETA
    ========================================= */

    const handleGeneratePlanning = () => {

        if (
            !employees ||
            employees.length === 0
        ) {

            console.warn(
                'No existen empleados para generar la planificación.'
            )

            return
        }


        console.log(
            '================================='
        )

        console.log(
            'INICIANDO GENERACIÓN COMPLETA'
        )

        console.log(
            '================================='
        )


        /* =====================================
           A15
        ===================================== */

        const a15Result =
            generateWeeklyA15Assignments(
                employees
            )


        /* =====================================
           LIMPIEZA
        ===================================== */

        const cleaningResult =
            generateWeeklyCleaningAssignments(
                employees,
                a15Result.assignments
            )


        /* =====================================
           ZONAS
        ===================================== */

        const zoneResult =
            generateWeeklyZoneAssignments(
                employees
            )


        /* =====================================
           ALMUERZOS
        ===================================== */

        const weeklyLunchAssignments = {}


        DAYS.forEach((day) => {

            const result =
                generateLunchAssignments(
                    employees,
                    day.id
                )

            weeklyLunchAssignments[
                day.id
            ] = result

        })


        /* =====================================
           RESULTADOS FINALES
        ===================================== */

        const finalA15Assignments =
            a15Result?.assignments || []

        const finalCleaningAssignments =
            cleaningResult?.assignments || []

        const finalZoneAssignments =
            zoneResult?.byDay || {}

        const finalLunchAssignments =
            weeklyLunchAssignments


        /* =====================================
           GUARDAR EN ESTADO LOCAL
        ===================================== */

        setA15Assignments(
            finalA15Assignments
        )

        setCleaningAssignments(
            finalCleaningAssignments
        )

        setZoneAssignments(
            finalZoneAssignments
        )

        setLunchAssignments(
            finalLunchAssignments
        )

        setPlanningGenerated(true)


        /* =====================================
           ENVIAR RESULTADOS A APP.JSX
           
           IMPORTANTE:
           App.jsx necesita estos resultados
           para generar el PDF.
        ===================================== */

        if (onPlanningGenerated) {

            onPlanningGenerated({

                a15Assignments:
                    finalA15Assignments,

                cleaningAssignments:
                    finalCleaningAssignments,

                lunchAssignments:
                    finalLunchAssignments,

                zoneAssignments:
                    finalZoneAssignments,

            })

        }


        /* =====================================
           CONSOLA
        ===================================== */

        console.log(
            'PLANIFICACIÓN COMPLETA GENERADA'
        )

        console.log(
            'A15:',
            finalA15Assignments
        )

        console.log(
            'LIMPIEZA:',
            finalCleaningAssignments
        )

        console.log(
            'ZONAS:',
            finalZoneAssignments
        )

        console.log(
            'ALMUERZOS:',
            finalLunchAssignments
        )

    }


    /* =========================================
       ESCUCHAR BOTÓN SUPERIOR
    ========================================= */

    useEffect(() => {

        if (
            generateTrigger > 0
        ) {

            handleGeneratePlanning()

        }

    }, [generateTrigger])


    /* =========================================
       VALIDACIÓN
    ========================================= */

    if (
        !employees ||
        employees.length === 0
    ) {

        return null

    }


    /* =========================================
       TOTALES
    ========================================= */

    const totalLunchAssignments =
        Object.values(
            lunchAssignments
        ).reduce(
            (
                total,
                day
            ) =>
                total +
                (
                    day?.assignments?.length ||
                    0
                ),
            0
        )


    const totalZoneAssignments =
        Object.values(
            zoneAssignments
        ).reduce(
            (
                total,
                day
            ) =>
                total +
                (
                    day?.assignments?.length ||
                    0
                ),
            0
        )


    /* =========================================
       RENDER
    ========================================= */

    return (

        <section className="planning-preview">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="planning-main-header">

                <div className="planning-main-title">

                    <div className="planning-main-icon">

                        <CalendarDays
                            size={24}
                        />

                    </div>

                    <div>

                        <span className="eyebrow">
                            PLANIFICACIÓN
                        </span>

                        <h2>
                            Planificación semanal
                        </h2>

                        <p>
                            La planificación se genera
                            desde el botón principal
                            ubicado en la parte superior.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================================= */}
            {/* ESTADO INICIAL */}
            {/* ================================= */}

            {!planningGenerated && (

                <div className="planning-empty-state">

                    <div className="planning-empty-icon">

                        <CalendarDays
                            size={30}
                        />

                    </div>

                    <div>

                        <strong>
                            La planificación aún
                            no ha sido generada
                        </strong>

                        <span>
                            Utiliza el botón
                            "Generar planificación"
                            de la parte superior.
                        </span>

                    </div>

                </div>

            )}


            {/* ================================= */}
            {/* RESULTADOS */}
            {/* ================================= */}

            {planningGenerated && (

                <>

                    {/* ================================= */}
                    {/* RESUMEN */}
                    {/* ================================= */}

                    <div className="planning-result-summary">

                        <div className="planning-result-card">

                            <Utensils size={19} />

                            <div>

                                <strong>
                                    {
                                        totalLunchAssignments
                                    }
                                </strong>

                                <span>
                                    Almuerzos asignados
                                </span>

                            </div>

                            <CheckCircle2 size={18} />

                        </div>


                        <div className="planning-result-card">

                            <Sparkles size={19} />

                            <div>

                                <strong>
                                    {
                                        a15Assignments.length
                                    }
                                </strong>

                                <span>
                                    A15 asignados
                                </span>

                            </div>

                            <CheckCircle2 size={18} />

                        </div>


                        <div className="planning-result-card">

                            <ClipboardList size={19} />

                            <div>

                                <strong>
                                    {
                                        cleaningAssignments.length
                                    }
                                </strong>

                                <span>
                                    Limpiezas asignadas
                                </span>

                            </div>

                            <CheckCircle2 size={18} />

                        </div>


                        <div className="planning-result-card">

                            <MapPin size={19} />

                            <div>

                                <strong>
                                    {
                                        totalZoneAssignments
                                    }
                                </strong>

                                <span>
                                    Asignaciones de zonas
                                </span>

                            </div>

                            <CheckCircle2 size={18} />

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* ALMUERZOS */}
                    {/* ================================= */}

                    <section className="planning-section">

                        <div className="planning-section-header">

                            <div className="planning-section-icon lunch-icon">

                                <Utensils
                                    size={21}
                                />

                            </div>

                            <div>

                                <span className="eyebrow">
                                    ALMUERZOS
                                </span>

                                <h3>
                                    Distribución de almuerzos
                                </h3>

                                <p>
                                    Horarios asignados
                                    automáticamente según
                                    prioridad de ingreso.
                                </p>

                            </div>

                        </div>


                        <div className="weekly-lunch-container">

                            {DAYS.map((day) => {

                                const result =
                                    lunchAssignments[
                                        day.id
                                    ]


                                if (!result) {
                                    return null
                                }


                                const assignments =
                                    result.assignments || []


                                const times = [

                                    {
                                        shift: 1,
                                        start: '12:30',
                                        end: '13:30',
                                    },

                                    {
                                        shift: 2,
                                        start: '13:30',
                                        end: '14:30',
                                    },

                                    {
                                        shift: 3,
                                        start: '14:30',
                                        end: '15:30',
                                    },

                                    {
                                        shift: 4,
                                        start: '15:30',
                                        end: '16:30',
                                    },

                                ]


                                return (

                                    <div
                                        className="weekly-lunch-day"
                                        key={day.id}
                                    >

                                        <div className="weekly-day-header">

                                            <div>

                                                <span>
                                                    DÍA
                                                </span>

                                                <strong>
                                                    {day.name}
                                                </strong>

                                            </div>

                                            <span className="day-total-badge">

                                                {
                                                    assignments.length
                                                } personas

                                            </span>

                                        </div>


                                        <div className="lunch-time-grid">

                                            {times.map(
                                                (time) => {

                                                    const people =
                                                        assignments.filter(
                                                            (
                                                                assignment
                                                            ) =>
                                                                assignment.lunchShift ===
                                                                time.shift
                                                        )


                                                    return (

                                                        <div
                                                            className="lunch-time-card"
                                                            key={
                                                                time.shift
                                                            }
                                                        >

                                                            <div className="lunch-time-card-header">

                                                                <div className="lunch-time-main">

                                                                    <div className="lunch-time-icon">

                                                                        <Utensils
                                                                            size={16}
                                                                        />

                                                                    </div>

                                                                    <div>

                                                                        <strong>
                                                                            {
                                                                                time.start
                                                                            }
                                                                        </strong>

                                                                        <span>
                                                                            {
                                                                                time.start
                                                                            }
                                                                            {' '}
                                                                            —
                                                                            {' '}
                                                                            {
                                                                                time.end
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                </div>


                                                                <span className="lunch-people-count">

                                                                    {
                                                                        people.length
                                                                    }

                                                                </span>

                                                            </div>


                                                            <div className="lunch-people-list">

                                                                {people.length ===
                                                                    0 ? (

                                                                    <div className="lunch-no-assignment">

                                                                        Sin asignación

                                                                    </div>

                                                                ) : (

                                                                    people.map(
                                                                        (
                                                                            person
                                                                        ) => (

                                                                            <div
                                                                                className="lunch-person-card"
                                                                                key={
                                                                                    person.employeeId
                                                                                }
                                                                            >

                                                                                <div className="lunch-person-number">
                                                                                    #
                                                                                </div>

                                                                                <div>

                                                                                    <strong>
                                                                                        {
                                                                                            person.employeeName
                                                                                        }
                                                                                    </strong>

                                                                                    <span>
                                                                                        Entrada:
                                                                                        {' '}
                                                                                        {
                                                                                            person.start
                                                                                        }
                                                                                    </span>

                                                                                </div>

                                                                            </div>

                                                                        )
                                                                    )

                                                                )}

                                                            </div>

                                                        </div>

                                                    )

                                                }
                                            )}

                                        </div>

                                    </div>

                                )

                            })}

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* ACTIVIDADES */}
                    {/* ================================= */}

                    <section className="planning-section">

                        <div className="planning-section-header">

                            <div className="planning-section-icon activity-icon">

                                <Sparkles
                                    size={21}
                                />

                            </div>

                            <div>

                                <span className="eyebrow">
                                    ACTIVIDADES
                                </span>

                                <h3>
                                    A15 y Limpieza
                                </h3>

                                <p>
                                    Distribución diaria
                                    de las actividades
                                    del equipo.
                                </p>

                            </div>

                        </div>


                        <ActivityPreview
                            a15Assignments={
                                a15Assignments
                            }

                            cleaningAssignments={
                                cleaningAssignments
                            }
                        />

                    </section>


                    {/* ================================= */}
                    {/* ZONAS */}
                    {/* ================================= */}

                    <section className="planning-section">

                        <div className="planning-section-header">

                            <div className="planning-section-icon zone-icon">

                                <MapPin
                                    size={21}
                                />

                            </div>

                            <div>

                                <span className="eyebrow">
                                    PISO DE VENTAS
                                </span>

                                <h3>
                                    Distribución de zonas
                                </h3>

                                <p>
                                    Asignación del personal
                                    a las diferentes
                                    ubicaciones de la tienda.
                                </p>

                            </div>

                        </div>


                        <ZonePreview
                            zoneAssignments={
                                zoneAssignments
                            }
                        />

                    </section>

                </>

            )}

        </section>

    )

}


export default PlanningPreview