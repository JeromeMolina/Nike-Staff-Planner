import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


/* ============================================================
   DÍAS
============================================================ */

const DAYS = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' },
]


/* ============================================================
   HORARIOS DE ALMUERZO
============================================================ */

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
   CONFIGURACIÓN DE TEXTO
============================================================ */

/*
 * ESTE ES EL TAMAÑO PRINCIPAL DE LA LETRA
 * DE LAS PLANIFICACIONES.
 *
 * Puedes modificar estos valores si quieres
 * hacer la letra más grande o pequeña.
 */

const FONT_SIZE_ACTIVITIES = 10

const FONT_SIZE_LUNCH = 7.2

const FONT_SIZE_ZONES = 6.5


/*
 * Tamaño de letra de los nombres de los días
 */

const FONT_SIZE_DAY = 9


/* ============================================================
   COLORES
============================================================ */

const COLORS = {

    purple: [91, 45, 190],

    purpleLight: [245, 241, 255],

    green: [15, 145, 75],

    greenLight: [235, 250, 240],

    orange: [245, 105, 0],

    orangeLight: [255, 244, 228],

    dark: [25, 25, 25],

    gray: [100, 100, 100],

    border: [35, 35, 35],

    white: [255, 255, 255],

}


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


/* ============================================================
   ENCABEZADO GENERAL
============================================================ */

function addPageHeader(
    doc,
    title,
    subtitle
) {

    const pageWidth =
        doc.internal.pageSize.getWidth()


    /*
     * Logo Nike estilizado
     */

    doc.setFont(
        'helvetica',
        'bold'
    )

    doc.setFontSize(14)

    doc.setTextColor(
        ...COLORS.dark
    )

    doc.text(
        'NIKE STAFF PLANNER',
        14,
        15
    )


    /*
     * Título
     */

    doc.setFont(
        'helvetica',
        'bold'
    )

    doc.setFontSize(10)

    doc.setTextColor(
        ...COLORS.dark
    )

    doc.text(
        title,
        pageWidth / 2,
        15,
        {
            align: 'center',
        }
    )


    /*
     * Subtítulo
     */

    doc.setFont(
        'helvetica',
        'bold'
    )

    doc.setFontSize(8.5)

    doc.text(
        subtitle,
        pageWidth / 2,
        21,
        {
            align: 'center',
        }
    )


    /*
     * Fecha
     */

    doc.setFont(
        'helvetica',
        'normal'
    )

    doc.setFontSize(7)

    doc.setTextColor(
        ...COLORS.gray
    )

    doc.text(
        `Generado: ${formatDate()}`,
        pageWidth - 14,
        15,
        {
            align: 'right',
        }
    )


    /*
     * Línea decorativa
     */

    doc.setDrawColor(
        ...COLORS.green
    )

    doc.setLineWidth(
        0.8
    )

    doc.line(
        14,
        27,
        pageWidth - 14,
        27
    )
}


/* ============================================================
   BARRA DE SECCIÓN
============================================================ */

function addSectionTitle(
    doc,
    {
        y,
        title,
        color,
        icon = '',
    }
) {

    const pageWidth =
        doc.internal.pageSize.getWidth()

    const margin = 14

    const width =
        pageWidth - margin * 2


    /*
     * Fondo
     */

    doc.setFillColor(
        ...color
    )

    doc.roundedRect(
        margin,
        y,
        width,
        13,
        3,
        3,
        'F'
    )


    /*
     * Icono / símbolo
     */

    doc.setFont(
        'helvetica',
        'bold'
    )

    doc.setFontSize(11)

    doc.setTextColor(
        ...COLORS.white
    )

    doc.text(
        icon,
        margin + 6,
        y + 8.7
    )


    /*
     * Título
     */

    doc.setFont(
        'helvetica',
        'bold'
    )

    doc.setFontSize(15)

    doc.text(
        title,
        margin + 15,
        y + 8.8
    )
}


/* ============================================================
   PIE DE PÁGINA
============================================================ */

