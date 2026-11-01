import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Branch } from '../../shared/entities/branch.entity';
import { BranchStatus } from '../../common/enums/branch-status.enum';
import { User } from '../../shared/entities/user.entity';
import { UserStatus } from '../../common/enums/user-status.enum';
import { Role } from '../../shared/entities/role.entity';
import { Permission } from '../../shared/entities/permission.entity';
import { UserRole } from '../../shared/entities/user-role.entity';
import { Setting } from '../../shared/entities/setting.entity';
import { Course } from '../../shared/entities/course.entity';
import { CourseStatus } from '../../common/enums/course-status.enum';
import { Classroom } from '../../shared/entities/classroom.entity';
import { Employee } from '../../shared/entities/employee.entity';
import { EmployeeType } from '../../common/enums/employee-type.enum';
import { EmployeeStatus } from '../../common/enums/employee-status.enum';
import { Student } from '../../shared/entities/student.entity';
import { StudentStatus } from '../../common/enums/student-status.enum';
import { StudentProfile } from '../../shared/entities/student-profile.entity';
import { Group } from '../../shared/entities/group.entity';
import { GroupMode } from '../../common/enums/group-mode.enum';
import { GroupStatus } from '../../common/enums/group-status.enum';
import { GroupStudent } from '../../shared/entities/group-student.entity';
import { GroupSchedule } from '../../shared/entities/group-schedule.entity';
import { Session } from '../../shared/entities/session.entity';
import { Attendance } from '../../shared/entities/attendance.entity';
import { AttendanceStatus } from '../../common/enums/attendance-status.enum';
import { CheckInMethod } from '../../common/enums/check-in-method.enum';
import { Lead } from '../../shared/entities/lead.entity';
import { LeadStatus } from '../../common/enums/lead-status.enum';
import { LeadSource } from '../../common/enums/lead-source.enum';
import { Enrollment } from '../../shared/entities/enrollment.entity';
import { EnrollmentStatus } from '../../common/enums/enrollment-status.enum';
import { Refund } from '../../shared/entities/refund.entity';
import { RefundReason } from '../../common/enums/refund-reason.enum';
import { RefundStatus } from '../../common/enums/refund-status.enum';
import { FinancialTransaction } from '../../shared/entities/financial-transaction.entity';
import { FinancialTransactionType } from '../../common/enums/financial-transaction-type.enum';
import { TransactionDirection } from '../../common/enums/transaction-direction.enum';
import { LmsModule } from '../../shared/entities/lms-module.entity';
import { LmsLesson } from '../../shared/entities/lms-lesson.entity';
import { LessonType } from '../../common/enums/lesson-type.enum';
import { LmsResource } from '../../shared/entities/lms-resource.entity';
import { ResourceType } from '../../common/enums/resource-type.enum';
import { ResourceAccess } from '../../common/enums/resource-access.enum';
import { Quiz } from '../../shared/entities/quiz.entity';
import { ReleaseType } from '../../common/enums/release-type.enum';
import { QuizQuestion } from '../../shared/entities/quiz-question.entity';
import { QuizAttempt } from '../../shared/entities/quiz-attempt.entity';
import { AttemptStatus } from '../../common/enums/attempt-status.enum';
import { Assignment } from '../../shared/entities/assignment.entity';
import { AssignmentType } from '../../common/enums/assignment-type.enum';
import { Submission } from '../../shared/entities/submission.entity';
import { SubmissionStatus } from '../../common/enums/submission-status.enum';
import { GradebookCategory } from '../../shared/entities/gradebook-category.entity';
import { GradebookEntry } from '../../shared/entities/gradebook-entry.entity';
import { Activity } from '../../shared/entities/activity.entity';
import { ActivityEventType } from '../../common/enums/activity-event-type.enum';
import { ActivityStatus } from '../../common/enums/activity-status.enum';
import { ActivityRegistration } from '../../shared/entities/activity-registration.entity';
import { RegistrationStatus } from '../../common/enums/registration-status.enum';
import { ActivityPhoto } from '../../shared/entities/activity-photo.entity';
import { InventoryItem } from '../../shared/entities/inventory-item.entity';
import { InventoryCategory } from '../../common/enums/inventory-category.enum';
import { InventoryStatus } from '../../common/enums/inventory-status.enum';
import { StockLevel } from '../../shared/entities/stock-level.entity';
import { StockMove } from '../../shared/entities/stock-move.entity';
import { StockMoveType } from '../../common/enums/stock-move-type.enum';
import { StudentItemIssue } from '../../shared/entities/student-item-issue.entity';
import { ItemCondition } from '../../common/enums/item-condition.enum';
import { CertificateTemplate } from '../../shared/entities/certificate-template.entity';
import { Certificate } from '../../shared/entities/certificate.entity';
import { CertStatus } from '../../common/enums/cert-status.enum';
import { PromoCode } from '../../shared/entities/promo-code.entity';
import { PromoType } from '../../common/enums/promo-type.enum';
import { Referral } from '../../shared/entities/referral.entity';
import { SalesTarget } from '../../shared/entities/sales-target.entity';
import { Notification } from '../../shared/entities/notification.entity';
import { NotificationPreference } from '../../shared/entities/notification-preference.entity';
import { NotificationChannel } from '../../common/enums/notification-channel.enum';
import { AuditLog } from '../../shared/entities/audit-log.entity';
import { ActorType } from '../../common/enums/actor-type.enum';
import { Waitlist } from '../../shared/entities/waitlist.entity';
import { CourseMaterial } from '../../shared/entities/course-material.entity';
import { CoursePrerequisite } from '../../shared/entities/course-prerequisite.entity';
import { FollowUp } from '../../shared/entities/follow-up.entity';
import { FollowUpStatus } from '../../common/enums/follow-up-status.enum';
import { LeadActivity } from '../../shared/entities/lead-activity.entity';
import { ActivityType } from '../../common/enums/activity-type.enum';
import { LeadTag } from '../../shared/entities/lead-tag.entity';
import { LeadTagPivot } from '../../shared/entities/lead-tag-pivot.entity';
import { KbCategory } from '../../shared/entities/kb-category.entity';
import { KbVisibility } from '../../common/enums/kb-visibility.enum';
import { KbArticle } from '../../shared/entities/kb-article.entity';
import { KbArticleVersion } from '../../shared/entities/kb-article-version.entity';
import { StudentLevelHistory } from '../../shared/entities/student-level-history.entity';
import { StudentSurvey } from '../../shared/entities/student-survey.entity';
import { Testimonial } from '../../shared/entities/testimonial.entity';
import { TestimonialStatus } from '../../common/enums/testimonial-status.enum';
import { BlogPost } from '../../shared/entities/blog-post.entity';
import { PostStatus } from '../../common/enums/post-status.enum';
import { EmployeeDocument } from '../../shared/entities/employee-document.entity';
import { DocumentType } from '../../common/enums/document-type.enum';
import { ChatConsent } from '../../shared/entities/chat-consent.entity';
const PASSWORD_DEFAULT = 'password123';
const PASSWORD_ADMIN = 'admin123456';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBool(probability = 0.5): boolean {
  return Math.random() < probability;
}

const NOW = new Date();
const TWELVE_MONTHS_AGO = new Date(NOW.getFullYear() - 1, NOW.getMonth(), NOW.getDate());
const THREE_MONTHS_FROM_NOW = new Date(NOW.getFullYear(), NOW.getMonth() + 3, NOW.getDate());

const levels = ['A1', 'A2', 'B1', 'B1+', 'B2', 'C1', 'C2'];

