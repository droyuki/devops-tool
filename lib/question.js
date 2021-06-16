const inquirer = require('inquirer');

const createQuestion = (q) => inquirer.prompt(q);

const getGitAction = async () => {
  const { gitAction } = await createQuestion({
    name: 'gitAction',
    type: 'list',
    message: 'What do you want?',
    choices: [
      'create tag',
      'delete tag',
      'protect',
      'unprotect',
      // 'merge',
    ],
  });

  const { tag } = ['create tag', 'delete tag'].includes(gitAction)
    ? await createQuestion({
        name: 'tag',
        type: 'input',
        messgae: 'new tag',
      })
    : {};

  const { ref } = [
    'create tag',
    'merge',
    'protect',
    'unprotect',
  ].includes(gitAction)
    ? await createQuestion({
        name: 'ref',
        type: 'input',
        messgae: 'git ref',
      })
    : {};

  return {
    ref,
    tag,
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
