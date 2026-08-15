import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const DAYS = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' },
]

const LUNCH_TIMES = [
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

/* ============================================================
   UTILIDADES
============================================================ */

function safeText(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return ''
    }

    return String(value)
}

function getDayName(dayId) {
    return (
        DAYS.find(
            (day) =>
                day.id === dayId
        )?.name || dayId
    )
}

function formatDate() {
    const date = new Date()

    return date.toLocaleDateString(
        'es-EC',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }
    )
}

function addPageFooter(doc) {
    const pageCount =
        doc.internal.getNumberOfPages()

    for (
        let page = 1;
        page <= pageCount;
        page++
    ) {
        doc.setPage(page)

        const pageWidth =
            doc.internal.pageSize.getWidth()

        const pageHeight =
            doc.internal.pageSize.getHeight()

        doc.setFontSize(8)
        doc.setTextColor(110)

        doc.text(
            `Nike Staff Planner • Página ${page} de ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            {
                align: 'center',
            }
        )
    }
}

/* ============================================================
   ENCABEZADO
============================================================ */

function addDocumentHeader(
    doc,
    title,
    subtitle = ''
) {
    const pageWidth =
        doc.internal.pageSize.getWidth()

    doc.setFont(
        'helvetica',
        'bold'
    )

    doc.setFontSize(20)
    doc.setTextColor(25)

    doc.text(
        title,
        pageWidth / 2,
        20,
        {
            align: 'center',
        }
    )

    if (subtitle) {
        doc.setFont(
            'helvetica',
            'normal'
        )

        doc.setFontSize(9)
        doc.setTextColor(100)

        doc.text(
            subtitle,
            pageWidth / 2,
            27,
            {
                align: 'center',
            }
        )
    }

    doc.setFontSize(8)
    doc.setTextColor(100)

    doc.text(
        `Generado: ${formatDate()}`,
        pageWidth / 2,
        33,
        {
            align: 'center',
        }
    )
}

/* ============================================================
   RESUMEN
============================================================ */

function addSummary(
    doc,
    {
        a15Assignments,
        cleaningAssignments,
        lunchAssignments,
        zoneAssignments,
    }
) {
    const totalLunch =
        Object.values(
            lunchAssignments || {}
        ).reduce(
            (
                total,
                day
            ) =>
                total +
                (
                    day?.assignments
                        ?.length || 0
                ),
            0
        )

    const totalZones =
        Object.values(
            zoneAssignments || {}
        ).reduce(
            (
                total,
                day
            ) =>
                total +
                (
                    day?.assignments
                        ?.length || 0
                ),
            0
        )

    const startY = 42

    autoTable(doc, {
        startY,

        head: [
            [
                'Indicador',
                'Total',
            ],
        ],

        body: [
            [
                'Almuerzos asignados',
                totalLunch,
            ],
            [
                'A15 asignados',
                a15Assignments?.length ||
                    0,
            ],
            [
                'Limpiezas asignadas',
                cleaningAssignments
                    ?.length || 0,
            ],
            [
                'Asignaciones de zonas',
                totalZones,
            ],
        ],

        theme: 'grid',

        styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 5,
        },

        headStyles: {
            fontStyle: 'bold',
        },

        columnStyles: {
            0: {
                cellWidth: 125,
            },
            1: {
                halign: 'center',
            },
        },

        margin: {
            left: 35,
            right: 35,
        },
    })
}

/* ============================================================
   ALMUERZOS
============================================================ */

function addLunchSection(
    doc,
    lunchAssignments
) {
    doc.addPage()

    addDocumentHeader(
        doc,
        'Distribución de almuerzos',
        'Planificación semanal de horarios de almuerzo'
    )

    let currentY = 42

    DAYS.forEach((day) => {
        const result =
            lunchAssignments?.[
                day.id
            ]

        if (!result) {
            return
        }

        const assignments =
            result.assignments || []

        doc.setFont(
            'helvetica',
            'bold'
        )

        doc.setFontSize(12)
        doc.setTextColor(30)

        doc.text(
            day.name,
            15,
            currentY
        )

        currentY += 5

        const rows = []

        LUNCH_TIMES.forEach(
            (time) => {
                const people =
                    assignments.filter(
                        (
                            assignment
                        ) =>
                            assignment.lunchShift ===
                            time.shift
                    )

                if (
                    people.length ===
                    0
                ) {
                    rows.push([
                        `${time.start} - ${time.end}`,
                        'Sin asignación',
                        '',
                    ])

                    return
                }

                people.forEach(
                    (person) => {
                        rows.push([
                            `${time.start} - ${time.end}`,
                            safeText(
                                person.employeeName
                            ),
                            `Entrada: ${safeText(
                                person.start
                            )}`,
                        ])
                    }
                )
            }
        )

        autoTable(doc, {
            startY: currentY,

            head: [
                [
                    'Horario',
                    'Colaborador',
                    'Ingreso',
                ],
            ],

            body: rows,

            theme: 'grid',

            styles: {
                font: 'helvetica',
                fontSize: 8,
                cellPadding: 4,
            },

            headStyles: {
                fontStyle: 'bold',
            },

            margin: {
                left: 15,
                right: 15,
            },

            didDrawPage: () => {
                addDocumentHeader(
                    doc,
                    'Distribución de almuerzos',
                    'Planificación semanal de horarios de almuerzo'
                )
            },
        })

        currentY =
            doc.lastAutoTable.finalY +
            10

        /*
         * Si queda poco espacio,
         * comenzamos una nueva página.
         */
        if (currentY > 265) {
            doc.addPage()

            currentY = 42
        }
    })
}

/* ============================================================
   A15 Y LIMPIEZA
============================================================ */

function addActivitiesSection(
    doc,
    a15Assignments,
    cleaningAssignments
) {
    doc.addPage()

    addDocumentHeader(
        doc,
        'A15 y Limpieza',
        'Distribución semanal de actividades'
    )

    const rows = []

    DAYS.forEach((day) => {
        const a15 =
            a15Assignments?.find(
                (assignment) =>
                    assignment.day ===
                    day.id
            )

        const cleaning =
            cleaningAssignments?.find(
                (assignment) =>
                    assignment.day ===
                    day.id
            )

        rows.push([
            day.name,

            a15
                ? safeText(
                    a15.employeeName
                )
                : 'Sin asignación',

            a15
                ? safeText(
                    a15.start
                )
                : '',

            cleaning
                ? safeText(
                    cleaning.employeeName
                )
                : 'Sin asignación',

            cleaning
                ? safeText(
                    cleaning.start
                )
                : '',
        ])
    })

    autoTable(doc, {
        startY: 42,

        head: [
            [
                'Día',
                'A15',
                'Ingreso',
                'Limpieza',
                'Ingreso',
            ],
        ],

        body: rows,

        theme: 'grid',

        styles: {
            font: 'helvetica',
            fontSize: 8,
            cellPadding: 5,
        },

        headStyles: {
            fontStyle: 'bold',
        },

        margin: {
            left: 15,
            right: 15,
        },
    })
}

/* ============================================================
   ZONAS
============================================================ */

function addZonesSection(
    doc,
    zoneAssignments
) {
    doc.addPage()

    addDocumentHeader(
        doc,
        'Distribución de zonas',
        'Asignación del personal al piso de ventas'
    )

    let currentY = 42

    DAYS.forEach((day) => {
        const result =
            zoneAssignments?.[
                day.id
            ]

        if (!result) {
            return
        }

        const assignments =
            result.assignments || []

        doc.setFont(
            'helvetica',
            'bold'
        )

        doc.setFontSize(12)
        doc.setTextColor(30)

        doc.text(
            day.name,
            15,
            currentY
        )

        currentY += 5

        const rows =
            assignments.map(
                (assignment) => [
                    safeText(
                        assignment.zoneName
                    ),

                    safeText(
                        assignment.employeeName
                    ),

                    safeText(
                        assignment.start
                    ),

                    safeText(
                        assignment.end
                    ),

                    safeText(
                        (
                            assignment
                                .locations ||
                            []
                        ).join(', ')
                    ),
                ]
            )

        if (
            rows.length === 0
        ) {
            rows.push([
                'Sin asignación',
                '',
                '',
                '',
                '',
            ])
        }

        autoTable(doc, {
            startY: currentY,

            head: [
                [
                    'Zona',
                    'Colaborador',
                    'Entrada',
                    'Salida',
                    'Ubicaciones',
                ],
            ],

            body: rows,

            theme: 'grid',

            styles: {
                font: 'helvetica',
                fontSize: 7,
                cellPadding: 3,
            },

            headStyles: {
                fontStyle: 'bold',
            },

            margin: {
                left: 15,
                right: 15,
            },

            columnStyles: {
                0: {
                    cellWidth: 25,
                },

                1: {
                    cellWidth: 38,
                },

                2: {
                    cellWidth: 18,
                },

                3: {
                    cellWidth: 18,
                },
            },
        })

        currentY =
            doc.lastAutoTable.finalY +
            10

        if (currentY > 265) {
            doc.addPage()

            currentY = 42
        }
    })
}

/* ============================================================
   FUNCIÓN PRINCIPAL
============================================================ */

export function openPlanningPDF({
    a15Assignments = [],
    cleaningAssignments = [],
    lunchAssignments = {},
    zoneAssignments = {},
}) {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        })

        /*
         * ========================================
         * PORTADA / RESUMEN
         * ========================================
         */

        addDocumentHeader(
            doc,
            'PLANIFICACIÓN SEMANAL',
            'Nike Staff Planner'
        )

        addSummary(
            doc,
            {
                a15Assignments,
                cleaningAssignments,
                lunchAssignments,
                zoneAssignments,
            }
        )

        /*
         * ========================================
         * ALMUERZOS
         * ========================================
         */

        addLunchSection(
            doc,
            lunchAssignments
        )

        /*
         * ========================================
         * A15 Y LIMPIEZA
         * ========================================
         */

        addActivitiesSection(
            doc,
            a15Assignments,
            cleaningAssignments
        )

        /*
         * ========================================
         * ZONAS
         * ========================================
         */

        addZonesSection(
            doc,
            zoneAssignments
        )

        /*
         * ========================================
         * PIE DE PÁGINA
         * ========================================
         */

        addPageFooter(doc)

        /*
         * ========================================
         * CREAR BLOB DEL PDF
         * ========================================
         */

        const pdfBlob =
            doc.output('blob')

        const pdfUrl =
            URL.createObjectURL(
                pdfBlob
            )

        /*
         * ========================================
         * ABRIR PDF EN NUEVA PESTAÑA
         * ========================================
         */

        const newWindow =
            window.open(
                pdfUrl,
                '_blank'
            )

        /*
         * Si el navegador bloquea
         * la ventana emergente,
         * descargamos el PDF como
         * alternativa.
         */
        if (!newWindow) {
            doc.save(
                'planificacion-semanal.pdf'
            )

            URL.revokeObjectURL(
                pdfUrl
            )

            return
        }

        /*
         * Liberar el objeto URL
         * después de un tiempo.
         */
        setTimeout(() => {
            URL.revokeObjectURL(
                pdfUrl
            )
        }, 60000)

    } catch (error) {
        console.error(
            'ERROR AL GENERAR PDF:',
            error
        )

        alert(
            'No se pudo generar el PDF de la planificación.'
        )
    }
}