function addFooter(
    doc,
    pageNumber,
    totalPages
) {

    const pageWidth =
        doc.internal.pageSize.getWidth()

    const pageHeight =
        doc.internal.pageSize.getHeight()


    /*
     * Línea
     */

    doc.setDrawColor(
        ...COLORS.green
    )

    doc.setLineWidth(
        0.7
    )

    doc.line(
        14,
        pageHeight - 17,
        pageWidth - 14,
        pageHeight - 17
    )


    /*
     * Ubicación
     */

    doc.setFont(
        'helvetica',
        'bold'
    )

    doc.setFontSize(7)

    doc.setTextColor(
        ...COLORS.dark
    )

    doc.text(
        'Nike Quicentro',
        14,
        pageHeight - 8
    )


    /*
     * Nombre
     */

    doc.text(
        'Nike Staff Planner',
        pageWidth / 2,
        pageHeight - 8,
        {
            align: 'center',
        }
    )


    /*
     * Página
     */

    doc.text(
        `Página ${pageNumber} de ${totalPages}`,
        pageWidth - 14,
        pageHeight - 8,
        {
            align: 'right',
        }
    )
}


/* ============================================================
   PÁGINA 1
   A15 + LIMPIEZA
   HORIZONTAL
============================================================ */

function addActivitiesPage(
    doc,
    a15Assignments,
    cleaningAssignments
) {

    /*
     * La primera página se crea horizontalmente.
     */

    addPageHeader(
        doc,
        'PLANIFICACIÓN DE ACTIVIDADES',
        'Distribución semanal de A15 y Limpieza'
    )


    /*
     * Título de sección
     */

    addSectionTitle(
        doc,
        {
            y: 34,
            title: 'A15 Y LIMPIEZA',
            color: COLORS.purple,
        }
    )


    /*
     * Construcción de filas
     */

    const rows = []


    DAYS.forEach(
        (day) => {

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

        }
    )


    /*
     * Tabla
     */

    autoTable(
        doc,
        {

            startY: 51,

            head: [[
                'DÍA',
                'A15',
                'INGRESO',
                'LIMPIEZA',
                'INGRESO',
            ]],

            body: rows,

            theme: 'grid',

            styles: {

                font:
                    'helvetica',

                fontSize:
                    FONT_SIZE_ACTIVITIES,

                cellPadding:
                    4.5,

                textColor:
                    COLORS.dark,

                lineColor:
                    COLORS.border,

                lineWidth:
                    0.35,

                valign:
                    'middle',

            },

            headStyles: {

                fillColor:
                    COLORS.purple,

                textColor:
                    COLORS.white,

                fontStyle:
                    'bold',

                fontSize:
                    10,

                halign:
                    'center',

                valign:
                    'middle',

            },

            alternateRowStyles: {

                fillColor:
                    COLORS.purpleLight,

            },

            columnStyles: {

                0: {
                    cellWidth: 34,
                    fontStyle: 'bold',
                    halign: 'center',
                },

                1: {
                    cellWidth: 76,
                },

                2: {
                    cellWidth: 25,
                    halign: 'center',
                },

                3: {
                    cellWidth: 76,
                },

                4: {
                    cellWidth: 25,
                    halign: 'center',
                },

            },

            margin: {

                left: 14,

                right: 14,

                bottom: 24,

            },

        }
    )


    /*
     * Mensaje inferior
     */

    // const finalY =
    //     doc.lastAutoTable.finalY


    // doc.setFillColor(
    //     ...COLORS.purpleLight
    // )

    // doc.setDrawColor(
    //     ...COLORS.purple
    // )

    // doc.roundedRect(
    //     18,
    //     finalY + 12,
    //     doc.internal.pageSize.getWidth() - 36,
    //     15,
    //     3,
    //     3,
    //     'FD'
    // )


    // doc.setFont(
    //     'helvetica',
    //     'normal'
    // )

    // doc.setFontSize(8)

    // doc.setTextColor(
    //     ...COLORS.dark
    // )

    // doc.text(
    //     '- Las asignaciones se generan automáticamente según las reglas de planificación configuradas.',
    //     25,
    //     finalY + 21
    // )
}


/* ============================================================
   PÁGINA 2
   ALMUERZOS + ZONAS
   VERTICAL
============================================================ */

