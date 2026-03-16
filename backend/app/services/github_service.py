import logging
import re
import time
from typing import Any

from github import Github
from github.GithubException import GithubException

from app.config import settings

logger = logging.getLogger(__name__)

COMPONENT_DIR = "apps/project-flow/src/components/ai-generated"
TARGET_FILE = f"{COMPONENT_DIR}/Hero.tsx"

# Map component name (from Nemotron payload keys) to repo path
COMPONENT_FILES: dict[str, str] = {
    "hero": f"{COMPONENT_DIR}/Hero.tsx",
    "stats": f"{COMPONENT_DIR}/Stats.tsx",
    "features": f"{COMPONENT_DIR}/Features.tsx",
    "courses": f"{COMPONENT_DIR}/Courses.tsx",
    "pricing": f"{COMPONENT_DIR}/Pricing.tsx",
    "cta": f"{COMPONENT_DIR}/CTA.tsx",
}


def _sanitize_branch_name(timestamp: str) -> str:
    """Replace invalid chars for git branch (e.g. colons)."""
    s = re.sub(r"[^\w\-.]", "-", timestamp)
    return s.strip("-") or "agent-update"


def create_branch_commit_pr(
    action_id: str,
    payload: str,
    timestamp: str,
    reasoning: str,
) -> dict[str, Any]:
    """
    Create branch agent-update-<timestamp>, commit payload to TARGET_FILE, open PR.
    Returns dict with pr_url, branch, pr_number.
    """
    if not settings.github_token or not settings.github_repo:
        raise ValueError("GITHUB_TOKEN and GITHUB_REPO must be set")

    gh = Github(settings.github_token)
    repo = gh.get_repo(settings.github_repo)
    default_branch = repo.default_branch
    base_sha = repo.get_branch(default_branch).commit.sha

    branch_suffix = _sanitize_branch_name(timestamp)
    branch_name = f"agent-update-{branch_suffix}"

    repo.create_git_ref(f"refs/heads/{branch_name}", base_sha)

    try:
        existing = repo.get_contents(TARGET_FILE, ref=branch_name)
        repo.update_file(
            TARGET_FILE,
            f"Agent update: {action_id}",
            payload,
            existing.sha,
            branch=branch_name,
        )
    except GithubException as e:
        if e.status != 404:
            raise
        repo.create_file(
            TARGET_FILE,
            f"Agent update: {action_id}",
            payload,
            branch=branch_name,
        )

    pr = repo.create_pull(
        title=f"Agent update: {action_id}",
        body=f"**Reasoning:** {reasoning}\n\nAction ID: `{action_id}`",
        base=default_branch,
        head=branch_name,
    )

    return {
        "pr_url": pr.html_url,
        "branch": branch_name,
        "pr_number": pr.number,
        "pr": pr,
    }


def create_branch_commit_pr_multi(
    action_id: str,
    components: dict[str, str],
    timestamp: str,
    reasoning: str,
) -> dict[str, Any]:
    """
    Create branch, write multiple component files (hero, pricing, features), open PR.
    components: map of component name -> full TSX file content.
    Returns dict with pr_url, branch, pr_number.
    """
    if not settings.github_token or not settings.github_repo:
        raise ValueError("GITHUB_TOKEN and GITHUB_REPO must be set")
    if not components:
        raise ValueError("components must not be empty")

    gh = Github(settings.github_token)
    repo = gh.get_repo(settings.github_repo)
    default_branch = repo.default_branch
    base_sha = repo.get_branch(default_branch).commit.sha

    branch_suffix = _sanitize_branch_name(timestamp)
    branch_name = f"agent-update-{branch_suffix}"

    repo.create_git_ref(f"refs/heads/{branch_name}", base_sha)

    for comp_name, content in components.items():
        file_path = COMPONENT_FILES.get(comp_name.lower())
        if not file_path:
            logger.warning("Unknown component %s, skipping", comp_name)
            continue
        try:
            existing = repo.get_contents(file_path, ref=branch_name)
            repo.update_file(
                file_path,
                f"Agent update: {action_id} ({comp_name})",
                content,
                existing.sha,
                branch=branch_name,
            )
        except GithubException as e:
            if e.status != 404:
                raise
            repo.create_file(
                file_path,
                f"Agent update: {action_id} ({comp_name})",
                content,
                branch=branch_name,
            )

    pr = repo.create_pull(
        title=f"Agent update: {action_id}",
        body=f"**Reasoning:** {reasoning}\n\nAction ID: `{action_id}`\n\nUpdated: {', '.join(components.keys())}",
        base=default_branch,
        head=branch_name,
    )

    return {
        "pr_url": pr.html_url,
        "branch": branch_name,
        "pr_number": pr.number,
        "pr": pr,
    }


