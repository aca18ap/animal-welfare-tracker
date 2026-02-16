import { NextRequest, NextResponse } from 'next/server';
import {
  exportDepartmentsToCSV,
  exportDepartmentsToExcel,
} from '@/lib/export';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv'; // csv or xlsx
    
    // Generate filename
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `animal-welfare-organisations-${dateStr}`;
    
    if (format === 'xlsx') {
      const buffer = await exportDepartmentsToExcel();
      
      return new NextResponse(buffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
        },
      });
    } else {
      const csv = await exportDepartmentsToCSV();
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export departments' },
      { status: 500 }
    );
  }
}

