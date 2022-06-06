interface Pagination {
  /** Amount of items in the current page. */
  count: number;
  /** Timestamp that must be used to request the next page. */
  next: number | null;
  /** Timestamp that must be used to request the previous page. */
  prev: number | null;
}

interface Deployment {
  /** The unique identifier of the deployment. */
  uid: string;
  /** The name of the deployment. */
  name: string;
  /** The URL of the deployment. */
  url: string;
  /** Timestamp of when the deployment got created. */
  created: number;
  /** In which state is the deployment. */
  state?:
    | 'BUILDING'
    | 'ERROR'
    | 'INITIALIZING'
    | 'QUEUED'
    | 'READY'
    | 'CANCELED';
  /** The type of the deployment. */
  type: 'LAMBDAS';
  /** Metadata information of the user who created the deployment. */
  creator: {
    /** The unique identifier of the user. */
    uid: string;
    /** The email address of the user. */
    email?: string;
    /** The username of the user. */
    username?: string;
    /** The GitHub login of the user. */
    githubLogin?: string;
    /** The GitLab login of the user. */
    gitlabLogin?: string;
  };
  /** Metadata information from the Git provider. */
  meta?: {
    [key: string]: string;
    githubCommitAuthorName: string;
    githubCommitMessage: string;
    githubCommitOrg: string;
    githubCommitRef: string;
    githubCommitRepo: string;
    githubCommitRepoId: string;
    githubCommitSha: string;
    githubDeployment: string;
    githubOrg: string;
    githubRepo: string;
    githubRepoId: string;
    githubCommitAuthorLogin: string;
    githubPrId: string;
  };
  /** On which environment has the deployment been deployed to. */
  target?: ('production' | 'staging') | null;
  /** An error object in case aliasing of the deployment failed. */
  aliasError?: {
    code: string;
    message: string;
  } | null;
  aliasAssigned?: (number | boolean) | null;
  /** Timestamp of when the deployment got created. */
  createdAt?: number;
  /** Timestamp of when the deployment started building at. */
  buildingAt?: number;
  /** Timestamp of when the deployment got ready. */
  ready?: number;
  /** State of all registered checks */
  checksState?: 'registered' | 'running' | 'completed';
  /** Conclusion for checks */
  checksConclusion?: 'succeeded' | 'failed' | 'skipped' | 'canceled';
  /** Vercel URL to inspect the deployment. */
  inspectorUrl: string | null;
}

interface DeploymentResponse {
  pagination: Pagination;
  deployments: Deployment[];
}

interface Build {
  /** The unique identifier of the Build */
  id: string;
  /** The unique identifier of the deployment */
  deploymentId: string;
  /** The entrypoint of the deployment */
  entrypoint: string;
  /** The state of the deployment depending on the process of deploying, or if it is ready or in an error state */
  readyState:
    | 'INITIALIZING'
    | 'BUILDING'
    | 'UPLOADING'
    | 'DEPLOYING'
    | 'READY'
    | 'ARCHIVED'
    | 'ERROR'
    | 'QUEUED'
    | 'CANCELED';
  /** The time at which the Build state was last modified */
  readyStateAt?: number;
  /** The time at which the Build was scheduled to be built */
  scheduledAt?: number | null;
  /** The time at which the Build was created */
  createdAt?: number;
  /** The time at which the Build was deployed */
  deployedAt?: number;
  /** The region where the Build was first created */
  createdIn?: string;
  /** The Runtime the Build used to generate the output */
  use?: string;
  /** An object that contains the Build's configuration */
  config?: {
    distDir?: string;
    forceBuildIn?: string;
    reuseWorkPathFrom?: string;
    zeroConfig?: boolean;
  };
  /** A list of outputs for the Build that can be either Serverless Functions or static files */
  output: {
    /** The type of the output */
    type?: 'lambda' | 'file' | 'edge';
    /** The absolute path of the file or Serverless Function */
    path: string;
    /** The SHA1 of the file */
    digest: string;
    /** The POSIX file permissions */
    mode: number;
    /** The size of the file in bytes */
    size?: number;
    /** If the output is a Serverless Function, an object containing the name, location and memory size of the function */
    lambda?: {
      functionName: string;
      deployedTo: string[];
      memorySize?: number;
      timeout?: number;
      layers?: string[];
    } | null;
  }[];
  /** If the Build uses the `@vercel/static` Runtime, it contains a hashed string of all outputs */
  fingerprint?: string | null;
  copiedFrom?: string;
}

interface BuildResponse {
  builds: Build[];
}