def create_personalization_pr(
    action_id: str,
    files: dict[str, str],
    timestamp: str,
    reasoning: str,
) -> dict[str, Any]:
    """
    Create branch persona-update-<timestamp>, commit arbitrary files, open PR.
    files: {full_repo_path: file_content}.
    Returns dict with pr_url, branch, pr_number, pr.
    """
    if not settings.github_token or not settings.github_repo:
        raise ValueError("GITHUB_TOKEN and GITHUB_REPO must be set")
    if not files:
        raise ValueError("files must not be empty")

    gh = Github(settings.github_token)
    repo = gh.get_repo(settings.github_repo)
    default_branch = repo.default_branch
    base_sha = repo.get_branch(default_branch).commit.sha

    branch_suffix = _sanitize_branch_name(timestamp)
    branch_name = f"persona-update-{branch_suffix}"

    repo.create_git_ref(f"refs/heads/{branch_name}", base_sha)

    for file_path, content in files.items():
        try:
            existing = repo.get_contents(file_path, ref=branch_name)
            repo.update_file(
                file_path,
                f"Personalization: {action_id} ({file_path.split('/')[-1]})",
                content,
                existing.sha,
                branch=branch_name,
            )
        except GithubException as e:
            if e.status != 404:
                raise
            repo.create_file(
                file_path,
                f"Personalization: {action_id} ({file_path.split('/')[-1]})",
                content,
                branch=branch_name,
            )

    pr = repo.create_pull(
        title=f"Personalization: {action_id}",
        body=f"**Reasoning:** {reasoning}\n\nAction ID: `{action_id}`\n\nFiles: {', '.join(files.keys())}",
        base=default_branch,
        head=branch_name,
    )

    return {
        "pr_url": pr.html_url,
        "branch": branch_name,
        "pr_number": pr.number,
        "pr": pr,
    }


def delete_files_pr(
    action_id: str,
    delete_paths: list[str],
    revert_files: dict[str, str],
    timestamp: str,
    reasoning: str,
) -> dict[str, Any]:
    """
    Create branch, delete specified files, revert others to given content, open PR.
    delete_paths: list of repo paths to delete.
    revert_files: {repo_path: content} for files to overwrite.
    """
    if not settings.github_token or not settings.github_repo:
        raise ValueError("GITHUB_TOKEN and GITHUB_REPO must be set")

    gh = Github(settings.github_token)
    repo = gh.get_repo(settings.github_repo)
    default_branch = repo.default_branch
    base_sha = repo.get_branch(default_branch).commit.sha

    branch_suffix = _sanitize_branch_name(timestamp)
    branch_name = f"persona-reset-{branch_suffix}"

    repo.create_git_ref(f"refs/heads/{branch_name}", base_sha)

    for path in delete_paths:
        try:
            existing = repo.get_contents(path, ref=branch_name)
            repo.delete_file(
                path,
                f"Remove {path.split('/')[-1]}: {action_id}",
                existing.sha,
                branch=branch_name,
            )
        except GithubException as e:
            if e.status == 404:
                logger.info("File %s not found, skipping delete", path)
            else:
                raise

    for file_path, content in revert_files.items():
        try:
            existing = repo.get_contents(file_path, ref=branch_name)
            repo.update_file(
                file_path,
                f"Revert {file_path.split('/')[-1]}: {action_id}",
                content,
                existing.sha,
                branch=branch_name,
            )
        except GithubException as e:
            if e.status != 404:
                raise
            repo.create_file(
                file_path,
                f"Revert {file_path.split('/')[-1]}: {action_id}",
                content,
                branch=branch_name,
            )

    pr = repo.create_pull(
        title=f"Personalization Reset: {action_id}",
        body=f"**Reasoning:** {reasoning}\n\nAction ID: `{action_id}`",
        base=default_branch,
        head=branch_name,
    )

    return {
        "pr_url": pr.html_url,
        "branch": branch_name,
        "pr_number": pr.number,
        "pr": pr,
    }


def merge_pull_request_with_retry(
    pr_number: int,
) -> dict[str, Any]:
    """
    Merge the PR with retry on conflict/CI pending.
    Returns dict with merge_commit_sha, or merge_error on failure.
    """
    if not settings.github_token or not settings.github_repo:
        raise ValueError("GITHUB_TOKEN and GITHUB_REPO must be set")

    gh = Github(settings.github_token)
    repo = gh.get_repo(settings.github_repo)
    pr = repo.get_pull(pr_number)

    last_error = None
    for attempt in range(1, settings.merge_retry_attempts + 1):
        try:
            merge_result = pr.merge(
                commit_title=pr.title,
                commit_message=pr.body or "",
                merge_method="merge",
            )
            if merge_result.merged:
                return {"merge_commit_sha": merge_result.sha, "merged": True}
            last_error = merge_result.message or "Merge not merged"
        except GithubException as e:
            last_error = str(e.data.get("message", e))
            if e.status == 404:
                raise
            if e.status == 405:
                last_error = "Merge not allowed (e.g. branch not up to date)"
            logger.warning("Merge attempt %s failed: %s", attempt, last_error)

        if attempt < settings.merge_retry_attempts:
            time.sleep(settings.merge_retry_delay_seconds)

    return {"merged": False, "merge_error": last_error}
