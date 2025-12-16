export type Branch = {
  id: number;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  region?: string;
  phone?: string;
  email?: string;
  tenantId: string;
  createdAt?: Date;
  updatedAt?: Date;
  managerId:string
};


export interface BranchesProps  {
    branches: Branch[]
}

export interface BranchProps {
    branch: Branch
}