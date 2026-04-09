export type TODO = any;

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
  roles: Role | string[];
  route?: string;
  secondaryRoutes?: string[];
  isFooter?: boolean;
  action?: any;
};

export type QTableColumn = {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean | undefined;
  align?: "center" | "left" | "right" | undefined;
  sortable?: boolean | undefined;
  sort?: ((a: any, b: any, rowA: any, rowB: any) => number) | undefined;
  rawSort?: ((a: any, b: any, rowA: any, rowB: any) => number) | undefined;
  sortOrder?: "ad" | "da" | undefined;
  format?: ((val: any, row: any) => any) | undefined;
  style?: string | ((row: any) => string) | undefined;
  classes?: string | ((row: any) => string) | undefined;
  headerStyle?: string | undefined;
  headerClasses?: string | undefined;
};
