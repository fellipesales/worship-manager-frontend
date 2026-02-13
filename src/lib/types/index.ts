export interface Organization {
  id: number;
  name: string;
  slug: string;
  inviteCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface Member {
  id: number;
  organizationId: number;
  userId?: string;
  name: string;
  instrument?: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  isActive: boolean;
  participationCount: number;
  lastParticipationDate?: string;
  createdAt: string;
}

export interface Schedule {
  id: number;
  organizationId: number;
  date: string;
  serviceType: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt: string;
  scheduleMembers: ScheduleMember[];
  scheduleSongs: ScheduleSong[];
}

export interface ScheduleMember {
  id: number;
  scheduleId: number;
  memberId: number;
  role?: string;
  confirmed: boolean;
  member?: Member;
}

export interface Song {
  id: number;
  organizationId: number;
  title: string;
  artist?: string;
  key?: string;
  tempo?: string;
  category?: string;
  spotifyUrl?: string;
  youTubeUrl?: string;
  chordsUrl?: string;
  lyrics?: string;
  notes?: string;
  isActive: boolean;
}

export interface ScheduleSong {
  id: number;
  scheduleId: number;
  songId: number;
  order: number;
  customKey?: string;
  notes?: string;
  song?: Song;
}

export interface Availability {
  id: number;
  memberId: number;
  date: string;
  isAvailable: boolean;
  notes?: string;
  member?: Member;
}

export interface Role {
  id: number;
  name: string;
  category?: string;
  icon?: string;
  displayOrder: number;
}

export interface MemberRole {
  id: number;
  memberId: number;
  roleId: number;
  isPrimary: boolean;
  role?: Role;
}

export interface MessageTemplate {
  id: number;
  name: string;
  type: string;
  template: string;
  isActive: boolean;
}

export interface OrganizationSettings {
  maximumMembersPerSchedule: number;
  minimumMembersPerSchedule: number;
  minimumDaysBetweenParticipation: number;
  enableWhatsAppNotifications: boolean;
  reminderDaysBefore: number;
  serviceTypesJson: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalSchedules: number;
  upcomingSchedules: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  photoUrl?: string;
  organizationId?: number;
  organizationName?: string;
}
