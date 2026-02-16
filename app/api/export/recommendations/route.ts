import { NextRequest, NextResponse } from 'next/server';
import {
  exportRecommendationsToCSV,
  exportRecommendationsToExcel,
  filterRecommendations,
} from '@/lib/export';
import { OverallStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv'; // csv or xlsx
    const status = searchParams.get('status') as OverallStatus | 'all' | null;
    const chapter = searchParams.get('chapter');
    const owner = searchParams.get('owner');
    const tag = searchParams.get('tag');
    
    // Filter recommendations based on query params
    const recommendations = await filterRecommendations(
      status || 'all',
      chapter ? parseInt(chapter) : 'all',
      owner || 'all',
      tag || undefined
    );
    
    // Generate filename with filters
    const dateStr = new Date().toISOString().split('T')[0];
    let filename = `animal-welfare-commitments-${dateStr}`;
    
    if (status && status !== 'all') {
      filename += `-${status}`;
    }
    if (chapter) {
      filename += `-chapter${chapter}`;
    }
    if (owner && owner !== 'all') {
      filename += `-${owner}`;
    }
    if (tag) {
      filename += `-${tag}`;
    }
    
    if (format === 'xlsx') {
      const buffer = await exportRecommendationsToExcel(recommendations);
      filename += '.xlsx';
      
      return new NextResponse(buffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } else {
      const csv = await exportRecommendationsToCSV(recommendations);
      filename += '.csv';
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export recommendations' },
      { status: 500 }
    );
  }
}

