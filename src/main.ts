import * as core from '@actions/core';
import { AxiosError } from 'axios';
import { commitHash, github } from './env';
import { getBuildForDeployment, getDeploymentWhere } from './vercel';
import { wait } from './wait';

async function run(): Promise<void> {
  try {
    // get latest commit hash
    const triggerHash = commitHash;

    // find deployment for commit hash
    core.info(`Seeking deployment for commit ${triggerHash.slice(0, 6)}`);
    let deployment = await getDeploymentWhere((dep) => {
      return !!dep.meta?.githubCommitSha.includes(triggerHash);
    });

    if (!deployment) {
      core.warning(
        'No deployment was found... Trying one more time in 5 seconds.',
      );
      await wait(5000);
      deployment = await getDeploymentWhere((dep) => {
        return !!dep.meta?.githubCommitSha.includes(triggerHash);
      });

      if (!deployment) {
        core.setFailed('No deployment was found in either attempt.');
      }
    }

    core.info(
      `Found deployment with id "${
        deployment.uid
      }" for commit ${triggerHash.slice(0, 6)}`,
    );

    // wait for deployment to complete
    let build: Build | null = null;
    do {
      // polling
      if (build) {
        core.debug(
          `Build is ${build.readyState.toLowerCase()}. Waiting 2 second(s) before trying again`,
        );
        await wait(2000);
      }

      build = await getBuildForDeployment(deployment);

      // Vercel uses the present tense to indicate that things are still happening
    } while (build.readyState.toLowerCase().includes('ing'));

    // handle cases where the build didn't complete
    const successCases = ['QUEUED', 'READY'];
    if (!successCases.includes(build.readyState)) {
      core.warning(`Build has been marked as ${build.readyState}`);
    }

    if (!deployment.url) {
      // get the deployment again because the build is dumb and doesn't have the domain
      deployment = await getDeploymentWhere(
        (dep) => dep.meta?.githubCommitSha === triggerHash,
      );
    }

    // register the url as an output
    core.notice(`Publishing ${deployment.url} as variable "deployment_url"`);
    core.setOutput('deployment_url', deployment.url);
  } catch (error) {
    if ((error as AxiosError).toJSON)
      core.info(JSON.stringify((error as AxiosError).toJSON(), null, 2));
    if (error instanceof Error) core.setFailed(error);
  }
}

run();
