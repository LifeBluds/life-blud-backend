# Contributing to LifeBluds

To maintain a streamlined workflow and high-quality code, please follow these guidelines.

## Workflow for Contributors

### Step 1: Fork the Repository

1. Navigate to the original repository on GitHub.
2. Click the "Fork" button at the top-right corner of the page.
3. This will create a copy of the repository under your own GitHub account.
4. **Important**: The default branch in your forked repository will be `dev`.

### Step 2: Clone Your Fork

1. Clone your forked repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-forked-repo.git
   cd your-forked-repo
   ```

2. By default, the `dev` branch should be checked out. Confirm this by running:
   ```bash
   git branch
   ```
   You should see `* dev` indicating that `dev` is the current branch.

### Step 3: Set Upstream Remote

1. Add the original repository as an upstream remote to keep your fork up to date:
   ```bash
   git remote add upstream https://github.com/LifeBluds/life-blud-backend.git
   ```

### Step 4: Create a Feature Branch

1. Create a new branch for your feature or bug fix from the `dev` branch:
   ```bash
   git checkout -b feature-branch-name
   ```

### Step 5: Make Your Changes

1. Open Vscode and make the necessary changes in your feature branch.
2. Stage and commit your changes:
   ```bash
   git add .
   git commit -m "Detailed description of the changes"
   ```

### Step 6: Fetch and Merge Updates from Upstream `dev`

1. Before pushing your changes, ensure your local `dev` branch is up-to-date with the latest changes from the upstream repository:

   ```bash
   git checkout dev
   git fetch upstream
   git merge upstream/dev
   ```

2. If there are any merge conflicts, resolve them in vscode and commit the changes:

   ```bash
   git add .
   git commit -m "Resolve merge conflicts"
   ```

3. Rebase your feature branch onto the updated `dev` branch:
   ```bash
   git checkout feature-branch-name
   git rebase dev
   ```

### Step 7: Push Your Changes

1. Push your feature branch to your forked repository:
   ```bash
   git push origin feature-branch-name
   ```

### Step 8: Create a Pull Request

1. Go to your forked repository on GitHub.
2. Click the "Compare & pull request" button next to your feature branch.
3. Ensure that the base repository is the original repository and the base branch is `dev`.
4. Provide a clear and descriptive title and description for your pull request.
5. Click "Create pull request".

### Step 9: Address Feedback

1. Your pull request will be reviewed by the repository maintainers.
2. Make any necessary changes as requested by reviewers.
3. After the changes follow the same steps to push additional commits to your feature branch as needed:
   ```bash
   git add .
   git commit -m "Address review feedback"
   git push origin feature-branch-name
   ```

## Contact

If you have any questions or need further assistance, please open an issue in the repository.
