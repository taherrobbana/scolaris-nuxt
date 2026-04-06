export enum Role {
  student = "student",
  teacher = "teacher",
  admin = "admin",
  coordinator = "coordinator",
}

export const ALL_ROLES = [
  Role.student,
  Role.teacher,
  Role.admin,
  Role.coordinator,
];

export type RouteConfig = {
  caption: string;
  icon: string;
  label: string;
  roles: Role[];
  route?: string;
  secondaryRoutes?: string[];
  isFooter?: boolean;
  action?: any;
};
