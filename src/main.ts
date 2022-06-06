import * as core from '@actions/core';
import { commitHash, github } from './env';
import { getBuildForDeployment, getDeploymentWhere } from './vercel';
import { wait } from './wait';

async function run(): Promise<void> {
  try {
    // get latest commit hash
    const triggerHash = commitHash ?? github.sha;

    // find deployment for commit hash
    let deployment = await getDeploymentWhere(
      (dep) => dep.meta?.githubCommitSha === triggerHash,
    );
    core.debug(
      `Deployment with id "${deployment.uid}" found for commit ${triggerHash}`,
    );

    // wait for deployment to complete
    let build: Build | null = null;
    do {
      // polling
      if (build) {
        core.debug(
          'Build is not in a ready state. Waiting 10 seconds before trying again',
        );
        wait(10000);
      }

      build = await getBuildForDeployment(deployment);

      // Vercel uses the present tense to indicate that things are still happening
    } while (build.readyState.includes('ing'));

    if (!deployment.url) {
      // get the deployment again because the build is dumb and doesn't have the domain
      deployment = await getDeploymentWhere(
        (dep) => dep.meta?.githubCommitSha === triggerHash,
      );
    }

    // register the url as an output
    core.setOutput('deployment_url', deployment.url);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
