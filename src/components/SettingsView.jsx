import {
    Settings,
    Palette,
    Sun,
    Moon,
    Monitor,
    Eye,
    Info,
    Sparkles,
    ShieldCheck,
    ChevronRight,
} from 'lucide-react'


function SettingsView({
    theme,
    setTheme,
}) {

    return (

        <section className="settings-page">

            {/* =====================================================
                TARJETA PRINCIPAL DE CONFIGURACIÓN
            ===================================================== */}

            <section className="settings-hero">

                <div className="settings-hero-info">

                    <div className="settings-hero-icon">
                        <Settings size={26} />
                    </div>

                    <div className="settings-hero-text">

                        <span className="eyebrow">
                            PREFERENCIAS
                        </span>

                        <h2>
                            Configuración
                        </h2>

                        <p>
                            Personaliza la apariencia y experiencia
                            de Nike Staff Planner.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                INFORMACIÓN DEL SISTEMA
            ===================================================== */}

            <section className="settings-system-card">

                <div className="settings-system-header">

                    <div className="settings-system-header-icon">
                        <Info size={19} />
                    </div>

                    <div>

                        <h3>
                            Información del sistema
                        </h3>

                        <p>
                            Información general de la aplicación.
                        </p>

                    </div>

                </div>


                <div className="settings-system-grid">

                    <div className="settings-system-item">

                        <span>
                            Aplicación
                        </span>

                        <strong>
                            Nike Staff Planner
                        </strong>

                    </div>


                    <div className="settings-system-item">

                        <span>
                            Versión
                        </span>

                        <strong>
                            1.0.0
                        </strong>

                    </div>


                    <div className="settings-system-item">

                        <span>
                            Estado
                        </span>

                        <strong>
                            ● Operativa
                        </strong>

                    </div>


                    <div className="settings-system-item">

                        <span>
                            Plataforma
                        </span>

                        <strong>
                            Web Application
                        </strong>

                    </div>


                    <div className="settings-system-item">

                        <span>
                            Sistema operativo
                        </span>

                        <strong>
                            Navegador web
                        </strong>

                    </div>


                    <div className="settings-system-item">

                        <span>
                            Entorno
                        </span>

                        <strong>
                            Producción
                        </strong>

                    </div>

                </div>

            </section>


            {/* =====================================================
                APARIENCIA
            ===================================================== */}

            <section className="settings-options-card">

                <div className="settings-options-header">

                    <h3>
                        Apariencia
                    </h3>

                    <p>
                        Personaliza cómo se muestra la aplicación.
                    </p>

                </div>


                {/* TEMA CLARO */}

                <button
                    type="button"
                    className="settings-option"
                    onClick={() => setTheme('light')}
                    style={{
                        width: '100%',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                    }}
                >

                    <div className="settings-option-info">

                        <div className="settings-option-icon">
                            <Sun size={19} />
                        </div>

                        <div className="settings-option-text">

                            <strong>
                                Tema claro
                            </strong>

                            <span>
                                Utilizar el tema claro de la aplicación.
                            </span>

                        </div>

                    </div>

                    <div className="settings-option-status">
                        {theme === 'light' ? 'Activo' : 'Seleccionar'}
                    </div>

                </button>


                {/* TEMA OSCURO */}

                <button
                    type="button"
                    className="settings-option"
                    onClick={() => setTheme('dark')}
                    style={{
                        width: '100%',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                    }}
                >

                    <div className="settings-option-info">

                        <div className="settings-option-icon">
                            <Moon size={19} />
                        </div>

                        <div className="settings-option-text">

                            <strong>
                                Tema oscuro
                            </strong>

                            <span>
                                Utilizar el tema oscuro de la aplicación.
                            </span>

                        </div>

                    </div>

                    <div className="settings-option-status">
                        {theme === 'dark' ? 'Activo' : 'Seleccionar'}
                    </div>

                </button>


                {/* TEMA DEL SISTEMA */}

                <button
                    type="button"
                    className="settings-option"
                    onClick={() => setTheme('system')}
                    style={{
                        width: '100%',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                    }}
                >

                    <div className="settings-option-info">

                        <div className="settings-option-icon">
                            <Monitor size={19} />
                        </div>

                        <div className="settings-option-text">

                            <strong>
                                Sistema
                            </strong>

                            <span>
                                Utilizar automáticamente la configuración
                                del sistema operativo.
                            </span>

                        </div>

                    </div>

                    <div className="settings-option-status">
                        {theme === 'system' ? 'Activo' : 'Seleccionar'}
                    </div>

                </button>

            </section>


            {/* =====================================================
                INTERFAZ
            ===================================================== */}

            <section className="settings-options-card">

                <div className="settings-options-header">

                    <h3>
                        Interfaz
                    </h3>

                    <p>
                        Opciones relacionadas con la presentación
                        visual de la aplicación.
                    </p>

                </div>


                {/* EXPERIENCIA DE PLANIFICACIÓN */}

                <div className="settings-option">

                    <div className="settings-option-info">

                        <div className="settings-option-icon">
                            <Sparkles size={19} />
                        </div>

                        <div className="settings-option-text">

                            <strong>
                                Experiencia de planificación
                            </strong>

                            <span>
                                Mantener una interfaz limpia,
                                organizada y enfocada en la planificación.
                            </span>

                        </div>

                    </div>

                    <div className="settings-option-status">
                        Activo
                    </div>

                </div>


                {/* INTERFAZ PROFESIONAL */}

                <div className="settings-option">

                    <div className="settings-option-info">

                        <div className="settings-option-icon">
                            <ShieldCheck size={19} />
                        </div>

                        <div className="settings-option-text">

                            <strong>
                                Interfaz profesional
                            </strong>

                            <span>
                                Diseño optimizado para el uso
                                operativo de la aplicación.
                            </span>

                        </div>

                    </div>

                    <div className="settings-option-status">
                        Activo
                    </div>

                </div>


                {/* VISUALIZACIÓN */}

                <div className="settings-option">

                    <div className="settings-option-info">

                        <div className="settings-option-icon">
                            <Eye size={19} />
                        </div>

                        <div className="settings-option-text">

                            <strong>
                                Vista de planificación
                            </strong>

                            <span>
                                Mostrar la información de planificación
                                de forma organizada y estructurada.
                            </span>

                        </div>

                    </div>

                    <div className="settings-option-status">
                        Activo
                    </div>

                </div>

            </section>


            {/* =====================================================
                FUTURAS IMPLEMENTACIONES
            ===================================================== */}

            <section className="settings-future">

                <div className="settings-future-icon">
                    <Settings size={20} />
                </div>

                <div className="settings-future-content">

                    <span className="eyebrow">
                        PRÓXIMAMENTE
                    </span>

                    <strong>
                        Configuraciones avanzadas
                    </strong>

                    <p>
                        Las configuraciones relacionadas con las
                        funciones internas de planificación serán
                        incorporadas progresivamente en futuras
                        versiones de Nike Staff Planner.
                    </p>

                </div>

            </section>


            {/* =====================================================
                FUTURAS OPCIONES
            ===================================================== */}

            <section className="settings-options-card">

                <div className="settings-options-header">

                    <h3>
                        Funciones futuras
                    </h3>

                    <p>
                        Opciones preparadas para próximas versiones
                        de la aplicación.
                    </p>

                </div>


                <div className="settings-option">

                    <div className="settings-option-info">

                        <div className="settings-option-icon">
                            <Settings size={18} />
                        </div>

                        <div className="settings-option-text">

                            <strong>
                                Reglas de asignación
                            </strong>

                            <span>
                                Configuración de las reglas utilizadas
                                por el sistema de planificación.
                            </span>

                        </div>

                    </div>

                    <ChevronRight size={18} />

                </div>


                <div className="settings-option">

                    <div className="settings-option-info">

                        <div className="settings-option-icon">
                            <Settings size={18} />
                        </div>

                        <div className="settings-option-text">

                            <strong>
                                Configuración de horarios
                            </strong>

                            <span>
                                Administración de horarios y jornadas
                                utilizadas por la planificación.
                            </span>

                        </div>

                    </div>

                    <ChevronRight size={18} />

                </div>


                <div className="settings-option">

                    <div className="settings-option-info">

                        <div className="settings-option-icon">
                            <Settings size={18} />
                        </div>

                        <div className="settings-option-text">

                            <strong>
                                Parámetros de planificación
                            </strong>

                            <span>
                                Configuración avanzada del algoritmo
                                de asignación.
                            </span>

                        </div>

                    </div>

                    <ChevronRight size={18} />

                </div>


                <div className="settings-option">

                    <div className="settings-option-info">

                        <div className="settings-option-icon">
                            <Settings size={18} />
                        </div>

                        <div className="settings-option-text">

                            <strong>
                                Preferencias de impresión
                            </strong>

                            <span>
                                Personalización de formatos y opciones
                                para la impresión profesional.
                            </span>

                        </div>

                    </div>

                    <ChevronRight size={18} />

                </div>

            </section>


            {/* =====================================================
                PIE DE CONFIGURACIÓN
            ===================================================== */}

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '8px 4px 4px',
                    color: '#888',
                    fontSize: '11px',
                }}
            >

                <span>
                    Nike Staff Planner
                </span>

                <span>
                    Versión 1.0.0
                </span>

            </div>

        </section>

    )
}


export default SettingsView