import { useState } from 'react'
import {
    CalendarDays,
    Sparkles,
    RefreshCw,
    CheckCircle2,
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

import ActivityPreview from './ActivityPreview'
import ZonePreview from './ZonePreview'

function PlanningPreview({ employees }) {

    const [
        planningGenerated,
        setPlanningGenerated,
    ] = useState(false)

    const [
        a15Assignments,
        setA15Assignments,
    ] = useState([])

    const [
        cleaningAssignments,
        setCleaningAssignments,
    ] = useState([])

    const [
        zoneAssignments,
        setZoneAssignments,
    ] = useState({})

    if (
        !employees ||
        employees.length === 0
    ) {
        return null
    }

    const handleGeneratePlanning = () => {

        console.log(
            '===================================='
        )

        console.log(
            'GENERANDO PLANIFICACIÓN...'
        )

        console.log(
            'Empleados:',
            employees
        )

        /*
         * ====================================
         * A15
         * ====================================
         */

        const a15Result =
            generateWeeklyA15Assignments(
                employees
            )

        /*
         * ====================================
         * LIMPIEZA
         * ====================================
         *
         * Se envían las asignaciones de A15
         * para impedir que una persona haga
         * ambas actividades el mismo día.
         */

        const cleaningResult =
            generateWeeklyCleaningAssignments(
                employees,
                a15Result.assignments
            )

        /*
         * ====================================
         * ZONAS
         * ====================================
         */

        const zoneResult =
            generateWeeklyZoneAssignments(
                employees
            )

        /*
         * ====================================
         * GUARDAR RESULTADOS
         * ====================================
         */

        setA15Assignments(
            a15Result.assignments
        )

        setCleaningAssignments(
            cleaningResult.assignments
        )

        setZoneAssignments(
            zoneResult.byDay
        )

        setPlanningGenerated(true)

        /*
         * ====================================
         * DEBUG
         * ====================================
         */

        console.log(
            'PLANIFICACIÓN GENERADA CORRECTAMENTE'
        )

        console.log(
            'A15:',
            a15Result
        )

        console.log(
            'LIMPIEZA:',
            cleaningResult
        )

        console.log(
            'ZONAS:',
            zoneResult
        )

        console.log(
            '===================================='
        )
    }

    /*
     * ========================================
     * TOTAL DE ASIGNACIONES DE ZONAS
     * ========================================
     */

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

    return (
        <section className="planning-preview">

            {/* ================================= */}
            {/* HEADER PRINCIPAL */}
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
                            Actividades y zonas
                        </h2>

                        <p>
                            Genera automáticamente
                            la distribución semanal
                            del equipo.
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    className="generate-planning-button"
                    onClick={
                        handleGeneratePlanning
                    }
                >

                    {planningGenerated ? (
                        <RefreshCw
                            size={19}
                        />
                    ) : (
                        <Sparkles
                            size={19}
                        />
                    )}

                    <span>

                        {planningGenerated
                            ? 'Regenerar planificación'
                            : 'Generar planificación'}

                    </span>

                </button>

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
                            Presiona el botón para
                            generar A15, limpieza
                            y distribución de zonas
                            automáticamente.
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

                        {/* A15 */}

                        <div className="planning-result-card">

                            <div className="planning-result-card-icon">

                                <Sparkles
                                    size={19}
                                />

                            </div>

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

                            <CheckCircle2
                                className="planning-result-check"
                                size={18}
                            />

                        </div>

                        {/* LIMPIEZA */}

                        <div className="planning-result-card">

                            <div className="planning-result-card-icon">

                                <CalendarDays
                                    size={19}
                                />

                            </div>

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

                            <CheckCircle2
                                className="planning-result-check"
                                size={18}
                            />

                        </div>

                        {/* ZONAS */}

                        <div className="planning-result-card">

                            <div className="planning-result-card-icon">

                                <CalendarDays
                                    size={19}
                                />

                            </div>

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

                            <CheckCircle2
                                className="planning-result-check"
                                size={18}
                            />

                        </div>

                    </div>

                    {/* ================================= */}
                    {/* ACTIVIDADES */}
                    {/* ================================= */}

                    <ActivityPreview
                        a15Assignments={
                            a15Assignments
                        }
                        cleaningAssignments={
                            cleaningAssignments
                        }
                    />

                    {/* ================================= */}
                    {/* ZONAS */}
                    {/* ================================= */}

                    <ZonePreview
                        zoneAssignments={
                            zoneAssignments
                        }
                    />

                </>

            )}

        </section>
    )
}

export default PlanningPreview