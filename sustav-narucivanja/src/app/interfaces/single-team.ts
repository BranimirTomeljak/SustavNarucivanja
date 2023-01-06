export interface ISingleTeam {
  teamId: number;
  name: string;
  doctors: Array<{ id: number; name: string; surname: string }>;
  nurses: Array<{ id: number; name: string; surname: string }>;
}
