const { Toolkit } = require('actions-toolkit');

// Run your GitHub Action!
Toolkit.run(
  async tools => {
    const repo = await tools.github.repos.get(tools.context.repo);
    const defaultBranch = repo.data.default_branch;
    tools.log.info(defaultBranch, tools.context.ref);
    if (`refs/heads/${defaultBranch}` !== tools.context.ref)
      tools.exit.neutral('This is not the default branch.');

    const pkg = tools.getPackageJSON();
    const oldPkg = JSON.parse(
      await tools.github.repos.getContents({
        ...tools.context.repo,
        ref: tools.context.payload.before,
        path: 'package.json',
      }),
    );
    tools.log.info('Current package.json', pkg);
    tools.log.info('old one', oldPkg);
    if (
      Object.is(pkg.dependencies, oldPkg.dependencies) &&
      Object.is(oldPkg.devDependencies, oldPkg.dependencies)
    )
      tools.exit.neutral('No changes to package.json');

    tools.exit.success('Package.json dependencies have been changed');
  },
  { event: 'push' },
);