export async function seedComprehensive(dataSource: DataSource) {
  console.log('\n=== Starting Comprehensive Seed ===\n');

  // ============================================================================
  // 1. BRANCHES
  // ============================================================================
  console.log('Seeding branches...');
  const branchRepo = dataSource.getRepository(Branch);

  const cairoId = faker.string.uuid();
  const alexandriaId = faker.string.uuid();
  const onlineId = faker.string.uuid();

  const branches = await branchRepo.save([
    branchRepo.create({
      id: cairoId,
      name: 'Cairo Main Branch',
      address: '45 Talaat Harb Street, Downtown, Cairo, Egypt',
      phone: '+20225789012',
      email: 'cairo@speakup.com',
      status: BranchStatus.ACTIVE,
      classroom_count: 5,
      logo_url: 'https://speakup.com/logos/cairo-main.png',
    }),
    branchRepo.create({
      id: alexandriaId,
      name: 'Alexandria Branch',
      address: '123 Fouad Street, Alexandria, Egypt',
      phone: '+2033882233',
      email: 'alexandria@speakup.com',
      status: BranchStatus.ACTIVE,
      classroom_count: 3,
      logo_url: 'https://speakup.com/logos/alexandria.png',
    }),
    branchRepo.create({
      id: onlineId,
      name: 'Online Campus',
      address: 'Virtual - Online Learning Platform',
      phone: '+20220000000',
      email: 'online@speakup.com',
      status: BranchStatus.ACTIVE,
      classroom_count: 0,
      logo_url: 'https://speakup.com/logos/online.png',
    }),
  ]);

  // ============================================================================
  // 2. ROLES
  // ============================================================================
  console.log('Seeding roles...');
  const roleRepo = dataSource.getRepository(Role);

  const roleSlugs = [
    'super_admin', 'branch_manager', 'sales', 'finance', 'academic',
    'teacher', 'student', 'moderator', 'hr', 'auditor',
  ];
  const roleNames = [
    'Super Admin', 'Branch Manager', 'Sales', 'Finance Officer', 'Academic Coordinator',
    'Teacher', 'Student', 'Moderator', 'HR Officer', 'Read-only Auditor',
  ];
  const roleDescriptions = [
    'Full system control',
    'Day-to-day branch oversight',
    'CRM, registration, payments',
    'Invoicing, installments, reconciliation',
    'Course and group management',
    'LMS, attendance, grading, chat',
    'Self-service portal, classes, payments, chat',
    'Live chat oversight & flag review',
    'Employee records and payroll',
    'View-only access for compliance',
  ];

  const roles: Role[] = [];
  for (let i = 0; i < roleSlugs.length; i++) {
    let role = await roleRepo.findOne({ where: { slug: roleSlugs[i] } });
    if (!role) {
      role = await roleRepo.save(roleRepo.create({
        name: roleNames[i],
        slug: roleSlugs[i],
        description: roleDescriptions[i],
        is_system: true,
      }));
    }
    roles.push(role);
  }
  console.log(`  ${roles.length} roles seeded.`);

  // ============================================================================
  // 3. PERMISSIONS
  // ============================================================================
  console.log('Seeding permissions...');
  const permissionRepo = dataSource.getRepository(Permission);

  const permissions = [
    { module: 'crm', action: 'view', description: 'View leads and students' },
    { module: 'crm', action: 'create', description: 'Create leads and students' },
    { module: 'crm', action: 'edit', description: 'Edit leads and students' },
    { module: 'crm', action: 'delete', description: 'Delete/archive leads' },
    { module: 'crm', action: 'assign', description: 'Assign leads to agents' },
    { module: 'users', action: 'read', description: 'Read users' },
    { module: 'users', action: 'create', description: 'Create users' },
    { module: 'users', action: 'edit', description: 'Edit users' },
    { module: 'users', action: 'delete', description: 'Deactivate users' },
    { module: 'users', action: 'assign_role', description: 'Assign roles to users' },
    { module: 'sales', action: 'view', description: 'View sales dashboards' },
    { module: 'sales', action: 'create', description: 'Create promotions and targets' },
    { module: 'sales', action: 'edit', description: 'Edit sales data' },
    { module: 'sales', action: 'approve', description: 'Approve discounts' },
    { module: 'placement', action: 'view', description: 'View test results' },
    { module: 'placement', action: 'create', description: 'Schedule tests' },
    { module: 'placement', action: 'edit', description: 'Score and override levels' },
    { module: 'placement', action: 'delete', description: 'Cancel test appointments' },
    { module: 'groups', action: 'view', description: 'View groups and schedules' },
    { module: 'groups', action: 'create', description: 'Create groups' },
    { module: 'groups', action: 'edit', description: 'Edit groups and schedules' },
    { module: 'groups', action: 'delete', description: 'Cancel groups' },
    { module: 'attendance', action: 'view', description: 'View attendance reports' },
    { module: 'attendance', action: 'create', description: 'Record attendance' },
    { module: 'attendance', action: 'edit', description: 'Edit attendance records' },
    { module: 'attendance', action: 'lock', description: 'Lock attendance after deadline' },
    { module: 'lms', action: 'view', description: 'View content and grades' },
    { module: 'lms', action: 'create', description: 'Create modules, lessons, assignments' },
    { module: 'lms', action: 'edit', description: 'Edit LMS content' },
    { module: 'lms', action: 'delete', description: 'Delete LMS content' },
    { module: 'lms', action: 'grade', description: 'Grade submissions and quizzes' },
    { module: 'chat', action: 'view', description: 'View chat messages' },
    { module: 'chat', action: 'send', description: 'Send messages' },
    { module: 'chat', action: 'moderate', description: 'Moderate and review violations' },
    { module: 'chat', action: 'ban', description: 'Ban users from chat' },
    { module: 'finance', action: 'view', description: 'View invoices and payments' },
    { module: 'finance', action: 'create', description: 'Create invoices and record payments' },
    { module: 'finance', action: 'edit', description: 'Edit financial records' },
    { module: 'finance', action: 'approve', description: 'Approve refunds' },
    { module: 'finance', action: 'export', description: 'Export financial reports' },
    { module: 'certificates', action: 'view', description: 'View certificates' },
    { module: 'certificates', action: 'create', description: 'Issue certificates' },
    { module: 'certificates', action: 'edit', description: 'Edit certificate templates' },
    { module: 'certificates', action: 'revoke', description: 'Revoke certificates' },
    { module: 'hr', action: 'view', description: 'View employee records' },
    { module: 'hr', action: 'create', description: 'Create employee records' },
    { module: 'hr', action: 'edit', description: 'Edit employee records' },
    { module: 'hr', action: 'approve', description: 'Approve leave requests' },
    { module: 'hr', action: 'process_payroll', description: 'Process payroll' },
    { module: 'activities', action: 'view', description: 'View activities' },
    { module: 'activities', action: 'create', description: 'Create activities' },
    { module: 'activities', action: 'edit', description: 'Edit activities' },
    { module: 'activities', action: 'delete', description: 'Cancel activities' },
    { module: 'inventory', action: 'view', description: 'View stock levels' },
    { module: 'inventory', action: 'create', description: 'Add inventory items' },
    { module: 'inventory', action: 'edit', description: 'Adjust stock' },
    { module: 'inventory', action: 'issue', description: 'Issue items to students' },
    { module: 'kb', action: 'view', description: 'View articles' },
    { module: 'kb', action: 'create', description: 'Create articles' },
    { module: 'kb', action: 'edit', description: 'Edit articles' },
    { module: 'kb', action: 'delete', description: 'Delete articles' },
    { module: 'reports', action: 'view', description: 'View reports and analytics' },
    { module: 'reports', action: 'export', description: 'Export reports' },
    { module: 'branches', action: 'view', description: 'View branch data' },
    { module: 'branches', action: 'create', description: 'Create branches' },
    { module: 'branches', action: 'edit', description: 'Edit branches' },
    { module: 'branches', action: 'delete', description: 'Close branches' },
    { module: 'system', action: 'view', description: 'View system settings' },
    { module: 'system', action: 'edit', description: 'Edit system settings' },
    { module: 'system', action: 'manage_roles', description: 'Manage roles and permissions' },
    { module: 'system', action: 'audit', description: 'View audit logs' },
  ];
  const permissionEntities: Permission[] = [];
  for (const perm of permissions) {
    let p = await permissionRepo.findOne({ where: { module: perm.module, action: perm.action } });
    if (!p) {
      p = await permissionRepo.save(permissionRepo.create(perm));
    }
    permissionEntities.push(p);
  }
  console.log(`  ${permissionEntities.length} permissions seeded.`);

  // ============================================================================
  // 4. ROLE-PERMISSION MATRIX
  // ============================================================================
  console.log('Assigning role permissions...');

  const matrix: Record<string, string[]> = {
    super_admin: ['*'],
    branch_manager: [
      'crm:view', 'crm:create', 'crm:edit', 'crm:delete', 'crm:assign',
      'sales:view', 'placement:view',
      'groups:view', 'groups:create', 'groups:edit', 'groups:delete',
      'attendance:view', 'attendance:create', 'attendance:edit',
      'lms:view', 'finance:view', 'finance:create',
      'certificates:view', 'certificates:create',
      'activities:view', 'activities:create', 'activities:edit', 'activities:delete',
      'inventory:view', 'inventory:create', 'inventory:edit', 'inventory:issue',
      'kb:view', 'reports:view', 'reports:export', 'branches:view',
      'users:read', 'users:create', 'users:edit',
      'chat:view', 'chat:send', 'system:view',
    ],
    sales: [
      'crm:view', 'crm:create', 'crm:edit',
      'sales:view', 'sales:create', 'sales:edit',
      'placement:view', 'groups:view', 'attendance:view', 'lms:view',
      'inventory:view', 'inventory:issue', 'activities:view', 'kb:view',
      'chat:view', 'chat:send',
    ],
    finance: [
      'finance:view', 'finance:create', 'finance:edit', 'finance:approve', 'finance:export',
      'certificates:view', 'crm:view', 'inventory:view', 'reports:view', 'reports:export',
      'kb:view', 'chat:view',
    ],
    academic: [
      'placement:view', 'placement:create', 'placement:edit', 'placement:delete',
      'groups:view', 'groups:create', 'groups:edit', 'groups:delete',
      'attendance:view', 'attendance:create', 'attendance:edit', 'attendance:lock',
      'lms:view', 'lms:create', 'lms:edit', 'lms:delete', 'lms:grade',
      'certificates:view', 'certificates:create', 'certificates:edit', 'certificates:revoke',
      'reports:view', 'reports:export', 'kb:view', 'chat:view', 'chat:send',
    ],
    teacher: [
      'attendance:view', 'attendance:create', 'attendance:edit',
      'lms:view', 'lms:create', 'lms:edit', 'lms:grade',
      'groups:view', 'chat:view', 'chat:send', 'kb:view', 'reports:view',
    ],
    student: [
      'lms:view', 'chat:view', 'chat:send', 'activities:view', 'kb:view',
    ],
    moderator: [
      'chat:view', 'chat:moderate', 'chat:ban',
    ],
    hr: [
      'hr:view', 'hr:create', 'hr:edit', 'hr:approve', 'hr:process_payroll',
      'kb:view', 'kb:create', 'kb:edit', 'kb:delete', 'reports:view', 'chat:view',
    ],
    auditor: [
      'crm:view', 'sales:view', 'placement:view', 'groups:view', 'attendance:view',
      'lms:view', 'finance:view', 'certificates:view', 'hr:view',
      'activities:view', 'inventory:view', 'kb:view', 'reports:view',
      'branches:view', 'system:view', 'chat:view',
    ],
  };

  const permsByCode = new Map(permissionEntities.map(p => [`${p.module}:${p.action}`, p]));
  for (const role of roles) {
    const codes = matrix[role.slug];
    if (codes) {
      if (codes.includes('*')) {
        role.permissions = [...permissionEntities];
      } else {
        role.permissions = codes.map(c => permsByCode.get(c)!).filter(Boolean);
      }
      await roleRepo.save(role);
    }
  }
  console.log('  Role-permission matrix assigned.');

  // ============================================================================
  // 5. USERS
  // ============================================================================
  console.log('Seeding users...');
  const userRepo = dataSource.getRepository(User);
  const defaultPasswordHash = await hashPassword(PASSWORD_DEFAULT);
  const adminPasswordHash = await hashPassword(PASSWORD_ADMIN);

  const users: User[] = [];

  // Super admin
  let superAdmin = await userRepo.findOne({ where: { email: 'admin@speakup.com' } });
  if (!superAdmin) {
    superAdmin = await userRepo.save(userRepo.create({
      email: 'admin@speakup.com',
      password_hash: adminPasswordHash,
      first_name: 'Super',
      last_name: 'Admin',
      language: 'en',
      status: UserStatus.ACTIVE,
      two_factor_enabled: false,
    }));
  }
  users.push(superAdmin);

  // Branch managers
  const managerCairo = await userRepo.save(userRepo.create({
    email: 'manager.cairo@speakup.com',
    password_hash: defaultPasswordHash,
    first_name: 'Ahmed',
    last_name: 'Hassan',
    branch_id: cairoId,
    language: 'ar',
    status: UserStatus.ACTIVE,
  }));
  users.push(managerCairo);

  const managerAlex = await userRepo.save(userRepo.create({
    email: 'manager.alex@speakup.com',
    password_hash: defaultPasswordHash,
    first_name: 'Samy',
    last_name: 'Ibrahim',
    branch_id: alexandriaId,
    language: 'ar',
    status: UserStatus.ACTIVE,
  }));
  users.push(managerAlex);

  // Sales users (2)
  const salesUsers: User[] = [];
  for (let i = 0; i < 2; i++) {
    const u = await userRepo.save(userRepo.create({
      email: `sales.${i + 1}@speakup.com`,
      password_hash: defaultPasswordHash,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      branch_id: randomElement([cairoId, alexandriaId]),
      language: randomElement(['ar', 'en']),
      status: UserStatus.ACTIVE,
    }));
    salesUsers.push(u);
    users.push(u);
  }

  // Finance users (2)
  const financeUsers: User[] = [];
  for (let i = 0; i < 2; i++) {
    const u = await userRepo.save(userRepo.create({
      email: `finance.${i + 1}@speakup.com`,
      password_hash: defaultPasswordHash,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      branch_id: randomElement([cairoId, alexandriaId, onlineId]),
      language: randomElement(['ar', 'en']),
      status: UserStatus.ACTIVE,
    }));
    financeUsers.push(u);
    users.push(u);
  }

  // Academic users (2)
  const academicUsers: User[] = [];
  for (let i = 0; i < 2; i++) {
    const u = await userRepo.save(userRepo.create({
      email: `academic.${i + 1}@speakup.com`,
      password_hash: defaultPasswordHash,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      branch_id: randomElement([cairoId, alexandriaId]),
      language: randomElement(['ar', 'en']),
      status: UserStatus.ACTIVE,
    }));
    academicUsers.push(u);
    users.push(u);
  }

  // Teacher users (5)
  const teacherUsers: User[] = [];
  for (let i = 0; i < 5; i++) {
    const u = await userRepo.save(userRepo.create({
      email: `teacher.${i + 1}@speakup.com`,
      password_hash: defaultPasswordHash,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      branch_id: randomElement([cairoId, alexandriaId, onlineId]),
      language: randomElement(['ar', 'en']),
      status: UserStatus.ACTIVE,
    }));
    teacherUsers.push(u);
    users.push(u);
  }

  // Student users (20)
  const studentUsers: User[] = [];
  for (let i = 0; i < 20; i++) {
    const u = await userRepo.save(userRepo.create({
      email: `student.${i + 1}@speakup.com`,
      password_hash: defaultPasswordHash,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      branch_id: randomElement([cairoId, alexandriaId, onlineId]),
      language: randomElement(['ar', 'en']),
      status: UserStatus.ACTIVE,
    }));
    studentUsers.push(u);
    users.push(u);
  }

  // HR (1)
  const hrUser = await userRepo.save(userRepo.create({
    email: 'hr@speakup.com',
    password_hash: defaultPasswordHash,
    first_name: 'Hana',
    last_name: 'Mahmoud',
    branch_id: cairoId,
    language: 'ar',
    status: UserStatus.ACTIVE,
  }));
  users.push(hrUser);

  // Moderator (1)
  const moderatorUser = await userRepo.save(userRepo.create({
    email: 'moderator@speakup.com',
    password_hash: defaultPasswordHash,
    first_name: 'Omar',
    last_name: 'Salah',
    branch_id: onlineId,
    language: 'en',
    status: UserStatus.ACTIVE,
  }));
  users.push(moderatorUser);

  // Auditor (1)
  const auditorUser = await userRepo.save(userRepo.create({
    email: 'auditor@speakup.com',
    password_hash: defaultPasswordHash,
    first_name: 'Laila',
    last_name: 'Fouad',
    branch_id: cairoId,
    language: 'en',
    status: UserStatus.ACTIVE,
  }));
  users.push(auditorUser);

  console.log(`  ${users.length} users seeded.`);

  // ============================================================================
  // 6. USER_ROLES
  // ============================================================================
  console.log('Seeding user roles...');
  const userRoleRepo = dataSource.getRepository(UserRole);
  const rolesBySlug = new Map(roles.map(r => [r.slug, r]));

  const userRoleAssignments: Array<{ user: User; roleSlug: string }> = [
    { user: superAdmin, roleSlug: 'super_admin' },
    { user: managerCairo, roleSlug: 'branch_manager' },
    { user: managerAlex, roleSlug: 'branch_manager' },
    ...salesUsers.map(u => ({ user: u, roleSlug: 'sales' })),
    ...financeUsers.map(u => ({ user: u, roleSlug: 'finance' })),
    ...academicUsers.map(u => ({ user: u, roleSlug: 'academic' })),
    ...teacherUsers.map(u => ({ user: u, roleSlug: 'teacher' })),
    ...studentUsers.map(u => ({ user: u, roleSlug: 'student' })),
    { user: hrUser, roleSlug: 'hr' },
    { user: moderatorUser, roleSlug: 'moderator' },
    { user: auditorUser, roleSlug: 'auditor' },
  ];

  for (const { user, roleSlug } of userRoleAssignments) {
    const role = rolesBySlug.get(roleSlug);
    if (!role) continue;
    const exists = await userRoleRepo.findOne({
      where: { user_id: user.id, role_id: role.id },
    });
    if (!exists) {
      await userRoleRepo.save(userRoleRepo.create({
        user_id: user.id,
        role_id: role.id,
        assigned_by: superAdmin.id,
      }));
    }
  }
  console.log(`  ${userRoleAssignments.length} user-role assignments seeded.`);

  await dataSource.query(
    `UPDATE branches SET manager_id = $1 WHERE id = $2`,
    [managerCairo.id, cairoId],
  );
  await dataSource.query(
    `UPDATE branches SET manager_id = $1 WHERE id = $2`,
    [managerAlex.id, alexandriaId],
  );
  console.log('  Branch manager references updated.');

  // ============================================================================
  // 7. SETTINGS
  // ============================================================================
  console.log('Seeding settings...');
  const settingsData = [
    { key: 'academy_name', value: 'Speak Up English Academy', group: 'general', description: 'Academy display name' },
    { key: 'default_language', value: 'ar', group: 'general', description: 'Default UI language' },
    { key: 'date_format', value: 'dd/mm/yyyy', group: 'general', description: 'Date display format' },
    { key: 'currency', value: 'EGP', group: 'finance', description: 'Default currency' },
    { key: 'chat_retention_months', value: '24', group: 'chat', description: 'Chat message retention period' },
    { key: 'max_file_upload_mb', value: '10', group: 'system', description: 'Maximum file upload size in MB' },
    { key: 'attendance_lock_hours', value: '48', group: 'attendance', description: 'Hours after session before attendance is locked' },
    { key: 'passing_score_default', value: '60', group: 'lms', description: 'Default passing score percentage' },
    { key: 'max_chat_file_mb', value: '5', group: 'chat', description: 'Maximum chat file attachment size' },
    { key: 'enable_email_notifications', value: 'true', group: 'notifications', description: 'Master switch for email notifications' },
    { key: 'easykash_sandbox_mode', value: 'true', group: 'integrations', description: 'EasyKash sandbox mode for testing' },
    { key: 'zoom_auto_create', value: 'false', group: 'integrations', description: 'Zoom auto-create disabled' },
    { key: 'onmeet_auto_create', value: 'true', group: 'integrations', description: 'Auto-create OnMeet meetings' },
  ];
  for (const s of settingsData) {
    await dataSource.query(
      `INSERT INTO settings (key, value, "group", description) VALUES ($1, $2, $3, $4) ON CONFLICT (key) DO NOTHING`,
      [s.key, s.value, s.group, s.description],
    );
  }
  console.log(`  ${settingsData.length} settings seeded.`);

  console.log('\n=== Phase 1 Complete: Core Entities ===\n');

  // ============================================================================
  // 8. COURSES
  // ============================================================================
  console.log('Seeding courses...');
  const courseRepo = dataSource.getRepository(Course);

  const courseData = [
    { name: 'English Beginner A1', code: 'ENG-A1-01', level: 'A1', duration_hours: 60, default_price: 1500 },
    { name: 'English Elementary A2', code: 'ENG-A2-01', level: 'A2', duration_hours: 60, default_price: 1600 },
    { name: 'English Pre-Intermediate B1', code: 'ENG-B1-01', level: 'B1', duration_hours: 80, default_price: 1800 },
    { name: 'English Intermediate B1+', code: 'ENG-B1P-01', level: 'B1+', duration_hours: 80, default_price: 1900 },
    { name: 'English Upper-Intermediate B2', code: 'ENG-B2-01', level: 'B2', duration_hours: 100, default_price: 2100 },
    { name: 'English Advanced C1', code: 'ENG-C1-01', level: 'C1', duration_hours: 120, default_price: 2400 },
    { name: 'English Proficiency C2', code: 'ENG-C2-01', level: 'C2', duration_hours: 120, default_price: 2600 },
    { name: 'Business English', code: 'BUS-ENG-01', level: 'B2', duration_hours: 60, default_price: 2200 },
    { name: 'IELTS Preparation', code: 'IELTS-01', level: 'B2', duration_hours: 80, default_price: 2500 },
    { name: 'TOEFL Preparation', code: 'TOEFL-01', level: 'B2', duration_hours: 80, default_price: 2500 },
  ];

  const courses: Course[] = [];
  for (const c of courseData) {
    let course = await courseRepo.findOne({ where: { code: c.code } });
    if (!course) {
      course = await courseRepo.save(courseRepo.create({
        ...c,
        status: CourseStatus.ACTIVE,
        syllabus: faker.lorem.paragraph(),
        description: faker.lorem.sentence(),
        min_age: randomInt(12, 16),
        max_age: randomInt(60, 70),
      }));
    }
    courses.push(course);
  }
  console.log(`  ${courses.length} courses seeded.`);

  // ============================================================================
  // 9. COURSE BRANCH PRICING
  // ============================================================================
  console.log('Seeding course branch pricing...');
  for (const course of courses) {
    for (const branch of branches) {
      const priceModifier = randomInt(90, 110) / 100;
      const price = parseFloat((course.default_price * priceModifier).toFixed(2));
      await dataSource.query(
        `INSERT INTO course_branch_pricing (course_id, branch_id, price, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW()) ON CONFLICT (course_id, branch_id) DO NOTHING`,
        [course.id, branch.id, price]
      );
    }
  }
  console.log('  Course branch pricing seeded.');

  // ============================================================================
  // 10. CLASSROOMS
  // ============================================================================
  console.log('Seeding classrooms...');
  const classroomRepo = dataSource.getRepository(Classroom);

  const classrooms: Classroom[] = [];
  const classroomNames = ['Room 101', 'Room 102', 'Room 103', 'Room 201', 'Room 202', 'Room 203', 'Room 301', 'Room 302'];
  for (const branch of branches) {
    const count = branch.classroom_count || randomInt(3, 6);
    for (let i = 0; i < count; i++) {
      const classroom = await classroomRepo.save(classroomRepo.create({
        branch_id: branch.id,
        name: classroomNames[i % classroomNames.length] + ' - ' + branch.name.split(' ')[0],
        capacity: randomInt(15, 25),
        type: randomElement(['standard', 'smart', 'conference']),
        status: BranchStatus.ACTIVE,
      }));
      classrooms.push(classroom);
    }
  }
  console.log(`  ${classrooms.length} classrooms seeded.`);
  console.log(`  ${branches.length} branches seeded.`);// ============================================================================
// 9. COURSE BRANCH PRICING
// ============================================================================
console.log('Seeding course branch pricing...');
for (const course of courses) {
  for (const branch of branches) {
    const priceModifier = randomInt(90, 110) / 100;
    const price = parseFloat((course.default_price * priceModifier).toFixed(2));
    await dataSource.query(
      'INSERT INTO course_branch_pricing (course_id, branch_id, price, created_at, updated_at) ' +
      'VALUES ($1, $2, $3, NOW(), NOW()) ON CONFLICT (course_id, branch_id) DO NOTHING',
      [course.id, branch.id, price]
    );
  }
}
console.log('  Course branch pricing seeded.');
// ============================================================================
// 10. CLASSROOMS
// ============================================================================
console.log('Seeding classrooms...');
const classroomRepo = dataSource.getRepository(Classroom);
const classrooms: Classroom[] = [];
const classroomNames = ['Room 101', 'Room 102', 'Room 103', 'Room 201', 'Room 202', 'Room 203', 'Room 301', 'Room 302'];
for (const branch of branches) {
  const count = branch.classroom_count || randomInt(3, 6);
  for (let i = 0; i < count; i++) {
    const classroom = await classroomRepo.save(classroomRepo.create({
      branch_id: branch.id,
      name: classroomNames[i % classroomNames.length] + ' - ' + branch.name.split(' ')[0],
      capacity: randomInt(15, 25),
      type: randomElement(['standard', 'smart', 'conference']),
      status: BranchStatus.ACTIVE,
    }));
    classrooms.push(classroom);
  }
}

  // ============================================================================
  // 11. EMPLOYEES
  // ============================================================================
  console.log('Seeding employees...');
  const employeeRepo = dataSource.getRepository(Employee);

  const staffUsers = [...teacherUsers, hrUser, moderatorUser, auditorUser, ...salesUsers, ...financeUsers, ...academicUsers];
  const employees: Employee[] = [];
  const employeeTypes = [EmployeeType.FULL_TIME, EmployeeType.PART_TIME, EmployeeType.CONTRACTOR];

  for (const user of staffUsers) {
    let employee = await employeeRepo.findOne({ where: { user_id: user.id } });
    if (!employee) {
      employee = await employeeRepo.save(employeeRepo.create({
        user_id: user.id,
        employee_number: `EMP-${randomInt(1000, 9999)}`,
        employee_type: randomElement(employeeTypes),
        department: randomElement(['Academic', 'Sales', 'Finance', 'HR', 'Administration']),
        job_title: randomElement(['Teacher', 'Coordinator', 'Officer', 'Manager', 'Specialist']),
        contract_start: randomDate(TWELVE_MONTHS_AGO, NOW),
        contract_end: randomBool(0.3) ? randomDate(NOW, THREE_MONTHS_FROM_NOW) : null,
        salary: randomInt(5000, 15000),
        hourly_rate: randomInt(100, 300),
        currency: 'EGP',
        bank_account: faker.finance.accountNumber(),
        bank_name: faker.finance.institution(),
        status: randomBool(0.9) ? EmployeeStatus.ACTIVE : EmployeeStatus.INACTIVE,
      }));
    }
    employees.push(employee);
  }
  console.log(`  ${employees.length} employees seeded.`);

  // ============================================================================
  // 12. STUDENTS & PROFILES
  // ============================================================================
  console.log('Seeding students...');
  const studentRepo = dataSource.getRepository(Student);
  const studentProfileRepo = dataSource.getRepository(StudentProfile);

  const students: Student[] = [];
  const studentProfiles: StudentProfile[] = [];

  for (const user of studentUsers) {
    let student = await studentRepo.findOne({ where: { user_id: user.id } });
    if (!student) {
      student = await studentRepo.save(studentRepo.create({
        user_id: user.id,
        student_number: `STU-${randomInt(10000, 99999)}`,
        current_level: randomElement(levels),
        status: randomBool(0.9) ? StudentStatus.ACTIVE : StudentStatus.INACTIVE,
        enrollment_date: randomDate(TWELVE_MONTHS_AGO, NOW),
        branch_id: randomElement([cairoId, alexandriaId, onlineId]),
      }));
    }
    students.push(student);

    let profile = await studentProfileRepo.findOne({ where: { student_id: student.id } });
    if (!profile) {
      profile = await studentProfileRepo.save(studentProfileRepo.create({
        student_id: student.id,
        photo_url: faker.image.avatar(),
        date_of_birth: faker.date.birthdate({ min: 16, max: 35, mode: 'age' }),
        gender: randomElement(['M', 'F']),
        address: faker.location.streetAddress(),
        national_id: faker.string.numeric(14),
        education_level: randomElement(['High School', 'Bachelor', 'Master', 'PhD']),
        emergency_contact_name: faker.person.fullName(),
        emergency_contact_phone: faker.phone.number(),
        emergency_contact_relation: randomElement(['Parent', 'Spouse', 'Sibling', 'Friend']),
        notes: faker.lorem.sentence(),
      }));
    }
    studentProfiles.push(profile);
  }
  console.log(`  ${students.length} students and ${studentProfiles.length} profiles seeded.`);

  // ============================================================================
  // 13. GROUPS
  // ============================================================================
  console.log('Seeding groups...');
  const groupRepo = dataSource.getRepository(Group);

  const groups: Group[] = [];
  const groupStatuses = [GroupStatus.UPCOMING, GroupStatus.ACTIVE, GroupStatus.COMPLETED];

  for (let i = 0; i < 20; i++) {
    const course = randomElement(courses);
    const teacher = randomElement(teacherUsers);
    const branch = randomElement(branches);
    const startDate = randomDate(TWELVE_MONTHS_AGO, THREE_MONTHS_FROM_NOW);
    const endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);

    const group = await groupRepo.save(groupRepo.create({
      name: `${course.name} - Group ${i + 1}`,
      course_id: course.id,
      teacher_id: teacher.id,
      branch_id: branch.id,
      capacity: randomInt(10, 20),
      mode: randomElement([GroupMode.IN_PERSON, GroupMode.ONLINE]),
      start_date: startDate,
      end_date: endDate,
      status: startDate < NOW ? randomElement([GroupStatus.ACTIVE, GroupStatus.COMPLETED]) : GroupStatus.UPCOMING,
      created_by: superAdmin.id,
    }));
    groups.push(group);
  }
  console.log(`  ${groups.length} groups seeded.`);

  // ============================================================================
  // 14. GROUP STUDENTS
  // ============================================================================
  console.log('Seeding group students...');
  const groupStudentRepo = dataSource.getRepository(GroupStudent);

  let groupStudentCount = 0;
  for (const group of groups) {
    const studentCount = randomInt(5, Math.min(group.capacity, students.length));
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    for (let j = 0; j < studentCount; j++) {
      const student = shuffledStudents[j];
      const exists = await groupStudentRepo.findOne({
        where: { group_id: group.id, student_id: student.id },
      });
      if (!exists) {
        await groupStudentRepo.save(groupStudentRepo.create({
          group_id: group.id,
          student_id: student.id,
          enrolled_at: randomDate(group.start_date as Date, group.end_date as Date),
          enrolled_by: randomElement([superAdmin.id, managerCairo.id, managerAlex.id]),
          status: 'active',
        }));
        groupStudentCount++;
      }
    }
  }
  console.log(`  ${groupStudentCount} group-student assignments seeded.`);

  // ============================================================================
  // 15. GROUP SCHEDULES
  // ============================================================================
  console.log('Seeding group schedules...');
  const groupScheduleRepo = dataSource.getRepository(GroupSchedule);

  let scheduleCount = 0;
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];
  for (const group of groups) {
    const scheduleCountPerGroup = randomInt(2, 3);
    for (let j = 0; j < scheduleCountPerGroup; j++) {
      const classroom = randomElement(classrooms.filter(c => c.branch_id === group.branch_id));
      await groupScheduleRepo.save(groupScheduleRepo.create({
        group_id: group.id,
        day_of_week: randomElement(daysOfWeek),
        start_time: '09:00',
        end_time: '11:00',
        classroom_id: randomBool(0.7) ? classroom.id : null,
        is_recurring: true,
      }));
      scheduleCount++;
    }
  }
  console.log(`  ${scheduleCount} group schedules seeded.`);

  // ============================================================================
  // 16. SESSIONS
  // ============================================================================
  console.log('Seeding sessions...');
  const sessionRepo = dataSource.getRepository(Session);

  let sessionCount = 0;
  for (const group of groups) {
    const numSessions = randomInt(5, 15);
    for (let j = 0; j < numSessions; j++) {
      const sessionDate = randomDate(TWELVE_MONTHS_AGO, THREE_MONTHS_FROM_NOW);
      const startHour = randomInt(8, 20);
      const startTime = `${String(startHour).padStart(2, '0')}:00`;
      const endHour = startHour + 2;
      const endTime = `${String(endHour).padStart(2, '0')}:00`;

      const classroom = randomBool(0.6) ? randomElement(classrooms.filter(c => c.branch_id === group.branch_id)) : null;

      await sessionRepo.save(sessionRepo.create({
        group_id: group.id,
        date: sessionDate,
        start_time: startTime,
        end_time: endTime,
        classroom_id: classroom?.id || null,
        mode: group.mode,
        topic: faker.lorem.sentence(),
        notes: faker.lorem.sentence(),
        attendance_locked: sessionDate < new Date(Date.now() - 48 * 60 * 60 * 1000),
        cancelled_at: randomBool(0.1) ? new Date(sessionDate.getTime() + 3600000) : null,
        cancellation_reason: randomBool(0.1) ? 'Instructor unavailable' : null,
      }));
      sessionCount++;
    }
  }
  console.log(`  ${sessionCount} sessions seeded.`);

  // ============================================================================
  // 17. ATTENDANCES
  // ============================================================================
  console.log('Seeding attendances...');
  const attendanceRepo = dataSource.getRepository(Attendance);

  let attendanceCount = 0;
  const allSessions = await dataSource.getRepository(Session).find();
  const attendanceStatuses = [AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE, AttendanceStatus.EXCUSED];
  const checkInMethods = [CheckInMethod.MANUAL, CheckInMethod.QR_CODE, CheckInMethod.BIOMETRIC];

  for (const session of allSessions) {
    const groupStudents = await groupStudentRepo.find({ where: { group_id: session.group_id } });
    for (const gs of groupStudents) {
      if (randomBool(0.95)) {
        const exists = await attendanceRepo.findOne({
          where: { session_id: session.id, student_id: gs.student_id },
        });
        if (!exists) {
          const status = randomElement(attendanceStatuses);
          await attendanceRepo.save(attendanceRepo.create({
            session_id: session.id,
            student_id: gs.student_id,
            status: status,
            check_in_method: randomElement(checkInMethods),
            check_in_time: status === AttendanceStatus.PRESENT ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
            minutes_late: status === AttendanceStatus.LATE ? randomInt(5, 30) : 0,
            notes: randomBool(0.2) ? faker.lorem.sentence() : null,
            created_by: randomElement([superAdmin.id, ...teacherUsers.map(u => u.id)]),
          }));
          attendanceCount++;
        }
      }
    }
  }
  console.log(`  ${attendanceCount} attendance records seeded.`);

  // ============================================================================
  // 18. LEADS
  // ============================================================================
  console.log('Seeding leads...');
  const leadRepo = dataSource.getRepository(Lead);

  const leads: Lead[] = [];
  const leadStatuses = [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.CONVERTED, LeadStatus.LOST];
  const leadSources = [LeadSource.WEBSITE, LeadSource.REFERRAL, LeadSource.SOCIAL_MEDIA, LeadSource.WALK_IN, LeadSource.PHONE];

  for (let i = 0; i < 50; i++) {
    const branch = randomElement(branches);
    const agent = randomElement([...salesUsers, managerCairo, managerAlex]);
    const status = randomElement(leadStatuses);
    const lead = await leadRepo.save(leadRepo.create({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      national_id: faker.string.numeric(14),
      source: randomElement(leadSources),
      status: status,
      level_interest: randomElement(levels),
      placement_score: randomBool(0.5) ? randomInt(0, 100) : null,
      placement_level: randomBool(0.5) ? randomElement(levels) : null,
      notes: faker.lorem.sentence(),
      assigned_to: agent.id,
      branch_id: branch.id,
      converted_to_student_id: status === LeadStatus.CONVERTED ? randomElement(studentUsers).id : null,
      converted_at: status === LeadStatus.CONVERTED ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
    }));
    leads.push(lead);
  }
  console.log(`  ${leads.length} leads seeded.`);

  // ============================================================================
  // 19. ENROLLMENTS
  // ============================================================================
  console.log('Seeding enrollments...');
  const enrollmentRepo = dataSource.getRepository(Enrollment);

  let enrollmentCount = 0;
  for (const student of students) {
    const studentGroups = await groupStudentRepo.find({ where: { student_id: student.id } });
    for (const gs of studentGroups) {
      const group = groups.find(g => g.id === gs.group_id);
      if (!group) continue;
      const course = courses.find(c => c.id === group.course_id);
      if (!course) continue;

      const enrollment = await enrollmentRepo.save(enrollmentRepo.create({
        student_id: student.id,
        group_id: group.id,
        status: EnrollmentStatus.ACTIVE,
        total_fee: course.default_price,
        discount_amount: randomInt(0, 200),
        final_amount: course.default_price - randomInt(0, 200),
        enrolled_at: randomDate(TWELVE_MONTHS_AGO, NOW),
        enrolled_by: randomElement([superAdmin.id, managerCairo.id, managerAlex.id, ...salesUsers.map(u => u.id)]),
      }));
      enrollmentCount++;
    }
  }
  console.log(`  ${enrollmentCount} enrollments seeded.`);

  // ============================================================================
  // 20. INVOICES
  // ============================================================================
  console.log('Seeding invoices...');
  const invoiceRepo = dataSource.getRepository(Invoice);

  const invoices: Invoice[] = [];
  const invoiceStatuses = [InvoiceStatus.UNPAID, InvoiceStatus.PARTIAL, InvoiceStatus.PAID, InvoiceStatus.OVERDUE];

  let invoiceCount = 0;
  const allEnrollments = await dataSource.getRepository(Enrollment).find();
  for (const enrollment of allEnrollments) {
    if (randomBool(0.8)) {
      const student = students.find(s => s.id === enrollment.student_id);
      if (!student) continue;
      const subtotal = enrollment.final_amount;
      const discount = enrollment.discount_amount;
      const tax = parseFloat((subtotal * 0.14).toFixed(2));
      const total = subtotal - discount + tax;
      const paid = randomBool(0.6) ? total : randomInt(0, Math.floor(total));
      const status = paid >= total ? InvoiceStatus.PAID : paid > 0 ? InvoiceStatus.PARTIAL : InvoiceStatus.UNPAID;

      const invoice = await invoiceRepo.save(invoiceRepo.create({
        invoice_number: `INV-${Date.now()}-${randomInt(1000, 9999)}`,
        enrollment_id: enrollment.id,
        student_id: student.id,
        branch_id: student.branch_id,
        subtotal: subtotal,
        discount_amount: discount,
        tax_amount: tax,
        total_amount: total,
        paid_amount: paid,
        balance_due: total - paid,
        status: status,
        due_date: randomDate(NOW, THREE_MONTHS_FROM_NOW),
        notes: faker.lorem.sentence(),
        created_by: randomElement([...financeUsers, superAdmin.id]),
      }));
      invoices.push(invoice);
      invoiceCount++;
    }
  }
  console.log(`  ${invoiceCount} invoices seeded.`);

  // ============================================================================
  // 21. INVOICE ITEMS
  // ============================================================================
  console.log('Seeding invoice items...');
  const invoiceItemRepo = dataSource.getRepository(InvoiceItem);

  let invoiceItemCount = 0;
  const invoiceItemTypes = [InvoiceItemType.TUITION, InvoiceItemType.REGISTRATION, InvoiceItemType.MATERIALS, InvoiceItemType.EXAM];

  for (const invoice of invoices) {
    const itemCount = randomInt(1, 3);
    for (let j = 0; j < itemCount; j++) {
      const course = randomElement(courses);
      const unitPrice = randomInt(500, 3000);
      const quantity = randomInt(1, 2);
      const discount = randomInt(0, 100);
      const tax = parseFloat((unitPrice * quantity * 0.14).toFixed(2));
      const total = unitPrice * quantity - discount + tax;

      await invoiceItemRepo.save(invoiceItemRepo.create({
        invoice_id: invoice.id,
        item_type: randomElement(invoiceItemTypes),
        course_id: course.id,
        description: `${course.name} - ${randomElement(invoiceItemTypes)}`,
        quantity: quantity,
        unit_price: unitPrice,
        discount_amount: discount,
        tax_amount: tax,
        total_amount: total,
      }));
      invoiceItemCount++;
    }
  }
  console.log(`  ${invoiceItemCount} invoice items seeded.`);

  // ============================================================================
  // 22. PAYMENTS
  // ============================================================================
  console.log('Seeding payments...');
  const paymentRepo = dataSource.getRepository(Payment);

  const paymentMethods = [PaymentMethod.CASH, PaymentMethod.CREDIT_CARD, PaymentMethod.BANK_TRANSFER, PaymentMethod.EASYKASH];
  const paymentStatuses = [PaymentStatus.COMPLETED, PaymentStatus.PENDING, PaymentStatus.FAILED];

  let paymentCount = 0;
  for (const invoice of invoices) {
    if (invoice.paid_amount > 0) {
      const paymentCountPerInvoice = randomInt(1, 3);
      let remaining = invoice.paid_amount;
      for (let j = 0; j < paymentCountPerInvoice && remaining > 0; j++) {
        const amount = j === paymentCountPerInvoice - 1 ? remaining : randomInt(1, Math.floor(remaining));
        remaining -= amount;
        const status = randomBool(0.9) ? PaymentStatus.COMPLETED : randomElement([PaymentStatus.PENDING, PaymentStatus.FAILED]);

        await paymentRepo.save(paymentRepo.create({
          invoice_id: invoice.id,
          amount: amount,
          method: randomElement(paymentMethods),
          reference: `REF-${faker.string.alphanumeric(10)}`,
          easykash_transaction_id: randomBool(0.3) ? faker.string.alphanumeric(20) : null,
          paid_at: randomDate(TWELVE_MONTHS_AGO, NOW),
          recorded_by: randomElement([...financeUsers, superAdmin.id]),
          status: status,
          receipt_number: `RCP-${faker.string.alphanumeric(8)}`,
          notes: faker.lorem.sentence(),
        }));
        paymentCount++;
      }
    }
  }
  console.log(`  ${paymentCount} payments seeded.`);

  // ============================================================================
  // 23. INSTALLMENTS
  // ============================================================================
  console.log('Seeding installments...');
  const installmentRepo = dataSource.getRepository(Installment);

  let installmentCount = 0;
  for (const invoice of invoices) {
    const installmentCountPerInvoice = randomInt(1, 4);
    const amountPerInstallment = invoice.total_amount / installmentCountPerInvoice;
    for (let j = 1; j <= installmentCountPerInvoice; j++) {
      const dueDate = randomDate(NOW, THREE_MONTHS_FROM_NOW);
      const paidAmount = randomBool(0.7) ? amountPerInstallment : 0;
      const status = paidAmount >= amountPerInstallment ? InstallmentStatus.PAID : paidAmount > 0 ? InstallmentStatus.PARTIAL : InstallmentStatus.PENDING;

      await installmentRepo.save(installmentRepo.create({
        invoice_id: invoice.id,
        installment_number: j,
        amount: parseFloat(amountPerInstallment.toFixed(2)),
        due_date: dueDate,
        paid_amount: parseFloat(paidAmount.toFixed(2)),
        paid_at: paidAmount > 0 ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
        status: status,
      }));
      installmentCount++;
    }
  }
  console.log(`  ${installmentCount} installments seeded.`);

  // ============================================================================
  // 24. REFUNDS
  // ============================================================================
  console.log('Seeding refunds...');
  const refundRepo = dataSource.getRepository(Refund);

  const refundReasons = [RefundReason.COURSE_CANCELLATION, RefundReason.OVERPAYMENT, RefundReason.SERVICE_DISSATISFACTION, RefundReason.DUPLICATE_PAYMENT, RefundReason.MEDICAL];
  const refundStatuses = [RefundStatus.PENDING, RefundStatus.APPROVED, RefundStatus.REJECTED, RefundStatus.PROCESSED];

  let refundCount = 0;
  const completedPayments = await dataSource.getRepository(Payment).find({ where: { status: PaymentStatus.COMPLETED } });
  for (let i = 0; i < Math.min(20, completedPayments.length); i++) {
    const payment = completedPayments[i];
    const invoice = invoices.find(inv => inv.id === payment.invoice_id);
    if (!invoice) continue;

    const amount = randomInt(100, Math.floor(payment.amount));
    const status = randomElement(refundStatuses);

    await refundRepo.save(refundRepo.create({
      payment_id: payment.id,
      invoice_id: invoice.id,
      amount: amount,
      reason_code: randomElement(refundReasons),
      reason_note: faker.lorem.sentence(),
      status: status,
      approved_by: status !== RefundStatus.PENDING ? randomElement([...financeUsers, superAdmin]).id : null,
      processed_by: status === RefundStatus.PROCESSED ? randomElement([...financeUsers, superAdmin]).id : null,
      approved_at: status !== RefundStatus.PENDING ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
      processed_at: status === RefundStatus.PROCESSED ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
    }));
    refundCount++;
  }
  console.log(`  ${refundCount} refunds seeded.`);

  // ============================================================================
  // 25. FINANCIAL TRANSACTIONS
  // ============================================================================
  console.log('Seeding financial transactions...');
  const financialTransactionRepo = dataSource.getRepository(FinancialTransaction);

  const txTypes = [FinancialTransactionType.PAYMENT, FinancialTransactionType.REFUND, FinancialTransactionType.EXPENSE];
  const txDirections = [TransactionDirection.IN, TransactionDirection.OUT];

  let txCount = 0;
  for (const payment of completedPayments.slice(0, 15)) {
    await financialTransactionRepo.save(financialTransactionRepo.create({
      branch_id: payment.invoice_id ? invoices.find(inv => inv.id === payment.invoice_id)?.branch_id : randomElement(branches).id,
      invoice_id: payment.invoice_id,
      payment_id: payment.id,
      transaction_type: FinancialTransactionType.PAYMENT,
      direction: TransactionDirection.IN,
      amount: payment.amount,
      transaction_date: payment.paid_at,
      description: `Payment for invoice ${payment.invoice_id}`,
      created_by: payment.recorded_by,
    }));
    txCount++;
  }
  for (let i = 0; i < 15; i++) {
    const branch = randomElement(branches);
    await financialTransactionRepo.save(financialTransactionRepo.create({
      branch_id: branch.id,
      transaction_type: randomElement(txTypes),
      direction: randomElement(txDirections),
      amount: randomInt(100, 5000),
      transaction_date: randomDate(TWELVE_MONTHS_AGO, NOW),
      description: faker.lorem.sentence(),
      created_by: superAdmin.id,
    }));
    txCount++;
  }
  console.log(`  ${txCount} financial transactions seeded.`);

  // ============================================================================
  // 26. PAYROLL PERIODS
  // ============================================================================
  console.log('Seeding payroll periods...');
  const payrollPeriodRepo = dataSource.getRepository(PayrollPeriod);

  const payrollPeriods: PayrollPeriod[] = [];
  for (let i = 0; i < 10; i++) {
    const startDate = new Date(NOW.getFullYear() - 1, i % 12, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    const status = i < 8 ? PayrollStatus.CLOSED : PayrollStatus.OPEN;

    const period = await payrollPeriodRepo.save(payrollPeriodRepo.create({
      name: `Payroll ${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      start_date: startDate,
      end_date: endDate,
      status: status,
      closed_at: status === PayrollStatus.CLOSED ? randomDate(startDate, NOW) : null,
      closed_by: status === PayrollStatus.CLOSED ? hrUser.id : null,
    }));
    payrollPeriods.push(period);
  }
  console.log(`  ${payrollPeriods.length} payroll periods seeded.`);

  // ============================================================================
  // 27. PAYROLL ENTRIES
  // ============================================================================
  console.log('Seeding payroll entries...');
  const payrollEntryRepo = dataSource.getRepository(PayrollEntry);

  let payrollEntryCount = 0;
  for (const period of payrollPeriods) {
    for (const employee of employees) {
      const baseAmount = employee.salary || randomInt(5000, 15000);
      const hoursWorked = randomInt(120, 180);
      const classesTaught = randomInt(40, 80);
      const bonus = randomInt(0, 2000);
      const deductions = randomInt(0, 1000);
      const total = baseAmount + bonus - deductions;

      await payrollEntryRepo.save(payrollEntryRepo.create({
        payroll_period_id: period.id,
        employee_id: employee.id,
        base_amount: baseAmount,
        hours_worked: hoursWorked,
        classes_taught: classesTaught,
        bonus: bonus,
        deductions: deductions,
        hourly_rate: employee.hourly_rate,
        total_amount: total,
        status: period.status === PayrollStatus.CLOSED ? randomElement([PayrollEntryStatus.PAID, PayrollEntryStatus.PROCESSED]) : PayrollEntryStatus.DRAFT,
        notes: faker.lorem.sentence(),
      }));
      payrollEntryCount++;
    }
  }
  console.log(`  ${payrollEntryCount} payroll entries seeded.`);

  // ============================================================================
  // 28. LEAVE REQUESTS
  // ============================================================================
  console.log('Seeding leave requests...');
  const leaveRequestRepo = dataSource.getRepository(LeaveRequest);

  const leaveTypes = [LeaveType.ANNUAL, LeaveType.SICK, LeaveType.PERSONAL, LeaveType.EMERGENCY];
  const leaveStatuses = [LeaveStatus.PENDING, LeaveStatus.APPROVED, LeaveStatus.REJECTED];

  let leaveCount = 0;
  for (let i = 0; i < 20; i++) {
    const employee = randomElement(employees);
    const startDate = randomDate(TWELVE_MONTHS_AGO, THREE_MONTHS_FROM_NOW);
    const daysCount = randomInt(1, 10);
    const endDate = new Date(startDate.getTime() + daysCount * 24 * 60 * 60 * 1000);
    const status = randomElement(leaveStatuses);

    await leaveRequestRepo.save(leaveRequestRepo.create({
      employee_id: employee.id,
      type: randomElement(leaveTypes),
      start_date: startDate,
      end_date: endDate,
      days_count: daysCount,
      reason: faker.lorem.sentence(),
      attachment_url: randomBool(0.3) ? faker.image.url() : null,
      status: status,
      approved_by: status !== LeaveStatus.PENDING ? randomElement([hrUser, superAdmin]).id : null,
      approval_note: status !== LeaveStatus.PENDING ? faker.lorem.sentence() : null,
      approved_at: status !== LeaveStatus.PENDING ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
    }));
    leaveCount++;
  }
  console.log(`  ${leaveCount} leave requests seeded.`);

  // ============================================================================
  // 29. TEACHER AVAILABILITIES
  // ============================================================================
  console.log('Seeding teacher availabilities...');
  const teacherAvailabilityRepo = dataSource.getRepository(TeacherAvailability);

  let availabilityCount = 0;
  for (const employee of employees) {
    if (employee.employee_type !== EmployeeType.FULL_TIME) continue;
    for (let d = 1; d <= 5; d++) {
      if (randomBool(0.8)) {
        await teacherAvailabilityRepo.save(teacherAvailabilityRepo.create({
          employee_id: employee.id,
          day_of_week: d,
          start_time: '09:00',
          end_time: '15:00',
          is_available: randomBool(0.9),
          note: randomBool(0.2) ? faker.lorem.sentence() : null,
        }));
        availabilityCount++;
      }
    }
  }
  console.log(`  ${availabilityCount} teacher availabilities seeded.`);

  // ============================================================================
  // 30. TEACHER EVALUATIONS
  // ============================================================================
  console.log('Seeding teacher evaluations...');
  const teacherEvaluationRepo = dataSource.getRepository(TeacherEvaluation);

  let evalCount = 0;
  for (let i = 0; i < 10; i++) {
    const group = randomElement(groups);
    const groupStudentsList = await groupStudentRepo.find({ where: { group_id: group.id } });
    if (groupStudentsList.length === 0) continue;
    const student = randomElement(groupStudentsList).student_id;

    await teacherEvaluationRepo.save(teacherEvaluationRepo.create({
      group_id: group.id,
      student_id: student,
      teacher_id: group.teacher_id,
      term: `Term ${randomInt(1, 3)}`,
      form_data: { communication: randomInt(1, 5), knowledge: randomInt(1, 5), punctuality: randomInt(1, 5) },
      overall_comment: faker.lorem.sentence(),
      is_shared_with_student: randomBool(0.7),
    }));
    evalCount++;
  }
  console.log(`  ${evalCount} teacher evaluations seeded.`);

  // ============================================================================
  // 31. CHAT ROOMS
  // ============================================================================
  console.log('Seeding chat rooms...');
  const chatRoomRepo = dataSource.getRepository(ChatRoom);

  const chatRooms: ChatRoom[] = [];
  for (let i = 0; i < 30; i++) {
    const group = randomBool(0.7) ? randomElement(groups) : null;
    const type = group ? ChatRoomType.GROUP : randomElement([ChatRoomType.PRIVATE, ChatRoomType.GENERAL]);

    const room = await chatRoomRepo.save(chatRoomRepo.create({
      type: type,
      group_id: group?.id || null,
      name: group ? `${group.name} Chat` : faker.lorem.word(),
      topic: faker.lorem.sentence(),
      is_archived: randomBool(0.1),
      created_by: randomElement(users).id,
    }));
    chatRooms.push(room);
  }
  console.log(`  ${chatRooms.length} chat rooms seeded.`);

  // ============================================================================
  // 32. CHAT ROOM MEMBERS
  // ============================================================================
  console.log('Seeding chat room members...');
  const chatRoomMemberRepo = dataSource.getRepository(ChatRoomMember);

  let memberCount = 0;
  for (const room of chatRooms) {
    const roomUsers = room.group_id
      ? (await groupStudentRepo.find({ where: { group_id: room.group_id } })).map(gs => gs.student_id)
      : randomElement([users, teacherUsers, studentUsers]).map(u => u.id);
    roomUsers.push(room.created_by);

    for (const userId of roomUsers.slice(0, randomInt(3, 10))) {
      const exists = await chatRoomMemberRepo.findOne({
        where: { room_id: room.id, user_id: userId },
      });
      if (!exists) {
        await chatRoomMemberRepo.save(chatRoomMemberRepo.create({
          room_id: room.id,
          user_id: userId,
          role: userId === room.created_by ? 'admin' : 'member',
        }));
        memberCount++;
      }
    }
  }
  console.log(`  ${memberCount} chat room members seeded.`);

  // ============================================================================
  // 33. CHAT MESSAGES
  // ============================================================================
  console.log('Seeding chat messages...');
  const chatMessageRepo = dataSource.getRepository(ChatMessage);

  let messageCount = 0;
  for (const room of chatRooms) {
    const roomMembers = await chatRoomMemberRepo.find({ where: { room_id: room.id } });
    if (roomMembers.length === 0) continue;
    const numMessages = randomInt(5, 50);
    for (let j = 0; j < numMessages; j++) {
      const sender = randomElement(roomMembers);
      await chatMessageRepo.save(chatMessageRepo.create({
        room_id: room.id,
        sender_id: sender.user_id,
        body: faker.lorem.sentence(),
        type: randomElement([ChatMessageType.TEXT, ChatMessageType.TEXT, ChatMessageType.TEXT, ChatMessageType.FILE]),
        file_url: randomBool(0.1) ? faker.image.url() : null,
        file_size: randomBool(0.1) ? randomInt(1000, 5000000) : null,
        file_name: randomBool(0.1) ? 'document.pdf' : null,
        is_flagged: randomBool(0.05),
        flag_reason: randomBool(0.05) ? 'Inappropriate content' : null,
      }));
      messageCount++;
    }
  }
  console.log(`  ${messageCount} chat messages seeded.`);

  // ============================================================================
  // 34. CHAT VIOLATIONS
  // ============================================================================
  console.log('Seeding chat violations...');
  const chatViolationRepo = dataSource.getRepository(ChatViolation);

  const violationActions = [ViolationAction.WARNING, ViolationAction.MUTE, ViolationAction.DELETE, ViolationAction.BAN];

  let violationCount = 0;
  const flaggedMessages = await dataSource.getRepository(ChatMessage).find({ where: { is_flagged: true } });
  for (let i = 0; i < Math.min(15, flaggedMessages.length); i++) {
    const message = flaggedMessages[i];
    const room = chatRooms.find(r => r.id === message.room_id);
    if (!room) continue;

    await chatViolationRepo.save(chatViolationRepo.create({
      message_id: message.id,
      room_id: room.id,
      sender_id: message.sender_id,
      rule_matched: 'profanity_filter',
      original_message: message.body,
      action_taken: randomElement(violationActions),
      moderator_id: randomBool(0.8) ? moderatorUser.id : null,
      moderator_note: randomBool(0.7) ? faker.lorem.sentence() : null,
      resolved_at: randomBool(0.8) ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
      is_false_positive: randomBool(0.1),
    }));
    violationCount++;
  }
  console.log(`  ${violationCount} chat violations seeded.`);

  // ============================================================================
  // 35. CHAT STRIKES
  // ============================================================================
  console.log('Seeding chat strikes...');
  const chatStrikeRepo = dataSource.getRepository(ChatStrike);

  const strikeActions = [StrikeAction.WARNING, StrikeAction.MUTE_24H, StrikeAction.MUTE_7D, StrikeAction.BAN_30D];

  let strikeCount = 0;
  const violations = await dataSource.getRepository(ChatViolation).find();
  for (let i = 0; i < Math.min(10, violations.length); i++) {
    const violation = violations[i];
    await chatStrikeRepo.save(chatStrikeRepo.create({
      user_id: violation.sender_id,
      violation_id: violation.id,
      strike_number: randomInt(1, 3),
      action: randomElement(strikeActions),
      expires_at: randomBool(0.7) ? randomDate(NOW, THREE_MONTHS_FROM_NOW) : null,
      applied_by: violation.moderator_id || moderatorUser.id,
      is_active: randomBool(0.8),
    }));
    strikeCount++;
  }
  console.log(`  ${strikeCount} chat strikes seeded.`);

  // ============================================================================
  // 36. TEST SLOTS & PLACEMENT TESTS
  // ============================================================================
  console.log('Seeding test slots...');
  const testSlotRepo = dataSource.getRepository(TestSlot);

  const testSlots: TestSlot[] = [];
  for (let i = 0; i < 15; i++) {
    const slot = await testSlotRepo.save(testSlotRepo.create({
      branch_id: randomElement(branches).id,
      examiner_id: randomElement([...teacherUsers, academicUsers[0]]).id,
      date: randomDate(TWELVE_MONTHS_AGO, THREE_MONTHS_FROM_NOW),
      start_time: '09:00',
      end_time: '11:00',
      mode: randomElement([GroupMode.IN_PERSON, GroupMode.ONLINE]),
      capacity: randomInt(2, 5),
      booked_count: randomInt(0, 5),
      status: randomElement([SlotStatus.OPEN, SlotStatus.OPEN, SlotStatus.OPEN, SlotStatus.FILLED]),
    }));
    testSlots.push(slot);
  }
  console.log(`  ${testSlots.length} test slots seeded.`);

  console.log('Seeding placement tests...');
  const placementTestRepo = dataSource.getRepository(PlacementTest);

  let placementTestCount = 0;
  for (let i = 0; i < 10; i++) {
    const lead = randomElement(leads);
    const slot = randomElement(testSlots);
    const status = randomElement([TestStatus.SCHEDULED, TestStatus.COMPLETED, TestStatus.COMPLETED, TestStatus.CANCELLED]);

    await placementTestRepo.save(placementTestRepo.create({
      lead_id: lead.id,
      student_id: randomBool(0.5) ? randomElement(students).id : null,
      slot_id: randomBool(0.8) ? slot.id : null,
      examiner_id: slot.examiner_id,
      scheduled_at: slot.date,
      written_score: status === TestStatus.COMPLETED ? randomInt(40, 95) : null,
      written_max: 100,
      oral_score: status === TestStatus.COMPLETED ? randomInt(40, 95) : null,
      oral_max: 100,
      suggested_level: randomElement(levels),
      final_level: status === TestStatus.COMPLETED ? randomElement(levels) : null,
      examiner_notes: faker.lorem.sentence(),
      status: status,
      result_sent_at: status === TestStatus.COMPLETED ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
    }));
    placementTestCount++;
  }
  console.log(`  ${placementTestCount} placement tests seeded.`);

  // ============================================================================
  // 37. TEST QUESTIONS & PLACEMENT ANSWERS
  // ============================================================================
  console.log('Seeding test questions...');
  const testQuestionRepo = dataSource.getRepository(TestQuestion);

  let questionCount = 0;
  for (let i = 0; i < 30; i++) {
    await testQuestionRepo.save(testQuestionRepo.create({
      question_text: faker.lorem.sentence(),
      type: randomElement([QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.SHORT_ANSWER]),
      options: randomBool(0.7) ? { a: faker.lorem.word(), b: faker.lorem.word(), c: faker.lorem.word(), d: faker.lorem.word() } : null,
      correct_answer: randomBool(0.7) ? 'a' : null,
      explanation: faker.lorem.sentence(),
      level: randomElement(levels),
      category: randomElement(['Grammar', 'Vocabulary', 'Reading', 'Listening']),
      points: randomInt(1, 5),
      is_active: true,
      created_by: superAdmin.id,
    }));
    questionCount++;
  }
  console.log(`  ${questionCount} test questions seeded.`);

  const placementTestAnswerRepo = dataSource.getRepository(PlacementTestAnswer);
  const allTestQuestions = await dataSource.getRepository(TestQuestion).find();
  const allPlacementTests = await dataSource.getRepository(PlacementTest).find();

  let answerCount = 0;
  for (const test of allPlacementTests.slice(0, 8)) {
    for (let j = 0; j < randomInt(3, 8); j++) {
      const question = randomElement(allTestQuestions);
      const exists = await placementTestAnswerRepo.findOne({
        where: { test_id: test.id, question_id: question.id },
      });
      if (!exists) {
        await placementTestAnswerRepo.save(placementTestAnswerRepo.create({
          test_id: test.id,
          question_id: question.id,
          answer: randomBool(0.7) ? 'a' : faker.lorem.word(),
          score: randomInt(0, 5),
          is_correct: randomBool(0.7),
        }));
        answerCount++;
      }
    }
  }
  console.log(`  ${answerCount} placement test answers seeded.`);

  // ============================================================================
  // 38. LMS MODULES
  // ============================================================================
  console.log('Seeding LMS modules...');
  const lmsModuleRepo = dataSource.getRepository(LmsModule);

  const lmsModules: LmsModule[] = [];
  for (let i = 0; i < 20; i++) {
    const group = randomElement(groups);
    const module = await lmsModuleRepo.save(lmsModuleRepo.create({
      group_id: group.id,
      name: `Module ${i + 1}: ${faker.lorem.word()}`,
      description: faker.lorem.sentence(),
      order: i + 1,
      is_published: randomBool(0.8),
      published_at: randomBool(0.8) ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
      created_by: randomElement([...academicUsers, ...teacherUsers]).id,
    }));
    lmsModules.push(module);
  }
  console.log(`  ${lmsModules.length} LMS modules seeded.`);

  console.log('Seeding LMS lessons...');
  const lmsLessonRepo = dataSource.getRepository(LmsLesson);

  const lmsLessons: LmsLesson[] = [];
  for (let i = 0; i < 60; i++) {
    const module = randomElement(lmsModules);
    const lesson = await lmsLessonRepo.save(lmsLessonRepo.create({
      module_id: module.id,
      name: `Lesson ${i + 1}: ${faker.lorem.word()}`,
      content: faker.lorem.paragraph(),
      type: randomElement([LessonType.CONTENT, LessonType.VIDEO, LessonType.QUIZ, LessonType.ASSIGNMENT]),
      duration_minutes: randomInt(15, 120),
      order: i + 1,
      is_published: randomBool(0.8),
    }));
    lmsLessons.push(lesson);
  }
  console.log(`  ${lmsLessons.length} LMS lessons seeded.`);

  console.log('Seeding LMS resources...');
  const lmsResourceRepo = dataSource.getRepository(LmsResource);

  const resourceTypes = [ResourceType.PDF, ResourceType.VIDEO, ResourceType.AUDIO, ResourceType.IMAGE, ResourceType.LINK];
  const resourceAccess = [ResourceAccess.ENROLLED, ResourceAccess.PUBLIC, ResourceAccess.PREMIUM];

  let resourceCount = 0;
  for (let i = 0; i < 30; i++) {
    const lesson = randomElement(lmsLessons);
    await lmsResourceRepo.save(lmsResourceRepo.create({
      lesson_id: lesson.id,
      name: `Resource ${i + 1}: ${faker.lorem.word()}`,
      type: randomElement(resourceTypes),
      file_url: randomBool(0.7) ? faker.image.url() : null,
      file_size: randomBool(0.7) ? randomInt(100000, 10000000) : null,
      mime_type: randomElement(['application/pdf', 'video/mp4', 'audio/mpeg', 'image/jpeg']),
      external_url: randomBool(0.3) ? faker.internet.url() : null,
      access_control: randomElement(resourceAccess),
      download_count: randomInt(0, 50),
      watermark_text: randomBool(0.5) ? 'SpeakUp Academy' : null,
    }));
    resourceCount++;
  }
  console.log(`  ${resourceCount} LMS resources seeded.`);

  // ============================================================================
  // 39. QUIZZES & QUIZ QUESTIONS & QUIZ ATTEMPTS
  // ============================================================================
  console.log('Seeding quizzes...');
  const quizRepo = dataSource.getRepository(Quiz);

  const quizzes: Quiz[] = [];
  for (let i = 0; i < 20; i++) {
    const group = randomElement(groups);
    const quiz = await quizRepo.save(quizRepo.create({
      group_id: group.id,
      title: `${faker.lorem.word()} Quiz ${i + 1}`,
      description: faker.lorem.sentence(),
      time_limit_minutes: randomInt(15, 60),
      max_attempts: randomInt(1, 3),
      shuffle_questions: randomBool(0.5),
      shuffle_options: randomBool(0.5),
      release_type: randomElement([ReleaseType.INSTANT, ReleaseType.SCHEDULED]),
      release_at: randomBool(0.5) ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
      passing_score: randomInt(50, 75),
      is_published: randomBool(0.8),
      created_by: randomElement([...teacherUsers, ...academicUsers]).id,
    }));
    quizzes.push(quiz);
  }
  console.log(`  ${quizzes.length} quizzes seeded.`);

  console.log('Seeding quiz questions...');
  const quizQuestionRepo = dataSource.getRepository(QuizQuestion);

  let quizQuestionCount = 0;
  for (const quiz of quizzes) {
    for (let j = 0; j < randomInt(3, 8); j++) {
      await quizQuestionRepo.save(quizQuestionRepo.create({
        quiz_id: quiz.id,
        bank_question_id: randomBool(0.3) ? randomElement(allTestQuestions).id : null,
        question_text: faker.lorem.sentence(),
        type: randomElement([QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.SHORT_ANSWER]),
        options: randomBool(0.7) ? { a: faker.lorem.word(), b: faker.lorem.word(), c: faker.lorem.word(), d: faker.lorem.word() } : null,
        correct_answer: randomBool(0.7) ? 'a' : null,
        points: randomInt(1, 5),
        order: j + 1,
        media_url: randomBool(0.2) ? faker.image.url() : null,
      }));
      quizQuestionCount++;
    }
  }
  console.log(`  ${quizQuestionCount} quiz questions seeded.`);

  console.log('Seeding quiz attempts...');
  const quizAttemptRepo = dataSource.getRepository(QuizAttempt);

  let attemptCount = 0;
  for (const quiz of quizzes) {
    const groupStudentsList = await groupStudentRepo.find({ where: { group_id: quiz.group_id } });
    for (let j = 0; j < randomInt(2, 8); j++) {
      const student = randomElement(groupStudentsList);
      const attemptNumber = j + 1;
      const score = randomInt(0, 100);
      const isPassed = score >= quiz.passing_score;

      await quizAttemptRepo.save(quizAttemptRepo.create({
        quiz_id: quiz.id,
        student_id: student.student_id,
        attempt_number: attemptNumber,
        answers: { q1: 'a', q2: 'b', q3: 'c' },
        score: score,
        percentage: score,
        is_passed: isPassed,
        started_at: randomDate(TWELVE_MONTHS_AGO, NOW),
        submitted_at: randomBool(0.9) ? new Date(Date.now() + 3600000) : null,
        time_spent_seconds: randomInt(300, 3600),
        status: randomBool(0.9) ? AttemptStatus.COMPLETED : AttemptStatus.IN_PROGRESS,
        graded_by: randomBool(0.5) ? randomElement([...teacherUsers, ...academicUsers]).id : null,
      }));
      attemptCount++;
    }
  }
  console.log(`  ${attemptCount} quiz attempts seeded.`);

  // ============================================================================
  // 40. ASSIGNMENTS & SUBMISSIONS
  // ============================================================================
  console.log('Seeding assignments...');
  const assignmentRepo = dataSource.getRepository(Assignment);

  const assignments: Assignment[] = [];
  for (let i = 0; i < 20; i++) {
    const group = randomElement(groups);
    const assignment = await assignmentRepo.save(assignmentRepo.create({
      group_id: group.id,
      title: `Assignment ${i + 1}: ${faker.lorem.word()}`,
      description: faker.lorem.sentence(),
      type: randomElement([AssignmentType.FILE_UPLOAD, AssignmentType.ESSAY, AssignmentType.PRESENTATION]),
      due_at: randomDate(NOW, THREE_MONTHS_FROM_NOW),
      max_grade: randomInt(50, 100),
      allow_late_submission: randomBool(0.6),
      late_penalty_percent: randomInt(5, 20),
      is_published: randomBool(0.8),
      created_by: randomElement([...teacherUsers, ...academicUsers]).id,
    }));
    assignments.push(assignment);
  }
  console.log(`  ${assignments.length} assignments seeded.`);

  console.log('Seeding submissions...');
  const submissionRepo = dataSource.getRepository(Submission);

  let submissionCount = 0;
  for (const assignment of assignments) {
    const groupStudentsList = await groupStudentRepo.find({ where: { group_id: assignment.group_id } });
    for (let j = 0; j < randomInt(3, 10); j++) {
      const student = randomElement(groupStudentsList);
      const exists = await submissionRepo.findOne({
        where: { assignment_id: assignment.id, student_id: student.student_id },
      });
      if (!exists) {
        const grade = randomBool(0.8) ? randomInt(50, 100) : null;
        await submissionRepo.save(submissionRepo.create({
          assignment_id: assignment.id,
          student_id: student.student_id,
          content: faker.lorem.sentence(),
          file_url: randomBool(0.6) ? faker.image.url() : null,
          file_name: randomBool(0.6) ? 'submission.pdf' : null,
          is_late: randomBool(0.2),
          grade: grade,
          feedback: randomBool(0.7) ? faker.lorem.sentence() : null,
          graded_by: grade ? randomElement([...teacherUsers, ...academicUsers]).id : null,
          graded_at: grade ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
          status: grade ? SubmissionStatus.GRADED : SubmissionStatus.SUBMITTED,
        }));
        submissionCount++;
      }
    }
  }
  console.log(`  ${submissionCount} submissions seeded.`);

  // ============================================================================
  // 41. GRADEBOOK CATEGORIES & ENTRIES
  // ============================================================================
  console.log('Seeding gradebook categories...');
  const gradebookCategoryRepo = dataSource.getRepository(GradebookCategory);

  let categoryCount = 0;
  for (const group of groups) {
    for (let j = 0; j < randomInt(2, 4); j++) {
      await gradebookCategoryRepo.save(gradebookCategoryRepo.create({
        group_id: group.id,
        name: randomElement(['Quizzes', 'Assignments', 'Participation', 'Exams', 'Projects']),
        weight: randomInt(10, 40),
        order: j + 1,
        created_by: randomElement([...teacherUsers, ...academicUsers]).id,
      }));
      categoryCount++;
    }
  }
  console.log(`  ${categoryCount} gradebook categories seeded.`);

  console.log('Seeding gradebook entries...');
  const gradebookEntryRepo = dataSource.getRepository(GradebookEntry);
  const gradebookCategories = await dataSource.getRepository(GradebookCategory).find();

  let entryCount = 0;
  for (const category of gradebookCategories) {
    const groupStudentsList = await groupStudentRepo.find({ where: { group_id: category.group_id } });
    for (const gs of groupStudentsList.slice(0, randomInt(5, 15))) {
      const score = randomInt(50, 100);
      const maxScore = randomInt(80, 100);
      await gradebookEntryRepo.save(gradebookEntryRepo.create({
        group_id: category.group_id,
        student_id: gs.student_id,
        category_id: category.id,
        score: score,
        max_score: maxScore,
        percentage: parseFloat(((score / maxScore) * 100).toFixed(2)),
        weighted_score: parseFloat(((score / maxScore) * category.weight).toFixed(2)),
        notes: randomBool(0.3) ? faker.lorem.sentence() : null,
        created_by: randomElement([...teacherUsers, ...academicUsers]).id,
      }));
      entryCount++;
    }
  }
  console.log(`  ${entryCount} gradebook entries seeded.`);

  // ============================================================================
  // 42. ACTIVITIES, REGISTRATIONS & PHOTOS
  // ============================================================================
  console.log('Seeding activities...');
  const activityRepo = dataSource.getRepository(Activity);

  const activities: Activity[] = [];
  const activityEventTypes = [ActivityEventType.WORKSHOP, ActivityEventType.SOCIAL, ActivityEventType.COMPETITION, ActivityEventType.FIELD_TRIP];
  const activityStatuses = [ActivityStatus.UPCOMING, ActivityStatus.ACTIVE, ActivityStatus.COMPLETED, ActivityStatus.CANCELLED];

  for (let i = 0; i < 10; i++) {
    const branch = randomElement(branches);
    const activity = await activityRepo.save(activityRepo.create({
      title: `${faker.lorem.word()} Activity ${i + 1}`,
      description: faker.lorem.paragraph(),
      type: randomElement(activityEventTypes),
      date: faker.date.soon({ days: 90 }),
      start_time: '10:00',
      end_time: '14:00',
      location: faker.location.streetAddress(),
      branch_id: branch.id,
      capacity: randomInt(10, 50),
      fee: randomInt(0, 500),
      target_levels: randomBool(0.5) ? [randomElement(levels), randomElement(levels)] : null,
      target_groups: randomBool(0.5) ? [randomElement(groups).id, randomElement(groups).id] : null,
      is_open_to_all: randomBool(0.6),
      status: randomElement(activityStatuses),
      created_by: superAdmin.id,
    }));
    activities.push(activity);
  }
  console.log(`  ${activities.length} activities seeded.`);

  console.log('Seeding activity registrations...');
  const activityRegistrationRepo = dataSource.getRepository(ActivityRegistration);

  let regCount = 0;
  for (const activity of activities) {
    const regStudents = randomElement([students, studentUsers]).slice(0, randomInt(5, 20));
    for (const student of regStudents) {
      const studentId = student.id;
      const exists = await activityRegistrationRepo.findOne({
        where: { activity_id: activity.id, student_id: studentId },
      });
      if (!exists) {
        await activityRegistrationRepo.save(activityRegistrationRepo.create({
          activity_id: activity.id,
          student_id: studentId,
          status: randomElement([RegistrationStatus.REGISTERED, RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED]),
          paid_amount: randomInt(0, 500),
        }));
        regCount++;
      }
    }
  }
  console.log(`  ${regCount} activity registrations seeded.`);

  console.log('Seeding activity photos...');
  const activityPhotoRepo = dataSource.getRepository(ActivityPhoto);

  let photoCount = 0;
  for (const activity of activities) {
    for (let j = 0; j < randomInt(1, 5); j++) {
      await activityPhotoRepo.save(activityPhotoRepo.create({
        activity_id: activity.id,
        file_url: faker.image.url(),
        caption: faker.lorem.sentence(),
        uploaded_by: randomBool(0.7) ? randomElement(users).id : null,
      }));
      photoCount++;
    }
  }
  console.log(`  ${photoCount} activity photos seeded.`);

  // ============================================================================
  // 43. INVENTORY ITEMS, STOCK LEVELS, MOVES & ISSUES
  // ============================================================================
  console.log('Seeding inventory items...');
  const inventoryItemRepo = dataSource.getRepository(InventoryItem);

  const inventoryItems: InventoryItem[] = [];
  const inventoryCategories = [InventoryCategory.BOOKS, InventoryCategory.STATIONERY, InventoryCategory.UNIFORM, InventoryCategory.ELECTRONICS, InventoryCategory.OTHER];

  for (let i = 0; i < 15; i++) {
    const item = await inventoryItemRepo.save(inventoryItemRepo.create({
      sku: `SKU-${String(i + 1).padStart(3, '0')}`,
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      category: randomElement(inventoryCategories),
      unit_cost: randomInt(50, 500),
      sale_price: randomInt(100, 1000),
      unit_of_measure: 'piece',
      reorder_level: randomInt(5, 20),
      status: randomBool(0.9) ? InventoryStatus.ACTIVE : InventoryStatus.INACTIVE,
    }));
    inventoryItems.push(item);
  }
  console.log(`  ${inventoryItems.length} inventory items seeded.`);

  console.log('Seeding stock levels...');
  const stockLevelRepo = dataSource.getRepository(StockLevel);

  let stockCount = 0;
  for (const item of inventoryItems) {
    for (const branch of branches) {
      await stockLevelRepo.save(stockLevelRepo.create({
        item_id: item.id,
        branch_id: branch.id,
        quantity: randomInt(0, 100),
        reserved_quantity: randomInt(0, 10),
        last_counted_at: randomBool(0.5) ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
      }));
      stockCount++;
    }
  }
  console.log(`  ${stockCount} stock levels seeded.`);

  console.log('Seeding stock moves...');
  const stockMoveRepo = dataSource.getRepository(StockMove);

  const stockMoveTypes = [StockMoveType.INBOUND, StockMoveType.OUTBOUND, StockMoveType.ADJUSTMENT, StockMoveType.TRANSFER];

  let moveCount = 0;
  for (let i = 0; i < 30; i++) {
    const item = randomElement(inventoryItems);
    const branch = randomElement(branches);
    const type = randomElement(stockMoveTypes);
    const quantity = randomInt(1, 20);

    await stockMoveRepo.save(stockMoveRepo.create({
      item_id: item.id,
      branch_id: branch.id,
      type: type,
      quantity: quantity,
      unit_cost: randomInt(50, 500),
      reason: faker.lorem.sentence(),
      reference_type: randomElement(['purchase', 'sale', 'adjustment', 'transfer']),
      reference_id: randomBool(0.5) ? faker.string.uuid() : null,
      created_by: randomElement([hrUser, ...financeUsers, superAdmin]).id,
    }));
    moveCount++;
  }
  console.log(`  ${moveCount} stock moves seeded.`);

  console.log('Seeding student item issues...');
  const studentItemIssueRepo = dataSource.getRepository(StudentItemIssue);

  const itemConditions = [ItemCondition.NEW, ItemCondition.GOOD, ItemCondition.FAIR, ItemCondition.POOR];

  let issueCount = 0;
  for (let i = 0; i < 25; i++) {
    const student = randomElement(students);
    const item = randomElement(inventoryItems);
    const branch = student.branch_id ? branches.find(b => b.id === student.branch_id) : randomElement(branches);

    await studentItemIssueRepo.save(studentItemIssueRepo.create({
      student_id: student.id,
      item_id: item.id,
      branch_id: branch.id,
      quantity: randomInt(1, 3),
      cost: randomInt(50, 500),
      condition_on_return: randomBool(0.6) ? randomElement(itemConditions) : null,
      created_by: randomElement([hrUser, ...academicUsers, superAdmin]).id,
    }));
    issueCount++;
  }
  console.log(`  ${issueCount} student item issues seeded.`);

  // ============================================================================
  // 44. CERTIFICATE TEMPLATES & CERTIFICATES
  // ============================================================================
  console.log('Seeding certificate templates...');
  const certificateTemplateRepo = dataSource.getRepository(CertificateTemplate);

  const certificateTemplates: CertificateTemplate[] = [];
  for (let i = 0; i < 10; i++) {
    const course = randomElement(courses);
    const template = await certificateTemplateRepo.save(certificateTemplateRepo.create({
      name: `${course.name} Certificate Template`,
      course_id: course.id,
      html_template: '<html><body><h1>Certificate of Completion</h1><p>{{student_name}}</p></body></html>',
      placeholders: { student_name: 'string', course_name: 'string', issue_date: 'date' },
      background_url: faker.image.url(),
      is_default: i === 0,
      status: 'active',
      created_by: superAdmin.id,
    }));
    certificateTemplates.push(template);
  }
  console.log(`  ${certificateTemplates.length} certificate templates seeded.`);

  console.log('Seeding certificates...');
  const certificateRepo = dataSource.getRepository(Certificate);

  const certStatuses = [CertStatus.ACTIVE, CertStatus.ACTIVE, CertStatus.ACTIVE, CertStatus.REVOKED];

  let certCount = 0;
  for (let i = 0; i < 10; i++) {
    const student = randomElement(students);
    const course = randomElement(courses);
    const group = groups.find(g => g.course_id === course.id) || randomElement(groups);
    const template = randomElement(certificateTemplates);

    await certificateRepo.save(certificateRepo.create({
      student_id: student.id,
      course_id: course.id,
      group_id: group.id,
      template_id: template.id,
      code: `CERT-${faker.string.alphanumeric(8)}`,
      pdf_url: faker.image.url(),
      issue_date: randomDate(TWELVE_MONTHS_AGO, NOW),
      expiry_date: randomBool(0.3) ? randomDate(NOW, THREE_MONTHS_FROM_NOW) : null,
      status: randomElement(certStatuses),
      issued_by: superAdmin.id,
      is_auto_issued: randomBool(0.5),
    }));
    certCount++;
  }
  console.log(`  ${certCount} certificates seeded.`);

  // ============================================================================
  // 45. PROMO CODES, REFERRALS & SALES TARGETS
  // ============================================================================
  console.log('Seeding promo codes...');
  const promoCodeRepo = dataSource.getRepository(PromoCode);

  const promoTypes = [PromoType.PERCENTAGE, PromoType.FIXED_AMOUNT];

  let promoCount = 0;
  for (let i = 0; i < 10; i++) {
    await promoCodeRepo.save(promoCodeRepo.create({
      code: `SAVE${randomInt(10, 99)}`,
      type: randomElement(promoTypes),
      value: randomInt(5, 50),
      max_discount: randomInt(50, 500),
      expiry_date: randomDate(NOW, THREE_MONTHS_FROM_NOW),
      usage_limit: randomInt(10, 100),
      used_count: randomInt(0, 50),
      applicable_courses: randomBool(0.5) ? [randomElement(courses).id] : null,
      applicable_branches: randomBool(0.5) ? [randomElement(branches).id] : null,
      status: 'active',
      created_by: randomElement([...salesUsers, superAdmin]).id,
    }));
    promoCount++;
  }
  console.log(`  ${promoCount} promo codes seeded.`);

  console.log('Seeding referrals...');
  const referralRepo = dataSource.getRepository(Referral);

  let referralCount = 0;
  for (let i = 0; i < 15; i++) {
    const referrer = randomElement(students);
    const referredStudent = randomBool(0.6) ? randomElement(students) : null;
    const referredLead = randomBool(0.3) ? randomElement(leads) : null;

    await referralRepo.save(referralRepo.create({
      referrer_student_id: referrer.id,
      referred_student_id: referredStudent?.id || null,
      referred_lead_id: referredLead?.id || null,
      credit_amount: randomInt(50, 200),
      status: randomElement(['pending', 'completed', 'completed', 'cancelled']),
    }));
    referralCount++;
  }
  console.log(`  ${referralCount} referrals seeded.`);

  console.log('Seeding sales targets...');
  const salesTargetRepo = dataSource.getRepository(SalesTarget);

  let targetCount = 0;
  for (const agent of salesUsers) {
    for (let m = 1; m <= 6; m++) {
      await salesTargetRepo.save(salesTargetRepo.create({
        agent_id: agent.id,
        month: m,
        year: 2025,
        target_amount: randomInt(10000, 50000),
        target_conversions: randomInt(5, 20),
        achieved_amount: randomInt(5000, 45000),
        achieved_conversions: randomInt(2, 18),
      }));
      targetCount++;
    }
  }
  console.log(`  ${targetCount} sales targets seeded.`);

  // ============================================================================
  // 46. NOTIFICATIONS & PREFERENCES
  // ============================================================================
  console.log('Seeding notifications...');
  const notificationRepo = dataSource.getRepository(Notification);

  const notificationTypes = ['enrollment', 'payment', 'attendance', 'grade', 'system', 'reminder'];

  let notificationCount = 0;
  for (let i = 0; i < 50; i++) {
    const user = randomElement(users);
    await notificationRepo.save(notificationRepo.create({
      user_id: user.id,
      type: randomElement(notificationTypes),
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      data: randomBool(0.5) ? { action_id: faker.string.uuid() } : null,
      action_url: randomBool(0.3) ? `/dashboard/${randomElement(['courses', 'groups', 'payments'])}` : null,
      read_at: randomBool(0.4) ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
    }));
    notificationCount++;
  }
  console.log(`  ${notificationCount} notifications seeded.`);

  console.log('Seeding notification preferences...');
  const notificationPreferenceRepo = dataSource.getRepository(NotificationPreference);

  const notificationChannels = [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH];
  const modules = ['enrollment', 'payment', 'attendance', 'grade', 'system', 'chat'];
  const events = ['created', 'updated', 'deleted', 'reminder', 'approved', 'rejected'];

  let prefCount = 0;
  for (const user of users) {
    for (const channel of notificationChannels) {
      for (const module of modules) {
        for (const event of events) {
          if (randomBool(0.3)) {
            await notificationPreferenceRepo.save(notificationPreferenceRepo.create({
              user_id: user.id,
              channel: channel,
              module: module,
              event: event,
              is_enabled: randomBool(0.8),
            }));
            prefCount++;
          }
        }
      }
    }
  }
  console.log(`  ${prefCount} notification preferences seeded.`);

  // ============================================================================
  // 47. AUDIT LOGS, WAITLISTS, COURSE PREREQUISITES
  // ============================================================================
  console.log('Seeding audit logs...');
  const auditLogRepo = dataSource.getRepository(AuditLog);

  const actorTypes = [ActorType.USER, ActorType.SYSTEM, ActorType.API];
  const auditModules = ['users', 'courses', 'groups', 'invoices', 'payments', 'students', 'branches'];

  let auditCount = 0;
  for (let i = 0; i < 50; i++) {
    await auditLogRepo.save(auditLogRepo.create({
      actor_id: randomBool(0.8) ? randomElement(users).id : null,
      actor_type: randomElement(actorTypes),
      action: randomElement(['create', 'update', 'delete', 'view', 'login', 'logout']),
      module: randomElement(auditModules),
      target_type: randomElement(['user', 'course', 'group', 'invoice', 'payment', 'student']),
      target_id: randomBool(0.7) ? faker.string.uuid() : null,
      before_state: randomBool(0.5) ? { field: 'old_value' } : null,
      after_state: randomBool(0.5) ? { field: 'new_value' } : null,
      description: faker.lorem.sentence(),
      ip_address: faker.internet.ip(),
      user_agent: faker.internet.userAgent(),
      session_id: faker.string.uuid(),
    }));
    auditCount++;
  }
  console.log(`  ${auditCount} audit logs seeded.`);

  console.log('Seeding waitlists...');
  const waitlistRepo = dataSource.getRepository(Waitlist);

  let waitlistCount = 0;
  for (let i = 0; i < 15; i++) {
    const student = randomElement(students);
    const course = randomElement(courses);
    await waitlistRepo.save(waitlistRepo.create({
      student_id: student.id,
      course_id: course.id,
      level: randomElement(levels),
      branch_id: randomElement(branches).id,
      priority: randomInt(1, 10),
      status: randomElement(['waiting', 'enrolled', 'cancelled']),
      notes: faker.lorem.sentence(),
      enrolled_at: randomBool(0.3) ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
    }));
    waitlistCount++;
  }
  console.log(`  ${waitlistCount} waitlist entries seeded.`);

  console.log('Seeding course prerequisites...');
  const coursePrerequisiteRepo = dataSource.getRepository(CoursePrerequisite);

  let prereqCount = 0;
  for (let i = 1; i < courses.length; i++) {
    if (randomBool(0.3)) {
      await coursePrerequisiteRepo.save(coursePrerequisiteRepo.create({
        course_id: courses[i].id,
        prerequisite_course_id: courses[i - 1].id,
        is_strict: true,
      }));
      prereqCount++;
    }
  }
  console.log(`  ${prereqCount} course prerequisites seeded.`);

  // ============================================================================
  // 48. CRM ACTIVITIES, LEAD TAGS, FOLLOW-UPS
  // ============================================================================
  console.log('Seeding follow-ups...');
  const followUpRepo = dataSource.getRepository(FollowUp);

  const followUpStatuses = [FollowUpStatus.PENDING, FollowUpStatus.COMPLETED, FollowUpStatus.OVERDUE];

  let followUpCount = 0;
  for (let i = 0; i < 30; i++) {
    const lead = randomElement(leads);
    await followUpRepo.save(followUpRepo.create({
      lead_id: lead.id,
      assigned_to: randomElement([...salesUsers, managerCairo, managerAlex]).id,
      due_date: randomDate(TWELVE_MONTHS_AGO, THREE_MONTHS_FROM_NOW),
      status: randomElement(followUpStatuses),
      note: faker.lorem.sentence(),
      completed_at: randomBool(0.5) ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
    }));
    followUpCount++;
  }
  console.log(`  ${followUpCount} follow-ups seeded.`);

  console.log('Seeding lead activities...');
  const leadActivityRepo = dataSource.getRepository(LeadActivity);

  const activityTypes = [ActivityType.CALL, ActivityType.EMAIL, ActivityType.FOLLOW_UP, ActivityType.VISIT];

  let leadActivityCount = 0;
  for (let i = 0; i < 40; i++) {
    const lead = randomElement(leads);
    await leadActivityRepo.save(leadActivityRepo.create({
      lead_id: lead.id,
      type: randomElement(activityTypes),
      note: faker.lorem.sentence(),
      old_status: randomBool(0.5) ? randomElement(Object.values(LeadStatus)) : null,
      new_status: randomBool(0.5) ? randomElement(Object.values(LeadStatus)) : null,
      scheduled_at: randomBool(0.6) ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
      completed_at: randomBool(0.6) ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
      created_by: randomElement([...salesUsers, managerCairo, managerAlex]).id,
    }));
    leadActivityCount++;
  }
  console.log(`  ${leadActivityCount} lead activities seeded.`);

  console.log('Seeding lead tags...');
  const leadTagRepo = dataSource.getRepository(LeadTag);
  const leadTagPivotRepo = dataSource.getRepository(LeadTagPivot);

  const leadTags: LeadTag[] = [];
  for (let i = 0; i < 10; i++) {
    const tag = await leadTagRepo.save(leadTagRepo.create({
      name: randomElement(['VIP', 'Hot Lead', 'Cold Lead', 'Referral', 'Repeat Customer', 'Discount Request']),
      color: faker.color.rgb(),
      branch_id: randomBool(0.5) ? randomElement(branches).id : null,
    }));
    leadTags.push(tag);
  }

  let tagPivotCount = 0;
  for (const lead of leads.slice(0, 25)) {
    for (let j = 0; j < randomInt(1, 3); j++) {
      const tag = randomElement(leadTags);
      const exists = await leadTagPivotRepo.findOne({
        where: { lead_id: lead.id, tag_id: tag.id },
      });
      if (!exists) {
        await leadTagPivotRepo.save(leadTagPivotRepo.create({
          lead_id: lead.id,
          tag_id: tag.id,
        }));
        tagPivotCount++;
      }
    }
  }
  console.log(`  ${leadTags.length} lead tags and ${tagPivotCount} tag pivots seeded.`);

  // ============================================================================
  // 49. KB CATEGORIES & ARTICLES
  // ============================================================================
  console.log('Seeding KB categories and articles...');
  const kbCategoryRepo = dataSource.getRepository(KbCategory);
  const kbArticleRepo = dataSource.getRepository(KbArticle);
  const kbArticleVersionRepo = dataSource.getRepository(KbArticleVersion);

  const kbCategories: KbCategory[] = [];
  for (let i = 0; i < 5; i++) {
    const category = await kbCategoryRepo.save(kbCategoryRepo.create({
      name: randomElement(['Getting Started', 'Academic Policies', 'Payment Guide', 'Technical Support', 'Teacher Resources']),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      visibility: randomElement([KbVisibility.STAFF, KbVisibility.PUBLIC, KbVisibility.TEACHER]),
      sort_order: i + 1,
    }));
    kbCategories.push(category);
  }

  let kbArticleCount = 0;
  for (let i = 0; i < 15; i++) {
    const category = randomElement(kbCategories);
    const article = await kbArticleRepo.save(kbArticleRepo.create({
      category_id: category.id,
      title: `KB Article ${i + 1}: ${faker.lorem.sentence()}`,
      slug: faker.lorem.slug(),
      body: faker.lorem.paragraphs(3),
      excerpt: faker.lorem.sentence(),
      tags: randomBool(0.5) ? ['help', 'guide'] : null,
      version: 1,
      visibility: category.visibility,
      is_pinned: randomBool(0.2),
      view_count: randomInt(0, 500),
      created_by: superAdmin.id,
      updated_by: superAdmin.id,
    }));

    await kbArticleVersionRepo.save(kbArticleVersionRepo.create({
      article_id: article.id,
      body: article.body,
      version_number: 1,
      change_note: 'Initial version',
      created_by: superAdmin.id,
    }));
    kbArticleCount++;
  }
  console.log(`  ${kbCategories.length} KB categories and ${kbArticleCount} KB articles seeded.`);

  // ============================================================================
  // 50. STUDENT LEVEL HISTORY, SURVEYS, TESTIMONIALS
  // ============================================================================
  console.log('Seeding student level history...');
  const studentLevelHistoryRepo = dataSource.getRepository(StudentLevelHistory);

  let levelHistoryCount = 0;
  for (const student of students.slice(0, 15)) {
    for (let j = 0; j < randomInt(1, 3); j++) {
      const oldLevel = randomElement(levels);
      const newLevel = levels[Math.max(0, levels.indexOf(oldLevel) + randomInt(0, 2))];
      await studentLevelHistoryRepo.save(studentLevelHistoryRepo.create({
        student_id: student.id,
        old_level: oldLevel,
        new_level: newLevel,
        reason: randomElement(['Course completion', 'Placement test', 'Teacher recommendation']),
        changed_by: randomElement([...academicUsers, superAdmin]).id,
      }));
      levelHistoryCount++;
    }
  }
  console.log(`  ${levelHistoryCount} student level history records seeded.`);

  console.log('Seeding student surveys...');
  const studentSurveyRepo = dataSource.getRepository(StudentSurvey);

  let surveyCount = 0;
  for (let i = 0; i < 15; i++) {
    const group = randomElement(groups);
    const groupStudentsList = await groupStudentRepo.find({ where: { group_id: group.id } });
    if (groupStudentsList.length === 0) continue;
    const student = randomElement(groupStudentsList);

    await studentSurveyRepo.save(studentSurveyRepo.create({
      group_id: group.id,
      student_id: student.student_id,
      teacher_id: group.teacher_id,
      term: `Term ${randomInt(1, 3)}`,
      responses: { q1: 4, q2: 5, q3: 3 },
      overall_rating: randomInt(1, 5),
      comment: faker.lorem.sentence(),
      is_anonymous: randomBool(0.5),
    }));
    surveyCount++;
  }
  console.log(`  ${surveyCount} student surveys seeded.`);

  console.log('Seeding testimonials...');
  const testimonialRepo = dataSource.getRepository(Testimonial);

  let testimonialCount = 0;
  for (let i = 0; i < 10; i++) {
    const student = randomBool(0.8) ? randomElement(students) : null;
    await testimonialRepo.save(testimonialRepo.create({
      student_id: student?.id || null,
      name: faker.person.fullName(),
      content: faker.lorem.paragraph(),
      photo_url: randomBool(0.5) ? faker.image.avatar() : null,
      rating: randomInt(1, 5),
      course_name: randomElement(courses).name,
      is_featured: randomBool(0.2),
      status: randomElement([TestimonialStatus.PENDING, TestimonialStatus.APPROVED, TestimonialStatus.APPROVED]),
    }));
    testimonialCount++;
  }
  console.log(`  ${testimonialCount} testimonials seeded.`);

  // ============================================================================
  // 51. BLOG POSTS, EMPLOYEE DOCUMENTS, CHAT CONSENTS
  // ============================================================================
  console.log('Seeding blog posts...');
  const blogPostRepo = dataSource.getRepository(BlogPost);

  const postStatuses = [PostStatus.DRAFT, PostStatus.PUBLISHED, PostStatus.PUBLISHED, PostStatus.ARCHIVED];

  let blogCount = 0;
  for (let i = 0; i < 10; i++) {
    await blogPostRepo.save(blogPostRepo.create({
      title: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      content: faker.lorem.paragraphs(3),
      excerpt: faker.lorem.sentence(),
      featured_image: faker.image.url(),
      meta_title: faker.lorem.sentence(),
      meta_description: faker.lorem.sentence(),
      status: randomElement(postStatuses),
      published_at: randomBool(0.7) ? randomDate(TWELVE_MONTHS_AGO, NOW) : null,
      author_id: randomElement([superAdmin, ...academicUsers, ...teacherUsers]).id,
      view_count: randomInt(0, 1000),
    }));
    blogCount++;
  }
  console.log(`  ${blogCount} blog posts seeded.`);

  console.log('Seeding employee documents...');
  const employeeDocumentRepo = dataSource.getRepository(EmployeeDocument);

  const documentTypes = [DocumentType.CONTRACT, DocumentType.ID, DocumentType.CERTIFICATE, DocumentType.OTHER];

  let docCount = 0;
  for (const employee of employees) {
    for (let j = 0; j < randomInt(1, 2); j++) {
      await employeeDocumentRepo.save(employeeDocumentRepo.create({
        employee_id: employee.id,
        name: faker.lorem.words(3),
        file_url: faker.image.url(),
        document_type: randomElement(documentTypes),
        expiry_date: randomBool(0.5) ? randomDate(NOW, THREE_MONTHS_FROM_NOW) : null,
      }));
      docCount++;
    }
  }
  console.log(`  ${docCount} employee documents seeded.`);

  console.log('Seeding chat consents...');
  const chatConsentRepo = dataSource.getRepository(ChatConsent);

  let consentCount = 0;
  for (const user of users.slice(0, 30)) {
    await chatConsentRepo.save(chatConsentRepo.create({
      user_id: user.id,
      accepted_at: randomDate(TWELVE_MONTHS_AGO, NOW),
      policy_version: '1.0',
    }));
    consentCount++;
  }
  console.log(`  ${consentCount} chat consents seeded.`);

  console.log('\n=== Comprehensive Seed Complete ===\\n');
  console.log('Summary:');
  console.log(`  Branches: ${branches.length}`);
  console.log(`  Roles: ${roles.length}`);
  console.log(`  Users: ${users.length}`);
  console.log(`  Courses: ${courses.length}`);
  console.log(`  Classrooms: ${classrooms.length}`);
  console.log(`  Employees: ${employees.length}`);
  console.log(`  Students: ${students.length}`);
  console.log(`  Groups: ${groups.length}`);
  console.log(`  Sessions: ${sessionCount}`);
  console.log(`  Attendances: ${attendanceCount}`);
  console.log(`  Leads: ${leads.length}`);
  console.log(`  Invoices: ${invoices.length}`);
  console.log(`  Payments: ${paymentCount}`);
  console.log(`  Chat Rooms: ${chatRooms.length}`);
  console.log(`  Chat Messages: ${messageCount}`);
}
