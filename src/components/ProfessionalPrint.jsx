import React from 'react'

const DAYS = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' },
]

const TIMES = [
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

function ProfessionalPrint({
    a15Assignments = [],
    cleaningAssignments = [],
    lunchAssignments = {},
    zoneAssignments = {},
}) {

    /* =========================================
       UTILIDADES
    ========================================= */

    const getAssignmentName = (assignment) => {

        return (
            assignment?.employeeName ||
            assignment?.name ||
            assignment?.employee ||
            assignment?.employeeId ||
            'Sin asignación'
        )
    }


    const getDayAssignments = (
        assignments,
        dayId
    ) => {

        if (!Array.isArray(assignments)) {
            return []
        }

        return assignments.filter(
            assignment =>
                assignment?.day === dayId ||
                assignment?.dayId === dayId ||
                assignment?.dayOfWeek === dayId
        )
    }


    /* =========================================
       PÁGINA 1
       A15 + LIMPIEZA
    ========================================= */

    const getActivityForDay = (
        assignments,
        dayId
    ) => {

        const result =
            getDayAssignments(
                assignments,
                dayId
            )

        return result
            .map(getAssignmentName)
            .join(', ') || '—'
    }


    /* =========================================
       ZONAS
    ========================================= */

    const getZoneDay = (dayId) => {

        const result =
            zoneAssignments?.[dayId]

        return result?.assignments || []
    }


    return (

        <div className="professional-print">

            {/* =====================================================
                PÁGINA 1
            ===================================================== */}

            <section className="print-page print-page-1">

                <header className="print-header">

                    <div className="print-brand">

                        <div className="print-nike">
                            NIKE
                        </div>

                        <div className="print-brand-divider" />

                        <div>
                            <h1>
                                STAFF PLANNER
                            </h1>

                            <span>
                                Quicentro
                            </span>
                        </div>

                    </div>

                    <div className="print-document-info">

                        <strong>
                            PLANIFICACIÓN SEMANAL
                        </strong>

                        <span>
                            A15 / LIMPIEZA
                        </span>

                    </div>

                </header>


                <div className="print-title-block">

                    <span>
                        ACTIVIDADES DEL EQUIPO
                    </span>

                    <h2>
                        A15 y Limpieza
                    </h2>

                    <p>
                        Distribución semanal de actividades
                        operativas.
                    </p>

                </div>


                <div className="print-table-container">

                    <table className="print-table activities-table">

                        <thead>

                            <tr>

                                <th>
                                    DÍA
                                </th>

                                <th>
                                    A15
                                </th>

                                <th>
                                    LIMPIEZA
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {DAYS.map(day => (

                                <tr key={day.id}>

                                    <td className="day-cell">
                                        {day.name}
                                    </td>

                                    <td>
                                        {
                                            getActivityForDay(
                                                a15Assignments,
                                                day.id
                                            )
                                        }
                                    </td>

                                    <td>
                                        {
                                            getActivityForDay(
                                                cleaningAssignments,
                                                day.id
                                            )
                                        }
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                <footer className="print-footer">

                    <span>
                        Nike Staff Planner
                    </span>

                    <span>
                        Página 1 de 2
                    </span>

                </footer>

            </section>


            {/* =====================================================
                PÁGINA 2
            ===================================================== */}

            <section className="print-page print-page-2">

                <header className="print-header">

                    <div className="print-brand">

                        <div className="print-nike">
                            NIKE
                        </div>

                        <div className="print-brand-divider" />

                        <div>
                            <h1>
                                STAFF PLANNER
                            </h1>

                            <span>
                                Quicentro
                            </span>
                        </div>

                    </div>

                    <div className="print-document-info">

                        <strong>
                            PLANIFICACIÓN SEMANAL
                        </strong>

                        <span>
                            OPERACIÓN DE TIENDA
                        </span>

                    </div>

                </header>


                {/* =========================================
                    ALMUERZOS
                ========================================= */}

                <div className="print-section">

                    <div className="print-section-title">

                        <div className="print-section-number">
                            01
                        </div>

                        <div>

                            <span>
                                ALIMENTACIÓN DEL EQUIPO
                            </span>

                            <h2>
                                Distribución de almuerzos
                            </h2>

                        </div>

                    </div>


                    <table className="print-table lunch-print-table">

                        <thead>

                            <tr>

                                <th>
                                    DÍA
                                </th>

                                {TIMES.map(time => (

                                    <th key={time.shift}>
                                        {time.start}
                                        <br />
                                        <small>
                                            {time.end}
                                        </small>
                                    </th>

                                ))}

                            </tr>

                        </thead>

                        <tbody>

                            {DAYS.map(day => {

                                const result =
                                    lunchAssignments?.[
                                        day.id
                                    ]

                                const assignments =
                                    result?.assignments || []

                                return (

                                    <tr key={day.id}>

                                        <td className="day-cell">
                                            {day.name}
                                        </td>

                                        {TIMES.map(time => {

                                            const people =
                                                assignments.filter(
                                                    person =>
                                                        person.lunchShift ===
                                                        time.shift
                                                )

                                            return (

                                                <td
                                                    key={
                                                        time.shift
                                                    }
                                                    className={
                                                        people.length
                                                            ? ''
                                                            : 'empty-cell'
                                                    }
                                                >

                                                    {people.length
                                                        ? people
                                                            .map(
                                                                getAssignmentName
                                                            )
                                                            .join(', ')
                                                        : '—'}

                                                </td>

                                            )

                                        })}

                                    </tr>

                                )

                            })}

                        </tbody>

                    </table>

                </div>


                {/* =========================================
                    ZONAS
                ========================================= */}

                <div className="print-section zones-print-section">

                    <div className="print-section-title">

                        <div className="print-section-number">
                            02
                        </div>

                        <div>

                            <span>
                                PISO DE VENTAS
                            </span>

                            <h2>
                                Distribución de zonas
                            </h2>

                        </div>

                    </div>


                    <table className="print-table zones-print-table">

                        <thead>

                            <tr>

                                <th>
                                    DÍA
                                </th>

                                <th>
                                    ZONA
                                </th>

                                <th>
                                    COLABORADOR
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {DAYS.map(day => {

                                const assignments =
                                    getZoneDay(
                                        day.id
                                    )

                                if (
                                    assignments.length === 0
                                ) {

                                    return (

                                        <tr key={day.id}>

                                            <td className="day-cell">
                                                {day.name}
                                            </td>

                                            <td>
                                                —
                                            </td>

                                            <td className="empty-cell">
                                                Sin asignación
                                            </td>

                                        </tr>

                                    )

                                }

                                return assignments.map(
                                    (
                                        assignment,
                                        index
                                    ) => (

                                        <tr
                                            key={`${day.id}-${index}`}
                                        >

                                            {index === 0 && (

                                                <td
                                                    rowSpan={
                                                        assignments.length
                                                    }
                                                    className="day-cell"
                                                >
                                                    {day.name}
                                                </td>

                                            )}

                                            <td>
                                                {
                                                    assignment?.zone ||
                                                    assignment?.zoneName ||
                                                    assignment?.location ||
                                                    'Zona'
                                                }
                                            </td>

                                            <td>
                                                {
                                                    getAssignmentName(
                                                        assignment
                                                    )
                                                }
                                            </td>

                                        </tr>

                                    )
                                )

                            })}

                        </tbody>

                    </table>

                </div>


                <footer className="print-footer">

                    <span>
                        Nike Staff Planner
                    </span>

                    <span>
                        Página 2 de 2
                    </span>

                </footer>

            </section>

        </div>

    )
}

export default ProfessionalPrint