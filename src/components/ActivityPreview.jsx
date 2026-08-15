import {
    Sparkles,
    BrushCleaning,
    Clock3,
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

    return (
        <div className="activity-preview">

            <div className="activity-summary">

                <div className="activity-summary-card">
                    <Sparkles size={18} />

                    <div>
                        <strong>
                            {a15Assignments.length}
                        </strong>

                        <span>
                            A15
                        </span>
                    </div>
                </div>

                <div className="activity-summary-card">
                    <BrushCleaning size={18} />

                    <div>
                        <strong>
                            {cleaningAssignments.length}
                        </strong>

                        <span>
                            Limpieza
                        </span>
                    </div>
                </div>

            </div>

            <div className="activity-days">

                {DAYS.map((day) => {

                    const a15 =
                        a15Assignments.find(
                            (assignment) =>
                                assignment.day ===
                                day.id
                        )

                    const cleaning =
                        cleaningAssignments.find(
                            (assignment) =>
                                assignment.day ===
                                day.id
                        )

                    return (
                        <div
                            className="activity-day-card"
                            key={day.id}
                        >

                            <div className="activity-day-header">

                                <span>
                                    DÍA
                                </span>

                                <strong>
                                    {day.name}
                                </strong>

                            </div>

                            <div className="activity-cards">

                                {/* A15 */}

                                <div className="activity-card a15-card">

                                    <div className="activity-card-icon">
                                        <Sparkles size={18} />
                                    </div>

                                    <div className="activity-card-content">

                                        <span className="activity-label">
                                            A15
                                        </span>

                                        <strong>
                                            {
                                                a15?.employeeName ||
                                                'Sin asignación'
                                            }
                                        </strong>

                                        {a15 && (
                                            <span className="activity-time">

                                                <Clock3 size={14} />

                                                {
                                                    a15.start
                                                }
                                                {' '}
                                                —
                                                {' '}
                                                {
                                                    a15.end
                                                }

                                            </span>
                                        )}

                                    </div>

                                </div>

                                {/* LIMPIEZA */}

                                <div className="activity-card cleaning-card">

                                    <div className="activity-card-icon">
                                        <BrushCleaning size={18} />
                                    </div>

                                    <div className="activity-card-content">

                                        <span className="activity-label">
                                            LIMPIEZA
                                        </span>

                                        <strong>
                                            {
                                                cleaning?.employeeName ||
                                                'Sin asignación'
                                            }
                                        </strong>

                                        {cleaning && (
                                            <span className="activity-time">

                                                <Clock3 size={14} />

                                                {
                                                    cleaning.start
                                                }
                                                {' '}
                                                —
                                                {' '}
                                                {
                                                    cleaning.end
                                                }

                                            </span>
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>
                    )
                })}

            </div>

        </div>
    )
}

export default ActivityPreview