import axios from 'axios';
import { URLSearchParams } from 'url';
import { vercelAccessToken, vercelProjectId, vercelTeamId } from './env';

export const enum DeploymentState {
  Building = 'BUILDING',
  Error = 'ERROR',
  Initializing = 'INITIALIZING',
  Queued = 'QUEUED',
  Ready = 'READY',
  Canceled = 'CANCELED',
}

export function getBuildStatus(
  deployment: Deployment,
): DeploymentState | undefined {
  switch (deployment.state) {
    case DeploymentState.Building: {
      return DeploymentState.Building;
    }
    case DeploymentState.Canceled: {
      return DeploymentState.Canceled;
    }
    case DeploymentState.Error: {
      return DeploymentState.Error;
    }
    case DeploymentState.Initializing: {
      return DeploymentState.Initializing;
    }
    case DeploymentState.Queued: {
      return DeploymentState.Queued;
    }
    case DeploymentState.Ready: {
      return DeploymentState.Ready;
    }
    case undefined: {
      return undefined;
    }
    default:
      throw new Error(
        `The deployment state, ${deployment.ready} is not one of the expected states from the Vercel documentation. To update this action, see https://vercel.com/docs/rest-api#endpoints/deployments/list-deployments`,
      );
  }
}

interface DeploymentsRequestConfig {
  app?: string;
  from?: number;
  limit?: number;
  projectId?: string;
  since?: number;
  state?: DeploymentState;
  target?: string;
  teamId?: string;
  to?: number;
  until?: number;
  users?: string;
}

function getDeployments(
  args: DeploymentsRequestConfig,
): Promise<DeploymentResponse> {
  const params = new URLSearchParams(Object.entries(args));
  return axios
    .get<DeploymentResponse>(
      `https://api.vercel.com/v6/deployments?${params.toString()}`,
      { headers: { Authorization: `Bearer ${vercelAccessToken}` } },
    )
    .then((r) => r.data);
}

export function getDeploymentWhere(
  cb: (dep: Deployment) => boolean,
  config?: DeploymentsRequestConfig,
): Promise<Deployment> {
  const args: DeploymentsRequestConfig = {
    teamId: vercelTeamId,
    projectId: vercelProjectId,
  };
  return getDeployments(args).then((res) => {
    const index = res.deployments.findIndex(cb);

    if (index >= 0) {
      return res.deployments[index];
    } else if (res.pagination.next !== null) {
      return getDeploymentWhere(cb, { ...args, until: res.pagination.next });
    }

    throw new Error(
      `Expected 'res.pagination.next' to be one of 'null' or 'number', but got ${typeof res
        .pagination.next}`,
    );
  });
}

interface DeploymentBuildRequestConfig {
  teamId: string;
}

export function getBuildForDeployment(dep: Deployment): Promise<Build> {
  return axios
    .get<BuildResponse>(
      `https://api.vercel.com/v11/deployments/${dep.uid}/builds?`,
    )
    .then((r) => r.data.builds.at(-1))
    .then((build) => {
      if (build) return build;

      throw new Error(`No builds found for deployment with id: ${dep.uid}`);
    });
}
