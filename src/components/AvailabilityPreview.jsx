import { useState } from 'react'

import {
    Clock3,
    Users,
    ChevronDown,
} from 'lucide-react'

import {
    getWorkingEmployees,
} from '../services/availability'

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

    if (
        !employees ||
        employees.length === 0
    ) {
        return null
    }

    const handleDayChange = (event) => {

        setSelectedDay(
            event.target.value
        )

    }

    const workingEmployees =
        getWorkingEmployees(
            employees,
            selectedDay
        )

    const selectedDayInfo =
        DAYS.find(
            (day) =>
                day.id === selectedDay
        )

    return (

        <section
            className="availability-preview"
        >

            {/* ================================= */}
            {/* HEADER */}
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

                {/* SELECTOR DE DÍA */}

                <div className="day-selector">

                    <select
                        value={selectedDay}
                        onChange={
                            handleDayChange
                        }
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

                    <ChevronDown
                        size={16}
                    />

                </div>

            </div>

            {/* ================================= */}
            {/* RESUMEN */}
            {/* ================================= */}

            <div className="availability-summary">

                <Users size={20} />

                <div>

                    <span>
                        Personal trabajando el{' '}
                        {selectedDayInfo?.name}
                    </span>

                    <strong>
                        {workingEmployees.length}
                    </strong>

                </div>

            </div>

            {/* ================================= */}
            {/* LISTA */}
            {/* ================================= */}

            <div className="availability-list">

                {workingEmployees.length === 0 ? (

                    <div
                        className="availability-empty"
                    >
                        No hay colaboradores
                        trabajando este día.
                    </div>

                ) : (

                    workingEmployees.map(
                        (employee) => {

                            const schedule =
                                employee.schedule[
                                    selectedDay
                                ]

                            return (

                                <div
                                    className="availability-item"
                                    key={
                                        employee.id
                                    }
                                >

                                    {/* PERSONA */}

                                    <div
                                        className="availability-employee"
                                    >

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

                                    {/* HORARIO */}

                                    <div
                                        className="availability-time"
                                    >

                                        <Clock3
                                            size={16}
                                        />

                                        <span>
                                            {
                                                schedule.start
                                            }
                                            {' '}
                                            —
                                            {' '}
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

        </section>

    )
}

export default AvailabilityPreview