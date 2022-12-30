export interface ISingleTeam {
  name: string;
  doctorIds: Array<{ id: string; name: string; surname: string }>;
  nurseIds: Array<{ id: string; name: string; surname: string }>;
}
