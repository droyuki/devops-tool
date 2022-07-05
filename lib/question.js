const inquirer = require('inquirer');

const createQuestion = (q) => inquirer.prompt(q);

const getGitAction = async (type) => {
  const { gitAction } = await createQuestion({
    name: 'gitAction',
    type: 'list',
    message: 'What do you want?',
    choices: [
      'create tag',
      'delete tag',
      'create branch',
      'delete branch',
      // 'merge',
    ],
  });

  const { tag } = ['create tag', 'delete tag'].includes(gitAction)
    ? await createQuestion({
        name: 'tag',
        type: 'input',
      })
    : {};

  const { branch } = ['create branch', 'delete branch'].includes(
    gitAction
  )
    ? await createQuestion({
        name: 'branch',
        type: 'input',
        message: 'branch',
      })
    : {};

  const { ref } = [
    'create tag',
    'create branch',
    'merge',
    'protect',
    'unprotect',
  ].includes(gitAction)
    ? await createQuestion({
        name: 'ref',
        type: 'input',
        message:
          type === 'azure'
            ? 'ref (heads/features, tags/MCB_V22.4.1):'
            : 'ref (features, MCB_v22.4.1)',
      })
    : {};

  return {
    ref,
    tag,
    branch,
    gitAction,
  };
};

const selectProject = (projects) =>
  createQuestion({
    name: 'projects',
    type: 'checkbox',
    message: 'Which project?',
    choices: projects.map((p) => `${p}`),
    validate: (answers) =>
      !!answers.length || 'Are you kidding me? Pick one!',
  });

module.exports = {
  getGitAction,
  selectProject,
};
