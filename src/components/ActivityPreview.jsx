import {
    Sparkles,
    Brush,
    Clock3,
    User,
    CheckCircle2,
} from 'lucide-react'

const DAYS = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' },
]

function ActivityPreview({
    a15Assignments = [],
    cleaningAssignments = [],
}) {

    const getAssignment = (
        assignments,
        day
    ) => {
        return (
            assignments.find(
                (assignment) =>
                    assignment.day === day
            ) || null
        )
    }

    return (
        <section className="activity-preview">

            {/* ================================= */}
            {/* ENCABEZADO */}
            {/* ================================= */}

            <div className="planning-section-header">

                <div>
                    <span className="eyebrow">
                        ACTIVIDADES
                    </span>

                    <h2>
                        A15 y Limpieza
                    </h2>

                    <p>
                        Distribución diaria de las
                        actividades del equipo.
                    </p>
                </div>

                <div className="planning-header-stats">

                    <div className="planning-mini-stat">
                        <Sparkles size={18} />

                        <div>
                            <strong>
                                {
                                    a15Assignments.length
                                }
                            </strong>

                            <span>
                                A15
                            </span>
                        </div>
                    </div>

                    <div className="planning-mini-stat">
                        <Brush size={18} />

                        <div>
                            <strong>
                                {
                                    cleaningAssignments.length
                                }
                            </strong>

                            <span>
                                Limpieza
                            </span>
                        </div>
                    </div>

                </div>

            </div>

            {/* ================================= */}
            {/* TARJETAS POR DÍA */}
            {/* ================================= */}

            <div className="activity-days-grid">

                {DAYS.map((day) => {

                    const a15 =
                        getAssignment(
                            a15Assignments,
                            day.id
                        )

                    const cleaning =
                        getAssignment(
                            cleaningAssignments,
                            day.id
                        )

                    return (
                        <div
                            className="activity-day-card"
                            key={day.id}
                        >

                            {/* DÍA */}

                            <div className="activity-day-header">

                                <div>
                                    <span>
                                        DÍA
                                    </span>

                                    <strong>
                                        {day.name}
                                    </strong>
                                </div>

                                <CheckCircle2
                                    size={20}
                                />

                            </div>

                            {/* A15 */}

                            <div className="activity-card">

                                <div className="activity-card-icon a15-icon">
                                    <Sparkles
                                        size={19}
                                    />
                                </div>

                                <div className="activity-card-content">

                                    <span className="activity-label">
                                        A15
                                    </span>

                                    {a15 ? (
                                        <>
                                            <strong>
                                                {
                                                    a15.employeeName
                                                }
                                            </strong>

                                            <div className="activity-meta">

                                                <Clock3
                                                    size={13}
                                                />

                                                <span>
                                                    {
                                                        a15.start
                                                    }
                                                    {' — '}
                                                    {
                                                        a15.end
                                                    }
                                                </span>

                                            </div>
                                        </>
                                    ) : (
                                        <span className="activity-empty">
                                            Sin asignación
                                        </span>
                                    )}

                                </div>

                            </div>

                            {/* LIMPIEZA */}

                            <div className="activity-card">

                                <div className="activity-card-icon cleaning-icon">
                                    <Brush
                                        size={19}
                                    />
                                </div>

                                <div className="activity-card-content">

                                    <span className="activity-label">
                                        LIMPIEZA
                                    </span>

                                    {cleaning ? (
                                        <>
                                            <strong>
                                                {
                                                    cleaning.employeeName
                                                }
                                            </strong>

                                            <div className="activity-meta">

                                                <Clock3
                                                    size={13}
                                                />

                                                <span>
                                                    {
                                                        cleaning.start
                                                    }
                                                    {' — '}
                                                    {
                                                        cleaning.end
                                                    }
                                                </span>

                                            </div>
                                        </>
                                    ) : (
                                        <span className="activity-empty">
                                            Sin asignación
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>
                    )
                })}

            </div>

        </section>
    )
}

export default ActivityPreview