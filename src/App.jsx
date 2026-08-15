import { useEffect, useState } from 'react'

import {
    CalendarDays,
    Users,
    Utensils,
    Sparkles,
    ClipboardList,
    Settings,
    Menu,
    X,
    Printer,
} from 'lucide-react'

import ExcelUploader from './components/ExcelUploader'
import SchedulePreview from './components/SchedulePreview'
import AvailabilityPreview from './components/AvailabilityPreview'
import PlanningPreview from './components/PlanningPreview'
import SettingsView from './components/SettingsView'

import './App.css'


function App() {

    /* =========================================
       SIDEBAR
    ========================================= */

    const [
        sidebarOpen,
        setSidebarOpen
    ] = useState(true)


    /* =========================================
       NAVEGACIÓN
    ========================================= */

    const [
        activeSection,
        setActiveSection
    ] = useState('planning')


    /* =========================================
       TEMA VISUAL
    ========================================= */

    const [
        theme,
        setTheme
    ] = useState('light')


    /* =========================================
       APLICAR TEMA
    ========================================= */

    useEffect(() => {

        const root =
            document.documentElement

        if (theme === 'dark') {

            root.setAttribute(
                'data-theme',
                'dark'
            )

        } else if (theme === 'light') {

            root.setAttribute(
                'data-theme',
                'light'
            )

        } else {

            root.removeAttribute(
                'data-theme'
            )

        }

    }, [theme])


    /* =========================================
       DATOS DEL HORARIO
    ========================================= */

    const [
        scheduleData,
        setScheduleData
    ] = useState(null)


    /* =========================================
       ESTADO GLOBAL DE PLANIFICACIÓN
    ========================================= */

    const [
        planningGenerated,
        setPlanningGenerated
    ] = useState(false)


    /* =========================================
       TRIGGER DE GENERACIÓN
    ========================================= */

    const [
        generateTrigger,
        setGenerateTrigger
    ] = useState(0)


    /* =========================================
       IMPORTAR HORARIO
    ========================================= */

    const handleExcelLoaded = (data) => {

        setScheduleData(data)

        setPlanningGenerated(false)

        console.log(
            'HORARIO cargado correctamente:',
            data
        )
    }


    /* =========================================
       GENERAR PLANIFICACIÓN
    ========================================= */

    const handleGeneratePlanning = () => {

        if (!scheduleData) {
            return
        }

        console.log(
            'GENERAR PLANIFICACIÓN GLOBAL'
        )

        setGenerateTrigger(
            previous => previous + 1
        )

        setPlanningGenerated(true)

        setTimeout(() => {

            const planningElement =
                document.getElementById(
                    'section-planning-results'
                )

            if (planningElement) {

                planningElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })

            }

        }, 100)

    }


    /* =========================================
       IMPRIMIR
    ========================================= */

    const handlePrintCronograma = () => {

        if (!planningGenerated) {
            return
        }

        console.log(
            'IMPRIMIR CRONOGRAMA'
        )

        window.print()
    }


    /* =========================================
       NAVEGACIÓN
    ========================================= */

    const handleNavigation = (section) => {

        setActiveSection(section)


        /* =====================================
           CONFIGURACIÓN
        ===================================== */

        if (section === 'settings') {

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })

            return
        }


        /* =====================================
           NAVEGACIÓN NORMAL
        ===================================== */

        let sectionId = null

        switch (section) {

            case 'planning':

                sectionId =
                    'section-planning'

                break


            case 'personal':

                sectionId =
                    'section-personal'

                break


            case 'lunch':

                sectionId =
                    'section-lunch'

                break


            case 'activities':

                sectionId =
                    'section-planning-results'

                break


            case 'cronograma':

                sectionId =
                    'section-planning-results'

                break


            default:

                break
        }


        if (!sectionId) {
            return
        }


        const sectionElement =
            document.getElementById(
                sectionId
            )


        if (sectionElement) {

            sectionElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })

        }

    }


    /* =========================================
       ESTADOS
    ========================================= */

    const hasSchedule =
        Boolean(scheduleData)


    const isSettings =
        activeSection === 'settings'


    /* =========================================
       RENDER
    ========================================= */

    return (

        <div
            className={`app ${
                theme === 'dark'
                    ? 'theme-dark'
                    : ''
            }`}
        >

            {/* ========================================= */}
            {/* SIDEBAR */}
            {/* ========================================= */}

            <aside
                className={`sidebar ${
                    sidebarOpen
                        ? 'open'
                        : 'closed'
                }`}
            >

                {/* HEADER */}

                <div className="sidebar-header">

                    <div className="nike-logo">
                        NIKE
                    </div>

                    {sidebarOpen && (

                        <span className="planner-title">

                            STAFF
                            <br />
                            PLANNER

                        </span>

                    )}

                </div>


                {/* NAVEGACIÓN */}

                <nav className="navigation">


                    {/* PLANIFICACIÓN */}

                    <button
                        className={`nav-item ${
                            activeSection === 'planning'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            handleNavigation(
                                'planning'
                            )
                        }
                    >

                        <CalendarDays size={20} />

                        {sidebarOpen && (
                            <span>
                                Planificación
                            </span>
                        )}

                    </button>


                    {/* PERSONAL */}

                    <button
                        className={`nav-item ${
                            activeSection === 'personal'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            handleNavigation(
                                'personal'
                            )
                        }
                    >

                        <Users size={20} />

                        {sidebarOpen && (
                            <span>
                                Personal
                            </span>
                        )}

                    </button>


                    {/* ALMUERZOS */}

                    <button
                        className={`nav-item ${
                            activeSection === 'lunch'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            handleNavigation(
                                'lunch'
                            )
                        }
                    >

                        <Utensils size={20} />

                        {sidebarOpen && (
                            <span>
                                Almuerzos
                            </span>
                        )}

                    </button>


                    {/* ACTIVIDADES */}

                    <button
                        className={`nav-item ${
                            activeSection === 'activities'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            handleNavigation(
                                'activities'
                            )
                        }
                    >

                        <Sparkles size={20} />

                        {sidebarOpen && (
                            <span>
                                A15 / Limpieza
                            </span>
                        )}

                    </button>


                    {/* CRONOGRAMA */}

                    <button
                        className={`nav-item ${
                            activeSection === 'cronograma'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            handleNavigation(
                                'cronograma'
                            )
                        }
                    >

                        <ClipboardList size={20} />

                        {sidebarOpen && (
                            <span>
                                Cronograma
                            </span>
                        )}

                    </button>

                </nav>


                {/* =====================================
                    CONFIGURACIÓN
                ===================================== */}

                <div className="sidebar-bottom">

                    <button
                        className={`nav-item ${
                            activeSection === 'settings'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            handleNavigation(
                                'settings'
                            )
                        }
                    >

                        <Settings size={20} />

                        {sidebarOpen && (
                            <span>
                                Configuración
                            </span>
                        )}

                    </button>


                    {/* INFORMACIÓN DE VERSIÓN */}

                    {sidebarOpen && (

                        <div className="sidebar-app-info">

                            <div className="sidebar-app-name">
                                Nike Staff Planner
                            </div>

                            <div className="sidebar-app-version">
                                Versión 1.0.0
                            </div>

                            <div className="sidebar-app-status">

                                <span className="status-dot">
                                </span>

                                Sistema operativo

                            </div>

                        </div>

                    )}

                </div>

            </aside>


            {/* ========================================= */}
            {/* CONTENIDO */}
            {/* ========================================= */}

            <main className="main-content">


                {/* =========================================
                    TOPBAR
                ========================================= */}

                <header className="topbar">

                    <button
                        className="menu-button"
                        onClick={() =>
                            setSidebarOpen(
                                !sidebarOpen
                            )
                        }
                    >

                        {sidebarOpen ? (

                            <X size={22} />

                        ) : (

                            <Menu size={22} />

                        )}

                    </button>


                    <div>

                        <h1>

                            {isSettings
                                ? 'Configuración'
                                : 'Nike Staff Planner'}

                        </h1>


                        <p>

                            {isSettings
                                ? 'Preferencias y apariencia de la aplicación'
                                : 'Gestión inteligente de planificación del personal'}

                        </p>

                    </div>

                </header>


                {/* =========================================
                    CONTENIDO PRINCIPAL
                ========================================= */}

                <section className="content">


                    {/* =====================================
                        VISTA DE CONFIGURACIÓN
                    ===================================== */}

                    {isSettings ? (

                        <SettingsView
                            theme={theme}
                            setTheme={setTheme}
                        />

                    ) : (

                        /* =================================
                           VISTA PRINCIPAL
                        ================================= */

                        <>


                            {/* ========================================= */}
                            {/* BIENVENIDA + ACCIONES */}
                            {/* ========================================= */}

                            <div
                                className="welcome"
                                id="section-planning"
                            >

                                <div className="welcome-info">

                                    <span className="eyebrow">
                                        PLANIFICACIÓN SEMANAL
                                    </span>

                                    <h2>
                                        Quicentro
                                    </h2>

                                    <p>
                                        Organiza las actividades
                                        del equipo de forma rápida
                                        y eficiente.
                                    </p>

                                </div>


                                {/* ACCIONES */}

                                <div className="planning-actions">


                                    {/* IMPORTAR */}

                                    <div className="planning-action">

                                        <ExcelUploader
                                            onDataLoaded={
                                                handleExcelLoaded
                                            }
                                        />

                                    </div>


                                    {/* GENERAR */}

                                    <button
                                        className={`planning-action-button generate ${
                                            !hasSchedule
                                                ? 'disabled'
                                                : ''
                                        }`}
                                        onClick={
                                            handleGeneratePlanning
                                        }
                                        disabled={
                                            !hasSchedule
                                        }
                                        title={
                                            !hasSchedule
                                                ? 'Primero importa el horario Excel'
                                                : 'Generar planificación semanal'
                                        }
                                    >

                                        <Sparkles size={19} />

                                        <span>

                                            {planningGenerated
                                                ? 'Regenerar planificación'
                                                : 'Generar planificación'}

                                        </span>

                                    </button>


                                    {/* IMPRIMIR */}

                                    <button
                                        className={`planning-action-button print ${
                                            !planningGenerated
                                                ? 'disabled'
                                                : ''
                                        }`}
                                        onClick={
                                            handlePrintCronograma
                                        }
                                        disabled={
                                            !planningGenerated
                                        }
                                        title={
                                            !planningGenerated
                                                ? 'Primero genera la planificación'
                                                : 'Imprimir cronograma'
                                        }
                                    >

                                        <Printer size={19} />

                                        <span>
                                            Imprimir cronograma
                                        </span>

                                    </button>

                                </div>

                            </div>


                            {/* ========================================= */}
                            {/* ESTADÍSTICAS */}
                            {/* ========================================= */}

                            <div className="stats-grid">


                                {/* PERSONAL */}

                                <div className="stat-card">

                                    <div className="stat-icon">
                                        <Users size={22} />
                                    </div>

                                    <div>

                                        <span>
                                            Personal
                                        </span>

                                        <strong>

                                            {scheduleData
                                                ? scheduleData
                                                    .employees
                                                    .length
                                                : 0}

                                        </strong>

                                        <small>
                                            Colaboradores activos
                                        </small>

                                    </div>

                                </div>


                                {/* HORAS */}

                                <div className="stat-card">

                                    <div className="stat-icon">

                                        <ClipboardList
                                            size={22}
                                        />

                                    </div>

                                    <div>

                                        <span>
                                            Horas planificadas
                                        </span>

                                        <strong>

                                            {scheduleData
                                                ? scheduleData.employees.reduce(
                                                    (
                                                        total,
                                                        employee
                                                    ) =>
                                                        total +
                                                        employee.weeklyHours,
                                                    0
                                                )
                                                : 0}{' '}
                                            h

                                        </strong>

                                        <small>
                                            Esta semana
                                        </small>

                                    </div>

                                </div>


                                {/* ALMUERZOS */}

                                <div className="stat-card">

                                    <div className="stat-icon">
                                        <Utensils size={22} />
                                    </div>

                                    <div>

                                        <span>
                                            Almuerzos
                                        </span>

                                        <strong>

                                            {planningGenerated
                                                ? '✓'
                                                : '-'}

                                        </strong>

                                        <small>
                                            Turnos asignados
                                        </small>

                                    </div>

                                </div>


                                {/* ACTIVIDADES */}

                                <div className="stat-card">

                                    <div className="stat-icon">
                                        <Sparkles size={22} />
                                    </div>

                                    <div>

                                        <span>
                                            Actividades
                                        </span>

                                        <strong>

                                            {planningGenerated
                                                ? '✓'
                                                : '-'}

                                        </strong>

                                        <small>
                                            A15 y limpieza
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* ========================================= */}
                            {/* SEMANA ACTUAL */}
                            {/* ========================================= */}

                            <section className="panel">

                                <div className="panel-header">

                                    <div>

                                        <h3>
                                            Semana actual
                                        </h3>

                                        <p>

                                            {scheduleData
                                                ? 'Horario importado correctamente'
                                                : 'Planificación del equipo'}

                                        </p>

                                    </div>


                                    <div className="week-selector">

                                        <CalendarDays
                                            size={18}
                                        />

                                        <span>

                                            {scheduleData
                                                ? `${scheduleData.weekInfo.days[0].date} ${scheduleData.weekInfo.month} — ${scheduleData.weekInfo.days[6].date} ${scheduleData.weekInfo.month}`
                                                : 'Sin horario importado'}

                                        </span>

                                    </div>

                                </div>


                                <div className="empty-schedule">

                                    <CalendarDays
                                        size={42}
                                    />

                                    <h3>

                                        {scheduleData
                                            ? planningGenerated
                                                ? 'Planificación generada correctamente'
                                                : 'Horario cargado correctamente'
                                            : 'Aún no existe una planificación'}

                                    </h3>


                                    <p>

                                        {scheduleData
                                            ? planningGenerated
                                                ? 'El horario fue procesado y la planificación semanal está disponible más abajo.'
                                                : 'El archivo HORARIO fue leído correctamente. Ahora puedes generar automáticamente la planificación.'
                                            : 'Importa el horario Excel para comenzar a generar la planificación automáticamente.'}

                                    </p>


                                    {!scheduleData && (

                                        <ExcelUploader
                                            onDataLoaded={
                                                handleExcelLoaded
                                            }
                                        />

                                    )}

                                </div>

                            </section>


                            {/* ========================================= */}
                            {/* HORARIO */}
                            {/* ========================================= */}

                            {scheduleData && (

                                <section
                                    id="section-personal"
                                >

                                    <SchedulePreview
                                        employees={
                                            scheduleData.employees
                                        }
                                    />

                                </section>

                            )}


                            {/* ========================================= */}
                            {/* DISPONIBILIDAD */}
                            {/* ========================================= */}

                            {scheduleData && (

                                <section
                                    id="section-lunch"
                                >

                                    <AvailabilityPreview
                                        employees={
                                            scheduleData.employees
                                        }
                                    />

                                </section>

                            )}


                            {/* ========================================= */}
                            {/* PLANIFICACIÓN COMPLETA */}
                            {/* ========================================= */}

                            {scheduleData && (

                                <section
                                    id="section-planning-results"
                                >

                                    <PlanningPreview
                                        employees={
                                            scheduleData.employees
                                        }
                                        generateTrigger={
                                            generateTrigger
                                        }
                                    />

                                </section>

                            )}

                        </>

                    )}

                </section>

            </main>

        </div>

    )
}


export default App