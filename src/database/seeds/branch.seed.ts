import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Branch } from '../../shared/entities/branch.entity';
import { BranchStatus } from '../../common/enums/branch-status.enum';
import { User } from '../../shared/entities/user.entity';
import { UserStatus } from '../../common/enums/user-status.enum';
import { Role } from '../../shared/entities/role.entity';
import { UserRole } from '../../shared/entities/user-role.entity';

export async function seedBranch(dataSource: DataSource) {
  const branchRepo = dataSource.getRepository(Branch);
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);
  const userRoleRepo = dataSource.getRepository(UserRole);

  const { v4: uuidv4 } = require('uuid');

  const cairoId = uuidv4();
  const alexandriaId = uuidv4();
  const onlineId = uuidv4();

  // 1. Seed branches with BranchStatus enum
  const branches = [
    {
      id: cairoId,
      name: 'Cairo Main Branch',
      address: '45 Talaat Harb Street, Downtown, Cairo, Egypt',
      phone: '+20225789012',
      email: 'cairo@speakup.com',
      status: BranchStatus.ACTIVE,
      classroom_count: 5,
      logo_url: 'https://speakup.com/logos/cairo-main.png',
    },
    {
      id: alexandriaId,
      name: 'Alexandria Branch',
      address: '123 Fouad Street, Alexandria, Egypt',
      phone: '+2033882233',
      email: 'alexandria@speakup.com',
      status: BranchStatus.ACTIVE,
      classroom_count: 3,
      logo_url: 'https://speakup.com/logos/alexandria.png',
    },
    {
      id: onlineId,
      name: 'Online Campus',
      address: 'Virtual - Online Learning Platform',
      phone: '+20220000000',
      email: 'online@speakup.com',
      status: BranchStatus.ACTIVE,
      classroom_count: 0,
      logo_url: 'https://speakup.com/logos/online.png',
    },
  ];

  for (const branch of branches) {
    const exists = await branchRepo.findOne({ where: { id: branch.id } });
    if (!exists) {
      await branchRepo.save(branchRepo.create(branch));
      console.log(`Branch seeded: ${branch.name}`);
    }
  }

  // 2. Seed branch manager users with proper bcrypt hashes
  const passwordHash = await bcrypt.hash('password123', 10);

  const cairoManagerId = uuidv4();
  const alexManagerId = uuidv4();

  const managers = [
    {
      id: cairoManagerId,
      email: 'manager.cairo@speakup.com',
      password_hash: passwordHash,
      first_name: 'Ahmed',
      last_name: 'Hassan',
      branch_id: cairoId,
      language: 'ar',
      status: UserStatus.ACTIVE,
    },
    {
      id: alexManagerId,
      email: 'manager.alex@speakup.com',
      password_hash: passwordHash,
      first_name: 'Samy',
      last_name: 'Ibrahim',
      branch_id: alexandriaId,
      language: 'ar',
      status: UserStatus.ACTIVE,
    },
  ];

  for (const manager of managers) {
    const exists = await userRepo.findOne({ where: { email: manager.email } });
    if (!exists) {
      await userRepo.save(userRepo.create(manager));
      console.log(`Branch manager user seeded: ${manager.email}`);
    }
  }

  // 3. Assign branch_manager role to managers
  const branchManagerRole = await roleRepo.findOne({ where: { slug: 'branch_manager' } });
  if (branchManagerRole) {
    for (const manager of managers) {
      const existingLink = await userRoleRepo.findOne({
        where: { user_id: manager.id, role_id: branchManagerRole.id },
      });
      if (!existingLink) {
        await userRoleRepo.save(
          userRoleRepo.create({
            user_id: manager.id,
            role_id: branchManagerRole.id,
          }),
        );
        console.log(`Role assigned: branch_manager -> ${manager.email}`);
      }
    }
  }

  // 4. Update branches with their manager_id
  if (branchManagerRole) {
    await dataSource.query(
      `UPDATE branches SET manager_id = $1 WHERE id = $2`,
      [cairoManagerId, cairoId],
    );
    await dataSource.query(
      `UPDATE branches SET manager_id = $1 WHERE id = $2`,
      [alexManagerId, alexandriaId],
    );
  }

  console.log('Branch seeding completed successfully.');
}