function addOperationsPage(
    doc,
    lunchAssignments,
    zoneAssignments
) {

    /*
     * IMPORTANTE:
     *
     * Esta página es vertical.
     */

    addPageHeader(
        doc,
        'PLANIFICACIÓN DE OPERACIONES',
        'Distribución de almuerzos y zonas del piso de ventas'
    )


    /* ========================================================
       ALMUERZOS
    ======================================================== */

    addSectionTitle(
        doc,
        {
            y: 33,
            title: 'ALMUERZOS',
            color: COLORS.green,
        }
    )


    /*
     * Construir una sola fila por día.
     *
     * Cada columna corresponde a un horario.
     * Esto ahorra muchísimo espacio vertical.
     */

    const lunchRows = []


    DAYS.forEach(
        (day) => {

            const result =
                lunchAssignments?.[
                    day.id
                ]


            const assignments =
                result?.assignments ||
                []


            const cells = []


            LUNCH_TIMES.forEach(
                (time) => {

                    const people =
                        assignments.filter(
                            (assignment) =>
                                assignment.lunchShift ===
                                time.shift
                        )


                    if (
                        people.length ===
                        0
                    ) {

                        cells.push(
                            '—'
                        )

                        return
                    }


                    const names =
                        people.map(
                            (person) =>
                                safeText(
                                    person.employeeName
                                )
                        )


                    cells.push(
                        names.join(
                            '\n'
                        )
                    )

                }
            )


            lunchRows.push([
                day.name,
                ...cells,
            ])

        }
    )


    autoTable(
        doc,
        {

            startY: 49,

            head: [[

                'DÍA',

                '12:30 - 13:30',

                '13:30 - 14:30',

                '14:30 - 15:30',

                '15:30 - 16:30',

            ]],

            body:
                lunchRows,

            theme:
                'grid',

            styles: {

                font:
                    'helvetica',

                fontSize:
                    FONT_SIZE_LUNCH,

                cellPadding:
                    2.8,

                textColor:
                    COLORS.dark,

                lineColor:
                    COLORS.border,

                lineWidth:
                    0.35,

                valign:
                    'middle',

            },

            headStyles: {

                fillColor:
                    COLORS.green,

                textColor:
                    COLORS.white,

                fontStyle:
                    'bold',

                fontSize:
                    7.5,

                halign:
                    'center',

                valign:
                    'middle',

            },

            alternateRowStyles: {

                fillColor:
                    COLORS.greenLight,

            },

            columnStyles: {

                0: {

                    cellWidth:
                        25,

                    fontStyle:
                        'bold',

                    halign:
                        'center',

                },

                1: {
                    cellWidth:
                        38,
                },

                2: {
                    cellWidth:
                        38,
                },

                3: {
                    cellWidth:
                        38,
                },

                4: {
                    cellWidth:
                        38,
                },

            },

            margin: {

                left:
                    14,

                right:
                    14,

                bottom:
                    15,

            },

        }
    )


    /*
     * Posición después de almuerzos
     */

    let currentY =
        doc.lastAutoTable.finalY + 6


    /* ========================================================
       ZONAS
    ======================================================== */

    addSectionTitle(
        doc,
        {
            y:
                currentY,

            title:
                'ZONAS DEL PISO DE VENTAS',

            color:
                COLORS.orange,
        }
    )


    currentY += 16


    /*
     * Construcción de filas.
     *
     * IMPORTANTE:
     *
     * Aquí NO mostramos hora de ingreso,
     * porque eso fue lo que permitió que
     * las zonas entren completas en la página.
     */

    const zoneRows = []


    DAYS.forEach(
        (day) => {

            const result =
                zoneAssignments?.[
                    day.id
                ]


            const assignments =
                result?.assignments ||
                []


            const byZone = {

                zone1:
                    [],

                zone2:
                    [],

                zone3:
                    [],

                zone4:
                    [],

                accessories:
                    [],

            }


            assignments.forEach(
                (assignment) => {

                    const zone =
                        safeText(
                            assignment.zoneName
                        ).toLowerCase()


                    let target =
                        null


                    if (
                        zone.includes(
                            'zona 1'
                        )
                    ) {

                        target =
                            byZone.zone1

                    } else if (
                        zone.includes(
                            'zona 2'
                        )
                    ) {

                        target =
                            byZone.zone2

                    } else if (
                        zone.includes(
                            'zona 3'
                        )
                    ) {

                        target =
                            byZone.zone3

                    } else if (
                        zone.includes(
                            'zona 4'
                        )
                    ) {

                        target =
                            byZone.zone4

                    } else {

                        target =
                            byZone.accessories

                    }


                    if (
                        target
                    ) {

                        target.push(
                            safeText(
                                assignment.employeeName
                            )
                        )

                    }

                }
            )


            zoneRows.push([

                day.name,

                byZone.zone1.join(
                    '\n'
                ) || '—',

                byZone.zone2.join(
                    '\n'
                ) || '—',

                byZone.zone3.join(
                    '\n'
                ) || '—',

                byZone.zone4.join(
                    '\n'
                ) || '—',

                byZone.accessories.join(
                    '\n'
                ) || '—',

            ])

        }
    )


    autoTable(
        doc,
        {

            startY:
                currentY,

            head: [[

                'DÍA',

                'ZONA 1',

                'ZONA 2',

                'ZONA 3',

                'ZONA 4',

                'ACC/ESPEJOS',

            ]],

            body:
                zoneRows,

            theme:
                'grid',

            styles: {

                font:
                    'helvetica',

                fontSize:
                    FONT_SIZE_ZONES,

                cellPadding:
                    2.4,

                textColor:
                    COLORS.dark,

                lineColor:
                    COLORS.border,

                lineWidth:
                    0.35,

                valign:
                    'middle',

            },

            headStyles: {

                fillColor:
                    COLORS.orange,

                textColor:
                    COLORS.white,

                fontStyle:
                    'bold',

                fontSize:
                    6.2,

                halign:
                    'center',

                valign:
                    'middle',

            },

            alternateRowStyles: {

                fillColor:
                    COLORS.orangeLight,

            },

            columnStyles: {

                0: {

                    cellWidth:
                        20,

                    fontStyle:
                        'bold',

                    halign:
                        'center',

                },

                1: {
                    cellWidth:
                        34,
                },

                2: {
                    cellWidth:
                        34,
                },

                3: {
                    cellWidth:
                        34,
                },

                4: {
                    cellWidth:
                        34,
                },

                5: {
                    cellWidth:
                        26,
                },

            },

            margin: {

                left:
                    14,

                right:
                    14,

                bottom:
                    20,

            },

        }
    )
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

        /*
         * ====================================================
         * PÁGINA 1
         *
         * HORIZONTAL
         * ====================================================
         */

        const doc =
            new jsPDF({

                orientation:
                    'landscape',

                unit:
                    'mm',

                format:
                    'a4',

            })


        /*
         * Página 1:
         *
         * A15 + Limpieza
         */

        addActivitiesPage(
            doc,
            a15Assignments,
            cleaningAssignments
        )


        /*
         * ====================================================
         * PÁGINA 2
         *
         * VERTICAL
         * ====================================================
         *
         * Esta es la parte importante:
         *
         * jsPDF permite crear la siguiente página
         * con orientación diferente.
         */

        doc.addPage(
            'a4',
            'portrait'
        )


        /*
         * Página 2:
         *
         * Almuerzos + Zonas
         */

        addOperationsPage(
            doc,
            lunchAssignments,
            zoneAssignments
        )


        /*
         * ====================================================
         * PIE DE PÁGINA
         * ====================================================
         */

        const totalPages =
            doc.internal.getNumberOfPages()


        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            doc.setPage(
                page
            )

            addFooter(
                doc,
                page,
                totalPages
            )

        }


        /*
         * ====================================================
         * GENERAR BLOB
         * ====================================================
         */

        const pdfBlob =
            doc.output(
                'blob'
            )


        const pdfUrl =
            URL.createObjectURL(
                pdfBlob
            )


        /*
         * ====================================================
         * ABRIR PDF
         * ====================================================
         */

        const newWindow =
            window.open(
                pdfUrl,
                '_blank'
            )


        /*
         * Si el navegador bloquea
         * la ventana emergente.
         */

        if (
            !newWindow
        ) {

            doc.save(
                'planificacion-semanal.pdf'
            )

            URL.revokeObjectURL(
                pdfUrl
            )

            return

        }


        /*
         * Liberar memoria posteriormente.
         */

        setTimeout(
            () => {

                URL.revokeObjectURL(
                    pdfUrl
                )

            },
            60000
        )

    } catch (
        error
    ) {

        console.error(
            'ERROR AL GENERAR PDF:',
            error
        )


        alert(
            'No se pudo generar el PDF de la planificación.'
        )

    }

}