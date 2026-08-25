'use client';
import { createContext, useContext } from 'react';

export type AdminRole = 'center_admin' | 'hq_staff' | 'exam_manager' | 'marketing' | 'finance';

export const AdminRoleContext = createContext<AdminRole>('hq_staff');
export const useAdminRole = () => useContext(AdminRoleContext);

// Page access per role
export const ROLE_NAV_ACCESS: Record<AdminRole, string[]> = {
  center_admin: ['overview', 'countries', 'schools', 'students', 'competitions', 'grand-finals', 'finance', 'content', 'communications', 'settings', 'registrations'],
  hq_staff:     ['overview', 'countries', 'schools', 'students', 'communications', 'registrations'],
  exam_manager: ['overview', 'countries', 'schools', 'students', 'competitions', 'grand-finals', 'communications', 'registrations'],
  marketing:    ['overview', 'content', 'communications'],
  finance:      ['overview', 'finance'],
};

export function canAccess(role: AdminRole, page: string): boolean {
  return ROLE_NAV_ACCESS[role]?.includes(page) ?? false;
}

// Display labels for each role
export const ROLE_LABELS: Record<AdminRole, string> = {
  center_admin: 'Admin',
  hq_staff:     'HQ Staff',
  exam_manager: 'QLKT',
  marketing:    'Marketing',
  finance:      'Finance',
};