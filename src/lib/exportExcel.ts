import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import type { Column } from 'react-data-grid'

export async function exportToExcel<R>(
  rows: R[],
  columns: readonly Column<R, unknown>[],
  fileName: string = 'export',
) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')

  // Định nghĩa các cột cho file Excel (Trừ đi các cột hành động như Checkbox, STT nếu không muốn)
  // Trong react-data-grid, name của cột là column.name. Kiểu render có thể là element, nên chắt lọc ra.
  const validColumns = columns.filter(
    (col) => typeof col.name === 'string' && col.key !== 'select-row',
  )

  worksheet.columns = validColumns.map((col) => ({
    header: col.name as string,
    key: col.key,
    width: col.width ? Number(col.width) / 10 : 20, // Tạm tính width theo Excel
  }))

  // Thêm dữ liệu từng dòng
  rows.forEach((row: R) => {
    // Trích xuất dữ liệu thô (nếu bạn có nested structue thì cần map lại, ở đây giả sử là object phẳng)
    const rowData: Record<string, unknown> = {}
    validColumns.forEach((col) => {
      rowData[col.key] = row[col.key as keyof R]
    })
    worksheet.addRow(rowData)
  })

  // Đổ format đẹp cho Header (in đậm, nền màu)
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }, // Màu xanh dương nhạt
    }
  })

  // Xuất file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, `${fileName}.xlsx`)
}
