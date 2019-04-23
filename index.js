const { Toolkit } = require('actions-toolkit');
const { decode } = require('base-64');
const equal = require('deep-equal');

// Run your GitHub Action!
Toolkit.run(
  async tools => {
    const repo = await tools.github.repos.get(tools.context.repo);
    const defaultBranch = repo.data.default_branch;

    if (`refs/heads/${defaultBranch}` !== tools.context.ref)
      tools.exit.neutral('This is not the default branch.');

    const pkg = tools.getPackageJSON();
    const oldPkg = JSON.parse(
      decode(
        (await tools.github.repos.getContents({
          ...tools.context.repo,
          ref: tools.context.payload.before,
          path: 'package.json',
        })).data.content,
      ),
    );
    tools.log.info('Current package.json', pkg.dependencies);
    tools.log.info('old one', oldPkg.devDependencies);

    if (!equal(pkg.dependencies, oldPkg.dependencies, { strict: true }))
      tools.exit.success('Changed prod dependencies.');

    if (!equal(pkg.devDependencies, oldPkg.devDependencies, { strict: true }))
      tools.exit.success('Changed dev dependencies');

    tools.exit.neutral('No changes');
  },
  { event: 'push' },
);
