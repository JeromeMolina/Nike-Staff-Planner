import { useState } from 'react'
import {
    Clock3,
    Users,
    ChevronDown,
    Utensils,
    CheckCircle2,
    Sparkles,
    RefreshCw,
    ArrowRight,
} from 'lucide-react'

import { getWorkingEmployees } from '../services/availability'

import {
    getLunchCandidates,
    getLunchTimes,
} from '../services/lunchCandidates'

import {
    generateLunchAssignments,
} from '../services/lunchAssignment'

const DAYS = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' },
]

function AvailabilityPreview({ employees }) {
    const [selectedDay, setSelectedDay] =
        useState('monday')

    const [lunchAssignment, setLunchAssignment] =
        useState(null)

    const [assignmentGenerated, setAssignmentGenerated] =
        useState(false)

    if (!employees || employees.length === 0) {
        return null
    }

    const handleDayChange = (event) => {
        const newDay = event.target.value

        setSelectedDay(newDay)

        setLunchAssignment(null)
        setAssignmentGenerated(false)
    }

    const handleGenerateAssignment = () => {
        const result = generateLunchAssignments(
            employees,
            selectedDay
        )

        setLunchAssignment(result)
        setAssignmentGenerated(true)
    }

    const workingEmployees =
        getWorkingEmployees(
            employees,
            selectedDay
        )

    /*
     * El motor de candidatos sigue funcionando
     * internamente aunque ya no se visualice.
     *
     * Esto es importante porque el motor de
     * asignación utiliza esta información.
     */
    const lunchCandidates =
        getLunchCandidates(
            employees,
            selectedDay
        )

    const lunchTimes =
        getLunchTimes()

    const selectedDayInfo =
        DAYS.find(
            (day) => day.id === selectedDay
        )

    const assignments =
        lunchAssignment?.assignments || []

    const assignmentByTime =
        lunchTimes.map(
            (lunchTime) => ({
                ...lunchTime,

                assignments:
                    assignments.filter(
                        (assignment) =>
                            assignment.lunchShift ===
                            lunchTime.shift
                    ),
            })
        )

    return (
        <section className="availability-preview">

            {/* ================================= */}
            {/* DISPONIBILIDAD */}
            {/* ================================= */}

            <div className="availability-header">

                <div>

                    <span className="eyebrow">
                        DISPONIBILIDAD
                    </span>

                    <h2>
                        Personal disponible
                    </h2>

                    <p>
                        Colaboradores que tienen
                        turno programado para el
                        día seleccionado.
                    </p>

                </div>

                <div className="day-selector">

                    <select
                        value={selectedDay}
                        onChange={handleDayChange}
                    >

                        {DAYS.map(
                            (day) => (
                                <option
                                    key={day.id}
                                    value={day.id}
                                >
                                    {day.name}
                                </option>
                            )
                        )}

                    </select>

                    <ChevronDown size={16} />

                </div>

            </div>

            {/* ================================= */}
            {/* RESUMEN DE PERSONAL */}
            {/* ================================= */}

            <div className="availability-summary">

                <Users size={20} />

                <div>

                    <span>
                        Personal trabajando el{' '}
                        {selectedDayInfo.name}
                    </span>

                    <strong>
                        {workingEmployees.length}
                    </strong>

                </div>

            </div>

            {/* ================================= */}
            {/* LISTA DE PERSONAL */}
            {/* ================================= */}

            <div className="availability-list">

                {workingEmployees.length === 0 ? (

                    <div className="availability-empty">
                        No hay colaboradores
                        trabajando este día.
                    </div>

                ) : (

                    workingEmployees.map(
                        (employee) => {

                            const schedule =
                                employee
                                    .schedule[
                                    selectedDay
                                ]

                            return (
                                <div
                                    className="availability-item"
                                    key={
                                        employee.id
                                    }
                                >

                                    <div className="availability-employee">

                                        <strong>
                                            {
                                                employee.name
                                            }
                                        </strong>

                                        <span>
                                            {
                                                schedule.hours
                                            }{' '}
                                            horas
                                        </span>

                                    </div>

                                    <div className="availability-time">

                                        <Clock3
                                            size={16}
                                        />

                                        <span>
                                            {
                                                schedule.start
                                            }{' '}
                                            —{' '}
                                            {
                                                schedule.end
                                            }
                                        </span>

                                    </div>

                                </div>
                            )
                        }
                    )

                )}

            </div>

            {/* ================================= */}
            {/* MOTOR DE ASIGNACIÓN */}
            {/* ================================= */}

            <div className="lunch-assignment">

                <div className="assignment-main-header">

                    <div className="assignment-title">

                        <div className="assignment-title-icon">

                            <Sparkles
                                size={20}
                            />

                        </div>

                        <div>

                            <span className="eyebrow">
                                MOTOR DE ASIGNACIÓN
                            </span>

                            <h3>
                                Almuerzos asignados
                            </h3>

                            <p>
                                La asignación respeta
                                la prioridad por hora
                                de ingreso, capacidad
                                de cada turno y
                                colaboradores pendientes.
                            </p>

                        </div>

                    </div>

                    <button
                        className="generate-lunch-button"
                        onClick={
                            handleGenerateAssignment
                        }
                    >

                        {assignmentGenerated ? (
                            <RefreshCw
                                size={18}
                            />
                        ) : (
                            <Sparkles
                                size={18}
                            />
                        )}

                        <span>
                            {assignmentGenerated
                                ? 'Regenerar asignación'
                                : 'Generar asignación'}
                        </span>

                    </button>

                </div>

                {/* ================================= */}
                {/* ESTADO INICIAL */}
                {/* ================================= */}

                {!assignmentGenerated && (

                    <div className="assignment-empty-state">

                        <div className="assignment-empty-icon">

                            <Utensils
                                size={28}
                            />

                        </div>

                        <div>

                            <strong>
                                La asignación aún
                                no ha sido generada
                            </strong>

                            <span>
                                Presiona "Generar
                                asignación" para que
                                el sistema seleccione
                                automáticamente a los
                                colaboradores.
                            </span>

                        </div>

                    </div>

                )}

                {/* ================================= */}
                {/* RESULTADO DE ASIGNACIÓN */}
                {/* ================================= */}

                {assignmentGenerated &&
                    lunchAssignment && (
                        <>

                            {/* RESUMEN */}

                            <div className="lunch-assignment-summary">

                                <div className="assignment-summary-card">

                                    <span>
                                        12:30
                                    </span>

                                    <strong>
                                        {
                                            lunchAssignment
                                                .summary
                                                .shift1
                                        }
                                    </strong>

                                    <small>
                                        máximo 3
                                    </small>

                                </div>

                                <div className="assignment-summary-card">

                                    <span>
                                        13:30
                                    </span>

                                    <strong>
                                        {
                                            lunchAssignment
                                                .summary
                                                .shift2
                                        }
                                    </strong>

                                    <small>
                                        máximo 3 / 2
                                    </small>

                                </div>

                                <div className="assignment-summary-card">

                                    <span>
                                        14:30
                                    </span>

                                    <strong>
                                        {
                                            lunchAssignment
                                                .summary
                                                .shift3
                                        }
                                    </strong>

                                    <small>
                                        sin máximo
                                    </small>

                                </div>

                                <div className="assignment-summary-card">

                                    <span>
                                        15:30
                                    </span>

                                    <strong>
                                        {
                                            lunchAssignment
                                                .summary
                                                .shift4
                                        }
                                    </strong>

                                    <small>
                                        sin máximo
                                    </small>

                                </div>

                            </div>

                            {/* TARJETAS DE ALMUERZO */}

                            <div className="lunch-assignment-grid">

                                {assignmentByTime.map(
                                    (lunchTime) => (

                                        <div
                                            className="lunch-assignment-card"
                                            key={
                                                lunchTime.id
                                            }
                                        >

                                            <div className="lunch-assignment-card-header">

                                                <div className="assignment-time-info">

                                                    <div className="assignment-time-badge">

                                                        <Utensils
                                                            size={16}
                                                        />

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                lunchTime.start
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                lunchTime.start
                                                            }{' '}
                                                            —{' '}
                                                            {
                                                                lunchTime.end
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                                <span className="assignment-count">

                                                    {
                                                        lunchTime
                                                            .assignments
                                                            .length
                                                    }{' '}

                                                    {
                                                        lunchTime
                                                            .assignments
                                                            .length ===
                                                        1
                                                            ? 'persona'
                                                            : 'personas'
                                                    }

                                                </span>

                                            </div>

                                            <div className="lunch-assignment-list">

                                                {lunchTime
                                                    .assignments
                                                    .length ===
                                                0 ? (

                                                    <div className="assignment-no-people">

                                                        <span>
                                                            Sin personas
                                                            asignadas
                                                        </span>

                                                    </div>

                                                ) : (

                                                    lunchTime
                                                        .assignments
                                                        .map(
                                                            (
                                                                assignment,
                                                                index
                                                            ) => (

                                                                <div
                                                                    className="lunch-assignment-item"
                                                                    key={
                                                                        assignment.employeeId
                                                                    }
                                                                >

                                                                    <div className="assignment-person-number">

                                                                        {
                                                                            index +
                                                                            1
                                                                        }

                                                                    </div>

                                                                    <div className="assignment-person-info">

                                                                        <strong>
                                                                            {
                                                                                assignment.employeeName
                                                                            }
                                                                        </strong>

                                                                        <span>

                                                                            <Clock3
                                                                                size={14}
                                                                            />

                                                                            Entrada:{' '}

                                                                            {
                                                                                assignment.start
                                                                            }

                                                                        </span>

                                                                    </div>

                                                                    <CheckCircle2
                                                                        className="assignment-check"
                                                                        size={19}
                                                                    />

                                                                </div>

                                                            )
                                                        )

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                            {/* ================================= */}
                            {/* PENDIENTES */}
                            {/* ================================= */}

                            {lunchAssignment.pending.length >
                                0 && (

                                <div className="lunch-pending">

                                    <div className="pending-title">

                                        <ArrowRight
                                            size={18}
                                        />

                                        <div>

                                            <strong>
                                                Personas pendientes
                                            </strong>

                                            <span>
                                                Estas personas
                                                no pudieron ser
                                                asignadas dentro
                                                de las reglas
                                                actuales.
                                            </span>

                                        </div>

                                    </div>

                                    <div className="pending-list">

                                        {lunchAssignment
                                            .pending
                                            .map(
                                                (
                                                    employee
                                                ) => (

                                                    <span
                                                        key={
                                                            employee.id
                                                        }
                                                    >
                                                        {
                                                            employee.name
                                                        }
                                                    </span>

                                                )
                                            )}

                                    </div>

                                </div>

                            )}

                        </>
                    )}

            </div>

        </section>
    )
}

export default AvailabilityPreview