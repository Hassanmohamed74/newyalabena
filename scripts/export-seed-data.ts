import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../src/database/data-source';
import { Workbook } from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';

const TABLES = [
  'users', 'roles', 'permissions', 'user_roles', 'branches',
  'courses', 'course_branch_pricing', 'classrooms',
  'employees', 'students', 'student_profiles',
  'groups', 'group_students', 'group_schedules',
  'sessions', 'attendances',
  'leads', 'enrollments',
  'invoices', 'invoice_items', 'payments', 'installments', 'refunds', 'financial_transactions',
  'payroll_periods', 'payroll_entries',
  'leave_requests',
  'teacher_availabilities', 'teacher_evaluations',
  'chat_rooms', 'chat_room_members', 'chat_messages', 'chat_violations', 'chat_strikes',
  'test_slots', 'placement_tests', 'test_questions', 'placement_test_answers',
  'lms_modules', 'lms_lessons', 'lms_resources',
  'quizzes', 'quiz_questions', 'quiz_attempts',
  'assignments', 'submissions',
  'gradebook_categories', 'gradebook_entries',
  'activities', 'activity_registrations', 'activity_photos',
  'inventory_items', 'stock_levels', 'stock_moves', 'student_item_issues',
  'certificate_templates', 'certificates',
  'promo_codes', 'referrals', 'sales_targets',
  'notifications', 'notification_preferences',
  'audit_logs', 'waitlists',
  'course_materials', 'course_prerequisites',
  'follow_ups', 'lead_activities', 'lead_tags', 'lead_tag_pivot',
  'kb_categories', 'kb_articles', 'kb_article_versions',
  'student_level_history', 'student_surveys', 'testimonials', 'blog_posts',
  'employee_documents', 'chat_consents',
  'settings',
];

export async function exportSeedData() {
  const pgOptions = dataSourceOptions as any;
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const timestamp = new Date().toISOString().replace(/[:-]/g, '').slice(0, 13);
  const filename = `seed-data-${timestamp}.xlsx`;
  const outputPath = path.join(__filename, '..', filename);

  const workbook = new Workbook();

  for (const tableName of TABLES) {
    try {
      const rows = await dataSource.query(`SELECT * FROM "${tableName}" ORDER BY 1 LIMIT 1000`);
      if (rows.length === 0) continue;

      const worksheet = workbook.addWorksheet(tableName);
      const columns = Object.keys(rows[0]);
      worksheet.columns = columns.map(col => ({ header: col, key: col, width: 30 }));
      worksheet.addRows(rows);
      console.log(`Exported ${tableName}: ${rows.length} rows`);
    } catch (error) {
      console.warn(`Skipped ${tableName}: ${error.message}`);
    }
  }

  await workbook.xlsx.writeFile(outputPath);
  console.log(`\\nExport complete: ${outputPath}`);

  await dataSource.destroy();
}

exportSeedData().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});