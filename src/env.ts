import * as core from '@actions/core';
import * as gh from '@actions/github';

export function getEnvVar(name: string): string {
  return core.getInput(name);
}

export const github = gh.context;

export const vercelTeamId = getEnvVar('vercel_team_id');
export const vercelProjectId = getEnvVar('vercel_project_id');
export const vercelAccessToken = getEnvVar('vercel_access_token');
export const commitHash = getEnvVar('commit_hash');
