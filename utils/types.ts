export enum Role {
  student = "student",
  teacher = "teacher",
  admin = "admin",
  coordinator = "coordinator",
}

export type RouteConfig = {
  caption: string;
  icon: string;
  label: string;
  roles: Role[];
  route: string;
  secondaryRoutes?: string[];
};
