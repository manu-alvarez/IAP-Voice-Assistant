# GitHub Secrets Required for CI/CD

## Required Secrets

| Secret | Description | Example |
|--------|-------------|---------|
| `VPS_HOST` | IP address or hostname of the VPS | `51.91.108.173` |
| `VPS_USER` | SSH user for deployment | `ubuntu` |
| `VPS_SSH_KEY` | Private SSH key for authentication | `-----BEGIN RSA PRIVATE KEY-----...` |

## How to Configure

### Step 1: Generate SSH Key (if not exists)

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_livekit
```

### Step 2: Add Public Key to VPS

```bash
ssh-copy-id -i ~/.ssh/github_actions_livekit.pub ubuntu@51.91.108.173
```

Or manually:
```bash
cat ~/.ssh/github_actions_livekit.pub | ssh ubuntu@51.91.108.173 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:

#### VPS_HOST
- Name: `VPS_HOST`
- Value: `51.91.108.173`

#### VPS_USER
- Name: `VPS_USER`
- Value: `ubuntu`

#### VPS_SSH_KEY
- Name: `VPS_SSH_KEY`
- Value: Content of your private key file
  ```bash
  cat ~/.ssh/github_actions_livekit
  ```
  Copy the entire output including `-----BEGIN` and `-----END` lines

### Step 4: Verify

Test SSH connection locally:
```bash
ssh -i ~/.ssh/github_actions_livekit ubuntu@51.91.108.173 "echo 'Connection successful'"
```

## Optional: GitHub Token

If you need to push to other repositories or use the GitHub API:

| Secret | Description |
|--------|-------------|
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions |

## Security Notes

- Never commit secrets to the repository
- Rotate SSH keys periodically
- Use minimal required permissions for the SSH user
- Consider using GitHub Environments for production deployments
