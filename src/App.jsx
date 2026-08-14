import { useState } from 'react'
import {
  CalendarDays,
  Users,
  Clock3,
  Utensils,
  Sparkles,
  ClipboardList,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import ExcelUploader from './components/ExcelUploader'
import SchedulePreview from './components/SchedulePreview'
import AvailabilityPreview from './components/AvailabilityPreview'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [scheduleData, setScheduleData] = useState(null)

  const handleExcelLoaded = (data) => {
    setScheduleData(data)

    console.log('HORARIO cargado correctamente:', data)
  }

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="nike-logo">NIKE</div>

          {sidebarOpen && (
            <span className="planner-title">
              STAFF
              <br />
              PLANNER
            </span>
          )}
        </div>

        <nav className="navigation">
          <button className="nav-item active">
            <CalendarDays size={20} />
            {sidebarOpen && <span>Planificación</span>}
          </button>

          <button className="nav-item">
            <Users size={20} />
            {sidebarOpen && <span>Personal</span>}
          </button>

          <button className="nav-item">
            <Clock3 size={20} />
            {sidebarOpen && <span>Horas</span>}
          </button>

          <button className="nav-item">
            <Utensils size={20} />
            {sidebarOpen && <span>Almuerzos</span>}
          </button>

          <button className="nav-item">
            <Sparkles size={20} />
            {sidebarOpen && <span>A15 / Limpieza</span>}
          </button>

          <button className="nav-item">
            <ClipboardList size={20} />
            {sidebarOpen && <span>Cronograma</span>}
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <Settings size={20} />
            {sidebarOpen && <span>Configuración</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div>
            <h1>Nike Staff Planner</h1>
            <p>Gestión inteligente de planificación del personal</p>
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <span className="eyebrow">PLANIFICACIÓN SEMANAL</span>
              <h2>Quicentro</h2>
              <p>
                Organiza las actividades del equipo de forma rápida y
                eficiente.
              </p>
            </div>

            <ExcelUploader onDataLoaded={handleExcelLoaded} />
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={22} />
              </div>

              <div>
                <span>Personal</span>
                <strong>{scheduleData ? scheduleData.employees.length : 0}</strong>
                <small>Colaboradores activos</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Clock3 size={22} />
              </div>

              <div>
                <span>Horas planificadas</span>
                <strong>
                  {scheduleData
                    ? scheduleData.employees.reduce(
                      (total, employee) => total + employee.weeklyHours,
                      0
                    )
                    : 0}{' '}
                  h
                </strong>
                <small>Esta semana</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Utensils size={22} />
              </div>

              <div>
                <span>Almuerzos</span>
                <strong>-</strong>
                <small>Turnos asignados</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Sparkles size={22} />
              </div>

              <div>
                <span>Actividades</span>
                <strong>-</strong>
                <small>A15 y limpieza</small>
              </div>
            </div>
          </div>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h3>Semana actual</h3>
                <p>
                  {scheduleData
                    ? 'Horario importado correctamente'
                    : 'Planificación del equipo'}
                </p>
              </div>

              <div className="week-selector">
                <CalendarDays size={18} />
                <span>
                  {scheduleData
                    ? `${scheduleData.weekInfo.days[0].date} ${scheduleData.weekInfo.month} — ${scheduleData.weekInfo.days[6].date
                    } ${scheduleData.weekInfo.month}`
                    : 'Sin horario importado'}
                </span>
              </div>
            </div>

            <div className="empty-schedule">
              <CalendarDays size={42} />

              <h3>
                {scheduleData
                  ? 'Horario cargado correctamente'
                  : 'Aún no existe una planificación'}
              </h3>

              <p>
                {scheduleData
                  ? 'El archivo HORARIO fue leído correctamente. El siguiente paso será interpretar los colaboradores y sus turnos.'
                  : 'Importa el horario Excel para comenzar a generar la planificación automáticamente.'}
              </p>

              {!scheduleData && (
                <ExcelUploader onDataLoaded={handleExcelLoaded} />
              )}
            </div>
          </section>
          {scheduleData && (
            <SchedulePreview employees={scheduleData.employees} />
          )}
          {scheduleData && (
            <AvailabilityPreview
              employees={scheduleData.employees}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App