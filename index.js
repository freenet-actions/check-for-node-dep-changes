const { Toolkit } = require('actions-toolkit');
const { decode } = require('base-64');
const { exec } = exec = require('child_process');
const equal = require('deep-equal');

// Run your GitHub Action!
Toolkit.run(
  async tools => {
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
    let dependenciesChanged = false;
    let devDependenciesChanged = false;

    tools.log.info('Current package.json', pkg);
    tools.log.info('old package.json', oldPkg);

    if (!equal(pkg.dependencies, oldPkg.dependencies, { strict: true })) {
      console.log('Changed prod dependencies.');
      dependenciesChanged = true;
    }

    if (!equal(pkg.devDependencies, oldPkg.devDependencies, { strict: true })) {
      console.log('Changed dev dependencies');
      devDependenciesChanged = true;
    }
    exec(`echo "normal_dependencies_changed=${dependenciesChanged}" >> $GITHUB_OUTPUT`);
    exec(`echo "dev_dependencies_changed=${devDependenciesChanged}" >> $GITHUB_OUTPUT`)

    return;
  },
  { event: 'push' },
);
 