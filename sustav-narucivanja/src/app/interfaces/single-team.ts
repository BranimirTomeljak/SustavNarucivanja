export interface ISingleTeam {
  teamId: number;
  name: string;
  doctors: Array<{ id: string; name: string; surname: string }>;
  nurses: Array<{ id: string; name: string; surname: string }>;
}
