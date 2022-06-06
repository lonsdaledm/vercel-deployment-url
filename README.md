# Vercel Deployment Url Action

Get the url for a deployment that is associated with a specific commit.

## Docs

### Inputs

| name                  | required | description                                                                                                                                                                                             |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `commit_hash`         | false    | The commit hash for which the deployment URL should be extracted.  Defaults to the latest commit on a branch.                                                                                           |
| `vercel_access_token` | true     | The Vercel access token to use for authentication                                                                                                                                                       |
| `vercel_team_id`      | false    | The Vercel team id to use as the context for the request. This is **required** if you want to scope your request to a team.                                                                             |
| `vercel_project_id`   | false    | The Vercel project id to use to narrow the scope of the search. This can speed up the search, but shouldn't make a significant difference unless you're going fairly far back in the deployment history |

### Outputs

| name             | description                        |
| ---------------- | ---------------------------------- |
| `deployment_url` | The full qualified url from Vercel |

## Contributing

### Commands

#### Build

Build the typescript and package it for distribution:

```bash
npm package
```

#### Test

_We currently don't have any tests in place for this action, but would love to in the future._

Run the tests :heavy_check_mark:  

```bash
npm test
```

## Changing `./action.yml`

The action.yml defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Changing the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
import * as core from '@actions/core';
...

async function run() {
  try { 
      ...
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

### Publishing

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```bash
npm run package
git add dist
git commit -a -m "prod dependencies"
git push origin releases/v1
```

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:
