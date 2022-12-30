export interface ISingleTeam {
  name: string;
  doctors: Array<{ id: string; name: string; surname: string }>;
  nurses: Array<{ id: string; name: string; surname: string }>;
}
